import Cookie from 'easier-cookie';

import { Injectable } from '../Injectable';

/**
 * utils for InDiv
 *
 * @class Utils
 */
@Injectable({
  isSingletonMode: false,
})
class Utils {
  /**
   * Creates an instance of Utils.
   * @memberof Utils
   */
  constructor() {
    this.toString = Object.prototype.toString;
  }

  /**
   * set Cookie with easier-cookie
   *
   * @param {string} name
   * @param {*} value
   * @param {*} [options]
   * @memberof Utils
   */
  public setCookie(name: string, value: any, options?: any): void {
    Cookie.set(name, value, options);
  }

  /**
   * get Cookie with easier-cookie
   *
   * @param {string} name
   * @returns {*}
   * @memberof Utils
   */
  public getCookie(name: string): any {
    return Cookie.get(name);
  }

  /**
   * remove Cookie with easier-cookie
   *
   * @param {string} name
   * @returns {boolean}
   * @memberof Utils
   */
  public removeCookie(name: string): boolean {
    return Cookie.remove(name);
  }

  /**
   * build url query
   *
   * @param {*} object
   * @returns {string}
   * @memberof Utils
   */
  public buildQuery(object: any): string {
    if (!object || !(object instanceof Object)) return '';
    let query = '?';
    for (const key in object) {
      if (!(object[key] instanceof Object)) {
        query += `${key}=${object[key].toString()}&`;
      } else {
        query += `${key}=${JSON.stringify(object[key])}&`;
      }
    }
    return query.slice(0, query.length - 1);
  }

  /**
   * get one url query
   *
   * @param {string} name
   * @returns {string}
   * @memberof Utils
   */
  public getQuery(name: string): string {
    const parts: string[] = window.location.search.replace('?', '').split('&');
    const params: any = {};
    for (let i = 0; i < parts.length; i++) {
      const pairs = parts[i].split('=');
      params[pairs[0]] = pairs[1];
    }
    if (params[name]) {
      return params[name];
    } else {
      return '';
    }
  }

  /**
   * judge something is Function or not
   *
   * @param {*} func
   * @returns {boolean}
   * @memberof Utils
   */
  public isFunction(func: any): boolean {
    return this.toString.call(func) === '[object Function]';
  }

  /**
   * judge two things are equal or not
   *
   * @param {*} a
   * @param {*} b
   * @param {any[]} [aStack]
   * @param {any[]} [bStack]
   * @returns {boolean}
   * @memberof Utils
   */
  public isEqual(a: any, b: any, aStack?: any[], bStack?: any[]): boolean {
    // === 结果为 true 的区别出 +0 和 -0
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // typeof null 的结果为 object ，这里做判断，是为了让有 null 的情况尽早退出函数
    if (a == null || b == null) return false;
    // 判断 NaN
    if (a !== a) return b !== b;
    // 判断参数 a 类型，如果是基本类型，在这里可以直接返回 false
    const type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b !== 'object') return false;
    // 更复杂的对象使用 deepEq 函数进行深度比较
    return this.deepIsEqual(a, b, aStack, bStack);
  }

  /**
   * deep judge two things are equal or not
   *
   * @param {*} a
   * @param {*} b
   * @param {any[]} [aStack]
   * @param {any[]} [bStack]
   * @returns {boolean}
   * @memberof Utils
   */
  public deepIsEqual(a: any, b: any, aStack?: any[], bStack?: any[]): boolean {
    // a 和 b 的内部属性 [[class]] 相同时 返回 true
    const className = this.toString.call(a);
    if (className !== this.toString.call(b)) return false;
    switch (className) {
    case '[object RegExp]':
    case '[object String]':
      return `${a}` === `${b}`;
    case '[object Number]':
      if (+a !== +a) return +b !== +b;
      return +a === 0 ? 1 / +a === 1 / b : +a === +b;
    case '[object Date]':
    case '[object Boolean]':
      return +a === +b;
    }

    const areArrays = className === '[object Array]';
    // 不是数组
    if (!areArrays) {
      // 过滤掉两个函数的情况
      if (typeof a !== 'object' || typeof b !== 'object') return false;
      const aCtor = a.constructor;
      const bCtor = b.constructor;
      // aCtor 和 bCtor 必须都存在并且都不是 Object 构造函数的情况下，aCtor 不等于 bCtor， 那这两个对象就真的不相等啦
      if (aCtor !== bCtor && !(this.isFunction(aCtor) && aCtor instanceof aCtor && this.isFunction(bCtor) && bCtor instanceof bCtor) && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }

    aStack = aStack || [];
    bStack = bStack || [];
    let length = aStack.length;
    // 检查是否有循环引用的部分
    while (length--) {
      if (aStack[length] === a) {
        return bStack[length] === b;
      }
    }
    aStack.push(a);
    bStack.push(b);
    // 数组判断
    if (areArrays) {
      length = a.length;
      if (length !== b.length) return false;
      while (length--) {
        if (!this.isEqual(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      const keys = Object.keys(a);
      let key;
      length = keys.length;
      if (Object.keys(b).length !== length) return false;
      while (length--) {
        key = keys[length];
        if (!(b.hasOwnProperty(key) && this.isEqual(a[key], b[key], aStack, bStack))) return false;
      }
    }
    aStack.pop();
    bStack.pop();
    return true;
  }

  /**
   * format string for InnerHTML
   *
   * @param {string} inner
   * @returns {string}
   * @memberof Utils
   */
  public formatInnerHTML(inner: string): string {
    inner = inner.replace(/(\n\s*)/g, '');
    inner = inner.replace(/^[^\S\n]+/gm, '');
    return inner;
  }

  /**
   * judge evn is browser or node
   *
   * @returns {boolean}
   * @memberof Utils
   */
  public isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.document !== 'undefined';
  }
}

export default Utils;
