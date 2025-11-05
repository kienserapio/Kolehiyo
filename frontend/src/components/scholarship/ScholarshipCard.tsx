import React from "react";
import scholarshipsData from "@/utils/scholarships.json"; // adjust path if needed

export interface ScholarshipCardProps {
  scholarshipName: string;
  address: string;
  applicationStart: string;
  applicationEnd: string;
  scholarshipType: string; // government, private, international
  benefits: string; // e.g., PHP 80,000 / year
  logoUrl: string; // e.g., "/scholarship_logos/scholarship1.png"
  status: string;
  onClick?: () => void;
}

const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  scholarshipName,
  address,
  applicationStart,
  applicationEnd,
  scholarshipType,
  benefits,
  logoUrl,
  status,
  onClick,
}) => {
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

  const currentStatus = statusStyles[status];

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-[25px] sm:rounded-[35px] p-5 sm:p-6 md:p-8 flex flex-col justify-between text-[#1E1E1E] min-h-[250px] w-full max-w-[700px] cursor-pointer transition-transform hover:scale-[1.02]"
      style={{
        boxShadow: "0px 4px 50px rgba(0, 0, 0, 0.2)",
      }}
    >
      {/* Top Section */}
      <div className="flex justify-between items-start gap-4 sm:gap-6 mb-5">
        {/* Left Section */}
        <div className="flex-1 flex flex-col" style={{ gap: "14px" }}>
          {/* Header */}
          <div>
            <h2 className="text-[14px] sm:text-[15px] md:text-[16px] font-bold leading-tight">
              {scholarshipName}
            </h2>
            <p className="text-[13px] sm:text-[14px] md:text-[16px] leading-tight mt-1">
              {address}
            </p>
          </div>

          {/* Details */}
          <div
            className="text-[13px] sm:text-[14px] md:text-[16px]"
            style={{ display: "flex", flexDirection: "column", gap: "2px" }}
          >
            <p>
              <span className="font-bold">Application:</span> {applicationStart} -{" "}
              {applicationEnd}
            </p>
            <p>
              <span className="font-bold">Scholarship Type:</span> {scholarshipType}
            </p>
            <p>
              <span className="font-bold">Benefits:</span> {benefits}
            </p>
          </div>
        </div>

        {/* Right: Logo */}
        <div className="flex-shrink-0">
          <img
            src={logoUrl}
            alt={`${scholarshipName} logo`}
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
            width: "140px",
            height: "35px",
            minWidth: "140px",
          }}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>

        {/* Add to Board Button */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="
            font-bold text-white rounded-[25px] transition-opacity hover:opacity-90
            text-sm sm:text-base flex-1 sm:flex-initial px-2 py-2
            w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px]
            h-[80px] sm:h-[70px] md:h-[50px]
          "
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

// 🧱 Example usage (renders all scholarships from the JSON)
export const ScholarshipList: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 items-center w-full">
      {scholarshipsData.scholarships.map((item) => (
        <ScholarshipCard
          key={item.id}
          scholarshipName={item.scholarshipName}
          address={item.address}
          applicationStart={item.applicationStart}
          applicationEnd={item.applicationEnd}
          scholarshipType={item.scholarshipType}
          benefits={item.benefits}
          logoUrl={item.logoUrl}
          status={item.status}
        />
      ))}
    </div>
  );
};

export default ScholarshipCard;
