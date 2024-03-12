import React from 'react'
import { Tabs, Tab, Chip } from "@nextui-org/react";
import { productsDataState } from '../../store/product/productAtom';
import { useRecoilValue } from 'recoil';

import { FaUserAlt } from "react-icons/fa";
import CustomerPage from '../../components/CustomerPage/CustomerPage';
import { customerDataState } from '../../store/customer/customerAtom';

const Customer = () => {

    const customersData = useRecoilValue(customerDataState);
 


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
                        key="customers"
                        title={
                            <div className="flex items-center space-x-2 ">
                                <FaUserAlt/>
                                <span>Customers</span>
                                <Chip size="sm" variant="light">{customersData?.length}</Chip>
                            </div>
                        }
                        className="max-h-max px-5 "
                    >
                        <CustomerPage />
                    </Tab>
                    
                </Tabs>
            </div>
        </div>
    )
}

export default Customer
