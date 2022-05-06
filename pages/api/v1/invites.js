import axios from "axios";
import { isEmpty } from "../../../helpers/common";

export default async function handler(req, res) {
  const { query } = req;

  console.log("query", query);

  let mmtURI = "";

  if (isEmpty(query)) {
    mmtURI = `https://api.mymosttrusted.net/v1/network/41/invites`;
  } else {
    mmtURI = `https://api.mymosttrusted.net/v1/network/41/invites/${query?.user_id}`;
  }

  try {
    const invites = await axios.get(mmtURI, {
      headers: {
        Authorization:
          "Bearer -MNDSqBJQ0LF4ueM6nxzhM-MQROrV87h2tbBrt2Vl6CGzUIWtH-/8I5rYrnD0jwG",
      },
    });

    if (Object.keys(invites.data).length === 0) {
      throw new Error("Could not find MMT record.");
    }

    res.status(200).send(invites.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
