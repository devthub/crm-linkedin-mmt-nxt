import axios from "axios";
import { serialize } from "cookie";
import otpGenerator from "otp-generator";
import { setAccessToken } from "../../../globals/auth";
import { isEmpty } from "../../../helpers/common";
import User from "../../../models/User";
import dbConnect from "../../../utils/config/dbConnect";
import cookies from "../../../utils/cookies";
import { transporter } from "../../../utils/transporter";

async function handler(req, res) {
  const { query } = req;
  const mmtAPIBaseUri = process.env.NEXT_PUBLIC_MMT_API_BASE_URI;

  try {
    const mmtURI = `${mmtAPIBaseUri}/users?page=1&limit=50&activation_id=${query?.email}`;

    const mmtRecordExists = await axios.get(mmtURI, {
      headers: {
        Authorization: `Bearer ${process.env.MMT_API_KEY}`,
      },
    });

    if (isEmpty(mmtRecordExists?.data.data?.[0])) {
      throw new Error("Could not find MMT record.");
    }

    await dbConnect();

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    await transporter.sendMail(
      {
        from: process.env.NEXT_PUBLIC_SMTP_USER,
        to: query?.email,
        subject: "Your One-Time Password (OTP) Code",
        text: `Hello there,

        As requested, we have sent you a One-Time Password (OTP) code to the email address associated with your account. Please use the following OTP code to authenticate your account: \n
        
        OTP Code: ${otp}
        
        Please note that this OTP code is valid only for a limited time and should be used for authentication purposes only. Please do not share this code with anyone or disclose it on any website or through any other medium.
        
        If you did not request an OTP code or have any concerns regarding your account security, please contact our support team immediately.
        
        Thank you for using our service.
        
        Best regards,
        
        Thub Dev Team`,

        html: `<p>Hello there,</p>

        <p>As requested, we have sent you a One-Time Password (OTP) code to the email address associated with your account. Please use the following OTP code to authenticate your account:</p>
        
        <p>OTP Code: ${otp}</p>
        
        <p>Please note that this OTP code is valid only for a limited time and should be used for authentication purposes only. Please do not share this code with anyone or disclose it on any website or through any other medium.</p>
        
        <p>If you did not request an OTP code or have any concerns regarding your account security, please contact our support team immediately.</p>
        
        <p>Thank you for using our service.</p>
        
        <p>Best regards,</p>
        
        <p>Thub Dev Team</p>`,
      }
      // function (err, info) {
      //   if (err) {
      //     console.error("Error sending OTP ::>", err);
      //     throw new Error("Send OTP Error");
      //   } else {
      //     // eslint-disable-next-line no-console
      //     console.log("Email sent: " + info.response);
      //   }
      // }
    );

    const userEmail = mmtRecordExists?.data.data?.[0]?.email;
    const user_id = mmtRecordExists?.data?.data?.[0]?.user_id;
    const mmtUser = mmtRecordExists?.data?.data?.[0];

    const user = await User.findOneAndUpdate(
      { email: userEmail },
      {
        otp,
        first_name: mmtUser.first_name,
        last_name: mmtUser.last_name,
        user_id: mmtUser?.user_id,
        li_link: mmtUser?.li_link,
        position: mmtUser?.position,
        last_work_text: mmtUser?.last_work_text,
        country: mmtUser?.country,
        activation_id: mmtUser?.activation_id,
      },
      { new: true, upsert: true }
    );

    const userToken = "";
    setAccessToken(userToken);
    res.cookie("mmt-crm", userToken);
    res.setHeader("Set-Cookie", [
      serialize("mmt-crm", userToken, { path: "/" }),
    ]);

    res.status(200).send({
      success: true,
      user: mmtRecordExists?.data?.data?.[0],
      user_id,
      userToken,
      activation_id: user?.activation_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}

export default cookies(handler);
