import React from 'react'
import './ProductForm.css'
import { useParams } from 'react-router-dom';
import { Input } from "@nextui-org/react";
import AutoComplete from '../Autocomplete/AutoComplete';

const ProductPageForm = () => {
    const params = useParams();
    const productURL = params.id === 'new' ? null : params.id;

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

    return (
        <>
            <main className="demo-page-content">
                <div className="flex h-full overflow-auto max-w-fit">
                    <div className="w-max max-w-max bg-[#1f1e30] rounded-[24px] shadow-md p-6 overflow-auto">
                        <h2 className="text-3xl font-bold text-gray-200 mb-4 font-font2">Create Product</h2>
                        <form className="flex flex-wrap font-font1 flex-col gap-10 mt-5">
                            <div className="flex flex-col  gap-4">
                                <AutoComplete placeholder={"Supplier Name"} users={users} />
                                <br />
                                <div className="flex w-full flex-wrap justify-start mb-3 md:mb-0 gap-10 items-center">
                                    <Input
                                        type="email"
                                        placeholder="Product name..."
                                        labelPlacement="outside"
                                        classNames={{
                                            label: '!text-[#fff]  font-font1',
                                            base: "max-w-[250px] w-full",
                                            input: 'font-font1 text-[1rem]',
                                            inputWrapper: "h-[48px] max-w-[250px] w-full",
                                        }}
                                        variant="flat"

                                    />
                                    <AutoComplete placeholder={"Enter category"} users={users} />
                                    <AutoComplete placeholder={"Enter quality"} users={users} />
                                    <AutoComplete placeholder={"Enter design"} users={users} />
                                    <AutoComplete placeholder={"Enter weight"} users={users} />
                                    <AutoComplete placeholder={"Enter remarks"} users={users} />
                                    <AutoComplete placeholder={"Enter finishtype"} users={users} />
                                    <AutoComplete placeholder={"Enter feeltype"} users={users} />
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
