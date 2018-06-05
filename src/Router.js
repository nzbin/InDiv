const Utils = require('./Utils');
const KeyWatcher = require('./KeyWatcher');

class Router {
  constructor() {
    this.routes = {};
    this.currentUrl = '';
    this.lastRoute = null;
    this.rootDom = null;
    this.utils = new Utils();
  }

  $use() {
    window.addEventListener('load', this.refresh.bind(this), false);
    window.addEventListener('popstate', (e) => {
      window._esRouteObject = {
        path: location.pathname || '/',
        query: {},
        params: {},
      };
      this.refresh();
    }, false);
  }

  $routeChange(lastRoute, nextRoute) {}

  redirectTo(redirectTo) {
    history.replaceState(null, null, `${redirectTo}`);
    window._esRouteObject = {
      path: redirectTo || '/',
      query: {},
      params: {},
    };
  }

  init(arr) {
    window._esRouteMode = 'state';
    if (arr && arr instanceof Array) {
      const rootDom = document.querySelector('#root');
      this.rootDom = rootDom || null;
      this.routes = arr;
      this.routesList = [];
    } else {
      console.error('no routes exit');
    }
  }

  route(path, controller) {
    this.routes[path] = controller || function () {};
  }

  refresh() {
    if (!window._esRouteObject || !this.watcher) {
      window._esRouteObject = {
        path: location.pathname || '/',
        query: {},
        params: {},
      };
      this.watcher = new KeyWatcher(window, '_esRouteObject', (o, n) => {
        this.refresh();
      });
    }
    this.currentUrl = window._esRouteObject.path || '/';

    this.renderRouteList = this.currentUrl.split('/');
    this.routesList = [];
    this.renderRouteList.shift();
    this.distributeRoutes();
  }

  distributeRoutes() {
    // has render father route
    if (this.lastRoute && new RegExp(`^${this.lastRoute}.*`).test(this.currentUrl)) {
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
        if (this.oldController && this.oldController.$routeChange) this.oldController.$routeChange(this.lastRoute, this.currentUrl);
        const Controller = route.controller;
        const rootController = new Controller();
        this.oldController = rootController;
        const renderDom = document.querySelectorAll('router-render')[index - 1];
        this.instantiateController(rootController, renderDom);
      }
    });
  }

  generalDistributeRoutes() {
    this.renderRouteList.forEach((path, index) => {
      // first init route
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
        if (this.oldController && this.oldController.$routeChange) this.oldController.$routeChange(this.lastRoute, this.currentUrl);
        const Controller = rootRoute.controller;
        const rootController = new Controller();
        this.oldController = rootController;
        const rootDom = document.querySelector('#root');
        this.routesList.push(rootRoute);
        this.instantiateController(rootController, rootDom);
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
        if (this.oldController && this.oldController.$routeChange) this.oldController.$routeChange(this.lastRoute, this.currentUrl);
        const Controller = route.controller;
        const rootController = new Controller();
        this.oldController = rootController;
        const renderDom = document.querySelectorAll('router-render')[index - 1];
        this.routesList.push(route);
        this.instantiateController(rootController, renderDom);
      }
    });
  }

  instantiateController(controller, renderDom) {
    if (controller.$beforeInit) controller.$beforeInit();
    if (controller.$onInit) controller.$onInit();
    this.renderController(controller, renderDom);
  }

  renderController(controller, rootDom) {
    const template = controller.$template;
    if (template && typeof template === 'string' && rootDom) {
      if (controller.$beforeMount) controller.$beforeMount();
      this.replaceDom(controller, rootDom).then(() => {
        if (controller.$afterMount) controller.$afterMount();
      });
      return Promise.resolve();
    } else {
      console.error('renderController failed: template or rootDom is not exit');
      return Promise.reject();
    }
  }

  replaceDom(controller, rootDom) {
    if (controller.$render) controller.$render(rootDom);
    return Promise.resolve();
  }
}

class RouterHash {
  constructor() {
    this.routes = {};
    this.currentUrl = '';
    this.lastRoute = null;
    this.rootDom = null;
    this.utils = new Utils();
  }

