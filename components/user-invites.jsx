import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Dialog } from "primereact/dialog";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Checkbox } from "primereact/checkbox";
import CRMContactForm from "./crm-contact-form";
import { useUserContext } from "../contexts/user-provider";

export default function UserInvites({
  invites,
  showAcceptances,
  handleOnlyShowAcceptedInvites,
  isLoading = false,
}) {
  const { crmAPIText } = useUserContext();
  const [selectedInvitee, setSelectedInvitee] = useState(null);
  const [showInviteeDetailsModal, setShowInviteeDetailsModal] = useState(false);

  const toast = useRef(null);
  const showMessageToast = (props) => toast.current.show({ ...props });

  const onRowSelect = () => {
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
      </div>
    );
  };

  const handleSubmit = async (values) => {
    try {
      await axios.post(`/api/v1/contacts/`, {
        firstName: values?.firstName,
        lastName: values?.lastName,
        email: values?.email,
        phone: values.phone,
        tags: values?.tags,
        crmAPI: crmAPIText,
      });

      showMessageToast({
        severity: "success",
        summary: "Success:",
        detail: "Added successfully",
        life: 3000,
      });

      setShowInviteeDetailsModal(false);
    } catch (error) {
      console.error(error.code);
      showMessageToast({
        severity: "error",
        summary: "Failed:",
        detail: "Please provide API key in Account Tab. ",
        life: 3000,
      });
    }
  };

  return (
    <>
      <Dialog
        header="Review Information"
        visible={showInviteeDetailsModal}
        style={{ width: "80vw" }}
        footer={renderFooter("displayBasic")}
        onHide={onHide}
      >
        <CRMContactForm
          handleSubmit={handleSubmit}
          selectedInvitee={selectedInvitee}
        />
      </Dialog>

      <Toast ref={toast} />

      <h5>Your Invites</h5>

      <div className="card">
        <div className="field-checkbox">
          <Checkbox
            inputId="acceptance"
            checked={showAcceptances}
            onChange={handleOnlyShowAcceptedInvites}
          />
          <label htmlFor="acceptance">Only Show Accepted Invites</label>
        </div>
        <DataTable
          value={invites}
          stripedRows
          selectionMode="single"
          selection={selectedInvitee}
          onSelectionChange={(e) => setSelectedInvitee(e.value)}
          dataKey="id"
          responsiveLayout="stack"
          onRowSelect={onRowSelect}
          emptyMessage="No Invites..."
          loading={isLoading}
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
