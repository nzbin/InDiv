import { INvModule, IComponent } from '../types';

import { Utils } from '../utils';
import { factoryCreator } from '../di';
import { factoryModule } from '../nv-module';

export class ElementRef extends HTMLElement {}

interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export interface IMiddleware {
  bootstrap(vm: InDiv): void;
}

const utils = new Utils();

/**
 * main: for new InDiv
 *
 * @class InDiv
 */
export class InDiv {
  private readonly middlewareList: IMiddleware[] = [];
  private readonly rootDom: Element;
  private $routeDOMKey: string = 'router-render';
  private $rootModule: INvModule = null;
  private $declarations: Function[];
  private bootstrapComponent: IComponent;
  private render: () => Promise<IComponent>;
  private reRender: () => Promise<IComponent>;

  constructor() {
    if (!utils.isBrowser()) return;
    this.rootDom = document.querySelector('#root');
  }

  /**
   * for using middleware and use bootstrap method of middleware
   *
   * @param {Type<IMiddleware>} Modal
   * @returns {number}
   * @memberof InDiv
   */
  public use(Middleware: Type<IMiddleware>): number {
    const newMiddleware = new Middleware();
    newMiddleware.bootstrap(this);
    this.middlewareList.push(newMiddleware);
    return this.middlewareList.length - 1;
  }
  
/**
 * set component Render function
 * 
 * render and rerender will be a method in Component instance,
 * so you can use this in render and rerender
 *
 * @template R
 * @template Re
 * @param {R} [render]
 * @param {Re} [reRender]
 * @memberof InDiv
 */
  public setComponentRender<S = any, P = any, V = any>(render: () => Promise<IComponent<S, P, V>>, reRender?: () => Promise<IComponent<S, P, V>>): void {
    this.render = render;
    this.reRender = reRender ? reRender : render;
  }

  /**
   * get component Render function 
   *
   * @returns {{ render: () => Promise<IComponent>, reRender: () => Promise<IComponent> }}
   * @memberof InDiv
   */
  public getComponentRender(): { render: () => Promise<IComponent>, reRender: () => Promise<IComponent> } {
    return {
      render: this.render,
      reRender: this.reRender,
    };
  }

  /**
   * return component instance of root module's bootstrap
   *
   * @returns {IComponent}
   * @memberof InDiv
   */
  public getBootstrapComponent(): IComponent {
    return this.bootstrapComponent;
  }

  /**
   * set route's DOM tag name
   *
   * @param {string} routeDOMKey
   * @memberof InDiv
   */
  public setRouteDOMKey(routeDOMKey: string): void {
    this.$routeDOMKey = routeDOMKey;
  }
  
  /**
   * get route's DOM tag name
   *
   * @returns {string}
   * @memberof InDiv
   */
  public getRouteDOMKey(): string {
    return this.$routeDOMKey;
  }

  /**
   * get root module in InDiv
   *
   * @returns {INvModule}
   * @memberof InDiv
   */
  public getRootModule(): INvModule {
    return this.$rootModule;
  }

  /**
   * get root module in root module
   *
   * @returns {Function[]}
   * @memberof InDiv
   */
  public getDeclarations(): Function[] {
    return this.$declarations;
  }

  /**
   * bootstrap NvModule
   * 
   * if not use Route it will be used
   *
   * @param {Function} Nvmodule
   * @returns {void}
   * @memberof InDiv
   */
  public bootstrapModule(Nvmodule: Function): void {
    if (!Nvmodule) throw new Error('must send a root module');

    this.$rootModule = factoryModule(Nvmodule, null, this);
    this.$declarations = [...this.$rootModule.$declarations];
  }

  /**
   * init InDiv and renderModuleBootstrap()
   *
   * @returns {void}
   * @memberof InDiv
   */
  public init(): void {
    if (!utils.isBrowser()) return;

    if (!this.$rootModule) throw new Error('must use bootstrapModule to declare a root NvModule before init');
    if (!this.render) throw new Error('must use middleware to set a render in InDiv!');
    this.renderModuleBootstrap();
  }

  /**
   * expose function for render Component
   * 
   * if otherModule don't has use rootModule
   * 
   * if has otherModule, build component will use privateInjector from loadModule instead of rootInjector
   *
   * @param {Function} BootstrapComponent
   * @param {Element} renderDOM
   * @param {INvModule} [otherModule]
   * @returns {Promise<IComponent>}
   * @memberof InDiv
   */
  public async renderComponent(BootstrapComponent: Function, renderDOM: Element, otherModule?: INvModule): Promise<IComponent> {
    const provideAndInstanceMap = new Map();
    provideAndInstanceMap.set(InDiv, this);
    provideAndInstanceMap.set(ElementRef, renderDOM);

    const otherInjector = otherModule ? otherModule.privateInjector : null;
    const component: IComponent = factoryCreator(BootstrapComponent, otherInjector, provideAndInstanceMap);

    component.$vm = this;

    if (otherModule) {
      otherModule.$declarations.forEach((findDeclaration: Function) => {
        if (!component.$declarationMap.has((findDeclaration as any).$selector)) component.$declarationMap.set((findDeclaration as any).$selector, findDeclaration);
      });
    } else {
      this.$rootModule.$declarations.forEach((findDeclaration: Function) => {
        if (!component.$declarationMap.has((findDeclaration as any).$selector)) component.$declarationMap.set((findDeclaration as any).$selector, findDeclaration);
      });
    }

    component.render = this.render.bind(component);
    component.reRender = this.reRender.bind(component);
    // set otherInjector for components from loadModule to be used
    component.otherInjector = otherInjector;

    if (component.nvOnInit) component.nvOnInit();
    if (component.watchData) component.watchData();
    if (!component.$template) throw new Error('must decaler this.$template in bootstrap()');
    const template = component.$template;
    if (template && typeof template === 'string' && renderDOM) {
      if (component.nvBeforeMount) component.nvBeforeMount();

      const _component = await this.replaceDom(component, renderDOM);
      if (_component.nvAfterMount) _component.nvAfterMount();
      return _component;

    } else {
      throw new Error('renderBootstrap failed: template or rootDom is not exit');
    }
  }

  /**
   * render NvModule Bootstrap
   *
   * @returns {void}
   * @memberof InDiv
   */
  private async renderModuleBootstrap(): Promise<IComponent> {
    if (!this.$rootModule.$bootstrap) throw new Error('need bootstrap for render Module Bootstrap');
    const BootstrapComponent = this.$rootModule.$bootstrap;
    this.bootstrapComponent = await this.renderComponent(BootstrapComponent, this.rootDom);
    return this.bootstrapComponent;
  }

  /**
   * render adn replace DOM
   *
   * @param {IComponent} component
   * @param {Element} renderDOM
   * @returns {Promise<IComponent>}
   * @memberof InDiv
   */
  private replaceDom(component: IComponent, renderDOM: Element): Promise<IComponent> {
    component.renderDom = renderDOM;
    return component.render();
  }
}
