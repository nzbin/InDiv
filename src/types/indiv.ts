import { IComponent } from './component';
import { INvModule } from './nvModule';

export interface IMiddleware<ES> {
    bootstrap(vm: ES): void;
}

export type EsRouteObject = {
    path: string;
    query?: {
        [props: string]: any;
    };
    data?: any;
};

export interface IInDiv {
    modalList: IMiddleware<IInDiv>[];
    rootDom: Element;
    $rootPath: string;
    $canRenderModule: boolean;
    $routeDOMKey: string;
    $rootModule: INvModule;
    $declarations: Function[];
    $esRouteObject?: EsRouteObject;
    $esRouteParmasObject?: {
        [props: string]: any;
    };

    use(modal: IMiddleware<IInDiv>): number;
    setRootPath(rootPath: string): void;
    bootstrapModule(Esmodule: Function): void;
    init(): void;
    renderModuleBootstrap(): void;
    renderComponent(BootstrapComponent: Function, renderDOM: Element): Promise<IComponent>;
    replaceDom(component: IComponent, renderDOM: Element): Promise<IComponent>;
}
