// import React from 'react';

// interface TablePaginationProps {
//     currentPage: number;
//     totalPages: number;
//     onPageChange: (page: number) => void;
// }

// const TablePagination: React.FC<TablePaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
//     return (
//         <div className="flex justify-between items-center mt-4">
//             <button
//                 onClick={() => onPageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="px-4 py-2 bg-blue-500 text-white rounded"
//             >
//                 Previous
//             </button>
//             <span>
//                 Page {currentPage} of {totalPages}
//             </span>
//             <button
//                 onClick={() => onPageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className="px-4 py-2 bg-blue-500 text-white rounded"
//             >
//                 Next
//             </button>
//         </div>
//     );
// };

// export default TablePagination;
