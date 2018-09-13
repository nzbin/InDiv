declare global {
  interface Element {
    value?: any;
    eventTypes?: string;
    repeatData?: {
      [key: string]: any;
    };
  }
  interface Node {
    eventTypes?: string;
    repeatData?: {
      [key: string]: any;
    };
  }
}

/**
 * compile util for nv-repeat DOM
 *
 * @export
 * @class CompileUtilForRepeat
 */
export class CompileUtilForRepeat {
  [index: string]: any;
  public $fragment?: Element | DocumentFragment;

  /**
   * Creates an instance of CompileUtilForRepeat.
   * @param {(Element | DocumentFragment)} [fragment]
   * @memberof CompileUtilForRepeat
   */
  constructor(fragment?: Element | DocumentFragment) {
    this.$fragment = fragment;
  }

  /**
   * get value by key and anthor value
   *
   * @param {*} vm
   * @param {string} exp
   * @param {string} key
   * @returns {*}
   * @memberof CompileUtilForRepeat
   */
  public _getValueByValue(vm: any, exp: string, key: string): any {
    const valueList = exp.replace('()', '').split('.');
    let value = vm;
    valueList.forEach((v, index) => {
      if (v === key && index === 0) return;
      value = value[v];
    });
    return value;
  }

  /**
   * set value by key and anthor value
   *
   * @param {*} vm
   * @param {string} exp
   * @param {string} key
   * @param {*} setValue
   * @returns {*}
   * @memberof CompileUtilForRepeat
   */
  public _setValueByValue(vm: any, exp: string, key: string, setValue: any): any {
    const valueList = exp.replace('()', '').split('.');
    let value = vm;
    let lastKey;
    valueList.forEach((v, index) => {
      if (v === key && index === 0) return lastKey = v;
      if (index < valueList.length) lastKey = v;
      if (index < valueList.length - 1 ) value = value[v];
    });
    if (lastKey) value[lastKey] = setValue;
  }

  /**
   * get value of VM
   *
   * @param {*} vm
   * @param {string} exp
   * @returns {*}
   * @memberof CompileUtilForRepeat
   */
  public _getVMVal(vm: any, exp: string): any {
    const valueList = exp.replace('()', '').split('.');
    let value = vm;
    valueList.forEach(v => {
      value = value[v];
    });
    return value;
  }

  /**
   * get value by repeat value
   *
   * @param {*} val
   * @param {string} exp
   * @param {string} key
   * @returns {*}
   * @memberof CompileUtilForRepeat
   */
  public _getVMRepeatVal(val: any, exp: string, key: string): any {
    let value: any;
    const valueList = exp.replace('()', '').split('.');
    valueList.forEach((v, index) => {
      if (v === key && index === 0) {
        value = val;
        return;
      }
      value = value[v];
    });
    return value;
  }

  /**
   * bind handler for nv irective
   *
   * @param {Element} node
   * @param {string} [key]
   * @param {string} [dir]
   * @param {string} [exp]
   * @param {number} [index]
   * @param {*} [vm]
   * @param {*} [watchValue]
   * @memberof CompileUtilForRepeat
   */
  public bind(node: Element, key?: string, dir?: string, exp?: string, index?: number, vm?: any, watchValue?: any): void {
    const repeatValue = (node.repeatData)[key];
    let value;
    if (exp.indexOf(key) === 0 || exp.indexOf(`${key}.`) === 0) {
      value = this._getVMRepeatVal(repeatValue, exp, key);
    } else {
      value = this._getVMVal(vm, exp);
    }

    let watchData;
    if (exp.indexOf(key) === 0 || exp.indexOf(`${key}.`) === 0) {
      watchData = watchValue;
    } else {
      watchData = this._getVMVal(vm, exp);
    }

    if (!node.hasChildNodes()) this.templateUpdater(node, repeatValue, key, vm);

    const updaterFn: any = this[`${dir}Updater`];
    switch (dir) {
      case 'model':
        if (updaterFn) (updaterFn as Function).call(this, node, value, exp, key, index, watchData, vm);
        break;
      default:
        if (updaterFn) (updaterFn as Function).call(this, node, value);
    }
  }

