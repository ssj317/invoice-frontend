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
//         <div className="min-h-screen bg-[#F8F4E1] flex items-center justify-center p-4">
//             <div className="max-w-md w-full">
//                 {/* Logo/Brand */}
//                 <div className="text-center mb-8">
//                     <h1 className="text-4xl font-bold text-[#178C92] mb-2">Suzlon</h1>
//                     <p className="text-gray-600">Create your account</p>
//                 </div>

//                 {/* Signup Card */}
//                 <div className="bg-white rounded-xl shadow-lg border border-[#d0eff1] p-8">
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
//                                         } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6f7f8]0 focus:border-transparent transition-all`}
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
//                                         } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6f7f8]0 focus:border-transparent transition-all`}
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
//                                     className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6f7f8]0 focus:border-transparent transition-all"
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
//                                         } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6f7f8]0 focus:border-transparent transition-all`}
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
//                                         } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6f7f8]0 focus:border-transparent transition-all`}
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
//                                 className="h-4 w-4 mt-1 text-[#178C92] focus:ring-[#e6f7f8]0 border-gray-300 rounded cursor-pointer"
//                             />
//                             <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-700 cursor-pointer">
//                                 I agree to the{' '}
//                                 <Link to="/terms" className="text-[#178C92] hover:text-[#0f6368] font-medium">
//                                     Terms and Conditions
//                                 </Link>{' '}
//                                 and{' '}
//                                 <Link to="/privacy" className="text-[#178C92] hover:text-[#0f6368] font-medium">
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
//                             className="w-full bg-[#178C92] text-white py-3 px-4 rounded-lg hover:bg-[#0f6368] focus:outline-none focus:ring-2 focus:ring-[#e6f7f8]0 focus:ring-offset-2 transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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
//                             className="font-medium text-[#178C92] hover:text-[#0f6368] transition-colors"
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

// import React, { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { Mail, User, Building } from 'lucide-react';
// import { useAppDispatch, useAppSelector } from '@/store';
// import { loginStart, loginFailure } from '@/store/authSlice';
// import { authService } from '@/services/authService';
// import OtpStep from '@/components/OtpStep';
// import LandingNavbar from '@/components/LandingNavbar';

// const Signup = () => {
//     const location = useLocation();
//     const dispatch = useAppDispatch();
//     const { loading, error } = useAppSelector((state) => state.auth);

//     const [formData, setFormData] = useState({ fullName: '', email: '', companyName: '' });
//     const [errors, setErrors] = useState({ fullName: '', email: '' });
//     const [step, setStep] = useState<'details' | 'otp'>('details');
//     const [otpEmail, setOtpEmail] = useState('');
//     const [acceptTerms, setAcceptTerms] = useState(false);

//     const from = (location.state as any)?.from?.pathname || '/Dashboard';

//     const validate = () => {
//         const newErrors = { fullName: '', email: '' };
//         let valid = true;
//         if (!formData.fullName.trim()) { newErrors.fullName = 'Full name is required'; valid = false; }
//         if (!formData.email) { newErrors.email = 'Email is required'; valid = false; }
//         else if (!/\S+@\S+\.\S+/.test(formData.email)) { newErrors.email = 'Email is invalid'; valid = false; }
//         if (!acceptTerms) valid = false;
//         setErrors(newErrors);
//         return valid;
//     };

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         console.log('Form submitted');
//         console.log('Validation result:', validate());
//         if (!validate()) return;
//         try {
//             dispatch(loginStart());
//             console.log('Sending signup request with data:', {
//                 fullName: formData.fullName,
//                 email: formData.email,
//                 companyName: formData.companyName || undefined
//             });
//             const response = await authService.signup({
//                 fullName: formData.fullName,
//                 email: formData.email,
//                 companyName: formData.companyName || undefined
//             });
//             console.log('Full response received:', response);
//             console.log('response.success:', response.success);
//             console.log('response.requiresOtp:', response.requiresOtp);
//             console.log('response.email:', response.email);
            
