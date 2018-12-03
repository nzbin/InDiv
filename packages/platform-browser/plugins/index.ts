import { InDiv, IPlugin } from '@indiv/core';
import { render } from '../render';

// todo
export class PlatformBrowser implements IPlugin {
  public bootstrap(indivInstance: InDiv): void {
    indivInstance.setComponentRender(render);
  }
}
