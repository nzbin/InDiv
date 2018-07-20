import { IHttp } from './types';

import axios from 'axios';

class Http implements IHttp {
  $get(url: string, params?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const pms = params ? { params } : null;
      axios.get(url, pms)
        .then(res => {
          resolve(res.data);
        })
        .catch(e => {
          reject(e.response.data);
        });
    });
  }

  $delete(url: string, params?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const pms = params ? { params } : null;
      axios.delete(url, pms)
        .then(res => {
          resolve(res.data);
        })
        .catch(e => {
          reject(e.response.data);
        });
    });
  }

  $post(url: string, params?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      axios.post(url, params)
        .then(res => {
          resolve(res.data);
        })
        .catch(e => {
          reject(e.response.data);
        });
    });
  }

  $put(url: string, params?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      axios.put(url, params)
        .then(res => {
          resolve(res.data);
        })
        .catch(e => {
          reject(e.response.data);
        });
    });
  }

  $patch(url: string, params?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      axios.patch(url, params)
        .then(res => {
          resolve(res.data);
        })
        .catch(e => {
          reject(e.response.data);
        });
    });
  }
}

export default Http;
