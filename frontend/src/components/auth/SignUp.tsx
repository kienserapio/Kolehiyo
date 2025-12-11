import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { supabase } from '@/supabaseClient'
import notify from '@/lib/notify';

export default function SignUp() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showOtpScreen, setShowOtpScreen] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const navigate = useNavigate();

  // Handle signup and send OTP
  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>): Promise<void> => {
    if (e) e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
      notify.error("Email is required");
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
      notify.error("Please enter a valid email address");
    }

    if (!password) {
      newErrors.password = "Password is required";
      notify.error("Password is required");
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      notify.error("Please confirm your password");
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      notify.error("Passwords do not match");
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/auth/onboarding',
        }
      });

      if (error) {
        notify.error(error.message);
        setErrors({ general: error.message });
        return;
      }

      notify.success("OTP sent! Please check your email.");
      setShowOtpScreen(true);
    } catch (err: any) {
      notify.error(err?.message || "An error occurred during signup");
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async (e?: React.FormEvent<HTMLFormElement>): Promise<void> => {
    if (e) e.preventDefault();

    if (!otp || otp.length !== 6) {
      notify.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsVerifying(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup'
      });

      if (error) {
        notify.error(error.message);
        setIsVerifying(false);
        return;
      }

      notify.success("Email verified successfully! Redirecting...");
      
      // Redirect to onboarding after successful verification
      setTimeout(() => {
        navigate("/auth/onboarding");
      }, 1000);
    } catch (err: any) {
      notify.error(err?.message || "Failed to verify OTP");
      setIsVerifying(false);
    }
  };

  const handleLogin = (): void => {
    // Handled by Link component
  };

  return (
    <div
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%]
             w-10/12 max-w-5xl lg:w-[600px] lg:h-[760px]
             max-h-[90vh] overflow-y-auto
             bg-white shadow-[0_4px_50px_0_rgba(0,0,0,0.2)] 
             rounded-[35px] flex flex-col items-center justify-center
             px-6 md:px-10 lg:px-12 py-8 z-30"
    >
      {!showOtpScreen ? (
        // Signup Form
        <form className="w-full flex flex-col h-full justify-center" onSubmit={handleSubmit}>
          <div className="w-full flex flex-col h-full justify-center">
            {/* Header */}
            <h1
              className="text-center mb-3 lg:mb-4 text-[32px] leading-tight 
                         bg-gradient-to-b from-[#1D5D95] to-[#004689] bg-clip-text text-transparent"
            >
              Start Your College Journey!
            </h1>

            {/* Subheader */}
            <p className="text-center mb-6 lg:mb-8 text-[#012243] text-[18px]">
              Create an account and track your college and scholarship applications with ease.
            </p>

            {/* Email Field */}
            <div className="mb-4 lg:mb-6">
              <label className="block mb-2 text-[#1E1E1E] text-[18px]">
                Email Address <span className="text-[#DDA104]">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                className="w-full px-4 py-3 border border-[#979797] rounded-[15px] 
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D5D95] 
                           text-[18px]"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="mb-4 lg:mb-6">
              <label className="block mb-2 text-[#1E1E1E] text-[18px]">
                Password <span className="text-[#DDA104]">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your Password"
                className="w-full px-4 py-3 border border-[#979797] rounded-[15px] 
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D5D95] 
                           text-[18px]"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password Field */}
            <div className="mb-6 lg:mb-8">
              <label className="block mb-2 text-[#1E1E1E] text-[18px]">
                Confirm Password <span className="text-[#DDA104]">*</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Your Password"
                className="w-full px-4 py-3 border border-[#979797] rounded-[15px] 
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D5D95] 
                           text-[18px]"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-full text-white font-bold text-lg mb-6 
                         bg-gradient-to-b from-[#1D5D95] to-[#004689]
                         hover:scale-[1.02] transition-transform shadow-lg active:scale-95"
            >
              Create Account
            </button>

            {/* Login Link */}
            <p className="text-center text-[#012243] text-[18px]">
              Already have an account?{' '}
              <Link to="/auth/log_in" className="relative inline-block">
                <button
                  onClick={handleLogin}
                  className="font-bold text-[#1D5D95] hover:underline cursor-pointer"
                  type="button"
                >
                  Log in
                </button>
              </Link>
            </p>
          </div>
        </form>
      ) : (
        // OTP Verification Form
        <form className="w-full flex flex-col h-full justify-center" onSubmit={handleVerifyOtp}>
          <div className="w-full flex flex-col h-full justify-center">
            {/* Header */}
            <h1
              className="text-center mb-3 lg:mb-4 text-[32px] leading-tight 
                         bg-gradient-to-b from-[#1D5D95] to-[#004689] bg-clip-text text-transparent"
            >
              Verify Your Email
            </h1>

            {/* Subheader */}
            <p className="text-center mb-6 lg:mb-8 text-[#012243] text-[18px]">
              We've sent a 6-digit verification code to <br />
              <span className="font-bold">{email}</span>
            </p>

            {/* OTP Input Field */}
            <div className="mb-6 lg:mb-8">
              <label className="block mb-2 text-[#1E1E1E] text-[18px] text-center">
                Enter Verification Code <span className="text-[#DDA104]">*</span>
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setOtp(value);
                }}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-3 border border-[#979797] rounded-[15px] 
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D5D95] 
                           text-[24px] text-center font-bold tracking-[0.5em]"
                autoFocus
              />
              <p className="text-center text-sm text-gray-500 mt-2">
                Please check your email for the verification code
              </p>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isVerifying || otp.length !== 6}
              className="w-full py-3 rounded-full text-white font-bold text-lg mb-6 
                         bg-gradient-to-b from-[#1D5D95] to-[#004689]
                         hover:scale-[1.02] transition-transform shadow-lg active:scale-95
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isVerifying ? "Verifying..." : "Verify Email"}
            </button>

            {/* Resend Code / Back to Signup */}
            <div className="flex flex-col gap-3 items-center">
              <button
                type="button"
                onClick={() => {
                  setShowOtpScreen(false);
                  setOtp('');
                  setErrors({});
                }}
                className="text-[#1D5D95] hover:underline text-[16px]"
              >
                ← Back to Sign Up
              </button>
              <p className="text-center text-[#012243] text-[16px]">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const { error } = await supabase.auth.resend({
                        type: 'signup',
                        email: email,
                      });
                      if (error) {
                        notify.error(error.message);
                      } else {
                        notify.success("Verification code resent!");
                      }
                    } catch (err: any) {
                      notify.error("Failed to resend code");
                    }
                  }}
                  className="font-bold text-[#1D5D95] hover:underline"
                >
                  Resend Code
                </button>
              </p>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}