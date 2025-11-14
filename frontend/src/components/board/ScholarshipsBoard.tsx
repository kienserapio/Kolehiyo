import React, { useEffect, useState } from "react";
import BoardCard from "./BoardCard";
import { supabase } from "@/supabaseClient";

export default function ScholarshipsBoard() {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScholarships = async () => {
      setLoading(true);
      setError(null);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setError("You must be logged in to view your board.");
          setLoading(false);
          return;
        }

        // ✅ Fetch tracked scholarships from your backend
        const res = await fetch("http://localhost:5000/api/scholarships/tracked", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!res.ok) {
          const text = await res.text().catch(() => res.statusText || String(res.status));
          throw new Error(`Failed to fetch tracked scholarships: ${res.status} ${text}`);
        }

        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          const text = await res.text();
          throw new Error(`Expected JSON but got: ${text.slice(0, 300)}`);
        }

        const json = await res.json();
        const list = json.data ?? [];

        // ✅ Map tracked scholarships to board cards
        const boards = list.map((item: any) => {
          const scholarship = item.scholarship ?? null; // nested scholarship data may be null
          console.log("Processing scholarship item:", item);
          // use optional chaining to avoid accessing properties on null
          const rawChecklist = scholarship?.checklist ?? item.checklist ?? [];

          // Normalize checklist items
          const normalizedChecklist = Array.isArray(rawChecklist)
            ? rawChecklist.map((r: any) => {
                if (typeof r === "string") return { item: r, checked: false };

                const checkedValue =
                  r.checked === true ||
                  r.checked === "true" ||
                  r.checked === 1 ||
                  r.checked === "t";

                return {
                  item: r.item ?? String(r),
                  checked: checkedValue,
                };
              })
            : [];

          return {
            trackerId: item.tracker_id,
            id: `scholarship-${scholarship?.id ?? item.scholarship_id ?? item.tracker_id}`,
            universityName: scholarship?.name ?? scholarship?.scholarship_name ?? "Unknown Scholarship",
            address: scholarship?.address ?? "N/A",
            logoUrl: scholarship?.logo_url ?? null,
            requirements: normalizedChecklist ?? [],
            status: ( (scholarship?.status ?? item.status ?? "open").toLowerCase() === "open" ) ? "open" : "closed",
          };
        });

        console.log("Fetched tracked scholarships:", list);

        setScholarships(boards);
      } catch (err: unknown) {
        console.error("❌ Error in getTrackedScholarships:", err);
        let message = "Failed to fetch tracked scholarships.";
        if (err instanceof Error) {
          message = err.message;
        } else if (typeof err === "string") {
          message = err;
        } else {
          try {
            message = JSON.stringify(err);
          } catch (e) {}
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

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

      const res = await fetch("http://localhost:5000/api/scholarships/tracked", {
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
      console.log("✅ Removed scholarship:", json.data);

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
      {/* Header */}
      <div className="mb-6">
        <h2
          className="text-xl sm:text-2xl md:text-3xl font-bold"
          style={{ color: "#1D5D95" }}
        >
          My Scholarships - <span>{scholarships.length}</span>
        </h2>
      </div>

      {loading && <div className="py-6">Loading scholarships...</div>}

      {error && <div className="py-6 text-red-500">{error}</div>}

      {/* Scholarship Cards */}
      <div className="flex flex-col gap-6">
        {scholarships.map((scholarship) => (
          <div key={scholarship.id} className="flex justify-start">
            <BoardCard
              type="scholarship"
              trackerId={scholarship.trackerId}
              universityName={scholarship.universityName}
              address={scholarship.address}
              logoUrl={scholarship.logoUrl}
              requirements={scholarship.requirements.map((req) => ({
                item: req.item,
                checked: req.checked,
              }))}
              status={scholarship.status}
              onRemove={() => handleRemoveCard(scholarship.id)}
            />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {scholarships.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <p className="text-lg text-gray-500 text-center">
            No scholarships added yet.
          </p>
          <p className="text-sm text-gray-400 text-center mt-2">
            Start adding scholarships to track your application progress!
          </p>
        </div>
      )}
    </div>
  );
}
