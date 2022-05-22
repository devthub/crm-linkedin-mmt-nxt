export default async function handler(req, res) {
  const { query } = req;

  // let mmtURI = "";

  // if (isEmpty(query)) {
  //   mmtURI = `https://api.mymosttrusted.net/v1/network/41/invites`;
  // } else {
  //   mmtURI = `https://api.mymosttrusted.net/v1/network/41/invites/${query?.user_id}`;
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
