import React from "react";

interface TableBadgesProps {
    statuses: string[];
}

// Define the badge styles within the component
const badgeStyles: Record<string, string> = {
    Completed: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Failed: "bg-red-100 text-red-700",
};

const TableBadges: React.FC<TableBadgesProps> = ({ statuses }) => {
    // If badges are undefined or empty, show a default message
    if (!statuses || statuses.length === 0) {
        return <span className="text-gray-500">No Status</span>;
    }

    return (
        <div className="flex space-x-2">
            {statuses.map((status, index) => (
                <span key={index} className={`px-2 py-1 text-xs rounded ${badgeStyles[status] || "bg-gray-100 text-gray-700"}`}>
                    {status}
                </span>
            ))}
        </div>
    );
};

export default TableBadges;
