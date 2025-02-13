import React from 'react';

const TableBadges: React.FC<{ status: string }> = ({ status }) => {
    let badgeClass = '';

    switch (status) {
        case 'Completed':
            badgeClass = 'bg-green-500';
            break;
        case 'Pending':
            badgeClass = 'bg-yellow-500';
            break;
        case 'Failed':
            badgeClass = 'bg-red-500';
            break;
        default:
            badgeClass = 'bg-gray-500';
    }

    return <span className={`text-white px-2 py-1 rounded ${badgeClass}`}>{status}</span>;
};

export default TableBadges;
