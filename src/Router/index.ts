import { TRouter, IInDiv, IComponent } from '../types';

import Utils from '../Utils';
import KeyWatcher from '../KeyWatcher';

class Router {
  public routes: TRouter[];
  public routesList: TRouter[];
  public currentUrl: string;
  public lastRoute: string;
  public rootDom: Element;
  public utils: Utils;
  public $rootPath: string;
  public hasRenderComponentList: IComponent[];
  public needRedirectPath: string;
  public $vm: IInDiv;
  public watcher: KeyWatcher;
  public renderRouteList: string[];

  constructor() {
    this.routes = [];
    this.routesList = [];
    this.currentUrl = '';
    this.lastRoute = null;
    this.rootDom = null;
    this.utils = new Utils();
    this.$rootPath = '/';
    this.hasRenderComponentList = [];
    this.needRedirectPath = null;
    this.$vm = null;
    this.watcher = null;
    this.renderRouteList = [];
  }

  public bootstrap(vm: IInDiv): void {
    this.$vm = vm;
    this.$vm.setRootPath(this.$rootPath);
    this.$vm.$canRenderModule = false;
    this.$vm.$routeDOMKey = 'router-render';
    window.addEventListener('load', this.refresh.bind(this), false);
    window.addEventListener('popstate', (e) => {
      let path;
      if (this.$rootPath === '/') {
        path = location.pathname || '/';
      } else {
        path = location.pathname.replace(this.$rootPath, '') === '' ? '/' : location.pathname.replace(this.$rootPath, '');
      }
      this.$vm.$esRouteObject = {
        path,
        query: {},
        params: {},
      };
    }, false);
  }

  public init(arr: TRouter[]): void {
    if (arr && arr instanceof Array) {
      const rootDom = document.querySelector('#root');
      this.rootDom = rootDom || null;
      this.routes = arr;
      this.routesList = [];
    } else {
      console.error('route error: no routes exit');
    }
  }

  public setRootPath(rootPath: string): void {
    if (rootPath && typeof rootPath === 'string') {
      this.$rootPath = rootPath;
    } else {
      console.error('route error: rootPath is not defined or rootPath must be a String');
    }
  }

  public routeChange(lastRoute?: string, nextRoute?: string): void { }

  public redirectTo(redirectTo: string): void {
    const rootPath = this.$rootPath === '/' ? '' : this.$rootPath;
    history.replaceState(null, null, `${rootPath}${redirectTo}`);
    this.$vm.$esRouteObject = {
      path: redirectTo || '/',
      query: {},
      params: {},
    };
  }

