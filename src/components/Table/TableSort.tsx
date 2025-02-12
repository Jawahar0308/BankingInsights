import React from 'react';

interface TableSortProps {
    onSort: () => void;
    label: string;
}

const TableSort: React.FC<TableSortProps> = ({ onSort, label }) => {
    return (
        <button onClick={onSort} className="text-blue-500">
            {label}
        </button>
    );
};

export default TableSort;
