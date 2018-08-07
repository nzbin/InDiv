export type IHttpGet = (url: string, params?: any) => Promise<any>;
export type IHttpDelete = (url: string, params?: any) => Promise<any>;
export type IHttpPost = (url: string, params?: any) => Promise<any>;
export type IHttpPut = (url: string, params?: any) => Promise<any>;
export type IHttpPatch = (url: string, params?: any) => Promise<any>;

export interface IHttp {
    $get?(url: string, params?: any): Promise<any>;
    $delete?(url: string, params?: any): Promise<any>;
    $post?(url: string, params ?: any): Promise<any>;
    $put?(url: string, params?: any): Promise<any>;
    $patch?(url: string, params ?: any): Promise <any>;
}
