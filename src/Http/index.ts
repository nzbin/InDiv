import { IHttp } from '../types';

import axios from 'axios';

class Http implements IHttp {
  public $get(url: string, params?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const pms = params ? { params } : null;
      axios.get(url, pms)
        .then((res: any) => {
          resolve(res.data);
        })
        .catch((e: any) => {
          reject(e.response.data);
        });
    });
  }

  public $delete(url: string, params?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const pms = params ? { params } : null;
      axios.delete(url, pms)
        .then((res: any) => {
          resolve(res.data);
        })
        .catch((e: any) => {
          reject(e.response.data);
        });
    });
  }

  public $post(url: string, params ?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      axios.post(url, params)
        .then((res: any) => {
          resolve(res.data);
        })
        .catch((e: any) => {
          reject(e.response.data);
        });
    });
  }

  public $put(url: string, params?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      axios.put(url, params)
        .then((res: any) => {
          resolve(res.data);
        })
        .catch((e: any) => {
          reject(e.response.data);
        });
    });
  }

  public $patch(url: string, params ?: any): Promise <any> {
    return new Promise((resolve, reject) => {
      axios.patch(url, params)
        .then((res: any) => {
          resolve(res.data);
        })
        .catch((e: any) => {
          reject(e.response.data);
        });
    });
  }
}

export default Http;
