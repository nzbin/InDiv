const Lifecycle = require('./Lifecycle');
const Watcher = require('./Watcher');
const Compile = require('./Compile');

class Controller extends Lifecycle {
  constructor() {
    super();
    this.state = {};
  }

  // $declare() {
  //   this.$template = '';
  //   this.$components = {};
  // }

  $beforeInit() {
    if (this.$declare) this.$declare();
    this.stateWatcher = new Watcher(this.state, this.$watchState.bind(this), this.$reRender.bind(this));
  }

  $mountComponent() {
    if (this.$declare) this.$declare();
    for (let key in this.$components) {
      if (this.$components[key].$beforeInit) this.$components[key].$beforeInit();
      if (this.$components[key].$onInit) this.$components[key].$onInit();
      const domReg = new RegExp(`(\<)(${key})(\/>)`, 'g');
      this.$template = this.$template.replace(domReg, (...args) => `<div id="component_${key}"></div>`);
      if (this.$components[key].$beforeMount) this.$components[key].$beforeMount();
    }
  }

  $render() {
    const dom = document.getElementById('root');
    if (dom.hasChildNodes()) {
      let childs = dom.childNodes;
      for (let i = childs.length - 1; i >= 0; i--) {
        dom.removeChild(childs.item(i));
      }
    }
    this.$mountComponent();
    this.compile = new Compile('#root', this);
    if (this.$components) {
      for (let key in this.$components) {
        if (this.$components[key].$render) this.$components[key].$render();
        if (this.$components[key].$afterMount) this.$components[key].$afterMount();
      }
    }
    if (this.$hasRender) this.$hasRender();
  }

  $reRender() {
    const dom = document.getElementById('root');
    if (dom.hasChildNodes()) {
      let childs = dom.childNodes;
      for (let i = childs.length - 1; i >= 0; i--) {
        dom.removeChild(childs.item(i));
      }
      if (this.$onDestory) this.$onDestory();
    }
    this.$mountComponent();
    this.compile = new Compile('#root', this);
    if (this.$components) {
      for (let key in this.$components) {
        if (this.$components[key].$reRender) this.$components[key].$reRender();
        if (this.$components[key].$afterMount) this.$components[key].$afterMount();
      }
    }
    if (this.$hasRender) this.$hasRender();
  }
}

module.exports = Controller;
