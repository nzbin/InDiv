import Lifecycle from './Lifecycle';
import Watcher from './Watcher';
import Compile from './Compile';

export default class Controller extends Lifecycle {
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

  $mountComponent() {
    for (let key in this.declareComponents) {
      if (this.declareComponents[key].$beforeInit) this.declareComponents[key].$beforeInit();
      if (this.declareComponents[key].$onInit) this.declareComponents[key].$onInit();
      const domReg = new RegExp(`(\<)(${key})(\/>)`, 'g');
      this.declareTemplate = this.declareTemplate.replace(domReg, (...args) => `<div id="component_${key}"></div>`);
      if (this.declareComponents[key].$beforeMount) this.declareComponents[key].$beforeMount();
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
    if (this.declareComponents) {
      for (let key in this.declareComponents) {
        if (this.declareComponents[key].$render) this.declareComponents[key].$render();
        if (this.declareComponents[key].$afterMount) this.declareComponents[key].$afterMount();
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
    if (this.declareComponents) {
      for (let key in this.declareComponents) {
        if (this.declareComponents[key].$reRender) this.declareComponents[key].$reRender();
        if (this.declareComponents[key].$afterMount) this.declareComponents[key].$afterMount();
      }
    }
    if (this.$hasRender) this.$hasRender();
  }
}
