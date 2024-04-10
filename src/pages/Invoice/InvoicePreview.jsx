import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
// import { GetInvoiceByID } from '../apicalls/invoice';
// import { message } from 'antd';
// import { BiDownload } from 'react-icons/bi';
// import { BsCurrencyRupee } from 'react-icons/bs';
import logo from '../../assets/textile.jpg';

const InvoicePreview = () => {
    const params = useParams();
    const url = params.id;

    const [invoice, setInvoice] = useState(

        {
            "_id": "661622790a4aead4c09e66cf",
            "products": [
                {
                    "product": "65ffcc0bfbaf6795f9f203d9",
                    "cut": "65ffc79ffbaf6795f9f20310",
                    "remarkDesc": "dsf",
                    "qtyPcs": "21",
                    "qtyMtr": 42,
                    "unit": "2",
                    "challanChartImages": [],
                    "price": 66,
                    "overall": 2772,
                    "_id": "661622790a4aead4c09e66d0"
                },
                {
                    "product": "65ffc687fbaf6795f9f202a9",
                    "cut": "65ffc78ffbaf6795f9f2030e",
                    "remarkDesc": "sfdfs",
                    "qtyPcs": "43",
                    "qtyMtr": 77,
                    "unit": "1",
                    "challanChartImages": [],
                    "price": 80,
                    "overall": 3440,
                    "_id": "661622790a4aead4c09e66d1"
                }
            ],
            "supplier": {
                "_id": "65dade538fae38403c5d86d4",
                "name": "Premium Mill Pvt. Ltd.",
                "brand": "Premium",
                "address": "Balotra",
                "experienced": true,
                "verified": true,
                "avatar": "https://i.pinimg.com/564x/05/4c/b1/054cb148f9a8ef419b55166e0ce4dd64.jpg",
                "createdAt": "2024-02-25T06:28:35.491Z",
                "__v": 0
            },
            "customer": {
                "_id": "66112d4a7e38f923a92fa943",
                "name": "Shri Ram Textile",
                "companyName": "Neemuch",
                "createdAt": "2024-04-06T10:19:34.520Z",
                "__v": 0
            },
            "challanNo": "1",
            "totalBill": "6212",
            "challanDate": "2024-04-10T00:00:00.000Z",
            "type": "supplier",
            "verified": true,
            "overallremarks": "bvchfghf",
            "createdAt": "2024-04-10T05:12:38.845Z",
            "__v": 0
        }

    ); // Initialize with null
    // const componentRef = useRef();
    const handlePrint = () => {
        window.print();
    }

    return (
        <div>
            {invoice ? (
                <>
                    <section className='border text-black bg-[#e3e3e3] min-h-[100vh]'>
                        <div onClick={handlePrint} className=' w-fit text-sm text-white bg-[#202020] create cursor-pointer fixed bottom-5 right-[3.2%] py-2 px-4 rounded-full z-50'>Download</div>
                        <div className=' max-w-[1290px] mx-auto px-4 my-8'>
                            {/* Page starts here (down) */}
                            <div className='border bg-[#fdfdfd] p-8'>
                                <div className='flex  md:flex-row md:gap-0  items-center justify-between mt-[1rem] mb-[4rem]'>
                                    <div className='text-center md:text-left'>
                                        <p className='text-6xl text-black first-letter:mb-2 '>Invoice  </p>
                                        <p className='text-xl text-[#12121271]'>#1234</p>
                                    </div>
                                    <div className='print:bg-red-500 bg-[#121212] px-4 py-2 rounded-lg w-[10rem]'>
                                        <img src={logo} alt="" />
                                    </div>
                                </div>

                                {/* sender and client details */}
                                <div className=' grid grid-cols-1 md:grid-cols-3  border-[#2727278d]'>
                                    <div className='border-t border-b text-justify flex flex-col gap-6 py-6 col-span-1 px-4 border-[#2727278d]'>
                                        <div className='flex flex-col gap-3'>
                                            <p className='text-xl text-black'>Issued on</p>
                                            <p className='text-[#0000007f] font-extrabold'> {invoice.createdAt}</p>
                                        </div>
                                        <div className='flex flex-col gap-3'>
                                            <p className='text-xl text-black'>Due on</p>
                                            {/* <p className='text-[#0000007f] font-extrabold'>
                                                {
                                                    invoice.payment_status ? <span className='text-green-500'>Paid</span> :
                                                        moment(invoice.createdAt).add(15, 'days').format("DD MMM YYYY")
                                                }
                                            </p> */}
                                        </div>
                                    </div>
                                    <div className=' md:border col-span-1 text-justify py-6 px-4 border-[#2727278d]'>
                                        <div className='flex flex-col gap-3 '>
                                            <p className='text-xl'>Billed to</p>
                                            <div className='text-[#0000007f] text-lg font-extrabold'>
                                                <p className='text-[#000000aa]'>{invoice.customer.name}</p>
                                                <p>{invoice.customer.companyName}</p>
                                                {/* <p>{invoice.client_city} , {invoice.client_state}</p>
                                                <p>Tel No. : {invoice.client_no}</p> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='border-t border-b text-justify py-6 col-span-1 px-4 border-[#2727278d]'>
                                        <div className='flex flex-col gap-3'>
                                            <p className='text-xl'>From</p>
                                            <div className='text-[#0000007f] text-lg font-extrabold'>
                                                <p className='text-[#000000aa]'>{invoice.supplier.name}</p>
                                                <p>{invoice.supplier.address}</p>
                                                <p>{invoice.supplier.brand} </p>
                                                {/* <p>Tel No. : {invoice.sender_no}</p> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Services */}
                                <div>
                                    <table className="border-collapse mt-6 w-full border border-[#2727278d]">
                                        <thead>
                                            <tr className="border-2 border-[#2727278d]  text-[0.8rem] font-normal p-6 ">
                                                {invoice &&
                                                    Object.entries(invoice?.products[0]).map(
                                                        ([key, value], index) => {
                                                            console.log(key);
                                                            if (key === "challanChartImages" || key === "_id") {
                                                                return;
                                                            }
                                                            return (
                                                                <th className="p-4" key={index}>
                                                                    {key.toUpperCase()}
                                                                </th>
                                                            );
                                                        }
                                                    )}
                                                <th>RECIEVED</th>
                                                <th>DUE</th>
                                            </tr>

                                        </thead>
                                        <tbody>
                                            {invoice?.products &&
                                                invoice?.products?.map((row, rowIndex) => (
                                                    // console.log(row)
                                                    <tr
                                                        className="border-2 text-[0.9rem] border-[#2727278d] max-h-[6rem] mt-2"
                                                        key={rowIndex}
                                                    >
                                                        {Object.entries(row).map(
                                                            ([key, value], cellIndex) => {
                                                                if (key === "challanChartImages"|| key === "_id") {
                                                                    return;
                                                                }
                                                                return (
                                                                    <td className="p-4 border-[#2727278d]" key={cellIndex}>
                                                                        {key.toLowerCase() ===
                                                                            "challanChartImages"
                                                                            ? null
                                                                            : value}
                                                                    </td>
                                                                );
                                                            }
                                                        )}
                                                        <td>RCVD</td>
                                                        <td className="mx-5" >due</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>

                                    {/* the subtotal wala part */}
                                    <section className='text-white grid grid-cols-1 justify-center border-t border-black py-8 md:grid-cols-3  md:gap-4 mb-[25rem]  mt-16'>
                                        <div className='col-span-2  text-black p-4  border-[#2f2f31]'>
                                            <div className='border border-black'>

                                                <p className='mb-2 text-black text-lg  jakarta-font relative bottom-4 left-2 bg-white w-fit px-2'>Remarks</p>

                                                <p className='mx-4 mb-4 text-justify'>{invoice.overallremarks}</p>
                                            </div>
                                            <div className='border border-black mt-8'>

                                                <p className='mb-2 text-black text-lg  jakarta-font relative bottom-4 left-2 bg-white w-fit px-2'>Notes</p>

                                                <p className='mx-4 mb-4 text-justify'>{invoice.totalBill}</p>
                                            </div>
                                        </div>

                                        {/* <div className='flex gap-4 border border-dashed border-[#121212] flex-col col-span-1 p-6 rounded-2xl '>
                                            <div className=' flex flex-col p-6 gap-4 rounded-2xl'>

                                                <div className='px-4 rounded-full  flex items-center justify-between h-fit py-3 text-black  border-black'>
                                                    <div className='text-base'>
                                                        Subtotal
                                                    </div>
                                                    <div className='flex items-center justify-center '>
                                                        <span className='text-green-500 mr-2'><BsCurrencyRupee /></span>

                                                        <p className='w-[5rem]'>{invoice.subTotal}</p>

                                                    </div>
                                                </div>

                                                <div className='px-4 rounded-full  flex flex-wrap items-center justify-between h-fit py-3 text-black  border-black'>
                                                    <div className='text-base'>
                                                        Tax
                                                    </div>
                                                    <div className='flex items-center justify-center '>
                                                        <span className='text-green-500 mr-2'>%</span>
                                                        <p className='w-[5rem]'>{invoice.tax}</p>

                                                    </div>
                                                </div>

                                                <div className='px-4 rounded-full  flex items-center justify-between h-fit py-3 text-black  border-black'>
                                                    <div className='text-base'>
                                                        Discount
                                                    </div>
                                                    <div className='flex items-center justify-center '>
                                                        <span className='text-green-500 mr-2'>%</span>

                                                        <p className='w-[5rem] '>{invoice.discount}</p>

                                                    </div>
                                                </div>

                                                <div className='px-4 rounded-   full  flex items-center justify-between h-fit py-3 text-black  border-black'>
                                                    <div className='text-base'>
                                                        Grand Total
                                                    </div>
                                                    <div className='flex items-center justify-center '>
                                                        <span className='text-green-500 mr-2 class'><BsCurrencyRupee /></span>

                                                        <p className='w-[5rem] '>{invoice.grandTotal.toFixed(2)}</p>

                                                    </div>
                                                </div>
                                            </div>

                                        </div> */}

                                    </section>


                                    {/* footer  */}
                                    <footer>
                                        <p>This is computer generated invoice , no signature required</p>
                                    </footer>


                                    {/* <footer>
                                        <div className='text-lg border-b pb-4 border-[#686868]'>Thank you for bussiness</div>

                                        <div className='flex items-center  mt-3 py-4   justify-between'>
                                            <div>Itx 3D Studio</div>
                                            <div>7451152182</div>
                                            <div>itx3dstudio@gmail.com</div>
                                        </div>
                                    </footer> */}

                                </div>
                            </div>
                        </div>
                    </section>
                </>
            ) : (
                <p>Loading invoice data...</p>
            )}
        </div>
    );
};

export default InvoicePreview;