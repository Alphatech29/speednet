const { getUserDetailsByUid, updateUser } = require("../../utility/userInfo");
const bcrypt = require("bcryptjs");

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const uid = req.user?.userId;

    if (!uid || !oldPassword || !newPassword) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Get current user details
    const user = await getUserDetailsByUid(uid);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    const updateResult = await updateUser(uid, { password: hashedPassword });

    if (!updateResult.success) {
      return res.status(500).json({ message: "Failed to update password" });
    }

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { changePassword };
