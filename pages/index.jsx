import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { ConfirmDialog } from "primereact/confirmdialog";

import EmailForm from "../components/email-form";
import styles from "../styles/Home.module.css";

import PrimeReact from "primereact/api";
import { extractCookie, isEmpty } from "../helpers/common";
import tradeTokenForUser from "../helpers/trade-token";
import { useUserContext } from "../contexts/user-provider";
import PromptActivationLink from "../components/prompt-activation-link";
import { myLS } from "../utils/ls";

export default function Home({ user }) {
  // active ripple effect
  PrimeReact.ripple = true;

  const { userData, setUserData } = useUserContext();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const redirectToUserPage = () => {
    router.push(
      `/${userData?.user?.user_id || loggedInUser?.user_id}?activation_id=${
        userData?.user?.activation_id || loggedInUser.activation_id
      }`
    );
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserData(user);
      setVisible(user?.success);

      const crmLinkedin = JSON.parse(
        window.localStorage.getItem("crm-linkedin-activate")
      );
      if (crmLinkedin?.activated) {
        setChecked(true);
      }

      const ls_urt_Item = myLS.getItem("_urt");

      setLoggedInUser(ls_urt_Item);
      setIsLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const clearUserState = () => {
    // if(typeof window !== "undefined"){
    //   window.localStorage.removeItem("")
    // }
    setVisible(false);
    setUserData({ ...userData, rejected: true });
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>Loading..</main>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className={styles.container}>
          <main className={styles.main}>
            <EmailForm />
          </main>
        </div>
      </>
    );
  } else if (!checked) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <PromptActivationLink
            alreadyActivated={checked}
            setChecked={setChecked}
          />
        </main>
      </div>
    );
  } else
    return (
      <>
        <div className={styles.container}>
          <main className={styles.main}>
            <ConfirmDialog
              visible={
                (userData?.success && visible) ||
                !isEmpty(loggedInUser?.activation_id)
              }
              onHide={clearUserState}
              message={userData?.user?.email || loggedInUser?.activation_id}
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
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      user,
    },
  };
};
