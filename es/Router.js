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
      this.watcher = new KeyWatcher(this.$vm, '$esRouteObject', (o, n) => {
        this.refresh();
      });
    }
    this.currentUrl = this.$vm.$esRouteObject.path || '/';
    this.routesList = [];
    this.renderRouteList = this.currentUrl === '/' ? ['/'] : this.currentUrl.split('/');
    this.renderRouteList[0] = '/';
    // if (this.currentUrl === '/') {
    //   this.renderRouteList[0] = '/';
    // } else {
    //   this.renderRouteList = this.currentUrl.split('/');
    //   this.renderRouteList[0] = '/';
    // }
    this.distributeRoutes();
  }

  distributeRoutes() {
    // has render father route
    if (this.lastRoute && this.lastRoute !== this.currentUrl && new RegExp(`^${this.lastRoute}.*`).test(this.currentUrl)) {
      this.insertRenderRoutes();
      // didn't render father route
    } else if (this.lastRoute && this.lastRoute !== this.currentUrl && new RegExp(`^${this.currentUrl}.*`).test(this.lastRoute)) {
      this.removeRenderRoutes();
      // this.lastRoute = this.currentUrl;
      console.log('退后了');
    } else { // didn't render father route
      console.log('没有历史');
      console.log('!! this.lastRoute', this.lastRoute);
      console.log('!! this.lastRoute', this.currentUrl);
      this.generalDistributeRoutes();
    }
    this.$routeChange(this.lastRoute, this.currentUrl);
    this.lastRoute = this.currentUrl;
    if (this.needRedirectPath) {
      this.redirectTo(this.needRedirectPath);
      this.needRedirectPath = null;
    }
    // else {
    //   this.$routeChange(this.lastRoute, this.currentUrl);
    //   this.lastRoute = this.currentUrl;
    // }
  }

  insertRenderRoutes() {
    // let lastRouteList = null;
    // if (this.lastRoute === '/') {
    //   lastRouteList = ['/'];
    // } else {
    //   lastRouteList = this.lastRoute.split('/');
    //   lastRouteList[0] = '/';
    // }
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
        // if (rootRoute.redirectTo && /^\/.*/.test(rootRoute.redirectTo) && (index + 1) === this.renderRouteList.length) {
        //   this.hasRenderComponentList.forEach((c, i) => {
        //     if (i >= index) {
        //       if (c.$onDestory) c.$onDestory();
        //     }
        //   });
        //   this.hasRenderComponentList.length = index;
        //   this.redirectTo(rootRoute.redirectTo);
        //   return;
        // }
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
          console.log(111, index, needRenderRoute.redirectTo);
          console.log('this.renderRouteList', this.renderRouteList);
          console.log('this.hasRenderComponentList', this.hasRenderComponentList);
          this.hasRenderComponentList.forEach((c, i) => {
            if (i > index) {
              if (c.$onDestory) c.$onDestory();
            }
          });
          this.hasRenderComponentList.length = index;
          // this.redirectTo(needRenderRoute.redirectTo);
          this.needRedirectPath = needRenderRoute.redirectTo;
          return;
        }

        console.log(11111111);
        const needRenderComponent = this.$vm.$components[needRenderRoute.component];
        const renderDom = document.querySelectorAll('router-render')[index - 1];
        console.log('renderDom', index, renderDom);
        this.hasRenderComponentList.forEach((c, i) => {
          if (i > index) {
            if (c.$onDestory) c.$onDestory();
          }
        });
        this.hasRenderComponentList.length = index;
        this.instantiateComponent(needRenderComponent, renderDom).then(component => {
          this.hasRenderComponentList[index] = component;
        });

        // if (needRenderRoute.redirectTo && /^\/.*/.test(needRenderRoute.redirectTo) && (index + 1) === this.renderRouteList.length) {
        //   console.log(111, index, needRenderRoute.redirectTo);
        //   console.log('this.renderRouteList', this.renderRouteList);
        //   console.log('this.hasRenderComponentList', this.hasRenderComponentList);
        //   this.hasRenderComponentList.forEach((c, i) => {
        //     if (i > index) {
        //       if (c.$onDestory) c.$onDestory();
        //     }
        //   });
        //   this.hasRenderComponentList.length = index;
        //   // this.redirectTo(needRenderRoute.redirectTo);
        //   this.needRedirectPath = needRenderRoute.redirectTo;
        //   return;
        // }
      }
    }

    // this.renderRouteList.forEach((path, index) => {
    //   if (index === 0) {
    //     const rootRoute = this.routes.find(route => route.path === `${path}` || /^\/\:.+/.test(route.path));
    //     if (!rootRoute) {
    //       console.error('wrong route instantiation in insertRenderRoutes:', this.currentUrl);
    //       return;
    //     }
    //     if (rootRoute.redirectTo && /^\/.*/.test(rootRoute.redirectTo)) {
    //       this.redirectTo(rootRoute.redirectTo);
    //       return;
    //     }
    //     this.routesList.push(rootRoute);
    //   } else {
    //     const lastRoute = this.routesList[index - 1].children;
    //     if (!lastRoute || !(lastRoute instanceof Array)) {
    //       console.error('routes not exit or routes must be an array!');
    //       return;
    //     }
    //     const route = lastRoute.find(route => route.path === `/${path}` || /^\/\:.+/.test(route.path));
    //     if (!route) {
    //       console.error('wrong route instantiation1:', this.currentUrl);
    //       return;
    //     }
    //     this.routesList.push(route);
    //   }
    //   if (index === needRenderIndex) {
    //     const lastRoute = this.routesList[index - 1].children;
    //     if (!lastRoute || !(lastRoute instanceof Array)) {
    //       console.error('routes not exit or routes must be an array!');
    //     }
    //     const route = lastRoute.find(route => route.path === `/${path}` || /^\/\:.+/.test(route.path));
    //     if (!route) return;
    //     if (route.redirectTo && /^\/.*/.test(route.redirectTo)) {
    //       this.redirectTo(route.redirectTo);
    //       return;
    //     }
    //     if (this.oldComponent && this.oldComponent.$routeChange) this.oldComponent.$routeChange(this.lastRoute, this.currentUrl);

    //     let Component = null;
    //     if (this.$vm.$rootModule.$components[route.component]) {
    //       Component = this.$vm.$components[route.component];
    //     } else {
    //       console.error(`route error: ${route.component} is undefined`);
    //       return;
    //     }
    //     const renderDom = document.querySelectorAll('router-render')[index - 1];
    //     this.instantiateComponent(Component, renderDom)
    //       .then(component => {
    //         this.oldComponent = component;
    //       })
    //       .catch(() => console.error('renderComponent failed'));
    //   }
    // });
  }

  removeRenderRoutes() {
    const lastRouteList = this.lastRoute === '/' ? ['/'] : this.lastRoute.split('/');
    lastRouteList[0] = '/';
    for (let index = 0; index < lastRouteList.length; index++) {
      if (lastRouteList[index] !== this.renderRouteList[index]) {
        const renderDom = document.querySelectorAll('router-render')[index - 1];
        const willRemoveComponent = this.hasRenderComponentList[index];
        if (willRemoveComponent && willRemoveComponent.$onDestory) willRemoveComponent.$onDestory();
        renderDom.removeChild(renderDom.childNodes[0]);
        this.hasRenderComponentList.length = index;
        return;
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

        // if (rootRoute.redirectTo && /^\/.*/.test(rootRoute.redirectTo) && (index + 1) === this.renderRouteList.length) {
        //   // this.redirectTo(rootRoute.redirectTo);
        //   this.needRedirectPath = rootRoute.redirectTo;
        //   this.hasRenderComponentList.length = index;
        //   // console.log(222, this.needRedirectPath);
        //   return;
        // }

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
            this.hasRenderComponentList[index] = component;
          })
          .catch(() => console.error('renderComponent failed'));

        if (rootRoute.redirectTo && /^\/.*/.test(rootRoute.redirectTo) && (index + 1) === this.renderRouteList.length) {
          // this.redirectTo(rootRoute.redirectTo);
          this.needRedirectPath = rootRoute.redirectTo;
          this.hasRenderComponentList.length = index;
          // console.log(222, this.needRedirectPath);
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
            if (i > index) {
              if (c.$onDestory) c.$onDestory();
            }
          });
          this.needRedirectPath = route.redirectTo;
          this.hasRenderComponentList.length = index;
          // this.redirectTo(route.redirectTo);
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
            this.hasRenderComponentList[index] = component;
          })
          .catch(() => console.error('renderComponent failed'));
        // if (route.redirectTo && /^\/.*/.test(route.redirectTo) && (index + 1) === this.renderRouteList.length) {
        //   this.hasRenderComponentList.forEach((c, i) => {
        //     if (i > index) {
        //       if (c.$onDestory) c.$onDestory();
        //     }
        //   });
        //   this.needRedirectPath = route.redirectTo;
        //   this.hasRenderComponentList.length = index;
        //   // this.redirectTo(route.redirectTo);
        //   return;
        // }
      }
    }

    // this.renderRouteList.forEach((path, index) => {
    //   // first bootstrap route
    //   if (index === 0) {
    //     const rootRoute = this.routes.find(route => route.path === `${path}` || /^\/\:.+/.test(route.path));
    //     if (!rootRoute) {
    //       console.error('wrong route instantiation in generalDistributeRoutes:', this.currentUrl);
    //       return;
    //     }
    //     if (rootRoute.redirectTo && /^\/.*/.test(rootRoute.redirectTo)) {
    //       this.redirectTo(rootRoute.redirectTo);
    //       console.log(111);
    //       return;
    //     }
    //     if (this.oldComponent && this.oldComponent.$routeChange) this.oldComponent.$routeChange(this.lastRoute, this.currentUrl);

    //     let Component = null;
    //     if (this.$vm.$rootModule.$components[rootRoute.component]) {
    //       Component = this.$vm.$components[rootRoute.component];
    //     } else {
    //       console.error(`route error: ${rootRoute.component} is undefined`);
    //       return;
    //     }
    //     const rootDom = document.querySelector('#root');
    //     this.routesList.push(rootRoute);
    //     this.instantiateComponent(Component, rootDom)
    //       .then(component => {
    //         this.oldComponent = component;
    //         this.hasRenderComponentList.push(component);
    //       })
    //       .catch(() => console.error('renderComponent failed'));
    //   } else {
    //     console.log('this.routesList', this.routesList, index);
    //     const lastRoute = this.routesList[index - 1].children;
    //     if (!lastRoute || !(lastRoute instanceof Array)) {
    //       console.error('routes not exit or routes must be an array!');
    //     }
    //     const route = lastRoute.find(route => route.path === `/${path}` || /^\/\:.+/.test(route.path));
    //     if (!route) {
    //       console.error('wrong route instantiation1:', this.currentUrl);
    //       return;
    //     }
    //     if (route.redirectTo && /^\/.*/.test(route.redirectTo)) {
    //       this.redirectTo(route.redirectTo);
    //       return;
    //     }
    //     if (this.oldComponent && this.oldComponent.$routeChange) this.oldComponent.$routeChange(this.lastRoute, this.currentUrl);
    //     let Component = null;
    //     if (this.$vm.$rootModule.$components[route.component]) {
    //       Component = this.$vm.$components[route.component];
    //     } else {
    //       console.error(`route error: ${route.component} is undefined`);
    //       return;
    //     }
    //     const renderDom = document.querySelectorAll('router-render')[index - 1];
    //     this.routesList.push(route);
    //     this.instantiateComponent(Component, renderDom)
    //       .then(component => {
    //         this.oldComponent = component;
    //         this.hasRenderComponentList.push(component);
    //       })
    //       .catch(() => console.error('renderComponent failed'));
    //   }
    // });
  }

  instantiateComponent(Component, renderDom) {
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
