import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { paginateTransactions } from '../hooks/usePagination';
import { sortTransactions } from '../hooks/useSorting';
import { filterTransactions } from '../hooks/useFilters';
import TableSearch from '../components/Table/TableSearch';
import TableRow from '../components/Table/TableRow';

const Reports: React.FC = () => {
    const transactions = useSelector((state: RootState) => state.transactions.data);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [transactionsPerPage] = useState(10);

    // Sorting config (can be dynamic based on user click)
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: string }>({
        key: 'date', // Default sort by date
        direction: 'desc',
    });

    // Handle sorting
    const sortedTransactions = sortTransactions(transactions, sortConfig);

    // Handle filtering
    const filteredTransactions = filterTransactions(sortedTransactions, searchTerm);

    // Handle pagination
    const currentTransactions = paginateTransactions(currentPage, transactionsPerPage, filteredTransactions);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Transactions Report</h1>

            {/* Search Input */}
            <div className="mb-4 flex justify-between items-center">
                <TableSearch onSearch={setSearchTerm} />
                <div className="flex space-x-2">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                        Export CSV
                    </button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                        Generate Report
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                <table className="min-w-full table-auto text-sm text-gray-700">
                    <thead className="bg-gray-100">
                        <tr>
                            <th
                                onClick={() => setSortConfig({ key: 'id', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                                className="px-4 py-2 border-b cursor-pointer hover:bg-gray-200 text-left"
                            >
                                Transaction ID
                            </th>
                            <th
                                onClick={() => setSortConfig({ key: 'date', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                                className="px-4 py-2 border-b cursor-pointer hover:bg-gray-200 text-left"
                            >
                                Date
                            </th>
                            <th
                                onClick={() => setSortConfig({ key: 'amount', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                                className="px-4 py-2 border-b cursor-pointer hover:bg-gray-200 text-left"
                            >
                                Amount
                            </th>
                            <th className="px-4 py-2 border-b">Account Number</th>
                            <th className="px-4 py-2 border-b">Type</th>
                            <th className="px-4 py-2 border-b">Payment Method</th>
                            <th className="px-4 py-2 border-b">Status</th>
                            <th className="px-4 py-2 border-b">Remarks</th>
                            <th className="px-4 py-2 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTransactions.map((row) => (
                            <TableRow key={row.id} rowData={row} onSave={(id: any, newAmount: any) => console.log(id, newAmount)} />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="pagination flex justify-center space-x-2 flex-wrap mt-4">
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

export default Reports;
