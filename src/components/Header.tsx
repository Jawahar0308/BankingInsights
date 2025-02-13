import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import Dropdown from './Dropdown';

const Header: React.FC = () => {
    return (
        <header className="bg-blue-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo or App Name */}
                <Link to="/transactions" className="text-2xl font-bold">
                    SmartTable
                </Link>

                {/* Navigation Links */}
                <nav className="space-x-4">
                    <Link to="/dashboard" className="hover:text-blue-200">
                        Dashboard
                    </Link>
                    <Link to="/transactions" className="hover:text-blue-200">
                        Transactions
                    </Link>
                    <Link to="/reports" className="hover:text-blue-200">
                        Reports
                    </Link>
                </nav>

                {/* User Profile Dropdown */}
                {/* <Dropdown
                    trigger={<Button>Profile</Button>}
                    items={[
                        { label: 'Settings', onClick: () => console.log('Settings clicked') },
                        { label: 'Logout', onClick: () => console.log('Logout clicked') },
                    ]}
                /> */}
            </div>
        </header>
    );
};

export default Header;