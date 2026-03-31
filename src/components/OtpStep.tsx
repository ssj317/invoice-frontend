import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { loginStart, loginSuccess, loginFailure } from '@/store/authSlice';
import { authService } from '@/services/authService';
import { useNavigate } from 'react-router-dom';

interface OtpStepProps {
  email: string;
  onBack: () => void;
  redirectTo: string;
}

const OtpStep: React.FC<OtpStepProps> = ({ email, onBack, redirectTo }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.auth);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(60);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    otpRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setOtpError('');
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      otpRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) { setOtpError('Please enter the 6-digit code'); return; }
    try {
      dispatch(loginStart());
      const response = await authService.verifyOtp(email, otpValue);
      if (response.success) {
        dispatch(loginSuccess({ user: response.data.user, token: response.data.token }));
        navigate(redirectTo, { replace: true });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid OTP. Please try again.';
      setOtpError(msg);
      dispatch(loginFailure(''));
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      await authService.resendOtp(email);
      setResendCooldown(60);
      setOtp(['', '', '', '', '', '']);
      setOtpError('');
      otpRefs.current[0]?.focus();
    } catch {
      setOtpError('Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-8">
      <div className="flex justify-center mb-4">
        <div className="bg-purple-100 rounded-full p-3">
          <ShieldCheck className="h-8 w-8 text-purple-600" />
        </div>
      </div>
      <h2 className="text-xl font-semibold text-gray-800 text-center mb-1">Check your email</h2>
      <p className="text-sm text-gray-500 text-center mb-6">
        We sent a 6-digit code to <span className="font-medium text-gray-700">{email}</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {otpError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{otpError}</div>
        )}
        <div className="flex justify-center gap-3" onPaste={handleOtpPaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { otpRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(i, e)}
              className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            />
          ))}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Verifying...' : 'Verify & Continue'}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-500">
        Didn't receive the code?{' '}
        <button
          onClick={handleResend}
          disabled={resendCooldown > 0}
          className="font-medium text-purple-600 hover:text-purple-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend'}
        </button>
      </div>
      <div className="mt-3 text-center">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
          ← Back
        </button>
      </div>
    </div>
  );
};

export default OtpStep;
