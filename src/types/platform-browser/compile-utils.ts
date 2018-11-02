export interface ICompileUtil {
    [index: string]: any;
    $fragment?: Element | DocumentFragment;
    _getValueByValue(vm: any, exp: string, key: string): any;
    _getVMVal(vm: any, exp: string): any;
    _getVMRepeatVal(vm: any, exp: string): void;
    _getVMFunction(vm: any, exp: string): Function;
    _getVMFunctionArguments(vm: any, exp: string, node: Element): any[];
    bind(node: Element, vm: any, exp: string, dir: string): void;
    templateUpdater(node: any, vm: any, exp: string): void;
    modelUpdater(node: Element, value: any, exp: string, vm: any): void;
    textUpdater(node: Element, value: any): void;
    htmlUpdater(node: Element, value: any): void;
    ifUpdater(node: Element, value: any): void;
    classUpdater(node: Element, value: any): void;
    keyUpdater(node: Element, value: any): void;
    commonUpdater(node: Element, value: any, dir: string): void;
    repeatUpdater(node: Element, value: any, expFather: string, vm: any): void;
    repeatChildrenUpdater(node: Element, value: any, expFather: string, index: number, vm: any, watchValue: any): void;
    eventHandler(node: Element, vm: any, exp: string, eventName: string): void;
    isDirective(attr: string): boolean;
    isEventDirective(event: string): boolean;
    isElementNode(node: Element): boolean;
    isRepeatNode(node: Element): boolean;
    isRepeatProp(node: Element): boolean;
    isTextNode(node: Element): boolean;
    cloneNode(node: Element, repeatData?: any): Node;
}
