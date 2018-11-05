import { TRouter, IInDiv, IComponent, ComponentList, INvModule, TLoadChild, TChildModule } from '../../types';

import { Utils } from '../../utils';
import { KeyWatcher } from '../../key-watcher';
import { factoryModule } from '../../nv-module';

export { TRouter } from '../../types';

const utils = new Utils();

/**
 * route for InDiv
 *
 * @export
 * @class Router
 */
export class Router {
  public routes: TRouter[];
  public routesList: TRouter[];
  public currentUrl: string;
  public lastRoute: string;
  public rootDom: Element;
  public $rootPath: string;
  public hasRenderComponentList: IComponent[];
  public needRedirectPath: string;
  public $vm: IInDiv;
  public watcher: KeyWatcher;
  public renderRouteList: string[];
  public routeChange?: (lastRoute?: string, nextRoute?: string) => void;

  constructor() {
    this.routes = [];
    this.routesList = [];
    this.currentUrl = '';
    this.lastRoute = null;
    this.rootDom = null;
    this.$rootPath = '/';
    this.hasRenderComponentList = [];
    this.needRedirectPath = null;
    this.$vm = null;
    this.watcher = null;
    this.renderRouteList = [];
  }

  /**
   * bootstrap and init watch $esRouteParmasObject in InDiv
   *
   * @param {IInDiv} vm
   * @returns {void}
   * @memberof Router
   */
  public bootstrap(vm: IInDiv): void {
      this.$vm = vm;
      this.$vm.setRootPath(this.$rootPath);
      this.$vm.$canRenderModule = false;
      this.$vm.$routeDOMKey = 'router-render';

      if (!utils.isBrowser()) return;
      window.addEventListener('load', this.refresh.bind(this), false);
      window.addEventListener('popstate', () => {
        let path;
        if (this.$rootPath === '/') {
          path = location.pathname || '/';
        } else {
          path = location.pathname.replace(this.$rootPath, '') === '' ? '/' : location.pathname.replace(this.$rootPath, '');
        }
        this.$vm.$esRouteObject = {
          path,
          query: {},
          data: null,
        };
        this.$vm.$esRouteParmasObject = {};
      }, false);
    }

  /**
   * set rootDom
   *
   * @param {TRouter[]} arr
   * @returns {void}
   * @memberof Router
   */
  public init(arr: TRouter[]): void {
    if (!utils.isBrowser()) return;

    if (arr && arr instanceof Array) {
      const rootDom = document.querySelector('#root');
      this.rootDom = rootDom || null;
      this.routes = arr;
      this.routesList = [];
    } else {
      throw new Error(`route error: no routes exit`);
    }
  }

  /**
   * set rootPath
   *
   * @param {string} rootPath
   * @memberof Router
   */
  public setRootPath(rootPath: string): void {
    if (rootPath && typeof rootPath === 'string') {
      this.$rootPath = rootPath;
    } else {
      throw new Error('route error: rootPath is not defined or rootPath must be a String');
    }
  }

  /**
   * redirectTo a path
   *
   * @private
   * @param {string} redirectTo
   * @memberof Router
   */
  private redirectTo(redirectTo: string): void {
    const rootPath = this.$rootPath === '/' ? '' : this.$rootPath;
    history.replaceState(null, null, `${rootPath}${redirectTo}`);
    this.$vm.$esRouteObject = {
      path: redirectTo || '/',
      query: {},
      data: null,
    };
    this.$vm.$esRouteParmasObject = {};
  }

  /**
   * refresh if not watch $esRouteObject
   *
   * @private
   * @memberof Router
   */
  private refresh(): void {
    if (!this.$vm.$esRouteObject || !this.watcher) {
      let path;
      if (this.$rootPath === '/') {
        path = location.pathname || '/';
      } else {
        path = location.pathname.replace(this.$rootPath, '') === '' ? '/' : location.pathname.replace(this.$rootPath, '');
      }
      this.$vm.$esRouteObject = {
        path,
        query: {},
        data: null,
      };
      this.$vm.$esRouteParmasObject = {};
      this.watcher = new KeyWatcher(this.$vm, '$esRouteObject', this.refresh.bind(this));
    }
    this.currentUrl = this.$vm.$esRouteObject.path || '/';
    this.routesList = [];
    this.renderRouteList = this.currentUrl === '/' ? ['/'] : this.currentUrl.split('/');
    this.renderRouteList[0] = '/';
    this.distributeRoutes();
  }

