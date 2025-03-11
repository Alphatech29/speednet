const express = require("express");
const authRoute = express.Router();
const register = require("../controller/auth/register");



// ------- Authentication ---------//
authRoute.post("/register", register);





module.exports = authRoute;