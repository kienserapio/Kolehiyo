import React, { useState } from "react";
import ScholarshipCard from "@/components/scholarship/ScholarshipCard";
import scholarshipsData from "@/utils/scholarships.json";
import ScholarshipDetails from "@/components/scholarship/ScholarshipDetails";

export default function ScholarshipContainer() {
  const [selectedScholarship, setSelectedScholarship] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleCardClick = (scholarship: any) => {
    setSelectedScholarship(scholarship);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setTimeout(() => setSelectedScholarship(null), 300);
  };

  return (
    <div className="py-28 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24">
      {/* Header */}
      <div className="max-w-[1450px] mx-auto mb-6 px-2">
        <h2
          className="text-xl sm:text-2xl md:text-3xl font-bold"
          style={{ color: "#1D5D95" }}
        >
          Top recommended scholarships for you
        </h2>
      </div>

      {/* Scholarship Cards Grid */}
      <div className="max-w-[1450px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 px-2">
        {scholarshipsData.scholarships.map((scholarship) => (
          <div
            key={scholarship.id}
            className="flex justify-center lg:justify-start"
          >
            <ScholarshipCard
              scholarshipName={scholarship.scholarshipName}
              address={scholarship.address}
              applicationStart={scholarship.applicationStart}
              applicationEnd={scholarship.applicationEnd}
              scholarshipType={scholarship.scholarshipType}
              benefits={scholarship.benefits}
              logoUrl={scholarship.logoUrl}
              status={scholarship.status}
              onClick={() => handleCardClick(scholarship)}
            />
          </div>
        ))}
      </div>

      {/* Scholarship Details Modal (optional) */}
      {isDetailsOpen && selectedScholarship && (
        <ScholarshipDetails
          isOpen={isDetailsOpen}
          onClose={handleCloseDetails}
          scholarshipId={selectedScholarship?.id}
        />
      )}
    </div>
  );
}
