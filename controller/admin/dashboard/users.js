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


const getUserById = async (req, res) => {
  const { uid } = req.params;

  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE uid = ?", [uid]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0],
    });

  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateUserById = async (req, res) => {
  const { uid } = req.params;
  const fields = req.body;

  try {
    const updateFields = Object.keys(fields)
      .map((key) => `${key} = ?`)
      .join(", ");

    const values = Object.values(fields);

    const [result] = await db.execute(
      `UPDATE users SET ${updateFields} WHERE uid = ?`,
      [...values, uid]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found or no changes made",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


module.exports = {
  getAllUsers,
  getUserById,
  updateUserById
};
