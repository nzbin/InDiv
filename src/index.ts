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

export { default as Utils } from './Utils';
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
} from './Lifecycle';
export { default as Watcher } from './Watcher';
export { default as KeyWatcher } from './KeyWatcher';
export { default as Compile } from './Compile';
export {
  CompileUtilForRepeat,
  CompileUtil,
} from './CompileUtils';
export { Component, setState } from './Component';
export { Router, TRouter, setLocation, getLocation } from './Router';
export { default as InDiv } from './InDiv';
export { NvModule, factoryModule } from './NvModule';
export { default as NVHttp } from './Http';
export {
  Injectable,
  Injected,
  injector,
  factoryCreator,
} from './DI';
