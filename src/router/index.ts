import { IComponent, IDirective, INvModule, ComponentList, DirectiveList } from '../types';

import { Utils } from '../utils';
import { factoryModule, NvModule } from '../nv-module';
import { InDiv } from '../indiv';
import { Injector } from '../di';

import { NvLocation } from './location';
import { RouterTo, RouterFrom, RouterActive } from './directives';

export { NvLocation } from './location';
export { RouterTo, RouterFrom, RouterActive } from './directives';

const utils = new Utils();

export interface RouteChange {
  nvRouteChange(lastRoute?: string, newRoute?: string): void;
}

export type TChildModule = () => Promise<any>;

export type TLoadChild = {
    name: string;
    child: TChildModule;
};

export type NvRouteObject = {
    path: string;
    query?: {
        [props: string]: any;
    };
    data?: any;
};

export const nvRouteStatus: {
  nvRouteObject: NvRouteObject,
  nvRouteParmasObject: {
    [props: string]: any;
  },
  nvRootPath: string,
} = {
  nvRouteObject: {
    path: null,
    query: {},
    data: null,
  },
  nvRouteParmasObject: {},
  nvRootPath: '/',
};

export type TRouter = {
  path: string;
  redirectTo?: string;
  component?: string;
  children?: TRouter[];
  loadChild?: TLoadChild | TChildModule;
};

@NvModule({
  declarations: [
    RouterTo,
    RouterFrom,
    RouterActive,
  ],
  providers: [
    {
      useClass: NvLocation,
      provide: NvLocation,
    }, 
  ],
  exports: [
    RouterTo,
    RouterFrom,
    RouterActive,
  ],
})
export class RouteModule {
  public routeChange?: (lastRoute?: string, nextRoute?: string) => void;
  private routes: TRouter[];
  private routesList: TRouter[] = [];
  private currentUrl: string = '';
  private lastRoute: string = null;
  private hasRenderComponentList: IComponent[] = [];
  private needRedirectPath: string = null;
  private watcher: boolean = false;
  private renderRouteList: string[] = [];
  private loadModuleMap: Map<string, INvModule> = new Map();
  private loadModuleInjectorMap: Map<string, Injector> = new Map();
  private canWatch: boolean = false;

