const object = require('../mock/mockedOrder');

let total = 0;

object.basket.forEach(item => {

  if (item.optionsTotal > 0) {
    // printer.printLine(item.optionsTotal);
    total += item.optionsTotal;
  }

  if (item.extrasTotal > 0) {
    // printer.printLine(item.extrasTotal);
    total += item.extrasTotal;
  }

  total += parseFloat(item.amount) * parseFloat(item.price);
});

console.log(total);