  /**
   * update text for {{}}
   *
   * @param {Element} node
   * @param {*} [val]
   * @param {string} [key]
   * @param {*} [vm]
   * @memberof CompileUtilForRepeat
   */
  public templateUpdater(node: Element, val?: any, key?: string, vm?: any): void {
    const text = node.textContent;
    const reg = /\{\{(.*)\}\}/g;
    if (reg.test(text)) {
      const exp = RegExp.$1;
      let value;
      if (exp.indexOf(key) === 0 || exp.indexOf(`${key}.`) === 0) {
        value = this._getVMRepeatVal(val, exp, key);
      } else {
        value = this._getVMVal(vm, exp);
      }
      node.textContent = node.textContent.replace(/(\{\{.*\}\})/g, value);
    }
  }

  /**
   * update text for nv-text
   *
   * @param {Element} node
   * @param {*} value
   * @returns {void}
   * @memberof CompileUtilForRepeat
   */
  public textUpdater(node: Element, value: any): void {
    if (node.tagName.toLocaleLowerCase() === 'input') return node.value = value;
    node.textContent = typeof value === 'undefined' ? '' : value;
  }

  /**
   * update html for nv-html
   *
   * @param {Element} node
   * @param {*} value
   * @memberof CompileUtilForRepeat
   */
  public htmlUpdater(node: Element, value: any): void {
    node.innerHTML = typeof value === 'undefined' ? '' : value;
  }

  /**
   * remove or show DOM for nv-if
   *
   * @param {Element} node
   * @param {*} value
   * @memberof CompileUtilForRepeat
   */
  public ifUpdater(node: Element, value: any): void {
    if (!value && this.$fragment.contains(node)) this.$fragment.removeChild(node);
  }

  /**
   * update class for nv-class
   *
   * @param {Element} node
   * @param {*} value
   * @param {*} oldValue
   * @returns {void}
   * @memberof CompileUtilForRepeat
   */
  public classUpdater(node: Element, value: any, oldValue: any): void {
    if (!value && !oldValue) return;
    let className = node.className;
    className = className.replace(oldValue, '').replace(/\s$/, '');
    const space = className && String(value) ? ' ' : '';
    node.className = className + space + value;
  }

  /**
   * update value of input for nv-model
   *
   * @param {Element} node
   * @param {*} value
   * @param {string} exp
   * @param {string} key
   * @param {number} index
   * @param {*} watchData
   * @param {*} vm
   * @memberof CompileUtilForRepeat
   */
  public modelUpdater(node: Element, value: any, exp: string, key: string, index: number, watchData: any, vm: any): void {
    node.value = typeof value === 'undefined' ? '' : value;
    const utilVm = this;
    const func = function(event: Event): void {
      event.preventDefault();
      if (/(state.).*/.test(exp)) {
        const val = exp.replace(/(state.)/, '');
        if ((event.target as HTMLInputElement).value === watchData) return;
        vm.state[val] = (event.target as HTMLInputElement).value;
      }
      if (exp.indexOf(key) === 0 || exp.indexOf(`${key}.`) === 0) {
        if (typeof watchData[index] !== 'object') watchData[index] = (event.target as HTMLInputElement).value;
        if (typeof watchData[index] === 'object') {
          let vals = utilVm._getValueByValue(watchData[index], exp, key);
          vals = (event.target as HTMLInputElement).value;
          utilVm._setValueByValue(watchData[index], exp, key, vals);
        }
      }
    };
    node.addEventListener('input', func, false);
    (node as any).eventinput = func;
    if (node.eventTypes) {
      const eventlist = JSON.parse(node.eventTypes);
      eventlist.push('input');
      node.eventTypes = eventlist;
    }
    if (!node.eventTypes) node.eventTypes = JSON.stringify(['input']);
  }

