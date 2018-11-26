import { CompileUtil } from '../platform-browser';
import { Injector } from '../di';
import { Watcher } from '../watcher';

export type DirectiveList<C> = {
    dom: Node;
    props: any;
    scope: C;
    constructorFunction: Function;
};


export interface IDirective<Props = any, Vm = any> {
    props?: Props | any;
    compileUtil: CompileUtil;
    renderDom?: Element;
    $vm?: Vm | any;
    stateWatcher?: Watcher;

    $template?: string;
    $declarationMap?: Map<string, Function>;
    $providerList?: Map<Function | string, Function | any>;
    $directiveList?: DirectiveList<IDirective<any, any>>[];
    otherInjector?: Injector;

    nvOnInit?(): void;
    nvBeforeMount?(): void;
    nvAfterMount?(): void;
    nvOnDestory?(): void;
    nvHasRender?(): void;
    nvRouteChange?(lastRoute: string, newRoute: string): void;
    nvReceiveProps?(nextProps: Props): void;
}
