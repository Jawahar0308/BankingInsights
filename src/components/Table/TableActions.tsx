import React from 'react';

const TableActions: React.FC<{ onEdit: () => void, onDelete: () => void }> = ({ onEdit, onDelete }) => {
    return (
        <div>
            <button onClick={onEdit} className="bg-blue-500 text-white px-4 py-2 rounded">Edit</button>
            <button onClick={onDelete} className="bg-red-500 text-white px-4 py-2 rounded ml-2">Delete</button>
        </div>
    );
};

export default TableActions;
