import { Vnode } from '../vnode';
import { IComponent } from '../types';
/**
 * get function from vm
 *
 * @export
 * @param {*} vm
 * @param {string} exp
 * @returns {Function}
 */
export declare function getVMFunction(vm: any, exp: string): Function;
/**
 * check arguments from function is ready to be used
 *
 * @export
 * @param {string} exp
 * @param {Vnode} vnode
 * @param {*} vm
 * @returns {boolean}
 */
export declare function argumentsIsReady(exp: string, vnode: Vnode, vm: any): boolean;
/**
 * check value is ready to be used
 *
 * @export
 * @param {string} exp
 * @param {Vnode} vnode
 * @param {*} vm
 * @returns {boolean}
 */
export declare function valueIsReady(exp: string, vnode: Vnode, vm: any): boolean;
/**
 * get value from vm
 *
 * @export
 * @param {*} vm
 * @param {string} exp
 * @returns {*}
 */
export declare function getVMVal(vm: any, exp: string): any;
/**
 * get value from other value
 *
 * @export
 * @param {*} vm
 * @param {string} exp
 * @param {string} key
 * @returns {*}
 */
export declare function getValueByValue(vm: any, exp: string, key: string): any;
/**
 * get arguments from vm
 *
 * @export
 * @param {*} vm
 * @param {string} exp
 * @param {Vnode} vnode
 * @returns {any[]}
 */
export declare function getVMFunctionArguments(vm: any, exp: string, vnode: Vnode): any[];
/**
 * find exp is member of vm instance
 *
 * @param {*} vm
 * @param {string} exp
 * @returns {boolean}
 */
export declare function isFromVM(vm: any, exp: string): boolean;
/**
 * clone Vnode and clone it event
 *
 * event by attribute in DOM: eventTypes
 * repeat data by attribute in DOM: repeatData
 * isComponent: clone Component need add isComponent=true
 *
 * @param {Vnode} vnode
 * @param {*} [repeatData]
 * @returns {Vnode}
 */
export declare function cloneVnode(vnode: Vnode, repeatData?: any): Vnode;
/**
 * copy parentVnode from parentVnode to children
 *
 * @param {Vnode} vnode
 * @param {*} [repeatData]
 * @returns {void}
 */
export declare function copyParentVnode(vnode: Vnode): void;
/**
 * copy repeatData from parentVnode to children
 *
 * @param {Vnode} vnode
 * @param {*} [repeatData]
 * @returns {void}
 */
export declare function copyRepeatData(vnode: Vnode, repeatData?: any): void;
/**
 * build props
 *
 * @param {*} prop
 * @param {IComponent} vm
 * @returns {*}
 * @memberof CompileUtil
 */
export declare function buildProps(prop: any, vm: IComponent): any;
/**
 * set value from vm
 *
 * @export
 * @param {*} vm
 * @param {string} exp
 * @param {*} value
 */
export declare function setVMVal(vm: any, exp: string, value: any): void;
