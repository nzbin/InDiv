export interface IVnode {
    tagName?: string;
    node?: DocumentFragment | Element;
    parentNode?: Node;
    attributes?: IAttributes[];
    nodeValue?: string | null;
    childNodes?: IVnode[] | any[];
    type?: string;
}

export interface IAttributes {
    name: string;
    value: string;
}

export interface IPatchList {
    type?: number;
    node?: DocumentFragment | Element;
    parentNode?: Node;
    newNode?: DocumentFragment | Element;
    oldVnode?: DocumentFragment | Element;
    newValue?: IAttributes | string;
    oldValue?: IAttributes | string;
}

export interface IParseToVnode {
    (node: DocumentFragment | Element): IVnode;
}

export interface IDiffVnode {
    (oldVnode: IVnode, newVnode: IVnode, patchList: IPatchList[]): void;
}

export interface IRenderVnode {
    (patchList: IPatchList[]): void;
}

export interface IVirtualDOM {
    parseToVnode: IParseToVnode,
    diffVnode: IDiffVnode,
    renderVnode: IRenderVnode,
}
