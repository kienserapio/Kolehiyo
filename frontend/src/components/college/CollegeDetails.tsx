import React, { useEffect } from 'react';

interface ReviewResource {
  text: string;
  url: string;
}

export interface CollegeDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  college: {
    universityName: string;
    address: string;
    applicationStart: string;
    applicationEnd: string;
    universityType: string;
    tuitionFee: string;
    logoUrl: string;
    headerImageUrl: string;
    admissionsUrl: string;
    status: 'open' | 'closed';
    entranceExam: {
      examName: string;
      examDateStart: string;
      examDateEnd: string;
      examCoverage: string;
    };
    admissionDocuments: string[];
    topPrograms: string[];
    reviewResources: {
      mockExamLinks: ReviewResource[];
      reviewRecommendations: ReviewResource[];
    };
    contact: {
      email: string;
      contactNumber: string;
      campusLocation: string;
    };
  } | null;
}

const CollegeDetails: React.FC<CollegeDetailsProps> = ({ isOpen, onClose, college }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!college) return null;

  const statusStyles = {
    open: {
      bg: 'bg-[#7DD27D]',
      text: 'text-[#178717]',
    },
    closed: {
      bg: 'bg-gray-300',
      text: 'text-gray-600',
    },
    "coming soon": {
      bg: "bg-yellow-300",
      text: "text-yellow-800"
    }
  };

  const currentStatus = statusStyles[college.status];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`fixed z-50 bg-white shadow-2xl transition-all duration-500 ease-in-out
          lg:top-0 lg:bottom-0 lg:right-0 lg:h-screen lg:w-[800px]
          left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0
          bottom-0 w-full max-w-[600px] max-h-[90vh] lg:max-h-full lg:max-w-none
          rounded-t-[35px] lg:rounded-none
          ${isOpen ? 'opacity-100 lg:translate-x-0' : 'opacity-0 pointer-events-none lg:translate-x-full'}
        `}
      >
        {/* Header Image */}
        <div className="relative w-full h-[200px] overflow-hidden lg:rounded-none rounded-t-[35px]">
        <img
            src={college.headerImageUrl}
            alt={`${college.universityName} header`}
            className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#012243] z-10 opacity-75" />
        </div>

        {/* University Header Card */}
        <div
          className="relative w-full -mt-16 bg-white rounded-[25px] p-6 z-20"
          style={{
            boxShadow: '0px 4px 50px rgba(0, 0, 0, 0.2)',
            height: '140px',
          }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center h-full gap-3 lg:gap-0">
            {/* Left: Logo and Info */}
            <div className="flex gap-4 items-center flex-1">
              <img
                src={college.logoUrl}
                alt={`${college.universityName} logo`}
                className="w-20 h-20 object-contain flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-[18px] font-bold text-[#1E1E1E] leading-tight truncate">
                  {college.universityName}
                </h2>
                <p className="text-[16px] text-[#1E1E1E] mt-1 truncate">
                  {college.address}
                </p>

                {/* Status + Apply Now on same row for mobile */}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <div
                    className={`${currentStatus.bg} ${currentStatus.text} font-bold inline-flex items-center justify-center rounded-[25px] text-sm px-4 py-1`}
                  >
                    {college.status.charAt(0).toUpperCase() + college.status.slice(1)}
                  </div>

                  {/* Apply Now beside status on mobile, stays right on desktop */}
                  <a
                    href={college.admissionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-white rounded-[25px] transition-opacity hover:opacity-90 flex items-center justify-center flex-shrink-0
                      text-sm lg:text-base 
                      w-[140px] h-[40px]
                      lg:hidden"
                    style={{
                      background: 'linear-gradient(180deg, #1D5D95 0%, #004689 100%)',
                    }}
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Apply Now (Desktop Only) */}
            <a
              href={college.admissionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex font-bold text-white rounded-[25px] transition-opacity hover:opacity-90 items-center justify-center flex-shrink-0
                text-sm lg:text-base 
                w-[140px] h-[40px]"
              style={{
                background: 'linear-gradient(180deg, #1D5D95 0%, #004689 100%)',
              }}
            >
              Apply Now
            </a>
          </div>
        </div>

        {/* Scrollable Content */}
        <div
          className="overflow-y-auto px-6 pb-24 mt-6"
          style={{ maxHeight: 'calc(90vh - 340px)', scrollbarWidth: 'thin' }}
        >
          <div className="space-y-5 text-[#1E1E1E]">
            {/* Basic Info */}
            <div>
            <p className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[26px]">
                <span className="font-bold">Application:</span> {college.applicationStart} - {college.applicationEnd}
            </p>
            <p className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] mt-1 leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[26px]">
                <span className="font-bold">University Type:</span> {college.universityType}
            </p>
            <p className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] mt-1 leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[26px]">
                <span className="font-bold">Tuition Fee:</span> {college.tuitionFee}
            </p>
            </div>

            <hr className="border-t border-gray-400" />

            {/* Entrance Exam Info */}
            <div>
              <h3 className="text-[20px] font-bold mb-3 leading-[26px]">Entrance Exam Information</h3>
              <p className="text-[16px] leading-[20px]">
                <span className="font-bold">Exam Name:</span> {college.entranceExam.examName}
              </p>
              <p className="text-[16px] mt-2 leading-[20px]">
                <span className="font-bold">Exam Date:</span> {college.entranceExam.examDateStart} -{' '}
                {college.entranceExam.examDateEnd}
              </p>
              <p className="text-[16px] leading-[20px] mt-2">
                <span className="font-bold">Exam Coverage:</span> {college.entranceExam.examCoverage}
              </p>
            </div>

            {/* Admission Documents */}
            <div>
              <h3 className="text-[20px] font-bold mb-3">Admission Document Requirements</h3>
              <ul className="list-disc list-inside space-y-1">
                {college.admissionDocuments.map((doc, index) => (
                  <li key={index} className="text-[16px]">
                    {doc}
                  </li>
                ))}
              </ul>
            </div>

            {/* Top Programs */}
            <div>
              <h3 className="text-[20px] font-bold mb-3">Top Programs Offered</h3>
              <ul className="list-disc list-inside space-y-1">
                {college.topPrograms.map((program, index) => (
                  <li key={index} className="text-[16px]">
                    {program}
                  </li>
                ))}
              </ul>
            </div>

            {/* Reviewers & Mock Exams */}
            <div>
              <h3 className="text-[20px] font-bold mb-3">Reviewers & Mock Exam Resources</h3>

              <div className="mb-4">
                <h4 className="text-[16px] font-bold mb-2">Mock Exam Links:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {college.reviewResources.mockExamLinks.map((link, index) => (
                    <li key={index} className="text-[16px]">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1D5D95] hover:underline"
                      >
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-[16px] font-bold mb-2">Reviewer Recommendations:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {college.reviewResources.reviewRecommendations.map((link, index) => (
                    <li key={index} className="text-[16px]">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1D5D95] hover:underline"
                      >
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Admissions Contact */}
            <div>
              <h3 className="text-[20px] font-bold mb-3">Admissions Contact & Location</h3>
              <p className="text-[16px]">
                <span className="font-bold">Email Address:</span> {college.contact.email}
              </p>
              <p className="text-[16px] mt-2">
                <span className="font-bold">Contact Number:</span> {college.contact.contactNumber}
              </p>
              <p className="text-[16px] mt-2">
                <span className="font-bold">Campus Location:</span> {college.contact.campusLocation}
              </p>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Button */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-white rounded-[25px] p-6 flex justify-center"
          style={{
            boxShadow: '0px -4px 50px rgba(0, 0, 0, 0.2)',
          }}
        >
          <button
            className="font-bold text-white rounded-[25px] transition-opacity hover:opacity-90"
            style={{
              width: '280px',
              height: '48px',
              background: 'linear-gradient(180deg, #1D5D95 0%, #004689 100%)',
            }}
          >
            Add to Board
          </button>
        </div>
      </div>
    </>
  );
};

export default CollegeDetails;
