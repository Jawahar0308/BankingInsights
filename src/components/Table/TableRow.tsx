import React, { useState } from 'react';

const TableRow = ({ rowData, onSave }: any) => {
    const [editing, setEditing] = useState(false);
    const [editedAmount, setEditedAmount] = useState(rowData.amount);

    const handleSave = () => {
        onSave(rowData.id, editedAmount);
        setEditing(false);
    };

    return (
        <tr>
            <td>{rowData.id}</td>
            <td>{rowData.date}</td>
            <td>
                {editing ? (
                    <input
                        type="number"
                        value={editedAmount}
                        onChange={(e) => setEditedAmount(Number(e.target.value))}
                    />
                ) : (
                    rowData.amount
                )}
            </td>
            <td>{rowData.account_number}</td>
            <td>{rowData.transaction_type}</td>
            <td>{rowData.payment_method}</td>
            <td>{rowData.status}</td>
            <td>{rowData.remarks}</td>
            <td>
                {editing ? (
                    <button onClick={handleSave}>Save</button>
                ) : (
                    <button onClick={() => setEditing(true)}>Edit</button>
                )}
            </td>
        </tr>
    );
};

export default TableRow;
