const WebSocket = require('ws');
const SerialPort = require('serialport');

const port = '/dev/serial0';

const secret = 'whysoserious';
const id = ' 5eaa883c0cf47200076a4fea';

const url = `  wss://lmss7g0g38.execute-api.us-east-1.amazonaws.com/dev?Auth=${secret}&businessId=${id}`;
const ws = new WebSocket(url);

console.log('Set up heartbeat');
setInterval(() => {
  console.log('Heartbeat sent');
  const message = JSON.stringify({
    action: 'echo',
    data: { messageType: 'heartbeat' },
  });
  ws.send(message);
}, 540000);

ws.on('open', () => console.log('connected'));

ws.on('message', data => {
  const dataObj = JSON.parse(data);
  if (dataObj.messageType === 'order') {
    console.log(`Order received:`, dataObj);

    const Printer = require('thermalprinter');

    serialPort = new SerialPort(port, {
      baudRate: 19200,
    });

    serialPort.on('open', function () {
      var printer = new Printer(serialPort);
      printer.on('ready', function () {
        console.log('printing');
        toPrint(printer, dataObj);
        toPrint(printer, dataObj);
        // printer.print(function () {
        //   console.log('done');
        //   process.exit();
        // });
      });
    });
  }

  if (dataObj.messageType === 'heartbeat') {
    console.log('Heartbeat received');
  }
});
ws.on('close', () => {
  console.log('disconnected');
  process.exit();
});

function toPrint(printer, dataObj) {
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
