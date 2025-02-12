import transactionsData from '../data/json/transactions.json';
import reportsData from '../data/json/reports.json';

export const fetchTransactions = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(transactionsData);
        }, 1000);
    });
};

export const fetchReports = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(reportsData);
        }, 1000);
    });
};
