import { AxiosResponse, AxiosRequestConfig } from 'axios';
import { Observable } from 'rxjs';
export interface HttpClientConfig extends AxiosRequestConfig {
}
export declare class HttpClient {
    /**
     * create a HttpClient Request and return a Observable
     *
     * @template T
     * @param {HttpClientConfig} config
     * @returns {Observable<AxiosResponse<T>>}
     * @memberof HttpClient
     */
    request<T = any>(config: HttpClientConfig): Observable<AxiosResponse<T>>;
    /**
     * create a HttpClient get Request and return a Observable
     *
     * @template T
     * @param {string} url
     * @param {HttpClientConfig} [params]
     * @returns {Observable<AxiosResponse<T>>}
     * @memberof HttpClient
     */
    get<T = any>(url: string, params?: HttpClientConfig): Observable<AxiosResponse<T>>;
    /**
     * create a HttpClient delete Request and return a Observable
     *
     * @param {string} url
     * @param {HttpClientConfig} [params]
     * @returns {Observable<AxiosResponse<any>>}
     * @memberof HttpClient
     */
    delete(url: string, params?: HttpClientConfig): Observable<AxiosResponse<any>>;
    /**
     * create a HttpClient head Request and return a Observable
     *
     * @param {string} url
     * @param {HttpClientConfig} [params]
     * @returns {Observable<AxiosResponse<any>>}
     * @memberof HttpClient
     */
    head(url: string, params?: HttpClientConfig): Observable<AxiosResponse<any>>;
    /**
     * create a HttpClient post Request and return a Observable
     *
     * @template T
     * @param {string} url
     * @param {HttpClientConfig} [params]
     * @returns {Observable<AxiosResponse<T>>}
     * @memberof HttpClient
     */
    post<T = any>(url: string, params?: HttpClientConfig): Observable<AxiosResponse<T>>;
    /**
     * create a HttpClient put Request and return a Observable
     *
     * @template T
     * @param {string} url
     * @param {HttpClientConfig} [params]
     * @returns {Observable<AxiosResponse<T>>}
     * @memberof HttpClient
     */
    put<T = any>(url: string, params?: HttpClientConfig): Observable<AxiosResponse<T>>;
    /**
     * create a HttpClient patch Request and return a Observable
     *
     * @template T
     * @param {string} url
     * @param {HttpClientConfig} [params]
     * @returns {Observable<AxiosResponse<T>>}
     * @memberof HttpClient
     */
    patch<T = any>(url: string, params?: HttpClientConfig): Observable<AxiosResponse<T>>;
}
