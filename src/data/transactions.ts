import transactionsData from './json/transactions.json';
import { Transaction } from '../types/transactionTypes';

export const getTransactions = (): Transaction[] => {
    return transactionsData as Transaction[]; // Return the transaction data from the JSON file
};
