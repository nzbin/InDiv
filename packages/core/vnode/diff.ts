import { Vnode, IPatchList } from './parse-tag';

/**
 * diff childNodes for diff VNode
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
      // const sameCodeFromNewCode = newVnode.childNodes.find(nChild => (nChild.node.isEqualNode(oChild.node) && nChild.key === oChild.key && !nChild.checked) || (nChild.tagName === oChild.tagName && nChild.key === oChild.key && !nChild.checked));
      const sameCodeFromNewCode = newVnode.childNodes.find(nChild => (nChild.tagName === oChild.tagName && nChild.key === oChild.key && !nChild.checked));
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
            type: 1,
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
        type: 2,
        newIndex: index,
        parentVnode: oldVnode,
        changedVnode: nChild,
      });
      nChild.checked = true;
    });

    newVnode.childNodes.forEach(nChild => nChild.checked = false);
  }
}

// /**
//  * diff attributes for diff VNode
//  * 
//  * type: 3 setAttribute
//  * type: 4 removeAttribute
//  *
//  * @param {Vnode} oldVnode
//  * @param {Vnode} newVnode
//  * @param {IPatchList[]} patchList
//  */
// function diffAttributes(oldVnode: Vnode, newVnode: Vnode, patchList: IPatchList[]): void {
//   newVnode.attributes.forEach((attr) => {
//     const oldVnodeAttr = oldVnode.attributes.find(oldAttr => oldAttr.name === attr.name);
//     if (!oldVnodeAttr || oldVnodeAttr.value !== attr.value) {
//       patchList.push({
//         type: 3,
//         node: oldVnode.node,
//         newValue: attr,
//         oldValue: oldVnodeAttr,
//         originVnode: oldVnode,
//         changedValue: attr,
//       });
//     }
//   });
//   oldVnode.attributes.forEach((attr) => {
//     const newVnodeAttr = newVnode.attributes.find(newAttr => newAttr.name === attr.name);
//     if (!newVnodeAttr) {
//       patchList.push({
//         type: 4,
//         node: oldVnode.node,
//         oldValue: attr,
//         originVnode: oldVnode,
//         changedValue: attr,
//       });
//     }
//   });
// }

// /**
//  * diff nodeValue for diff VNode
//  * 
//  * type: 5 change text for node
//  *
//  * @param {Vnode} oldVnode
//  * @param {Vnode} newVnode
//  * @param {IPatchList[]} patchList
//  * @returns {void}
//  */
// function diffNodeValue(oldVnode: Vnode, newVnode: Vnode, patchList: IPatchList[]): void {
//   if (oldVnode.nodeValue !== newVnode.nodeValue) {
//     patchList.push({
//       type: 5,
//       node: oldVnode.node,
//       newValue: newVnode.nodeValue,
//       oldValue: oldVnode.nodeValue,
//       originVnode: oldVnode,
//       changedValue: newVnode.nodeValue,
//     });
//   }
// }

// /**
//  * diff value of input, textarea, select for diff VNode
//  * 
//  * type: 6 change value of input
//  *
//  * @param {Vnode} newVnode
//  * @param {Vnode} oldVnode
//  * @param {IPatchList[]} patchList
//  * @returns {void}
//  */
// function diffInputValue(oldVnode: Vnode, newVnode: Vnode, patchList: IPatchList[]): void {
//   if (oldVnode.value !== newVnode.value) {
//     patchList.push({
//       type: 6,
//       node: oldVnode.node,
//       newValue: newVnode.value,
//       oldValue: oldVnode.value,
//       originVnode: oldVnode,
//       changedValue: newVnode.value,
//     });
//   }
// }

// /**
//  * diff repeatData of repeat node
//  * 
//  * type: 7 change repeatData of node
//  *
//  * @param {Vnode} newVnode
//  * @param {Vnode} oldVnode
//  * @param {IPatchList[]} patchList
//  * @returns {void}
//  */
// function diffRepeatData(oldVnode: Vnode, newVnode: Vnode, patchList: IPatchList[]): void {
//   if (oldVnode.repeatData === newVnode.repeatData) return;
//   patchList.push({
//     type: 7,
//     node: oldVnode.node,
//     newValue: newVnode.repeatData,
//     originVnode: oldVnode,
//     changedValue: newVnode.repeatData,
//   });
// }

// /**
//  * diff event of node
//  *
//  * type: 8 remove event of node
//  * type: 9 add event of node
//  * type: 10 change eventTypes of node
//  * 
//  * @param {Vnode} oldVnode
//  * @param {Vnode} newVnode
//  * @param {IPatchList[]} patchList
//  */
// function diffEventTypes(oldVnode: Vnode, newVnode: Vnode, patchList: IPatchList[]): void {
//   const oEventTypes: string[] = JSON.parse(oldVnode.eventTypes);
//   const nEventTypes: string[] = JSON.parse(newVnode.eventTypes);

