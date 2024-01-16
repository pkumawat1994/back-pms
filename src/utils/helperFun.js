export const generateOTP = () => Math.floor(100000 + Math.random() * 900000);
import bcrypt from "bcrypt";

export const genetateHashbpassword =async (password)=> await bcrypt.hash(password, 10);


