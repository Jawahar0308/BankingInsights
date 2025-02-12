import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Report } from '../../types/reportTypes';

interface ReportsState {
    data: Report[];
}

const initialState: ReportsState = {
    data: [],
};

const reportsSlice = createSlice({
    name: 'reports',
    initialState,
    reducers: {
        setReports(state, action: PayloadAction<Report[]>) {
            state.data = action.payload;
        },
    },
});

export const { setReports } = reportsSlice.actions;
export default reportsSlice.reducer;
