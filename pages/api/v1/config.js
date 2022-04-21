import axios from "axios";

export default async function handler(req, res) {
  const { query, body } = req;

  const mmtUri = `https://api.mymosttrusted.net/v1/network/41/config/${query.user_id}`;

  const axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization:
        "Bearer -MNDSqBJQ0LF4ueM6nxzhM-MQROrV87h2tbBrt2Vl6CGzUIWtH-/8I5rYrnD0jwG",
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
