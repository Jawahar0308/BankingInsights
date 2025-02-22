import { configureStore } from '@reduxjs/toolkit';
import transactionsReducer from './slices/transactionsSlice';
import tableReducer from './slices/tableSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
    reducer: {
        transactions: transactionsReducer,
        table: tableReducer,
        auth: authReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>; // Helps with useSelector()
export type AppDispatch = typeof store.dispatch; // Helps with useDispatch()
export default store;
