import { Vnode, TAttributes } from "../vnode";
/**
 * compile util for nv-repeat DOM
 *
 * @export
 * @class CompileRepeatUtil
 */
export declare class CompileRepeatUtil {
    fragment?: Vnode[];
    /**
     * Creates an instance of CompileRepeatUtil.
     *
     * @param {Vnode[]} [fragment]
     * @memberof CompileRepeatUtil
     */
    constructor(fragment?: Vnode[]);
    /**
     * get value by repeat value
     *
     * @param {*} val
     * @param {string} exp
     * @param {string} key
     * @returns {*}
     * @memberof CompileRepeatUtil
     */
    _getVMRepeatVal(val: any, exp: string, key: string): any;
    /**
     * set value by key and anthor value
     *
     * @param {*} vm
     * @param {string} exp
     * @param {string} key
     * @param {*} setValue
     * @returns {*}
     * @memberof CompileRepeatUtil
     */
    _setValueByValue(vm: any, exp: string, key: string, setValue: any): any;
    /**
     * bind handler for nv irective
     *
     * @param {Vnode} vnode
     * @param {string} [key]
     * @param {string} [dir]
     * @param {string} [exp]
     * @param {number} [index]
     * @param {*} [vm]
     * @param {*} [watchValue]
     * @memberof CompileRepeatUtil
     */
    bind(vnode: Vnode, key?: string, dir?: string, exp?: string, index?: number, vm?: any, watchValue?: any, val?: any): void;
    /**
     * update text for {{}}
     *
     * @param {Vnode} vnode
     * @param {*} [val]
     * @param {string} [key]
     * @param {*} [vm]
     * @memberof CompileRepeatUtil
     */
    templateUpdater(vnode: Vnode, val?: any, key?: string, vm?: any): void;
    /**
     * update value of input for nv-model
     *
     * @param {Vnode} vnode
     * @param {*} value
     * @param {string} exp
     * @param {string} key
     * @param {number} index
     * @param {*} watchData
     * @param {*} vm
     * @memberof CompileRepeatUtil
     */
    modelUpdater(vnode: Vnode, value: any, exp: string, key: string, index: number, watchData: any, vm: any): void;
    /**
     * update text for nv-text
     *
     * @param {Vnode} vnode
     * @param {*} value
     * @returns {void}
     * @memberof CompileRepeatUtil
     */
    textUpdater(vnode: Vnode, value: any): void;
    /**
     * remove or show DOM for nv-if
     *
     * @param {Vnode} vnode
     * @param {*} value
     * @param {*} vm
     * @memberof CompileRepeatUtil
     */
    ifUpdater(vnode: Vnode, value: any, vm: any): void;
    /**
     * update class for nv-class
     *
     * @param {Vnode} vnode
     * @param {*} value
     * @returns {void}
     * @memberof CompileRepeatUtil
     */
    classUpdater(vnode: Vnode, value: any): void;
    /**
     * update value of repeat node for nv-key
     *
     * @param {Vnode} vnode
     * @param {*} value
     * @memberof CompileRepeatUtil
     */
    keyUpdater(vnode: Vnode, value: any): void;
    /**
     * update value of repeat node for nv-value
     *
     * @param {Vnode} vnode
     * @param {*} value
     * @memberof CompileRepeatUtil
     */
    valueUpdater(vnode: Vnode, value: any): void;
    /**
     * commonUpdater for nv directive except repeat model text if class
     *
     * @param {Vnode} vnode
     * @param {*} value
     * @param {string} dir
     * @memberof CompileUtil
     */
    commonUpdater(vnode: Vnode, value: any, dir: string): void;
    /**
     * compile event and build eventType in DOM
     *
     * @param {Vnode} vnode
     * @param {*} vm
     * @param {string} exp
     * @param {string} eventName
     * @param {string} key
     * @param {*} val
     * @memberof CompileRepeatUtil
     */
    eventHandler(vnode: Vnode, vm: any, exp: string, eventName: string, key: string, val: any): void;
    /**
     * handle prop
     *
     * @param {Vnode} vnode
     * @param {*} vm
     * @param {TAttributes} attr
     * @param {string} prop
     * @memberof CompileRepeatUtil
     */
    propHandler(vnode: Vnode, vm: any, attr: TAttributes): void;
}
