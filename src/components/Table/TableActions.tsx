import React from 'react';

interface TableActionsProps {
    onEdit: () => void;
    onDelete: () => void;
    onExport: () => void;
    onView: () => void;
}

const TableActions: React.FC<TableActionsProps> = ({ onEdit, onDelete, onExport, onView }) => {
    return (
        <div className="flex space-x-4">
            <button onClick={onEdit} className="bg-yellow-500 text-white px-4 py-2 rounded">
                Edit
            </button>
            <button onClick={onDelete} className="bg-red-500 text-white px-4 py-2 rounded">
                Delete
            </button>
            <button onClick={onExport} className="bg-green-500 text-white px-4 py-2 rounded">
                Export
            </button>
            <button onClick={onView} className="bg-blue-500 text-white px-4 py-2 rounded">
                View
            </button>
        </div>
    );
};

export default TableActions;