//             if (response.success && response.requiresOtp) {
//                 console.log('Condition met! Setting OTP email and changing step');
//                 setOtpEmail(response.email);
//                 setStep('otp');
//                 dispatch(loginFailure(''));
//             } else {
//                 console.log('Condition NOT met!');
//                 console.log('success is:', response.success);
//                 console.log('requiresOtp is:', response.requiresOtp);
//             }
//         } catch (err: any) {
//             console.error('Signup error caught:', err);
//             console.error('Error response:', err.response);
//             const msg = err.response?.data?.message || 'Signup failed. Please try again.';
//             dispatch(loginFailure(msg));
//         }
//     };

//     if (step === 'otp') {
//         return (
//             <>
//                 <LandingNavbar />
//                 <div className="min-h-screen bg-[#F8F4E1] flex items-center justify-center p-4">
//                     <div className="max-w-md w-full">
//                         <div className="text-center mb-8">
//                             <h1 className="text-4xl font-bold text-[#178C92] mb-2">Suzlon</h1>
//                             <p className="text-gray-600">Verify your email</p>
//                         </div>
//                         <OtpStep email={otpEmail} onBack={() => setStep('details')} redirectTo={from} />
//                     </div>
//                 </div>
//             </>
//         );
//     }

//     return (
//         <>
//             <LandingNavbar />
//             <div className="min-h-[90vh] px-16 bg-white flex">
//             {/* Left Side - Image/Illustration */}
//             <div className="hidden lg:flex lg:w-1/2 mt-6 h-[87vh] relative overflow-hidden">
//                 {/* Background Image */}
//                 <img 
//                     src="/bg3.png" 
//                     alt="Suzlon" 
//                     className="absolute inset-0 w-full h-full object-cover"
//                 />
//                 {/* Dark Overlay */}
//                 {/* <div className="absolute inset-0 bg-gradient-to-br from-[#063336]/80 via-[#0a4a4e]/70 to-[#0f6368]/80"></div>
//                  */}
//                 {/* Content */}
//                 <div className="relative z-10 flex flex-col justify-center items-center text-white pt-56 px-12">
//                     <div className="max-w-md">
//                         <h1 className="text-5xl font-bold mb-6">Welcome to Suzlon</h1>
//                         <p className="text-xl mb-8 text-[#d0eff1]">
//                             Streamline your invoicing process and manage your business finances with ease.
//                         </p>
//                         <div className="space-y-4">
//                             <div className="flex items-center space-x-3">
//                                 <div className="bg-white bg-opacity-20 rounded-full p-2">
//                                     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
//                                         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                                     </svg>
//                                 </div>
//                                 <span className="text-lg">Create professional invoices in minutes</span>
//                             </div>
//                             <div className="flex items-center space-x-3">
//                                 <div className="bg-white bg-opacity-20 rounded-full p-2">
//                                     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
//                                         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                                     </svg>
//                                 </div>
//                                 <span className="text-lg">Track payments and manage clients</span>
//                             </div>
//                             <div className="flex items-center space-x-3">
//                                 <div className="bg-white bg-opacity-20 rounded-full p-2">
//                                     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
//                                         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                                     </svg>
//                                 </div>
//                                 <span className="text-lg">Get paid faster with automated reminders</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Right Side - Form */}
//             <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-[#F8F4E1]">
//                 <div className="max-w-md w-full">
//                     <div className="text-center mb-6">
//                         <h1 className="text-4xl font-bold text-[#178C92] mb-1">Suzlon</h1>
//                         <p className="text-gray-600">Create your account</p>
//                     </div>

//                     <div className="bg-white rounded-xl shadow-lg border border-[#d0eff1] p-8">
//                         {from !== '/Dashboard' && (
//                             <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                                 <p className="text-sm text-blue-800">Create an account to continue to your requested page</p>
//                             </div>
//                         )}

