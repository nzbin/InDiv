import { AxiosTransformer, AxiosAdapter, AxiosBasicCredentials, AxiosProxyConfig, CancelToken, AxiosPromise, AxiosInterceptorManager } from 'axios';
export interface HttpClientRequestConfig {
    method?: string;
    baseURL?: string;
    transformRequest?: AxiosTransformer | AxiosTransformer[];
    transformResponse?: AxiosTransformer | AxiosTransformer[];
    headers?: any;
    params?: any;
    paramsSerializer?: (params: any) => string;
    data?: any;
    timeout?: number;
    withCredentials?: boolean;
    adapter?: AxiosAdapter;
    auth?: AxiosBasicCredentials;
    responseType?: string;
    xsrfCookieName?: string;
    xsrfHeaderName?: string;
    onUploadProgress?: (progressEvent: any) => void;
    onDownloadProgress?: (progressEvent: any) => void;
    maxContentLength?: number;
    validateStatus?: (status: number) => boolean;
    maxRedirects?: number;
    httpAgent?: any;
    httpsAgent?: any;
    proxy?: AxiosProxyConfig | false;
    cancelToken?: CancelToken;
}
export interface HttpClientResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: HttpClientRequestConfig;
    request?: any;
}
export interface HttpClientRequestInstance {
    (config: HttpClientRequestConfig): AxiosPromise;
    (url: string, config?: HttpClientRequestConfig): AxiosPromise;
    defaults: HttpClientRequestConfig;
    interceptors: {
        request: AxiosInterceptorManager<HttpClientRequestConfig>;
        response: AxiosInterceptorManager<HttpClientResponse>;
    };
    request<T = any>(config: HttpClientRequestConfig): AxiosPromise<T>;
    get<T = any>(url: string, config?: HttpClientRequestConfig): AxiosPromise<T>;
    delete(url: string, config?: HttpClientRequestConfig): AxiosPromise;
    head(url: string, config?: HttpClientRequestConfig): AxiosPromise;
    post<T = any>(url: string, data?: any, config?: HttpClientRequestConfig): AxiosPromise<T>;
    put<T = any>(url: string, data?: any, config?: HttpClientRequestConfig): AxiosPromise<T>;
    patch<T = any>(url: string, data?: any, config?: HttpClientRequestConfig): AxiosPromise<T>;
}
