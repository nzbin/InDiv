import { TAttributes, IPatchList } from '../../types';

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
 * @param [] patchList
 */
export function renderVnode(patchList: IPatchList[]): void {
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
      case 8:
        patch.node.eventTypes = patch.newValue as string;
        break;
    }
  });
}
