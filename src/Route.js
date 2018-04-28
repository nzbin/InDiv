class Router {
  constructor() {
    this.routes = {};
    this.currentUrl = '';
    this.rootDom = null;
    window.addEventListener('load', this.refresh.bind(this), false);
    window.addEventListener('hashchange', this.refresh.bind(this), false);
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
      if (controller.$onInit) controller.$onInit();
      this.refreshDom(controller);
    }
  }

  init(arr) {
    if (arr && arr instanceof Array) {
      arr.forEach(route => {
        this.route(route.path, route.controller);
      });
      const rootDom = document.querySelector('#root');
      this.rootDom = rootDom || null;
    } else {
      console.error('no routes exit');
    }
  }

  refreshDom(controller) {
    const template = controller.template;
    if (template && typeof template === 'string' && this.rootDom) {
      if (controller.$beforeMount) controller.$beforeMount();
      this.replaceDom(controller);
      if (controller.$afterMount) controller.$afterMount();
    } else {
      console.error('refreshDom failed: template or rootDom is not exit');
    }
  }

  replaceDom(controller) {
    const template = controller.template;
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
  }

  parseDom(template) {
    const elementCreated = document.createElement('div');
    let newTemplate = null;
    if (window.routerController) {
      newTemplate = template.replace(/( )(rt)([A-Za-z]+="|[A-Za-z]+="')(this)/g, (...args) => `${args[1]}on${args[3]}window.routerController`);
    }
    elementCreated.innerHTML = newTemplate;
    return elementCreated;
  }
}
