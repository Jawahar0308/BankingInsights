import React from 'react';

interface TableSearchProps {
    onSearch: (value: string) => void;
    placeholder?: string;
}

const TableSearch: React.FC<TableSearchProps> = ({ onSearch, placeholder }) => {
    return (
        <input
            type="text"
            placeholder={placeholder || "Search..."}
            onChange={(e) => onSearch(e.target.value)}
            className="p-1 border rounded text-sm w-full"
        />
    );
};

export default TableSearch;
