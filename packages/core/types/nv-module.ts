import { InDiv } from '../indiv';
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

export interface INvModule {
  imports?: Function[];
  declarations?: Function[];
  providers?: (Function | TUseClassProvider | TUseValueProvider)[];
  exports?: Function[];
  exportsList?: Function[];
  bootstrap?: Function;
  privateInjector?: Injector;
}
