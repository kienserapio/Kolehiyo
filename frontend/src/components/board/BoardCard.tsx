import React, { useState } from 'react';

export interface BoardCardProps {
  universityName: string;
  address: string;
  logoUrl: string;
  requirements: string[];
  status: 'open' | 'closed';
  onRemove?: () => void;
}

const BoardCard: React.FC<BoardCardProps> = ({
  universityName,
  address,
  logoUrl,
  requirements,
  status,
  onRemove
}) => {
  const [checkedRequirements, setCheckedRequirements] = useState<boolean[]>(
    new Array(requirements.length).fill(false)
  );

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

  const handleCheckboxChange = (index: number) => {
    const newChecked = [...checkedRequirements];
    newChecked[index] = !newChecked[index];
    setCheckedRequirements(newChecked);
  };

  const checkedCount = checkedRequirements.filter(Boolean).length;
  const totalCount = requirements.length;
  const progressPercentage = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  return (
    <div 
      className="bg-white rounded-[25px] sm:rounded-[35px] p-5 sm:p-6 md:p-8 flex flex-col text-[#1E1E1E] min-h-[250px] w-full max-w-[700px]"
      style={{
        boxShadow: '0px 4px 50px rgba(0, 0, 0, 0.2)'
      }}
    >
      {/* Top Section */}
      <div className="flex justify-between items-start gap-4 sm:gap-6 mb-4">
        {/* Left: Header and Requirements */}
        <div className="flex-1 flex flex-col" style={{ gap: '12px' }}>
          {/* Header */}
          <div>
            <h2 className="text-[14px] sm:text-[15px] md:text-[16px] font-bold leading-tight">
              {universityName}
            </h2>
            <p className="text-[13px] sm:text-[14px] md:text-[16px] leading-tight" style={{ marginTop: '4px' }}>
              {address}
            </p>
          </div>

          {/* Requirements Checklist */}
          <div className="flex flex-col gap-2">
            {requirements.map((requirement, index) => (
              <label 
                key={index} 
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={checkedRequirements[index]}
                    onChange={() => handleCheckboxChange(index)}
                    className="appearance-none w-4 h-4 rounded-[3px] border-2 cursor-pointer transition-colors"
                    style={{
                      borderColor: checkedRequirements[index] ? '#FBB507' : '#979797',
                      backgroundColor: checkedRequirements[index] ? '#FBB507' : 'transparent'
                    }}
                  />
                  {checkedRequirements[index] && (
                    <svg
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      fill="none"
                    >
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-[13px] sm:text-[14px] md:text-[16px] leading-tight">
                  {requirement}
                </span>
              </label>
            ))}
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

      {/* Progress Bar */}
      <div className="mb-4">
        <div 
          className="w-full h-3 rounded-[25px] overflow-hidden"
          style={{
            backgroundColor: 'rgba(30, 30, 30, 0.5)'
          }}
        >
          <div
            className="h-full transition-all duration-300 ease-out"
            style={{
              width: `${progressPercentage}%`,
              backgroundColor: '#FBB507'
            }}
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

        {/* Remove Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
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
          Remove
        </button>
      </div>
    </div>
  );
};

export default BoardCard;