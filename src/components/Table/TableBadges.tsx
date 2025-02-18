import React from "react";

interface TableBadgesProps {
    statuses: string[];
}

const badgeStyles: Record<string, string> = {
    Completed: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Failed: "bg-red-100 text-red-700",
    Verified: "bg-blue-100 text-blue-700",
    // Default style for unknown statuses
    default: "bg-gray-100 text-gray-700"
};

const TableBadges: React.FC<TableBadgesProps> = ({ statuses = [] }) => {
    if (!statuses || statuses.length === 0) {
        return <span className="text-gray-500">No status available</span>;
    }

    return (
        <div className="flex space-x-2 justify-center">
            {statuses.map((status, index) => {
                const trimmedStatus = status.trim(); // Ensure no whitespace issues
                const isValidStatus = Object.keys(badgeStyles).includes(trimmedStatus);
                return (
                    <span
                        key={index}
                        className={`px-2 py-1 text-xs rounded ${badgeStyles[trimmedStatus] || badgeStyles.default}`}
                        title={!isValidStatus ? `Unknown status: ${trimmedStatus}` : undefined}
                    >
                        {isValidStatus ? trimmedStatus : 'Unknown'}
                    </span>
                );
            })}
        </div>
    );
};


export default TableBadges;
