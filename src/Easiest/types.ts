// export { IComponent } from '../Component/types';
// export { IEsModule } from '../EsModule/types';
// export { IService } from '../Service/types';

export interface IMiddleware<ES> {
    $bootstrap(vm: ES): any;
}

export interface EsRouteObject {
    path: string;
    query?: any;
    params?: any;
}
