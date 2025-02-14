import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '../../types/transactionTypes'; // Adjust path as necessary

interface TransactionsState {
    data: Transaction[];
}

const initialState: TransactionsState = {
    data: [],
};

const transactionsSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        setTransactions: (state, action: PayloadAction<Transaction[]>) => {
            state.data = action.payload;
        },
        deleteTransaction: (state, action: PayloadAction<number>) => {
            state.data = state.data.filter(txn => txn.id !== action.payload);
        }
    }

});

export const { setTransactions, deleteTransaction } = transactionsSlice.actions;
export default transactionsSlice.reducer;
