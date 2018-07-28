import { IPatchList } from '../types';
import VirtualDOM from '../VirtualDOM';
import Utils from '../Utils';
import { CompileUtil } from '../CompileUtils';

class Compile {
  public utils: Utils;
  public $vm: any;
  public $el: Element;
  public $fragment: DocumentFragment;

  // removeDOM
  constructor(el: string | Element, vm: any, routerRenderDom?: Element) {
    this.utils = new Utils();
    this.$vm = vm;
    this.$el = this.isElementNode(el) ? el as Element : document.querySelector(el as string);
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
      let patchList: IPatchList[] = [];
      VirtualDOM.diffVnode(oldVnode, newVnode, patchList);
      VirtualDOM.renderVnode(patchList);

      this.utils = null;
      this.$fragment = null;
      oldVnode = null;
      newVnode = null;
      patchList = null;
    }
  }

  public init(): void {
    this.compileElement(this.$fragment);
  }

  public compileElement(fragment: DocumentFragment): void {
    const elementCreated = document.createElement('div');
    elementCreated.innerHTML = this.utils.formatInnerHTML(this.$vm.$template);
    const childNodes = elementCreated.childNodes;
    this.recursiveDOM(childNodes, fragment);
  }

  public recursiveDOM(childNodes: NodeListOf<Node & ChildNode>, fragment: DocumentFragment | Element): void {
    Array.from(childNodes).forEach((node: Element) => {
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

  public compile(node: Element, fragment: DocumentFragment | Element): void {
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

  public node2Fragment(el: Element): DocumentFragment {
    return document.createDocumentFragment();
  }

  public compileText(node: Element, exp: string): void {
    new CompileUtil(this.$fragment).templateUpdater(node, this.$vm, exp);
  }

  public eventHandler(node: Element, vm: any, exp: string, eventName: string): void {
    let compileUtil = new CompileUtil();
    const eventType = eventName.split(':')[1];
    const fnList = exp.replace(/\(.*\)/, '').split('.');
    const args = exp.match(/\((.*)\)/)[1].replace(/\s+/g, '').split(',');
    let fn = vm;
    fnList.forEach(f => {
      if (f === 'this') return;
      fn = fn[f];
    });
    const func = (event: Event) => {
      const argsList: any[] = [];
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

  public isDirective(attr: string): boolean {
    return attr.indexOf('es-') === 0;
  }

  public isEventDirective(eventName: string): boolean {
    return eventName.indexOf('on') === 0;
  }

  public isElementNode(node: Element | string): boolean {
    if (typeof node === 'string') return false;
    return node.nodeType === 1;
  }

  public isRepeatNode(node: Element): boolean {
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

  public isIfNode(node: Element): boolean {
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

  public isTextNode(node: Element): boolean {
    return node.nodeType === 3;
  }
}

export default Compile;
