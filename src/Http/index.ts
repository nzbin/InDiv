import axios from 'axios';

const nvHttp = {
  get: function<P = any, R = any>(url: string, params?: P): Promise<R> {
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
  },

  delete: function<P = any, R = any>(url: string, params?: P): Promise<R> {
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
  },

  post: function<P = any, R = any>(url: string, params?: P): Promise<R> {
    return new Promise((resolve, reject) => {
      axios.post(url, params)
        .then(res => {
          resolve(res.data);
        })
        .catch(e => {
          reject(e.response.data);
        });
    });
  },

  put: function<P = any, R = any>(url: string, params?: P): Promise<R> {
    return new Promise((resolve, reject) => {
      axios.put(url, params)
        .then(res => {
          resolve(res.data);
        })
        .catch(e => {
          reject(e.response.data);
        });
    });
  },

  patch: function<P = any, R = any>(url: string, params?: P): Promise<R> {
    return new Promise((resolve, reject) => {
      axios.patch(url, params)
        .then(res => {
          resolve(res.data);
        })
        .catch(e => {
          reject(e.response.data);
        });
    });
  },

};

export default nvHttp;

