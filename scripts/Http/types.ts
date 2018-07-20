export type IHttpGet = (url: string, params?: any) => Promise<any>;
export type IHttpDelete = (url: string, params?: any) => Promise<any>;
export type IHttpPost = (url: string, params?: any) => Promise<any>;
export type IHttpPut = (url: string, params?: any) => Promise<any>;
export type IHttpPatch = (url: string, params?: any) => Promise<any>;

export interface IHttp {
    $get: IHttpGet;
    $delete: IHttpDelete;
    $post: IHttpPost;
    $put: IHttpPut;
    $patch: IHttpPatch;
}
