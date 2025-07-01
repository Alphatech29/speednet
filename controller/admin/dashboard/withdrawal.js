const { getAllWithdrawals , updateWithdrawalStatusById} = require('../../../utility/withdrawal');


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


const updateWithdrawalStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log('Received update request:', { id, status });

  // Input validation
  if (!id || !status) {
    console.log('Validation failed: Missing ID or status');
    return res.status(400).json({
      success: false,
      message: 'Withdrawal ID and status are required.',
    });
  }

  const normalizedStatus = status.toLowerCase();
  const validStatuses = ['completed', 'rejected'];

  console.log('Normalized status:', normalizedStatus);

  if (!validStatuses.includes(normalizedStatus)) {
    console.log('Validation failed: Invalid status value');
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Allowed: completed, rejected.',
    });
  }

  try {
    console.log(`Attempting to update withdrawal ${id} to status: ${normalizedStatus}`);
    const result = await updateWithdrawalStatusById(id, normalizedStatus);
    console.log('Database update result:', result);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: `Withdrawal marked as ${normalizedStatus}.`,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: result.message || 'Withdrawal not found or update failed.',
      });
    }
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


module.exports = { getAllWithdrawal, updateWithdrawalStatus };