  /**
   * distribute routes and decide insert or general Routes
   * 
   * @private
   * @returns {Promise<any>}
   * @memberof Router
   */
  private async distributeRoutes(): Promise<any> {
    if (this.lastRoute && this.lastRoute !== this.currentUrl) {
      // has rendered
      this.$vm.$esRouteParmasObject = {};
      await this.insertRenderRoutes();
    } else {
      // first render
      await this.generalDistributeRoutes();
    }
    if (this.routeChange) this.routeChange(this.lastRoute, this.currentUrl);
    this.lastRoute = this.currentUrl;
    if (this.needRedirectPath) {
      this.redirectTo(this.needRedirectPath);
      this.needRedirectPath = null;
    }
  }

  /**
   * insert Routes and render
   * 
   * if has rendered Routes, it will find which is different and render it
   *  
   * @private
   * @returns {Promise<IComponent>}
   * @memberof Router
   */
  private async insertRenderRoutes(): Promise<IComponent> {
    const lastRouteList = this.lastRoute === '/' ? ['/'] : this.lastRoute.split('/');
    lastRouteList[0] = '/';

    for (let index = 0; index < this.renderRouteList.length; index++) {
      const path = this.renderRouteList[index];
      if (index === 0) {
        const rootRoute = this.routes.find(route => route.path === `${path}` || /^\/\:.+/.test(route.path));
        if (!rootRoute) throw new Error(`route error: wrong route instantiation in insertRenderRoutes: ${this.currentUrl}`);
        this.routesList.push(rootRoute);
      } else {
        const lastRoute = this.routesList[index - 1].children;
        if (!lastRoute || !(lastRoute instanceof Array)) throw new Error('route error: routes not exit or routes must be an array!');
        const route = lastRoute.find((r: TRouter) => r.path === `/${path}` || /^\/\:.+/.test(r.path));
        if (!route) throw new Error(`route error: wrong route instantiation: ${this.currentUrl}`);
        this.routesList.push(route);
      }

      if (path !== lastRouteList[index]) {
        const needRenderRoute = this.routesList[index];
        if (!needRenderRoute) throw new Error(`route error: wrong route instantiation in insertRenderRoutes: ${this.currentUrl}`);

        const renderDom = document.querySelectorAll('router-render')[index - 1];

        if (!needRenderRoute.component && !needRenderRoute.redirectTo && !needRenderRoute.loadChild) throw new Error(`route error: path ${needRenderRoute.path} need a component which has children path or need a redirectTo which has't children path`);

        if (/^\/\:.+/.test(needRenderRoute.path) && !needRenderRoute.redirectTo) {
          const key = needRenderRoute.path.split('/:')[1];
          this.$vm.$esRouteParmasObject[key] = path;
        }

        let needRenderComponent = null;
        let component = null;
        if (needRenderRoute.component) {
          needRenderComponent = this.$vm.$components.find((component: any) => component.$selector === needRenderRoute.component);
          component = await this.instantiateComponent(needRenderComponent, renderDom);
        }
        if (needRenderRoute.loadChild) {
          const loadModule = await this.NvModuleFactoryLoader(needRenderRoute.loadChild);
          needRenderComponent = loadModule.$bootstrap;
          component = await this.instantiateComponent(needRenderComponent, renderDom, loadModule);
        }

        if (needRenderComponent) {
          // insert needRenderComponent on index in this.hasRenderComponentList
          // and remove other component which index >= index of needRenderComponent
          if (component) {
            if (this.hasRenderComponentList[index]) this.hasRenderComponentList.splice(index, 0, component);
            if (!this.hasRenderComponentList[index]) this.hasRenderComponentList[index] = component;
          } else {
            throw new Error(`route error: path ${needRenderRoute.path} need a component`);
          }

          this.routerChangeEvent(index);
        }

        if (needRenderRoute.redirectTo && /^\/.*/.test(needRenderRoute.redirectTo) && (index + 1) === this.renderRouteList.length) {
          this.needRedirectPath = needRenderRoute.redirectTo;
          return;
        }
      }

      // add parmas in $esRouteParmasObject
      if (path === lastRouteList[index]) {
        const needRenderRoute = this.routesList[index];
        if (/^\/\:.+/.test(needRenderRoute.path) && !needRenderRoute.redirectTo) {
          const key = needRenderRoute.path.split('/:')[1];
          this.$vm.$esRouteParmasObject[key] = path;
        }
      }

      if (index === (this.renderRouteList.length - 1) && index < (lastRouteList.length - 1)) {
        const renderDom = document.querySelectorAll('router-render')[index];
        this.routerChangeEvent(index);

        if (renderDom && renderDom.hasChildNodes()) renderDom.removeChild(renderDom.childNodes[0]);

        const needRenderRoute = this.routesList[index];
        if (needRenderRoute.redirectTo && /^\/.*/.test(needRenderRoute.redirectTo) && (index + 1) === this.renderRouteList.length) {
          this.needRedirectPath = needRenderRoute.redirectTo;
          return;
        }
      }
    }
  }

