//inject mocha globally to allow custom interface refer without direct import - bypass bundle issue
global._ = require('lodash');
global.mocha = require('mocha');
global.chai = require('chai');
global.sinon = require('sinon');
global.chai.use(require('sinon-chai'));
global.random_name = require('node-random-name');

// Override ts-node compiler options
process.env.TS_NODE_PROJECT = 'tsconfig.test.json'
