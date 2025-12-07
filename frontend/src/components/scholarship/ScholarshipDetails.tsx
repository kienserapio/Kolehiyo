/* 
Removed the import scholarshipsData from "@/utils/scholarships.json".
Added an async fetch call to /api/scholarships/{id} to get details.
Added loading & error handling.
Made field names fallback-compatible (snake_case or camelCase) for database + JSON compatibility.
Used isOpen to prevent unnecessary fetches when the modal is closed.
 */

import React, { useEffect, useState } from "react";

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
  const [scholarship, setScholarship] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!scholarshipId || !isOpen) return;

    const fetchScholarship = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/scholarships/${scholarshipId}`);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

        const json = await res.json();
        setScholarship(json.data ?? null);
      } catch (err: any) {
        console.error("Error fetching scholarship details:", err);
        setError(err?.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchScholarship();
  }, [scholarshipId, isOpen]);

  if (!isOpen) return null;

  if (loading) // loading state, must edit later
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 text-white">
        Loading scholarship details...
      </div>
    );

  if (error) // error state, must edit later
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 text-red-500">
        {error}
      </div>
    );

  if (!scholarship) return null;

  const statusStyles = {
    open: {
      bg: "bg-[#7DD27D]", // soft green tone for "open"
      text: "text-[#178717]",
    },
    closed: {
      bg: "bg-gray-300", // neutral gray for "closed"
      text: "text-gray-600",
    },
    "coming soon": {
      bg: "bg-[#FFD966]", // soft yellow tone for "coming soon"
      text: "text-[#8A6D1F]",
    },
  };

  const normalizedStatus = (scholarship.application_status ?? "open").toLowerCase();
  const currentStatus = statusStyles[normalizedStatus as keyof typeof statusStyles] 
    ?? statusStyles.open;

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
            src={scholarship.header_image_url ?? scholarship.headerImageUrl}
            alt={`${scholarship.name ?? scholarship.scholarshipName} header`}
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
            <div className="flex gap-4 items-center flex-1">
              <img
                src={scholarship.logo_url ?? scholarship.logoUrl}
                alt={`${scholarship.name ?? scholarship.scholarshipName} logo`}
                className="w-20 h-20 object-contain flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-[18px] font-bold text-[#1E1E1E] leading-tight truncate">
                  {scholarship.name ?? scholarship.scholarshipName}
                </h2>
                <p className="text-[16px] text-[#1E1E1E] mt-1 truncate">
                  {scholarship.address}
                </p>

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <div
                    className={`${currentStatus.bg} ${currentStatus.text} font-bold inline-flex items-center justify-center rounded-[25px] text-sm px-4 py-1`}
                  >
                    {(scholarship.application_status ?? "Open")
                      .charAt(0)
                      .toUpperCase() +
                      (scholarship.application_status ?? "Open").slice(1)}
                  </div>

                  {/* Apply Now button for mobile - NOT TESTED */}
                  <a
                    href={scholarship.official_link ?? scholarship.applicationUrl}
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
              href={scholarship.official_link ?? scholarship.applicationUrl}
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
            <div>
              <p className="text-[16px]">
                <span className="font-bold">Application:</span>{" "}
                {scholarship.application_start} -{" "}
                {scholarship.application_end}
              </p>
              <p className="text-[16px] mt-1">
                <span className="font-bold">Scholarship Type:</span>{" "}
                {scholarship.scho_type}
              </p>
              <p className="text-[16px] mt-1">
                <span className="font-bold">Benefits:</span>{" "}
                {scholarship.benefits}
              </p>
            </div>

            <hr className="border-t border-gray-400" />

            {/* Requirements Section */}
            {scholarship.scho_requirements && (
              <div>
                <h3 className="text-[20px] font-bold mb-3">
                  Application Requirements
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  {scholarship.scho_requirements.map(
                    (req: any, i: number) => {
                      // ✅ SAFE GUARD: Check if it's an object (checklist style) or string (simple style)
                      const reqText = 
                        typeof req === 'object' && req !== null 
                          ? req.item // If data is { item: "GPA 2.0", checked: false }
                          : req;     // If data is "GPA 2.0"

                      return (
                        <li key={i} className="text-[16px]">
                          {reqText}
                        </li>
                      );
                    }
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Button */}
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
