import { useRef } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useRouter } from "next/router";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";

import styles from "./email-form.module.css";
import { useUserContext } from "../contexts/user-provider";
import { myLS } from "../utils/ls";

const validationSchema = yup.object({
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
});

export default function EmailForm() {
  const { setUserData } = useUserContext();
  const toast = useRef(null);
  const router = useRouter();

  const showMessageToast = (props) => toast.current.show({ ...props });

  const handleSubmit = async (values, { setSubmitting }) => {
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
        detail: "MMT record found",
        life: 3000,
      });

      router.push(
        `/${data?.user_id}?activation_id=${data?.activation_id}`,
        undefined,
        { shallow: true }
      );
    } catch (error) {
      console.error(error.message);
      showMessageToast({
        severity: "error",
        summary: "Failed:",
        detail: "Could not find activation id",
        life: 3000,
      });
    }

    setSubmitting(false);
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

  return (
    <>
      <Toast ref={toast} />

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
    </>
  );
}
