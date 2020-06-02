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
    street: '',
    houseNumber: '',
    townCity: '',
    postcode: '',
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

const serialPort = new SerialPort(port1, {
  baudRate: 19200,
}).on('open', function () {
  var printer = new Printer(serialPort);
  printer.on('ready', function () {
    printer;
    const date = new Intl.DateTimeFormat('en-UK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    }).format(new Date(dataObj.createdAt));

    console.log('printing');
    printer
      .bold(true)
      .indent(5)
      .printLine('Loql order')
      .printLine('')
      .printLine(dataObj.customer.deliveryOptions)
      .printLine('')
      .printLine(dataObj.customer.allergiesIntolerances)
      .printLine('')
      .printLine(dataObj.stripePaid ? 'Online' : 'Pay on collection')
      .printLine('Order received ' + date)
      .printLine('')
      .printText('Quantity')
      .indent(2)
      .printText('Name')
      .indent(2)
      .printText('Price')
      .indent(0)
      .horizontalLine(16)
      .small(true);
    dataObj.basket.forEach(item =>
      printer.printLine(`${item.amount} ${item.name}${item.price}`),
    );

    printer
      .printLine('')
      .small(false)
      .printText('Total: ' + dataObj.amount)
      .printLine('')
      .printText(
        dataObj.customer.specialRequest ? dataObj.customer.specialRequest : '',
      )
      .printText(`${dataObj.customer.street} ${dataObj.customer.houseNumber}`)
      .printText(`${dataObj.customer.postcode} ${dataObj.customer.townCity}`)
      .printLine('')
      .printLine('');
    printer.print(function () {
      console.log('done');
      process.exit();
    });
  });
});
