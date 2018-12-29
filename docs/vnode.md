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

当对比两棵树时，InDiv 首先比较顶层的节点。顶层的节点的类型不同，其行为也不同。

#### 不同类型的元素

当 `tagName` `key` `template` 其中之一不同时，就会被认为是两个不同的节点，因此会直接移除该节点。

#### 相同类型的元素

当 `tagName` `key` `template` 都相同时，InDiv 会认为他们是同一节点，于是会进入下一阶段，对比属性事件等。

#### 递归子节点

当递归虚拟DOM节点的每个子节点，按照上述对比算法继续递归。

#### 关于key

可以通过指令 `nv-key` 手动指定该值，默认为`null`。对于有状态的组件来说，如果同级出现2个相同的组件，为了避免组件被错误销毁或触发生命周期，应该并且必要加上`nv-key`。

最后通过补丁patch到真实的元素上，并更新被保存的Vnode副本。
