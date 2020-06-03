const SerialPort = require('serialport');
const Printer = require('thermalprinter');

const dataObj = require('../mock/mockedOrder');

const port = '/dev/ttyUSB0';
const port1 = '/dev/serial0';

function toPrint(printer) {
  let total = 0;

  const date = new Intl.DateTimeFormat('en-UK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).format(new Date(dataObj.createdAt));

  printer
    .bold(true)
    .indent(0)
    .printLine('')
    .printLine('')
    .printLine('')
    .big(true)
    .printLine('Loql order')
    .big(false)
    .printLine(`Order no: ${dataObj.orderNum}`)
    .printLine('')
    .printLine(dataObj.customer.deliveryOptions)
    .printLine('')
    .printLine(dataObj.customer.allergiesIntolerances)
    .printLine('')
    .inverse(true)
    .printLine(dataObj.stripePaid ? 'Online' : 'Pay on collection')
    .inverse(false)
    .printLine('Order received')
    .printLine(date)
    .printLine('')
    .small(true)
    .printText(`Quantity   Name    Price`)
    .printLine('')
    .horizontalLine(32);

  dataObj.basket.forEach(item => {
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
      dataObj.customer.specialRequest ? dataObj.customer.specialRequest : '',
    )
    .printLine('')
    .printLine('')
    .printLine(`${dataObj.customer.firstName} ${dataObj.customer.lastName}`)
    .printLine(`${dataObj.customer.phone}`)
    .printLine(`${dataObj.customer.houseNumber} ${dataObj.customer.street}`)
    .printLine(`${dataObj.customer.townCity}`)
    .printLine(`${dataObj.customer.postcode}`)
    .printLine('')
    .printLine('')
    .printLine('')
    .printLine('')
    .printLine('')
    .printLine('')
    .printLine('')
    .horizontalLine(32);
}

const serialPort = new SerialPort(port1, {
  baudRate: 19200,
}).on('open', function () {
  var printer = new Printer(serialPort);
  printer.on('ready', function () {
    toPrint(printer);
    toPrint(printer);

    printer.print(function () {
      console.log('done');
      process.exit();
    });
  });
});

module.exports = toPrint;
