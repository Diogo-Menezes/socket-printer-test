const Printer = require('thermalprinter');
const formatValue = require('./formatValue');

function print(printer, object) {
  console.log('print function called');

  if (!(printer instanceof Printer)) {
    throw new Error('Invalid printer');
  }

  if (!object) {
    throw new Error('Invalid object');
  }

  const date = new Intl.DateTimeFormat('en-UK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).format(new Date(object.createdAt));

  //Header
  printer
    .bold(true)
    .indent(0)
    .printLine('')
    .printLine('')
    .printLine('')
    .big(true)
    .printLine('Loql order')
    .big(false)
    .printLine(`Order no: ${object.orderNum}`)
    .printLine('')
    .printLine(`Delivery: ${object.customer.deliveryOptions}`)
    .printLine('')
    .printLine(`Allergies/Intolerance:`)
    .printLine(
      object.customer.allergiesIntolerances
        ? object.customer.allergiesIntolerances
        : 'N/A'
    )
    .printLine('')
    .inverse(true)
    .printLine(
      object.customer.payOptions && object.customer.payOptions.includes('online')
        ? ' Paid online '
        : ' Pay on collection '
    )
    .inverse(false)
    .printLine('')
    .printLine('Order received')
    .printLine(date)
    .printLine('')
    .small(true)
    .printText(`Quantity   Name    Price`)
    .printLine('')
    .horizontalLine(55);

  //Basket
  object.basket.forEach(item => {
    printer.bold(true);
    printer.printLine(`${item.quantity}    ${item.name}   ${item.price}`);
    printer.bold(false);

    if (item.optionName !== '') {
      printer.printLine(`      ${item.optionName}    ${item.optionPrice}`);
    }

    if (item.extras.length > 0) {
      item.extras.forEach(extra => {
        printer.printLine(`      ${extra.extraName}    ${extra.extraPrice}`);
      });
    }
  });

  const formattedTotal = formatValue(object.amount);

  //Total
  printer
    .printLine('')
    .small(false)
    .big(true)
    .printText(`Total: ${formattedTotal}`)
    .big(false)
    .printLine('')
    .printLine('')

    //Special Requests
    .printLine('Special Requests:')
    .printText(
      object.customer.specialRequest ? object.customer.specialRequest : 'N/A'
    )
    .printLine('')
    .printLine('')

    //Customer Details
    .printLine('Customer details:')
    .printLine(`${object.customer.firstName} ${object.customer.lastName}`);

  //Phone
  object.customer.phone && printer.printLine(`${object.customer.phone}`);

  //House number + street
  object.customer.houseNumber &&
    printer.printLine(
      `${object.customer.houseNumber} ${object.customer.street}`
    );

  //Town
  object.customer.townCity && printer.printLine(`${object.customer.townCity}`);

  //PostCode
  object.customer.postcode &&
    printer
      .printLine(`${object.customer.postcode}`)

      .printLine('')
      .printLine('')
      .printLine('')
      .printLine('')
      .printLine('')
      .printLine('')
      .horizontalLine(255);
}

module.exports = print;
