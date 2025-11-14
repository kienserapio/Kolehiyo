import React, { useEffect, useState } from "react";
import BoardCard from "./BoardCard";
import { supabase } from "@/supabaseClient";

export default function CollegesBoard() {
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchColleges = async () => {
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

        const res = await fetch("http://localhost:5000/api/colleges/tracked", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!res.ok) {
          const text = await res.text().catch(() => res.statusText || String(res.status));
          throw new Error(`Failed to fetch tracked colleges: ${res.status} ${text}`);
        }

        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          const text = await res.text();
          throw new Error(`Expected JSON but got: ${text.slice(0,300)}`);
        }

        const json = await res.json();
        const list = json.data ?? [];

        // Map to board shape
        const boards = list.map((item: any) => {
          const college = item.college; // nested college data
          console.log("Processing college item:", item);
          const rawRequirements = college.requirements ?? item.requirements ?? item.checklist;
          console.log("Raw requirements for college", item.tracker_id, ":", rawRequirements);

          // Normalize: ensure each requirement is an object with name + checked
          const normalizedRequirements = Array.isArray(rawRequirements)
            ? rawRequirements.map((r: any) => {
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
            id: `college-${college.id ?? item.college_id ?? item.tracker_id}`,
            universityName: college.name ?? 'Unknown College',
            address: college.address ?? 'N/A',
            logoUrl: college.logo_url ?? null,
            requirements: normalizedRequirements ?? [],
            status: (college.application_status ?? item.status ?? 'open').toLowerCase() === 'open' ? 'open' : 'closed',
          };
        });

        console.log("Fetched tracked colleges:", list);

        setColleges(boards);
      } catch (err: unknown) {
        // log original error for debugging
        console.error("❌ Error in getTrackedColleges:", err);

        // Normalize message for UI/state. `err` can be Error, string, or other.
        let message = "Failed to fetch tracked colleges.";
        if (err instanceof Error) {
          message = err.message;
        } else if (typeof err === "string") {
          message = err;
        } else {
          try {
            message = JSON.stringify(err);
          } catch (e) {
            // ignore JSON stringify errors
          }
        }

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  const handleRemoveCard = async (id: string) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError("You must be logged in to remove a college.");
        return;
      }

      const userId = session.user.id;
      const collegeId = id.replace("college-", ""); // adjust if your id format differs

      const res = await fetch("http://localhost:5000/api/colleges/tracked", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ userId, collegeId }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => res.statusText || String(res.status));
        throw new Error(`Failed to delete college: ${res.status} ${text}`);
      }

      const json = await res.json();
      console.log("✅ Removed college:", json.data);

      // Update UI after successful deletion
      const updatedColleges = colleges.filter(college => college.id !== id);
      setColleges(updatedColleges);

    } catch (err) {
      console.error("❌ Error removing college:", err);
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
              type="college"
              trackerId={college.trackerId} // pass trackerId for updates
              universityName={college.universityName}
              address={college.address}
              logoUrl={college.logoUrl}
              requirements={college.requirements.map(req => ({
                item: req.item,
                checked: req.checked,
              }))}
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