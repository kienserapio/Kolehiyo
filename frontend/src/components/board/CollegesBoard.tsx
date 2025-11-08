import React, { useEffect, useState } from "react";
import BoardCard from "./BoardCard";

export default function CollegesBoard() {
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/colleges');
        if (!res.ok) {
          const text = await res.text().catch(() => res.statusText || String(res.status));
          throw new Error(`Failed to fetch colleges: ${res.status} ${text}`);
        }

        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          const text = await res.text();
          throw new Error(`Expected JSON but got: ${text.slice(0,300)}`);
        }

        const json = await res.json();
        const list = json.data ?? [];
        // Map to board shape
        const boards = list.map((college: any) => ({
          id: `college-${college.id}`,
          universityName: college.name ?? college.universityName,
          address: college.address,
          logoUrl: college.logo_url ?? college.logoUrl,
          requirements: college.requirements ?? college.admissionDocuments ?? [],
          status: (college.application_status ?? college.status ?? 'open').toLowerCase() === 'open' ? 'open' : 'closed',
        }));

        setColleges(boards);
      } catch (err: any) {
        console.error('Error fetching colleges for board:', err);
        setError(err?.message ?? 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

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

      {loading && (
        <div className="py-6">Loading colleges...</div>
      )}

      {error && (
        <div className="py-6 text-red-500">{error}</div>
      )}

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
      {colleges.length === 0 && !loading && (
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