const Lifecycle = require('./Lifecycle');
const Watcher = require('./Watcher');
const Compile = require('./Compile');

class Controller extends Lifecycle {
  constructor() {
    super();
    this.state = {};
  }

  $beforeInit() {
    if (this.$declare) this.$declare();
    this.stateWatcher = new Watcher(this.state, this.$watchState.bind(this), this.$reRender.bind(this));
  }

  $mountComponent(dom) {
    if (this.$declare) this.$declare();
    for (let key in this.$components) {
      this.$components[key].$fatherDom = dom;
      if (this.$components[key].$beforeInit) this.$components[key].$beforeInit();
      if (this.$components[key].$onInit) this.$components[key].$onInit();
      if (this.$components[key].$beforeMount) this.$components[key].$beforeMount();
    }
  }

  // $render() {
  //   const dom = document.getElementById('root');

  $render(dom) {
    this.dom = dom;
    if (dom.hasChildNodes()) {
      let childs = dom.childNodes;
      for (let i = childs.length - 1; i >= 0; i--) {
        dom.removeChild(childs.item(i));
      }
    }
    this.$mountComponent(dom);
    this.compile = new Compile(dom, this);
    if (this.$components) {
      for (let key in this.$components) {
        if (this.$components[key].$render) this.$components[key].$render();
        if (this.$components[key].$afterMount) this.$components[key].$afterMount();
      }
    }
    if (this.$hasRender) this.$hasRender();
  }

  $reRender() {
    // const dom = document.getElementById('root');
    const dom = this.dom;
    if (dom.hasChildNodes()) {
      let childs = dom.childNodes;
      for (let i = childs.length - 1; i >= 0; i--) {
        dom.removeChild(childs.item(i));
      }
      if (this.$onDestory) this.$onDestory();
    }
    this.$mountComponent(dom);
    this.compile = new Compile(dom, this);
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
