import { IVnode } from './virtual-dom';

export interface ICompile {
    $vm: any;
    $el: Element;
    $fragment: DocumentFragment;

    init(): void;
    needDiffChildCallback(oldVnode: IVnode, newVnode: IVnode): boolean;
    compileElement(fragment: DocumentFragment): void;
    recursiveDOM(childNodes: NodeListOf<Node & ChildNode>, fragment: DocumentFragment | Element): void;
    compile(node: Element, fragment: DocumentFragment | Element): void;
    node2Fragment(): DocumentFragment;
    compileText(node: Element, exp: string): void;
    isDirective(attr: string): boolean;
    isEventDirective(eventName: string): boolean;
    isElementNode(node: Element | string): boolean;
    isRepeatNode(node: Element): boolean;
    isTextNode(node: Element): boolean;
}
