class Router {
  constructor() {
    this.routes = {};
    this.currentUrl = '';
    this.lastRoute = null;
    this.rootDom = null;
    window.addEventListener('load', this.refresh.bind(this), false);
    window.addEventListener('hashchange', this.refresh.bind(this), false);
  }

  $routeChange(lastRoute, nextRoute) {}

  init(arr) {
    if (arr && arr instanceof Array) {
      arr.forEach(route => {
        if (route.path && route.controller && route.controller instanceof Function) {
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
    this.currentUrl = location.hash.slice(1) || '/';
    if (this.routes[this.currentUrl]) {
      if (window.routerController) {
        if (window.routerController.$onDestory) window.routerController.$onDestory();
        delete window.routerController;
      }
      const controller = new this.routes[this.currentUrl]();
      window.routerController = controller;
      if (controller.$beforeInit) controller.$beforeInit();
      if (controller.$beforeInit) controller.$renderComponent();
      if (controller.$onInit) controller.$onInit();
      this.renderDom(controller).then(() => {
        this.$routeChange(this.lastRoute, this.currentUrl);
        this.lastRoute = this.currentUrl;
      }).catch(() => {
        console.error('route change failed');
      });
    }
  }

  renderDom(controller) {
    const template = controller.declareTemplate;
    if (template && typeof template === 'string' && this.rootDom) {
      if (controller.$beforeMount) controller.$beforeMount();
      this.replaceDom(controller).then(() => {
        if (controller.declareComponents) {
          for (let key in controller.declareComponents) {
            if (controller.declareComponents[key].$afterMount) controller.declareComponents[key].$afterMount();
          }
        }
        if (controller.$afterMount) controller.$afterMount();
      });
      return Promise.resolve();
    } else {
      console.error('renderDom failed: template or rootDom is not exit');
      return Promise.reject();
    }
  }

  replaceDom(controller) {
    const template = controller.declareTemplate;
    if (this.rootDom.hasChildNodes()) {
      let childs = this.rootDom.childNodes;
      for (let i = childs.length - 1; i >= 0; i--) {
        this.rootDom.removeChild(childs.item(i));
      }
    }
    let templateDom = this.parseDom(template);
    let fragment = document.createDocumentFragment();
    fragment.appendChild(templateDom);
    this.rootDom.appendChild(fragment);
    return Promise.resolve();
  }

  parseDom(template) {
    const elementCreated = document.createElement('div');
    let newTemplate = null;
    if (window.routerController) {
      newTemplate = template.replace(/( )(rt)([A-Z]{1})([A-Za-z]+="|[A-Za-z]+=')(this)/g, (...args) => `${args[1]}on${args[3].toLowerCase()}${args[4]}window.routerController`);
    }
    elementCreated.innerHTML = newTemplate;
    return elementCreated;
  }
}
