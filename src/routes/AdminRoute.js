import { Router } from "express";
import { addEmployee, adminForgotPassword, adminLogin, deleteEmployee, getEmployee, getSingleEmployee, resetPassword, searchEmployee, updateEmployee, verifyOtp } from "../controller/admin/AdminController.js";
import { verifyToken } from "../middleware/VerifyTokenAuth.js";

const adminRoutes = Router();

adminRoutes.post("/login",adminLogin);
adminRoutes.post("/add-employee",verifyToken,addEmployee);
adminRoutes.get("/get-employee",verifyToken,getEmployee);
adminRoutes.delete("/delete-employee/:id",verifyToken,deleteEmployee);
adminRoutes.put("/update-employee/:id",verifyToken,updateEmployee);getSingleEmployee
adminRoutes.get("/get-single-employee",verifyToken,getSingleEmployee);
adminRoutes.get("/search-employee/:key",verifyToken,searchEmployee);
adminRoutes.post("/forgot-password",adminForgotPassword);
adminRoutes.post("/verify-otp",verifyToken,verifyOtp);
adminRoutes.post("/reset-password",resetPassword);




export {adminRoutes}