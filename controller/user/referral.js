const { getReferralsByReferrer } = require('../../utility/referral');

const fetchReferralsByReferrer = async (req, res) => {
  const { userId } = req.params;

  // Validate input
  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Invalid or missing userId parameter.'
    });
  }

  try {
    const result = await getReferralsByReferrer(userId);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while fetching referrals.',
        error: result.error
      });
    }

    if (!result.data || result.data.length === 0) {
      return res.status(404).json({
        success: true,
        message: 'No referrals found for the specified user.',
        referrals: []
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Referrals fetched successfully.',
      referrals: result.data
    });

  } catch (error) {
    console.error('Unhandled error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unexpected server error.',
      error: error.message
    });
  }
};

module.exports = {
  fetchReferralsByReferrer
};
