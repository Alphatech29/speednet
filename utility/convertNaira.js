const { getWebSettings } = require('./general');

const convertNairaToDollar = async (nairaAmount) => {
  const parsedAmount = parseFloat(nairaAmount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    throw new Error("Invalid Naira amount");
  }

  const settings = await getWebSettings();
  const exchangeRate = parseFloat(settings?.naira_rate);

  if (isNaN(exchangeRate) || exchangeRate <= 0) {
    throw new Error("Invalid exchange rate in web settings");
  }
  const dollarAmount = parsedAmount / exchangeRate;
  return parseFloat(dollarAmount.toFixed(6));
};

module.exports = {
  convertNairaToDollar,
};
