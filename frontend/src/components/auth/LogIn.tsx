import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from "@/supabaseClient";

export default function LogIn() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (): Promise<void> => {
    const newErrors: { [key: string]: string } = {};

    if (!email) newErrors.email = 'Email is required';
    else if (!validateEmail(email))
      newErrors.email = 'Please enter a valid email address';

    if (!password) newErrors.password = 'Password is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    // ✅ Try signing in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error.message);
      setErrors({ general: error.message });
      return;
    }

    // ✅ Get user info from the active session
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Failed to fetch user:", userError?.message);
      setErrors({ general: "Failed to retrieve user data." });
      return;
    }

    // ✅ Check if profile already exists
    const { data: existingProfile, error: selectError } = await supabase
      .from("users")
      .select("*")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (selectError) {
      console.error("Error checking existing profile:", selectError);
    }

    // ✅ If profile doesn't exist, create one
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
        console.log("✅ New user profile created successfully!");
      }
    } else {
      console.log("Profile already exists, skipping insert.");
    }

    alert("Login successful! Redirecting...");
    navigate("/college");
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
      <div className="w-full flex flex-col h-full justify-center">
        {/* Header */}
        <h1
          className="text-center mb-3 lg:mb-4 text-[32px] leading-tight 
                     bg-gradient-to-b from-[#1D5D95] to-[#004689] bg-clip-text text-transparent"
        >
          Welcome Back to Kolehiyo!
        </h1>

        {/* Subheader */}
        <p className="text-center mb-6 lg:mb-8 text-[#012243] text-[18px]">
          Keep track of your college and scholarship applications in one click.
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
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
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
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Log In Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-full text-white font-bold text-lg mb-6 
                     bg-gradient-to-b from-[#1D5D95] to-[#004689]
                     hover:scale-[1.02] transition-transform shadow-lg active:scale-95"
        >
          Log In
        </button>

        {/* Sign Up Redirection Link */}
        <p className="text-center text-[#012243] text-[18px]">
          Are you new to Kolehiyo?{' '}
          <Link to="/auth/sign_up" className="font-bold text-[#1D5D95] hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
