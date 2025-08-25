function generateUniqueRandomNumber(maxLength = 13) {
  const maxNumber = Math.pow(10, maxLength) - 1;
  const minNumber = Math.pow(10, maxLength - 1);

  return (Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber).toString();
}

module.exports = { generateUniqueRandomNumber };  
