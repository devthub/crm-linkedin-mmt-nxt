import { useState } from "react";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

const OtpForm = ({ onVerifyOTP, isSubmittingOTP }) => {
  const [otp, setOtp] = useState("");

  return (
    <form
      className="card"
      onSubmit={async (e) => {
        e.preventDefault();
        onVerifyOTP(otp);
      }}
    >
      <div className="flex flex-column align-items-center justify-content-center">
        <div className="flex flex-column align-items-center justify-content-center my-2">
          <h2 className="text-xl"> One-Time Password</h2>
          <p className="text-sm">
            Please enter the 6-digits code we sent to your email
          </p>
        </div>
        <OtpInput
          value={otp}
          onChange={(val) => {
            setOtp(val);
          }}
        />
        <Button
          className="btn btn-primary mt-4"
          type="submit"
          label={isSubmittingOTP ? "Submitting..." : "Submit"}
          loading={isSubmittingOTP}
          icon="pi pi-send"
          iconPos="right"
        />
      </div>
    </form>
  );
};

export default OtpForm;

// https://reacthustle.com/blog/how-to-build-a-react-otp-input-using-daisyui
export const OtpInput = ({
  size = 6,
  validationPattern = /[0-9]{1}/,
  value,
  onChange,
  ...restProps
}) => {
  const inputStyle = {
    width: "40px",
    height: "40px",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "1.5em",
    color: "#5a5a5a",
  };

  const handleInputChange = (e, index) => {
    e.preventDefault();
    const elem = e.target;
    const val = e.target.value;

    // check if the value is valid
    if (!validationPattern.test(val) && val !== "") return;

    // change the value of the upper state using onChange
    const valueArr = value.split("");
    valueArr[index] = val;
    const newVal = valueArr.join("").slice(0, 6);
    onChange(newVal);

    //focus the next element if there's a value
    if (val) {
      const next = elem.nextElementSibling;
      next?.focus();
    }
  };

  const handleKeyUp = (e) => {
    e.preventDefault();
    const current = e.currentTarget;
    if (e.key === "ArrowLeft" || e.key === "Backspace") {
      const prev = current.previousElementSibling;
      prev?.focus();
      prev?.setSelectionRange(0, 1);
      return;
    }

    if (e.key === "ArrowRight") {
      const prev = current.nextSibling;
      prev?.focus();
      prev?.setSelectionRange(0, 1);
      return;
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const val = e.clipboardData.getData("text").substring(0, size);
    onChange(val);
  };

  // Create an array based on the size.
  const arr = new Array(size).fill(0);

  return (
    <div className="flex gap-2">
      {/* Map through the array and render input components */}
      {arr.map((_, index) => {
        return (
          <InputText
            key={index}
            {...restProps}
            autoFocus={index === 0 ? true : false}
            /**
             * Add some styling to the input using daisyUI + tailwind.
             * Allows the user to override the className for a different styling
             */
            // className={className || `input input-bordered px-0 text-center`}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern={validationPattern.source}
            maxLength={6}
            value={value.at(index) ?? ""}
            style={inputStyle}
            onChange={(e) => handleInputChange(e, index)}
            onKeyUp={handleKeyUp}
            onPaste={handlePaste}
          />
        );
      })}
    </div>
  );
};
