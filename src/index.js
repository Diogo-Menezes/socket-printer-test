const ReconnectingWebSocket = require('reconnecting-websocket');
const WS = require('ws');
const SerialPort = require('serialport');
const Printer = require('thermalprinter');
const sendToPrint = require('./utils/print');
const ring = require('./utils/ring');
const port = '/dev/serial0';

const secret = 'serious';
const id = '5edbead255ded300082a3724';

const secret1 = 'test';
const id1 = '5ead89c14707270008f5bdac';

const options = {
  WebSocket: WS,
  minUptime: 7200000, //2h
  connectionTimeout: 1000,
  maxRetries: 10,
};

const url = `  wss://lmss7g0g38.execute-api.us-east-1.amazonaws.com/dev?Auth=${secret}&businessId=${id}`;
const rws = new WebSocket(url, [], options);

console.log('Set up heartbeat');
setInterval(() => {
  console.log('Heartbeat sent');
  const message = JSON.stringify({
    action: 'echo',
    data: { messageType: 'heartbeat' },
  });
  ws.send(message);
}, 540000);

var timerID = 0;

function keepAlive() {
  var timeout = 20000;

  if (ws.readyState == ws.OPEN) {
    console.log('Sent keep awake');
    ws.send('');
  }

  timerId = setTimeout(keepAlive, timeout);
}

ws.on('open', () => {
  console.log('connected');
  keepAlive();
});

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
  cancelKeepAlive();

  // process.exit();
});

function cancelKeepAlive() {
  if (timerId) {
    clearTimeout(timerId);
  }
}
