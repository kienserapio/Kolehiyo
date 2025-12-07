import React, { useEffect, useState, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { supabase } from "@/supabaseClient";

export interface BoardCardProps {
  trackerId: string;
  universityName: string;
  address: string;
  logoUrl: string;
  requirements: { item: string; checked: boolean }[];
  status: 'open' | 'closed' | 'coming soon';
  onRemove?: () => void;
  onClick?: () => void; // 👈 New prop
  type?: 'college' | 'scholarship';
}

const BoardCard: React.FC<BoardCardProps> = ({
  trackerId,
  universityName,
  address,
  logoUrl,
  requirements,
  status,
  onRemove,
  onClick, // 👈 Destructure
  type = 'college'
}) => {
  const [requirementsState, setRequirementsState] = useState(
    requirements.map(r => ({ ...r }))
  );
  const [isSaving, setIsSaving] = useState(false);

  // ✅ Dynamic endpoint depending on card type
  const apiRoute =
    type === 'scholarship'
      ? 'http://localhost:5000/api/scholarships/tracked/checklist'
      : 'http://localhost:5000/api/colleges/tracked/checklist';

  // ✅ Debounced save function
  const saveRequirements = useCallback(
    debounce(async (updatedRequirements: { item: string; checked: boolean }[]) => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        setIsSaving(true);
        await fetch(apiRoute, {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            trackerId: Number(trackerId),
            checklist: updatedRequirements
          })
        });
      } catch (err) {
        console.error(`❌ Error saving ${type} checklist:`, err);
      } finally {
        setIsSaving(false);
      }
    }, 1000),
    [trackerId, type, apiRoute]
  );

  // ✅ Handle checkbox change
  const handleCheckboxChange = (index: number) => {
    setRequirementsState(prev => {
      const updated = prev.map((req, i) =>
        i === index ? { ...req, checked: !req.checked } : req
      );
      saveRequirements(updated);
      return updated;
    });
  };

  // ✅ Cleanup on unmount
  useEffect(() => {
    return () => {
      saveRequirements.cancel();
    };
  }, [saveRequirements]);

  const checkedCount = requirementsState.filter(r => r.checked).length;
  const totalCount = requirementsState.length;
  const progressPercentage = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  const statusStyles = {
    open: { bg: 'bg-[#7DD27D]', text: 'text-[#178717]' },
    closed: { bg: 'bg-gray-300', text: 'text-gray-600' },
    'coming soon': { bg: 'bg-yellow-300', text: 'text-yellow-800'}
  };
  const normalizedStatus = (status || 'open').toLowerCase().replace('_', ' ');
  const currentStatus = statusStyles[normalizedStatus as keyof typeof statusStyles] ?? statusStyles.open;

  return (
    <div 
      onClick={onClick} // 👈 1. Main Click Handler
      className="bg-white rounded-[25px] sm:rounded-[35px] p-5 sm:p-6 md:p-8 flex flex-col text-[#1E1E1E] min-h-[250px] w-full max-w-[700px] cursor-pointer transition-transform hover:scale-[1.02]" // 👈 Added cursor and hover
      style={{ boxShadow: '0px 4px 50px rgba(0, 0, 0, 0.2)' }}
    >
      {/* Header and Checklist */}
      <div className="flex justify-between items-start gap-4 sm:gap-6 mb-4">
        <div className="flex-1 flex flex-col" style={{ gap: '12px' }}>
          <div>
            <h2 className="text-[14px] sm:text-[15px] md:text-[16px] font-bold leading-tight">
              {universityName}
            </h2>
            <p className="text-[13px] sm:text-[14px] md:text-[16px] leading-tight mt-1">
              {address}
            </p>
          </div>

          {/* Checklist */}
          {/* 🛑 STOP PROPAGATION HERE so clicking checklist doesn't open modal */}
          <div 
            className="flex flex-col gap-2"
            onClick={(e) => e.stopPropagation()} 
          >
            {requirementsState.map((req, index) => (
              <label key={index} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={req.checked}
                    onChange={() => handleCheckboxChange(index)}
                    className="appearance-none w-4 h-4 rounded-[3px] border-2 cursor-pointer transition-colors"
                    style={{
                      borderColor: req.checked ? '#FBB507' : '#979797',
                      backgroundColor: req.checked ? '#FBB507' : 'transparent'
                    }}
                  />
                  {req.checked && (
                    <svg className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className="text-[13px] sm:text-[14px] md:text-[16px] leading-tight">
                  {req.item}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Logo */}
        <div className="flex-shrink-0">
          <img 
            src={logoUrl}
            alt={`${universityName} logo`}
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain"
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full h-3 rounded-[25px] overflow-hidden bg-black/30">
          <div
            className="h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%`, backgroundColor: '#FBB507' }}
          />
        </div>
      </div>

      {/* Status + Remove */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
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

        <button
          onClick={(e) => { e.stopPropagation(); onRemove?.(); }}
          className="font-bold text-white rounded-[25px] transition-opacity hover:opacity-90 text-sm sm:text-base flex-1 sm:flex-initial px-2 py-2 w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] h-[80px] sm:h-[70px] md:h-[50px]"
          style={{ background: 'linear-gradient(180deg, #1D5D95 0%, #004689 100%)' }}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default BoardCard;