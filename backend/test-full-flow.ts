import { createClient } from "@supabase/supabase-js";
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false }, 
});

async function testFullFlow() {
  const testUserId = '2125c191-4d0d-4480-8359-5b3a24cc75b3';
  const collegeIdString = "2"; // This is what the frontend sends
  
  console.log("=== Simulating addCollegeToTracker ===");
  console.log("Input: userId =", testUserId, ", collegeId =", collegeIdString, "(type:", typeof collegeIdString, ")");
  
  // Get college details
  const { data: college, error: collegeError } = await supabaseAdmin
    .from('college')
    .select('*')
    .eq('id', collegeIdString)
    .single();
    
  console.log("\n1. getPublicCollegeDetails:");
  console.log("   Error:", collegeError);
  console.log("   Found:", college ? "Yes" : "No");
  
  if (!college) {
    console.log("❌ College not found!");
    return;
  }
  
  // Prepare checklist
  const requirements = college.requirements || [];
  const newChecklist = Array.isArray(requirements)
    ? requirements.map((req: any) => ({
        item: typeof req === 'string' ? req : (req.item || String(req)),
        checked: false,
      }))
    : [];
  
  console.log("\n2. Checklist prepared:");
  console.log("   Items:", newChecklist.length);
  
  // Insert into tracker
  console.log("\n3. Inserting into user_college_tracker...");
  console.log("   college_id type:", typeof Number(collegeIdString));
  console.log("   college_id value:", Number(collegeIdString));
  
  const { data: insertResult, error: insertError } = await supabaseAdmin
    .from('user_college_tracker')
    .insert({
      auth_user_id: testUserId,
      college_id: Number(collegeIdString),
      status: college.application_status || 'Open',
      checklist: newChecklist,
      progress: 0,
    })
    .select()
    .single();
  
  console.log("\n4. Insert result:");
  console.log("   Error:", insertError);
  console.log("   Success:", insertResult ? "Yes" : "No");
  console.log("   Data:", insertResult);
  
  if (insertResult) {
    console.log("\n✅ SUCCESS! Cleaning up...");
    await supabaseAdmin
      .from('user_college_tracker')
      .delete()
      .eq('tracker_id', insertResult.tracker_id);
    console.log("Test record deleted.");
  }
}

testFullFlow().catch(console.error);
