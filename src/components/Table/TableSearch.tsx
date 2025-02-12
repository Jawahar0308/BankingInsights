import React from 'react';

interface TableSearchProps {
    onSearch: (value: string) => void;
}

const TableSearch: React.FC<TableSearchProps> = ({ onSearch }) => {
    return (
        <div className="mb-4">
            <input
                type="text"
                placeholder="Search..."
                onChange={(e) => onSearch(e.target.value)}
                className="border border-gray-300 p-2 rounded"
            />
        </div>
    );
};

export default TableSearch;
