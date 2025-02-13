import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [ifsc, setIfsc] = useState("");
    const [branch, setBranch] = useState("");
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        // Mock registration logic (store user in localStorage)
        const newUser = {
            fullName,
            email,
            password,
            accountNumber,
            ifsc,
            branch,
            phone,
            city,
            state,
        };

        const users = JSON.parse(localStorage.getItem("users") || "[]");
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                    Register
                </h2>
                <form onSubmit={handleRegister} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Section */}
                        <div>
                            <h3 className="text-xl font-medium text-gray-700 mb-4">
                                Personal Details
                            </h3>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium">Email</label>
                                <input
                                    type="email"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium">Create Password</label>
                                <input
                                    type="password"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium">Confirm Password</label>
                                <input
                                    type="password"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium">Phone Number</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Right Section */}
                        <div>
                            <h3 className="text-xl font-medium text-gray-700 mb-4">
                                Contact & Banking Details
                            </h3>
                            {/* Phone Number in Left Section */}

                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium">City</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium">State</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium">Account Number</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium">IFSC Code</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    value={ifsc}
                                    onChange={(e) => setIfsc(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium">Branch</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    value={branch}
                                    onChange={(e) => setBranch(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Register
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    Already have an account?{" "}
                    <span
                        className="text-blue-500 font-medium cursor-pointer hover:underline"
                        onClick={() => navigate("/login")}
                    >
                        Login here
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Register;
