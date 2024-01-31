import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import * as yup from "yup";

import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";

import { classNames } from "primereact/utils";

import { myLS } from "../utils/ls";
import styles from "./email-form.module.css";

const activationLinkEmailSchema = yup.object({
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  crmApi: yup.string("Enter CRM API"),
});

function PromptActivationLink({ alreadyActivated, setChecked }) {
  const openBlank = useRef(null);
  const [activationLink, setActivationLink] = useState("");

  const handleSubmit = ({ crmApi, email }, { setSubmitting }) => {
    // setActivationLink(email);
    window.localStorage.setItem(
      "crm-linkedin-activate",
      JSON.stringify({ activated: true })
    );
    // window.location.href = `https://activate.maj3.com/mmt/crmhub/?activation_id=${email}`;

    myLS.setItem("_seerem_k", {
      [email]: crmApi,
      email,
    });

    setSubmitting(false);
    setChecked(true);
    openBlank.current.click();
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      crmApi: "",
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

  // eslint-disable-next-line no-unused-vars
  const handleInitiateGHL = async () => {
    await axios.get("http://localhost:3000/api/v2/ghl/initiate");
  };

  return (
    <div>
      <div className="card activated-link-headers">
        <div className="flex flex-column card-container flex-justify-content-center">
          <h1 style={{ textAlign: "center" }}>
            Have you completed these steps to link Productivity Hub to Linkedin?
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
            Link myMostTrusted to Productivity Hub by putting your Productivity
            Hub email address in below and pressing submit
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

            {/* <div className={`${styles.field} p-field mt-5`}>
              <span className="p-float-label p-input-icon-left">
                <i className="pi pi-lock" />
                <InputText
                  id="crmApi"
                  name="crmApi"
                  value={formik.values.crmApi}
                  onChange={formik.handleChange}
                  className={classNames({
                    "p-invalid": isFormFieldValid("crmApi"),
                  })}
                />
                <label
                  htmlFor="crmApi"
                  className={classNames({
                    "p-error": isFormFieldValid("crmApi"),
                  })}
                >
                  Enter Your CRM API *
                </label>
              </span>

              <span>
                <small id="username-help">
                  Provide your location api key (Bearer Token).{" "}
                  <a
                    // class="markdown-link"
                    href="https://help.gohighlevel.com/support/solutions/articles/48000982605-company-settings"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>You can find here</span>
                  </a>
                </small>
              </span>

              <div>{getFormErrorMessage("email")}</div>
            </div> */}

            {/* <Button
              className="mt-5"
              label="Initiate Access Token"
              icon="pi pi-send"
              iconPos="right"
              // loading={formik.isSubmitting}
              onClick={() => router.push("/api/v2/ghl/initiate")}
              // onClick={handleInitiateGHL}
              type="button"
            /> */}

            <Button
              className="mt-5"
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
