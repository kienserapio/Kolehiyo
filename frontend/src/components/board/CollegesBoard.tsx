import React, { useState } from "react";
import BoardCard from "./BoardCard";
import collegesData from "@/utils/colleges.json";

export default function CollegesBoard() {
  // Map college data - use admissionDocuments as requirements
  const collegeBoards = collegesData.colleges.map((college: any) => ({
    id: `college-${college.id}`,
    universityName: college.universityName,
    address: college.address,
    logoUrl: college.logoUrl,
    requirements: college.admissionDocuments || [],
    status: college.status as 'open' | 'closed',
  }));

  const [colleges, setColleges] = useState(collegeBoards);

  const handleRemoveCard = (id: string) => {
    const updatedColleges = colleges.filter(college => college.id !== id);
    setColleges(updatedColleges);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h2
          className="text-xl sm:text-2xl md:text-3xl font-bold"
          style={{ color: "#1D5D95" }}
        >
          My Colleges - <span>{colleges.length}</span>
        </h2>
      </div>

      {/* College Cards - Single Column */}
      <div className="flex flex-col gap-6">
        {colleges.map((college) => (
          <div key={college.id} className="flex justify-start">
            <BoardCard
              universityName={college.universityName}
              address={college.address}
              logoUrl={college.logoUrl}
              requirements={college.requirements}
              status={college.status}
              onRemove={() => handleRemoveCard(college.id)}
            />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {colleges.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <p className="text-lg text-gray-500 text-center">
            No colleges added yet.
          </p>
          <p className="text-sm text-gray-400 text-center mt-2">
            Start adding colleges to track your application progress!
          </p>
        </div>
      )}
    </div>
  );
}