import axios from "axios";
import { serialize } from "cookie";
import { setAccessToken } from "../../../globals/auth";
import { isEmpty } from "../../../helpers/common";
import cookies from "../../../utils/cookies";
import { createUserToken } from "../../../utils/tokens";

async function handler(req, res) {
  const { query } = req;
  const mmtAPIBaseUri = process.env.NEXT_PUBLIC_MMT_API_BASE_URI;
  console.log(
    "🚀 ~ file: lookup.js:11 ~ handler ~ mmtAPIBaseUri:",
    mmtAPIBaseUri
  );

  try {
    const mmtURI = `${mmtAPIBaseUri}/users?page=1&limit=50&activation_id=${query?.email}`;

    const mmtRecordExists = await axios.get(mmtURI, {
      headers: {
        Authorization: `Bearer ${process.env.MMT_API_KEY}`,
      },
    });

    if (isEmpty(mmtRecordExists?.data.data[0])) {
      throw new Error("Could not find MMT record.");
    }

    const user_id = mmtRecordExists?.data?.data[0]?.user_id;

    const userToken = createUserToken({ user_id, activation_id: query?.email });
    setAccessToken(userToken);
    res.cookie("mmt-crm", userToken);
    res.setHeader("Set-Cookie", [
      serialize("mmt-crm", userToken, { path: "/" }),
    ]);

    res.status(200).send({
      success: true,
      user: mmtRecordExists?.data?.data[0],
      user_id,
      userToken,
      activation_id: query?.email,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, error: error.message });
  }
}

export default cookies(handler);
