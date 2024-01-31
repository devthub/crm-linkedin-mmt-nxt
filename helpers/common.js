const isEmpty = (value) =>
  !value ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0);

const extractCookie = (cookies, cookieName) => {
  if (isEmpty(cookieName) || isEmpty(cookies)) return "";

  const cookieFound = cookies.find((c) => c.includes(cookieName));

  return cookieFound?.split(`${cookieName}=`)[1];
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export { extractCookie, isEmpty, sleep };

export const getBaseURI = () => {
  const apiUri =
    process.env.NODE_ENV === "production"
      ? process.env.PROD_SERVER_BASE_URL
      : process.env.LOCAL_SERVER_BASE_URL;

  return apiUri;
};
