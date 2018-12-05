import { InDiv, IPlugin } from '@indiv/core';
import { componentCompiler } from '../compile';

export class PlatformBrowser implements IPlugin {
  public bootstrap(indivInstance: InDiv): void {
    if (!indivInstance.getRootNode()) indivInstance.setRootNode(document.querySelector('#root'));
    indivInstance.setComponentCompiler(componentCompiler);
  }
}
