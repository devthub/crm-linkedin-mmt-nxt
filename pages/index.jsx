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
    router.push(`/${userData?.user?.user_id}`);
  };

  useEffect(() => {
    setUserData(user);
  }, [setUserData, user]);

  if (user) console.log("client->user", user);

  console.log("client->>userData :>> ", userData);

  if (userData?.rejected) {
    return (
      <>
        <div className={styles.container}>
          <main className={styles.main}>
            <EmailForm />
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <ConfirmDialog
        visible={userData?.success || visible}
        onHide={() => setVisible(false)}
        message={userData?.user?.email}
        header="Is this you?"
        icon="pi pi-exclamation-triangle"
        accept={redirectToUserPage}
        reject={() => setUserData({ ...userData, rejected: true })}
      />
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const { req } = ctx;
  const cookies = req.headers?.cookie?.split("; ");
  const token = extractCookie(cookies, "mmt-crm");
  console.log("index->ssr->token :>> ", token);

  const user = await tradeTokenForUser(token);

  return {
    props: {
      user,
    },
  };
};
