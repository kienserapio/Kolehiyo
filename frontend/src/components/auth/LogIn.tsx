import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from "@/supabaseClient";
import notify from '@/lib/notify';

export default function LogIn() {
  // --- STATE ---
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [mfaCode, setMfaCode] = useState<string>(''); // New state for the code
  const [showMfaInput, setShowMfaInput] = useState<boolean>(false); // Toggle views
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLockedOut, setIsLockedOut] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  
  const navigate = useNavigate();

  // --- BRUTE FORCE PROTECTION ---
  const MAX_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  const getFailedAttempts = (): number => {
    const attempts = localStorage.getItem('loginAttempts');
    return attempts ? parseInt(attempts) : 0;
  };

  const getLockoutTime = (): number | null => {
    const time = localStorage.getItem('lockoutTime');
    return time ? parseInt(time) : null;
  };

  const incrementFailedAttempts = () => {
    const attempts = getFailedAttempts() + 1;
    localStorage.setItem('loginAttempts', attempts.toString());
    
    if (attempts >= MAX_ATTEMPTS) {
      const lockoutTime = Date.now();
      localStorage.setItem('lockoutTime', lockoutTime.toString());
      setIsLockedOut(true);
      startLockoutTimer();
    }
  };

  const resetFailedAttempts = () => {
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('lockoutTime');
    setIsLockedOut(false);
    setRemainingTime(0);
  };

  const checkLockoutStatus = () => {
    const lockoutTime = getLockoutTime();
    if (!lockoutTime) return false;

    const elapsed = Date.now() - lockoutTime;
    if (elapsed < LOCKOUT_DURATION) {
      setIsLockedOut(true);
      setRemainingTime(Math.ceil((LOCKOUT_DURATION - elapsed) / 1000));
      return true;
    } else {
      resetFailedAttempts();
      return false;
    }
  };

  const startLockoutTimer = () => {
    const lockoutTime = getLockoutTime();
    if (!lockoutTime) return;

    const updateTimer = () => {
      const elapsed = Date.now() - lockoutTime;
      const remaining = Math.ceil((LOCKOUT_DURATION - elapsed) / 1000);
      
      if (remaining > 0) {
        setRemainingTime(remaining);
        setTimeout(updateTimer, 1000);
      } else {
        resetFailedAttempts();
      }
    };

    updateTimer();
  };

  // Check lockout status on mount
  React.useEffect(() => {
    checkLockoutStatus();
  }, []);

  // --- HELPERS ---
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * This function handles the "Post-Login" logic:
   * checking the profile, creating it if missing, and redirecting.
   * We pull this out so we can call it after Password OR after MFA.
   */
  const finalizeLogin = async () => {
    // Get user info from the active session
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Failed to fetch user:", userError?.message);
      setErrors({ general: "Failed to retrieve user data." });
      return;
    }

    // Check if profile already exists
    const { data: existingProfile, error: selectError } = await supabase
      .from("users")
      .select("*")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (selectError) {
      console.error("Error checking existing profile:", selectError);
    }

    // If profile doesn't exist, create one
    if (!existingProfile) {
      const { error: insertError } = await supabase.from("users").insert({
        auth_user_id: user.id,
        email: user.email,
        full_name: "",
        academic_level: null,
        region: null,
      });

      if (insertError) {
        console.error("Profile insert error:", insertError);
      } else {
        // console.log("✅ New user profile created successfully!");
        // console cleanup: commented out to reduce noise
      }
    } else {
      // console.log("Profile already exists, skipping insert.");
      // console cleanup: commented out to reduce noise
    }

    notify.success("Login successful! Welcome back!");
    navigate("/college");
  };

  // --- HANDLERS ---

  // 1. Initial Password Login
  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>): Promise<void> => {
    if (e) e.preventDefault();

    // Check if account is locked out
    if (checkLockoutStatus()) {
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;
      setErrors({ 
        general: `Too many failed attempts. Please try again in ${minutes}:${seconds.toString().padStart(2, '0')}` 
      });
      return;
    }

    const newErrors: { [key: string]: string } = {};

    if (!email) newErrors.email = 'Email is required';
    else if (!validateEmail(email))
      newErrors.email = 'Please enter a valid email address';

    if (!password) newErrors.password = 'Password is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    // A. Try signing in with Password
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error.message);
      incrementFailedAttempts();
      const attemptsLeft = MAX_ATTEMPTS - getFailedAttempts();
      
      if (attemptsLeft > 0) {
        setErrors({ 
          general: `${error.message}. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining before temporary lockout.` 
        });
      } else {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        setErrors({ 
          general: `Account temporarily locked due to multiple failed attempts. Try again in ${minutes}:${seconds.toString().padStart(2, '0')}` 
        });
      }
      return;
    }

    // Success - reset failed attempts
    resetFailedAttempts();

    // B. Check if they need MFA
    const { data: mfaData, error: mfaError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    
    if (mfaError) {
      console.error("MFA Check Error", mfaError);
      // Fallback: just try to finalize login if MFA check fails
      await finalizeLogin(); 
      return;
    }

    // C. Logic: If Next Level is AAL2 but Current is AAL1, they need to verify
    if (mfaData.nextLevel === 'aal2' && mfaData.currentLevel === 'aal1') {
      setShowMfaInput(true); // Switch the UI
      setErrors({}); // Clear previous errors
    } else {
      // No MFA needed, go straight to dashboard
      await finalizeLogin();
    }
  };

  // 2. Handle the TOTP Code Verification
  const handleMfaVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Get the user's factors to find the ID
    const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
    
    if (factorsError || !factors.totp || factors.totp.length === 0) {
      setErrors({ general: 'Could not access 2FA information.' });
      return;
    }

    const factorId = factors.totp[0].id;

    // Verify the code
    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId,
      code: mfaCode,
    });

    if (error) {
      setErrors({ general: 'Invalid code. Please try again.' });
    } else {
      // Success! Finish the login process
      await finalizeLogin();
    }
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
      {/* CONDITIONAL RENDERING 
        If showMfaInput is TRUE, show the Code form.
        Else, show the standard Login form.
      */}

      {!showMfaInput ? (
        // === STANDARD LOGIN FORM ===
        <form className="w-full flex flex-col h-full justify-center" onSubmit={handleSubmit}>
          <h1 className="text-center mb-3 lg:mb-4 text-[32px] leading-tight 
                       bg-gradient-to-b from-[#1D5D95] to-[#004689] bg-clip-text text-transparent">
            Welcome Back to Kolehiyo!
          </h1>
          <p className="text-center mb-6 lg:mb-8 text-[#012243] text-[18px]">
            Keep track of your college and scholarship applications in one click.
          </p>

          {/* Global Error Display */}
          {errors.general && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
              {errors.general}
            </div>
          )}

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

          <button
            type="submit"
            disabled={isLockedOut}
            className={`w-full py-3 rounded-full text-white font-bold text-lg mb-6 
                       bg-gradient-to-b from-[#1D5D95] to-[#004689]
                       hover:scale-[1.02] transition-transform shadow-lg active:scale-95
                       ${isLockedOut ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}`}
          >
            {isLockedOut ? `Locked (${Math.floor(remainingTime / 60)}:${(remainingTime % 60).toString().padStart(2, '0')})` : 'Log In'}
          </button>

          <p className="text-center text-[#012243] text-[18px]">
            Are you new to Kolehiyo?{' '}
            <Link to="/auth/sign_up" className="font-bold text-[#1D5D95] hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      ) : (
        // === MFA VERIFICATION FORM ===
        <form className="w-full flex flex-col h-full justify-center" onSubmit={handleMfaVerify}>
          <h1 className="text-center mb-3 lg:mb-4 text-[32px] leading-tight 
                       bg-gradient-to-b from-[#1D5D95] to-[#004689] bg-clip-text text-transparent">
            Two-Factor Authentication
          </h1>
          <p className="text-center mb-6 lg:mb-8 text-[#012243] text-[18px]">
            Enter the 6-digit code from your authenticator app to continue.
          </p>

          {errors.general && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
              {errors.general}
            </div>
          )}

          <div className="mb-6 lg:mb-8">
            <label className="block mb-2 text-[#1E1E1E] text-[18px] text-center">
              Authentication Code
            </label>
            <input
              type="text"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              maxLength={6}
              placeholder="000000"
              className="w-full px-4 py-3 border border-[#979797] rounded-[15px] 
                         placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D5D95] 
                         text-[24px] text-center tracking-[0.5em]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full text-white font-bold text-lg mb-4
                       bg-gradient-to-b from-[#1D5D95] to-[#004689]
                       hover:scale-[1.02] transition-transform shadow-lg active:scale-95"
          >
            Verify Code
          </button>

          <button
            type="button"
            onClick={() => setShowMfaInput(false)}
            className="text-center text-[#012243] text-[16px] hover:underline"
          >
            Back to Login
          </button>
        </form>
      )}
    </div>
  );
}