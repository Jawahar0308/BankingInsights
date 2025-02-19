import React, { useRef, useState } from 'react';
import TableSearch from './TableSearch';
import TableCheckbox from './TableCheckbox';

interface TableHeaderProps {
    sortConfig?: { key: string; direction: string } | null;
    handleSort: (key: string) => void;
    columnFilters: Record<string, string>;
    handleColumnFilter: (column: string, value: string) => void;
    onSelectAll: (checked: boolean) => void;
    isAllSelected: boolean;
    isModal?: boolean;
    columnWidths: { [key: string]: number };
    onColumnResize: (key: string, newWidth: number) => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
    sortConfig,
    handleSort,
    handleColumnFilter,
    onSelectAll,
    isAllSelected,
    isModal = false,
    columnWidths,
    onColumnResize,
}) => {
    const resizingColumn = useRef<string | null>(null);
    const startX = useRef<number>(0);
    const startWidth = useRef<number>(0);

    // // Local state to track search box visibility per column:
    // const [visibleSearch, setVisibleSearch] = useState<{ [key: string]: boolean }>({});

    // const toggleSearchVisibility = (columnKey: string) => {
    //     setVisibleSearch((prev) => ({ ...prev, [columnKey]: !prev[columnKey] }));
    // };
    console.log("col-width checkbox ", columnWidths.checkbox);
    console.log("col-width id ", columnWidths.id);
    console.log("col-width date ", columnWidths.date);
    console.log("col-width amount ", columnWidths.amount);
    const handleMouseDown = (e: React.MouseEvent, columnKey: string) => {
        e.stopPropagation();
        resizingColumn.current = columnKey;
        startX.current = e.clientX;
        startWidth.current = columnWidths[columnKey];
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!resizingColumn.current) return;

        const delta = e.clientX - startX.current; // Track right (positive) and left (negative) movement

        // Ensure resizing only increases/decreases width without shifting the column
        const newWidth = Math.max(startWidth.current + delta, 50); // Prevents shrinking too much

        if (newWidth !== columnWidths[resizingColumn.current]) {
            onColumnResize(resizingColumn.current, newWidth);
        }
    };



    const handleMouseUp = () => {
        resizingColumn.current = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const getSortIndicator = (key: string) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    return (
        <thead className='w-full overflow-x-auto relative'>
            <tr>
                {/* Checkbox Column */}
                <th
                    style={{
                        width: `${columnWidths.checkbox}px`,
                        position: isModal ? "static" : "sticky",
                        left: `${columnWidths.checkbox}px`, // Fixes first column
                        zIndex: isModal ? "auto" : 10, // Keeps above other elements
                        background: "white",
                        boxShadow: "1px 0 0 0 #9ca3af"
                    }}
                    className="px-4 py-2 border border-gray-400 bg-white"
                >
                    <TableCheckbox isChecked={isAllSelected} onChange={onSelectAll} />
                </th>

                {/* Transaction ID Column */}
                <th
                    key="id"
                    className="px-4 py-2 border border-gray-400 bg-white"
                    style={{
                        width: `${columnWidths.id}px`,
                        position: isModal ? "static" : "sticky",
                        left: `${columnWidths.id}px`, // Adjusts based on previous column width
                        zIndex: isModal ? "auto" : 10, // Keeps it above other table rows
                        background: "white",
                        boxShadow: "1px 0 0 0 #9ca3af"
                    }}
                >
                    <div className="flex flex-col items-center justify-center left-0">
                        <div className="cursor-pointer font-semibold text-gray-700" onClick={() => handleSort('id')}>
                            Transaction ID {getSortIndicator('id')}
                        </div>
                        <div className="w-32">
                            <TableSearch onSearch={(value: string) => handleColumnFilter('id', value)} placeholder="Search ID" />
                        </div>
                    </div>
                </th>

                {/* Dynamic Columns */}
                {[
                    { key: 'date', label: 'Date', placeholder: 'Search Date' },
                    { key: 'amount', label: 'Amount', placeholder: 'Search Amount' },
                    { key: 'category', label: 'Category', placeholder: 'Search Category' },
                    { key: 'status', label: 'Status', placeholder: 'Search Status' }
                ].map(({ key, label, placeholder }) => (
                    <th
                        key={key}
                        className="px-4 py-2 border border-gray-400 relative"
                        style={{ width: `${columnWidths[key]}px`, minWidth: '50px' }}
                    >
                        <div className="cursor-pointer font-semibold text-gray-700" onClick={() => handleSort(key)}>
                            {label} {getSortIndicator(key)}
                        </div>
                        <div className="w-32 mx-auto">
                            <TableSearch onSearch={(value: string) => handleColumnFilter(key, value)} placeholder={placeholder} />
                        </div>
                        {/* Column Resizer */}
                        <div
                            className="cursor-col-resize absolute right-0 top-0 h-full w-0.5 bg-gray-400"
                            onMouseDown={(e) => handleMouseDown(e, key)}
                        />
                    </th>
                ))}

                {/* Remarks Column with Resizing */}
                <th
                    className="px-4 py-2 border border-gray-400 relative"
                    style={{ width: `${columnWidths.remarks}px`, minWidth: '50px' }}
                >
                    Remarks
                    <div
                        className="cursor-col-resize absolute right-0 top-0 h-full w-0.5 bg-gray-400"
                        onMouseDown={(e) => handleMouseDown(e, 'remarks')}
                    />
                </th>
            </tr>
        </thead>
    );
};

export default TableHeader;
