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
export {
  Component,
  setState,
} from './component';
export { default as InDiv } from './indiv';
export {
  NvModule,
  factoryModule,
} from './nv-module';
export { default as NVHttp } from './http';
export {
  Injectable,
  Injected,
  injector,
  factoryCreator,
} from './di';
