const express = require("express");
const generalRoute = express.Router();
const { getAllAccounts, getAllPlatforms } = require("../utility/accounts");
const { activateAccount } = require('../utility/upgrade');
const { getWebSettings } = require('../utility/general');
const { getUser } = require('../utility/user');
const { fapshiWebhook, cryptomusWebhook } = require('../utility/webhook');
const { getUserTransactions, getUserOrderHistory } = require('../controller/user/history');
const { collectOrder } = require("../controller/user/purchase");
const { fetchUserOrders } = require("../controller/user/accountOrder");
const { getAccounts } = require('../controller/user/accounts');
const { accountCreation } = require('../controller/user/createAccount');
const { Deposit } = require('../controller/user/deposit');
const { getBanks, verifyAccount } = require('../utility/bankVerify');
const { getAllUsers } = require('../controller/admin/dashboard/users');
const { getAllAccount, getAllOrders } = require('../controller/admin/dashboard/accounts');
const { getAllWebSettings, updateWebSettings } = require("../controller/admin/dashboard/general");
const { apis } = require("../utility/apis");
const { WithdrawalRequest } = require("../controller/user/withdrawal");
const { getCountrys } = require("../utility/country");
const { fetchReferralsByReferrer } = require("../controller/user/referral");

// ------- General --------- //
generalRoute.get("/accounts", getAllAccounts);
generalRoute.get("/platforms", getAllPlatforms);
generalRoute.post("/create-account", accountCreation);
generalRoute.post("/activate", activateAccount);
generalRoute.get("/websettings", getWebSettings);
generalRoute.get("/user/:userUid", getUser);
generalRoute.get("/transaction/:userUid", getUserTransactions);
generalRoute.get("/orderhistory/:userUid", getUserOrderHistory);
generalRoute.get("/orders/:userUid", fetchUserOrders);


// ✅ Fixed `/apis` route
generalRoute.get("/apis", (req, res) => {
  res.json(apis);
});

generalRoute.post("/purchase", collectOrder);
generalRoute.get('/get-accounts/:userUid', getAccounts);
generalRoute.post("/pay", Deposit);
generalRoute.post("/fapshi/webhook", fapshiWebhook);
generalRoute.post("/cryptomus/webhook", cryptomusWebhook);
generalRoute.get("/bank", getBanks);
generalRoute.get("/country", getCountrys);
generalRoute.post("/verify-bank-account", verifyAccount);
generalRoute.post("/withdrawal", WithdrawalRequest);
generalRoute.get("/referrals/:userId", fetchReferralsByReferrer);

// ------- Admin --------- //
generalRoute.get("/users", getAllUsers);
generalRoute.get("/product", getAllAccount);
generalRoute.get("/order", getAllOrders);
generalRoute.get("/settings", getAllWebSettings);
generalRoute.put("/settings", updateWebSettings);

module.exports = generalRoute;
