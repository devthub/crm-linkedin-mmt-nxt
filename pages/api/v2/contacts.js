import axios from "axios";
import { isEmpty } from "../../../helpers/common";
import User from "../../../models/User";
import dbConnect from "../../../utils/config/dbConnect";

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

      ghlToken = `Bearer ${user.ghlOAuth?.access_token}`;
    }

    if (isEmpty(locationId)) throw new Error("Please provide API key!");

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
