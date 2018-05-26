const Utils = require('./Utils');
const KeyWatcher = require('./KeyWatcher');

class Router {
  constructor() {
    this.routes = {};
    this.currentUrl = '';
    this.lastRoute = null;
    this.rootDom = null;
    this.utils = new Utils();
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
        path: location.pathname || '/',
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
    const template = controller.declareTemplate;
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

class RouterHash {
  constructor() {
    this.routes = {};
    this.currentUrl = '';
    this.lastRoute = null;
    this.rootDom = null;
    this.utils = new Utils();
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
    const template = controller.declareTemplate;
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
