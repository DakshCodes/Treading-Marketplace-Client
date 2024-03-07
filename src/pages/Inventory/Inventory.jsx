import React from 'react'
import './Inventory.css'
import { Tabs, Tab, Chip } from "@nextui-org/react";
import { FaCut } from "react-icons/fa";
import { UilRuler,UilCube,UilArrowsHAlt , UilPalette, UilSlack, UilLightbulbAlt, UilCheckCircle, UilUsersAlt, UilFilter, UilCreateDashboard } from '@iconscout/react-unicons'
import ProductPage from '../../components/ProductPage/ProductPage';
import Suppliers from '../../components/Suppliers/Suppliers';
import Categories from '../../components/Categories/Categories';
import Quality from '../../components/Quality/Quality';
import Design from '../../components/Design/Design';
import FinishType from '../../components/Finish-Type/Finish-Type';
import FeelType from '../../components/Feel-Type/Feel-Type';
import Weave from '../../components/Weave/Weave';
import Width from '../../components/Width/Width';
import Unit from '../../components/unit/Unit';
import Cut from '../../components/cut/Cut';

const Inventory = () => {
    return (
        <div className='inventory-main '>
            <div className="flex w-full flex-col mt-2">
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
                    <Tab
                        key="Category"
                        title={
                            <div className="flex items-center space-x-2 ">
                                <UilCreateDashboard />
                                <span>Categories</span>
                                <Chip size="sm" variant="faded">0</Chip>
                            </div>
                        }
                        className="max-h-max px-5 "
                    >
                        <Categories />
                    </Tab>
                    <Tab
                        key="Quality"
                        title={
                            <div className="flex items-center space-x-2 ">
                                <UilFilter />
                                <span>Quality</span>
                                <Chip size="sm" variant="faded">0</Chip>
                            </div>
                        }
                        className="max-h-max px-5 "
                    >
                        <Quality />
                    </Tab>
                    <Tab
                        key="Design"
                        title={
                            <div className="flex items-center space-x-2 ">
                                <UilPalette />
                                <span>Design</span>
                                <Chip size="sm" variant="faded">0</Chip>
                            </div>
                        }
                        className="max-h-max px-5 "
                    >
                        <Design />
                    </Tab>
                    <Tab
                        key="Finsh-Type"
                        title={
                            <div className="flex items-center space-x-2 ">
                                <UilCheckCircle />
                                <span>Finsh-Type</span>
                                <Chip size="sm" variant="faded">0</Chip>
                            </div>
                        }
                        className="max-h-max px-5 "
                    >
                        <FinishType />
                    </Tab>
                    <Tab
                        key="Feel-Type"
                        title={
                            <div className="flex items-center space-x-2 ">
                                <UilLightbulbAlt />
                                <span>Feel-Type</span>
                                <Chip size="sm" variant="faded">0</Chip>
                            </div>
                        }
                        className="max-h-max px-5 "
                    >
                        <FeelType />
                    </Tab>
                    <Tab
                        key="Weave"
                        title={
                            <div className="flex items-center space-x-2 ">
                                <UilSlack />
                                <span>Weave</span>
                                <Chip size="sm" variant="faded">0</Chip>
                            </div>
                        }
                        className="max-h-max px-5 "
                    >
                        <Weave />
                    </Tab>
                    <Tab
                        key="Width"
                        title={
                            <div className="flex items-center space-x-2 ">
                                <UilArrowsHAlt  />
                                <span>Width</span>
                                <Chip size="sm" variant="faded">0</Chip>
                            </div>
                        }
                        className="max-h-max px-5 "
                    >
                        <Width />
                    </Tab>
                    <Tab
                        key="Unit"
                        title={
                            <div className="flex items-center space-x-2 ">
                              <UilRuler/>
                                <span>Unit</span>
                                <Chip size="sm" variant="faded">0</Chip>
                            </div>
                        }
                        className="max-h-max px-5 "
                    >
                        <Unit />
                    </Tab>
                    <Tab
                        key="Cut"
                        title={
                            <div className="flex items-center space-x-2 ">
                              <FaCut/>
                                <span>Cut</span>
                                <Chip size="sm" variant="faded">0</Chip>
                            </div>
                        }
                        className="max-h-max px-5 "
                    >
                        <Cut />
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}

export default Inventory
