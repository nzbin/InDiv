import { IComponent } from './component';
import { INvModule } from './esModule';
import { IService } from './service';
import { IUtil } from './utils';

export interface IMiddleware<ES> {
    bootstrap(vm: ES): void;
}

export type EsRouteObject = {
    path: string;
    query?: any;
    params?: any;
};

export interface IInDiv {
    modalList: IMiddleware<IInDiv>[];
    utils: IUtil;
    rootDom: Element;
    $rootPath: string;
    $canRenderModule: boolean;
    $routeDOMKey: string;
    $rootModule: INvModule;
    $components: {
        [name: string]: Function;
    };
    $esRouteObject?: EsRouteObject;

    use(modal: IMiddleware<IInDiv>): number;
    setRootPath(rootPath: string): void;
    bootstrapModule(Esmodule: Function): void;
    init(): void;
    renderModuleBootstrap(): void;
    // renderComponent(BootstrapComponent: Function, renderDOM: Element): Promise<any>;
    renderComponent(BootstrapComponent: Function, renderDOM: Element): any;
    replaceDom(component: IComponent, renderDOM: Element): void;
    // replaceDom(component: IComponent, renderDOM: Element): Promise<any>;
}
