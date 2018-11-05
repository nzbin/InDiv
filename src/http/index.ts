import axios from 'axios';

export class NVHttp {
  public get<P = any, R = any>(url: string, params?: P): Promise<R> {
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

  public delete<P = any, R = any>(url: string, params?: P): Promise<R> {
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

  public post<P = any, R = any>(url: string, params?: P): Promise<R> {
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

  public put<P = any, R = any>(url: string, params?: P): Promise<R> {
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

  public patch<P = any, R = any>(url: string, params?: P): Promise<R> {
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
