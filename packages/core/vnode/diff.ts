import { Vnode, IPatchList, TEventType } from './parse-tag';

/**
 * diff childNodes for diff VNode
 * 
 * sameVnode: tagName , key and template are all same
 * 
 * type: 0 removeChild
 * type: 1 change Child index
 * type: 2 create Child in index
 *
 * @param {Vnode} newVnode
 * @param {Vnode} oldVnode
 * @param {IPatchList[]} patchList
 * @param {(oldVnode: Vnode, newVnode: Vnode) => boolean} needDiffChildCallback
 */
function diffChildNodes(oldVnode: Vnode, newVnode: Vnode, patchList: IPatchList[]): void {
  if (oldVnode.childNodes && oldVnode.childNodes.length > 0) {
    oldVnode.childNodes.forEach((oChild, index) => {
      if (!oChild.type) return;
      const sameCodeFromNewCode = newVnode.childNodes.find(nChild => (nChild.tagName === oChild.tagName && nChild.key === oChild.key && nChild.template === oChild.template && !nChild.checked));
      if (!sameCodeFromNewCode) {
        patchList.push({
          type: 0,
          parentVnode: oldVnode,
          changedVnode: oChild,
        });
      }
      if (sameCodeFromNewCode) {
        const sameCodeIndexFromNewCode = newVnode.childNodes.findIndex(nChild => nChild === sameCodeFromNewCode);
        if (sameCodeIndexFromNewCode !== index) {
          patchList.push({
            type: 2,
            newIndex: sameCodeIndexFromNewCode,
            oldIndex: index,
            parentVnode: oldVnode,
            changedVnode: oChild,
          });
        }
        diffVnode(oChild, sameCodeFromNewCode, patchList);
        sameCodeFromNewCode.checked = true;
      }
    });
  }

  if (newVnode.childNodes && newVnode.childNodes.length > 0) {
    newVnode.childNodes.forEach((nChild, index) => {
      if (nChild.checked || !nChild.type) return;
      patchList.push({
        type: 1,
        newIndex: index,
        parentVnode: oldVnode,
        changedVnode: nChild,
      });
      nChild.checked = true;
    });

    newVnode.childNodes.forEach(nChild => nChild.checked = false);
  }
}

/**
 * diff attributes for diff VNode
 * 
 * type: 3 setAttribute
 * type: 4 removeAttribute
 *
 * @param {Vnode} oldVnode
 * @param {Vnode} newVnode
 * @param {IPatchList[]} patchList
 */
function diffAttributes(oldVnode: Vnode, newVnode: Vnode, patchList: IPatchList[]): void {
  if (!newVnode.attributes || newVnode.attributes.length === 0) return;
  newVnode.attributes.forEach((attr) => {
    const oldVnodeAttr = oldVnode.attributes.find(oldAttr => oldAttr.type === attr.type && oldAttr.name === attr.name);
    if (
      (attr.type === 'attribute' && (!oldVnodeAttr || oldVnodeAttr.value !== attr.value)) ||
      ((attr.type === 'nv-attribute' || attr.type === 'directive' || attr.type === 'prop') && (!oldVnodeAttr || oldVnodeAttr.nvValue !== attr.nvValue))
    ) {
      patchList.push({
        type: 3,
        oldValue: oldVnodeAttr,
        originVnode: oldVnode,
        changedValue: attr,
        attributeType: attr.type,
      });
    }
  });
  if (!oldVnode.attributes || oldVnode.attributes.length === 0) return;
  oldVnode.attributes.forEach((attr) => {
    const newVnodeAttr = newVnode.attributes.find(newAttr => newAttr.type === attr.type && newAttr.name === attr.name);
    if (!newVnodeAttr) {
      patchList.push({
        type: 4,
        originVnode: oldVnode,
        changedValue: attr,
        attributeType: attr.type,
      });
    }
  });
}

/**
 * diff nodeValue for diff VNode
 * 
 * type: 5 change text for node
 *
 * @param {Vnode} oldVnode
 * @param {Vnode} newVnode
 * @param {IPatchList[]} patchList
 * @returns {void}
 */
function diffNodeValue(oldVnode: Vnode, newVnode: Vnode, patchList: IPatchList[]): void {
  if (oldVnode.type !== 'text') return;
  if (oldVnode.nodeValue !== newVnode.nodeValue) {
    patchList.push({
      type: 5,
      originVnode: oldVnode,
      changedValue: newVnode.nodeValue,
    });
  }
}

/**
 * diff value of input, textarea, select for diff VNode
 * 
 * type: 6 change value of input
 *
 * @param {Vnode} newVnode
 * @param {Vnode} oldVnode
 * @param {IPatchList[]} patchList
 * @returns {void}
 */
