import { parseTemplateToVnode, Vnode, ParseOptions, IPatchList, diffVnode, patchVnode } from '../vnode';
import { CompileUtil } from './compile-utils';
import { IComponent } from '../types';

/**
 * main compiler
 *
 * @class Compile
 */
export class Compile {
  public componentInstance: IComponent;
  public mountedElement: any;
  public fragment: Vnode[];
  public saveVnode: Vnode[];
  public initVnode: Vnode[];
  public parseVnodeOptions: ParseOptions;

  /**
   * Creates an instance of Compile.
   * @param {any} el
   * @param {*} componentInstance
   * @memberof Compile
   */
  constructor(el: any, componentInstance: IComponent) {
    this.componentInstance = componentInstance;
    this.initVnode = parseTemplateToVnode(componentInstance.template);
    this.mountedElement = el;
    this.parseVnodeOptions = {
      components: [],
      directives: [],
    };
    this.componentInstance.declarationMap.forEach((value, key) => {
      if (this.parseVnodeOptions.components.indexOf(key) === -1 && (value as any).nvType === 'nvComponent') this.parseVnodeOptions.components.push(key);
      if (this.parseVnodeOptions.directives.indexOf(key) === -1 && (value as any).nvType === 'nvDirective') this.parseVnodeOptions.directives.push(key);
    });
  }

  /**
   * start compile and change saveVnode
   * 
   * will return the newest vnode[]
   *
   * @returns {Vnode[]}
   * @memberof Compile
   */
  public startCompile(): Vnode[] {
    if (!this.mountedElement) throw new Error('class Compile need el in constructor');
    this.fragment = parseTemplateToVnode('');

    if (!this.saveVnode) this.saveVnode = this.componentInstance.$indivInstance.getRenderer.nativeElementToVnode(this.mountedElement, this.parseVnodeOptions);
    const templateVnode = parseTemplateToVnode(this.componentInstance.template, this.parseVnodeOptions);
    this.compileVnode(templateVnode);
    const patchList: IPatchList[] = [];
    this.fragment.forEach(child => child.parentVnode = { nativeElement: this.mountedElement });
    diffVnode({ childNodes: this.saveVnode, nativeElement: this.mountedElement, parentVnode: null }, { childNodes: this.fragment, nativeElement: this.mountedElement, parentVnode: null }, patchList);
    patchVnode(patchList, this.componentInstance.$indivInstance.getRenderer);
    console.log(33333333, this.saveVnode, this.fragment, patchList);
    return this.saveVnode;
  }

  /**
   * compile vnode
   *
   * @memberof Compile
   */
  public compileVnode(vnodes: Vnode[]): void {
    this.recursiveDOM(vnodes, this.fragment, null);
  }

  /**
   * recursive DOM for New State
   *
   * @param {Vnode[]} vnodes
   * @param {Vnode[]} fragment
   * @param {Vnode} parent
   * @memberof Compile
   */
  public recursiveDOM(vnodes: Vnode[], fragment: Vnode[], parent: Vnode): void {
    vnodes.forEach((vnode: Vnode) => {

      const _fragmentChild = new Vnode(vnode);
      // 因为当不上循环node时候将不会递归创建新vnode了
      if (!this.isRepeatNode(_fragmentChild)) _fragmentChild.childNodes = [];
      if (parent) {
        _fragmentChild.parentVnode = parent;
        vnode.parentVnode = parent;
      }
      fragment.push(_fragmentChild);

      // 要用新的编译
      if (vnode.childNodes && vnode.childNodes.length > 0 && !this.isRepeatNode(vnode)) this.recursiveDOM(vnode.childNodes, _fragmentChild.childNodes, _fragmentChild);

      const text = _fragmentChild.template;
      const reg = /\{\{(.*)\}\}/g;
      if (this.isElementNode(_fragmentChild)) this.compile(_fragmentChild, fragment);

      if (this.isTextNode(_fragmentChild) && reg.test(text)) {
        const textList = text.match(/(\{\{[^\{\}]+?\}\})/g);
        const length = textList.length;
        if (textList && length > 0) {
          for (let i = 0; i < length; i++) this.compileText(_fragmentChild, textList[i]);
        }
      }

      // after compile repeatNode, remove repeatNode
      if (this.isRepeatNode(_fragmentChild) && fragment.indexOf(_fragmentChild) !== -1) fragment.splice(fragment.indexOf(_fragmentChild), 1);
    });
  }

  /**
   * compile string to DOM
   *
   * @param {Element} vnode
   * @param {Vnode[]} fragment
   * @memberof Compile
   */
  public compile(vnode: Vnode, fragment: Vnode[]): void {
    const nodeAttrs = vnode.attributes;
    if (nodeAttrs) {
      nodeAttrs.forEach(attr => {
        const attrName = attr.name;
        const compileUtil = new CompileUtil(fragment);
        if (this.isDirective(attr.type)) {
          const dir = attrName.substring(3);
          const exp = attr.value;
          compileUtil.bind(vnode, this.componentInstance, exp, dir);
        }
        if (this.isEventDirective(attr.type)) {
          const dir = attrName.substring(3);
          const exp = attr.value;
          compileUtil.eventHandler(vnode, this.componentInstance, exp, dir);
        }
        if (this.isPropOrNvDirective(attr.type) && !this.isRepeatNode(vnode)) compileUtil.propHandler(vnode, this.componentInstance, attr);
      });
    }
  }

  /**
   * compile text and use CompileUtil templateUpdater
   *
   * @param {Vnode} vnode
   * @param {string} exp
   * @memberof Compile
   */
  public compileText(vnode: Vnode, exp: string): void {
    new CompileUtil().templateUpdater(vnode, this.componentInstance, exp);
  }

  /**
   * judge attribute is nv directive or not
   *
   * @param {string} type
   * @returns {boolean}
   * @memberof Compile
   */
  public isDirective(type: string): boolean {
    return type === 'nv-attribute';
  }

  /**
   * judge attribute is nv directive or not
   *
   * @param {string} type
   * @returns {boolean}
   * @memberof Compile
   */
  public isPropOrNvDirective(type: string): boolean {
    return type === 'directive' || type === 'prop';
  }

  /**
   * judge attribute is nv event directive or not
   *
   * @param {string} type
   * @returns {boolean}
   * @memberof Compile
   */
  public isEventDirective(type: string): boolean {
    return type === 'nv-event';
  }

  /**
   * judge DOM is a element node or not
   *
   * @param {Vnode} vnode
   * @returns {boolean}
   * @memberof Compile
   */
  public isElementNode(vnode: Vnode): boolean {
    return vnode.type === 'tag' || vnode.type === 'component';
  }

  /**
   * judge DOM is nv-repeat dom or not
   *
   * @param {Vnode} vnode
   * @returns {boolean}
   * @memberof Compile
   */
  public isRepeatNode(vnode: Vnode): boolean {
    const nodeAttrs = vnode.attributes;
    let result = false;
    if (nodeAttrs) {
      nodeAttrs.forEach(attr => {
        if (attr.name === 'nv-repeat') result = true;
      });
    }
    return result;
  }

  /**
   * judge DOM is text node or not
   *
   * @param {Vnode} vnode
   * @returns {boolean}
   * @memberof Compile
   */
  public isTextNode(vnode: Vnode): boolean {
    return vnode.type === 'text';
  }
}
