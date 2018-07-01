const Utils = require('./Utils');
const KeyWatcher = require('./KeyWatcher');

class Router {
  constructor() {
    this.routes = {};
    this.currentUrl = '';
    this.lastRoute = null;
    this.rootDom = null;
    this.utils = new Utils();
    this.$rootPath = '/';
  }

  $init(vm) {
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
      this.refresh();
    }, false);
  }

  $bootstrap(arr) {
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

    this.renderRouteList = this.currentUrl.split('/');
    this.routesList = [];
    this.renderRouteList.shift();
    this.distributeRoutes();
  }

  distributeRoutes() {
    // has render father route
    if (this.lastRoute && this.lastRoute !== this.currentUrl && new RegExp(`^${this.lastRoute}.*`).test(this.currentUrl)) {
      this.insertRenderRoutes();
    // didn't render father route
    } else {
      this.generalDistributeRoutes();
    }
    this.$routeChange(this.lastRoute, this.currentUrl);
    this.lastRoute = this.currentUrl;
  }

  insertRenderRoutes() {
    const lastRouteList = this.lastRoute.split('/');
    lastRouteList.shift();
    const needRenderIndex = lastRouteList.length;
    this.renderRouteList.forEach((path, index) => {
      if (index === 0) {
        const rootRoute = this.routes.find(route => route.path === `/${path}`);
        if (!rootRoute) {
          console.error('wrong route instantiation in insertRenderRoutes:', this.currentUrl);
          return;
        }
        if (rootRoute.redirectTo && /^\/.*/.test(rootRoute.redirectTo)) {
          this.redirectTo(rootRoute.redirectTo);
          return;
        }
        this.routesList.push(rootRoute);
      } else {
        const lastRoute = this.routesList[index - 1].children;
        if (!lastRoute || !(lastRoute instanceof Array)) {
          console.error('routes not exit or routes must be an array!');
          return;
        }
        const route = lastRoute.find(route => route.path === `/${path}`);
        if (!route) {
          console.error('wrong route instantiation1:', this.currentUrl);
          return;
        }
        this.routesList.push(route);
      }
      if (index === needRenderIndex) {
        const lastRoute = this.routesList[index - 1].children;
        if (!lastRoute || !(lastRoute instanceof Array)) {
          console.error('routes not exit or routes must be an array!');
        }
        const route = lastRoute.find(route => route.path === `/${path}`);
        if (!route) return;
        if (route.redirectTo && /^\/.*/.test(route.redirectTo)) {
          this.redirectTo(route.redirectTo);
          return;
        }
        if (this.oldComponent && this.oldComponent.$routeChange) this.oldComponent.$routeChange(this.lastRoute, this.currentUrl);

        let Component = null;
        if (this.$vm.$rootModule.$components[route.component]) {
          Component = this.$vm.$rootModule.$components[route.component];
        } else {
          console.error(`route error: ${route.component} is undefined`);
          return;
        }
        const component = new Component();
        this.oldComponent = component;
        const renderDom = document.querySelectorAll('router-render')[index - 1];
        this.instantiateComponent(component, renderDom);
      }
    });
  }

  generalDistributeRoutes() {
    this.renderRouteList.forEach((path, index) => {
      // first bootstrap route
      if (index === 0) {
        const rootRoute = this.routes.find(route => route.path === `/${path}`);
        if (!rootRoute) {
          console.error('wrong route instantiation in generalDistributeRoutes:', this.currentUrl);
          return;
        }
        if (rootRoute.redirectTo && /^\/.*/.test(rootRoute.redirectTo)) {
          this.redirectTo(rootRoute.redirectTo);
          return;
        }
        if (this.oldComponent && this.oldComponent.$routeChange) this.oldComponent.$routeChange(this.lastRoute, this.currentUrl);

        let Component = null;
        if (this.$vm.$rootModule.$components[rootRoute.component]) {
          Component = this.$vm.$rootModule.$components[rootRoute.component];
        } else {
          console.error(`route error: ${rootRoute.component} is undefined`);
          return;
        }
        const component = new Component();
        this.oldComponent = component;
        const rootDom = document.querySelector('#root');
        this.routesList.push(rootRoute);
        this.instantiateComponent(component, rootDom);
      } else {
        const lastRoute = this.routesList[index - 1].children;
        if (!lastRoute || !(lastRoute instanceof Array)) {
          console.error('routes not exit or routes must be an array!');
        }
        const route = lastRoute.find(route => route.path === `/${path}`);
        if (!route) {
          console.error('wrong route instantiation1:', this.currentUrl);
          return;
        }
        if (route.redirectTo && /^\/.*/.test(route.redirectTo)) {
          this.redirectTo(route.redirectTo);
          return;
        }
        if (this.oldComponent && this.oldComponent.$routeChange) this.oldComponent.$routeChange(this.lastRoute, this.currentUrl);
        let Component = null;
        if (this.$vm.$rootModule.$components[route.component]) {
          Component = this.$vm.$rootModule.$components[route.component];
        } else {
          console.error(`route error: ${route.component} is undefined`);
          return;
        }
        const component = new Component();
        this.oldComponent = component;
        const renderDom = document.querySelectorAll('router-render')[index - 1];
        this.routesList.push(route);
        this.instantiateComponent(component, renderDom);
      }
    });
  }

  instantiateComponent(component, renderDom) {
    this.$vm.$renderModuleComponent(component, renderDom);
  }
}

