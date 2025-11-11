import React from 'react';
import { supabase } from '@/supabaseClient';

export interface CollegeCardProps {
  universityName: string;
  address: string;
  applicationStart: string;
  applicationEnd: string;
  universityType: string;
  tuitionFee: string;
  logoUrl: string;
  status: 'open' | 'closed';
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
    }
  };

  const currentStatus = statusStyles[status];

  const handleAddToBoard = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        alert("You must be logged in to add to your board.");
        return;
      }

      const response = await fetch("http://localhost:5000/api/colleges/tracked", { // 👈 use your Express backend URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`, // ✅ include token
        },
        body: JSON.stringify({
          collegeId: collegeId.toString(), // adjust field name
        }),
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg);
      }

      alert(`${universityName} has been added to your board!`);
    } catch (err) {
      console.error("Add to board failed:", err);
      alert("Failed to add to board.");
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
          <img 
            src={logoUrl} 
            alt={`${universityName} logo`}
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain"
          />
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
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>

        {/* Add to Board Button */}
        <button
        onClick={handleAddToBoard}
        className="
            font-bold text-white rounded-[25px] transition-opacity hover:opacity-90
            text-sm sm:text-base flex-1 sm:flex-initial px-2 py-2
            w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px]
            h-[80px] sm:h-[70px] md:h-[50px]
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