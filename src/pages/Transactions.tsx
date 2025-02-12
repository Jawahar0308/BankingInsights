import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const Transactions: React.FC = () => {
    const transactions = useSelector((state: RootState) => state.transactions);

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Transactions</h1>
            {/* Render transactions table */}
            <pre>{JSON.stringify(transactions, null, 2)}</pre>
        </div>
    );
};

export default Transactions;
