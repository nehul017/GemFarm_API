const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});



const sendEmail = async (to, subject, data) => {
  try {
    return await transport
      .sendMail({
        from: process.env.SMTP_USERNAME,
        to: to,
        subject: subject,
        html: data,
      })
      .then(() => true)
      .catch((error) => {
        console.log(`---error--`, error);
      });
  } catch (err) {
    return err;
  }
};

module.exports = {
  sendEmail,
  transport
};
