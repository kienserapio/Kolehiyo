import { createClient } from "@supabase/supabase-js";
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false }, 
});

async function testQuery() {
  console.log("=== Testing query with STRING id ===");
  const collegeIdString = "2";
  
  const { data: data1, error: error1 } = await supabaseAdmin
    .from('college')
    .select('*')
    .eq('id', collegeIdString)
    .single();
    
  console.log("Query with string '2':");
  console.log("  Error:", error1);
  console.log("  Data:", data1 ? "Found" : "Not found");
  
  console.log("\n=== Testing query with NUMBER id ===");
  const collegeIdNumber = 2;
  
  const { data: data2, error: error2 } = await supabaseAdmin
    .from('college')
    .select('*')
    .eq('id', collegeIdNumber)
    .single();
    
  console.log("Query with number 2:");
  console.log("  Error:", error2);
  console.log("  Data:", data2 ? "Found" : "Not found");
}

testQuery().catch(console.error);
