const express = require("express");
const generalRoute = express.Router();
const { getAllAccounts } = require("../utility/accounts");
const { activateAccount } = require('../utility/upgrade');
const { getWebSettings } = require('../utility/general')
const { getUser } = require('../utility/user')
const { Webhook } = require('../utility/webhook')
const { getUserTransactions, getUserOrderHistory } = require('../controller/user/history');
const { collectOrder } = require("../controller/user/purchase");
const { fetchUserOrders } = require("../controller/user/accountOrder");
const { getAccounts } = require('../controller/user/accounts')
const { Deposit } = require('../controller/user/deposit')


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
generalRoute.post("/pay", Deposit);
generalRoute.post("/webhook", Webhook);





module.exports = generalRoute;