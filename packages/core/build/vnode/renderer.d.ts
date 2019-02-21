import { Vnode } from './vnode';
import { ParseOptions } from './parse';
/**
 * Renderer in Indiv
 *
 * can rewrite your Render for different platform
 *
 * if you want to rewirte a renderer, please implements this abstract class
 *
 * @export
 * @abstract
 * @class Renderer
 */
export declare abstract class Renderer {
    /**
     * parse nativeElement to Vnode[]
     *
     * @abstract
     * @param {*} nativeElement
     * @param {ParseOptions} [parseVnodeOptions]
     * @returns {Vnode[]}
     * @memberof Renderer
     */
    abstract nativeElementToVnode(nativeElement: any, parseVnodeOptions?: ParseOptions): Vnode[];
    /**
     * get nativeElement by TagName
     *
     * @abstract
     * @param {string} name
     * @returns {any[]}
     * @memberof Renderer
     */
    abstract getElementsByTagName(name: string): any;
    /**
     * check nativeElement has childnodes or not
     *
     * @abstract
     * @param {*} nativeElement
     * @returns {boolean}
     * @memberof Renderer
     */
    abstract hasChildNodes(nativeElement: any): boolean;
    /**
     * get childnodes by nativeElement
     *
     * @abstract
     * @param {*} nativeElement
     * @returns {any[]}
     * @memberof Renderer
     */
    abstract getChildNodes(nativeElement: any): any[];
    /**
     * remove child from nativeElement
     *
     * @abstract
     * @param {*} parent
     * @param {*} child
     * @memberof Renderer
     */
    abstract removeChild(parent: any, child: any): void;
    /**
     * append child to nativeElement
     *
     * @abstract
     * @param {*} parent
     * @param {*} child
     * @memberof Renderer
     */
    abstract appendChild(parent: any, child: any): void;
    /**
     * insert child to nativeElement by index
     *
     * @abstract
     * @param {*} parent
     * @param {*} child
     * @param {number} index
     * @memberof Renderer
     */
    abstract insertBefore(parent: any, child: any, index: number): void;
    /**
     * check parent nativeElement is containted with child nativeElement
     *
     * @abstract
     * @param {*} parent
     * @param {*} child
     * @returns {boolean}
     * @memberof Renderer
     */
    abstract isContainted(parent: any, child: any): boolean;
    /**
     * create nativeElement by tagName
     *
     * @abstract
     * @param {string} tagName
     * @returns {*}
     * @memberof Renderer
     */
    abstract creatElement(tagName: string): any;
    /**
     * create nativeElement by value
     *
     * @abstract
     * @param {string} value
     * @returns {*}
     * @memberof Renderer
     */
    abstract creatTextElement(value: string): any;
    /**
     * get attribute by name from nativeElement
     *
     * @abstract
     * @param {*} element
     * @param {string} name
     * @returns {*}
     * @memberof Renderer
     */
    abstract getAttribute(element: any, name: string): any;
    /**
     * set attribute to nativeElement
     *
     * @abstract
     * @param {*} element
     * @param {string} name
     * @param {*} value
     * @memberof Renderer
     */
    abstract setAttribute(element: any, name: string, value: any): void;
    /**
     * set nv attribute to nativeElement
     *
     * @abstract
     * @param {*} element
     * @param {string} name
     * @param {*} value
     * @memberof Renderer
     */
    abstract setNvAttribute(element: any, name: string, value: any): void;
    /**
     * remove attribute from nativeElement
     *
     * @abstract
     * @param {*} element
     * @param {string} name
     * @param {*} [value]
     * @memberof Renderer
     */
    abstract removeAttribute(element: any, name: string, value?: any): void;
    /**
     * remove nv attribute from nativeElement
     *
     * @abstract
     * @param {*} element
     * @param {string} name
     * @param {*} [value]
     * @memberof Renderer
     */
    abstract removeNvAttribute(element: any, name: string, value?: any): void;
    /**
     * set nodeValue to nativeElement
     *
     * @abstract
     * @param {*} element
     * @param {*} nodeValue
     * @memberof Renderer
     */
    abstract setNodeValue(element: any, nodeValue: any): void;
    /**
     * set value to nativeElement like input
     *
     * @abstract
     * @param {*} element
     * @param {*} value
     * @memberof Renderer
     */
    abstract setValue(element: any, value: any): void;
    /**
     * remove eventListener from nativeElement
     *
     * @abstract
     * @param {*} element
     * @param {string} eventType
     * @param {*} handler
     * @memberof Renderer
     */
    abstract removeEventListener(element: any, eventType: string, handler: any): void;
    /**
     * add eventListener from nativeElement
     *
     * @abstract
     * @param {*} element
     * @param {string} eventType
     * @param {*} handler
     * @memberof Renderer
     */
    abstract addEventListener(element: any, eventType: string, handler: any): void;
    /**
     * set a style to nativeElement
     *
     * @abstract
     * @param {*} element
     * @param {string} name
     * @param {*} value
     * @memberof Renderer
     */
    abstract setStyle(element: any, name: string, value: any): void;
    /**
     * remove a style to nativeElement
     *
     * @abstract
     * @param {*} element
     * @param {string} name
     * @memberof Renderer
     */
    abstract removeStyle(element: any, name: string): void;
    /**
     * get a style from nativeElement
     *
     * @abstract
     * @param {*} element
     * @param {string} name
     * @memberof Renderer
     */
    abstract getStyle(element: any, name: string): void;
}
