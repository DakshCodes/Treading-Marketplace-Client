import React from 'react'
import './ProductForm.css'
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from "@nextui-org/react";
import { toast } from 'react-hot-toast';
import AutoComplete from '../Autocomplete/AutoComplete';
import { useFormik } from 'formik';
import * as z from 'zod';
import { CreateProduct } from '../../apis/product';


const ProductPageForm = () => {
    const params = useParams();
    const productURL = params.id === 'new' ? null : params.id;
    const navigate = useNavigate();

    const users = [
        {
            id: 1,
            name: "Tony Reichert",
            role: "CEO",
            team: "Management",
            status: "active",
            age: "29",
            avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png",
            email: "tony.reichert@example.com",
        },
        {
            id: 2,
            name: "Zoey Lang",
            role: "Tech Lead",
            team: "Development",
            status: "paused",
            age: "25",
            avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/1.png",
            email: "zoey.lang@example.com",
        },
    ];

    // Zod validation schema
    // const productSchema = z.object({
    //     supplierName: z.string().minLength(1)('Supplier Name is required'),
    //     productName: z.string().minLength(1)('Product Name is required'),
    //     category: z.string().minLength(1)('Category is required'),
    //     quality: z.string().minLengthn(1)('Quality is required'),
    //     design: z.string().minLength(1)('Design is required'),
    //     weight: z.string().minLength(1)('Weight is required'),
    //     finishtype: z.string().minLength(1)('Finish Type is required'),
    //     feeltype: z.string().minLength(1)('Feel Type is required'),
    // });

    // Formik configuration
    const formik = useFormik({
        initialValues: {
            supplierName: '',
            productName: '',
            category: '',
            quality: '',
            design: '',
            weight: '',
            remarks: '',
            finishtype: '',
            feeltype: '',
        },
        // validationSchema: () => productSchema,
        onSubmit: async(values) => {
            // Handle form submission logic here
            console.log(values);
            try {
                // dispatch(SetLoader(true));
                const response = await CreateProduct(values);
                // dispatch(SetLoader(false));
                if (response.success) {
                    navigate('/inventory');
                    toast.success(response.message);
                    // setUpdateId(null); // Reset update ID when modal is closed

                } else {
                    throw new Error(response.message);
                }
            } catch (error) {
                // dispatch(SetLoader(false));
                console.log(error.message);
                toast.error(error.message);
            }
        },
    });

    return (
        <>
            <main className="demo-page-content">
                <div className="flex h-full overflow-auto max-w-fit">
                    <div className="w-max max-w-max bg-[#1f1e30] rounded-[24px] shadow-md p-6 overflow-auto">
                        <h2 className="text-3xl font-bold text-gray-200 mb-4 font-font2">Create Product</h2>
                        <form onSubmit={formik.handleSubmit} className="flex flex-wrap font-font1 flex-col gap-10 mt-5">
                            <div className="flex flex-col  gap-4">
                                <AutoComplete
                                    placeholder={"Supplier Name"}
                                    users={users}
                                    values={formik.values.supplierName}
                                    selectionChange={(value) => formik.setFieldValue('supplierName', value)}

                                />
                                {formik.touched.supplierName && formik.errors.supplierName ? (
                                    <div className="text-red-500">{formik.errors.supplierName}</div>
                                ) : null}
                                <br />
                                <div className="flex w-full flex-wrap justify-start mb-3 md:mb-0 gap-10 items-center">
                                    <Input
                                        type="text"
                                        placeholder="Product name..."
                                        labelPlacement="outside"
                                        classNames={{
                                            label: '!text-[#fff]  font-font1',
                                            base: "max-w-[250px] w-full",
                                            input: 'font-font1 text-[1rem]',
                                            inputWrapper: "h-[48px] max-w-[250px] w-full",
                                        }}
                                        variant="flat"
                                        id="productName"
                                        name="productName"
                                        value={formik.values.productName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.productName && formik.errors.productName ? (
                                        <div className="text-red-500">{formik.errors.productName}</div>
                                    ) : null}

                                    {/* AutoComplete for category */}
                                    <AutoComplete
                                        placeholder={"Enter category"}
                                        users={users}
                                        values={formik.values.category}
                                        selectionChange={(value) => formik.setFieldValue('category', value)}
                                    />
                                    {formik.touched.category && formik.errors.category ? (
                                        <div className="text-red-500">{formik.errors.category}</div>
                                    ) : null}

                                    {/* AutoComplete for quality */}
                                    <AutoComplete
                                        placeholder={"Enter quality"}
                                        users={users}
                                        values={formik.values.quality}
                                        selectionChange={(value) => formik.setFieldValue('quality', value)}
                                    />
                                    {formik.touched.quality && formik.errors.quality ? (
                                        <div className="text-red-500">{formik.errors.quality}</div>
                                    ) : null}

                                    {/* AutoComplete for design */}
                                    <AutoComplete
                                        placeholder={"Enter design"}
                                        users={users}
                                        values={formik.values.design}
                                        selectionChange={(value) => formik.setFieldValue('design', value)}
                                    />
                                    {formik.touched.design && formik.errors.design ? (
                                        <div className="text-red-500">{formik.errors.design}</div>
                                    ) : null}

                                    {/* AutoComplete for weight */}
                                    <AutoComplete
                                        placeholder={"Enter weight"}
                                        users={users}
                                        values={formik.values.weight}
                                        selectionChange={(value) => formik.setFieldValue('weight', value)}
                                    />
                                    {formik.touched.weight && formik.errors.weight ? (
                                        <div className="text-red-500">{formik.errors.weight}</div>
                                    ) : null}

                                    {/* AutoComplete for remarks */}
                                    <AutoComplete
                                        placeholder={"Enter remarks"}
                                        users={users}
                                        values={formik.values.remarks}
                                        selectionChange={(value) => formik.setFieldValue('remarks', value)}
                                    />
                                    {formik.touched.remarks && formik.errors.remarks ? (
                                        <div className="text-red-500">{formik.errors.remarks}</div>
                                    ) : null}

                                    {/* AutoComplete for finish Type */}
                                    <AutoComplete
                                        placeholder={"Enter finish Type"}
                                        users={users}
                                        values={formik.values.finishtype}
                                        selectionChange={(value) => formik.setFieldValue('finishtype', value)}
                                    />
                                    {formik.touched.finishtype && formik.errors.finishtype ? (
                                        <div className="text-red-500">{formik.errors.finishtype}</div>
                                    ) : null}

                                    {/* AutoComplete for feel Type */}
                                    <AutoComplete
                                        placeholder={"Enter feel Type"}
                                        users={users}
                                        values={formik.values.feeltype}
                                        selectionChange={(value) => formik.setFieldValue('feeltype', value)}
                                    />
                                    {formik.touched.feeltype && formik.errors.feeltype ? (
                                        <div className="text-red-500">{formik.errors.feeltype}</div>
                                    ) : null}

                                </div>
                            </div>
                            <button type="submit" className="bg-neutral-950 font-font2  max-w-max text-neutral-400 border border-neutral-400 border-b-4 font-[600] overflow-hidden relative px-8 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
                                <span className="bg-neutral-400 shadow-neutral-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]" />
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </>
    )
}

export default ProductPageForm
