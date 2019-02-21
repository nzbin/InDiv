import { TAttributes, IPatchList, Vnode } from './vnode';
import { Renderer } from './renderer';
/**
 * create nativeElment only without attributes
 *
 * @param {Vnode} createdVnode
 * @param {Renderer} renderer
 * @returns {*}
 */
export declare function createNativeElement(createdVnode: Vnode, renderer: Renderer): any;
/**
 * set attributes to nativeElment
 *
 * @param {Vnode} vnode
 * @param {TAttributes} attribute
 * @param {Renderer} renderer
 */
export declare function setAttributesToNativeElement(vnode: Vnode, attribute: TAttributes, renderer: Renderer): void;
/**
 * create a whol nativeElment and it's children
 *
 * @export
 * @param {Vnode} createdVnode
 * @param {Renderer} renderer
 * @param {number} [index]
 * @returns {*}
 */
export declare function createNativeElementAndChildrens(createdVnode: Vnode, renderer: Renderer, index?: number): any;
/**
 * renderVnode 对比完render node
 *
 * REMOVE_TAG: 0, 移除nativeElement
 * MOVE_TAG: 1, 移动位置
 * CREATE_TAG: 2, 创建nativeElement
 * REPLACE_ATTRIBUTES: 3, 移除属性
 * ADD_ATTRIBUTES: 4, 设置属性
 * TEXT: 5, 更改文字: 5
 * value: 6, 更改 input textarea select value 的值: 6
 * repeatData: 7, 更改 node 的 repeatData: 7, render过来的的被复制的值
 * REMOVE_EVENT: 8, 移除 node 事件
 * ADD_EVENT: 9, 添加 node 事件
 * value: 10, 更改 node 的 eventTypes: 10, 修改node的eventTypes
 *
 * @export
 * @param {IPatchList[]} patchList
 * @param {Renderer} renderer
 */
export declare function patchVnode(patchList: IPatchList[], renderer: Renderer): void;
