import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient'; // Adjust path if needed
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    collegeCount: 0,
    scholarshipCount: 0,
    readinessPercent: 0,
    totalDocsDone: 0,
    totalDocsNeeded: 0
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Fetch College Tracker Data
      // We look at 'user_college_tracker' and use 'auth_user_id'
      const { data: colleges, error: collegeError } = await supabase
        .from('user_college_tracker') 
        .select('checklist') 
        .eq('auth_user_id', user.id); // Corrected column name

      // 2. Fetch Scholarship Tracker Data
      // We look at 'user_scholarship_tracker' and use 'auth_user_id'
      const { data: scholarships, error: scholarshipError } = await supabase
        .from('user_scholarship_tracker')
        .select('checklist')
        .eq('auth_user_id', user.id); // Corrected column name

      if (collegeError) console.error("College Fetch Error:", collegeError);
      if (scholarshipError) console.error("Scholarship Fetch Error:", scholarshipError);

      // 3. Calculate Counts (Metric B)
      const collegeCount = colleges?.length || 0;
      const scholarshipCount = scholarships?.length || 0;

      // 4. Calculate Readiness (Metric C)
      let totalDocsNeeded = 0;
      let totalDocsDone = 0;

      // Helper function to count items inside the JSON 'checklist'
      const countChecklistItems = (trackerData: any[]) => {
        trackerData?.forEach((row) => {
          // The column is named 'checklist' (jsonb)
          const list = row.checklist; 

          if (Array.isArray(list)) {
            totalDocsNeeded += list.length;
            
            // Count items that are marked as done. 
            // We check for commonly used boolean flags like 'checked', 'is_complete', or 'done'
            const completedItems = list.filter((item: any) => 
              item.checked === true || item.is_complete === true || item.done === true
            );
            totalDocsDone += completedItems.length;
          }
        });
      };

      countChecklistItems(colleges || []);
      countChecklistItems(scholarships || []);

      const readinessPercent = totalDocsNeeded === 0 
        ? 0 
        : Math.round((totalDocsDone / totalDocsNeeded) * 100);

      setMetrics({
        collegeCount,
        scholarshipCount,
        readinessPercent,
        totalDocsDone,
        totalDocsNeeded
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4 text-center text-gray-400">Loading Analytics...</div>;

  // Data for the Bar Chart
  const chartData = [
    { name: 'Colleges', count: metrics.collegeCount },
    { name: 'Scholarships', count: metrics.scholarshipCount },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      
      {/* Metric B: Financial Safety Net (Bar Chart) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Financial Safety Net</h3>
        <p className="text-xs text-gray-500 mb-4">Application distribution (Colleges vs. Scholarships)</p>
        
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{fontSize: 12}} />
              <YAxis allowDecimals={false} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                 <Cell fill="#3B82F6" /> {/* Blue for Colleges */}
                 <Cell fill="#10B981" /> {/* Green for Scholarships */}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Only show warning if you have colleges but very few scholarships */}
        {metrics.collegeCount > 0 && metrics.scholarshipCount < metrics.collegeCount / 2 && (
          <div className="mt-2 p-2 bg-yellow-50 text-yellow-700 text-xs rounded border border-yellow-100">
            ⚠️ <strong>Insight:</strong> High acceptance potential, low funding. Apply for more scholarships!
          </div>
        )}
      </div>

      {/* Metric C: Readiness Gauge (Progress Bar) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
        <div className="flex justify-between items-end mb-2">
          <h3 className="text-lg font-bold text-gray-800">Application Readiness</h3>
          <span className="text-3xl font-bold text-blue-600">{metrics.readinessPercent}%</span>
        </div>
        
        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden mb-4">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ease-out ${
              metrics.readinessPercent < 50 ? 'bg-red-500' : 
              metrics.readinessPercent < 80 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${metrics.readinessPercent}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-sm text-gray-600 border-t pt-4 mt-2">
          <div className="text-center">
            <p className="text-xs text-gray-400">DOCS SUBMITTED</p>
            <p className="font-bold text-lg">{metrics.totalDocsDone}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">TOTAL REQUIRED</p>
            <p className="font-bold text-lg">{metrics.totalDocsNeeded}</p>
          </div>
        </div>

        <p className="mt-4 text-xs text-center text-gray-400 italic">
          {metrics.readinessPercent < 50 
            ? "Focus on submitting requirements before finding new schools." 
            : "Great job! You are compliant with most requirements."}
        </p>
      </div>

    </div>
  );
}