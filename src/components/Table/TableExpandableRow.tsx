import React, { useState } from 'react';

interface ExpandableRowProps {
    rowData: any;
    children: React.ReactNode;
}

const TableExpandableRow: React.FC<ExpandableRowProps> = ({ rowData, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <tr onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
                <td colSpan={7}>
                    {isOpen ? "Hide Details" : "Show Details"}
                </td>
            </tr>
            {isOpen && (
                <tr>
                    <td colSpan={7}>
                        <div>{children}</div>
                    </td>
                </tr>
            )}
        </>
    );
};

export default TableExpandableRow;
