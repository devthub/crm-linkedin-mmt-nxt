import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { createRef, memo, useRef, useState } from "react";
import * as yup from "yup";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";

import { useUserContext } from "../contexts/user-provider";
import { myLS } from "../utils/ls";
import styles from "./email-form.module.css";
import OtpForm from "./otp-form";

const validationSchema = yup.object({
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
});

export default function EmailForm() {
  const { userData, setUserData } = useUserContext();
  const toast = useRef(null);
  const router = useRouter();
  const [showOtpForm, setShowOtpForm] = useState(false);

  const showMessageToast = (props) => toast.current.show({ ...props });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const { data } = await axios(`/api/v1/lookup?email=${values.email}`);

      if (Object.keys(data).length === 0) {
        throw new Error("Could not find data.");
      }

      // setUserData(data);

      // myLS.setItem("_urt", {
      //   user_id: data?.user.user_id,
      //   activation_id: data?.user?.activation_id,
      // });

      showMessageToast({
        severity: "success",
        summary: "Record Found:",
        detail: "MMT record found",
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
    console.log("handleOTPVerification fn called");
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

      console.log("OTP::>data", data);

      // router.push(
      //   `/${data?.user_id}?activation_id=${data?.activation_id}`,
      //   undefined,
      //   { shallow: true }
      // );
      console.log("before push email form ::>router.query", router.query);
      router.push(`/${data?.user_id}`, undefined, { shallow: true });
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

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  const isFormFieldValid = (name) =>
    !!(formik.touched[name] && formik.errors[name]);
  const getFormErrorMessage = (name) => {
    return (
      isFormFieldValid(name) && (
        <small className="p-error">{formik.errors[name]}</small>
      )
    );
  };

  console.log("email form ::>userData", userData);

  return (
    <>
      <Toast ref={toast} />

      {showOtpForm ? (
        <OtpForm onVerifyOTP={handleOTPVerification} />
      ) : (
        <div className={styles.formDemo}>
          <div className="flex justify-content-center">
            <div className={styles.card}>
              <h5 className="text-center">Enter Email</h5>
              <form onSubmit={formik.handleSubmit} className="p-fluid">
                <div className={styles.field}>
                  <span className="p-float-label p-input-icon-right">
                    <i className="pi pi-envelope" />
                    <InputText
                      id="email"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      className={classNames({
                        "p-invalid": isFormFieldValid("email"),
                      })}
                    />
                    <label
                      htmlFor="email"
                      className={classNames({
                        "p-error": isFormFieldValid("email"),
                      })}
                    >
                      Email*
                    </label>
                  </span>
                  {getFormErrorMessage("email")}
                </div>

                <Button
                  className="mt-2"
                  label={formik.isSubmitting ? "Submitting..." : "Submit"}
                  icon="pi pi-send"
                  iconPos="right"
                  loading={formik.isSubmitting}
                  type="submit"
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
