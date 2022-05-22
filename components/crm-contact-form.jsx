import { useRef } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { Chips } from "primereact/chips";

import styles from "./email-form.module.css";
import { isEmpty } from "../helpers/common";

const crmContactValidationSchema = yup.object({
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  firstName: yup
    .string("Enter first name.")
    .required("First name is required."),
  lastName: yup.string("Enter last name.").required("Last name is required."),
  tags: yup.array().of(yup.string()),
});

export default function CRMContactForm({ handleSubmit, selectedInvitee }) {
  const toast = useRef(null);

  const showMessageToast = (props) => toast.current.show({ ...props });

  const formik = useFormik({
    initialValues: {
      email: selectedInvitee?.email || "",
      firstName: selectedInvitee?.first_name || "",
      lastName: selectedInvitee?.last_name || "",
      tags: !isEmpty(selectedInvitee?.tags)
        ? selectedInvitee?.tags.map((tag) => tag?.tag_name)
        : [],
    },
    validationSchema: crmContactValidationSchema,
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
            <h3 className="text-center">
              {selectedInvitee?.first_name} {selectedInvitee?.last_name}
            </h3>
            <form onSubmit={formik.handleSubmit} className="p-fluid">
              <h5>Personal Information</h5>
              <div className={`${styles.field} mt-5`}>
                <span className="p-float-label p-input-icon-right">
                  <i className="pi pi-user" />
                  <InputText
                    id="firstName"
                    name="firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    className={classNames({
                      "p-invalid": isFormFieldValid("firstName"),
                    })}
                  />
                  <label
                    htmlFor="firstName"
                    className={classNames({
                      "p-error": isFormFieldValid("firstName"),
                    })}
                  >
                    First Name*
                  </label>
                </span>
                {getFormErrorMessage("firstName")}
              </div>

              <div className={styles.field}>
                <span className="p-float-label p-input-icon-right">
                  <i className="pi pi-user" />
                  <InputText
                    id="lastName"
                    name="lastName"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    className={classNames({
                      "p-invalid": isFormFieldValid("lastName"),
                    })}
                  />
                  <label
                    htmlFor="lastName"
                    className={classNames({
                      "p-error": isFormFieldValid("lastName"),
                    })}
                  >
                    Last Name*
                  </label>
                </span>
                {getFormErrorMessage("lastName")}
              </div>

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

              <div className={styles.field}>
                <h5>Tags</h5>
                <Chips
                  name="tags"
                  id="tags"
                  value={formik.values.tags}
                  onChange={formik.handleChange}
                />
              </div>

              <Button
                className="mt-2"
                label={formik.isSubmitting ? "Submitting..." : "Add to CRM"}
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
