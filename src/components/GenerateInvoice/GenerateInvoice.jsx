import React, { useEffect, useState } from "react";
import DataTableModel from "../DataTableModel/DataTableModel";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  RadioGroup,
  Radio,
  Tab,
  Tabs,
  CardBody,
  Card,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Autocomplete,
  AutocompleteItem,
  Textarea,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip,
  Spinner,
  select,
  checkbox,
  Listbox, ListboxItem, ScrollShadow, Avatar,
  Select,
  SelectItem
} from "@nextui-org/react";
import { useFormik } from "formik";
import { snapshot_UNSTABLE, RecoilRoot } from "recoil";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { globalLoaderAtom } from "../../store/GlobalLoader/globalLoaderAtom";
import {
  Createinvoice,
  Deleteinvoice,
  Updateinvoice,
} from "../../apis/invoice";
import { invoiceDataState } from "../../store/invoice/invoiceAtom";
import { customerDataState } from "../../store/customer/customerAtom";
import { suppliersDataState } from "../../store/supplier/supplierAtom";
import { challanDataState } from "../../store/challan/challan";
import { quickchallanDataState } from "../../store/quickchallan/quickChallanAtom";
import { UpdatechallanProducts } from "../../apis/challan";
import { productsDataState } from "../../store/product/productAtom";

