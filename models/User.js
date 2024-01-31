import mongoose from "mongoose";

const AccessTokenSchema = new mongoose.Schema(
  {
    access_token: String,
    token_type: String,
    expires_in: Number,
    refresh_token: String,
    scope: String,
    userType: String,
    companyId: String,
    locationId: String,
    userId: String,
  },
  {
    strict: false,
  }
);

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  first_name: String,
  last_name: String,
  deactivated: String,
  user_id: String,
  li_link: String,
  position: String,
  last_work_text: String,
  country: String,
  activation_id: String,
  otp: String,
  backupOtpCodes: [{ type: String }],
  ghlOAuth: AccessTokenSchema,
});

UserSchema.methods.verifyOtp = function verifyOtp(otp) {
  return this.otp === otp;
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
