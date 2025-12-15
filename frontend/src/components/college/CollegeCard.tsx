import React from 'react';
import { supabase } from '@/supabaseClient';
import notify from '@/lib/notify';

export interface CollegeCardProps {
  universityName: string;
  address: string;
  applicationStart: string;
  applicationEnd: string;
  universityType: string;
  tuitionFee: string;
  logoUrl: string;
  status: string; // open, closed, coming_soon
  collegeId?: string; // College ID for triggering api call to correct college - Add to board
  onClick?: () => void;
}

const CollegeCard: React.FC<CollegeCardProps> = ({
  universityName,
  address,
  applicationStart,
  applicationEnd,
  universityType,
  tuitionFee,
  logoUrl,
  status,
  collegeId,
  onClick
}) => {
  const statusStyles = {
    open: {
      bg: 'bg-[#7DD27D]',
      text: 'text-[#178717]'
    },
    closed: {
      bg: 'bg-gray-300',
      text: 'text-gray-600'
    },
    "coming soon": { 
      bg: "bg-yellow-300", 
      text: "text-yellow-800" 
    }
  };
  const normalizedStatus = (status || 'open').toLowerCase().replace('_', ' ');
  const currentStatus = statusStyles[normalizedStatus as keyof typeof statusStyles] ?? statusStyles.open;

  const handleAddToBoard = async (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent triggering onClick navigation

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        notify.error("You must be logged in to add to your board.");
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) {
        console.error("VITE_API_URL is not defined");
        notify.error("Configuration error: API URL not set");
        return;
      }

      const response = await fetch(`${apiUrl}/api/colleges/tracked`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          collegeId: collegeId.toString(),
        }),
      });

      if (!response.ok) {
        const msg = await response.text();
        console.error("Server error:", msg);
        throw new Error(msg);
      }

      notify.success(`${universityName} has been added to your board!`);
    } catch (err) {
      console.error("Add to board failed:", err);
      notify.error("Failed to add to board.");
    }
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-[25px] sm:rounded-[35px] p-5 sm:p-6 md:p-8 flex flex-col justify-between text-[#1E1E1E] min-h-[250px] w-full max-w-[700px] cursor-pointer transition-transform hover:scale-[1.02]"
      style={{
        boxShadow: '0px 4px 50px rgba(0, 0, 0, 0.2)'
      }}
    >
      {/* Top Section */}
      <div className="flex justify-between items-start gap-4 sm:gap-6 mb-5">
        {/* Left: Header and Details */}
        <div className="flex-1 flex flex-col" style={{ gap: '14px' }}>
          {/* Header */}
          <div>
            <h2 className="text-[14px] sm:text-[15px] md:text-[16px] font-bold leading-tight">
              {universityName}
            </h2>
            <p className="text-[13px] sm:text-[14px] md:text-[16px] leading-tight" style={{ marginTop: '4px' }}>
              {address}
            </p>
          </div>

          {/* Details */}
          <div className="text-[13px] sm:text-[14px] md:text-[16px]" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <p>
              <span className="font-bold">Application:</span> {applicationStart} - {applicationEnd}
            </p>
            <p>
              <span className="font-bold">University Type:</span> {universityType}
            </p>
            <p>
              <span className="font-bold">Tuition Fee:</span> {tuitionFee}
            </p>
          </div>
        </div>

        {/* Right: Logo */}
        <div className="flex-shrink-0">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt={`${universityName} logo`}
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain"
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-400 text-xs">No Logo</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
        {/* Status Badge */}
        <div 
          className={`${currentStatus.bg} ${currentStatus.text} font-bold flex items-center justify-center rounded-[25px] text-sm sm:text-base`}
          style={{
            width: '140px',
            height: '35px',
            minWidth: '140px'
          }}
        >
          {/* This logic capitalizes every word and removes underscores */}
          {normalizedStatus
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </div>

        {/* Add to Board Button */}
        <button
        onClick={handleAddToBoard}
        className="
            font-bold text-white rounded-[25px] transition-opacity hover:opacity-90
            text-sm sm:text-base flex-1 sm:flex-initial px-2 py-2
            w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px]
            h-[80px] sm:h-[70px] md:h-[50px] active:opacity-70
        "   
        style={{
            background: 'linear-gradient(180deg, #1D5D95 0%, #004689 100%)'
        }}
        >
        Add to Board
        </button>
      </div>
    </div>
  );
};

export default CollegeCard;