import { useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Inplace, InplaceDisplay, InplaceContent } from "primereact/inplace";
import { InputText } from "primereact/inputtext";
import { useUserContext } from "../contexts/user-provider";
import { myLS } from "../utils/ls";

export default function UserDetails({ userDetails }) {
  const { crmAPIText, setCrmAPIText } = useUserContext();

  useEffect(() => {
    const crmapi = myLS.getItem("_seerem_k");

    if (crmapi) {
      if (crmapi.email === userDetails?.activation_id) {
        setCrmAPIText(crmapi[userDetails?.activation_id]);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="grid fluid">
      <div className="col-12">
        <h5>User Details</h5>
      </div>

      <div className="col-12 lg:col-4">
        <div className="field">
          <label htmlFor="firstName" className="block">
            First Name
          </label>
          <InputText
            id="firstName"
            aria-describedby="firstName"
            className="block"
            disabled
            style={{ width: "100%" }}
            value={userDetails?.first_name}
          />
        </div>
      </div>

      <div className="col-12 lg:col-4">
        <div className="field">
          <label htmlFor="lastName" className="block">
            Last Name
          </label>
          <InputText
            id="lastName"
            aria-describedby="lastName"
            className="block"
            disabled
            style={{ width: "100%" }}
            value={userDetails?.last_name}
          />
        </div>
      </div>

      <div className="col-12 lg:col-4">
        <div className="field">
          <label htmlFor="email" className="block">
            Email
          </label>
          <InputText
            id="email"
            aria-describedby="email"
            className="block"
            disabled
            style={{ width: "100%" }}
            value={userDetails?.email}
          />
        </div>
      </div>

      <div className="col-12 lg:col-6">
        <div className="field">
          <label htmlFor="position" className="block">
            Position
          </label>
          <InputText
            id="email"
            aria-describedby="position"
            className="block"
            disabled
            style={{ width: "100%" }}
            value={userDetails?.position}
          />
        </div>
      </div>

      <div className="col-12 lg:col-6">
        <div className="field">
          <label htmlFor="lastWork" className="block">
            Company
          </label>
          <InputText
            id="lastWork"
            aria-describedby="lastWork"
            className="block"
            disabled
            style={{ width: "100%" }}
            value={userDetails?.last_work_text}
          />
        </div>
      </div>
    </div>
  );
}
