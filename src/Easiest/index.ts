import { IMiddleware, IEsModule, EsRouteObject, IComponent } from '../types';

import Utils from '../Utils';
import { factoryCreator } from '../Injectable';
import { factoryModule } from '../EsModule';

class Easiest {
  public modalList: IMiddleware<Easiest>[];
  public utils: Utils;
  public rootDom: Element;
  public $rootPath: string;
  public $canRenderModule: boolean;
  public $routeDOMKey: string;
  public $rootModule: IEsModule;
  public $components: {
    [name: string]: Function;
  };
  public $esRouteObject?: EsRouteObject;


  constructor() {
    this.modalList = [];
    this.utils = new Utils();

    this.rootDom = document.querySelector('#root');
    this.$rootPath = '/';
    this.$canRenderModule = true;
    this.$routeDOMKey = 'router-render';

    this.$rootModule = null;
    this.$esRouteObject = null;
  }

  public $use(modal: IMiddleware<Easiest>): number {
    modal.$bootstrap(this);
    this.modalList.push(modal);
    return this.modalList.findIndex(md => this.utils.isEqual(md, modal));
  }

  public $setRootPath(rootPath: string): void {
    if (rootPath && typeof rootPath === 'string') {
      this.$rootPath = rootPath;
    } else {
      console.error('rootPath is not defined or rootPath must be a String');
    }
  }

  public $bootstrapModule(Esmodule: Function): void {
    if (!Esmodule) {
      console.error('must send a root module');
      return;
    }

    this.$rootModule = factoryModule(Esmodule);
    this.$components = Object.assign({}, this.$rootModule.$components);
  }

  public $init(): void {
    if (!this.$rootModule) {
      console.error('must use $bootstrapModule to declare a root EsModule before $init');
      return;
    }
    if (this.$canRenderModule) this.$renderModuleBootstrap();
  }

  public $renderModuleBootstrap(): void {
    if (!this.$rootModule.$bootstrap) {
      console.error('need $bootstrap for render Module Bootstrap');
      return;
    }
    const BootstrapComponent = this.$rootModule.$bootstrap;
    this.$renderComponent(BootstrapComponent, this.rootDom);
  }

  // public $renderComponent(BootstrapComponent: Function, renderDOM: Element): Promise<any> {
  public $renderComponent(BootstrapComponent: Function, renderDOM: Element): any {
    const component: any = factoryCreator(BootstrapComponent, this.$rootModule);

    component.$vm = this;
    component.$components = this.$rootModule.$components;
    if (component.$beforeInit) component.$beforeInit();
    if (component.esOnInit) component.esOnInit();
    if (!component.$template) {
      console.error('must decaler this.$template in $bootstrap()');
      return;
    }
    const template = component.$template;
    if (template && typeof template === 'string' && renderDOM) {
      if (component.esBeforeMount) component.esBeforeMount();

      this.replaceDom(component, renderDOM);
      if (component.esAfterMount) component.esAfterMount();
      return component;

      // return Promise.resolve(component);
      // this.replaceDom(component, renderDOM).then(() => {
      //   if (component.esAfterMount) component.esAfterMount();
      // });
      // return Promise.resolve(component);

    } else {
      console.log('renderDOMrenderDOM', renderDOM);
      console.error('renderBootstrap failed: template or rootDom is not exit');
      // return Promise.reject();
      return false;
    }
  }

  // public replaceDom(component: IComponent, renderDOM: Element): Promise<any> {
  public replaceDom(component: IComponent, renderDOM: Element): void {
    component.$renderDom = renderDOM;
    // if (component.$render) {
    //   component.$render();
    //   return Promise.resolve();
    // } else {
    //   return Promise.reject();
    // }
    component.$render();
  }
}

export default Easiest;