//                         <form onSubmit={handleSubmit} className="space-y-5">
//                             {error && (
//                                 <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
//                             )}

//                             <div>
//                                 <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
//                                 <div className="relative">
//                                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                         <User className="h-5 w-5 text-gray-400" />
//                                     </div>
//                                     <input
//                                         id="fullName" name="fullName" type="text"
//                                         value={formData.fullName} onChange={handleChange}
//                                         className={`block w-full pl-10 pr-3 py-3 border ${errors.fullName ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6f7f8]0 focus:border-transparent transition-all`}
//                                         placeholder="John Doe"
//                                     />
//                                 </div>
//                                 {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
//                             </div>

//                             <div>
//                                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
//                                 <div className="relative">
//                                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                         <Mail className="h-5 w-5 text-gray-400" />
//                                     </div>
//                                     <input
//                                         id="email" name="email" type="email"
//                                         value={formData.email} onChange={handleChange}
//                                         className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6f7f8]0 focus:border-transparent transition-all`}
//                                         placeholder="you@example.com"
//                                     />
//                                 </div>
//                                 {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
//                             </div>

//                             <div>
//                                 <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
//                                     Company Name <span className="text-gray-400 text-xs">(Optional)</span>
//                                 </label>
//                                 <div className="relative">
//                                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                         <Building className="h-5 w-5 text-gray-400" />
//                                     </div>
//                                     <input
//                                         id="companyName" name="companyName" type="text"
//                                         value={formData.companyName} onChange={handleChange}
//                                         className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6f7f8]0 focus:border-transparent transition-all"
//                                         placeholder="Your Company"
//                                     />
//                                 </div>
//                             </div>

//                             <div className="flex items-start">
//                                 <input
//                                     id="accept-terms" type="checkbox"
//                                     checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)}
//                                     className="h-4 w-4 mt-1 text-[#178C92] focus:ring-[#e6f7f8]0 border-gray-300 rounded cursor-pointer"
//                                 />
//                                 <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-700 cursor-pointer">
//                                     I agree to the{' '}
//                                     <Link to="/terms" className="text-[#178C92] hover:text-[#0f6368] font-medium">Terms and Conditions</Link>
//                                     {' '}and{' '}
//                                     <Link to="/privacy" className="text-[#178C92] hover:text-[#0f6368] font-medium">Privacy Policy</Link>
//                                 </label>
//                             </div>
//                             {!acceptTerms && <p className="text-sm text-red-600">You must accept the terms and conditions</p>}

//                             <button
//                                 type="submit" disabled={loading}
//                                 className="w-full bg-[#178C92] text-white py-3 px-4 rounded-lg hover:bg-[#0f6368] focus:outline-none focus:ring-2 focus:ring-[#e6f7f8]0 focus:ring-offset-2 transition-all font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 {loading ? 'Sending OTP...' : 'Create Account'}
//                             </button>
//                         </form>

//                         <p className="mt-6 text-center text-sm text-gray-600">
//                             Already have an account?{' '}
//                             <Link to="/login" state={{ from: location.state?.from }} className="font-medium text-[#178C92] hover:text-[#0f6368] transition-colors">
//                                 Sign in
//                             </Link>
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//         </>
//     );
// };

// export default Signup;


import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, User, Building, CheckCircle2 } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/store';
import { loginStart, loginFailure } from '@/store/authSlice';
import { authService } from '@/services/authService';

import OtpStep from '@/components/OtpStep';
import LandingNavbar from '@/components/LandingNavbar';

import bg3 from '../../assets/windmill.jpg';

