const { storeWithdrawal } = require('../../utility/withdrawal');
const { generateUniqueRandomNumber } = require('../../utility/random');
const { getUserDetailsByUid, updateUserBalance } = require('../../utility/userInfo');
const logger = require('../../utility/logger');

const WithdrawalRequest = async (req, res) => {
  try {
    const {
      userId,
      amount,
      method,
      bankAccount,
      bankName,
      accountName,
      walletAddress,
      walletNetwork,
      coinName,
      momoNumber
    } = req.body;

    // Basic validations
    if (!userId || !amount || !method) {
      return res.status(400).json({ message: 'userId, amount, and method are required.' });
    }

    // Get user details
    const user = await getUserDetailsByUid(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Balance check
    const accountBalance = parseFloat(user.merchant_balance || 0);
    const withdrawalAmount = parseFloat(amount);

    if (withdrawalAmount > accountBalance) {
      return res.status(400).json({ message: 'Insufficient balance for this withdrawal.' });
    }

    // Deduct balance
    const newBalance = accountBalance - withdrawalAmount;
    const balanceUpdateResult = await updateUserBalance(userId, newBalance);
    if (!balanceUpdateResult.success) {
      return res.status(500).json({ message: 'Failed to update user balance.' });
    }

    // Build withdrawal data
    const reference = generateUniqueRandomNumber();
    let withdrawalData = {
      user_id: userId,
      amount: withdrawalAmount,
      method,
      reference,
      status: 'pending'
    };

    switch (method) {
      case 'Bank':
        if (!bankAccount || !bankName) {
          return res.status(400).json({ message: 'Bank details are required for bank withdrawal.' });
        }
        withdrawalData.bankAccount = bankAccount;
        withdrawalData.bankName = bankName;
        if (accountName) withdrawalData.accountName = accountName;
        break;

      case 'Crypto':
        if (!walletAddress || !walletNetwork || !coinName) {
          return res.status(400).json({ message: 'Wallet details are required for crypto withdrawal.' });
        }
        withdrawalData.walletAddress = walletAddress;
        withdrawalData.walletNetwork = walletNetwork;
        withdrawalData.coinName = coinName;
        break;

      case 'MOMO':
        if (!momoNumber) {
          return res.status(400).json({ message: 'Momo number is required for MOMO withdrawal.' });
        }
        withdrawalData.momoNumber = momoNumber;
        break;

      default:
        return res.status(400).json({ message: 'Invalid withdrawal method.' });
    }

    // Store withdrawal request
    const result = await storeWithdrawal(withdrawalData);

    return res.status(201).json({
      message: 'Withdrawal request received successfully.',
      data: result
    });

  } catch (error) {
    logger.error('WithdrawalRequest error', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body
    });

    return res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = {
  WithdrawalRequest
};
