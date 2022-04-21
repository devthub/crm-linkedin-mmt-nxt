import { Card } from "primereact/card";
import { Button } from "primereact/button";

export default function CustomMessageContainer({
  title,
  body,
  objkey,
  onEditBtnPressed,
  isLoading,
}) {
  const footer = (
    <span>
      <Button
        label="Edit"
        icon="pi pi-pencil"
        iconPos="right"
        onClick={() => onEditBtnPressed({ title, body, objkey })}
        loading={isLoading}
      />
    </span>
  );

  return (
    <Card
      title={title}
      footer={footer}
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <div className="p-card-content">
        <div
          style={{
            whiteSpace: "pre-wrap",
            flexGrow: 1,
            minHeight: "180px",
          }}
        >
          {body}
        </div>
      </div>
    </Card>
  );
}
