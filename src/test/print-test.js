const SerialPort = require('serialport');
const Printer = require('thermalprinter');
const print = require('../utils/print');
const dataObj = require('../mock/mockedOrder');

const port = '/dev/ttyUSB0';
const port1 = '/dev/serial0';

const serialPort = new SerialPort(port1, {
  baudRate: 19200,
}).on('open', function () {
  var printer = new Printer(serialPort);
  printer.on('ready', function () {
    print(printer, dataObj);
    print(printer, dataObj);
  });
});
