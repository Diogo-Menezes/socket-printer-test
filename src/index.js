const WebSocket = require('ws');
const SerialPort = require('serialport');
const Printer = require('thermalprinter');
const sendToPrint = require('./utils/print');
const ring = require('./utils/ring');
const port = '/dev/serial0';

const secret = 'serious';
const id = '5ede289c2f17900007572bf8';

const secret1 = 'test';
const id1 = '5ead89c14707270008f5bdac';

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
    console.log(`Order received:`, JSON.stringify(dataObj, null, 2));
    
    try {
      serialPort = new SerialPort(port, { baudRate: 19200 });

      serialPort.on('open', function () {
        var printer = new Printer(serialPort);

        printer.on('ready', async function () {
          console.log('printer ready');

          await ring();

          sendToPrint(printer, dataObj);

          sendToPrint(printer, dataObj);

          printer.print();
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  if (dataObj.messageType === 'heartbeat') {
    console.log('Heartbeat received');
  }
});

ws.on('close', () => {
  console.log('disconnected');
  process.exit();
});
