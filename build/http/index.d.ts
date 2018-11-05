export declare class NVHttp {
    get<P = any, R = any>(url: string, params?: P): Promise<R>;
    delete<P = any, R = any>(url: string, params?: P): Promise<R>;
    post<P = any, R = any>(url: string, params?: P): Promise<R>;
    put<P = any, R = any>(url: string, params?: P): Promise<R>;
    patch<P = any, R = any>(url: string, params?: P): Promise<R>;
}
