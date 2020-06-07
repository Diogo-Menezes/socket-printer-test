const formatValue = (value, locale = 'en-UK', currency = 'GBP') => {
  const lastTwoDigits = value.length - 2;

  const subString1 = value.substring(0, lastTwoDigits);

  const subString2 = value.substring(lastTwoDigits, value.length);

  const newValue = +`${subString1}.${subString2}`;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(newValue);
};

module.exports = formatValue;