const GenerateInvoice = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate();

  const [updateId, setUpdateId] = useState(null);
  const [challanRef, setChallanRef] = useState(null);
  const [invoiceData, setInvoiceData] = useRecoilState(invoiceDataState);
  const [customerData, setcustomerData] = useRecoilState(customerDataState);
  const [supplierData, setsupplierData] = useRecoilState(suppliersDataState);
  const [productsData, setProductsData] = useRecoilState(productsDataState)
  const [quickchallansData, setquickchallansData] = useRecoilState(
    quickchallanDataState
  );
  const [challansData, setChallansData] = useRecoilState(challanDataState);

  const [updatedProducts, setUpdatedProducts] = useState([]);

  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));

  const allChallanData = [...challansData, ...quickchallansData];

  const yourArray = [...selectedKeys];
  const selectedChallanData = yourArray.map((entry) => {
    return allChallanData.find((item) => item._id === entry);
  });
  const [selectedChallansProducts, setSelectedChallansProducts] = useState([]);

  const columns = [
    { name: "ID", uid: "_id", sortable: true },
    { name: "SUPPLIER_NAME", uid: "supplierName", sortable: true },
    { name: "CUSTOMER_NAME", uid: "customerName", sortable: true },
    { name: "RECEIVED(Total)", uid: "products.received", sortable: true },
    { name: "DUE(Total)", uid: "products.due", sortable: true },
    { name: "ACTIONS", uid: "actions" },
  ];

  const statusOptions = [
    { name: "Disabled", uid: "true" },
    { name: "Active", uid: "false" },
  ];

  const INITIAL_VISIBLE_COLUMNS = [
    "supplierName",
    "customerName",
    "products.received",
    "products.due",
    "actions",
  ];

  const [isLoading, setIsLoading] = useRecoilState(globalLoaderAtom);
  const [updated, setUpdated] = useState(false);
  const [supplierRef, setSupplierRef] = useState("");
  const [customerRef, setCustomerRef] = useState("");

  useEffect(() => {
    const products = [];
    selectedChallanData.map((item) => {
      item.products.map((row) => {
        if (item.product?.isProductDispatchedByInvoice) {
          products.push({
            id: row?.product?._id,
            challanId: item._id,
            product: row?.product?.productName || "NA",
            cut: row?.cut?.name || "NA",
            qtyPcs: row.qtyPcs || "NA",
            qtyMtr: row.qtyMtr || "NA",
            bales: row.bales || "NA",
            received_mtr: "", // This will be filled by user input
            received_pcs: "", // This will be filled by user input
            received_bales: "", // This will be filled by user input
            due: "", // This will be filled by user input
            rate: row.rate ? row.rate : row.product.pricePerUnit.magnitude,
            total: row.price || "", // This will be filled by user input
            markAsCompleted: false, // This will be filled by user input
            isBeingDispatchedInInvoice: row?.product?.isProductDispatchedByInvoice,
          });
        }
      });
    });
    setSelectedChallansProducts(products);
  }, [selectedKeys]);
  // Create The width
  const createinvoice = async (values) => {
    try {
      values.challanRef = [...selectedKeys];
      values.products = selectedChallansProducts;

      selectedChallanData.map(challan => {

      })
      for (var i = 0; i < selectedChallansProducts.length; i++) {
        values.isBeingDispatchedInInvoice = selectedChallansProducts[i].isBeingDispatchedInInvoice
        values.markOverallCompleted = selectedChallansProducts[i].markAsCompleted
      }
      return;
      setIsLoading(true);
      const response = await Createinvoice(values);
      setIsLoading(false);
      if (response.success) {
        toast.success(response.message);
        navigate("/invoice");
        setInvoiceData([...invoiceData, response.invoiceDoc]);
        onOpenChange(false);
        setUpdateId(null); // Reset update ID when modal is closed
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      // dispatch(SetLoader(false));
      toast.error(error.message);
    }
  };

  // Delete invoice
  const deleteItem = async (id) => {

    try {
      setIsLoading(true);
      const response = await Deleteinvoice(id);
      setIsLoading(false);
      if (response.success) {
        toast.success(response.message);

        // Update local state based on the correct identifier (use _id instead of id)
        setInvoiceData((prevData) =>
          prevData.filter((invoice) => invoice._id !== id)
        );

        navigate("/invoice");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setIsLoading(false);

      toast.error(error.message);
    }
  };

  const updateFormWithinvoiceData = (invoiceId, updatedinvoiceData) => {
    const invoiceDataexist = updatedinvoiceData.find(
      (element) => element._id === invoiceId
    );

    formik.setValues({
      name: invoiceDataexist?.name,
      markOverallCompleted: invoiceDataexist?.markOverallCompleted,
    });
    setSelectedChallansProducts(invoiceDataexist?.products);
  };
  // ...

  // Use updateFormWithinvoiceData in the useEffect
  useEffect(() => {
    updateFormWithinvoiceData(updateId, invoiceData);
    setUpdated(false);
  }, [updated]);

  // Call updateFormWithinvoiceData wherever needed
  const handleUpdate = (invoiceId) => {
    try {
      setUpdated(true);
      updateFormWithinvoiceData(invoiceId, invoiceData);

      setUpdateId(invoiceId);
      onOpen();
    } catch (error) {
      console.error("Error updating invoice:", error.message);
      toast.error(error.message);
    }
  };
  // Handle update form submission
  const handleUpdateSubmit = async (values) => {
    values.challanRef = [...selectedKeys];
    values.products = selectedChallansProducts;
    for (var i = 0; i < selectedChallansProducts.length; i++) {
      if (selectedChallansProducts?.[i].markAsCompleted) {
        values.markOverallCompleted = true;
      } else {
        values.markOverallCompleted = false;
        break;
      }
    }
    try {
      // values.ref = refcat;
      setIsLoading(true);
      const response = await Updateinvoice(updateId, values);
      setIsLoading(false);

      if (response.success) {
        toast.success(response.message);

        // Optimistically update UI

        setInvoiceData((preValue) => {
          const updatedinvoices = preValue.map((invoice) => {
            return invoice._id === updateId ? response.invoice : invoice;
          });
          return updatedinvoices;
        });
        formik.setValues({
          name: response.invoice?.name,
        });
        // Close the modal and reset update ID
        onOpenChange(false);
        setUpdateId(null);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setIsLoading(false);

      console.error("Error updating invoice:", error.message);
      toast.error(error.message);
    }
  };

  const formik = useFormik({
    initialValues: {
      challanRef: [],
      products: [],
      markOverallCompleted: false,
    },
    onSubmit: async (values) => {
      console.log(values, "Formik");
      if (updateId) {
        setIsLoading(true);
        await handleUpdateSubmit(values);
        setIsLoading(false);
      } else {
        setIsLoading(true);
        await createinvoice(values);
        setIsLoading(false);
      }
    },
  });
  const setUpdate = () => {
    setUpdateId(false);
    formik.resetForm();
    // setrefcat('')
  };


  const handleDispatchToggle = async (isChecked, challanId, productId) => {
    try {
      const payload = {
        isProductDispatchedByInvoice: isChecked,
        productId: productId
      };
      await UpdatechallanProducts(challanId, payload);
      toast.success("Updated");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  }



  // handleChange function for input fields
  const handleChange = (e, rowIndex) => {

    let product = productsData.find(p => p._id === selectedChallansProducts[rowIndex]._id);
    const { name, value } = e.target;
    const originalQty = selectedChallansProducts[rowIndex]?.qtyPcs === "NA" || selectedChallansProducts[rowIndex].qtyMtr === "NA"
      ? selectedChallansProducts[rowIndex]?.bales
      : selectedChallansProducts[rowIndex]?.qtyPcs;
    selectedChallansProducts[rowIndex].received_pcs = parseInt(value);
    selectedChallansProducts[rowIndex].received_mtr = selectedChallansProducts[rowIndex]?.cut * selectedChallansProducts[rowIndex]?.received_pcs; // Ensure selectedChallansProducts is not mutated directly
    if (selectedChallansProducts[rowIndex]?.qtyMtr !== "NA" || selectedChallansProducts[rowIndex]?.qtyPcs !== "NA") {
      selectedChallansProducts[rowIndex].due = Math.abs(selectedChallansProducts[rowIndex].received_mtr - selectedChallansProducts[rowIndex].qtyMtr);
      selectedChallansProducts[rowIndex].total = Math.abs(selectedChallansProducts[rowIndex].rate * selectedChallansProducts[rowIndex].received_mtr)
    }
    else {
      selectedChallansProducts[pIndex].total = Math.abs(product.pricePerUnit.magnitude * selectedChallansProducts[pIndex].received_mtr)
    }


    // wait

    setUpdatedProducts((prevData) => [
      ...prevData,
      selectedChallansProducts[rowIndex],
    ]);
  };
  // handleChange function for input fields
  const handleChange2 = (e, rowIndex) => {
    const { name, value } = e.target;
    const originalQty = selectedChallansProducts[rowIndex]?.qtyPcs === "NA" || selectedChallansProducts[rowIndex].qtyMtr === "NA"
      ? selectedChallansProducts[rowIndex]?.bales
      : selectedChallansProducts[rowIndex]?.qtyMtr;
    selectedChallansProducts[rowIndex].received_mtr = parseInt(value);

    if (selectedChallansProducts[rowIndex]?.qtyMtr !== "NA" || selectedChallansProducts[rowIndex]?.qtyPcs !== "NA") {
      selectedChallansProducts[rowIndex].due =
        originalQty - selectedChallansProducts[rowIndex].received_mtr;
    }
    setUpdatedProducts((prevData) => [
      ...prevData,
      selectedChallansProducts[rowIndex],
    ]);
  };

  const removeAttributeFromTable = (index) => {
    formik.setValues((prevValues) => {
      const updatedProducts = [...prevValues.products];
      updatedProducts.splice(index, 1);
      return { ...prevValues, products: updatedProducts };
    });
  };


  const fillterChallan = React.useMemo(() => {
    return allChallanData.filter((item) => item.supplier._id === supplierRef || item.customer._id === customerRef)
  }, [supplierRef, customerRef]);


  console.log(selectedChallansProducts, "selectedChallansProducts");
  const [selectedKeynewproduct, setselectedKeynewproduct] = useState("")
  const productAddInvoice = (value) => {
    setselectedKeynewproduct(value)
    console.log(value);
    let product = productsData.find(p => p._id === value);
    console.log(product);
    const newProduct = {
      id: product?._id,
      product: product?.productName || "NA",
      cut: 0,
      qtyPcs: 0,
      qtyMtr: 0,
      bales: 0,
      received_mtr: "",
      received_pcs: "",
      received_bales: "",
      due: "",
      rate: product?.pricePerUnit?.magnitude | 0,
      total: "",
      markAsCompleted: false,
      isBeingDispatchedInInvoice: product?.isProductDispatchedByInvoice | false,
    };
    setselectedKeynewproduct('')
    setSelectedChallansProducts([...selectedChallansProducts || [], newProduct]);
  }

  // console.log(allChallanData,"challan-Data");
  console.log(selectedChallansProducts, "selected-product");
  console.log(selectedChallanData,"selected-challan");

  return (
    <>
      <div className="flex flex-col gap-2 w-90vw">
        <Modal
          isOpen={isOpen}
          scrollBehavior={"inside"}
          size={"full"}
          onOpenChange={(newState) => {
            onOpenChange(newState);
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-[2rem] font-font1">
                  {updateId ? "Update invoice" : "Create invoice"}
                </ModalHeader>
                <ModalBody>
                  <div className="max-w-full rounded-2xl py-5 flex gap-1 flex-col">
                    <ModalHeader className="px-2 py-0 text-[1.2rem] font-font1 flex items-center gap-3">
                      <div className="flex items-center gap-3">
                        Select Challan For Invoice
                        <div class="bg-default/50 text-foreground flex items-center rounded-small justify-center w-7 h-7">
                          <svg
                            aria-hidden="true"
                            fill="none"
                            focusable="false"
                            height="1em"
                            width="1em"
                            role="presentation"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M7.37 22h9.25a4.87 4.87 0 0 0 4.87-4.87V8.37a4.87 4.87 0 0 0-4.87-4.87H7.37A4.87 4.87 0 0 0 2.5 8.37v8.75c0 2.7 2.18 4.88 4.87 4.88Z"
                              fill="currentColor"
                              opacity={0.4}
                            />
                            <path
                              d="M8.29 6.29c-.42 0-.75-.34-.75-.75V2.75a.749.749 0 1 1 1.5 0v2.78c0 .42-.33.76-.75.76ZM15.71 6.29c-.42 0-.75-.34-.75-.75V2.75a.749.749 0 1 1 1.5 0v2.78c0 .42-.33.76-.75.76ZM12 14.75h-1.69V13c0-.41-.34-.75-.75-.75s-.75.34-.75.75v1.75H7c-.41 0-.75.34-.75.75s.34.75.75.75h1.81V18c0 .41.34.75.75.75s.75-.34.75-.75v-1.75H12c.41 0 .75-.34.75-.75s-.34-.75-.75-.75Z"
                              fill="currentColor"
                            />
                          </svg>
                        </div>

                      </div>
                      <div className="flex gap-3 max-w-max ">
                        <Autocomplete
                          classNames={{
                            base: "max-w-full border-[#fff] ",

                            listboxWrapper: "max-h-[270px]",
                            selectorButton: "text-[#000]",
                          }}
                          onSelectionChange={setSupplierRef}
                          value={supplierRef}
                          defaultItems={supplierData}
                          selectedKey={supplierRef}
                          inputProps={{
                            classNames: {
                              input: "ml-1 text-[#000] font-font1",
                              inputWrapper: "h-[10px]",
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
                          aria-label="Select an Challan type "
                          placeholder="Select Supplier"
                          popoverProps={{
                            offset: 10,
                            classNames: {
                              base: "rounded-large",
                              content: "p-1  border-none bg-background",
                            },
                          }}
                          startContent={
                            <svg
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
                            </svg>
                          }
                          variant="flat"
                        >
                          {(item) => (
                            <AutocompleteItem
                              key={item?._id}
                              textValue={item?.name}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex gap-2 items-center">
                                  <div className="flex flex-col">
                                    {/* <span className="text-small">{item?.challanNo - item.supplier.name}</span> */}
                                    <span className="text-small">
                                      {item?.name}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </AutocompleteItem>
                          )}
                        </Autocomplete>

                        <Autocomplete
                          classNames={{
                            base: "max-w-full  border-[#fff] ",

                            listboxWrapper: "max-h-[270px]",
                            selectorButton: "text-[#000]",
                          }}
                          onSelectionChange={setCustomerRef}
                          value={customerRef}
                          defaultItems={customerData}
                          selectedKey={customerRef}
                          inputProps={{
                            classNames: {
                              input: "ml-1 text-[#000] font-font1",
                              inputWrapper: "h-[10px]",
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
                          aria-label="Select an Challan type "
                          placeholder="Select Customer"
                          popoverProps={{
                            offset: 10,
                            classNames: {
                              base: "rounded-large",
                              content: "p-1  border-none bg-background",
                            },
                          }}
                          startContent={
                            <svg
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
                            </svg>
                          }
                          variant="flat"
                        >
                          {(item) => (
                            <AutocompleteItem
                              key={item?._id}
                              textValue={item?.name}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex gap-2 items-center">
                                  <div className="flex flex-col">
                                    {/* <span className="text-small">{item?.challanNo - item.supplier.name}</span> */}
                                    <span className="text-small">
                                      {item?.name}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </AutocompleteItem>
                          )}
                        </Autocomplete>
                      </div>
                    </ModalHeader>
                    <div className="flex gap-5 w-full mb-5 items-center">
                      <div className="w-full py-2 rounded-small ">
                        <Listbox
                          classNames={{
                            base: "max-w-full",
                            list: "max-h-[165px] overflow-scroll",
                          }}
                          items={fillterChallan?.length > 0 ? fillterChallan : allChallanData}
                          label="Assigned to"
                          selectionMode="multiple"
                          onSelectionChange={setSelectedKeys}
                          selectedKeys={selectedKeys}
                          variant="flat"
                        >
                          {(item) => (
                            <ListboxItem key={item._id} textValue={item._id}>
                              <div className="flex gap-2 items-center w-full ">
                                <div class="bg-default/50 text-foreground flex items-center rounded-small justify-center w-7 h-7">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0850a4" height="1em"
                                    width="1em">
                                    <path fill-rule="evenodd" d="M12 1.5c-1.921 0-3.816.111-5.68.327-1.497.174-2.57 1.46-2.57 2.93V21.75a.75.75 0 0 0 1.029.696l3.471-1.388 3.472 1.388a.75.75 0 0 0 .556 0l3.472-1.388 3.471 1.388a.75.75 0 0 0 1.029-.696V4.757c0-1.47-1.073-2.756-2.57-2.93A49.255 49.255 0 0 0 12 1.5Zm3.53 7.28a.75.75 0 0 0-1.06-1.06l-6 6a.75.75 0 1 0 1.06 1.06l6-6ZM8.625 9a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm5.625 3.375a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z" clip-rule="evenodd" />
                                  </svg>
                                </div>
                                <div className="flex items-center justify-between w-full">
                                  <div className="flex flex-col ">
                                    <span className="text-[1rem]">{item?.challanNo ? "Challan No." + item.challanNo : "Quick Challan"}</span>
                                    <span className="flex items-center gap-1">{item?.products?.map((product, idx) => {
                                      return (
                                        idx < 2 ? (
                                          <div>{product?.product?.productName + ","}</div>
                                        ) : (
                                          <div>...+</div>
                                        )
                                      )
                                    }
                                    )}</span>
                                  </div>
                                  <span className="text-small">{item?.totalBill ? "Total Bill:" + item.totalBill : "Total Bill:" + 0.00}</span>
                                </div>
                              </div>
                            </ListboxItem>
                          )}
                        </Listbox>
                      </div>
                    </div>
                    <div className="flex items-center gap-10">
                      <ModalHeader className="px-0 text-[1.2rem] font-font1 flex items-center gap-3">
                        Challan Table
                        <div class="bg-default/50 text-foreground flex items-center rounded-small justify-center w-7 h-7"><svg height="1em" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg" class="text-lg "><path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zm0 2 .001 4H5V5h14zM5 11h8v8H5v-8zm10 8v-8h4.001l.001 8H15z" fill="currentColor"></path></svg></div>
                      </ModalHeader>
                      <Autocomplete
                        placeholder="Add Products"
                        selectedKey={[selectedKeynewproduct]}
                        classNames={{
                          base: "max-w-[18rem] border-[#fff]",
                          listboxWrapper: "max-h-[270px] ",
                          selectorButton: "text-[#000] ",
                        }}
                        inputProps={{
                          classNames: {
                            input: "ml-1 text-[#000] font-font1",
                            inputWrapper: "h-[10px]",
                            label: "font-[600] font-font1",
                          },
                        }}
                        onSelectionChange={(value) => productAddInvoice(value)}
                      >
                        {productsData.map((item) => (
                          <AutocompleteItem key={item?._id} textValue={item?.productName}>
                            {item.productName}
                          </AutocompleteItem>
                        ))}
                      </Autocomplete>
                    </div>
                    <section className="table__body">
                      <table className="table-invoice">
                        <thead>
                          <tr>
                            <th>PRODUCT_NAME</th>
                            <th>CUT</th>
                            <th>QTY_PCS</th>
                            <th>QTY_METER</th>
                            <th>BALES</th>
                            <th>RECIEVED_PCS</th>
                            <th>RECIEVED_METER</th>
                            <th>RECIEVED_BALES</th>
                            <th>DUE</th>
                            <th>RATE</th>
                            <th>TOTAL RS.</th>
                            <th>MARK_AS_COMPLETED</th>
                            <th>DISPATCHING PRODUCTS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedChallansProducts?.map((Product, pIndex) => {
                            return (
                              <tr
                                key={pIndex}
                              >
                                <td>
                                  {Product.product || "NA"}
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    placeholder={Product.cut}
                                    className="max-w-[5rem] flex justify-center items-center"
                                    value={Product.cut}
                                    onChange={(e) => {
                                      const newProducts = [
                                        ...selectedChallansProducts,
                                      ];
                                      newProducts[pIndex].cut = e.target.value;
                                      setSelectedChallansProducts(newProducts);
                                    }}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    placeholder={0}
                                    className="max-w-[5rem] flex justify-center items-center"
                                    value={Product.qtyPcs}
                                    onChange={(e) => {
                                      const newProducts = [
                                        ...selectedChallansProducts,
                                      ];
                                      newProducts[pIndex].qtyPcs = e.target.value;
                                      setSelectedChallansProducts(newProducts);
                                    }}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    placeholder={0}
                                    className="max-w-[5rem] flex justify-center items-center"
                                    value={Product.qtyMtr}
                                    onChange={(e) => {
                                      const newProducts = [
                                        ...selectedChallansProducts,
                                      ];
                                      newProducts[pIndex].qtyMtr = e.target.value;
                                      setSelectedChallansProducts(newProducts);
                                    }}
                                  />
                                </td>
                                <td >
                                  <input
                                    type="number"
                                    placeholder={0}
                                    className="max-w-[5rem] flex justify-center items-center"
                                    value={Product.bales}
                                    onChange={(e) => {
                                      const newProducts = [
                                        ...selectedChallansProducts,
                                      ];
                                      newProducts[pIndex].bales = e.target.value;
                                      setSelectedChallansProducts(newProducts);
                                    }}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    placeholder={0}
                                    className="max-w-[5rem] flex justify-center items-center"
                                    value={
                                      selectedChallansProducts?.[pIndex]
                                        ?.received_pcs
                                    }
                                    onChange={(e) => {
                                      handleChange(e, pIndex);
                                      const newProducts = [
                                        ...selectedChallansProducts,
                                      ];
                                      setSelectedChallansProducts(newProducts);
                                    }}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    placeholder={0}
                                    className="max-w-[5rem]"
                                    value={selectedChallansProducts?.[pIndex]?.received_mtr}
                                    onChange={(e) => {
                                      const newProducts = [
                                        ...selectedChallansProducts,
                                      ];
                                      handleChange2(e, pIndex);
                                      setSelectedChallansProducts(newProducts);
                                    }}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    placeholder={0}
                                    className="max-w-[5rem]"
                                    value={selectedChallansProducts[pIndex].received_bales}
                                    onChange={(e) => {
                                      const newProducts = [
                                        ...selectedChallansProducts,
                                      ];
                                      newProducts[pIndex].received_bales = e.target.value;
                                      if (newProducts[pIndex]?.qtyMtr === "NA" || newProducts[pIndex]?.qtyPcs === "NA") {
                                        newProducts[pIndex].due =
                                          selectedChallansProducts[pIndex].bales - e.target.value;
                                      }
                                      setSelectedChallansProducts(newProducts);
                                    }}
                                  />
                                </td>

                                <td>
                                  {Math.trunc(selectedChallansProducts?.[pIndex]?.due) || 0}
                                </td>
                                <td >
                                  <input
                                    value={selectedChallansProducts[pIndex]?.rate}
                                    className="max-w-[5rem]"

                                    placeholder={0}
                                    onChange={(e) => {
                                      const newProducts = [
                                        ...selectedChallansProducts,
                                      ];
                                      newProducts[pIndex].rate = e.target.value; // Ensure selectedChallansProducts is not mutated directly
                                      // Ensure selectedChallansProducts is not mutated directly
                                      setSelectedChallansProducts(newProducts);
                                    }}
                                  />
                                </td>

                                <td >
                                  <input
                                    type="number"
                                    placeholder={0}
                                    className="max-w-[5rem]"
                                    value={selectedChallansProducts[pIndex]?.total}
                                    // dekh ho gya set ucchii nhi lene ko bola devleloper ko smjhaaooo
                                    onChange={(e) => {
                                      const newProducts = [
                                        ...selectedChallansProducts,
                                      ];
                                      newProducts[pIndex].total =
                                        e.target.value;
                                      setSelectedChallansProducts(newProducts);
                                    }}
                                  />
                                </td>
                                <td>
                                  {" "}
                                  <input
                                    type="checkbox"
                                    placeholder="markAsCompleted"
                                    className="flex ml-5 h-4 w-4"
                                    checked={selectedChallansProducts[pIndex]?.markAsCompleted || false}
                                    value={selectedChallansProducts[pIndex]?.markAsCompleted || false}
                                    onChange={(e) => {
                                      const newProducts = [
                                        ...selectedChallansProducts,
                                      ];
                                      newProducts[pIndex].markAsCompleted =
                                        e.target.checked; // Ensure selectedChallansProducts is not mutated directly
                                      setSelectedChallansProducts(newProducts);
                                    }}
                                  />
                                </td>
                                <td>
                                  {" "}
                                  <input
                                    type="checkbox"
                                    placeholder="markAsCompleted"
                                    className="flex ml-5 h-4 w-4"
                                    checked={selectedChallansProducts[pIndex]?.isBeingDispatchedInInvoice}
                                    value={selectedChallansProducts[pIndex]?.isBeingDispatchedInInvoice}
                                    onChange={(e) => {
                                      const newProducts = [
                                        ...selectedChallansProducts,
                                      ];
                                      handleDispatchToggle(e.target.checked, newProducts[pIndex].challanId, newProducts[pIndex].id)
                                      newProducts[pIndex].isBeingDispatchedInInvoice =
                                        e.target.checked; // Ensure selectedChallansProducts is not mutated directly

                                      setSelectedChallansProducts(newProducts);
                                    }}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </section>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={onClose}
                    onClick={setUpdate}
                  >
                    Close
                  </Button>
                  <Button
                    color="primary"
                    className="bg-foreground text-background font-font1"
                    onClick={formik.handleSubmit}
                  >
                    {updateId ? "Update" : "Create "}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
      <DataTableModel
        visible_columns={INITIAL_VISIBLE_COLUMNS}
        deleteItem={deleteItem}
        update={handleUpdate}
        columns={columns}
        statusOptions={statusOptions}
        users={invoiceData}
        onOpen={onOpen}
        section={"invoice"}
      />
    </>
  );
};

export default GenerateInvoice;
