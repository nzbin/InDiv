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

  init(arr) {
    window._esRouteMode = 'state';
    // if (arr && arr instanceof Array) {
    //   arr.forEach(route => {
    //     if (route.path && route.controller && this.utils.isFunction(route.controller)) {
    //       this.route(route.path, route.controller);
    //     } else {
    //       console.error('need path or controller');
    //       return false;
    //     }
    //   });
    //   const rootDom = document.querySelector('#root');
    //   this.rootDom = rootDom || null;
    // } else {
    //   console.error('no routes exit');
    // }
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

    // if (this.routes[this.currentUrl]) {
    //   if (window.routerController) {
    //     if (window.routerController.$onDestory) window.routerController.$onDestory();
    //     delete window.routerController;
    //   }
    //   const controller = new this.routes[this.currentUrl]();
    //   window.routerController = controller;
    //   if (controller.$beforeInit) controller.$beforeInit();
    //   if (controller.$onInit) controller.$onInit();
    //   this.renderController(controller).then(() => {
    //     this.$routeChange(this.lastRoute, this.currentUrl);
    //     this.lastRoute = this.currentUrl;
    //   }).catch(() => {
    //     console.error('route change failed');
    //   });
    // }
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
          location.replace(`${rootRoute.redirectTo}`);
          return;
        }
        // if (rootRoute) {
        this.routesList.push(rootRoute);
        // } else {
        //   console.error('wrong route instantiation2:', this.currentUrl);
        // }
      } else {
        const lastRoute = this.routesList[index - 1].children;
        if (!lastRoute || !(lastRoute instanceof Array)) {
          console.error('routes not exit or routes must be an array!');
          return;
        }
        // if (lastRoute && lastRoute instanceof Array) {
        const route = lastRoute.find(route => route.path === `/${path}`);
        if (!route) {
          console.error('wrong route instantiation1:', this.currentUrl);
          return;
        }
        // if (route) {
        this.routesList.push(route);
        // } else {
        //   console.error('wrong route instantiation1:', this.currentUrl);
        // }
        // }
      }
      if (index === needRenderIndex) {
        const lastRoute = this.routesList[index - 1].children;
        if (!lastRoute || !(lastRoute instanceof Array)) {
          console.error('routes not exit or routes must be an array!');
        }
        // if (lastRoute && lastRoute instanceof Array) {
        const route = lastRoute.find(route => route.path === `/${path}`);
        if (!route) return;
        if (route.redirectTo && /^\/.*/.test(route.redirectTo)) {
          location.replace(`${route.redirectTo}`);
          return;
        }
        // if (route) {
        const Controller = route.controller;
        const rootController = new Controller();
        const renderDom = document.querySelectorAll('router-render')[index - 1];
        this.instantiateController(rootController, renderDom);
        // }
      }
      // }
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
          location.replace(`${rootRoute.redirectTo}`);
          return;
        }
        // if (rootRoute) {
        const Controller = rootRoute.controller;
        const rootController = new Controller();
        const rootDom = document.querySelector('#root');
        this.routesList.push(rootRoute);
        this.instantiateController(rootController, rootDom);
        // } else {
        //   console.error('wrong route instantiation2:', this.currentUrl, );
        // }
      // forward init route
      } else {
        const lastRoute = this.routesList[index - 1].children;
        if (!lastRoute || !(lastRoute instanceof Array)) {
          console.error('routes not exit or routes must be an array!');
        }
        // if (lastRoute && lastRoute instanceof Array) {
        const route = lastRoute.find(route => route.path === `/${path}`);
        if (!route) {
          console.error('wrong route instantiation1:', this.currentUrl);
          return;
        }
        if (route.redirectTo && /^\/.*/.test(route.redirectTo)) {
          location.replace(`${route.redirectTo}`);
          return;
        }
        // if (route) {
        console.log('route', route);
        const Controller = route.controller;
        const rootController = new Controller();
        const renderDom = document.querySelectorAll('router-render')[index - 1];
        this.routesList.push(route);
        this.instantiateController(rootController, renderDom);
        // } else {
        //   console.error('wrong route instantiation1:', this.currentUrl);
        // }
      }
      // }
    });
  }

  instantiateController(controller, renderDom) {
    if (controller.$beforeInit) controller.$beforeInit();
    if (controller.$onInit) controller.$onInit();
    this.renderController(controller, renderDom);
    // .then(() => {
    //   this.$routeChange(this.lastRoute, this.currentUrl);
    //   this.lastRoute = this.currentUrl;
    // }).catch(() => {
    //   console.error('route change failed');
    // });
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

  // renderController(controller) {
  //   const template = controller.$template;
  //   if (template && typeof template === 'string' && this.rootDom) {
  //     if (controller.$beforeMount) controller.$beforeMount();
  //     this.replaceDom(controller).then(() => {
  //       if (controller.$afterMount) controller.$afterMount();
  //     });
  //     return Promise.resolve();
  //   } else {
  //     console.error('renderController failed: template or rootDom is not exit');
  //     return Promise.reject();
  //   }
  // }

  replaceDom(controller, rootDom) {
    if (controller.$render) controller.$render(rootDom);
    return Promise.resolve();
  }

  // replaceDom(controller) {
  //   if (controller.$render) controller.$render();
  //   return Promise.resolve();
  // }
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
      this.refresh();
    }, false);
  }

  $routeChange(lastRoute, nextRoute) {}

  init(arr) {
    window._esRouteMode = 'hash';
    if (arr && arr instanceof Array) {
      arr.forEach(route => {
        if (route.path && route.controller && this.utils.isFunction(route.controller)) {
          this.route(route.path, route.controller);
        } else {
          console.error('need path or controller');
          return false;
        }
      });
      const rootDom = document.querySelector('#root');
      this.rootDom = rootDom || null;
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
    if (this.routes[this.currentUrl]) {
      if (window.routerController) {
        if (window.routerController.$onDestory) window.routerController.$onDestory();
        delete window.routerController;
      }
      const controller = new this.routes[this.currentUrl]();
      window.routerController = controller;
      if (controller.$beforeInit) controller.$beforeInit();
      if (controller.$onInit) controller.$onInit();
      this.renderController(controller).then(() => {
        this.$routeChange(this.lastRoute, this.currentUrl);
        this.lastRoute = this.currentUrl;
      }).catch(() => {
        console.error('route change failed');
      });
    }
  }

  renderController(controller) {
    const template = controller.$template;
    if (template && typeof template === 'string' && this.rootDom) {
      if (controller.$beforeMount) controller.$beforeMount();
      this.replaceDom(controller).then(() => {
        if (controller.$afterMount) controller.$afterMount();
      });
      return Promise.resolve();
    } else {
      console.error('renderController failed: template or rootDom is not exit');
      return Promise.reject();
    }
  }

  replaceDom(controller) {
    if (controller.$render) controller.$render();
    return Promise.resolve();
  }
}

module.exports = {
  Router,
  RouterHash,
};
