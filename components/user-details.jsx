import { InputText } from "primereact/inputtext";

export default function UserDetails({ userDetails }) {
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
