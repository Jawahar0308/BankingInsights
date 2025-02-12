import React from 'react';

interface TableFreezeColumnProps {
    children: React.ReactNode;
}

const TableFreezeColumn: React.FC<TableFreezeColumnProps> = ({ children }) => {
    return <th className="sticky left-0 bg-white">{children}</th>;
};

export default TableFreezeColumn;
