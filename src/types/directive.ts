import { IWatcher } from './watcher';
import { ICompileUtil } from './platform-browser/compile-utils';
import { Injector } from '../di';

export type DirectiveList<C> = {
    dom: Node;
    props: any;
    scope: C;
    constructorFunction: Function;
};


export interface IDirective<State = any, Props = any, Vm = any> {
    state?: State | any;
    props?: Props | any;
    compileUtil: ICompileUtil;
    renderDom?: Element;
    $vm?: Vm | any;
    stateWatcher?: IWatcher;

    $template?: string;
    $declarationMap?: Map<string, Function>;
    $providerList?: Map<Function | string, Function | any>;
    $directiveList?: DirectiveList<IDirective<any, any, any>>[];
    otherInjector?: Injector;

    nvOnInit?(): void;
    nvBeforeMount?(): void;
    nvAfterMount?(): void;
    nvOnDestory?(): void;
    nvHasRender?(): void;
    nvRouteChange?(lastRoute: string, newRoute: string): void;
    nvReceiveProps?(nextProps: Props): void;
}
