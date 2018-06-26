const Lifecycle = require('./Lifecycle');
const Compile = require('./Compile');
const Watcher = require('./Watcher');

class Component extends Lifecycle {
  constructor(props) {
    super();
    if (props) this.props = props;
    this.state = {};
    this.$renderDom = null;
  }

  $beforeInit() {
    if (this.props) this.propsWatcher = new Watcher(this.props, this.$watchState.bind(this), this.$reRender.bind(this));
    this.stateWatcher = new Watcher(this.state, this.$watchState.bind(this), this.$reRender.bind(this));
  }

  $render() {
    const dom = this.$renderDom;
    this.compile = new Compile(dom, this);
    this.$mountComponent(dom, true);
    this.$componentList.forEach(component => {
      if (component.scope.$render) component.scope.$render();
      if (component.scope.$afterMount) component.scope.$afterMount();
    });
    if (this.$hasRender) this.$hasRender();
    this.compile = null;
  }

  $reRender() {
    const dom = this.$renderDom;
    this.compile = new Compile(dom, this);
    this.$mountComponent(dom, false);
    this.$componentList.forEach(component => {
      if (component.scope.$render) component.scope.$reRender();
      if (component.scope.$afterMount) component.scope.$afterMount();
    });
    if (this.$hasRender) this.$hasRender();
    this.compile = null;
  }

  $setProps(newProps) {
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
