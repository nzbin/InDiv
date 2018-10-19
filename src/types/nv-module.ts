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

export type TuseValueProvider = {
  provide: any;
  useValue: any;
};

export interface INvModule {
  $imports?: Function[];
  $components?: Function[];
  $providers?: (Function | TUseClassProvider | TuseValueProvider)[];
  $exports?: Function[];
  $providerList?: Map<Function | string, Function | any>;
  $providerInstances?: Map<Function | string, any>;
  $bootstrap?: Function;

  buildProviderList(): void;
  buildProviders4Services(): void;
  buildProviders4Components(): void;
  buildComponents4Components(): void;
  buildImports(): void;
}
