import React from 'react';

const TableSearch: React.FC<{ onSearch: (value: string) => void }> = ({ onSearch }) => {
    return (
        <input
            type="text"
            placeholder="Search..."
            onChange={(e) => onSearch(e.target.value)}
            className="p-2 border rounded"
        />
    );
};

export default TableSearch;
