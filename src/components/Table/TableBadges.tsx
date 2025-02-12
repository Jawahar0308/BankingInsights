import React from 'react';

interface TableBadgesProps {
    status: 'Pending' | 'Completed' | 'Failed';
}

const TableBadges: React.FC<TableBadgesProps> = ({ status }) => {
    let badgeColor = '';

    switch (status) {
        case 'Pending':
            badgeColor = 'bg-yellow-500 text-white';
            break;
        case 'Completed':
            badgeColor = 'bg-green-500 text-white';
            break;
        case 'Failed':
            badgeColor = 'bg-red-500 text-white';
            break;
    }

    return (
        <span className={`px-3 py-1 rounded-full ${badgeColor}`}>
            {status}
        </span>
    );
};

export default TableBadges;
