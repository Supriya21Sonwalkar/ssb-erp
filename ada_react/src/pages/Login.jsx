import { useState } from "react";
import { motion } from "framer-motion";
import { FaUserShield, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";

import img2 from "../assets/images/img2.png";

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState("");

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }
        
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationErrors = validateForm();
        setErrors(validationErrors);
        setLoginError("");
        
        if (Object.keys(validationErrors).length === 0) {
            setIsLoading(true);
            try {
                const response = await login(formData);
                
                if (response.success) {
                    // Store token and user data
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('user', JSON.stringify(response.user));
                    
                    // Redirect to modules dashboard
                    navigate('/modules/dashboard');
                } else {
                    setLoginError(response.message || 'Login failed. Please try again.');
                }
            } catch (error) {
                console.log("Status:", error.response?.status);
                console.log("Response:", error.response?.data);

                setLoginError(
                    error.response?.data?.message ||
                    error.response?.data?.errors?.email?.[0] ||
                    "Login failed"
                );
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error for this field when user starts typing
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Video */}
{/* Background Image */}
<img
    src={img2}
    alt="Background"
    className="absolute inset-0 w-full h-full object-cover"
/>

{/* Dark Overlay */}
<div className="absolute inset-0 bg-[#610e1e]/10"></div>

{/* Overlay */}
<div className="absolute inset-0 bg-gradient-to-br from-[#610e1e]/85 via-[#610e1e]/70 to-black/80"></div>
                {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-20 w-96 h-96 bg-[#FFD963]/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#FFD963]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFD963]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }}></div>
            </div>

            {/* Decorative Corners */}
            <div className="absolute top-10 left-10 w-20 h-20 border-l-2 border-t-2 border-[#FFD963]/30 rounded-tl-3xl animate-pulse" style={{ animationDuration: '3s' }}></div>
            <div className="absolute bottom-10 right-10 w-20 h-20 border-r-2 border-b-2 border-[#FFD963]/30 rounded-br-3xl animate-pulse" style={{ animationDuration: '3s', animationDelay: '1.5s' }}></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Back Button */}
<Link
    to="/"
    className="inline-flex items-center gap-2 px-5 py-3 mb-8 rounded-xl border-2 border-[#FFD963] bg-white/10 backdrop-blur-md text-[#FFD963] font-semibold shadow-lg transition-all duration-300 hover:bg-[#FFD963] hover:text-[#610e1e] hover:shadow-[#FFD963]/40 hover:scale-105 group"
>
    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
    <span>Back to Home</span>
</Link>

                {/* Login Card */}
                <div className="bg-white/95 backdrop-blur-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
                    {/* Header */}
                 
<div className="bg-gradient-to-r from-[#610e1e]/75 to-[#8B1A2E]/90 p-10 text-center relative">

    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD963]/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

    <div className="relative z-10">
        <h1 className="text-3xl font-bold text-white mb-2">
            ERP Login
        </h1>

        <p className="text-[#FFD963] text-sm font-semibold tracking-wide">
            Aaryans Defence Academy
        </p>
    </div>

</div>

                    {/* Form */}
                    <div className="p-8">
                        {loginError && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-3"
                            >
                                <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm shrink-0">✕</div>
                                <p className="font-semibold text-sm">{loginError}</p>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email Field */}
                            <div>
                                <label className="block text-[#610e1e]/80 uppercase tracking-[0.15em] text-[10px] font-bold mb-3">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#610e1e]/40">
                                        <FaUserShield size={20} />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        className={`w-full bg-[#faf8f4] border-none rounded-xl px-6 py-4 pl-12 focus:ring-2 focus:ring-[#FFD963] transition-all ${
                                            errors.email ? 'ring-2 ring-red-500' : ''
                                        }`}
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-xs mt-2 font-bold">{errors.email}</p>}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-[#610e1e]/80 uppercase tracking-[0.15em] text-[10px] font-bold mb-3">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#610e1e]/40">
                                        <FaLock size={20} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        className={`w-full bg-[#faf8f4] border-none rounded-xl px-6 py-4 pl-12 pr-12 focus:ring-2 focus:ring-[#FFD963] transition-all ${
                                            errors.password ? 'ring-2 ring-red-500' : ''
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#610e1e]/40 hover:text-[#FFD963] transition-colors"
                                    >
                                        {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-2 font-bold">{errors.password}</p>}
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-[#610e1e]/30 text-[#FFD963] focus:ring-[#FFD963]"
                                    />
                                    <span className="text-sm text-[#610e1e]/70">Remember me</span>
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-[#FFD963] hover:text-[#610e1e] font-semibold transition-colors"
                                >
                                    Forgot Password?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-[#610e1e] to-[#8B1A2E] text-white py-4 rounded-xl font-bold uppercase tracking-[0.15em] hover:from-[#8B1A2E] hover:to-[#610e1e] transition-all shadow-xl group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Sign In
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </span>
                                )}
                            </motion.button>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 text-center">
                            <p className="text-[#610e1e]/60 text-sm">
                                Don't have an account?{" "}
                                <Link to="/register" className="text-[#FFD963] hover:text-[#610e1e] font-semibold transition-colors">
                                    Contact Admin
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Help Text */}
                <div className="mt-8 text-center">
                    <p className="text-white/60 text-sm">
                        Need help? Contact{" "}
                        <a href="mailto:admin@adaerp.com" className="text-[#FFD963] hover:text-white font-semibold transition-colors">
                            admin@adaerp.com
                        </a>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
