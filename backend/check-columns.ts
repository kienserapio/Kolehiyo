import { createClient } from "@supabase/supabase-js";
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false }, 
});

async function checkColumns() {
  console.log("=== Checking college table ===");
  const { data: colleges, error } = await supabaseAdmin
    .from('college')
    .select('*')
    .limit(1);
    
  console.log("Error:", error);
  console.log("Sample college:", colleges?.[0]);
  console.log("\nColumn names:");
  if (colleges?.[0]) {
    console.log(Object.keys(colleges[0]));
  }
  
  console.log("\n=== Checking user_college_tracker table ===");
  const { data: trackers, error: tError } = await supabaseAdmin
    .from('user_college_tracker')
    .select('*')
    .limit(1);
    
  console.log("Error:", tError);
  console.log("Columns (if any data):", trackers?.[0] ? Object.keys(trackers[0]) : "No data yet");
  
  // Check schema info
  console.log("\n=== Trying to insert test data ===");
  const testUserId = '2125c191-4d0d-4480-8359-5b3a24cc75b3';
  
  // Get a real college ID
  if (colleges?.[0]) {
    const testCollegeId = colleges[0].id;
    console.log("Using college ID:", testCollegeId, "Type:", typeof testCollegeId);
    
    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('user_college_tracker')
      .insert({
        auth_user_id: testUserId,
        college_id: testCollegeId,
        status: 'Open',
        checklist: [],
        progress: 0,
      })
      .select()
      .single();
    
    console.log("\nInsert result:");
    console.log("Error:", insertError);
    console.log("Data:", insertData);
    
    if (insertData) {
      // Clean up
      await supabaseAdmin
        .from('user_college_tracker')
        .delete()
        .eq('tracker_id', insertData.tracker_id);
      console.log("Cleaned up test data");
    }
  }
}

checkColumns().catch(console.error);
