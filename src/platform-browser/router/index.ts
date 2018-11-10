import { TRouter, IInDiv, IComponent, ComponentList, INvModule, TLoadChild, TChildModule, NvRouteObject } from '../../types';

import { Utils } from '../../utils';
import { KeyWatcher } from '../../key-watcher';
import { factoryModule } from '../../nv-module';

export { TRouter } from '../../types';

const utils = new Utils();

const nvRouteStatus: {
  nvRouteObject: NvRouteObject,
  nvRouteParmasObject: {
    [props: string]: any;
  },
} = {
  nvRouteObject: {
    path: null,
    query: {},
    data: null,
  },
  nvRouteParmasObject: {},
};

/**
 * route for InDiv
 *
 * @export
 * @class Router
 */
export class Router {
  public routeChange?: (lastRoute?: string, nextRoute?: string) => void;
  private routes: TRouter[] = [];
  private routesList: TRouter[] = [];
  private currentUrl: string = '';
  private lastRoute: string = null;
  private $rootPath: string = '/';
  private hasRenderComponentList: IComponent[] = [];
  private needRedirectPath: string = null;
  private $vm: IInDiv = null;
  private watcher: KeyWatcher = null;
  private renderRouteList: string[] = [];
  private loadModuleMap: Map<string, INvModule> = new Map();

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
      this.$vm.setCanRenderModule(false);
      this.$vm.setRouteDOMKey('router-render');

