const { createAccount, getPlatformsData } = require('../../utility/accounts');
const { sendProductSubmissionEmailToAdmin } = require('../../email/mails/product-submitted');
const { getUserDetailsByUid } = require('../../utility/userInfo');

const accountCreation = async (req, res) => {
  try {
    const {
      userUid,
      platform = 'N/A',
      title = 'N/A',
      emailORusername = 'N/A',
      password = 'N/A',
      price = 'N/A',
      previewLink = 'N/A',
      description = 'N/A',
      subscriptionStatus = 'N/A',
      two_factor_enabled = false,
      two_factor_description = 'N/A',
      expiry_date = 'N/A',
      recoveryEmail = 'N/A',
      recoveryEmailPassword = 'N/A',
      additionalEmail = 'N/A',
      additionalPassword = 'N/A'
    } = req.body;

    const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const username = isEmail(emailORusername) ? 'N/A' : emailORusername;
    const email = isEmail(emailORusername) ? emailORusername : 'N/A';

    if (platform === 'N/A') {
      return res.status(400).json({ status: 'error', message: 'Platform ID is missing or invalid.' });
    }

    const platformData = await getPlatformsData(platform);
    const platformDetails = platformData?.data?.[0];

    if (!platformDetails || !platformDetails.name || !platformDetails.image_path) {
      return res.status(502).json({ status: 'error', message: 'Invalid platform data received.' });
    }

    const { name, image_path, category } = platformDetails;

    const accountData = {
      user_id: userUid,
      title,
      platform: name,
      logo_url: image_path,
      email,
      username,
      recovery_email: recoveryEmail,
      recoveryEmailpassword: recoveryEmailPassword,
      additionalEmail,
      additionalPassword,
      previewLink,
      password,
      description,
      price,
      category: category || 'Other',
      subscription_status: subscriptionStatus,
      expiry_date,
      two_factor_enabled,
      two_factor_description,
      status: 'under reviewing'
    };

    const creationResult = await createAccount(accountData);

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
      console.warn(' Failed to fetch merchant details. Admin email not sent.');
    }

    return res.status(200).json({ status: 'success', data: creationResult });

  } catch (error) {
    console.error('Account creation error:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error. Please try again.' });
  }
};

module.exports = { accountCreation };
