import { IService } from './service';
import { IUtil } from './utils';

export interface INvModule {
  utils?: IUtil;
  $imports?: Function[];
  $components?: Function[];
  $providers?: Function[];
  $exports?: Function[];
  providerList?: Map<string, IService>;
  bootstrap?: Function;

  buildImports?(): void;
  buildProviderList(): void;
  buildProviders4Services(): void;
  buildProviders4Components?(): void;
  buildComponents4Components?(): void;
  buildExports?(): void;
}
