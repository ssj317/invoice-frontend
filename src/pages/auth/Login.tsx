
// import React, { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { Mail } from 'lucide-react';
// import { useAppDispatch, useAppSelector } from '@/store';
// import { loginStart, loginFailure } from '@/store/authSlice';
// import { authService } from '@/services/authService';
// import OtpStep from '@/components/OtpStep';
// import LandingNavbar from '@/components/LandingNavbar';

// const Login = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const dispatch = useAppDispatch();
//     const { loading, error } = useAppSelector((state) => state.auth);

//     const [email, setEmail] = useState('');
//     const [emailError, setEmailError] = useState('');
//     const [step, setStep] = useState<'email' | 'otp'>('email');
//     const [otpEmail, setOtpEmail] = useState('');

//     const from = (location.state as any)?.from?.pathname || '/Dashboard';

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!email) { setEmailError('Email is required'); return; }
//         if (!/\S+@\S+\.\S+/.test(email)) { setEmailError('Email is invalid'); return; }
//         setEmailError('');

//         try {
//             dispatch(loginStart());
//             const response = await authService.login({ email });
//             if (response.success && response.requiresOtp) {
//                 setOtpEmail(response.email);
//                 setStep('otp');
//                 dispatch(loginFailure(''));
//             }
//         } catch (err: any) {
//             const msg = err.response?.data?.message || 'Login failed. Please try again.';
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
//                             <p className="text-gray-600">Verify your identity</p>
//                         </div>
//                         <OtpStep email={otpEmail} onBack={() => setStep('email')} redirectTo={from} />
//                     </div>
//                 </div>
//             </>
//         );
//     }

//     return (
//         <>
//             <LandingNavbar />
//             <div className="min-h-[90vh] px-16 bg-white flex">
//                 {/* Left Side - Image/Illustration */}
//                 <div className="hidden lg:flex lg:w-1/2 mt-6 h-[87vh] relative overflow-hidden">
//                     {/* Background Image */}
//                     <img 
//                         src="/bg3.png" 
//                         alt="Suzlon" 
//                         className="absolute inset-0 w-full h-full object-cover"
//                     />
//                     {/* Dark Overlay */}
//                     {/* <div className="absolute inset-0 bg-gradient-to-br from-[#063336]/80 via-[#0a4a4e]/70 to-[#0f6368]/80"></div>
//                      */}
//                     {/* Content */}
//                     <div className="relative z-10 flex flex-col justify-center items-center text-white pt-56 px-12">
//                         <div className="max-w-md">
//                             <h1 className="text-5xl font-bold mb-6">Welcome Back!</h1>
//                             <p className="text-xl mb-8 text-[#d0eff1]">
//                                 Sign in to access your invoices and manage your business finances efficiently.
//                             </p>
//                             <div className="space-y-4">
//                                 <div className="flex items-center space-x-3">
//                                     <div className="bg-white bg-opacity-20 rounded-full p-2">
//                                         <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
//                                             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                                         </svg>
//                                     </div>
//                                     <span className="text-lg">Secure OTP-based authentication</span>
//                                 </div>
//                                 <div className="flex items-center space-x-3">
//                                     <div className="bg-white bg-opacity-20 rounded-full p-2">
//                                         <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
//                                             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                                         </svg>
//                                     </div>
//                                     <span className="text-lg">Access from anywhere, anytime</span>
//                                 </div>
//                                 <div className="flex items-center space-x-3">
//                                     <div className="bg-white bg-opacity-20 rounded-full p-2">
//                                         <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
//                                             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                                         </svg>
//                                     </div>
//                                     <span className="text-lg">Your data is safe and encrypted</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Right Side - Form */}
//                 <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#F8F4E1]">
//                     <div className="max-w-md w-full">
//                         <div className="text-center mb-8">
//                             <h1 className="text-4xl font-bold text-[#178C92] mb-2">Suzlon</h1>
//                             <p className="text-gray-600">Sign in to your account</p>
//                         </div>

