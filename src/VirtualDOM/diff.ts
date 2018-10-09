import { IVnode, IPatchList } from '../types';

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
      const sameCode = newVnode.childNodes.find(nChild => (nChild.node.isEqualNode(oChild.node) && nChild.key === oChild.key && !nChild.checked) || (nChild.tagName === oChild.tagName && nChild.key === oChild.key && !nChild.checked));
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
 * diff value of input, textarea, select for diff VNode
 * 
 * type: 5 change value of input
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
 * type: 6 change repeatData of node
 *
 * @param {IVnode} newVnode
 * @param {IVnode} oldVnode
 * @param {IPatchList[]} patchList
 * @returns {void}
 */
function diffRepeatData(oldVnode: IVnode, newVnode: IVnode, patchList: IPatchList[]): void {
  patchList.push({
    type: 6,
    node: oldVnode.node,
    newValue: newVnode.repeatData,
  });
}

/**
 * diff event of node
 *
 * type: 7 change event of node
 * type: 8 change eventTypes of node
 * 
 * @param {IVnode} oldVnode
 * @param {IVnode} newVnode
 * @param {IPatchList[]} patchList
 */
function diffEventTypes(oldVnode: IVnode, newVnode: IVnode, patchList: IPatchList[]): void {
  const oEventTypes: string[] = JSON.parse(oldVnode.eventTypes);
  const nEventTypes: string[] = JSON.parse(newVnode.eventTypes);

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
  // 最后要更新下 eventTypes，否则下次 oldVnode.eventTypes 将为最开始的eventTypes
  patchList.push({
    type: 8,
    node: oldVnode.node,
    newValue: newVnode.eventTypes,
  });
}

/**
 * diff two Vnode
 *
 * @param {IVnode} oldVnode
 * @param {IVnode} newVnode
 * @param {IPatchList[]} patchList
 * @returns {void}
 */
export default function diffVnode(oldVnode: IVnode, newVnode: IVnode, patchList: IPatchList[]): void {
  if (!patchList) throw new Error('patchList can not be null, diffVnode must need an Array');

  if (newVnode.type === 'document-fragment') {
    diffChildNodes(oldVnode, newVnode, patchList);
    return;
  }

  diffAttributes(oldVnode, newVnode, patchList);
  diffNodeValue(oldVnode, newVnode, patchList);
  if (oldVnode.tagName === 'INPUT' || oldVnode.tagName === 'TEXTAREA textarea' || oldVnode.tagName === 'INPUT') diffInputValue(oldVnode, newVnode, patchList);
  diffRepeatData(oldVnode, newVnode, patchList);
  diffEventTypes(oldVnode, newVnode, patchList);

  // 如果为组件，则停止对比内部元素，交由对应组件diff
  if (newVnode.node.isComponent && oldVnode.node) {
    oldVnode.node.isComponent = true;
    return;
  }
  diffChildNodes(oldVnode, newVnode, patchList);
}
