const SerialPort = require('serialport');
const Printer = require('thermalprinter');
const path = require('path');

const port = '/dev/ttyUSB0';
const port1 = '/dev/serial0';

const serialPort = new SerialPort(port1, {
  baudRate: 19200,
}).on('open', function () {
  var printer = new Printer(serialPort);
  printer.on('ready', function () {
    console.log('connected');
    
    printer
      .printLine('connected')

      .print(function () {
        console.log('done');
        process.exit();
      });

  });
});
