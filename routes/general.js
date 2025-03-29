const express = require("express");
const generalRoute = express.Router();
const { getAllAccounts } = require("../controller/utility/accounts");
const { activateAccount } = require('../controller/utility/upgrade');
const { getWebSettings } = require('../controller/utility/general')
const { getUser } = require('../controller/utility/user')
const { getUserTransactions } = require('../controller/user/history')



// ------- General ---------//
generalRoute.get("/accounts", getAllAccounts);
generalRoute.post("/activate", activateAccount);
generalRoute.get("/websettings", getWebSettings);
generalRoute.get("/user/:userUid", getUser);
generalRoute.get("/transaction/:userUid", getUserTransactions);





module.exports = generalRoute;