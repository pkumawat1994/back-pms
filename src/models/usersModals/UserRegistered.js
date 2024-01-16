import mongoose from "mongoose";

const UsersRegisterdSchemas = mongoose.Schema(
  {
    name: {
      type: String,
      require: false,
    },
    email: {
      type: String,
      require: false,
    },
    mobile_no: {
      type: Number,
      require: false,
    },
    password: {
      type: String,
      require: false,
    },
    age: {
      type: Number,
      require: false,
    },
    gender: {
      type: String,
      require: false,
    },
    otp:{
      type: String,
      default:null
    },
    isActive: {
      type: Boolean,
      require: false,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      require: false,
      default: false,
    },
  },
  { timestamps: true }
);
export const UserModels = mongoose.model("users", UsersRegisterdSchemas);