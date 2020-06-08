const object = require('../mock/mockedOrder');
const formatValue = require('../utils/formatValue');

object.basket.forEach(item => {
  console.log(`${item.quantity}    ${item.name}   ${item.price}`);

  if (item.optionName !== '') {
    console.log(`      ${item.optionName}    ${item.optionPrice}`);
  }

  if (item.extras.length > 0) {
    item.extras.forEach(extra => {
      console.log(`      ${extra.extraName}    ${extra.extraPrice}`);
    });
  }
  console.log(formatValue(object.amount));
});
