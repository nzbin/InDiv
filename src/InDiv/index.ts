import { IMiddleware, INvModule, EsRouteObject, IComponent } from '../types';

import Utils from '../Utils';
import { factoryCreator } from '../DI';
import { factoryModule } from '../NvModule';

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
  public $declarations: Function[];
  public $esRouteObject?: EsRouteObject;
  public $esRouteParmasObject?: {
    [props: string]: any;
  };


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
   * for Route set RootPath
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
   * @param {Function} BootstrapComponent
   * @param {Element} renderDOM
   * @returns {Promise<IComponent>}
   * @memberof InDiv
   */
  public renderComponent(BootstrapComponent: Function, renderDOM: Element): Promise<IComponent> {
    const component: any = factoryCreator(BootstrapComponent, this.$rootModule);

    component.$vm = this;
    component.$declarations = this.$rootModule.$declarations;
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
