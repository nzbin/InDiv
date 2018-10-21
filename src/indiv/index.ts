import { IMiddleware, INvModule, EsRouteObject, IComponent } from '../types';

import Utils from '../utils';
import { factoryCreator } from '../di';
import { factoryModule } from '../nv-module';
import { render, reRender } from '../platform-browser';

const utils = new Utils();

/**
 * main: for new InDiv
 *
 * @class InDiv
 */
class InDiv {
  public modalList: IMiddleware<InDiv>[];
  public rootDom: Element;
  public $rootPath: string;
  public $canRenderModule: boolean;
  public $routeDOMKey: string;
  public $rootModule: INvModule;
  public $components: Function[];
  public $esRouteObject?: EsRouteObject;
  public $esRouteParmasObject?: {
    [props: string]: any;
  };
  public render: () => Promise<IComponent>;
  public reRender: () => Promise<IComponent>;

  constructor() {
    this.modalList = [];

    if (!utils.isBrowser()) return;

    this.rootDom = document.querySelector('#root');
    this.$rootPath = '/';
    this.$canRenderModule = true;
    this.$routeDOMKey = 'router-render';

    this.$rootModule = null;
    this.$esRouteObject = null;
    this.$esRouteParmasObject = {};

    // render,reRender for Component
    // developer can use function use(modal: IMiddleware<InDiv>): number to change render and reRender
    this.render = render;
    this.reRender = reRender;
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
    return this.modalList.findIndex(md => utils.isEqual(md, modal));
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
 * for Middleware set component Render function 
 *
 * @template R
 * @template Re
 * @param {R} [render]
 * @param {Re} [reRender]
 * @memberof InDiv
 */
  public setComponentRender<S = any, P = any, V = any>(render?: () => Promise<IComponent<S, P, V>>, reRender?: () => Promise<IComponent<S, P, V>>): void {
    this.render = render;
    this.reRender = reRender;
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

    this.$rootModule = factoryModule(Esmodule);
    this.$components = [...this.$rootModule.$components];
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
   * @param {Function} BootstrapComponent
   * @param {Element} renderDOM
   * @returns {Promise<IComponent>}
   * @memberof InDiv
   */
  public renderComponent(BootstrapComponent: Function, renderDOM: Element): Promise<IComponent> {
    const component: any = factoryCreator(BootstrapComponent, this.$rootModule);

    component.$vm = this;
    component.$components = this.$rootModule.$components;

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
  public replaceDom(component: IComponent, renderDOM: Element): Promise<IComponent> {
    component.renderDom = renderDOM;
    return component.render();
  }
}

export default InDiv;
