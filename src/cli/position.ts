#!/usr/bin/env node

import { homedir } from 'os';
import { main } from './position-cli';

main(process.argv.slice(2).join(' '), homedir() + '/.position').then(ret =>
  ret > 0 ? process.exit(ret) : process.exit()
);
