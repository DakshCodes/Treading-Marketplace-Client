import React, { useEffect, useState } from 'react'
import './ProductForm.css'
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from "@nextui-org/react";
import { toast } from 'react-hot-toast';
import AutoComplete from '../Autocomplete/AutoComplete';
import { useFormik } from 'formik';
import * as z from 'zod';
import { CreateProduct, UpdateProduct } from '../../apis/product';
// import Arrowsvg from "../../assets/arrow.svg"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { suppliersDataState } from "../../store/supplier/supplierAtom"
import { categoryDataState } from "../../store/category/category"
import { qualityDataState } from "../../store/quality/qualityAtom"
import { designDataState } from "../../store/design/designAtom"
import { feeltypeDataState } from "../../store/feeltype/feeltypeAtom"
import { finishtypeDataState } from "../../store/finishtype/finishtypeAtom"
import { weaveDataState } from "../../store/weave/weaveAtom"
import { widthDataState } from "../../store/width/widthAtom"
import { productsDataState } from '../../store/product/productAtom';
import { globalLoaderAtom } from '../../store/GlobalLoader/globalLoaderAtom';
import { unitDataState } from '../../store/unit/unitAtom';

const ProductPageForm = () => {
    const params = useParams();
    const productURL = params.id === 'new' ? null : params.id;

    console.log(productURL)
    const navigate = useNavigate();
    const [updateId, setUpdateId] = useState('');

    const categoryData = useRecoilValue(categoryDataState);
    const supplierData = useRecoilValue(suppliersDataState);
    const weaveData = useRecoilValue(weaveDataState);

    const qualityData = useRecoilValue(qualityDataState);   // depend on category
    const designData = useRecoilValue(designDataState);     // depend on category
    const feelTypeData = useRecoilValue(feeltypeDataState); // depend on category
    const finishTypeData = useRecoilValue(finishtypeDataState);// depend on category
    const widthData = useRecoilValue(widthDataState);       // depend on category

    console.table(widthData)


    const setProductsData = useSetRecoilState(productsDataState);
    const productsData = useRecoilValue(productsDataState);

    // Function to filter items based on selected category and reference field
    const getFilteredItems = (items, selectedCategory) => {
        return items.filter(item => item.ref === selectedCategory);
    };
    const handleUpdate = async (productId) => {
        try {

            // changed from todoListState to filteredTodoListState
            const singleProductData = productsData.find((element) => element._id == productId);
            console.log(singleProductData)

            formik.setValues({
                supplierName: singleProductData?.supplierName?._id || "5f478f5bc34b9a001f6a8b3d",
                productName: singleProductData?.productName || "",
                category: singleProductData?.category?._id || "5f478f5bc34b9a001f6a8b3d",
                quality: singleProductData?.quality?._id || "5f478f5bc34b9a001f6a8b3d",
                design: singleProductData?.design?._id || "5f478f5bc34b9a001f6a8b3d",
                weave: singleProductData?.weave?._id || "5f478f5bc34b9a001f6a8b3d",
                width: singleProductData?.width?._id || "5f478f5bc34b9a001f6a8b3d",
                finishtype: singleProductData?.finishtype?._id || "5f478f5bc34b9a001f6a8b3d", // Assuming finishtype is an object with a name property
                feeltype: singleProductData?.feeltype?._id || "5f478f5bc34b9a001f6a8b3d",
                pricePerUnit: {
                    magnitude: singleProductData?.pricePerUnit?.magnitude || null,
                    unit: singleProductData?.pricePerUnit?.unit || null,
                },
            });


            setUpdateId(productId);

        } catch (error) {
            console.error("Error updating finishtype:", error.message);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (productURL) {
            handleUpdate(productURL);
        }
    }, [])

    const updateDependentFields = (value) => {
        formik.setValues({
            ...formik.values,
            category: value,
            quality: "5f478f5bc34b9a001f6a8b3d",
            design: "5f478f5bc34b9a001f6a8b3d",
            width: "5f478f5bc34b9a001f6a8b3d",
            finishtype: "5f478f5bc34b9a001f6a8b3d",
            feeltype: "5f478f5bc34b9a001f6a8b3d",
        });
    };


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

    const [isLoading, setIsLoading] = useRecoilState(globalLoaderAtom);

    // Formik configuration
    const formik = useFormik({
        initialValues: {
            supplierName: "5f478f5bc34b9a001f6a8b3d",
            productName: "",
            category: "5f478f5bc34b9a001f6a8b3d",
            quality: "5f478f5bc34b9a001f6a8b3d",
            design: "5f478f5bc34b9a001f6a8b3d",
            weave: "5f478f5bc34b9a001f6a8b3d",
            width: "5f478f5bc34b9a001f6a8b3d",
            finishtype: "5f478f5bc34b9a001f6a8b3d",
            feeltype: "5f478f5bc34b9a001f6a8b3d",
            pricePerUnit: {
                magnitude: null,
                unit: null
            },
        },
        validate: (values) => {
            const errors = {};

            if (!values.supplierName) {
                errors.supplierName = "Supplier Name is required";
            }

            if (!values.productName) {
                errors.productName = "Product Name is required";
            }

            if (!values.category) {
                errors.category = "Category is required";
            }

            if (!values.design) {
                errors.design = "Design is required";
            }

            if (!values.quality) {
                errors.quality = "Quality is required";
            }

            if (!values.feeltype) {
                errors.feeltype = "Feel Type is required";
            }

            if (!values.finishtype) {
                errors.finishtype = "Finish Type is required";
            }

            if (!values.weave) {
                errors.weave = "Weave is required";
            }

            if (!values.width) {
                errors.width = "Width is required";
            }
            if (!values.pricePerUnit || values.pricePerUnit.magnitude === null || values.pricePerUnit.unit === null) {
                errors.pricePerUnit = "Both Magnitude and Unit are required for Price Per Unit";
            }


            // Add validation for other fields...

            return errors;
        },
        onSubmit: async (values) => {
            // Handle form submission logic here
            console.log(values);
            // return;
            try {
                // dispatch(SetLoader(true));
                let response = null;
                if (updateId) {
                    setIsLoading(true);
                    response = await UpdateProduct(updateId, values);
                    setIsLoading(false);
                } else {
                    setIsLoading(true);
                    response = await CreateProduct(values);
                    setIsLoading(false);
                }

                if (response.success) {
                    navigate('/inventory');
                    toast.success(response.message);
                    // setUpdateId(null); // Reset update ID when modal is closed
                    setProductsData((prevValue) => [...prevValue, response.product])

                } else {
                    throw new Error(response.message);
                }
            } catch (error) {
                setIsLoading(false);

                console.log(error.message);
                toast.error(error.message);
            }
        },
    });

    const units = useRecoilValue(unitDataState);


    console.log(formik.values);

    return (
        <>
            <main className="demo-page-content">
                <div className="flex h-full overflow-auto max-w-full">
                    <div className="w-full  rounded-[24px] shadow-md p-6 overflow-auto">
                        <h2 className="text-3xl font-bold mb-4 font-font2">{updateId ? "Update " : "Create "}Product</h2>
                        <form onSubmit={formik.handleSubmit} className="flex flex-wrap font-font1 flex-col gap-10 mt-5">
                            <div className="flex flex-col">
                                <AutoComplete
                                    placeholder={"Supplier Name"}
                                    users={supplierData}
                                    values={formik.values.supplierName}
                                    selectionChange={(value) => formik.setFieldValue('supplierName', value)}

                                />
                                {formik.touched.supplierName && formik.errors.supplierName ? (
                                    <div className="text-red-500 text-[0.8rem] font-semibold italic">*{formik.errors.supplierName}</div>
                                ) : null}
                                <br />
                                <Input
                                    type="text"
                                    placeholder="Product name..."
                                    labelPlacement="outside"
                                    classNames={{
                                        label: '!text-[#fff]  font-font1',
                                        base: "max-w-full",
                                        input: 'font-font1 text-[1rem]',
                                        inputWrapper: "h-[48px]  w-full",
                                    }}
                                    variant="flat"
                                    id="productName"
                                    name="productName"
                                    value={formik.values.productName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.productName && formik.errors.productName ? (
                                    <div className="text-red-500 text-[0.8rem] font-semibold italic">*{formik.errors.productName}</div>
                                ) : null}

                                <div className='mt-12 mb-4 flex gap-2 font-bold border-b border-black pb-2 border-dashed  text-base font-sans'>
                                    More Details about product
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M17 15.586 6.707 5.293 5.293 6.707 15.586 17H7v2h12V7h-2v8.586z" /></svg>
                                </div>
                                <div className="grid grid-cols-1  md:grid-cols-3 gap-6 w-full   ">


                                    <div className='flex flex-col items-start gap-2'>
                                        {/* AutoComplete for category */}
                                        <AutoComplete
                                            placeholder={"Enter category"}
                                            users={categoryData}
                                            values={formik.values.category}
                                            selectionChange={(value) => {
                                                formik.setFieldValue('category', value);
                                                updateDependentFields(value); // Reset dependent fields on category change
                                            }}
                                        />
                                        {formik.touched.category && formik.errors.category ? (
                                            <div className="text-red-500 text-[0.8rem] font-semibold italic">*{formik.errors.category}</div>
                                        ) : null}

                                    </div>


                                    {/* AutoComplete for quality */}
                                    <div className='flex flex-col items-start gap-2'>

                                        <AutoComplete
                                            placeholder={"Enter quality"}
                                            users={getFilteredItems(qualityData, formik.values.category)}
                                            values={formik.values.quality}
                                            selectionChange={(value) => formik.setFieldValue('quality', value)}
                                        />
                                        {formik.touched.quality && formik.errors.quality ? (
                                            <div className="text-red-500 text-[0.8rem] font-semibold italic">*{formik.errors.quality}</div>
                                        ) : null}
                                    </div>

                                    {/* AutoComplete for design */}
                                    <div className='flex flex-col items-start gap-2'>

                                        <AutoComplete
                                            placeholder={"Enter design"}
                                            users={getFilteredItems(designData, formik.values.category)}
                                            values={formik.values.design}
                                            selectionChange={(value) => formik.setFieldValue('design', value)}
                                        />
                                        {formik.touched.design && formik.errors.design ? (
                                            <div className="text-red-500 text-[0.8rem] font-semibold italic">*{formik.errors.design}</div>
                                        ) : null}
                                    </div>

                                    {/* AutoComplete for weave */}
                                    <div className='flex flex-col items-start gap-2'>

                                        <AutoComplete
                                            placeholder={"Enter weave"}
                                            users={weaveData}
                                            values={formik.values.weave}
                                            selectionChange={(value) => formik.setFieldValue('weave', value)}
                                        />
                                        {formik.touched.weave && formik.errors.weave ? (
                                            <div className="text-red-500 text-[0.8rem] font-semibold italic">*{formik.errors.weave}</div>
                                        ) : null}

                                    </div>
                                    {/* AutoComplete for remarks
                                    <AutoComplete
                                        placeholder={"Enter remarks"}
                                        users={users}
                                        values={formik.values.remarks}
                                        selectionChange={(value) => formik.setFieldValue('remarks', value)}
                                    />
                                    {formik.touched.remarks && formik.errors.remarks ? (
                                        <div className="text-red-500">{formik.errors.remarks}</div>
                                    ) : null} */}

                                    {/* AutoComplete for width */}
                                    <div className='flex flex-col items-start gap-2'>

                                        <AutoComplete
                                            placeholder={"Enter width"}
                                            users={getFilteredItems(widthData, formik.values.category)}
                                            values={formik.values.width}
                                            selectionChange={(value) => formik.setFieldValue('width', value)}
                                        />
                                        {formik.touched.width && formik.errors.width ? (
                                            <div className="text-red-500 text-[0.8rem] font-semibold italic">*{formik.errors.width}</div>
                                        ) : null}
                                    </div>

                                    {/* AutoComplete for finish Type */}
                                    <div className='flex flex-col items-start gap-2'>

                                        <AutoComplete
                                            placeholder={"Enter finish Type"}
                                            users={getFilteredItems(finishTypeData, formik.values.category)}
                                            values={formik.values.finishtype}
                                            selectionChange={(value) => formik.setFieldValue('finishtype', value)}
                                        />
                                        {formik.touched.finishtype && formik.errors.finishtype ? (
                                            <div className="text-red-500 text-[0.8rem] font-semibold italic">*{formik.errors.finishtype}</div>
                                        ) : null}

                                    </div>
                                    {/* AutoComplete for feel Type */}
                                    <div className='flex flex-col items-start gap-2'>

                                        <AutoComplete
                                            placeholder={"Enter feel Type"}
                                            users={getFilteredItems(feelTypeData, formik.values.category)}
                                            values={formik.values.feeltype}
                                            selectionChange={(value) => formik.setFieldValue('feeltype', value)}
                                        />
                                        {formik.touched.feeltype && formik.errors.feeltype ? (
                                            <div className="text-red-500 text-[0.8rem] font-semibold italic">*{formik.errors.feeltype}</div>
                                        ) : null}

                                    </div>
                                    {/* Input for Prce Per piece */}
                                    <div className='flex flex-col items-start gap-2'>
                                        <div className='flex gap-2 h-full items-center'>
                                            Rs.
                                            <input
                                                type="number"
                                                value={formik.values?.pricePerUnit?.magnitude}
                                                onChange={(e) => formik.setFieldValue('pricePerUnit.magnitude', e.target.value)}
                                                onBlur={formik.handleBlur}
                                                id="pricePerUnit"
                                                name="pricePerUnit"
                                                className='border h-full outline-none w-[180px] px-2'
                                                placeholder='Price per Piece'
                                            />
                                            /
                                            <div>
                                                <AutoComplete
                                                    placeholder={"Unit"}
                                                    users={units}
                                                    values={formik.values?.pricePerUnit?.unit}
                                                    selectionChange={(value) => formik.setFieldValue('pricePerUnit.unit', value)}
                                                />

                                            </div>
                                        </div>
                                        {/* <Input
                                            type="number"
                                            placeholder="Price Per Piece (in rs.)"
                                            labelPlacement="outside"
                                            classNames={{
                                                label: '!text-[#fff]  font-font1',
                                                base: "max-w-[272px]",
                                                input: 'font-font1 text-[1rem]',
                                                inputWrapper: "h-[48px]  w-full",
                                            }}
                                            variant="flat"
                                            id="pricePerPiece"
                                            name="pricePerPiece"
                                            value={formik.values.pricePerPiece}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        /> */}
                                        {formik.touched.pricePerUnit && formik.errors.pricePerUnit ? (
                                            <div className="text-red-500 text-[0.8rem] font-semibold italic">
                                                *{formik.errors.pricePerUnit}
                                            </div>
                                        ) : null}
                                    </div>
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
