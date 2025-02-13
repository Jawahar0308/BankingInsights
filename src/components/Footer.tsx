import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white p-4 mt-auto">
            <div className="container mx-auto text-center">
                <p className="text-sm">
                    &copy; {new Date().getFullYear()} SmartTable. All rights reserved.
                </p>
                <div className="mt-2 space-x-4">
                    <a href="/privacy-policy" className="hover:text-blue-200">
                        Privacy Policy
                    </a>
                    <a href="/terms-of-service" className="hover:text-blue-200">
                        Terms of Service
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;