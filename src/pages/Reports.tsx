import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import transactionsData from "../data/json/transactions.json"; // Import JSON data
import TableBadges from "../components/Table/TableBadges";
import TableImageRenderer from "../components/Table/TableImageRenderer";
import TableChild from "../components/Table/TableChild";
import { paginateTransactions } from "../hooks/usePagination"; // Importing the custom hook for pagination
import { sortTransactions } from "../hooks/useSorting"; // Importing the custom hook for sorting
import { filterTransactions } from "../hooks/useFilters"; // Importing the custom hook for filtering
import { RootState } from "../redux/store";

const Reports: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [transactionsPerPage] = useState(10);
    const transactions = useSelector((state: RootState) => state.transactions.data);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: string }>({
        key: 'date', // Default sort by date
        direction: 'desc',
    });

    // Apply filtering
    const filteredTransactions = filterTransactions(transactions, searchTerm);

    // Apply sorting
    const sortedTransactions = sortTransactions(filteredTransactions, sortConfig);

    // Apply pagination
    const currentTransactions = paginateTransactions(currentPage, transactionsPerPage, sortedTransactions);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Handle sort click
    const handleSort = (key: string) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ key, direction });
    };


    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset to the first page when a search term is applied
    };

    const [expandedTransactionId, setExpandedTransactionId] = useState<number | null>(null);
    const [transaction, setTransactions] = useState(transactionsData); // Store transactions in state

    const handleAction = (action: string, txn: any) => {
        if (action === "View Details") {
            setExpandedTransactionId(expandedTransactionId === txn.id ? null : txn.id);  // Toggle visibility
        }
    };

    const handleCancelRow = (transactionId: number) => {
        const confirmed = window.confirm("Are you sure you want to delete this transaction?");
        if (confirmed) {
            setTransactions((prevTransactions) =>
                prevTransactions.filter((txn) => txn.id !== transactionId)
            );
        }
    };


    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Transactions Report</h1>

            {/* Search Input */}
            <div className="mb-4 flex justify-between items-center">
                <input
                    type="text"
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Search by ID or Amount"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <div className="flex space-x-2">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                        Export CSV
                    </button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                        Generate Report
                    </button>
                </div>
            </div>

            <div>
                <table className="w-full text-sm border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 border border-gray-400">ID</th>
                            <th className="px-4 py-2 border border-gray-400">Amount</th>
                            <th className="px-4 py-2 border border-gray-400">Status</th>
                            <th className="px-4 py-2 border border-gray-400">Payment Method</th>
                            <th className="px-4 py-2 border border-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTransactions.map((txn) => (
                            <React.Fragment key={txn.id}>
                                {/* Main Transaction Row */}
                                <tr className="text-center text-gray-700 border-b">
                                    <td className="px-3 py-1 border border-gray-400">{txn.id}</td>
                                    <td className="px-3 py-1 border border-gray-400">Rs.{txn.amount}</td>
                                    <td className="px-3 py-1 border border-gray-400">
                                        <TableBadges statuses={txn.badges} />
                                    </td>
                                    <td className="px-3 py-1 border border-gray-400">{txn.payment_method}</td>
                                    <td className="px-3 py-1 border border-gray-400">
                                        <div className="space-x-2">
                                            <button
                                                onClick={() => handleAction("View Details", txn)}
                                                className="px-2 py-1 text-blue-500 border rounded hover:bg-blue-100"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleCancelRow(txn.id)} // Handle cancel for row deletion
                                                className="px-2 py-1 text-red-500 border rounded hover:bg-red-100"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                                {/* Expanded Transaction Row (display related transactions) */}
                                {/* {expandedTransactionId === txn.id && (
                                    <tr className="bg-gray-100">
                                        <td colSpan={5} className="px-3 py-2">
                                            <div className="space-y-2">
                                                <div className="mb-4">
                                                    <TableImageRenderer method={txn.payment_method} />
                                                </div>
                                                <TableBadges statuses={txn.badges} />
                                                <TableChild relatedTransactions={txn.childTable.relatedTransactions} />
                                            </div>
                                        </td>
                                    </tr>
                                )} */}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="pagination flex justify-center space-x-2 flex-wrap mt-4">
                {Array.from({ length: Math.ceil(filteredTransactions.length / transactionsPerPage) }).map((_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-4 py-2 border rounded-lg ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Reports;
