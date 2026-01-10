const { 
  getCategoryCommissions,
  addCategoryCommission,
  updateCategoryCommission
} = require("../../../utility/darkshopCommission");

/**
 * GET /api/category-commissions
 */
async function getCategoryCommissionsController(req, res) {
  try {
    const commissions = await getCategoryCommissions();

    if (!commissions.length) {
      return res.status(404).json({
        success: false,
        message: "No category commissions found",
      });
    }

    return res.status(200).json({
      success: true,
      data: commissions,
    });
  } catch (error) {
    console.error("Controller error:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || error,
    });
  }
}

/**
 * POST /api/category-commissions
 */
async function addCategoryCommissionController(req, res) {
  try {
    const { category_id, commission_rate } = req.body;

    // Validate input
    if (!category_id || commission_rate === undefined) {
      console.log("Validation failed:", { category_id, commission_rate });
      return res.status(400).json({
        success: false,
        message: "category_id and commission_rate are required",
      });
    }

    const result = await addCategoryCommission(category_id, commission_rate);

    return res.status(201).json({
      success: true,
      message: "Category commission added successfully",
      data: result,
    });
  } catch (error) {
    console.error("Controller error:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || error,
    });
  }
}

/**
 * PUT /api/category-commissions/:category_id
 */
async function updateCategoryCommissionController(req, res) {
  try {
    const { category_id } = req.params;
    const { commission_rate } = req.body;

    // Validate input
    if (!category_id || commission_rate === undefined) {
      return res.status(400).json({
        success: false,
        message: "category_id and commission_rate are required",
      });
    }

    const result = await updateCategoryCommission(category_id, commission_rate);

    return res.status(200).json({
      success: true,
      message: "Category commission updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Controller error:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || error,
    });
  }
}

module.exports = {
  getCategoryCommissionsController,
  addCategoryCommissionController,
  updateCategoryCommissionController,
};
