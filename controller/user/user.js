const { updateUser } = require("../../utility/userInfo");

const updateUserProfile = async (req, res) => {
  try {
    const uid = req.user?.userId;
    const file = req.file;

    if (!uid) {
      return res.status(401).json({ message: "Unauthorized: User ID missing." });
    }

    if (!file) {
      return res.status(400).json({ message: "No image file uploaded." });
    }

    const updatedData = {
      avatar: `/uploads/${file.filename}`,
    };

    const result = await updateUser(uid, updatedData);

    if (!result.success) {
      return res.status(500).json({ message: "Failed to update avatar." });
    }

    return res.status(200).json({
      success: true,
      message: "Avatar updated successfully.",
      data: result.data,
    });

  } catch (error) {
    console.error("Error updating avatar:", error.message);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { updateUserProfile };
