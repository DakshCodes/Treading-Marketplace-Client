import React from 'react'
import './Dashboard.css'
import { Tabs, Tab, Chip } from "@nextui-org/react";
import { UilCube, UilUsersAlt } from '@iconscout/react-unicons'
import ProductPage from '../../components/ProductPage/ProductPage';
import Suppliers from '../../components/Suppliers/Suppliers';

const Dashboard = () => {
    return (
        <div className='inventory-main '>
            <div className="flex w-full flex-col ">
                <Tabs
                    aria-label="Options"
                    color="secondary"
                    variant="underlined"
                    classNames={{
                        tabList: "gap-6 w-full ml-3 relative rounded-none p-0 border-b border-divider",
                        cursor: "w-full bg-[#000]",
                        tab: "max-w-fit px-0 h-12 font-font1",
                        tabContent: "group-data-[selected=true]:text-[#000]"
                    }}
                >
                    <Tab
                        key="Products"
                        title={
                            <div className="flex items-center space-x-2 ">
                                <UilCube />
                                <span>Products</span>
                                <Chip size="sm" variant="faded">0</Chip>
                            </div>
                        }
                        className="max-h-max px-5 "
                    >
                        <ProductPage />
                    </Tab>
                    <Tab
                        key="Suppliers"
                        title={
                            <div className="flex items-center space-x-2 ">
                                <UilUsersAlt />
                                <span>Suppliers</span>
                                <Chip size="sm" variant="faded">0</Chip>
                            </div>
                        }
                        className="max-h-max px-5 "
                    >
                        <Suppliers />
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}

export default Dashboard
