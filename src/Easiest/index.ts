import { IEasiest, IMiddleware, IEsModule, EsRouteObject, IComponent, IService } from '../types';

import Utils from '../Utils';

// class Easiest implements IEasiest {
class Easiest {
  public modalList: IMiddleware<IEasiest>[];
  public utils: Utils;
  public $globalContext: any;
  public rootDom: Element;
  public $rootPath: string;
  public $canRenderModule: boolean;
  public $esRouteMode: string;
  public $routeDOMKey: string;
  public $rootModule: IEsModule;
  public $components: {
    [name: string]: Function;
  }
  public $esRouteObject?: EsRouteObject;


  constructor() {
    this.modalList = [];
    this.utils = new Utils();
    this.$globalContext = {};
    this.rootDom = document.querySelector('#root');
    this.$rootPath = '/';
    this.$canRenderModule = true;
    this.$esRouteMode = null;
    this.$routeDOMKey = 'router-render';

    this.$rootModule = null;
    this.$esRouteObject = null;
  }

  public $use(modal: IMiddleware<IEasiest>): number {
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
    this.$rootModule = new (Esmodule as any)();
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

  public $renderComponent(BootstrapComponent: Function, renderDOM: Element): Promise<any> {
    const args = this.createInjector(BootstrapComponent);
    const component: IComponent = Reflect.construct((BootstrapComponent as any), args);
    component.$vm = this;
    component.$components = this.$rootModule.$components;
    if (component.$beforeInit) component.$beforeInit();
    if (component.$onInit) component.$onInit();
    if (!component.$template) {
      console.error('must decaler this.$template in $bootstrap()');
      return;
    }
    const template = component.$template;
    if (template && typeof template === 'string' && renderDOM) {
      if (component.$beforeMount) component.$beforeMount();
      this.replaceDom(component, renderDOM).then(() => {
        if (component.$afterMount) component.$afterMount();
      });
      return Promise.resolve(component);
    } else {
      console.error('renderBootstrap failed: template or rootDom is not exit');
      return Promise.reject();
    }
  }

  public createInjector(BootstrapComponent: any): IService[] {
    // const DELEGATE_CTOR = /^function\s+\S+\(\)\s*{[\s\S]+\.apply\(this,\s*arguments\)/;
    // const INHERITED_CLASS = /^class\s+[A-Za-z\d$_]*\s*extends\s+[A-Za-z\d$_]+\s*{/;
    // const INHERITED_CLASS_WITH_CTOR = /^class\s+[A-Za-z\d$_]*\s*extends\s+[A-Za-z\d$_]+\s*{[\s\S]*constructor\s*\(/;
    const CLASS_ARGUS = /^function\s+[^\(]*\(\s*([^\)]*)\)/m;
    const argList = BootstrapComponent.toString().match(CLASS_ARGUS)[1].replace(/ /g, '').split(',');
    const args: IService[] = [];
    argList.forEach((arg: string) => {
      const argu = `${arg.charAt(0).toUpperCase()}${arg.slice(1)}`;
      const service = BootstrapComponent._injectedProviders.has(argu) ? BootstrapComponent._injectedProviders.get(argu) : this.$rootModule.$providers.find((s: Function) => s.constructor.name === argu);
      if (service) args.push(service);
    });
    return args;
  }

  public replaceDom(component: IComponent, renderDOM: Element): Promise<any> {
    component.$renderDom = renderDOM;
    if (component.$render) {
      component.$render();
      return Promise.resolve();
    } else {
      return Promise.reject();
    }
  }
}

export default Easiest;
