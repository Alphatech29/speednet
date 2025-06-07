const db = require("../../../model/db");

const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.execute("SELECT * FROM users");


    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });

  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


module.exports = {
  getAllUsers,
};
