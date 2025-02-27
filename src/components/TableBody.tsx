import React, { useState } from "react";
import TableCheckbox from "./TableCheckbox";
import TableActions from "./TableActions";
import TableImageRenderer from "./TableImageRenderer";
import TableBadges from "./TableBadges";
import TableChild from "./TableChild";

interface TableBodyProps {
    currentTransactions: any[];
    columnWidths: Record<string, number>;
    selectedRows: Set<number>;
    handleRowSelect: (index: number, checked: boolean) => void;
    onDragStart: (e: React.DragEvent<HTMLTableRowElement>, index: number) => void;
    onDragOver: (e: React.DragEvent<HTMLTableRowElement>) => void;
    onDragLeave: (e: React.DragEvent<HTMLTableRowElement>) => void;
    onDrop: (e: React.DragEvent<HTMLTableRowElement>, index: number) => void;
    onDragEnd: (e: React.DragEvent<HTMLTableRowElement>) => void;
    expandedRow: number | null;
    allKeys: string[];
    setExpandedRow: (id: number | null) => void;
    handleEdit: (transaction: any, field: string, value: any) => void;
    onEditDrawer: (index: number) => void;
}

const TableBody: React.FC<TableBodyProps> = ({
    currentTransactions,
    columnWidths,
    selectedRows,
    handleRowSelect,
    onDragStart,
    onDragOver,
    onDragLeave,
    onDrop,
    onDragEnd,
    expandedRow,
    allKeys,
    setExpandedRow,
    handleEdit,
    onEditDrawer,
}) => {
    const renderCell = (key: string, value: any, transaction: any) => {
        if (value === null || value === undefined) return <span className="text-gray-500">N/A</span>;

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
                if (Array.isArray(value)) {
                    return <span>{value.join(", ")}</span>;
                }
                if (typeof value === "object") {
                    return (
                        <div className="text-xs text-gray-700 space-y-1">
                            {Object.entries(value).map(([subKey, subValue], idx) => (
                                <div key={idx}>
                                    <strong>{subKey}:</strong>{" "}
                                    {subValue !== null && subValue !== undefined ? subValue.toString() : "N/A"}
                                </div>
                            ))}
                        </div>
                    );
                }
                return (
                    <span className="px-2 py-1 w-full">{value.toString()}</span>
                );
        }
    };

    return (
        <>
            {/* <div className="overflow-y-auto max-h-[500px] relative"> */}
            <tbody className="w-full" style={{ position: 'static' }}>
                {currentTransactions.map((transaction, index) => (
                    <React.Fragment key={transaction.id || `${transaction.id}-${index}`}>
                        <tr
                            className="text-center odd:bg-white even:bg-gray-50 cursor-move"
                            draggable
                            onDragStart={(e) => onDragStart(e, index)}
                            onDragOver={(e) => {
                                e.preventDefault();
                                onDragOver(e);
                            }}
                            onDragLeave={onDragLeave}
                            onDrop={(e) => onDrop(e, index)}
                            onDragEnd={onDragEnd}
                        >
                            <td className="bg-white px-4 py-2 border border-gray-400 min-w-[50px] sticky left-0 z-10 shadow-[1px_0_0_0_#9ca3af]">
                                <TableCheckbox
                                    isChecked={selectedRows.has(index)}
                                    onChange={(checked) => handleRowSelect(index, checked)}
                                />
                            </td>
                            <td
                                className="bg-white px-4 py-2 border border-gray-400 sticky left-[50px] z-10 shadow-[1px_0_0_0_#9ca3af]"
                                style={{ width: `${columnWidths.id}px` }}
                            >
                                {transaction.id || "N/A"}
                            </td>

                            {allKeys.map((key: string) => (
                                <td
                                    className="px-4 py-2 border border-gray-400"
                                    key={key}
                                    style={{
                                        width: `${columnWidths[key] || 150}px`,
                                        minWidth: "50px",
                                    }}
                                >
                                    {renderCell(key, transaction[key], transaction)}
                                </td>
                            ))}
                            <td className="px-4 py-2 border border-gray-400">
                                <TableActions
                                    transaction={transaction}
                                    onEdit={() => onEditDrawer(index)}
                                    isExpanded={expandedRow === index}
                                    onToggleExpand={() => setExpandedRow(expandedRow === index ? null : index)}
                                />
                            </td>
                        </tr>
                        {expandedRow === index && (
                            <tr className="bg-gray-100">
                                <td colSpan={allKeys.length + 3} className="border border-gray-400 p-4">
                                    <div className="flex items-center space-x-4">
                                        <TableImageRenderer method={transaction.payment_method} />
                                        <div>{transaction.payment_method} </div>
                                    </div>
                                    <div className="flex justify-start mt-2">
                                        <TableBadges statuses={transaction.badges} />
                                    </div>
                                    <TableChild
                                        relatedTransactions={transaction.childTable?.relatedTransactions ?? []}
                                    />
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
            </tbody>
            {/* </div> */}
        </>
    );
};

export default TableBody;
