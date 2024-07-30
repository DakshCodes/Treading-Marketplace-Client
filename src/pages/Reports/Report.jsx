import React from 'react'
import ChallanReport from './ChallanReport'
import { Chip, Tab, Tabs } from '@nextui-org/react'
import Invoice from '../Invoice/Invoice';
import InvoiceReport from './InvoiceReport';

export default function Report() {
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
                        key="challan"
                        title={
                            <div className="flex items-center space-x-2 ">

                                <span>Challan Report</span>
                                <Chip size="sm" variant="light"></Chip>
                            </div>
                        }
                        className="max-h-max px-5 "
                    >
                        <ChallanReport />
                    </Tab>
                    <Tab
                        key="invoice"
                        title={
                            <div className="flex items-center space-x-2 ">
                                <span>Invoice Report</span>
                                <Chip size="sm" variant="light"></Chip>
                            </div>
                        }
                        className="max-h-max px-5 "
                    >
                        <InvoiceReport />
                    </Tab>

                </Tabs>
            </div>
        </div>
    );
}
