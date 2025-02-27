import React from "react";

interface Transaction {
    id: number | null; // Allow id to be null
    method: string;
}

interface TableActionsProps {
    transaction: Transaction; // Use the correct interface
    onEdit: (transaction: Transaction) => void; // Ensure proper type safety
    isExpanded: boolean;
    onToggleExpand: (id: number) => void; // Expect id to toggle
}

const TableActions: React.FC<TableActionsProps> = ({ transaction, isExpanded, onToggleExpand, onEdit }) => {
    const handleToggleExpand = () => {
        if (transaction.id !== null) {
            onToggleExpand(transaction.id); // Pass the transaction ID
        } else {
            console.warn("Transaction ID is null, cannot toggle expand.");
        }
    };

    const handleEdit = () => {
        console.log("Editing transaction:", transaction); // Debugging
        onEdit(transaction); // Pass the entire transaction object
    };

    return (
        <div className="flex items-center justify-center gap-2">
            <button
                className={`px-2 py-1 text-white rounded cursor-pointer ${isExpanded ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
                    }`}
                onClick={handleToggleExpand}
                disabled={transaction.id === null} // Disable button if id is null
            >
                {isExpanded ? "Cancel" : "View"}
            </button>
            <button
                className="px-2 py-1 text-white rounded cursor-pointer bg-green-500 hover:bg-green-600"
                onClick={handleEdit}
            >
                Edit
            </button>
        </div>
    );
};

export default TableActions;
