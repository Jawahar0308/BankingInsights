export const filterTransactions = (transactions: any[], searchTerm: string, columnFilters: Record<string, string>) => {
    console.log("Filtering transactions with searchTerm:", searchTerm);
    console.log("Current column filters:", columnFilters);

    return transactions.filter(transaction => {
        // Apply global search
        const matchesGlobalSearch = !searchTerm || Object.keys(transaction).some(key => {
            if (key === 'checkbox' || key === 'action') return false; // Exclude specific columns
            const value = transaction[key];
            const match = value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
            if (match) {
                console.log(`Match found in global search for key: ${key}, value: ${value}`);
            }
            return match;
        });


        // Apply column filters
        const matchesColumnFilters = Object.entries(columnFilters).every(([column, value]) => {
            if (!value) return true;
            const lowerValue = value.toLowerCase();
            if (column === 'checkbox' || column === 'action') return true; // Exclude specific columns

            const columnValue = transaction[column];
            const match = columnValue && columnValue.toString().toLowerCase().includes(lowerValue);
            if (match) {
                console.log(`Match found for column filter: ${column}, value: ${columnValue}`);
            }
            return match;
        });

        return matchesGlobalSearch && matchesColumnFilters;
    });
};
