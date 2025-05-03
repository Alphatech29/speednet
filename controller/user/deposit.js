const { createPayment } = require('../../utility/cryptomus');
const { fapshiPayment } = require('../../utility/fapshi');

const Deposit = async (req, res) => {
  const { amount, currency, user_id, email, paymentMethod } = req.body;

  // Validate required fields
  if (!amount || !currency || !paymentMethod || !user_id) {
    return res.status(400).json({
      error: 'Amount, currency, user_id, and paymentMethod are required.',
    });
  }

  const validCurrencies = ['USD', 'USDT'];
  if (!validCurrencies.includes(currency.toUpperCase())) {
    return res.status(400).json({
      error: `Unsupported currency '${currency}'. Supported: ${validCurrencies.join(', ')}`,
    });
  }

  try {
    const order_id = user_id;
    let payment;

    switch (paymentMethod.toLowerCase()) {
      case 'cryptomus':
        payment = await createPayment({
          amount: String(amount),
          currency: currency.toUpperCase(),
          userUid: order_id,
        });

        return res.status(200).json({
          status: 'success',
          message: 'Cryptomus payment initiated',
          provider: 'cryptomus',
          payment_url: payment.payment_url,
          payment_uuid: payment.payment_uuid,
          order_id: payment.order_id,
        });

      case 'fapshi':
        payment = await fapshiPayment({
          amount: String(amount),
          user_id: String(user_id),
          email: String(email),
        });

        return res.status(200).json({
          status: 'success',
          message: 'Fapshi payment initiated',
          provider: 'fapshi',
          payment_url: payment.checkout_url,
          transaction_reference: payment.transaction_reference,
          userUid: payment.user_id,
        });

      default:
        return res.status(400).json({
          status: 'error',
          error: `Unsupported payment method '${paymentMethod}'.`,
        });
    }
  } catch (error) {
    console.error('Deposit error:', error);

    return res.status(500).json({
      status: 'error',
      error: 'An error occurred while processing your payment.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = { Deposit };
