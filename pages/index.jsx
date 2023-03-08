import { verify } from "jsonwebtoken";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import { ConfirmDialog } from "primereact/confirmdialog";

import EmailForm from "../components/email-form";
import styles from "../styles/Home.module.css";

import PrimeReact from "primereact/api";
import { Toast } from "primereact/toast";
import OtpForm from "../components/otp-form";
import PromptActivationLink from "../components/prompt-activation-link";
import { useUserContext } from "../contexts/user-provider";
import { extractCookie, isEmpty } from "../helpers/common";
import tradeTokenForUser from "../helpers/trade-token";
import { myLS } from "../utils/ls";

export default function Home({ user }) {
  // active ripple effect
  PrimeReact.ripple = true;

  const { userData, setUserData } = useUserContext();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const toast = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const showMessageToast = (props) => toast.current.show({ ...props });

  const handleCurrentUserOtp = async () => {
    console.log("loggedInUser", loggedInUser);
    // try {
    //   const { data } = await axios(
    //     `/api/v1/lookup?email=${loggedInUser.activation_id}`
    //   );

    //   console.log("🚀 ~ file: email-form.jsx:36 ~ handleSubmit ~ data:", data);

    //   if (Object.keys(data).length === 0) {
    //     throw new Error("Could not find data.");
    //   }

    //   setUserData(data);
    // } catch (error) {
    //   console.error(error.message);
    //   showMessageToast({
    //     severity: "error",
    //     summary: "Failed:",
    //     detail: "Could not find activation id",
    //     life: 3000,
    //   });

    // }
    setShowOtpForm(true);
  };

  const redirectToUserPage = () => {
    router.push(
      `/${userData?.user?.user_id || loggedInUser?.user_id}?activation_id=${
        userData?.user?.activation_id || loggedInUser.activation_id
      }`
    );
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("useEffect:>>user", user);
      setUserData(user);
      setVisible(user?.success);

      const crmLinkedin = JSON.parse(
        window.localStorage.getItem("crm-linkedin-activate")
      );
      if (crmLinkedin?.activated) {
        console.log("Not activated");
        setChecked(true);
      }

      const ls_urt_Item = myLS.getItem("_urt");

      setLoggedInUser(ls_urt_Item);
      setIsLoading(false);
    }
  }, [setUserData, user]);

  const clearUserState = () => {
    // if(typeof window !== "undefined"){
    //   window.localStorage.removeItem("")
    // }
    setVisible(false);
    setUserData({ ...userData, rejected: true });
  };

  console.log("index ::>user", user);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>Loading..</main>
      </div>
    );
  }

  if (!checked) {
    console.log("!checked", !checked);
    return (
      <>
        <Toast ref={toast} />

        <div className={styles.container}>
          <main className={styles.main}>
            <PromptActivationLink
              alreadyActivated={checked}
              setChecked={setChecked}
            />
          </main>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Toast ref={toast} />

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
      <Toast ref={toast} />

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
            // accept={handleCurrentUserOtp}
            reject={clearUserState}
          />
          <EmailForm />
        </main>
      </div>
    </>
  );
}

// export const getServerSideProps = async (ctx) => {
//   let user = null;
//   const { req } = ctx;
//   const cookies = req.headers?.cookie?.split("; ");
//   const token = extractCookie(cookies, "mmt-crm");

//   const mmtAPIBaseUri = process.env.NEXT_PUBLIC_MMT_API_BASE_URI;

//   try {
//     const { activation_id } = verify(token, process.env.JWT_USER_SECRET);
//     console.log(
//       "🚀 ~ file: index.jsx:177 ~ getServerSideProps ~ activation_id:",
//       activation_id
//     );
//     // user = await tradeTokenForUser(token);

//     const mmtURI = `${mmtAPIBaseUri}/users?limit=1&activation_id=${activation_id}`;
//     const response = await fetch(mmtURI, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.MMT_API_KEY}`,
//       },
//     });

//     user = await response.json();
//     return {
//       props: {
//         user: user?.data?.[0] || null,
//       },
//     };
//   } catch (error) {
//     console.error(error);
//     return {
//       props: {
//         user: null,
//       },
//     };
//   }
// };

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