  public refresh(): void {
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
        params: {},
      };
      this.watcher = new KeyWatcher(this.$vm, '$esRouteObject', this.refresh.bind(this));
    }
    this.currentUrl = this.$vm.$esRouteObject.path || '/';
    this.routesList = [];
    this.renderRouteList = this.currentUrl === '/' ? ['/'] : this.currentUrl.split('/');
    this.renderRouteList[0] = '/';
    this.distributeRoutes();
  }

  public distributeRoutes(): void {
    if (this.lastRoute && this.lastRoute !== this.currentUrl) {
      // has rendered
      this.insertRenderRoutes();
    } else {
      // first render
      this.generalDistributeRoutes();
    }
    this.routeChange(this.lastRoute, this.currentUrl);
    this.lastRoute = this.currentUrl;
    if (this.needRedirectPath) {
      this.redirectTo(this.needRedirectPath);
      this.needRedirectPath = null;
    }
  }

  public insertRenderRoutes(): void {
    const lastRouteList = this.lastRoute === '/' ? ['/'] : this.lastRoute.split('/');
    lastRouteList[0] = '/';

    for (let index = 0; index < this.renderRouteList.length; index++) {
      const path = this.renderRouteList[index];
      if (index === 0) {
        const rootRoute = this.routes.find(route => route.path === `${path}` || /^\/\:.+/.test(route.path));
        if (!rootRoute) {
          console.error('route error: wrong route instantiation in insertRenderRoutes:', this.currentUrl);
          return;
        }
        this.routesList.push(rootRoute);
      } else {
        const lastRoute = this.routesList[index - 1].children;
        if (!lastRoute || !(lastRoute instanceof Array)) {
          console.error('route error: routes not exit or routes must be an array!');
          return;
        }
        const route = lastRoute.find((r: TRouter) => r.path === `/${path}` || /^\/\:.+/.test(r.path));
        if (!route) {
          console.error('route error: wrong route instantiation:', this.currentUrl);
          return;
        }
        this.routesList.push(route);
      }

      if (path !== lastRouteList[index]) {
        const willRemoveComponent = this.hasRenderComponentList[index];
        if (willRemoveComponent && willRemoveComponent.esOnDestory) willRemoveComponent.esOnDestory();
        const needRenderRoute = this.routesList[index];
        if (!needRenderRoute) {
          console.error('route error: wrong route instantiation in insertRenderRoutes:', this.currentUrl);
          return;
        }

        // if (needRenderRoute.redirectTo && /^\/.*/.test(needRenderRoute.redirectTo) && (index + 1) === this.renderRouteList.length) {
        //   this.hasRenderComponentList.forEach((c, i) => {
        //     if (c.esRouteChange) c.esRouteChange(this.lastRoute, this.currentUrl);
        //     if (i > index && c.esOnDestory) c.esOnDestory();
        //   });
        //   this.hasRenderComponentList.length = index;
        //   this.needRedirectPath = needRenderRoute.redirectTo;
        //   return;
        // }

        const needRenderComponent = this.$vm.$components[needRenderRoute.component];
        const renderDom = document.querySelectorAll('router-render')[index - 1];
        this.hasRenderComponentList.forEach((c, i) => {
          if (c.esRouteChange) c.esRouteChange(this.lastRoute, this.currentUrl);
          if (i > index && c.esOnDestory) c.esOnDestory();
        });
        this.hasRenderComponentList.length = index;
        // this.instantiateComponent(needRenderComponent, renderDom).then(component => {
        //   this.hasRenderComponentList[index] = component;
        // });
        if (!needRenderRoute.component && !needRenderRoute.redirectTo) {
          console.error(`route error: path ${needRenderRoute.path} need a component which has children path or need a  redirectTo which has't children path`);
          return;
        }
        if (needRenderComponent) {
          const component = this.instantiateComponent(needRenderComponent, renderDom);
          if (component) this.hasRenderComponentList[index] = component;
        }

        if (needRenderRoute.redirectTo && /^\/.*/.test(needRenderRoute.redirectTo) && (index + 1) === this.renderRouteList.length) {
          this.hasRenderComponentList.forEach((c, i) => {
            if (c.esRouteChange) c.esRouteChange(this.lastRoute, this.currentUrl);
            if (i > index && c.esOnDestory) c.esOnDestory();
          });
          this.hasRenderComponentList.length = index;
          this.needRedirectPath = needRenderRoute.redirectTo;
          return;
        }
      }

      if (index === (this.renderRouteList.length - 1) && index < (lastRouteList.length - 1)) {
        const renderDom = document.querySelectorAll('router-render')[index];
        this.hasRenderComponentList.forEach((c, i) => {
          if (c.esRouteChange) c.esRouteChange(this.lastRoute, this.currentUrl);
          if (i > index && c.esOnDestory) c.esOnDestory();
        });
        if (renderDom && renderDom.hasChildNodes()) renderDom.removeChild(renderDom.childNodes[0]);
        this.hasRenderComponentList.length = index;

        const needRenderRoute = this.routesList[index];
        if (needRenderRoute.redirectTo && /^\/.*/.test(needRenderRoute.redirectTo) && (index + 1) === this.renderRouteList.length) {
          this.hasRenderComponentList.forEach((c, i) => {
            if (c.esRouteChange) c.esRouteChange(this.lastRoute, this.currentUrl);
            if (i > index && c.esOnDestory) c.esOnDestory();
          });
          this.hasRenderComponentList.length = index;
          this.needRedirectPath = needRenderRoute.redirectTo;
          return;
        }
      }
    }
  }

  public generalDistributeRoutes(): void {
    for (let index = 0; index < this.renderRouteList.length; index++) {
      const path = this.renderRouteList[index];
      if (index === 0) {
        const rootRoute = this.routes.find(route => route.path === `${path}` || /^\/\:.+/.test(route.path));
        if (!rootRoute) {
          console.error('route error: wrong route instantiation in generalDistributeRoutes:', this.currentUrl);
          return;
        }

        let FindComponent = null;
        if (this.$vm.$rootModule.$components[rootRoute.component]) {
          FindComponent = this.$vm.$components[rootRoute.component];
        } else {
          console.error(`route error: path ${rootRoute.path} is undefined`);
          return;
        }

        const rootDom = document.querySelector('#root');
        this.routesList.push(rootRoute);

        // this.instantiateComponent(FindComponent, rootDom)
        //   .then(component => {
        //     this.hasRenderComponentList[index] = component;
        //   })
        //   .catch(() => console.error('renderComponent failed'));
        const component = this.instantiateComponent(FindComponent, rootDom);
        if (component) this.hasRenderComponentList[index] = component;

        this.hasRenderComponentList.forEach((c, i) => {
          if (c.esRouteChange) c.esRouteChange(this.lastRoute, this.currentUrl);
          if (i > index && c.esOnDestory) c.esOnDestory();
        });

        if (rootRoute.redirectTo && /^\/.*/.test(rootRoute.redirectTo) && (index + 1) === this.renderRouteList.length) {
          this.needRedirectPath = rootRoute.redirectTo;
          this.hasRenderComponentList.length = index;
          return;
        }
      } else {
        const lastRoute = this.routesList[index - 1].children;
        if (!lastRoute || !(lastRoute instanceof Array)) {
          console.error('route error: routes not exit or routes must be an array!');
        }
        const route = lastRoute.find(r => r.path === `/${path}` || /^\/\:.+/.test(r.path));
        if (!route) {
          console.error('route error: wrong route instantiation:', this.currentUrl);
          return;
        }

        // if (route.redirectTo && /^\/.*/.test(route.redirectTo) && (index + 1) === this.renderRouteList.length) {
        //   this.hasRenderComponentList.forEach((c, i) => {
        //     if (c.esRouteChange) c.esRouteChange(this.lastRoute, this.currentUrl);
        //     if (i > index && c.esOnDestory) c.esOnDestory();
        //   });
        //   this.needRedirectPath = route.redirectTo;
        //   this.hasRenderComponentList.length = index;
        //   return;
        // }

        let FindComponent = null;
        if (this.$vm.$rootModule.$components[route.component]) {
          FindComponent = this.$vm.$components[route.component];
        }
        if (!route.component && !route.redirectTo) {
          console.error(`route error: path ${route.path} need a component which has children path or need a  redirectTo which has't children path`);
          return;
        }
        const renderDom = document.querySelectorAll('router-render')[index - 1];
        this.routesList.push(route);
        this.hasRenderComponentList.forEach((c) => {
          if (c.esRouteChange) c.esRouteChange(this.lastRoute, this.currentUrl);
        });

        // this.instantiateComponent(FindComponent, renderDom)
        //   .then(component => {
        //     this.hasRenderComponentList[index] = component;
        //   })
        //   .catch(() => console.error('renderComponent failed'));
        if (FindComponent) {
          const component = this.instantiateComponent(FindComponent, renderDom);
          if (component) this.hasRenderComponentList[index] = component;
        }
        if (route.redirectTo && /^\/.*/.test(route.redirectTo) && (index + 1) === this.renderRouteList.length) {
          this.hasRenderComponentList.forEach((c, i) => {
            if (c.esRouteChange) c.esRouteChange(this.lastRoute, this.currentUrl);
            if (i > index && c.esOnDestory) c.esOnDestory();
          });
          this.needRedirectPath = route.redirectTo;
          this.hasRenderComponentList.length = index;
          return;
        }
      }
    }
  }

  // public instantiateComponent(FindComponent: Function, renderDom: Element): Promise<any> {
  public instantiateComponent(FindComponent: Function, renderDom: Element): any {
    return this.$vm.renderComponent(FindComponent, renderDom);
  }
}

export default Router;
