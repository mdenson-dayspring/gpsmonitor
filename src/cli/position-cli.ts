import { getFileContents, NMEASource, print, printError, UDPServer } from '../lib';

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

    source.fixes().subscribe(data => print(JSON.stringify(data)));

    return await closeApp();
  } catch (e) {
    printError('Error: ' + e);
    return 1;
  }
};

const closeApp = async (): Promise<number> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(0);
    }, 60000);
  });
};
