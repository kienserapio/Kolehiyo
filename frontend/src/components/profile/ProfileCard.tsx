import React, { useEffect } from 'react';

export interface ProfileCardProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    fullName: string;
    email: string;
    currentCity: string;
    desiredProgram: string;
    academicStrand: string;
  };
  onSignOut: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  isOpen,
  onClose,
  userData,
  onSignOut
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - 70% black opacity */}
      <div
        className="fixed inset-0 bg-black/70 z-[60] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Profile Card - Centered with responsive sizing */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center pointer-events-none px-4 sm:px-6 md:px-8">
        <div
          className="bg-white rounded-[35px] md:rounded-[35px] sm:rounded-[25px] pointer-events-auto 
                     w-full max-w-[calc(725px/1.5)] md:max-w-[725px]
                     h-auto md:h-[500px]
                     p-6 sm:p-8 md:p-12"
          style={{
            boxShadow: '0px 4px 50px rgba(0, 0, 0, 0.3)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Content Container */}
          <div className="flex flex-col items-center gap-4 sm:gap-5 md:gap-6 w-full h-full">
            {/* User Information */}
            <div className="flex flex-col items-center gap-4 sm:gap-5 md:gap-6 w-full flex-1">
              {/* Full Name */}
              <div className="text-center">
                <h1 className="text-[21px] sm:text-[26px] md:text-[32px] font-bold text-[#1E1E1E]">
                  {userData.fullName}
                </h1>
                <p className="text-[13px] sm:text-[16px] md:text-[20px] text-[#1E1E1E] break-words">
                  {userData.email}
                </p>
              </div>

              {/* Current City */}
              <div className="text-left w-full">
                <h2 className="text-[13px] sm:text-[16px] md:text-[20px] font-bold text-[#1E1E1E]">
                  {userData.currentCity}
                </h2>
                <p className="text-[13px] sm:text-[16px] md:text-[20px] text-[#1E1E1E]">
                  Current City
                </p>
              </div>

              {/* Desired Program */}
              <div className="text-left w-full">
                <h2 className="text-[13px] sm:text-[16px] md:text-[20px] font-bold text-[#1E1E1E]">
                  {userData.desiredProgram}
                </h2>
                <p className="text-[13px] sm:text-[16px] md:text-[20px] text-[#1E1E1E]">
                  Desired Program
                </p>
              </div>

              {/* Academic Strand */}
              <div className="text-left w-full">
                <h2 className="text-[13px] sm:text-[16px] md:text-[20px] font-bold text-[#1E1E1E]">
                  {userData.academicStrand}
                </h2>
                <p className="text-[13px] sm:text-[16px] md:text-[20px] text-[#1E1E1E]">
                  Current Academic Strand
                </p>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={onSignOut}
              className="font-bold text-white rounded-full transition-opacity hover:opacity-90 
                         text-[11px] sm:text-[13px] md:text-base 
                         p-2 sm:p-2.5 md:p-3 
                         active:opacity-70
                         w-[103px] sm:w-[130px] md:w-[155px]
                         h-[30px] sm:h-[37px] md:h-[45px]"
              style={{
                background: 'linear-gradient(180deg, #1D5D95 0%, #004689 100%)'
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileCard;