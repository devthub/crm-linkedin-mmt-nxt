import React from "react";
import NextNProgress from "nextjs-progressbar";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

import "../styles/globals.css";
import { UserProvider } from "../contexts/user-provider";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <UserProvider>
        <NextNProgress />
        <Component {...pageProps} />
      </UserProvider>
    </>
  );
}

export default MyApp;
