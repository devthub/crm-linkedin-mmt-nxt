import { useEffect, useState, useRef } from "react";

import { Dialog } from "primereact/dialog";
import { Editor } from "primereact/editor";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

import CustomMessageContainer from "./custom-message-container";
import axios from "axios";

export default function CustomMessages({ responseData }) {
  const toast = useRef(null);
  const [savingLoadingStatus, setSavingLoadingStatus] = useState(false);

  const [defaultPayload, setDefaultPayload] = useState({});
  const [selectedMessage, setSelectedMessage] = useState({});
  const [showEditor, setShowEditor] = useState(false);

  const [editedText, setEditedText] = useState("");
  const [user_id, setUser_id] = useState("");

  const showMessageToast = (props) => toast.current.show({ ...props });

  useEffect(() => {
    setUser_id(responseData?.user?.user_id);
    setDefaultPayload((prev) => ({
      ...prev,
      ...responseData.userConfig,
    }));
  }, [responseData]);

  const onHideEditor = () => setShowEditor(false);

  const handleEditMessagePressed = ({ title, body, objkey }) => {
    setSelectedMessage({ title, body, objkey });
    setEditedText(body);
    setShowEditor(true);
  };

  const handleSaveMessage = async () => {
    const payload = {
      ...defaultPayload,
      [selectedMessage?.objkey]: editedText,
    };

    const mmtUri = `/api/v1/config?user_id=${user_id}`;

    try {
      setSavingLoadingStatus(true);

      const { data } = await axios.post(mmtUri, payload);

      if (data?.message === "Success") {
        showMessageToast({
          severity: "success",
          summary: data?.message,
          detail: "Update successful.",
          life: 3000,
        });

        setDefaultPayload({ ...payload });
      }
    } catch (error) {
      console.error(error);
      showMessageToast({
        severity: "error",
        summary: "Failed:",
        detail: error.message,
        life: 3000,
      });
    }

    setSavingLoadingStatus(false);
    setShowEditor(false);
  };

  const editorFooter = (
    <div>
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={onHideEditor}
        className="p-button-text"
      />
      <Button
        label="Save"
        icon="pi pi-check"
        onClick={handleSaveMessage}
        loading={savingLoadingStatus}
      />
    </div>
  );

  const toHTMLLineBreaks = (textValue) =>
    textValue.replace(/(?:\r\n|\r|\n)/g, "<br>");

  return (
    <div className="mt-5">
      <Toast ref={toast} />

      <Dialog
        header={`Edit ${selectedMessage?.title}?`}
        visible={showEditor}
        style={{ width: "95vw" }}
        footer={editorFooter}
        onHide={onHideEditor}
        // dismissableMask
      >
        <div>
          <div className="card">
            <Editor
              style={{ height: "320px" }}
              value={toHTMLLineBreaks(editedText)}
              onTextChange={(e) => setEditedText(e.textValue)}
            />
          </div>
        </div>
      </Dialog>

      <h5>User Config</h5>

      <div className="grid">
        <div className="col-12 lg:col-6">
          <CustomMessageContainer
            title="Invitation Message"
            body={defaultPayload?.invitation_message}
            objkey="invitation_message"
            onEditBtnPressed={handleEditMessagePressed}
            isLoading={savingLoadingStatus}
          />
        </div>

        <div className="col-12 lg:col-6">
          <CustomMessageContainer
            title="Acceptance Message"
            body={defaultPayload?.acceptance_message}
            objkey="acceptance_message"
            onEditBtnPressed={handleEditMessagePressed}
            isLoading={savingLoadingStatus}
          />
        </div>

        <div className="lg:col-6">
          <CustomMessageContainer
            title="Custom Message 1"
            body={defaultPayload?.custom_message1}
            objkey="custom_message1"
            onEditBtnPressed={handleEditMessagePressed}
            isLoading={savingLoadingStatus}
          />
        </div>

        <div className="col-12 lg:col-6">
          <CustomMessageContainer
            title="Custom Message 2"
            body={defaultPayload?.custom_message2}
            objkey="custom_message2"
            onEditBtnPressed={handleEditMessagePressed}
            isLoading={savingLoadingStatus}
          />
        </div>
      </div>
    </div>
  );
}
