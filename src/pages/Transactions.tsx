import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTransactions } from '../redux/slices/transactionsSlice';
import { RootState } from '../redux/store';
import { CSVLink } from 'react-csv';
import { getTransactions } from '../data/transactions';
import { getNewUserTransactions } from '../data/newUserTransactions'; // Assuming this function is defined
import Dropdown from '../components/Dropdown';

// Import the utilities for filtering, sorting, and pagination
import { filterTransactions } from '../hooks/useFilters';
import { sortTransactions } from '../hooks/useSorting';
import { paginateTransactions } from '../hooks/usePagination';

const Transactions: React.FC = () => {
    const dispatch = useDispatch();
    const transactions = useSelector((state: RootState) => state.transactions.data);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [transactionsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: string }>({
        key: 'date', // Default sort by date
        direction: 'desc',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            const isRegistered = localStorage.getItem('isRegistered') === 'true'; // Example check

            if (isRegistered) {
                dispatch(setTransactions(getTransactions())); // Load transactions for registered user
            } else {
                dispatch(setTransactions(getNewUserTransactions())); // Load new user transactions
            }
        } catch (err) {
            setError("Failed to load transactions. Please try again later.");
        }
        setLoading(false); // Set loading to false once data is fetched
    }, [dispatch]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

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

    return (
        <div className="dashboard p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-4 text-center">Transactions</h1>

            {/* Search & Export */}
            <div className="flex justify-between mb-4">
                <input
                    type="text"
                    placeholder="Search by Description, Category, Payment Method, or Status"
                    className="p-2 border rounded-lg w-1/3"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <CSVLink
                    data={transactions}
                    filename="transactions.csv"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    Export CSV
                </CSVLink>
            </div>

            {/* Status Legend */}
            <section className="status-legend mb-4">
                <div className="flex space-x-4">
                    <div className="flex items-center">
                        <span className="block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                        <span>Completed</span>
                    </div>
                    <div className="flex items-center">
                        <span className="block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                        <span>Pending</span>
                    </div>
                    <div className="flex items-center">
                        <span className="block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                        <span>Failed</span>
                    </div>
                </div>
            </section>

            {/* Transactions Table */}
            <section className="transactions bg-white p-4 rounded-lg shadow-lg mb-6">
                <h2 className="text-xl font-semibold mb-3">Recent Transactions</h2>
                <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse border border-gray-400">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-2 border border-gray-400 cursor-pointer" onClick={() => handleSort('id')}>Transaction ID</th>
                                <th className="px-4 py-2 border border-gray-400 cursor-pointer" onClick={() => handleSort('date')}>Date</th>
                                <th className="px-4 py-2 border border-gray-400 cursor-pointer" onClick={() => handleSort('amount')}>Amount</th>
                                <th className="px-4 py-2 border border-gray-400 cursor-pointer" onClick={() => handleSort('category')}>Category</th>
                                <th className="px-4 py-2 border border-gray-400 cursor-pointer" onClick={() => handleSort('status')}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTransactions.map((transaction) => (
                                <tr key={transaction.id} className="text-center odd:bg-white even:bg-gray-50">
                                    <td className="px-4 py-2 border border-gray-400">{transaction.id}</td>
                                    <td className="px-4 py-2 border border-gray-400">{transaction.date}</td>
                                    <td className="px-4 py-2 border border-gray-400 text-green-600 font-semibold">₹{transaction.amount}</td>
                                    <td className="px-4 py-2 border border-gray-400">{transaction.category}</td>
                                    <td className="px-4 py-2 border border-gray-400">
                                        <span className={`px-2 py-1 rounded text-white ${transaction.status === 'completed' ? 'bg-green-500' : transaction.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                                            {transaction.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Pagination Controls */}
            <div className="pagination flex justify-center space-x-2 flex-wrap">
                {Array.from({ length: Math.ceil(filteredTransactions.length / transactionsPerPage) }).map((_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={`px-4 py-2 border rounded-lg ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Transactions;
