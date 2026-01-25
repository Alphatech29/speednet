const { 
  createShortNotice, 
  getAllShortNotices, 
  updateShortNoticeById,
  deleteShortNoticeById 
} = require("../../../utility/shortNotice");

// Controller to create a short notice
async function createShortNoticeController(req, res) {
  try {
    const { content } = req.body;
    console.log("Request Body:", req.body);

    const result = await createShortNotice(content);
    console.log("Utility Result:", result);

    return res.status(result.code).json(result);
  } catch (error) {
    console.error("Create Short Notice Controller Error:", error);

    return res.status(500).json({
      success: false,
      code: 500,
      message: "Internal server error",
    });
  }
}

// Controller to get all short notices
async function getAllShortNoticesController(req, res) {
  try {
    const result = await getAllShortNotices();

    return res.status(result.code).json(result);
  } catch (error) {
    console.error("Get All Short Notices Controller Error:", error);

    return res.status(500).json({
      success: false,
      code: 500,
      message: "Internal server error",
    });
  }
}

async function updateShortNoticeController(req, res) {
  try {
    const { id } = req.params;
    const { content, status } = req.body;

    const result = await updateShortNoticeById(id, content, status);

    return res.status(result.code).json(result);
  } catch (error) {
    console.error("Update Short Notice Controller Error:", error);

    return res.status(500).json({
      success: false,
      code: 500,
      message: "Internal server error",
    });
  }
}

async function deleteShortNoticeController(req, res) {
  try {
    const { id } = req.params;

    const result = await deleteShortNoticeById(id);

    return res.status(result.code).json(result);
  } catch (error) {
    console.error("Delete Short Notice Controller Error:", error);

    return res.status(500).json({
      success: false,
      code: 500,
      message: "Internal server error",
    });
  }
}

module.exports = {
  createShortNoticeController,
  getAllShortNoticesController,
  updateShortNoticeController,
  deleteShortNoticeController,
};
