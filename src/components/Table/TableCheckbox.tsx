import React from 'react';

interface TableCheckboxProps {
    isChecked: boolean;
    onChange: () => void;
}

const TableCheckbox: React.FC<TableCheckboxProps> = ({ isChecked, onChange }) => {
    return (
        <input
            type="checkbox"
            checked={isChecked}
            onChange={onChange}
            className="form-checkbox"
        />
    );
};

export default TableCheckbox;
