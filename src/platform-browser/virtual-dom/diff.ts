import { Vnode, IPatchList } from './parse';

/**
 * diff childNodes for diff VNode
 * 
 * type: 0 removeChild
 * type: 1 change Child index
 *
 * @param {Vnode} newVnode
 * @param {Vnode} oldVnode
 * @param {IPatchList[]} patchList
 * @param {(oldVnode: Vnode, newVnode: Vnode) => boolean} needDiffChildCallback
 */
function diffChildNodes(oldVnode: Vnode, newVnode: Vnode, patchList: IPatchList[], needDiffChildCallback?: (oldVnode: Vnode, newVnode: Vnode) => boolean): void {
  if (oldVnode.childNodes.length > 0) {
    (oldVnode.childNodes as Vnode[]).forEach((oChild, index) => {
      const sameCodeFromNewCode = (newVnode.childNodes as Vnode[]).find(nChild => (nChild.node.isEqualNode(oChild.node) && nChild.key === oChild.key && !nChild.checked) || (nChild.tagName === oChild.tagName && nChild.key === oChild.key && !nChild.checked));
      if (sameCodeFromNewCode) {
        const sameCodeIndexFromNewCode = (newVnode.childNodes as Vnode[]).findIndex(nChild => nChild === sameCodeFromNewCode);
        if (sameCodeIndexFromNewCode !== index) {
          patchList.push({
            type: 1,
            newIndex: sameCodeIndexFromNewCode,
            oldVnode: oChild.node,
            parentNode: oldVnode.node,

            originVnode: oldVnode,
            changedVnode: oChild,
          });
        }
        diffVnode(oChild, sameCodeFromNewCode, patchList, needDiffChildCallback);
        sameCodeFromNewCode.checked = true;
      }
      if (!sameCodeFromNewCode) {
        patchList.push({
          type: 0,
          node: oChild.node,
          parentNode: oldVnode.node,

          originVnode: oldVnode,
          changedVnode: oChild,
        });
      }
    });
  }

  if (newVnode.childNodes.length > 0) {
    (newVnode.childNodes as Vnode[]).forEach((nChild, index) => {
      if (nChild.checked) return;
      patchList.push({
        type: 1,
        newIndex: index,
        oldVnode: nChild.node,
        parentNode: oldVnode.node,

        originVnode: oldVnode,
        changedVnode: nChild,
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
 * @param {Vnode} oldVnode
 * @param {Vnode} newVnode
 * @param {IPatchList[]} patchList
 */
function diffAttributes(oldVnode: Vnode, newVnode: Vnode, patchList: IPatchList[]): void {
  newVnode.attributes.forEach((attr) => {
    const oldVnodeAttr = oldVnode.attributes.find(oldAttr => oldAttr.name === attr.name);
    if (!oldVnodeAttr || oldVnodeAttr.value !== attr.value) {
      patchList.push({
        type: 2,
        node: oldVnode.node,
        newValue: attr,
        oldValue: oldVnodeAttr,

        originVnode: oldVnode,
        changedValue: attr,
      });
    }
  });
  oldVnode.attributes.forEach((attr) => {
    const newVnodeAttr = newVnode.attributes.find(newAttr => newAttr.name === attr.name);
    if (!newVnodeAttr) {
      patchList.push({
        type: 3,
        node: oldVnode.node,
        oldValue: attr,

        originVnode: oldVnode,
        changedValue: attr,
      });
    }
  });
}

/**
 * diff nodeValue for diff VNode
 * 
 * type: 4 change text for node
 *
 * @param {Vnode} oldVnode
 * @param {Vnode} newVnode
 * @param {IPatchList[]} patchList
 * @returns {void}
 */
function diffNodeValue(oldVnode: Vnode, newVnode: Vnode, patchList: IPatchList[]): void {
  if (oldVnode.nodeValue !== newVnode.nodeValue) {
    patchList.push({
      type: 4,
      node: oldVnode.node,
      newValue: newVnode.nodeValue,
      oldValue: oldVnode.nodeValue,

      originVnode: oldVnode,
      changedValue: newVnode.nodeValue,
    });
  }
}

/**
 * diff value of input, textarea, select for diff VNode
 * 
 * type: 5 change value of input
 *
 * @param {Vnode} newVnode
 * @param {Vnode} oldVnode
 * @param {IPatchList[]} patchList
 * @returns {void}
 */
function diffInputValue(oldVnode: Vnode, newVnode: Vnode, patchList: IPatchList[]): void {
  if (oldVnode.value !== newVnode.value) {
    patchList.push({
      type: 5,
      node: oldVnode.node,
      newValue: newVnode.value,
      oldValue: oldVnode.value,


      originVnode: oldVnode,
      changedValue: newVnode.value,
    });
  }
}

/**
 * diff repeatData of repeat node
 * 
 * type: 6 change repeatData of node
 *
 * @param {Vnode} newVnode
 * @param {Vnode} oldVnode
 * @param {IPatchList[]} patchList
 * @returns {void}
 */
function diffRepeatData(oldVnode: Vnode, newVnode: Vnode, patchList: IPatchList[]): void {
  patchList.push({
    type: 6,
    node: oldVnode.node,
    newValue: newVnode.repeatData,

    originVnode: oldVnode,
    changedValue: newVnode.repeatData,
  });
}

/**
 * diff event of node
 *
 * type: 7 change event of node
 * type: 8 change eventTypes of node
 * 
 * @param {Vnode} oldVnode
 * @param {Vnode} newVnode
 * @param {IPatchList[]} patchList
 */
function diffEventTypes(oldVnode: Vnode, newVnode: Vnode, patchList: IPatchList[]): void {
  const oEventTypes: string[] = JSON.parse(oldVnode.eventTypes);
  const nEventTypes: string[] = JSON.parse(newVnode.eventTypes);

  // 全部更新为新的事件
  if (nEventTypes && nEventTypes.length > 0) {
    nEventTypes.forEach(nEventType => {
      patchList.push({
        type: 7,
        node: oldVnode.node,
        eventType: nEventType,
        newValue: (newVnode.node as any)[`event${nEventType}`],
      });
    });
  }

  if (oEventTypes && oEventTypes.length > 0) {
    oEventTypes.forEach(oEventType => {
      // 如果新事件不存在，则删除事件
      if (!nEventTypes || nEventTypes.length <= 0) {
        patchList.push({
          type: 7,
          node: oldVnode.node,
          eventType: oEventType,
          newValue: null,
        });
      }
      // 如果新事件找不到旧事件中的事件，则把旧事件的事件删除
      if (nEventTypes && nEventTypes.length > 0 && !nEventTypes.find(nEventType => nEventType === oEventType)) {
        patchList.push({
          type: 7,
          node: oldVnode.node,
          eventType: oEventType,
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

    originVnode: oldVnode,
    changedValue: newVnode.eventTypes,
  }); 
}

/**
 * diff two Vnode
 *
 * if needDiffChildCallback return false, then stop diff childNodes 
 * 
 * @param {Vnode} oldVnode
 * @param {Vnode} newVnode
 * @param {IPatchList[]} patchList
 * @param {(oldVnode: Vnode, newVnode: Vnode) => boolean} needDiffChildCallback
 * @returns {void}
 */
export function diffVnode(oldVnode: Vnode, newVnode: Vnode, patchList: IPatchList[], needDiffChildCallback?: (oldVnode: Vnode, newVnode: Vnode) => boolean): void {
  if (!patchList) throw new Error('patchList can not be null, diffVnode must need an Array');

  if (newVnode.type === 'document-fragment') {
    newVnode.childNodes.forEach(child => { child.parentNode = oldVnode.node; });
    diffChildNodes(oldVnode, newVnode, patchList, needDiffChildCallback);
    return;
  }

  diffAttributes(oldVnode, newVnode, patchList);
  diffNodeValue(oldVnode, newVnode, patchList);
  if (oldVnode.tagName === 'INPUT' || oldVnode.tagName === 'TEXTAREA textarea' || oldVnode.tagName === 'INPUT') diffInputValue(oldVnode, newVnode, patchList);
  diffRepeatData(oldVnode, newVnode, patchList);
  diffEventTypes(oldVnode, newVnode, patchList);

  if (needDiffChildCallback && !needDiffChildCallback(oldVnode, newVnode)) return;
  diffChildNodes(oldVnode, newVnode, patchList, needDiffChildCallback);
}
