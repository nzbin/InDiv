import { IVnode, TAttributes, IPatchList, IVirtualDOM  } from '../types';

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
    this.checked = false;
    this.key = info.key;
  }
}

// function isEqualNode(oldVnode, oldVnode) {

// }

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
    key: node.nodeType === 1 ? (node as Element).getAttribute('indiv_repeat_key') : null,
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
 * diff tagName for diff VNode
 * 
 * type: 0 replaceChild
 *
 * @param {IVnode} oldVnode
 * @param {IVnode} newVnode
 * @param {IPatchList[]} patchList
 */
function diffTagName(oldVnode: IVnode, newVnode: IVnode, patchList: IPatchList[]): void {
  if (oldVnode.tagName !== newVnode.tagName) {
    patchList.push({
      type: 0,
      newNode: newVnode.node,
      oldVnode: oldVnode.node,
      parentNode: oldVnode.parentNode,
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
  // if (newVnode.childNodes.length > 0) {
  //   (newVnode.childNodes as IVnode[]).forEach((nChild, index) => {
  //     if (!oldVnode.childNodes[index]) {
  //       patchList.push({
  //         type: 1,
  //         newNode: nChild.node,
  //         parentNode: oldVnode.node,
  //       });
  //     } else {
  //       diffVnode(oldVnode.childNodes[index], nChild, patchList);
  //     }
  //   });
  // }
  // if (oldVnode.childNodes.length > 0) {
  //   (oldVnode.childNodes as IVnode[]).forEach((oChild, index) => {
  //     if (!newVnode.childNodes[index]) {
  //       patchList.push({
  //         type: 2,
  //         node: oChild.node,
  //         parentNode: oldVnode.node,
  //       });
  //     }
  //   });
  // }

  // if (oldVnode.childNodes.length > 0) {
  //   (oldVnode.childNodes as IVnode[]).forEach((oChild, index) => {
  //     const sameNChild = (newVnode.childNodes as IVnode[]).find(nchild => nchild.node.isEqualNode(oChild.node));
  //     if (sameNChild) {
  //       const sameNewIndex = (newVnode.childNodes as IVnode[]).findIndex(nchild => nchild.node.isSameNode(sameNChild.node));
  //       if (sameNewIndex === index) {
  //         sameNChild.checked = true;
  //         return;
  //       }
  //       if (sameNewIndex !== index) {
  //         patchList.push({
  //           type: 0,
  //           newNode: oChild.node,
  //           insertNode: sameNewIndex === newVnode.childNodes.length - 1 ? null : newVnode.childNodes[sameNewIndex + 1].node,
  //           parentNode: oldVnode.node,
  //         });
  //         sameNChild.checked = true;
  //       }
  //     } 
  //     if (!sameNChild) {
  //       patchList.push({
  //         type: 2,
  //         node: oChild.node,
  //         parentNode: oldVnode.node,
  //       });
  //     }
  //   });
  // }

  if (newVnode.childNodes.length > 0) {
    (newVnode.childNodes as IVnode[]).forEach((nChild, index) => {
      if (nChild.checked || !nChild.key) return;
      if (nChild.key) {
      const sameOChild = (oldVnode.childNodes as IVnode[]).find(ochild => ochild.tagName === nChild.tagName && ochild.key === nChild.key);

      if (sameOChild) {
        const sameOldIndex = (oldVnode.childNodes as IVnode[]).findIndex(ochild => ochild.node.isSameNode(sameOChild.node));
        // console.log('11oChildoChildoChild', oChild, newVnode.childNodes[sameNewIndex + 1].node, index);
        if (sameOldIndex !== index) {
          patchList.push({
            type: 0,
            newNode:  sameOChild.node,
            oldVnode: oldVnode.childNodes[sameOldIndex].node,
            parentNode: oldVnode.parentNode,
          });
        }
        sameOChild.checked = true;
        nChild.checked = true;
        diffVnode(sameOChild, nChild, patchList);
      }

      if (!sameOChild) {
        if (!oldVnode.childNodes[index]) {
          patchList.push({
            type: 1,
            newNode: nChild.node,
            parentNode: oldVnode.node,
          });
        }
        if (!oldVnode.childNodes[index]) {
          patchList.push({
            type: 0,
            newNode:  nChild.node,
            oldVnode: oldVnode.childNodes[index].node,
            parentNode: oldVnode.parentNode,
          });
        }
        nChild.checked = true;
        }
      }
    });
  }

  // if (oldVnode.childNodes.length > 0) {
  //   (oldVnode.childNodes as IVnode[]).forEach((oChild, index) => {
  //     if (oChild.checked || !oChild.key) return;
  //     // if (oChild.key || oChild.key === 0 || oChild.key === '' || oChild.key === false) {
  //     // if (oChild.key) {
  //     const sameNChild = (newVnode.childNodes as IVnode[]).find(nchild => nchild.tagName === oChild.tagName && nchild.key === oChild.key);
  //     if (sameNChild) {
  //       const sameNewIndex = (newVnode.childNodes as IVnode[]).findIndex(nchild => nchild.node.isSameNode(sameNChild.node));
  //       console.log('11oChildoChildoChild', oChild, newVnode.childNodes[sameNewIndex + 1].node, index);
  //       if (sameNewIndex !== index) {
  //         // patchList.push({
  //         //   type: 2,
  //         //   node: oChild.node,
  //         //   parentNode: oldVnode.node,
  //         // });
  //         // patchList.push({
  //         //   type: 0,
  //         //   newNode: oChild.node,
  //         //   insertNode: sameNewIndex === newVnode.childNodes.length - 1 ? null : newVnode.childNodes[sameNewIndex + 1].node,
  //         //   parentNode: oldVnode.node,
  //         // });
  //         patchList.push({
  //           type: 0,
  //           newNode:  oChild.node,
  //           oldVnode: oldVnode.childNodes[sameNewIndex].node,
  //           parentNode: oldVnode.parentNode,
  //         });
  //       }
  //       sameNChild.checked = true;
  //       oChild.checked = true;
  //       diffVnode(oChild, sameNChild, patchList);
  //     } 
  //     if (!sameNChild) {
  //         patchList.push({
  //           type: 2,
  //           node: oChild.node,
  //           parentNode: oldVnode.node,
  //         });
  //         oChild.checked = true;
  //       // }
  //     }
  //   });
  //   (oldVnode.childNodes as IVnode[]).forEach((oChild, index) => {
  //     if (oChild.checked || oChild.key) return;
  //     // console.log(2999999888, oChild);
  //     if (!newVnode.childNodes[index] || newVnode.childNodes[index].checked) {
  //         patchList.push({
  //           type: 2,
  //           node: oChild.node,
  //           parentNode: oldVnode.node,
  //         });
  //         oChild.checked = true;
  //         return;
  //     }
  //     console.log('22oChildoChildoChild', oChild, newVnode.childNodes[index]);
  //     newVnode.childNodes[index].checked = true;
  //     oChild.checked = true;
  //     diffVnode(oChild, newVnode.childNodes[index], patchList);
  //   });
  // }

  // if (newVnode.childNodes.length > 0) {
  //   console.log(888888888877, newVnode);
  //   (newVnode.childNodes as IVnode[]).forEach((nChild, index) => {
  //     console.log(1111111111, newVnode);
  //     if (nChild.checked) return;
  //     console.log(333333333, nChild.node);
  //     // patchList.push({
  //     //   type: 1,
  //     //   newNode: nChild.node,
  //     //   parentNode: oldVnode.node,
  //     //   insertOldNode: oldVnode.childNodes[index + 1] ? null : oldVnode.childNodes[index + 1].node,
  //     //   insertNewNode: newVnode.childNodes[index + 1] ? null : newVnode.childNodes[index + 1].node,
  //     //   // insertNode: index === newVnode.childNodes.length - 1 ? null : newVnode.childNodes[index + 1].node,
  //     // });
  //     patchList.push({
  //       type: 1,
  //       newNode: nChild.node,
  //       parentNode: oldVnode.node,
  //     });
  //     console.log(22888888888877, newVnode);
  //     nChild.checked = true;
  //   });
  // }
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

  if (newVnode.node.isEqualNode(oldVnode.node) && oldVnode.tagName !== 'INPUT' && oldVnode.tagName !== 'TEXTAREA textarea' && oldVnode.tagName !== 'INPUT') return;

  if (oldVnode.tagName !== newVnode.tagName) {
    diffTagName(oldVnode, newVnode, patchList);
    return;
  }
  diffAttributes(oldVnode, newVnode, patchList);
  diffNodeValue(oldVnode, newVnode, patchList);
  // diffChildNodes(newVnode, oldVnode, patchList);
  if (oldVnode.tagName === 'INPUT' || oldVnode.tagName === 'TEXTAREA textarea' || oldVnode.tagName === 'INPUT') diffInputValue(newVnode, oldVnode, patchList);
  console.log(1888888888877, newVnode, oldVnode);
  diffChildNodes(newVnode, oldVnode, patchList);
}

/**
 * renderVnode 对比完render node
 * 
 * REMOVETAG: 0, 替换dom: 0
 * ADDTAG: 1, 增加dom: 1
 * REMOVETAG: 2, 移除dom: 2
 * ADDATTRIBUTES: 3, 增加属性: 3
 * REPLACEATTRIBUTES: 4, 移除属性: 4
 * TEXT: 5, 更改文字: 5
 * value: 6, 更改 input textarea select value 的值: 6
 * 
 * @param [] patchList
 */
function renderVnode(patchList: IPatchList[]): void {
  patchList.forEach(patch => {
    switch (patch.type) {
      // case 0:
      //   if (patch.insertNode) patch.parentNode.insertBefore(patch.newNode, patch.insertNode);
      //   if (!patch.insertNode) patch.parentNode.appendChild(patch.newNode);
      //   break;
      case 0:
        if (patch.parentNode.contains(patch.oldVnode))  patch.parentNode.replaceChild(patch.newNode, patch.oldVnode);
        // patch.parentNode.replaceChild(patch.newNode, patch.oldVnode);
        break;
      case 1:
        patch.parentNode.appendChild(patch.newNode);
        // if (patch.insertNode) patch.parentNode.insertBefore(patch.newNode, patch.insertNode);
        // if (!patch.insertNode) patch.parentNode.appendChild(patch.newNode);
        // if (!patch.insertOldNode && !patch.insertNewNode) patch.parentNode.appendChild(patch.newNode);
        // if (patch.insertOldNode) patch.parentNode.insertBefore(patch.newNode, patch.insertOldNode);
        // if (!patch.insertNewNode)patch.parentNode.insertBefore(patch.newNode, patch.insertNewNode);
        break;
      case 2:
        patch.parentNode.removeChild(patch.node);
        break;
      // case 0:
      //   patch.parentNode.replaceChild(patch.newNode, patch.oldVnode);
      //   break;
      // case 1:
      //   patch.parentNode.appendChild(patch.newNode);
      //   break;
      // case 2:
      //   patch.parentNode.removeChild(patch.node);
      //   break;
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
    }
  });
}

const VirtualDOM: IVirtualDOM = {
  parseToVnode,
  diffVnode,
  renderVnode,
};

export default VirtualDOM;
