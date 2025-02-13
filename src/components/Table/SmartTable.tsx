// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { getTransactions } from '../../data/transactions';
// import { getReports } from '../../data/reports';
// import { setTransactions } from '../../redux/slices/transactionsSlice';
// import { setReports } from '../../redux/slices/reportsSlice';
// import { RootState } from '../../redux/store';
// import { CSVLink } from 'react-csv';
// import { useDrag, useDrop } from 'react-dnd';

// const Dashboard: React.FC = () => {
//     const dispatch = useDispatch();
//     const transactions = useSelector((state: RootState) => state.transactions.data);
//     const reports = useSelector((state: RootState) => state.reports.data);
//     const [searchTerm, setSearchTerm] = useState('');

//     useEffect(() => {
//         dispatch(setTransactions(getTransactions()));
//         dispatch(setReports(getReports()));
//     }, [dispatch]);

//     const filteredTransactions = transactions.filter(transaction =>
//         transaction.account_number.includes(searchTerm) || transaction.status.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <div className="dashboard p-6 bg-gray-100 min-h-screen">
//             <h1 className="text-3xl font-bold mb-4 text-center">Finance Dashboard</h1>

//             {/* Search & Export */}
//             <div className="flex justify-between mb-4">
//                 <input
//                     type="text"
//                     placeholder="Search by Account Number or Status"
//                     className="p-2 border rounded-lg w-1/3"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//                 <CSVLink
//                     data={transactions}
//                     filename="transactions.csv"
//                     className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
//                 >
//                     Export CSV
//                 </CSVLink>
//             </div>

//             {/* Transactions Table */}
//             <section className="transactions bg-white p-4 rounded-lg shadow-lg mb-6">
//                 <h2 className="text-xl font-semibold mb-3">Recent Transactions</h2>
//                 <div className="overflow-x-auto">
//                     <table className="table-auto w-full border-collapse border border-gray-400">
//                         <thead className="bg-gray-200">
//                             <tr>
//                                 <th className="px-4 py-2 border border-gray-400">Transaction ID</th>
//                                 <th className="px-4 py-2 border border-gray-400">Date</th>
//                                 <th className="px-4 py-2 border border-gray-400">Amount</th>
//                                 <th className="px-4 py-2 border border-gray-400">Account Number</th>
//                                 <th className="px-4 py-2 border border-gray-400">Status</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {filteredTransactions.map((transaction) => (
//                                 <tr key={transaction.id} className="text-center odd:bg-white even:bg-gray-50">
//                                     <td className="px-4 py-2 border border-gray-400">{transaction.id}</td>
//                                     <td className="px-4 py-2 border border-gray-400">{transaction.date}</td>
//                                     <td className="px-4 py-2 border border-gray-400 text-green-600 font-semibold">₹{transaction.amount}</td>
//                                     <td className="px-4 py-2 border border-gray-400">{transaction.account_number}</td>
//                                     <td className="px-4 py-2 border border-gray-400">
//                                         <span className={`px-2 py-1 rounded text-white ${transaction.status === 'Completed' ? 'bg-green-500' : transaction.status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'}`}>
//                                             {transaction.status}
//                                         </span>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </section>

//             {/* Reports Table */}
//             <section className="reports bg-white p-4 rounded-lg shadow-lg">
//                 <h2 className="text-xl font-semibold mb-3">Financial Reports</h2>
//                 <div className="overflow-x-auto">
//                     <table className="table-auto w-full border-collapse border border-gray-400">
//                         <thead className="bg-gray-200">
//                             <tr>
//                                 <th className="px-4 py-2 border border-gray-400">Month</th>
//                                 <th className="px-4 py-2 border border-gray-400">Total Transactions</th>
//                                 <th className="px-4 py-2 border border-gray-400">Deposits</th>
//                                 <th className="px-4 py-2 border border-gray-400">Withdrawals</th>
//                                 <th className="px-4 py-2 border border-gray-400">Net Balance</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {reports.map((report) => (
//                                 <tr key={report.month} className="text-center odd:bg-white even:bg-gray-50">
//                                     <td className="px-4 py-2 border border-gray-400">{report.month}</td>
//                                     <td className="px-4 py-2 border border-gray-400">{report.total_transactions}</td>
//                                     <td className="px-4 py-2 border border-gray-400 text-green-600 font-semibold">₹{report.deposits}</td>
//                                     <td className="px-4 py-2 border border-gray-400 text-red-600 font-semibold">₹{report.withdrawals}</td>
//                                     <td className="px-4 py-2 border border-gray-400 font-bold">₹{report.net_balance}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </section>
//         </div>
//     );
// };

// export default Dashboard;
