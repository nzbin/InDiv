import { IWatcher } from './watcher';
import { ICompileUtil } from './platform-browser/compile-utils';

export type ComponentList<C> = {
    dom: Node;
    props: any;
    scope: C;
    constructorFunction: Function;
};

export type SetState = <S>(newState: { [key: string]: S }) => void;

export interface IComponent<State = any, Props = any, Vm = any> {
    state?: State | any;
    props?: Props | any;
    compileUtil: ICompileUtil;
    renderDom?: Element;
    $vm?: Vm | any;
    stateWatcher?: IWatcher;

    $template?: string;
    $components?: Function[];
    $providerList?: Map<Function | string, Function | any>;
    $componentList?: ComponentList<IComponent<any, any, any>>[];

    nvOnInit?(): void;
    watchData?(): void;
    nvBeforeMount?(): void;
    nvAfterMount?(): void;
    nvOnDestory?(): void;
    nvHasRender?(): void;
    nvWatchState?(oldState?: any): void;
    nvRouteChange?(lastRoute: string, newRoute: string): void;
    nvReceiveProps?(nextProps: Props): void;
    render?(): Promise<IComponent<State, Props, Vm>>;
    reRender?(): Promise<IComponent<State, Props, Vm>>;
}
