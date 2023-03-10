import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import { ConfirmDialog } from "primereact/confirmdialog";

import EmailForm from "../components/email-form";
import styles from "../styles/Home.module.css";

import axios from "axios";
import PrimeReact from "primereact/api";
import { Toast } from "primereact/toast";
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
  const [isSubmittingOTP, setIsSubmittingOTP] = useState(false);

  const router = useRouter();
  const showMessageToast = (props) => toast.current.show({ ...props });

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
  }, [setUserData, user]);

  const clearUserState = () => {
    // if(typeof window !== "undefined"){
    //   window.localStorage.removeItem("")
    // }
    setVisible(false);
    setUserData({ ...userData, rejected: true });
  };

  const handleSubmitActivationId = async (values, { setSubmitting }) => {
    try {
      const { data } = await axios(`/api/v1/lookup?email=${values.email}`);

      if (Object.keys(data).length === 0) {
        throw new Error("Could not find data.");
      }

      setUserData(data);

      myLS.setItem("_urt", {
        user_id: data?.user.user_id,
        activation_id: data?.user?.activation_id,
      });

      showMessageToast({
        severity: "success",
        summary: "Record Found:",
        detail: "Please check your email for the OTP code.",
        life: 3000,
      });

      // router.push(
      //   `/${data?.user_id}?activation_id=${data?.activation_id}`,
      //   undefined,
      //   { shallow: true }
      // );
      setShowOtpForm(true);
      router.push(`/?email=${values.email}`, undefined, { shallow: true });
    } catch (error) {
      console.error(error.message);
      showMessageToast({
        severity: "error",
        summary: "Failed:",
        detail: "Could not find activation id",
        life: 3000,
      });

      setShowOtpForm(false);
    }

    setSubmitting(false);
  };

  const handleOTPVerification = async (otpCode) => {
    setIsSubmittingOTP(true);
    try {
      const { data } = await axios.post(`/api/v1/verify-otp`, {
        email: router.query?.email,
        otp: otpCode,
      });

      setUserData(data);

      myLS.setItem("_urt", {
        user_id: data?.user?.user_id,
        activation_id: data?.user?.activation_id,
      });

      showMessageToast({
        severity: "success",
        summary: "Success",
        detail: "OTP Verified.",
        life: 3000,
      });

      setIsSubmittingOTP(false);

      // router.push(`/${data?.user_id}`, undefined, { shallow: true });
      router.push(
        `/${data?.user_id}?activation_id=${data?.activation_id}`,
        undefined,
        { shallow: true }
      );
    } catch (error) {
      console.error(error);

      showMessageToast({
        severity: "error",
        summary: "Failed:",
        detail: "Invalid code.",
        life: 3000,
      });
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>Loading..</main>
      </div>
    );
  }

  if (!checked) {
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
            <EmailForm
              onSubmitActivationId={handleSubmitActivationId}
              onSubmitOtp={handleOTPVerification}
              showOtpForm={showOtpForm}
              setShowOtpForm={setShowOtpForm}
              isSubmittingOTP={isSubmittingOTP}
            />
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
          <EmailForm
            onSubmitActivationId={handleSubmitActivationId}
            onSubmitOtp={handleOTPVerification}
            showOtpForm={showOtpForm}
            setShowOtpForm={setShowOtpForm}
            isSubmittingOTP={isSubmittingOTP}
          />
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
