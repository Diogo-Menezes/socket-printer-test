const Printer = require('thermalprinter');

function print(printer, object) {
  console.log('print function called');

  if (!(printer instanceof Printer)) {
    throw new Error('Invalid printer');
  }

  if (!object) {
    throw new Error('Invalid object');
  }

  let total = 0;

  const date = new Intl.DateTimeFormat('en-UK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).format(new Date(object.createdAt));

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
        : 'N/A',
    )
    .printLine('')
    .inverse(true)
    .printLine(object.stripePaid ? ' Online ' : ' Pay on collection ')
    .inverse(false)
    .printLine('')
    .printLine('Order received')
    .printLine(date)
    .printLine('')
    .small(true)
    .printText(`Quantity   Name    Price`)
    .printLine('')
    .horizontalLine(32);

  object.basket.forEach(item => {
    printer.printLine(`${item.amount}    ${item.name}   ${item.price}`);

    if (item.optionsTotal > 0) {
      printer.printLine('options total: ' + item.optionsTotal);
      total += item.optionsTotal;
    }

    if (item.extrasTotal > 0) {
      printer.printLine('extras total: ' + item.extrasTotal);
      total += item.extrasTotal;
    }

    total += parseFloat(item.amount) * parseFloat(item.price);
  });

  const formattedTotal = new Intl.NumberFormat('en-UK', {
    style: 'currency',
    currency: 'GBP',
  }).format(+total);

  printer
    .printLine('')
    .small(false)
    .big(true)
    .printText(`Total: ${formattedTotal}`)
    .big(false)
    .printLine('')
    .printLine('')
    .printLine('Special Requests:')
    .printText(
      object.customer.specialRequest ? object.customer.specialRequest : 'N/A',
    )
    .printLine('')
    .printLine('')
    .printLine('Customer details:')
    .printLine(`${object.customer.firstName} ${object.customer.lastName}`);

  //Phone
  object.customer.phone && printer.printLine(`${object.customer.phone}`);

  //House number + street
  object.customer.houseNumber &&
    printer.printLine(
      `${object.customer.houseNumber} ${object.customer.street}`,
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
      .horizontalLine(32);
}

module.exports = print;
