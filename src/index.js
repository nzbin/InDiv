require('babel-polyfill');
const Utils = require('./Utils');
const Lifecycle = require('./Lifecycle');
const Watcher = require('./Watcher');
const KeyWatcher = require('./KeyWatcher');
const Compile = require('./Compile');
const Component = require('./Component');
const Controller = require('./Controller');
const Router = require('./Router').Router;
const RouterHash = require('./Router').RouterHash;
const Easiest = require('./Easiest');

module.exports = {
  Utils,
  Lifecycle,
  Watcher,
  KeyWatcher,
  Compile,
  Component,
  Controller,
  Router,
  RouterHash,
  Easiest,
};
