import React, { useState, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { sortTransactions } from '../hooks/useSorting';
import { filterTransactions } from '../hooks/useFilters';
import { paginateTransactions } from '../hooks/usePagination';
import TableHeader from '../components/TableHeader';
import TableBody from '../components/TableBody';
import { useDragDrop } from '../components/TableDragDrop';

interface TableProps {
    loading: boolean;
    error: string | null;
    transactions: any[];
    searchTerm: string;
    columnFilters: Record<string, string>;
    expandedRow: number | null;
    setExpandedRow: (index: number | null) => void;
    selectedRows: Set<number>;
    handleRowSelect: (id: number | null, checked: boolean) => void;
    handleSelectAll: (checked: boolean) => void;
    handleSort: (key: string) => void;
    sortConfig: { key: string; direction: string } | null;
    handleColumnFilter: (column: string, value: string) => void;
    isDeleteModalOpen: boolean;
    handleEdit: (index: number, field: string, value: any) => void;
    onEditDrawer: (index: number) => void;
    currentPage: number;
    transactionsPerPage: number;
    setTransactions: (transactions: any[]) => void;
    handleDeleteSelected: () => void;
    isAllSelected: boolean;
}

const TransactionsTable: React.FC<TableProps> = ({
    loading,
    error,
    transactions,
    searchTerm,
    columnFilters,
    expandedRow,
    setExpandedRow,
    selectedRows,
    handleRowSelect,
    handleSelectAll,
    handleSort,
    sortConfig,
    handleColumnFilter,
    isDeleteModalOpen,
    handleEdit,
    onEditDrawer,
    currentPage,
    transactionsPerPage,
    setTransactions,
    handleDeleteSelected,
}) => {
    // Filter, sort and paginate transactions
    const filteredTransactions = filterTransactions(transactions, searchTerm, columnFilters);

    // Apply sorting to filtered transactions
    const sortedTransactions = sortConfig ?
        sortTransactions(filteredTransactions, sortConfig as { key: string; direction: "asc" | "desc" }) :
        filteredTransactions;

    const { onDragStart, onDragOver, onDragLeave, onDrop, onDragEnd } = useDragDrop(filteredTransactions, (reorderedTransactions) => {
        setTransactions(reorderedTransactions);
    });

    const excludedColumns = ['id', 'userId', 'type', 'description', 'image', 'payment_method', 'childTable'];

    // Extract all columns while excluding unwanted ones
    const allKeys = Array.from(
        new Set(transactions.flatMap(transaction => Object.keys(transaction)))
    ).filter(key => !excludedColumns.includes(key));

    const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
        checkbox: 50,
        id: 100,
        remarks: 150
    });

    const handleColumnResize = useCallback((key: string, newWidth: number) => {
        if (['checkbox', 'id'].includes(key)) return; // Prevent resizing fixed columns

        setColumnWidths((prev) => ({
            ...prev,
            [key]: Math.max(newWidth, 150) // Ensure minimum width of 150px
        }));
    }, []);

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    if (transactions.length === 0) return <div className="flex justify-center items-center h-screen text-gray-500">No transactions available</div>;

    // Use sortedTransactions instead of filteredTransactions for pagination
    const currentTransactions = paginateTransactions(currentPage, transactionsPerPage, sortedTransactions).filter(Boolean); // Ensure no null values

    return (
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
                                    handleColumnFilter={(column, value) => handleColumnFilter(column, value)}
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
                                    handleEdit={handleEdit}
                                    onEditDrawer={onEditDrawer}
                                />
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default TransactionsTable;