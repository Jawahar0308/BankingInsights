import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

interface TableDragDropProps {
    id: string;
    index: number;
    moveRow: (fromIndex: number, toIndex: number) => void;
}

const TableDragDrop: React.FC<TableDragDropProps> = ({ id, index, moveRow }) => {
    const [, drag] = useDrag(() => ({
        type: 'ROW',
        item: { id, index },
    }));

    const [, drop] = useDrop(() => ({
        accept: 'ROW',
        hover: (item: { index: number }) => {
            if (item.index !== index) {
                moveRow(item.index, index);
            }
        },
    }));

    const combinedRef = (node: any) => {
        drag(node);
        drop(node);
    };

    return (
        <tr ref={combinedRef} className="cursor-move">
            {/* Table row content goes here */}
        </tr>
    );
};

export default TableDragDrop;
