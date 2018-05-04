class Controller extends Lifecycle {
  constructor() {
    super();
    this.declareTemplate = '';
    this.state = {};
    this.declareComponents = {};
  }

  $beforeInit() {
    this.stateWatcher = new Watcher(this.state, this.$watchState.bind(this), this.$updateProps.bind(this), this.$reRender.bind(this));
  }

  $updateProps(key, newVal) {
    for (var componentName in this.declareComponents) {
      const declareComponent = this.declareComponents[componentName];
      let propsKey = null;
      for (let name in declareComponent.preProps) {
        if (declareComponent.preProps[name] === key) {
          propsKey = name;
        }
      }
      if (propsKey && newVal !== declareComponent.props[propsKey]) declareComponent.props[propsKey] = newVal;
    }
  }

  $renderComponent() {
    let variableReg = /\{\{(.*?)\}\}/g;
    for (let key in this.declareComponents) {
      if (this.declareComponents[key].$beforeInit) this.declareComponents[key].$beforeInit();
      if (this.declareComponents[key].$onInit) this.declareComponents[key].$onInit();
      // const declareTemplate = this.declareComponents[key].declareTemplate.replace(/( )(rt)([A-Z]{1})([A-Za-z]+="|[A-Za-z]+=')(this)/g, (...args) => `${args[1]}on${args[3].toLowerCase()}${args[4]}window.routerController.declareComponents.${key}`);
      const domReg = new RegExp(`(\<)(${key})(\/>)`, 'g');
      // this.declareTemplate = this.declareTemplate.replace(domReg, (...args) => `<div id="component_${key}">${declareTemplate}</div>`);
      this.declareTemplate = this.declareTemplate.replace(domReg, (...args) => `<div id="component_${key}"></div>`);
      if (this.declareComponents[key].$beforeMount) this.declareComponents[key].$beforeMount();
    }
  }

  $reRender() {
    // const dom = document.getElementById('route-container');
    // if (dom.hasChildNodes()) {
    //   let childs = dom.childNodes;
    //   for (let i = childs.length - 1; i >= 0; i--) {
    //     dom.removeChild(childs.item(i));
    //   }
    //   if (this.$onDestory) this.$onDestory();
    // }
    // if (window.routerController) {
    //   this.declareTemplate = this.declareTemplate.replace(/( )(rt)([A-Z]{1})([A-Za-z]+="|[A-Za-z]+=')(this)/g, (...args) => `${args[1]}on${args[3].toLowerCase()}${args[4]}window.routerController`);
    // }
    // dom.innerHTML = this.declareTemplate;
    if (this.$hasRender) this.$hasRender();
  }
}
