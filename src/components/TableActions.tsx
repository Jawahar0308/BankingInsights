import React from "react";

interface Transaction {
    id: number | null; // Allow id to be null
    method: string;
}

interface TableActionProps {
    transaction: Transaction;
    isExpanded: boolean;
    onToggleExpand: (id: number) => void;
    onEdit: (id: number) => void; // New prop for handling edit action
}

const TableAction: React.FC<TableActionProps> = ({ transaction, isExpanded, onToggleExpand, onEdit }) => {
    const handleToggleExpand = (id: number | null) => {
        if (id !== null) {
            onToggleExpand(id);
        }
    };

    const handleEdit = (id: number | null) => {
        if (id !== null) {
            onEdit(id);
        }
    };

    return (
        <div className="flex items-center justify-center gap-2">
            <button
                className={`px-2 py-1 text-white rounded cursor-pointer ${isExpanded ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`}
                onClick={() => handleToggleExpand(transaction.id)}
            >
                {isExpanded ? "Cancel" : "View"}
            </button>
            <button
                className="px-2 py-1 text-white rounded cursor-pointer bg-green-500 hover:bg-green-600"
                onClick={() => handleEdit(transaction.id)}
            >
                Edit
            </button>
        </div>
    );
};

export default TableAction;
