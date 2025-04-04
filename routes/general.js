const express = require("express");
const generalRoute = express.Router();
const { getAllAccounts } = require("../controller/utility/accounts");
const { activateAccount } = require('../controller/utility/upgrade');
const { getWebSettings } = require('../controller/utility/general')
const { getUser } = require('../controller/utility/user')
const { getUserTransactions, getUserOrderHistory } = require('../controller/user/history');
const { collectOrder } = require("../controller/user/purchase");
const { fetchUserOrders } = require("../controller/user/accountOrder");
const { getAccounts } = require('../controller/user/accounts')


// ------- General ---------//
generalRoute.get("/accounts", getAllAccounts);
generalRoute.post("/activate", activateAccount);
generalRoute.get("/websettings", getWebSettings);
generalRoute.get("/user/:userUid", getUser);
generalRoute.get("/transaction/:userUid", getUserTransactions);
generalRoute.get("/orderhistory/:userUid", getUserOrderHistory);
generalRoute.get("/orders/:userUid", fetchUserOrders);
generalRoute.post("/purchase", collectOrder);
generalRoute.get('/get-accounts/:userUid', getAccounts);





module.exports = generalRoute;