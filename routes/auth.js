const express = require("express");
const authRoute = express.Router();
const register = require("../controller/auth/register");
const login  = require("../controller/auth/login");
const adminLogin  = require("../controller/admin/auth/login");
const adminUpdatePassword = require("../controller/admin/auth/password");
const authenticateToken = require("../controller/middleWare/authMiddleware");



// ------- User Authentication ---------//
authRoute.post("/register", register);
authRoute.post("/login", login);
//--------Admin Authentication------//
authRoute.post("/adminLogin", adminLogin);
authRoute.put("/password-change", authenticateToken, adminUpdatePassword);





module.exports = authRoute;