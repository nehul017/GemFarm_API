const logger = require("../config/logger");
const apiResponse = require("../middlewares/api.response");
const userService = require("../services/user.service");
const message = require("../contants/message.json");
const { otpServices } = require("../services");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const moment = require("moment/moment");
const { commodity } = require("../models");
const supabase = require("../config/supabaseClient");

// Controller function for registering a user
// const registerUser = async (req, res) => {
//   try {
//     const createdData = await userService.createUser(req.body);

//     if (!createdData) {
//       return res.status(400).send({ message: "Email already exists" });
//     } else {
//       return res.status(201).send({
//         message: "User registered successfully",
//         user: createdData.user,
//         token: createdData.token,
//       });
//     }
//   } catch (err) {
//     console.log("err", err);
//     return res
//       .status(500)
//       .send({ message: "Error registering user", error: err.message });
//   }
// };

// Controller function for logging in a user
// const loginUser = async (req, res) => {
//   try {
//     const { user, token } = await userService.loginUser(
//       req.body.email,
//       req.body.password
//     );

//     if (!user) {
//       return res.status(400).send({ message: "Invalid email or password" });
//     }

//     return res.status(200).send({
//       message: "Login successful",
//       user: user,
//       token,
//     });
//   } catch (err) {
//     console.log("err", err);
//     return res.status(400).send({ message: err.message });
//   }
// };

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const user = data.user;

    // Fetch role and fullName from profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, full_name", "profileImage")
      .eq("id", user.id) // id in profiles = id in auth.users
      .single(); // expect only one record

    if (profileError) {
      return res.status(400).json({ message: profileError.message });
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        role: profile.role,
        username: profile.full_name,
        profileImage: profile.profileImage || "",
      },
      token: data.session.access_token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Controller function for updating a user
// const updateUser = async (req, res) => {
//   try {
//     // Get uploaded image URL (if file exists)
//     const profileImage = req.file ? req.file.location : undefined;

//     delete req.body.email;
//     if (profileImage) req.body.profileImage = profileImage;
//     const user = await userService.updateUser(req.params.id, req.body);

//     return res.status(200).send({ message: "User updated successfully", user });
//   } catch (err) {
//     return res.status(500).send({ message: err.message });
//   }
// };

