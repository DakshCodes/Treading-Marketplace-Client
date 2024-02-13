import React, { useEffect, useState } from 'react'
import DataTableModel from '../DataTableModel/DataTableModel';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio } from "@nextui-org/react";
import { useFormik } from 'formik'
import { Createfeeltype, Deletefeeltype, Updatefeeltype } from '../../apis/feeltype';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from "recoil"
import { feeltypeDataState } from "../../store/feeltype/feeltypeAtom"

const FeelType = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const navigate = useNavigate();

    const [updateId, setUpdateId] = useState(null)

    const [feeltypeData, setfeeltypeData] = useRecoilState(feeltypeDataState)
    console.log(feeltypeData, "feeltypeDataState")

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


    // Create The feeltype
    const createfeeltype = async (values) => {
        try {
            // dispatch(SetLoader(true));
            const response = await Createfeeltype(values);
            // dispatch(SetLoader(false));
            if (response.success) {
                toast.success(response.message);
                navigate('/inventory');
                console.log(response.feeltypeDoc)
                setfeeltypeData([...feeltypeData, response.feeltypeDoc]);
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



    // Delete feeltype
    const deleteItem = async (id) => {
        try {
            // dispatch(SetLoader(true));
            const response = await Deletefeeltype(id);
            // dispatch(SetLoader(false));
            if (response.success) {
                toast.success(response.message);

                // Update local state based on the correct identifier (use _id instead of id)
                setfeeltypeData((prevData) => prevData.filter((feeltype) => feeltype._id !== id));

                navigate('/inventory');
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            // dispatch(SetLoader(false));
            toast.error(error.message)
        }
    }

    // Update The feeltype
    const handleUpdate = async (feeltypeId) => {
        try {

            // changed from todoListState to filteredTodoListState
            const feeltypeData = feeltypeData.find((element) => element._id == feeltypeId);

            // Set the initial values for Formik
            formik.setValues({
                name: feeltypeData?.name,
                verified: feeltypeData?.verified,
            });

            setUpdateId(feeltypeId);
            onOpen(); // Open the modal
        } catch (error) {
            console.error("Error updating feeltype:", error.message);
            toast.error(error.message);
        }
    };

    // Handle update form submission
    const handleUpdateSubmit = async (values) => {
        try {
            const response = await Updatefeeltype(updateId, values);
            if (response.success) {
                toast.success(response.message);
                console.log("Data update", response.feeltype);

                // Optimistically update UI
                setfeeltypeData((prevData) => {
                    const updatedfeeltypes = prevData.map((feeltype) =>
                        feeltype._id === updateId ? response.feeltype : feeltype
                    );
                    return updatedfeeltypes;
                });

                // Close the modal and reset update ID
                onOpenChange(false);
                setUpdateId(null);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error("Error updating feeltype:", error.message);
            toast.error(error.message);
        }
    };



    const formik = useFormik({
        initialValues: {
            name: '',
            verified: false,
        },
        onSubmit: async values => {
            if (updateId) {
                await handleUpdateSubmit(values);
            } else {
                await createfeeltype(values);
            }
        },
    });


    return (
        <>
            <div className="flex flex-col gap-2">
                <Modal
                    isOpen={isOpen}
                    scrollBehavior={"inside"}
                    size={"xl"}
                    onOpenChange={(newState) => {
                        onOpenChange(newState);
                        if (!newState) {
                            formik.setValues({})
                        }
                    }}
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1 text-[2rem] font-font1">
                                    {updateId ? "Update feeltype" : "Create feeltype"}
                                </ModalHeader>
                                <ModalBody>
                                    <div className="max-w-full rounded-2xl bg-[#1f1e30]">
                                        <div className="flex flex-col gap-2 p-8">
                                            <input
                                                autoFocus
                                                {...formik.getFieldProps('name')}
                                                className="bg-slate-900 font-font2 font-[400] w-full rounded-lg border border-gray-300 px-4 py-3  text-[#fff]"
                                                placeholder="feeltype name.."
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
            <DataTableModel visible_columns={INITIAL_VISIBLE_COLUMNS} deleteItem={deleteItem} update={handleUpdate} columns={columns} statusOptions={statusOptions} users={feeltypeData} onOpen={onOpen} section={'feeltype'} />
        </>
    )
}

export default FeelType
