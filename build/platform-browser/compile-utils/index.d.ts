declare global {
    interface Element {
        value?: any;
        eventTypes?: string;
        repeatData?: {
            [key: string]: any;
        };
        indiv_repeat_key?: any;
        isComponent?: boolean;
    }
    interface Node {
        eventTypes?: string;
        repeatData?: {
            [key: string]: any;
        };
        indiv_repeat_key?: any;
        isComponent?: boolean;
    }
}
/**
 * compile util for nv-repeat DOM
 *
 * @export
 * @class CompileUtilForRepeat
 */
export declare class CompileUtilForRepeat {
    [index: string]: any;
    $fragment?: Element | DocumentFragment;
    /**
     * Creates an instance of CompileUtilForRepeat.
     *
     * @param {(Element | DocumentFragment)} [fragment]
     * @memberof CompileUtilForRepeat
     */
    constructor(fragment?: Element | DocumentFragment);
    /**
     * get value by key and anthor value
     *
     * @param {*} vm
     * @param {string} exp
     * @param {string} key
     * @returns {*}
     * @memberof CompileUtilForRepeat
     */
    _getValueByValue(vm: any, exp: string, key: string): any;
    /**
     * set value by key and anthor value
     *
     * @param {*} vm
     * @param {string} exp
     * @param {string} key
     * @param {*} setValue
     * @returns {*}
     * @memberof CompileUtilForRepeat
     */
    _setValueByValue(vm: any, exp: string, key: string, setValue: any): any;
    /**
     * get value of VM
     *
     * @param {*} vm
     * @param {string} exp
     * @returns {*}
     * @memberof CompileUtilForRepeat
     */
    _getVMVal(vm: any, exp: string): any;
    /**
     * get value by repeat value
     *
     * @param {*} val
     * @param {string} exp
     * @param {string} key
     * @returns {*}
     * @memberof CompileUtilForRepeat
     */
    _getVMRepeatVal(val: any, exp: string, key: string): any;
    /**
     * get Function for vm
     *
     * @param {*} vm
     * @param {string} exp
     * @returns {Function}
     * @memberof CompileUtil
     */
    _getVMFunction(vm: any, exp: string): Function;
    /**
     * get Function arguments for vm
     *
     * @param {*} vm
     * @param {string} exp
     * @param {Element} node
     * @param {string} key
     * @param {*} val
     * @returns {any[]}
     * @memberof CompileUtilForRepeat
     */
    _getVMFunctionArguments(vm: any, exp: string, node: Element, key?: string, val?: any): any[];
    /**
     * bind handler for nv irective
     *
     * @param {Element} node
     * @param {string} [key]
     * @param {string} [dir]
     * @param {string} [exp]
     * @param {number} [index]
     * @param {*} [vm]
     * @param {*} [watchValue]
     * @memberof CompileUtilForRepeat
     */
    bind(node: Element, key?: string, dir?: string, exp?: string, index?: number, vm?: any, watchValue?: any, val?: any): void;
    /**
     * update text for {{}}
     *
     * @param {Element} node
     * @param {*} [val]
     * @param {string} [key]
     * @param {*} [vm]
     * @memberof CompileUtilForRepeat
     */
    templateUpdater(node: Element, val?: any, key?: string, vm?: any): void;
    /**
     * update value of input for nv-model
     *
     * @param {Element} node
     * @param {*} value
     * @param {string} exp
     * @param {string} key
     * @param {number} index
     * @param {*} watchData
     * @param {*} vm
     * @memberof CompileUtilForRepeat
     */
    modelUpdater(node: Element, value: any, exp: string, key: string, index: number, watchData: any, vm: any): void;
    /**
     * update text for nv-text
     *
     * @param {Element} node
     * @param {*} value
     * @returns {void}
     * @memberof CompileUtilForRepeat
     */
    textUpdater(node: Element, value: any): void;
    /**
     * update html for nv-html
     *
     * @param {Element} node
     * @param {*} value
     * @memberof CompileUtilForRepeat
     */
    htmlUpdater(node: Element, value: any): void;
    /**
     * remove or show DOM for nv-if
     *
     * @param {Element} node
     * @param {*} value
     * @memberof CompileUtilForRepeat
     */
    ifUpdater(node: Element, value: any): void;
    /**
     * find exp is member of vm.state
     *
     * @param {*} vm
     * @param {string} exp
     * @returns {boolean}
     * @memberof CompileUtil
     */
    isFromState(state: any, exp: string): boolean;
    /**
     * update class for nv-class
     *
     * @param {Element} node
     * @param {*} value
     * @returns {void}
     * @memberof CompileUtilForRepeat
     */
    classUpdater(node: Element, value: any): void;
    /**
     * update value of repeat node for nv-key
     *
     * @param {Element} node
     * @param {*} value
     * @memberof CompileUtilForRepeat
     */
    keyUpdater(node: Element, value: any): void;
    /**
     * commonUpdater for nv directive except repeat model text html if class
     *
     * @param {Element} node
     * @param {*} value
     * @param {string} dir
     * @memberof CompileUtil
     */
    commonUpdater(node: Element, value: any, dir: string): void;
    /**
     * compile event and build eventType in DOM
     *
     * @param {Element} node
     * @param {*} vm
     * @param {string} exp
     * @param {string} eventName
     * @param {string} key
     * @param {*} val
     * @memberof CompileUtilForRepeat
     */
    eventHandler(node: Element, vm: any, exp: string, eventName: string, key: string, val: any): void;
}
/**
 * compile util for Compiler
 *
 * @export
 * @class CompileUtil
 */
