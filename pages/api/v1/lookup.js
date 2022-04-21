import axios from "axios";

export default async function handler(req, res) {
  const { query } = req;
  try {
    const { data } = await axios.get(
      `https://rest.gohighlevel.com/v1/users/lookup?email=` + query?.email,
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoibFNkQ0QyOEpxSGVkVXk4eW9UMDYiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE2NDkwNTI0MTM2MjYsInN1YiI6Im5XbTlWY1IzMmZQeUNuUW1aSVdXIn0.rsrRdZwRT-coBjfkb0IKOOhb3Ifx-I87xhDOs8a6V1w",
        },
      }
    );

    if (Object.keys(data).length === 0) {
      throw new Error("Could not find any data.");
    }

    const mmtURI = `https://api.mymosttrusted.net/v1/network/41/users?page=1&limit=50&activation_id=${data.id}`;

    const mmtRecordExists = await axios.get(mmtURI, {
      headers: {
        Authorization:
          "Bearer -MNDSqBJQ0LF4ueM6nxzhM-MQROrV87h2tbBrt2Vl6CGzUIWtH-/8I5rYrnD0jwG",
      },
    });

    if (Object.keys(mmtRecordExists.data).length === 0) {
      throw new Error("Could not find MMT record.");
    }

    const user_id = mmtRecordExists?.data?.data[0]?.user_id;
    const mmt2URI = `https://api.mymosttrusted.net/v1/network/41/config/${user_id}`;

    const mmtMessages = await axios.get(mmt2URI, {
      headers: {
        Authorization:
          "Bearer -MNDSqBJQ0LF4ueM6nxzhM-MQROrV87h2tbBrt2Vl6CGzUIWtH-/8I5rYrnD0jwG",
      },
    });

    if (Object.keys(mmtMessages.data).length === 0) {
      throw new Error("Could not find data.");
    }

    res.status(200).send({ payload: { ...mmtMessages.data }, user_id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
