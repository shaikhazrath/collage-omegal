import express from "express";
const router = express.Router();
import User from "./userModel.js";

import nodemailer from "nodemailer";
import jsonwebtoken from "jsonwebtoken";
import { authMiddleware } from "./authMiddleware.js";

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (email, otp, subjet) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.NODEMAIL_EMAIL,
      pass: process.env.NODEMAIL_PASSWORD,
    },
  });
 await transporter.sendMail({
    from: "hazrathali128@gmail.com",
    to: email,
    subject: subjet,
    text: `Your OTP  is: ${otp}`,
});

};
const generateJwt = (id) => {
  const token = jsonwebtoken.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "5d",
  });
  return token;
};
router.post("/", async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }
    let user = await User.findOne({ email: email });
    if (!user) {
      const [username, domain] = email.split("@");
      if (domain !== "anits.edu.in") {
        return res.status(400).json({ error: "you need anits collage email to join" });
            }
      const newUser = new User({ name: username, email });
      const otp = generateOTP();
      sendOTP(email, "register-user", otp);
      console.log(otp)
      newUser.otp = otp;
      newUser.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await newUser.save();
      return res
        .status(200)
        .json({
          message: "created new account and otp send successfully",
          email: email,
        });
    }
    const otp = generateOTP();

    sendOTP(email, otp, "register-user");

    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    return res
      .status(200)
      .json({ message: "already a user otp send successfully", email });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
router.post("/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;


    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.otp || user.otp !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }
    const currentTime = new Date();
    if (currentTime > user.otpExpiresAt) {
      return res.status(401).json({ message: "OTP has expired" });
    }
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();
    const token = generateJwt(user._id);
    return res.json({ message: "OTP verification successful", user, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get('/checktoken',authMiddleware,(req,res)=>{
  return res.json('user is verified')
})
export default router;
