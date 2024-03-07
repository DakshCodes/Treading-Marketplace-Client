import React, { useEffect, useState } from 'react'
import DataTableModel from '../DataTableModel/DataTableModel';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio } from "@nextui-org/react";
import { useFormik } from 'formik'
import { snapshot_UNSTABLE, RecoilRoot } from 'recoil';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from "recoil"
import { globalLoaderAtom } from '../../store/GlobalLoader/globalLoaderAtom';
import { unitDataState } from '../../store/unit/unitAtom';
import { CreateUnit, Deleteunit, Updateunit } from '../../apis/unit';

const Unit = () => {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const navigate = useNavigate();

    const [updateId, setUpdateId] = useState(null)
    const [unitData, setunitData] = useRecoilState(unitDataState)





    console.log(unitData, "unitDataState")




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

    // Create The width
    const createunit = async (values) => {
        try {
            formik.resetForm()

            // values.ref = refcat;
            setIsLoading(true)
            const response = await CreateUnit(values);
            setIsLoading(false)
            if (response.success) {
                toast.success(response.message);
                navigate('/inventory');
                console.log(response.unitDoc)
                setunitData([...unitData, response.unitDoc]);
                onOpenChange(false)
                setUpdateId(null); // Reset update ID when modal is closed
                formik.setValues(values)

            } else {
                throw new Error(response.message);

            }
        } catch (error) {
            // dispatch(SetLoader(false));
            toast.error(error.message,);


        }
    }



    // Delete unit
    const deleteItem = async (id) => {
        console.log(id)

        try {
            setIsLoading(true)
            const response = await Deleteunit(id);
            setIsLoading(false)
            if (response.success) {
                toast.success(response.message);

                // Update local state based on the correct identifier (use _id instead of id)
                setunitData((prevData) => prevData.filter((unit) => unit._id !== id));

                navigate('/inventory');
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            setIsLoading(false)

            toast.error(error.message)
        }
    }

    // Update The unit
    const handleUpdate = async (unitId) => {
        try {
            console.log(unitId)
            // changed from todoListState to filteredTodoListState
            const unitDataexist = unitData.find((element) => { return element._id == unitId });
            console.log(unitDataexist, 'existssssssssssssssssssssss')
            // Set the initial values for Formik

            formik.setValues({
                name: unitDataexist?.name,
                verified: unitDataexist?.verified,
            });

            setUpdateId(unitId);
            onOpen() // Open the modal
        } catch (error) {
            console.error("Error updating unit:", error.message);
            toast.error(error.message);
        }
    };

    // Handle update form submission
    const handleUpdateSubmit = async (values) => {
        try {
            // values.ref = refcat;
            setIsLoading(true)
            const response = await Updateunit(updateId, values);
            setIsLoading(false)

            if (response.success) {
                toast.success(response.message);
                console.log("Data update", response.unit);

                // Optimistically update UI

                setunitData((preValue) => {
                    const updatedunits = preValue.map((unit) => {
                        return unit._id === updateId ? response.unit : unit
                    }
                    )
                    return updatedunits;
                })
                formik.setValues({
                    name: response.unit?.name,
                    verified: response.unit?.verified,
                }
                )
                console.log(formik.values, 'ffffffffffffffffffffffffffffffff')
                // Close the modal and reset update ID
                onOpenChange(false);
                setUpdateId(null);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            setIsLoading(false)

            console.error("Error updating unit:", error.message);
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
                setIsLoading(true)
                await handleUpdateSubmit(values);
                setIsLoading(false)
            } else {
                setIsLoading(true)
                await createunit(values);
                setIsLoading(false)
            }
        },
    });
    const setUpdate = () => {
        setUpdateId(false)
    }
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
                                    {updateId ? "Update unit" : "Create unit"}
                                </ModalHeader>
                                <ModalBody>
                                    <div className="max-w-full rounded-2xl bg-[#1f1e30]">
                                        <div className="flex flex-col gap-2 p-8">
                                            <input
                                                autoFocus
                                                {...formik.getFieldProps('name')}
                                                className="bg-slate-900 font-font2 font-[400] w-full rounded-lg border border-gray-300 px-4 py-3  text-[#fff]"
                                                placeholder="unit name.."
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
                                        onClick={setUpdate}
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
            <DataTableModel visible_columns={INITIAL_VISIBLE_COLUMNS} deleteItem={deleteItem} update={handleUpdate} columns={columns} statusOptions={statusOptions} users={unitData} onOpen={onOpen} section={'unit'} />
        </>
    )
}

export default Unit

