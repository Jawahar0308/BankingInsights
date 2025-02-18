import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;


export default store;
