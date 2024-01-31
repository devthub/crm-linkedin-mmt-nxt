const CLIENT_ID = process.env.NEXT_PUBLIC_GHL_CLIENT_ID;
const BASE_URL = process.env.NEXT_PUBLIC_GHL_BASE_URL;

export default async function handler(req, res) {
  const state = JSON.parse(req.query?.state);
  // const activationId = state?.activation_id;

  const options = {
    requestType: "code",
    redirectUrl: `http://localhost:3000/api/v2/oauth/callback`,
    clientId: CLIENT_ID,
    scopes: ["contacts.write", "contacts.readonly"],
  };

  // eslint-disable-next-line no-console
  console.log("🚀 ~ file: initiate.js:8 ~ handler ~ options:", options);

  return res.redirect(
    `${BASE_URL}/oauth/chooselocation?response_type=${
      options.requestType
    }&redirect_uri=${options.redirectUrl}&client_id=${
      options.clientId
    }&scope=${options.scopes.join(" ")}&state=${JSON.stringify(state)}`
  );
}
