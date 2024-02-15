import React from 'react'
import DataTable from '../DataTable/DataTable';
import { useRecoilValue } from 'recoil';
import { productsDataState } from '../../store/product/productAtom';
 
const ProductPage = () => {

    // Data Format
    const columns = [
        { name: "ID", uid: "_id", sortable: true },
        { name: "Product Name", uid: "productName", sortable: true },
        { name: "Supplier Name", uid: "supplierName", sortable: true },
        { name: "Quality", uid: "quality", sortable: true },
        { name: "Category", uid: "category" },
        { name: "Design", uid: "design" },
        { name: "Weave", uid: "weave" },
        { name: "Width", uid: "width" },
        { name: "Finish type", uid: "finishtype" },
        { name: "Feel type", uid: "feeltype" },
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
        {
            id: 3,
            name: "Jane Fisher",
            role: "Sr. Dev",
            team: "Development",
            status: "active",
            age: "22",
            avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
            email: "jane.fisher@example.com",
        },
    ];

    const productsData = useRecoilValue(productsDataState);
    console.log(productsData)

    return (
        <>
            <DataTable columns={columns} statusOptions={statusOptions} users={users} section={'product'} />
        </>
    )
}

export default ProductPage
