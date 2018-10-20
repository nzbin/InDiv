import 'core-js/modules/es6.array.find';
import 'core-js/modules/es6.array.find-index';
import 'core-js/modules/es6.array.from';
import 'core-js/modules/es6.function.bind';
import 'core-js/modules/es6.reflect.construct';
import 'core-js/modules/es6.regexp.match';
import 'core-js/modules/es6.regexp.replace';
import 'core-js/modules/es6.map';
import 'core-js/modules/es6.promise';
import 'reflect-metadata';

export { default as Utils } from './utils';
export {
  OnInit,
  BeforeMount,
  AfterMount,
  OnDestory,
  HasRender,
  WatchState,
  RouteChange,
  ReceiveProps,
  SetState,
  SetLocation,
  GetLocation,
} from './lifecycle';
export { default as Watcher } from './watcher';
export { default as KeyWatcher } from './key-watcher';
export {
  Compile,
  CompileUtil,
  CompileUtilForRepeat,
  Router,
  TRouter,
  setLocation,
  getLocation,
} from './platform-browser';
export { Component, setState } from './component';
export { default as InDiv } from './indiv';
export { NvModule, factoryModule } from './nv-module';
export { default as NVHttp } from './http';
export {
  Injectable,
  Injected,
  injector,
  factoryCreator,
} from './di';
