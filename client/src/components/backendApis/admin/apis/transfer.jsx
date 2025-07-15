import axios from 'axios';

export const transferFunds = async ({ userId, amount }) => {
  try {
    const response = await axios.post('/general/transfer/funds', {
      userId,
      amount: Number(amount),
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = response?.data || {};

    return {
      success: responseData.success ?? true,
      message: responseData.message || 'Transfer successfully!',
      data: responseData.data || {},
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || 'An error occurred while transferring funds.',
      error: error.response?.data || error.message,
    };
  }
};
