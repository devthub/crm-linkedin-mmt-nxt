import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { ConfirmDialog } from "primereact/confirmdialog";

import EmailForm from "../components/email-form";
import styles from "../styles/Home.module.css";

import PrimeReact from "primereact/api";
import { extractCookie } from "../helpers/common";
import tradeTokenForUser from "../helpers/trade-token";
import { useUserContext } from "../contexts/user-provider";

export default function Home({ user }) {
  // active ripple effect
  PrimeReact.ripple = true;

  const [visible, setVisible] = useState(false);
  const { userData, setUserData } = useUserContext();

  const router = useRouter();

  const redirectToUserPage = () => {
    router.push(
      `/${userData?.user?.user_id}?activation_id=${userData?.user?.activation_id}`
    );
  };

  useEffect(() => {
    setUserData(user);
    setVisible(user.success);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const clearUserState = () => {
    setVisible(false);
    setUserData({ ...userData, rejected: true });
  };

  if (setUserData.rejected)
    return (
      <>
        <div className={styles.container}>
          <main className={styles.main}>
            <EmailForm />
          </main>
        </div>
      </>
    );

  return (
    <>
      <div className={styles.container}>
        <main className={styles.main}>
          <ConfirmDialog
            visible={userData?.success && visible}
            onHide={clearUserState}
            message={userData?.user?.email}
            header="Is this you?"
            icon="pi pi-exclamation-triangle"
            accept={redirectToUserPage}
            reject={clearUserState}
          />
          <EmailForm />
        </main>
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  let user = null;
  const { req } = ctx;
  const cookies = req.headers?.cookie?.split("; ");
  const token = extractCookie(cookies, "mmt-crm");

  try {
    user = await tradeTokenForUser(token);

    console.log("index -> ssr -->>user :>> ", user);
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      user,
    },
  };
};
