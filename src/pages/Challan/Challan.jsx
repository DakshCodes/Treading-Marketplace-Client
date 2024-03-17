import React, { useEffect, useState } from 'react'
import DataTableModel from '../../components/DataTableModel/DataTableModel';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio, Tab, Tabs, CardBody, Card, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Autocomplete, AutocompleteItem, Textarea } from "@nextui-org/react";
import { useFormik } from 'formik'
import { Createchallan, Deletechallan, Updatechallan } from '../../apis/challan';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from "recoil"
import { globalLoaderAtom } from '../../store/GlobalLoader/globalLoaderAtom';
import { challanDataState } from '../../store/challan/challan';
import { productsDataState } from '../../store/product/productAtom';
import { cutDataState } from '../../store/cut/cutAtom';
import { suppliersDataState } from '../../store/supplier/supplierAtom';
import AutoComplete from '../../components/Autocomplete/AutoComplete';
import { customerDataState } from '../../store/customer/customerAtom';
import { IndianRupee } from 'lucide-react'
import { UploadImageChallan } from '../../apis/product';

const Challan = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate();

  const [updateId, setUpdateId] = useState(null)
  const [productref, setproductref] = useState(null)
  const [supplierRef, setsupplierRef] = useState(null)
  const [customerRef, setcustomerRef] = useState(null)
  const [qty, setqty] = useState("")
  const [remark, setRemark] = useState("")
  const [unit, setUnit] = useState("")
  const [totalbill, settotalbill] = useState(null)
  const [cutref, setcutref] = useState(null)

  const [challansData, setChallansData] = useRecoilState(challanDataState)
  const [challanNumber, setchallanNumber] = useState("")

  const [productsData, setProductsData] = useRecoilState(productsDataState)

  const [updated, setUpdated] = useState(false)

  // const products = useRecoilValue(getProductById(supplierRef));

  const [suppliersData, setSuppliersData] = useRecoilState(suppliersDataState)

  const [customerData, setcustomerData] = useRecoilState(customerDataState)


  const [cutData, setcutData] = useRecoilState(cutDataState)

  const [productChartImage, setProductChartImage] = useState('');
  const [productChartImageData, setProductChartImageData] = useState([]);


  // Data Format
  const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "CHALLAN NO.", uid: "challanNo", sortable: true },
    { name: "TYPE", uid: "type", sortable: true },
    { name: "CUSTOMER", uid: "customer", sortable: true },
    { name: "SUPPLIER", uid: "supplier", sortable: true },
    { name: "PRODUCTS", uid: "products", sortable: true },
    { name: "BILL", uid: "totalBill", sortable: true },
    { name: "VERIFIED", uid: "verified", sortable: true },
    { name: "ACTIONS", uid: "actions" },
  ];

  const statusOptions = [
    { name: "Disabled", uid: "true" },
    { name: "Active", uid: "false" },
  ];

  const INITIAL_VISIBLE_COLUMNS = ["challanNo", "customer", "type", "supplier", "products", "totalBill", "verified", "actions"];

  const [isLoading, setIsLoading] = useRecoilState(globalLoaderAtom);

  // Create The Supplier
  const creatsupplier = async (values) => {
    try {
      setIsLoading(true)
      const response = await Createchallan(values);
      setIsLoading(false)
      // dispatch(SetLoader(false));
      if (response.success) {
        toast.success(response.message);
        console.log(response.challanDoc)
        setChallansData([...challansData, response.challanDoc]);
        setUpdateId(null); // Reset update ID when modal is closed
        onOpenChange(false)
      } else {
        console.log(response.response.data.error);
        toast.error(response.response.data.error);
        // throw new Error(response.error);
      }
    } catch (error) {
      // dispatch(SetLoader(false));
      setIsLoading(false)
      console.log(error.message);
      toast.error(error.message);
    }
  }



  // Delete Supplier
  const deleteItem = async (id) => {
    try {
      setIsLoading(true)
      const response = await Deletechallan(id);
      setIsLoading(false)
      if (response.success) {
        toast.success(response.message);

        // Update local state based on the correct identifier (use _id instead of id)
        setChallansData((prevData) => prevData.filter((supplier) => supplier._id !== id));

      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setIsLoading(false)
      toast.error(error.message)
    }
  }



  // Handle update form submission
  const handleUpdateSubmit = async (values) => {
    try {
      setIsLoading(true)
      const response = await Updatechallan(updateId, values);
      setIsLoading(false)
      if (response.success) {
        toast.success(response.message);

        // setChallansData((prevData) => {
        //   const updatedSuppliers = prevData.map((supplier) => {
        //     // console.log(supplier._id === updateId ? response.supplier : supplier)
        //     return supplier._id === updateId ? response.challan : supplier
        //   }
        //   );
        //   return updatedSuppliers;
        // });
        // Optimistically update UI
        const updatedsuppliers = challansData.map((supplier) =>
          supplier._id === updateId ? response.challan : supplier
        );

        setChallansData(updatedsuppliers);

        formik.resetForm();


        onOpenChange(false);
        setUpdateId(null);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setIsLoading(false)
      console.error("Error updating supplier:", error.message);
      toast.error(error.message);
    }
  };




  const formik = useFormik({
    initialValues: {
      challanNo: '',
      challanDate: null,
      totalBill: '',
      customer: '',
      type: 'supplier',
      supplier: '',
      products: [],
      verified: true,
    },
    onSubmit: async values => {
      if (updateId) {
        setIsLoading(true)
        console.log(values, "update")
        generateToatl()
        await handleUpdateSubmit(values);
        setIsLoading(false)
      } else {
        values.challanNo = challanNumber;
        console.log(values, "going")
        generateToatl()
        setIsLoading(true)
        await creatsupplier(values);
        setIsLoading(false)
      }
    },
  });

  const updateFormWithsupplierData = (supplierId, updatedsupplierData) => {
    const mySupplierData = updatedsupplierData.find((element) => element._id === supplierId);
    console.log(mySupplierData, updatedsupplierData, 'existssssssssssssssssssssss');

    formik.setValues({
      challanNo: mySupplierData?.challanNo,
      challanDate: mySupplierData?.challanDate,
      totalBill: mySupplierData?.totalBill,
      customer: mySupplierData?.customer,
      products: mySupplierData?.products.map((product) => ({
        cut: product.cut,
        overall: product.overall,
        price: product.price,
        product: product.product,
        unit: product.unit,
        challanChartImages: product.challanChartImages,
        qtyMtr: product.qtyMtr,
        qtyPcs: product.qtyPcs,
        remarkDesc: product.remarkDesc,
        total: product.total,
      })),
      supplier: mySupplierData?.supplier,
      type: mySupplierData?.type,
      verified: mySupplierData?.verified,
    });

    setsupplierRef(mySupplierData?.supplier)
    settotalbill(mySupplierData?.totalBill)
    setRemark(mySupplierData?.remarkDesc)
  };


  const handleUpdate = async (supplierId) => {
    try {
      console.log(supplierId, "id")
      updateFormWithsupplierData(supplierId, challansData);

      setUpdateId(supplierId)
      onOpen();
    } catch (error) {
      console.error("Error updating supplier:", error.message);
      toast.error(error.message);
    }
  };

  // console.log(formik?.values?.supplier, "Supplir -----------------------------------------------------------------------")

  const addProductToTable = () => {
    if (productref && cutref && unit) {
      let qtyMeter;
      const pricePerPiece = productsData?.filter(item => item?._id === productref)[0]?.pricePerUnit?.magnitude;
      const cutvalue = cutData.find(cut => cut._id === cutref)
      if (cutvalue?.isNameNumerical) {
        qtyMeter = Math.floor(qty * parseFloat(cutvalue?.name));
      }
      let overall = 0;
      const price = parseFloat(pricePerPiece);
      console.log(unit)
      if (unit === '1') {
        console.log("in")
        overall = isNaN(price) ? 0 : Math.floor(qty * price);
      }
      if (unit === '2') {
        console.log("in")
        overall = isNaN(price) ? 0 : Math.floor(qtyMeter * price);
      }

      const newProduct = { product: productref, cut: cutref, qtyPcs: qty, qtyMtr: qtyMeter, challanChartImages: productChartImageData, price: pricePerPiece || 0, unit: unit, overall: overall, remarkDesc: remark };
      formik.setValues(prevValues => ({
        ...prevValues,
        products: [...(prevValues?.products || []), newProduct] // Ensure products is initialized as an array
      }));
      setproductref("")
      setProductChartImageData([])
      setProductChartImage("")
      setcutref("")
      setUnit("")
      setqty("")
      setRemark("")
    } else {
      // toast.error("Please select all fields");
    }
  };

  const handleQtyChange = (index, value) => {
    formik.setValues((prevValues) => {
      const updatedProducts = [...prevValues.products];
      const product = { ...updatedProducts[index], price: value };
      let overallprice = product.overall;
      if (product.unit === "1") {
        const price = parseFloat(product.price);
        console.log(price)
        console.log(product.qtyPcs)
        overallprice = parseFloat(product.qtyPcs) * parseFloat(price);
      }
      if (product.unit === "2") {
        const price = parseFloat(product.price);
        overallprice = parseFloat(product.qtyMtr) * price;
      }
      updatedProducts[index] = { ...product, overall: overallprice };
      return { ...prevValues, products: updatedProducts };
    });
  };
  const handleQtyMeterChange = (index, value) => {
    console.log(value, "metervalue...........................")
    formik.setValues((prevValues) => {
      const updatedProducts = [...prevValues.products];
      const product = { ...updatedProducts[index], qtyMtr: value };

      console.log(product)

      let overallprice = product.overall;
      if (product.unit === "2") {
        const price = parseFloat(product.price);
        overallprice = parseFloat(product.qtyMtr) * price;
      }
      updatedProducts[index] = { ...product, overall: overallprice };
      return { ...prevValues, products: updatedProducts };
    });
  };



  const onSupplierChange = (value) => {
    setsupplierRef(value)
    formik.setValues((prevValues) => {
      return { ...prevValues, supplier: value };
    });
  };
  const onCustomerChange = (value) => {
    setcustomerRef(value)
    formik.setValues((prevValues) => {
      return { ...prevValues, customer: value };
    });
  };

  const removeAttributeFromTable = (index) => {
    formik.setValues((prevValues) => {
      const updatedProducts = [...prevValues.products];
      updatedProducts.splice(index, 1);
      return { ...prevValues, products: updatedProducts };
    });
  };
  const generateToatl = () => {

    // Accessing products from formik values
    const products = formik.values.products;

    if (products?.length > 0) {
      // Calculating the total bill
      const totalBill = products.reduce((acc, product) => {
        return acc + product.overall;
      }, 0);

      // Setting the total bill
      settotalbill(totalBill);
      formik.setFieldValue('totalBill', totalBill);
    }
    else {
      settotalbill(0);
      formik.setFieldValue('totalBill', 0);
    }
  };

  const handleProductChartImageChange = (e) => {
    setProductChartImage(e.target.files[0]);
    console.log(e.target.files[0])
  };

  const uploadImage = async (e) => {
    try {
      const formData = new FormData();
      let imageFile = productChartImage;
      console.log("inside productChartImage")

      if (imageFile) {
        formData.append("color-chart-challan", imageFile);
        const response = await UploadImageChallan(formData);

        if (response.success) {
          toast.success(response.message);
          const newImageLink = response.url;
          setProductChartImageData((prevImages) => [...prevImages, { src: newImageLink }]);
          setProductChartImage('');
        } else {
          toast.error(response.message);
        }
      } else {
        toast.error('Please select an image file.');
      }

    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };


  useEffect(() => {
    if (challansData.length === 0) {
      setchallanNumber('1');
    } else {
      // Extract the last element's challanNumber
      const lastChallanNumber = challansData[challansData.length - 1].challanNo;
      // console.log(lastChallanNumber, "last")
      // Increment the last challanNumber and set it
      const newChallanNumber = (parseInt(lastChallanNumber) + 1).toString();
      // console.log(newChallanNumber, "challan")
      setchallanNumber(newChallanNumber);
    }
  }, [onOpenChange, challansData]);



  // console.log(formik.values, "values")
  // console.log(supplierRef, "supplier")
  // console.log("product: ", productsData)
  console.log("data ", challansData)
  // console.log("cut: ", unit)
  // console.log("productChartImageData: ", productChartImageData)
  // console.log("challan: ", totalbill)
  // const datePart = new Date(yourArray.challanDate)

  // const currentDate = new Date().toISOString().split('T')[0];
  // console.log(formik.values.challanDate.split('T')[0], "date")
  // console.log(currentDate, "current-date")

  const Units = [
    { name: "Pcs", _id: 1 },
    { name: "Meter", _id: 2 },
  ]

  return (
    <>
      <div className="flex flex-col gap-2 py-4">
        <Modal
          isOpen={isOpen}
          scrollBehavior={"inside"}
          size={"full"}
          className="!mx-20 !rounded-xl"
          onOpenChange={(newState) => {
            onOpenChange(newState);
            if (!newState) {
              formik.resetForm();
              setUpdateId("")
              setRemark("");
              settotalbill("");
            }
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-2xl font-bold font-font2  mb-3">{updateId ? "Update Challan" : "Create Challan"}</ModalHeader>

                <ModalBody className='flex flex-col gap-6'>
                  <div className="flex flex-col w-full">
                    <h1 className='font-[600] font-font1 m-auto text-[1rem] mb-5'>Select The Type Of Challan !</h1>
                    <Card className="max-w-full max-h-full">
                      <CardBody className="overflow-hidden">
                        <Tabs
                          fullWidth
                          size="lg"
                          aria-label="Tabs form"
                        >
                          <Tab key="Supplier"
                            className="py-6 flex flex-col  gap-10 font-[400] font-font2"
                            title="Supplier"
                          >
                            <div className='flex  gap-5 mt-5 flex-col'>
                              <Input size={'md'}
                                classNames={{
                                  label: "font-[600] font-font1",
                                  input: "font-[500] font-font1",
                                }}
                                className="flex-grow max-w-[18rem] bg-[#000]"
                                labelPlacement="outside"
                                type="text" label="Challan No."
                                placeholder={formik.values.challanNo && formik.values.challanNo || "Generate after Creation "}
                                disabled={true}
                                // value={challanNumber}
                                variant="flat"
                              />
                              <Input
                                type="date"
                                labelPlacement="outside-left"
                                label="Date"
                                classNames={{
                                  label: "font-[600] font-font1",
                                  input: "font-[500] font-font1",
                                  // inputWrapper: "max-h-[50px]"
                                }}
                                value={formik?.values?.challanDate?.split('T')[0]}
                                onChange={(e) => formik.setFieldValue('challanDate', e.target.value)}
                                // Use the date string directly
                                // {...formik.getFieldProps('challanDate')}
                                className=" max-w-[15rem] mt-5"
                              />

                              <div className='flex items-center gap-10 mt-5'>
                                <Autocomplete
                                  labelPlacement="outside"
                                  label="Customer Name"
                                  classNames={{
                                    base: "max-w-[18rem] border-[#fff] ",

                                    listboxWrapper: "max-h-[270px]",
                                    selectorButton: "text-[#000]",
                                  }}

                                  onSelectionChange={onCustomerChange}
                                  value={formik?.values?.customer}
                                  defaultItems={customerData}
                                  selectedKey={formik?.values?.customer}
                                  inputProps={{
                                    classNames: {
                                      input: "ml-1 text-[#000] font-font1",
                                      inputWrapper: "h-[20px]",
                                      label: "font-[600] font-font1",
                                    },
                                  }}
                                  listboxProps={{
                                    hideSelectedIcon: true,
                                    itemClasses: {
                                      base: [
                                        "rounded-medium",
                                        "text-[#000]",
                                        "transition-opacity",
                                        "data-[hover=true]:text-foreground",
                                        "dark:data-[hover=true]:bg-default-50",
                                        "data-[pressed=true]:opacity-70",
                                        "data-[hover=true]:bg-default-200",
                                        "data-[selectable=true]:focus:bg-default-100",
                                        "data-[focus-visible=true]:ring-default-500",
                                      ],
                                    },
                                  }}
                                  aria-label="Select an Customer "
                                  placeholder="Enter an Customer "
                                  popoverProps={{
                                    offset: 10,
                                    classNames: {
                                      base: "rounded-large",
                                      content: "p-1  border-none bg-background",

                                    },
                                  }}
                                  startContent={<svg
                                    aria-hidden="true"
                                    fill="none"
                                    focusable="false"
                                    height={20}
                                    role="presentation"
                                    viewBox="0 0 24 24"
                                    width={20}
                                    color={"#000"}
                                  >
                                    <path
                                      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2.5}
                                    />
                                    <path
                                      d="M22 22L20 20"
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2.5}
                                    />
                                  </svg>}

                                  variant="flat"
                                >
                                  {(item) => (
                                    <AutocompleteItem key={item?._id} textValue={item?.name}>
                                      <div className="flex justify-between items-center">
                                        <div className="flex gap-2 items-center">
                                          <div className="flex flex-col">
                                            <span className="text-small">{item?.name}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </AutocompleteItem>
                                  )}
                                </Autocomplete>
                                <Autocomplete
                                  labelPlacement="outside"
                                  label="Supplier Name"
                                  classNames={{
                                    base: "max-w-[18rem] border-[#fff] ",

                                    listboxWrapper: "max-h-[270px]",
                                    selectorButton: "text-[#000]",
                                  }}

                                  onSelectionChange={onSupplierChange}
                                  value={formik?.values?.supplier}
                                  defaultItems={suppliersData}
                                  selectedKey={formik?.values?.supplier}
                                  inputProps={{
                                    classNames: {
                                      input: "ml-1 text-[#000] font-font1",
                                      inputWrapper: "h-[20px]",
                                      label: "font-[600] font-font1",
                                    },
                                  }}
                                  listboxProps={{
                                    hideSelectedIcon: true,
                                    itemClasses: {
                                      base: [
                                        "rounded-medium",
                                        "text-[#000]",
                                        "transition-opacity",
                                        "data-[hover=true]:text-foreground",
                                        "dark:data-[hover=true]:bg-default-50",
                                        "data-[pressed=true]:opacity-70",
                                        "data-[hover=true]:bg-default-200",
                                        "data-[selectable=true]:focus:bg-default-100",
                                        "data-[focus-visible=true]:ring-default-500",
                                      ],
                                    },
                                  }}
                                  aria-label="Select an Supplier"
                                  placeholder="Enter an Supplier"
                                  popoverProps={{
                                    offset: 10,
                                    classNames: {
                                      base: "rounded-large",
                                      content: "p-1  border-none bg-background",

                                    },
                                  }}
                                  startContent={<svg
                                    aria-hidden="true"
                                    fill="none"
                                    focusable="false"
                                    height={20}
                                    role="presentation"
                                    viewBox="0 0 24 24"
                                    width={20}
                                    color={"#000"}
                                  >
                                    <path
                                      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2.5}
                                    />
                                    <path
                                      d="M22 22L20 20"
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2.5}
                                    />
                                  </svg>}

                                  variant="flat"
                                >
                                  {(item) => (
                                    <AutocompleteItem key={item?._id} textValue={item?.name}>
                                      <div className="flex justify-between items-center">
                                        <div className="flex gap-2 items-center">
                                          <div className="flex flex-col">
                                            <span className="text-small">{item?.name}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </AutocompleteItem>
                                  )}
                                </Autocomplete>
                              </div>
                            </div>
                            <div className="img-form flex flex-col gap-5 mt-5">
                              <h1 className='font-font1 font-[600] mx-auto'>Add Challan Products.</h1>
                              <div className='grid grid-cols-4 gap-5 mt-4 w-full' >
                                <Autocomplete
                                  labelPlacement="outside"
                                  label="Product Name"

                                  classNames={{
                                    base: "max-w-full border-[#fff] ",
                                    listboxWrapper: "max-h-[270px]",
                                    selectorButton: "text-[#000]",
                                  }}

                                  onSelectionChange={setproductref}
                                  value={productref}
                                  items={(supplierRef && productsData?.filter(product => product?.supplierName?._id === supplierRef) || [])}
                                  selectedKey={productref}
                                  inputProps={{
                                    classNames: {
                                      input: "ml-1 text-[#000] font-font1",
                                      inputWrapper: "h-[20px]",
                                      label: "font-[600] font-font1",
                                    },
                                  }}
                                  listboxProps={{
                                    hideSelectedIcon: true,
                                    itemClasses: {
                                      base: [
                                        "rounded-medium",
                                        "text-[#000]",
                                        "transition-opacity",
                                        "data-[hover=true]:text-foreground",
                                        "dark:data-[hover=true]:bg-default-50",
                                        "data-[pressed=true]:opacity-70",
                                        "data-[hover=true]:bg-default-200",
                                        "data-[selectable=true]:focus:bg-default-100",
                                        "data-[focus-visible=true]:ring-default-500",
                                      ],
                                    },
                                  }}
                                  aria-label="Select an Product"
                                  placeholder="Enter an Product"
                                  popoverProps={{
                                    offset: 10,
                                    classNames: {
                                      base: "rounded-large",
                                      content: "p-1  border-none bg-background",

                                    },
                                  }}
                                  startContent={<svg
                                    aria-hidden="true"
                                    fill="none"
                                    focusable="false"
                                    height={20}
                                    role="presentation"
                                    viewBox="0 0 24 24"
                                    width={20}
                                    color={"#000"}
                                  >
                                    <path
                                      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2.5}
                                    />
                                    <path
                                      d="M22 22L20 20"
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2.5}
                                    />
                                  </svg>}
                                  variant="flat"
                                >
                                  {(item) => (
                                    <AutocompleteItem key={item?._id} textValue={item?.productName}>
                                      <div className="flex justify-between items-center">
                                        <div className="flex gap-2 items-center">
                                          <div className="flex flex-col">
                                            <span className="text-small">{item?.productName}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </AutocompleteItem>
                                  )}
                                </Autocomplete>
                                <Autocomplete
                                  classNames={{
                                    base: "max-w-full border-[#fff] ",
                                    listboxWrapper: "max-h-[270px]",
                                    selectorButton: "text-[#000]",
                                  }}
                                  labelPlacement="outside"
                                  label="Cut Name"

                                  onSelectionChange={setcutref}
                                  value={cutref}
                                  defaultItems={cutData}
                                  // items={(productref && cutData?.filter(cut => cut?.ref === productref) || [] )}
                                  selectedKey={cutref}
                                  inputProps={{
                                    classNames: {
                                      input: "ml-1 text-[#000] font-font1",
                                      inputWrapper: "h-[20px]",
                                      label: "font-[600] font-font1",
                                    },
                                  }}
                                  listboxProps={{
                                    hideSelectedIcon: true,
                                    itemClasses: {
                                      base: [
                                        "rounded-medium",
                                        "text-[#000]",
                                        "transition-opacity",
                                        "data-[hover=true]:text-foreground",
                                        "dark:data-[hover=true]:bg-default-50",
                                        "data-[pressed=true]:opacity-70",
                                        "data-[hover=true]:bg-default-200",
                                        "data-[selectable=true]:focus:bg-default-100",
                                        "data-[focus-visible=true]:ring-default-500",
                                      ],
                                    },
                                  }}
                                  aria-label="Select an Cut"
                                  placeholder="Enter an Cut"
                                  popoverProps={{
                                    offset: 10,
                                    classNames: {
                                      base: "rounded-large",
                                      content: "p-1  border-none bg-background",

                                    },
                                  }}
                                  startContent={<svg
                                    aria-hidden="true"
                                    fill="none"
                                    focusable="false"
                                    height={20}
                                    role="presentation"
                                    viewBox="0 0 24 24"
                                    width={20}
                                    color={"#000"}
                                  >
                                    <path
                                      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2.5}
                                    />
                                    <path
                                      d="M22 22L20 20"
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2.5}
                                    />
                                  </svg>}
                                  variant="flat"
                                >
                                  {(item) => (
                                    <AutocompleteItem key={item?._id} textValue={item?.name}>
                                      <div className="flex justify-between items-center">
                                        <div className="flex gap-2 items-center">
                                          <div className="flex flex-col">
                                            <span className="text-small">{item?.name}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </AutocompleteItem>
                                  )}
                                </Autocomplete>
                                <Input
                                  label="Product Qty"
                                  classNames={{
                                    label: "font-[600] font-font1",
                                    input: "font-[500] font-font1",
                                  }}
                                  labelPlacement="outside"
                                  type="number"
                                  endContent={<p className='font-[500] font-font1 text-[0.9rem]'>pieces</p>}
                                  placeholder="0"
                                  value={qty}
                                  className='max-w-[18rem]'
                                  onChange={(e) => setqty(e.target.value)}
                                />
                                <AutoComplete
                                  labelPlacement="outside"
                                  label="Unit"
                                  placeholder={"Unit"}
                                  users={Units}
                                  selectedKey={unit}
                                  selectionChange={(value) => setUnit(value)}
                                />
                              </div>
                              <div className='flex items-center justify-between w-full gap-10 mt-3 '>
                                <Textarea
                                  variant="flat"
                                  placeholder="Enter your remarks"
                                  className="font-[600] flex-grow   font-font1 max-w-[20rem]"
                                  value={remark}
                                  onValueChange={setRemark}
                                />
                                <div className='flex gap-10  max-w-max items-center flex-grow'>
                                  <input
                                    type="file"
                                    onChange={(e) => handleProductChartImageChange(e)}
                                    className="hidden"
                                    id="bannerImageInput"
                                    name="banner_image"
                                  />
                                  <div className='flex gap-2  col-span-5 max-w-[15rem]'>
                                    <label htmlFor="bannerImageInput" className="font-[600] px-5 py-2 font-font1 text-[0.8rem] max-w-fit flex items-center justify-center text-center rounded-lg border border-black cursor-pointer">
                                      Select chart Image ({productChartImage?.name})
                                    </label>
                                  </div>
                                  <div className='flex gap-2'>
                                    <Button onClick={(e) => uploadImage(e)} isLoading={false} className="font-sans ml-auto col-span-1 text-[#fff] bg-[#000] font-medium"  >
                                      Upload
                                    </Button>
                                  </div>
                                </div>
                                <p className='text-[0.8rem] font-font1 font-[600]'>All Images</p>
                                <div className="grid border  grid-cols-4 overflow-y-auto p-2 flex-grow  max-w-[35rem]">
                                  {
                                    productChartImageData?.length > 0 ? (
                                      productChartImageData?.map(productChartImage =>
                                        <a href='#' key={productChartImage?.src}>
                                          <img className='h-20 w-20 object-cover' src={productChartImage?.src} alt={productChartImage} />
                                        </a>
                                      )
                                    ) : (
                                      <div>No Images</div>
                                    )
                                  }
                                </div>
                              </div>
                              <Button
                                // isLoading={loading}
                                className="font-font1 max-w-[13rem] w-full m-auto text-[#fff] bg-[#000] font-medium "
                                onClick={addProductToTable}
                              >
                                Add
                              </Button>
                            </div>
                            <Table
                              classNames={{
                                base: 'max-h-[300px]  max-w-[1400px] border rounded-[14px] overflow-scroll',
                                table: 'min-h-[150px]  ',
                                th: 'text-center',
                                tr: 'text-center ',
                                td: 'font-font1 font-[600]',
                              }}
                              aria-label="Attribute Values Table"
                            >
                              <TableHeader>
                                <TableColumn>PRODUCT</TableColumn>
                                <TableColumn>CUT</TableColumn>
                                <TableColumn>QTY(Pcs)</TableColumn>
                                <TableColumn>QTY(Mtr)</TableColumn>
                                <TableColumn>PRICE</TableColumn>
                                <TableColumn>UNIT</TableColumn>
                                <TableColumn>OVERALL</TableColumn>
                                <TableColumn>REMARK</TableColumn>
                                <TableColumn>ACTIONS</TableColumn>
                              </TableHeader>
                              <TableBody>
                                {formik.values?.products?.map((object, index) => {
                                  return (
                                    <TableRow key={index}>
                                      <TableCell>
                                        {productsData.find(product => product._id === object.product)?.productName}
                                      </TableCell>
                                      <TableCell>
                                        {cutData.find(product => product._id === object.cut)?.name}
                                      </TableCell>
                                      <TableCell>
                                        {object.qtyPcs}
                                      </TableCell>
                                      <TableCell>
                                        <Input
                                          type="number"
                                          placeholder={object.qtyMtr}
                                          value={object.qtyMtr}
                                          className="min-w-[5rem] w-fit m-auto"
                                          classNames={{
                                            input: "ml-1 text-[#000] font-font1",
                                            inputWrapper: "h-[5px] min-w-[5rem] w-[1rem]",
                                            label: "font-[600] font-font1",
                                          }}
                                          onChange={(e) => handleQtyMeterChange(index, e.target.value)}
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <Input
                                          type="number"
                                          placeholder={object.price}
                                          value={object.price}
                                          className="min-w-[5rem] w-fit m-auto"
                                          classNames={{
                                            input: "ml-1 text-[#000] font-font1",
                                            inputWrapper: "h-[5px] min-w-[5rem] w-[1rem]",
                                            label: "font-[600] font-font1",
                                          }}
                                          onChange={(e) => handleQtyChange(index, e.target.value)}
                                        />
                                      </TableCell>
                                      <TableCell>
                                        {Units[object.unit - 1].name}
                                      </TableCell>
                                      <TableCell>
                                        {object.overall}
                                      </TableCell>
                                      <TableCell className='overflow-hidden'>
                                        {object?.remarkDesc || "nothing"}
                                      </TableCell>
                                      <TableCell >
                                        <span
                                          className=" text-lg  text-danger cursor-pointer active:opacity-50"
                                          onClick={() => removeAttributeFromTable(index)}
                                        >
                                          <svg
                                            aria-hidden="true"
                                            fill="none"
                                            focusable="false"
                                            height="1em"
                                            role="presentation"
                                            viewBox="0 0 20 20"
                                            width="1em"
                                          >
                                            <path
                                              d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332"
                                              stroke="currentColor"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={1.5}
                                            />
                                            <path
                                              d="M7.08331 4.14169L7.26665 3.05002C7.39998 2.25835 7.49998 1.66669 8.90831 1.66669H11.0916C12.5 1.66669 12.6083 2.29169 12.7333 3.05835L12.9166 4.14169"
                                              stroke="currentColor"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={1.5}
                                            />
                                            <path
                                              d="M15.7084 7.61664L15.1667 16.0083C15.075 17.3166 15 18.3333 12.675 18.3333H7.32502C5.00002 18.3333 4.92502 17.3166 4.83335 16.0083L4.29169 7.61664"
                                              stroke="currentColor"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={1.5}
                                            />
                                            <path
                                              d="M8.60834 13.75H11.3833"
                                              stroke="currentColor"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={1.5}
                                            />
                                            <path
                                              d="M7.91669 10.4167H12.0834"
                                              stroke="currentColor"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={1.5}
                                            />
                                          </svg>
                                        </span>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                            <Card>
                              <CardBody className='flex flex-row px-10 justify-between items-center py-5'>
                                <div className='flex items-center gap-2'>
                                  <Button
                                    onClick={generateToatl}
                                    className='bg-[#000] text-[#fff] max-w-max '>
                                    Generate  Total
                                  </Button>
                                </div>
                                <div className='flex items-center '>
                                  <IndianRupee size={20} />
                                  <p className='font-font1 font-[500] text-[1rem]'>{totalbill || 0}.00</p>
                                </div>
                              </CardBody>
                            </Card>
                          </Tab>
                          <Tab
                            className="py-6 flex flex-col gap-10 font-[400] font-font2"
                            key="Products"
                            title="Product"
                          >
                          </Tab>
                        </Tabs>
                      </CardBody>
                    </Card>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    onClick={formik.handleSubmit} isLoading={isLoading}
                    className='bg-[#000] text-[#fff]'>
                    {updateId ? "Update" : "Create"}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
      <DataTableModel filltername={"challanNo"} visible_columns={INITIAL_VISIBLE_COLUMNS} deleteItem={deleteItem} update={handleUpdate} columns={columns} statusOptions={statusOptions} users={challansData} onOpen={onOpen} section={'supplier'} />
    </>
  )
}

export default Challan
