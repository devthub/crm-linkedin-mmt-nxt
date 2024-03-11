import axios from "axios";
import { isEmpty } from "../../../../helpers/common";

export default async function handler(req, res) {
  const {
    body: { firstName, lastName, email, tags, phone, crmAPI },
  } = req;

  try {
    if (isEmpty(crmAPI))
      return res
        .status(400)
        .send({ error: { message: "Please provide API key." } });

    const { data } = await axios.post(
      "https://rest.gohighlevel.com/v1/contacts/",
      {
        firstName,
        lastName,
        email,
        phone,
        tags,
      },
      {
        headers: {
          Authorization: `Bearer ${crmAPI}`,
        },
      }
    );

    if (Object.keys(data).length === 0) {
      throw new Error("Could not find any data.");
    }

    res.status(200).send({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
