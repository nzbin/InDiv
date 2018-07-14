import VirtualDOM from './VirtualDOM';
import Utils from './Utils';
import { CompileUtil } from './CompileUtils';

class Compile {
  // removeDOM
  constructor(el, vm, routerRenderDom) {
    this.utils = new Utils();
    this.$vm = vm;
    this.$el = this.isElementNode(el) ? el : document.querySelector(el);
    if (this.$el) {
      this.$fragment = this.node2Fragment(this.$el);
      this.init();
      if (routerRenderDom) {
        // replace routeDom
        const newRouterRenderDom = this.$fragment.querySelectorAll(this.$vm.$vm.$routeDOMKey)[0];
        newRouterRenderDom.parentNode.replaceChild(routerRenderDom, newRouterRenderDom);
      }
      let oldVnode = VirtualDOM.parseToVnode(this.$el);
      let newVnode = VirtualDOM.parseToVnode(this.$fragment);
      let patchList = [];
      VirtualDOM.diffVnode(oldVnode, newVnode, patchList);
      VirtualDOM.renderVnode(patchList);

      this.utils = null;
      this.$fragment = null;
      oldVnode = null;
      newVnode = null;
      patchList = null;
    }
  }

  init() {
    this.compileElement(this.$fragment);
  }

  compileElement(fragment) {
    const elementCreated = document.createElement('div');
    elementCreated.innerHTML = this.utils.formatInnerHTML(this.$vm.$template);
    let childNodes = elementCreated.childNodes;
    this.recursiveDOM(childNodes, fragment);
  }

  recursiveDOM(childNodes, fragment) {
    Array.from(childNodes).forEach(node => {
      if (node.hasChildNodes() && !this.isRepeatNode(node)) {
        this.recursiveDOM(node.childNodes, node);
      }

      const text = node.textContent;
      const reg = /\{\{(.*)\}\}/g;
      if (this.isElementNode(node)) {
        if (reg.test(text)) {
          const regText = RegExp.$1;
          if (/(.*\{\{(this.).*\}\}.*)/g.test(text)) this.compileText(node, regText);
        }
        this.compile(node, fragment);
      }
      if (this.isRepeatNode(node) && fragment.contains(node)) {
        fragment.removeChild(node);
      } else {
        if (!this.isIfNode(node)) fragment.appendChild(node);
      }
    });
  }

  compile(node, fragment) {
    const nodeAttrs = node.attributes;
    if (nodeAttrs) {
      Array.from(nodeAttrs).forEach(attr => {
        const attrName = attr.name;
        if (this.isDirective(attrName)) {
          const dir = attrName.substring(3);
          const exp = attr.value;
          if (this.isEventDirective(dir)) {
            this.eventHandler(node, this.$vm, exp, dir);
          } else {
            new CompileUtil(fragment).bind(node, this.$vm, exp, dir);
          }
        }
      });
    }
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
    new CompileUtil(this.$fragment).templateUpdater(node, this.$vm, exp);
  }

  eventHandler(node, vm, exp, event) {
    let compileUtil = new CompileUtil();
    const eventType = event.split(':')[1];
    const fnList = exp.replace(/\(.*\)/, '').split('.');
    const args = exp.match(/\((.*)\)/)[1].replace(/\s+/g, '').split(',');
    let fn = vm;
    fnList.forEach(f => {
      if (f === 'this') return;
      fn = fn[f];
    });
    const func = (event) => {
      let argsList = [];
      args.forEach(arg => {
        if (arg === '') return false;
        if (arg === '$event') argsList.push(event);
        if (/(this.).*/g.test(arg) || /(this.state.).*/g.test(arg) || /(this.props.).*/g.test(arg)) argsList.push(compileUtil._getVMVal(vm, arg));
        if (/\'.*\'/g.test(arg)) argsList.push(arg.match(/\'(.*)\'/)[1]);
        if (!/\'.*\'/g.test(arg) && /^[0-9]*$/g.test(arg)) argsList.push(Number(arg));
        if (arg === 'true' || arg === 'false') argsList.push(arg === 'true');
      });
      fn.apply(vm, argsList);
    };
    if (eventType && fn) node.addEventListener(eventType, func, false);
    compileUtil = null;
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

  isRepeatNode(node) {
    const nodeAttrs = node.attributes;
    let result = false;
    if (nodeAttrs) {
      Array.from(nodeAttrs).forEach(attr => {
        const attrName = attr.name;
        if (attrName === 'es-repeat') result = true;
      });
    }
    return result;
  }

  isIfNode(node) {
    const nodeAttrs = node.attributes;
    let result = false;
    if (nodeAttrs) {
      Array.from(nodeAttrs).forEach(attr => {
        const attrName = attr.name;
        if (attrName === 'es-if') result = true;
      });
    }
    return result;
  }

  isTextNode(node) {
    return node.nodeType === 3;
  }
}

export default Compile;
