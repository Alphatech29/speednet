const {
  insertPage,
  getAllPages,
  deletePageById,
  editPageById,
} = require("../../../utility/page");

// Create Page
const createPage = async (req, res) => {
  try {
    const { title, slug, content } = req.body;

    if (!title || !slug || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, slug, and content are required.",
      });
    }

    const insertedId = await insertPage({ title, slug, content });

    return res.status(201).json({
      success: true,
      message: "Page created successfully.",
      data: {
        id: insertedId,
        title,
        slug,
        content,
      },
    });
  } catch (error) {
    console.error("Create Page Controller Error:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message || "Unexpected error",
    });
  }
};

// Get All Pages
const getPages = async (req, res) => {
  try {
    const pages = await getAllPages();

    return res.status(200).json({
      success: true,
      message: "Pages retrieved successfully.",
      data: pages,
    });
  } catch (error) {
    console.error("Get Pages Controller Error:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message || "Unexpected error",
    });
  }
};

// Delete Page by ID
const deletePage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "A valid page ID is required.",
      });
    }

    const affectedRows = await deletePageById(id);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Page not found or already deleted.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Page deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Page Controller Error:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message || "Unexpected error",
    });
  }
};

// ✅ Edit Page by ID
const editPage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, content } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "A valid page ID is required.",
      });
    }

    if (!title || !slug || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, slug, and content are required.",
      });
    }

    const result = await editPageById(id, { title, slug, content });

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "No page found with the provided ID.",
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message || "Page updated successfully.",
    });
  } catch (error) {
    console.error("Edit Page Controller Error:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message || "Unexpected error",
    });
  }
};

module.exports = {
  createPage,
  getPages,
  deletePage,
  editPage,
};
