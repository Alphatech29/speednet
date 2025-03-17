const express = require("express");
const generalRoute = express.Router();
const { getAllAccounts } = require("../controller/utility/accounts");



// ------- General ---------//
generalRoute.get("/accounts", getAllAccounts);





module.exports = generalRoute;