class RouterHash {
  constructor() {
    this.routes = {};
    this.currentUrl = '';
    this.lastRoute = null;
    this.rootDom = null;
    this.utils = new Utils();
    this.$rootPath = '/';
  }

  $init(vm) {
    this.$vm = vm;
    this.$vm.$setRootPath(this.$rootPath);
    this.$vm.$canRenderModule = false;
    this.$vm.$esRouteMode = 'hash';
    this.$vm.$routeDOMKey = 'router-render';
    window.addEventListener('load', this.refresh.bind(this), false);
    window.addEventListener('hashchange', this.refresh.bind(this), false);
    window.addEventListener('popstate', (e) => {
      this.$vm.$esRouteObject = {
        path: location.hash.split('?')[0].slice(1) || '/',
        query: {},
        params: {},
      };
      this.refresh();
    }, false);
  }

  $bootstrap(arr) {
    if (arr && arr instanceof Array) {
      const rootDom = document.querySelector('#root');
      this.rootDom = rootDom || null;
      this.routes = arr;
      this.routesList = [];
    } else {
      console.error('no routes exit');
    }
  }

  $setRootPath() {
    console.error('rootPath is only used in Router');
  }

  $routeChange(lastRoute, nextRoute) {}

  redirectTo(redirectTo) {
    history.replaceState(null, null, `#${redirectTo}`);
    this.$vm.$esRouteObject = {
      path: redirectTo || '/',
      query: {},
      params: {},
    };
  }

  refresh() {
    if (!this.$vm.$esRouteObject || !this.watcher) {
      this.$vm.$esRouteObject = {
        path: location.hash.split('?')[0].slice(1) || '/',
        query: {},
        params: {},
      };
      this.watcher = new KeyWatcher(this.$vm, '$esRouteObject', (o, n) => {
        this.refresh();
      });
    }
    this.currentUrl = this.$vm.$esRouteObject.path || '/';
    this.renderRouteList = this.currentUrl.split('/');
    this.routesList = [];
    this.renderRouteList.shift();
    this.distributeRoutes();
  }


  distributeRoutes() {
    // has render father route
    if (this.lastRoute && this.lastRoute !== this.currentUrl && new RegExp(`^${this.lastRoute}.*`).test(this.currentUrl)) {
      this.insertRenderRoutes();
    // didn't render father route
    } else {
      this.generalDistributeRoutes();
    }
    this.$routeChange(this.lastRoute, this.currentUrl);
    this.lastRoute = this.currentUrl;
  }

