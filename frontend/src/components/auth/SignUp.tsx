import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useSignUp } from '@clerk/clerk-react';

export default function SignUp() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  // NEW: State to manage the verification flow
  const [pendingVerification, setPendingVerification] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');
  // ---

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success' | 'info', message: string } | null>(null);

  const { isLoaded, signUp, setActive } = useSignUp();
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // This is the FIRST step: creating the user
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setErrors({});
    setStatusMessage(null);
    if (!isLoaded) return;

    // --- Front-end validation (unchanged) ---
    const newErrors: { [key:string]: string } = {};
    if (!email) newErrors.email = "Email is required";
    else if (!validateEmail(email)) newErrors.email = "Please enter a valid email address";
    if (!password) newErrors.password = "Password is required";
    if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // --- End validation ---

    setLoading(true);

    try {
      const result = await signUp.create({
        emailAddress: email,
        password: password,
        unsafeMetadata: {},
      });

      console.log("Clerk signUp.create result status:", result.status);

      // This status means email verification is required.
      if (result.status === 'missing_requirements') {
        // NEW: Set pendingVerification to true to show the code input field
        setPendingVerification(true);
        setStatusMessage({ type: 'info', message: 'A verification code has been sent to your email.' });
      } 
      
      // This status happens if you disable email verification in Clerk
      else if (result.status === 'complete' && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        setStatusMessage({ type: 'success', message: 'Account created! Redirecting...' });
        setTimeout(() => {
          navigate("/auth/onboarding"); // Or your dashboard
        }, 1000);
      } 
      
      else {
        console.warn("Clerk sign up returned unexpected status:", result.status);
        setStatusMessage({ type: 'error', message: `Sign up status: ${result.status}. Please try again.`});
      }

    } catch (err: any) {
      console.error("Clerk Sign Up Error:", JSON.stringify(err, null, 2));
      const clerkError = err.errors?.[0]?.longMessage || "An error occurred during account creation.";
      setStatusMessage({ type: 'error', message: clerkError });
    } finally {
      setLoading(false);
    }
  };

  // NEW: This is the SECOND step: verifying the code
  const handleVerification = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    setErrors({});
    setStatusMessage(null);

    try {
      // Use attemptEmailAddressVerification to submit the code
      const result = await signUp.attemptEmailAddressVerification({
        code: code,
      });

      // If verification is successful, result.status will be 'complete'
      // and a session will be created.
      if (result.status === 'complete' && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        setStatusMessage({ type: 'success', message: 'Account verified! Redirecting...' });
        setTimeout(() => {
          navigate("/auth/onboarding"); // Or your dashboard
        }, 1000);
      } else {
        // This can happen if the code is wrong, but the flow is not complete
        console.warn("Verification unsuccessful:", result);
        setStatusMessage({ type: 'info', message: `Verification status: ${result.status}. Please try again.` });
      }
    } catch (err: any) {
      // Handle errors (e.g., incorrect code)
      console.error("Clerk Verification Error:", JSON.stringify(err, null, 2));
      const clerkError = err.errors?.[0]?.longMessage || "An error occurred during verification.";
      setStatusMessage({ type: 'error', message: clerkError });
    } finally {
      setLoading(false);
    }
  };


  // --- JSX Rendering ---
  return (
    <div
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%]
               w-10/12 max-w-5xl lg:w-[600px] lg:h-auto
               max-h-[90vh] overflow-y-auto
               bg-white shadow-[0_4px_50px_0_rgba(0,0,0,0.2)]
               rounded-[35px] flex flex-col items-center justify-center
               px-6 md:px-10 lg:px-12 py-8 z-30"
    >
      {/* NEW: Conditionally render the correct form */}
      {!pendingVerification && (
        <form onSubmit={handleSubmit} className="w-full flex flex-col h-full justify-center">
          <h1
            className="text-center mb-3 lg:mb-4 text-[32px] leading-tight
                           bg-gradient-to-b from-[#1D5D95] to-[#004689] bg-clip-text text-transparent"
          >
            Start Your College Journey!
          </h1>

          <p className="text-center mb-6 lg:mb-8 text-[#012243] text-[18px]">
            Create an account and track your college and scholarship applications with ease.
          </p>

          {statusMessage && (
              <div className={`p-3 rounded-xl mb-4 text-white text-center font-semibold
                ${statusMessage.type === 'error' ? 'bg-red-500' : statusMessage.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}
              >
                  {statusMessage.message}
              </div>
          )}

          <div className="mb-4">
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
              disabled={loading}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="mb-4">
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
              disabled={loading}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

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
              disabled={loading}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-full text-white font-bold text-lg mb-6
                       bg-gradient-to-b from-[#1D5D95] to-[#004689]
                       hover:scale-[1.02] transition-transform shadow-lg active:scale-95
                       ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <p className="text-center text-[#012243] text-[18px]">
            Already have an account?{' '}
          <Link to="/auth/log_in" className="relative inline-block">
            <span
              className="font-bold text-[#1D5D95] hover:underline cursor-pointer"
            >
              Log in
            </span>
            </Link>
          </p>
        </form>
      )}

      {/* NEW: This is the verification form */}
      {pendingVerification && (
        <form onSubmit={handleVerification} className="w-full flex flex-col h-full justify-center">
            <h1
              className="text-center mb-3 lg:mb-4 text-[32px] leading-tight
                            bg-gradient-to-b from-[#1D5D95] to-[#004689] bg-clip-text text-transparent"
            >
              Verify Your Email
            </h1>

            <p className="text-center mb-6 lg:mb-8 text-[#012243] text-[18px]">
              Check your email for a 6-digit verification code.
            </p>

            {statusMessage && (
                <div className={`p-3 rounded-xl mb-4 text-white text-center font-semibold
                  ${statusMessage.type === 'error' ? 'bg-red-500' : statusMessage.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}
                >
                    {statusMessage.message}
                </div>
            )}

            <div className="mb-6 lg:mb-8">
              <label className="block mb-2 text-[#1E1E1E] text-[18px]">
                Verification Code <span className="text-[#DDA104]">*</span>
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 border border-[#979797] rounded-[15px]
                            placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D5D95]
                            text-[18px] text-center tracking-[0.2em]"
                disabled={loading}
              />
              {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-full text-white font-bold text-lg mb-6
                        bg-gradient-to-b from-[#1D5D95] to-[#004689]
                        hover:scale-[1.02] transition-transform shadow-lg active:scale-95
                        ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Verifying...' : 'Verify Account'}
            </button>
        </form>
      )}
    </div>
  );
}



