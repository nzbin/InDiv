const Lifecycle = require('./Lifecycle');
const Compile = require('./Compile');
const Watcher = require('./Watcher');

class Component extends Lifecycle {
  constructor(templateName, props) {
    super();
    if (templateName) this.$templateName = templateName;
    if (props) this.props = props;
    this.state = {};
  }

  $beforeInit() {
    if (this.$declare) this.$declare();
    if (this.props) this.propsWatcher = new Watcher(this.props, this.$watchState.bind(this), this.$reRender.bind(this));
    this.stateWatcher = new Watcher(this.state, this.$watchState.bind(this), this.$reRender.bind(this));
  }

  $mountComponent(dom) {
    const saveStates = {};
    if (this.$components) {
      for (let key in this.$components) {
        if (this.$components[key]) saveStates[key] = this.$components[key];
      }
    }

    if (this.$declare) this.$declare();
    for (let key in this.$components) {
      if (saveStates[key] && saveStates[key].$fatherDom && saveStates[key].$template) {
        const props = this.$components[key].props;
        this.$components[key] = saveStates[key];
        this.$components[key].props = props;
      }

      this.$components[key].$fatherDom = dom;
      if (this.$components[key].$beforeInit) this.$components[key].$beforeInit();
      if (this.$components[key].globalContext) this.$components[key].globalContext = this.globalContext;
      if (this.$components[key].$onInit) this.$components[key].$onInit();
      if (this.$components[key].$beforeMount) this.$components[key].$beforeMount();
    }
  }

  $render() {
    const dom = this.$fatherDom.getElementsByTagName(this.$templateName)[0];
    if (dom && dom.hasChildNodes()) {
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
    const dom = this.$fatherDom.getElementsByTagName(this.$templateName)[0];
    if (dom && dom.hasChildNodes()) {
      let childs = dom.childNodes;
      for (let i = childs.length - 1; i >= 0; i--) {
        dom.removeChild(childs.item(i));
      }
    }
    this.$mountComponent(dom);
    if (this.$onDestory) this.$onDestory();
    this.compile = new Compile(dom, this);
    if (this.$components) {
      for (let key in this.$components) {
        if (this.$components[key].$render) this.$components[key].$reRender();
        if (this.$components[key].$afterMount) this.$components[key].$afterMount();
      }
    }
    if (this.$hasRender) this.$hasRender();
  }

  setProps(newProps) {
    if (newProps && this.utils.isFunction(newProps)) {
      const _newProps = newProps();
      if (_newProps && _newProps instanceof Object) {
        for (let key in _newProps) {
          if (this.props.hasOwnProperty(key) && this.props[key] !== _newProps[key]) this.props[key] = _newProps[key];
        }
      }
    }
    if (newProps && newProps instanceof Object) {
      for (let key in newProps) {
        if (this.props.hasOwnProperty(key) && this.props[key] !== newProps[key]) {
          this.props[key] = newProps[key];
        }
      }
    }
  }
}

module.exports = Component;
