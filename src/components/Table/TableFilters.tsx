import React, { useState } from 'react';

interface TableFiltersProps {
    onFilter: (filter: string) => void;
}

const TableFilters: React.FC<TableFiltersProps> = ({ onFilter }) => {
    const [filterValue, setFilterValue] = useState('');

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterValue(event.target.value);
        onFilter(event.target.value);
    };

    return (
        <div className="mb-4">
            <input
                type="text"
                value={filterValue}
                onChange={handleFilterChange}
                placeholder="Filter by transaction type"
                className="border border-gray-300 p-2 rounded"
            />
        </div>
    );
};

export default TableFilters;
