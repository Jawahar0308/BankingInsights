import { useCallback } from 'react';

export const useDragDrop = (moveRow: (fromIndex: number, toIndex: number) => void) => {
    const moveRowHandler = useCallback((fromIndex: number, toIndex: number) => {
        moveRow(fromIndex, toIndex);
    }, [moveRow]);

    return { moveRowHandler };
};
