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
import { challanDataState } from "../../store/challan/challan";
import { quickchallanDataState } from "../../store/quickchallan/quickChallanAtom";

const GenerateInvoice = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate();

  const [updateId, setUpdateId] = useState(null);
  const [invoiceData, setInvoiceData] = useRecoilState(invoiceDataState);
  const mainchallanData = useRecoilValue(challanDataState);
  const quickchallanData = useRecoilValue(quickchallanDataState);

  const [challanType, setChallanType] = useState(null);
  const [tableColumndata, setTableColumndata] = useState(null);

  // console.log(mainchallanData,"mainchalannnnnnnnnnnnnnnnn")
  // console.log(quickchallanData,"quickchalannnnnnnnnnnnnnnnn")
  // console.log(challanType,"chalannnnnnnnnnnnnnnnn")

  console.log(invoiceData, "invoice DataState");

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

  // Create The width
  const createinvoice = async (values) => {
    try {
      formik.resetForm();

      // values.ref = refcat;
      setIsLoading(true);
      const response = await Createinvoice(values);
      setIsLoading(false);
      if (response.success) {
        toast.success(response.message);
        navigate("/inventory");
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

  const finalChallanData = challanType === 1 && mainchallanData;

  const formik = useFormik({
    initialValues: {
      name: "",
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

  const removeAttributeFromTable = (index) => {
    formik.setValues((prevValues) => {
      const updatedProducts = [...prevValues.products];
      updatedProducts.splice(index, 1);
      return { ...prevValues, products: updatedProducts };
    });
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <Modal
          isOpen={isOpen}
          scrollBehavior={"inside"}
          size={"xl"}
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
                  <div className="max-w-full rounded-2xl">
                    <div className="flex  gap-2 p-8">
                      <Autocomplete
                        labelPlacement="outside"
                        label="Challan Type"
                        classNames={{
                          base: "max-w-full mb-2 border-[#fff] ",

                          listboxWrapper: "max-h-[270px]",
                          selectorButton: "text-[#000]",
                        }}
                        onSelectionChange={(value) =>
                          setChallanType(() => value)
                        }
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
                        placeholder="Enter Challan type "
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
                        <AutocompleteItem key={1} textValue={"Main Challan"}>
                          <div className="flex justify-between items-center">
                            <div className="flex gap-2 items-center">
                              <div className="flex flex-col">
                                <span className="text-small">Main Challan</span>
                              </div>
                            </div>
                          </div>
                        </AutocompleteItem>
                        <AutocompleteItem key={2} textValue={"Quick Challan"}>
                          <div className="flex justify-between items-center">
                            <div className="flex gap-2 items-center">
                              <div className="flex flex-col">
                                <span className="text-small">
                                  Quick Challan
                                </span>
                              </div>
                            </div>
                          </div>
                        </AutocompleteItem>
                      </Autocomplete>

                      <Autocomplete
                        labelPlacement="outside"
                        label="Select Challan"
                        classNames={{
                          base: "max-w-full border-[#fff] ",

                          listboxWrapper: "max-h-[270px]",
                          selectorButton: "text-[#000]",
                        }}
                        onSelectionChange={(selectedId) => {
                          if (challanType === "1") {
                            const selectedMainChallanData =
                              mainchallanData.find(
                                (item) => item._id === selectedId
                              );
                            setTableColumndata(() => selectedMainChallanData);
                            console.log(
                              tableColumndata,
                              selectedMainChallanData,
                              "table column data"
                            );
                          } else {
                            const selectedQuickChallanData =
                              quickchallanData.find(
                                (item) => item._id === selectedId
                              );
                            setTableColumndata(() => selectedQuickChallanData);
                          }
                        }}
                        // value={formik?.values?.customer}
                        defaultItems={
                          challanType === "1"
                            ? mainchallanData
                            : quickchallanData
                        }
                        // selectedKey={formik?.values?.customer}
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
                        aria-label="Select challan "
                        placeholder="Enter challan "
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
                            textValue={item?.supplier?.name}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex gap-2 items-center">
                                <div className="flex flex-col">
                                  {/* <span className="text-small">{item?.challanNo - item.supplier.name}</span> */}
                                  <span className="text-small">
                                    {item?.supplier?.name}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                    </div>
                  </div>
                  <div className="overflow-auto">
                    <table className="border-collapse w-full border border-gray-400">
                      <thead>
                        <tr className="border-2 border-[#252525] text-[0.8rem] font-normal p-6 ">
                          {tableColumndata &&
                            Object.entries(tableColumndata?.products[0]).map(
                              ([key, value], index) => {
                                console.log(key);
                                if (key === "challanChartImages") {
                                  return;
                                }
                                return (
                                  <th className="p-4" key={index}>
                                    {key.toUpperCase()}
                                  </th>
                                );
                              }
                            )}
                            <th>RECIEVED</th>
                        <th>DUE</th>
                        </tr>
                        
                      </thead>
                      <tbody>
                        {tableColumndata?.products &&
                          tableColumndata?.products?.map((row, rowIndex) => (
                            // console.log(row)
                            <tr
                              className="border-2 text-[0.9rem] border-[#252525] max-h-[6rem] mt-2"
                              key={rowIndex}
                            >
                              {Object.entries(row).map(
                                ([key, value], cellIndex) => {
                                  if (key === "challanChartImages") {
                                    return;
                                  }
                                  return (
                                    <td className="p-4 " key={cellIndex}>
                                      {key.toLowerCase() ===
                                      "challanChartImages"
                                        ? null
                                        : value}
                                    </td>
                                  );
                                }
                              )}
                              <td><input className="outline-none w-20 border border-zinc-600 rounded-sm px-1 mx-2" type="number" placeholder="rcvd qty"/></td>
                              <td className="mx-5" >due</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
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
