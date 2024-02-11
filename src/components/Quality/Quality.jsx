import React, { useEffect, useState } from 'react'
import DataTableModel from '../DataTableModel/DataTableModel';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio } from "@nextui-org/react";
import { useFormik } from 'formik'
import { Createquality, GetqualityData, Deletequality, Updatequality } from '../../apis/quality';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { qualityDataState } from '../../store/quality/qualityAtom';


const Quality = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const navigate = useNavigate();
    const [updateId, setUpdateId] = useState(null)

    const [qualityData, setQualityData] = useRecoilState(qualityDataState)
    console.log(qualityData || [])


    // Data Format
    const columns = [
        { name: "ID", uid: "id", sortable: true },
        { name: "NAME", uid: "name", sortable: true },
        { name: "BRAND", uid: "brand", sortable: true },
        { name: "EXPERIENCED", uid: "experienced", sortable: true },
        { name: "ADDRESS", uid: "address", sortable: true },
        { name: "VERIFIED", uid: "verified", sortable: true },
        { name: "ACTIONS", uid: "actions" },
    ];

    const statusOptions = [
        { name: "Disabled", uid: "true" },
        { name: "Active", uid: "false" },
    ];

    const INITIAL_VISIBLE_COLUMNS = ["name", "brand", "verified", "experienced", "actions"];

    const users = [
        {
            id: 1,
            name: "Tony Reichert",
            brand: "CEO",
            address: "California",
            experienced: true,
            verified: false,
            avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        },
        {
            id: 2,
            name: "chert",
            brand: "Nike",
            address: "Paris",
            experienced: false,
            verified: true,
            avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        },
    ];


    // Get data Of Suppliers
    // const getsupplierData = async () => {
    //     try {
    //         // dispatch(SetLoader(true));
    //         const response = await GetqualityData();
    //         // dispatch(SetLoader(false));
    //         if (response.success) {
    //             console.log(response.suppliers)
    //         } else {
    //             throw new Error(response.message);
    //         }
    //     } catch (error) {
    //         // dispatch(SetLoader(false));
    //         toast.error(error.message)
    //     }
    // }

    // useEffect(() => {
    //     getsupplierData();
    // }, [])

    // Create The Supplier
    const CreateItem = async (values) => {
        try {

            console.log(values)
            // dispatch(SetLoader(true));
            const response = await Createquality(values);
            // dispatch(SetLoader(false));
            if (response.success) {
                navigate('/inventory');
                toast.success(response.message);
                console.log(response +"////////");
                setQualityData([...qualityData, response.qualityDoc]);

                onOpenChange(false)
                setUpdateId(null); // Reset update ID when modal is closed

            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            // dispatch(SetLoader(false));
            console.log(error.message);
            toast.error(error.message);
        }
    }

    // Delete Supplier
    const deleteItem = async (id) => {
        try {
            // dispatch(SetLoader(true));
            const response = await Deletequality(id);
            // dispatch(SetLoader(false));
            if (response.success) {
                toast.success(response.message);

                // Update local state based on the correct identifier (use _id instead of id)
                setQualityData((prevData) => prevData.filter((quality) => quality._id !== id));

                // navigate('/inventory');
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            // dispatch(SetLoader(false));
            toast.error(error.message)
        }
    }

    // Update The Supplier
    const handleUpdate = async (supplierId) => {
        try {

            const supplierData = await GetqualityData(supplierId);

            // Set the initial values for Formik
            formik.setValues({
                name: supplierData?.name,
                brand: supplierData?.brand,
                address: supplierData?.address,
                verified: supplierData?.verified,
                experienced: supplierData?.experienced,
            });

            setUpdateId(supplierId);
            onOpen(); // Open the modal
        } catch (error) {
            console.error("Error updating supplier:", error.message);
            toast.error(error.message);
        }
    };

    // Handle update form submission
    const handleUpdateSubmit = async (values) => {
        try {
            const response = await Updatequality(updateId, values);
            if (response.success) {
                toast.success(response.message);
                
                setQualityData((prevData) => {
                    const updatedQuality = prevData.map((quality) => (quality._id === updateId ? response.qualities : quality));
                    return updatedQuality;
                });
                
                // Close the modal
                onOpenChange(false);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error("Error updating supplier:", error.message);
            toast.error(error.message);
        }
    };


    const formik = useFormik({
        initialValues: {
            name: '',
            brand: '',
            address: '',
            verified: false,
            experienced: false,
        },
        onSubmit: async values => {
            if (updateId) {
                await handleUpdateSubmit(values);
            } else {
                await CreateItem(values);
            }
        },
    });


    return (
        <>
            <div className="flex flex-col gap-2">
                {/* {JSON.stringify(qualityData)} */}
                <Modal
                    isOpen={isOpen}
                    scrollBehavior={"inside"}
                    size={"xl"}
                    onOpenChange={(newState) => {
                        onOpenChange(newState);
                        if (!newState) {
                            setUpdateId(null); // Reset update ID when modal is closed
                        }
                    }}
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1 text-[2rem] font-font1">
                                    {updateId ? "Update Supplier" : "Create Supplier"}
                                </ModalHeader>
                                <ModalBody>
                                    <div className="max-w-full rounded-2xl bg-[#1f1e30]">
                                        <div className="flex flex-col gap-2 p-8">
                                            <input
                                                autoFocus
                                                {...formik.getFieldProps('name')}
                                                className="bg-slate-900 font-font2 font-[400] w-full rounded-lg border border-gray-300 px-4 py-3  text-[#fff]"
                                                placeholder="Supplier name.."
                                            />
                                            <input
                                                autoFocus
                                                {...formik.getFieldProps('brand')}
                                                className="bg-slate-900 font-font2 font-[400] w-full rounded-lg border border-gray-300 px-4 py-3  text-[#fff] mt-2"
                                                placeholder="Brand name.."
                                            />
                                            <input
                                                autoFocus
                                                {...formik.getFieldProps('address')}
                                                className="bg-slate-900 font-font2 font-[400] w-full rounded-lg border border-gray-300 px-4 py-3  text-[#fff] mt-2"
                                                placeholder="Address.."
                                            />
                                            <label className="flex cursor-pointer items-center justify-between p-1 text-[#fff]">
                                                Verified
                                                <div className="relative inline-block">
                                                    <input
                                                        onChange={formik.handleChange}
                                                        name="verified" // Associate the input with the form field 'verified'
                                                        checked={formik.values.verified} // Set the checked state from formik values
                                                        className="peer h-6 w-12 cursor-pointer appearance-none rounded-full border border-gray-300 bg-gary-400 checked:border-green-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
                                                        type="checkbox"
                                                    />
                                                    <span className="pointer-events-none absolute left-1 top-1 block h-4 w-4 rounded-full bg-slate-600 transition-all duration-200 peer-checked:left-7 peer-checked:bg-green-300" />
                                                </div>
                                            </label>
                                            <label className="flex cursor-pointer items-center justify-between p-1 text-[#fff]">
                                                Experienced
                                                <div className="relative inline-block">
                                                    <input
                                                        onChange={formik.handleChange}
                                                        name="experienced" // Associate the input with the form field 'experienced'
                                                        checked={formik.values.experienced} // Set the checked state from formik values
                                                        className="peer h-6 w-12 cursor-pointer appearance-none rounded-full border border-gray-300 bg-gary-400 checked:border-green-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
                                                        type="checkbox"
                                                    />
                                                    <span className="pointer-events-none absolute left-1 top-1 block h-4 w-4 rounded-full bg-slate-600 transition-all duration-200 peer-checked:left-7 peer-checked:bg-green-300" />
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="danger" variant="light"
                                        onPress={onClose}
                                    >
                                        Close
                                    </Button>
                                    <Button color="primary"
                                        onPress={onClose}
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
            <DataTableModel visible_columns={INITIAL_VISIBLE_COLUMNS} deleteItem={deleteItem} update={handleUpdate} columns={columns} statusOptions={statusOptions} users={qualityData} onOpen={onOpen} section={'supplier'} />
        </>
    )
}

export default Quality
