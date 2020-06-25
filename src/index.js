const WebSocket = require('ws');
const SerialPort = require('serialport');
const Printer = require('thermalprinter');
const sendToPrint = require('./utils/print');
const ring = require('./utils/ring');

const port = '/dev/serial0';

const secret = 'serious';
const id = '5edbead255ded300082a3724';

const url = `  wss://lmss7g0g38.execute-api.us-east-1.amazonaws.com/dev?Auth=${secret}&businessId=${id}`;

let intervalId = 0;
let orders = [];
let isPrinting = false;

let processStartTime = new Date();
let connectionTime;

let ws = new WebSocket(url);

function sendHeartbeat() {
  const message = JSON.stringify({
    action: 'echo',
    data: { messageType: 'heartbeat' },
  });
  ws.send(message);
}

function setHeartbeat() {
  console.log('Set up heartbeat');
  intervalId = setInterval(() => {
    sendHeartbeat();
    console.log('Heartbeat sent:', new Date());
  }, 30000);
}

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
          isPrinting = false;
          orders.splice(0, 1);
          console.log('print finished, orders in queue:' + orders.length);

          serialPort.close(function () {
            console.log('port closed');
          });
        });
      });
    });
  } catch (error) {
    isPrinting = false;
    console.log(error);
  }
}

function startWebSocket() {
  setHeartbeat();
  ws = new WebSocket(url);

  ws.on('open', () => {
    connectionTime = new Date();
    console.log('connected:', connectionTime);
  });

  ws.on('message', data => {
    const dataObj = JSON.parse(data);

    console.log(`message received: ${new Date()}`, dataObj);

    if (dataObj.messageType === 'heartbeat') {
      if (orders.length > 0) {
        console.log('heartbeat received, orders in queue:', orders.length);

        if (isPrinting) return;

        printProcess(orders[0]);
      }
    }

    if (dataObj.messageType === 'order') {
      orders.push(dataObj);
      sendHeartbeat();
    }
  });

  ws.on('close', async ({ code, reason }) => {
    console.log(`process started at: ${processStartTime}`);
    console.log(
      `disconnected at: ${new Date()}\nconnected  at: ${connectionTime}`
    );
    console.log('code:', code);
    console.log('reason:', reason);

    //Restart websocket
    clearInterval(intervalId);
    startWebSocket();
  });
}

startWebSocket();