  insertRenderRoutes() {
    const lastRouteList = this.lastRoute.split('/');
    lastRouteList.shift();
    const needRenderIndex = lastRouteList.length;
    this.renderRouteList.forEach((path, index) => {
      if (index === 0) {
        const rootRoute = this.routes.find(route => route.path === `/${path}`);
        if (!rootRoute) {
          console.error('wrong route instantiation2:', this.currentUrl);
          return;
        }
        if (rootRoute.redirectTo && /^\/.*/.test(rootRoute.redirectTo)) {
          this.redirectTo(rootRoute.redirectTo);
          return;
        }
        this.routesList.push(rootRoute);
      } else {
        const lastRoute = this.routesList[index - 1].children;
        if (!lastRoute || !(lastRoute instanceof Array)) {
          console.error('routes not exit or routes must be an array!');
          return;
        }
        const route = lastRoute.find(route => route.path === `/${path}`);
        if (!route) {
          console.error('wrong route instantiation1:', this.currentUrl);
          return;
        }
        this.routesList.push(route);
      }
      if (index === needRenderIndex) {
        const lastRoute = this.routesList[index - 1].children;
        if (!lastRoute || !(lastRoute instanceof Array)) {
          console.error('routes not exit or routes must be an array!');
        }
        const route = lastRoute.find(route => route.path === `/${path}`);
        if (!route) return;
        if (route.redirectTo && /^\/.*/.test(route.redirectTo)) {
          this.redirectTo(route.redirectTo);
          return;
        }
        if (this.oldComponent && this.oldComponent.$routeChange) this.oldComponent.$routeChange(this.lastRoute, this.currentUrl);
        let Component = null;
        if (this.$vm.$rootModule.$components[route.component]) {
          Component = this.$vm.$rootModule.$components[route.component];
        } else {
          console.error(`route error: ${route.component} is undefined`);
          return;
        }
        const component = new Component();
        this.oldComponent = component;
        const renderDom = document.querySelectorAll('router-render')[index - 1];
        this.instantiateComponent(component, renderDom);
      }
    });
  }

  generalDistributeRoutes() {
    this.renderRouteList.forEach((path, index) => {
      // first bootstrap route
      if (index === 0) {
        const rootRoute = this.routes.find(route => route.path === `/${path}`);
        if (!rootRoute) {
          console.error('wrong route instantiation2:', this.currentUrl);
          return;
        }
        if (rootRoute.redirectTo && /^\/.*/.test(rootRoute.redirectTo)) {
          this.redirectTo(rootRoute.redirectTo);
          return;
        }
        if (this.oldComponent && this.oldComponent.$routeChange) this.oldComponent.$routeChange(this.lastRoute, this.currentUrl);

        let Component = null;
        if (this.$vm.$rootModule.$components[rootRoute.component]) {
          Component = this.$vm.$rootModule.$components[rootRoute.component];
        } else {
          console.error(`route error: ${rootRoute.component} is undefined`);
          return;
        }
        const component = new Component();
        this.oldComponent = component;
        const rootDom = document.querySelector('#root');
        this.routesList.push(rootRoute);
        this.instantiateComponent(component, rootDom);
      } else {
        const lastRoute = this.routesList[index - 1].children;
        if (!lastRoute || !(lastRoute instanceof Array)) {
          console.error('routes not exit or routes must be an array!');
        }
        const route = lastRoute.find(route => route.path === `/${path}`);
        if (!route) {
          console.error('wrong route instantiation1:', this.currentUrl);
          return;
        }
        if (route.redirectTo && /^\/.*/.test(route.redirectTo)) {
          this.redirectTo(route.redirectTo);
          return;
        }
        if (this.oldComponent && this.oldComponent.$routeChange) this.oldComponent.$routeChange();
        let Component = null;
        if (this.$vm.$rootModule.$components[route.component]) {
          Component = this.$vm.$rootModule.$components[route.component];
        } else {
          console.error(`route error: ${route.component} is undefined`);
          return;
        }
        const component = new Component();
        this.oldComponent = component;
        const renderDom = document.querySelectorAll('router-render')[index - 1];
        this.routesList.push(route);
        this.instantiateComponent(component, renderDom);
      }
    });
  }

  instantiateComponent(component, renderDom) {
    this.$vm.$renderModuleComponent(component, renderDom);
  }
}

module.exports = {
  Router,
  RouterHash,
};