function diffValue(oldVnode: Vnode, newVnode: Vnode, patchList: IPatchList[]): void {
  if (oldVnode.value !== newVnode.value) {
    patchList.push({
      type: 6,
      originVnode: oldVnode,
      changedValue: newVnode.value,
    });
  }
}

/**
 * diff repeatData of repeat node
 * 
 * type: 7 change repeatData of node
 *
 * @param {Vnode} newVnode
 * @param {Vnode} oldVnode
 * @param {IPatchList[]} patchList
 * @returns {void}
 */
function diffRepeatData(oldVnode: Vnode, newVnode: Vnode, patchList: IPatchList[]): void {
  let isEqual = true;
  const oldDataKeys = Object.keys(oldVnode.repeatData);
  const newDataKeys = Object.keys(newVnode.repeatData);
  if (oldDataKeys.length !== newDataKeys.length) isEqual = false;
  if (newDataKeys.length === newDataKeys.length) {
    oldDataKeys.forEach(key => {
      if (!newVnode.repeatData.hasOwnProperty(key) || oldVnode.repeatData[key] !== newVnode.repeatData[key]) isEqual = false;
    });
  }
  if (isEqual) return;
  patchList.push({
    type: 7,
    originVnode: oldVnode,
    changedValue: newVnode.repeatData,
  });
}

/**
 * diff event of node
 *
 * type: 8 remove event of node
 * type: 9 add event of node
 * type: 10 change eventTypes of node
 * 
 * @param {Vnode} oldVnode
 * @param {Vnode} newVnode
 * @param {IPatchList[]} patchList
 */
function diffEventTypes(oldVnode: Vnode, newVnode: Vnode, patchList: IPatchList[]): void {
  const oEventTypes: TEventType[] = oldVnode.eventTypes;
  const nEventTypes: TEventType[] = newVnode.eventTypes;

  if (oEventTypes && oEventTypes.length > 0) {
    oEventTypes.forEach(oEventType => {
      // 如果新事件不存在，则删除事件
      if (!nEventTypes || nEventTypes.length <= 0) {
        patchList.push({
          type: 8,
          originVnode: oldVnode,
          changedValue: oEventType,
        });
      }
      // 如果新事件找不到旧事件中的事件，则把旧事件的事件删除
      if (nEventTypes && nEventTypes.length > 0 && !nEventTypes.find(nEventType => nEventType.type === oEventType.type)) {
        patchList.push({
          type: 8,
          originVnode: oldVnode,
          changedValue: oEventType,
        });
      }
    });
  }

  if (nEventTypes && nEventTypes.length > 0) {
    nEventTypes.forEach(nEventType => {
      // 如果旧的不存在直接增加新的类型
      if (!oEventTypes || oEventTypes.length <= 0) {
        patchList.push({
          type: 9,
          originVnode: oldVnode,
          changedValue: nEventType,
        });
      }

      if (oEventTypes && oEventTypes.length > 0) {
        const sameEventType = oEventTypes.find(oEventType => oEventType.type === nEventType.type);
        // 如果旧的存在但是不存在新的类型，直接增加新的类型
        if (!sameEventType) {
          patchList.push({
            type: 9,
            originVnode: oldVnode,
            changedValue: nEventType,
          });
        }
        // 如果旧的存在并且新的类型相同，对比 nv-on 的属性和 token，如果相同则忽略，如果不同则先移除事件再增加新事件
        if (sameEventType && sameEventType.token !== nEventType.token) {
          patchList.push({
            type: 8,
            originVnode: oldVnode,
            changedValue: sameEventType,
          });
          patchList.push({
            type: 9,
            originVnode: oldVnode,
            changedValue: nEventType,
          });
        }
      }
    });
  }
}

/**
 * diff two Vnode
 * 
 * @param {Vnode} oldVnode
 * @param {Vnode} newVnode
 * @param {IPatchList[]} patchList
 * @param {(oldVnode: Vnode, newVnode: Vnode) => boolean} needDiffChildCallback
 * @returns {void}
 */
export function diffVnode(oldVnode: Vnode, newVnode: Vnode, patchList: IPatchList[]): void {
  if (!patchList) throw new Error('patchList can not be null, diffVnode must need an Array');
  if (!newVnode.parentVnode && !newVnode.template && !newVnode.tagName) {
    diffChildNodes(oldVnode, newVnode, patchList);
    return;
  }

  diffAttributes(oldVnode, newVnode, patchList);
  diffNodeValue(oldVnode, newVnode, patchList);
  diffValue(oldVnode, newVnode, patchList);
  diffRepeatData(oldVnode, newVnode, patchList);
  diffEventTypes(oldVnode, newVnode, patchList);
  diffChildNodes(oldVnode, newVnode, patchList);
}