  /**
   * render Routes
   * 
   * first render
   *  
   * @private
   * @returns {Promise<IComponent>}
   * @memberof Router
   */
  private async generalDistributeRoutes(): Promise<IComponent> {
    for (let index = 0; index < this.renderRouteList.length; index++) {
      const path = this.renderRouteList[index];
      if (index === 0) {
        const rootRoute = this.routes.find(route => route.path === `${path}` || /^\/\:.+/.test(route.path));
        if (!rootRoute) throw new Error(`route error: wrong route instantiation in generalDistributeRoutes: ${this.currentUrl}`);

        const rootDom = document.querySelector('#root');

        let FindComponent = null;
        let component = null;
        if (rootRoute.component) {
          FindComponent = this.$vm.$rootModule.$components.find((component: any) => component.$selector === rootRoute.component);
          component = await this.instantiateComponent(FindComponent, rootDom);
        }
        if (rootRoute.loadChild) {
          const loadModule = await this.NvModuleFactoryLoader(rootRoute.loadChild);
          FindComponent = loadModule.$bootstrap;
          component = await this.instantiateComponent(FindComponent, rootDom, loadModule);
        }

        if (!FindComponent) throw new Error(`route error: root route's path: ${rootRoute.path} need a component`);


        if (/^\/\:.+/.test(rootRoute.path)) {
          const key = rootRoute.path.split('/:')[1];
          this.$vm.$esRouteParmasObject[key] = path;
        }

        if (!utils.isBrowser()) return;

        this.routesList.push(rootRoute);

        // 因为没有 所有要push进去
        if (component) this.hasRenderComponentList.push(component);

        if (index === this.renderRouteList.length - 1) this.routerChangeEvent(index);

        if (rootRoute.redirectTo && /^\/.*/.test(rootRoute.redirectTo) && (index + 1) === this.renderRouteList.length) {
          this.needRedirectPath = rootRoute.redirectTo;
          this.renderRouteList.push(rootRoute.redirectTo);
          return;
        }
      } else {
        const lastRoute = this.routesList[index - 1].children;
        if (!lastRoute || !(lastRoute instanceof Array)) throw new Error('route error: routes not exit or routes must be an array!');
        const route = lastRoute.find(r => r.path === `/${path}` || /^\/\:.+/.test(r.path));
        if (!route) throw new Error(`route error: wrong route instantiation: ${this.currentUrl}`);

        const renderDom = document.querySelectorAll('router-render')[index - 1];

        let FindComponent = null;
        let component = null;
        if (route.component) {
          FindComponent = this.$vm.$rootModule.$components.find((component: any) => component.$selector === route.component);
          component = await this.instantiateComponent(FindComponent, renderDom);
        }
        if (route.loadChild) {
          const loadModule = await this.NvModuleFactoryLoader(route.loadChild);
          FindComponent = loadModule.$bootstrap;
          component = await this.instantiateComponent(FindComponent, renderDom, loadModule);
        }

        if (!route.component && !route.redirectTo && !route.loadChild) throw new Error(`route error: path ${route.path} need a component which has children path or need a  redirectTo which has't children path`);

        if (/^\/\:.+/.test(route.path)) {
          const key = route.path.split('/:')[1];
          this.$vm.$esRouteParmasObject[key] = path;
        }
        this.routesList.push(route);

        if (component) this.hasRenderComponentList.push(component);

        if (index === this.renderRouteList.length - 1) this.routerChangeEvent(index);

        if (route.redirectTo && /^\/.*/.test(route.redirectTo) && (index + 1) === this.renderRouteList.length) {
          this.needRedirectPath = route.redirectTo;
          return;
        }
      }
    }
  }

