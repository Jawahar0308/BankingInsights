import { useState } from 'react';

export const useSorting = (initialSortField = 'date', initialSortOrder = 'asc') => {
    const [sortField, setSortField] = useState(initialSortField);
    const [sortOrder, setSortOrder] = useState(initialSortOrder);

    const toggleSortOrder = () => {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    };

    const changeSortField = (field: string) => {
        setSortField(field);
    };

    const sorting = {
        sortField,
        sortOrder,
        toggleSortOrder,
        changeSortField,
    };

    return sorting;
};
