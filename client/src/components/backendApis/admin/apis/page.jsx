import axios from 'axios';

export const createPage = async (data) => {
  try {
    const response = await axios.post('/general/create-page', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = response?.data || {};

    return {
      success: true,
      message: responseData.message || 'Page created successfully!',
      data: responseData.page || {},
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error || 'An error occurred while creating the page.',
      error: error.response?.data || error.message,
    };
  }
};

export const getAllPages = async () => {
  try {
    const response = await axios.get('/general/get-pages', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = response?.data || {};

    return {
      success: true,
      message: responseData.message || 'Pages retrieved successfully!',
      data: responseData.data || [],
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error || 'An error occurred while fetching pages.',
      error: error.response?.data || error.message,
    };
  }
};


export const deletePageById = async (id) => {
  try {
    const response = await axios.delete(`/general/delete-page/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = response?.data || {};

    return {
      success: true,
      message: responseData.message || 'Page deleted successfully!',
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error || 'An error occurred while deleting the page.',
      error: error.response?.data || error.message,
    };
  }
};



export const getPageBySlug = async (slug) => {
  try {
    const response = await axios.get(`/general/page/${slug}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = response?.data || {};

    return {
      success: true,
      message: responseData.message || 'Page fetched successfully!',
      data: responseData, 
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error || 'An error occurred while fetching the page.',
      error: error.response?.data || error.message,
    };
  }
};



export const updatePageById = async (id, updateData) => {
  try {
    const response = await axios.put(`/general/page/${id}`, updateData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = response?.data || {};

    return {
      success: true,
      message: responseData.message || 'Page updated successfully!',
      data: responseData,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error || 'An error occurred while updating the page.',
      error: error.response?.data || error.message,
    };
  }
};
