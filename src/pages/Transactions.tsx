import React, { useEffect, useState, useCallback, useRef } from 'react';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { useDispatch, useSelector } from 'react-redux';
import { useDragDrop } from '../components/TableDragDrop';
import { setTransactions } from '../redux/slices/transactionsSlice';
import { AppDispatch, RootState } from '../redux/store';
import { CSVLink } from 'react-csv';
import TableBadges from "../components/TableBadges";
import TableImageRenderer from '../components/TableImageRenderer';
import TableChild from '../components/TableChild';
import TableHeader from '../Table/TableHeader';
import transactionsData from "../data/json/transactions.json";
import { sortTransactions } from '../hooks/useSorting';
import { filterTransactions } from '../hooks/useFilters';
import { paginateTransactions } from '../hooks/usePagination';
import TableActions from '../components/TableActions';
import TableCheckbox from '../components/TableCheckbox';
import TableBody from '../Table/TableBody';

const Transactions: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const transactions = useSelector((state: RootState) => state.transactions.data) || [];
    const [searchTerm, setSearchTerm] = useState('');
    const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [transactionsPerPage, setTransactionsPerPage] = useState(10); // Default to 10
    const userSetRowsPerPage = useRef(false); // Track if user has set rows per page
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const selectedRowsRef = useRef<Set<number>>(new Set());
    const [selectedRows, setSelectedRows] = useState<Set<number>>(selectedRowsRef.current);

    // Filter, sort and paginate transactions
    const filteredTransactions = filterTransactions(transactions, searchTerm, columnFilters);
    const sortedTransactions = sortConfig ?
        sortTransactions(filteredTransactions, sortConfig) :
        filteredTransactions;

    const { onDragStart, onDragOver, onDragLeave, onDrop, onDragEnd } = useDragDrop(sortedTransactions, (reorderedTransactions) => {
        dispatch(setTransactions(reorderedTransactions));
    });

    const excludedColumns = ['id', 'userId', 'type', 'description', 'image', 'payment_method', 'childTable'];

    // Extract all columns while excluding unwanted ones
    const allKeys = Array.from(
        new Set(transactions.flatMap(transaction => Object.keys(transaction)))
    ).filter(key => !excludedColumns.includes(key));

    const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
        checkbox: 50, // Fixed width
        id: 100      // Fixed width
    });

    const handleColumnResize = useCallback((key: string, newWidth: number) => {
        if (['checkbox', 'id'].includes(key)) return; // Prevent resizing fixed columns

        setColumnWidths((prev) => ({
            ...prev,
            [key]: Math.max(newWidth, 150) // Ensure minimum width of 150px
        }));
    }, []);

    // Load transactions on mount
    useEffect(() => {
        const handleResize = () => {
            if (!userSetRowsPerPage.current) {
                setTransactionsPerPage(window.innerWidth < 768 ? 5 : 10); // Adjust rows per page based on screen size
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Call on mount to set initial value

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        setLoading(true);
        try {
            dispatch(setTransactions(transactionsData));
        } catch (err) {
            setError("Failed to load transactions. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [dispatch]);


    // Handle select all rows
    const handleSelectAll = useCallback((checked: boolean) => {
        const newSelectedRows = checked ?
            new Set<number>(transactions.map((t: Record<string, any>) => t.id)) :
            new Set<number>();
        selectedRowsRef.current = newSelectedRows;
        setSelectedRows(newSelectedRows);
    }, [transactions]);

    // Handle individual row selection
    const handleRowSelect = useCallback((id: number | null, checked: boolean) => {
        const newSelectedRows = new Set(selectedRowsRef.current);
        if (id !== null) {
            checked ? newSelectedRows.add(id) : newSelectedRows.delete(id);
        }
        selectedRowsRef.current = newSelectedRows;
        setSelectedRows(new Set(newSelectedRows));
    }, []);

    // Handle delete selected rows
    const handleDeleteSelected = useCallback(() => {
        setIsDeleteModalOpen(true);
    }, []);

    // Confirm deletion of selected rows
    const confirmDelete = () => {
        const remainingTransactions = transactions.filter(
            (t: Record<string, any>) => !selectedRowsRef.current.has(t.id) // Use selectedRowsRef.current
        );
        dispatch(setTransactions(remainingTransactions));
        selectedRowsRef.current.clear(); // Clear the selected rows
        setSelectedRows(new Set()); // Update state to reflect cleared selections
        setIsDeleteModalOpen(false);
    };
    console.log("Transactions: ", transactions)
    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    if (transactions.length === 0) return <div className="flex justify-center items-center h-screen text-gray-500">No transactions available</div>;

    const currentTransactions = paginateTransactions(currentPage, transactionsPerPage, sortedTransactions).filter(Boolean); // Ensure no null values

    const handleSort = (key: string) => {
        setSortConfig((prev) => ({
            key,
            direction: prev?.key === key && prev?.direction === "asc" ? "desc" : "asc"
        }));
    };

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
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    Delete Selected
                                </button>
                            </div>
                            <div className="w-full overflow-x-auto">
                                <div className="relative max-h-[500px] overflow-y-auto"> {/* Set max height for vertical scrolling */}
                                    <table className="table-auto w-full min-w-[800px] border-collapse border border-gray-400 relative">
                                        <TableHeader
                                            sortConfig={sortConfig}
                                            handleSort={handleSort}
                                            handleColumnFilter={(column, value) =>
                                                setColumnFilters((prev) => ({
                                                    ...prev,
                                                    [column]: value,
                                                }))
                                            }
                                            onSelectAll={handleSelectAll}
                                            isAllSelected={selectedRows.size === transactions.length}
                                            isModal={isDeleteModalOpen}
                                            columnWidths={columnWidths}
                                            onColumnResize={handleColumnResize}
                                            allKeys={allKeys}
                                        />

                                        <TableBody
                                            currentTransactions={currentTransactions}
                                            columnWidths={columnWidths}
                                            selectedRows={selectedRows}
                                            handleRowSelect={handleRowSelect}
                                            expandedRow={expandedRow}
                                            setExpandedRow={setExpandedRow}
                                            onDragStart={onDragStart}
                                            onDragOver={onDragOver}
                                            onDragLeave={onDragLeave}
                                            onDrop={onDrop}
                                            onDragEnd={onDragEnd}
                                            allKeys={allKeys}
                                        />

                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Rows per page selection and Pagination centered */}
                <div className="flex flex-col items-center mb-4">
                    <div className="flex items-center justify-center flex-wrap gap-4">
                        <div className="flex items-center">
                            <label htmlFor="rowsPerPage" className="mr-2">Rows per page:</label>
                            <select
                                onChange={(e) => {
                                    setTransactionsPerPage(Number(e.target.value));
                                    setCurrentPage(1); // Reset to first page when changing rows per page
                                    userSetRowsPerPage.current = true; // Mark that user has set rows per page
                                }}
                                id="rowsPerPage"
                                value={transactionsPerPage}
                                className="p-2 border rounded-lg"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>

                        {/* Pagination */}
                        <div className="pagination flex space-x-2">
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
