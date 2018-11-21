import { HttpClientRequestConfig, HttpClientResponse, HttpClientRequestInstance } from '../types';
import { Observable } from 'rxjs';
export { HttpClientRequestConfig, HttpClientResponse, HttpClientRequestInstance } from '../types';
export declare class HttpClient {
    /**
     * create a HttpClient Request and return Request Instance
     *
     * you can use Instance to set interceptors , use Http request and more.
     * attention! return value is't a Observable, you can transform by yourself.
     *
     * @param {string} url
     * @param {HttpClientRequestConfig} config
     * @returns {HttpClientRequestInstance}
     * @memberof HttpClient
     */
    createRequest(url: string, config: HttpClientRequestConfig): HttpClientRequestInstance;
    /**
     * create a HttpClient Request and return a HttpClientResponse Observable
     *
     * @template T
     * @param {HttpClientRequestConfig} config
     * @returns {Observable<HttpClientResponse<T>>}
     * @memberof HttpClient
     */
    request<T = any>(url: string, config: HttpClientRequestConfig): Observable<HttpClientResponse<T>>;
    /**
     * create a get HttpClient Request and return a HttpClientResponse Observable
     *
     * @template T
     * @param {string} url
     * @param {HttpClientRequestConfig} [config]
     * @returns {Observable<HttpClientResponse<T>>}
     * @memberof HttpClient
     */
    get<T = any>(url: string, config?: HttpClientRequestConfig): Observable<HttpClientResponse<T>>;
    /**
     * create a delete HttpClient Request and return a HttpClientResponse Observable
     *
     * @param {string} url
     * @param {HttpClientRequestConfig} [config]
     * @returns {Observable<HttpClientResponse<any>>}
     * @memberof HttpClient
     */
    delete(url: string, config?: HttpClientRequestConfig): Observable<HttpClientResponse<any>>;
    /**
     * create a head HttpClient Request and return a HttpClientResponse Observable
     *
     * @param {string} url
     * @param {HttpClientRequestConfig} [config]
     * @returns {Observable<HttpClientResponse<any>>}
     * @memberof HttpClient
     */
    head(url: string, config?: HttpClientRequestConfig): Observable<HttpClientResponse<any>>;
    /**
     * create a post HttpClient Request and return a HttpClientResponse Observable
     *
     * @template T
     * @param {string} url
     * @param {HttpClientRequestConfig} [config]
     * @returns {Observable<HttpClientResponse<T>>}
     * @memberof HttpClient
     */
    post<T = any>(url: string, config?: HttpClientRequestConfig): Observable<HttpClientResponse<T>>;
    /**
     * create a put HttpClient Request and return a HttpClientResponse Observable
     *
     * @template T
     * @param {string} url
     * @param {HttpClientRequestConfig} [config]
     * @returns {Observable<HttpClientResponse<T>>}
     * @memberof HttpClient
     */
    put<T = any>(url: string, config?: HttpClientRequestConfig): Observable<HttpClientResponse<T>>;
    /**
     * create a patch HttpClient Request and return a HttpClientResponse Observable
     *
     * @template T
     * @param {string} url
     * @param {HttpClientRequestConfig} [config]
     * @returns {Observable<HttpClientResponse<T>>}
     * @memberof HttpClient
     */
    patch<T = any>(url: string, config?: HttpClientRequestConfig): Observable<HttpClientResponse<T>>;
    /**
     * create a global request interceptor and return requestInterceptor's id
     *
     * detail: https://github.com/axios/axios#interceptors
     *
     * @param {((value: HttpClientRequestConfig) => HttpClientRequestConfig | Promise<HttpClientRequestConfig>)} [onFulfilled]
     * @param {(error: any) => any} [onRejected]
     * @returns {number}
     * @memberof HttpClient
     */
    createRequestInterceptor(onFulfilled?: (value: HttpClientRequestConfig) => HttpClientRequestConfig | Promise<HttpClientRequestConfig> | any, onRejected?: (error: any) => any): number;
    /**
     * remove a global request interceptor with requestInterceptor's id
     *
     * detail: https://github.com/axios/axios#interceptors
     *
     * @param {number} requestInterceptor
     * @memberof HttpClient
     */
    removeRequestInterceptor(requestInterceptor: number): void;
    /**
     * create a global response interceptor and return responseInterceptor's id
     *
     * detail: https://github.com/axios/axios#interceptors
     *
     * @param {((value: HttpClientResponse) => HttpClientResponse | Promise<HttpClientResponse>)} [onFulfilled]
     * @param {(error: any) => any} [onRejected]
     * @returns {number}
     * @memberof HttpClient
     */
    createResponseInterceptor(onFulfilled?: (value: HttpClientResponse) => HttpClientResponse | Promise<HttpClientResponse> | any, onRejected?: (error: any) => any): number;
    /**
     * remove a global response interceptor with responseInterceptor's id
     *
     * detail: https://github.com/axios/axios#interceptors
     *
     * @param {number} responseInterceptor
     * @memberof HttpClient
     */
    removeResponseInterceptor(responseInterceptor: number): void;
}
