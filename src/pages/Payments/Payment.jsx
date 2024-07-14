import React, { useEffect, useState } from "react";
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
    SelectItem,
    Checkbox
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
import { UpdateProductsDue, UpdatechallanProducts } from "../../apis/challan";
import { productsDataState } from "../../store/product/productAtom";
import { UpdateQuickChallanProducts, UpdateQuickProductsDue } from "../../apis/quickChallan";
import { cutDataState } from "../../store/cut/cutAtom";
import DataTableModel from "../../components/DataTableModel/DataTableModel";
import Adjustment from "./Adjustment";
import NewRefrence from "./NewRefrence";

const GenerateInvoice = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const navigate = useNavigate();


    const [updateId, setUpdateId] = useState(null);
    // const [checkBoxItems, setCheckBoxItems] = React.useState([{ name: "", isChecked: "false" }, { name: "", isChecked: "false" }]);
    const [challanRef, setChallanRef] = useState(null);
    const [selectedPaymentResolveType, setSelectedPaymentResolveType] = React.useState('adjustment');
    const [invoiceData, setInvoiceData] = useRecoilState(invoiceDataState);
    const [customerData, setcustomerData] = useRecoilState(customerDataState);
    const [suppliersData, setsuppliersData] = useRecoilState(suppliersDataState);
    const [productsData, setProductsData] = useRecoilState(productsDataState)
    const [quickchallansData, setquickchallansData] = useRecoilState(
        quickchallanDataState
    );
    const [challansData, setChallansData] = useRecoilState(challanDataState);

    const [updatedProducts, setUpdatedProducts] = useState([]);

    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));

    const allChallanData = [...challansData, ...quickchallansData];

    console.log(invoiceData, '--------------------');


    const yourArray = [...selectedKeys];
    const selectedChallanData = yourArray.map((entry) => {
        return allChallanData.find((item) => item._id === entry);
    });
    const [selectedChallansProducts, setSelectedChallansProducts] = useState([]);

    const cutData = useRecoilValue(cutDataState);
    const [selectedCut, setSelectedCut] = useState(null);


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
    const Units = [
        { name: "Pcs", _id: 1 },
        { name: "Meter", _id: 2 },
    ]


    const [isLoading, setIsLoading] = useRecoilState(globalLoaderAtom);
    const [updated, setUpdated] = useState(false);
    const [supplierRef, setSupplierRef] = useState("");
    const [customerRef, setCustomerRef] = useState("");
    const [filteredInvoiceData, setFilteredInvoiceData] = useState([]);

    console.log(filteredInvoiceData, "===================")

    useEffect(() => {
        const products = [];
        selectedChallanData.map((item) => {
            item.products.map((row) => {
                if (!row?.isProductDispatchedByInvoice) {
                    const newRow = { ...row };

                    // Update the copied row object
                    if (newRow.due !== 0) {
                        if (newRow.unit === '1' && (item.challanType === 'main')) {
                            //if unit in pcs
                            newRow.qtyPcs = newRow.unit === '1' ? newRow.due : newRow.qtyPcs;
                            newRow.qtyMtr = (newRow.qtyPcs * newRow.cut?.name) || newRow.qtyMtr;

                        } else if (newRow.unit === '2' && (item.challanType === 'main')) {
                            //if unit in meter
                            newRow.qtyMtr = newRow.unit === '2' ? newRow.due : newRow.qtyMtr;
                            newRow.qtyPcs = (newRow.qtyMtr / newRow.cut?.name) || newRow.qtyMtr;
                        }

                        if (item.challanType === 'quick') {
                            newRow.bales = newRow.due
                        }
                    }

                    products.push({
                        id: newRow?.product?._id,
                        challanId: item._id,
                        unit: newRow?.unit,
                        product: newRow?.product?.productName || "NA",
                        cut: newRow?.cut?.name || "NA",
                        qtyPcs: newRow.qtyPcs || "NA",
                        challanType: item.challanType,
                        qtyMtr: newRow.qtyMtr || "NA",
                        bales: newRow.bales || "NA",
                        received_mtr: "", // This will be filled by user input
                        received_pcs: "", // This will be filled by user input
                        received_bales: "", // This will be filled by user input
                        due: newRow.due || null, // This will be filled by user input
                        rate: newRow?.rate ?? newRow.product.pricePerUnit.magnitude,
                        total: "", // This will be filled by user input
                        markAsCompleted: false, // This will be filled by user input
                        isBeingDispatchedInInvoice: newRow?.product?.isProductDispatchedByInvoice || false,
                    });
                }
            });
        });
        setSelectedChallansProducts(products);
    }, [selectedKeys]);


    useEffect(() => {
        // if (selectedPaymentResolveType === "adjustment") {
        const updatedInvoiceData = invoiceData.filter(item => item?.customerRef === customerRef && item?.supplierRef === supplierRef)
        setFilteredInvoiceData(updatedInvoiceData);
        // }
    }, [selectedPaymentResolveType, customerRef, supplierRef, invoiceData])


    // update due of profucts
    const updateProductDue = async (challanId, productId, challanType, due) => {
        try {
            const payload = {
                productId: productId,
                due: due
            };
            if (challanType === "quick") {
                await UpdateQuickProductsDue(challanId, payload);
            } else if (challanType === "main") {
                await UpdateProductsDue(challanId, payload);
            }
            toast.success("Updated");
        } catch (error) {
            console.error("Error updating product:", error);
        }
    }
    // Create The width
    const createinvoice = async (values) => {
        try {
            values.challanRef = [...selectedKeys];
            values.products = selectedChallansProducts;
            values.supplierRef = supplierRef;
            values.customerRef = customerRef;
            values?.products?.forEach(product => {
                if (product.due === 0) {
                    handleDispatchToggle(true, product.challanId, product.id, product.challanType)
                    product.isBeingDispatchedInInvoice = true;
                }
                updateProductDue(product.challanId, product.id, product.challanType, product.due);
            });
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
        setSelectedChallansProducts(invoiceDataexist?.products);
    };
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
        values.products = selectedChallansProducts;
        values.products = selectedChallansProducts;
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
            paymentDate: new Date().toISOString().slice(0, 10),
            supplierRef: "",
            customerRef: ""
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


    const onCustomerChange = (value) => {
        setCustomerRef(value)
        formik.setValues((prevValues) => {
            return { ...prevValues, customer: value };
        });
    };


    const onSupplierChange = (value) => {
        setSupplierRef(value)
        formik.setValues((prevValues) => {
            return { ...prevValues, supplier: value };
        });
    };

    const setUpdate = () => {
        setUpdateId(false);
        formik.resetForm();
        // setrefcat('')
    };


    const handleDispatchToggle = async (isChecked, challanId, productId, challanType) => {

        try {
            const payload = {
                isProductDispatchedByInvoice: isChecked,
                productId: productId
            };
            if (challanType === "quick") {
                await UpdateQuickChallanProducts(challanId, payload);
            } else if (challanType === "main") {
                await UpdatechallanProducts(challanId, payload);
            }
            toast.success("Updated");
        } catch (error) {
            console.error("Error updating product:", error);
        }
    }


    // handleChange function for input fields
    const handleChange = (e, rowIndex) => {
        const { name, value } = e.target;
        selectedChallansProducts[rowIndex].received_pcs = parseInt(value);
        const cutvalue = cutData.find(cut => cut.name === selectedChallansProducts[rowIndex]?.cut)

        if (selectedChallansProducts[rowIndex]?.challanType === "main") {
            if (cutvalue.isNameNumerica) {
                selectedChallansProducts[rowIndex].due = Math.abs(selectedChallansProducts[rowIndex].received_mtr - selectedChallansProducts[rowIndex].qtyMtr);
                if (selectedChallansProducts[rowIndex]?.unit === "1") {
                    selectedChallansProducts[rowIndex].total = Math.abs(selectedChallansProducts[rowIndex].rate * selectedChallansProducts[rowIndex].received_mtr)
                } else {
                    selectedChallansProducts[rowIndex].total = Math.trunc(selectedChallansProducts[rowIndex].rate * selectedChallansProducts[rowIndex].received_pcs)
                }
            } else {
                selectedChallansProducts[rowIndex].due = Math.abs(selectedChallansProducts[rowIndex].received_pcs - selectedChallansProducts[rowIndex].qtyPcs);
            }
        } else if (selectedChallansProducts[rowIndex]?.challanType === "quick") {
            if (selectedChallansProducts[rowIndex]?.unit === "1") {
                selectedChallansProducts[rowIndex].due = Math.abs(selectedChallansProducts[rowIndex].bales - selectedChallansProducts[rowIndex].received_bales);
                selectedChallansProducts[rowIndex].total = Math.trunc(selectedChallansProducts[rowIndex].rate * selectedChallansProducts[rowIndex].received_pcs)
            } else {
                selectedChallansProducts[rowIndex].due = Math.abs(selectedChallansProducts[rowIndex].bales - selectedChallansProducts[rowIndex].received_bales);
                selectedChallansProducts[rowIndex].total = Math.trunc(selectedChallansProducts[rowIndex].rate * selectedChallansProducts[rowIndex].received_mtr)
            }
        } else {
            if (selectedChallansProducts[rowIndex]?.unit === "1") {
                selectedChallansProducts[rowIndex].due = Math.abs(selectedChallansProducts[rowIndex].bales - selectedChallansProducts[rowIndex].received_bales);
                selectedChallansProducts[rowIndex].total = Math.trunc(selectedChallansProducts[rowIndex].rate * selectedChallansProducts[rowIndex].received_pcs)
            } else {
                selectedChallansProducts[rowIndex].due = Math.abs(selectedChallansProducts[rowIndex].bales - selectedChallansProducts[rowIndex].received_bales);
                selectedChallansProducts[rowIndex].total = Math.trunc(selectedChallansProducts[rowIndex].rate * selectedChallansProducts[rowIndex].received_mtr)
            }
        }

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


        if (selectedChallansProducts[rowIndex]?.challanType === "main") {
            if (selectedChallansProducts[rowIndex]?.unit === "1") {
                selectedChallansProducts[rowIndex].total = Math.trunc(selectedChallansProducts[rowIndex].rate * selectedChallansProducts[rowIndex].received_pcs)
            } else {
                selectedChallansProducts[rowIndex].total = Math.trunc(selectedChallansProducts[rowIndex].rate * selectedChallansProducts[rowIndex].received_mtr)
            }
        } else if (selectedChallansProducts[rowIndex]?.challanType === "quick") {
            if (selectedChallansProducts[rowIndex]?.unit === "1") {
                selectedChallansProducts[rowIndex].total = Math.trunc(selectedChallansProducts[rowIndex].rate * selectedChallansProducts[rowIndex].received_pcs)
            } else {
                selectedChallansProducts[rowIndex].total = Math.trunc(selectedChallansProducts[rowIndex].rate * selectedChallansProducts[rowIndex].received_mtr)
            }
        } else {
            if (selectedChallansProducts[rowIndex]?.unit === "1") {
                selectedChallansProducts[rowIndex].due = Math.abs(selectedChallansProducts[rowIndex].bales - selectedChallansProducts[rowIndex].received_bales);
                selectedChallansProducts[rowIndex].total = Math.trunc(selectedChallansProducts[rowIndex].rate * selectedChallansProducts[rowIndex].received_pcs)
            } else {
                selectedChallansProducts[rowIndex].due = Math.abs(selectedChallansProducts[rowIndex].bales - selectedChallansProducts[rowIndex].received_bales);
                selectedChallansProducts[rowIndex].total = Math.trunc(selectedChallansProducts[rowIndex].rate * selectedChallansProducts[rowIndex].received_mtr)
            }
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
        return allChallanData.filter((item) => item.supplier._id === supplierRef && item.customer._id === customerRef && (item.products.filter(product => product.isProductDispatchedByInvoice === false)).length > 0 ? true : false)
    }, [supplierRef, customerRef]);



    const [selectedKeynewproduct, setselectedKeynewproduct] = useState("")
    const productAddInvoice = () => {
        if (!selectedKeynewproduct) {
            toast.error("Put Product Details !")
            return;
        }
        if (!selectedCut) {
            toast.error("Put Product Details !")
            return;
        }
        let product = productsData.find(p => p._id === selectedKeynewproduct);
        const newProduct = {
            id: product?._id,
            product: product?.productName || "NA",
            unit: product?.pricePerUnit?.unit?.name === "Pcs" ? "1" : "2",
            cut: selectedCut,
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
        setselectedKeynewproduct('');
        setSelectedCut('');
        setSelectedChallansProducts([...selectedChallansProducts || [], newProduct]);
    }

    // console.log(allChallanData,"challan-Data");
    // console.log(selectedChallanData, "selectedChallanData");
    // console.log(allChallanData, "challan-Data");
    // console.log(selectedChallanData, "selectedChallanData");

    // console.log(selectedChallansProducts, "selected-product");
    // console.log(fillterChallan, "fillterChallan");
    console.log(cutData, "invoiceData");



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
                                        <div className="px-2 py-0 text-[1.2rem] font-font1 flex items-center gap-3">
                                            <div className='flex items-center gap-10 mt-5'>
                                                <Autocomplete
                                                    labelPlacement="outside"
                                                    label="Customer Name"
                                                    classNames={{
                                                        base: "max-w-[18rem] border-[#fff] ",
                                                        listboxWrapper: "max-h-[270px]",
                                                        selectorButton: "text-[#000]",
                                                    }}

                                                    onSelectionChange={(value) => onCustomerChange(value, "supplier")}
                                                    value={formik?.values?.customer?._id}
                                                    defaultItems={customerData}
                                                    selectedKey={formik?.values?.customer?._id}
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
                                                    value={formik?.values?.supplier?._id}
                                                    defaultItems={suppliersData}
                                                    selectedKey={formik?.values?.supplier?._id}
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

                                            <Input
                                                type="date"
                                                labelPlacement="outside-left"
                                                label="Date"
                                                classNames={{
                                                    label: "font-[600] font-font1",
                                                    input: "font-[500] font-font1",
                                                    // inputWrapper: "max-h-[50px]"
                                                }}
                                                value={formik?.values?.paymentDate?.split('T')[0]}
                                                onChange={(e) => formik.setValues(prevValues => ({
                                                    ...prevValues,
                                                    paymentDate: e.target.value,
                                                }))}
                                                // Use the date string directly
                                                // {...formik.getFieldProps('challanDate')}
                                                className=" max-w-[15rem] mt-5"
                                            />

                                        </div>

                                        <div className=" flex items-center mt-6 gap-4 max-w-[40rem]">
                                            <Input
                                                type="number"
                                                placeholder={'hi'}
                                                className="flex max-w-[50%]"
                                                label="Amount"
                                            // value={Product.cut}
                                            // onChange={(e) => {
                                            //     const newProducts = [
                                            //         ...selectedChallansProducts,
                                            //     ];
                                            //     newProducts[pIndex].cut = e.target.value;
                                            //     setSelectedChallansProducts(newProducts);
                                            // }}
                                            />

                                            {/* <Autocomplete
                                                labelPlacement="outside"
                                                label="Supplier Name"
                                                classNames={{
                                                    base: "max-w-[50%] border-[#fff] ",

                                                    listboxWrapper: "max-h-[270px]",
                                                    selectorButton: "text-[#000]",
                                                }}

                                                onSelectionChange={onSupplierChange}
                                                value={formik?.values?.supplier?._id}
                                                defaultItems={suppliersData}
                                                selectedKey={formik?.values?.supplier?._id}
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
                                            </Autocomplete> */}
                                        </div>

                                        <div className="font-semibold my-4">Select the payment resolve mode </div>

                                        <div className="flex flex-col  gap-2">

                                            {/* <div className="border-2 h-fit px-4 py-2 rounded-full border-[#2020204d]">
                                                <Checkbox onValueChange={console.log} className={`font-semibold`}>Adjustment</Checkbox>
                                            </div>

                                            <div className="border-2 h-fit px-4 py-2 rounded-full border-[#2020204d]">
                                                <Checkbox  className={`font-semibold`}>New Refrence</Checkbox>
                                            </div> */}


                                            <Tabs
                                                aria-label="Options"
                                                selectedKey={selectedPaymentResolveType}
                                                onSelectionChange={setSelectedPaymentResolveType}
                                                className="flex flex-col w-[40%]"
                                                color="primary"
                                            >
                                                <Tab key="adjustment" title="Adjustment">
                                                    <Adjustment
                                                        invoiceData={filteredInvoiceData}
                                                    />
                                                </Tab>
                                                <Tab key="newRef" title="New Refrence">
                                                    <NewRefrence />
                                                </Tab>

                                            </Tabs>


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
