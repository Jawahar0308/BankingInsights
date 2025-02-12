import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TableState {
    selectedRows: string[];
    currentPage: number; // Track the current page for pagination
}

const initialState: TableState = {
    selectedRows: [],
    currentPage: 1, // Default to the first page
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
    },
});

export const { selectRow, setCurrentPage } = tableSlice.actions;
export default tableSlice.reducer;
