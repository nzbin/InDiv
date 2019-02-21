import { DirectiveList } from './directive';
import { Injector } from '../di';
import { InDiv } from '../indiv';
import { Vnode, ParseOptions } from '../vnode';
import { Compile } from '../compile';
export declare type TComAndDir = {
    components: {
        nativeElement: any;
        inputs: any;
        name: string;
    }[];
    directives: {
        nativeElement: any;
        inputs: any;
        name: string;
    }[];
};
export declare type ComponentList = {
    nativeElement: any;
    inputs: any;
    instanceScope: IComponent;
    constructorFunction: Function;
};
export interface IComponent {
    _save_inputs?: any;
    nativeElement?: Element | any;
    $indivInstance?: InDiv;
    dependencesList?: string[];
    watchStatus?: 'pending' | 'available';
    isWaitingRender?: boolean;
    compileInstance?: Compile;
    template?: string;
    declarationMap?: Map<string, Function>;
    inputsList?: {
        propertyName: string;
        inputName: string;
    }[];
    viewChildList?: {
        propertyName: string;
        selector: string | Function;
    }[];
    viewChildrenList?: {
        propertyName: string;
        selector: string | Function;
    }[];
    componentList?: ComponentList[];
    directiveList?: DirectiveList[];
    otherInjector?: Injector;
    privateInjector?: Injector;
    parseVnodeOptions?: ParseOptions;
    templateVnode?: Vnode[];
    saveVnode?: Vnode[];
    nvOnInit?(): void;
    watchData?(): void;
    nvBeforeMount?(): void;
    nvAfterMount?(): void;
    nvOnDestory?(): void;
    nvHasRender?(): void;
    nvDoCheck?(oldState?: any): void;
    nvReceiveInputs?(nextInputs: any): void;
    render?(): Promise<IComponent>;
    compiler?(nativeElement: Element | any, componentInstace: IComponent): Promise<IComponent>;
}