  /**
   * compile event and build eventType in DOM
   *
   * @param {Element} node
   * @param {*} vm
   * @param {string} exp
   * @param {string} eventName
   * @param {string} key
   * @param {*} val
   * @memberof CompileUtilForRepeat
   */
  public eventHandler(node: Element, vm: any, exp: string, eventName: string, key: string, val: any): void {
    const eventType = eventName.split(':')[1];

    const fnList = exp.replace(/^(\@)/, '').replace(/\(.*\)/, '').split('.');
    const args = exp.replace(/^(\@)/, '').match(/\((.*)\)/)[1].replace(/ /g, '').split(',');

    let fn = vm;
    fnList.forEach(f => {
      fn = fn[f];
    });
    const utilVm = this;
    const func = function(event: Event): any {
      const argsList: any[] = [];
      args.forEach(arg => {
        if (arg === '') return false;
        if (arg === '$event') return argsList.push(event);
        if (arg === '$element') return argsList.push(node);
        if (/(state.).*/g.test(arg)) return argsList.push(utilVm._getVMVal(vm, arg));
        if (/\'.*\'/g.test(arg)) return argsList.push(arg.match(/\'(.*)\'/)[1]);
        if (!/\'.*\'/g.test(arg) && /^[0-9]*$/g.test(arg)) return argsList.push(Number(arg));
        if (arg === 'true' || arg === 'false') return argsList.push(arg === 'true');
        if (arg.indexOf(key) === 0 || arg.indexOf(`${key}.`) === 0) return argsList.push(utilVm._getVMRepeatVal(val, arg, key));
        if (this.repeatData) {
          // $index in this
          Object.keys(this.repeatData).forEach(data => {
            if (arg.indexOf(data) === 0 || arg.indexOf(`${data}.`) === 0) return argsList.push(utilVm._getValueByValue(this.repeatData[data], arg, data));
          });
        }
      });
      fn.apply(vm, argsList);
    };
    if (eventType && fn) {
      (node as any)[`on${eventType}`] = func;
      (node as any)[`event${eventType}`] = func;
      if (node.eventTypes) {
        const eventlist = JSON.parse(node.eventTypes);
        eventlist.push(eventType);
        node.eventTypes = JSON.stringify(eventlist);
      }
      if (!node.eventTypes) node.eventTypes = JSON.stringify([eventType]);
    }
  }
}

/**
 * compile util for Compiler
 *
 * @export
 * @class CompileUtil
 */
export class CompileUtil {
  [index: string]: any;
  public $fragment?: Element | DocumentFragment;

  /**
   * Creates an instance of CompileUtil.
   * 
   * @param {(Element | DocumentFragment)} [fragment]
   *  @memberof CompileUtil
   */
  constructor(fragment?: Element | DocumentFragment) {
    this.$fragment = fragment;
  }

  /**
   * get value by key and anthor value
   *
   * @param {*} vm
   * @param {string} exp
   * @param {string} key
   * @returns {*}
   * @memberof CompileUtil
   */
  public _getValueByValue(vm: any, exp: string, key: string): any {
    const valueList = exp.replace('()', '').split('.');
    let value = vm;
    valueList.forEach((v, index) => {
      if (v === key && index === 0) return;
      value = value[v];
    });
    return value;
  }

  /**
   * get value of VM
   *
   * @param {*} vm
   * @param {string} exp
   * @returns {*}
   * @memberof CompileUtil
   */
  public _getVMVal(vm: any, exp: string): any {
    const valueList = exp.replace('()', '').split('.');
    let value = vm;
    valueList.forEach((v, index) => {
      value = value[v];
    });
    return value;
  }

  /**
   * get value by repeat value
   *
   * @param {*} vm
   * @param {string} exp
   * @returns {void}
   * @memberof CompileUtil
   */
  public _getVMRepeatVal(vm: any, exp: string): void {
    const vlList = exp.split(' ');
    const value = this._getVMVal(vm, vlList[3]);
    return value;
  }

  /**
   * bind handler for nv irective
   * 
   * if node is repeat node and it will break compile and into CompileUtilForRepeat
   *
   * @param {Element} node
   * @param {*} vm
   * @param {string} exp
   * @param {string} dir
   * @memberof CompileUtil
   */
  public bind(node: Element, vm: any, exp: string, dir: string): void {
    const updaterFn = this[`${dir}Updater`];
    const isRepeatNode = this.isRepeatNode(node);
    if (isRepeatNode) {
      // compile repeatNode's attributes
      switch (dir) {
        case 'repeat':
          if (updaterFn) (updaterFn as Function).call(this, node, this._getVMRepeatVal(vm, exp), exp, vm);
          break;
      }
    } else {
      // compile unrepeatNode's attributes
      switch (dir) {
        case 'model':
          if (updaterFn) (updaterFn as Function).call(this, node, this._getVMVal(vm, exp), exp, vm);
          break;
        case 'text':
          if (updaterFn) (updaterFn as Function).call(this, node, this._getVMVal(vm, exp));
          break;
        case 'if':
          if (updaterFn) (updaterFn as Function).call(this, node, this._getVMVal(vm, exp), exp, vm);
          break;
        default:
          if (updaterFn) (updaterFn as Function).call(this, node, this._getVMVal(vm, exp));
      }
    }
  }

  /**
   * update text for {{}}
   *
   * @param {*} node
   * @param {*} vm
   * @param {string} exp
   * @memberof CompileUtil
   */
  public templateUpdater(node: any, vm: any, exp: string): void {
    node.textContent = node.textContent.replace(/(\{\{.*\}\})/g, this._getVMVal(vm, exp));
  }

  /**
   * update text for nv-text
   *
   * @param {Element} node
   * @param {*} value
   * @returns {void}
   * @memberof CompileUtil
   */
  public textUpdater(node: Element, value: any): void {
    if (node.tagName.toLocaleLowerCase() === 'input') return node.value = value;
    node.textContent = typeof value === 'undefined' ? '' : value;
  }

  /**
   * update html for nv-html
   *
   * @param {Element} node
   * @param {*} value
   * @memberof CompileUtil
   */
  public htmlUpdater(node: Element, value: any): void {
    node.innerHTML = typeof value === 'undefined' ? '' : value;
  }

  /**
   * remove or show DOM for nv-if
   *
   * @param {Element} node
   * @param {*} value
   * @memberof CompileUtil
   */
  public ifUpdater(node: Element, value: any): void {
    if (!value && this.$fragment.contains(node)) this.$fragment.removeChild(node);
  }

  /**
   * update class for nv-class
   *
   * @param {Element} node
   * @param {*} value
   * @param {*} oldValue
   * @returns {void}
   * @memberof CompileUtil
   */
  public classUpdater(node: Element, value: any, oldValue: any): void {
    if (!value && !oldValue) return;
    let className = node.className;
    className = className.replace(oldValue, '').replace(/\s$/, '');
    const space = className && String(value) ? ' ' : '';
    node.className = className + space + value;
  }

  /**
   * update value of input for nv-model
   *
   * @param {Element} node
   * @param {*} value
   * @param {string} exp
   * @param {*} vm
   * @memberof CompileUtil
   */
  public modelUpdater(node: Element, value: any, exp: string, vm: any): void {
    node.value = typeof value === 'undefined' ? '' : value;

    const val = exp.replace(/(state.)/, '');

    const func = (event: Event) => {
      event.preventDefault();
      if (/(state.).*/.test(exp)) vm.state[val] = (event.target as HTMLInputElement).value;
    };
    node.addEventListener('input', func, false);
    (node as any).eventinput = func;
    if (node.eventTypes) {
      const eventlist = JSON.parse(node.eventTypes);
      eventlist.push('input');
      node.eventTypes = JSON.stringify(eventlist);
    }
    if (!node.eventTypes) node.eventTypes = JSON.stringify(['input']);
  }

  /**
   * update repeat DOM for nv-repeat
   * 
   * if it has child and it will into repeatChildrenUpdater
   *
   * @param {Element} node
   * @param {*} value
   * @param {string} expFather
   * @param {*} vm
   * @memberof CompileUtil
   */
  public repeatUpdater(node: Element, value: any, expFather: string, vm: any): void {
    const key = expFather.split(' ')[1];
    value.forEach((val: any, index: number) => {
      const repeatData: { [key: string]: any } = {};
      repeatData[key] = val;
      repeatData.$index = index;
      const newElement = this.cloneNode(node, repeatData);
      const nodeAttrs = (newElement as Element).attributes;
      const text = newElement.textContent;
      const reg = /\{\{(.*)\}\}/g;

      this.$fragment.insertBefore(newElement, node);

      if (this.isTextNode((newElement as Element)) && reg.test(text)) new CompileUtilForRepeat(this.$fragment).templateUpdater(newElement as Element, val, key, vm);
      
      if (nodeAttrs) {
        Array.from(nodeAttrs).forEach(attr => {
          const attrName = attr.name;
          if (this.isDirective(attrName) && attrName !== 'nv-repeat') {
            const dir = attrName.substring(3);
            const exp = attr.value;
            if (this.isEventDirective(dir)) {
              new CompileUtilForRepeat(this.$fragment).eventHandler(newElement as Element, vm, exp, dir, key, val);
            } else {
              new CompileUtilForRepeat(this.$fragment).bind(newElement as Element, key, dir, exp, index, vm, value);
            }
          }
        });
      }

      // first insert node before repeatnode, and remove repeatnode in Compile
      if (newElement.hasChildNodes() && this.$fragment.contains(newElement)) this.repeatChildrenUpdater((newElement as Element), val, expFather, index, vm, value);
    });
  }

  /**
   * update child of nv-repeat DOM
   *
   * if child is an nv-repeat DOM, it will into CompileUtil repeatUpdater
   * 
   * @param {Element} node
   * @param {*} value
   * @param {string} expFather
   * @param {number} index
   * @param {*} vm
   * @param {*} watchValue
   * @memberof CompileUtil
   */
  public repeatChildrenUpdater(node: Element, value: any, expFather: string, index: number, vm: any, watchValue: any): void {
    const key = expFather.split(' ')[1];
    Array.from(node.childNodes).forEach((child: Element) => {
      child.repeatData = node.repeatData || {};
      child.repeatData[key] = value;
      child.repeatData.$index = index;
      if (this.isRepeatProp(child)) child.setAttribute(`_prop-${key}`, JSON.stringify(value));

      const nodeAttrs = child.attributes;
      const text = child.textContent;
      const reg = /\{\{(.*)\}\}/g;

      if (this.isTextNode((child as Element)) && reg.test(text)) new CompileUtilForRepeat(node).templateUpdater(child, value, key, vm);
      if (nodeAttrs) {
        Array.from(nodeAttrs).forEach(attr => {
          const attrName = attr.name;
          const exp = attr.value;
          const dir = attrName.substring(3);
          if (this.isDirective(attrName) && attrName !== 'nv-repeat' && new RegExp(`(^${key})|(^state)|(^@)`).test(exp)) {
            if (this.isEventDirective(dir)) {
              new CompileUtilForRepeat(node).eventHandler(child, vm, exp, dir, key, value);
            } else {
              new CompileUtilForRepeat(node).bind(child, key, dir, exp, index, vm, watchValue);
            }
            child.removeAttribute(attrName);
          }
        });
      }

      if (child.hasChildNodes() && !this.isRepeatNode(child) && node.contains(child)) this.repeatChildrenUpdater(child, value, expFather, index, vm, watchValue);

      const newAttrs = child.attributes;
      if (newAttrs && node.contains(child)) {
        const restRepeat = Array.from(newAttrs).find(attr => this.isDirective(attr.name) && attr.name === 'nv-repeat');
        if (restRepeat) {
          const newWatchData = restRepeat.value.split(' ')[3];
          // first compile and then remove repeatNode
          if (/^(state\.)/.test(newWatchData)) {
            new CompileUtil(node).bind(child, vm, restRepeat.value, restRepeat.name.substring(3));
            if (node.contains(child)) node.removeChild(child);
          }
          if (new RegExp(`(^${key})`).test(newWatchData)) {
            new CompileUtil(node).repeatUpdater(child, this._getValueByValue(value, newWatchData, key), restRepeat.value, vm);
            if (node.contains(child)) node.removeChild(child);
          }
        }
      }
    });
  }

  /**
   * judge attribute is nv directive or not
   *
   * @param {string} attr
   * @returns {boolean}
   * @memberof CompileUtil
   */
  public isDirective(attr: string): boolean {
    return attr.indexOf('nv-') === 0;
  }

  /**
   * judge attribute is nv event directive or not
   *
   * @param {string} event
   * @returns {boolean}
   * @memberof CompileUtil
   */
  public isEventDirective(event: string): boolean {
    return event.indexOf('on') === 0;
  }

  /**
   * judge DOM is a element node or not
   *
   * @param {Element} node
   * @returns {boolean}
   * @memberof CompileUtil
   */
  public isElementNode(node: Element): boolean {
    return node.nodeType === 1;
  }

  /**
   * judge DOM is nv-repeat DOM or not
   *
   * @param {Element} node
   * @returns {boolean}
   * @memberof CompileUtil
   */
  public isRepeatNode(node: Element): boolean {
    const nodeAttrs = node.attributes;
    let result = false;
    if (nodeAttrs) {
      Array.from(nodeAttrs).forEach(attr => {
        const attrName = attr.name;
        if (attrName === 'nv-repeat') result = true;
      });
    }
    return result;
  }

  /**
   * judge DOM is nv-if DOM or not
   *
   * @param {Element} node
   * @returns {boolean}
   * @memberof CompileUtil
   */
  public isIfNode(node: Element): boolean {
    const nodeAttrs = node.attributes;
    let result = false;
    if (nodeAttrs) {
      Array.from(nodeAttrs).forEach(attr => {
        const attrName = attr.name;
        if (attrName === 'nv-if') result = true;
      });
    }
    return result;
  }

  /**
   * judge DOM is a Component DOM in a repeat DOM or not
   *
   * @param {Element} node
   * @returns {boolean}
   * @memberof CompileUtil
   */
  public isRepeatProp(node: Element): boolean {
    const nodeAttrs = node.attributes;
    const result = false;
    if (nodeAttrs) return !!(Array.from(nodeAttrs).find(attr => /^\{(.+)\}$/.test(attr.value)));
    return result;
  }

  /**
   * judge DOM is text node or not
   *
   * @param {Element} node
   * @returns {boolean}
   * @memberof CompileUtil
   */
  public isTextNode(node: Element): boolean {
    return node.nodeType === 3;
  }

  /**
   * clone Node and clone it event
   * 
   * event by attribute in DOM: eventTypes
   * repeat data by attribute in DOM: repeatData
   *
   * @param {Element} node
   * @param {*} [repeatData]
   * @returns {Node}
   * @memberof CompileUtil
   */
  public cloneNode(node: Element, repeatData?: any): Node {
    const newElement = node.cloneNode(true);
    if (node.eventTypes) {
      JSON.parse(node.eventTypes).forEach((eve: string) => (newElement as any)[`on${eve}`] = (node as any)[`event${eve}`]);
      newElement.eventTypes = JSON.parse(JSON.stringify(node.eventTypes));
    }
    if (repeatData) newElement.repeatData = repeatData;
    return newElement;
  }
}
