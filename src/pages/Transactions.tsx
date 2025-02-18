import React, { useEffect, useState, useCallback, useRef } from 'react';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { useDispatch, useSelector } from 'react-redux';
import { useDragDrop } from '../components/Table/TableDragDrop';
import { setTransactions } from '../redux/slices/transactionsSlice';
import { setRowOrder } from '../redux/slices/tableSlice';
import { RootState } from '../redux/store';
import { CSVLink } from 'react-csv';
import { getTransactions } from '../data/transactions';
import TableBadges from "../components/Table/TableBadges";
import TableImageRenderer from '../components/Table/TableImageRenderer';
import TableChild from '../components/Table/TableChild';
import TableHeader from '../components/Table/TableHeader';
import { filterTransactions } from '../hooks/useFilters';
import { sortTransactions } from '../hooks/useSorting';
import { paginateTransactions } from '../hooks/usePagination';
import TableActions from '../components/Table/TableActions';
import TableCheckbox from '../components/Table/TableCheckbox';

const Transactions: React.FC = () => {
    const dispatch = useDispatch();
    const transactions = useSelector((state: RootState) => state.transactions.data);
    const [searchTerm, setSearchTerm] = useState('');
    const [columnFilters, setColumnFilters] = useState<Record<string, string>>({
        id: '',
        date: '',
        amount: '',
        category: '',
        status: ''
    });
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [transactionsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const selectedRowsRef = useRef<Set<number>>(new Set());
    const [selectedRows, setSelectedRows] = useState<Set<number>>(selectedRowsRef.current);
    const { onDragStart, onDragOver, onDragLeave, onDrop, onDragEnd } = useDragDrop(transactions, (reorderedTransactions) => {
        dispatch(setTransactions(reorderedTransactions));
    });
    const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
        checkbox: 0,  // Fixed width for checkbox column
        id: 60,      // Fixed width for Transaction ID column
        date: 180,
        amount: 120,
        category: 200,
        status: 150,
        remarks: 150
    });

    // Handle column resizing
    const handleColumnResize = (key: string, newWidth: number) => {
        setColumnWidths((prev) => ({ ...prev, [key]: newWidth }));
    };

    // Load transactions on mount
    useEffect(() => {
        try {
            const data = getTransactions();
            dispatch(setTransactions(data));
            dispatch(setRowOrder(data.map(t => t.id.toString())));
        } catch (err) {
            setError("Failed to load transactions. Please try again later.");
        }
        setLoading(false);
    }, [dispatch]);

    // Handle select all rows
    const handleSelectAll = useCallback((checked: boolean) => {
        const newSelectedRows = checked ?
            new Set<number>(transactions.map(t => t.id)) :
            new Set<number>();
        selectedRowsRef.current = newSelectedRows;
        setSelectedRows(newSelectedRows);
    }, [transactions]);

    // Handle individual row selection
    const handleRowSelect = useCallback((id: number, checked: boolean) => {
        const newSelectedRows = new Set(selectedRowsRef.current);
        checked ? newSelectedRows.add(id) : newSelectedRows.delete(id);
        selectedRowsRef.current = newSelectedRows;
        setSelectedRows(new Set(newSelectedRows));
    }, []);

    // Handle delete selected rows
    const handleDeleteSelected = () => {
        setIsDeleteModalOpen(true);
    };

    // Confirm deletion of selected rows
    const confirmDelete = () => {
        const remainingTransactions = transactions.filter(
            (t: { id: number }) => !selectedRows.has(t.id)
        );
        dispatch(setTransactions(remainingTransactions));
        setSelectedRows(new Set());
        setIsDeleteModalOpen(false);
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    if (transactions.length === 0) return <div className="flex justify-center items-center h-screen text-gray-500">No transactions available</div>;

    // Filter, sort and paginate transactions
    const filteredTransactions = filterTransactions(transactions, searchTerm, columnFilters);
    const sortedTransactions = sortConfig ?
        sortTransactions(filteredTransactions, sortConfig) :
        filteredTransactions;
    const currentTransactions = paginateTransactions(currentPage, transactionsPerPage, sortedTransactions);

    return (
        <>
            <div className="dashboard p-4 md:p-6 bg-gray-100 min-h-screen">
                {/* Search & Export Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        className="p-2 border rounded-lg w-full md:w-1/3"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <CSVLink
                        data={transactions}
                        filename="transactions.csv"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full md:w-auto text-center"
                    >
                        Export CSV
                    </CSVLink>
                </div>

                {/* Transactions Table */}
                <section className="transactions bg-white p-4 rounded-lg shadow-lg mb-6">
                    {transactions.length === 0 ? (
                        <div className="flex justify-center items-center h-64 text-gray-500">
                            No transactions to display
                        </div>
                    ) : (
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-xl font-semibold">Recent Transactions</h2>
                                <button
                                    onClick={handleDeleteSelected}
                                    disabled={selectedRows.size === 0}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    Delete Selected
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="table-auto w-full min-w-[800px] border-collapse border border-gray-400">
                                    <TableHeader
                                        sortConfig={sortConfig}
                                        handleSort={(key) => setSortConfig({
                                            key,
                                            direction: sortConfig?.key === key && sortConfig?.direction === 'asc' ? 'desc' : 'asc'
                                        })}
                                        columnFilters={columnFilters}
                                        handleColumnFilter={(column, value) => setColumnFilters(prev => ({
                                            ...prev,
                                            [column]: value
                                        }))}
                                        onSelectAll={handleSelectAll}
                                        isAllSelected={selectedRows.size === transactions.length}
                                        isModal={isDeleteModalOpen}
                                        onColumnResize={handleColumnResize}
                                        columnWidths={columnWidths}
                                    />

                                    <tbody>
                                        {currentTransactions.map((transaction) => (
                                            <React.Fragment key={transaction.id}>
                                                <tr
                                                    className={`text-center odd:bg-white even:bg-gray-50 cursor-move`}
                                                    draggable
                                                    onDragStart={(e) => onDragStart(e, transaction.id)}
                                                    onDragOver={onDragOver}
                                                    onDragLeave={onDragLeave}
                                                    onDrop={(e) => onDrop(e, transaction.id)}
                                                    onDragEnd={onDragEnd}
                                                >
                                                    {/* Sticky Checkbox Column */}
                                                    <td className={`${isDeleteModalOpen ? 'z-0' : 'sticky left-0 z-10'} bg-white px-4 py-2 border border-gray-400 min-w-[50px]`}>
                                                        <TableCheckbox
                                                            isChecked={selectedRows.has(transaction.id)}
                                                            onChange={(checked) => handleRowSelect(transaction.id, checked)}
                                                        />
                                                    </td>

                                                    <td className={`${isDeleteModalOpen ? 'z-0' : 'sticky left-[50px] z-10'} bg-white px-4 py-2 border border-gray-400 min-w-[120px]`}>
                                                        {transaction.id}
                                                    </td>

                                                    {/* Other Columns */}
                                                    <td className="px-4 py-2 border border-gray-400">{transaction.date}</td>
                                                    <td className="px-4 py-2 border border-gray-400 text-green-600 font-semibold">
                                                        ₹{transaction.amount}
                                                    </td>
                                                    <td className="px-4 py-2 border border-gray-400">{transaction.category}</td>
                                                    <td className="px-4 py-2 border border-gray-400">
                                                        <TableBadges statuses={[transaction.badges[0]]} />
                                                    </td>
                                                    <td className="px-4 py-2 border border-gray-400">
                                                        <TableActions
                                                            transaction={transaction}
                                                            isExpanded={expandedRow === transaction.id}
                                                            onToggleExpand={(id) => setExpandedRow(expandedRow === id ? null : id)}
                                                        />
                                                    </td>
                                                </tr>

                                                {expandedRow === transaction.id && (
                                                    <tr className="bg-gray-100">
                                                        <td colSpan={7} className="border border-gray-400 p-4">
                                                            <div className="flex items-center space-x-4">
                                                                <TableImageRenderer method={transaction.payment_method} />
                                                                <div>{transaction.payment_method} </div>
                                                            </div>
                                                            <div className="flex justify-start mt-2">
                                                                <TableBadges statuses={transaction.badges} />
                                                            </div>
                                                            <TableChild relatedTransactions={transaction.childTable?.relatedTransactions ?? []} />
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </section>

                {/* Pagination */}
                <div className="pagination flex justify-center space-x-2 flex-wrap">
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

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                selectedCount={selectedRows.size}
            />
        </>
    );
};

export default Transactions;
