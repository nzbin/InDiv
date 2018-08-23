import { IService } from './service';
import { IUtil } from './utils';

export interface INvModule {
  utils?: IUtil;
  $imports?: Function[];
  $components?: Function[];
  // $components?: {
  //   [name: string]: Function;
  // };
  $providers?: Function[];
  // $exports?: string[];
  $exports?: Function[];
  // $exportList?: {
  //   [name: string]: Function;
  // };
  providerList?: Map<string, IService>;
  bootstrap?: Function;

  // $declarations?(): void;
  buildImports?(): void;
  buildProviderList(): void;
  buildProviders4Services(): void;
  buildProviders4Components?(): void;
  buildComponents4Components?(): void;
  buildExports?(): void;
}
