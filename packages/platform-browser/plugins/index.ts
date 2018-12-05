import { InDiv, IPlugin } from '@indiv/core';
import { componentCompiler } from '../compile';

// todo 移动逻辑进来
export class PlatformBrowser implements IPlugin {
  public bootstrap(indivInstance: InDiv): void {
    indivInstance.setComponentCompiler(componentCompiler);
  }
}
