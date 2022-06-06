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
  refetchInvites,
}) {
  const dt = useRef(null);
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

  // <Column field="first_name" sortable header="First Name"></Column>
  //         <Column field="last_name" sortable header="Last Name"></Column>
  //         <Column field="email" sortable header="Email"></Column>
  //         <Column field="company" sortable header="Company"></Column>
  //         <Column field="position" sortable header="Position"></Column>
  //         <Column field="country" sortable header="Country"></Column>

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
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(exportColumns, invites);
        doc.save("invites.pdf");
      });
    });
  };

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(invites);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAsExcelFile(excelBuffer, "mmt-invites");
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(
          data,
          fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        );
      }
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
        onClick={() => exportCSV(false)}
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
      />
      {/* <Button
        type="button"
        icon="pi pi-filter"
        // onClick={() => alert("export csv")}
        // onClick={() => exportCSV(true)}
        className="p-button-info ml-auto"
        data-pr-tooltip="Selection Only"
      /> */}
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
          selectionMode="single"
          selection={selectedInvitee}
          onSelectionChange={(e) => setSelectedInvitee(e.value)}
          dataKey="id"
          responsiveLayout="stack"
          onRowSelect={onRowSelect}
          emptyMessage="No Invites..."
          loading={isLoading}
          header={header}
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
