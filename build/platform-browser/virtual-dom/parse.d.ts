export declare type TAttributes = {
    name: string;
    value: string;
};
export interface IPatchList {
    type?: number;
    node?: DocumentFragment | Element;
    parentNode?: Node;
    newNode?: DocumentFragment | Element;
    oldVnode?: DocumentFragment | Element;
    newValue?: TAttributes | string | number | boolean | Function;
    oldValue?: TAttributes | string | number | boolean | Function;
    eventType?: string;
    newIndex?: number;
    originVnode?: Vnode;
    changedVnode?: Vnode;
    changedValue?: TAttributes | string | number | boolean | Function;
}
/**
 * Vnode
 *
 * @class Vnode
 */
export declare class Vnode {
    tagName?: string;
    node?: DocumentFragment | Element;
    parentNode?: Node;
    attributes?: TAttributes[];
    nodeValue?: string | null;
    childNodes?: Vnode[];
    type?: string;
    value?: string | number;
    repeatData?: any;
    eventTypes?: string;
    key?: any;
    checked?: boolean;
    /**
     * Creates an instance of Vnode.
     * @param {Vnode} info
     * @memberof Vnode
     */
    constructor(info: Vnode);
}
/**
 * parse node to VNode
 *
 * @export
 * @param {(DocumentFragment | Element)} node
 * @param {((node: DocumentFragment | Element) => string[])} [shouldDiffAttributes]
 * @returns {Vnode}
 */
export declare function parseToVnode(node: DocumentFragment | Element, shouldDiffAttributes?: (node: DocumentFragment | Element) => string[]): Vnode;
