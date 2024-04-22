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

const GenerateInvoice = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate();

  const [updateId, setUpdateId] = useState(null);
  const [challanRef, setChallanRef] = useState(null);
  const [invoiceData, setInvoiceData] = useRecoilState(invoiceDataState);
  const [customerData, setcustomerData] = useRecoilState(customerDataState);
  const [supplierData, setsupplierData] = useRecoilState(suppliersDataState);
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

const selectedChallansProducts =[];
  // Data Format
  const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "NAME", uid: "name", sortable: true },
    { name: "VERIFIED", uid: "verified", sortable: true },
    { name: "ACTIONS", uid: "actions" },
  ];

  const statusOptions = [
    { name: "Disabled", uid: "true" },
    { name: "Active", uid: "false" },
  ];

  const INITIAL_VISIBLE_COLUMNS = ["name", "verified", "actions"];

  const [isLoading, setIsLoading] = useRecoilState(globalLoaderAtom);
  const [updated, setUpdated] = useState(false);
  const [supplierRef, setSupplierRef] = useState("");
  const [customerRef, setCustomerRef] = useState("");

  // Create The width
  const createinvoice = async (values) => {
    try {
      values.challanRef = challanRef;
      const filteredProducts = values.products.map((product) => ({
        product: product.product,
        received: product.received,
        due: product.due,
      }));

      values.products = filteredProducts;
      setIsLoading(true);
      const response = await Createinvoice(values);
      setIsLoading(false);
      if (response.success) {
        toast.success(response.message);
        navigate("/invoice");
        console.log(response.invoiceDoc);
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
    console.log(id);

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

        navigate("/inventory");
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
    console.log(
      invoiceDataexist,
      updatedinvoiceData,
      "existssssssssssssssssssssss"
    );

    formik.setValues({
      name: invoiceDataexist?.name,
    });
  };
  // ...

  // Use updateFormWithinvoiceData in the useEffect
  useEffect(() => {
    updateFormWithinvoiceData(updateId, invoiceData);
    setUpdated(false);
  }, [updated]);

  // ...

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
    try {
      // values.ref = refcat;
      setIsLoading(true);
      const response = await Updateinvoice(updateId, values);
      setIsLoading(false);

      if (response.success) {
        toast.success(response.message);
        console.log("Data update", response.invoice);

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
        console.log(formik.values, "ffffffffffffffffffffffffffffffff");
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
    },
    onSubmit: async (values) => {
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
console.log(selectedChallansProducts, "+++++++++++++++++++++++++++++++++++++++++++++++++++")
  
  // handleChange function for input fields
  const handleChange = (e, rowIndex) => {
    const { name, value } = e.target;
    const originalQty = selectedChallansProducts[rowIndex]?.qtyPcs === "NA" || selectedChallansProducts[rowIndex].qtyMtr === "NA" ?  selectedChallansProducts[rowIndex]?.bales : selectedChallansProducts[rowIndex]?.qtyPcs 
    console.log(console.log(originalQty,rowIndex,"original quantity"))
    selectedChallansProducts[rowIndex].received = parseInt(value);
    
    selectedChallansProducts[rowIndex].due = originalQty - selectedChallansProducts[rowIndex].received;
    setUpdatedProducts((prevData)=>[...prevData ,selectedChallansProducts[rowIndex]])

  };

  console.log(updatedProducts,".......................................")

  const removeAttributeFromTable = (index) => {
    formik.setValues((prevValues) => {
      const updatedProducts = [...prevValues.products];
      updatedProducts.splice(index, 1);
      return { ...prevValues, products: updatedProducts };
    });
  };

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
                  <div className="max-w-full rounded-2xl p-8 flex gap-2 flex-col">
                    <div className="flex  gap-2 ">
                      <Autocomplete
                        labelPlacement="outside"
                        label="SUPPLIER"
                        classNames={{
                          base: "max-w-full mb-2 border-[#fff] ",

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
                        labelPlacement="outside"
                        label="CUSTOMER"
                        classNames={{
                          base: "max-w-full mb-2 border-[#fff] ",

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
                    <ModalHeader className=" text-[1rem] font-font1">
                      Challan Table
                    </ModalHeader>
                    <Table
                      aria-label="Controlled table example with dynamic content"
                      selectionMode="multiple"
                      selectedKeys={selectedKeys}
                      onSelectionChange={setSelectedKeys}
                    >
                      <TableHeader>
                        {allChallanData &&
                          Object.entries(allChallanData[0]).map(
                            ([key, value], index) => {
                              console.log(key);

                              return (
                                <TableColumn key={index}>
                                  {key.toUpperCase()}
                                </TableColumn>
                              );
                            }
                          )}
                      </TableHeader>
                      <TableBody
                        items={
                          allChallanData.filter((item) => {
                            return (
                              item.supplier._id === supplierRef ||
                              item.customer._id === customerRef
                            );
                          })
                            ? allChallanData.filter((item) => {
                                return (
                                  item.supplier._id === supplierRef &&
                                  item.customer._id === customerRef
                                );
                              })
                            : allChallanData
                        }
                      >
                        {(item) => (
                          <TableRow key={item._id}>
                            {Object.entries(item).map(
                              ([key, value], cellIndex) => {
                                return (
                                  <TableCell key={cellIndex}>
                                    {(() => {
                                      if (key.toLowerCase() === "products") {
                                        return value[0]._id;
                                      }
                                      if (
                                        key.toLowerCase() === "supplier" ||
                                        key.toLowerCase() === "customer"
                                      ) {
                                        return value.name;
                                      }
                                      return value;
                                      // Handle other cases or return a default value if needed
                                    })()}
                                  </TableCell>
                                );
                              }
                            )}
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>

                    <ModalHeader className=" text-[1rem] font-font1">
                      products Table
                    </ModalHeader>

                    <div className="overflow-auto">
                      <table className="border-collapse w-full border border-gray-400">
                        <thead>
                          <tr className="border-2 border-[#252525] text-[0.8rem] font-normal p-6 ">
                            <th>PRODUCT_NAME</th>
                            <th>CUT</th>
                            <th>QTY_PCS</th>
                            <th>QTY_METER</th>
                            <th>BALES</th>

                            <th>RECIEVED</th>
                            <th>DUE</th>
                          </tr>
                        </thead>
                        <tbody>
                    

                              {selectedChallanData && selectedChallanData.map((item, index) => {
                                item?.products?.map((row, rowIndex) => {
                              
                                  selectedChallansProducts.push({
                                    product: row.product || "NA",
                                    cut: row.cut || "NA",
                                    qtyPcs: row.qtyPcs || "NA",
                                    qtyMtr: row.qtyMtr || "NA",
                                    bales: row.bales || "NA",
                                    received: "", // This will be filled by user input
                                    due: "", // This will be filled by user input
                                  });
                                  console.log(selectedChallansProducts, "selectedchallanproducts");
                                });
                              })}
                              {selectedChallansProducts.map((Product, pIndex) => {
                                return (
                                  <tr
                                    className="border-2 text-[0.9rem] border-[#252525] max-h-[6rem] mt-2"
                                    key={pIndex}
                                  >
                                    <td>{Product.product || "NA"}</td>
                                    <td>{Product.cut || "NA"}</td>
                                    <td>{Product.qtyPcs || "NA"}</td>
                                    <td>{Product.qtyMtr || "NA"}</td>
                                    <td>{Product.bales || "NA"}</td>
                                    <td>
                                      <input
                                        type="number"
                                        placeholder="Received Qty"
                                        value={updatedProducts?.[pIndex]?.received}
                                        onChange={(e) => handleChange(e, pIndex)}
                                      />
                                    </td>
                                    <td>{updatedProducts?.[pIndex]?.due}</td>
                                  </tr>
                                );
                              })}
                              
                        </tbody>
                      </table>
                    </div>
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
