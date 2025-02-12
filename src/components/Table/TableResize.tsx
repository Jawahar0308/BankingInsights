import React, { useState } from 'react';

interface TableResizeProps {
    onResize: (width: number) => void;
}

const TableResize: React.FC<TableResizeProps> = ({ onResize }) => {
    const [width, setWidth] = useState(200);

    const handleMouseMove = (e: React.MouseEvent) => {
        setWidth(e.clientX);
        onResize(e.clientX);
    };

    return (
        <div
            style={{ width: `${width}px` }}
            onMouseMove={handleMouseMove}
            className="cursor-col-resize bg-gray-300"
        />
    );
};

export default TableResize;
