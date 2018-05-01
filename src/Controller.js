class Controller extends Lifecycle {
  constructor() {
    super();
    this.declareTemplate = '';
    this.state = {};
    this.declareComponents = {};
  }

  $beforeInit() {
    this.watcher = new Watcher(this.state, this.$watchState.bind(this));
  }

  $renderComponent() {
    let variableReg = /\{\{(.*?)\}\}/g;
    for (let key in this.declareComponents) {
      if (this.declareComponents[key].$beforeInit) this.declareComponents[key].$beforeInit();
      if (this.declareComponents[key].$onInit) this.declareComponents[key].$onInit();
      const declareTemplate = this.declareComponents[key].declareTemplate.replace(/( )(rt)([A-Z]{1})([A-Za-z]+="|[A-Za-z]+=')(this)/g, (...args) => `${args[1]}on${args[3].toLowerCase()}${args[4]}window.routerController.declareComponents.${key}`);
      const domReg = new RegExp(`(\<)(${key})(\/>)`, 'g');
      this.declareTemplate = this.declareTemplate.replace(domReg, (...args) => `<div id="component_${key}">${declareTemplate}</div>`);
      if (this.declareComponents[key].$beforeMount) this.declareComponents[key].$beforeMount();
    }
  }
}
