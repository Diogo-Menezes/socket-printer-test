const ReconnectingWebSocket = require('reconnecting-websocket');
const WS = require('ws');
const SerialPort = require('serialport');
const Printer = require('thermalprinter');
const sendToPrint = require('./utils/print');
const ring = require('./utils/ring');
const port = '/dev/serial0';

const secret = 'serious';
const id = '5edbead255ded300082a3724';

const url = `wss://lmss7g0g38.execute-api.us-east-1.amazonaws.com/dev?Auth=${secret}&businessId=${id}`;

let startTime;

const options = {
  WebSocket: WS,
  minUptime: 7200000, //2h
};

const rws = new ReconnectingWebSocket(url, [], options);

rws.addEventListener('open', () => {
  console.log('connected');
  startTime = new Date();

  const message = JSON.stringify({
    action: 'echo',
    data: { messageType: 'heartbeat' },
  });
  rws.send(message);
});

rws.addEventListener('message', ({ data }) => {
  const dataObj = JSON.parse(data);

  console.log(`message received: ${new Date()}`, dataObj);

  if (dataObj.messageType !== 'order') {
    return;
  }

  try {
    if (dataObj.messageType === 'order') {
      console.log(`Order received:`, JSON.stringify(dataObj, null, 2));
    }
    const serialPort = new SerialPort(port, { baudRate: 19200 });

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
});

rws.addEventListener('close', () => {
  console.log(`disconnected at ${new Date()}\nstarted at ${startTime}`);
  // process.exit();
});
