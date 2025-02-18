import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [errors, setErrors] = useState<{
        fullName?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
        phone?: string;
    }>({});

    const navigate = useNavigate();

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous errors
        setErrors({});

        // Validate full name
        if (fullName.trim().length < 3) {
            setErrors(prev => ({ ...prev, fullName: 'Full name must be at least 3 characters' }));
            return;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
            return;
        }

        // Validate password
        if (password.length < 6) {
            setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
            return;
        }

        // Validate password match
        if (password !== confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
            return;
        }

        // Validate phone number
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            setErrors(prev => ({ ...prev, phone: 'Please enter a valid 10-digit phone number' }));
            return;
        }

        // Proceed with registration (if no errors)
        // (You can add your registration logic here)
        navigate("/");
    };

    // Disable button if any input is empty or there are errors
    const isFormValid =
        fullName && email && password && confirmPassword && phone && Object.keys(errors).length === 0;

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Register</h2>
                <form onSubmit={handleRegister} className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            className={`w-full p-2 mt-1 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                                } rounded-md focus:outline-none`}
                            placeholder="Enter your full name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            className={`w-full p-2 mt-1 border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                } rounded-md focus:outline-none`}
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            className={`w-full p-2 mt-1 border ${errors.password ? 'border-red-500' : 'border-gray-300'
                                } rounded-md focus:outline-none`}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            className={`w-full p-2 mt-1 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                } rounded-md focus:outline-none`}
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            type="text"
                            className={`w-full p-2 mt-1 border ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                } rounded-md focus:outline-none`}
                            placeholder="Enter your phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        disabled={!isFormValid} // Disable button if form is invalid
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
