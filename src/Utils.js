export default class Utils {
  constructor() {
    this.toString = Object.prototype.toString;
  }

  isFunction(func) {
    return this.toString.call(func) === '[object Function]';
  }

  isEqual(a, b, aStack, bStack) {
    // === 结果为 true 的区别出 +0 和 -0
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // typeof null 的结果为 object ，这里做判断，是为了让有 null 的情况尽早退出函数
    if (a == null || b == null) return false;
    // 判断 NaN
    if (a !== a) return b !== b;
    // 判断参数 a 类型，如果是基本类型，在这里可以直接返回 false
    let type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b !== 'object') return false;
    // 更复杂的对象使用 deepEq 函数进行深度比较
    return this.deepIsEqual(a, b, aStack, bStack);
  }

  deepIsEqual(a, b, aStack, bStack) {
    // a 和 b 的内部属性 [[class]] 相同时 返回 true
    let className = this.toString.call(a);
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

    let areArrays = className === '[object Array]';
    // 不是数组
    if (!areArrays) {
      // 过滤掉两个函数的情况
      if (typeof a !== 'object' || typeof b !== 'object') return false;
      let aCtor = a.constructor;
      let bCtor = b.constructor;
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
      let keys = Object.keys(a);
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

  setCookie(key, value, setdate) {
    if (!key || !value) {
      console.error('set cookie error: key or value is null');
      return;
    }
    let mydate = new Date();
    mydate.setDate(mydate.getDate() + setdate);
    document.cookie = `${key}=${value};expirse=${mydate}`;
  }

  getCookie(name) {
    const cookieArray = document.cookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
      let cookieName = cookieArray[i].split('=');
      if (cookieName[0] === name) {
        return cookieName[1];
      }
    }
    return '';
  }

  removeCookie(name) {
    this.setCookie(name, -1, -1);
  }
}
