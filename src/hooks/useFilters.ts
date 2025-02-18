export const filterTransactions = (transactions: any[], searchTerm: string, columnFilters: Record<string, string>) => {
    return transactions.filter(transaction => {
        // Apply global search
        const matchesGlobalSearch = !searchTerm ||
            transaction.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.amount.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.badges[0].toLowerCase().includes(searchTerm.toLowerCase());

        // Apply column filters
        const matchesColumnFilters = Object.entries(columnFilters).every(([column, value]) => {
            if (!value) return true;
            const lowerValue = value.toLowerCase();

            switch (column) {
                case 'id':
                    return transaction.id.toString().toLowerCase().includes(lowerValue);
                case 'date':
                    return transaction.date.toLowerCase().includes(lowerValue);
                case 'amount':
                    return transaction.amount.toString().toLowerCase().includes(lowerValue);
                case 'category':
                    return transaction.category.toLowerCase().includes(lowerValue);
                case 'status':
                    return transaction.badges[0].toLowerCase().includes(lowerValue);
                default:
                    return true;
            }
        });

        return matchesGlobalSearch && matchesColumnFilters;
    });
};
