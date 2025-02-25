import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { login, markAsExistingUser } from "../redux/slices/authSlice";
import users from "../data/json/users.json";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    // const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous errors
        setErrors({});

        // Validate email format
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

        const registeredUser = users.find(
            (user: { email: string; password: string }) =>
                user.email === email && user.password === password
        );

        if (registeredUser) {
            // dispatch(login({
            //     email: email,
            //     isNewUser: false
            // }));
            // dispatch(markAsExistingUser());
            navigate("/dashboard");
        } else {
            setErrors({ email: 'Invalid email or password', password: 'Invalid email or password' });
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
                            className={`w-full p-3 mt-1 border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg focus:outline-none`}
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setErrors(prev => ({ ...prev, email: '' }));
                            }}
                            required
                            autoComplete="new-password"
                            readOnly
                            onFocus={(e) => e.target.removeAttribute('readOnly')}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            className={`w-full p-3 mt-1 border ${errors.password ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg focus:outline-none`}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setErrors(prev => ({ ...prev, password: '' }));
                            }}
                            required
                            autoComplete="new-password"
                            readOnly
                            onFocus={(e) => e.target.removeAttribute('readOnly')}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg cursor-pointer"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    Don't have an account?{" "}
                    <button
                        className="text-blue-500 font-medium bg-transparent border-none p-0 cursor-pointer"
                        onClick={() => navigate("/register")}
                    >
                        Register here
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;