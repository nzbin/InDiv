import { TAttributes, IPatchList, Vnode } from './parse-tag';

import * as nativeFunction from './render';
/**
 * renderVnode 对比完render node
 * 
 * REMOVETAG: 0, 移除DOM: 0
 * REMOVETAG: 1, 移动位置: 1
 * CREATE: 2, 创建DOM: 1
 * ADDATTRIBUTES: 3, 增加属性: 3
 * REPLACEATTRIBUTES: 4, 移除属性: 4
 * TEXT: 5, 更改文字: 5
 * value: 6, 更改 input textarea select value 的值: 6
 * value: 7, 更改 node 的 repeatData: 7, render过来的的被复制的值
 * value: 8, 移除 node 事件
 * value: 9, 添加 node 事件
 * value: 10, 更改 node 的 eventTypes: 10, 修改node的eventTypes
 * 
 * keep order from 0 delete to 8
 *
 * @export
 * @param {IPatchList[]} patchList
 */
export function patchVnode(patchList: IPatchList[]): void {
  console.log(111111111222223, patchList);
  patchList.sort((a, b) => {
    if (a.type === b.type && a.newIndex && b.newIndex) return a.newIndex - b.newIndex;
    return a.type - b.type;
  });
  patchList.forEach(patch => {
    switch (patch.type) {
      case 0:
        const removeNodeIndex = patch.parentVnode.childNodes.indexOf(patch.changedVnode);
        patch.parentVnode.childNodes.splice(removeNodeIndex, 1);
        nativeFunction.removeChild(patch.parentVnode, patch.changedVnode);
        break;
      case 1:
        if (patch.parentVnode.childNodes[patch.newIndex]) {
          patch.changedVnode.parentVnode = patch.parentVnode;
          nativeFunction.createNativeElementAndChildrens(patch.changedVnode, patch.newIndex);
          patch.parentVnode.childNodes.splice(patch.newIndex, 0, patch.changedVnode);
        } else {
          patch.changedVnode.parentVnode = patch.parentVnode;
          nativeFunction.createNativeElementAndChildrens(patch.changedVnode);
          patch.parentVnode.childNodes.push(patch.changedVnode);
        }
        break;
      case 2:
        if (patch.parentVnode.childNodes.indexOf(patch.changedVnode) !== patch.newIndex) {
          if (nativeFunction.isContainted(patch.parentVnode, patch.changedVnode)) {
            nativeFunction.removeChild(patch.parentVnode, patch.changedVnode);
            patch.parentVnode.childNodes.splice(patch.oldIndex, 1);
          }
          if (patch.parentVnode.childNodes[patch.newIndex]) {
            nativeFunction.insertBefore(patch.parentVnode, patch.changedVnode, patch.newIndex);
            patch.parentVnode.childNodes.splice(patch.newIndex, 0, patch.changedVnode);
          } else {
            nativeFunction.appendChild(patch.parentVnode, patch.changedVnode);
            patch.parentVnode.childNodes.push(patch.changedVnode);
          }
        }
        break;
      case 3:
        if (!patch.oldValue) {
          if (patch.originVnode.attributes) patch.originVnode.attributes.push({ ...(patch.changedValue as TAttributes) });
          if (!patch.originVnode.attributes) patch.originVnode.attributes = [{ ...(patch.changedValue as TAttributes) }];
        }
        if (patch.oldValue) {
          if (patch.attributeType === 'attribute') (patch.oldValue as TAttributes).value = (patch.changedValue as TAttributes).value;
          if (patch.attributeType === 'nv-attribute' || patch.attributeType === 'directive' || patch.attributeType === 'prop') (patch.oldValue as TAttributes).nvValue = (patch.changedValue as TAttributes).nvValue;
        }

        if (patch.attributeType === 'attribute') nativeFunction.setAttribute(patch.originVnode, patch.changedValue as TAttributes);
        if (patch.attributeType === 'nv-attribute' || patch.attributeType === 'directive' || patch.attributeType === 'prop') nativeFunction.setNvAttribute(patch.originVnode, patch.changedValue as TAttributes);
        break;
      case 4:
        const removeAttrIndex = patch.originVnode.attributes.indexOf((patch.changedVnode as TAttributes));
        patch.originVnode.attributes.splice(removeAttrIndex, 1);
        if (patch.attributeType === 'attribute') nativeFunction.removeAttribute(patch.originVnode, patch.changedValue as TAttributes);
        if (patch.attributeType === 'nv-attribute' || patch.attributeType === 'directive' || patch.attributeType === 'prop') nativeFunction.removeNvAttribute(patch.originVnode, patch.changedValue as TAttributes);
        break;
      case 5:
        patch.originVnode.nodeValue = (patch.changedValue as string);
        nativeFunction.setNodeValue(patch.originVnode, patch.changedValue);
        break;
      case 6:
        patch.originVnode.value = (patch.changedValue as string | number);
        nativeFunction.setValue(patch.originVnode, patch.changedValue);
        break;
      case 7:
        patch.originVnode.repeatData = patch.changedValue;
        break;
      case 8:
        const removeEventTypeIndex = patch.originVnode.eventTypes.indexOf((patch.changedValue as { type: string; handler: Function; }));
        patch.originVnode.eventTypes.splice(removeEventTypeIndex, 1);
        nativeFunction.removeEventListener(patch.originVnode, (patch.changedValue as { type: string; handler: Function; }).type, (patch.changedValue as { type: string; handler: Function; }).handler);
        break;
      case 9:
        if (!patch.originVnode.eventTypes) patch.originVnode.eventTypes = [{ ...(patch.changedValue as { type: string; handler: Function; }) }];
        if (patch.originVnode.eventTypes) patch.originVnode.eventTypes.push({ ...(patch.changedValue as { type: string; handler: Function; }) });
        nativeFunction.addEventListener(patch.originVnode, (patch.changedValue as { type: string; handler: Function; }).type, (patch.changedValue as { type: string; handler: Function; }).handler);
        break;
    }
  });
}
