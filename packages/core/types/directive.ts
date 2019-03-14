import { Injector } from '../di';
import { InDiv } from '../indiv';

export type DirectiveList = {
    nativeElement: any;
    inputs: any;
    instanceScope: IDirective;
    constructorFunction: Function;
    isFromContent: boolean;
};


export interface IDirective {
    _save_inputs?: any;
    nativeElement?: Element | any;
    $indivInstance?: InDiv | any;
    declarationMap?: Map<string, Function>;
    inputsList?: { propertyName: string; inputName: string; }[];
    directiveList?: DirectiveList[];
    otherInjector?: Injector;
    privateInjector?: Injector;

    nvOnInit?(): void;
    nvBeforeMount?(): void;
    nvAfterMount?(): void;
    nvOnDestory?(): void;
    nvHasRender?(): void;
    nvReceiveInputs?(nextInputs: any): void;
}
