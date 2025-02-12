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
            state.data = action.payload; // Assign payload (array of transactions) to the state
        },
    },
});

export const { setTransactions } = transactionsSlice.actions;
export default transactionsSlice.reducer;
