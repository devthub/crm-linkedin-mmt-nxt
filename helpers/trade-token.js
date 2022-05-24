import { verify } from "jsonwebtoken";

export default async function tradeTokenForUser(token) {
  const apiBaseUrl =
    process.env.NODE_ENV === "production"
      ? process.env.PROD_SERVER_BASE_URL
      : process.env.LOCAL_SERVER_BASE_URL;

  console.log("tradeTokenForUser-->>apiBaseUrl", apiBaseUrl);

  try {
    if (!token) throw Error("No token found");

    const { activation_id } = verify(token, process.env.JWT_USER_SECRET);

    const response = await fetch(
      `${apiBaseUrl}api/v1/mmt/users?activation_id=${activation_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const users = await response.json();
    console.log("users?.data[0]", users?.data[0]);

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
