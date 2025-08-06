const express = require("express");
const generalRoute = express.Router();
const { getAllAccounts, getAllPlatforms } = require("../utility/accounts");
const { activateAccount } = require("../utility/upgrade");
const { getWebSettings } = require("../utility/general");
const { getCurrentUser } = require("../utility/user");
const { fapshiWebhook, cryptomusWebhook } = require("../utility/webhook");
const {
  getUserTransactions,
  getUserOrderHistory,
} = require("../controller/user/history");
const { collectOrder } = require("../controller/user/purchase");
const { report, getMyReports } = require("../controller/user/report");
const { fetchUserOrders } = require("../controller/user/accountOrder");
const { getAccounts } = require("../controller/user/accounts");
const { accountCreation } = require("../controller/user/createAccount");
const { Deposit } = require("../controller/user/deposit");
const { getBanks, verifyAccount } = require("../utility/bankVerify");
const { getAllUsers, getUserById, updateUserById } = require("../controller/admin/dashboard/users");
const {
  getAllAccount,
  getAllOrders,getAccountById, updateProductById
} = require("../controller/admin/dashboard/accounts");
const {
  getAllWebSettings,
  updateWebSettings,
} = require("../controller/admin/dashboard/general");
const { apis } = require("../utility/apis");
const { WithdrawalRequest } = require("../controller/user/withdrawal");
const { getCountrys } = require("../utility/country");
const { fetchReferralsByReferrer } = require("../controller/user/referral");
const verifyToken = require("./../middleWare/verifyToken");
const {
  addPlatform,
  fetchPlatforms,deletePlatformByIdHandler,editPlatformById
} = require("../controller/admin/dashboard/platform");
const upload = require("../utility/multerConfig");
const {
  airtimePurchase,
  getDataVariations,
  dataPurchase,
  internationalPurchase,
} = require("../controller/user/vtpass");
const {
  getInternationalCountries,
  fetchInternationalProductTypes,
  fetchInternationalOperators,
  fetchInternationalVariations,
} = require("../controller/user/vtpassInternational");
const { setTransactionPin } = require("../controller/user/TransactionPin");
const { updateUserProfile } = require("../controller/user/user");
const { getAllWithdrawal , updateWithdrawalStatus } = require("../controller/admin/dashboard/withdrawal");
const { getAllNotices, createNotice,updateNoticeById } = require("../controller/admin/dashboard/notice");
const { getAllTransactions,getAllMerchantTransactions,getAllAccountOrders } = require("../controller/admin/dashboard/histroy");
const { getAllReportsController,updateReportStatusController } = require("../controller/admin/dashboard/report");
const transfer = require("../controller/admin/dashboard/transfer");
const { createPage, getPages, deletePage, editPage } = require("../controller/admin/dashboard/page");
const { getPagesBySlug } = require("../controller/user/page");
const {fetchOnlineSimCountries, fetchOnlineSimServices, fetchOnlineSimServicesWithPricesByCountry} = require("../controller/user/sms-service");
const { fetchAllPackages, NordPurchase, fetchAllNordHistory } = require("../controller/user/nordVpn");


// ------- General --------- //
generalRoute.get("/accounts", getAllAccounts);
generalRoute.get("/platforms", getAllPlatforms);
generalRoute.get("/websettings", getWebSettings);
generalRoute.get("/settings", getAllWebSettings);
generalRoute.put(
  "/settings",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "favicon", maxCount: 1 },
  ]),
  updateWebSettings
);

