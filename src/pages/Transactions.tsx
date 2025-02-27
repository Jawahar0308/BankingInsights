import React, { useEffect, useState, useCallback, useRef } from 'react';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { useDispatch, useSelector } from 'react-redux';
import { setTransactions } from '../redux/slices/transactionsSlice';
import { AppDispatch, RootState } from '../redux/store';
import { CSVLink } from 'react-csv';
import transactionsData from "../data/json/transactions.json";
import { filterTransactions } from '../hooks/useFilters';
import EditDrawer from "../components/EditDrawer";
import TransactionsTable from '../Table/index';

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
    const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    // Get filtered transactions for pagination calculation
    const filteredTransactions = filterTransactions(transactions, searchTerm, columnFilters);

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

    const handleSelectAll = useCallback((checked: boolean) => {
        const newSelectedRows = checked
            ? new Set<number>(filteredTransactions.map((_, index) => index)) // Use index instead of id
            : new Set<number>();

        setSelectedRows(newSelectedRows);
        selectedRowsRef.current = newSelectedRows; // Sync with ref
    }, [filteredTransactions]);


    const handleRowSelect = useCallback((index: number | null, checked: boolean) => {
        setSelectedRows((prevSelectedRows) => {
            const newSelectedRows = new Set(prevSelectedRows);
            if (index !== null) {
                checked ? newSelectedRows.add(index) : newSelectedRows.delete(index);
            }
            selectedRowsRef.current = newSelectedRows; // Keep in sync
            return newSelectedRows;
        });
    }, []);


    // Handle delete selected rows
    const handleDeleteSelected = useCallback(() => {
        setIsDeleteModalOpen(true);
    }, []);

    const confirmDelete = () => {
        const updatedTransactions = transactions.filter((_, index) => !selectedRowsRef.current.has(index));

        // Ensure state updates correctly
        dispatch(setTransactions(updatedTransactions));
        selectedRowsRef.current.clear(); // Clear selected rows
        setSelectedRows(new Set()); // Update state
        setIsDeleteModalOpen(false);
    };


    const handleSort = (key: string) => {
        setSortConfig((prev) => ({
            key,
            direction: prev?.key === key && prev?.direction === "asc" ? "desc" : "asc"
        }));
    };

    const handleEdit = (index: number, field: string, value: any) => {
        dispatch(setTransactions(transactions.map((txn, i) =>
            i === index ? { ...txn, [field]: value } : txn
        )));
    };

    const handleEditDrawer = (index: number) => {
        setSelectedRowIndex(index);
        setIsEditOpen(true);
    };

    const handleColumnFilter = (column: string, value: string) => {
        setColumnFilters((prev) => ({
            ...prev,
            [column]: value,
        }));
    };

    const isAllSelected = filteredTransactions.length > 0 &&
        filteredTransactions.every((_, index) => selectedRows.has(index));


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
                <TransactionsTable
                    loading={loading}
                    error={error}
                    transactions={transactions}
                    searchTerm={searchTerm}
                    columnFilters={columnFilters}
                    expandedRow={expandedRow}
                    setExpandedRow={setExpandedRow}
                    selectedRows={selectedRows}
                    handleRowSelect={handleRowSelect}
                    handleSelectAll={handleSelectAll}
                    handleSort={handleSort}
                    sortConfig={sortConfig}
                    handleColumnFilter={handleColumnFilter}
                    isDeleteModalOpen={isDeleteModalOpen}
                    handleEdit={handleEdit}
                    onEditDrawer={handleEditDrawer}
                    currentPage={currentPage}
                    transactionsPerPage={transactionsPerPage}
                    setTransactions={(updatedTransactions) => dispatch(setTransactions(updatedTransactions))}
                    handleDeleteSelected={handleDeleteSelected}
                    isAllSelected={isAllSelected} // Pass this new prop
                />

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
                            {Array.from({
                                length: Math.ceil(filteredTransactions.length / transactionsPerPage)
                            }).map((_, index) => (
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
            <EditDrawer
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                rowData={selectedRowIndex !== null ? transactions[selectedRowIndex] : null}
                onUpdate={(updatedData) => {
                    if (selectedRowIndex !== null) {
                        dispatch(setTransactions(transactions.map((txn, i) =>
                            i === selectedRowIndex ? updatedData : txn
                        )));
                        setIsEditOpen(false);
                    }
                }}
            />
        </>
    );
};

export default Transactions;