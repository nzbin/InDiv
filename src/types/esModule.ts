// import { IComponent } from './component';
import { IService } from './service';
import { IUtil } from './utils';

export interface IEsModule {
  utils?: IUtil;
  $imports?: Function[];
  $components?: {
    [name: string]: Function;
  };
  $providers?: Function[];
  $exports?: string[];
  $exportList?: {
    [name: string]: Function;
  };
  singletonList?: Map<string, IService>;
  $bootstrap?: Function;

  $declarations?(): void;
  $buildImports?(): void;
  $buildProviders4Components?(): void;
  $buildComponents4Components?(): void;
  $buildExports?(): void;
}
