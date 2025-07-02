import axios from "axios";

export const getAllProducts = async () => {
  try {
    const response = await axios.get(`/general/product`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Since the backend returns an array with a single object
    const responseData = Array.isArray(response.data) ? response.data[0] : response.data;

    const products = responseData?.data || [];

    const result = {
      success: true,
      message: "Products retrieved successfully!",
      count: responseData?.count || products.length,
      data: products,
    };

    return result;
  } catch (error) {
    const err = {
      success: false,
      message:
        error.response?.data?.message || "An error occurred while fetching products.",
      error: error.response?.data || error.message,
    };

 
    return err;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`/general/product/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const productData = Array.isArray(response.data) ? response.data[0] : response.data;

    const result = {
      success: true,
      message: 'Product retrieved successfully!',
      data: productData?.data || productData, 
    };

    return result;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || 'An error occurred while fetching the product.',
      error: error.response?.data || error.message,
    };
  }
};


export const updateProductById = async (id, payload) => {
  try {
    const response = await axios.put(`/general/product/${id}`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const updatedData = Array.isArray(response.data) ? response.data[0] : response.data;

    return {
      success: true,
      message: updatedData?.message || 'Product updated successfully!',
      data: updatedData?.data || updatedData,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || 'An error occurred while updating the product.',
      error: error.response?.data || error.message,
    };
  }
};



// This function retrieves all orders from the database, including seller and buyer details.
export const getAllOrders = async () => {
  try {
    const response = await axios.get(`/general/order`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // The backend returns an object with success, count, and data
    const responseData = response.data;

    const orders = responseData?.data || [];

    const result = {
      success: responseData.success,
      message: responseData.message || "Orders retrieved successfully!",
      count: responseData.count || orders.length,
      data: orders,
    };


    return result;
  } catch (error) {
    const err = {
      success: false,
      message:
        error.response?.data?.message || "An error occurred while fetching orders.",
      error: error.response?.data || error.message,
    };

 

    return err;
  }
};

