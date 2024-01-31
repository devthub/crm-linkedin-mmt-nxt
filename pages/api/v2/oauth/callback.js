import axios from "axios";
import { serialize } from "cookie";
import qs from "qs";
import { setAccessToken } from "../../../../globals/auth";
import { getBaseURI } from "../../../../helpers/common";
import User from "../../../../models/User";
import dbConnect from "../../../../utils/config/dbConnect";
import cookies from "../../../../utils/cookies";
import { createUserToken } from "../../../../utils/tokens";

const CLIENT_ID = process.env.NEXT_PUBLIC_GHL_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_GHL_CLIENT_SECRET;

async function callbackHandler(req, res) {
  const state = JSON.parse(req.query?.state);

  let activationId = "";

  try {
    // activationId = req.query?.state && decodeURIComponent(req.query?.state);
    activationId = state?.activation_id;

    const data = qs.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "authorization_code",
      code: req.query.code,
      user_type: "Location",
      redirect_uri: `${getBaseURI()}api/v2/oauth/callback`,
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://services.leadconnectorhq.com/oauth/token",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data,
    };

    const response = await axios.request(config).catch((err) => {
      console.error("err", err.toJSON());
      throw err;
    });

    await dbConnect();
    const user = await User.findOneAndUpdate(
      { $or: [{ email: activationId }, { activation_id: activationId }] },
      { $set: { ghlOAuth: response?.data } }
    );

    if (!user) {
      throw new Error("User not found!");
    }

    const userToken = createUserToken({
      user_id: user.user_id,
      activation_id: activationId,
    });
    setAccessToken(userToken);
    res.cookie("mmt-crm", userToken);
    res.cookie("ghl-crm", response?.data?.access_token);
    res.setHeader("Set-Cookie", [
      serialize("mmt-crm", userToken, { path: "/" }),
    ]);
    res.setHeader("Set-Cookie", [
      serialize("ghl-crm", response?.data?.access_token, { path: "/" }),
    ]);

    // res.status(200).json({ ok: true, data: response?.data, user });
    return res.redirect(
      `/${user.user_id}?activation_id=${user.activation_id}&locationId=${response?.data?.locationId}`
    );
  } catch (error) {
    console.error("🚀 ~ handler ~ error:", error);

    return res.status(500).json({
      error,
      message: "Internal server error",
    });
  }
}

export default cookies(callbackHandler);
