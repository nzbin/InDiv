import { IWatcher } from './watcher';
import { ILifecycle } from './lifecycle';

export type ComponentList<C> = {
    dom: Element;
    props: any;
    scope: C;
};

export interface IComponent<State = any, Props = any, Vm = any> extends ILifecycle<Vm> {
    state?: State | any;
    props?: Props | any;
    $renderDom?: Element;
    $vm?: Vm | any;
    $template?: string;
    $components?: {
        [name: string]: Function;
    };
    $componentList?: ComponentList<IComponent<any, any, any>>[];
    stateWatcher?: IWatcher;
    propsWatcher?: IWatcher;

    esOnInit?(): void;
    $watchData?(): void;
    esBeforeMount?(): void;
    esAfterMount?(): void;
    esOnDestory?(): void;
    esHasRender?(): void;
    esWatchState?(oldData?: any, newData?: any): void;
    esRouteChange?(lastRoute: string, newRoute: string): void;
    $render(): void;
    $reRender(): void;
    $mountComponent(dom: Element, isFirstRender?: boolean): void;
    $componentsConstructor(dom: Element): void;
    $setState(newState: any): void;
    $setProps(newProps: any): void;
    $getLocation(): any;
    $setLocation(path: string, query?: any, params?: any): void;
    getPropsValue(valueList: any[], value: any): void;
    buildProps(prop: any): any;
    buildComponentScope(ComponentClass: any, props: any, dom: Element): IComponent<any, any, any>;
}
