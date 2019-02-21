import { IComponent } from "../types";
import { Vnode, TAttributes } from "../vnode";
/**
 * compile util for Compiler
 *
 * @export
 * @class CompileUtil
 */
export declare class CompileUtil {
    [index: string]: any;
    fragment?: Vnode[];
    /**
     * Creates an instance of CompileUtil.
     *
     * @param {Vnode[]} [fragment]
     *  @memberof CompileUtil
     */
    constructor(fragment?: Vnode[]);
    /**
     * get value by repeat value
     *
     * @param {*} vm
     * @param {string} exp
     * @returns {void}
     * @memberof CompileUtil
     */
    _getVMRepeatVal(vm: any, exp: string): void;
    /**
     * bind handler for nv irective
     *
     * if node is repeat node and it will break compile and into CompileRepeatUtil
     *
     * @param {Vnode} vnode
     * @param {*} vm
     * @param {string} exp
     * @param {string} dir
     * @memberof CompileUtil
     */
    bind(vnode: Vnode, vm: IComponent, exp: string, dir: string): void;
    /**
     * update text for {{}}
     *
     * @param Vnode node
     * @param {*} vm
     * @param {string} exp
     * @memberof CompileUtil
     */
    templateUpdater(vnode: Vnode, vm: any, exp: string): void;
    /**
     * update value of input for nv-model
     *
     * @param {Vnode} vnode
     * @param {*} value
     * @param {string} exp
     * @param {*} vm
     * @memberof CompileUtil
     */
    modelUpdater(vnode: Vnode, value: any, exp: string, vm: any): void;
    /**
     * update text for nv-text
     *
     * @param {Vnode} vnode
     * @param {*} value
     * @returns {void}
     * @memberof CompileUtil
     */
    textUpdater(vnode: Vnode, value: any): void;
    /**
     * remove or show for nv-if
     *
     * @param {Vnode} vnode
     * @param {*} value
     * @memberof CompileUtil
     */
    ifUpdater(vnode: Vnode, value: any): void;
    /**
     * update class for nv-class
     *
     * @param {Vnode} vnode
     * @param {*} value
     * @returns {void}
     * @memberof CompileUtil
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
     * update value of node for nv-value
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
     * update repeat Vnode for nv-repeat
     *
     * if it has child and it will into repeatChildrenUpdater
     *
     * @param {Vnode} vnode
     * @param {*} value
     * @param {string} expFather
     * @param {*} vm
     * @memberof CompileUtil
     */
    repeatUpdater(vnode: Vnode, value: any, expFather: string, vm: any): void;
    /**
     * update all child value by repeat key
     *
     * @param {Vnode} vnode
     * @param {*} value
     * @param {string} expFather
     * @param {number} index
     * @param {*} vm
     * @param {*} watchValue
     * @memberof CompileUtil
     */
    repeatChildrenUpdaterByKey(vnode: Vnode, value: any, expFather: string, index: number, vm: any, watchValue: any): void;
    /**
     * update child if child has nv-repeat directive
     *
     * @param {Vnode} vnode
     * @param {*} vm
     * @memberof CompileUtil
     */
    repeatChildrenUpdater(vnode: Vnode, vm: any): void;
    /**
     * compile event and build eventType in Vnode
     *
     * @param {Vnode} vnode
     * @param {*} vm
     * @param {string} exp
     * @param {string} eventName
     * @memberof Compile
     */
    eventHandler(vnode: Vnode, vm: any, exp: string, eventName: string): void;
    /**
     * handler props
     *
     * @param {Vnode} vnode
     * @param {*} vm
     * @param {TAttributes} attr
     * @param {string} prop
     * @memberof CompileUtil
     */
    propHandler(vnode: Vnode, vm: any, attr: TAttributes): void;
}
