const WebSocket = require('ws');

const port = '/dev/ttyUSB0';

const url =
  'wss://lmss7g0g38.execute-api.us-east-1.amazonaws.com/dev?Auth=test&businessId=5ead89c14707270008f5bdac';

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
        printer.print(function () {
          console.log('done');
          process.exit();
        });
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
