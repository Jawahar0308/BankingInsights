import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TransactionsState {
    data: any[]; // Dynamic JSON structure
    isLoading: boolean;
    error: string | null;
    selectedRows: (number | null)[]; // Store selected rows as numbers instead of strings
    currentPage: number;
    rowOrder: number[]; // Store row order as indexes instead of IDs
    originalOrder: number[];
}

const initialState: TransactionsState = {
    data: [],
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
            state.data = action.payload;

            // ✅ Store row order based on indexes instead of IDs
            state.rowOrder = action.payload.map((_, index) => index);
            state.originalOrder = [...state.rowOrder];

            state.isLoading = false;
            state.error = null;
        },
        selectRow: (state, action: PayloadAction<number | null>) => {
            const index = action.payload;
            if (state.selectedRows.includes(index)) {
                state.selectedRows = state.selectedRows.filter(row => row !== index);
            } else {
                state.selectedRows.push(index);
            }
        },
        setRowOrder: (state, action: PayloadAction<number[]>) => {
            state.rowOrder = action.payload;
        },
    }
});

export const { setTransactions, selectRow, setRowOrder } = transactionsSlice.actions;
export default transactionsSlice.reducer;
