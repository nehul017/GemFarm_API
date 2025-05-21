const supabase = require("../config/supabaseClient");
const { managerRegister } = require("../templates/emailTemplate");
const { sendEmail } = require("../utils/email-sending");

const createManager = async ({ email, password, name, farmIds }) => {
  // 1. Create user in Supabase Auth
  const { data: userData, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { role: "Manager", name },
      email_confirm: true,
    });

  console.log("authError", authError);
  if (authError) throw new Error(authError.message);

  const managerId = userData.user.id;

  // 2. Insert into profiles or managers table
  const { error: profileError } = await supabase.from("profiles").insert([
    {
      id: managerId,
      full_name: name,
      role: "Manager",
    },
  ]);

  console.log("profileError", profileError);
  if (profileError) throw new Error(profileError.message);

  const insertFarms = farmIds.map((farmId) => ({
    userId: managerId,
    farmId: farmId,
  }));

  console.log("insertFarms", insertFarms);
  const { error: farmError } = await supabase
    .from("user_farms")
    .insert(insertFarms);
  console.log("farmError", farmError);
  if (farmError) throw new Error(farmError.message);

  //Send Email
  await sendEmail(
    email,
    "Welcome to the Farm Management System",
    managerRegister(name, email, password)
  );

  return { id: managerId, email, name };
};

const getManagers = async () => {
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select(
      `
    id,
    full_name,
    profileImage,
    user_farms:user_farms (
      id,
      farmId
    )
  `
    )
    .eq("role", "Manager");
  if (error) throw new Error(error.message);

  const { data: users } = await supabase.auth.admin.listUsers(); // Requires service role or admin rights
  console.log("users", users);

  const enriched = profiles.map((p) => ({
    ...p,
    email: users.users.find((u) => u.id === p.id)?.email || "No email",
  }));

  return enriched;
};

const updateManager = async (id, updates) => {
  const { data, error } = await supabase
    .from("profiles")
    .update({ full_name: updates.name, email: updates.email })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return data;
};

const deleteManager = async (id) => {
  // Step 1: Delete all user_farms for that user
  const { error: farmError } = await supabase
    .from("user_farms")
    .delete()
    .eq("userId", id);

  if (farmError)
    throw new Error(`Failed to delete user_farms: ${farmError.message}`);

  // Step 2: Delete user profile
  const { error: profileError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", id);

  if (profileError)
    throw new Error(`Failed to delete profile: ${profileError.message}`);

  // Step 3: Delete from Supabase Auth
  const { error: authError } = await supabase.auth.admin.deleteUser(id);

  if (authError)
    throw new Error(`Failed to delete auth user: ${authError.message}`);

  return { success: true };
};

module.exports = { createManager, getManagers, updateManager, deleteManager };