//                         <div className="bg-white rounded-xl shadow-lg border border-[#d0eff1] p-8">
//                         {from !== '/Dashboard' && (
//                             <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                                 <p className="text-sm text-blue-800">Please login to continue to your requested page</p>
//                             </div>
//                         )}

//                         <form onSubmit={handleSubmit} className="space-y-6">
//                             {error && (
//                                 <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
//                             )}

//                             <div>
//                                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
//                                 <div className="relative">
//                                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                         <Mail className="h-5 w-5 text-gray-400" />
//                                     </div>
//                                     <input
//                                         id="email"
//                                         type="email"
//                                         value={email}
//                                         onChange={(e) => setEmail(e.target.value)}
//                                         className={`block w-full pl-10 pr-3 py-3 border ${emailError ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6f7f8]0 focus:border-transparent transition-all`}
//                                         placeholder="you@example.com"
//                                     />
//                                 </div>
//                                 {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
//                             </div>

//                             <button
//                                 type="submit"
//                                 disabled={loading}
//                                 className="w-full bg-[#178C92] text-white py-3 px-4 rounded-lg hover:bg-[#0f6368] focus:outline-none focus:ring-2 focus:ring-[#e6f7f8]0 focus:ring-offset-2 transition-all font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 {loading ? 'Sending OTP...' : 'Continue with Email'}
//                             </button>
//                         </form>

//                         <p className="mt-6 text-center text-sm text-gray-600">
//                             Don't have an account?{' '}
//                             <Link to="/signup" state={{ from: location.state?.from }} className="font-medium text-[#178C92] hover:text-[#0f6368] transition-colors">
//                                 Sign up for free
//                             </Link>
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//         </>
//     );
// };

// export default Login;
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, CheckCircle2 } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/store';
import { loginStart, loginFailure } from '@/store/authSlice';
import { authService } from '@/services/authService';

import OtpStep from '@/components/OtpStep';
import LandingNavbar from '@/components/LandingNavbar';

