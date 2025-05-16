const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  hashPassword: async ({ password }) => {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  },

  generateToken: (data) => {
    const token = jwt.sign(
      data,
      process.env.JWT_SECRET /* { expiresIn: process.env.JWT_EXPIRES_IN } */
    );
    return token;
  },

  decodeToken: ({ token }) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  },

  comparePassword: async ({ password, hash }) => {
    const isPasswordMatch = await bcrypt.compare(password, hash);
    return isPasswordMatch;
  },

  generateStrongPassword: (length = 8) => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const special = "@$!%*?&";

    const all = uppercase + lowercase + numbers + special;

    let password = "";
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];

    // Fill the rest
    for (let i = password.length; i < length; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }

    // Shuffle the result
    return password
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");
  },
};
