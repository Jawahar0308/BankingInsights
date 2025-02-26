import React, { useRef, useEffect, useCallback } from "react";
import TableSearch from "../components/TableSearch";
import TableCheckbox from "../components/TableCheckbox";

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
        e.preventDefault();
        resizingColumn.current = columnKey;
        startX.current = e.clientX;
        startWidth.current = columnWidths[columnKey] ?? 100;

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!resizingColumn.current) return;

        const delta = e.clientX - startX.current;
        const columnKey = resizingColumn.current!;
        const newWidth = Math.max(startWidth.current + delta, 50);

        e.preventDefault();
        e.stopPropagation();

        onColumnResize(columnKey, newWidth);
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
        document.body.style.pointerEvents = "none";
    }, [onColumnResize]);

    const handleMouseUp = useCallback(() => {
        resizingColumn.current = null;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        document.body.style.pointerEvents = "";
    }, [handleMouseMove]);

    useEffect(() => {
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    const getSortIndicator = (key: string) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === "asc" ? "↑" : "↓";
    };

    const orderedKeys = allKeys.includes("category")
        ? ["category", ...allKeys.filter((key) => key !== "category")]
        : allKeys;

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

                {/* ID Column */}
                <th
                    key="id"
                    className="px-4 py-2 border border-gray-400 bg-white relative"
                    style={{
                        width: `${columnWidths.id ?? 100}px`,
                        position: isModal ? "static" : "sticky",
                        left: "50px",
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

                {/* Dynamic Columns */}
                {orderedKeys
                    .filter((key) => !["checkbox", "id", "remarks"].includes(key))
                    .map((key) => (
                        <th
                            key={key}
                            className="px-4 py-2 border border-gray-400 relative"
                            style={{ width: `${columnWidths[key] || 200}px`, minWidth: "150px" }}
                        >
                            <div className="flex flex-col items-center justify-center">
                                <div className="cursor-pointer font-semibold text-gray-700" onClick={() => handleSort(key)}>
                                    {key.charAt(0).toUpperCase() + key.slice(1)} {getSortIndicator(key)}
                                </div>
                                <div className="w-32 mx-auto">
                                    <TableSearch onSearch={(value: string) => handleColumnFilter(key, value)} placeholder={`Search ${key}`} />
                                </div>
                            </div>
                            {/* Resizable Handle */}
                            <div
                                style={{
                                    position: "absolute",
                                    right: -2,
                                    top: 0,
                                    height: "100%",
                                    width: "6px",
                                    cursor: "col-resize",
                                    backgroundColor: "#9ca3af",
                                    opacity: 0,
                                    transition: "opacity 0.2s",
                                    zIndex: 1,
                                    userSelect: "none"
                                }}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleMouseDown(e, key);
                                }}
                                onMouseEnter={(e) => {
                                    const target = e.target as HTMLElement;
                                    target.style.opacity = "1";
                                }}
                                onMouseLeave={(e) => {
                                    const target = e.target as HTMLElement;
                                    target.style.opacity = "0";
                                }}
                                className={`resizer resizer-${key}`}
                            />
                        </th>
                    ))}

                {/* Remarks Column */}
                <th className="px-4 py-2 border border-gray-400 relative" style={{ width: `${columnWidths.remarks || 120}px`, minWidth: "50px" }}>
                    Remarks
                    <div
                        style={{
                            position: "absolute",
                            right: 0,
                            top: 0,
                            height: "100%",
                            width: "4px",
                            cursor: "col-resize",
                            backgroundColor: "#9ca3af",
                            opacity: 0,
                            transition: "opacity 0.2s",
                            zIndex: 1,
                        }}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            handleMouseDown(e, "remarks");
                        }}
                        onMouseEnter={(e) => {
                            const target = e.target as HTMLElement;
                            target.style.opacity = "1";
                        }}
                        onMouseLeave={(e) => {
                            const target = e.target as HTMLElement;
                            target.style.opacity = "0";
                        }}
                        className="resizer resizer-remarks"
                    />
                </th>
            </tr>
        </thead>
    );
};

export default TableHeader;
