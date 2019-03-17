## 虚拟DOM（Virtual DOM）

虚拟DOM（VDOM）是一种编程概念，是指虚拟的视图被保存在内存中，并通过诸如与“真实”的DOM保持同步的状态。

虽然不是操作原生DOM api就一定会导致性能变差，但是如果考虑到节约浏览器的渲染或是跨平台渲染，就不得不跨越原生DOM api。

因此 InDiv 抛弃了直接操作DOM这一行为，而直接使用了在 Vue React 中都广泛使用的 虚拟DOM。


## Vnode

每个元素都是一个节点。每片文字也是一个节点。一个节点就是页面的一个部分。

类似一个 Object，DOM也是一个对象，因此我们可以通过一个同步的对象 `Vnode` 来保持对DOM的状态描述，并通过抽象出的 `Renderer` 来操作实际视图的渲染行为。

所谓的虚拟DOM就是下面这样的一个对象。

> @indiv/core/vnode/vnode.ts

```typescript
export class Vnode {
  public tagName?: string;
  public nativeElement?: any;
  public parentVnode?: Vnode;
  public attributes?: TAttributes[];
  public nodeValue?: string | null;
  public childNodes?: Vnode[];
  public type?: string;
  public value?: string | number;
  public repeatData?: any;
  public eventTypes?: TEventType[] = [];
  public key?: any;
  public checked?: boolean;
  public voidElement?: boolean = false;
  public template?: string;
  public index?: number;
}
```

其中 `tagName?: string;` 为标签名，`nativeElement?: any;` 为实际的原生元素，`parentVnode?: Vnode;` 为父级的指针，`template?: string;` 为被解析出的字符串模板原文，`key?: any` 为该虚拟DOM节点的标示可以为空等。

通过每次对比更新这个对象，就能获得实际整个视图中需要更新的部分，有效减少对视图的操作此时。


## diff 算法

其实类似于React的diff算法 <a href="https://react.docschina.org/docs/reconciliation.html" target="_blank"> ，只对比同级的两个先后生成的元素, 两个不同类型的元素将产生不同的树，通过渲染器附带key属性，开发者可以示意哪些子元素可能是稳定的。

其实这是种**广度优先算法**，优先对比同层元素。

当对比两棵树时，InDiv 首先比较顶层的节点。顶层的节点的类型不同，其行为也不同。

> @indiv/core/vnode/diff.ts

```typescript
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
```

#### 不同类型的元素

当 `tagName` `key` `template` 其中之一不同时，就会被认为是两个不同的节点，因此会直接移除该节点。

#### 相同类型的元素

当 `tagName` `key` `template` 都相同时，InDiv 会认为他们是同一节点，于是会进入下一阶段，对比属性事件等。

#### 递归子节点

当递归虚拟DOM节点的子节点，按照上述 diff 算法继续递归。

#### 关于key

可以通过指令 `nv-key` 手动指定该值，默认为`null`。对于有状态的组件来说，如果同级出现2个相同的组件，为了避免组件被错误销毁或触发生命周期，应该并且必要加上`nv-key`。


## patch

把补丁逐步根据平台方法更新到真实的元素上去。

### patchList 收集 patch

在开始 diff `Vnode` 之前，每个组件的 `Compile` 实例会创建一个 ` const patchList: IPatchList[] = [];` ，用来收集需要 patch 的结果。

> @indiv/core/vnode/vnode.ts

```typescript
export interface IPatchList {
  type?: number;
  nativeElement?: any;
  parentVnode?: Vnode;
  newIndex?: number;
  oldIndex?: number;
  oldValue?: TAttributes | string | number | boolean | Function;
  originVnode?: Vnode;
  changedVnode?: Vnode;
  changedValue?: TAttributes | string | number | boolean | Function | TEventType;
  attributeType?: TNvAttribute;
}
```

### patchList type 补丁类型

`type` 一共有10种：

1. REMOVE_TAG: 0, 移除nativeElement
2. CREATE_TAG: 1, 创建nativeElement
3. MOVE_TAG: 2, 移动位置（插入或添加或删除）
4. REPLACE_ATTRIBUTES: 3, 移除属性
5. ADD_ATTRIBUTES: 4, 设置属性 
6. TEXT: 5, 更改文字
7. value: 6, 更改 input textarea select 等表单的 value 值
8. repeatData: 7, 更改 node 的 repeatData （nv-repeat的根数据）
9. REMOVE_EVENT: 8, 移除 node 事件
10. ADD_EVENT: 9, 添加 node 事件

### patch 阶段

当开始 patch 阶段时，会对整个 `patchList` 进行一次排序，按照下面规则：

1. 按照 type 类型的序号从小到大排序。**深度优先，优先新节点及其子节点的创建插入改变排序**
2. 如果类型相同则按照新排序 `newIndex` 从小到大排序。

最后根据最新的顺序按照各个类型调用 `Renderer` 实例上的不同平台方法去修改视图。

> @indiv/core/vnode/patch.ts

