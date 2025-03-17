const express = require("express");
const generalRoute = express.Router();
const { getAllAccounts } = require("../controller/utility/accounts");



// ------- General ---------//
generalRoute.get("/account", getAllAccounts);





module.exports = generalRoute;