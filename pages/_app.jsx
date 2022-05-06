import React from "react";
import NextNProgress from "nextjs-progressbar";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

import "../styles/globals.css";
import NavMenu from "../components/nav-menu";

function MyApp({ Component, pageProps }) {
  const [activeIndex, setActiveIndex] = React.useState(3);

  return (
    <>
      <NextNProgress />
      <NavMenu activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
      <Component {...pageProps} />;
    </>
  );
}

export default MyApp;
