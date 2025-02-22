import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TableState {
    selectedRows: string[];
    currentPage: number;
    rowOrder: string[];
    originalOrder: string[]; // Store the original order to sync sorting & drag-drop
}

const initialState: TableState = {
    selectedRows: [],
    currentPage: 1,
    rowOrder: [],
    originalOrder: [], // Keep a backup of original row order
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
            state.currentPage = action.payload;
        },
        moveRow(state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) {
            const { fromIndex, toIndex } = action.payload;
            if (fromIndex !== toIndex) {
                const newRowOrder = [...state.rowOrder];
                const [movedRow] = newRowOrder.splice(fromIndex, 1);
                newRowOrder.splice(toIndex, 0, movedRow);
                state.rowOrder = newRowOrder;
            }
        },
        setRowOrder(state, action: PayloadAction<string[]>) {
            state.rowOrder = action.payload;
            state.originalOrder = [...action.payload]; // Keep original order
        },
        sortRows(state, action: PayloadAction<{ sortedData: string[] }>) {
            state.rowOrder = action.payload.sortedData;
            state.originalOrder = [...action.payload.sortedData]; // Update backup
        },
        resetRowOrder(state) {
            state.rowOrder = [...state.originalOrder]; // Restore original order after sorting
        },
    },
});

export const { selectRow, setCurrentPage, moveRow, setRowOrder, sortRows, resetRowOrder } = tableSlice.actions;
export default tableSlice.reducer;