const updateUser = async (req, res) => {
  try {
    // Get uploaded image URL (if file exists)
    const profileImage = req.file ? req.file.location : undefined;

    if (profileImage) req.body.profileImage = profileImage;
    const user = await userService.updateUserV2(req.params.id, req.body);

    return res.status(200).send({ message: "User updated successfully", user });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

// Controller function for deleting a user
const deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

// Controller function for getting all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).send(users);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

// Controller function for get login user
const getLoginUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    return res.status(200).send({
      message: "User Retrieve successfully",
      user: user,
    });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

//Controller function for forgot password
const forgotPassword = async (req, res) => {
  try {
    const reqBody = req.body;

    const emailExist = await userService.getUserByEmail(reqBody.email);

    if (!emailExist) {
      return apiResponse.NOT_FOUND({
        res,
        message: message.email_not_register,
      }); // If email doesn't exist, throw an error.
    }

    await userService.sendForgetPasswordEmail(emailExist.email);

    return apiResponse.OK({
      res,
      message: message.password_forgot,
    });
  } catch (err) {
    logger.error("error generating", err);
    return apiResponse.CATCH_ERROR({
      res,
      message: message.something_went_wrong,
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const reqBody = req.body;

    const otpExists = await otpServices.getOtpWhere({
      where: {
        otp: reqBody.otp,
      },
    });

    if (!otpExists) {
      return apiResponse.NOT_FOUND({ res, message: message.otp_invalid });
    }

    if (otpExists.otp !== reqBody.otp) {
      return apiResponse.BAD_REQUEST({ res, message: message.otp_invalid });
    }

    if (new Date(otpExists.expires) <= new Date()) {
      return apiResponse.BAD_REQUEST({ res, message: message.otp_expired });
    }

    await otpServices.deleteOtp(otpExists.id);

    return apiResponse.OK({
      res,
      message: message.otp_verify_success,
    });
  } catch (err) {
    logger.error("error generating", err);
    return apiResponse.CATCH_ERROR({
      res,
      message: message.something_went_wrong,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, email } = req.body;

    const { data: users, error: fetchError } =
      await supabase.auth.admin.listUsers();

    if (fetchError) throw fetchError;

    console.log('users', users)
    const user = users.users.find((u) => u.email === email);
    if (!user) throw new Error("User not found");
    if (password !== confirmPassword) {
      return apiResponse.BAD_REQUEST({
        res,
        message: message.password_not_match,
      });
    }

    await supabase.auth.admin.updateUserById(user.id, {
      password: password,
    });
    return apiResponse.OK({
      res,
      message: message.password_reset,
    });
  } catch (err) {
    logger.error("error generating", err);
    return apiResponse.CATCH_ERROR({
      res,
      message: message.something_went_wrong,
    });
  }
};

const getCommodityData = async (req, res) => {
  try {
    const apiKey = "N/KUHW09nFDyuRCfqAA8/fcD3JfP9OQn";
    const encodedAuth = Buffer.from(`${apiKey}:`).toString("base64");

    const options = {
      method: "GET",
      url: "https://marsapi.ams.usda.gov/services/v1.2/reports/2277/report%20details",
      params: {
        q: `report_date=${moment()
          .subtract(8, "days")
          .format("MM/DD/YYYY")}:${moment()
          .subtract(1, "days")
          .format("MM/DD/YYYY")}`,
      },
      headers: {
        Authorization: `Basic ${encodedAuth}`,
      },
    };

    const options2 = {
      method: "GET",
      url: "https://marsapi.ams.usda.gov/services/v1.2/reports/2278/report%20details",
      params: {
        q: `report_date=${moment()
          .subtract(8, "days")
          .format("MM/DD/YYYY")}:${moment()
          .subtract(1, "days")
          .format("MM/DD/YYYY")}`,
      },
      headers: {
        Authorization: `Basic ${encodedAuth}`,
      },
    };

    const { data } = await axios.request(options);
    const { data: data2 } = await axios.request(options2);

    // Assuming response looks like: { results: [...] }
    const records = [...data.results] || [];

    const records2 = [...data2.results] || [];

    // Deduplicate based on report_date
    const seen = new Set();
    const uniqueCommodities = [];

    for (const record of records) {
      const key = `${record.report_date}_${record.commodity}`;
      if (!seen.has(key)) {
        seen.add(key);

        uniqueCommodities.push({
          category_id: "4a9c4fe0-f665-4383-a608-d8061c55aaa2",
          name: record.commodity,
          overall_max_low_price: record.low_price || null,
          overall_max_high_price: record.high_price || null,
          date: moment(record.report_date, "MM/DD/YYYY").format("YYYY-MM-DD"),
        });
      }
    }
    for (const record of records2) {
      const key = `${record.report_date}_${record.commodity}`;
      if (!seen.has(key)) {
        seen.add(key);

        uniqueCommodities.push({
          category_id: "9de5ba30-a128-4dc7-bcd0-03d27adf39ef",
          name: record.commodity,
          package: record.package,
          item_size: record.item_size,
          overall_max_low_price: record.low_price || null,
          overall_max_high_price: record.high_price || null,
          date: moment(record.report_date, "MM/DD/YYYY").format("YYYY-MM-DD"),
        });
      }
    }

    // Bulk insert into the commodities table
    await commodity.bulkCreate(uniqueCommodities, {
      ignoreDuplicates: true, // Optional if you're using unique constraints
    });

    return apiResponse.OK({
      res,
      message: message.otp_verify_success,
      data: uniqueCommodities,
    });
  } catch (err) {
    console.log("err", err);
    return res
      .status(500)
      .send({ message: "Error registering user", error: err.message });
  }
};

const getPerKGprice = async (req, res) => {
  const { crops } = req.body;
  try {
    const validItems = crops.filter(
      (item) => item.package && item.item_size && item.low_price
    );

    // Construct individual item descriptions
    const itemDescriptions = validItems
      .map((item, index) => {
        const high = item.high_price || item.low_price;
        return `Item ${index + 1}:
    - Name: ${item.name}
    - Variety: ${item.variety}
    - Package: ${item.package}
    - Item size: ${item.item_size}
    - Low price: ${item.low_price}
    - High price: ${high}`;
      })
      .join("\n\n");

    // Build prompt
    const prompt = `
You are given a list of produce items with market prices in USD.

For each item:
- Use the low and high price (if high is missing, use low for both).
- Estimate the total weight in kilograms from the package and item size.
- Calculate per kg price in USD (rounded to 2 decimal places).

Return only a JSON array with this format:
[
  {
    "name": "Item Name",
    "variety": "Variety",
    "perKgLow": number,
    "perKgHigh": number
  }
]
Do not return any explanation or extra text.

Items:
${itemDescriptions}`;

    console.log("process.env.OPENAI_API_KEY", process.env.OPENAI_API_KEY);
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4.1 nano",
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 90000, // 30 seconds
      }
    );

    const content = response.data.choices[0].message.content;
    const parsed = JSON.parse(content);

    return res.status(200).send({
      message: "Commodity data retrieved successfully",
      data: parsed,
    });
  } catch (err) {
    console.log("err", err);
    return res
      .status(500)
      .send({ message: "Error retrieving commodity data", error: err.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { email, password, username, role } = req.body;

    const { data: signupData, error: signupError } = await supabase.auth.signUp(
      {
        email,
        password,
      }
    );

    if (signupError) {
      return res.status(400).json({ error: signupError.message });
    }

    const userId = signupData.user.id;

    // Insert into profiles table
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: userId,
        full_name: username,
        role: role, // SuperAdmin, FarmOwner, Manager, Investor
      },
    ]);

    if (profileError) {
      return res.status(400).json({ error: profileError.message });
    }

    return res.status(201).json({
      message: "User registered successfully",
      user: signupData.user,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUsers,
  forgotPassword,
  resetPassword,
  verifyOTP,
  getLoginUser,
  getCommodityData,
  getPerKGprice,
  // loginUserV2,
  // registerUserV2,
  // updateUserV2,
};
