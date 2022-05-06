import axios from "axios";

export default async function handler(req, res) {
  const {
    body: { firstName, lastName, email },
  } = req;
  try {
    const { data } = await axios.post(
      "https://rest.gohighlevel.com/v1/contacts/",
      {
        firstName,
        lastName,
        email,
      },
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

    res.status(200).send({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
