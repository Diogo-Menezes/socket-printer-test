const WebSocket = require('ws');
const SerialPort = require('serialport');
const Printer = require('thermalprinter');
const sendToPrint = require('./utils/print');
const ring = require('./utils/ring');

const port = '/dev/serial0';

const secret = 'serious';
const id = '5edbead255ded300082a3724';

const secret1 = 'test';
const id1 = '5ead89c14707270008f5bdac';

const url = `  wss://lmss7g0g38.execute-api.us-east-1.amazonaws.com/dev?Auth=${secret}&businessId=${id}`;
const ws = new WebSocket(url);

let orders = [];
let isPrinting = false;

let processStartTime = new Date();
let connectionTime;

function sendHeartbeat() {
  const message = JSON.stringify({
    action: 'echo',
    data: { messageType: 'heartbeat' },
  });
  ws.send(message);
}

console.log('Set up heartbeat');
setInterval(() => {
  sendHeartbeat();
  console.log('Heartbeat sent:', processStartTime);
}, 30000);

ws.on('open', () => {
  connectionTime = new Date();
  console.log('connected:', connectionTime);
});

ws.on('message', data => {
  const dataObj = JSON.parse(data);

  console.log(`message received: ${new Date()}`, dataObj);

  if (dataObj.messageType === 'heartbeat') {
    if (orders.length > 0) {
      console.log('orders in queue:', orders.length);
      printProcess(orders[0]);
    }
  }

  if (dataObj.messageType === 'order') {
    orders.push(dataObj);

    if (isPrinting) {
      return;
    }

    printProcess(orders[0]);
  }
});

function printProcess(dataObj) {
  try {
   let serialPort = new SerialPort(port, { baudRate: 19200 });

    serialPort.on('open', function () {
      var printer = new Printer(serialPort);

      printer.on('ready', async function () {
        console.log('printer ready');
        isPrinting = true;

        await ring();

        sendToPrint(printer, dataObj);

        sendToPrint(printer, dataObj);

        printer.print(function () {
          serialPort.close(function () {
            console.log('port closed');
            isPrinting = false;
            orders.slice(0, 1);
          });
        });
      });
    });
  } catch (error) {
    isPrinting(false);
    console.log(error);
  }
}

ws.on('close', async ({ code, reason }) => {
  console.log(`process started at: ${processStartTime}`);
  console.log(
    `disconnected at: ${new Date()}\nconnected  at: ${connectionTime}`
  );
  console.log('code:', code);
  console.log('reason:', reason);
  await ring();

  //Restart websocket
  process.exit();
});

/**
 * Set a timer to keep connection
 */

var timerID = 0;

function keepAlive() {
  var timeout = 20000;

  if (ws.readyState == ws.OPEN) {
    console.log('Sent keep awake');
    ws.send('');
  }

  timerId = setTimeout(keepAlive, timeout);
}

/**
 * Cancel timer
 */
function cancelKeepAlive() {
  if (timerId) {
    clearTimeout(timerId);
  }
}
