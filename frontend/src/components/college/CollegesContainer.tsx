import React, { useState } from 'react';
import CollegeCard from './CollegeCard';
import CollegeDetails from './CollegeDetails';
import collegesData from '@/utils/colleges.json';

export default function CollegesContainer() {
  const [selectedCollege, setSelectedCollege] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleCardClick = (college: any) => {
    setSelectedCollege(college);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setTimeout(() => setSelectedCollege(null), 300); // Wait for animation
  };

  return (
    <div className="py-28 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24">
      {/* Header positioned above the grid */}
      <div className="max-w-[1450px] mx-auto mb-6 px-2">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: '#1D5D95' }}>
          Top recommended universities for you
        </h2>
      </div>
    
      {/* College Cards Grid */}
      <div className="max-w-[1450px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 px-2">
        {collegesData.colleges.map((college) => (
          <div key={college.id} className="flex justify-center lg:justify-start">
            <CollegeCard
              universityName={college.universityName}
              address={college.address}
              applicationStart={college.applicationStart}
              applicationEnd={college.applicationEnd}
              universityType={college.universityType}
              tuitionFee={college.tuitionFee}
              logoUrl={college.logoUrl}
              status={college.status as 'open' | 'closed'}
              onClick={() => handleCardClick(college)}
            />
          </div>
        ))}
      </div>

      {/* College Details Modal */}
      <CollegeDetails
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        college={selectedCollege}
      />
    </div>
  );
}