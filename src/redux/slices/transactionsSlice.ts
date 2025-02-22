import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '../../types/transactionTypes';

interface TransactionsState {
    data: Transaction[];
    isLoading: boolean;
    error: string | null;
}

const initialState: TransactionsState = {
    data: [],
    isLoading: false,
    error: null
};

const transactionsSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        setTransactions: (state, action: PayloadAction<Transaction[]>) => {
            state.data = action.payload.map(txn => ({
                ...txn,
                childTable: {
                    relatedTransactions: txn.childTable?.relatedTransactions || []
                }
            }));
            state.isLoading = false;
            state.error = null;
        }
        ,
        deleteTransaction: (state, action: PayloadAction<number>) => {
            state.data = state.data.filter(txn => txn.id !== action.payload);
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        }
    }
});


export const { setTransactions, deleteTransaction, setLoading, setError } = transactionsSlice.actions;
export default transactionsSlice.reducer;
