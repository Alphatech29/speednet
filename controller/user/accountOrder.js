const { getOrdersByUser } = require('../../controller/utility/accountOrder');

const fetchUserOrders = async (req, res) => {
    try {
        const { userUid } = req.params;

        // Ensure userUid is provided
        if (!userUid) {
            return res.status(400).json({ error: "User UID is required" });
        }

        // Fetch orders
        const orders = await getOrdersByUser(userUid);

        if (!orders) {
            return res.status(500).json({ error: "Failed to fetch orders" });
        }

        return res.status(200).json({ success: true, data: orders });

    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { fetchUserOrders };