```typescript
export function patchVnode(patchList: IPatchList[], renderer: Renderer): void {
  patchList.sort((a, b) => {
    if (a.type === b.type && a.newIndex && b.newIndex) return a.newIndex - b.newIndex;
    return a.type - b.type;
  });
  patchList.forEach(patch => {
    switch (patch.type) {
      case 0: {
        const removeNodeIndex = patch.parentVnode.childNodes.indexOf(patch.changedVnode);
        patch.parentVnode.childNodes.splice(removeNodeIndex, 1);
        renderer.removeChild(patch.parentVnode.nativeElement, patch.changedVnode.nativeElement);
        break;
      }
      case 1: {
        if (patch.parentVnode.childNodes[patch.newIndex]) {
          patch.changedVnode.parentVnode = patch.parentVnode;
          patch.parentVnode.childNodes.splice(patch.newIndex, 0, patch.changedVnode);
          createNativeElementAndChildrens(patch.changedVnode, renderer, patch.newIndex);
        } else {
          patch.changedVnode.parentVnode = patch.parentVnode;
          patch.parentVnode.childNodes.push(patch.changedVnode);
          createNativeElementAndChildrens(patch.changedVnode, renderer);
        }
        break;
      }
      case 2: {
        if (patch.parentVnode.childNodes.indexOf(patch.changedVnode) !== patch.newIndex) {
          if (renderer.isContainted(patch.parentVnode.nativeElement, patch.changedVnode.nativeElement)) {
            renderer.removeChild(patch.parentVnode.nativeElement, patch.changedVnode.nativeElement);
            patch.parentVnode.childNodes.splice(patch.oldIndex, 1);
          }
          if (patch.parentVnode.childNodes[patch.newIndex]) {
            renderer.insertBefore(patch.parentVnode.nativeElement, patch.changedVnode.nativeElement, patch.newIndex);
            patch.parentVnode.childNodes.splice(patch.newIndex, 0, patch.changedVnode);
          } else {
            renderer.appendChild(patch.parentVnode.nativeElement, patch.changedVnode.nativeElement);
            patch.parentVnode.childNodes.push(patch.changedVnode);
          }
        }
        break;
      }
      case 3: {
        const removeAttrIndex = patch.originVnode.attributes.indexOf((patch.changedValue as TAttributes));
        if ((patch.changedValue as TAttributes).name === 'nv-model') patch.originVnode.value = null;
        if ((patch.changedValue as TAttributes).name === 'nv-key') patch.originVnode.key = null;
        patch.originVnode.attributes.splice(removeAttrIndex, 1);

        // render nativeElement
        if (patch.attributeType === 'attribute') renderer.removeAttribute(patch.originVnode.nativeElement, (patch.changedValue as TAttributes).name, (patch.changedValue as TAttributes).value);
        if (patch.attributeType === 'nv-attribute') renderer.removeNvAttribute(patch.originVnode.nativeElement, (patch.changedValue as TAttributes).name, (patch.changedValue as TAttributes).nvValue);
        break;
      }
      case 4: {
        if (patch.originVnode.attributes) patch.originVnode.attributes.push({ ...(patch.changedValue as TAttributes) });
        if (!patch.originVnode.attributes) patch.originVnode.attributes = [{ ...(patch.changedValue as TAttributes) }];

        if ((patch.changedValue as TAttributes).name === 'nv-model') patch.originVnode.value = (patch.changedValue as TAttributes).nvValue;
        if ((patch.changedValue as TAttributes).name === 'nv-key') patch.originVnode.key = (patch.changedValue as TAttributes).nvValue;

        // render nativeElement
        if (patch.attributeType === 'attribute') renderer.setAttribute(patch.originVnode.nativeElement, (patch.changedValue as TAttributes).name, (patch.changedValue as TAttributes).value);
        if (patch.attributeType === 'nv-attribute') renderer.setNvAttribute(patch.originVnode.nativeElement, (patch.changedValue as TAttributes).name, (patch.changedValue as TAttributes).nvValue);
        break;
      }
      case 5: {
        patch.originVnode.nodeValue = (patch.changedValue as string);
        renderer.setNodeValue(patch.originVnode.nativeElement, patch.changedValue);
        break;
      }
      case 6: {
        patch.originVnode.value = (patch.changedValue as string | number);
        renderer.setValue(patch.originVnode.nativeElement, patch.changedValue);
        break;
      }
      case 7: {
        patch.originVnode.repeatData = patch.changedValue;
        break;
      }
      case 8: {
        const removeEventTypeIndex = patch.originVnode.eventTypes.indexOf((patch.changedValue as TEventType));
        patch.originVnode.eventTypes.splice(removeEventTypeIndex, 1);
        renderer.removeEventListener(patch.originVnode.nativeElement, (patch.changedValue as { type: string; handler: Function; }).type, (patch.changedValue as TEventType).handler);
        break;
      }
      case 9: {
        if (!patch.originVnode.eventTypes) patch.originVnode.eventTypes = [{ ...(patch.changedValue as TEventType) }];
        if (patch.originVnode.eventTypes) patch.originVnode.eventTypes.push({ ...(patch.changedValue as TEventType) });
        renderer.addEventListener(patch.originVnode.nativeElement, (patch.changedValue as { type: string; handler: Function; }).type, (patch.changedValue as TEventType).handler);
        break;
      }
    }
  });
}
```

