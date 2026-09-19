import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const validateEmail = () => {
        if (!email) {
            setError('Email is required');
            return false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Email is invalid');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateEmail()) {
            // Here you would typically make an API call to send reset email
            console.log('Password reset requested for:', email);
            setIsSubmitted(true);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#e6f7f8] via-white to-[#e6f7f8] flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-xl shadow-lg border border-[#d0eff1] p-8 text-center">
                        <div className="w-16 h-16 bg-[#d0eff1] rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="h-8 w-8 text-[#178C92]" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Check your email</h2>
                        <p className="text-gray-600 mb-6">
                            We've sent a password reset link to <span className="font-medium text-gray-800">{email}</span>
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                            Didn't receive the email? Check your spam folder or{' '}
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="text-[#178C92] hover:text-[#0f6368] font-medium"
                            >
                                try again
                            </button>
                        </p>
                        <Link
                            to="/login"
                            className="inline-flex items-center text-[#178C92] hover:text-[#0f6368] font-medium transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#e6f7f8] via-white to-[#e6f7f8] flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-[#178C92] mb-2">Suzlon</h1>
                    <p className="text-gray-600">Reset your password</p>
                </div>

                {/* Forgot Password Card */}
                <div className="bg-white rounded-xl shadow-lg border border-[#d0eff1] p-8">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Forgot your password?</h2>
                        <p className="text-sm text-gray-600">
                            No worries! Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`block w-full pl-10 pr-3 py-3 border ${error ? 'border-red-300' : 'border-gray-300'
                                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6f7f8]0 focus:border-transparent transition-all`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {error && (
                                <p className="mt-1 text-sm text-red-600">{error}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-[#178C92] text-white py-3 px-4 rounded-lg hover:bg-[#0f6368] focus:outline-none focus:ring-2 focus:ring-[#e6f7f8]0 focus:ring-offset-2 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                        >
                            Send Reset Link
                        </button>
                    </form>

                    {/* Back to Login Link */}
                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center text-sm text-[#178C92] hover:text-[#0f6368] font-medium transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;


