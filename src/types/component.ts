import { IWatcher } from './watcher';
import { ICompileUtil } from './compileUtils';
import { IUtil } from './utils';

export type ComponentList<C> = {
    dom: Element;
    props: any;
    scope: C;
};

export type SetState = <S>(newState: { [key: string]: S }) => void;

export type GetLocation = () => {
  path?: string;
  query?: {
    [props: string]: any;
  };
  params?: {
    [props: string]: any;
  };
  data?: any;
};

export type SetLocation = <Q = any, P = any>(path: string, query?: Q, params?: P, title?: string) => void;

export interface IComponent<State = any, Props = any, Vm = any> {
    state?: State | any;
    props?: Props | any;
    utils: IUtil;
    compileUtil: ICompileUtil;
    renderDom?: Element;
    $vm?: Vm | any;
    stateWatcher?: IWatcher;

    $template?: string;
    $components?: Function[];
    $componentList?: ComponentList<IComponent<any, any, any>>[];

    setState?: SetState;
    getLocation?: GetLocation;
    setLocation?: SetLocation;

    nvOnInit?(): void;
    watchData?(): void;
    nvBeforeMount?(): void;
    nvAfterMount?(): void;
    nvOnDestory?(): void;
    nvHasRender?(): void;
    nvWatchState?(oldData?: any, newData?: any): void;
    nvRouteChange?(lastRoute: string, newRoute: string): void;
    nvReceiveProps?(nextProps: Props): void;
    render(): void;
    reRender(): void;
    mountComponent(dom: Element, isFirstRender?: boolean): void;
    componentsConstructor(dom: Element): void;
    getPropsValue(valueList: any[], value: any): void;
    buildProps(prop: any): any;
    buildComponentScope(ComponentClass: any, props: any, dom: Element): IComponent<any, any, any>;
}
