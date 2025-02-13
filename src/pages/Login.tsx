import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import users from "../data/json/users.json"; // Import users.json

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Log the imported users.json data to check if it's loaded correctly
        console.log("Users from users.json:", users);

        // Compare input email and password with data from users.json
        const registeredUser = users.find(
            (user: { email: string; password: string }) =>
                user.email === email && user.password === password
        );

        if (registeredUser) {
            console.log("Login successful!");
            navigate("/dashboard");
        } else {
            setError("Invalid email or password.");
            console.log("Invalid login attempt");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                    Sign in
                </h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition duration-300 shadow-md"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    Don't have an account?{" "}
                    <span
                        className="text-blue-500 font-medium cursor-pointer hover:underline"
                        onClick={() => navigate("/register")}
                    >
                        Register here
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;
