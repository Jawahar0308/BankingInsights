export const sortTransactions = (transactions: any[], config: { key: string; direction: string }) => {
    return [...transactions].sort((a, b) => {
        if (a[config.key] < b[config.key]) {
            return config.direction === 'asc' ? -1 : 1;
        }
        if (a[config.key] > b[config.key]) {
            return config.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });
};
