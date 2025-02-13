export const paginateTransactions = (
    currentPage: number,
    transactionsPerPage: number,
    sortedTransactions: any[]
) => {
    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
    return sortedTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
};
