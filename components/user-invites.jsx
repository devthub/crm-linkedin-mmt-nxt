import axios from "axios";
import React, { useRef, useState } from "react";

import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";

import { useRouter } from "next/router";
import { Inplace, InplaceContent, InplaceDisplay } from "primereact/inplace";
import { InputText } from "primereact/inputtext";
import { useUserContext } from "../contexts/user-provider";
import { isEmpty } from "../helpers/common";
import { truncateAPIKEY } from "../pages/[user_id]";
import CRMContactForm from "./crm-contact-form";

export default function UserInvites({
  invites,
  showAcceptances,
  handleOnlyShowAcceptedInvites,
  isLoading = false,
  refetchInvites,
  onChangeCRMAPI,
  showEnterAPIKeyModal,
  setShowEnterAPIKeyModal,
}) {
  const dt = useRef(null);
  const { crmAPIText } = useUserContext();
  const [selectedInvitee, setSelectedInvitee] = useState(null);
  const [showInviteeDetailsModal, setShowInviteeDetailsModal] = useState(false);
  const [exportXLSLoadingState, setExportXLSLoadingState] = useState(false);
  const [exportPDFLoadingState, setExportPDFLoadingState] = useState(false);
  const [selectedAcceptedInvites, setSelectedAcceptedInvites] = useState(null);

  const [basicFirst, setBasicFirst] = useState(0);
  const [basicRows, setBasicRows] = useState(10);

  const toast = useRef(null);
  const showMessageToast = (props) => toast.current.show({ ...props });

  const router = useRouter();

  // eslint-disable-next-line no-unused-vars
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

  const renderAPIModalFooter = (_name) => {
    return (
      <div className="mt-3">
        <Button
          label="Close"
          icon="pi pi-times"
          onClick={() => setShowEnterAPIKeyModal(false)}
          className="p-button-text"
        />
      </div>
    );
  };

  const handleSubmit = async (values) => {
    try {
      const { data } = await axios.post(`/api/v2/contacts/`, {
        activationId: router.query?.activation_id,
        firstName: values?.firstName ? values?.firstName : values?.first_name,
        lastName: values?.lastName ? values?.lastName : values?.last_name,
        email: values?.email,
        phone: values.phone,
        tags: values?.tags?.map((tag) => tag.tag_name),
        crmAPI: crmAPIText,
        locationId: router.query?.locationId,
      });

      if (!data.ok) {
        showMessageToast({
          severity: "error",
          summary: "Failed:",
          detail: data?.message,
          life: 3000,
        });
      }

      showMessageToast({
        severity: "success",
        summary: `${
          values?.firstName ? values?.firstName : values?.first_name
        } ${values?.lastName ? values?.lastName : values?.last_name}`,
        detail: "Added successfully",
        life: 3000,
      });

      setShowInviteeDetailsModal(false);
    } catch (error) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        // Handle the 400 error response
        console.error(error.response?.data);

        showMessageToast({
          severity: "error",
          summary: "Failed:",
          detail: error.response?.data?.message || error.response?.data?.error,
          life: 3000,
        });

        if (
          (error.response?.data?.error &&
            error.response?.data?.error === "Token missing for user!") ||
          error.response?.data?.message === "Missing API key!" ||
          error.response?.data?.message === "Token missing for user!" ||
          error.response?.data?.message === "Please provide location Id!" ||
          error.response?.data?.message ===
            "The token does not have access to this location." ||
          error.response?.data?.message === "Invalid JWT" ||
          error.response?.data?.message ===
            "This authClass type is not allowed to access this scope. Please reach out to the Platform team to get it added."
        ) {
          router.push(
            `/api/v2/ghl/initiate?state=${JSON.stringify(router.query)}`
          );
        }
      } else {
        // Handle other errors
        console.error(error);

        showMessageToast({
          severity: "error",
          summary: "Failed:",
          detail: error.response?.data?.message || error.message,
          life: 3000,
        });
      }

      // router.push(`/api/v2/ghl/initiate?state=${JSON.stringify(router.query)}`);
      // setShowEnterAPIKeyModal(true);
    }
  };

  const handleAddBulkToCRM = () => {
    if (isEmpty(selectedAcceptedInvites)) {
      return showMessageToast({
        severity: "error",
        summary: "Failed:",
        detail: "Please select at least one invite ",
        life: 3000,
      });
    } else {
      selectedAcceptedInvites?.forEach(async (element) => {
        await handleSubmit(element);
      });
    }
  };

  const cols = [
    { field: "first_name", header: "First Name" },
    { field: "last_name", header: "Last Name" },
    { field: "email", header: "Email" },
    { field: "company", header: "Company" },
    { field: "position", header: "Position" },
    { field: "country", header: "Country" },
  ];

  const exportColumns = cols.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));

  // const importCSV = (e) => {
  //   const file = e.files[0];
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     const csv = e.target.result;
  //     const data = csv.split("\n");

  //     // Prepare DataTable
  //     const cols = data[0].replace(/['"]+/g, "").split(",");
  //     data.shift();

  //     let _importedCols = cols.map((col) => ({
  //       field: col,
  //       header: toCapitalize(col.replace(/['"]+/g, "")),
  //     }));
  //     let _importedData = data.map((d) => {
  //       d = d.split(",");
  //       return cols.reduce((obj, c, i) => {
  //         obj[c] = d[i].replace(/['"]+/g, "");
  //         return obj;
  //       }, {});
  //     });

  //     setImportedCols(_importedCols);
  //     setImportedData(_importedData);
  //   };

  //   reader.readAsText(file, "UTF-8");
  // };

  // const importExcel = (e) => {
  //   const file = e.files[0];

  //   import("xlsx").then((xlsx) => {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       const wb = xlsx.read(e.target.result, { type: "array" });
  //       const wsname = wb.SheetNames[0];
  //       const ws = wb.Sheets[wsname];
  //       const data = xlsx.utils.sheet_to_json(ws, { header: 1 });

  //       // Prepare DataTable
  //       const cols = data[0];
  //       data.shift();

  //       let _importedCols = cols.map((col) => ({
  //         field: col,
  //         header: toCapitalize(col),
  //       }));
  //       let _importedData = data.map((d) => {
  //         return cols.reduce((obj, c, i) => {
  //           obj[c] = d[i];
  //           return obj;
  //         }, {});
  //       });

  //       setImportedCols(_importedCols);
  //       setImportedData(_importedData);
  //     };

  //     reader.readAsArrayBuffer(file);
  //   });
  // };

  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };

  const exportPdf = () => {
    import("jspdf").then((jsPDF) => {
      setExportPDFLoadingState(true);
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(
          exportColumns,
          !isEmpty(selectedAcceptedInvites) ? selectedAcceptedInvites : invites
        );
        doc.save("invites.pdf");
        setExportPDFLoadingState(false);
      });
    });
  };

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(
        !isEmpty(selectedAcceptedInvites) ? selectedAcceptedInvites : invites
      );
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAsExcelFile(excelBuffer, "mmt-invites");
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    setExportXLSLoadingState(true);
    import("file-saver").then((module) => {
      if (module && module.default) {
        const EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(
          data,
          fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        );
      }
      setExportXLSLoadingState(false);
    });
  };

  // const toCapitalize = (s) => {
  //   return s.charAt(0).toUpperCase() + s.slice(1);
  // };

  // const clear = () => {
  //   setImportedData([]);
  //   setSelectedImportedData([]);
  //   setImportedCols([{ field: "", header: "Header" }]);
  // };

  // const onImportSelectionChange = (e) => {
  //   setSelectedImportedData(e.value);
  //   const detail = e.value.map((d) => Object.values(d)[0]).join(", ");
  //   toast.current.show({
  //     severity: "info",
  //     summary: "Data Selected",
  //     detail,
  //     life: 3000,
  //   });
  // };

  // const onSelectionChange = (e) => {
  //   setSelectedProducts(e.value);
  // };

  const header = (
    <div className="flex align-items-center export-buttons">
      <Button
        type="button"
        icon="pi pi-file"
        // onClick={() => alert("export csv")}
        onClick={() => exportCSV(!isEmpty(selectedAcceptedInvites))}
        className="mr-2"
        data-pr-tooltip="CSV"
        tooltip="Export CSV"
        tooltipOptions={{ position: "top" }}
      />
      <Button
        type="button"
        icon="pi pi-file-excel"
        // onClick={() => alert("export excel")}
        onClick={exportExcel}
        className="p-button-success mr-2"
        data-pr-tooltip="XLS"
        tooltip="Export Excel"
        tooltipOptions={{ position: "top" }}
        loading={exportXLSLoadingState}
      />
      <Button
        type="button"
        icon="pi pi-file-pdf"
        // onClick={() => alert("export pdf")}
        onClick={exportPdf}
        className="p-button-warning mr-2"
        data-pr-tooltip="PDF"
        tooltip="Export PDF"
        tooltipOptions={{ position: "top" }}
        loading={exportPDFLoadingState}
      />
      {!isEmpty(selectedAcceptedInvites) && (
        <Button
          type="button"
          icon="pi pi-upload"
          onClick={handleAddBulkToCRM}
          // onClick={() => alert("export csv")}
          // onClick={() => exportCSV(true)}
          className="p-button-success"
          data-pr-tooltip="Selection Only"
          label="Add To CRM"
        />
      )}
      <Button
        type="button"
        disabled={isLoading}
        loading={isLoading}
        icon="pi pi-refresh"
        // label="Refresh"
        onClick={() => refetchInvites()}
        className="p-button-info ml-auto"
        tooltip="Refresh List"
        tooltipOptions={{ position: "top" }}
      />
    </div>
  );

  const isSelectable = (value, field) => {
    let isSelectable = true;
    switch (field) {
      case "email":
        isSelectable = value !== "";
        break;
      // case "name":
      // case "category":
      //   isSelectable = value.startsWith("B") || value.startsWith("A");
      //   break;

      default:
        break;
    }
    return isSelectable;
  };

  const isRowSelectable = (event) => {
    const data = event.data;
    return isSelectable(data.email, "email");
  };

  const rowClassName = (data) => {
    return isSelectable(data.email, "email") ? "" : "p-disabled";
  };

  // eslint-disable-next-line no-unused-vars
  const onBasicPageChange = (event) => {
    setBasicFirst(event.first);
    setBasicRows(event.rows);
  };

  const template2 = {
    layout: "RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink",
    RowsPerPageDropdown: (options) => {
      const dropdownOptions = [
        { label: 10, value: 10 },
        { label: 20, value: 20 },
        { label: 50, value: 50 },
      ];

      return (
        <React.Fragment>
          <span
            className="mx-1"
            style={{ color: "var(--text-color)", userSelect: "none" }}
          >
            Items per page:{" "}
          </span>
          <Dropdown
            value={options.value}
            options={dropdownOptions}
            onChange={options.onChange}
          />
        </React.Fragment>
      );
    },
    CurrentPageReport: (options) => {
      return (
        <span
          style={{
            color: "var(--text-color)",
            userSelect: "none",
            width: "120px",
            textAlign: "center",
          }}
        >
          {options.first} - {options.last} of {options.totalRecords}
        </span>
      );
    },
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

      <Dialog
        header="Enter API key"
        visible={showEnterAPIKeyModal}
        style={{ width: "80vw" }}
        onHide={() => setShowEnterAPIKeyModal(false)}
        footer={renderAPIModalFooter}
      >
        <>
          <h6 className="mb-1">Authorization</h6>
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
          <div className="api-key-wrapper mt-2">
            <Inplace closable>
              <InplaceDisplay style={{ backgroundColor: "#eee" }}>
                {truncateAPIKEY(crmAPIText, 32) ||
                  "CRM API here, click to Edit"}
              </InplaceDisplay>
              <InplaceContent>
                <InputText
                  value={crmAPIText}
                  onChange={onChangeCRMAPI}
                  autoFocus
                  style={{ width: "85%" }}
                />
              </InplaceContent>
            </Inplace>
          </div>
        </>
      </Dialog>

      <Toast ref={toast} />

      <h5>Your Invites</h5>

      <div className="card">
        <div className="flex justify-content-between align-items-center mb-2">
          <div className="">
            <Checkbox
              inputId="acceptance"
              checked={showAcceptances}
              onChange={handleOnlyShowAcceptedInvites}
            />
            <label htmlFor="acceptance"> Only Show Accepted Invites</label>
          </div>
        </div>

        <DataTable
          ref={dt}
          value={invites}
          stripedRows
          paginator
          paginatorTemplate={template2}
          first={basicFirst}
          rows={basicRows}
          // selectionMode="checkbox"
          // selection={selectedInvitee}
          selection={selectedAcceptedInvites}
          // onSelectionChange={(e) => setSelectedInvitee(e.value)}
          dataKey="id"
          responsiveLayout="stack"
          // onRowSelect={onRowSelect}
          emptyMessage="No Invites..."
          loading={isLoading || exportPDFLoadingState || exportXLSLoadingState}
          header={header}
          // selection={selectedProducts12}
          onSelectionChange={(e) => setSelectedAcceptedInvites(e.value)}
          // dataKey="id"
          isDataSelectable={isRowSelectable}
          rowClassName={rowClassName}
          paginatorClassName="justify-content-end"
          className="mt-6"
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3em" }}
          ></Column>
          <Column
            field="first_name"
            sortable
            header="First Name"
            style={{ width: "12em" }}
          ></Column>
          <Column
            field="last_name"
            sortable
            header="Last Name"
            style={{ width: "12em" }}
          ></Column>
          <Column field="email" sortable header="Email"></Column>
          <Column field="company" sortable header="Company"></Column>
          <Column field="position" sortable header="Position"></Column>
          <Column field="country" sortable header="Country"></Column>
        </DataTable>

        {/* <Paginator
          first={basicFirst}
          rows={basicRows}
          totalRecords={invites?.length}
          rowsPerPageOptions={[10, 20, 30]}
          onPageChange={onBasicPageChange}
        ></Paginator> */}
      </div>
    </>
  );
}
