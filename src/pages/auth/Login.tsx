// ﻿import React, { useState, useRef, useEffect } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
// import { useAppDispatch, useAppSelector } from '@/store';
// import { loginStart, loginSuccess, loginFailure } from '@/store/authSlice';
// import { authService } from '@/services/authService';

// const Login = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const dispatch = useAppDispatch();
//     const { loading, error } = useAppSelector((state) => state.auth);

//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [showPassword, setShowPassword] = useState(false);
//     const [errors, setErrors] = useState({ email: '', password: '' });

//     // OTP step state
//     const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
//     const [otpEmail, setOtpEmail] = useState('');
//     const [otp, setOtp] = useState(['', '', '', '', '', '']);
//     const [otpError, setOtpError] = useState('');
//     const [resendCooldown, setResendCooldown] = useState(0);
//     const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

//     const from = (location.state as any)?.from?.pathname || '/Dashboard';

//     // Countdown timer for resend
//     useEffect(() => {
//         if (resendCooldown <= 0) return;
//         const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
//         return () => clearTimeout(timer);
//     }, [resendCooldown]);

//     const validateForm = () => {
//         let isValid = true;
//         const newErrors = { email: '', password: '' };
//         if (!email) { newErrors.email = 'Email is required'; isValid = false; }
//         else if (!/\S+@\S+\.\S+/.test(email)) { newErrors.email = 'Email is invalid'; isValid = false; }
//         if (!password) { newErrors.password = 'Password is required'; isValid = false; }
//         else if (password.length < 6) { newErrors.password = 'Password must be at least 6 characters'; isValid = false; }
//         setErrors(newErrors);
//         return isValid;
//     };

//     const handleCredentialsSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!validateForm()) return;
//         try {
//             dispatch(loginStart());
//             const response = await authService.login({ email, password });
//             if (response.success && response.requiresOtp) {
//                 setOtpEmail(response.email);
//                 setStep('otp');
//                 setResendCooldown(60);
//                 dispatch(loginFailure('')); // clear loading, no error
//             }
//         } catch (err: any) {
//             const msg = err.response?.data?.message || 'Login failed. Please try again.';
//             dispatch(loginFailure(msg));
//         }
//     };

//     const handleOtpChange = (index: number, value: string) => {
//         if (!/^\d*$/.test(value)) return;
//         const newOtp = [...otp];
//         newOtp[index] = value.slice(-1);
//         setOtp(newOtp);
//         setOtpError('');
//         if (value && index < 5) otpRefs.current[index + 1]?.focus();
//     };

//     const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
//         if (e.key === 'Backspace' && !otp[index] && index > 0) {
//             otpRefs.current[index - 1]?.focus();
//         }
//     };

//     const handleOtpPaste = (e: React.ClipboardEvent) => {
//         const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
//         if (pasted.length === 6) {
//             setOtp(pasted.split(''));
//             otpRefs.current[5]?.focus();
//         }
//     };

//     const handleOtpSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         const otpValue = otp.join('');
//         if (otpValue.length < 6) { setOtpError('Please enter the 6-digit code'); return; }
//         try {
//             dispatch(loginStart());
//             const response = await authService.verifyOtp(otpEmail, otpValue);
//             if (response.success) {
//                 dispatch(loginSuccess({ user: response.data.user, token: response.data.token }));
//                 navigate(from, { replace: true });
//             }
//         } catch (err: any) {
//             const msg = err.response?.data?.message || 'Invalid OTP. Please try again.';
//             setOtpError(msg);
//             dispatch(loginFailure(''));
//         }
//     };

//     const handleResendOtp = async () => {
//         if (resendCooldown > 0) return;
//         try {
//             await authService.resendOtp(otpEmail);
//             setResendCooldown(60);
//             setOtp(['', '', '', '', '', '']);
//             setOtpError('');
//             otpRefs.current[0]?.focus();
//         } catch {
//             setOtpError('Failed to resend OTP. Please try again.');
//         }
//     };

