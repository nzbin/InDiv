import { DirectiveList, IDirective } from './directive';
import { Watcher } from '../watcher';
import { Injector } from '../di';

export type ComponentList<C> = {
    dom: Node;
    props: any;
    scope: C;
    constructorFunction: Function;
    hasRender: boolean;
};

export type SetState = (newState: any) => void;

export interface IComponent<State = any, Props = any, Vm = any> {
    state?: State | any;
    props?: Props | any;
    renderDom?: Element;
    $vm?: Vm | any;
    stateWatcher?: Watcher;

    $template?: string;
    $declarationMap?: Map<string, Function>;
    $componentList?: ComponentList<IComponent<any, any, any>>[];
    $directiveList?: DirectiveList<IDirective<any, any>>[];
    otherInjector?: Injector;
    privateInjector?: Injector;

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
