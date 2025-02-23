import React, { useRef, useEffect } from "react";
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

    const handleMouseDown = (e: React.MouseEvent, columnKey: string) => {
        resizingColumn.current = columnKey;
        startX.current = e.clientX;
        startWidth.current = columnWidths[columnKey] ?? 50;

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!resizingColumn.current) return;
        requestAnimationFrame(() => {
            const delta = e.clientX - startX.current;
            const newWidth = Math.max(startWidth.current + delta, 50);
            onColumnResize(resizingColumn.current!, newWidth);
            const table = document.querySelector("table");
            if (table) {
                table.style.minWidth = "100%";
                table.style.width = "auto";
            }
        });
    };

    const handleMouseUp = () => {
        resizingColumn.current = null;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    useEffect(() => {
        const handleResize = () => {
            requestAnimationFrame(() => {
                const table = document.querySelector("table");
                if (table) {
                    table.style.overflowX = "auto";
                }
            });
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const getSortIndicator = (key: string) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === "asc" ? "↑" : "↓";
    };

    const orderedKeys = allKeys.includes('category')
        ? ['category', ...allKeys.filter(key => key !== 'category')]
        : allKeys;

    return (
        <thead className="w-full overflow-x-auto relative">
            <tr>
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
                <th
                    key="id"
                    className="px-4 py-2 border border-gray-400 bg-white"
                    style={{
                        width: `${columnWidths.id ?? 100}px`,
                        position: isModal ? "static" : "sticky",
                        left: `${columnWidths.id}px`,
                        zIndex: isModal ? "auto" : 10,
                        background: "white",
                        boxShadow: "1px 0 0 0 #9ca3af",
                    }}
                >
                    <div className="flex flex-col items-center justify-center left-0">
                        <div className="cursor-pointer font-semibold text-gray-700" onClick={() => handleSort("id")}>
                            Transaction ID {getSortIndicator("id")}
                        </div>
                        <div className="w-32">
                            <TableSearch onSearch={(value: string) => handleColumnFilter("id", value)} placeholder="Search ID" />
                        </div>
                    </div>
                </th>
                {orderedKeys
                    .filter((key) => !['checkbox', 'id', 'remarks'].includes(key))
                    .map((key) => (
                        <th
                            key={key}
                            className="px-4 py-2 border border-gray-400 relative"
                            style={{ width: `${columnWidths[key] ?? 100}px`, minWidth: "50px" }}
                        >
                            <div className="flex flex-col items-center justify-center">
                                <div className="cursor-pointer font-semibold text-gray-700" onClick={() => handleSort(key)}>
                                    {key.charAt(0).toUpperCase() + key.slice(1)} {getSortIndicator(key)}
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
                <th className="px-4 py-2 border border-gray-400 relative" style={{ width: `${columnWidths.remarks}px`, minWidth: '50px' }}>
                    Remarks
                    <div className="cursor-col-resize absolute right-0 top-0 h-full w-0.5 bg-gray-400" onMouseDown={(e) => handleMouseDown(e, 'remarks')} />
                </th>
            </tr>
        </thead>
    );
};

export default TableHeader;
