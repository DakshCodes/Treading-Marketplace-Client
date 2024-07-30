import React, { useState, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { invoiceDataState } from '../../store/invoice/invoiceAtom';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Input, Select, SelectItem } from "@nextui-org/react";
import { customerDataState } from '../../store/customer/customerAtom';
import { suppliersDataState } from '../../store/supplier/supplierAtom';
import { productsDataState } from '../../store/product/productAtom';

export default function InvoiceReport() {
    const invoiceData = useRecoilValue(invoiceDataState);
    const customerData = useRecoilValue(customerDataState);
    const suppliersData = useRecoilValue(suppliersDataState);
    const productsData = useRecoilValue(productsDataState);

    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');
    const [supplierFilter, setSupplierFilter] = useState('');
    const [customerFilter, setCustomerFilter] = useState('');
    const [productFilter, setProductFilter] = useState('');

    const filteredProducts = useMemo(() => {
        return productsData.filter((x) => x.supplierName._id === supplierFilter);
    }, [productsData, supplierFilter]);

    const filteredInvoices = useMemo(() => {
        return invoiceData.filter(invoice => {
            const invoiceDate = new Date(invoice.invoiceDate);
            const startDate = startDateFilter ? new Date(startDateFilter) : null;
            const endDate = endDateFilter ? new Date(endDateFilter) : null;

            return (
                (!startDate || invoiceDate >= startDate) &&
                (!endDate || invoiceDate <= endDate) &&
                (supplierFilter === '' || invoice.supplierRef === supplierFilter) &&
                (customerFilter === '' || invoice.customerRef === customerFilter) &&
                (productFilter === '' || invoice.products.some(product => 
                    product.id === productFilter
                ))
            );
        });
    }, [invoiceData, startDateFilter, endDateFilter, supplierFilter, customerFilter, productFilter]);

    const renderProductCell = (products) => {
        const displayProducts = products.slice(0, 2);
        const remainingProducts = products.slice(2);

        return (
            <div>
                {displayProducts.map((product, index) => (
                    <div key={index}>{product.product}</div>
                ))}
                {remainingProducts.length > 0 && (
                    <Tooltip content={
                        <div>
                            {remainingProducts.map((product, index) => (
                                <div key={index}>{product.product}</div>
                            ))}
                        </div>
                    }>
                        <span>+{remainingProducts.length} more</span>
                    </Tooltip>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Invoice Report</h1>
            
            <div className="flex space-x-4">
                <Input
                    label="Start Date"
                    placeholder="YYYY-MM-DD"
                    value={startDateFilter}
                    onChange={(e) => setStartDateFilter(e.target.value)}
                    type="date"
                />
                <Input
                    label="End Date"
                    placeholder="YYYY-MM-DD"
                    value={endDateFilter}
                    onChange={(e) => setEndDateFilter(e.target.value)}
                    type="date"
                />
                <Select
                    label="Supplier"
                    placeholder="Select a supplier"
                    value={supplierFilter}
                    onChange={(e) => setSupplierFilter(e.target.value)}
                >
                    {suppliersData.map((supplier) => (
                        <SelectItem key={supplier._id} value={supplier._id}>
                            {supplier.name}
                        </SelectItem>
                    ))}
                </Select>
                <Select
                    label="Customer"
                    placeholder="Select a customer"
                    value={customerFilter}
                    onChange={(e) => setCustomerFilter(e.target.value)}
                >
                    {customerData.map((customer) => (
                        <SelectItem key={customer._id} value={customer._id}>
                            {customer.name}
                        </SelectItem>
                    ))}
                </Select>
                <Select
                    label="Product"
                    placeholder="Select a product"
                    value={productFilter}
                    onChange={(e) => setProductFilter(e.target.value)}
                    isDisabled={!supplierFilter}
                >
                    {filteredProducts.map((product) => (
                        <SelectItem key={product._id} value={product._id}>
                            {product.productName}
                        </SelectItem>
                    ))}
                </Select>
            </div>

            <Table aria-label="Invoice table">
                <TableHeader>
                    <TableColumn>Date</TableColumn>
                    <TableColumn>Supplier</TableColumn>
                    <TableColumn>Customer</TableColumn>
                    <TableColumn>Products</TableColumn>
                    <TableColumn>Total Amount</TableColumn>
                </TableHeader>
                <TableBody>
                    {filteredInvoices.map((invoice, index) => (
                        <TableRow key={index}>
                            <TableCell>{invoice.invoiceDate}</TableCell>
                            <TableCell>{suppliersData.find(s => s._id === invoice.supplierRef)?.name}</TableCell>
                            <TableCell>{customerData.find(c => c._id === invoice.customerRef)?.name}</TableCell>
                            <TableCell>{renderProductCell(invoice.products)}</TableCell>
                            <TableCell>{invoice.grandTotal}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
