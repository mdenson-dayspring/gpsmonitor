# @matthewdenson/gpsmonitor

This is a small app that will be used on my boat to multiplex my GPS and AIS receiver data to my boat's 
LAN. I'm also planning to have this run on a raspi that will have a small console to report the current 
course, speed and location to the helm positon.

A work in progress right now.

# Install to use (not on npm yet)
```
$ sudo npm i -g @matthewdenson/gpsmonitor
```

# Development instructions

## Install for development
```
$ git clone ....
$ npm install
```

## Start testing with watch
```
$ npm run test:watch
```

## Test, Lint and format
```
$ npm run test
$ npm run lint
$ npm run format
```

## increment version (up-to-date working directory)
```
$ npm verion patch|minor|major
```

## publish new version to npm
```
# have an up-to-date working directory
$ npm verion patch|minor|major
$ npm login
$ npm publish
```
