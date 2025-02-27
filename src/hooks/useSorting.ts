import { useDispatch } from "react-redux";
import { setRowOrder } from "../redux/slices/transactionsSlice";

export const sortTransactions = (transactions: any[], config: { key: string; direction: string }) => {
    const sortedTransactions = [...transactions].sort((a, b) => {
        let valueA = a[config.key] ?? "";
        let valueB = b[config.key] ?? "";

        if (valueA < valueB) {
            return config.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
            return config.direction === "asc" ? 1 : -1;
        }
        return 0;
    });

    // Removed dispatch of setRowOrder to avoid conflicts with drag-and-drop functionality
    return sortedTransactions;
};
