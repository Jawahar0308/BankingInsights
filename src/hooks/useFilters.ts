import { useState } from 'react';

export const useFilters = (initialFilter = '') => {
    const [filter, setFilter] = useState(initialFilter);

    const updateFilter = (newFilter: string) => {
        setFilter(newFilter);
    };

    const resetFilter = () => {
        setFilter('');
    };

    const filtering = {
        filter,
        updateFilter,
        resetFilter,
    };

    return filtering;
};
