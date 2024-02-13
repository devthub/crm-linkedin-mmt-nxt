import axios from "axios";
import jwt from "jsonwebtoken";
import qs from "qs";
import { getBaseURI, isEmpty } from "../../../helpers/common";
import User from "../../../models/User";
import dbConnect from "../../../utils/config/dbConnect";
import { isTokenExpired } from "../../../utils/tokens";

const CLIENT_ID = process.env.NEXT_PUBLIC_GHL_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_GHL_CLIENT_SECRET;

export default async function handler(req, res) {
  const {
    body: {
      activationId,
      firstName,
      lastName,
      email,
      tags,
      crmAPI,
      locationId,
    },
  } = req;

  let ghlToken = "";

  ghlToken = `Bearer ${crmAPI}`;

  try {
    if (isEmpty(crmAPI)) {
      await dbConnect();

      const user = await User.findOne({
        $or: [{ activation_id: activationId }, { email: activationId }],
      });

      if (!user) {
        return res.status(404).json({
          ok: false,
          message: "User not found!",
        });
      }

      if (!user.ghlOAuth) {
        return res.status(404).json({
          ok: false,
          message: "Token missing for user!",
        });
      }

      const ghlAccessToken = user?.ghlOAuth?.access_token;
      const decodedToken = jwt.decode(ghlAccessToken);

      if (isTokenExpired(decodedToken.exp)) {
        console.error("Token Expired!");

        const ghlRefreshToken = user?.ghlOAuth?.refresh_token;

        const data = qs.stringify({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: "refresh_token",
          refresh_token: ghlRefreshToken,
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
          data: data,
        };

        const response = await axios.request(config).catch((err) => {
          console.error("err", err);
          throw new Error("Token missing for user!");
        });

        if (!response || !response.data) {
          return res.status(404).json({
            ok: false,
            message: "Token missing for user!",
          });
        }

        user.ghlOAuth = response.data;
        await user.save();

        ghlToken = `Bearer ${response.data?.access_token}`;
      } else ghlToken = `Bearer ${ghlAccessToken}`;
    }

    if (isEmpty(locationId)) throw new Error("Please provide location Id!");

    // eslint-disable-next-line no-console
    console.log("🚀 ~ handler ~ ghlToken:", ghlToken);

    const { data } = await axios.post(
      "https://services.leadconnectorhq.com/contacts/",
      {
        firstName,
        lastName,
        email,
        tags,
        locationId,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: ghlToken.trim(),
          Version: "2021-07-28",
        },
      }
    );

    if (Object.keys(data).length === 0) {
      throw new Error("Could not find any data.");
    }

    res.status(200).send({ ok: true, message: "Success!", data });
  } catch (error) {
    console.error(error);

    if (axios.isAxiosError(error)) {
      return res.status(400).json({
        ok: false,
        error,
        message: error.response?.data?.message,
      });
    } else if (error.message === "Please provide API key!") {
      return res
        .status(400)
        .json({ error, message: "Missing API key!", ok: false });
    } else return res.status(500).json({ ok: false, error: error.message });
  }
}
