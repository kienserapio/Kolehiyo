import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const scholarshipTypes = [
  "Government",
  "Private/Corporate",
  "International",
];

const locations = [
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

const ScholarshipSearchBar = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setShowTypeDropdown(false);
  };

  const handleLocationSelect = (name: string) => {
    setSelectedLocation(name);
    setShowLocationDropdown(false);
  };

  const handleSearch = () => {
    console.log("Searching for:", selectedType, selectedLocation);
    
    const params = new URLSearchParams();

    if (selectedType.trim()) {
      params.set("type", selectedType.trim());
    }

    if (selectedLocation.trim()) {
      params.set("location", selectedLocation.trim());
    }

    console.log("Navigating to with params:", params.toString());
    navigate(`?${params.toString()}`);
  };

  return (
    <div
      className="absolute top-[330px] lg:top-80 left-1/2 -translate-x-1/2 
                 w-9/12 max-w-5xl lg:w-[900px] h-auto py-6 lg:h-[150px] lg:py-0 
                 bg-white shadow-[0_4px_50px_0_rgba(0,0,0,0.2)] rounded-[50px] 
                 flex flex-col lg:flex-row items-center justify-between 
                 px-4 md:px-8 lg:px-12 space-y-4 lg:space-y-0 z-30"
    >
      {/* Scholarship Type Input */}
      <div className="relative w-full lg:w-[350px]">
        <div
          className="flex items-center gap-3 border-[2px] lg:border-[3px] 
                     border-[#1E1E1E40] rounded-full px-3 py-3 lg:py-4 cursor-pointer"
        >
          <Search size={24} className="text-[#1E1E1E40]" />
          <input
            type="text"
            placeholder="Any scholarship type"
            className="outline-none bg-transparent w-full text-base lg:text-lg placeholder:text-gray-500"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        {showTypeDropdown && (
          <ul
            className="absolute top-full left-0 w-full bg-white border border-gray-200 
                       rounded-lg mt-1 max-h-48 overflow-y-auto shadow-xl z-50"
          >
            {scholarshipTypes
              .filter((t) => t.toLowerCase().includes(selectedType.toLowerCase()))
              .map((t) => (
                <li
                  key={t}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm lg:text-base transition-colors"
                  onClick={() => handleTypeSelect(t)}
                >
                  {t}
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* Location Input */}
      <div className="relative w-full lg:w-[250px]">
        <div
          className="flex items-center gap-3 border-[2px] lg:border-[3px] 
                     border-[#1E1E1E40] rounded-full px-3 py-3 lg:py-4 cursor-pointer"
          onClick={() => setShowLocationDropdown(!showLocationDropdown)}
        >
          <MapPin size={24} className="text-[#1E1E1E40]" />
          <input
            type="text"
            placeholder="Anywhere"
            className="outline-none bg-transparent w-full text-base lg:text-lg placeholder:text-gray-500"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        {showLocationDropdown && (
          <ul
            className="absolute top-full left-0 w-full bg-white border border-gray-200 
                       rounded-lg mt-1 max-h-48 overflow-y-auto shadow-xl z-50"
          >
            {locations
              .filter((l) => l.toLowerCase().includes(selectedLocation.toLowerCase()))
              .map((l) => (
                <li
                  key={l}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm lg:text-base transition-colors"
                  onClick={() => handleLocationSelect(l)}
                >
                  {l}
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="w-full lg:w-auto px-8 py-3 lg:px-10 lg:py-5 
                   bg-gradient-to-b from-[#1D5D95] to-[#004689] 
                   text-white font-bold text-lg rounded-full lg:rounded-[25px] 
                   hover:scale-[1.02] transition-transform shadow-lg active:scale-95"
      >
        Search
      </button>
    </div>
  );
};

export default ScholarshipSearchBar;