//     if (step === 'otp') {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
//                 <div className="max-w-md w-full">
//                     <div className="text-center mb-8">
//                         <h1 className="text-4xl font-bold text-purple-600 mb-2">Invoice Pro</h1>
//                         <p className="text-gray-600">Two-factor verification</p>
//                     </div>
//                     <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-8">
//                         <div className="flex justify-center mb-4">
//                             <div className="bg-purple-100 rounded-full p-3">
//                                 <ShieldCheck className="h-8 w-8 text-purple-600" />
//                             </div>
//                         </div>
//                         <h2 className="text-xl font-semibold text-gray-800 text-center mb-1">Check your email</h2>
//                         <p className="text-sm text-gray-500 text-center mb-6">
//                             We sent a 6-digit code to <span className="font-medium text-gray-700">{otpEmail}</span>
//                         </p>

//                         <form onSubmit={handleOtpSubmit} className="space-y-6">
//                             {otpError && (
//                                 <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
//                                     {otpError}
//                                 </div>
//                             )}

//                             <div className="flex justify-center gap-3" onPaste={handleOtpPaste}>
//                                 {otp.map((digit, i) => (
//                                     <input
//                                         key={i}
//                                         ref={(el) => (otpRefs.current[i] = el)}
//                                         type="text"
//                                         inputMode="numeric"
//                                         maxLength={1}
//                                         value={digit}
//                                         onChange={(e) => handleOtpChange(i, e.target.value)}
//                                         onKeyDown={(e) => handleOtpKeyDown(i, e)}
//                                         className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
//                                     />
//                                 ))}
//                             </div>

//                             <button
//                                 type="submit"
//                                 disabled={loading}
//                                 className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 {loading ? 'Verifying...' : 'Verify & Sign In'}
//                             </button>
//                         </form>

//                         <div className="mt-4 text-center text-sm text-gray-500">
//                             Didn't receive the code?{' '}
//                             <button
//                                 onClick={handleResendOtp}
//                                 disabled={resendCooldown > 0}
//                                 className="font-medium text-purple-600 hover:text-purple-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
//                             >
//                                 {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend'}
//                             </button>
//                         </div>

//                         <div className="mt-3 text-center">
//                             <button
//                                 onClick={() => { setStep('credentials'); setOtp(['', '', '', '', '', '']); setOtpError(''); }}
//                                 className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
//                             >
//                                 ← Back to login
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
//             <div className="max-w-md w-full">
//                 <div className="text-center mb-8">
//                     <h1 className="text-4xl font-bold text-purple-600 mb-2">Invoice Pro</h1>
//                     <p className="text-gray-600">Sign in to your account</p>
//                 </div>

//                 <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-8">
//                     {from !== '/Dashboard' && (
//                         <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                             <p className="text-sm text-blue-800">Please login to continue to your requested page</p>
//                         </div>
//                     )}

//                     <form onSubmit={handleCredentialsSubmit} className="space-y-6">
//                         {error && (
//                             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
//                                 {error}
//                             </div>
//                         )}

//                         <div>
//                             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
//                             <div className="relative">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <Mail className="h-5 w-5 text-gray-400" />
//                                 </div>
//                                 <input
//                                     id="email"
//                                     type="email"
//                                     value={email}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                     className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
//                                     placeholder="you@example.com"
//                                 />
//                             </div>
//                             {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
//                         </div>

//                         <div>
//                             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
//                             <div className="relative">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <Lock className="h-5 w-5 text-gray-400" />
//                                 </div>
//                                 <input
//                                     id="password"
//                                     type={showPassword ? 'text' : 'password'}
//                                     value={password}
//                                     onChange={(e) => setPassword(e.target.value)}
//                                     className={`block w-full pl-10 pr-10 py-3 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
//                                     placeholder="••••••••"
//                                 />
//                                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
//                                     {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
//                                 </button>
//                             </div>
//                             {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
//                         </div>

//                         <div className="flex items-center justify-between">
//                             <div className="flex items-center">
//                                 <input id="remember-me" type="checkbox" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer" />
//                                 <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">Remember me</label>
//                             </div>
//                             <Link to="/forgot-password" className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">Forgot password?</Link>
//                         </div>

//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             {loading ? 'Signing In...' : 'Sign In'}
//                         </button>
//                     </form>

