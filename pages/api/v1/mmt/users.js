import { isEmpty } from "../../../../helpers/common";

export default async function handler(req, res) {
  let mmt2URI = "";

  const { query } = req;

  if (isEmpty(query)) {
    mmt2URI =
      "https://api.mymosttrusted.net/v1/network/41/users?page=1&limit=50";
  } else {
    mmt2URI = `https://api.mymosttrusted.net/v1/network/41/users?limit=1&activation_id=${query?.activation_id}`;
  }

  try {
    const response = await fetch(mmt2URI, {
      headers: {
        Authorization: `Bearer ${process.env.MMT_API_KEY}`,
      },
    });

    const data = await response.json();

    if (isEmpty(data)) {
      throw new Error("Could not find user.");
    }

    res.status(200).send(data);
  } catch (error) {
    console.error(error);

    res.status(400).send(null);
  }
}
