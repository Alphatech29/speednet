const { getUserDetailsByUid, updateUserBalance } = require("../utility/userInfo");
const { getProductDetailsById } = require("../utility/product");
const { storeOrder, storeOrderHistory } = require("../utility/accountOrder");
const { generateUniqueRandomNumber } = require("../utility/random");
const { createTransactionHistory } = require("../utility/history");
const { creditEscrow } = require('../utility/escrow');

const collectOrder = async (req, res) => {
    try {
        const { userId, products, totalAmount } = req.body;
        const userUid = String(userId);

        if (!userUid || !Array.isArray(products) || products.length === 0 || totalAmount === undefined) {
            return res.status(400).json({ success: false, message: "Invalid request: Ensure userId, products array, and totalAmount are provided correctly." });
        }

        const amountToDeduct = parseFloat(totalAmount);
        if (isNaN(amountToDeduct) || amountToDeduct <= 0) {
            return res.status(400).json({ success: false, message: "Invalid amount: totalAmount must be a positive number." });
        }

        const userDetails = await getUserDetailsByUid(userUid);
        if (!userDetails) {
            return res.status(404).json({ success: false, message: "User not found. Please check the user ID." });
        }

        const accountBalance = parseFloat(userDetails.account_balance);
        if (isNaN(accountBalance) || accountBalance < amountToDeduct) {
            return res.status(400).json({ success: false, message: "Insufficient balance. Please add funds to your wallet." });
        }

        let productDetailsArray = [];
        try {
            productDetailsArray = await Promise.all(
                products.map(async (productId) => {
                    const productDetails = await getProductDetailsById(productId);
                    if (!productDetails) throw new Error(`Product with ID ${productId} not found`);
                    return productDetails;
                })
            );
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }

        let totalProductAmount = 0;
        productDetailsArray.forEach(productDetails => {
            totalProductAmount += parseFloat(productDetails.price) || 0;
        });

        const newBalance = (accountBalance - amountToDeduct).toFixed(2);
        const updateSuccess = await updateUserBalance(userUid, newBalance);
        if (!updateSuccess || updateSuccess.affectedRows === 0) {
            return res.status(500).json({ success: false, message: "Failed to update user balance. Please try again later." });
        }

        await createTransactionHistory(userUid, amountToDeduct, "Account Purchased", "Completed");
        const orderNo = generateUniqueRandomNumber(6);

        let failedOrders = [];
        let successfulOrders = [];
        let escrowData = [];

        await Promise.all(
            productDetailsArray.map(async (productDetails) => {
                try {
                    let orderData = {
                        account_id: productDetails.id ?? null,
                        seller_id: productDetails.user_id ?? null,
                        buyer_id: userUid,
                        order_no: orderNo,
                        title: productDetails.title ?? null,
                        platform: productDetails.platform ?? null,
                        email: productDetails.email ?? null,
                        recovery_email: productDetails.recovery_email ?? null,
                        username: productDetails.username ?? null,
                        password: productDetails.password ?? null,
                        description: productDetails.description ?? null,
                        two_factor_enabled: productDetails.two_factor_enabled ?? false,
                        two_factor_description: productDetails.two_factor_description ?? null,
                        price: productDetails.price ?? 0,
                        payment_status: "Completed",
                    };

                    Object.keys(orderData).forEach((key) => {
                        if (orderData[key] === undefined) orderData[key] = null;
                    });
                    const orderId = await storeOrder(orderData);
                    if (!orderId) {
                        failedOrders.push(productDetails.id);
                    } else {
                        successfulOrders.push(productDetails.id);
                        escrowData.push({
                            seller_id: productDetails.user_id,
                            amount: productDetails.price,
                            product_id: productDetails.id,
                            buyer_id: userUid,
                        });
                    }
                } catch (err) {
                    failedOrders.push(productDetails.id);
                }
            })
        );

        // ✅ Store order history once
        if (successfulOrders.length > 0) {
            const orderHistoryData = {
                seller_id: productDetailsArray[0].user_id, 
                order_no: orderNo,
                order_type: "Account Relinquished", 
                amount: totalProductAmount,
                status: "Completed",
            };
            
            const orderHistoryId = await storeOrderHistory(orderHistoryData);
            if (!orderHistoryId) {
                console.error("Failed to store order history for order:", orderNo);
            }

            // ✅ Wait for 2 seconds before running escrow
            setTimeout(async () => {
                await creditEscrow(escrowData);
            }, 2000); // 2 seconds delay
        }

        if (failedOrders.length > 0) {
            return res.status(500).json({
                success: false,
                message: `Failed to process orders for some products: ${failedOrders.join(", " )}.`,
                failedOrders,
                successfulOrders,
            });
        }

        return res.status(200).json({
            success: true,
            message: `Order Completed Successfully - Order No: ${orderNo}`,
            order: {
                userUid,
                products: productDetailsArray,
                totalAmount: totalProductAmount,
                newBalance,
                order_no: orderNo,
            },
        });
    } catch (error) {
        console.error("Error processing order:", error);
        return res.status(500).json({ success: false, message: "Internal server error. Please try again later.", error: error.message || "Unknown error occurred." });
    }
};

module.exports = { collectOrder };
