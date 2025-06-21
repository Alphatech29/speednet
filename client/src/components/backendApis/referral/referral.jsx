import axios from "axios";

export const fetchReferralsByUser = async (userId) => {
  try {
    const response = await axios.get(`/general/referrals/${userId}`, {
      headers: { Accept: "application/json" },
    });

    return {
      success: true,
      data: response.data?.referrals,
      message: response.data?.message,
      status: response.status,
    };
  } catch (error) {

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "An error occurred while fetching referrals.",
      status: error.response?.status,
    };
  }
};