export declare class CompileUtil {
    [index: string]: any;
    $fragment?: Element | DocumentFragment;
    /**
     * Creates an instance of CompileUtil.
     *
     * @param {(Element | DocumentFragment)} [fragment]
     *  @memberof CompileUtil
     */
    constructor(fragment?: Element | DocumentFragment);
    /**
     * get value by key and anthor value
     *
     * @param {*} vm
     * @param {string} exp
     * @param {string} key
     * @returns {*}
     * @memberof CompileUtil
     */
    _getValueByValue(vm: any, exp: string, key: string): any;
    /**
     * get value of VM
     *
     * @param {*} vm
     * @param {string} exp
     * @returns {*}
     * @memberof CompileUtil
     */
    _getVMVal(vm: any, exp: string): any;
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
     * get Function for vm
     *
     * @param {*} vm
     * @param {string} exp
     * @returns {Function}
     * @memberof CompileUtil
     */
    _getVMFunction(vm: any, exp: string): Function;
    /**
     * get Function arguments for vm
     *
     * @param {*} vm
     * @param {string} exp
     * @param {Element} node
     * @returns {any[]}
     * @memberof CompileUtil
     */
    _getVMFunctionArguments(vm: any, exp: string, node: Element): any[];
    /**
     * bind handler for nv irective
     *
     * if node is repeat node and it will break compile and into CompileUtilForRepeat
     *
     * @param {Element} node
     * @param {*} vm
     * @param {string} exp
     * @param {string} dir
     * @memberof CompileUtil
     */
    bind(node: Element, vm: any, exp: string, dir: string): void;
    /**
     * update text for {{}}
     *
     * @param {*} node
     * @param {*} vm
     * @param {string} exp
     * @memberof CompileUtil
     */
    templateUpdater(node: any, vm: any, exp: string): void;
    /**
     * update value of input for nv-model
     *
     * @param {Element} node
     * @param {*} value
     * @param {string} exp
     * @param {*} vm
     * @memberof CompileUtil
     */
    modelUpdater(node: Element, value: any, exp: string, vm: any): void;
    /**
     * update text for nv-text
     *
     * @param {Element} node
     * @param {*} value
     * @returns {void}
     * @memberof CompileUtil
     */
    textUpdater(node: Element, value: any): void;
    /**
     * update html for nv-html
     *
     * @param {Element} node
     * @param {*} value
     * @memberof CompileUtil
     */
    htmlUpdater(node: Element, value: any): void;
    /**
     * remove or show DOM for nv-if
     *
     * @param {Element} node
     * @param {*} value
     * @memberof CompileUtil
     */
    ifUpdater(node: Element, value: any): void;
    /**
     * update class for nv-class
     *
     * @param {Element} node
     * @param {*} value
     * @returns {void}
     * @memberof CompileUtil
     */
    classUpdater(node: Element, value: any): void;
    /**
     * update value of repeat node for nv-key
     *
     * @param {Element} node
     * @param {*} value
     * @memberof CompileUtilForRepeat
     */
    keyUpdater(node: Element, value: any): void;
    /**
     * commonUpdater for nv directive except repeat model text html if class
     *
     * @param {Element} node
     * @param {*} value
     * @param {string} dir
     * @memberof CompileUtil
     */
    commonUpdater(node: Element, value: any, dir: string): void;
    /**
     * update repeat DOM for nv-repeat
     *
     * if it has child and it will into repeatChildrenUpdater
     *
     * @param {Element} node
     * @param {*} value
     * @param {string} expFather
     * @param {*} vm
     * @memberof CompileUtil
     */
    repeatUpdater(node: Element, value: any, expFather: string, vm: any): void;
    /**
     * update child of nv-repeat DOM
     *
     * if child is an nv-repeat DOM, it will into CompileUtil repeatUpdater
     *
     * @param {Element} node
     * @param {*} value
     * @param {string} expFather
     * @param {number} index
     * @param {*} vm
     * @param {*} watchValue
     * @memberof CompileUtil
     */
    repeatChildrenUpdater(node: Element, value: any, expFather: string, index: number, vm: any, watchValue: any): void;
    /**
     * compile event and build eventType in DOM
     *
     * @param {Element} node
     * @param {*} vm
     * @param {string} exp
     * @param {string} eventName
     * @memberof Compile
     */
    eventHandler(node: Element, vm: any, exp: string, eventName: string): void;
    /**
     * judge attribute is nv directive or not
     *
     * @param {string} attr
     * @returns {boolean}
     * @memberof CompileUtil
     */
    isDirective(attr: string): boolean;
    /**
     * judge attribute is nv event directive or not
     *
     * @param {string} event
     * @returns {boolean}
     * @memberof CompileUtil
     */
    isEventDirective(event: string): boolean;
    /**
     * judge DOM is a element node or not
     *
     * @param {Element} node
     * @returns {boolean}
     * @memberof CompileUtil
     */
    isElementNode(node: Element): boolean;
    /**
     * judge DOM is nv-repeat DOM or not
     *
     * @param {Element} node
     * @returns {boolean}
     * @memberof CompileUtil
     */
    isRepeatNode(node: Element): boolean;
    /**
     * judge DOM is a Component DOM in a repeat DOM or not
     *
     * @param {Element} node
     * @returns {boolean}
     * @memberof CompileUtil
     */
    isRepeatProp(node: Element): boolean;
    /**
     * judge DOM is text node or not
     *
     * @param {Element} node
     * @returns {boolean}
     * @memberof CompileUtil
     */
    isTextNode(node: Element): boolean;
    /**
     * find exp is member of vm.state
     *
     * @param {*} vm
     * @param {string} exp
     * @returns {boolean}
     * @memberof CompileUtil
     */
    isFromState(state: any, exp: string): boolean;
    /**
     * clone Node and clone it event
     *
     * event by attribute in DOM: eventTypes
     * repeat data by attribute in DOM: repeatData
     * isComponent: clone Component need add isComponent=true
     *
     * @param {Element} node
     * @param {*} [repeatData]
     * @returns {Node}
     * @memberof CompileUtil
     */
    cloneNode(node: Element, repeatData?: any): Node;
}
/**
 * for virtual-DOM to diff attributes of nv-directive
 *
 * @export
 * @param {(DocumentFragment | Element)} node
 * @returns {string[]}
 */
export declare function shouldDiffAttributes(node: DocumentFragment | Element): string[];
