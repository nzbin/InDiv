import { Injector } from '../di';
import { InDiv } from '../indiv';

export type DirectiveList<C> = {
    nativeElement: any;
    props: any;
    scope: C;
    constructorFunction: Function;
};


export interface IDirective {
    props?: any;
    nativeElement?: Element | any;
    $indivInstance?: InDiv | any;

    declarationMap?: Map<string, Function>;
    inputPropsMap?: Map<string, string>;
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
