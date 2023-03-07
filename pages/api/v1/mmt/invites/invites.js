export default async function handler(req, res) {
  const { query } = req;
  const mmtAPIBaseUri = process.env.NEXT_PUBLIC_MMT_API_BASE_URI;

  // let mmtURI = "";

  // if (isEmpty(query)) {
  //   mmtURI = `${mmtAPiBaseUri}/invites`;
  // } else {
  //   mmtURI = `${mmtAPiBaseUri}/invites/${query?.user_id}`;
  // }

  // try {
  //   const invites = await fetch(mmtURI, {
  //     headers: {
  //       Authorization:
  //         "Bearer -MNDSqBJQ0LF4ueM6nxzhM-MQROrV87h2tbBrt2Vl6CGzUIWtH-/8I5rYrnD0jwG",
  //     },
  //   });

  //   const data = await invites.json();

  //   if (Object.keys(data.data).length === 0) {
  //     throw new Error("Could not find MMT record.");
  //   }

  //   res.status(200).send(data);
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ error: error.message });
  // }

  res.send({});
}
