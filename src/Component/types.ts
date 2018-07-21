import { IWatcher } from '../Watcher/types';
import { ILifecycle } from '../Lifecycle/types';

export * from '../Service/types';
export * from '../Watcher/types';
export * from '../Compile/types';

export type ComponentList = {
    dom: Element;
    props: any;
    scope: IComponent<any, any, any>;
  }


export interface IComponent<State = any, Props = any, Vm = any> extends ILifecycle<Vm> {
    state: State | any;
    props: Props | any;
    $renderDom: Element;
    $globalContext: any;
    $vm: Vm | any;
    $template: string;
    $components: any;
    $componentList: ComponentList[];
    stateWatcher: IWatcher;
    propsWatcher?: IWatcher;

    $bootstrap(): void;
    $beforeInit?(): void;
    $routeChange?(lastRoute: string, newRoute: string): void;
    $render(): void;
    $reRender(): void;
    $mountComponent(dom: Element, isFirstRender?: boolean): void;
    $componentsConstructor(dom: Element): void;
    $setState(newState: any): void;
    $setProps(newProps: any): void;
    $setGlobalContext(newGlobalContext: any): void;
    getPropsValue(valueList: any[], value: any): void;
    buildProps(prop: any): any;
    buildComponentScope(ComponentClass: any, props: any, dom: Element): IComponent<any, any, any>;
    createInjector(ComponentClass: IComponent): any[];
}
