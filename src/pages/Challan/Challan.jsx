import React, { useEffect, useState } from 'react'
import DataTableModel from '../../components/DataTableModel/DataTableModel';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio, Tab, Tabs, CardBody, Card, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useFormik } from 'formik'
import { Createchallan, Deletechallan, Updatechallan } from '../../apis/challan';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from "recoil"
import { globalLoaderAtom } from '../../store/GlobalLoader/globalLoaderAtom';
import { challanDataState } from '../../store/challan/challan';
import { productsDataState } from '../../store/product/productAtom';
import { cutDataState } from '../../store/cut/cutAtom';
import { suppliersDataState } from '../../store/supplier/supplierAtom';

const Challan = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate();

  const [updateId, setUpdateId] = useState(null)
  const [productref, setproductref] = useState(null)
  const [supplierRef, setsupplierRef] = useState(null)
  const [qty, setqty] = useState(null)
  const [cutref, setcutref] = useState(null)

  const [challansData, setChallansData] = useRecoilState(challanDataState)

  const [productsData, setProductsData] = useRecoilState(productsDataState)

  const [suppliersData, setSuppliersData] = useRecoilState(suppliersDataState)

  const [cutData, setcutData] = useRecoilState(cutDataState)
  // console.log(suppliersData || [])

  // Data Format
  const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "NAME", uid: "name", sortable: true },
    { name: "TYPE", uid: "type", sortable: true },
    { name: "VERIFIED", uid: "verified", sortable: true },
    { name: "ACTIONS", uid: "actions" },
  ];

  const statusOptions = [
    { name: "Disabled", uid: "true" },
    { name: "Active", uid: "false" },
  ];

  const INITIAL_VISIBLE_COLUMNS = ["name", "type", "verified", "experienced", "actions"];

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
        navigate('/challan');
        console.log(response.challanDoc)
        setChallansData([...challansData, response.challanDoc]);
        onOpenChange(false)
        setUpdateId(null); // Reset update ID when modal is closed
      } else {
        throw new Error(response.message);
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

        setChallansData((prevData) => {
          const updatedSuppliers = prevData.map((supplier) => {
            // console.log(supplier._id === updateId ? response.supplier : supplier)
            return supplier._id === updateId ? response.challan : supplier
          }
          );
          return updatedSuppliers;
        });

        formik.setValues('');


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
      name: '',
      type: 'supplier',
      supplier: '',
      products: [],
      verified: false,
    },
    onSubmit: async values => {
      if (updateId) {
        setIsLoading(true)
        await handleUpdateSubmit(values);
        setIsLoading(false)

      } else {
        setIsLoading(true)
        await creatsupplier(values);
        setIsLoading(false)
      }
    },
  });

  const handleUpdate = async (supplierId) => {
    try {
      const mySupplierData = challansData.find((element) => element._id == supplierId);

      console.log(mySupplierData, "exist");

      formik.setValues({
        name: mySupplierData?.name,
        products: mySupplierData?.products.map((product) => ({
          cut: product.cut,
          overall: product.overall,
          price: product.price,
          product: product.product,
          qty: product.qty,
          total: product.total,
        })),
        supplier: mySupplierData?.supplier,
        type: mySupplierData?.type,
        verified: mySupplierData?.verified,
      });

      setUpdateId(supplierId);
      onOpen(); // Open the modal
    } catch (error) {
      console.error("Error updating supplier:", error.message);
      toast.error(error.message);
    }
  };

  console.log(formik?.values?.supplier, "Supplir -----------------------------------------------------------------------")

  const addProductToTable = () => {
    if (productref && cutref) {
      let cut = 1;
      const pricePerPiece = productsData?.filter(item => item?._id === productref)[0]?.pricePerPiece;
      const cutvalue = cutData.find(cut => cut._id === cutref)
      if (cutvalue?.isNameNumerical) {
        cut = parseFloat(cutvalue?.name);
      }
      console.log(pricePerPiece)
      const price = parseFloat(pricePerPiece);
      const total = isNaN(cut) ? 0 : parseFloat(qty) * cut;
      const overall = isNaN(price) ? 0 : total * price;
      
      console.log(total)
      console.log(price)
      console.log(overall)
      const newProduct = { product: productref, cut: cutref, qty: qty, total: total, price: pricePerPiece || "0", overall: overall };
      formik.setValues(prevValues => ({
        ...prevValues,
        products: [...(prevValues?.products || []), newProduct] // Ensure products is initialized as an array
      }));
      setproductref("")
      setcutref("")
      setqty("")
    }
  };

  // const handleQtyChange = (index, value) => {
  //   // formik.setValues((prevValues) => {
  //   //   const updatedProducts = [...prevValues.products];
  //   //   const product = { ...updatedProducts[index], qty: value };
  //   //   console.log(product)
  //   //   console.log(product.cut)
  //   //   const cutvalue = cutData.find(cut => cut._id === product.cut)?.name
  //   //   console.log(cutvalue)
  //   //   const cut = parseFloat(cutvalue);
  //   //   const price = parseFloat(product.price);
  //   //   console.log(cut)
  //   //   console.log(price)
  //   //   const total = isNaN(cut) ? 0 : product.qty * cut;
  //   //   const overall = isNaN(price) ? 0 : total * price;
  //   //   updatedProducts[index] = { ...product, total, overall };
  //   //   return { ...prevValues, products: updatedProducts };
  //   // });
  // };


  const onSupplierChange = (value) => {
    setsupplierRef(value)
    formik.setValues((prevValues) => {
      return { ...prevValues, supplier: value };
    });
  };

  const removeAttributeFromTable = (index) => {
    formik.setValues((prevValues) => {
      const updatedProducts = [...prevValues.products];
      updatedProducts.splice(index, 1);
      return { ...prevValues, products: updatedProducts };
    });
  };


  console.log(formik.values, "values")
  // console.log("challan: ", challansData)

  return (
    <>
      <div className="flex flex-col gap-2 py-4">
        <Modal
          isOpen={isOpen}
          scrollBehavior={"inside"}
          size={"5xl"}
          onOpenChange={(newState) => {
            onOpenChange(newState);
            if (!newState) {
              formik.resetForm();
            }
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-2xl font-bold font-font2  mb-3">Create Challan</ModalHeader>

                <ModalBody className='flex flex-col gap-6'>
                  <div className="flex flex-col w-full">
                    <h1 className='font-[600] font-font1 m-auto text-[1rem] mb-5'>Select The Type Of Challan !</h1>
                    <Card className="max-w-full max-h-full">
                      <CardBody className="overflow-hidden">
                        <Tabs
                          fullWidth
                          size="lg"
                          aria-label="Tabs form"
                        // selectedKey={selected}
                        // onSelectionChange={setSelected}
                        // disabledKeys={(slider?.viewall === "Categories") && ["Products"] || (slider?.viewall === "Products") && ["Categories"]}
                        >
                          <Tab key="Supplier"
                            className="py-6 flex flex-col gap-10 font-[400] font-font2"
                            // title={(slider?.viewall === "Products") ? "You Can Only Create One" : "Categories"}4
                            title="Supplier"
                          >
                            <div className='flex flex-col gap-10'>
                              <Input size={'md'}
                                classNames={{
                                  label: "font-[600] font-font1",
                                  input: "font-[500] font-font1",
                                }}
                                className="flex-grow max-w-[18rem]"
                                labelPlacement="outside"
                                type="text" label="Challan Name"
                                placeholder='Name'
                                {...formik.getFieldProps("name")}
                                value={formik?.values?.name}
                                variant="flat"
                              />
                              <Autocomplete
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
                                    label: "text-[#000]",
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
                              <label className="flex cursor-pointer items-center justify-start p-1 text-[#000] gap-4 font-font1 ">
                                Verified
                                <div className="relative inline-block">
                                  <input
                                    onChange={formik.handleChange}
                                    name="verified" // Associate the input with the form field 'verified'
                                    checked={formik?.values?.verified} // Set the checked state from formik values
                                    className="peer h-6 w-12 cursor-pointer appearance-none rounded-full border border-gray-300 bg-gary-400 checked:border-green-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
                                    type="checkbox"
                                  />
                                  <span className="pointer-events-none absolute left-1 top-1 block h-4 w-4 rounded-full bg-slate-600 transition-all duration-200 peer-checked:left-7 peer-checked:bg-green-300" />
                                </div>
                              </label>
                            </div>
                            <div className="img-form flex flex-col gap-5">
                              <h1 className='font-font1 font-[600] mx-auto'>Add Challan Products.</h1>
                              <div className='grid grid-cols-2 gap-5 w-full' >
                                <Autocomplete
                                  classNames={{
                                    base: "max-w-full border-[#fff] ",
                                    listboxWrapper: "max-h-[270px]",
                                    selectorButton: "text-[#000]",
                                  }}

                                  onSelectionChange={setproductref}
                                  value={productref}
                                  defaultItems={productsData}
                                  selectedKey={productref}
                                  inputProps={{
                                    classNames: {
                                      input: "ml-1 text-[#000] font-font1",
                                      inputWrapper: "h-[20px]",
                                      label: "text-[#000]",
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

                                  onSelectionChange={setcutref}
                                  value={cutref}
                                  defaultItems={cutData}
                                  selectedKey={cutref}
                                  inputProps={{
                                    classNames: {
                                      input: "ml-1 text-[#000] font-font1",
                                      inputWrapper: "h-[20px]",
                                      label: "text-[#000]",
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
                              </div>
                              <Input
                                classNames={{
                                  label: "font-[600] font-font1",
                                  input: "font-[500] font-font1",
                                }}
                                labelPlacement="outside"
                                label="Product Qty"
                                type="number"
                                placeholder="0"
                                value={qty}
                                className='max-w-[18rem] m-auto'
                                onChange={(e) => setqty(e.target.value)}
                              />
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
                                base: 'max-h-[400px] max-w-[1400px] border rounded-[14px] overflow-scroll',
                                table: 'min-h-[100px]  ',
                                th: 'text-center',
                                tr: 'text-center ',
                                td: 'font-font1 font-[600]',
                              }}
                              aria-label="Attribute Values Table"
                            >
                              <TableHeader>
                                <TableColumn>PRODUCT</TableColumn>
                                <TableColumn>CUT</TableColumn>
                                <TableColumn>QTY</TableColumn>
                                <TableColumn>TOTAL</TableColumn>
                                <TableColumn>PRICE</TableColumn>
                                <TableColumn>OVERALL</TableColumn>
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
                                        {object.qty}
                                      </TableCell>
                                      <TableCell>
                                        {object.total}
                                      </TableCell>
                                      <TableCell>
                                        {object.price}
                                      </TableCell>
                                      <TableCell>
                                        {object.overall}
                                      </TableCell>
                                      <TableCell className='flex items-center justify-center  h-full '>
                                        <span
                                          className="mt-2 text-lg text-danger cursor-pointer active:opacity-50 "
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

                          </Tab>
                          <Tab
                            className="py-6 flex flex-col gap-10 font-[400] font-font2"
                            key="Products"
                            // title={(slider?.viewall === "Categories") ? "You Can Only Create One" : "Products"}
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
                    Create
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
      <DataTableModel visible_columns={INITIAL_VISIBLE_COLUMNS} deleteItem={deleteItem} update={handleUpdate} columns={columns} statusOptions={statusOptions} users={challansData} onOpen={onOpen} section={'supplier'} />
    </>
  )
}

export default Challan
