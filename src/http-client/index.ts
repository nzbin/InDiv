import { HttpClientRequestConfig, HttpClientResponse, HttpClientRequestInstance } from '../types';

import axios from 'axios';
import { from, Observable } from 'rxjs';
import { Injectable } from '../di';

export { HttpClientRequestConfig, HttpClientResponse, HttpClientRequestInstance } from '../types';

@Injectable()
export class HttpClient {
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
  public createRequest(url: string, config: HttpClientRequestConfig): HttpClientRequestInstance {
    const newConfig = Object.assign({url}, config);
    return axios.create(newConfig);
  }

  /**
   * create a HttpClient Request and return a HttpClientResponse Observable
   *
   * @template T
   * @param {HttpClientRequestConfig} config
   * @returns {Observable<HttpClientResponse<T>>}
   * @memberof HttpClient
   */
  public request<T = any>(url: string, config: HttpClientRequestConfig): Observable<HttpClientResponse<T>> {
    const newConfig = Object.assign({url}, config);
    return from(axios.request(newConfig));
  }

  /**
   * create a get HttpClient Request and return a HttpClientResponse Observable
   *
   * @template T
   * @param {string} url
   * @param {HttpClientRequestConfig} [config]
   * @returns {Observable<HttpClientResponse<T>>}
   * @memberof HttpClient
   */
  public get<T = any>(url: string, config?: HttpClientRequestConfig): Observable<HttpClientResponse<T>> {
    return from(axios.get(url, config));
  }

  /**
   * create a delete HttpClient Request and return a HttpClientResponse Observable
   *
   * @param {string} url
   * @param {HttpClientRequestConfig} [config]
   * @returns {Observable<HttpClientResponse<any>>}
   * @memberof HttpClient
   */
  public delete(url: string, config?: HttpClientRequestConfig): Observable<HttpClientResponse<any>> {
    return from(axios.delete(url, config));
  }

  /**
   * create a head HttpClient Request and return a HttpClientResponse Observable
   *
   * @param {string} url
   * @param {HttpClientRequestConfig} [config]
   * @returns {Observable<HttpClientResponse<any>>}
   * @memberof HttpClient
   */
  public head(url: string, config?: HttpClientRequestConfig): Observable<HttpClientResponse<any>> {
    return from(axios.head(url, config));
  }

  /**
   * create a post HttpClient Request and return a HttpClientResponse Observable
   *
   * @template T
   * @param {string} url
   * @param {HttpClientRequestConfig} [config]
   * @returns {Observable<HttpClientResponse<T>>}
   * @memberof HttpClient
   */
  public post<T = any>(url: string, config?: HttpClientRequestConfig): Observable<HttpClientResponse<T>> {
    return from(axios.post(url, config));
  }

  /**
   * create a put HttpClient Request and return a HttpClientResponse Observable
   *
   * @template T
   * @param {string} url
   * @param {HttpClientRequestConfig} [config]
   * @returns {Observable<HttpClientResponse<T>>}
   * @memberof HttpClient
   */
  public put<T = any>(url: string, config?: HttpClientRequestConfig): Observable<HttpClientResponse<T>> {
    return from(axios.put(url, config));
  }

  /**
   * create a patch HttpClient Request and return a HttpClientResponse Observable
   *
   * @template T
   * @param {string} url
   * @param {HttpClientRequestConfig} [config]
   * @returns {Observable<HttpClientResponse<T>>}
   * @memberof HttpClient
   */
  public patch<T = any>(url: string, config?: HttpClientRequestConfig): Observable<HttpClientResponse<T>> {
    return from(axios.patch(url, config));
  }

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
  public createRequestInterceptor(
    onFulfilled?: (value: HttpClientRequestConfig) => HttpClientRequestConfig | Promise<HttpClientRequestConfig> | any,
    onRejected?: (error: any) => any,
  ): number {
    return axios.interceptors.request.use(onFulfilled, onRejected);
  }

  /**
   * remove a global request interceptor with requestInterceptor's id
   *
   * detail: https://github.com/axios/axios#interceptors
   * 
   * @param {number} requestInterceptor
   * @memberof HttpClient
   */
  public removeRequestInterceptor(requestInterceptor: number): void {
    axios.interceptors.request.eject(requestInterceptor);
  }

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
  public createResponseInterceptor(
    onFulfilled?: (value: HttpClientResponse) => HttpClientResponse | Promise<HttpClientResponse> | any,
    onRejected?: (error: any) => any,
  ): number {
    return axios.interceptors.response.use(onFulfilled, onRejected);
  }

  /**
   * remove a global response interceptor with responseInterceptor's id
   *
   * detail: https://github.com/axios/axios#interceptors
   * 
   * @param {number} responseInterceptor
   * @memberof HttpClient
   */
  public removeResponseInterceptor(responseInterceptor: number): void {
    axios.interceptors.response.eject(responseInterceptor);
  }
}
