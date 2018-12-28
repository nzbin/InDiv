import { IComponent } from "../types";

import {
  Vnode, TAttributes,
  isRepeatNode, isTextNode, isDirective, isEventDirective, isPropOrNvDirective, cloneVnode, copyRepeatData, isFromVM, buildProps,
} from "../vnode";
import { utils } from '../utils';
import { CompileRepeatUtil } from './compile-repeat-util';


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
    const _vlList = exp.split('in')[1];
    if (!_vlList) throw new Error(`directive nv-repeat 's expression ${exp} is wrong!`);
    const vlList = _vlList.replace(/\s*/g, '');
    const value = this._getVMVal(vm, vlList);
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
      if (isFromVM(vm, arg)) return argsList.push(this._getVMVal(vm, arg));
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
   * if node is repeat node and it will break compile and into CompileRepeatUtil
   *
   * @param {Vnode} vnode
   * @param {*} vm
   * @param {string} exp
   * @param {string} dir
   * @memberof CompileUtil
   */
  public bind(vnode: Vnode, vm: IComponent, exp: string, dir: string): void {
    const isRepeatNodeBoolean = isRepeatNode(vnode);
    if (isRepeatNodeBoolean) {
      // compile repeatNode's attributes
      switch (dir) {
        case 'repeat':
          this.repeatUpdater(vnode, this._getVMRepeatVal(vm, exp), exp, vm);
          break;
      }
    } else {
      let value = null;
      // for Function(arg)
      if (/^.*\(.*\)$/.test(exp)) {
        if (dir === 'model') throw new Error(`directive: nv-model can't use ${exp} as prop`);
        // if Function need function return value
        const fn = this._getVMFunction(vm, exp);
        const argsList = this._getVMFunctionArguments(vm, exp, vnode);
        value = fn.apply(vm, argsList);
        // normal value
      } else if (isFromVM(vm, exp)) value = this._getVMVal(vm, exp);
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
        case 'model': {
          this.modelUpdater(vnode, value, exp, vm);
          break;
        }
        case 'text': {
          this.textUpdater(vnode, value);
          break;
        }
        case 'if': {
          this.ifUpdater(vnode, value);
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
    if (/^.*\(.*\)$/.test(_exp)) {
      const fn = this._getVMFunction(vm, _exp);
      const argsList = this._getVMFunctionArguments(vm, _exp, vnode);
      vnode.nodeValue = vnode.nodeValue.replace(exp, fn.apply(vm, argsList));
    } else if (isFromVM(vm, _exp)) vnode.nodeValue = vnode.nodeValue.replace(exp, this._getVMVal(vm, _exp));
    else if (vnode.repeatData) {
      Object.keys(vnode.repeatData).forEach(data => {
        if (exp.indexOf(data) === 0 || exp.indexOf(`${data}.`) === 0) vnode.nodeValue = vnode.nodeValue.replace(exp, this._getValueByValue(vnode.repeatData[data], exp, data));
      });
    } else throw new Error(`directive: ${exp} can't use recognize this value`);
  }

  /**
   * update value of input for nv-model
   *
   * @param {Vnode} vnode
   * @param {*} value
   * @param {string} exp
   * @param {*} vm
   * @memberof CompileUtil
   */
  public modelUpdater(vnode: Vnode, value: any, exp: string, vm: any): void {
    vnode.value = typeof value === 'undefined' ? '' : value;
    const findAttribute = vnode.attributes.find(attr => attr.name === 'nv-model');
    findAttribute.nvValue = (typeof value === 'undefined' ? '' : value);

    const utilVm = this;

    const func = (event: Event) => {
      event.preventDefault();
      if (!utils.isBrowser()) return;
      if (isFromVM(vm, exp)) utilVm._setVMVal(vm, exp, (event.target as HTMLInputElement).value);
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
   * @memberof CompileUtil
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
   * remove or show for nv-if
   *
   * @param {Vnode} vnode
   * @param {*} value
   * @memberof CompileUtil
   */
  public ifUpdater(vnode: Vnode, value: any): void {
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
   * @memberof CompileRepeatUtil
   */
  public keyUpdater(vnode: Vnode, value: any): void {
    const findAttribute = vnode.attributes.find(attr => attr.name === 'nv-key');
    findAttribute.nvValue = value;
    vnode.key = value;
  }

  /**
   * update value of node for nv-value
   *
   * @param {Vnode} vnode
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
   * update repeat Vnode for nv-repeat
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

    const _key = expFather.split('in')[0];
    if (!_key) throw new Error(`directive nv-repeat 's expression ${expFather} is wrong!`);
    const key = _key.replace(/\s*/g, '');
    value.forEach((val: any, index: number) => {
      const repeatData: { [key: string]: any } = { ...vnode.repeatData };
      repeatData[key] = val;
      repeatData.$index = index;

      const newVnode = cloneVnode(vnode, repeatData);
      newVnode.index = index;
      const nodeAttrs = newVnode.attributes;
      const text = newVnode.template;
      const reg = /\{\{(.*)\}\}/g;
      const compileUtilForRepeat = new CompileRepeatUtil();
      this.fragment.splice(this.fragment.indexOf(vnode), 0, newVnode);

      if (isTextNode(newVnode) && reg.test(text)) compileUtilForRepeat.templateUpdater(newVnode, val, key, vm);

      if (nodeAttrs) {
        nodeAttrs.forEach(attr => {
          const attrName = attr.name;
          const dir = attrName.substring(3);
          const exp = attr.value;
          if (isDirective(attr.type) && attrName !== 'nv-repeat' && this.functionCanCall(exp, newVnode, vm, key)) compileUtilForRepeat.bind(newVnode, key, dir, exp, index, vm, value, val);
          if (isEventDirective(attr.type) && attrName !== 'nv-repeat') compileUtilForRepeat.eventHandler(newVnode, vm, exp, dir, key, val);
          if (isPropOrNvDirective(attr.type)) {
            const _function = /^\{(.+)\}$/.exec(exp)[1];
            if (this.functionCanCall(_function, newVnode, vm, key)) compileUtilForRepeat.propHandler(newVnode, vm, attr);
          }
        });

      }
      // first compile key for all child
      if (newVnode.childNodes && newVnode.childNodes.length > 0 && this.fragment.indexOf(newVnode) !== -1) this.repeatChildrenUpdaterByKey(newVnode, val, expFather, index, vm, value);
      // then compile repeat child
      if (newVnode.childNodes && newVnode.childNodes.length > 0 && this.fragment.indexOf(newVnode) !== -1) this.repeatChildrenUpdater(newVnode, val, expFather, vm);
    });
  }

  /**
   * update all child value by repeat key
   *
   * @param {Vnode} vnode
   * @param {*} value
   * @param {string} expFather
   * @param {number} index
   * @param {*} vm
   * @param {*} watchValue
   * @memberof CompileUtil
   */
  public repeatChildrenUpdaterByKey(vnode: Vnode, value: any, expFather: string, index: number, vm: any, watchValue: any): void {
    const _key = expFather.split('in')[0];
    if (!_key) throw new Error(`directive nv-repeat 's expression ${expFather} is wrong!`);
    const key = _key.replace(/\s*/g, '');

    const compileUtilForRepeat = new CompileRepeatUtil(vnode.childNodes);

    vnode.childNodes.forEach(child => {
      const repeatData = { ...vnode.repeatData, ...child.repeatData };
      repeatData[key] = value;
      repeatData.$index = index;
      child.repeatData = repeatData;
      copyRepeatData(child, repeatData);

      const nodeAttrs = child.attributes;
      const text = child.template;
      const reg = /\{\{(.*)\}\}/g;

      if (isTextNode(child) && reg.test(text)) compileUtilForRepeat.templateUpdater(child, value, key, vm);

      if (nodeAttrs) {
        nodeAttrs.forEach(attr => {
          const attrName = attr.name;
          const exp = attr.value;
          const dir = attrName.substring(3);

          if (isDirective(attr.type) && attrName !== 'nv-repeat' && (new RegExp(`(^${key})`).test(exp) || isFromVM(vm, exp)) && this.functionCanCall(exp, child, vm, key)) compileUtilForRepeat.bind(child, key, dir, exp, index, vm, watchValue, value);
          if (isEventDirective(attr.type) && attrName !== 'nv-repeat' && (new RegExp(`(^${key})`).test(exp) || isFromVM(vm, exp))) compileUtilForRepeat.eventHandler(child, vm, exp, dir, key, value);
          if (isPropOrNvDirective(attr.type)) {
            const _function = /^\{(.+)\}$/.exec(exp)[1];
            if (this.functionCanCall(_function, child, vm, key)) compileUtilForRepeat.propHandler(child, vm, attr);
          }
        });
      }
      if (child.childNodes && child.childNodes.length > 0) this.repeatChildrenUpdaterByKey(child, value, expFather, index, vm, watchValue);
    });
  }

  /**
   * update child if child has nv-repeat directive
   *
   * @param {Vnode} vnode
   * @param {*} value
   * @param {string} expFather
   * @param {*} vm
   * @memberof CompileUtil
   */
  public repeatChildrenUpdater(vnode: Vnode, value: any, expFather: string, vm: any): void {
    const _key = expFather.split('in')[0];
    if (!_key) throw new Error(`directive nv-repeat 's expression ${expFather} is wrong!`);
    const key = _key.replace(/\s*/g, '');

    const _fragmentList: {
      originChild: Vnode,
      container: Vnode,
    }[] = [];

    vnode.childNodes.forEach(child => {
      const restRepeat = child.attributes.find(attr => isDirective(attr.type) && attr.name === 'nv-repeat');
      if (restRepeat) {
        const _value = restRepeat.value.split('in')[1];
        if (!_value) throw new Error(`directive nv-repeat 's expression ${restRepeat.value} is wrong!`);
        const newWatchData = _value.replace(/\s*/g, '');

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

        if (isFromVM(vm, newWatchData)) compileUtil.repeatUpdater(child, this._getVMRepeatVal(vm, restRepeat.value), restRepeat.value, vm);
        else if (new RegExp(`(^${key})`).test(newWatchData)) compileUtil.repeatUpdater(child, this._getValueByValue(value, newWatchData, key), restRepeat.value, vm);
        else if (child.repeatData) {
          let findData: any;
          Object.keys(child.repeatData).forEach(dataKey => {
            if (newWatchData.indexOf(dataKey) === 0 || newWatchData.indexOf(`${dataKey}.`) === 0) findData = this._getValueByValue(child.repeatData[dataKey], newWatchData, dataKey);
          });
          if (findData) compileUtil.repeatUpdater(child, findData, restRepeat.value, vm);
        } else throw new Error(`dirctive nv-repeat can't use ${newWatchData}`);

        // remove child from _newContainerFragment.childNodes
        if (_newContainerFragment.childNodes.indexOf(child) !== -1) _newContainerFragment.childNodes.splice(_newContainerFragment.childNodes.indexOf(child), 1);
      }
    });
    // push repeat child into vnode.childNodes
    _fragmentList.forEach(_fragmentObject => {
      if (vnode.childNodes.indexOf(_fragmentObject.originChild) !== -1) vnode.childNodes.splice(vnode.childNodes.indexOf(_fragmentObject.originChild), 0, ..._fragmentObject.container.childNodes);
    });
    // remove child from vnode.childNodes
    _fragmentList.forEach(_fragmentObject => {
      if (vnode.childNodes.indexOf(_fragmentObject.originChild) !== -1) vnode.childNodes.splice(vnode.childNodes.indexOf(_fragmentObject.originChild), 1);
    });
  }

  /**
   * compile event and build eventType in Vnode
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
        if (isFromVM(vm, arg)) return argsList.push(vmUtils._getVMVal(vm, arg));
        if (/^\'.*\'$/.test(arg)) return argsList.push(arg.match(/^\'(.*)\'$/)[1]);
        if (/^\".*\"$/.test(arg)) return argsList.push(arg.match(/^\"(.*)\"$/)[1]);
        if (!/^\'.*\'$/.test(arg) && !/^\".*\"$/.test(arg) && /^[0-9]*$/.test(arg)) return argsList.push(Number(arg));
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
   * handler props
   *
   * @param {Vnode} vnode
   * @param {*} vm
   * @param {TAttributes} attr
   * @param {string} prop
   * @memberof CompileUtil
   */
  public propHandler(vnode: Vnode, vm: any, attr: TAttributes): void {
    const compileUtilForRepeat = new CompileRepeatUtil();
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
          if (isFromVM(vm, arg)) return argsList.push(compileUtilForRepeat._getVMVal(vm, arg));
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

  /**
   * test function's arguments have been compiled
   *
   * @private
   * @param {string} exp
   * @param {Vnode} vnode
   * @param {*} vm
   * @param {string} key
   * @returns {boolean}
   * @memberof CompileUtil
   */
  private functionCanCall(exp: string, vnode: Vnode, vm: any, key: string): boolean {
    if (/^.*\(.*((\))|(\)\}))$/.test(exp)) {
      const args = exp.match(/\((.*)\)/)[1].replace(/\s+/g, '').split(',');
      let result = true;
      args.forEach(arg => {
        const _argKey = arg.split('.')[0];
        if (arg === '') return;
        else if (arg === '$element') return;
        else if (arg === 'true' || arg === 'false') return;
        else if (arg === 'null') return;
        else if (arg === 'undefined') return;
        else if (/^\'.*\'$/.test(arg)) return;
        else if (/^\".*\"$/.test(arg)) return;
        else if (!/^\'.*\'$/.test(arg) && !/^\".*\"$/.test(arg) && /^[0-9]*$/.test(arg)) return;
        else if (isFromVM(vm, arg)) return;
        if (arg.indexOf(key) === 0 || arg.indexOf(`${key}.`) === 0) return;
        else if (vnode.repeatData && vnode.repeatData.hasOwnProperty(_argKey)) return;
        else result = false;
      });
      return result;
    }
    return true;
  }
}
