export default async function handler(req, res) {
  const { query, body } = req;

  // eslint-disable-next-line no-console
  console.log("query", query);
  // eslint-disable-next-line no-console
  console.log("body", body);

  res.status(200).send({ ok: true, message: "Success!" });
}
