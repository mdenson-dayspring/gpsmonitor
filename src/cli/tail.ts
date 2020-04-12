import { NMEASource, print, printError } from '../lib';

const source = new NMEASource({
  baudRate: 4800,
  path: '/dev/ttyUSB0'
});

source.sentences().subscribe(print, error => {
  printError('Error: ' + error);
});

// unsubscribe after 10 seconds
setTimeout(() => {
  source.close();
}, 10000);
