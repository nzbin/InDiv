export declare type TNvAttribute = 'attribute' | 'nv-attribute' | 'directive' | 'prop' | 'nv-event';
export declare type TEventType = {
    type: string;
    handler: Function;
    token: any;
};
export declare type TAttributes = {
    name: string;
    value: string;
    type: TNvAttribute;
    nvValue?: any;
};
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
/**
 * Vnode for diff
 *
 * @class Vnode
 */
export declare class Vnode {
    tagName?: string;
    nativeElement?: any;
    parentVnode?: Vnode;
    attributes?: TAttributes[];
    nodeValue?: string | null;
    childNodes?: Vnode[];
    type?: string;
    value?: string | number;
    repeatData?: any;
    eventTypes?: TEventType[];
    key?: any;
    checked?: boolean;
    voidElement?: boolean;
    template?: string;
    index?: number;
    /**
     * Creates an instance of Vnode.
     * @param {Vnode} options
     * @memberof Vnode
     */
    constructor(options: Vnode);
}
