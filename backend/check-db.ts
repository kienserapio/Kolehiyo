import { createClient } from "@supabase/supabase-js";
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false }, 
});

async function checkDB() {
  // Check colleges table
  console.log("=== Checking colleges table ===");
  const { data: colleges, error: collegeError } = await supabaseAdmin
    .from('colleges')
    .select('*')
    .limit(3);
    
  console.log("Colleges error:", collegeError);
  console.log("Colleges count:", colleges?.length);
  console.log("First college:", colleges?.[0]);
  
  // Check scholarships table
  console.log("\n=== Checking scholarships table ===");
  const { data: scholarships, error: schError } = await supabaseAdmin
    .from('scholarships')
    .select('*')
    .limit(3);
    
  console.log("Scholarships error:", schError);
  console.log("Scholarships count:", scholarships?.length);
  console.log("First scholarship:", scholarships?.[0]);
  
  // Check user_college_tracker table structure
  console.log("\n=== Checking user_college_tracker table ===");
  const { data: trackers, error: trackerError } = await supabaseAdmin
    .from('user_college_tracker')
    .select('*')
    .limit(1);
    
  console.log("Tracker error:", trackerError);
  console.log("Tracker data:", trackers);
}

checkDB().catch(console.error);