      if (!utils.isBrowser()) return;
      window.addEventListener('load', this.refresh.bind(this), false);
      window.addEventListener('popstate', () => {
        let path;
        if (this.$rootPath === '/') {
          path = location.pathname || '/';
        } else {
          path = location.pathname.replace(this.$rootPath, '') === '' ? '/' : location.pathname.replace(this.$rootPath, '');
        }
        nvRouteStatus.nvRouteObject = {
          path,
          query: {},
          data: null,
        };
        nvRouteStatus.nvRouteParmasObject = {};
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
    nvRouteStatus.nvRouteObject = {
      path:  redirectTo || '/',
      query: {},
      data: null,
    };
    nvRouteStatus.nvRouteParmasObject = {};
  }

  /**
   * refresh if not watch $esRouteObject
   *
   * @private
   * @memberof Router
   */
  private refresh(): void {
    if (!nvRouteStatus.nvRouteObject || !this.watcher) {
      let path;
      if (this.$rootPath === '/') {
        path = location.pathname || '/';
      } else {
        path = location.pathname.replace(this.$rootPath, '') === '' ? '/' : location.pathname.replace(this.$rootPath, '');
      }
      nvRouteStatus.nvRouteObject = {
        path,
        query: {},
        data: null,
      };
      nvRouteStatus.nvRouteParmasObject = {};
      this.watcher = new KeyWatcher(nvRouteStatus, 'esRouteObject', this.refresh.bind(this));
    }
    this.currentUrl = nvRouteStatus.nvRouteObject.path || '/';
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
      nvRouteStatus.nvRouteParmasObject = {};
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
          nvRouteStatus.nvRouteParmasObject[key] = path;
        }

        let FindComponent = null;
        let component = null;
        let currentUrlPath = '';

        // build current url with route.path
        // bucause route has been pushed to this.routesList, don't use to += path
        this.routesList.forEach((r, index) => { if (index !== 0) currentUrlPath += r.path; });

        if (needRenderRoute.component) {
          const findComponentFromModuleResult = this.findComponentFromModule(needRenderRoute.component, currentUrlPath);
          FindComponent = findComponentFromModuleResult.component;
          component = await this.instantiateComponent(FindComponent, renderDom, findComponentFromModuleResult.loadModule);
        }
        if (needRenderRoute.loadChild) {
          const loadModule = await this.NvModuleFactoryLoader(needRenderRoute.loadChild);
          this.loadModuleMap.set(currentUrlPath, loadModule);
          FindComponent = loadModule.$bootstrap;
          component = await this.instantiateComponent(FindComponent, renderDom, loadModule);
        }

        if (FindComponent) {
          // insert needRenderComponent on index in this.hasRenderComponentList
          // and remove other component which index >= index of FindComponent
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
          nvRouteStatus.nvRouteParmasObject[key] = path;
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
        let currentUrlPath = '';

        // build current url with route.path
        // because rootRoute hasn't been pushed to this.routesList, we need to += route.path
        this.routesList.forEach((r, index) => { if (index !== 0) currentUrlPath += r.path; });
        currentUrlPath += rootRoute.path;

        if (rootRoute.component) {
          const findComponentFromModuleResult = this.findComponentFromModule(rootRoute.component, currentUrlPath);
          FindComponent = findComponentFromModuleResult.component;
          component = await this.instantiateComponent(FindComponent, rootDom, findComponentFromModuleResult.loadModule);
        }
        if (rootRoute.loadChild) {
          const loadModule = await this.NvModuleFactoryLoader(rootRoute.loadChild);
          this.loadModuleMap.set(currentUrlPath, loadModule);
          FindComponent = loadModule.$bootstrap;
          component = await this.instantiateComponent(FindComponent, rootDom, loadModule);
        }

        if (!FindComponent) throw new Error(`route error: root route's path: ${rootRoute.path} need a component`);


        if (/^\/\:.+/.test(rootRoute.path)) {
          const key = rootRoute.path.split('/:')[1];
          nvRouteStatus.nvRouteParmasObject[key] = path;
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
        let currentUrlPath = '';

        // build current url with route.path
        // because rootRoute hasn't been pushed to this.routesList, we need to += route.path
        this.routesList.forEach((r, index) => { if (index !== 0) currentUrlPath += r.path; });
        currentUrlPath += route.path;

        if (route.component) {
          const findComponentFromModuleResult = this.findComponentFromModule(route.component, currentUrlPath);
          FindComponent = findComponentFromModuleResult.component;
          component = await this.instantiateComponent(FindComponent, renderDom, findComponentFromModuleResult.loadModule);
        }
        if (route.loadChild) {
          const loadModule = await this.NvModuleFactoryLoader(route.loadChild);
          this.loadModuleMap.set(currentUrlPath, loadModule);
          FindComponent = loadModule.$bootstrap;
          component = await this.instantiateComponent(FindComponent, renderDom, loadModule);
        }

        if (!route.component && !route.redirectTo && !route.loadChild) throw new Error(`route error: path ${route.path} need a component which has children path or need a  redirectTo which has't children path`);

        if (/^\/\:.+/.test(route.path)) {
          const key = route.path.split('/:')[1];
          nvRouteStatus.nvRouteParmasObject[key] = path;
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
   * if parmas has loadModule, use loadModule
   * if parmas has'nt loadModule, use rootModule in InDiv
   *
   * @private
   * @param {Function} FindComponent
   * @param {Element} renderDom
   * @param {INvModule} [loadModule]
   * @returns {Promise<IComponent>}
   * @memberof Router
   */
  private instantiateComponent(FindComponent: Function, renderDom: Element, loadModule: INvModule): Promise<IComponent> {
    return this.$vm.renderComponent(FindComponent, renderDom, loadModule);
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
    let loadModule = null;

    // export default
    if ((loadChild as TChildModule) instanceof Function && !(loadChild as TLoadChild).child)
      loadModule = (await (loadChild as TChildModule)()).default;

    // export
    if (loadChild instanceof Object && (loadChild as TLoadChild).child)
      loadModule = (await (loadChild as TLoadChild).child())[loadChild.name];

    if (!loadModule) throw new Error('load child failed, please check your routes.');

    return factoryModule(loadModule, this.$vm);
  }

  /**
   * find component from loadModule or rootModule
   * 
   * if this.loadModuleMap.size === 0, only in $rootModule
   * if has loadModule, return component in loadModule firstly
   * 
   *
   * @private
   * @param {string} selector
   * @param {string} currentUrlPath
   * @returns {{ component: Function, loadModule: INvModule }}
   * @memberof Router
   */
  private findComponentFromModule(selector: string, currentUrlPath: string): { component: Function, loadModule: INvModule } {
    if (this.loadModuleMap.size === 0) return {
      component: this.$vm.getComponents().find((component: any) => component.$selector === selector),
      loadModule: null,
    };

    let component = null;
    let loadModule = null;
    this.loadModuleMap.forEach((value, key) => {
      if (new RegExp(`^${key}.*`).test(currentUrlPath)) {
        component = value.$components.find((component: any) => component.$selector === selector);
        loadModule = value;
      }
    });
    if (!component) {
      component = this.$vm.getComponents().find((component: any) => component.$selector === selector);
      loadModule = null;
    }

    return { component, loadModule };
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
    path: nvRouteStatus.nvRouteObject.path,
    query: nvRouteStatus.nvRouteObject.query,
    params: nvRouteStatus.nvRouteParmasObject,
    data: nvRouteStatus.nvRouteObject.data,
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
  nvRouteStatus.nvRouteObject = { path, query, data };
}
