import React, { JSX } from "react";
import TableCheckbox from "../components/TableCheckbox";
import TableActions from "../components/TableActions";
import TableImageRenderer from "../components/TableImageRenderer";
import TableBadges from "../components/TableBadges";
import TableChild from "../components/TableChild";

interface TableBodyProps {
    currentTransactions: any[];
    columnWidths: Record<string, number>;
    selectedRows: Set<number>;
    handleRowSelect: (id: number, checked: boolean) => void;
    onDragStart: (e: React.DragEvent<HTMLTableRowElement>, index: number) => void;
    onDragOver: (e: React.DragEvent<HTMLTableRowElement>) => void;
    onDragLeave: (e: React.DragEvent<HTMLTableRowElement>) => void;
    onDrop: (e: React.DragEvent<HTMLTableRowElement>, index: number) => void;
    onDragEnd: (e: React.DragEvent<HTMLTableRowElement>) => void;
    expandedRow: number | null;
    firstColumns: string[];
    middleColumns: string[];
    setExpandedRow: (id: number | null) => void;
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
    firstColumns,
    middleColumns,
    setExpandedRow,
}) => {
    const renderCellWithValidation = React.useCallback((key: string, value: any): JSX.Element | null => {
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
                    return <span>{value.join(', ')}</span>;
                }
                if (typeof value === 'object') {
                    return (
                        <div className="text-xs text-gray-700 space-y-1">
                            {Object.entries(value).map(([subKey, subValue], idx) => (
                                <div key={idx}>
                                    <strong>{subKey}:</strong> {subValue !== null && subValue !== undefined ? subValue.toString() : 'N/A'}
                                </div>
                            ))}
                        </div>
                    );
                }
                return <span>{value.toString()}</span>;
        }
    }, []);
    return (
        <tbody className="w-full">
            {currentTransactions.map((transaction, index) => (
                <React.Fragment key={transaction.id || `generated-${index}`}>
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
                        <td className="bg-white px-4 py-2 border border-gray-400 min-w-[50px]">
                            <TableCheckbox
                                isChecked={selectedRows.has(transaction.id || 0)}
                                onChange={(checked) => handleRowSelect(transaction.id || 0, checked)}
                            />
                        </td>
                        <td className="bg-white px-4 py-2 border border-gray-400" style={{ width: `${columnWidths.id}px` }}>
                            {transaction.id || "N/A"}
                        </td>
                        {firstColumns.map((key) => (
                            <td
                                className="px-4 py-2 border border-gray-400 font-bold"
                                key={key}
                                style={{
                                    width: `${columnWidths[key] || 150}px`,
                                    minWidth: "50px",
                                }}
                            >
                                {renderCellWithValidation(key, transaction[key])}
                            </td>
                        ))}

                        {middleColumns
                            .filter((key) => key !== "id")
                            .map((key) => (
                                <td
                                    className="px-4 py-2 border border-gray-400"
                                    key={key}
                                    style={{
                                        width: `${columnWidths[key] || 150}px`,
                                        minWidth: "50px",
                                    }}
                                >
                                    {renderCellWithValidation(key, transaction[key])}
                                </td>
                            ))}
                        <td className="px-4 py-2 border border-gray-400">
                            <TableActions
                                transaction={transaction}
                                isExpanded={expandedRow === transaction.id}
                                onToggleExpand={() => setExpandedRow(expandedRow === transaction.id ? null : transaction.id)}
                            />
                        </td>
                    </tr>
                    {expandedRow === transaction.id && (
                        <tr className="bg-gray-100">
                            <td colSpan={firstColumns.length + middleColumns.length + 2} className="border border-gray-400 p-4">
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
    );
};

export default TableBody;
