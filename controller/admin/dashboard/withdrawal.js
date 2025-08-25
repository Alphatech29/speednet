const {
  getAllWithdrawals,
  getWithdrawalById,
  updateWithdrawalStatusById,updateMerchantTransactionStatusByReference
} = require('../../../utility/withdrawal');

const {
  sendWithdrawalNotificationEmail
} = require('../../../email/mails/withdrawal-approved');


// GET all withdrawals
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


// Pure function to get a withdrawal by ID
const getWithdrawalByIdFn = async (id) => {
  try {
    const result = await getWithdrawalById(id);

    if (result.success) {
      return {
        success: true,
        data: result.data,
      };
    } else {
      return {
        success: false,
        message: result.message || 'Withdrawal not found',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Internal server error',
      error: error.message,
    };
  }
};



// Update withdrawal status (admin action)
const updateWithdrawalStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id || !status) {
    return res.status(400).json({
      success: false,
      message: 'Withdrawal ID and status are required.',
    });
  }

  const normalizedStatus = status.toLowerCase();
  const validStatuses = ['completed', 'rejected'];

  if (!validStatuses.includes(normalizedStatus)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Allowed: completed, rejected.',
    });
  }

  try {
    // Step 1: Update withdrawal status
    const result = await updateWithdrawalStatusById(id, normalizedStatus);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message || 'Withdrawal not found or update failed.',
      });
    }

    // Step 2: Fetch updated withdrawal
    const withdrawalResult = await getWithdrawalById(id);
    if (!withdrawalResult.success) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal found but failed to fetch details.',
      });
    }

    const withdrawal = withdrawalResult.data;

    // Step 3: Update related merchant transaction status using reference
    const merchantUpdateResult = await updateMerchantTransactionStatusByReference(
      withdrawal.reference,
      normalizedStatus
    );

    if (!merchantUpdateResult.success) {
      console.warn('Merchant transaction status update failed:', merchantUpdateResult.message);
    }

    // Step 4: Send approval email if completed
    if (normalizedStatus === 'completed') {
      try {
        await sendWithdrawalNotificationEmail(
          {
            full_name: withdrawal.full_name,
            email: withdrawal.email,
            username: withdrawal.username
          },
          {
            amount: withdrawal.amount,
            method: withdrawal.method,
            reference: withdrawal.reference,
            currencySymbol: withdrawal.currency || '$'
          }
        );
      } catch (emailErr) {
        console.error('Failed to send approval email:', emailErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Withdrawal and transaction marked as ${normalizedStatus}.`,
    });

  } catch (error) {
    console.error('Error updating withdrawal status:', {
      error: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};


module.exports = {
  getAllWithdrawal,
  updateWithdrawalStatus
};
