import React from 'react';
import { Transaction } from '../../types/transactionTypes';

interface TableRowProps {
    transaction: Transaction;
}

const TableRow: React.FC<TableRowProps> = ({ transaction }) => {
    return (
        <tr>
            <td>{transaction.id}</td>
            <td>{transaction.date}</td>
            <td>{transaction.amount}</td>
            <td>{transaction.account_number}</td>
            <td>{transaction.transaction_type}</td>
            <td>{transaction.payment_method}</td>
            <td>{transaction.status}</td>
            <td>{transaction.remarks}</td>
        </tr>
    );
};

export default TableRow;
