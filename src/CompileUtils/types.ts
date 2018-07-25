// export interface ICompileUtilForRepeat {
//     [index: string]: any;
//     $fragment?: Element | DocumentFragment;
//     _getVMVal(vm: any, exp: string): any;
//     _getVMRepeatVal(val: any, exp: string, key: string): any;
//     bind(node: Element, val?: any, key?: string, dir?: string, exp?: string, index?: number, vm?: any, watchData?: any): void;
//     templateUpdater(node: Element, val?: any, key?: string, vm?: any): void;
//     textUpdater(node: Element, value: any): void;
//     htmlUpdater(node: Element, value: any): void;
//     ifUpdater(node: Element, value: any): void;
//     classUpdater(node: Element, value: any, oldValue: any): void;
//     modelUpdater(node: Element, value: any, exp: string, key: string, index: number, watchValue: any, watchData: any, vm: any): void;
//     eventHandler(node: Element, vm: any, exp: string, eventName: string, key: string, val: any): void;
// }

// export interface ICompileUtil {
//     [index: string]: any;
//     $fragment?: Element | DocumentFragment;
//     _getVMVal(vm: any, exp: string): any;
//     _getVMRepeatVal(vm: any, exp: string): void;
//     _setVMVal(vm: any, exp: string, value: any): void;
//     bind(node: Element, vm: any, exp: string, dir: string): void;
//     templateUpdater(node: any, vm: any, exp: string): void;
//     textUpdater(node: Element, value: any): void;
//     htmlUpdater(node: Element, value: any): void;
//     ifUpdater(node: Element, value: any): void;
//     classUpdater(node: Element, value: any, oldValue: any): void;
//     modelUpdater(node: Element, value: any, exp: string, vm: any): void;
//     repeatUpdater(node: Element, value: any, expFather: string, vm: any): void;
//     repeatChildrenUpdater(node: Element, value: any, expFather: string, index: number, vm: any): void;
//     isDirective(attr: string): boolean;
//     isEventDirective(event: string): boolean;
//     isElementNode(node: Element): boolean;
//     isRepeatNode(node: Element): boolean;
//     isIfNode(node: Element): boolean;
//     isRepeatProp(node: Element): boolean;
// }
