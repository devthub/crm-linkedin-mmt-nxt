/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  nextConfig,
  publicRuntimeConfig: {
    apiUrl:
      process.env.NODE_ENV === "development"
        ? "https://crm-linkedin-mmt-nxt.vercel.app/api"
        : "http://localhost:3000/api",
  },
};
