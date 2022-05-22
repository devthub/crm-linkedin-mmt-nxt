import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Dialog } from "primereact/dialog";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Checkbox } from "primereact/checkbox";

export default function UserInvites({ invites }) {
  const [showAcceptances, setShowAcceptances] = useState(false);
  const [selectedInvitee, setSelectedInvitee] = useState(null);
  const [showInviteeDetailsModal, setShowInviteeDetailsModal] = useState(false);

  const toast = useRef(null);
  const showMessageToast = (props) => toast.current.show({ ...props });

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

      if (Object.keys(data).length === 0) {
        throw new Error("Could not find data.");
      }

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

      <h5>Your Invites</h5>

      <div className="card">
        <div className="field-checkbox">
          <Checkbox
            inputId="acceptance"
            checked={showAcceptances}
            onChange={(e) => setShowAcceptances(e.checked)}
          />
          <label htmlFor="acceptance">Only Show Accepted Invites</label>
        </div>
        <DataTable
          value={invites?.data}
          stripedRows
          selectionMode="single"
          selection={selectedInvitee}
          onSelectionChange={(e) => setSelectedInvitee(e.value)}
          dataKey="id"
          responsiveLayout="scroll"
          onRowSelect={onRowSelect}
          emptyMessage="No Invites..."
        >
          <Column field="first_name" sortable header="First Name"></Column>
          <Column field="last_name" sortable header="Last Name"></Column>
          <Column field="email" sortable header="Email"></Column>
          <Column field="company" sortable header="Company"></Column>
          <Column field="position" sortable header="Position"></Column>
          <Column field="country" sortable header="Country"></Column>
        </DataTable>
      </div>
    </>
  );
}
