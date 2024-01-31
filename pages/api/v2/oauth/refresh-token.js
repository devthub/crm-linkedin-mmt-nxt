import axios from "axios";
import qs from "qs";

const CLIENT_ID = process.env.NEXT_PUBLIC_GHL_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_GHL_CLIENT_SECRET;

export default async function handler(req, res) {
  const data = qs.stringify({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "refresh_token",
    refresh_token: req.query.token,
    user_type: "Location",
    redirect_uri: "http://localhost:3000/oauth/callback",
  });

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://services.leadconnectorhq.com/oauth/token",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  const response = await axios.request(config).catch((err) => {
    console.error("🚀 ~ handler ~ err:", err);
  });

  return res.json({ data: response?.data });
}
