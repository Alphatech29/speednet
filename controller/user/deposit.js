const { createPayment } = require('../../utility/cryptomus');
const { generateUniqueRandomNumber } = require('../../utility/random'); // Import the random number generator

const Deposit = async (req, res) => {
  const { amount, currency } = req.body;

  if (!amount || !currency) {
    return res.status(400).json({ error: 'Amount and currency are required' });
  }

  try {
    const order_id = generateUniqueRandomNumber(); // Use the random number generator function to generate order_id

    // Here, you no longer need to pass the paymentMethod to createPayment, you can directly set it in the function
    const payment = await createPayment({
      amount,
      currency,
      userUid: order_id, // pass the generated order ID
    });

    return res.status(200).json({
      payment_url: payment.payment_url,
      payment_uuid: payment.payment_uuid,
      order_id: payment.order_id
    });
  } catch (error) {
    console.error('Deposit error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

module.exports = { Deposit };
