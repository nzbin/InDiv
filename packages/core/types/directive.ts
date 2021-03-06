import { Injector } from '../di';
import { InDiv } from '../indiv';
import { TProviders } from './nv-module';

export type DirectiveList = {
    nativeElement: any;
    inputs: any;
    instanceScope: IDirective;
    constructorFunction: Function;
    isFromContent: boolean;
};


export interface IDirective {
    [key: string]: any;
    _save_inputs?: any;
    nativeElement?: Element | any;
    $indivInstance?: InDiv | any;
    declarationMap?: Map<string, Function>;
    inputsList?: { propertyName: string; inputName: string; }[];
    directiveList?: DirectiveList[];
    otherInjector?: Injector;
    privateInjector?: Injector;
    privateProviders?: TProviders;

    nvOnInit?(): void;
    nvBeforeMount?(): void;
    nvAfterMount?(): void;
    nvOnDestory?(): void;
    nvHasRender?(): void;
    nvReceiveInputs?(nextInputs: any): void;
}
