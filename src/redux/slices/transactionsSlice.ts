import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TransactionsState {
    data: any[]; // Allow dynamic JSON structure
    isLoading: boolean;
    error: string | null;
    selectedRows: string[];
    currentPage: number;
    rowOrder: string[];
    originalOrder: string[];
}

const initialState: TransactionsState = {
    data: [], // Start with empty data, update dynamically
    isLoading: false,
    error: null,
    selectedRows: [],
    currentPage: 1,
    rowOrder: [],
    originalOrder: [],
};

const transactionsSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {
        setTransactions: (state, action: PayloadAction<any[]>) => {
            state.data = action.payload; // Store any JSON structure dynamically
            state.rowOrder = action.payload.map(txn => txn.id || ""); // Handle missing keys safely
            state.originalOrder = [...state.rowOrder]; // Store original order
            state.isLoading = false;
            state.error = null;
        },
        selectRow: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            if (state.selectedRows.includes(id)) {
                state.selectedRows = state.selectedRows.filter(row => row !== id);
            } else {
                state.selectedRows.push(id);
            }
        },
        setRowOrder: (state, action: PayloadAction<string[]>) => {
            state.rowOrder = action.payload;
        },
    }
});

export const { setTransactions, selectRow, setRowOrder } = transactionsSlice.actions;
export default transactionsSlice.reducer;