  constructor(
    private indivInstance: InDiv,
  ) {
    // if don't use static function forRoot, RouteModule.prototype.canWatch is false
    // if RouteModule.prototype.canWatch is false, don't watch router
    // if RouteModule.prototype.canWatch is true, watch router and reset RouteModule.prototype.canWatch
    if (!RouteModule.prototype.canWatch) return;
    RouteModule.prototype.canWatch = false;

    if (!this.routes) this.routes = [];
    if (!nvRouteStatus.nvRootPath) nvRouteStatus.nvRootPath = '/';
    this.indivInstance.setRouteDOMKey('router-render');

    if (!utils.isBrowser()) return;

    this.refresh = this.refresh.bind(this);

    window.addEventListener('load', this.refresh, false);
    window.addEventListener('popstate', () => {
      let path;
      if (nvRouteStatus.nvRootPath === '/') {
        path = location.pathname || '/';
      } else {
        path = location.pathname.replace(nvRouteStatus.nvRootPath, '') === '' ? '/' : location.pathname.replace(nvRouteStatus.nvRootPath, '');
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
   * init root data
   *
   * @static
   * @param {{
   *     routes: TRouter[],
   *     rootPath?: string,
   *     routeChange?: (lastRoute?: string, nextRoute?: string) => void,
   *   }} routeData
   * @returns {Function}
   * @memberof RouteModule
   */
  public static forRoot(routeData: {
    routes: TRouter[],
    rootPath?: string,
    routeChange?: (lastRoute?: string, nextRoute?: string) => void,
  }): Function {
    if (routeData.rootPath) nvRouteStatus.nvRootPath = routeData.rootPath;
    if (routeData.routeChange) RouteModule.prototype.routeChange = routeData.routeChange;
    if (routeData.routes && routeData.routes instanceof Array) {
      RouteModule.prototype.routes = routeData.routes;
    } else {
      throw new Error(`route error: no routes exit`);
    }
    if (!utils.isBrowser()) return;
    RouteModule.prototype.canWatch = true;
    return RouteModule;
  }

  /**
   * redirectTo a path
   *
   * @private
   * @param {string} redirectTo
   * @memberof Router
   */
  private redirectTo(redirectTo: string): void {
    const rootPath = nvRouteStatus.nvRootPath === '/' ? '' : nvRouteStatus.nvRootPath;
    history.replaceState(null, null, `${rootPath}${redirectTo}`);
    nvRouteStatus.nvRouteObject = {
      path:  redirectTo || '/',
      query: {},
      data: null,
    };
    nvRouteStatus.nvRouteParmasObject = {};
  }

  /**
   * refresh if not watch $nvRouteObject
   *
   * @private
   * @memberof Router
   */
  private refresh(): void {
    if (!nvRouteStatus.nvRouteObject || !this.watcher) {
      let path;
      if (nvRouteStatus.nvRootPath === '/') path = location.pathname || '/';
      else path = location.pathname.replace(nvRouteStatus.nvRootPath, '') === '' ? '/' : location.pathname.replace(nvRouteStatus.nvRootPath, '');
      nvRouteStatus.nvRouteObject = {
        path,
        query: {},
        data: null,
      };
      nvRouteStatus.nvRouteParmasObject = {};
      this.routeWatcher();
      this.watcher = true;
    }
    this.currentUrl = nvRouteStatus.nvRouteObject.path || '/';
    this.routesList = [];
    this.renderRouteList = this.currentUrl === '/' ? ['/'] : this.currentUrl.split('/');
    this.renderRouteList[0] = '/';
    this.distributeRoutes();
  }

  /**
   * open watcher on nvRouteStatus.nvRouteObject
   *
   * @private
   * @returns
   * @memberof RouteModule
   */
  private routeWatcher() {
    const routeModuleInstance = this;
    let val = nvRouteStatus.nvRouteObject;
    Object.defineProperty(nvRouteStatus, 'nvRouteObject', {
      configurable: true,
      enumerable: true,
      get() {
        return val;
      },
      set(newVal: any) {
        if (utils.isEqual(newVal, val)) return;
        val = newVal;
        routeModuleInstance.refresh();
      },
    });
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
          component = await this.instantiateComponent(FindComponent, renderDom, findComponentFromModuleResult.loadModule, currentUrlPath);
        }
        if (needRenderRoute.loadChild) {
          const loadModule = await this.NvModuleFactoryLoader(needRenderRoute.loadChild, currentUrlPath);
          FindComponent = loadModule.$bootstrap;
          component = await this.instantiateComponent(FindComponent, renderDom, loadModule, currentUrlPath);
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

      // add parmas in $nvRouteParmasObject
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

        if (/^\/\:.+/.test(rootRoute.path)) {
          const key = rootRoute.path.split('/:')[1];
          nvRouteStatus.nvRouteParmasObject[key] = path;
        }

        if (!utils.isBrowser()) return;

        this.routesList.push(rootRoute);

        // push root component in InDiv instance
        this.hasRenderComponentList.push(this.indivInstance.getBootstrapComponent());

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
          component = await this.instantiateComponent(FindComponent, renderDom, findComponentFromModuleResult.loadModule, currentUrlPath);
        }
        if (route.loadChild) {
          const loadModule = await this.NvModuleFactoryLoader(route.loadChild, currentUrlPath);
          FindComponent = loadModule.$bootstrap;
          component = await this.instantiateComponent(FindComponent, renderDom, loadModule, currentUrlPath);
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
      this.emitDirectiveEvent(component.$directiveList, 'nvRouteChange');
      this.emitComponentEvent(component.$componentList, 'nvRouteChange');
      if (i >= index + 1) {
        if (component.nvOnDestory) component.nvOnDestory();
        this.emitDirectiveEvent(component.$directiveList, 'nvOnDestory');
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
        this.emitDirectiveEvent(component.scope.$directiveList, event);
        this.emitComponentEvent(component.scope.$componentList, event);
      });
    }
    if (event === 'nvOnDestory') {
      componentList.forEach(component => {
        if (component.scope.nvOnDestory) component.scope.nvOnDestory();
        this.emitDirectiveEvent(component.scope.$directiveList, event);
        this.emitComponentEvent(component.scope.$componentList, event);
      });
    }
  }

  /**
   * emit nvRouteChange and nvOnDestory for Directives with recursion
   *
   * @private
   * @param {DirectiveList<IDirective>[]} directiveList
   * @param {string} event
   * @memberof RouteModule
   */
  private emitDirectiveEvent(directiveList: DirectiveList<IDirective>[], event: string): void {
    if (event === 'nvRouteChange') {
      directiveList.forEach(directive => {
        if (directive.scope.nvRouteChange) directive.scope.nvRouteChange(this.lastRoute, this.currentUrl);
      });
    }
    if (event === 'nvOnDestory') {
      directiveList.forEach(directive => {
        if (directive.scope.nvOnDestory) directive.scope.nvOnDestory();
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
  private instantiateComponent(FindComponent: Function, renderDom: Element, loadModule: INvModule, currentUrlPath: string): Promise<IComponent> {
    return this.indivInstance.renderComponent(FindComponent, renderDom, loadModule, this.loadModuleInjectorMap.get(currentUrlPath));
  }

  /**
   * build Module and return Component for route.loadChild
   *
   * @private
   * @param {(TChildModule | TLoadChild)} loadChild
   * @returns {Promise<INvModule>}
   * @memberof Router
   */
  private async NvModuleFactoryLoader(loadChild: TChildModule | TLoadChild, currentUrlPath: string): Promise<INvModule> {
    if (this.loadModuleMap.has(currentUrlPath)) return this.loadModuleMap.get(currentUrlPath);

    let loadModule = null;

    // export default
    if ((loadChild as TChildModule) instanceof Function && !(loadChild as TLoadChild).child)
      loadModule = (await (loadChild as TChildModule)()).default;

    // export
    if (loadChild instanceof Object && (loadChild as TLoadChild).child)
      loadModule = (await (loadChild as TLoadChild).child())[loadChild.name];

    if (!loadModule) throw new Error('load child failed, please check your routes.');

    const otherInjector = new Injector();
    this.loadModuleInjectorMap.set(currentUrlPath, otherInjector);

    const loadModuleInstance = factoryModule(loadModule, otherInjector, this.indivInstance);
    this.loadModuleMap.set(currentUrlPath, loadModuleInstance);

    return loadModuleInstance;
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
      component: this.indivInstance.getDeclarations().find((component: any) => component.$selector === selector && component.nvType === 'nvComponent'),
      loadModule: null,
    };

    let component = null;
    let loadModule = null;
    this.loadModuleMap.forEach((value, key) => {
      if (new RegExp(`^${key}.*`).test(currentUrlPath)) {
        component = value.$declarations.find((component: any) => component.$selector === selector && component.nvType === 'nvComponent');
        loadModule = value;
      }
    });
    if (!component) {
      component = this.indivInstance.getDeclarations().find((component: any) => component.$selector === selector && component.nvType === 'nvComponent');
      loadModule = null;
    }

    return { component, loadModule };
  }
}
