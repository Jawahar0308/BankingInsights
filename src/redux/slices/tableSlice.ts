import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TableState {
    selectedRows: string[];
    currentPage: number; // Track the current page for pagination
    rowOrder: string[]; // Track the order of rows for drag and drop
}

const initialState: TableState = {
    selectedRows: [],
    currentPage: 1, // Default to the first page
    rowOrder: [], // Initialize empty row order
};

const tableSlice = createSlice({
    name: 'table',
    initialState,
    reducers: {
        selectRow(state, action: PayloadAction<string>) {
            const id = action.payload;
            if (state.selectedRows.includes(id)) {
                state.selectedRows = state.selectedRows.filter((row) => row !== id);
            } else {
                state.selectedRows.push(id);
            }
        },
        setCurrentPage(state, action: PayloadAction<number>) {
            state.currentPage = action.payload; // Set the current page
        },
        moveRow(state, action: PayloadAction<{ fromIndex: number, toIndex: number }>) {
            const { fromIndex, toIndex } = action.payload;
            const [movedRow] = state.rowOrder.splice(fromIndex, 1);
            state.rowOrder.splice(toIndex, 0, movedRow);
        },
        setRowOrder(state, action: PayloadAction<string[]>) {
            state.rowOrder = action.payload;
        },
    },
});

export const { selectRow, setCurrentPage, moveRow, setRowOrder } = tableSlice.actions;
export default tableSlice.reducer;
