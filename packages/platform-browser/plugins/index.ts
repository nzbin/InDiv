import { InDiv, IPlugin } from '@indiv/core';
import { render } from '../render';

// todo 移动逻辑进来
export class PlatformBrowser implements IPlugin {
  public bootstrap(indivInstance: InDiv): void {
    indivInstance.setComponentRender(render);
  }
}
