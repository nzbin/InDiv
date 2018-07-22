import Utils from './Utils';
import KeyWatcher from './KeyWatcher';

export class Router {
  constructor() {
    this.routes = {};
    this.currentUrl = '';
    this.lastRoute = null;
    this.rootDom = null;
    this.utils = new Utils();
    this.$rootPath = '/';
  }

  $bootstrap(vm) {
    this.$vm = vm;
    this.$vm.$setRootPath(this.$rootPath);
    this.$vm.$canRenderModule = false;
    this.$vm.$esRouteMode = 'state';
    this.$vm.$routeDOMKey = 'router-render';
    window.addEventListener('load', () => {
      console.log(4444444444);
      this.refresh();
    }, false);
    window.addEventListener('popstate', (e) => {
      console.log(333333, 'popstate', this.lastRoute);
      console.log(333333111, 'popstate', this.$vm.$esRouteObject);
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
      // this.refresh();
    }, false);
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
      this.watcher = new KeyWatcher(this.$vm, '$esRouteObject', this.refresh.bind(this));
    }
    this.currentUrl = this.$vm.$esRouteObject.path || '/';
    console.log('this.currentUrl', this.currentUrl);
    this.renderRouteList = this.currentUrl.split('/');
    this.routesList = [];
    this.renderRouteList.shift();
    this.distributeRoutes();
  }

  distributeRoutes() {
    // has render father route
    console.log('this.lastRoute', this.lastRoute);
    console.log('this.currentUrl', this.currentUrl);
    if (this.lastRoute && this.lastRoute !== this.currentUrl && new RegExp(`^${this.lastRoute}.*`).test(this.currentUrl)) {
      console.log(1111);
      this.insertRenderRoutes();
    // didn't render father route
    } else if (this.lastRoute && this.lastRoute !== this.currentUrl && new RegExp(`^${this.currentUrl}.*`).test(this.lastRoute)) {
      console.log(3333333);
      this.insertRenderRoutes();
    } else {
      this.generalDistributeRoutes();
    }
    this.$routeChange(this.lastRoute, this.currentUrl);
    this.lastRoute = this.currentUrl;
  }

  insertRenderRoutes() {
    const lastRouteList = this.lastRoute.split('/');
    lastRouteList.shift();
    console.log('lastRouteList', lastRouteList);
    // const needRenderIndex = this.lastRoute === '/' ? 0 : lastRouteList.length;
    const needRenderIndex = lastRouteList.length;
    console.log('needRenderIndex', needRenderIndex);
    console.log('this.renderRouteList', this.renderRouteList);
    this.renderRouteList.forEach((path, index) => {
      console.log('this.routesList', this.routesList);
      if (index === 0) {
        // ???
        const rootRoute = this.routes.find(route => route.path === `/${path}` || /^\/\:.+/.test(route.path));
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
        console.log('index', index);
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
      if (index === needRenderIndex) {
        // const lastRoute = index === 0 ? this.routesList[index] : this.routesList[index - 1].children;
        const lastRoute = index === 0 ? this.routesList[index].children : this.routesList[index - 1].children;
        console.log('lastRoutelastRoute', lastRoute);
        if (!lastRoute || !(lastRoute instanceof Array)) {
          console.error('routes not exit or routes must be an array!');
        }
        const route = lastRoute.find(route => route.path === `/${path}` || /^\/\:.+/.test(route.path));
        if (!route) return;
        if (route.redirectTo && /^\/.*/.test(route.redirectTo)) {
          this.redirectTo(route.redirectTo);
          return;
        }
        if (this.oldComponent && this.oldComponent.$routeChange) this.oldComponent.$routeChange(this.lastRoute, this.currentUrl);

        let Component = null;
        if (this.$vm.$rootModule.$components[route.component]) {
          Component = this.$vm.$components[route.component];
        } else {
          console.error(`route error: ${route.component} is undefined`);
          return;
        }
        const renderDom = index === 0 ? document.querySelectorAll('router-render') : document.querySelectorAll('router-render')[index - 1];
        console.log('renderDomrenderDom', renderDom);
        this.instantiateComponent(Component, renderDom)
          .then(component => {
            this.oldComponent = component;
          })
          .catch(() => console.error('renderComponent failed'));
      }
    });
  }

  generalDistributeRoutes() {
    this.renderRouteList.forEach((path, index) => {
      // first bootstrap route
      if (index === 0) {
        const rootRoute = this.routes.find(route => route.path === `/${path}` || /^\/\:.+/.test(route.path));
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
          Component = this.$vm.$components[rootRoute.component];
        } else {
          console.error(`route error: ${rootRoute.component} is undefined`);
          return;
        }
        const rootDom = document.querySelector('#root');
        this.routesList.push(rootRoute);
        this.instantiateComponent(Component, rootDom)
          .then(component => {
            this.oldComponent = component;
          })
          .catch(() => console.error('renderComponent failed'));
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
        if (route.redirectTo && /^\/.*/.test(route.redirectTo)) {
          this.redirectTo(route.redirectTo);
          return;
        }
        if (this.oldComponent && this.oldComponent.$routeChange) this.oldComponent.$routeChange(this.lastRoute, this.currentUrl);
        let Component = null;
        if (this.$vm.$rootModule.$components[route.component]) {
          Component = this.$vm.$components[route.component];
        } else {
          console.error(`route error: ${route.component} is undefined`);
          return;
        }
        const renderDom = document.querySelectorAll('router-render')[index - 1];
        this.routesList.push(route);
        this.instantiateComponent(Component, renderDom)
          .then(component => {
            this.oldComponent = component;
          })
          .catch(() => console.error('renderComponent failed'));
      }
    });
  }

  instantiateComponent(Component, renderDom) {
    console.log('Component, renderDom', Component, renderDom);
    return this.$vm.$renderComponent(Component, renderDom);
  }
}

