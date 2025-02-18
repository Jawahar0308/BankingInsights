import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { moveRow } from '../redux/slices/tableSlice';

export const useDragDrop = () => {
    const dispatch = useDispatch();
    const [draggedRowId, setDraggedRowId] = useState<string | null>(null);

    const handleDragStart = useCallback((rowId: string) => {
        setDraggedRowId(rowId);
    }, []);

    const handleDragEnd = useCallback(() => {
        setDraggedRowId(null);
    }, []);

    const handleDrop = useCallback((targetRowId: string, currentRowOrder: string[]) => {
        if (!draggedRowId) return;

        const fromIndex = currentRowOrder.indexOf(draggedRowId);
        const toIndex = currentRowOrder.indexOf(targetRowId);

        if (fromIndex !== toIndex) {
            dispatch(moveRow({ fromIndex, toIndex }));
        }
    }, [draggedRowId, dispatch]);

    return {
        draggedRowId,
        handleDragStart,
        handleDragEnd,
        handleDrop
    };
};
