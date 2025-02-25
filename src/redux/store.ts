import { configureStore } from '@reduxjs/toolkit';
import transactionsReducer from './slices/transactionsSlice';

export const store = configureStore({
    reducer: {
        transactions: transactionsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>; // Helps with useSelector()
export type AppDispatch = typeof store.dispatch; // Helps with useDispatch()
export default store;