// --------- User route --------- //
generalRoute.get("/user", verifyToken, getCurrentUser);
generalRoute.put(
  "/user/update",
  verifyToken,
  upload.single("image"),
  updateUserProfile
);
generalRoute.get("/transaction/:userUid", getUserTransactions);
generalRoute.get("/orderhistory/:userUid", getUserOrderHistory);
generalRoute.get("/orders/:userUid", fetchUserOrders);
generalRoute.post("/create-account", accountCreation);
generalRoute.post("/activate", activateAccount);
generalRoute.post("/airtime/Purchase", verifyToken, airtimePurchase);
generalRoute.post("/data/Purchase", verifyToken, dataPurchase);
generalRoute.get("/data-variations/:serviceID", getDataVariations);
generalRoute.get("/InternationalAirtime/countries", getInternationalCountries);
generalRoute.get(
  "/InternationalAirtime/product-types/:countryCode",
  fetchInternationalProductTypes
);
generalRoute.get(
  "/InternationalAirtime/operators/:countryCode/:productTypeId",
  fetchInternationalOperators
);
generalRoute.get(
  "/InternationalAirtime/variations/:operatorId/:productTypeId",
  fetchInternationalVariations
);
generalRoute.post("/internationalPurchase", verifyToken, internationalPurchase);
generalRoute.post("/set-pin", verifyToken, setTransactionPin);

// Fixed `/apis` route
generalRoute.get("/apis", (req, res) => {
  res.json(apis);
});

generalRoute.post("/purchase", collectOrder);
generalRoute.post("/purchase/report", verifyToken, report);
generalRoute.get("/purchase/report", verifyToken, getMyReports);
generalRoute.get("/get-accounts/:userUid", getAccounts);
generalRoute.post("/pay", Deposit);
generalRoute.post("/fapshi/webhook", fapshiWebhook);
generalRoute.post("/cryptomus/webhook", cryptomusWebhook);
generalRoute.get("/bank", getBanks);
generalRoute.get("/country", getCountrys);
generalRoute.post("/verify-bank-account", verifyAccount);
generalRoute.post("/withdrawal", WithdrawalRequest);
generalRoute.get("/referrals/:userId", fetchReferralsByReferrer);
generalRoute.get("/page/:slug", getPagesBySlug);
// Existing routes
generalRoute.get("/sms/country", fetchOnlineSimCountries);
//generalRoute.get("/sms/services", fetchOnlineSimServices);
//generalRoute.get("/sms/services-country", fetchSmsManServicesByCountry);
//generalRoute.get("/sms/services-with-prices", fetchOnlineSimServicesWithPricesByCountry);
generalRoute.get("/nord-plan", fetchAllPackages);
generalRoute.post("/nord-purchase", verifyToken, NordPurchase);
generalRoute.get("/nord-history", fetchAllNordHistory);

// ------- Admin --------- //
generalRoute.get("/users", getAllUsers);
generalRoute.get("/users/:uid", getUserById);
generalRoute.put("/users/:uid", updateUserById);
generalRoute.get("/product", getAllAccount);
generalRoute.get("/product/:id", getAccountById);
generalRoute.put("/product/:id", updateProductById);
generalRoute.get("/order", getAllOrders);
generalRoute.post("/platform", upload.single("image"), addPlatform);
generalRoute.get("/platform", fetchPlatforms);
generalRoute.delete("/platform/:id", deletePlatformByIdHandler);
generalRoute.put("/platform/:id", upload.single("image"), editPlatformById);
generalRoute.get("/withdrawal", getAllWithdrawal);
generalRoute.put("/withdrawal/:id", updateWithdrawalStatus);
generalRoute.get("/notice", getAllNotices)
generalRoute.post("/notice/create", createNotice)
generalRoute.put("/notice/:id", updateNoticeById)
generalRoute.get("/transaction", getAllTransactions)
generalRoute.get("/merchant", getAllMerchantTransactions)
generalRoute.get("/account_order", getAllAccountOrders)
generalRoute.get("/all-report", getAllReportsController)
generalRoute.put("/update-report/:reportId", updateReportStatusController)
generalRoute.post("/transfer/funds", transfer)
generalRoute.post("/create-page", createPage)
generalRoute.get("/get-pages", getPages)
generalRoute.delete('/delete-page/:id', deletePage);
generalRoute.put("/page/:id", editPage);

module.exports = generalRoute;
