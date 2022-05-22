import { Inplace, InplaceDisplay, InplaceContent } from "primereact/inplace";
import { InputText } from "primereact/inputtext";
import { useUserContext } from "../contexts/user-provider";

export default function UserDetails({ userDetails }) {
  const { crmAPIText, setCrmAPIText } = useUserContext();

  return (
    <div className="grid fluid">
      <div className="col-12 mb-5">
        <h5 className="mb-1">Authorization</h5>
        <div className="api-key-wrapper">
          <Inplace closable>
            <InplaceDisplay>
              {crmAPIText || "CRM API here, click to Edit"}
            </InplaceDisplay>
            <InplaceContent>
              <InputText
                value={crmAPIText}
                onChange={(e) => setCrmAPIText(e.target.value)}
                autoFocus
                style={{ width: "95%" }}
              />
            </InplaceContent>
          </Inplace>
        </div>
        <span style={{ fontSize: ".8em" }}>
          Provide your location api key (Bearer Token).{" "}
          <a
            // class="markdown-link"
            href="https://help.gohighlevel.com/support/solutions/articles/48000982605-company-settings"
            target="_blank"
            rel="noreferrer"
          >
            <span>You can find here</span>
          </a>
        </span>
      </div>

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
            aria-describedby="firstName-help"
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
            aria-describedby="lastName-help"
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
            aria-describedby="email-help"
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
            aria-describedby="position-help"
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
            aria-describedby="lastWork-help"
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