//   if (oEventTypes && oEventTypes.length > 0) {
//     oEventTypes.forEach(oEventType => {
//       // 如果新事件不存在，则删除事件
//       if (!nEventTypes || nEventTypes.length <= 0) {
//         patchList.push({
//           type: 8,
//           node: oldVnode.node,
//           eventType: oEventType,
//           newValue: (oldVnode.node as any)[`event${oEventType}`],
//         });
//       }
//       // 如果新事件找不到旧事件中的事件，则把旧事件的事件删除
//       if (nEventTypes && nEventTypes.length > 0 && !nEventTypes.find(nEventType => nEventType === oEventType)) {
//         patchList.push({
//           type: 8,
//           node: oldVnode.node,
//           eventType: oEventType,
//           newValue: (oldVnode.node as any)[`event${oEventType}`],
//         });
//       }
//     });
//   }

//   if (nEventTypes && nEventTypes.length > 0) {
//     nEventTypes.forEach(nEventType => {
//       // 如果旧的不存在直接增加新的类型
//       if (!oEventTypes || oEventTypes.length <= 0) {
//         patchList.push({
//           type: 9,
//           node: oldVnode.node,
//           eventType: nEventType,
//           newValue: (newVnode.node as any)[`event${nEventType}`],
//         });
//       }

//       if (oEventTypes && oEventTypes.length > 0) {
//         const sameEventType = oEventTypes.find(oEventType => oEventType === nEventType);
//         // 如果旧的存在但是不存在新的类型，直接增加新的类型
//         if (!sameEventType) {
//           patchList.push({
//             type: 9,
//             node: oldVnode.node,
//             eventType: nEventType,
//             newValue: (newVnode.node as any)[`event${nEventType}`],
//           });
//         }
//         // 如果旧的存在并且新的类型相同，对比 nv-on 的属性和 DOM上的 event${nEventType}事件函数，如果相同则忽略，如果不同则先移除事件再增加新事件
//         if (
//           sameEventType &&
//           ((oldVnode.node as Element).getAttribute(`nv-on:${sameEventType}`) !== (newVnode.node as Element).getAttribute(`nv-on:${sameEventType}`) || (oldVnode.node as any)[`event${nEventType}`].toString() !== (newVnode.node as any)[`event${nEventType}`].toString())
//         ) {
//           patchList.push({
//             type: 8,
//             node: oldVnode.node,
//             eventType: nEventType,
//             newValue: (oldVnode.node as any)[`event${nEventType}`],
//           });
//           patchList.push({
//             type: 9,
//             node: oldVnode.node,
//             eventType: nEventType,
//             newValue: (newVnode.node as any)[`event${nEventType}`],
//           });
//         }
//       }
//     });
//   }

//   // 最后要更新下 eventTypes，否则下次 oldVnode.eventTypes 将为最开始的eventTypes
//   if (newVnode.eventTypes !== oldVnode.eventTypes) {
//     patchList.push({
//       type: 10,
//       node: oldVnode.node,
//       newValue: newVnode.eventTypes,
//       originVnode: oldVnode,
//       changedValue: newVnode.eventTypes,
//     });
//   }
// }

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
export function diffVnode(oldVnode: Vnode, newVnode: Vnode, patchList: IPatchList[]): void {
  if (!patchList) throw new Error('patchList can not be null, diffVnode must need an Array');
  if (!newVnode.parentVnode && !newVnode.template && !newVnode.tagName) {
    diffChildNodes(oldVnode, newVnode, patchList);
    return;
  }
  // if (newVnode.type === 'document-fragment') {
  //   newVnode.childNodes.forEach(child => { child.parentNode = oldVnode.node; });
  //   diffChildNodes(oldVnode, newVnode, patchList, needDiffChildCallback);
  //   return;
  // }

  // diffAttributes(oldVnode, newVnode, patchList);
  // diffNodeValue(oldVnode, newVnode, patchList);
  // if (oldVnode.tagName === 'INPUT' || oldVnode.tagName === 'TEXTAREA textarea' || oldVnode.tagName === 'INPUT') diffInputValue(oldVnode, newVnode, patchList);
  // diffRepeatData(oldVnode, newVnode, patchList);
  // diffEventTypes(oldVnode, newVnode, patchList);

  // if (needDiffChildCallback && !needDiffChildCallback(oldVnode, newVnode)) return;
  diffChildNodes(oldVnode, newVnode, patchList);
}
