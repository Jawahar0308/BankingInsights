import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux'; // Reintroducing dispatch for row order updates
import { setRowOrder } from '../redux/slices/transactionsSlice';

export interface DragDropHandlers {
    onDragStart: (e: React.DragEvent<HTMLTableRowElement>, index: number) => void;
    onDragOver: (e: React.DragEvent<HTMLTableRowElement>) => void;
    onDragLeave: (e: React.DragEvent<HTMLTableRowElement>) => void;
    onDrop: (e: React.DragEvent<HTMLTableRowElement>, targetIndex: number) => void;
    onDragEnd: (e: React.DragEvent<HTMLTableRowElement>) => void;
}

export const useDragDrop = (currentState: any[], onReorder: (newState: any[]) => void) => {
    const dispatch = useDispatch(); // Reintroducing dispatch for row order updates
    const [items, setItems] = useState(currentState);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    useEffect(() => {
        if (JSON.stringify(items) !== JSON.stringify(currentState)) {
            setItems(currentState);
        }
    }, [currentState]);

    useEffect(() => {
        dispatch(setRowOrder(items.map((_, index) => index))); // Dispatching row order updates
    }, [items, dispatch]);


    const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
        e.stopPropagation();
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("rowIndex", index.toString()); // Store `orderIndex`
        setDraggedIndex(index);
        e.currentTarget.classList.add("dragging");
        document.body.style.cursor = "grabbing";
    };

    const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const target = e.currentTarget;
        const rect = target.getBoundingClientRect();
        const offset = e.clientY - rect.top;

        target.classList.remove("drag-over-top", "drag-over-bottom");
        if (offset < rect.height / 2) {
            target.classList.add("drag-over-top");
        } else {
            target.classList.add("drag-over-bottom");
        }
    };

    const handleDragLeave = (e: React.DragEvent<HTMLTableRowElement>) => {
        e.currentTarget.classList.remove("drag-over-top", "drag-over-bottom");
    };

    const handleDrop = (e: React.DragEvent<HTMLTableRowElement>, targetIndex: number) => {
        e.preventDefault();
        e.stopPropagation();

        const rowIndexData = e.dataTransfer.getData("rowIndex");
        if (!rowIndexData) return;

        const sourceIndex = parseInt(rowIndexData, 10);
        if (sourceIndex !== targetIndex) {
            const newItems = [...items];
            const [movedItem] = newItems.splice(sourceIndex, 1);
            newItems.splice(targetIndex, 0, movedItem);

            // Update orderIndex after dragging
            const reorderedItems = newItems.map((item, index) => ({
                ...item,
                orderIndex: index,
            }));

            setItems(reorderedItems); // Update local state
            onReorder(reorderedItems); // Notify parent component
            dispatch(setRowOrder(reorderedItems.map((_, index) => index))); // Dispatch order update
        }

        setDraggedIndex(null);
    };


    const handleDragEnd = (e: React.DragEvent<HTMLTableRowElement>) => {
        setDraggedIndex(null);
        document.body.style.cursor = "";
        e.currentTarget.classList.remove("dragging");
    };

    return {
        onDragStart: handleDragStart,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onDrop: handleDrop,
        onDragEnd: handleDragEnd,
        draggedIndex,
    };
};
