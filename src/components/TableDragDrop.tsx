import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { setRowOrder } from '../redux/slices/transactionsSlice';

export interface DragDropHandlers {
    onDragStart: (e: React.DragEvent<HTMLTableRowElement>, index: number) => void;
    onDragOver: (e: React.DragEvent<HTMLTableRowElement>) => void;
    onDragLeave: (e: React.DragEvent<HTMLTableRowElement>) => void;
    onDrop: (e: React.DragEvent<HTMLTableRowElement>, targetIndex: number) => void;
    onDragEnd: (e: React.DragEvent<HTMLTableRowElement>) => void;
}

export const useDragDrop = (currentState: any[], onReorder: (newState: any[]) => void) => {
    const dispatch = useDispatch();
    const [items, setItems] = useState(currentState);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    useEffect(() => {
        if (JSON.stringify(items) !== JSON.stringify(currentState)) {
            setItems(currentState);
            dispatch(setRowOrder(currentState.map((_, index) => index)));

        }
    }, [currentState, dispatch]);

    const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
        if (index === undefined || isNaN(index)) {
            console.error("Invalid drag: Undefined index", index);
            return;
        }

        e.stopPropagation();
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("rowIndex", index.toString());  // Store index, not ID

        setDraggedIndex(index);
        e.currentTarget.classList.add("dragging");
        document.body.style.cursor = "grabbing";
        console.log("Dragging Row Index:", index);
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
        if (!rowIndexData) {
            console.error("Drop aborted: Missing rowIndex data.");
            return;
        }

        const sourceIndex = parseInt(rowIndexData, 10);
        console.log("Source Index:", sourceIndex, " ➡ Target Index:", targetIndex);

        if (isNaN(sourceIndex) || sourceIndex < 0 || sourceIndex >= items.length) {
            console.error("Invalid source index, drop aborted.");
            return;
        }

        if (sourceIndex !== targetIndex) {
            const newItems = [...items];
            const [movedItem] = newItems.splice(sourceIndex, 1);
            newItems.splice(targetIndex, 0, movedItem);

            setItems(newItems);
            dispatch(setRowOrder(currentState.map((_, index) => index)));
            onReorder(newItems);
        }

        setDraggedIndex(null);
        e.currentTarget.classList.remove("drag-over-top", "drag-over-bottom");
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
