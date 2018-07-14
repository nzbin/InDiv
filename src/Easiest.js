import Utils from './Utils';

class Easiest {
  constructor() {
    this.modalList = [];
    this.utils = new Utils();
    this.$globalContext = {};
    this.rootDom = document.querySelector('#root');
    this.$rootPath = '/';
    this.$canRenderModule = true;
    this.$esRouteMode = null;
    this.$routeDOMKey = 'router-render';

    this.$rootModule = null;
  }

  $use(modal) {
    modal.$bootstrap(this);
    this.modalList.push(modal);
    return this.modalList.findIndex(md => this.utils.isEqual(md, modal));
  }

  $setRootPath(rootPath) {
    if (rootPath && typeof rootPath === 'string') {
      this.$rootPath = rootPath;
    } else {
      console.error('rootPath is not defined or rootPath must be a String');
    }
  }

  $bootstrapModule(Esmodule) {
    if (!Esmodule) {
      console.error('must send a root module');
      return;
    }
    this.$rootModule = new Esmodule();
    this.$components = Object.assign({}, this.$rootModule.$components);
  }

  $init() {
    if (!this.$rootModule) {
      console.error('must use $bootstrapModule to declare a root EsModule before $init');
      return;
    }
    if (this.$canRenderModule) this.$renderModuleBootstrap();
  }

  $renderModuleBootstrap() {
    if (!this.$rootModule.$bootstrap) {
      console.error('need $bootstrap for render Module Bootstrap');
      return;
    }
    const Component = this.$rootModule.$bootstrap;
    this.$renderComponent(Component, this.rootDom);
  }

  $renderComponent(Component, renderDOM) {
    const args = this.createInjector(Component);
    const component = Reflect.construct(Component, args);
    component.$vm = this;
    component.$components = this.$rootModule.$components;
    if (component.$beforeInit) component.$beforeInit();
    if (component.$onInit) component.$onInit();
    if (!component.$template) {
      console.error('must decaler this.$template in $bootstrap()');
      return;
    }
    const template = component.$template;
    if (template && typeof template === 'string' && renderDOM) {
      if (component.$beforeMount) component.$beforeMount();
      this.replaceDom(component, renderDOM).then(() => {
        if (component.$afterMount) component.$afterMount();
      });
      return Promise.resolve(component);
    } else {
      console.error('renderBootstrap failed: template or rootDom is not exit');
      return Promise.reject();
    }
  }

  createInjector(Component) {
    // const DELEGATE_CTOR = /^function\s+\S+\(\)\s*{[\s\S]+\.apply\(this,\s*arguments\)/;
    // const INHERITED_CLASS = /^class\s+[A-Za-z\d$_]*\s*extends\s+[A-Za-z\d$_]+\s*{/;
    // const INHERITED_CLASS_WITH_CTOR = /^class\s+[A-Za-z\d$_]*\s*extends\s+[A-Za-z\d$_]+\s*{[\s\S]*constructor\s*\(/;
    const CLASS_ARGUS = /^function\s+[^\(]*\(\s*([^\)]*)\)/m;
    const argList = Component.toString().match(CLASS_ARGUS)[1].replace(/ /g, '').split(',');
    let args = [];
    argList.forEach(arg => {
      const Service = Component._injectedProviders.find(service => service.constructor.name === arg) ? Component._injectedProviders.find(service => service.constructor.name === arg) : this.$rootModule.$providers.find(service => service.constructor.name === arg);
      if (Service) args.push(Service);
    });
    return args;
  }

  replaceDom(component, renderDOM) {
    component.$renderDom = renderDOM;
    if (component.$render) {
      component.$render();
      return Promise.resolve();
    } else {
      return Promise.reject();
    }
  }
}

export default Easiest;
