import blessed = require('blessed');
import { getFileContents, IGPSPosition, NMEASource, print, printError, UDPServer } from '../lib';

export const main = async (param: string, filename: string): Promise<number> => {
  try {
    const settingsText = await getFileContents(filename);
    const settings = JSON.parse(settingsText);

    const source = new NMEASource({
      baudRate: settings.inputs[0].baudrate,
      path: settings.inputs[0].path
    });

    const server = new UDPServer(settings.repeaters[0].port);
    server.subscribeTo(source.sentences());

    return await exitCode(server, source);
  } catch (e) {
    printError('Error: ' + e);
    return 1;
  }
};

const exitCode = async (server: UDPServer, source: NMEASource): Promise<number> => {
  return new Promise(resolve => {
    const scr = new ScreenUI(() => {
      server.close();
      source.close();
      resolve(0);
    });

    source.fixes().subscribe(data => scr.updateView(data));
  });
};

class ScreenUI {
  private screen: any;
  private box: any;

  constructor(shutdown: (...args: any[]) => void) {
    this.screen = blessed.screen({
      smartCSR: true
    });

    this.screen.title = 'GPS Monitor';

    this.box = blessed.box({
      border: {
        type: 'line'
      },
      content: '',
      height: '50%',
      left: 'center',
      style: {
        bg: 'magenta',
        border: {
          fg: '#f0f0f0'
        },
        fg: 'white',
        hover: {
          bg: 'green'
        }
      },
      tags: true,
      top: 'center',
      width: '50%'
    });

    this.screen.append(this.box);

    this.screen.key(['escape', 'q', 'C-c'], () => {
      shutdown();
    });

    this.box.focus();
    this.screen.render();
  }

  public updateView(data: IGPSPosition) {
    this.box.setContent('');
    this.box.setLine(1, '{center}' + data.speed + ' knots{/center}\n');
    this.box.setLine(3, '{center}' + data.course + '°T{/center}\n');
    this.box.setLine(6, '{center}' + formatLat(data.lat) + '\t' + formatLong(data.long) + '{/center}\n');
    this.box.setLine(8, '{center}' + data.date + '{/center}\n');
    this.box.setLine(9, '{center}' + data.date.toUTCString() + '{/center}\n');
    this.screen.render();
  }
}

const formatLat = (lat?:number): string => {
  if (lat === undefined) {
    return '--';
  }
  let ns = '\'N';
  if (lat < 0) {
    ns = '\'S';
    lat = lat * -1;
  }
  const str = lat.toString();
  return '' + str.substr(0, str.length - 7) + '°' + str.substr(str.length-7) + ns;
};
const formatLong = (long?:number): string => {
  if (long === undefined) {
    return '--';
  }
  let ew = '\'E';
  if (long < 0) {
    ew = '\'W';
    long = long * -1;
  }
  const str = long.toString();
  return '' + str.substr(0, str.length - 7) + '°' + str.substr(str.length-7) + ew;
};
