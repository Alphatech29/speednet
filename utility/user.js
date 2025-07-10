const db = require("../model/db");

const getCurrentUser = async (req, res) => {
  try {
    const { userId } = req.user; 

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const [rows] = await db.execute("SELECT * FROM users WHERE uid = ? LIMIT 1", [userId]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = rows[0];
    delete user.password;

    return res.status(200).json(user);

  } catch (error) {
    console.error("Error fetching current user:", error.message || error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Insert new user into the 'users' table (uid excluded)

const insertUser = async ({ full_name, username, email, password, phone_number, country }) => {
  try {
    const sql = `
      INSERT INTO users (full_name, username, email, password, phone_number, country)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
      full_name,
      username,
      email,
      password,
      phone_number,
      country,
    ]);

    return result.insertId;
  } catch (error) {
    console.error("Error inserting user into database:", error.message || error);
    throw new Error("Internal server error while inserting user.");
  }
};




module.exports = { getCurrentUser, insertUser };
