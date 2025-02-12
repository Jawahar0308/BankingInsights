import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const Reports: React.FC = () => {
    const reports = useSelector((state: RootState) => state.reports);

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Reports</h1>
            {/* Render reports table */}
            <pre>{JSON.stringify(reports, null, 2)}</pre>
        </div>
    );
};

export default Reports;
