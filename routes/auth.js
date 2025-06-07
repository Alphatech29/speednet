const express = require("express");
const authRoute = express.Router();
const register = require("../controller/auth/register");
const login  = require("../controller/auth/login");
const adminLogin  = require("../controller/admin/auth/login");



// ------- User Authentication ---------//
authRoute.post("/register", register);
authRoute.post("/login", login);
//--------Admin Authentication------//
authRoute.post("/adminLogin", adminLogin);





module.exports = authRoute;