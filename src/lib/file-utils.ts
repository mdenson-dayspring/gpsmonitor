import { closeSync, existsSync, openSync, readFile, writeFile } from 'fs';

export const getFileContents = async (name: string): Promise<string> => {
  if (!existsSync(name)) {
    // touch file
    closeSync(openSync(name, 'w'));
  }
  return new Promise((resolve, reject) => {
    readFile(name, 'utf8', (err, data) => {
      if (err) {
        reject('File could not be read.');
      } else {
        resolve(data);
      }
    });
  });
};

export const writeFileContents = async (name: string, text: string): Promise<number> => {
  return new Promise(resolve => {
    writeFile(name, text, 'utf8', err => {
      if (err) {
        resolve(2);
      } else {
        resolve(0);
      }
    });
  });
};
