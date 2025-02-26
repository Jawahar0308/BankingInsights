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
            className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
        />
    );
};

export default TableCheckbox;
