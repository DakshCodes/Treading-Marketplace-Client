import React, { useEffect } from 'react'
import DataTableModel from '../DataTableModel/DataTableModel';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio } from "@nextui-org/react";
import { useFormik } from 'formik'
import { Createsupplier, GetsupplierData } from '../../apis/supllier';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const Suppliers = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const navigate = useNavigate();

    // get data Of Suppliers

    const getsupplierData = async () => {
        try {
            // dispatch(SetLoader(true));
            const response = await GetsupplierData();
            // dispatch(SetLoader(false));
            if (response.success) {
                console.log(response.suppliers)
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getsupplierData();
    }, [])

    // Data Format
    const columns = [
        { name: "ID", uid: "id", sortable: true },
        { name: "NAME", uid: "name", sortable: true },
        { name: "AGE", uid: "age", sortable: true },
        { name: "ROLE", uid: "role", sortable: true },
        { name: "TEAM", uid: "team" },
        { name: "EMAIL", uid: "email" },
        { name: "STATUS", uid: "status", sortable: true },
        { name: "ACTIONS", uid: "actions" },
    ];

    const statusOptions = [
        { name: "Active", uid: "active" },
        { name: "Paused", uid: "paused" },
        { name: "Vacation", uid: "vacation" },
    ];

    const users = [
        {
            id: 1,
            name: "Tony Reichert",
            role: "CEO",
            team: "Management",
            status: "active",
            age: "29",
            avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
            email: "tony.reichert@example.com",
        },
        {
            id: 2,
            name: "Zoey Lang",
            role: "Tech Lead",
            team: "Development",
            status: "paused",
            age: "25",
            avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
            email: "zoey.lang@example.com",
        },
    ];


    const creatsupplier = async (values) => {
        try {

            console.log(values)
            // dispatch(SetLoader(true));
            const response = await Createsupplier(values);
            // dispatch(SetLoader(false));
            if (response.success) {
                toast.success(response.message);
                navigate('/inventory');
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            // dispatch(SetLoader(false));
            console.log(error.message);
            toast.error(error.message);
        }
    }


    const formik = useFormik({
        initialValues: {
            name: '',
            brand: '',
            address: '',
            verified: false, // Add a field for the "Verified" checkbox
            experienced: false, // Add a field for the "Experienced" checkbox
        },
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
            await creatsupplier(values);
        },
    });

    return (
        <>
            <div className="flex flex-col gap-2">
                <Modal
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    scrollBehavior={"inside"}
                    size={"xl"}
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1 text-[2rem] font-font1">
                                    Create Supplier
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
                                        Create
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
            <DataTableModel columns={columns} statusOptions={statusOptions} users={users} onOpen={onOpen} section={'supplier'} />
        </>
    )
}

export default Suppliers
