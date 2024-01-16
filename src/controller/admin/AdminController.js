import { GenrateTokenAuth } from "../../middleware/GenrateTokenAuth.js";
import { AdminModels } from "../../models/adminModals/Admin.js";
import { EmployeeModels } from "../../models/adminModals/Employee.js";
import HttpStatus, { NOT_FOUND } from "http-status-codes";
import { generateOTP, genetateHashbpassword } from "../../utils/helperFun.js";
import { transporter } from "../../config/Email.config.js";

const addEmployee = async (req, resp) => {
  const { name, email, password } = req.body;
  if (
    !name ||
    !email ||
    !password ||
    name.trim() === "" ||
    email.trim() === "" ||
    password.trim() === ""
  ) {
    return resp.status(HttpStatus.BAD_REQUEST).send({
      message: "Invalid input. Please provide valid name, email, and password.",
    });
  } else {
    try {
      const user = await EmployeeModels.findOne({ email: email });
      console.log(user, 12);
      if (user) {
        return resp
          .status(HttpStatus.CONFLICT)
          .send({ message: "User already exists" });
      } else {
let HashPassword=await genetateHashbpassword(password);

        let addResult = await EmployeeModels({email:email,password:HashPassword,name:name});
        let data = await addResult.save();
        resp
          .status(HttpStatus.CREATED)
          .send({ message: "User added successfully" });
      }
    } catch (error) {
      console.error(error);
      resp
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: "Internal Server Error" });
    }
  }
};

const getEmployee = async (req, resp) => {
  try {
    let employee =  await EmployeeModels.find({ isDeleted: false }).select("-password");
    resp
      .status(HttpStatus.OK)
      .send({ data: employee, message: "User fetched successfully" });
  } catch (errors) {
    resp
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: "Internal Server Error" });
  }
};

const deleteEmployee = async (req, resp) => {
  let idByParams = req.params.id;

  try {
    //HARD-DELETE--
    // let deleteResult = await EmployeeModels.findOneAndDelete({
    //   _id: idByParams,
    // });

    //SOFT-DELETE------
    let deleteResult = await EmployeeModels.findByIdAndUpdate(
      idByParams,
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    );

    console.log(deleteResult, "deleteResult");
    if (deleteResult) {
      resp
        .status(HttpStatus.OK)
        .send({ message: "delete Employee successfully" });
    } else {
      resp.status(HttpStatus.OK).send({ message: "Employee not found " });
    }
  } catch (error) {
    resp
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: "Internal Server Error" });
  }
};

const updateEmployee = async (req, resp) => {
  let UpdateIdByParams = req.params.id;
  let UpdatedData = req.body;
  console.log(UpdateIdByParams);
  let updateResult = await EmployeeModels.updateOne(
    { _id: UpdateIdByParams },
    { $set: UpdatedData }
  );
  console.log(updateResult, 48);
  if (updateResult.modifiedCount == 1) {
    resp
      .status(HttpStatus.OK)
      .send({ message: "Employee updated successfully" });
  }
  console.log(updateResult, 455);
};

const searchEmployee = async (req, resp) => {
  try {
    const userSerachData = await EmployeeModels.find({
      $or: [
        { name: { $regex: req.params.key } },
        { email: { $regex: req.params.key } },
      ],
    });
    console.log(userSerachData, 154);
    if (userSerachData) {
      resp
        .status(HttpStatus.OK)
        .send({ user: userSerachData, message: "user search successfult" });
    }
    // else {
    //   resp.status(HttpStatus.NOT_FOUND).send({ message: "user  Not Found" });
    // }
  } catch (error) {
    resp
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: "Internal Server Error" });
  }
};

const adminLogin = async (req, resp) => {
  const { email, password } = req.body;
// console.log(data,"dataat")


  console.log(147, typeof req.body.password);
  try {
    const loginEmployeeData = await AdminModels.findOne({
      email: email,
      password: password,
    });
    if (loginEmployeeData) {
      let successMessage = "Login Successfully";
      let errorMessgae = "Login Error";
      GenrateTokenAuth(loginEmployeeData, successMessage, errorMessgae, resp);
    } else {
      resp
        .status(HttpStatus.UNAUTHORIZED)
        .send({ message: "Invalid email or password" });
    }
  } catch (err) {
    resp
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: "Internal Server Error" });
  }
};

const getSingleEmployee = async (req, resp) => {
  try {
    const user = await EmployeeModels.findOne({
      _id: req.body.employee_Id,
    }).select("-password");
    if (user) {
      resp
        .status(HttpStatus.OK)
        .send({ employee: user, message: "employee fetch successfully" });
    }
  } catch (error) {
    resp
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: "Internal Server Error" });
  }
};

const adminForgotPassword = async (req, resp) => {
  const { email } = req.body;
  try {
    const forgotPasswordResult = await AdminModels.findOne({
      email: email,
    }).select("-password");

    const otp = generateOTP();
    const mailOptions = {
      from: "parmanandkumawat.vhits@gmail.com",
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is: ${otp}`,
    };
    if (forgotPasswordResult) {
      const updatedData = await AdminModels.findByIdAndUpdate(
        { _id: forgotPasswordResult?._id },
        { $set: { otp: otp } },
        { new: true, select: "-password -otp" } //remove otp and password from response
      );
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return resp.status(500).json({ error: "Error sending OTP email" });
        }
        GenrateTokenAuth(updatedData, "generate otp send", "otp falide", resp);
      });
    } else {
      resp.send({ message: "User Not Fount ! Please Enter Valid Email" });
    }
  } catch (err) {
    console.log(err);
    resp
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: "Internal Server Error" });
  }
};

const verifyOtp = async (req, resp) => {
  const { user_Id, otp } = req.body;
  try {
    let adminResult = await AdminModels.findOne({ _id: user_Id });
    console.log(adminResult, 123);
    if (adminResult) {
      if (adminResult.otp === otp) {
        resp
          .status(HttpStatus.OK)
          .send({ user: adminResult, message: "Otp Verify Successfully" });
      } else {
        resp
          .status(HttpStatus.NOT_FOUND)
          .send({ message: "Otp Invalid Please Enter Valid otp" });
      }
    }
  } catch (error) {
    resp
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: "Internal Server Error" });
  }
  console.log(req.body.user_Id);
  console.log(req.body.otp);
};

const resetPassword = async (req, resp) => {
  const { UserId, new_Password, password } = req.body;
  try {
    let adminResult = await AdminModels.findOne({ _id: UserId });
    console.log(adminResult, 123);

    if (adminResult.password === password) {
      let updateResult = await AdminModels.updateOne(
        { _id: adminResult._id },
        { $set: { password: new_Password } }
      );

      if (updateResult) {
        resp.status(HttpStatus.OK).send({
          message: "Password update successfully",
        });
      }
    } else {
      resp
        .status(HttpStatus.NOT_FOUND)
        .send({ message: "Old password is wrong !" });
    }

    // if (adminResult) {
    //   if (adminResult.otp === otp) {
    //     resp.status(HttpStatus.OK).send({ message: "Password successfully updated" });
    //   } else {
    //     resp
    //       .status(HttpStatus.NOT_FOUND)
    //       .send({ message: "Pasword Not Update !" });
    //   }
    // }
  } catch (error) {
    console.log(error);
    resp
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: "Internal Server Error" });
  }
};

export {
  addEmployee,
  getEmployee,
  deleteEmployee,
  updateEmployee,
  searchEmployee,
  adminLogin,
  getSingleEmployee,
  adminForgotPassword,
  verifyOtp,
  resetPassword,
};
