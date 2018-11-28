declare global {
  interface Element {
    value?: any;
    eventTypes?: string;
    repeatData?: {
      [key: string]: any;
    };
    indiv_repeat_key?: any;
    isComponent?: boolean;
  }
  interface Node {
    eventTypes?: string;
    repeatData?: {
      [key: string]: any;
    };
    indiv_repeat_key?: any;
    isComponent?: boolean;
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
   *
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
   * get Function for vm
   *
   * @param {*} vm
   * @param {string} exp
   * @returns {Function}
   * @memberof CompileUtil
   */
  public _getVMFunction(vm: any, exp: string): Function {
    const fnList = exp.replace(/^(\@)/, '').replace(/\(.*\)/, '').split('.');
    let fn = vm;
    fnList.forEach(f => {
      fn = fn[f];
    });
    return fn as Function;
  }

  /**
   * get Function arguments for vm
   *
   * @param {*} vm
   * @param {string} exp
   * @param {Element} node
   * @param {string} key
   * @param {*} val
   * @returns {any[]}
   * @memberof CompileUtilForRepeat
   */
  public _getVMFunctionArguments(vm: any, exp: string, node: Element, key?: string, val?: any): any[] {
    const args = exp.replace(/^(\@)/, '').match(/\((.*)\)/)[1].replace(/\s+/g, '').split(',');
    const argsList: any[] = [];
    const utilVm = this;
    args.forEach(arg => {
      if (arg === '') return false;
      if (arg === '$element') return argsList.push(node);
      if (arg === 'true' || arg === 'false') return argsList.push(arg === 'true');
      if (arg === 'null') return argsList.push(null);
      if (arg === 'undefined') return argsList.push(undefined);
      if (utilVm.isFromState(vm.state, arg)) return argsList.push(utilVm._getVMVal(vm.state, arg));
      if (/^\'.*\'$/.test(arg)) return argsList.push(arg.match(/^\'(.*)\'$/)[1]);
      if (!/^\'.*\'$/.test(arg) && /^[0-9]*$/.test(arg)) return argsList.push(Number(arg));
      if (arg.indexOf(key) === 0 || arg.indexOf(`${key}.`) === 0) return argsList.push(utilVm._getVMRepeatVal(val, arg, key));
      if (node.repeatData) {
        // $index in this
        Object.keys(node.repeatData).forEach(data => {
          if (arg.indexOf(data) === 0 || arg.indexOf(`${data}.`) === 0) return argsList.push(utilVm._getValueByValue(node.repeatData[data], arg, data));
        });
      }
    });
    return argsList;
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
   * set value from vm.state
   *
   * @param {*} vm
   * @param {string} exp
   * @param {*} value
   * @memberof CompileUtilForRepeat
   */
  public _setVMVal(vm: any, exp: string, value: any): void {
    let stateValue: any = null;
    const keyList = exp.split('.');
    if (keyList.length === 1) vm.state[exp] = value;
    else {
      keyList.forEach((key, index) => {
        if (index === 0) stateValue = vm.state[key];
        if (index !== 0 && index !== keyList.length - 1) stateValue = stateValue[key];
        if (index === keyList.length - 1) stateValue[key] = value;
      });
    }
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
  public bind(node: Element, key?: string, dir?: string, exp?: string, index?: number, vm?: any, watchValue?: any, val?: any): void {
    const repeatValue = (node.repeatData)[key];
    let value;
    if (/^(\@)/.test(exp)) {
      if (dir === 'model') throw new Error(`directive: nv-model can't use ${exp} as value`);
      // if @Function need function return value
      const fn = this._getVMFunction(vm, exp);
      const argsList = this._getVMFunctionArguments(vm, exp, node, key, val);
      value = fn.apply(vm, argsList);
    // repeat value
    } else if (exp.indexOf(key) === 0 || exp.indexOf(`${key}.`) === 0) value = this._getVMRepeatVal(repeatValue, exp, key);
    // normal value
    else if (this.isFromState(vm.state, exp)) value = this._getVMVal(vm.state, exp);
    else if (exp === '$index') value = index;
    else if (/^\'.*\'$/.test(exp)) value = exp.match(/^\'(.*)\'$/)[1];
    else if (!/^\'.*\'$/.test(exp) && /^[0-9]*$/g.test(exp)) value = Number(exp);
    else if (exp === 'true' || exp === 'false') value = (exp === 'true');
    else if (exp === 'null') value = null;
    else if (exp === 'undefined') value = undefined;
    else throw new Error(`directive: nv-${dir} can't use recognize this value ${exp}`);

    if (!node.hasChildNodes()) this.templateUpdater(node, repeatValue, key, vm);

    const updaterFn: any = this[`${dir}Updater`];
    switch (dir) {
      case 'model':
        let watchData;
        if (exp.indexOf(key) === 0 || exp.indexOf(`${key}.`) === 0) {
          watchData = watchValue;
        } else {
          watchData = this._getVMVal(vm.state, exp);
        }
        if (updaterFn) (updaterFn as Function).call(this, node, value, exp, key, index, watchData, vm);
        break;
      case 'text':
        if (updaterFn) (updaterFn as Function).call(this, node, value);
        break;
      case 'html':
        if (updaterFn) (updaterFn as Function).call(this, node, value);
        break;
      case 'if':
        if (updaterFn) (updaterFn as Function).call(this, node, value);
        break;
      case 'class':
        if (updaterFn) (updaterFn as Function).call(this, node, value);
        break;
      case 'key':
        if (updaterFn) (updaterFn as Function).call(this, node, value);
        break;
      default:
        this.commonUpdater.call(this, node, value, dir);
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
      const textList = text.match(/(\{\{[^\{\}]+?\}\})/g);
      if (textList && textList.length > 0) {
        for (let i = 0; i < textList.length; i++) {
          const exp = textList[i].replace('{{', '').replace('}}', '');
          let value = null;
          if (/^(\@)/.test(exp)) {
            const fn = this._getVMFunction(vm, exp);
            const argsList = this._getVMFunctionArguments(vm, exp, node, key, val);
            value = fn.apply(vm, argsList);
          } else if (exp.indexOf(key) === 0 || exp.indexOf(`${key}.`) === 0) {
            value = this._getVMRepeatVal(val, exp, key);
          } else if (this.isFromState(vm.state, exp)) {
            value = this._getVMVal(vm.state, exp);
          } else {
            throw new Error(`directive: {{${exp}}} can\'t use recognize ${exp}`);
          }
          node.textContent = node.textContent.replace(textList[i], value);
        }
      }
    }
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
      if (utilVm.isFromState(vm.state, exp)) {
        if ((event.target as HTMLInputElement).value === watchData) return;
        utilVm._setVMVal(vm, exp, (event.target as HTMLInputElement).value);
      } else if (exp.indexOf(key) === 0 || exp.indexOf(`${key}.`) === 0) {
        if (typeof watchData[index] !== 'object') watchData[index] = (event.target as HTMLInputElement).value;
        if (typeof watchData[index] === 'object') {
          let vals = utilVm._getValueByValue(watchData[index], exp, key);
          vals = (event.target as HTMLInputElement).value;
          utilVm._setValueByValue(watchData[index], exp, key, vals);
        }
      } else {
        throw new Error('directive: nv-model can\'t use recognize this value');
      }
    };

    (node as Node).addEventListener('input', func);
    (node as any).eventinput = func;
    if (node.eventTypes) {
      const eventlist = JSON.parse(node.eventTypes);
      eventlist.push('input');
      node.eventTypes = JSON.stringify(eventlist);
    }
    if (!node.eventTypes) node.eventTypes = JSON.stringify(['input']);
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
   * find exp is member of vm.state
   *
   * @param {*} vm
   * @param {string} exp
   * @returns {boolean}
   * @memberof CompileUtil
   */
  public isFromState(state: any, exp: string): boolean {
    if (!state) return false;
    const value = exp.replace('()', '').split('.')[0];
    return state.hasOwnProperty(value);
  }

  /**
   * update class for nv-class
   *
   * @param {Element} node
   * @param {*} value
   * @returns {void}
   * @memberof CompileUtilForRepeat
   */
  public classUpdater(node: Element, value: any): void {
    if (!value) return;
    let className = node.className;
    className = className.replace(/\s$/, '');
    const space = className && String(value) ? ' ' : '';
    node.className = className + space + value;
  }

  /**
   * update value of repeat node for nv-key
   *
   * @param {Element} node
   * @param {*} value
   * @memberof CompileUtilForRepeat
   */
  public keyUpdater(node: Element, value: any): void {
    node.indiv_repeat_key = value;
  }

  /**
   * commonUpdater for nv directive except repeat model text html if class
   *
   * @param {Element} node
   * @param {*} value
   * @param {string} dir
   * @memberof CompileUtil
   */
  public commonUpdater(node: Element, value: any, dir: string): void {
    if (value) (node as any)[dir] = value;
    if (!value && (node as any)[dir]) (node as any)[dir] = null;
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

    const fn = this._getVMFunction(vm, exp);

    const args = exp.replace(/^(\@)/, '').match(/\((.*)\)/)[1].replace(/\s+/g, '').split(',');

    const utilVm = this;
    const func = function(event: Event): any {
      const argsList: any[] = [];
      args.forEach(arg => {
        if (arg === '') return false;
        if (arg === '$event') return argsList.push(event);
        if (arg === '$element') return argsList.push(node);
        if (arg === 'true' || arg === 'false') return argsList.push(arg === 'true');
        if (arg === 'null') return argsList.push(null);
        if (arg === 'undefined') return argsList.push(undefined);
        if (utilVm.isFromState(vm.state, arg)) return argsList.push(utilVm._getVMVal(vm.state, arg));
        if (/^\'.*\'$/.test(arg)) return argsList.push(arg.match(/^\'(.*)\'$/)[1]);
        if (!/^\'.*\'$/.test(arg) && /^[0-9]*$/.test(arg)) return argsList.push(Number(arg));
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
      (node as Node).addEventListener(eventType, func);
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
    valueList.forEach(v => {
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
    const value = this._getVMVal(vm.state, vlList[3]);
    return value;
  }

  /**
   * get Function for vm
   *
   * @param {*} vm
   * @param {string} exp
   * @returns {Function}
   * @memberof CompileUtil
   */
  public _getVMFunction(vm: any, exp: string): Function {
    const fnList = exp.replace(/^(\@)/, '').replace(/\(.*\)/, '').split('.');
    let fn = vm;
    fnList.forEach(f => {
      fn = fn[f];
    });
    return fn as Function;
  }

  /**
   * get Function arguments for vm
   *
   * @param {*} vm
   * @param {string} exp
   * @param {Element} node
   * @returns {any[]}
   * @memberof CompileUtil
   */
  public _getVMFunctionArguments(vm: any, exp: string, node: Element): any[] {
    const args = exp.replace(/^(\@)/, '').match(/\((.*)\)/)[1].replace(/\s+/g, '').split(',');
    const argsList: any[] = [];
    args.forEach(arg => {
      if (arg === '') return false;
      if (arg === '$element') return argsList.push(node);
      if (arg === 'true' || arg === 'false') return argsList.push(arg === 'true');
      if (arg === 'null') return argsList.push(null);
      if (arg === 'undefined') return argsList.push(undefined);
      if (this.isFromState(vm.state, arg)) return argsList.push(this._getVMVal(vm.state, arg));
      if (/^\'.*\'$/.test(arg)) return argsList.push(arg.match(/^\'(.*)\'$/)[1]);
      if (!/^\'.*\'$/.test(arg) && /^[0-9]*$/.test(arg)) return argsList.push(Number(arg));
    });
    return argsList;
  }

  /**
   * set value from vm.state
   *
   * @param {*} vm
   * @param {string} exp
   * @param {*} value
   * @memberof CompileUtil
   */
  public _setVMVal(vm: any, exp: string, value: any): void {
    let stateValue: any = null;
    const keyList = exp.split('.');
    if (keyList.length === 1) vm.state[exp] = value;
    else {
      keyList.forEach((key, index) => {
        if (index === 0) stateValue = vm.state[key];
        if (index !== 0 && index !== keyList.length - 1) stateValue = stateValue[key];
        if (index === keyList.length - 1) stateValue[key] = value;
      });
    }
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
      let value = null;
      // for @Function(arg)
      if (/^(\@)/.test(exp)) {
        if (dir === 'model') throw new Error(`directive: nv-model can't use ${exp} as value`);
        // if @Function need function return value
        const fn = this._getVMFunction(vm, exp);
        const argsList = this._getVMFunctionArguments(vm, exp, node);
        value = fn.apply(vm, argsList);
      // normal value
      } else if (this.isFromState(vm.state, exp)) value = this._getVMVal(vm.state, exp);
      else if (/^\'.*\'$/.test(exp)) value = exp.match(/^\'(.*)\'$/)[1];
      else if (!/^\'.*\'$/.test(exp) && /^[0-9]*$/g.test(exp)) value = Number(exp);
      else if (exp === 'true' || exp === 'false') value = (exp === 'true');
      else if (exp === 'null') value = null;
      else if (exp === 'undefined') value = undefined;
      else throw new Error(`directive: nv-${dir} can't use recognize this value ${exp}`);

      // compile unrepeatNode's attributes
      switch (dir) {
        case 'model':
          if (updaterFn) (updaterFn as Function).call(this, node, value, exp, vm);
          break;
        case 'text':
          if (updaterFn) (updaterFn as Function).call(this, node, value);
          break;
        case 'html':
          if (updaterFn) (updaterFn as Function).call(this, node, value);
          break;
        case 'if':
          if (updaterFn) (updaterFn as Function).call(this, node, value);
          break;
        case 'class':
          if (updaterFn) (updaterFn as Function).call(this, node, value);
          break;
        case 'key':
          if (updaterFn) (updaterFn as Function).call(this, node, value);
          break;
        default:
          this.commonUpdater.call(this, node, value, dir);
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
    const _exp = exp.replace('{{', '').replace('}}', '');
    let value = null;
    if (/^(\@)/.test(_exp)) {
      const fn = this._getVMFunction(vm, _exp);
      const argsList = this._getVMFunctionArguments(vm, _exp, node);
      value = fn.apply(vm, argsList);
    } else if (this.isFromState(vm.state, _exp)) {
      value = this._getVMVal(vm.state, _exp);
    } else {
      throw new Error(`directive: ${exp} can't use recognize this value`);
    }
    node.textContent = node.textContent.replace(exp, value);
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

    const func = (event: Event) => {
      event.preventDefault();
      if (this.isFromState(vm.state, exp)) this._setVMVal(vm, exp, (event.target as HTMLInputElement).value);
    };

    (node as Node).addEventListener('input', func);
    (node as any).eventinput = func;
    if (node.eventTypes) {
      const eventlist = JSON.parse(node.eventTypes);
      eventlist.push('input');
      node.eventTypes = JSON.stringify(eventlist);
    }
    if (!node.eventTypes) node.eventTypes = JSON.stringify(['input']);
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
   * @returns {void}
   * @memberof CompileUtil
   */
  public classUpdater(node: Element, value: any): void {
    if (!value) return;
    let className = node.className;
    className = className.replace(/\s$/, '');
    const space = className && String(value) ? ' ' : '';
    node.className = className + space + value;
  }

  /**
   * update value of repeat node for nv-key
   *
   * @param {Element} node
   * @param {*} value
   * @memberof CompileUtilForRepeat
   */
  public keyUpdater(node: Element, value: any): void {
    node.indiv_repeat_key = value;
  }

  /**
   * commonUpdater for nv directive except repeat model text html if class
   *
   * @param {Element} node
   * @param {*} value
   * @param {string} dir
   * @memberof CompileUtil
   */
  public commonUpdater(node: Element, value: any, dir: string): void {
    if (value) (node as any)[dir] = value;
    if (!value && (node as any)[dir]) (node as any)[dir] = null;
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
    if (!value) return;
    if (value && !(value instanceof Array)) throw new Error('compile error: nv-repeat need an Array!');

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
            if (this.isEventDirective(dir)) new CompileUtilForRepeat(this.$fragment).eventHandler(newElement as Element, vm, exp, dir, key, val);
            else new CompileUtilForRepeat(this.$fragment).bind(newElement as Element, key, dir, exp, index, vm, value, val);
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
      // mark for container of @Component
      if (this.isElementNode(child)) {
        const findDeclaration = vm.$declarationMap.get(child.tagName.toLocaleLowerCase());
        if (findDeclaration && findDeclaration.nvType === 'nvComponent') child.isComponent = true;
      }

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
          if (this.isDirective(attrName) && attrName !== 'nv-repeat' && (new RegExp(`(^${key})|(^@)`).test(exp) || this.isFromState(vm.state, exp))) {
            if (this.isEventDirective(dir)) new CompileUtilForRepeat(node).eventHandler(child, vm, exp, dir, key, value);
            else new CompileUtilForRepeat(node).bind(child, key, dir, exp, index, vm, watchValue, value);
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
          if (this.isFromState(vm.state, newWatchData)) {
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
   * compile event and build eventType in DOM
   *
   * @param {Element} node
   * @param {*} vm
   * @param {string} exp
   * @param {string} eventName
   * @memberof Compile
   */
  public eventHandler(node: Element, vm: any, exp: string, eventName: string): void {
    const eventType = eventName.split(':')[1];

    const fn = this._getVMFunction(vm, exp);

    const args = exp.replace(/^(\@)/, '').match(/\((.*)\)/)[1].replace(/\s+/g, '').split(',');

    const vmUtils = this;

    const func = function(event: Event): void {
      const argsList: any[] = [];
      args.forEach(arg => {
        if (arg === '') return false;
        if (arg === '$event') return argsList.push(event);
        if (arg === '$element') return argsList.push(node);
        if (arg === 'true' || arg === 'false') return argsList.push(arg === 'true');
        if (arg === 'null') return argsList.push(null);
        if (arg === 'undefined') return argsList.push(undefined);
        if (vmUtils.isFromState(vm.state, arg)) return argsList.push(vmUtils._getVMVal(vm.state, arg));
        if (/^\'.*\'$/.test(arg)) return argsList.push(arg.match(/^\'(.*)\'$/)[1]);
        if (!/^\'.*\'$/.test(arg) && /^[0-9]*$/.test(arg)) return argsList.push(Number(arg));
      });
      fn.apply(vm, argsList);
    };
    if (eventType && fn) {
      (node as Node).addEventListener(eventType, func);
      (node as any)[`event${eventType}`] = func;
      if (node.eventTypes) {
        const eventlist = JSON.parse(node.eventTypes);
        eventlist.push(eventType);
        node.eventTypes = JSON.stringify(eventlist);
      }
      if (!node.eventTypes) node.eventTypes = JSON.stringify([eventType]);
    }
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
   * find exp is member of vm.state
   *
   * @param {*} vm
   * @param {string} exp
   * @returns {boolean}
   * @memberof CompileUtil
   */
  public isFromState(state: any, exp: string): boolean {
    if (!state) return false;
    const value = exp.replace('()', '').split('.')[0];
    return state.hasOwnProperty(value);
  }

  /**
   * clone Node and clone it event
   *
   * event by attribute in DOM: eventTypes
   * repeat data by attribute in DOM: repeatData
   * isComponent: clone Component need add isComponent=true
   *
   * @param {Element} node
   * @param {*} [repeatData]
   * @returns {Node}
   * @memberof CompileUtil
   */
  public cloneNode(node: Element, repeatData?: any): Node {
    const newElement = node.cloneNode(true);
    if (node.eventTypes) {
      JSON.parse(node.eventTypes).forEach((eventType: string) => {
        (newElement as Node).addEventListener(eventType, (node as any)[`event${eventType}`]);
        (newElement as any)[`event${eventType}`] = (node as any)[`event${eventType}`];
      });
      newElement.eventTypes = node.eventTypes;
    }
    if (repeatData) newElement.repeatData = repeatData;
    if (node.isComponent) newElement.isComponent = true;
    return newElement;
  }
}

/**
 * for virtual-DOM to diff attributes of nv-directive
 *
 * @export
 * @param {(DocumentFragment | Element)} node
 * @returns {string[]}
 */
export function shouldDiffAttributes(node: DocumentFragment | Element): string[] {
  const shouldDiffAttr: string[] = [];
  const nvDirective = [
    'nv-model',
    'nv-text',
    'nv-html',
    'nv-if',
    'nv-key',
  ];
  if ((node as Element).attributes) {
    Array.from((node as Element).attributes).forEach(attr => {
      if (/^nv\-.*/.test(attr.name) && nvDirective.indexOf(attr.name) === -1) {
        shouldDiffAttr.push(attr.name.replace('nv-', ''));
      }
    });
  }
  return shouldDiffAttr;
}
