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

  // $declare() {
  //   this.$template = '';
  //   this.$components = {};
  // }

  $beforeInit() {
    if (this.$declare) this.$declare();
    if (this.props) this.propsWatcher = new Watcher(this.props, this.$watchState.bind(this), this.$reRender.bind(this));
    this.stateWatcher = new Watcher(this.state, this.$watchState.bind(this), this.$reRender.bind(this));
  }

  $render() {
    const dom = document.getElementById(`component_${this.$templateName}`);
    if (dom && dom.hasChildNodes()) {
      let childs = dom.childNodes;
      for (let i = childs.length - 1; i >= 0; i--) {
        dom.removeChild(childs.item(i));
      }
    }
    this.compile = new Compile(`#component_${this.$templateName}`, this);
    if (this.$hasRender) this.$hasRender();
  }

  $reRender() {
    const dom = document.getElementById(`component_${this.$templateName}`);
    if (dom && dom.hasChildNodes()) {
      let childs = dom.childNodes;
      for (let i = childs.length - 1; i >= 0; i--) {
        dom.removeChild(childs.item(i));
      }
    }
    if (this.$onDestory) this.$onDestory();
    this.compile = new Compile(`#component_${this.$templateName}`, this);
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
