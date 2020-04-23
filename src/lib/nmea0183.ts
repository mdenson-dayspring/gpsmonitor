import { Observable, Subject, Subscriber } from 'rxjs';
import { filter} from 'rxjs/operators';
import * as SerialPort from 'serialport';

export interface INMEAOptions {
  baudRate?:
    | 115200
    | 57600
    | 38400
    | 19200
    | 9600
    | 4800
    | 2400
    | 1800
    | 1200
    | 600
    | 300
    | 200
    | 150
    | 134
    | 110
    | 75
    | 50
    | number;
  path: string;
}
export class NMEASource {
  private port: SerialPort;
  private stream: Subject<string>;

  constructor(options: INMEAOptions) {
    const opts = {} as SerialPort.OpenOptions;
    if (options.baudRate) {
      opts.baudRate = options.baudRate;
    }
    this.port = new SerialPort(options.path, opts);
    const parser = new SerialPort.parsers.Readline({ delimiter: '\r\n' });
    this.port.pipe(parser);

    this.stream = new Subject<string>();
    parser.on('data', (data: string) => {
      this.stream.next(data);
    });
  }

  public sentences(): Observable<string> {
    return this.stream.pipe(filterValid());
  }
  public fixes(): Observable<IGPSPosition> {
    return this.stream.pipe(filterValid(), parsePosition());
  }

  public close() {
    this.stream.complete();
    this.port.close();
  }
}

export interface IGPSPosition {
  course?: number;
  date: Date;
  long?: number;
  lat?: number;
  speed?: number;
}
const filterValid = () => {
  return filter((packet: string) => {
    if (packet.startsWith('$') || packet.startsWith('!')) {
      const data = packet.substr(1, packet.length - 4);
      const csc = packet.substr(packet.length - 2);
      return checksum(data) === parseInt(csc, 16);
    } else {
      return false;
    }
  });
};
const parsePosition = () => {
  return (source: Observable<string>): Observable<IGPSPosition> => {
    return new Observable((subscriber: Subscriber<IGPSPosition>) => {
      return source.subscribe(
        sentence => {
          if (sentence.startsWith('$GPRMC')) {
            const ret = {} as IGPSPosition;
            const fields = sentence.split(',');

            const date = new Date();
            date.setUTCFullYear(
              parseInt(fields[9].substr(4, 2), 10) + 2000,
              parseInt(fields[9].substr(2, 2), 10) - 1,
              parseInt(fields[9].substr(0, 2), 10)
            );
            date.setUTCHours(
              parseInt(fields[1].substr(0, 2), 10),
              parseInt(fields[1].substr(2, 2), 10),
              parseInt(fields[1].substr(4, 2), 10),
              parseInt(fields[1].substr(7), 10)
            );
            ret.date = date;

            ret.long = parseFloat(fields[5]) * (fields[6] === 'E' ? 1 : -1);
            ret.lat = parseFloat(fields[3]) * (fields[4] === 'N' ? 1 : -1);
            ret.speed = parseFloat(fields[7]);
            ret.course = parseFloat(fields[8]);
            subscriber.next(ret);
          }
        },
        error => {
          subscriber.error(error);
        },
        () => {
          subscriber.complete();
        }
      );
    });
  };
};
export const checksum = (str: string): number => {
  let c = 0;

  for (let i = 0; i < str.length; i++) {
    /* tslint:disable:no-bitwise */
    c ^= str.charCodeAt(i);
    /* tslint:enable:no-bitwise */
  }

  return c;
};
