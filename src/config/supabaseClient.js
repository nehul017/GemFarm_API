require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Run a basic test query
(async () => {
  try {
    const { error } = await supabase.from("farms").select("*").limit(1);
    if (error) {
      console.error("❌ Supabase connection failed:", error.message);
    } else {
      console.log("✅ Supabase connected successfully!");
    }
  } catch (err) {
    console.error("❌ Supabase error:", err.message);
  }
})();

module.exports = supabase;
