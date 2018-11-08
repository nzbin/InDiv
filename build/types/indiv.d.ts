import { IComponent } from './component';
import { INvModule } from './nv-module';
export interface IMiddleware<ES> {
    bootstrap(vm: ES): void;
}
export declare type EsRouteObject = {
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
    $components: Function[];
    render?: () => Promise<IComponent>;
    reRender?: () => Promise<IComponent>;
    use(modal: IMiddleware<IInDiv>): number;
    setRootPath(rootPath: string): void;
    setComponentRender<S = any, P = any, V = any>(render?: () => Promise<IComponent<S, P, V>>, reRender?: () => Promise<IComponent<S, P, V>>): void;
    bootstrapModule(Esmodule: Function): void;
    init(): void;
    renderModuleBootstrap(): void;
    renderComponent(BootstrapComponent: Function, renderDOM: Element, loadModule?: INvModule): Promise<IComponent>;
    replaceDom?(component: IComponent, renderDOM: Element): Promise<IComponent>;
}
