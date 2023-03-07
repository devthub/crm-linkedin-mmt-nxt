import axios from "axios";
import { serialize } from "cookie";
import otpGenerator from "otp-generator";
import { setAccessToken } from "../../../globals/auth";
import { isEmpty } from "../../../helpers/common";
import User from "../../../models/User";
import dbConnect from "../../../utils/config/dbConnect";
import cookies from "../../../utils/cookies";
import { createUserToken } from "../../../utils/tokens";

async function handler(req, res) {
  const { query } = req;
  const mmtAPIBaseUri = process.env.NEXT_PUBLIC_MMT_API_BASE_URI;
  console.log(
    "🚀 ~ file: lookup.js:11 ~ handler ~ mmtAPIBaseUri:",
    mmtAPIBaseUri
  );

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

    const userEmail = mmtRecordExists?.data.data?.[0]?.email;
    const user_id = mmtRecordExists?.data?.data?.[0]?.user_id;
    const mmtUser = mmtRecordExists?.data?.data?.[0];

    console.log(
      "mmtRecordExists?.data?.data?.[0]",
      mmtRecordExists?.data?.data?.[0]
    );

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

    console.log("otp", otp);
    console.log("user", user);

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
      // userToken,
      activation_id: query?.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}

export default cookies(handler);
