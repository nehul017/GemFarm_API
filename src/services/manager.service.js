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
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("role", "Manager");

  if (error) throw new Error(error.message);
  return data;
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
  await supabase.auth.admin.deleteUser(id);
  const { data, error } = await supabase.from("profiles").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return data;
};

module.exports = { createManager, getManagers, updateManager, deleteManager };
