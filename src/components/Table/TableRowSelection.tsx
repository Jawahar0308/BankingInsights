import React from 'react';
import TableCheckbox from './TableCheckbox';

interface TableRowSelectionProps {
    isSelected: boolean;
    onSelect: () => void;
}

const TableRowSelection: React.FC<TableRowSelectionProps> = ({ isSelected, onSelect }) => {
    return (
        <td>
            <TableCheckbox isChecked={isSelected} onChange={onSelect} />
        </td>
    );
};

export default TableRowSelection;
