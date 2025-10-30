import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export default function Onboarding() {
  const [fullName, setFullName] = useState("");
  const [track, setTrack] = useState("");
  const [program, setProgram] = useState("");
  const [city, setCity] = useState("");

  const [showTrackDropdown, setShowTrackDropdown] = useState(false);
  const [showProgramDropdown, setShowProgramDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

const navigate = useNavigate();

  const seniorHighTracks = [
    "STEM (Science, Technology, Engineering, Mathematics)",
    "ABM (Accountancy, Business, and Management)",
    "HUMSS (Humanities and Social Sciences)",
    "GAS (General Academic Strand)",
    "TVL (Technical-Vocational-Livelihood)",
    "Arts and Design Track",
    "Sports Track",
  ];

  const desiredPrograms = [
    "Engineering",
    "Programming",
    "Computer Science",
    "Information Technology",
    "Pre-Medical",
    "Nursing",
    "Business",
    "Accountancy",
    "Tourism",
    "Arts",
    "Multimedia",
    "Education",
    "Architecture",
    "Law",
    "Psychology",
    "Communication",
  ];

  const ncrCities = [
    "Caloocan",
    "Las Piñas",
    "Makati",
    "Malabon",
    "Mandaluyong",
    "Manila",
    "Marikina",
    "Muntinlupa",
    "Navotas",
    "Parañaque",
    "Pasay",
    "Pasig",
    "Quezon City",
    "San Juan",
    "Taguig",
    "Valenzuela",
    "Pateros",
  ];

  const handleSubmit = () => {
    if (!fullName || !track || !program || !city) {
      alert("Please complete all fields.");
      return;
    } 
    navigate("/college");
  };

  return (
    <div
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%]
             w-10/12 max-w-5xl lg:w-[700px] lg:h-[780px]
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
          Personalize Your Journey
        </h1>

        {/* Subheader */}
        <p className="text-center mb-6 lg:mb-8 text-[#012243] text-[18px]">
          Answer the questions below and maximize your college and scholarship searching experience.
        </p>

        {/* Full Name */}
        <div className="mb-4 lg:mb-6">
          <label className="block mb-2 text-[#1E1E1E] text-[18px]">
            Full Name <span className="text-[#DDA104]">*</span>
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 border border-[#979797] rounded-[15px] 
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D5D95] 
                       text-[18px]"
          />
        </div>

        {/* Current Academic Track */}
        <div className="mb-4 lg:mb-6 relative">
          <label className="block mb-2 text-[#1E1E1E] text-[18px]">
            Current Academic Track <span className="text-[#DDA104]">*</span>
          </label>
          <div
            className="relative cursor-pointer"
            onClick={() => setShowTrackDropdown(!showTrackDropdown)}
          >
            <div className="flex items-center justify-between border border-[#979797] rounded-[15px] px-4 py-3">
              <span
                className={`text-[18px] ${
                  track ? "text-black" : "text-gray-400"
                }`}
              >
                {track || "Select your current strand"}
              </span>
              <ChevronDown
                className={`transition-transform ${
                  showTrackDropdown ? "rotate-180" : ""
                } text-gray-500`}
                size={20}
              />
            </div>
            {showTrackDropdown && (
              <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-xl z-50">
                {seniorHighTracks.map((t) => (
                  <li
                    key={t}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[16px]"
                    onClick={() => {
                      setTrack(t);
                      setShowTrackDropdown(false);
                    }}
                  >
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Desired Program */}
        <div className="mb-4 lg:mb-6 relative">
          <label className="block mb-2 text-[#1E1E1E] text-[18px]">
            Desired Program <span className="text-[#DDA104]">*</span>
          </label>
          <div
            className="relative cursor-pointer"
            onClick={() => setShowProgramDropdown(!showProgramDropdown)}
          >
            <div className="flex items-center justify-between border border-[#979797] rounded-[15px] px-4 py-3">
              <span
                className={`text-[18px] ${
                  program ? "text-black" : "text-gray-400"
                }`}
              >
                {program || "Select your desired program"}
              </span>
              <ChevronDown
                className={`transition-transform ${
                  showProgramDropdown ? "rotate-180" : ""
                } text-gray-500`}
                size={20}
              />
            </div>
            {showProgramDropdown && (
              <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-xl z-50">
                {desiredPrograms.map((p) => (
                  <li
                    key={p}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[16px]"
                    onClick={() => {
                      setProgram(p);
                      setShowProgramDropdown(false);
                    }}
                  >
                    {p}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* City / Region */}
        <div className="mb-6 lg:mb-8 relative">
          <label className="block mb-2 text-[#1E1E1E] text-[18px]">
            City / Region <span className="text-[#DDA104]">*</span>
          </label>
          <div
            className="relative cursor-pointer"
            onClick={() => setShowCityDropdown(!showCityDropdown)}
          >
            <div className="flex items-center justify-between border border-[#979797] rounded-[15px] px-4 py-3">
              <span
                className={`text-[18px] ${
                  city ? "text-black" : "text-gray-400"
                }`}
              >
                {city || "Select your city"}
              </span>
              <ChevronDown
                className={`transition-transform ${
                  showCityDropdown ? "rotate-180" : ""
                } text-gray-500`}
                size={20}
              />
            </div>
            {showCityDropdown && (
              <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-xl z-50">
                {ncrCities.map((c) => (
                  <li
                    key={c}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[16px]"
                    onClick={() => {
                      setCity(c);
                      setShowCityDropdown(false);
                    }}
                  >
                    {c}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-full text-white font-bold text-lg mb-6 
                     bg-gradient-to-b from-[#1D5D95] to-[#004689]
                     hover:scale-[1.02] transition-transform shadow-lg active:scale-95"
        >
          Start Your Journey
        </button>
      </div>
    </div>
  );
}
