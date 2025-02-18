import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Dashboard from '../pages/Dashboard';
import Transactions from '../pages/Transactions';
import Login from '../pages/Login';
import Register from '../pages/Register';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Pages without Header/Footer */}
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Pages with Header/Footer */}
                <Route
                    path="/*"
                    element={
                        <>
                            <Header />
                            {/* <main className="flex-grow p-4"> */}
                            <Routes>
                                <Route path='dashboard' element={<Dashboard />} />
                                <Route path="transactions" element={<Transactions />} />
                            </Routes>
                            {/* </main> */}
                            <Footer />
                        </>
                    }
                />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
