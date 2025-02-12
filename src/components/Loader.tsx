import React from 'react';

const Loader: React.FC = () => {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
    );
};

export default Loader;
