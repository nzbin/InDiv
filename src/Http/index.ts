import axios from 'axios';

const esHttp = {
  get: function(url: string, params?: any): Promise<any> {
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
  },

  delete: function(url: string, params?: any): Promise<any> {
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
  },

  post: function(url: string, params?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      axios.post(url, params)
        .then((res: any) => {
          resolve(res.data);
        })
        .catch((e: any) => {
          reject(e.response.data);
        });
    });
  },

  put: function(url: string, params?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      axios.put(url, params)
        .then((res: any) => {
          resolve(res.data);
        })
        .catch((e: any) => {
          reject(e.response.data);
        });
    });
  },

  patch: function(url: string, params?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      axios.patch(url, params)
        .then((res: any) => {
          resolve(res.data);
        })
        .catch((e: any) => {
          reject(e.response.data);
        });
    });
  },

};

export default esHttp;
