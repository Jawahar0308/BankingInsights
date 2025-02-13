export const filterTransactions = (transactions: any[], searchTerm: string) => {
    return transactions.filter(transaction =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.payment_method.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
};
