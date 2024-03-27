import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Spinner } from "@nextui-org/react";



export default function FillterTableData({ rows, productref, setproductchange, columnsoffillter }) {

    const renderCell = React.useCallback((user, columnKey) => {
        console.log(columnKey)
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "productName":
                return (
                    <div className="flex flex-col text-tiny capitalize font-font1 font-[600]">
                        {user.productName || "NA"}
                    </div>
                );
            case "supplierName":
                return (
                    <div className="flex flex-col">
                        <p className="text-tiny capitalize font-font1 font-[600]">{user?.supplierName?.name || "NA"}</p>
                    </div>
                );
            case "pricePerUnit":
                return (
                    <div className="flex flex-col">
                        <p className="text-tiny capitalize font-font1 font-[600]">{user?.pricePerUnit?.magnitude || "NA"}</p>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);


    return (
        <Table
            aria-label="Controlled table example with dynamic content"
            selectionMode="single"
            selectedKeys={[productref]}
            onSelectionChange={(value) => setproductchange(value.currentKey)}
            classNames={{
                wrapper: "max-h-[200px] overflow-scroll",
                th: ["font-font1 font-[400]"],
            }}
        >
            <TableHeader columns={columnsoffillter}>
                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={rows}
                loadingContent={<Spinner color="white" />}
            >
                {(item) => (
                    <TableRow key={item._id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
