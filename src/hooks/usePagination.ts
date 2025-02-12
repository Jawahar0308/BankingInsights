import { useState } from 'react';

export const usePagination = (initialPage = 1, itemsPerPage = 10) => {
    const [currentPage, setCurrentPage] = useState(initialPage);

    const nextPage = () => setCurrentPage((prev) => prev + 1);
    const prevPage = () => setCurrentPage((prev) => prev - 1);

    const resetPage = () => setCurrentPage(1);

    const pagination = {
        currentPage,
        nextPage,
        prevPage,
        resetPage,
        itemsPerPage,
    };

    return pagination;
};
