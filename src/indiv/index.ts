import { IMiddleware, INvModule, IComponent } from '../types';

import { Utils } from '../utils';
import { factoryCreator } from '../di';
import { factoryModule } from '../nv-module';
import { render } from '../platform-browser';
import { ElementRef } from '../internal-type';

const utils = new Utils();

/**
 * main: for new InDiv
 *
 * @class InDiv
 */
export class InDiv {
  private modalList: IMiddleware<InDiv>[];
  private rootDom: Element;
  private $rootPath: string;
  private $canRenderModule: boolean;
  private $routeDOMKey: string;
  private $rootModule: INvModule;
  private $declarations: Function[];
  private render: () => Promise<IComponent>;
  private reRender: () => Promise<IComponent>;

  constructor() {
    this.modalList = [];

    if (!utils.isBrowser()) return;

    this.rootDom = document.querySelector('#root');
    this.$rootPath = '/';
    this.$canRenderModule = true;
    this.$routeDOMKey = 'router-render';

    this.$rootModule = null;

    // render,reRender for Component
    // developer can use function use(modal: IMiddleware<InDiv>): number to change render and reRender
    this.render = render;
    this.reRender = render;
  }

  /**
   * for using middleware and use bootstrap method of middleware
   *
   * @param {IMiddleware<InDiv>} modal
   * @returns {number}
   * @memberof InDiv
   */
  public use(modal: IMiddleware<InDiv>): number {
    modal.bootstrap(this);
    this.modalList.push(modal);
    return this.modalList.length - 1;
  }

  /**
   * for Middleware set RootPath
   * 
   * if not use, rootPath will be <router-render />
   *
   * @param {string} rootPath
   * @memberof InDiv
   */
  public setRootPath(rootPath: string): void {
    if (rootPath && typeof rootPath === 'string') {
      this.$rootPath = rootPath;
    } else {
      throw new Error('rootPath is not defined or rootPath must be a String');
    }
  }

  /**
   * get RootPath for InDiv
   *
   * @returns {string}
   * @memberof InDiv
   */
  public getRootPath(): string {
    return this.$rootPath;
  }
  
/**
 * set component Render function 
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
   * set InDiv can render module's bootstrap
   *
   * @param {boolean} canRenderModule
   * @memberof InDiv
   */
  public setCanRenderModule(canRenderModule: boolean): void {
    this.$canRenderModule = canRenderModule;
  }

  /**
   * get InDiv can render module's bootstrap
   *
   * @returns {boolean}
   * @memberof InDiv
   */
  public getCanRenderModule(): boolean {
    return this.$canRenderModule;
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
  public getDirectives(): Function[] {
    return this.$declarations;
  }

  /**
   * bootstrap NvModule
   * 
   * if not use Route it will be used
   *
   * @param {Function} Esmodule
   * @returns {void}
   * @memberof InDiv
   */
  public bootstrapModule(Esmodule: Function): void {
    if (!Esmodule) throw new Error('must send a root module');

    this.$rootModule = factoryModule(Esmodule, this);
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
    if (this.$canRenderModule) this.renderModuleBootstrap();
  }

  /**
   * render NvModule Bootstrap
   *
   * @returns {void}
   * @memberof InDiv
   */
  public renderModuleBootstrap(): void {
    if (!this.$rootModule.$bootstrap) throw new Error('need bootstrap for render Module Bootstrap');
    const BootstrapComponent = this.$rootModule.$bootstrap;
    this.renderComponent(BootstrapComponent, this.rootDom);
  }

  /**
   * expose function for render Component
   * 
   * if loadModule don't has use rootModule
   *
   * @param {Function} BootstrapComponent
   * @param {Element} renderDOM
   * @param {INvModule} [loadModule]
   * @returns {Promise<IComponent>}
   * @memberof InDiv
   */
  public renderComponent(BootstrapComponent: Function, renderDOM: Element, loadModule?: INvModule): Promise<IComponent> {
    const internalDependence = new Map();
    internalDependence.set(InDiv, this);
    internalDependence.set(ElementRef, renderDOM);
    const component: any = factoryCreator(BootstrapComponent, this.$rootModule, loadModule, internalDependence);

    component.$vm = this;

    if (loadModule) {
      loadModule.$declarations.forEach((findDeclaration: Function) => {
        if (!component.$declarationMap.has((findDeclaration as any).$selector)) component.$declarationMap.set((findDeclaration as any).$selector, findDeclaration);
      });
    } else {
      this.$rootModule.$declarations.forEach((findDeclaration: Function) => {
        if (!component.$declarationMap.has((findDeclaration as any).$selector)) component.$declarationMap.set((findDeclaration as any).$selector, findDeclaration);
      });
    }

    component.render = this.render.bind(component);
    component.reRender = this.reRender.bind(component);

    if (component.nvOnInit) component.nvOnInit();
    if (component.watchData) component.watchData();
    if (!component.$template) throw new Error('must decaler this.$template in bootstrap()');
    const template = component.$template;
    if (template && typeof template === 'string' && renderDOM) {
      if (component.nvBeforeMount) component.nvBeforeMount();

      return this.replaceDom(component, renderDOM)
      .then((_component) => {
        if (_component.nvAfterMount) _component.nvAfterMount();
        return _component;
      });

    } else {
      throw new Error('renderBootstrap failed: template or rootDom is not exit');
    }
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