//                     <div className="mt-6">
//                         <div className="relative">
//                             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
//                             <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with</span></div>
//                         </div>
//                         <div className="mt-6 grid grid-cols-2 gap-3">
//                             <button type="button" className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
//                                 <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
//                                     <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
//                                     <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
//                                     <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
//                                     <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
//                                 </svg>
//                                 Google
//                             </button>
//                             <button type="button" className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
//                                 <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
//                                     <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
//                                 </svg>
//                                 GitHub
//                             </button>
//                         </div>
//                     </div>

//                     <p className="mt-6 text-center text-sm text-gray-600">
//                         Don't have an account?{' '}
//                         <Link to="/signup" state={{ from: location.state?.from }} className="font-medium text-purple-600 hover:text-purple-700 transition-colors">
//                             Sign up for free
//                         </Link>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;

// import React, { useState, useRef, useEffect } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
// import { useAppDispatch, useAppSelector } from '@/store';
// import { loginStart, loginSuccess, loginFailure } from '@/store/authSlice';
// import { authService } from '@/services/authService';

// const Login = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const dispatch = useAppDispatch();
//     const { loading, error } = useAppSelector((state) => state.auth);

//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [showPassword, setShowPassword] = useState(false);
//     const [errors, setErrors] = useState({ email: '', password: '' });

//     // OTP step state
//     const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
//     const [otpEmail, setOtpEmail] = useState('');
//     const [otp, setOtp] = useState(['', '', '', '', '', '']);
//     const [otpError, setOtpError] = useState('');
//     const [resendCooldown, setResendCooldown] = useState(0);
//     const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

//     const from = (location.state as any)?.from?.pathname || '/Dashboard';

//     // Countdown timer for resend
//     useEffect(() => {
//         if (resendCooldown <= 0) return;
//         const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
//         return () => clearTimeout(timer);
//     }, [resendCooldown]);

//     const validateForm = () => {
//         let isValid = true;
//         const newErrors = { email: '', password: '' };
//         if (!email) { newErrors.email = 'Email is required'; isValid = false; }
//         else if (!/\S+@\S+\.\S+/.test(email)) { newErrors.email = 'Email is invalid'; isValid = false; }
//         if (!password) { newErrors.password = 'Password is required'; isValid = false; }
//         else if (password.length < 6) { newErrors.password = 'Password must be at least 6 characters'; isValid = false; }
//         setErrors(newErrors);
//         return isValid;
//     };

//     const handleCredentialsSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!validateForm()) return;
//         try {
//             dispatch(loginStart());
//             const response = await authService.login({ email, password });
//             if (response.success && response.requiresOtp) {
//                 setOtpEmail(response.email);
//                 setStep('otp');
//                 setResendCooldown(60);
//                 dispatch(loginFailure('')); // clear loading, no error
//             }
//         } catch (err: any) {
//             const msg = err.response?.data?.message || 'Login failed. Please try again.';
//             dispatch(loginFailure(msg));
//         }
//     };

//     const handleOtpChange = (index: number, value: string) => {
//         if (!/^\d*$/.test(value)) return;
//         const newOtp = [...otp];
//         newOtp[index] = value.slice(-1);
//         setOtp(newOtp);
//         setOtpError('');
//         if (value && index < 5) otpRefs.current[index + 1]?.focus();
//     };

//     const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
//         if (e.key === 'Backspace' && !otp[index] && index > 0) {
//             otpRefs.current[index - 1]?.focus();
//         }
//     };

//     const handleOtpPaste = (e: React.ClipboardEvent) => {
//         const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
//         if (pasted.length === 6) {
//             setOtp(pasted.split(''));
//             otpRefs.current[5]?.focus();
//         }
//     };

//     const handleOtpSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         const otpValue = otp.join('');
//         if (otpValue.length < 6) { setOtpError('Please enter the 6-digit code'); return; }
//         try {
//             dispatch(loginStart());
//             const response = await authService.verifyOtp(otpEmail, otpValue);
//             if (response.success) {
//                 dispatch(loginSuccess({ user: response.data.user, token: response.data.token }));
//                 navigate(from, { replace: true });
//             }
//         } catch (err: any) {
//             const msg = err.response?.data?.message || 'Invalid OTP. Please try again.';
//             setOtpError(msg);
//             dispatch(loginFailure(''));
//         }
//     };

