import { InDiv, IPlugin } from '@indiv/core';
import { PlatfromBrowserRenderer } from '../renderer';

export class PlatformBrowser implements IPlugin {
  public bootstrap(indivInstance: InDiv): void {
    indivInstance.setRootElement(document.getElementById('root'));
    indivInstance.setRenderer(new PlatfromBrowserRenderer());
  }
}
