// import { IWatcher } from '../Watcher/types';
// import { ILifecycle } from '../Lifecycle/types';

// import Lifecycle from '../Lifecycle';
// import Watcher from '../Watcher';

export { default as Service } from '../Service';
export * from '../Watcher';

export type ComponentList<C> = {
    dom: Element;
    props: any;
    scope: C;
}


// export interface IComponent<State = any, Props = any, Vm = any> extends Lifecycle<Vm> {
//     state?: State | any;
//     props?: Props | any;
//     $renderDom?: Element;
//     $globalContext?: any;
//     $vm?: Vm | any;
//     $template?: string;
//     $components?: any;
//     $componentList?: ComponentList<IComponent<any, any, any>>[];
//     stateWatcher?: Watcher;
//     propsWatcher?: Watcher;

//     $bootstrap(): void;
//     $beforeInit?(): void;
//     $routeChange?(lastRoute: string, newRoute: string): void;
//     $render(): void;
//     $reRender(): void;
//     $mountComponent(dom: Element, isFirstRender?: boolean): void;
//     $componentsConstructor(dom: Element): void;
//     $setState(newState: any): void;
//     $setProps(newProps: any): void;
//     $setGlobalContext(newGlobalContext: any): void;
//     getPropsValue(valueList: any[], value: any): void;
//     buildProps(prop: any): any;
//     buildComponentScope(ComponentClass: any, props: any, dom: Element): IComponent<any, any, any>;
//     createInjector(ComponentClass: IComponent): any[];
// }
