import React, { useState } from "react";

interface RelatedTransaction {
    id: number;
    date: string;
    amount: number;
    type: string;
    status: string;
}

interface TableChildProps {
    relatedTransactions?: RelatedTransaction[];
}

const TableChild: React.FC<TableChildProps> = ({ relatedTransactions = [] }) => {
    const [expanded, setExpanded] = useState(false);

    if (relatedTransactions.length === 0) return null;

    return (
        <div className="mt-2">
            <button onClick={() => setExpanded(!expanded)} className="text-blue-500 text-sm underline">
                {expanded ? "Hide Related Transactions" : "Show Related Transactions"}
            </button>

            {expanded && (
                <table className="mt-2 w-full text-sm border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-3 py-1 border">ID</th>
                            <th className="px-3 py-1 border">Date</th>
                            <th className="px-3 py-1 border">Amount</th>
                            <th className="px-3 py-1 border">Type</th>
                            <th className="px-3 py-1 border">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {relatedTransactions.map((txn) => (
                            <tr key={txn.id} className="text-gray-700 border-b text-center">
                                <td className="px-3 py-1 border">{txn.id}</td>
                                <td className="px-3 py-1 border">{txn.date}</td>
                                <td className="px-3 py-1 border">Rs.{txn.amount}</td>
                                <td className="px-3 py-1 border">{txn.type}</td>
                                <td className="px-3 py-1 border">{txn.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default TableChild;
