import transactionsData from './json/transactions.json';
import { Transaction } from '../types/transactionTypes';

export const getTransactions = (): Transaction[] => {
    return transactionsData; // Return the transaction data from the JSON file
};
