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

export default function EmailForm({
  onSubmitActivationId,
  onSubmitOtp,
  showOtpForm,
}) {
  const toast = useRef(null);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: onSubmitActivationId,
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

  return (
    <>
      {showOtpForm ? (
        <OtpForm onVerifyOTP={onSubmitOtp} />
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
