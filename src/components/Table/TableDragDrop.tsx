import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { setRowOrder } from '../../redux/slices/tableSlice';

export interface DragDropHandlers {
    onDragStart: (e: React.DragEvent<HTMLTableRowElement>, id: number) => void;
    onDragOver: (e: React.DragEvent<HTMLTableRowElement>) => void;
    onDragLeave: (e: React.DragEvent<HTMLTableRowElement>) => void;
    onDrop: (e: React.DragEvent<HTMLTableRowElement>, targetId: number) => void;
    onDragEnd: (e: React.DragEvent<HTMLTableRowElement>) => void;
}

export const useDragDrop = (currentState: any[], onReorder: (newState: any[]) => void) => {
    const dispatch = useDispatch();
    const [items, setItems] = useState(currentState);
    const [draggedId, setDraggedId] = useState<number | null>(null);

    useEffect(() => {
        setItems(currentState); // Ensure items are updated after sorting
        dispatch(setRowOrder(currentState.map(item => item.id))); // Sync row order with Redux
    }, [currentState]);

    const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, id: number) => {
        console.log("Drag started for item:", id); // Log the dragged item ID
        console.log("Current items:", items); // Log current items state
        console.log("Drag started for item:", id); // Log the dragged item ID
        e.stopPropagation();
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", id.toString());
        setDraggedId(id);
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

    const handleDrop = (e: React.DragEvent<HTMLTableRowElement>, targetId: number) => {
        console.log("Dropped item:", draggedId, "on target:", targetId); // Log the drop action
        console.log("Current items before drop:", items); // Log items before drop
        console.log("Dropped item:", draggedId, "on target:", targetId); // Log the drop action
        e.preventDefault();
        e.stopPropagation();
        const sourceId = parseInt(e.dataTransfer.getData("text/plain"), 10);

        if (!isNaN(sourceId) && sourceId !== targetId) {
            const newItems = [...items];
            const sourceIndex = newItems.findIndex((item) => item.id === sourceId);
            const targetIndex = newItems.findIndex((item) => item.id === targetId);

            if (sourceIndex === -1 || targetIndex === -1) return;

            const rect = e.currentTarget.getBoundingClientRect();
            const offset = e.clientY - rect.top;
            const insertBefore = offset < rect.height / 2;

            const [movedItem] = newItems.splice(sourceIndex, 1);
            newItems.splice(insertBefore ? targetIndex : targetIndex + 1, 0, movedItem);

            setItems(newItems);
            dispatch(setRowOrder(newItems.map(item => item.id))); // Update row order in Redux
            dispatch(setRowOrder(newItems.map(item => item.id))); // Update row order in Redux
            onReorder(newItems); // Notify parent of the new order
        }

        setDraggedId(null);
        e.currentTarget.classList.remove("drag-over-top", "drag-over-bottom");
    };

    const handleDragEnd = (e: React.DragEvent<HTMLTableRowElement>) => {
        setDraggedId(null);
        document.body.style.cursor = "";
        e.currentTarget.classList.remove("dragging");
    };

    return {
        onDragStart: handleDragStart,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onDrop: handleDrop,
        onDragEnd: handleDragEnd,
        draggedId,
    };
};
