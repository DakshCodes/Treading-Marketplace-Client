import React from 'react'

export default function Adjustment({ invoiceData }) {
  return (
    <div>
      <div className="container mx-auto py-6 px-4">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Number</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Products</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Debit</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adjust</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {
              invoiceData && invoiceData?.map((item, idx) => {
                return (
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item?.invoiceNo}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.products?.length}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">$1,000.00</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600">$200.00</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-red-600">$50.00</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600">$150.00</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
