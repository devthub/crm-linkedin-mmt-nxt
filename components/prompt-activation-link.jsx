import React, { useRef, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ToggleButton } from "primereact/togglebutton";
import { Checkbox } from "primereact/checkbox";

import { classNames } from "primereact/utils";

import styles from "./email-form.module.css";

const activationLinkEmailSchema = yup.object({
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
});

function PromptActivationLink({ alreadyActivated, setChecked }) {
  const openBlank = useRef(null);
  const [activationLink, setActivationLink] = useState("");

  const handleSubmit = ({ email }, { setSubmitting }) => {
    // setActivationLink(email);
    window.localStorage.setItem(
      "crm-linkedin-activate",
      JSON.stringify({ activated: true })
    );
    // window.location.href = `https://activate.maj3.com/mmt/crmhub/?activation_id=${email}`;
    setChecked(true);
    openBlank.current.click();

    setSubmitting(false);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: activationLinkEmailSchema,
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

  useEffect(() => {
    setActivationLink(formik.values["email"]);
  }, [formik]);

  const handleActivateClicked = () => {
    window.localStorage.setItem(
      "crm-linkedin-activate",
      JSON.stringify({ activated: true })
    );

    setChecked(true);
  };

  return (
    <div>
      <div className="card activated-link-headers">
        <div className="flex flex-column card-container flex-justify-content-center">
          <h1 style={{ textAlign: "center" }}>
            Have you completed these steps to link CRM-Hub to Linkedin?
          </h1>
          <h2 style={{ textAlign: "center" }}>
            Visited{" "}
            <a
              target="_blank"
              href="https://chrome.google.com/webstore/detail/mymosttrustednet/faijbkbhlnconmeidaljhlmobmdgnfih"
              rel="noopener noreferrer"
            >
              Google Chrome Store
            </a>{" "}
            and download the myMostTrusted extension?
          </h2>
          <h2 style={{ textAlign: "center" }}>
            Connected your Linkedin account to myMostTrusted?
          </h2>
          <h2 style={{ textAlign: "center" }}>
            Link myMostTrusted to CRM-Hub by putting your CRM email address in
            below and pressing submit
          </h2>

          <a
            target="_blank"
            href={`https://activate.maj3.com/mmt/crmhub/?activation_id=${activationLink}`}
            rel="noopener noreferrer"
            style={{ visible: "hidden" }}
            ref={openBlank}
          ></a>
        </div>
      </div>

      {/* <SelectButton
        value={alreadyActivated}
        options={options}
        onChange={handleActivateClicked}
      /> */}

      <div className="grid">
        <div className="col-12 md:col-offset-4 md:col-4">
          <form onSubmit={formik.handleSubmit} className="p-fluid">
            <div className={`${styles.field} mt-3`}>
              <span className="p-float-label p-input-icon-left">
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
              // loading={formik.isSubmitting}
              type="submit"
            />
          </form>
        </div>

        <div className="col-12 md:col-offset-4 md:col-4">
          <div className="flex justify-content-center">
            <div className="field-checkbox">
              <Checkbox
                onChange={handleActivateClicked}
                checked={alreadyActivated}
                inputId="remember-activation"
              ></Checkbox>
              <label htmlFor="remember-activation" className="p-checkbox-label">
                Already Activated
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PromptActivationLink;
