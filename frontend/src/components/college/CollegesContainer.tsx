import React, { useEffect, useState } from 'react';
import CollegeCard from './CollegeCard';
import CollegeDetails from './CollegeDetails';

// Fetch college data from the backend API instead of using the local JSON

export default function CollegesContainer() {
  const [colleges, setColleges] = useState<any[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCardClick = (college: any) => {
    const formattedCollege = {
      universityName: college.name,
      address: college.address,
      applicationStart: college.application_start,
      applicationEnd: college.application_end,
      universityType: college.university_type,
      tuitionFee: college.tuition_fee,
      logoUrl: college.logo_url,
      headerImageUrl: college.header_image_url ?? '/default-header.jpg',
      admissionsUrl: college.admissions_url ?? '#',
      status: (college.application_status ?? 'open').toLowerCase(),
      entranceExam: {
        examName: college.exam_name ?? '',
        examDateStart: college.exam_date_start ?? '',
        examDateEnd: college.exam_date_end ?? '',
        examCoverage: college.exam_coverage ?? '',
      },
      admissionDocuments: college.admission_documents ?? [],
      topPrograms: college.top_programs ?? [],
      reviewResources: {
        mockExamLinks: college.mock_exam_links ?? [],
        reviewRecommendations: college.review_recommendations ?? [],
      },
      contact: {
        email: college.email ?? '',
        contactNumber: college.contact_number ?? '',
        campusLocation: college.campus_location ?? '',
      },
    };

    setSelectedCollege(formattedCollege);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setTimeout(() => setSelectedCollege(null), 300); // Wait for animation
  };

  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
      setError(null);
      try {
        // Adjust base URL if your backend is on another host/port (e.g. http://localhost:5000)
        const res = await fetch('/api/colleges');
        if (!res.ok) {
          const text = await res.text().catch(() => res.statusText || String(res.status));
          throw new Error(`Failed to fetch colleges: ${res.status} ${text}`);
        }

        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          const text = await res.text();
          throw new Error(`Expected JSON but got: ${text.slice(0, 300)}`);
        }

        const json = await res.json();
        // backend responds { data: [...] }
        setColleges(json.data ?? []);
      } catch (err: any) {
        console.error('Error fetching colleges:', err);
        setError(err?.message ?? 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  return (
    <div className="py-28 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24">
      {/* Header positioned above the grid */}
      <div className="max-w-[1450px] mx-auto mb-6 px-2">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: '#1D5D95' }}>
          Top recommended universities for you
        </h2>
      </div>

      {loading && (
        <div className="max-w-[1450px] mx-auto px-2 text-center py-8">Loading colleges...</div>
      )}

      {error && (
        <div className="max-w-[1450px] mx-auto px-2 text-center py-8 text-red-500">{error}</div>
      )}

      {/* College Cards Grid */}
      <div className="max-w-[1450px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 px-2">
        {colleges.map((college: any) => (
          <div key={college.id} className="flex justify-center lg:justify-start">
            <CollegeCard
              collegeId={college.id}
              universityName={college.name}
              address={college.address}
              applicationStart={college.application_start}
              applicationEnd={college.application_end}
              universityType={college.university_type}
              tuitionFee={college.tuition_fee}
              logoUrl={college.logo_url}
              status={(college.application_status ?? 'open').toLowerCase() === 'open' ? 'open' : 'closed'}
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