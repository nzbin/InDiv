import { IPatchList } from '../types';

import { parseToVnode, diffVnode, renderVnode } from '../VirtualDOM';
import Utils from '../Utils';
import { CompileUtil } from '../CompileUtils';

const utils = new Utils();

/**
 * main compiler
 *
 * @class Compile
 */
class Compile {
  public utils: Utils;
  public $vm: any;
  public $el: Element;
  public $fragment: DocumentFragment;

  /**
   * Creates an instance of Compile.
   * @param {(string | Element)} el
   * @param {*} vm
   * @param {Element} [routerRenderDom]
   * @memberof Compile
   */
  constructor(el: string | Element, vm: any, routerRenderDom?: Element) {
    this.$vm = vm;
    this.$el = this.isElementNode(el) ? el as Element : document.querySelector(el as string);
    if (this.$el) {
      this.$fragment = this.node2Fragment();
      this.init();
      if (routerRenderDom) {
        // replace routeDom
        const newRouterRenderDom = this.$fragment.querySelectorAll(this.$vm.$vm.$routeDOMKey)[0];
        newRouterRenderDom.parentNode.replaceChild(routerRenderDom, newRouterRenderDom);
      }

      let oldVnode = parseToVnode(this.$el);
      let newVnode = parseToVnode(this.$fragment);
      let patchList: IPatchList[] = [];
      diffVnode(oldVnode, newVnode, patchList);
      renderVnode(patchList);

      this.$fragment = null;
      oldVnode = null;
      newVnode = null;
      patchList = null;
    }
  }

  /**
   * init compile
   *
   * @memberof Compile
   */
  public init(): void {
    this.compileElement(this.$fragment);
  }

  /**
   * compile element
   *
   * @param {DocumentFragment} fragment
   * @memberof Compile
   */
  public compileElement(fragment: DocumentFragment): void {
    const elementCreated = document.createElement('div');
    elementCreated.innerHTML = utils.formatInnerHTML(this.$vm.$template);
    const childNodes = elementCreated.childNodes;
    this.recursiveDOM(childNodes, fragment);
  }

  /**
   * recursive DOM for New State
   *
   * @param {(NodeListOf<Node & ChildNode>)} childNodes
   * @param {(DocumentFragment | Element)} fragment
   * @memberof Compile
   */
  public recursiveDOM(childNodes: NodeListOf<Node & ChildNode>, fragment: DocumentFragment | Element): void {
    Array.from(childNodes).forEach((node: Element) => {
      if (this.isElementNode(node) && this.$vm.$components.find((component: any) => component.$selector === node.tagName.toLocaleLowerCase())) node.isComponent = true;

      if (node.hasChildNodes() && !this.isRepeatNode(node)) this.recursiveDOM(node.childNodes, node);

      fragment.appendChild(node);

      const text = node.textContent;
      const reg = /\{\{(.*)\}\}/g;
      if (this.isElementNode(node)) this.compile(node, fragment);

      if (this.isTextNode(node) && reg.test(text)) {
        const textList = text.match(/(\{\{[^\{\}]+?\}\})/g);
        if (textList && textList.length > 0) {
          for (let i = 0; i < textList.length; i++) {
              this.compileText(node, textList[i]);
          }
        }
      }

      // after compile repeatNode, remove repeatNode
      if (this.isRepeatNode(node) && fragment.contains(node)) fragment.removeChild(node);
    });
  }

  /**
   * compile string to DOM
   *
   * @param {Element} node
   * @param {(DocumentFragment | Element)} fragment
   * @memberof Compile
   */
  public compile(node: Element, fragment: DocumentFragment | Element): void {
    const nodeAttrs = node.attributes;
    if (nodeAttrs) {
      Array.from(nodeAttrs).forEach(attr => {
        const attrName = attr.name;
        if (this.isDirective(attrName)) {
          const dir = attrName.substring(3);
          const exp = attr.value;
          const compileUtil = new CompileUtil(fragment);
          if (this.isEventDirective(dir)) {
            compileUtil.eventHandler(node, this.$vm, exp, dir);
            node.removeAttribute(attrName);
          } else {
            compileUtil.bind(node, this.$vm, exp, dir);
          }
        }
      });
    }
  }

  /**
   * create document fragment
   *
   * @returns {DocumentFragment}
   * @memberof Compile
   */
  public node2Fragment(): DocumentFragment {
    return document.createDocumentFragment();
  }

  /**
   * compile text and use CompileUtil templateUpdater
   *
   * @param {Element} node
   * @param {string} exp
   * @memberof Compile
   */
  public compileText(node: Element, exp: string): void {
    new CompileUtil(this.$fragment).templateUpdater(node, this.$vm, exp);
  }

  /**
   * judge attribute is nv directive or not
   *
   * @param {string} attr
   * @returns {boolean}
   * @memberof Compile
   */
  public isDirective(attr: string): boolean {
    return attr.indexOf('nv-') === 0;
  }

  /**
   * judge attribute is nv event directive or not
   *
   * @param {string} eventName
   * @returns {boolean}
   * @memberof Compile
   */
  public isEventDirective(eventName: string): boolean {
    return eventName.indexOf('on') === 0;
  }

  /**
   * judge DOM is a element node or not
   *
   * @param {(Element | string)} node
   * @returns {boolean}
   * @memberof Compile
   */
  public isElementNode(node: Element | string): boolean {
    if (typeof node === 'string') return false;
    return node.nodeType === 1;
  }

  /**
   * judge DOM is nv-repeat dom or not
   *
   * @param {Element} node
   * @returns {boolean}
   * @memberof Compile
   */
  public isRepeatNode(node: Element): boolean {
    const nodeAttrs = node.attributes;
    let result = false;
    if (nodeAttrs) {
      Array.from(nodeAttrs).forEach(attr => {
        const attrName = attr.name;
        if (attrName === 'nv-repeat') result = true;
      });
    }
    return result;
  }

  /**
   * judge DOM is text node or not
   *
   * @param {Element} node
   * @returns {boolean}
   * @memberof Compile
   */
  public isTextNode(node: Element): boolean {
    return node.nodeType === 3;
  }
}

export default Compile;
