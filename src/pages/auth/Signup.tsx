// import React, { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { Mail, Lock, Eye, EyeOff, User, Building } from 'lucide-react';
// import { useAppDispatch, useAppSelector } from '@/store';
// import { loginStart, loginSuccess, loginFailure } from '@/store/authSlice';
// import { authService } from '@/services/authService';

// const Signup = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const dispatch = useAppDispatch();
//     const { loading, error } = useAppSelector((state) => state.auth);
    
//     const [formData, setFormData] = useState({
//         fullName: '',
//         email: '',
//         password: '',
//         confirmPassword: '',
//         companyName: ''
//     });
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const [errors, setErrors] = useState({
//         fullName: '',
//         email: '',
//         password: '',
//         confirmPassword: '',
//         companyName: ''
//     });
//     const [acceptTerms, setAcceptTerms] = useState(false);

//     // Get the page user was trying to access
//     const from = (location.state as any)?.from?.pathname || '/Dashboard';

//     const validateForm = () => {
//         let isValid = true;
//         const newErrors = {
//             fullName: '',
//             email: '',
//             password: '',
//             confirmPassword: '',
//             companyName: ''
//         };

//         if (!formData.fullName.trim()) {
//             newErrors.fullName = 'Full name is required';
//             isValid = false;
//         }

//         if (!formData.email) {
//             newErrors.email = 'Email is required';
//             isValid = false;
//         } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//             newErrors.email = 'Email is invalid';
//             isValid = false;
//         }

//         if (!formData.password) {
//             newErrors.password = 'Password is required';
//             isValid = false;
//         } else if (formData.password.length < 6) {
//             newErrors.password = 'Password must be at least 6 characters';
//             isValid = false;
//         }

//         if (!formData.confirmPassword) {
//             newErrors.confirmPassword = 'Please confirm your password';
//             isValid = false;
//         } else if (formData.password !== formData.confirmPassword) {
//             newErrors.confirmPassword = 'Passwords do not match';
//             isValid = false;
//         }

//         if (!acceptTerms) {
//             isValid = false;
//         }

//         setErrors(newErrors);
//         return isValid;
//     };

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if (validateForm()) {
//             try {
//                 dispatch(loginStart());
//                 const response = await authService.signup({
//                     fullName: formData.fullName,
//                     email: formData.email,
//                     password: formData.password,
//                     companyName: formData.companyName || undefined
//                 });
                
//                 if (response.success) {
//                     dispatch(loginSuccess({
//                         user: response.data.user,
//                         token: response.data.token
//                     }));
//                     // Redirect to the page they were trying to access
//                     navigate(from, { replace: true });
//                 }
//             } catch (err: any) {
//                 const errorMessage = err.response?.data?.message || 'Signup failed. Please try again.';
//                 dispatch(loginFailure(errorMessage));
//             }
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
//             <div className="max-w-md w-full">
//                 {/* Logo/Brand */}
//                 <div className="text-center mb-8">
//                     <h1 className="text-4xl font-bold text-purple-600 mb-2">Invoice Pro</h1>
//                     <p className="text-gray-600">Create your account</p>
//                 </div>

//                 {/* Signup Card */}
//                 <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-8">
//                     {/* Redirect Notice */}
//                     {from !== '/Dashboard' && (
//                         <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                             <p className="text-sm text-blue-800">
//                                 Create an account to continue to your requested page
//                             </p>
//                         </div>
//                     )}
                    
//                     <form onSubmit={handleSubmit} className="space-y-5">
//                         {/* Error Message */}
//                         {error && (
//                             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
//                                 {error}
//                             </div>
//                         )}

//                         {/* Full Name Field */}
//                         <div>
//                             <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
//                                 Full Name
//                             </label>
//                             <div className="relative">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <User className="h-5 w-5 text-gray-400" />
//                                 </div>
//                                 <input
//                                     id="fullName"
//                                     name="fullName"
//                                     type="text"
//                                     value={formData.fullName}
//                                     onChange={handleChange}
//                                     className={`block w-full pl-10 pr-3 py-3 border ${errors.fullName ? 'border-red-300' : 'border-gray-300'
//                                         } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
//                                     placeholder="John Doe"
//                                 />
//                             </div>
//                             {errors.fullName && (
//                                 <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
//                             )}
//                         </div>

//                         {/* Email Field */}
//                         <div>
//                             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                                 Email Address
//                             </label>
//                             <div className="relative">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <Mail className="h-5 w-5 text-gray-400" />
//                                 </div>
//                                 <input
//                                     id="email"
//                                     name="email"
//                                     type="email"
//                                     value={formData.email}
//                                     onChange={handleChange}
//                                     className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-300' : 'border-gray-300'
//                                         } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
//                                     placeholder="you@example.com"
//                                 />
//                             </div>
//                             {errors.email && (
//                                 <p className="mt-1 text-sm text-red-600">{errors.email}</p>
//                             )}
//                         </div>

//                         {/* Company Name Field (Optional) */}
//                         <div>
//                             <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
//                                 Company Name <span className="text-gray-400 text-xs">(Optional)</span>
//                             </label>
//                             <div className="relative">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <Building className="h-5 w-5 text-gray-400" />
//                                 </div>
//                                 <input
//                                     id="companyName"
//                                     name="companyName"
//                                     type="text"
//                                     value={formData.companyName}
//                                     onChange={handleChange}
//                                     className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//                                     placeholder="Your Company"
//                                 />
//                             </div>
//                         </div>

//                         {/* Password Field */}
//                         <div>
//                             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                                 Password
//                             </label>
//                             <div className="relative">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <Lock className="h-5 w-5 text-gray-400" />
//                                 </div>
//                                 <input
//                                     id="password"
//                                     name="password"
//                                     type={showPassword ? 'text' : 'password'}
//                                     value={formData.password}
//                                     onChange={handleChange}
//                                     className={`block w-full pl-10 pr-10 py-3 border ${errors.password ? 'border-red-300' : 'border-gray-300'
//                                         } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
//                                     placeholder="••••••••"
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={() => setShowPassword(!showPassword)}
//                                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                                 >
//                                     {showPassword ? (
//                                         <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                                     ) : (
//                                         <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                                     )}
//                                 </button>
//                             </div>
//                             {errors.password && (
//                                 <p className="mt-1 text-sm text-red-600">{errors.password}</p>
//                             )}
//                         </div>

//                         {/* Confirm Password Field */}
//                         <div>
//                             <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
//                                 Confirm Password
//                             </label>
//                             <div className="relative">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <Lock className="h-5 w-5 text-gray-400" />
//                                 </div>
//                                 <input
//                                     id="confirmPassword"
//                                     name="confirmPassword"
//                                     type={showConfirmPassword ? 'text' : 'password'}
//                                     value={formData.confirmPassword}
//                                     onChange={handleChange}
//                                     className={`block w-full pl-10 pr-10 py-3 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
//                                         } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
//                                     placeholder="••••••••"
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                                 >
//                                     {showConfirmPassword ? (
//                                         <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                                     ) : (
//                                         <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                                     )}
//                                 </button>
//                             </div>
//                             {errors.confirmPassword && (
//                                 <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
//                             )}
//                         </div>

//                         {/* Terms and Conditions */}
//                         <div className="flex items-start">
//                             <input
//                                 id="accept-terms"
//                                 type="checkbox"
//                                 checked={acceptTerms}
//                                 onChange={(e) => setAcceptTerms(e.target.checked)}
//                                 className="h-4 w-4 mt-1 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
//                             />
//                             <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-700 cursor-pointer">
//                                 I agree to the{' '}
//                                 <Link to="/terms" className="text-purple-600 hover:text-purple-700 font-medium">
//                                     Terms and Conditions
//                                 </Link>{' '}
//                                 and{' '}
//                                 <Link to="/privacy" className="text-purple-600 hover:text-purple-700 font-medium">
//                                     Privacy Policy
//                                 </Link>
//                             </label>
//                         </div>
//                         {!acceptTerms && (
//                             <p className="text-sm text-red-600">You must accept the terms and conditions</p>
//                         )}

//                         {/* Submit Button */}
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             {loading ? 'Signing Up...' : 'Sign Up'}
//                         </button>
//                     </form>

//                     {/* Login Link */}
//                     <p className="mt-6 text-center text-sm text-gray-600">
//                         Already have an account?{' '}
//                         <Link
//                             to="/login"
//                             state={{ from: location.state?.from }}
//                             className="font-medium text-purple-600 hover:text-purple-700 transition-colors"
//                         >
//                             Sign in
//                         </Link>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Signup;

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, User, Building } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { loginStart, loginFailure } from '@/store/authSlice';
import { authService } from '@/services/authService';
import OtpStep from '@/components/OtpStep';

const Signup = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);

    const [formData, setFormData] = useState({ fullName: '', email: '', companyName: '' });
    const [errors, setErrors] = useState({ fullName: '', email: '' });
    const [step, setStep] = useState<'details' | 'otp'>('details');
    const [otpEmail, setOtpEmail] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);

    const from = (location.state as any)?.from?.pathname || '/Dashboard';

    const validate = () => {
        const newErrors = { fullName: '', email: '' };
        let valid = true;
        if (!formData.fullName.trim()) { newErrors.fullName = 'Full name is required'; valid = false; }
        if (!formData.email) { newErrors.email = 'Email is required'; valid = false; }
        else if (!/\S+@\S+\.\S+/.test(formData.email)) { newErrors.email = 'Email is invalid'; valid = false; }
        if (!acceptTerms) valid = false;
        setErrors(newErrors);
        return valid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            dispatch(loginStart());
            const response = await authService.signup({
                fullName: formData.fullName,
                email: formData.email,
                companyName: formData.companyName || undefined
            });
            if (response.success && response.requiresOtp) {
                setOtpEmail(response.email);
                setStep('otp');
                dispatch(loginFailure(''));
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Signup failed. Please try again.';
            dispatch(loginFailure(msg));
        }
    };

    if (step === 'otp') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-purple-600 mb-2">Invoice Pro</h1>
                        <p className="text-gray-600">Verify your email</p>
                    </div>
                    <OtpStep email={otpEmail} onBack={() => setStep('details')} redirectTo={from} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-purple-600 mb-2">Invoice Pro</h1>
                    <p className="text-gray-600">Create your account</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-8">
                    {from !== '/Dashboard' && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">Create an account to continue to your requested page</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
                        )}

                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="fullName" name="fullName" type="text"
                                    value={formData.fullName} onChange={handleChange}
                                    className={`block w-full pl-10 pr-3 py-3 border ${errors.fullName ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                                    placeholder="John Doe"
                                />
                            </div>
                            {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email" name="email" type="email"
                                    value={formData.email} onChange={handleChange}
                                    className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                                Company Name <span className="text-gray-400 text-xs">(Optional)</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Building className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="companyName" name="companyName" type="text"
                                    value={formData.companyName} onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    placeholder="Your Company"
                                />
                            </div>
                        </div>

                        <div className="flex items-start">
                            <input
                                id="accept-terms" type="checkbox"
                                checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)}
                                className="h-4 w-4 mt-1 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
                            />
                            <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                                I agree to the{' '}
                                <Link to="/terms" className="text-purple-600 hover:text-purple-700 font-medium">Terms and Conditions</Link>
                                {' '}and{' '}
                                <Link to="/privacy" className="text-purple-600 hover:text-purple-700 font-medium">Privacy Policy</Link>
                            </label>
                        </div>
                        {!acceptTerms && <p className="text-sm text-red-600">You must accept the terms and conditions</p>}

                        <button
                            type="submit" disabled={loading}
                            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Sending OTP...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" state={{ from: location.state?.from }} className="font-medium text-purple-600 hover:text-purple-700 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;

