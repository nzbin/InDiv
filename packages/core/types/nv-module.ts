import { Injector } from '../di';

export type TInjectTokenProvider = {
  [props: string]: any | Function;
  provide: any;
  useClass?: Function;
  useValue?: any;
};

export type TUseClassProvider = {
  provide: any;
  useClass: Function;
};

export type TUseValueProvider = {
  provide: any;
  useValue: any;
};

export type TProvider = Function | TUseClassProvider | TUseValueProvider;

export type TProviders = TProvider[];

export interface INvModule {
  imports?: Function[];
  declarations?: Function[];
  providers?: TProviders;
  exports?: Function[];
  exportsList?: Function[];
  bootstrap?: Function;
  privateInjector?: Injector;
}
