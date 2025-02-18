export const sortTransactions = (transactions: any[], config: { key: string; direction: string }) => {
    return [...transactions].sort((a, b) => {
        let valueA = config.key === 'status' ? a.badges[0] : a[config.key];
        let valueB = config.key === 'status' ? b.badges[0] : b[config.key];

        if (valueA < valueB) {
            return config.direction === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
            return config.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });
};
