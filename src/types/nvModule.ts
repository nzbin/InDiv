import { IUtil } from './utils';

export type TInjectTokenProvider = {
  [props: string]: any | Function;
  provide: any;
  useClass?: Function;
  useValue?: any;
};

export interface INvModule {
  utils?: IUtil;
  $imports?: Function[];
  $components?: Function[];
  $providers?: (Function | TInjectTokenProvider)[];
  $exports?: Function[];
  providerList?: Map<Function | string, Function | any>;
  bootstrap?: Function;

  buildImports?(): void;
  buildProviderList(): void;
  buildProviders4Services(): void;
  buildProviders4Components?(): void;
  buildComponents4Components?(): void;
  buildExports?(): void;
}
