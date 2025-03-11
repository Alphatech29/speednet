const express = require("express");
const authRoute = express.Router();
const register = require("../controller/auth/register");
const login  = require("../controller/auth/login");



// ------- Authentication ---------//
authRoute.post("/register", register);
authRoute.post("/login", login);





module.exports = authRoute;