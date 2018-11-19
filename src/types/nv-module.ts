import { InDiv } from '../indiv';

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
  $indivInstance?: InDiv;
  $imports?: Function[];
  $declarations?: Function[];
  $providers?: (Function | TUseClassProvider | TUseValueProvider)[];
  $exports?: Function[];
  $exportsList?: Function[];
  $providerList?: Map<Function | string, Function | any>;
  $providerInstances?: Map<Function | string, any>;
  $bootstrap?: Function;
}
