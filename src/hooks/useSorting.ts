export const sortTransactions = (
    transactions: any[],
    sortConfig: { key: string; direction: "asc" | "desc" } | null
) => {
    if (!sortConfig || !sortConfig.key) return transactions;

    return [...transactions]
        .map((transaction, index) => ({
            ...transaction,
            orderIndex: index, // Assign current index
        }))
        .sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            // Handle undefined/null values
            if (aValue === undefined || aValue === null) return 1;
            if (bValue === undefined || bValue === null) return -1;

            // Handle numbers
            if (!isNaN(aValue) && !isNaN(bValue)) {
                const numA = Number(aValue);
                const numB = Number(bValue);
                return sortConfig.direction === "asc" ? numA - numB : numB - numA;
            }

            // Handle dates
            const dateA = new Date(aValue);
            const dateB = new Date(bValue);
            if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
                return sortConfig.direction === "asc"
                    ? dateA.getTime() - dateB.getTime()
                    : dateB.getTime() - dateA.getTime();
            }

            // Handle boolean values
            if (typeof aValue === "boolean" && typeof bValue === "boolean") {
                const boolA = Number(aValue);
                const boolB = Number(bValue);
                return sortConfig.direction === "asc"
                    ? boolA - boolB
                    : boolB - boolA;
            }

            // Handle strings (case insensitive)
            const strA = String(aValue);
            const strB = String(bValue);
            const comparison = strA.localeCompare(strB, undefined, { sensitivity: "base" });
            return sortConfig.direction === "asc" ? comparison : -comparison;
        })
        .map((transaction, index) => ({
            ...transaction,
            orderIndex: index, // Update `orderIndex` after sorting
        }));
};
