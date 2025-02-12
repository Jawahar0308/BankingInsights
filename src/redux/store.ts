import { configureStore } from '@reduxjs/toolkit';
import transactionsReducer from './slices/transactionsSlice';
import reportsReducer from './slices/reportsSlice';
import tableReducer from './slices/tableSlice';

const store = configureStore({
    reducer: {
        transactions: transactionsReducer,
        reports: reportsReducer,
        table: tableReducer,
    },
});

// RootState is inferred from the store's state shape
export type RootState = ReturnType<typeof store.getState>;

// Dispatch type for dispatching actions
export type AppDispatch = typeof store.dispatch;

export default store;