const Login = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();

    const { loading, error } = useAppSelector((state) => state.auth);

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [otpEmail, setOtpEmail] = useState('');

    const from =
        (location.state as any)?.from?.pathname || '/Dashboard';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            setEmailError('Email is required');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Email is invalid');
            return;
        }

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
            const msg =
                err.response?.data?.message ||
                'Login failed. Please try again.';

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
                                onBack={() => setStep('email')}
                                redirectTo={from}
                            />

                        </div>

                        {/* Security */}
                        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[#49645F]">

                            <CheckCircle2 className="w-4 h-4 text-[#178C92]" />

                            <span>
                                Your login is securely protected
                            </span>

                        </div>

                    </div>

                </main>

            </div>
        );
    }

    /*
     * =====================================================
     * LOGIN SCREEN
     * =====================================================
     */

    return (
        <div className="min-h-screen bg-[#FFFDF5]">

            <LandingNavbar />

            <main className="px-4 sm:px-6 lg:px-8 py-8 lg:py-10">

                <div className="max-w-7xl mx-auto">

                    <div className="
                        min-h-[calc(100vh-150px)]
                        grid
                        lg:grid-cols-2
                        overflow-hidden
                        rounded-3xl
                        border
                        border-[#164A41]/10
                        shadow-[0_20px_60px_rgba(22,74,65,0.08)]
                    ">

                        {/* =================================================
                            LEFT SIDE — CLEAN IMAGE ONLY
                        ================================================= */}

                        <section className="
                            hidden
                            lg:block
                            relative
                            min-h-[680px]
                            overflow-hidden
                            bg-[#EAF4F1]
                        ">

                            <img
                                src="/bg3.png"
                                alt="Suzlon"
                                className="
                                    absolute
                                    inset-0
                                    w-full
                                    h-full
                                    object-cover
                                "
                            />

                        </section>

                        {/* =================================================
                            RIGHT SIDE — LOGIN FORM
                        ================================================= */}

                        <section className="
                            bg-[#F8F4E1]
                            flex
                            items-center
                            justify-center
                            px-5
                            sm:px-8
                            lg:px-12
                            py-12
                        ">

                            <div className="w-full max-w-md">

                                {/* Header */}
                                <div className="text-center mb-8">

                                    <div className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        w-14
                                        h-14
                                        rounded-2xl
                                        bg-[#EAF4F1]
                                        mb-5
                                    ">
                                        <Mail className="w-7 h-7 text-[#178C92]" />
                                    </div>

                                    <h1 className="
                                        text-3xl
                                        sm:text-4xl
                                        font-bold
                                        text-[#164A41]
                                    ">
                                        Sign in
                                    </h1>

                                    <p className="mt-2 text-[#49645F]">
                                        Sign in to your account to continue
                                    </p>

                                </div>

                                {/* Login Card */}
                                <div className="
                                    bg-white
                                    rounded-2xl
                                    border
                                    border-[#164A41]/10
                                    shadow-[0_12px_40px_rgba(22,74,65,0.07)]
                                    p-6
                                    sm:p-8
                                ">

                                    {/* Redirect Message */}
                                    {from !== '/Dashboard' && (
                                        <div className="
                                            mb-6
                                            p-4
                                            bg-[#EAF4F1]
                                            border
                                            border-[#178C92]/15
                                            rounded-xl
                                        ">

                                            <div className="flex items-start gap-3">

                                                <div className="flex-shrink-0 mt-0.5">

                                                    <CheckCircle2
                                                        className="
                                                            w-5
                                                            h-5
                                                            text-[#178C92]
                                                        "
                                                    />

                                                </div>

                                                <p className="
                                                    text-sm
                                                    text-[#164A41]
                                                    leading-relaxed
                                                ">
                                                    Please login to continue to
                                                    your requested page.
                                                </p>

                                            </div>

                                        </div>
                                    )}

                                    {/* Error */}
                                    {error && (
                                        <div className="
                                            mb-6
                                            p-4
                                            bg-red-50
                                            border
                                            border-red-200
                                            text-red-700
                                            rounded-xl
                                            text-sm
                                        ">
                                            {error}
                                        </div>
                                    )}

                                    {/* Form */}
                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-6"
                                    >

                                        {/* Email */}
                                        <div>

                                            <label
                                                htmlFor="email"
                                                className="
                                                    block
                                                    text-sm
                                                    font-semibold
                                                    text-[#164A41]
                                                    mb-2
                                                "
                                            >
                                                Email Address
                                            </label>

                                            <div className="relative">

                                                <div className="
                                                    absolute
                                                    inset-y-0
                                                    left-0
                                                    pl-3.5
                                                    flex
                                                    items-center
                                                    pointer-events-none
                                                ">
                                                    <Mail
                                                        className={`
                                                            h-5
                                                            w-5
                                                            ${
                                                                emailError
                                                                    ? 'text-red-400'
                                                                    : 'text-[#49645F]'
                                                            }
                                                        `}
                                                    />
                                                </div>

                                                <input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) =>
                                                        setEmail(e.target.value)
                                                    }
                                                    className={`
                                                        block
                                                        w-full
                                                        pl-11
                                                        pr-4
                                                        py-3.5
                                                        bg-[#FFFDF5]
                                                        border
                                                        ${
                                                            emailError
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

                                            {emailError && (
                                                <p className="
                                                    mt-2
                                                    text-sm
                                                    text-red-600
                                                ">
                                                    {emailError}
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
                                                : 'Continue with Email'}
                                        </button>

                                    </form>

                                    {/* Signup */}
                                    <div className="
                                        mt-7
                                        pt-6
                                        border-t
                                        border-[#164A41]/10
                                    ">

                                        <p className="
                                            text-center
                                            text-sm
                                            text-[#49645F]
                                        ">
                                            Don't have an account?{' '}

                                            <Link
                                                to="/signup"
                                                state={{
                                                    from: location.state?.from,
                                                }}
                                                className="
                                                    font-semibold
                                                    text-[#178C92]
                                                    hover:text-[#007078]
                                                    transition-colors
                                                "
                                            >
                                                Sign up for free
                                            </Link>

                                        </p>

                                    </div>

                                </div>

                                {/* Security */}
                                <div className="
                                    mt-6
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    text-sm
                                    text-[#49645F]
                                ">

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

export default Login;






