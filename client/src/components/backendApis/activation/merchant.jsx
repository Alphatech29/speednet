import axios from "axios";

export const activateAccount = async (userUid) => {
  try {

    const response = await axios.post(
      `/general/activate`,
      { userUid },         
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      message: "Account activated successfully!",
      data: response.data,
    };
  } catch (error) {

    return {
      success: false,
      message:
        error.response?.data?.message || "An error occurred while activating the account.",
      error: error.response?.data || error.message,
    };
  }
};
