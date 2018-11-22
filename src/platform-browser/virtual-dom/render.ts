import { TAttributes, IPatchList, Vnode } from './parse';

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
 * value: 8, 更改 node 的 eventTypes: 8, 修改node的eventTypes
 * 
 * keep order from 0 delete to 8
 *
 * @export
 * @param {IPatchList[]} patchList
 */
export function renderVnode(patchList: IPatchList[]): void {
  patchList.sort((a, b) => {
    if (a.type === b.type && a.newIndex && b.newIndex) return a.newIndex - b.newIndex;
    return a.type - b.type;
  });
  patchList.forEach(patch => {
    switch (patch.type) {
      case 0:
        const removeNodeIndex = (patch.originVnode.childNodes as Vnode[]).indexOf(patch.changedVnode);
        (patch.originVnode.childNodes as Vnode[]).splice(removeNodeIndex, 1);

        patch.parentNode.removeChild(patch.node);
        break;
      case 1:
        const changeNodeIndex = (patch.originVnode.childNodes as Vnode[]).indexOf(patch.changedVnode);

        if (!(Array.from((patch.parentNode as Element).children).indexOf(patch.oldVnode as Element) === patch.newIndex)) {
          if (patch.parentNode.contains(patch.oldVnode)) {
            patch.parentNode.removeChild(patch.oldVnode);
            (patch.originVnode.childNodes as Vnode[]).splice(changeNodeIndex, 1);
          }
          if (patch.parentNode.childNodes[patch.newIndex]) {
            patch.parentNode.insertBefore(patch.oldVnode, patch.parentNode.childNodes[patch.newIndex]);
            (patch.originVnode.childNodes as Vnode[]).splice(patch.newIndex, 0, patch.changedVnode);
          } else {
            patch.parentNode.appendChild(patch.oldVnode);
            (patch.originVnode.childNodes as Vnode[]).push(patch.changedVnode);
          }
        }
        break;
      case 2:
        if (!patch.oldValue)  patch.originVnode.attributes.push((patch.changedValue as TAttributes));
        if (patch.oldValue)  (patch.oldValue as TAttributes).value = (patch.changedValue as TAttributes).value;

        (patch.node as Element).setAttribute((patch.newValue as TAttributes).name, (patch.newValue as TAttributes).value);
        break;
      case 3:
        const removeAttrIndex = patch.originVnode.attributes.indexOf((patch.changedVnode as TAttributes));
        patch.originVnode.attributes.splice(removeAttrIndex, 1);

        (patch.node as Element).removeAttribute((patch.oldValue as TAttributes).name);
        break;
      case 4:
        patch.originVnode.nodeValue = (patch.changedValue as string); 

        patch.node.nodeValue = (patch.newValue as string);
        break;
      case 5:
        patch.originVnode.value = (patch.changedValue as string | number);

        (patch.node as Element).value = patch.newValue;
        break;
      case 6:
        patch.originVnode.repeatData = patch.changedValue as any;

        patch.node.repeatData = patch.newValue as any;
        break;
      case 7:
        (patch.node as any)[`on${patch.eventType}`] = patch.newValue as any;
        break;
      case 8:
        patch.originVnode.eventTypes = patch.changedValue as string;

        patch.node.eventTypes = patch.newValue as string;
        break;
    }
  });
}
