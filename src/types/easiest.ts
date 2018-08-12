import { IComponent } from './component';
import { IEsModule } from './esModule';
import { IService } from './service';
import { IUtil } from './utils';

export interface IMiddleware<ES> {
    $bootstrap(vm: ES): void;
}

export type EsRouteObject = {
    path: string;
    query?: any;
    params?: any;
};

export interface IEasiest {
    modalList: IMiddleware<IEasiest>[];
    utils: IUtil;
    rootDom: Element;
    $rootPath: string;
    $canRenderModule: boolean;
    $routeDOMKey: string;
    $rootModule: IEsModule;
    $components: {
        [name: string]: Function;
    };
    $esRouteObject?: EsRouteObject;

    $use(modal: IMiddleware<IEasiest>): number;
    $setRootPath(rootPath: string): void;
    $bootstrapModule(Esmodule: Function): void;
    $init(): void;
    $renderModuleBootstrap(): void;
    $renderComponent(BootstrapComponent: Function, renderDOM: Element): Promise<any>;
    replaceDom(component: IComponent, renderDOM: Element): Promise<any>;
}
