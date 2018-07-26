import { IComponent } from './component';
import { IEsModule } from './esModule';
import { IService } from './service';
import { IUtil } from './utils';

export interface IMiddleware<ES> {
    $bootstrap(vm: ES): any;
}

export interface EsRouteObject {
    path: string;
    query?: any;
    params?: any;
}

export interface IEasiest {
    modalList: IMiddleware<IEasiest>[];
    utils: IUtil;
    $globalContext: any;
    rootDom: Element;
    $rootPath: string;
    $canRenderModule: boolean;
    $esRouteMode: string;
    $routeDOMKey: string;
    $rootModule: IEsModule;
    $components: {
        [name: string]: IComponent;
    }
    $esRouteObject?: EsRouteObject;
}
