export interface IVnode {
    tagName?: string;
    node?: Element;
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
    node?: Element;
    parentNode?: Node;
    newNode?: Element;
    oldVnode?: Element;
    newValue?: IAttributes | string;
    oldValue?: IAttributes | string;
}

export interface IParseToVnode {
    (node: Element): IVnode;
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
