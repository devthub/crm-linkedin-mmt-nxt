/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/",
        has: [
          // eslint-disable-next-line no-useless-escape
          {
            type: "header",
            key: "Origin",
            value: "(?<origin>^https://.*.crm-hub.tech$)",
          },
          {
            type: "header",
            key: "Origin",
            value: "(?<origin>^https://crm-linkedin-mmt*$)",
          },
        ],
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            value: ":origin",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

module.exports = {
  nextConfig,
  publicRuntimeConfig: {
    apiUrl:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/api"
        : process.env.NODE_ENV === "preview"
        ? "https://crm-linkedin-mmt-nxt-git-develop-brodwen83.vercel.app"
        : "https://crm-linkedin-mmt-nxt.vercel.app/api",
  },
};
