import { IComponent } from './component';
import { IService } from './service';
import { IUtil } from './utils';

export interface IEsModule {
  utils?: IUtil;
  $imports?: Function[];
  $components?: {
    [name: string]: IComponent;
  };
  $providers?: IService[];
  $exports?: string[];
  $exportList?: {
    [name: string]: IComponent;
  };
  singletonList?: Map<string, IService>;
  $bootstrap?: IComponent;

  $declarations?(): void;
  $buildImports?(): void;
  $buildProviders4Components?(): void;
  $buildComponents4Components?(): void;
  $buildExports?(): void;
}