//     const handleResendOtp = async () => {
//         if (resendCooldown > 0) return;
//         try {
//             await authService.resendOtp(otpEmail);
//             setResendCooldown(60);
//             setOtp(['', '', '', '', '', '']);
//             setOtpError('');
//             otpRefs.current[0]?.focus();
//         } catch {
//             setOtpError('Failed to resend OTP. Please try again.');
//         }
//     };

//     if (step === 'otp') {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
//                 <div className="max-w-md w-full">
//                     <div className="text-center mb-8">
//                         <h1 className="text-4xl font-bold text-purple-600 mb-2">Invoice Pro</h1>
//                         <p className="text-gray-600">Two-factor verification</p>
//                     </div>
//                     <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-8">
//                         <div className="flex justify-center mb-4">
//                             <div className="bg-purple-100 rounded-full p-3">
//                                 <ShieldCheck className="h-8 w-8 text-purple-600" />
//                             </div>
//                         </div>
//                         <h2 className="text-xl font-semibold text-gray-800 text-center mb-1">Check your email</h2>
//                         <p className="text-sm text-gray-500 text-center mb-6">
//                             We sent a 6-digit code to <span className="font-medium text-gray-700">{otpEmail}</span>
//                         </p>

//                         <form onSubmit={handleOtpSubmit} className="space-y-6">
//                             {otpError && (
//                                 <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
//                                     {otpError}
//                                 </div>
//                             )}

//                             <div className="flex justify-center gap-3" onPaste={handleOtpPaste}>
//                                 {otp.map((digit, i) => (
//                                     <input
//                                         key={i}
//                                         ref={(el) => { otpRefs.current[i] = el; }}
//                                         type="text"
//                                         inputMode="numeric"
//                                         maxLength={1}
//                                         value={digit}
//                                         onChange={(e) => handleOtpChange(i, e.target.value)}
//                                         onKeyDown={(e) => handleOtpKeyDown(i, e)}
//                                         className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
//                                     />
//                                 ))}
//                             </div>

//                             <button
//                                 type="submit"
//                                 disabled={loading}
//                                 className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 {loading ? 'Verifying...' : 'Verify & Sign In'}
//                             </button>
//                         </form>

//                         <div className="mt-4 text-center text-sm text-gray-500">
//                             Didn't receive the code?{' '}
//                             <button
//                                 onClick={handleResendOtp}
//                                 disabled={resendCooldown > 0}
//                                 className="font-medium text-purple-600 hover:text-purple-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
//                             >
//                                 {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend'}
//                             </button>
//                         </div>

//                         <div className="mt-3 text-center">
//                             <button
//                                 onClick={() => { setStep('credentials'); setOtp(['', '', '', '', '', '']); setOtpError(''); }}
//                                 className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
//                             >
//                                 ← Back to login
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
//             <div className="max-w-md w-full">
//                 <div className="text-center mb-8">
//                     <h1 className="text-4xl font-bold text-purple-600 mb-2">Invoice Pro</h1>
//                     <p className="text-gray-600">Sign in to your account</p>
//                 </div>

//                 <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-8">
//                     {from !== '/Dashboard' && (
//                         <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                             <p className="text-sm text-blue-800">Please login to continue to your requested page</p>
//                         </div>
//                     )}

//                     <form onSubmit={handleCredentialsSubmit} className="space-y-6">
//                         {error && (
//                             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
//                                 {error}
//                             </div>
//                         )}

//                         <div>
//                             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
//                             <div className="relative">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <Mail className="h-5 w-5 text-gray-400" />
//                                 </div>
//                                 <input
//                                     id="email"
//                                     type="email"
//                                     value={email}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                     className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
//                                     placeholder="you@example.com"
//                                 />
//                             </div>
//                             {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
//                         </div>

//                         <div>
//                             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
//                             <div className="relative">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <Lock className="h-5 w-5 text-gray-400" />
//                                 </div>
//                                 <input
//                                     id="password"
//                                     type={showPassword ? 'text' : 'password'}
//                                     value={password}
//                                     onChange={(e) => setPassword(e.target.value)}
//                                     className={`block w-full pl-10 pr-10 py-3 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
//                                     placeholder="••••••••"
//                                 />
//                                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
//                                     {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
//                                 </button>
//                             </div>
//                             {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
//                         </div>

