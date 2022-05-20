import axios from "axios";
import { serialize } from "cookie";
import { setAccessToken } from "../../../globals/auth";
import cookies from "../../../utils/cookies";
import { createUserToken } from "../../../utils/tokens";

async function handler(req, res) {
  const { query } = req;

  const cookieFound = res.getHeader("Set-Cookie");
  console.log("login->cookieFound", cookieFound);
  console.log("login->req.headers.cookie", req.headers.cookie);
  try {
    const { data } = await axios.get(
      `https://rest.gohighlevel.com/v1/users/lookup?email=` + query?.email,
      {
        headers: {
          Authorization: `Bearer ${process.env.GHL_CRMHUB_KEY}`,
        },
      }
    );

    console.log("ghl->userid", data);

    if (Object.keys(data).length === 0) {
      throw new Error("Could not find any data.");
    }

    const mmtURI = `https://api.mymosttrusted.net/v1/network/41/users?page=1&limit=50&activation_id=${data.email}`;

    const mmtRecordExists = await axios.get(mmtURI, {
      headers: {
        Authorization: `Bearer ${process.env.MMT_API_KEY}`,
      },
    });

    if (Object.keys(mmtRecordExists.data).length === 0) {
      throw new Error("Could not find MMT record.");
    }

    const user_id = mmtRecordExists?.data?.data[0]?.user_id;

    const userToken = createUserToken({ user_id, activation_id: data?.email });
    setAccessToken(userToken);
    res.cookie("mmt-crm", userToken);
    res.setHeader("Set-Cookie", [
      serialize("mmt-crm", userToken, { path: "/" }),
    ]);

    res.status(200).send({
      user_id,
      userToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export default cookies(handler);
