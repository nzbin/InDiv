import Utils from '../Utils';
import { IVnode, TAttributes, IPatchList, IVirtualDOM  } from '../types';

const utils = new Utils();
/**
 * Vnode
 *
 * @class Vnode
 */
class Vnode {
  public tagName?: string;
  public node?: DocumentFragment | Element;
  public parentNode?: Node;
  public attributes?: TAttributes[];
  public nodeValue?: string | null;
  public childNodes?: IVnode[] | any[];
  public type?: string;
  public value?: string | number;
  public repeatData?: any;
  // public shouldRemove?: boolean;

  public checked?: boolean;
  public key?: any;

  /**
   * Creates an instance of Vnode.
   * @param {IVnode} info
   * @memberof Vnode
   */
  constructor(info: IVnode) {
    this.tagName = info.tagName;
    this.node = info.node;
    this.parentNode = info.parentNode;
    this.attributes = info.attributes;
    this.childNodes = info.childNodes;
    this.nodeValue = info.nodeValue;
    this.type = info.type;
    this.value = info.value;
    this.repeatData = info.repeatData;
    this.key = info.key;
    this.checked = false;
  }
}

/**
 * bind nodeType and return type
 *
 * @param {Node} node
 * @returns {string}
 */
function bindNodeType(node: Node): string {
  if (node.nodeType === 1) return 'element';
  if (node.nodeType === 3) return 'text';
  if (node.nodeType === 11) return 'document-fragment';
  return '';
}

/**
 * bind node attributes and return TAttributes
 *
 * @param {(DocumentFragment | Element)} node
 * @returns {TAttributes[]}
 */
function bindAttributes(node: DocumentFragment | Element): TAttributes[] {
  const nodeAttrs: NamedNodeMap = (node as Element).attributes;
  const attributes: TAttributes[] = [];
  if (nodeAttrs) {
    Array.from(nodeAttrs).forEach(attr => {
      attributes.push({
        name: attr.name,
        value: attr.value,
      });
    });
  }
  return attributes;
}

/**
 * parse node to VNode
 *
 * @param {(DocumentFragment | Element)} node
 * @returns {IVnode}
 */
function parseToVnode(node: DocumentFragment | Element): IVnode {
  const childNodes: IVnode[] = [];
  if (node.childNodes) {
    Array.from(node.childNodes).forEach((child: Element) => {
      childNodes.push(parseToVnode(child));
    });
  }
  return new Vnode({
    tagName: (node as Element).tagName,
    node: node,
    parentNode: node.parentNode,
    attributes: bindAttributes(node),
    childNodes,
    nodeValue: node.nodeValue,
    type: bindNodeType(node),
    value: (node as Element).value,
    repeatData: node.repeatData ? node.repeatData : null,
    key: node.indiv_repeat_key ? node.indiv_repeat_key : null,
  });
}

/**
 * diff attributes for diff VNode
 * 
 * type: 3 setAttribute
 * type: 4 removeAttribute
 *
 * @param {IVnode} oldVnode
 * @param {IVnode} newVnode
 * @param {IPatchList[]} patchList
 */
function diffAttributes(oldVnode: IVnode, newVnode: IVnode, patchList: IPatchList[]): void {
  newVnode.attributes.forEach((attr) => {
    const oldVnodeAttr = oldVnode.attributes.find(at => at.name === attr.name);
    if (!oldVnodeAttr || oldVnodeAttr.value !== attr.value) {
      patchList.push({
        type: 3,
        node: oldVnode.node,
        newValue: attr,
        oldValue: oldVnodeAttr,
      });
    }
  });
  oldVnode.attributes.forEach((attr) => {
    const newVnodeAttr = newVnode.attributes.find(at => at.name === attr.name);
    if (!newVnodeAttr) {
      patchList.push({
        type: 4,
        node: oldVnode.node,
        oldValue: attr,
      });
    }
  });
}

/**
 * diff nodeValue for diff VNode
 * 
 * type:5 change text for node
 *
 * @param {IVnode} oldVnode
 * @param {IVnode} newVnode
 * @param {IPatchList[]} patchList
 * @returns {void}
 */
function diffNodeValue(oldVnode: IVnode, newVnode: IVnode, patchList: IPatchList[]): void {
  if (oldVnode.nodeValue !== newVnode.nodeValue) {
    patchList.push({
      type: 5,
      node: oldVnode.node,
      newValue: newVnode.nodeValue,
      oldValue: oldVnode.nodeValue,
    });
  }
}

/**
 * diff childNodes for diff VNode
 * 
 * type: 1 appendChild
 * type: 2 removeChild
 *
 * @param {IVnode} newVnode
 * @param {IVnode} oldVnode
 * @param {IPatchList[]} patchList
 */
