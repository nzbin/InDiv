import { InDiv, IPlugin } from '@indiv/core';
import { PlatfromBrowserRenderer } from '../renderer';

/**
 * indiv plugin for platform browser
 * 
 * includes setRootElement and setRenderer
 *
 * @export
 * @class PlatformBrowser
 * @implements {IPlugin}
 */
export class PlatformBrowser implements IPlugin {
  public bootstrap(indivInstance: InDiv): void {
    indivInstance.setRootElement(document.getElementById('root'));
    indivInstance.setRenderer(PlatfromBrowserRenderer);
  }
}
