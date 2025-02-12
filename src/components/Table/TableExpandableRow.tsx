import React, { useState } from 'react';

interface TableExpandableRowProps {
    details: string;
}

const TableExpandableRow: React.FC<TableExpandableRowProps> = ({ details }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <tr>
            <td colSpan={8}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-blue-500"
                >
                    {isOpen ? 'Hide Details' : 'Show Details'}
                </button>
                {isOpen && <div className="mt-2">{details}</div>}
            </td>
        </tr>
    );
};

export default TableExpandableRow;
