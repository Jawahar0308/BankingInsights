import React from "react";

interface TableCheckboxProps {
    isChecked: boolean;
    onChange: (checked: boolean) => void;
    onMouseDown?: (e: React.MouseEvent) => void; // Add onMouseDown prop
}

const TableCheckbox: React.FC<TableCheckboxProps> = ({ isChecked, onChange, onMouseDown }) => {
    return (
        <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => onChange(e.target.checked)}
            onMouseDown={onMouseDown} // Pass it here
            className="h-5 w-5 text-blue-600 transition duration-150 ease-in-out border border-gray-400 rounded-sm checked:bg-blue-600 checked:border-transparent"
        />
    );
};

export default TableCheckbox;
