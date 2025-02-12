import { useState } from 'react';

export const useRowSelection = () => {
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

    const toggleSelection = (id: string) => {
        const newSelectedRows = new Set(selectedRows);
        if (newSelectedRows.has(id)) {
            newSelectedRows.delete(id);
        } else {
            newSelectedRows.add(id);
        }
        setSelectedRows(newSelectedRows);
    };

    const clearSelection = () => {
        setSelectedRows(new Set());
    };

    return {
        selectedRows,
        toggleSelection,
        clearSelection,
    };
};
