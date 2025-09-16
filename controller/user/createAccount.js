const { createAccount, getPlatformsData } = require('../../utility/accounts');
const { sendProductSubmissionEmailToAdmin } = require('../../email/mails/product-submitted');
const { getUserDetailsByUid } = require('../../utility/userInfo');

const accountCreation = async (req, res) => {
  try {
    const {
      userUid,
      platform,
      title = 'N/A',
      price = 0,
      description = 'N/A',
      emailORusername = 'N/A',
      password = 'N/A',
      previewLink = 'N/A',
      recovery_info = 'N/A',
      recovery_password = 'N/A',
      factor_description
    } = req.body;

    if (!platform) {
      return res.status(400).json({ status: 'error', message: 'Platform ID is required.' });
    }

    if (!factor_description) {
      return res.status(400).json({ status: 'error', message: 'Factor description is required.' });
    }

    // Check if input is an email or username
    const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const username = isEmail(emailORusername) ? 'N/A' : emailORusername;
    const email = isEmail(emailORusername) ? emailORusername : 'N/A';

    // Fetch platform info
    const platformData = await getPlatformsData(platform);
    const platformDetails = platformData?.data?.[0];

    if (!platformDetails || !platformDetails.name || !platformDetails.image_path) {
      return res.status(502).json({ status: 'error', message: 'Invalid platform data received.' });
    }

    const { name, image_path, category } = platformDetails;

    // Build account payload
    const accountData = {
      user_id: userUid,
      title,
      platform: name,
      logo_url: image_path,
      email,
      username,
      password,
      previewLink,
      recovery_info,
      recovery_password,
      factor_description,
      description,
      price,
      category: category || 'Other',
      status: 'under reviewing'
    };

    // Save account
    const creationResult = await createAccount(accountData);

    // Send notification to admin
    try {
      const merchant = await getUserDetailsByUid(userUid);

      await sendProductSubmissionEmailToAdmin(
        {
          full_name: merchant.full_name,
          email: merchant.email
        },
        {
          name: name,
          title: title,
          price: price,
          currencySymbol: '$'
        }
      );
    } catch (merchantErr) {
      console.warn('⚠️ Failed to fetch merchant details. Admin email not sent.');
    }

    return res.status(200).json({ status: 'success', data: creationResult });

  } catch (error) {
    console.error('❌ Account creation error:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error. Please try again.' });
  }
};

module.exports = { accountCreation };
