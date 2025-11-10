import React, { useEffect, useState } from "react";
import ScholarshipCard from "@/components/scholarship/ScholarshipCard";
import ScholarshipDetails from "@/components/scholarship/ScholarshipDetails";
// import { getPublicScholarshipList } from "@/services/scholarshipServices"; // for future use if you want direct Supabase call

export default function ScholarshipContainer() {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [selectedScholarship, setSelectedScholarship] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        // Option A: through your API route (keep this if API handles caching/auth)
        const res = await fetch("/api/scholarships");
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const json = await res.json();
        setScholarships(json.data ?? []);

        // Option B (if you want direct Supabase call later):
        // const data = await getPublicScholarshipList();
        // setScholarships(data);
      } catch (err: any) {
        console.error("Error fetching scholarships:", err);
        setError(err?.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

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

      {loading && <div className="text-center py-8">Loading scholarships...</div>}
      {error && <div className="text-center py-8 text-red-500">{error}</div>}

      <div className="max-w-[1450px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 px-2">
        {scholarships.map((s) => (
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
