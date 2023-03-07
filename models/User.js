import mongoose from "mongoose";

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
  otp: {
    code: String,
    expiry: { type: Date, default: Date.now },
  },
  backupOtpCodes: [{ type: String }],
});

UserSchema.methods.verifyOtp = function verifyOtp(otp) {
  return this.otp === otp;
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
