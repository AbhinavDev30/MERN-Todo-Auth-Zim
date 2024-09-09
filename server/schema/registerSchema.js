import mongoose from "mongoose";

const registerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "non-binary", "other"],
    },
  },
  { timestamps: true }
);

const register = mongoose.model("register", registerSchema);
export default register;
