import User from "../../../models/User";
import dbConnect from "../../../utils/config/dbConnect";
import { sendOTPtoEmail } from "../../../utils/sendOTP";

async function verifyOtpHandler(req, res) {
  const {
    body: { email },
  } = req;

  try {
    const [otp] = await Promise.all([sendOTPtoEmail(email), dbConnect()]);

    const user = await User.findOneAndUpdate({ email }, { otp });

    return res.status(200).json({
      message: "Success",
      success: true,
      ok: true,
      user: JSON.parse(JSON.stringify(user)),
    });
  } catch (error) {
    console.error(
      "🚀 ~ file: send-otp.js:22 ~ verifyOtpHandler ~ error:",
      error
    );

    return res.status(400).json({
      message: "Failed sending OTP.",
      success: true,
      ok: true,
      user: null,
    });
  }
}

export default verifyOtpHandler;