//                         <div className="flex items-center justify-between">
//                             <div className="flex items-center">
//                                 <input id="remember-me" type="checkbox" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer" />
//                                 <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">Remember me</label>
//                             </div>
//                             <Link to="/forgot-password" className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">Forgot password?</Link>
//                         </div>

//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             {loading ? 'Signing In...' : 'Sign In'}
//                         </button>
//                     </form>

//                     <div className="mt-6">
//                         <div className="relative">
//                             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
//                             <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with</span></div>
//                         </div>
//                         <div className="mt-6 grid grid-cols-2 gap-3">
//                             <button type="button" className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
//                                 <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
//                                     <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
//                                     <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
//                                     <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
//                                     <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
//                                 </svg>
//                                 Google
//                             </button>
//                             <button type="button" className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
//                                 <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
//                                     <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
//                                 </svg>
//                                 GitHub
//                             </button>
//                         </div>
//                     </div>

//                     <p className="mt-6 text-center text-sm text-gray-600">
//                         Don't have an account?{' '}
//                         <Link to="/signup" state={{ from: location.state?.from }} className="font-medium text-purple-600 hover:text-purple-700 transition-colors">
//                             Sign up for free
//                         </Link>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;


import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { loginStart, loginFailure } from '@/store/authSlice';
import { authService } from '@/services/authService';
import OtpStep from '@/components/OtpStep';
import LandingNavbar from '@/components/LandingNavbar';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [otpEmail, setOtpEmail] = useState('');

    const from = (location.state as any)?.from?.pathname || '/Dashboard';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) { setEmailError('Email is required'); return; }
        if (!/\S+@\S+\.\S+/.test(email)) { setEmailError('Email is invalid'); return; }
        setEmailError('');

        try {
            dispatch(loginStart());
            const response = await authService.login({ email });
            if (response.success && response.requiresOtp) {
                setOtpEmail(response.email);
                setStep('otp');
                dispatch(loginFailure(''));
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Login failed. Please try again.';
            dispatch(loginFailure(msg));
        }
    };

    if (step === 'otp') {
        return (
            <>
                <LandingNavbar />
                <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
                    <div className="max-w-md w-full">
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold text-purple-600 mb-2">Invoice Pro</h1>
                            <p className="text-gray-600">Verify your identity</p>
                        </div>
                        <OtpStep email={otpEmail} onBack={() => setStep('email')} redirectTo={from} />
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <LandingNavbar />
            <div className="min-h-[90vh] px-16 bg-white flex">
                {/* Left Side - Image/Illustration */}
                <div className="hidden lg:flex lg:w-1/2 mt-6 h-[87vh] relative overflow-hidden">
                    {/* Background Image */}
                    <img 
                        src="/bg3.png" 
                        alt="Invoice Pro" 
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Dark Overlay */}
                    {/* <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-purple-800/70 to-indigo-900/80"></div>
                     */}
                    {/* Content */}
                    <div className="relative z-10 flex flex-col justify-center items-center text-white pt-56 px-12">
                        <div className="max-w-md">
                            <h1 className="text-5xl font-bold mb-6">Welcome Back!</h1>
                            <p className="text-xl mb-8 text-purple-100">
                                Sign in to access your invoices and manage your business finances efficiently.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-white bg-opacity-20 rounded-full p-2">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-lg">Secure OTP-based authentication</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="bg-white bg-opacity-20 rounded-full p-2">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-lg">Access from anywhere, anytime</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="bg-white bg-opacity-20 rounded-full p-2">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-lg">Your data is safe and encrypted</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-purple-50 via-white to-purple-50">
                    <div className="max-w-md w-full">
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold text-purple-600 mb-2">Invoice Pro</h1>
                            <p className="text-gray-600">Sign in to your account</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-8">
                        {from !== '/Dashboard' && (
                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800">Please login to continue to your requested page</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
                            )}

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`block w-full pl-10 pr-3 py-3 border ${emailError ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                                        placeholder="you@example.com"
                                    />
                                </div>
                                {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending OTP...' : 'Continue with Email'}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/signup" state={{ from: location.state?.from }} className="font-medium text-purple-600 hover:text-purple-700 transition-colors">
                                Sign up for free
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default Login;



