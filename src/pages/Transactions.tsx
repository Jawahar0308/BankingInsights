import React, { useEffect, useState, useCallback, useRef } from 'react';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { useDispatch, useSelector } from 'react-redux';
import { useDragDrop } from '../components/Table/TableDragDrop';
import { setTransactions } from '../redux/slices/transactionsSlice';
import { setRowOrder } from '../redux/slices/tableSlice';
import { AppDispatch, RootState } from '../redux/store';
import { CSVLink } from 'react-csv';
import TableBadges from "../components/Table/TableBadges";
import TableImageRenderer from '../components/Table/TableImageRenderer';
import TableChild from '../components/Table/TableChild';
import TableHeader from '../components/Table/TableHeader';
import { getTransactions } from '../data/transactions';
import { sortTransactions } from '../hooks/useSorting';
import { filterTransactions } from '../hooks/useFilters';
import { paginateTransactions } from '../hooks/usePagination';
import TableActions from '../components/Table/TableActions';
import TableCheckbox from '../components/Table/TableCheckbox';

const Transactions: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const transactions = useSelector((state: RootState) => state.transactions.data) || [];
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

    const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
        checkbox: 0,  // Fixed width for checkbox column
        id: 50,      // Fixed width for Transaction ID column
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
            // Get initial transactions data
            const initialTransactions = getTransactions();
            dispatch(setTransactions(initialTransactions));
            dispatch(setRowOrder(initialTransactions.map((t: Record<string, any>) => t.id.toString())));
        } catch (err) {
            setError("Failed to load transactions. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [dispatch]);  // Only dispatch as dependency

    // Handle select all rows
    const handleSelectAll = useCallback((checked: boolean) => {
        const newSelectedRows = checked ?
            new Set<number>(transactions.map((t: Record<string, any>) => t.id)) :
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
            (t: Record<string, any>) => !selectedRowsRef.current.has(t.id) // Use selectedRowsRef.current
        );
        dispatch(setTransactions(remainingTransactions));
        selectedRowsRef.current.clear(); // Clear the selected rows
        setSelectedRows(new Set()); // Update state to reflect cleared selections
        setIsDeleteModalOpen(false);
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    if (transactions.length === 0) return <div className="flex justify-center items-center h-screen text-gray-500">No transactions available</div>;

    console.log("Current Page:", currentPage);
    console.log("Transactions Per Page:", transactionsPerPage);
    console.log("Sorted Transactions:", sortedTransactions);

    const currentTransactions = paginateTransactions(currentPage, transactionsPerPage, sortedTransactions);
    console.log("Current Transactions:", currentTransactions);

    const handleSort = (key: string) => {
        setSortConfig((prev) => ({
            key,
            direction: prev?.key === key && prev?.direction === "asc" ? "desc" : "asc"
        }));
    };

    const excludedColumns = ['userId', 'type', 'description', 'image', 'payment_method', 'childTable'];
    const firstColumns = ['category']; // Ensure only existing columns are first

    // Extract all columns while excluding unwanted ones
    const allKeys = Array.from(
        new Set(transactions.flatMap(transaction => Object.keys(transaction)))
    ).filter(key => !excludedColumns.includes(key)); // Remove unwanted columns

    // Ensure firstColumns only includes existing keys
    const validFirstColumns = firstColumns.filter(key => allKeys.includes(key));

    // Get middle columns (excluding first priority)
    const middleColumns = allKeys.filter(key => !validFirstColumns.includes(key));

    // Final ordered columns
    const orderedColumns = [...validFirstColumns, ...middleColumns];

    console.log(orderedColumns);

    // Cell Rendering Function
    const renderCell = (key: string, value: any) => {
        if (value === null || value === undefined) return <span className="text-gray-500">null</span>;

        switch (key) {
            case "amount":
                return <span className="text-green-600 font-semibold">₹{value}</span>;
            case "badges":
                return <TableBadges statuses={[value?.[0]]} />;
            case "date":
                return <span className="font-medium">{value}</span>;
            case "category":
                return <span className="italic">{value}</span>;
            default:
                if (typeof value === 'object') {
                    if (Array.isArray(value)) {
                        return (
                            <ul className="list-disc pl-4">
                                {value.map((item, idx) => (
                                    <li key={idx}>{JSON.stringify(item)}</li>
                                ))}
                            </ul>
                        );
                    }
                    return (
                        <div className="text-xs text-gray-700 space-y-1">
                            {Object.entries(value).map(([subKey, subValue], idx) => (
                                <div key={idx}>
                                    <strong>{subKey}:</strong> {subValue !== null && subValue !== undefined ? subValue.toString() : 'null'}
                                </div>
                            ))}
                        </div>
                    );
                }
                return <span>{value.toString()}</span>;
        }
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

                            <div className="overflow-x-auto relative">
                                <table className="table-auto w-full min-w-[800px] border-collapse border border-gray-400 relative">
                                    <TableHeader
                                        sortConfig={sortConfig}
                                        handleSort={handleSort}
                                        // columnFilters={columnFilters}
                                        handleColumnFilter={(column, value) => setColumnFilters(prev => ({
                                            ...prev,
                                            [column]: value
                                        }))}
                                        onSelectAll={handleSelectAll}
                                        isAllSelected={selectedRows.size === transactions.length}
                                        isModal={isDeleteModalOpen}
                                        onColumnResize={handleColumnResize}
                                        columnWidths={columnWidths}
                                        allKeys={allKeys}
                                    />

                                    <tbody className='w-full overflow-x-auto'>
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
                                                    <td
                                                        className={`${isDeleteModalOpen ? 'z-0' : 'sticky left-0 z-10'} bg-white px-4 py-2 border border-gray-400 min-w-[50px]`}
                                                        style={{ boxShadow: "1px 0 0 0 #9ca3af" }}
                                                    >
                                                        <TableCheckbox
                                                            isChecked={selectedRows.has(transaction.id)}
                                                            onChange={(checked) => handleRowSelect(transaction.id, checked)}
                                                        />
                                                    </td>

                                                    <td
                                                        className={`${isDeleteModalOpen ? 'z-0' : 'sticky left-[50px] z-10'} bg-white px-4 py-2 border border-gray-400 min-w-[120px]`}
                                                        style={{ boxShadow: "1px 0 0 0 #9ca3af" }}
                                                    >
                                                        {transaction.id}
                                                    </td>

                                                    {/* Other Columns */}
                                                    {firstColumns.map(key => (
                                                        <td className="px-4 py-2 border border-gray-400 font-bold" key={key}>
                                                            {renderCell(key, transaction[key])}
                                                        </td>
                                                    ))}

                                                    {/* Middle Columns (Dynamically Arranged) */}
                                                    {middleColumns
                                                        .filter(key => key !== "id") // Exclude 'id'
                                                        .map(key => (
                                                            <td className="px-4 py-2 border border-gray-400" key={key}>
                                                                {renderCell(key, transaction[key])}
                                                            </td>
                                                        ))}

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

                {/* Rows per page selection and Pagination centered */}
                <div className="flex flex-col items-center mb-4">
                    {/* Rows per page selection and Pagination in the same line */}
                    <div className="flex items-center justify-center flex-wrap gap-4">
                        {/* Rows per page selection */}
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
