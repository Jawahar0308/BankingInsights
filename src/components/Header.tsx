import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { RootState } from '../redux/store';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();  // Get the current route
    const [isTitleCentered, setIsTitleCentered] = useState(false); // Track title centering
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    const handleLogout = () => {
        setTimeout(() => {
            navigate('/');
        }, 500);
    };

    // Dynamically set title based on the current route
    const getTitle = () => {
        switch (location.pathname) {
            case '/dashboard':
                return 'Dashboard';
            case '/transactions':
                return 'Transaction History';
            default:
                return '';
        }
    };

    // Effect to detect when title needs to be centered
    useEffect(() => {
        if (location.pathname === '/dashboard' || location.pathname === '/transactions') {
            setIsTitleCentered(true);
        } else {
            setIsTitleCentered(false);
        }
    }, [location.pathname]);

    return (
        <header className="shadow-md bg-blue-500 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                {/* Finance Banking Link on the Left */}
                <Link to="/dashboard" className="text-xl font-semibold text-white hover:text-blue-200">
                    FinTrack
                </Link>

                {/* Title centered only for specific routes */}
                <div className={`flex-1 ${isTitleCentered ? 'text-center' : ''}`}>
                    {isTitleCentered && (
                        <h1 className="text-2xl font-bold text-white">{getTitle()}</h1>
                    )}
                </div>

                {/* Navigation Links */}
                <nav className="space-x-4 ml-auto">
                    <Link to="/dashboard" className="hover:text-blue-200 text-white justify-end items-end">
                        Dashboard
                    </Link>
                    <Link to="/transactions" className="hover:text-blue-200 text-white justify-end items-end">
                        Transactions
                    </Link>
                </nav>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 ml-5 rounded-lg hover:bg-red-600 cursor-pointer"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;
