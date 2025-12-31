import axios from "axios";

export const getDarkCategories = async () => {
  try {
    const response = await axios.get("/general/dark-categories", {
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
    const response = await axios.get("/general/dark-products", {
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
          manual: product.manual || "",
          price: product.price || "0",
          minimum_order: product.minimum_order || 1,
          quantity: product.quantity || 0,
          purchase_counter: product.purchase_counter || 0,
          view: product.view || 0,
          is_manual_order_delivery: product.is_manual_order_delivery || 0,
          url: product.url || "",
          replacement_terms_public: product.replacement_terms_public || "",
          guarantee_time_seconds: product.guarantee_time_seconds || 0,
          rating: product.rating || null,
          invalid_items_percent: product.invalid_items_percent || null,
          group: product.group
            ? {
                id: product.group.id,
                category_id: product.group.category_id,
                additional_category_id: product.group.additional_category_id,
                name: product.group.name,
              }
            : null,
          category: product.category
            ? {
                id: product.category.id,
                name: product.category.name,
                icon: product.category.icon || "",
              }
            : null,
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