  $use() {
    window.addEventListener('load', this.refresh.bind(this), false);
    window.addEventListener('hashchange', this.refresh.bind(this), false);
    window.addEventListener('popstate', (e) => {
      window._esRouteObject = {
        path: location.hash.split('?')[0].slice(1) || '/',
        query: {},
        params: {},
      };
      console.log('111');

      this.refresh();
    }, false);
  }

  $routeChange(lastRoute, nextRoute) {}

  redirectTo(redirectTo) {
    history.replaceState(null, null, `#${redirectTo}`);
    window._esRouteObject = {
      path: redirectTo || '/',
      query: {},
      params: {},
    };
  }

  init(arr) {
    window._esRouteMode = 'hash';
    if (arr && arr instanceof Array) {
      const rootDom = document.querySelector('#root');
      this.rootDom = rootDom || null;
      this.routes = arr;
      this.routesList = [];
    } else {
      console.error('no routes exit');
    }
  }

  route(path, controller) {
    this.routes[path] = controller || function () {};
  }

  refresh() {
    if (!window._esRouteObject || !this.watcher) {
      window._esRouteObject = {
        path: location.hash.split('?')[0].slice(1) || '/',
        query: {},
        params: {},
      };
      this.watcher = new KeyWatcher(window, '_esRouteObject', (o, n) => {
        this.refresh();
      });
    }
    this.currentUrl = window._esRouteObject.path || '/';

    console.log('33333');
    this.renderRouteList = this.currentUrl.split('/');
    this.routesList = [];
    this.renderRouteList.shift();
    this.distributeRoutes();
  }


  distributeRoutes() {
    // has render father route
    if (this.lastRoute && new RegExp(`^${this.lastRoute}.*`).test(this.currentUrl)) {
      this.insertRenderRoutes();
    // didn't render father route
    } else {
      this.generalDistributeRoutes();
    }
    console.log('this.lastRoute', this.lastRoute);
    console.log('this.currentUrl', this.currentUrl);
    console.log('window._esRouteObject', window._esRouteObject);
    console.log('1111');
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
        if (this.oldController && this.oldController.$routeChange) this.oldController.$routeChange(this.lastRoute, this.currentUrl);
        const Controller = route.controller;
        const rootController = new Controller();
        this.oldController = rootController;
        const renderDom = document.querySelectorAll('router-render')[index - 1];
        this.instantiateController(rootController, renderDom);
      }
    });
  }

  generalDistributeRoutes() {
    this.renderRouteList.forEach((path, index) => {
      // first init route
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
        if (this.oldController && this.oldController.$routeChange) this.oldController.$routeChange(this.lastRoute, this.currentUrl);
        const Controller = rootRoute.controller;
        const rootController = new Controller();
        this.oldController = rootController;
        const rootDom = document.querySelector('#root');
        this.routesList.push(rootRoute);
        this.instantiateController(rootController, rootDom);
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
        if (this.oldController && this.oldController.$routeChange) this.oldController.$routeChange();
        const Controller = route.controller;
        const rootController = new Controller();
        this.oldController = rootController;
        const renderDom = document.querySelectorAll('router-render')[index - 1];
        this.routesList.push(route);
        this.instantiateController(rootController, renderDom);
      }
    });
  }

  instantiateController(controller, renderDom) {
    if (controller.$beforeInit) controller.$beforeInit();
    if (controller.$onInit) controller.$onInit();
    this.renderController(controller, renderDom);
  }

  renderController(controller, rootDom) {
    const template = controller.$template;
    if (template && typeof template === 'string' && rootDom) {
      if (controller.$beforeMount) controller.$beforeMount();
      this.replaceDom(controller, rootDom).then(() => {
        if (controller.$afterMount) controller.$afterMount();
      });
      return Promise.resolve();
    } else {
      console.error('renderController failed: template or rootDom is not exit');
      return Promise.reject();
    }
  }

  replaceDom(controller, rootDom) {
    if (controller.$render) controller.$render(rootDom);
    return Promise.resolve();
  }
}

module.exports = {
  Router,
  RouterHash,
};
