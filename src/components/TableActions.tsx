import React from "react";

interface Transaction {
    id: number | null; // Allow id to be null
    method: string;
}

interface TableActionProps {
    transaction: Transaction;
    isExpanded: boolean;
    onToggleExpand: (id: number) => void;
}

const TableAction: React.FC<TableActionProps> = ({ transaction, isExpanded, onToggleExpand }) => {
    const handleToggleExpand = (id: number | null) => {
        if (id !== null) {
            onToggleExpand(id);
        }
    };
    return (
        <button
            className={`px-2 py-1 text-white rounded cursor-pointer ${isExpanded ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`}
            onClick={() => handleToggleExpand(transaction.id)}
        >
            {isExpanded ? "Cancel" : "View"}
        </button>
    );
};

export default TableAction;
