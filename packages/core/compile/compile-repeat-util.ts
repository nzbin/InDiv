import { Vnode, TAttributes, isFromVM, buildProps } from "../vnode";

/**
 * compile util for nv-repeat DOM
 *
 * @export
 * @class CompileRepeatUtil
 */
export class CompileRepeatUtil {
  public fragment?: Vnode[];

  /**
   * Creates an instance of CompileRepeatUtil.
   *
   * @param {Vnode[]} [fragment]
   * @memberof CompileRepeatUtil
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
   * @memberof CompileRepeatUtil
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
   * @memberof CompileRepeatUtil
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
   * @memberof CompileRepeatUtil
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
   * @memberof CompileRepeatUtil
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
      if (isFromVM(vm, arg)) return argsList.push(utilVm._getVMVal(vm, arg));
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
   * @memberof CompileRepeatUtil
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
   * @memberof CompileRepeatUtil
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
   * @memberof CompileRepeatUtil
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
    else if (isFromVM(vm, exp)) value = this._getVMVal(vm, exp);
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

    switch (dir) {
      case 'model': {
        let watchData;
        if (exp.indexOf(key) === 0 || exp.indexOf(`${key}.`) === 0) {
          watchData = watchValue;
        } else {
          watchData = this._getVMVal(vm, exp);
        }
        this.modelUpdater(vnode, value, exp, key, index, watchData, vm);
        break;
      }
      case 'text': {
        this.textUpdater(vnode, value);
        break;
      }
      case 'if': {
        this.ifUpdater(vnode, value, vm);
        break;
      }
      case 'class': {
        this.classUpdater(vnode, value);
        break;
      }
      case 'key': {
        this.keyUpdater(vnode, value);
        break;
      }
      case 'value': {
        this.valueUpdater(vnode, value);
        break;
      }
      default: this.commonUpdater(vnode, value, dir);
    }
  }

  /**
   * update text for {{}}
   *
   * @param {Vnode} vnode
   * @param {*} [val]
   * @param {string} [key]
   * @param {*} [vm]
   * @memberof CompileRepeatUtil
   */
  public templateUpdater(vnode: Vnode, val?: any, key?: string, vm?: any): void {
    const text = vnode.nodeValue;
    const reg = /\{\{(.*)\}\}/g;
    if (reg.test(text)) {
      const textList = text.match(/(\{\{[^\{\}]+?\}\})/g);
      if (textList && textList.length > 0) {
        for (let i = 0; i < textList.length; i++) {
          const exp = textList[i].replace('{{', '').replace('}}', '');
          if (/^.*\(.*\)$/.test(exp)) {
            const fn = this._getVMFunction(vm, exp);
            const argsList = this._getVMFunctionArguments(vm, exp, vnode, key, val);
            vnode.nodeValue = vnode.nodeValue.replace(textList[i], fn.apply(vm, argsList));
          } else if (exp.indexOf(key) === 0 || exp.indexOf(`${key}.`) === 0) vnode.nodeValue = vnode.nodeValue.replace(textList[i], this._getVMRepeatVal(val, exp, key));
          else if (isFromVM(vm, exp)) vnode.nodeValue = vnode.nodeValue.replace(textList[i], this._getVMVal(vm, exp));
          else if (vnode.repeatData) {
            Object.keys(vnode.repeatData).forEach(data => {
              if (exp.indexOf(data) === 0 || exp.indexOf(`${data}.`) === 0) vnode.nodeValue = vnode.nodeValue.replace(textList[i], this._getValueByValue(vnode.repeatData[data], exp, data));
            });
          } else throw new Error(`directive: {{${exp}}} can\'t use recognize ${exp}`);
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
   * @memberof CompileRepeatUtil
   */
  public modelUpdater(vnode: Vnode, value: any, exp: string, key: string, index: number, watchData: any, vm: any): void {
    vnode.value = typeof value === 'undefined' ? '' : value;
    const findAttribute = vnode.attributes.find(attr => attr.name === 'nv-model');
    findAttribute.nvValue = (typeof value === 'undefined' ? '' : value);

    const utilVm = this;
    const func = function (event: Event): void {
      event.preventDefault();
      if (isFromVM(vm, exp)) {
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
      token: value,
    });
  }

  /**
   * update text for nv-text
   *
   * @param {Vnode} vnode
   * @param {*} value
   * @returns {void}
   * @memberof CompileRepeatUtil
   */
  public textUpdater(vnode: Vnode, value: any): void {
    const findAttribute = vnode.attributes.find(attr => attr.name === 'nv-text');
    findAttribute.nvValue = (typeof value === 'undefined' ? '' : value);

    vnode.nodeValue = typeof value === 'undefined' ? '' : value;
    if (!vnode.childNodes || (vnode.childNodes && vnode.childNodes.length > 0)) vnode.childNodes = [];
    vnode.childNodes.push(new Vnode({
      type: 'text',
      nodeValue: typeof value === 'undefined' ? '' : value,
      parentVnode: vnode,
      template: typeof value === 'undefined' ? '' : value,
      voidElement: true,
    }));
    vnode.voidElement = true;
  }

  /**
   * remove or show DOM for nv-if
   *
   * @param {Vnode} vnode
   * @param {*} value
   * @param {*} vm
   * @memberof CompileRepeatUtil
   */
  public ifUpdater(vnode: Vnode, value: any, vm: any): void {
    const valueOfBoolean = Boolean(value);
    if (!valueOfBoolean && vnode.parentVnode.childNodes.indexOf(vnode) !== -1) vnode.parentVnode.childNodes.splice(vnode.parentVnode.childNodes.indexOf(vnode), 1);
    if (valueOfBoolean) {
      const findAttribute = vnode.attributes.find(attr => attr.name === 'nv-if');
      findAttribute.nvValue = valueOfBoolean;
    }
  }

  /**
   * update class for nv-class
   *
   * @param {Vnode} vnode
   * @param {*} value
   * @returns {void}
   * @memberof CompileRepeatUtil
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
   * @memberof CompileRepeatUtil
   */
  public keyUpdater(vnode: Vnode, value: any): void {
    const findAttribute = vnode.attributes.find(attr => attr.name === 'nv-key');
    findAttribute.nvValue = value;
    vnode.key = value;
  }

  /**
   * update value of repeat node for nv-value
   *
   * @param {Element} node
   * @param {*} value
   * @memberof CompileRepeatUtil
   */
  public valueUpdater(vnode: Vnode, value: any): void {
    const findAttribute = vnode.attributes.find(attr => attr.name === 'nv-value');
    findAttribute.nvValue = value;
    vnode.value = value;
  }

  /**
   * commonUpdater for nv directive except repeat model text if class
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
   * @memberof CompileRepeatUtil
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
        if (isFromVM(vm, arg)) return argsList.push(utilVm._getVMVal(vm, arg));
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
      fn.apply(vm, argsList);
    };
    if (eventType && fn) {
      const sameEventType = vnode.eventTypes.find(_eventType => _eventType.type === eventType);
      if (sameEventType) {
        sameEventType.handler = func;
        sameEventType.token = fn;
      }
      if (!sameEventType) vnode.eventTypes.push({
        type: eventType,
        handler: func,
        token: fn,
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
   * @memberof CompileRepeatUtil
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
          if (isFromVM(vm, arg)) return argsList.push(this._getVMVal(vm, arg));
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
      if (isFromVM(vm, propValue)) {
        _prop = this._getVMVal(vm, propValue);
        attr.nvValue = buildProps(_prop, vm);
        return;
      }
      if (vnode.repeatData && vnode.repeatData.hasOwnProperty(key)) {
        _prop = this._getValueByValue(vnode.repeatData[key], propValue, key);
        attr.nvValue = buildProps(_prop, vm);
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
        attr.nvValue = Number(propValue);
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
}
