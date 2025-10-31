import React, { useState } from "react";
import BoardCard from "./BoardCard";
import scholarshipsData from "@/utils/scholarships.json";

export default function ScholarshipsBoard() {
  // Map scholarship data - use applicationRequirements as requirements
  const scholarshipBoards = scholarshipsData.scholarships.map((scholarship: any) => ({
    id: `scholarship-${scholarship.id}`,
    universityName: scholarship.scholarshipName,
    address: scholarship.address,
    logoUrl: scholarship.logoUrl,
    requirements: scholarship.applicationRequirements || [],
    status: scholarship.status as 'open' | 'closed',
  }));

  const [scholarships, setScholarships] = useState(scholarshipBoards);

  const handleRemoveCard = (id: string) => {
    const updatedScholarships = scholarships.filter(scholarship => scholarship.id !== id);
    setScholarships(updatedScholarships);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h2
          className="text-xl sm:text-2xl md:text-3xl font-bold"
          style={{ color: "#1D5D95" }}
        >
          My Scholarships - <span>{scholarships.length}</span>
        </h2>
      </div>

      {/* Scholarship Cards - Single Column */}
      <div className="flex flex-col gap-6">
        {scholarships.map((scholarship) => (
          <div key={scholarship.id} className="flex justify-start">
            <BoardCard
              universityName={scholarship.universityName}
              address={scholarship.address}
              logoUrl={scholarship.logoUrl}
              requirements={scholarship.requirements}
              status={scholarship.status}
              onRemove={() => handleRemoveCard(scholarship.id)}
            />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {scholarships.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <p className="text-lg text-gray-500 text-center">
            No scholarships added yet.
          </p>
          <p className="text-sm text-gray-400 text-center mt-2">
            Start adding scholarships to track your application progress!
          </p>
        </div>
      )}
    </div>
  );
}