import axios, { AxiosResponse, AxiosRequestConfig  } from 'axios';
import { from, Observable } from 'rxjs';

import { Injectable } from '../di';

export interface HttpClientConfig extends AxiosRequestConfig {}

@Injectable()
export class HttpClient {
  /**
   * create a HttpClient Request and return a Observable
   *
   * @template T
   * @param {HttpClientConfig} config
   * @returns {Observable<AxiosResponse<T>>}
   * @memberof HttpClient
   */
  public request<T = any>(config: HttpClientConfig): Observable<AxiosResponse<T>> {
    return from(axios.request(config));
  }

  /**
   * create a get HttpClient Request and return a Observable
   *
   * @template T
   * @param {string} url
   * @param {HttpClientConfig} [params]
   * @returns {Observable<AxiosResponse<T>>}
   * @memberof HttpClient
   */
  public get<T = any>(url: string, params?: HttpClientConfig): Observable<AxiosResponse<T>> {
    return from(axios.get(url, params));
  }

  /**
   * create a delete HttpClient Request and return a Observable
   *
   * @param {string} url
   * @param {HttpClientConfig} [params]
   * @returns {Observable<AxiosResponse<any>>}
   * @memberof HttpClient
   */
  public delete(url: string, params?: HttpClientConfig): Observable<AxiosResponse<any>> {
    return from(axios.delete(url, params));
  }

  /**
   * create a head HttpClient Request and return a Observable
   *
   * @param {string} url
   * @param {HttpClientConfig} [params]
   * @returns {Observable<AxiosResponse<any>>}
   * @memberof HttpClient
   */
  public head(url: string, params?: HttpClientConfig): Observable<AxiosResponse<any>> {
    return from(axios.head(url, params));
  }

  /**
   * create a post HttpClient Request and return a Observable
   *
   * @template T
   * @param {string} url
   * @param {HttpClientConfig} [params]
   * @returns {Observable<AxiosResponse<T>>}
   * @memberof HttpClient
   */
  public post<T = any>(url: string, params?: HttpClientConfig): Observable<AxiosResponse<T>> {
    return from(axios.post(url, params));
  }

  /**
   * create a put HttpClient Request and return a Observable
   *
   * @template T
   * @param {string} url
   * @param {HttpClientConfig} [params]
   * @returns {Observable<AxiosResponse<T>>}
   * @memberof HttpClient
   */
  public put<T = any>(url: string, params?: HttpClientConfig): Observable<AxiosResponse<T>> {
    return from(axios.put(url, params));
  }

  /**
   * create a patch HttpClient Request and return a Observable
   *
   * @template T
   * @param {string} url
   * @param {HttpClientConfig} [params]
   * @returns {Observable<AxiosResponse<T>>}
   * @memberof HttpClient
   */
  public patch<T = any>(url: string, params?: HttpClientConfig): Observable<AxiosResponse<T>> {
    return from(axios.patch(url, params));
  }
}
