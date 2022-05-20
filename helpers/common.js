const isEmpty = (value) =>
  !value ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0);

const extractCookie = (cookies, cookieName) => {
  if (isEmpty(cookieName) || isEmpty(cookies)) return "";

  const cookieFound = cookies.find((c) => c.includes(cookieName));
  console.log("cookieFound", cookieFound);

  return cookieFound?.split(`${cookieName}=`)[1];
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export { isEmpty, extractCookie, sleep };
