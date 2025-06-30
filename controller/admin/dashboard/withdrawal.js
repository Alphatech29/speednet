const { getAllWithdrawals } = require('../../../utility/withdrawal');

const getAllWithdrawal = async (req, res) => {
  try {
    const result = await getAllWithdrawals();

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json({ success: false, message: result.message });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { getAllWithdrawal };
