import axios from "axios";

export const getDarkCategories = async () => {
  try {
    const response = await axios.get("/general/categories-with-groups", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Safely extract the categories array
    const categories = Array.isArray(response.data?.data)
      ? response.data.data.map((cat) => ({
          id: cat.id,
          name: cat.name || "Unnamed Category",
          icon: cat.icon || "",
          groups: Array.isArray(cat.groups) ? cat.groups : [],
        }))
      : [];

    return {
      success: true,
      message: "Dark categories retrieved successfully!",
      data: categories,
    };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while fetching dark categories.";

    return {
      success: false,
      message,
      error: error.response?.data || null,
    };
  }
};



export const getDarkProducts = async () => {
  try {
    const response = await axios.get("/general/darkshop-all-products", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const products = Array.isArray(response.data?.data)
      ? response.data.data.map((product) => ({
          id: product.id,
          name: product.name || "Unnamed Product",
          miniature: product.miniature || "",
          description: product.description || "",
          price: product.price || "0",
          price_rub: product.price_rub || "0",
          quantity: product.quantity || 0,
          view: product.view || 0,
          rating: product.rating || null,
          group_id: product.group_id || null,
          seller: product.seller || null,
          avatar: product.avatar || null,
          category_id: product.category_id || null,
          category_name: product.category_name || "Uncategorized",
          is_manual_order_delivery: product.is_manual_order_delivery || 0,
          url: product.url || "",
          guarantee_time_seconds: product.guarantee_time_seconds || 0,
          created_at: product.created_at,
          updated_at: product.updated_at,
        }))
      : [];

    return {
      success: true,
      message: "Dark products retrieved successfully!",
      data: products,
    };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while fetching dark products.";

    return {
      success: false,
      message,
      error: error.response?.data || null,
    };
  }
};




// Fetch all category commissions
export const getCategoryCommissionsAPI = async () => {
  try {
    const response = await axios.get("/general/category-commission", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const commissions = Array.isArray(response.data?.data)
      ? response.data.data.map((item) => ({
          category_id: item.category_id,
          category_name: item.category_name || "Unnamed Category",
          commission: item.commission || 0,
        }))
      : [];

    return {
      success: true,
      message: "Category commissions retrieved successfully!",
      data: commissions,
    };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while fetching category commissions.";

    return {
      success: false,
      message,
      error: error.response?.data || null,
    };
  }
};

// Add a new category commission
export const addCategoryCommissionAPI = async ({ categoryId, commissionRate }) => {
  try {
    // Validate input before sending
    if (!categoryId) {
      return {
        success: false,
        message: "Please select a category.",
        data: null,
      };
    }

    if (commissionRate === undefined || commissionRate === null || commissionRate === "") {
      return {
        success: false,
        message: "Please enter a commission rate.",
        data: null,
      };
    }

    const rate = parseFloat(commissionRate);
    if (isNaN(rate) || rate < 0) {
      return {
        success: false,
        message: "Commission rate must be a valid positive number.",
        data: null,
      };
    }

    // Send API request with correct field names
    const response = await axios.post(
      "/general/category-commission",
      {
        category_id: categoryId,
        commission_rate: rate
      },
      { headers: { "Content-Type": "application/json" } }
    );

    return {
      success: true,
      message: response.data?.message || "Category commission added successfully!",
      data: response.data?.data || null,
    };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while adding category commission.";

    return {
      success: false,
      message,
      error: error.response?.data || null,
    };
  }
};


// Update a category commission by category ID
export const updateCategoryCommissionAPI = async ({ categoryId, commissionRate }) => {
  try {
    // Validate input
    if (!categoryId) {
      return {
        success: false,
        message: "Category ID is required.",
        data: null,
      };
    }

    if (commissionRate === undefined || commissionRate === null || commissionRate === "") {
      return {
        success: false,
        message: "Commission rate is required.",
        data: null,
      };
    }

    const rate = parseFloat(commissionRate);
    if (isNaN(rate) || rate < 0) {
      return {
        success: false,
        message: "Commission rate must be a valid positive number.",
        data: null,
      };
    }

    // Send PUT request to update commission
    const response = await axios.put(
      `/general/category-commission/${categoryId}`,
      { commission_rate: rate },
      { headers: { "Content-Type": "application/json" } }
    );

    return {
      success: true,
      message: response.data?.message || "Category commission updated successfully!",
      data: response.data?.data || null,
    };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while updating category commission.";

    return {
      success: false,
      message,
      error: error.response?.data || null,
    };
  }
};



// Fetch a single darkshop product by ID
export const fetchDarkShopProductById = async (id) => {
  try {

      console.log("Fetching product with ID:", id); // <-- Log the ID here

    if (!id) {
      return {
        success: false,
        message: "Product ID is required.",
        data: null,
      };
    }

    const response = await axios.get(`/general/darkshop-products/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const productData = response.data?.data;

    if (!productData) {
      return {
        success: false,
        message: "Product not found.",
        data: null,
      };
    }

    // Map product fields safely
    const product = {
      id: productData.id,
      name: productData.name || "Unnamed Product",
      miniature: productData.miniature || "",
      description: productData.description || "",
      price: productData.price || "0",
      quantity: productData.quantity || 0,
      view: productData.view || 0,
      rating: productData.rating || null,
      group_id: productData.group_id || null,
      category_id: productData.category_id || null,
      is_manual_order_delivery: productData.is_manual_order_delivery || 0,
      url: productData.url || "",
      guarantee_time_seconds: productData.guarantee_time_seconds || 0,
      created_at: productData.created_at,
      updated_at: productData.updated_at,
    };

    return {
      success: true,
      message: "Product retrieved successfully!",
      data: product,
    };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while fetching the product.";

    return {
      success: false,
      message,
      error: error.response?.data || null,
    };
  }
};

export const updateDarkShopProductAPI = async ({ id, name, description }) => {
  try {
    // Basic validation before request
    if (!id) {
      return {
        success: false,
        message: "Product ID is required.",
        data: null,
      };
    }

    if (!name || !description) {
      return {
        success: false,
        message: "Name and description are required.",
        data: null,
      };
    }

    const response = await axios.put(
      `/general/darkshop-products/${id}`,
      {
        name: name.trim(),
        description: description.trim(),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      message: response.data?.message || "Product updated successfully!",
      data: response.data?.data || null,
    };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while updating the product.";

    return {
      success: false,
      message,
      error: error.response?.data || null,
    };
  }
};
