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
    .printLine(object.customer.deliveryOptions)
    .printLine('')
    .printLine(object.customer.allergiesIntolerances)
    .printLine('')
    .inverse(true)
    .printLine(object.stripePaid ? 'Online' : 'Pay on collection')
    .inverse(false)
    .printLine('Order received')
    .printLine(date)
    .printLine('')
    .small(true)
    .printText(`Quantity   Name    Price`)
    .printLine('')
    .horizontalLine(32);

  object.basket.forEach(item => {
    printer.printLine(`${item.amount} ${item.name} ${item.price}`);

    total += parseInt(item.amount) * parseInt(item.price);
  });

  const formattedTotal = new Intl.NumberFormat('en-UK', {
    style: 'currency',
    currency: 'GBP',
  }).format(+total);

  printer
    .printLine('')
    .small(false)
    .printText(`Total: ${formattedTotal}`)
    .printLine('')
    .printLine('')

    .printText(
      object.customer.specialRequest ? object.customer.specialRequest : '',
    )
    .printLine('')
    .printLine('')
    .printLine(`${object.customer.firstName} ${object.customer.lastName}`)
    .printLine(`${object.customer.phone}`)
    .printLine(`${object.customer.houseNumber} ${object.customer.street}`)
    .printLine(`${object.customer.townCity}`)
    .printLine(`${object.customer.postcode}`)
    .printLine('')
    .printLine('')
    .printLine('')
    .printLine('')
    .printLine('')
    .printLine('')
    .printLine('')
    .horizontalLine(32);
}

module.exports = print;
