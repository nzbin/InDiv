class CompileUtil {
  _getVMVal(vm, exp) {
    const valueList = exp.replace('()', '').split('.');
    let value = vm;
    valueList.forEach(v => {
      if (v === 'this') return;
      value = value[v];
    });
    return value;
  }

  _setVMVal(vm, exp, value) {
    var val = vm;
    exp = exp.split('.');
    exp.forEach((k, i) => {
      if (i < exp.length - 1) {
        val = val[k];
      } else {
        val[k] = value;
      }
    });
  }

  text(node, vm, exp) {
    this.bind(node, vm, exp, 'text');
  }

  bind(node, vm, exp, dir) {
    const updaterFn = this[`${dir}Updater`];
    if (dir === 'model') {
      updaterFn && updaterFn(node, this._getVMVal(vm, exp), exp, vm);
    } else {
      updaterFn && updaterFn(node, this._getVMVal(vm, exp));
    }
  }

  textUpdater(node, value) {
    node.textContent = typeof value === 'undefined' ? '' : value;
  }

  htmlUpdater(node, value) {
    node.innerHTML = typeof value === 'undefined' ? '' : value;
  }

  classUpdater(node, value, oldValue) {
    let className = node.className;
    className = className.replace(oldValue, '').replace(/\s$/, '');
    const space = className && String(value) ? ' ' : '';
    node.className = className + space + value;
  }

  modelUpdater(node, value, exp, vm) {
    node.value = typeof value === 'undefined' ? '' : value;
    const val = exp.replace(/(this.state.)|(this.props)/, '');
    const fn = function () {
      if (/(this.state.).*/.test(exp)) vm.state[val] = node.value;
      if (/(this.props.).*/.test(exp)) vm.props[val] = node.value;
    };
    node.addEventListener('change', fn, false);
  }
}

class Compile {
  constructor(el, vm) {
    this.$vm = vm;
    this.$el = this.isElementNode(el) ? el : document.querySelector(el);
    if (this.$el) {
      this.$fragment = this.node2Fragment(this.$el);
      this.init();
      this.$el.appendChild(this.$fragment);
    }
  }

  init() {
    this.compileElement(this.$fragment);
  }

  compileElement(fragment) {
    const elementCreated = document.createElement('div');
    elementCreated.innerHTML = this.$vm.declareTemplate;
    let childNodes = elementCreated.childNodes;
    Array.from(childNodes).forEach(node => {
      const text = node.textContent;
      const reg = /\{\{(.*)\}\}/;
      if (this.isElementNode(node)) {
        this.compile(node);
        if (reg.test(text)) this.compileText(node, RegExp.$1);
      }
      fragment.appendChild(node);
    });
  }

  compile(node) {
    const nodeAttrs = node.attributes;
    Array.from(nodeAttrs).forEach(attr => {
      const attrName = attr.name;
      if (this.isDirective(attrName)) {
        const dir = attrName.substring(3);
        const exp = attr.value;
        if (this.isEventDirective(dir)) {
          this.eventHandler(node, this.$vm, exp, dir);
        } else {
          new CompileUtil().bind(node, this.$vm, exp, dir);
        }
        // node.removeAttribute(attrName);
      }
    });
  }

  node2Fragment(el) {
    const fragment = document.createDocumentFragment();
    let child;
    while (child === el.firstChild) {
      fragment.appendChild(child);
    }
    return fragment;
  }

  compileText(node, exp) {
    new CompileUtil().text(node, this.$vm, exp);
  }

  eventHandler(node, vm, exp, event) {
    const eventType = event.split(':')[1];
    const fnList = exp.replace('()', '').split('.');
    let fn = vm;
    fnList.forEach(f => {
      if (f === 'this') return;
      fn = fn[f];
    });
    if (eventType && fn) node.addEventListener(eventType, fn.bind(vm), false);
  }

  isDirective(attr) {
    return attr.indexOf('es-') === 0;
  }

  isEventDirective(event) {
    return event.indexOf('on') === 0;
  }

  isElementNode(node) {
    return node.nodeType === 1;
  }

  // isTextNode(node) {
  //   return node.nodeType == 3;
  // }
}
// export default Compile;
module.exports = Compile;
