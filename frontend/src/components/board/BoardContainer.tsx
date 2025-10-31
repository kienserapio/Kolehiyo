import React from "react";
import CollegesBoard from "./CollegesBoard";
import ScholarshipsBoard from "./ScholarshipsBoard";

export default function BoardContainer() {
  return (
    <div className="pt-0 pb-20 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24">
      {/* Main Container with Two Columns */}
      <div className="max-w-[1450px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 px-2">
        {/* Left Column - Colleges */}
        <div className="w-full">
          <CollegesBoard />
        </div>

        {/* Right Column - Scholarships */}
        <div className="w-full pt-16 lg:pt-0">
          <ScholarshipsBoard />
        </div>
      </div>
    </div>
  );
}