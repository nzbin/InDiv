require('babel-polyfill');
const Utils = require('./Utils');
const Lifecycle = require('./Lifecycle');
const Watcher = require('./Watcher');
const KeyWatcher = require('./KeyWatcher');
const Compile = require('./Compile');
const Component = require('./Component');
const Router = require('./Router').Router;
const RouterHash = require('./Router').RouterHash;
const Easiest = require('./Easiest');
const EsModule = require('./EsModule');
const Service = require('./Service');
const Http = require('./Http');

module.exports = {
  Utils,
  Lifecycle,
  Watcher,
  KeyWatcher,
  Compile,
  Component,
  Router,
  RouterHash,
  Easiest,
  EsModule,
  Service,
  Http,
};
