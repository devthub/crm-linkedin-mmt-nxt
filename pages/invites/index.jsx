import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
// import Link from "next/link";
import { Dialog } from "primereact/dialog";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

export default function Invites({ invites }) {
  const [invitesData, setInvitesData] = useState({});
  const [selectedInvitee, setSelectedInvitee] = useState(null);
  const [showInviteeDetailsModal, setShowInviteeDetailsModal] = useState(false);

  const toast = useRef(null);
  const showMessageToast = (props) => toast.current.show({ ...props });

  const getAllInvites = async () => {
    const response = await fetch("/api/v1/invites");
    const { data } = await response.json();
    console.log("data", data);
    setInvitesData(data);
    return invites;
  };
  useEffect(() => {
    getAllInvites();
  }, []);

  const onRowSelect = (event) => {
    setShowInviteeDetailsModal(true);
  };

  const onHide = () => {
    setSelectedInvitee(null);
    setShowInviteeDetailsModal(false);
  };

  const renderFooter = (name) => {
    return (
      <div className="mt-3">
        <Button
          label="Cancel"
          icon="pi pi-times"
          onClick={() => onHide(name)}
          className="p-button-text"
        />
        <Button
          label="Add to CRM"
          icon="pi pi-check"
          onClick={handleSubmit}
          autoFocus
        />
      </div>
    );
  };

  const handleSubmit = async () => {
    try {
      const { data } = await axios.post(`/api/v1/contacts/`, {
        firstName: selectedInvitee?.first_name,
        lastName: selectedInvitee?.last_name,
        email: selectedInvitee?.email,
      });
      // const {
      //   data: { data: invites },
      // } = await axios("/api/v1/invites");

      if (Object.keys(data).length === 0) {
        throw new Error("Could not find data.");
      }

      setResponseData({ ...data });
      showMessageToast({
        severity: "success",
        summary: "Success:",
        detail: "Added successfully",
        life: 3000,
      });
    } catch (error) {
      console.error(error);
      showMessageToast({
        severity: "error",
        summary: "Failed:",
        detail: error.message,
        life: 3000,
      });
    }
  };

  console.log("invitesData :>> ", invitesData);

  return (
    <>
      <Dialog
        header={`${selectedInvitee?.first_name} ${selectedInvitee?.last_name}`}
        visible={showInviteeDetailsModal}
        style={{ width: "80vw" }}
        footer={renderFooter("displayBasic")}
        onHide={onHide}
        dismissableMask
      >
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </Dialog>

      <Toast ref={toast} />

      <h2>Invites</h2>

      <div className="card">
        <DataTable
          // value={invites}
          value={invitesData && invitesData}
          stripedRows
          selectionMode="single"
          selection={selectedInvitee}
          onSelectionChange={(e) => setSelectedInvitee(e.value)}
          dataKey="id"
          responsiveLayout="scroll"
          onRowSelect={onRowSelect}
        >
          <Column field="first_name" sortable header="First Name"></Column>
          <Column field="last_name" sortable header="Last Name"></Column>
          <Column field="email" sortable header="Email"></Column>
          <Column field="company" sortable header="Company"></Column>
          <Column field="position" sortable header="Position"></Column>
          <Column field="country" sortable header="Country"></Column>
        </DataTable>
      </div>

      {/* {invites?.map((invite) => (
        <div key={invite.li_user_id}>
          <Link href={`/invites/${invite.user_id}`}>
            <a>{`${invite.first_name} ${invite.last_name}`}</a>
          </Link>
        </div>
      ))} */}
    </>
  );
}

// export async function getStaticProps() {
//   const {
//     data: { data: invites },
//   } = await axios("https://crm-linkedin-mmt-nxt.vercel.app/api/v1/invites");

//   return {
//     props: {
//       invites,
//     },
//   };
// }
