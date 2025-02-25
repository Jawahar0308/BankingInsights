import { useDispatch } from 'react-redux';
import { setRowOrder } from '../redux/slices/transactionsSlice';

export const sortTransactions = (transactions: any[], config: { key: string; direction: string }) => {
    const dispatch = useDispatch();
    const sortedTransactions = [...transactions].sort((a, b) => {
        let valueA = config.key === 'status' ? a.badges[0] : a[config.key];
        let valueB = config.key === 'status' ? b.badges[0] : b[config.key];

        // Sync row order with Redux
        dispatch(setRowOrder(transactions.map(item => item.id)));

        if (valueA < valueB) {
            return config.direction === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
            return config.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });
    return sortedTransactions; // Ensure the sorted transactions are returned
};