const Signup = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();

    const { loading, error } = useAppSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        companyName: '',
    });

    const [errors, setErrors] = useState({
        fullName: '',
        email: '',
    });

    const [step, setStep] = useState<'details' | 'otp'>('details');
    const [otpEmail, setOtpEmail] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);

    const from =
        (location.state as any)?.from?.pathname || '/Dashboard';

    const validate = () => {
        const newErrors = {
            fullName: '',
            email: '',
        };

        let valid = true;

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
            valid = false;
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
            valid = false;
        }

        if (!acceptTerms) {
            valid = false;
        }

        setErrors(newErrors);

        return valid;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            dispatch(loginStart());

            const response = await authService.signup({
                fullName: formData.fullName,
                email: formData.email,
                companyName: formData.companyName || undefined,
            });

            if (response.success && response.requiresOtp) {
                setOtpEmail(response.email);
                setStep('otp');
                dispatch(loginFailure(''));
            }
        } catch (err: any) {
            const msg =
                err.response?.data?.message ||
                'Signup failed. Please try again.';

            dispatch(loginFailure(msg));
        }
    };

    /*
     * =====================================================
     * OTP SCREEN
     * =====================================================
     */

    if (step === 'otp') {
        return (
            <div className="min-h-screen bg-[#FFFDF5]">
                <LandingNavbar />

                <main className="min-h-[calc(100vh-100px)] flex items-center justify-center px-4 sm:px-6 py-12">
                    <div className="w-full max-w-md">

                        {/* Header */}
                        <div className="text-center mb-8">

                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#EAF4F1] mb-5">
                                <Mail className="w-7 h-7 text-[#178C92]" />
                            </div>

                            <h1 className="text-3xl sm:text-4xl font-bold text-[#164A41]">
                                Verify your email
                            </h1>

                            <p className="mt-2 text-[#49645F]">
                                Enter the OTP sent to your email address
                            </p>
                        </div>

                        {/* OTP Card */}
                        <div className="bg-white rounded-2xl border border-[#164A41]/10 shadow-[0_12px_40px_rgba(22,74,65,0.08)] p-6 sm:p-8">
                            <OtpStep
                                email={otpEmail}
                                onBack={() => setStep('details')}
                                redirectTo={from}
                            />
                        </div>

                        {/* Security Note */}
                        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[#49645F]">
                            <CheckCircle2 className="w-4 h-4 text-[#178C92]" />
                            <span>
                                Your account is securely protected
                            </span>
                        </div>

                    </div>
                </main>
            </div>
        );
    }

    /*
     * =====================================================
     * SIGNUP SCREEN
     * =====================================================
     */

    return (
        <div className="min-h-screen bg-[#FFFDF5]">

            <LandingNavbar />

            <main className="px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
                <div className="max-w-7xl mx-auto">

                    <div className="min-h-[calc(100vh-150px)] grid lg:grid-cols-2 overflow-hidden rounded-3xl border border-[#164A41]/10 shadow-[0_20px_60px_rgba(22,74,65,0.08)]">

                        {/* =================================================
                            LEFT SIDE - IMAGE ONLY
                        ================================================= */}

                        <section className="hidden lg:block relative min-h-[680px] overflow-hidden bg-[#EAF4F1]">

                            <img
                                src={bg3}
                                alt="Suzlon"
                                className="absolute inset-0 w-full h-full object-cover"
                            />

                        </section>

                        {/* =================================================
                            RIGHT SIDE - SIGNUP FORM
                        ================================================= */}

                        <section className="bg-[#F8F4E1] flex items-center justify-center px-5 sm:px-8 lg:px-12 py-10 lg:py-12">

                            <div className="w-full max-w-md">

                                {/* Header */}
                                <div className="text-center mb-7">

                                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#EAF4F1] mb-5">
                                        <User className="w-7 h-7 text-[#178C92]" />
                                    </div>

                                    <h1 className="text-3xl sm:text-4xl font-bold text-[#164A41]">
                                        Create your account
                                    </h1>

                                    <p className="mt-2 text-[#49645F]">
                                        Get started with simple and secure invoicing
                                    </p>

                                </div>

                                {/* Card */}
                                <div className="bg-white rounded-2xl border border-[#164A41]/10 shadow-[0_12px_40px_rgba(22,74,65,0.07)] p-6 sm:p-8">

                                    {/* Redirect Message */}
                                    {from !== '/Dashboard' && (
                                        <div className="mb-6 p-4 bg-[#EAF4F1] border border-[#178C92]/15 rounded-xl">
                                            <div className="flex items-start gap-3">

                                                <div className="flex-shrink-0 mt-0.5">
                                                    <CheckCircle2 className="w-5 h-5 text-[#178C92]" />
                                                </div>

                                                <p className="text-sm text-[#164A41] leading-relaxed">
                                                    Create an account to continue
                                                    to your requested page.
                                                </p>

                                            </div>
                                        </div>
                                    )}

                                    {/* Error */}
                                    {error && (
                                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-5"
                                    >

                                        {/* Full Name */}
                                        <div>

                                            <label
                                                htmlFor="fullName"
                                                className="block text-sm font-semibold text-[#164A41] mb-2"
                                            >
                                                Full Name
                                            </label>

                                            <div className="relative">

                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                    <User
                                                        className={`h-5 w-5 ${
                                                            errors.fullName
                                                                ? 'text-red-400'
                                                                : 'text-[#49645F]'
                                                        }`}
                                                    />
                                                </div>

                                                <input
                                                    id="fullName"
                                                    name="fullName"
                                                    type="text"
                                                    value={formData.fullName}
                                                    onChange={handleChange}
                                                    className={`
                                                        block w-full
                                                        pl-11 pr-4
                                                        py-3.5
                                                        bg-[#FFFDF5]
                                                        border
                                                        ${
                                                            errors.fullName
                                                                ? 'border-red-300 focus:ring-red-100'
                                                                : 'border-[#164A41]/15 focus:border-[#178C92] focus:ring-[#EAF4F1]'
                                                        }
                                                        rounded-xl
                                                        outline-none
                                                        focus:ring-4
                                                        transition-all
                                                        text-[#164A41]
                                                        placeholder:text-[#49645F]/50
                                                    `}
                                                    placeholder="John Doe"
                                                />

                                            </div>

                                            {errors.fullName && (
                                                <p className="mt-2 text-sm text-red-600">
                                                    {errors.fullName}
                                                </p>
                                            )}

                                        </div>

                                        {/* Email */}
                                        <div>

                                            <label
                                                htmlFor="email"
                                                className="block text-sm font-semibold text-[#164A41] mb-2"
                                            >
                                                Email Address
                                            </label>

                                            <div className="relative">

                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                    <Mail
                                                        className={`h-5 w-5 ${
                                                            errors.email
                                                                ? 'text-red-400'
                                                                : 'text-[#49645F]'
                                                        }`}
                                                    />
                                                </div>

                                                <input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className={`
                                                        block w-full
                                                        pl-11 pr-4
                                                        py-3.5
                                                        bg-[#FFFDF5]
                                                        border
                                                        ${
                                                            errors.email
                                                                ? 'border-red-300 focus:ring-red-100'
                                                                : 'border-[#164A41]/15 focus:border-[#178C92] focus:ring-[#EAF4F1]'
                                                        }
                                                        rounded-xl
                                                        outline-none
                                                        focus:ring-4
                                                        transition-all
                                                        text-[#164A41]
                                                        placeholder:text-[#49645F]/50
                                                    `}
                                                    placeholder="you@example.com"
                                                />

                                            </div>

                                            {errors.email && (
                                                <p className="mt-2 text-sm text-red-600">
                                                    {errors.email}
                                                </p>
                                            )}

                                        </div>

                                        {/* Company */}
                                        <div>

                                            <label
                                                htmlFor="companyName"
                                                className="block text-sm font-semibold text-[#164A41] mb-2"
                                            >
                                                Company Name{' '}
                                                <span className="text-[#49645F]/60 text-xs font-normal">
                                                    (Optional)
                                                </span>
                                            </label>

                                            <div className="relative">

                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                    <Building className="h-5 w-5 text-[#49645F]" />
                                                </div>

                                                <input
                                                    id="companyName"
                                                    name="companyName"
                                                    type="text"
                                                    value={formData.companyName}
                                                    onChange={handleChange}
                                                    className="
                                                        block w-full
                                                        pl-11 pr-4
                                                        py-3.5
                                                        bg-[#FFFDF5]
                                                        border border-[#164A41]/15
                                                        rounded-xl
                                                        outline-none
                                                        focus:border-[#178C92]
                                                        focus:ring-4
                                                        focus:ring-[#EAF4F1]
                                                        transition-all
                                                        text-[#164A41]
                                                        placeholder:text-[#49645F]/50
                                                    "
                                                    placeholder="Your Company"
                                                />

                                            </div>

                                        </div>

                                        {/* Terms */}
                                        <div>

                                            <div className="flex items-start">

                                                <input
                                                    id="accept-terms"
                                                    type="checkbox"
                                                    checked={acceptTerms}
                                                    onChange={(e) =>
                                                        setAcceptTerms(
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="
                                                        h-4 w-4
                                                        mt-1
                                                        rounded
                                                        border-[#164A41]/20
                                                        text-[#178C92]
                                                        focus:ring-[#178C92]
                                                        cursor-pointer
                                                    "
                                                />

                                                <label
                                                    htmlFor="accept-terms"
                                                    className="ml-2 text-sm text-[#49645F] leading-relaxed cursor-pointer"
                                                >
                                                    I agree to the{' '}

                                                    <Link
                                                        to="/terms"
                                                        className="text-[#178C92] hover:text-[#007078] font-semibold transition-colors"
                                                    >
                                                        Terms and Conditions
                                                    </Link>

                                                    {' '}and{' '}

                                                    <Link
                                                        to="/privacy"
                                                        className="text-[#178C92] hover:text-[#007078] font-semibold transition-colors"
                                                    >
                                                        Privacy Policy
                                                    </Link>
                                                </label>

                                            </div>

                                            {!acceptTerms && (
                                                <p className="mt-2 text-sm text-red-600">
                                                    You must accept the terms and conditions
                                                </p>
                                            )}

                                        </div>

                                        {/* Submit */}
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="
                                                w-full
                                                bg-[#178C92]
                                                text-white
                                                py-3.5
                                                px-4
                                                rounded-xl
                                                hover:bg-[#007078]
                                                focus:outline-none
                                                focus:ring-4
                                                focus:ring-[#EAF4F1]
                                                focus:ring-offset-1
                                                transition-all
                                                font-semibold
                                                shadow-[0_6px_20px_rgba(23,140,146,0.20)]
                                                hover:shadow-[0_8px_24px_rgba(23,140,146,0.25)]
                                                disabled:opacity-50
                                                disabled:cursor-not-allowed
                                            "
                                        >
                                            {loading
                                                ? 'Sending OTP...'
                                                : 'Create Account'}
                                        </button>

                                    </form>

                                    {/* Login */}
                                    <div className="mt-7 pt-6 border-t border-[#164A41]/10">

                                        <p className="text-center text-sm text-[#49645F]">
                                            Already have an account?{' '}

                                            <Link
                                                to="/login"
                                                state={{
                                                    from: location.state?.from,
                                                }}
                                                className="font-semibold text-[#178C92] hover:text-[#007078] transition-colors"
                                            >
                                                Sign in
                                            </Link>
                                        </p>

                                    </div>

                                </div>

                                {/* Security */}
                                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[#49645F]">
                                    <CheckCircle2 className="w-4 h-4 text-[#178C92]" />
                                    <span>
                                        Secure and encrypted authentication
                                    </span>
                                </div>

                            </div>

                        </section>

                    </div>

                </div>
            </main>

        </div>
    );
};

export default Signup;




