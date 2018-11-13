import { IComponent } from './component';
import { INvModule } from './nv-module';

export interface IMiddleware<ES> {
    bootstrap(vm: ES): void;
}

export type NvRouteObject = {
    path: string;
    query?: {
        [props: string]: any;
    };
    data?: any;
};

export interface IInDiv {
    use(modal: IMiddleware<IInDiv>): number;
    setRootPath(rootPath: string): void;
    getRootPath(): string;
    setComponentRender<S = any, P = any, V = any>(render?: () => Promise<IComponent<S, P, V>>, reRender?: () => Promise<IComponent<S, P, V>>): void;
    getComponentRender(): { render: () => Promise<IComponent>, reRender: () => Promise<IComponent> };
    setCanRenderModule(canRenderModule: boolean): void;
    getCanRenderModule(): boolean;
    setRouteDOMKey(key: string): void;
    getRouteDOMKey(): string;
    getRootModule(): INvModule;
    getDirectives(): Function[];
    bootstrapModule(Esmodule: Function): void;
    init(): void;
    renderComponent(BootstrapComponent: Function, renderDOM: Element, loadModule?: INvModule): Promise<IComponent>;
}
