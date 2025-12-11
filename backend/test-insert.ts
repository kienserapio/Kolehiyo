import { createClient } from "@supabase/supabase-js";
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false }, 
});

async function testInsert() {
  console.log("Testing insert into user_college_tracker...");
  
  // First, let's check the table structure
  const { data: tableData, error: tableError } = await supabaseAdmin
    .from('user_college_tracker')
    .select('*')
    .limit(1);
  
  console.log("Sample row:", tableData);
  console.log("Table error:", tableError);
  
  // Try to get a real user
  const { data: users, error: userError } = await supabaseAdmin
    .from('users')
    .select('auth_user_id')
    .limit(1);
    
  console.log("Sample user:", users);
  
  // Try to get a real college
  const { data: colleges, error: collegeError } = await supabaseAdmin
    .from('colleges')
    .select('college_id, requirements')
    .limit(1);
    
  console.log("Sample college:", colleges);
  
  if (users && users[0] && colleges && colleges[0]) {
    const testUserId = users[0].auth_user_id;
    const testCollegeId = colleges[0].college_id;
    const requirements = colleges[0].requirements;
    
    console.log("\nAttempting insert with:");
    console.log("  User ID:", testUserId);
    console.log("  College ID:", testCollegeId);
    console.log("  Requirements:", requirements);
    
    const newChecklist = Array.isArray(requirements) 
      ? requirements.map((req: any) => ({
          item: typeof req === 'string' ? req : String(req),
          checked: false,
        }))
      : [];
    
    console.log("  Checklist:", JSON.stringify(newChecklist, null, 2));
    
    const { data, error } = await supabaseAdmin
      .from('user_college_tracker')
      .insert({
        auth_user_id: testUserId,
        college_id: testCollegeId,
        status: 'Open',
        checklist: newChecklist,
        progress: 0,
      })
      .select()
      .single();
    
    if (error) {
      console.error("\n❌ Insert failed:");
      console.error("Error:", error);
    } else {
      console.log("\n✅ Insert succeeded:");
      console.log("Data:", data);
      
      // Clean up - delete the test record
      await supabaseAdmin
        .from('user_college_tracker')
        .delete()
        .eq('tracker_id', data.tracker_id);
      console.log("Test record cleaned up");
    }
  }
}

testInsert().catch(console.error);
