import { serialize } from "cookie";
import { setAccessToken } from "../../../globals/auth";
import User from "../../../models/User";
import dbConnect from "../../../utils/config/dbConnect";
import cookies from "../../../utils/cookies";
import { createUserToken } from "../../../utils/tokens";

async function verifyOtpHandler(req, res) {
  const {
    body: { email, otp },
    method,
  } = req;

  if (method === "POST") {
    try {
      await dbConnect();
      const user = await User.findOne({ activation_id: email });
      if (!user) {
        return res.status(404).json({
          message: "User not found!",
          success: false,
          ok: false,
          user: null,
        });
      }

      const otpVerified = user.verifyOtp(otp);

      if (!otpVerified) {
        console.log("verified OTP");
        return res.status(404).json({
          message: "Invalid code.",
          success: false,
          ok: false,
          user: null,
        });
      }

      const userToken = createUserToken({
        user_id: user.user_id,
        activation_id: email,
      });
      setAccessToken(userToken);
      res.cookie("mmt-crm", userToken);
      res.setHeader("Set-Cookie", [
        serialize("mmt-crm", userToken, { path: "/" }),
      ]);

      res.status(200).send({
        success: true,
        user: JSON.parse(JSON.stringify(user)),
        user_id: user.user_id,
        userToken,
        activation_id: email,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Verification failed.",
        success: false,
        ok: false,
        error,
        user: null,
      });
    }
  } else {
    return res.status(200).json({
      message: "This method is not yet implemented",
      success: true,
      ok: true,
      user: null,
    });
  }
}

export default cookies(verifyOtpHandler);
