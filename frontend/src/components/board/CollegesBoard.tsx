import React, { useEffect, useState } from "react";
import BoardCard from "./BoardCard";
import { supabase } from "@/supabaseClient";
import notify from '@/lib/notify';

// 1. Accept the onCardClick prop
interface CollegesBoardProps {
  onCardClick?: (collegeData: any) => void;
}

export default function CollegesBoard({ onCardClick }: CollegesBoardProps) {
  const [colleges, setColleges] = useState<any[]>([]);
  // ... keeping original state ...
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ... (Your fetchColleges useEffect remains exactly the same, no changes needed there) ...
  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
           setError("You must be logged in."); setLoading(false); return;
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/colleges/tracked`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!res.ok) throw new Error("Failed");
        const json = await res.json();
        const list = json.data ?? [];

        // Map to board shape (This part you already had is fine for the CARD)
        const boards = list.map((item: any) => {
          const college = item.college;
          const rawRequirements = college.requirements ?? item.requirements ?? item.checklist;

          const normalizedRequirements = Array.isArray(rawRequirements)
            ? rawRequirements.map((r: any) => {
                let actualItem = typeof r.item === "object" && r.item !== null ? r.item.item : r.item ?? String(r);
                return {
                  item: actualItem,
                  checked: r.checked === true || r.checked === "true" || r.checked === 1 || r.checked === "t"
                };
              })
            : [];

          return {
            // We store the FULL raw item here so we can format it on click
            rawCollegeData: college, 
            trackerId: item.tracker_id,
            id: `college-${college.id ?? item.college_id}`,
            universityName: college.name,
            address: college.address,
            logoUrl: college.logo_url,
            requirements: normalizedRequirements,
            status: (college.application_status ?? 'open').toLowerCase().replace('_', ' '),
          };
        });

        setColleges(boards);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchColleges();
  }, []);

  const handleRemoveCard = async (id: string) => {
    // ... (Your existing remove logic) ...
    // Just copying what you had for brevity in this answer
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if(!session) return;
        const collegeId = id.replace("college-", "");
        await fetch(`${import.meta.env.VITE_API_URL}/api/colleges/tracked`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
            body: JSON.stringify({ userId: session.user.id, collegeId }),
        });
        setColleges(prev => prev.filter(c => c.id !== id));
    } catch(e) { console.error(e); }
  };

  // 2. Format Data for the Modal
  const handleItemClick = (boardItem: any) => {
    if (!onCardClick) return;

    const c = boardItem.rawCollegeData; // The raw data we saved earlier

    // Map snake_case (DB) -> camelCase (Component)
    const formattedCollege = {
      universityName: c.name,
      address: c.address,
      applicationStart: c.application_start,
      applicationEnd: c.application_end,
      universityType: c.university_type,
      tuitionFee: c.tuition_fee,
      logoUrl: c.logo_url,
      headerImageUrl: c.header_image_url ?? '/default-header.jpg',
      admissionsUrl: c.admissions_url ?? '#',
      status: (c.application_status ?? 'open').toLowerCase(),
      entranceExam: {
        examName: c.exam_name ?? '',
        examDateStart: c.exam_date_start ?? '',
        examDateEnd: c.exam_date_end ?? '',
        examCoverage: c.exam_coverage ?? '',
      },
      admissionDocuments: c.admission_documents ?? [],
      topPrograms: c.top_programs ?? [],
      reviewResources: {
        mockExamLinks: c.mock_exam_links ?? [],
        reviewRecommendations: c.review_recommendations ?? [],
      },
      contact: {
        email: c.email ?? '',
        contactNumber: c.contact_number ?? '',
        campusLocation: c.campus_location ?? '',
      },
    };

    onCardClick(formattedCollege);
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: "#1D5D95" }}>
          My Colleges - <span>{colleges.length}</span>
        </h2>
      </div>

      {loading && <div className="py-6">Loading...</div>}
      {error && <div className="py-6 text-red-500">{error}</div>}

      <div className="flex flex-col gap-6">
        {colleges.map((college) => (
          <div key={college.id} className="flex justify-start">
            <BoardCard
              type="college"
              trackerId={college.trackerId}
              universityName={college.universityName}
              address={college.address}
              logoUrl={college.logoUrl}
              requirements={college.requirements}
              status={college.status}
              onRemove={() => handleRemoveCard(college.id)}
              onClick={() => handleItemClick(college)} // 👈 Trigger the modal opener
            />
          </div>
        ))}
      </div>
      
      {/* Empty State ... */}
    </div>
  );
}