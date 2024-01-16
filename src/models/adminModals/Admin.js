import mongoose from "mongoose";

const adminSchemas = mongoose.Schema(
  {
    name: {
      type: String,
      require: false,
      trim:true
    },
    email: {
      type: String,
      require: false,
      trim:true
    },
    mobile_no: {
      type: Number,
      require: false,
      trim:true
    },
    password: {
      type: String,
      require: false,
      trim:true
    },
    otp:{
      type: String,
      default:null,
      trim:true
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
export const AdminModels = mongoose.model("admins", adminSchemas);
