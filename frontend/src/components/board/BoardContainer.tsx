import React, { useState } from "react";
import CollegesBoard from "./CollegesBoard";
import ScholarshipsBoard from "./ScholarshipsBoard";
import CollegeDetails from "../college/CollegeDetails";
import ScholarshipDetails from "../scholarship/ScholarshipDetails"; // 👈 Import this

export default function BoardContainer() {
  // --- College Modal State ---
  const [selectedCollege, setSelectedCollege] = useState<any>(null);
  const [isCollegeOpen, setIsCollegeOpen] = useState(false);

  // --- Scholarship Modal State ---
  const [selectedScholarshipId, setSelectedScholarshipId] = useState<number | null>(null);
  const [isScholarshipOpen, setIsScholarshipOpen] = useState(false);

  // College Handlers
  const handleOpenCollege = (collegeData: any) => {
    setSelectedCollege(collegeData);
    setIsCollegeOpen(true);
  };
  const handleCloseCollege = () => {
    setIsCollegeOpen(false);
    setTimeout(() => setSelectedCollege(null), 300);
  };

  // Scholarship Handlers
  const handleOpenScholarship = (id: number) => {
    setSelectedScholarshipId(id);
    setIsScholarshipOpen(true);
  };
  const handleCloseScholarship = () => {
    setIsScholarshipOpen(false);
    setTimeout(() => setSelectedScholarshipId(null), 300);
  };

  return (
    <div className="pt-0 pb-20 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24">
      {/* Main Container with Two Columns */}
      <div className="max-w-[1450px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 px-2">
        {/* Left Column - Colleges */}
        <div className="w-full">
          <CollegesBoard onCardClick={handleOpenCollege} />
        </div>

        {/* Right Column - Scholarships */}
        <div className="w-full pt-16 lg:pt-0">
          {/* Pass the ID handler */}
          <ScholarshipsBoard onCardClick={handleOpenScholarship} />
        </div>
      </div>

      {/* College Modal */}
      <CollegeDetails
        isOpen={isCollegeOpen}
        onClose={handleCloseCollege}
        college={selectedCollege}
      />

      {/* Scholarship Modal */}
      <ScholarshipDetails
        isOpen={isScholarshipOpen}
        onClose={handleCloseScholarship}
        scholarshipId={selectedScholarshipId}
      />
    </div>
  );
}