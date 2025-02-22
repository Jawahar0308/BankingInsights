import React, { useRef } from "react";
import TableSearch from "./TableSearch";
import TableCheckbox from "./TableCheckbox";

interface TableHeaderProps {
    sortConfig?: { key: string; direction: string } | null;
    handleSort: (key: string) => void;
    handleColumnFilter: (column: string, value: string) => void;
    onSelectAll: (checked: boolean) => void;
    isAllSelected: boolean;
    isModal?: boolean;
    columnWidths: { [key: string]: number };
    onColumnResize: (key: string, newWidth: number) => void;
    allKeys: string[];
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
    allKeys,
}) => {
    const resizingColumn = useRef<string | null>(null);
    const startX = useRef<number>(0);
    const startWidth = useRef<number>(0);
    let resizeTimeout: number | null = null;

    const handleMouseDown = (e: React.MouseEvent, columnKey: string) => {
        resizingColumn.current = columnKey;
        startX.current = e.clientX;
        startWidth.current = columnWidths[columnKey] ?? 50;
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!resizingColumn.current) return;
        const delta = e.clientX - startX.current;
        const newWidth = Math.max(startWidth.current + delta, 50);

        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (newWidth !== columnWidths[resizingColumn.current!]) {
                onColumnResize(resizingColumn.current!, newWidth);
            }
        }, 100);
    };

    const handleMouseUp = () => {
        resizingColumn.current = null;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    const getSortIndicator = (key: string) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === "asc" ? "↑" : "↓";
    };

    return (
        <thead className="w-full overflow-x-auto relative">
            <tr>
                {/* Checkbox Column */}
                <th
                    style={{
                        width: `${columnWidths.checkbox ?? 50}px`,
                        position: isModal ? "static" : "sticky",
                        left: "0px",
                        zIndex: isModal ? "auto" : 10,
                        background: "white",
                        boxShadow: "1px 0 0 0 #9ca3af",
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
                        width: `${columnWidths.id ?? 100}px`,
                        position: isModal ? "static" : "sticky",
                        left: `${columnWidths.checkbox ?? 50}px`,
                        zIndex: isModal ? "auto" : 10,
                        background: "white",
                        boxShadow: "1px 0 0 0 #9ca3af",
                    }}
                >
                    <div className="flex flex-col items-center justify-center">
                        <div className="cursor-pointer font-semibold text-gray-700" onClick={() => handleSort("id")}>
                            Transaction ID {getSortIndicator("id")}
                        </div>
                        <div className="w-32">
                            <TableSearch onSearch={(value: string) => handleColumnFilter("id", value)} placeholder="Search ID" />
                        </div>
                    </div>
                </th>

                {/* Dynamic Columns with special ordering */}
                {allKeys
                    .filter((key) => !['checkbox', 'id', 'remarks'].includes(key))
                    .sort((a, b) => {
                        if (a === 'category') return -1;
                        if (b === 'category') return 1;
                        return 0;
                    })
                    .map((key) => (
                        <th
                            key={key}
                            className="px-4 py-2 border border-gray-400 relative"
                            style={{
                                width: `${columnWidths[key] ?? 100}px`,
                                minWidth: "50px",
                                position: isModal ? "static" : key === 'category' ? "sticky" : undefined,
                                left: key === 'category' ? `${(columnWidths.checkbox ?? 50) + (columnWidths.id ?? 100)}px` : undefined,
                                zIndex: key === 'category' ? 10 : undefined,
                                background: "white",
                                boxShadow: key === 'category' ? "1px 0 0 0 #9ca3af" : undefined,
                            }}
                        >
                            <div className="flex flex-col items-center justify-center">
                                <div className="cursor-pointer font-semibold text-gray-700" onClick={() => handleSort(key)}>
                                    {key === 'category' ? 'Category' : key.charAt(0).toUpperCase() + key.slice(1)} {getSortIndicator(key)}
                                </div>
                                <div className="w-32 mx-auto">
                                    <TableSearch onSearch={(value: string) => handleColumnFilter(key, value)} placeholder={`Search ${key}`} />
                                </div>
                            </div>
                            <div
                                className="cursor-col-resize absolute right-0 top-0 h-full w-0.5 bg-gray-400"
                                onMouseDown={(e) => handleMouseDown(e, key)}
                            />
                        </th>
                    ))}

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
