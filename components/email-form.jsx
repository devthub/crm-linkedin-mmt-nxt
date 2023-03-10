import { useFormik } from "formik";
import * as yup from "yup";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";

import OtpForm from "./otp-form";

import styles from "./email-form.module.css";

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
  isSubmittingOTP,
}) {
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
        <OtpForm onVerifyOTP={onSubmitOtp} isSubmittingOTP={isSubmittingOTP} />
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
