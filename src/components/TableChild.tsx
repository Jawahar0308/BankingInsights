import React, { useState } from 'react';

interface RelatedTransaction {
    [key: string]: any;
}

interface TableChildProps {
    relatedTransactions: RelatedTransaction[];
}

const TableChild: React.FC<TableChildProps> = ({ relatedTransactions }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!relatedTransactions || !Array.isArray(relatedTransactions)) {
        return <p className="text-gray-500 text-sm">Invalid transaction data</p>;
    }

    if (relatedTransactions.length === 0) {
        return (
            <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-sm">No related transactions found for this record</p>
            </div>
        );
    }

    // Extract all keys except 'date' and add 'month' & 'year' instead
    const allKeys = Array.from(
        new Set(
            relatedTransactions.flatMap(Object.keys).filter((key) => key !== 'date')
        )
    );

    // Ensure 'id' is the first column if it exists
    const orderedKeys = ['id', 'month', 'year', ...allKeys.filter((key) => key !== 'id')];

    return (
        <div className="mt-4">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mb-2 cursor-pointer"
            >
                {isExpanded ? 'Hide' : 'Show'} Related Transactions
                <svg
                    className={`w-4 h-4 ml-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {isExpanded && (
                <table className="table-auto w-full border-collapse border border-gray-400">
                    <thead>
                        <tr className="bg-gray-200">
                            {orderedKeys.map((key) => (
                                <th key={key} className="px-4 py-2 border border-gray-400 capitalize">
                                    {key}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {relatedTransactions.map((relTrans, index) => {
                            // Extract month and year if 'date' exists
                            let month = 'null';
                            let year = 'null';

                            if (relTrans.date) {
                                const dateObj = new Date(relTrans.date);
                                if (!isNaN(dateObj.getTime())) {
                                    month = dateObj.toLocaleString('default', { month: 'long' });
                                    year = dateObj.getFullYear().toString();
                                }
                            }

                            return (
                                <tr key={index} className="text-center odd:bg-white even:bg-gray-50">
                                    {orderedKeys.map((key) => (
                                        <td key={key} className="px-4 py-2 border border-gray-400">
                                            {key === 'month' ? month : key === 'year' ? year :
                                                relTrans[key] !== null && relTrans[key] !== undefined
                                                    ? Array.isArray(relTrans[key])
                                                        ? relTrans[key].join(', ')
                                                        : relTrans[key]
                                                    : 'null'}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default TableChild;
