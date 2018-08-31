export type IHttpGet = (url: string, params?: any) => Promise<any>;
export type IHttpDelete = (url: string, params?: any) => Promise<any>;
export type IHttpPost = (url: string, params?: any) => Promise<any>;
export type IHttpPut = (url: string, params?: any) => Promise<any>;
export type IHttpPatch = (url: string, params?: any) => Promise<any>;

export interface IEsHttp {
    get?<P = any, R = any>(url: string, params?: P): Promise<R>;
    delete?<P = any, R = any>(url: string, params?: P): Promise<R>;
    post?<P = any, R = any>(url: string, params?: P): Promise<R>;
    put?<P = any, R = any>(url: string, params?: P): Promise<R>;
    patch?<P = any, R = any>(url: string, params?: P): Promise<R>;
}
