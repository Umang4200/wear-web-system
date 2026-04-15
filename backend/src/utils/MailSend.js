const nodemailer = require("nodemailer");
require("dotenv").config();

exports.mailSend = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.MAIL_EMAIL,
      to: email,
      subject: title,
      html: body,
    });

    console.log("Email sent: ", info.response);
    return info;
  } catch (error) {
    console.log("Email error:", error);
  }
};
