import { useState, useEffect } from "react";
import { Menu, X, CircleUserRound } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import WhiteLogo from "@/assets/White Logo.png";
import BlueLogo from "@/assets/Kolehiyo Logo.png";
import ProfileCard from "@/components/profile/ProfileCard";
import { supabase } from "@/supabaseClient";
import notify from "@/lib/notify";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    currentCity: "",
    desiredProgram: "",
    academicStrand: "",
  });
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const isBoardPage = location.pathname === "/board";

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const openProfile = () => {
    setIsProfileOpen(true);
    setIsMenuOpen(false);
  };
  const closeProfile = () => setIsProfileOpen(false);

  const linkColor = isBoardPage ? "text-[#1D5D95]" : "text-white";
  const hoverColor = "hover:text-[#FBB507]";

  // Fetch user data from Supabase
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          console.error("Auth error:", authError);
          notify.error("Failed to authenticate user");
          return;
        }

        if (!user) {
          console.warn("No authenticated user found");
          return;
        }

        // Fetch user profile data from the users table using auth_user_id
        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("full_name, email, city, program, track")
          .eq("auth_user_id", user.id)
          .single();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          notify.error("Failed to load user profile");
          return;
        }

        if (profile) {
          setUserData({
            fullName: profile.full_name || "",
            email: profile.email || user.email || "",
            currentCity: profile.city || "",
            desiredProgram: profile.program || "",
            academicStrand: profile.track || "",
          });
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        notify.error("An error occurred while loading profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      notify.error("Sign out failed");
      return;
    }

    notify.success("Signed out successfully!");
    closeProfile();

    window.location.href = "/";
  };

  return (
    <>
      <nav
        className={`${
          isBoardPage ? "bg-white" : "bg-transparent"
        } absolute top-0 left-0 right-0 z-50 transition-all duration-300`}
      >
        <div className="container mx-auto px-6 py-10 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src={isBoardPage ? BlueLogo : WhiteLogo}
              alt="Kolehiyo Logo"
              className="w-[150px] h-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/college"
              className={`${linkColor} ${hoverColor} transition-colors font-medium`}
            >
              Colleges
            </Link>

            <Link
              to="/scholarship"
              className={`${linkColor} ${hoverColor} transition-colors font-medium`}
            >
              Scholarships
            </Link>

            <Link
              to="/board"
              className={`${linkColor} ${hoverColor} transition-colors font-medium`}
            >
              My Board
            </Link>

            <button
              onClick={openProfile}
              className={`${linkColor} ${hoverColor} transition-colors font-medium cursor-pointer`}
              aria-label="Open profile"
              disabled={loading}
            >
              <CircleUserRound size={24} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className={`md:hidden p-2 ${linkColor} ${hoverColor} transition-colors`}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div
            className={`md:hidden ${
              isBoardPage
                ? "bg-white/95 border-t border-gray-200"
                : "bg-[#012243]/90 border-t border-white/20"
            } py-4`}
          >
            <div className="flex flex-col space-y-4 px-4">
              <Link
                to="/college"
                className={`${linkColor} ${hoverColor} transition-colors font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                Colleges
              </Link>

              <Link
                to="/scholarship"
                className={`${linkColor} ${hoverColor} transition-colors font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                Scholarships
              </Link>

              <Link
                to="/board"
                className={`${linkColor} ${hoverColor} transition-colors font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                My Board
              </Link>

              <button
                onClick={openProfile}
                className={`${linkColor} ${hoverColor} transition-colors font-medium text-left`}
                disabled={loading}
              >
                Profile
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Profile Card Modal */}
      {!loading && (
        <ProfileCard
          isOpen={isProfileOpen}
          onClose={closeProfile}
          userData={userData}
          onSignOut={handleSignOut}
        />
      )}
    </>
  );
};

export default Navbar;