  /**
   * emit nvRouteChange and nvOnDestory for Components
   *
   * @private
   * @param {number} index
   * @memberof Router
   */
  private routerChangeEvent(index: number): void {
    this.hasRenderComponentList.forEach((component, i) => {
      if (component.nvRouteChange) component.nvRouteChange(this.lastRoute, this.currentUrl);
      this.emitComponentEvent(component.$componentList, 'nvRouteChange');
      if (i >= index + 1) {
        if (component.nvOnDestory) component.nvOnDestory();
        this.emitComponentEvent(component.$componentList, 'nvOnDestory');
      }
    });
    this.hasRenderComponentList.length = index + 1;
  }

  /**
   * emit nvRouteChange and nvOnDestory for Components with recursion
   * 
   * @private
   * @param {ComponentList<IComponent>[]} componentList
   * @param {string} event
   * @memberof Router
   */
  private emitComponentEvent(componentList: ComponentList<IComponent>[], event: string): void {
    if (event === 'nvRouteChange') {
      componentList.forEach(component => {
        if (component.scope.nvRouteChange) component.scope.nvRouteChange(this.lastRoute, this.currentUrl);
        this.emitComponentEvent(component.scope.$componentList, event);
      });
    }
    if (event === 'nvOnDestory') {
      componentList.forEach(component => {
        if (component.scope.nvOnDestory) component.scope.nvOnDestory();
        this.emitComponentEvent(component.scope.$componentList, event);
      });
    }
  }

  /**
   * instantiate Component
   * 
   * use InDiv renderComponent
   * 
   * if parmas has nvModule, use nvModule
   * if parmas has'nt nvModule, use rootModule in InDiv
   *
   * @private
   * @param {Function} FindComponent
   * @param {Element} renderDom
   * @param {INvModule} [nvModule]
   * @returns {Promise<IComponent>}
   * @memberof Router
   */
  private instantiateComponent(FindComponent: Function, renderDom: Element, nvModule?: INvModule): Promise<IComponent> {
    return this.$vm.renderComponent(FindComponent, renderDom, nvModule);
  }

  /**
   * build Module and return Component for route.loadChild
   *
   * @private
   * @param {(TChildModule | TLoadChild)} loadChild
   * @returns {Promise<INvModule>}
   * @memberof Router
   */
  private async NvModuleFactoryLoader(loadChild: TChildModule | TLoadChild): Promise<INvModule> {
    let loadNvModule = null;

    // export default
    if ((loadChild as TChildModule) instanceof Function && !(loadChild as TLoadChild).child)
      loadNvModule = (await (loadChild as TChildModule)()).default;

    // export
    if (loadChild instanceof Object && (loadChild as TLoadChild).child)
      loadNvModule = (await (loadChild as TLoadChild).child())[loadChild.name];

    if (!loadNvModule) throw new Error('load child failed, please check your routes.');

    return factoryModule(loadNvModule);
  }
}

/**
 * getLocation in @Component or @Directive
 *
 * get $esRouteObject and $esRouteParmasObject in InDiv
 * 
 * @export
 * @returns {{
 *   path?: string;
 *   query?: any;
 *   params?: any;
 *   data?: any;
 * }}
 */
export function getLocation(): {
  path?: string;
  query?: any;
  params?: any;
  data?: any;
} {
  if (!utils.isBrowser()) return {};
  return {
    path: (this as any).$vm.$esRouteObject.path,
    query: (this as any).$vm.$esRouteObject.query,
    params: (this as any).$vm.$esRouteParmasObject,
    data: (this as any).$vm.$esRouteObject.data,
  };
}

/**
 * setLocation in @Component or @Directive
 * 
 * set $esRouteObject in InDiv
 * 
 * @export
 * @param {string} path
 * @param {*} [query]
 * @param {*} [data]
 * @param {string} [title]
 * @returns {void}
 */
export function setLocation(path: string, query?: any, data?: any, title?: string): void {
  if (!utils.isBrowser()) return;
  const rootPath = (this as any).$vm.$rootPath === '/' ? '' : (this as any).$vm.$rootPath;
  history.pushState(
    { path, query, data },
    title,
    `${rootPath}${path}${utils.buildQuery(query)}`,
  );
  (this as any).$vm.$esRouteObject = { path, query, data };
}
