import axios from "axios";

export default async function handler(req, res) {
  const { query, body } = req;
  const mmtAPIBaseUri = process.env.NEXT_PUBLIC_MMT_API_BASE_URI;

  const mmtUri = `${mmtAPIBaseUri}/config/${query.user_id}`;

  const axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_INVITES_API}`,
    },
  };

  try {
    const { data } = await axios.post(mmtUri, body, axiosConfig);

    if (!data?.message === "Success") {
      throw new Error("Could not update config");
    }

    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error.message });
  }
}
