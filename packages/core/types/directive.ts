import { Injector } from '../di';
import { InDiv } from '../indiv';

export type DirectiveList<C> = {
    dom: Node;
    props: any;
    scope: C;
    constructorFunction: Function;
};


export interface IDirective {
    props?: any;
    renderNode?: Element;
    $indivInstance?: InDiv | any;

    declarationMap?: Map<string, Function>;
    directiveList?: DirectiveList<IDirective>[];
    otherInjector?: Injector;
    privateInjector?: Injector;

    nvOnInit?(): void;
    nvBeforeMount?(): void;
    nvAfterMount?(): void;
    nvOnDestory?(): void;
    nvHasRender?(): void;
    nvRouteChange?(lastRoute: string, newRoute: string): void;
    nvReceiveProps?(nextProps: any): void;
}
