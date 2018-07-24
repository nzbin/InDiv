import Utils from './Utils';
import KeyWatcher from './KeyWatcher';

export default class Router {
  constructor() {
    this.routes = {};
    this.currentUrl = '';
    this.lastRoute = null;
    this.rootDom = null;
    this.utils = new Utils();
    this.$rootPath = '/';
    this.hasRenderComponentList = [];
    this.needRedirectPath = null;
  }

  $bootstrap(vm) {
    this.$vm = vm;
    this.$vm.$setRootPath(this.$rootPath);
    this.$vm.$canRenderModule = false;
    this.$vm.$esRouteMode = 'state';
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
    },                      false);
  }

  $init(arr) {
    if (arr && arr instanceof Array) {
      const rootDom = document.querySelector('#root');
      this.rootDom = rootDom || null;
      this.routes = arr;
      this.routesList = [];
    } else {
      console.error('no routes exit');
    }
  }

  $setRootPath(rootPath) {
    if (rootPath && typeof rootPath === 'string') {
      this.$rootPath = rootPath;
    } else {
      console.error('rootPath is not defined or rootPath must be a String');
    }
  }

  $routeChange(lastRoute, nextRoute) {}

  redirectTo(redirectTo) {
    const rootPath = this.$rootPath === '/' ? '' : this.$rootPath;
    history.replaceState(null, null, `${rootPath}${redirectTo}`);
    this.$vm.$esRouteObject = {
      path: redirectTo || '/',
      query: {},
      params: {},
    };
  }

  refresh() {
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
      this.watcher = new KeyWatcher(this.$vm, '$esRouteObject', (o, n) => {
        this.refresh();
      });
    }
    this.currentUrl = this.$vm.$esRouteObject.path || '/';
    this.routesList = [];
    this.renderRouteList = this.currentUrl === '/' ? ['/'] : this.currentUrl.split('/');
    this.renderRouteList[0] = '/';
    this.distributeRoutes();
  }

  distributeRoutes() {
    if (this.lastRoute && this.lastRoute !== this.currentUrl) {
      // has rendered
      this.insertRenderRoutes();
    } else {
      // first render
      this.generalDistributeRoutes();
    }
    this.$routeChange(this.lastRoute, this.currentUrl);
    this.lastRoute = this.currentUrl;
    if (this.needRedirectPath) {
      this.redirectTo(this.needRedirectPath);
      this.needRedirectPath = null;
    }
  }

  insertRenderRoutes() {
    const lastRouteList = this.lastRoute === '/' ? ['/'] : this.lastRoute.split('/');
    lastRouteList[0] = '/';

    for (let index = 0; index < this.renderRouteList.length; index++) {
      const path = this.renderRouteList[index];
      if (index === 0) {
        const rootRoute = this.routes.find(route => route.path === `${path}` || /^\/\:.+/.test(route.path));
        if (!rootRoute) {
          console.error('wrong route instantiation in insertRenderRoutes:', this.currentUrl);
          return;
        }
        this.routesList.push(rootRoute);
      } else {
        const lastRoute = this.routesList[index - 1].children;
        if (!lastRoute || !(lastRoute instanceof Array)) {
          console.error('routes not exit or routes must be an array!');
          return;
        }
        const route = lastRoute.find(route => route.path === `/${path}` || /^\/\:.+/.test(route.path));
        if (!route) {
          console.error('wrong route instantiation1:', this.currentUrl);
          return;
        }
        this.routesList.push(route);
      }

      if (path !== lastRouteList[index]) {
        const willRemoveComponent = this.hasRenderComponentList[index];
        if (willRemoveComponent && willRemoveComponent.$onDestory) willRemoveComponent.$onDestory();
        const needRenderRoute = this.routesList[index];
        if (!needRenderRoute) {
          console.error('wrong route instantiation in insertRenderRoutes:', this.currentUrl);
          return;
        }

        if (needRenderRoute.redirectTo && /^\/.*/.test(needRenderRoute.redirectTo) && (index + 1) === this.renderRouteList.length) {
          this.hasRenderComponentList.forEach((c, i) => {
            if (c.$routeChange) c.$routeChange(this.lastRoute, this.currentUrl);
            if (i > index && c.$onDestory) c.$onDestory();
          });
          this.hasRenderComponentList.length = index;
          this.needRedirectPath = needRenderRoute.redirectTo;
          return;
        }

        const needRenderComponent = this.$vm.$components[needRenderRoute.component];
        const renderDom = document.querySelectorAll('router-render')[index - 1];
        this.hasRenderComponentList.forEach((c, i) => {
          if (c.$routeChange) c.$routeChange(this.lastRoute, this.currentUrl);
          if (i > index && c.$onDestory) c.$onDestory();
        });
        this.hasRenderComponentList.length = index;
        this.instantiateComponent(needRenderComponent, renderDom).then(component => {
          this.hasRenderComponentList[index] = component;
        });
      }

      if (index === (this.renderRouteList.length - 1) && index < (lastRouteList.length - 1)) {
        const renderDom = document.querySelectorAll('router-render')[index];
        this.hasRenderComponentList.forEach((c, i) => {
          if (c.$routeChange) c.$routeChange(this.lastRoute, this.currentUrl);
          if (i > index && c.$onDestory) c.$onDestory();
        });
        if (renderDom && renderDom.hasChildNodes()) renderDom.removeChild(renderDom.childNodes[0]);
        this.hasRenderComponentList.length = index;
      }
    }
  }

  generalDistributeRoutes() {
    for (let index = 0; index < this.renderRouteList.length; index++) {
      const path = this.renderRouteList[index];
      if (index === 0) {
        const rootRoute = this.routes.find(route => route.path === `${path}` || /^\/\:.+/.test(route.path));
        if (!rootRoute) {
          console.error('wrong route instantiation in generalDistributeRoutes:', this.currentUrl);
          return;
        }

        let Component = null;
        if (this.$vm.$rootModule.$components[rootRoute.component]) {
          Component = this.$vm.$components[rootRoute.component];
        } else {
          console.error(`route error: ${rootRoute.component} is undefined`);
          return;
        }

        const rootDom = document.querySelector('#root');
        this.routesList.push(rootRoute);
        this.instantiateComponent(Component, rootDom)
          .then(component => {
            this.hasRenderComponentList[index] = component;
          })
          .catch(() => console.error('renderComponent failed'));
        this.hasRenderComponentList.forEach((c, i) => {
          if (c.$routeChange) c.$routeChange(this.lastRoute, this.currentUrl);
          if (i > index && c.$onDestory) c.$onDestory();
        });

        if (rootRoute.redirectTo && /^\/.*/.test(rootRoute.redirectTo) && (index + 1) === this.renderRouteList.length) {
          this.needRedirectPath = rootRoute.redirectTo;
          this.hasRenderComponentList.length = index;
          return;
        }
      } else {
        const lastRoute = this.routesList[index - 1].children;
        if (!lastRoute || !(lastRoute instanceof Array)) {
          console.error('routes not exit or routes must be an array!');
        }
        const route = lastRoute.find(route => route.path === `/${path}` || /^\/\:.+/.test(route.path));
        if (!route) {
          console.error('wrong route instantiation1:', this.currentUrl);
          return;
        }

        if (route.redirectTo && /^\/.*/.test(route.redirectTo) && (index + 1) === this.renderRouteList.length) {
          this.hasRenderComponentList.forEach((c, i) => {
            if (c.$routeChange) c.$routeChange(this.lastRoute, this.currentUrl);
            if (i > index && c.$onDestory) c.$onDestory();
          });
          this.needRedirectPath = route.redirectTo;
          this.hasRenderComponentList.length = index;
          return;
        }

        let Component = null;
        if (this.$vm.$rootModule.$components[route.component]) {
          Component = this.$vm.$components[route.component];
        } else {
          console.error(`route error: ${route.component} is undefined`);
          return;
        }
        const renderDom = document.querySelectorAll('router-render')[index - 1];
        this.routesList.push(route);
        this.hasRenderComponentList.forEach((c) => {
          if (c.$routeChange) c.$routeChange(this.lastRoute, this.currentUrl);
        });
        this.instantiateComponent(Component, renderDom)
          .then(component => {
            this.hasRenderComponentList[index] = component;
          })
          .catch(() => console.error('renderComponent failed'));
      }
    }
  }

  instantiateComponent(Component, renderDom) {
    return this.$vm.$renderComponent(Component, renderDom);
  }
}
