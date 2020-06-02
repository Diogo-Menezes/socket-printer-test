const SerialPort = require('serialport');
const Printer = require('thermalprinter');

const port = '/dev/ttyUSB0';
const port1 = '/dev/serial0';

const dataObj = {
  restaurantId: '5ead89c14707270008f5bdac',
  amount: '495',
  basket: [
    { name: 'Courgette Fries', price: '3.95', amount: 1 },
    { name: 'Courgette Fries', price: '3.95', amount: 2 },
    { name: 'Courgette Fries', price: '3.95', amount: 3 },
  ],
  customer: {
    deliveryOptions: 'collection',
    payOptions: [],
    street: 'Montague Road',
    houseNumber: '8',
    townCity: 'Berkhamsted',
    postcode: 'HP4 3DS',
    specialRequest: 'Special request 1\nSpecial request 2',
    allergiesIntolerances: 'I"m allergic to nuts and squirrels',
    instructions: '',
    firstName: 'Matt',
    lastName: 'Lindop',
    phone: '07710631670',
    newsLetterLoql: false,
    newsLetterBusinesses: true,
  },
  stripePaid: false,
  stripe: {},
  signupEmail: 'matt@thedesignofchange.com',
  status: 'OPEN',
  orderNum: 128,
  createdAt: '2020-05-28T14:45:18.096Z',
  updatedAt: '2020-05-28T14:45:18.096Z',
  _id: '5ecfce7e9975f00008aaf2ec',
  messageType: 'order',
};

export function toPrint(printer, dataObj) {
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
