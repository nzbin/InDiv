import { IComponent } from "../types";

import { Vnode, TAttributes } from "../vnode";
import { Utils } from '../utils';

const utils = new Utils();

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
  public fragment?: Vnode[];

  /**
   * Creates an instance of CompileUtilForRepeat.
   *
   * @param {Vnode[]} [fragment]
   * @memberof CompileUtilForRepeat
   */
  constructor(fragment?: Vnode[]) {
    this.fragment = fragment;
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
    const valueList = exp.replace(/\(.*\)/, '').split('.');
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
    const valueList = exp.replace(/\(.*\)/, '').split('.');
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
    const valueList = exp.replace(/\(.*\)/, '').split('.');
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
    const fnList = exp.replace(/\(.*\)/, '').split('.');
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
  public _getVMFunctionArguments(vm: any, exp: string, vnode: Vnode, key?: string, val?: any): any[] {
    const args = exp.match(/\((.*)\)/)[1].replace(/\s+/g, '').split(',');
    const argsList: any[] = [];
    const utilVm = this;
    args.forEach(arg => {
      if (arg === '') return false;
      if (arg === '$element') return argsList.push(vnode.nativeElement);
      if (arg === 'true' || arg === 'false') return argsList.push(arg === 'true');
      if (arg === 'null') return argsList.push(null);
      if (arg === 'undefined') return argsList.push(undefined);
      if (utilVm.isFromVM(vm, arg)) return argsList.push(utilVm._getVMVal(vm, arg));
      if (/^\'.*\'$/.test(arg)) return argsList.push(arg.match(/^\'(.*)\'$/)[1]);
      if (/^\".*\"$/.test(arg)) return argsList.push(arg.match(/^\"(.*)\"$/)[1]);
      if (!/^\'.*\'$/.test(arg) && !/^\".*\"$/.test(arg) && /^[0-9]*$/.test(arg)) return argsList.push(Number(arg));
      if (arg.indexOf(key) === 0 || arg.indexOf(`${key}.`) === 0) return argsList.push(utilVm._getVMRepeatVal(val, arg, key));
      if (vnode.repeatData) {
        // $index in this
        Object.keys(vnode.repeatData).forEach(data => {
          if (arg.indexOf(data) === 0 || arg.indexOf(`${data}.`) === 0) return argsList.push(utilVm._getValueByValue(vnode.repeatData[data], arg, data));
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
    const valueList = exp.replace(/\(.*\)/, '').split('.');
    let value = vm;
    let lastKey;
    valueList.forEach((v, index) => {
      if (v === key && index === 0) return lastKey = v;
      if (index < valueList.length) lastKey = v;
      if (index < valueList.length - 1) value = value[v];
    });
    if (lastKey) value[lastKey] = setValue;
  }

  /**
   * set value from vm instance
   *
   * @param {*} vm
   * @param {string} exp
   * @param {*} value
   * @memberof CompileUtilForRepeat
   */
  public _setVMVal(vm: any, exp: string, value: any): void {
    let vmValue: any = null;
    const keyList = exp.split('.');
    if (keyList.length === 1) vm[exp] = value;
    else {
      keyList.forEach((key, index) => {
        if (index === 0) vmValue = vm[key];
        if (index !== 0 && index !== keyList.length - 1) vmValue = vmValue[key];
        if (index === keyList.length - 1) vmValue[key] = value;
      });
    }
  }

  /**
   * bind handler for nv irective
   *
   * @param {Vnode} vnode
   * @param {string} [key]
   * @param {string} [dir]
   * @param {string} [exp]
   * @param {number} [index]
   * @param {*} [vm]
   * @param {*} [watchValue]
   * @memberof CompileUtilForRepeat
   */
  public bind(vnode: Vnode, key?: string, dir?: string, exp?: string, index?: number, vm?: any, watchValue?: any, val?: any): void {
    const repeatValue = vnode.repeatData[key];
    let value;
    if (/^.*\(.*\)$/.test(exp)) {
      if (dir === 'model') throw new Error(`directive: nv-model can't use ${exp} as value`);
      // if Function() need function return value
      const fn = this._getVMFunction(vm, exp);
      const argsList = this._getVMFunctionArguments(vm, exp, vnode, key, val);
      value = fn.apply(vm, argsList);
      // repeat value
    } else if (exp.indexOf(key) === 0 || exp.indexOf(`${key}.`) === 0) value = this._getVMRepeatVal(repeatValue, exp, key);
    // normal value
    else if (this.isFromVM(vm, exp)) value = this._getVMVal(vm, exp);
    else if (exp === '$index') value = index;
    else if (/^\'.*\'$/.test(exp)) value = exp.match(/^\'(.*)\'$/)[1];
    else if (/^\".*\"$/.test(exp)) value = exp.match(/^\"(.*)\"$/)[1];
    else if (!/^\'.*\'$/.test(exp) && !/^\".*\"$/.test(exp) && /^[0-9]*$/g.test(exp)) value = Number(exp);
    else if (exp === 'true' || exp === 'false') value = (exp === 'true');
    else if (exp === 'null') value = null;
    else if (exp === 'undefined') value = undefined;
    else if (vnode.repeatData) {
      Object.keys(vnode.repeatData).forEach(data => {
        if (exp.indexOf(data) === 0 || exp.indexOf(`${data}.`) === 0) value = this._getValueByValue(vnode.repeatData[data], exp, data);
      });
    } else throw new Error(`directive: nv-${dir} can't use recognize this value ${exp}`);

    if (!vnode.childNodes || vnode.childNodes.length === 0) this.templateUpdater(vnode, repeatValue, key, vm);

    const updaterFn: any = this[`${dir}Updater`];
    switch (dir) {
      case 'model':
        let watchData;
        if (exp.indexOf(key) === 0 || exp.indexOf(`${key}.`) === 0) {
          watchData = watchValue;
        } else {
          watchData = this._getVMVal(vm, exp);
        }
        if (updaterFn) (updaterFn as Function).call(this, vnode, value, exp, key, index, watchData, vm);
        break;
      case 'text':
        if (updaterFn) (updaterFn as Function).call(this, vnode, value);
        break;
      case 'html':
        if (updaterFn) (updaterFn as Function).call(this, vnode, value);
        break;
      case 'if':
        if (updaterFn) (updaterFn as Function).call(this, vnode, value);
        break;
      case 'class':
        if (updaterFn) (updaterFn as Function).call(this, vnode, value);
        break;
      case 'key':
        if (updaterFn) (updaterFn as Function).call(this, vnode, value);
        break;
      default:
        this.commonUpdater.call(this, vnode, value, dir);
    }
  }

  /**
   * update text for {{}}
   *
   * @param {Vnode} vnode
   * @param {*} [val]
   * @param {string} [key]
   * @param {*} [vm]
   * @memberof CompileUtilForRepeat
   */
  public templateUpdater(vnode: Vnode, val?: any, key?: string, vm?: any): void {
    const text = vnode.nodeValue;
    const reg = /\{\{(.*)\}\}/g;
    if (reg.test(text)) {
      const textList = text.match(/(\{\{[^\{\}]+?\}\})/g);
      if (textList && textList.length > 0) {
        for (let i = 0; i < textList.length; i++) {
          const exp = textList[i].replace('{{', '').replace('}}', '');
          let value = null;
          if (/^.*\(.*\)$/.test(exp)) {
            const fn = this._getVMFunction(vm, exp);
            const argsList = this._getVMFunctionArguments(vm, exp, vnode, key, val);
            value = fn.apply(vm, argsList);
          } else if (exp.indexOf(key) === 0 || exp.indexOf(`${key}.`) === 0) value = this._getVMRepeatVal(val, exp, key);
          else if (this.isFromVM(vm, exp)) value = this._getVMVal(vm, exp);
          else if (vnode.repeatData) {
            Object.keys(vnode.repeatData).forEach(data => {
              if (exp.indexOf(data) === 0 || exp.indexOf(`${data}.`) === 0) value = this._getValueByValue(vnode.repeatData[data], exp, data);
            });
          } else throw new Error(`directive: {{${exp}}} can\'t use recognize ${exp}`);
          vnode.nodeValue = vnode.nodeValue.replace(textList[i], value);
        }
      }
    }
  }

  /**
   * update value of input for nv-model
   *
   * @param {Vnode} vnode
   * @param {*} value
   * @param {string} exp
   * @param {string} key
   * @param {number} index
   * @param {*} watchData
   * @param {*} vm
   * @memberof CompileUtilForRepeat
   */
  public modelUpdater(vnode: Vnode, value: any, exp: string, key: string, index: number, watchData: any, vm: any): void {
    vnode.value = typeof value === 'undefined' ? '' : value;

    const utilVm = this;
    const func = function (event: Event): void {
      event.preventDefault();
      if (utilVm.isFromVM(vm, exp)) {
        if ((event.target as HTMLInputElement).value === watchData) return;
        utilVm._setVMVal(vm, exp, (event.target as HTMLInputElement).value);
      } else if (exp.indexOf(key) === 0 || exp.indexOf(`${key}.`) === 0) {
        if (typeof watchData[index] !== 'object') watchData[index] = (event.target as HTMLInputElement).value;
        if (typeof watchData[index] === 'object') {
          let vals = utilVm._getValueByValue(watchData[index], exp, key);
          vals = (event.target as HTMLInputElement).value;
          utilVm._setValueByValue(watchData[index], exp, key, vals);
        }
      } else throw new Error(`directive: nv-model can\'t use recognize this prop ${exp}`);
    };
    const sameEventType = vnode.eventTypes.find(_eventType => _eventType.type === 'input');
    if (sameEventType) sameEventType.handler = func;
    if (!sameEventType) vnode.eventTypes.push({
      type: 'input',
      handler: func,
    });
  }

  /**
   * update text for nv-text
   *
   * @param {Vnode} vnode
   * @param {*} value
   * @returns {void}
   * @memberof CompileUtilForRepeat
   */
  public textUpdater(vnode: Vnode, value: any): void {
    if (vnode.tagName === 'input') return vnode.value = value;
    vnode.nodeValue = typeof value === 'undefined' ? '' : value;
  }

  /**
   * update html for nv-html
   *
   * @param {Vnode} vnode
   * @param {*} value
   * @memberof CompileUtilForRepeat
   */
  public htmlUpdater(vnode: Vnode, value: any): void {
    const findAttribute = vnode.attributes.find(attr => attr.name === 'nv-html');
    findAttribute.nvValue = value;
  }

  /**
   * remove or show DOM for nv-if
   *
   * @param {Vnode} vnode
   * @param {*} value
   * @memberof CompileUtilForRepeat
   */
  public ifUpdater(vnode: Vnode, value: any): void {
    if (!value && vnode.parentVnode.childNodes.indexOf(vnode) !== -1) vnode.parentVnode.childNodes.splice(vnode.parentVnode.childNodes.indexOf(vnode), 1);
    if (value) {
      const findAttribute = vnode.attributes.find(attr => attr.name === 'nv-if');
      findAttribute.nvValue = value;
    }
  }

  /**
   * update class for nv-class
   *
   * @param {Vnode} vnode
   * @param {*} value
   * @returns {void}
   * @memberof CompileUtilForRepeat
   */
  public classUpdater(vnode: Vnode, value: any): void {
    const findAttribute = vnode.attributes.find(attr => attr.name === 'nv-class');
    findAttribute.nvValue = value;
  }

  /**
   * update value of repeat node for nv-key
   *
   * @param {Element} node
   * @param {*} value
   * @memberof CompileUtilForRepeat
   */
  public keyUpdater(vnode: Vnode, value: any): void {
    vnode.key = value;
  }

  /**
   * commonUpdater for nv directive except repeat model text html if class
   *
   * @param {Vnode} vnode
   * @param {*} value
   * @param {string} dir
   * @memberof CompileUtil
   */
  public commonUpdater(vnode: Vnode, value: any, dir: string): void {
    const findAttribute = vnode.attributes.find(attr => attr.name === `nv-${dir}`);
    findAttribute.nvValue = value;
  }

  /**
   * compile event and build eventType in DOM
   *
   * @param {Vnode} vnode
   * @param {*} vm
   * @param {string} exp
   * @param {string} eventName
   * @param {string} key
   * @param {*} val
   * @memberof CompileUtilForRepeat
   */
  public eventHandler(vnode: Vnode, vm: any, exp: string, eventName: string, key: string, val: any): void {
    const eventType = eventName.split(':')[1];

    const fn = this._getVMFunction(vm, exp);
    const args = exp.match(/\((.*)\)/)[1].replace(/\s+/g, '').split(',');

    const utilVm = this;
    const func = function (event: Event): any {
      const argsList: any[] = [];
      args.forEach(arg => {
        if (arg === '') return false;
        if (arg === '$event') return argsList.push(event);
        if (arg === '$element') return argsList.push(event.target);
        if (arg === 'true' || arg === 'false') return argsList.push(arg === 'true');
        if (arg === 'null') return argsList.push(null);
        if (arg === 'undefined') return argsList.push(undefined);
        if (utilVm.isFromVM(vm, arg)) return argsList.push(utilVm._getVMVal(vm, arg));
        if (/^\'.*\'$/.test(arg)) return argsList.push(arg.match(/^\'(.*)\'$/)[1]);
        if (/^\".*\"$/.test(arg)) return argsList.push(arg.match(/^\"(.*)\"$/)[1]);
        if (!/^\'.*\'$/.test(arg) && !/^\".*\"$/.test(arg) && /^[0-9]*$/.test(arg)) return argsList.push(Number(arg));
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
      const sameEventType = vnode.eventTypes.find(_eventType => _eventType.type === eventType);
      if (sameEventType) sameEventType.handler = func;
      if (!sameEventType) vnode.eventTypes.push({
        type: eventType,
        handler: func,
      });
    }
  }

  /**
   * handle prop
   *
   * @param {Vnode} vnode
   * @param {*} vm
   * @param {TAttributes} attr
   * @param {string} prop
   * @memberof CompileUtilForRepeat
   */
  public propHandler(vnode: Vnode, vm: any, attr: TAttributes): void {
    const prop = /^\{(.+)\}$/.exec(attr.value);
    if (prop) {
      const propValue = prop[1];
      let _prop = null;
      if (/^.*\(.*\)$/.test(propValue)) {
        const fn = this._getVMFunction(vm, propValue);
        const args = propValue.match(/\((.*)\)/)[1].replace(/\s+/g, '').split(',');
        const argsList: any[] = [];
        args.forEach(arg => {
          if (arg === '') return false;
          if (arg === '$element') return argsList.push(vnode.nativeElement);
          if (arg === 'true' || arg === 'false') return argsList.push(arg === 'true');
          if (arg === 'null') return argsList.push(null);
          if (arg === 'undefined') return argsList.push(undefined);
          if (this.isFromVM(vm, arg)) return argsList.push(this._getVMVal(vm, arg));
          if (/^\'.*\'$/.test(arg)) return argsList.push(arg.match(/^\'(.*)\'$/)[1]);
          if (/^\".*\"$/.test(arg)) return argsList.push(arg.match(/^\"(.*)\"$/)[1]);
          if (!/^\'.*\'$/.test(arg) && !/^\".*\"$/.test(arg) && /^[0-9]*$/g.test(arg)) return argsList.push(Number(arg));
          if (vnode.repeatData) {
            // $index in this
            Object.keys(vnode.repeatData).forEach(data => {
              if (arg.indexOf(data) === 0 || arg.indexOf(`${data}.`) === 0) return argsList.push(this._getValueByValue(vnode.repeatData[data], arg, data));
            });
          }
        });
        const value = fn.apply(vm, argsList);
        attr.nvValue = value;
        return;
      }
      const valueList = propValue.split('.');
      const key = valueList[0];
      if (this.isFromVM(vm, propValue)) {
        _prop = this._getVMVal(vm, propValue);
        attr.nvValue = this.buildProps(_prop, vm);
        return;
      }
      // if (_propsKeys.hasOwnProperty(key) || key in _propsKeys) {
      //   _prop = getPropsValue(valueList, _propsKeys[key]);
      //   attr.nvValue = buildProps(_prop, vm);
      // }
      if (vnode.repeatData && vnode.repeatData.hasOwnProperty(key)) {
        _prop = this._getValueByValue(vnode.repeatData[key], propValue, key);
        attr.nvValue = this.buildProps(_prop, vm);
        return;
      }
      if (/^\'.*\'$/.test(propValue)) {
        attr.nvValue = propValue.match(/^\'(.*)\'$/)[1];
        return;
      }
      if (/^\".*\"$/.test(propValue)) {
        attr.nvValue = propValue.match(/^\"(.*)\"$/)[1];
        return;
      }
      if (!/^\'.*\'$/.test(propValue) && !/^\".*\"$/.test(propValue) && /^[0-9]*$/.test(propValue)) {
        attr.nvValue = Number(prop);
        return;
      }
      if (propValue === 'true' || propValue === 'false') {
        attr.nvValue = (propValue === 'true');
        return;
      }
      if (propValue === 'null') {
        attr.nvValue = null;
        return;
      }
      if (propValue === 'undefined') {
        attr.nvValue = undefined;
        return;
      }
    }
  }

  /**
   * build prop
   *
   * @param {*} prop
   * @param {IComponent} vm
   * @returns {*}
   * @memberof CompileUtilForRepeat
   */
  public buildProps(prop: any, vm: IComponent): any {
    if (utils.isFunction(prop)) return prop.bind(vm);
    else return prop;
  }

  /**
   * find exp is member of vm instance
   *
   * @param {*} vm
   * @param {string} exp
   * @returns {boolean}
   * @memberof CompileUtil
   */
  public isFromVM(vm: any, exp: string): boolean {
    if (!vm) return false;
    const value = exp.replace(/\(.*\)/, '').split('.')[0];
    return value in vm;
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
  public fragment?: Vnode[];

  /**
   * Creates an instance of CompileUtil.
   *
   * @param {Vnode[]} [fragment]
   *  @memberof CompileUtil
   */
  constructor(fragment?: Vnode[]) {
    this.fragment = fragment;
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
    const valueList = exp.replace(/\(.*\)/, '').split('.');
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
    const valueList = exp.replace(/\(.*\)/, '').split('.');
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
    const value = this._getVMVal(vm, vlList[3]);
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
    const fnList = exp.replace(/\(.*\)/, '').split('.');
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
   * @param {Vnode} vnode
   * @returns {any[]}
   * @memberof CompileUtil
   */
  public _getVMFunctionArguments(vm: any, exp: string, vnode: Vnode): any[] {
    const args = exp.match(/\((.*)\)/)[1].replace(/\s+/g, '').split(',');
    const argsList: any[] = [];
    args.forEach(arg => {
      if (arg === '') return false;
      if (arg === '$element') return argsList.push(vnode.nativeElement);
      if (arg === 'true' || arg === 'false') return argsList.push(arg === 'true');
      if (arg === 'null') return argsList.push(null);
      if (arg === 'undefined') return argsList.push(undefined);
      if (this.isFromVM(vm, arg)) return argsList.push(this._getVMVal(vm, arg));
      if (/^\'.*\'$/.test(arg)) return argsList.push(arg.match(/^\'(.*)\'$/)[1]);
      if (/^\".*\"$/.test(arg)) return argsList.push(arg.match(/^\"(.*)\"$/)[1]);
      if (!/^\'.*\'$/.test(arg) && !/^\".*\"$/.test(arg) && /^[0-9]*$/.test(arg)) return argsList.push(Number(arg));
    });
    return argsList;
  }

  /**
   * set value from vm instance
   *
   * @param {*} vm
   * @param {string} exp
   * @param {*} value
   * @memberof CompileUtil
   */
  public _setVMVal(vm: any, exp: string, value: any): void {
    let vmValue: any = null;
    const keyList = exp.split('.');
    if (keyList.length === 1) vm[exp] = value;
    else {
      keyList.forEach((key, index) => {
        if (index === 0) vmValue = vm[key];
        if (index !== 0 && index !== keyList.length - 1) vmValue = vmValue[key];
        if (index === keyList.length - 1) vmValue[key] = value;
      });
    }
  }

  /**
   * bind handler for nv irective
   *
   * if node is repeat node and it will break compile and into CompileUtilForRepeat
   *
   * @param {Vnode} vnode
   * @param {*} vm
   * @param {string} exp
   * @param {string} dir
   * @memberof CompileUtil
   */
  public bind(vnode: Vnode, vm: IComponent, exp: string, dir: string): void {
    const updaterFn = this[`${dir}Updater`];
    const isRepeatNode = this.isRepeatNode(vnode);
    if (isRepeatNode) {
      // compile repeatNode's attributes
      switch (dir) {
        case 'repeat':
          if (updaterFn) (updaterFn as Function).call(this, vnode, this._getVMRepeatVal(vm, exp), exp, vm);
          break;
      }
    } else {
      let value = null;
      // for Function(arg)
      if (/^.*\(.*\)$/.test(exp)) {
        if (dir === 'model') throw new Error(`directive: nv-model can't use ${exp} as prop`);
        // if @Function need function return value
        const fn = this._getVMFunction(vm, exp);
        const argsList = this._getVMFunctionArguments(vm, exp, vnode);
        value = fn.apply(vm, argsList);
        // normal value
      } else if (this.isFromVM(vm, exp)) value = this._getVMVal(vm, exp);
      else if (/^\'.*\'$/.test(exp)) value = exp.match(/^\'(.*)\'$/)[1];
      else if (/^\".*\"$/.test(exp)) value = exp.match(/^\"(.*)\"$/)[1];
      else if (!/^\'.*\'$/.test(exp) && !/^\".*\"$/.test(exp) && /^[0-9]*$/g.test(exp)) value = Number(exp);
      else if (exp === 'true' || exp === 'false') value = (exp === 'true');
      else if (exp === 'null') value = null;
      else if (exp === 'undefined') value = undefined;
      else if (vnode.repeatData) {
        Object.keys(vnode.repeatData).forEach(data => {
          if (exp.indexOf(data) === 0 || exp.indexOf(`${data}.`) === 0) value = this._getValueByValue(vnode.repeatData[data], exp, data);
        });
      } else throw new Error(`directive: nv-${dir} can't use recognize this value ${exp} as prop`);

      // compile unrepeatNode's attributes
      switch (dir) {
        case 'model':
          if (updaterFn) (updaterFn as Function).call(this, vnode, value, exp, vm);
          break;
        case 'text':
          if (updaterFn) (updaterFn as Function).call(this, vnode, value);
          break;
        case 'html':
          if (updaterFn) (updaterFn as Function).call(this, vnode, value);
          break;
        case 'if':
          if (updaterFn) (updaterFn as Function).call(this, vnode, value);
          break;
        case 'class':
          if (updaterFn) (updaterFn as Function).call(this, vnode, value);
          break;
        case 'key':
          if (updaterFn) (updaterFn as Function).call(this, vnode, value);
          break;
        default:
          this.commonUpdater.call(this, vnode, value, dir);
      }
    }
  }

  /**
   * update text for {{}}
   *
   * @param Vnode node
   * @param {*} vm
   * @param {string} exp
   * @memberof CompileUtil
   */
  public templateUpdater(vnode: Vnode, vm: any, exp: string): void {
    const _exp = exp.replace('{{', '').replace('}}', '');
    let value = null;
    if (/^.*\(.*\)$/.test(_exp)) {
      const fn = this._getVMFunction(vm, _exp);
      const argsList = this._getVMFunctionArguments(vm, _exp, vnode);
      value = fn.apply(vm, argsList);
    } else if (this.isFromVM(vm, _exp)) value = this._getVMVal(vm, _exp);
    else if (vnode.repeatData) {
      Object.keys(vnode.repeatData).forEach(data => {
        if (exp.indexOf(data) === 0 || exp.indexOf(`${data}.`) === 0) value = this._getValueByValue(vnode.repeatData[data], exp, data);
      });
    } else throw new Error(`directive: ${exp} can't use recognize this value`);
    vnode.nodeValue = vnode.nodeValue.replace(exp, value);
  }

  /**
   * update value of input for nv-model
   *
   * @param {Element} vnode
   * @param {*} value
   * @param {string} exp
   * @param {*} vm
   * @memberof CompileUtil
   */
  public modelUpdater(vnode: Vnode, value: any, exp: string, vm: any): void {
    vnode.value = typeof value === 'undefined' ? '' : value;

    const func = (event: Event) => {
      event.preventDefault();
      if (this.isFromVM(vm, exp)) this._setVMVal(vm, exp, (event.target as HTMLInputElement).value);
    };
    const sameEventType = vnode.eventTypes.find(_eventType => _eventType.type === 'input');
    if (sameEventType) sameEventType.handler = func;
    if (!sameEventType) vnode.eventTypes.push({
      type: 'input',
      handler: func,
    });
  }

  /**
   * update text for nv-text
   *
   * @param {Vnode} vnode
   * @param {*} value
   * @returns {void}
   * @memberof CompileUtil
   */
  public textUpdater(vnode: Vnode, value: any): void {
    if (vnode.tagName === 'input') return vnode.value = value;
    vnode.nodeValue = typeof value === 'undefined' ? '' : value;
  }

  /**
   * update html for nv-html
   *
   * @param {Vnode} vnode
   * @param {*} value
   * @memberof CompileUtil
   */
  public htmlUpdater(vnode: Vnode, value: any): void {
    const findAttribute = vnode.attributes.find(attr => attr.name === 'nv-html');
    findAttribute.nvValue = value;
  }

  /**
   * remove or show DOM for nv-if
   *
   * @param {Vnode} vnode
   * @param {*} value
   * @memberof CompileUtil
   */
  public ifUpdater(vnode: Vnode, value: any): void {
    if (!value && vnode.parentVnode.childNodes.indexOf(vnode) !== -1) vnode.parentVnode.childNodes.splice(vnode.parentVnode.childNodes.indexOf(vnode), 1);
    if (value) {
      const findAttribute = vnode.attributes.find(attr => attr.name === 'nv-if');
      findAttribute.nvValue = value;
    }
  }

  /**
   * update class for nv-class
   *
   * @param {Vnode} vnode
   * @param {*} value
   * @returns {void}
   * @memberof CompileUtil
   */
  public classUpdater(vnode: Vnode, value: any): void {
    const findAttribute = vnode.attributes.find(attr => attr.name === 'nv-class');
    findAttribute.nvValue = value;
  }

  /**
   * update value of repeat node for nv-key
   *
   * @param {Vnode} vnode
   * @param {*} value
   * @memberof CompileUtilForRepeat
   */
  public keyUpdater(vnode: Vnode, value: any): void {
    vnode.key = value;
  }

  /**
   * commonUpdater for nv directive except repeat model text html if class
   *
   * @param {Vnode} vnode
   * @param {*} value
   * @param {string} dir
   * @memberof CompileUtil
   */
  public commonUpdater(vnode: Vnode, value: any, dir: string): void {
    const findAttribute = vnode.attributes.find(attr => attr.name === `nv-${dir}`);
    findAttribute.nvValue = value;
  }

  /**
   * update repeat DOM for nv-repeat
   *
   * if it has child and it will into repeatChildrenUpdater
   *
   * @param {Vnode} vnode
   * @param {*} value
   * @param {string} expFather
   * @param {*} vm
   * @memberof CompileUtil
   */
  public repeatUpdater(vnode: Vnode, value: any, expFather: string, vm: any): void {
    if (!value) return;
    if (value && !(value instanceof Array)) throw new Error('compile error: nv-repeat need an Array!');

    const key = expFather.split(' ')[1];
    value.forEach((val: any, index: number) => {
      const repeatData: { [key: string]: any } = {...vnode.repeatData};
      repeatData[key] = val;
      repeatData.$index = index;

      const newVnode = this.cloneVnode(vnode, repeatData);
      newVnode.index = index;
      const nodeAttrs = newVnode.attributes;
      const text = newVnode.nodeValue;
      const reg = /\{\{(.*)\}\}/g;
      const compileUtilForRepeat = new CompileUtilForRepeat();

      this.fragment.splice(this.fragment.indexOf(vnode), 0, newVnode);

      if (this.isTextNode(newVnode) && reg.test(text)) compileUtilForRepeat.templateUpdater(newVnode, val, key, vm);

      if (nodeAttrs) {
        nodeAttrs.forEach(attr => {
          const attrName = attr.name;
          const dir = attrName.substring(3);
          const exp = attr.value;
          if (this.isDirective(attr.type) && attrName !== 'nv-repeat') compileUtilForRepeat.bind(newVnode, key, dir, exp, index, vm, value, val);
          if (this.isEventDirective(attr.type) && attrName !== 'nv-repeat') compileUtilForRepeat.eventHandler(newVnode, vm, exp, dir, key, val);
          if (this.isPropOrNvDirective(attr.type)) compileUtilForRepeat.propHandler(newVnode, vm, attr);
        });

      }
      // first insert node before repeatnode, and remove repeatnode in Compile
      if (newVnode.childNodes && newVnode.childNodes.length > 0 && this.fragment.indexOf(newVnode)) this.repeatChildrenUpdater(newVnode, val, expFather, index, vm, value);
    });
  }

  /**
   * update child of nv-repeat DOM
   *
   * if child is an nv-repeat DOM, it will into CompileUtil repeatUpdater
   *
   * @param {Vnode} vnode
   * @param {*} value
   * @param {string} expFather
   * @param {number} index
   * @param {*} vm
   * @param {*} watchValue
   * @memberof CompileUtil
   */
  public repeatChildrenUpdater(vnode: Vnode, value: any, expFather: string, index: number, vm: any, watchValue: any): void {
    const key = expFather.split(' ')[1];

    const _fragmentList: {
      originChild: Vnode,
      container: Vnode,
    }[] = [];

    vnode.childNodes.forEach(child => {
      const repeatData = {...vnode.repeatData, ...child.repeatData};
      repeatData[key] = value;
      repeatData.$index = index;
      child.repeatData = repeatData;
      this.copyRepeatData(child, repeatData);
      // if (this.isRepeatProp(child)) child.attributes.push({ name: `_prop-${key}`, value: JSON.stringify(value), type: 'prop-value' });

      const nodeAttrs = child.attributes;
      const text = child.nodeValue;
      const reg = /\{\{(.*)\}\}/g;

      if (this.isTextNode(child) && reg.test(text)) new CompileUtilForRepeat(vnode.childNodes).templateUpdater(child, value, key, vm);
      if (nodeAttrs) {
        nodeAttrs.forEach(attr => {
          const attrName = attr.name;
          const exp = attr.value;
          const dir = attrName.substring(3);
          const compileUtilForRepeat = new CompileUtilForRepeat(vnode.childNodes);

          if (this.isDirective(attr.type) && attrName !== 'nv-repeat' && (new RegExp(`(^${key})`).test(exp) || this.isFromVM(vm, exp))) compileUtilForRepeat.bind(child, key, dir, exp, index, vm, watchValue, value);
          if (this.isEventDirective(attr.type) && attrName !== 'nv-repeat' && (new RegExp(`(^${key})`).test(exp) || this.isFromVM(vm, exp))) compileUtilForRepeat.eventHandler(child, vm, exp, dir, key, value);
          if (this.isPropOrNvDirective(attr.type)) compileUtilForRepeat.propHandler(child, vm, attr);
        });
      }

      // if is repeat node
      if (child.childNodes && child.childNodes.length > 0 && vnode.childNodes.indexOf(child) !== -1) this.repeatChildrenUpdater(child, value, expFather, index, vm, watchValue);

      // if is't repeat node
      const newAttrs = child.attributes;
      if (newAttrs && vnode.childNodes.indexOf(child) !== -1) {
        const restRepeat = newAttrs.find(attr => this.isDirective(attr.type) && attr.name === 'nv-repeat');
        if (restRepeat) {
          const newWatchData = restRepeat.value.split(' ')[3];

          // 创建一个同级于vnode的容器存放新的子元素的容器，最后再统一放入vnode中
          const _newContainerFragment = new Vnode(vnode);
          // 因为确定了是不允许递归的循环node所以子节点要清空
          _newContainerFragment.childNodes = [];
          _newContainerFragment.childNodes.push(child);
          _fragmentList.push({
            originChild: child,
            container: _newContainerFragment,
          });

          const compileUtil = new CompileUtil(_newContainerFragment.childNodes);

          // if (this.isFromVM(vm, newWatchData)) compileUtil.bind(child, vm, restRepeat.value, 'repeat');
          if (this.isFromVM(vm, newWatchData)) compileUtil.repeatUpdater(child, this._getVMRepeatVal(vm, restRepeat.value), restRepeat.value, vm);
          if (new RegExp(`(^${key})`).test(newWatchData)) compileUtil.repeatUpdater(child, this._getValueByValue(value, newWatchData, key), restRepeat.value, vm);

          if (this.isRepeatNode(child) && _newContainerFragment.childNodes.indexOf(child) !== -1) _newContainerFragment.childNodes.splice(_newContainerFragment.childNodes.indexOf(child), 1);
        }
      }
    });
    _fragmentList.forEach(_fragmentObject => {
      if (vnode.childNodes.indexOf(_fragmentObject.originChild) !== -1) vnode.childNodes.splice(vnode.childNodes.indexOf(_fragmentObject.originChild), 0, ..._fragmentObject.container.childNodes);
    });
    _fragmentList.forEach(_fragmentObject => {
      if (vnode.childNodes.indexOf(_fragmentObject.originChild) !== -1) vnode.childNodes.splice(vnode.childNodes.indexOf(_fragmentObject.originChild), 1);
    });

  }

  /**
   * compile event and build eventType in DOM
   *
   * @param {Vnode} vnode
   * @param {*} vm
   * @param {string} exp
   * @param {string} eventName
   * @memberof Compile
   */
  public eventHandler(vnode: Vnode, vm: any, exp: string, eventName: string): void {
    const eventType = eventName.split(':')[1];

    const fn = this._getVMFunction(vm, exp);

    const args = exp.match(/\((.*)\)/)[1].replace(/\s+/g, '').split(',');

    const vmUtils = this;

    const func = function (event: Event): void {
      const argsList: any[] = [];
      args.forEach(arg => {
        if (arg === '') return false;
        if (arg === '$event') return argsList.push(event);
        if (arg === '$element' && event.target) return argsList.push(event.target);
        if (arg === 'true' || arg === 'false') return argsList.push(arg === 'true');
        if (arg === 'null') return argsList.push(null);
        if (arg === 'undefined') return argsList.push(undefined);
        if (vmUtils.isFromVM(vm, arg)) return argsList.push(vmUtils._getVMVal(vm, arg));
        if (/^\'.*\'$/.test(arg)) return argsList.push(arg.match(/^\'(.*)\'$/)[1]);
        if (/^\".*\"$/.test(arg)) return argsList.push(arg.match(/^\"(.*)\"$/)[1]);
        if (!/^\'.*\'$/.test(arg) && !/^\".*\"$/.test(arg) && /^[0-9]*$/.test(arg)) return argsList.push(Number(arg));
      });
      fn.apply(vm, argsList);
    };
    if (eventType && fn) {
      // todo 添加事件
      const sameEventType = vnode.eventTypes.find(_eventType => _eventType.type === eventType);
      if (sameEventType) sameEventType.handler = func;
      if (!sameEventType) vnode.eventTypes.push({
        type: eventType,
        handler: func,
      });
    }
  }

  /**
   * handler props
   *
   * @param {Vnode} vnode
   * @param {*} vm
   * @param {TAttributes} attr
   * @param {string} prop
   * @memberof CompileUtil
   */
  public propHandler(vnode: Vnode, vm: any, attr: TAttributes): void {
    const compileUtilForRepeat = new CompileUtilForRepeat();
    const prop = /^\{(.+)\}$/.exec(attr.value);
    if (prop) {
      const propValue = prop[1];
      let _prop = null;
      if (/^.*\(.*\)$/.test(propValue)) {
        const fn = compileUtilForRepeat._getVMFunction(vm, propValue);
        const args = propValue.match(/\((.*)\)/)[1].replace(/\s+/g, '').split(',');
        const argsList: any[] = [];
        args.forEach(arg => {
          if (arg === '') return false;
          if (arg === '$element') return argsList.push(vnode.nativeElement);
          if (arg === 'true' || arg === 'false') return argsList.push(arg === 'true');
          if (arg === 'null') return argsList.push(null);
          if (arg === 'undefined') return argsList.push(undefined);
          if (compileUtilForRepeat.isFromVM(vm, arg)) return argsList.push(compileUtilForRepeat._getVMVal(vm, arg));
          if (/^\'.*\'$/.test(arg)) return argsList.push(arg.match(/^\'(.*)\'$/)[1]);
          if (/^\".*\"$/.test(arg)) return argsList.push(arg.match(/^\"(.*)\"$/)[1]);
          if (!/^\'.*\'$/.test(arg) && !/^\".*\"$/.test(arg) && /^[0-9]*$/g.test(arg)) return argsList.push(Number(arg));
          if (vnode.repeatData) {
            // $index in this
            Object.keys(vnode.repeatData).forEach(data => {
              if (arg.indexOf(data) === 0 || arg.indexOf(`${data}.`) === 0) return argsList.push(compileUtilForRepeat._getValueByValue(vnode.repeatData[data], arg, data));
            });
          }
        });
        const value = fn.apply(vm, argsList);
        attr.nvValue = value;
        return;
      }
      const valueList = propValue.split('.');
      const key = valueList[0];
      if (this.isFromVM(vm, propValue)) {
        _prop = this._getVMVal(vm, propValue);
        attr.nvValue = this.buildProps(_prop, vm);
        return;
      }
      // if (_propsKeys.hasOwnProperty(key) || key in _propsKeys) {
      //   _prop = getPropsValue(valueList, _propsKeys[key]);
      //   attr.nvValue = buildProps(_prop, vm);
      // }
      if (vnode.repeatData && vnode.repeatData.hasOwnProperty(key)) {
        _prop = this._getValueByValue(vnode.repeatData[key], propValue, key);
        attr.nvValue = this.buildProps(_prop, vm);
        return;
      }
      if (/^\'.*\'$/.test(propValue)) {
        attr.nvValue = propValue.match(/^\'(.*)\'$/)[1];
        return;
      }
      if (/^\".*\"$/.test(propValue)) {
        attr.nvValue = propValue.match(/^\"(.*)\"$/)[1];
        return;
      }
      if (!/^\'.*\'$/.test(propValue) && !/^\".*\"$/.test(propValue) && /^[0-9]*$/.test(propValue)) {
        attr.nvValue = Number(prop);
        return;
      }
      if (propValue === 'true' || propValue === 'false') {
        attr.nvValue = (propValue === 'true');
        return;
      }
      if (propValue === 'null') {
        attr.nvValue = null;
        return;
      }
      if (propValue === 'undefined') {
        attr.nvValue = undefined;
        return;
      }
    }
  }

  /**
   * build props
   *
   * @param {*} prop
   * @param {IComponent} vm
   * @returns {*}
   * @memberof CompileUtil
   */
  public buildProps(prop: any, vm: IComponent): any {
    if (utils.isFunction(prop)) return prop.bind(vm);
    else return prop;
  }

  /**
   * judge attribute is nv directive or not
   *
   * @param {string} type
   * @returns {boolean}
   * @memberof CompileUtil
   */
  public isDirective(type: string): boolean {
    return type === 'nv-attribute';
  }

  /**
   * judge attribute is nv event directive or not
   *
   * @param {string} type
   * @returns {boolean}
   * @memberof CompileUtil
   */
  public isEventDirective(type: string): boolean {
    return type === 'nv-event';
  }

  /**
   * judge DOM is a element node or not
   *
   * @param {Vnode} vnode
   * @returns {boolean}
   * @memberof CompileUtil
   */
  public isElementNode(vnode: Vnode): boolean {
    return vnode.type === 'tag' || vnode.type === 'component';
  }

  /**
   * judge DOM is nv-repeat DOM or not
   *
   * @param {Vnode} vnode
   * @returns {boolean}
   * @memberof CompileUtil
   */
  public isRepeatNode(vnode: Vnode): boolean {
    const nodeAttrs = vnode.attributes;
    let result = false;
    if (nodeAttrs) {
      nodeAttrs.forEach(attr => {
        if (attr.name === 'nv-repeat') result = true;
      });
    }
    return result;
  }

  // /**
  //  * judge DOM is a Component DOM in a repeat DOM or not
  //  *
  //  * @param {Element} node
  //  * @returns {boolean}
  //  * @memberof CompileUtil
  //  */
  // public isRepeatProp(vnode: Vnode): boolean {
  //   const nodeAttrs = vnode.attributes;
  //   const result = false;
  //   if (nodeAttrs) return !!(nodeAttrs.find(attr => /^\{(.+)\}$/.test(attr.value)));
  //   return result;
  // }

  /**
   * judge DOM is text node or not
   *
   * @param {Vnode} vnode
   * @returns {boolean}
   * @memberof CompileUtil
   */
  public isTextNode(vnode: Vnode): boolean {
    return vnode.type === 'text';
  }

  /**
   * find exp is member of vm instance
   *
   * @param {*} vm
   * @param {string} exp
   * @returns {boolean}
   * @memberof CompileUtil
   */
  public isFromVM(vm: any, exp: string): boolean {
    if (!vm) return false;
    const value = exp.replace(/\(.*\)/, '').split('.')[0];
    return value in vm;
  }

  /**
   * judge attribute is nv directive or not
   *
   * @param {string} type
   * @returns {boolean}
   * @memberof CompileUtil
   */
  public isPropOrNvDirective(type: string): boolean {
    return type === 'directive' || type === 'prop';
  }

  /**
   * clone Node and clone it event
   *
   * event by attribute in DOM: eventTypes
   * repeat data by attribute in DOM: repeatData
   * isComponent: clone Component need add isComponent=true
   *
   * @param {Vnode} vnode
   * @param {*} [repeatData]
   * @returns {Node}
   * @memberof CompileUtil
   */
  public cloneVnode(vnode: Vnode, repeatData?: any): Vnode {
    const newVnode = new Vnode(vnode);
    newVnode.repeatData = {...repeatData};
    this.copyRepeatData(newVnode, repeatData);
    newVnode.childNodes.forEach(child => {
      child.parentVnode = newVnode;
    });
    return newVnode;
  }

  /**
   * copy repeatData from parentVnode to children
   *
   * @param {Vnode} vnode
   * @param {*} [repeatData]
   * @returns {void}
   * @memberof CompileUtil
   */
  public copyRepeatData(vnode: Vnode, repeatData?: any): void {
    if (!vnode.childNodes || vnode.childNodes.length === 0) return;
    vnode.childNodes.forEach(child => {
      child.repeatData = {...repeatData, ...child.repeatData};
      this.copyRepeatData(child, repeatData);
    });
  }
}
