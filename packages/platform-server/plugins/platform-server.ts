import { InDiv, IPlugin } from '@indiv/core';
import { _document, PlatfromServerRenderer } from '../renderer';

/**
 * indiv plugin for platform server
 * 
 * includes setRootElement and setRenderer
 *
 * @export
 * @class PlatformServer
 * @implements {IPlugin}
 */
export class PlatformServer implements IPlugin {
  public bootstrap(indivInstance: InDiv): void {
    const rootElement = _document.createElement('div');
    rootElement.id = 'root';
    indivInstance.setRootElement(rootElement);
    indivInstance.setRenderer(PlatfromServerRenderer);
  }
}
