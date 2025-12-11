import { createClient } from "@supabase/supabase-js";
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false }, 
});

async function checkScholarship() {
  const { data, error } = await supabaseAdmin
    .from('scholarships')
    .select('*')
    .limit(1);
    
  console.log("Error:", error);
  console.log("Sample scholarship ID type:", typeof data?.[0]?.id);
  console.log("Column names:", data?.[0] ? Object.keys(data[0]) : []);
}

checkScholarship().catch(console.error);