export class RouterHash {
  constructor() {
    this.routes = {};
    this.currentUrl = '';
    this.lastRoute = null;
    this.rootDom = null;
    this.utils = new Utils();
    this.$rootPath = '/';
  }

  $bootstrap(vm) {
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
        const rootRoute = this.routes.find(route => route.path === `/${path}` || /^\/\:.+/.test(route.path));
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
        const route = lastRoute.find(route => route.path === `/${path}` || /^\/\:.+/.test(route.path));
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
        const route = lastRoute.find(route => route.path === `/${path}` || /^\/\:.+/.test(route.path));
        if (!route) return;
        if (route.redirectTo && /^\/.*/.test(route.redirectTo)) {
          this.redirectTo(route.redirectTo);
          return;
        }
        if (this.oldComponent && this.oldComponent.$routeChange) this.oldComponent.$routeChange(this.lastRoute, this.currentUrl);
        let Component = null;
        if (this.$vm.$rootModule.$components[route.component]) {
          Component = this.$vm.$components[route.component];
        } else {
          console.error(`route error: ${route.component} is undefined`);
          return;
        }
        const renderDom = document.querySelectorAll('router-render')[index - 1];
        this.instantiateComponent(Component, renderDom).then(component => {
          this.oldComponent = component;
        });
      }
    });
  }

  generalDistributeRoutes() {
    this.renderRouteList.forEach((path, index) => {
      // first bootstrap route
      if (index === 0) {
        const rootRoute = this.routes.find(route => route.path === `/${path}` || /^\/\:.+/.test(route.path));
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
          Component = this.$vm.$components[rootRoute.component];
        } else {
          console.error(`route error: ${rootRoute.component} is undefined`);
          return;
        }
        const rootDom = document.querySelector('#root');
        this.routesList.push(rootRoute);
        this.instantiateComponent(Component, rootDom).then(component => {
          this.oldComponent = component;
        });
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
        if (route.redirectTo && /^\/.*/.test(route.redirectTo)) {
          this.redirectTo(route.redirectTo);
          return;
        }
        if (this.oldComponent && this.oldComponent.$routeChange) this.oldComponent.$routeChange();
        let Component = null;
        if (this.$vm.$rootModule.$components[route.component]) {
          Component = this.$vm.$components[route.component];
        } else {
          console.error(`route error: ${route.component} is undefined`);
          return;
        }
        const renderDom = document.querySelectorAll('router-render')[index - 1];
        this.routesList.push(route);
        this.instantiateComponent(Component, renderDom).then(component => {
          this.oldComponent = component;
        });
      }
    });
  }

  instantiateComponent(Component, renderDom) {
    return this.$vm.$renderComponent(Component, renderDom);
  }
}
