import React from "react";
import { supabase } from "@/supabaseClient";

export interface ScholarshipCardProps {
  id: number;
  name: string;
  address: string;
  application_start: string;
  application_end: string;
  scho_type: string; // government, private, international
  benefits: string;
  logo_url: string;
  application_status: string;
  onClick?: () => void;
}

const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  id,
  name,
  address,
  application_start,
  application_end,
  scho_type,
  benefits,
  logo_url,
  application_status,
  onClick,
}) => {
  const statusStyles = {
    open: { bg: "bg-[#7DD27D]", text: "text-[#178717]" },
    closed: { bg: "bg-gray-300", text: "text-gray-600" },
    "coming soon": { bg: "bg-yellow-300", text: "text-yellow-800" },
  };

  const normalizedStatus = (application_status ?? "open").toLowerCase();
  const currentStatus =
    statusStyles[normalizedStatus as keyof typeof statusStyles] ?? statusStyles.open;

  const handleAddToBoard = async (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent triggering onClick navigation

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        alert("You must be logged in to add to your board.");
        return;
      }

      // ✅ get the user ID from the token
      const { data: { user } } = await supabase.auth.getUser(session.access_token);
      if (!user) {
        alert("Failed to get user info. Please log in again.");
        return;
      }

      const response = await fetch("http://localhost:5000/api/scholarships/tracked", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          scholarshipId: id.toString(), // field name matches backend route
        }),
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg);
      }

      alert(`${name} has been added to your board!`);
    } catch (err) {
      console.error("Add to board failed:", err);
      alert("Failed to add to board.");
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-[25px] sm:rounded-[35px] p-5 sm:p-6 md:p-8 flex flex-col justify-between text-[#1E1E1E] min-h-[250px] w-full max-w-[700px] cursor-pointer transition-transform hover:scale-[1.02]"
      style={{ boxShadow: "0px 4px 50px rgba(0, 0, 0, 0.2)" }}
    >
      {/* Top Section */}
      <div className="flex justify-between items-start gap-4 sm:gap-6 mb-5">
        <div className="flex-1 flex flex-col" style={{ gap: "14px" }}>
          <div>
            <h2 className="text-[14px] sm:text-[15px] md:text-[16px] font-bold leading-tight">{name}</h2>
            <p className="text-[13px] sm:text-[14px] md:text-[16px] leading-tight mt-1">{address}</p>
          </div>
          <div
            className="text-[13px] sm:text-[14px] md:text-[16px]"
            style={{ display: "flex", flexDirection: "column", gap: "2px" }}
          >
            <p>
              <span className="font-bold">Application:</span> {application_start} - {application_end}
            </p>
            <p>
              <span className="font-bold">Scholarship Type:</span> {scho_type}
            </p>
            <p>
              <span className="font-bold">Benefits:</span> {benefits}
            </p>
          </div>
        </div>

        <div className="flex-shrink-0">
          <img
            src={logo_url}
            alt={`${name} logo`}
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain"
          />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
        <div
          className={`${currentStatus.bg} ${currentStatus.text} font-bold flex items-center justify-center rounded-[25px] text-sm sm:text-base`}
          style={{ width: "140px", height: "35px", minWidth: "140px" }}
        >
          {(application_status ?? "Open")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </div>

        <button
          onClick={handleAddToBoard}
          className="font-bold text-white rounded-[25px] transition-opacity hover:opacity-90 text-sm sm:text-base flex-1 sm:flex-initial px-2 py-2 w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] h-[80px] sm:h-[70px] md:h-[50px]"
          style={{
            background: "linear-gradient(180deg, #1D5D95 0%, #004689 100%)",
          }}
        >
          Add to Board
        </button>
      </div>
    </div>
  );
};

export default ScholarshipCard;
