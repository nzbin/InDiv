import { Injector } from '../di';

export type DirectiveList<C> = {
    dom: Node;
    props: any;
    scope: C;
    constructorFunction: Function;
};


export interface IDirective<Props = any, Vm = any> {
    props?: Props | any;
    renderDom?: Element;
    $vm?: Vm | any;

    $declarationMap?: Map<string, Function>;
    $directiveList?: DirectiveList<IDirective<any, any>>[];
    otherInjector?: Injector;
    privateInjector?: Injector;

    nvOnInit?(): void;
    nvBeforeMount?(): void;
    nvAfterMount?(): void;
    nvOnDestory?(): void;
    nvHasRender?(): void;
    nvRouteChange?(lastRoute: string, newRoute: string): void;
    nvReceiveProps?(nextProps: Props): void;
}
