const formatValue = (value, locale = 'en-UK', currency = 'GBP') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
};

module.exports = formatValue;
