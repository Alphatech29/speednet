const express = require("express");
const authRoute = express.Router();
const register = require("../controller/auth/register");
const {login, logout}  = require("../controller/auth/login");
const adminLogin  = require("../controller/admin/auth/login");
const adminUpdatePassword = require("../controller/admin/auth/password");
const authenticateToken = require("./../middleWare/authMiddleware");
const {changePassword} = require("../controller/auth/changePassword")
const verifyToken = require("./../middleWare/verifyToken");
const {forgotPassword} = require("../controller/auth/forgetPassword")
const {resetPassword} = require("../controller/auth/resetPassword")



// ------- User Authentication ---------//
authRoute.post("/register", register);
authRoute.post("/login", login);
authRoute.post("/logout", logout);
authRoute.post("/user/change-password", verifyToken, changePassword);
authRoute.post("/forgot-password", forgotPassword);
authRoute.post("/reset-password", verifyToken, resetPassword);
//--------Admin Authentication------//
authRoute.post("/adminLogin", adminLogin);
authRoute.put("/password-change", authenticateToken, adminUpdatePassword);





module.exports = authRoute;