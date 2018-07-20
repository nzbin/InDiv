import { IHttp } from '../Http/types';

export * from '../Http/types';


export interface IService {
    $http: IHttp;
}
