const WebSocket = require('ws');
const { toPrint } = require('./print');

const port = '/dev/ttyUSB0';

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

    const SerialPort = require('serialport'),
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
