import axios from "axios";
import { isEmpty } from "../../../helpers/common";

export default async function handler(req, res) {
  const {
    body: { firstName, lastName, email, tags, crmAPI, locationId },
  } = req;

  try {
    if (isEmpty(crmAPI) || isEmpty(locationId))
      throw new Error("Please provide API key!");

    const ghlToken = `Bearer ${crmAPI}`;

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
