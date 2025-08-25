const axios = require('axios');

// Get list of banks in Nigeria
const getBanks = async (req, res) => {
  try {
    const response = await axios.get('https://api.paystack.co/bank?country=nigeria', {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const banks = response.data.data;
    res.status(200).json(banks);
  } catch (error) {
    console.error('Error fetching banks:', error.message);
    res.status(500).json({
      message: 'Failed to fetch banks',
      error: error.response?.data || error.message,
    });
  }
};

// Verify account number and bank code
const verifyAccount = async (req, res) => {
  const { accountNumber, bankCode } = req.body;

  if (!accountNumber || !bankCode) {
    return res.status(400).json({ message: 'accountNumber and bankCode are required' });
  }

  try {
    const response = await axios.get(
      `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const accountDetails = response.data.data;
    res.status(200).json(accountDetails);
  } catch (error) {
    console.error('Error verifying account:', error.message);
    res.status(500).json({
      message: 'Failed to verify account',
      error: error.response?.data || error.message,
    });
  }
};

module.exports = {
  getBanks,
  verifyAccount,
};
