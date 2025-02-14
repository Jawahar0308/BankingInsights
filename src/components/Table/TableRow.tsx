import React from "react";
import TableAction from "./TableActions";
import TableImageRenderer from "./TableImageRenderer";
import TableBadges from "./TableBadges";
import TableChild from "./TableChild";

interface TableRowProps {
    rowData: {
        id: string;
        date: string;
        amount: string;
        accountNumber: string;
        type: string;
        paymentMethod: string;
        status: string[];
        remarks: string;
        relatedTransactions?: {
            id: string;
            date: string;
            amount: string;
            type: string;
            status: string;
        }[];
    };
}

const TableRow: React.FC<TableRowProps> = ({ rowData }) => {
    return (
        <>
            <tr className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{rowData.id}</td>
                <td className="px-4 py-2">{rowData.date}</td>
                <td className="px-4 py-2">${rowData.amount}</td>
                <td className="px-4 py-2">{rowData.accountNumber}</td>
                <td className="px-4 py-2">{rowData.type}</td>
                <td className="px-4 py-2">
                    <TableImageRenderer method={rowData.paymentMethod} />
                </td>
                <td className="px-4 py-2">
                    <TableBadges statuses={rowData.status} />
                </td>
                <td className="px-4 py-2">{rowData.remarks}</td>
                <td className="px-4 py-2">
                    <TableAction transactionId={rowData.id} status={rowData.status[0]} />
                </td>
            </tr>
            <tr>
                <td colSpan={9}>
                    <TableChild relatedTransactions={rowData.relatedTransactions} />
                </td>
            </tr>
        </>
    );
};

export default TableRow;
