import axios from "axios";
import { isEmpty } from "../../../../../helpers/common";

export default async function handler(req, res) {
  const { query } = req;
  const { user_id, status_name } = query;
  const mmtAPIBaseUri = process.env.NEXT_PUBLIC_MMT_API_BASE_URI;

  const queryString = !isEmpty(status_name)
    ? `${user_id}?page=1&limit=50&status_name=${status_name}`
    : `${user_id}`;

  // const mmtURI = `${mmtAPIBaseUri}/invites/${user_id}?tag_name=${tag_name}`;
  const mmtURI = `${mmtAPIBaseUri}/invites/${queryString}`;

  try {
    const invites = await fetch(mmtURI, {
      headers: {
        Authorization: `Bearer ${process.env.MMT_API_KEY}`,
      },
    });

    const data = await invites.json();

    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
