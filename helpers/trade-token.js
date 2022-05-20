import getConfig from "next/config";
import { verify } from "jsonwebtoken";

export default async function tradeTokenForUser(token) {
  const { publicRuntimeConfig } = getConfig();
  const apiBaseUrl = `${publicRuntimeConfig.apiUrl}/v1`;

  try {
    if (!token) throw Error("No token found");

    const { activation_id } = verify(token, process.env.JWT_USER_SECRET);

    const response = await fetch(
      `${apiBaseUrl}/mmt/users?activation_id=${activation_id}`
    );
    const users = await response.json();

    return { rejected: false, success: true, user: users?.data[0] };
  } catch (error) {
    console.error(error);
    return {
      error: error.message,
      success: false,
      user: null,
      rejected: true,
    };
  }
}
