import transactionsData from './json/newUserTransactions.json';
import { Transaction } from '../types/transactionTypes';

export const getNewUserTransactions = (): Transaction[] => {
    return transactionsData; // Return the transaction data from the JSON file
};
