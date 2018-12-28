import { Injector } from '../di';
import { InDiv } from '../indiv';

export type DirectiveList<C> = {
    nativeElement: any;
    inputs: any;
    instanceScope: C;
    constructorFunction: Function;
};


export interface IDirective {
    _save_inputs?: any;
    nativeElement?: Element | any;
    $indivInstance?: InDiv | any;

    declarationMap?: Map<string, Function>;
    inputsMap?: Map<string, string>;
    directiveList?: DirectiveList<IDirective>[];
    otherInjector?: Injector;
    privateInjector?: Injector;

    nvOnInit?(): void;
    nvBeforeMount?(): void;
    nvAfterMount?(): void;
    nvOnDestory?(): void;
    nvHasRender?(): void;
    nvRouteChange?(lastRoute: string, newRoute: string): void;
    nvReceiveInputs?(nextInputs: any): void;
}
