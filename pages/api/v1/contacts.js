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
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IkhPWDFpU3NqdE9qYVFGWEFja2RsIiwiY29tcGFueV9pZCI6ImxTZENEMjhKcUhlZFV5OHlvVDA2IiwidmVyc2lvbiI6MSwiaWF0IjoxNjQ4MTY3MzU5MDA0LCJzdWIiOiJuV205VmNSMzJmUHlDblFtWklXVyJ9.8yAypO6gWBgo1KUQeQ6GodjM9CJv75IOPkFsLmfYpzE",
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
