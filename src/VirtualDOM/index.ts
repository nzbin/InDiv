import Utils from '../Utils';
import { IVnode, TAttributes, IPatchList, IVirtualDOM } from '../types';

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
  public eventTypes?: string;
  public key?: any;
  public checked?: boolean;

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
    this.eventTypes = info.eventTypes;
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
    eventTypes: node.eventTypes ? node.eventTypes : null,
    key: node.indiv_repeat_key ? node.indiv_repeat_key : null,
  });
}

/**
 * diff attributes for diff VNode
 * 
 * type: 2 setAttribute
 * type: 3 removeAttribute
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
        type: 2,
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
        type: 3,
        node: oldVnode.node,
        oldValue: attr,
      });
    }
  });
}

/**
 * diff nodeValue for diff VNode
 * 
 * type: 4 change text for node
 *
 * @param {IVnode} oldVnode
 * @param {IVnode} newVnode
 * @param {IPatchList[]} patchList
 * @returns {void}
 */
function diffNodeValue(oldVnode: IVnode, newVnode: IVnode, patchList: IPatchList[]): void {
  if (oldVnode.nodeValue !== newVnode.nodeValue) {
    patchList.push({
      type: 4,
      node: oldVnode.node,
      newValue: newVnode.nodeValue,
      oldValue: oldVnode.nodeValue,
    });
  }
}

/**
 * diff childNodes for diff VNode
 * 
 * type: 0 removeChild
 * type: 1 change Child index
 *
 * @param {IVnode} newVnode
 * @param {IVnode} oldVnode
 * @param {IPatchList[]} patchList
 */
function diffChildNodes(oldVnode: IVnode, newVnode: IVnode, patchList: IPatchList[]): void {
  if (oldVnode.childNodes.length > 0) {
    (oldVnode.childNodes as IVnode[]).forEach((oChild, index) => {
      if (oChild.checked) return;
      const sameCode = newVnode.childNodes.find(nChild => nChild.tagName === oChild.tagName && nChild.key === oChild.key && !nChild.checked);
      if (sameCode) {
        const sameCodeIndex = newVnode.childNodes.findIndex(nChild => nChild === sameCode);
        if (sameCodeIndex !== index) {
          patchList.push({
            type: 1,
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
        type: 1,
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
 * type: 5 change value of from input
 *
 * @param {IVnode} newVnode
 * @param {IVnode} oldVnode
 * @param {IPatchList[]} patchList
 * @returns {void}
 */
function diffInputValue(oldVnode: IVnode, newVnode: IVnode, patchList: IPatchList[]): void {
  if (oldVnode.value !== newVnode.value) {
    patchList.push({
      type: 5,
      node: oldVnode.node,
      newValue: newVnode.value,
      oldValue: oldVnode.value,
    });
  }
}

/**
 * diff repeatData of repeat node
 * 
 * type: 6 change repeatData of from node
 *
 * @param {IVnode} newVnode
 * @param {IVnode} oldVnode
 * @param {IPatchList[]} patchList
 * @returns {void}
 */
function diffRepeatData(oldVnode: IVnode, newVnode: IVnode, patchList: IPatchList[]): void {
  if (!utils.isEqual(oldVnode.repeatData, newVnode.repeatData)) {
    patchList.push({
      type: 6,
      node: oldVnode.node,
      newValue: newVnode.repeatData,
    });
  }
}

/**
 * diff event of node
 *
 * type: 7 change event of from node
 * 
 * @param {IVnode} oldVnode
 * @param {IVnode} newVnode
 * @param {IPatchList[]} patchList
 */
function diffEventTypes(oldVnode: IVnode, newVnode: IVnode, patchList: IPatchList[]): void {
  const oEventTypes: string[] = JSON.parse(oldVnode.eventTypes);
  const nEventTypes: string[] = JSON.parse(newVnode.eventTypes);

  if (!utils.isEqual(oEventTypes, nEventTypes)) {
    // 全部更新为新的事件
    if (nEventTypes && nEventTypes.length > 0) {
      nEventTypes.forEach(neventType => {
        patchList.push({
          type: 7,
          node: oldVnode.node,
          eventType: neventType,
          newValue: (newVnode.node as any)[`event${neventType}`],
        });
      });
    }

    if (oEventTypes && oEventTypes.length > 0) {
      // 如果新事件不存在，则删除事件
      // 如果新事件找不到旧事件中的事件，则把旧事件的事件删除
      oEventTypes.forEach(oeventType => {
        if (!nEventTypes || nEventTypes.length <= 0) {
          patchList.push({
            type: 7,
            node: oldVnode.node,
            eventType: oeventType,
            newValue: null,
          });
        }
        if (nEventTypes && nEventTypes.length > 0 && !nEventTypes.find(neventType => neventType === oeventType)) {
          patchList.push({
            type: 7,
            node: oldVnode.node,
            eventType: oeventType,
            newValue: null,
          });
        }
      });
    }
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
    diffChildNodes(oldVnode, newVnode, patchList);
    return;
  }

  diffAttributes(oldVnode, newVnode, patchList);
  diffNodeValue(oldVnode, newVnode, patchList);
  if (oldVnode.tagName === 'INPUT' || oldVnode.tagName === 'TEXTAREA textarea' || oldVnode.tagName === 'INPUT') diffInputValue(oldVnode, newVnode, patchList);
  diffRepeatData(oldVnode, newVnode, patchList);
  diffEventTypes(oldVnode, newVnode, patchList);
  diffChildNodes(oldVnode, newVnode, patchList);
}

/**
 * renderVnode 对比完render node
 * 
 * REMOVETAG: 0, 移除dom: 0
 * REMOVETAG: 1, 移动位置: 1
 * ADDATTRIBUTES: 2, 增加属性: 2
 * REPLACEATTRIBUTES: 3, 移除属性: 3
 * TEXT: 4, 更改文字: 4
 * value: 5, 更改 input textarea select value 的值: 5
 * value: 6, 更改 node 的 repeatData: 6, render过来的的被复制的值
 * value: 7, 更改 node 的 event: 7, 修改事件
 * 
 * @param [] patchList
 */
function renderVnode(patchList: IPatchList[]): void {
  patchList.sort((a, b) => {
    if (a.type === b.type && a.newIndex && b.newIndex) return a.newIndex - b.newIndex;
    return a.type - b.type;
  });
  patchList.forEach(patch => {
    switch (patch.type) {
      case 0:
        patch.parentNode.removeChild(patch.node);
        break;
      case 1:
        if (!(Array.from((patch.parentNode as Element).children).indexOf(patch.oldVnode as Element) === patch.newIndex)) {
          if (patch.parentNode.contains(patch.oldVnode)) patch.parentNode.removeChild(patch.oldVnode);
          if (patch.parentNode.childNodes[patch.newIndex]) {
            patch.parentNode.insertBefore(patch.oldVnode, patch.parentNode.childNodes[patch.newIndex]);
          } else {
            patch.parentNode.appendChild(patch.oldVnode);
          }
        }
        break;
      case 2:
        (patch.node as Element).setAttribute((patch.newValue as TAttributes).name, (patch.newValue as TAttributes).value);
        break;
      case 3:
        (patch.node as Element).removeAttribute((patch.oldValue as TAttributes).name);
        break;
      case 4:
        patch.node.nodeValue = (patch.newValue as string);
        break;
      case 5:
        (patch.node as Element).value = patch.newValue;
        break;
      case 6:
        patch.node.repeatData = patch.newValue as any;
        break;
      case 7:
        (patch.node as any)[`on${patch.eventType}`] = patch.newValue as any;
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
