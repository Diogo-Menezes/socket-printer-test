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
    printer
      .indent(10)
      .horizontalLine(16)
      .bold(true)
      .indent(10)
      .printLine('first line')
      .bold(false)
      .inverse(true)
      .big(true)
      .right()
      .printLine('second line')
      .print(function () {
        console.log('done');
        process.exit();
      });
  });
});
