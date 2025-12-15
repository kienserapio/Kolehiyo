import React, { useEffect, useState } from "react";
import ScholarshipCard from "@/components/scholarship/ScholarshipCard";
import ScholarshipDetails from "@/components/scholarship/ScholarshipDetails";
import { useSearchParams } from "react-router-dom"; // for search functionality

export default function ScholarshipContainer() {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [selectedScholarship, setSelectedScholarship] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const filterType = searchParams.get("type")?.toLowerCase() || "";
  const filterLocation = searchParams.get("location")?.toLowerCase() || "";

  const handleCardClick = (scholarship: any) => {
    setSelectedScholarship(scholarship);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setTimeout(() => setSelectedScholarship(null), 300);
  };

  useEffect(() => {
    const fetchScholarships = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/scholarships`);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const json = await res.json();
        setScholarships(json.data ?? []);

      } catch (err: any) {
        console.error("Error fetching scholarships:", err);
        setError(err?.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  const filteredScholarships = scholarships.filter((s) => {
    const matchesType = 
      filterType === "" ||
      s.scho_type.toLowerCase().includes(filterType);

    const matchesLocation = 
      filterLocation === "" ||
      s.address.toLowerCase().includes(filterLocation);

    return matchesType && matchesLocation;
  });

  return (
    <div className="py-28 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24">
      {/* Header */}
          <div className="max-w-[1450px] mx-auto mb-6 px-2 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: '#1D5D95' }}>
              Top recommended scholarships for you
            </h2>
            <p className="text-sm sm:text-base text-gray-500">
              Last updated as of December 4, 2025
            </p>
          </div>

      {/* {loading && <div className="text-center py-8">Loading scholarships...</div>} */}
      {error && <div className="text-center py-8 text-red-500">{error}</div>}

      <div className="max-w-[1450px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 px-2">
        {filteredScholarships.map((s) => (
          <div key={s.id} className="flex justify-center lg:justify-start">
            <ScholarshipCard
              id={s.id}
              name={s.name}
              address={s.address}
              application_start={s.application_start}
              application_end={s.application_end}
              scho_type={s.scho_type}
              benefits={s.benefits}
              logo_url={s.logo_url}
              application_status={s.application_status?.toLowerCase() ?? "open"}
              onClick={() => handleCardClick(s)}
            />
          </div>
        ))}
      </div>

      {isDetailsOpen && selectedScholarship && (
        <ScholarshipDetails
          isOpen={isDetailsOpen}
          onClose={handleCloseDetails}
          scholarshipId={selectedScholarship.id}
        />
      )}
    </div>
  );
}
