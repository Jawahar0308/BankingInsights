import React, { useState } from "react";
import TableChild from "./TableChild";
import TableImageRenderer from "./TableImageRenderer";
import TableBadges from "./TableBadges";

interface TableActionProps {
    transactionId: number;
    status: string;
    paymentMethod: string;
    relatedTransactions?: { id: number; date: string; amount: number; type: string; status: string }[];  // Ensure this type is correct
    statuses: string[];
}

const TableAction: React.FC<TableActionProps> = ({ transactionId, status, paymentMethod, relatedTransactions = [], statuses }) => {
    const [expanded, setExpanded] = useState(false);

    const handleAction = () => {
        setExpanded(!expanded); // Toggle the visibility of the related transactions row
    };

    return (
        <div className="flex flex-col space-y-2">
            {/* Action Buttons */}
            <div className="flex space-x-2 mt-2">
                <button onClick={handleAction} className="px-2 py-1 text-blue-500 border rounded hover:bg-blue-100">
                    View
                </button>
                <button className="px-2 py-1 text-red-500 border rounded hover:bg-red-100">
                    Cancel
                </button>
            </div>

            {/* New Row for Related Transactions */}
            {expanded && relatedTransactions.length > 0 && (
                <tr className="text-gray-700 border-b">
                    <td colSpan={5} className="px-3 py-1">
                        <div className="space-y-2">
                            <div className="mb-4">
                                <TableImageRenderer method={paymentMethod} />
                            </div>
                            <TableBadges statuses={statuses} />
                            <TableChild relatedTransactions={relatedTransactions} />
                        </div>
                    </td>
                </tr>
            )}
        </div>
    );
};

export default TableAction;
