import { IWatcher } from './watcher';
import { ICompileUtil } from './compileUtils';
import { IUtil } from './utils';

export type ComponentList<C> = {
    dom: Element;
    props: any;
    scope: C;
};

export interface SetState {
    (newState: any): void;
}
  
export interface GetLocation {
    (): any;
}
  
export interface SetLocation {
    (path: string, query?: any, params?: any): void;
}

export interface IComponent<State = any, Props = any, Vm = any> {
    state?: State | any;
    props?: Props | any;
    utils: IUtil;
    compileUtil: ICompileUtil;
    renderDom?: Element;
    $vm?: Vm | any;
    $template?: string;
    $components?: {
        [name: string]: Function;
    };
    $componentList?: ComponentList<IComponent<any, any, any>>[];
    stateWatcher?: IWatcher;
    propsWatcher?: IWatcher;

    esOnInit?(): void;
    watchData?(): void;
    esBeforeMount?(): void;
    esAfterMount?(): void;
    esOnDestory?(): void;
    esHasRender?(): void;
    esWatchState?(oldData?: any, newData?: any): void;
    esRouteChange?(lastRoute: string, newRoute: string): void;
    esReceiveProps?(nextProps: Props): void;
    render(): void;
    reRender(): void;
    mountComponent(dom: Element, isFirstRender?: boolean): void;
    componentsConstructor(dom: Element): void;
    setState(newState: any): void;
    // setProps(newProps: any): void;
    getLocation(): any;
    setLocation(path: string, query?: any, params?: any): void;
    getPropsValue(valueList: any[], value: any): void;
    buildProps(prop: any): any;
    buildComponentScope(ComponentClass: any, props: any, dom: Element): IComponent<any, any, any>;
}
