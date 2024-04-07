import otpGenerator from "otp-generator";

import { transporter } from "./transporter";

export const sendOTPtoEmail = async (email) => {
  if (!email) {
    throw new Error("Send OTP failed, please provide email.");
  }

  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  await transporter.sendMail({
    from: process.env.NEXT_PUBLIC_SMTP_USER,
    to: email,
    subject: "Your One-Time Password (OTP) Code",
    text: `Hello there,

      As requested, we have sent you a One-Time Password (OTP) code to the email address associated with your account. Please use the following OTP code to authenticate your account: \n
      
      OTP Code: ${otp}
      
      Please note that this OTP code is valid only for a limited time and should be used for authentication purposes only. Please do not share this code with anyone or disclose it on any website or through any other medium.
      
      If you did not request an OTP code or have any concerns regarding your account security, please contact our support team immediately.
      
      Thank you for using our service.
      
      Best regards,
      
      Thub Dev Team`,

    html: `<p>Hello there,</p>

      <p>As requested, we have sent you a One-Time Password (OTP) code to the email address associated with your account. Please use the following OTP code to authenticate your account:</p>
      
      <p>OTP Code: ${otp}</p>
      
      <p>Please note that this OTP code is valid only for a limited time and should be used for authentication purposes only. Please do not share this code with anyone or disclose it on any website or through any other medium.</p>
      
      <p>If you did not request an OTP code or have any concerns regarding your account security, please contact our support team immediately.</p>
      
      <p>Thank you for using our service.</p>
      
      <p>Best regards,</p>
      
      <p>Thub Dev Team</p>`,
  });

  return otp;
};
