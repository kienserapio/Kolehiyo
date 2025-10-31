import React, { useEffect } from "react";
import scholarshipsData from "@/utils/scholarships.json";

interface ReviewResource {
  text: string;
  url: string;
}

export interface ScholarshipDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  scholarshipId: number | null; // We'll pass only the ID from ScholarshipContainer
}

const ScholarshipDetails: React.FC<ScholarshipDetailsProps> = ({
  isOpen,
  onClose,
  scholarshipId,
}) => {
  const scholarship = scholarshipsData.scholarships.find(
    (s) => s.id === scholarshipId
  );

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!scholarship) return null;

  const statusStyles = {
    open: {
      bg: "bg-[#7DD27D]",
      text: "text-[#178717]",
    },
    closed: {
      bg: "bg-gray-300",
      text: "text-gray-600",
    },
  };

  const currentStatus = statusStyles[scholarship.status as "open" | "closed"];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-50" : "opacity-0 pointer-events-none"
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
          ${
            isOpen
              ? "opacity-100 lg:translate-x-0"
              : "opacity-0 pointer-events-none lg:translate-x-full"
          }
        `}
      >
        {/* Header Image */}
        <div className="relative w-full h-[200px] overflow-hidden lg:rounded-none rounded-t-[35px]">
          <img
            src={scholarship.headerImageUrl}
            alt={`${scholarship.scholarshipName} header`}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#012243] z-10 opacity-75" />
        </div>

        {/* Scholarship Header Card */}
        <div
          className="relative w-full -mt-16 bg-white rounded-[25px] p-6 z-20"
          style={{
            boxShadow: "0px 4px 50px rgba(0, 0, 0, 0.2)",
            height: "140px",
          }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center h-full gap-3 lg:gap-0">
            {/* Left: Logo and Info */}
            <div className="flex gap-4 items-center flex-1">
              <img
                src={scholarship.logoUrl}
                alt={`${scholarship.scholarshipName} logo`}
                className="w-20 h-20 object-contain flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-[18px] font-bold text-[#1E1E1E] leading-tight truncate">
                  {scholarship.scholarshipName}
                </h2>
                <p className="text-[16px] text-[#1E1E1E] mt-1 truncate">
                  {scholarship.address}
                </p>

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <div
                    className={`${currentStatus.bg} ${currentStatus.text} font-bold inline-flex items-center justify-center rounded-[25px] text-sm px-4 py-1`}
                  >
                    {scholarship.status.charAt(0).toUpperCase() +
                      scholarship.status.slice(1)}
                  </div>

                  {/* Apply Now button for mobile */}
                  <a
                    href={scholarship.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-white rounded-[25px] transition-opacity hover:opacity-90 flex items-center justify-center flex-shrink-0
                      text-sm lg:text-base 
                      w-[140px] h-[40px]
                      lg:hidden"
                    style={{
                      background:
                        "linear-gradient(180deg, #1D5D95 0%, #004689 100%)",
                    }}
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            </div>

            {/* Apply Now (Desktop) */}
            <a
              href={scholarship.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex font-bold text-white rounded-[25px] transition-opacity hover:opacity-90 items-center justify-center flex-shrink-0
                text-sm lg:text-base 
                w-[140px] h-[40px]"
              style={{
                background:
                  "linear-gradient(180deg, #1D5D95 0%, #004689 100%)",
              }}
            >
              Apply Now
            </a>
          </div>
        </div>

        {/* Scrollable Content */}
        <div
          className="overflow-y-auto px-6 pb-24 mt-6"
          style={{ maxHeight: "calc(90vh - 340px)", scrollbarWidth: "thin" }}
        >
          <div className="space-y-5 text-[#1E1E1E]">
            {/* Basic Info */}
            <div>
              <p className="text-[16px]">
                <span className="font-bold">Application:</span>{" "}
                {scholarship.applicationStart} - {scholarship.applicationEnd}
              </p>
              <p className="text-[16px] mt-1">
                <span className="font-bold">Scholarship Type:</span>{" "}
                {scholarship.scholarshipType}
              </p>
              <p className="text-[16px] mt-1">
                <span className="font-bold">Benefits:</span>{" "}
                {scholarship.benefits}
              </p>
            </div>

            <hr className="border-t border-gray-400" />

            {/* Requirements */}
            <div>
              <h3 className="text-[20px] font-bold mb-3">
                Application Requirements
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {scholarship.applicationRequirements.map((req, index) => (
                  <li key={index} className="text-[16px]">
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Prioritized Programs */}
            <div>
              <h3 className="text-[20px] font-bold mb-3">
                Prioritized Programs
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {scholarship.prioritizedPrograms.map((program, index) => (
                  <li key={index} className="text-[16px]">
                    {program}
                  </li>
                ))}
              </ul>
            </div>

            {/* Review Resources */}
            <div>
              <h3 className="text-[20px] font-bold mb-3">
                Review & Application Resources
              </h3>

              <div className="mb-4">
                <h4 className="text-[16px] font-bold mb-2">Guides:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {scholarship.reviewResources.guides.map(
                    (link: ReviewResource, index: number) => (
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
                    )
                  )}
                </ul>
              </div>

              <div>
                <h4 className="text-[16px] font-bold mb-2">
                  Recommendations:
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  {scholarship.reviewResources.recommendations.map(
                    (link: ReviewResource, index: number) => (
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
                    )
                  )}
                </ul>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-[20px] font-bold mb-3">
                Contact Information
              </h3>
              <p className="text-[16px]">
                <span className="font-bold">Email:</span>{" "}
                {scholarship.contact.email}
              </p>
              <p className="text-[16px] mt-2">
                <span className="font-bold">Contact Number:</span>{" "}
                {scholarship.contact.contactNumber}
              </p>
              <p className="text-[16px] mt-2">
                <span className="font-bold">Office Location:</span>{" "}
                {scholarship.contact.officeLocation}
              </p>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Button */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-white rounded-[25px] p-6 flex justify-center"
          style={{
            boxShadow: "0px -4px 50px rgba(0, 0, 0, 0.2)",
          }}
        >
          <button
            className="font-bold text-white rounded-[25px] transition-opacity hover:opacity-90"
            style={{
              width: "280px",
              height: "48px",
              background:
                "linear-gradient(180deg, #1D5D95 0%, #004689 100%)",
            }}
          >
            Add to Board
          </button>
        </div>
      </div>
    </>
  );
};

export default ScholarshipDetails;