function diffChildNodes(newVnode: IVnode, oldVnode: IVnode, patchList: IPatchList[]): void {
  if (oldVnode.childNodes.length > 0) {
    (oldVnode.childNodes as IVnode[]).forEach((oChild, index) => {
      if (oChild.checked) return;
      const sameCode = newVnode.childNodes.find(nChild => nChild.tagName === oChild.tagName && nChild.key === oChild.key && !nChild.checked);
      if (sameCode) {
        const sameCodeIndex = newVnode.childNodes.findIndex(nChild => nChild === sameCode);
        if (sameCodeIndex !== index) {
          patchList.push({
            type: 2,
            newIndex: sameCodeIndex,
            oldVnode: oChild.node,
            parentNode: oldVnode.node,
          });
        }
        diffVnode(oChild, sameCode, patchList);
        sameCode.checked = true;
      } else {
        patchList.push({
          type: 0,
          node: oChild.node,
          parentNode: oldVnode.node,
        });
      }
      oChild.checked = true;
    });
  }

  if (newVnode.childNodes.length > 0) {
    (newVnode.childNodes as IVnode[]).forEach((nChild, index) => {
      if (nChild.checked) return;
      patchList.push({
        type: 2,
        newIndex: index,
        oldVnode: nChild.node,
        parentNode: oldVnode.node,
      });
      nChild.checked = true;
    });
  }
}

/**
 * diff value of input, textarea, select for diff VNode
 * 
 * type: 6 change value of from input
 *
 * @param {IVnode} newVnode
 * @param {IVnode} oldVnode
 * @param {IPatchList[]} patchList
 * @returns {void}
 */
function diffInputValue(newVnode: IVnode, oldVnode: IVnode, patchList: IPatchList[]): void {
  if (oldVnode.value !== newVnode.value) {
    patchList.push({
      type: 6,
      node: oldVnode.node,
      newValue: newVnode.value,
      oldValue: oldVnode.value,
    });
  }
}

/**
 * diff repeatData of repeat node
 * 
 * type: 7 change repeatData of from node
 *
 * @param {IVnode} newVnode
 * @param {IVnode} oldVnode
 * @param {IPatchList[]} patchList
 * @returns {void}
 */
function diffRepeatData(newVnode: IVnode, oldVnode: IVnode, patchList: IPatchList[]): void {
  if (utils.isEqual(oldVnode.repeatData, newVnode.repeatData)) {
    patchList.push({
      type: 7,
      node: oldVnode.node,
      newValue: newVnode.repeatData,
    });
  }
}

/**
 * diff two Vnode
 *
 * @param {IVnode} oldVnode
 * @param {IVnode} newVnode
 * @param {IPatchList[]} patchList
 * @returns {void}
 */
function diffVnode(oldVnode: IVnode, newVnode: IVnode, patchList: IPatchList[]): void {
  if (!patchList) {
    console.error('patchList can not be null, diffVnode must need an Array');
    return;
  }

  if (newVnode.type === 'document-fragment') {
    diffChildNodes(newVnode, oldVnode, patchList);
    return;
  }

  diffAttributes(oldVnode, newVnode, patchList);
  diffNodeValue(oldVnode, newVnode, patchList);
  if (oldVnode.tagName === 'INPUT' || oldVnode.tagName === 'TEXTAREA textarea' || oldVnode.tagName === 'INPUT') diffInputValue(newVnode, oldVnode, patchList);
  diffRepeatData(newVnode, oldVnode, patchList);
  diffChildNodes(newVnode, oldVnode, patchList);
}

/**
 * renderVnode 对比完render node
 * 
 * REMOVETAG: 0, 移除dom: 0
 * ADDTAG: 1, 增加dom: 1
 * REMOVETAG: 2, 移动位置: 2
 * ADDATTRIBUTES: 3, 增加属性: 3
 * REPLACEATTRIBUTES: 4, 移除属性: 4
 * TEXT: 5, 更改文字: 5
 * value: 6, 更改 input textarea select value 的值: 6
 * value: 7, 更改 node 的 repeatData: 7, render过来的的被复制的值
 * value: 8, 更改 node 的 show: 8, nv-if 更改的值
 * 
 * @param [] patchList
 */
function renderVnode(patchList: IPatchList[]): void {
  patchList.sort((a, b) => {
    if (a.type === b.type && a.newIndex && b.newIndex) return  a.newIndex - b.newIndex;
    return a.type - b.type;
  });
  patchList.forEach(patch => {
    switch (patch.type) {
      case 0:
        patch.parentNode.removeChild(patch.node);
        break;
      case 1:
        patch.parentNode.appendChild(patch.newNode);
        break;
      case 2:
        if (!(Array.from((patch.parentNode as Element).children).indexOf(patch.oldVnode as Element) === patch.newIndex)) {
          if (patch.parentNode.contains(patch.oldVnode)) patch.parentNode.removeChild(patch.oldVnode);
          if (patch.parentNode.childNodes[patch.newIndex]) {
            patch.parentNode.insertBefore(patch.oldVnode, patch.parentNode.childNodes[patch.newIndex]);
          } else {
            patch.parentNode.appendChild(patch.oldVnode);
          }
        }
        break;
      case 3:
        (patch.node as Element).setAttribute((patch.newValue as TAttributes).name, (patch.newValue as TAttributes).value);
        break;
      case 4:
        (patch.node as Element).removeAttribute((patch.oldValue as TAttributes).name);
        break;
      case 5:
        patch.node.nodeValue = (patch.newValue as string);
        break;
      case 6:
        (patch.node as Element).value = patch.newValue;
        break;
      case 7:
        patch.node.repeatData = patch.newValue as any;
        break;
    }
  });
}

const VirtualDOM: IVirtualDOM = {
  parseToVnode,
  diffVnode,
  renderVnode,
};

export default VirtualDOM;
