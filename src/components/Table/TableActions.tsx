import React from "react";
// import TableImageRenderer from "./TableImageRenderer";
// import TableBadges from "./TableBadges";
// import TableChild from "./TableChild";

interface Transaction {
    id: number;
    method: string;
}

interface TableActionProps {
    transaction: Transaction;
    isExpanded: boolean;
    onToggleExpand: (id: number) => void;
}

const TableAction: React.FC<TableActionProps> = ({ transaction, isExpanded, onToggleExpand }) => {
    return (
        <button
            className={`px-2 py-1 text-white rounded cursor-pointer ${isExpanded ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`}
            onClick={() => onToggleExpand(transaction.id)}
        >
            {isExpanded ? "Cancel" : "View"}
        </button>
    );
};

export default TableAction;

