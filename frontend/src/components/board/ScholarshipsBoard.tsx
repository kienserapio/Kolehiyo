import React, { useEffect, useState } from "react";
import BoardCard from "./BoardCard";
import { supabase } from "@/supabaseClient";
import notify from '@/lib/notify';

// 1. Define the prop interface
interface ScholarshipsBoardProps {
  onCardClick?: (id: number) => void;
}

export default function ScholarshipsBoard({ onCardClick }: ScholarshipsBoardProps) {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScholarships = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setError("You must be logged in."); setLoading(false); return;
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/scholarships/tracked`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!res.ok) throw new Error("Failed");
        const json = await res.json();
        const list = json.data ?? [];

        const boards = list.map((item: any) => {
          const scholarship = item.scholarship ?? null;
          const rawChecklist = item.checklist ?? [];

          const normalizedChecklist = Array.isArray(rawChecklist)
            ? rawChecklist.map((r: any) => {
                let actualItem = typeof r.item === "object" && r.item !== null ? r.item.item : r.item ?? String(r);
                return {
                  item: actualItem,
                  checked: r.checked === true || r.checked === "true" || r.checked === 1 || r.checked === "t"
                };
              })
            : [];

          // 2. Extract the actual Numeric ID for the modal fetch
          const rawId = scholarship?.id ?? item.scholarship_id;

          return {
            rawId: rawId, // 👈 Store this for the click handler
            trackerId: item.tracker_id,
            id: `scholarship-${rawId ?? item.tracker_id}`, // String ID for React Keys/BoardCard
            universityName: scholarship?.name ?? scholarship?.scholarship_name ?? "Unknown Scholarship",
            address: scholarship?.address ?? "N/A",
            logoUrl: scholarship?.logo_url ?? null,
            requirements: normalizedChecklist ?? [],
            status: ( (scholarship?.application_status ?? item.status ?? "open").toLowerCase().replace('_', ' ') ),
          };
        });

        setScholarships(boards);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  // ... (handleRemoveCard remains the same) ...
  const handleRemoveCard = async (id: string) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError("You must be logged in to remove a scholarship.");
        return;
      }

      const userId = session.user.id;
      const scholarshipId = id.replace("scholarship-", "");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/scholarships/tracked`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ userId, scholarshipId }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => res.statusText || String(res.status));
        throw new Error(`Failed to delete scholarship: ${res.status} ${text}`);
      }

      const json = await res.json();
      notify.success("Removed scholarship:", json.data);

      // Update UI
      const updatedScholarships = scholarships.filter((s) => s.id !== id);
      setScholarships(updatedScholarships);
    } catch (err) {
      console.error("❌ Error removing scholarship:", err);
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: "#1D5D95" }}>
          My Scholarships - <span>{scholarships.length}</span>
        </h2>
      </div>

      {loading && <div className="py-6">Loading scholarships...</div>}
      {error && <div className="py-6 text-red-500">{error}</div>}
      
      <div className="flex flex-col gap-6">
        {scholarships.map((scholarship) => (
            <div key={scholarship.id} className="flex justify-start">
              <BoardCard
                type="scholarship"
                trackerId={scholarship.trackerId}
                universityName={scholarship.universityName}
                address={scholarship.address}
                logoUrl={scholarship.logoUrl}
                requirements={scholarship.requirements}
                status={scholarship.status}
                onRemove={() => handleRemoveCard(scholarship.id)}
                // 3. Pass the raw Numeric ID to the handler
                onClick={() => onCardClick && onCardClick(scholarship.rawId)} 
              />
            </div>
          ))}
      </div>
      
      {/* Empty State ... */}
    </div>
  );
}