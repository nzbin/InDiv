// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({11:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = function () {
  function Utils() {
    _classCallCheck(this, Utils);

    this.toString = Object.prototype.toString;
  }

  _createClass(Utils, [{
    key: 'isFunction',
    value: function isFunction(func) {
      return this.toString.call(func) === '[object Function]';
    }
  }, {
    key: 'isEqual',
    value: function isEqual(a, b, aStack, bStack) {
      // === 结果为 true 的区别出 +0 和 -0
      if (a === b) return a !== 0 || 1 / a === 1 / b;
      // typeof null 的结果为 object ，这里做判断，是为了让有 null 的情况尽早退出函数
      if (a == null || b == null) return false;
      // 判断 NaN
      if (a !== a) return b !== b;
      // 判断参数 a 类型，如果是基本类型，在这里可以直接返回 false
      var type = typeof a === 'undefined' ? 'undefined' : _typeof(a);
      if (type !== 'function' && type !== 'object' && (typeof b === 'undefined' ? 'undefined' : _typeof(b)) !== 'object') return false;
      // 更复杂的对象使用 deepEq 函数进行深度比较
      return this.deepIsEqual(a, b, aStack, bStack);
    }
  }, {
    key: 'deepIsEqual',
    value: function deepIsEqual(a, b, aStack, bStack) {
      // a 和 b 的内部属性 [[class]] 相同时 返回 true
      var className = this.toString.call(a);
      if (className !== this.toString.call(b)) return false;
      switch (className) {
        case '[object RegExp]':
        case '[object String]':
          return '' + a === '' + b;
        case '[object Number]':
          if (+a !== +a) return +b !== +b;
          return +a === 0 ? 1 / +a === 1 / b : +a === +b;
        case '[object Date]':
        case '[object Boolean]':
          return +a === +b;
      }

      var areArrays = className === '[object Array]';
      // 不是数组
      if (!areArrays) {
        // 过滤掉两个函数的情况
        if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) !== 'object' || (typeof b === 'undefined' ? 'undefined' : _typeof(b)) !== 'object') return false;
        var aCtor = a.constructor;
        var bCtor = b.constructor;
        // aCtor 和 bCtor 必须都存在并且都不是 Object 构造函数的情况下，aCtor 不等于 bCtor， 那这两个对象就真的不相等啦
        if (aCtor !== bCtor && !(this.isFunction(aCtor) && aCtor instanceof aCtor && this.isFunction(bCtor) && bCtor instanceof bCtor) && 'constructor' in a && 'constructor' in b) {
          return false;
        }
      }

      aStack = aStack || [];
      bStack = bStack || [];
      var length = aStack.length;
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
        var keys = Object.keys(a);
        var key = void 0;
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
  }, {
    key: 'setCookie',
    value: function setCookie(key, value, setdate) {
      if (!key || !value) {
        console.error('set cookie error: key or value is null');
        return;
      }
      var mydate = new Date();
      mydate.setDate(mydate.getDate() + setdate);
      document.cookie = key + '=' + value + ';expirse=' + mydate;
    }
  }, {
    key: 'getCookie',
    value: function getCookie(name) {
      var cookieArray = document.cookie.split(';');
      for (var i = 0; i < cookieArray.length; i++) {
        var cookieName = cookieArray[i].split('=');
        if (cookieName[0] === name) {
          return cookieName[1];
        }
      }
      return '';
    }
  }, {
    key: 'removeCookie',
    value: function removeCookie(name) {
      this.setCookie(name, -1, -1);
    }
  }]);

  return Utils;
}();

exports.default = Utils;
},{}],12:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utils = require('./Utils');

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Lifecycle = function () {
  function Lifecycle() {
    _classCallCheck(this, Lifecycle);

    this.declareTemplate = '';
    this.state = {};
    this.utils = new _Utils2.default();
  }

  _createClass(Lifecycle, [{
    key: '$onInit',
    value: function $onInit() {}
  }, {
    key: '$beforeMount',
    value: function $beforeMount() {}
  }, {
    key: '$afterMount',
    value: function $afterMount() {}
  }, {
    key: '$onDestory',
    value: function $onDestory() {}
  }, {
    key: '$hasRender',
    value: function $hasRender() {}
  }, {
    key: '$watchState',
    value: function $watchState(oldData, newData) {}
  }, {
    key: 'setState',
    value: function setState(newState) {
      if (newState && this.utils.isFunction(newState)) {
        var _newState = newState();
        if (_newState && _newState instanceof Object) {
          for (var key in _newState) {
            if (this.state[key] && this.state[key] !== _newState[key]) this.state[key] = _newState[key];
          }
        }
      }
      if (newState && newState instanceof Object) {
        for (var _key in newState) {
          if (this.state[_key] && this.state[_key] !== newState[_key]) this.state[_key] = newState[_key];
        }
      }
    }
  }]);

  return Lifecycle;
}();

exports.default = Lifecycle;
},{"./Utils":11}],13:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utils = require('./Utils');

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Watcher = function () {
  function Watcher(data, watcher, updater, render) {
    _classCallCheck(this, Watcher);

    this.data = data;
    this.watcher = watcher;
    this.updater = updater;
    this.render = render;
    this.watchData(this.data);
    this.utils = new _Utils2.default();
  }

  _createClass(Watcher, [{
    key: 'watchData',
    value: function watchData(data) {
      if (!data || (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object') return;
      var vm = this;

      var _loop = function _loop(key) {
        var val = data[key];
        vm.watchData(val);
        Object.defineProperty(data, key, {
          configurable: true,
          enumerable: false,
          get: function get() {
            return val;
          },
          set: function set(newVal) {
            if (vm.utils.isEqual(newVal, val)) return;
            var oldData = {};
            oldData[key] = val;
            var newData = {};
            newData[key] = newVal;
            val = newVal;
            vm.watchData(val);
            if (vm.watcher) vm.watcher(oldData, newData);
            if (vm.updater) vm.updater(key, newVal);
            if (vm.render) vm.render();
          }
        });
      };

      for (var key in data) {
        _loop(key);
      }
    }
  }]);

  return Watcher;
}();

exports.default = Watcher;
},{"./Utils":11}],14:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CompileUtil = function () {
  function CompileUtil() {
    _classCallCheck(this, CompileUtil);
  }

  _createClass(CompileUtil, [{
    key: '_getVMVal',
    value: function _getVMVal(vm, exp) {
      var valueList = exp.replace('()', '').split('.');
      var value = vm;
      valueList.forEach(function (v) {
        if (v === 'this') return;
        value = value[v];
      });
      return value;
    }
  }, {
    key: '_setVMVal',
    value: function _setVMVal(vm, exp, value) {
      var val = vm;
      exp = exp.split('.');
      exp.forEach(function (k, i) {
        if (i < exp.length - 1) {
          val = val[k];
        } else {
          val[k] = value;
        }
      });
    }
  }, {
    key: 'text',
    value: function text(node, vm, exp) {
      this.bind(node, vm, exp, 'text');
    }
  }, {
    key: 'bind',
    value: function bind(node, vm, exp, dir) {
      var updaterFn = this[dir + 'Updater'];
      if (dir === 'model') {
        updaterFn && updaterFn(node, this._getVMVal(vm, exp), exp, vm);
      } else {
        updaterFn && updaterFn(node, this._getVMVal(vm, exp));
      }
    }
  }, {
    key: 'textUpdater',
    value: function textUpdater(node, value) {
      node.textContent = typeof value === 'undefined' ? '' : value;
    }
  }, {
    key: 'htmlUpdater',
    value: function htmlUpdater(node, value) {
      node.innerHTML = typeof value === 'undefined' ? '' : value;
    }
  }, {
    key: 'classUpdater',
    value: function classUpdater(node, value, oldValue) {
      var className = node.className;
      className = className.replace(oldValue, '').replace(/\s$/, '');
      var space = className && String(value) ? ' ' : '';
      node.className = className + space + value;
    }
  }, {
    key: 'modelUpdater',
    value: function modelUpdater(node, value, exp, vm) {
      node.value = typeof value === 'undefined' ? '' : value;
      var val = exp.replace(/(this.state.)|(this.props)/, '');
      var fn = function fn() {
        if (/(this.state.).*/.test(exp)) vm.state[val] = node.value;
        if (/(this.props.).*/.test(exp)) vm.props[val] = node.value;
      };
      node.addEventListener('change', fn, false);
    }
  }]);

  return CompileUtil;
}();

var Compile = function () {
  function Compile(el, vm) {
    _classCallCheck(this, Compile);

    this.$vm = vm;
    this.$el = this.isElementNode(el) ? el : document.querySelector(el);
    if (this.$el) {
      this.$fragment = this.node2Fragment(this.$el);
      this.init();
      this.$el.appendChild(this.$fragment);
    }
  }

  _createClass(Compile, [{
    key: 'init',
    value: function init() {
      this.compileElement(this.$fragment);
    }
  }, {
    key: 'compileElement',
    value: function compileElement(fragment) {
      var _this = this;

      var elementCreated = document.createElement('div');
      elementCreated.innerHTML = this.$vm.declareTemplate;
      var childNodes = elementCreated.childNodes;
      Array.from(childNodes).forEach(function (node) {
        var text = node.textContent;
        var reg = /\{\{(.*)\}\}/;
        if (_this.isElementNode(node)) {
          _this.compile(node);
          if (reg.test(text)) _this.compileText(node, RegExp.$1);
        }
        fragment.appendChild(node);
      });
    }
  }, {
    key: 'compile',
    value: function compile(node) {
      var _this2 = this;

      var nodeAttrs = node.attributes;
      Array.from(nodeAttrs).forEach(function (attr) {
        var attrName = attr.name;
        if (_this2.isDirective(attrName)) {
          var dir = attrName.substring(3);
          var exp = attr.value;
          if (_this2.isEventDirective(dir)) {
            _this2.eventHandler(node, _this2.$vm, exp, dir);
          } else {
            new CompileUtil().bind(node, _this2.$vm, exp, dir);
          }
          // node.removeAttribute(attrName);
        }
      });
    }
  }, {
    key: 'node2Fragment',
    value: function node2Fragment(el) {
      var fragment = document.createDocumentFragment();
      var child = void 0;
      while (child === el.firstChild) {
        fragment.appendChild(child);
      }
      return fragment;
    }
  }, {
    key: 'compileText',
    value: function compileText(node, exp) {
      new CompileUtil().text(node, this.$vm, exp);
    }
  }, {
    key: 'eventHandler',
    value: function eventHandler(node, vm, exp, event) {
      var eventType = event.split(':')[1];
      var fnList = exp.replace('()', '').split('.');
      var fn = vm;
      fnList.forEach(function (f) {
        if (f === 'this') return;
        fn = fn[f];
      });
      if (eventType && fn) node.addEventListener(eventType, fn.bind(vm), false);
    }
  }, {
    key: 'isDirective',
    value: function isDirective(attr) {
      return attr.indexOf('rt-') === 0;
    }
  }, {
    key: 'isEventDirective',
    value: function isEventDirective(event) {
      return event.indexOf('on') === 0;
    }
  }, {
    key: 'isElementNode',
    value: function isElementNode(node) {
      return node.nodeType === 1;
    }

    // isTextNode(node) {
    //   return node.nodeType == 3;
    // }

  }]);

  return Compile;
}();

exports.default = Compile;
},{}],15:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Lifecycle2 = require('./Lifecycle');

var _Lifecycle3 = _interopRequireDefault(_Lifecycle2);

var _Compile = require('./Compile');

var _Compile2 = _interopRequireDefault(_Compile);

var _Watcher = require('./Watcher');

var _Watcher2 = _interopRequireDefault(_Watcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Component = function (_Lifecycle) {
  _inherits(Component, _Lifecycle);

  function Component(declareTemplateName, props) {
    _classCallCheck(this, Component);

    var _this = _possibleConstructorReturn(this, (Component.__proto__ || Object.getPrototypeOf(Component)).call(this));

    _this.declareTemplateName = declareTemplateName;
    if (props) {
      _this.preProps = props;
      _this.props = {};
    }
    _this.declareTemplate = '';
    _this.state = {};
    _this.fatherController = {};
    // this.compile = new Compile(`#component_${this.declareTemplateName}`, this);
    return _this;
  }

  _createClass(Component, [{
    key: '$initProps',
    value: function $initProps(preProps) {
      if (preProps) {
        this.preProps = preProps;
        this.props = {};
        this.fatherController = window.routerController.declareComponents[this.declareTemplateName].preProps;
        for (var key in this.fatherController) {
          if (typeof this.preProps[key] === 'string') this.props[key] = window.routerController.state[this.fatherController[key]];
          if (this.utils.isFunction(this.preProps[key])) this.props[key] = this.preProps[key];
        }
      }
    }
  }, {
    key: '$beforeInit',
    value: function $beforeInit() {
      if (this.preProps) {
        this.$initProps(this.preProps);
        this.propsWatcher = new _Watcher2.default(this.props, this.$watchState.bind(this), this.$updateProps.bind(this), this.$reRender.bind(this));
      }
      this.stateWatcher = new _Watcher2.default(this.state, this.$watchState.bind(this), null, this.$reRender.bind(this));
    }
  }, {
    key: '$updateProps',
    value: function $updateProps(key, newVal) {
      var controllerStateKey = this.preProps[key];
      window.routerController.state[controllerStateKey] = newVal;
    }
  }, {
    key: '$reRender',
    value: function $reRender() {
      var dom = document.getElementById('component_' + this.declareTemplateName);
      if (dom && dom.hasChildNodes()) {
        var childs = dom.childNodes;
        for (var i = childs.length - 1; i >= 0; i--) {
          dom.removeChild(childs.item(i));
        }
      }
      if (this.$onDestory) this.$onDestory();
      this.renderDom();
      if (this.$hasRender) this.$hasRender();
    }
  }, {
    key: 'renderDom',
    value: function renderDom() {
      this.compile = new _Compile2.default('#component_' + this.declareTemplateName, this);
    }
  }, {
    key: 'setProps',
    value: function setProps(newProps) {
      if (!this.preProps) return;
      if (newProps && this.utils.isFunction(newProps)) {
        var _newProps = newProps();
        if (_newProps && _newProps instanceof Object) {
          for (var key in _newProps) {
            if (this.props[key] && this.props[key] !== _newProps[key]) this.props[key] = _newProps[key];
          }
        }
      }
      if (newProps && newProps instanceof Object) {
        for (var _key in newProps) {
          if (this.props[_key] && this.props[_key] !== newProps[_key]) {
            this.props[_key] = newProps[_key];
          }
        }
      }
    }
  }]);

  return Component;
}(_Lifecycle3.default);

exports.default = Component;
},{"./Lifecycle":12,"./Compile":14,"./Watcher":13}],16:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Lifecycle2 = require('./Lifecycle');

var _Lifecycle3 = _interopRequireDefault(_Lifecycle2);

var _Watcher = require('./Watcher');

var _Watcher2 = _interopRequireDefault(_Watcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Controller = function (_Lifecycle) {
  _inherits(Controller, _Lifecycle);

  function Controller() {
    _classCallCheck(this, Controller);

    var _this = _possibleConstructorReturn(this, (Controller.__proto__ || Object.getPrototypeOf(Controller)).call(this));

    _this.declareTemplate = '';
    _this.state = {};
    _this.declareComponents = {};
    return _this;
  }

  _createClass(Controller, [{
    key: '$beforeInit',
    value: function $beforeInit() {
      this.stateWatcher = new _Watcher2.default(this.state, this.$watchState.bind(this), this.$updateProps.bind(this), this.$reRender.bind(this));
    }
  }, {
    key: '$updateProps',
    value: function $updateProps(key, newVal) {
      for (var componentName in this.declareComponents) {
        var declareComponent = this.declareComponents[componentName];
        var propsKey = null;
        for (var name in declareComponent.preProps) {
          if (declareComponent.preProps[name] === key) {
            propsKey = name;
          }
        }
        if (propsKey && newVal !== declareComponent.props[propsKey]) declareComponent.props[propsKey] = newVal;
      }
    }
  }, {
    key: '$renderComponent',
    value: function $renderComponent() {
      var _this2 = this;

      var _loop = function _loop(key) {
        if (_this2.declareComponents[key].$beforeInit) _this2.declareComponents[key].$beforeInit();
        if (_this2.declareComponents[key].$onInit) _this2.declareComponents[key].$onInit();
        // const declareTemplate = this.declareComponents[key].declareTemplate.replace(/( )(rt)([A-Z]{1})([A-Za-z]+="|[A-Za-z]+=')(this)/g, (...args) => `${args[1]}on${args[3].toLowerCase()}${args[4]}window.routerController.declareComponents.${key}`);
        var domReg = new RegExp('(<)(' + key + ')(/>)', 'g');
        // this.declareTemplate = this.declareTemplate.replace(domReg, (...args) => `<div id="component_${key}">${declareTemplate}</div>`);
        _this2.declareTemplate = _this2.declareTemplate.replace(domReg, function () {
          return '<div id="component_' + key + '"></div>';
        });
        if (_this2.declareComponents[key].$beforeMount) _this2.declareComponents[key].$beforeMount();
      };

      // let variableReg = /\{\{(.*?)\}\}/g;
      for (var key in this.declareComponents) {
        _loop(key);
      }
    }
  }, {
    key: '$reRender',
    value: function $reRender() {
      // const dom = document.getElementById('route-container');
      // if (dom.hasChildNodes()) {
      //   let childs = dom.childNodes;
      //   for (let i = childs.length - 1; i >= 0; i--) {
      //     dom.removeChild(childs.item(i));
      //   }
      //   if (this.$onDestory) this.$onDestory();
      // }
      // if (window.routerController) {
      //   this.declareTemplate = this.declareTemplate.replace(/( )(rt)([A-Z]{1})([A-Za-z]+="|[A-Za-z]+=')(this)/g, (...args) => `${args[1]}on${args[3].toLowerCase()}${args[4]}window.routerController`);
      // }
      // dom.innerHTML = this.declareTemplate;
      if (this.$hasRender) this.$hasRender();
    }
  }]);

  return Controller;
}(_Lifecycle3.default);

exports.default = Controller;
},{"./Lifecycle":12,"./Watcher":13}],17:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utils = require('./Utils');

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Router = function () {
  function Router() {
    _classCallCheck(this, Router);

    this.routes = {};
    this.currentUrl = '';
    this.lastRoute = null;
    this.rootDom = null;
    this.utils = new _Utils2.default();
    window.addEventListener('load', this.refresh.bind(this), false);
    window.addEventListener('hashchange', this.refresh.bind(this), false);
  }

  _createClass(Router, [{
    key: '$routeChange',
    value: function $routeChange(lastRoute, nextRoute) {}
  }, {
    key: 'init',
    value: function init(arr) {
      var _this = this;

      if (arr && arr instanceof Array) {
        arr.forEach(function (route) {
          if (route.path && route.controller && _this.utils.isFunction(route.controller)) {
            _this.route(route.path, route.controller);
          } else {
            console.error('need path or controller');
            return false;
          }
        });
        var rootDom = document.querySelector('#root');
        this.rootDom = rootDom || null;
      } else {
        console.error('no routes exit');
      }
    }
  }, {
    key: 'route',
    value: function route(path, controller) {
      this.routes[path] = controller || function () {};
    }
  }, {
    key: 'refresh',
    value: function refresh() {
      var _this2 = this;

      this.currentUrl = location.hash.slice(1) || '/';
      if (this.routes[this.currentUrl]) {
        if (window.routerController) {
          if (window.routerController.$onDestory) window.routerController.$onDestory();
          delete window.routerController;
        }
        var controller = new this.routes[this.currentUrl]();
        window.routerController = controller;
        if (controller.$beforeInit) controller.$beforeInit();
        if (controller.$renderComponent) controller.$renderComponent();
        if (controller.$onInit) controller.$onInit();
        this.renderController(controller).then(function () {
          _this2.$routeChange(_this2.lastRoute, _this2.currentUrl);
          _this2.lastRoute = _this2.currentUrl;
        }).catch(function () {
          console.error('route change failed');
        });
      }
    }
  }, {
    key: 'renderController',
    value: function renderController(controller) {
      var template = controller.declareTemplate;
      if (template && typeof template === 'string' && this.rootDom) {
        if (controller.$beforeMount) controller.$beforeMount();
        this.replaceDom(controller).then(function () {
          if (controller.declareComponents) {
            for (var key in controller.declareComponents) {
              if (controller.declareComponents[key].$reRender) controller.declareComponents[key].$reRender();
              if (controller.declareComponents[key].$afterMount) controller.declareComponents[key].$afterMount();
            }
          }
          if (controller.$afterMount) controller.$afterMount();
        });
        return Promise.resolve();
      } else {
        console.error('renderController failed: template or rootDom is not exit');
        return Promise.reject();
      }
    }
  }, {
    key: 'replaceDom',
    value: function replaceDom(controller) {
      var template = controller.declareTemplate;
      if (this.rootDom.hasChildNodes()) {
        var childs = this.rootDom.childNodes;
        for (var i = childs.length - 1; i >= 0; i--) {
          this.rootDom.removeChild(childs.item(i));
        }
      }
      var templateDom = this.parseDom(template);
      var fragment = document.createDocumentFragment();
      fragment.appendChild(templateDom);
      this.rootDom.appendChild(fragment);
      return Promise.resolve();
    }
  }, {
    key: 'parseDom',
    value: function parseDom(template) {
      var elementCreated = document.createElement('div');
      elementCreated.id = 'route-container';
      var newTemplate = null;
      if (window.routerController) {
        newTemplate = template.replace(/( )(rt-)([A-Za-z]+="|[A-Za-z]+=')(this)/g, function () {
          return (arguments.length <= 1 ? undefined : arguments[1]) + 'on' + (arguments.length <= 3 ? undefined : arguments[3]) + 'window.routerController';
        });
      }
      elementCreated.innerHTML = newTemplate;
      return elementCreated;
    }
  }]);

  return Router;
}();

exports.default = Router;
},{"./Utils":11}],8:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Router = exports.Controller = exports.Component = exports.Compile = exports.Watcher = exports.Lifecycle = exports.Utils = undefined;

var _Utils = require('./Utils');

var _Utils2 = _interopRequireDefault(_Utils);

var _Lifecycle = require('./Lifecycle');

var _Lifecycle2 = _interopRequireDefault(_Lifecycle);

var _Watcher = require('./Watcher');

var _Watcher2 = _interopRequireDefault(_Watcher);

var _Compile = require('./Compile');

var _Compile2 = _interopRequireDefault(_Compile);

var _Component = require('./Component');

var _Component2 = _interopRequireDefault(_Component);

var _Controller = require('./Controller');

var _Controller2 = _interopRequireDefault(_Controller);

var _Router = require('./Router');

var _Router2 = _interopRequireDefault(_Router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Utils = _Utils2.default;
exports.Lifecycle = _Lifecycle2.default;
exports.Watcher = _Watcher2.default;
exports.Compile = _Compile2.default;
exports.Component = _Component2.default;
exports.Controller = _Controller2.default;
exports.Router = _Router2.default;
},{"./Utils":11,"./Lifecycle":12,"./Watcher":13,"./Compile":14,"./Component":15,"./Controller":16,"./Router":17}],3:[function(require,module,exports) {
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _src = require('../src');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PComponent = function (_Component) {
  _inherits(PComponent, _Component);

  function PComponent(name, props) {
    _classCallCheck(this, PComponent);

    // this.declareTemplate = '<p rt-on:click="this.componentClick()">被替换的组件</p>';
    // this.declareTemplate = '<p rt-on:click="this.componentClick()" rt-text="this.state.b"></p>';
    var _this = _possibleConstructorReturn(this, (PComponent.__proto__ || Object.getPrototypeOf(PComponent)).call(this, name, props));

    _this.declareTemplate = '<p rt-on:click="this.componentClick()">{{this.props.ax}}</p>';
    // this.declareTemplate = '<p rt-on:click="this.componentClick()" rt-html="this.state.c"></p>';
    // this.declareTemplate = '<p rt-on:click="this.componentClick()" class="b" rt-class="this.state.a">rt-class</p>';
    // this.declareTemplate = '<input rt-model="this.state.b" />';
    _this.state = {
      a: 'a',
      b: 100,
      c: '<p>1111</p>'
    };
    return _this;
  }

  _createClass(PComponent, [{
    key: '$onInit',
    value: function $onInit() {
      console.log('props', this.props);
    }
  }, {
    key: 'componentClick',
    value: function componentClick() {
      // alert('点击了组件');
      this.setState({ b: 2 });
      this.setProps({ ax: 5 });
      // this.props.b(3);
    }
  }, {
    key: '$watchState',
    value: function $watchState(oldData, newData) {
      console.log('oldData Component:', oldData);
      console.log('newData Component:', newData);
    }
  }]);

  return PComponent;
}(_src.Component);

var R1 = function (_Controller) {
  _inherits(R1, _Controller);

  function R1() {
    _classCallCheck(this, R1);

    var _this2 = _possibleConstructorReturn(this, (R1.__proto__ || Object.getPrototypeOf(R1)).call(this));

    _this2.state = { a: 1 };
    // this.declareTemplate = '<p rt-click="this.showAlert()">R1 点我然后打开控制台看看</p><pComponent1/><pComponent2/>';
    _this2.declareTemplate = '<p rt-click="this.showAlert()">R1 点我然后打开控制台看看</p><pComponent1/>';
    _this2.declareComponents = {
      pComponent1: new PComponent('pComponent1', {
        ax: 'a', // key in this.state
        b: _this2.getProps.bind(_this2) // action in this
      })
      // pComponent2: new PComponent('pComponent2'),
    };
    return _this2;
  }

  _createClass(R1, [{
    key: '$onInit',
    value: function $onInit() {
      // console.log('is $onInit');
    }
  }, {
    key: '$beforeMount',
    value: function $beforeMount() {
      // console.log('is $beforeMount');
    }
  }, {
    key: '$afterMount',
    value: function $afterMount() {
      // console.log('is $afterMount');
    }
  }, {
    key: '$onDestory',
    value: function $onDestory() {
      // console.log('is $onDestory');
    }
  }, {
    key: '$watchState',
    value: function $watchState(oldData, newData) {
      console.log('oldData Controller:', oldData);
      console.log('newData Controller:', newData);
    }
  }, {
    key: 'showAlert',
    value: function showAlert() {
      // alert('我错了 点下控制台看看吧');
      this.setState({ a: 2 });
      console.log('state', this.state);
    }
  }, {
    key: 'getProps',
    value: function getProps(a) {
      // alert('里面传出来了');
      this.setState({ a: a });
    }
  }]);

  return R1;
}(_src.Controller);

var R2 = function (_Controller2) {
  _inherits(R2, _Controller2);

  function R2() {
    _classCallCheck(this, R2);

    var _this3 = _possibleConstructorReturn(this, (R2.__proto__ || Object.getPrototypeOf(R2)).call(this));

    _this3.state = { a: 1 };
    _this3.declareTemplate = '<p rtClick="this.showAlert()">R2 点我然后打开控制台看看</p>';
    _this3.declareComponents = {
      pComponent1: new PComponent('pComponent1', {
        a: _this3.state.a
      })
    };
    return _this3;
  }

  _createClass(R2, [{
    key: '$onInit',
    value: function $onInit() {
      // console.log('is $onInit');
    }
  }, {
    key: '$beforeMount',
    value: function $beforeMount() {
      // console.log('is $beforeMount');
    }
  }, {
    key: '$afterMount',
    value: function $afterMount() {
      // console.log('is $afterMount');
    }
  }, {
    key: '$onDestory',
    value: function $onDestory() {
      // console.log('is $onDestory');
    }
  }, {
    key: '$watchState',
    value: function $watchState(oldData, newData) {
      console.log('oldData Controller:', oldData);
      console.log('newData Controller:', newData);
    }
  }, {
    key: 'showAlert',
    value: function showAlert() {
      // alert('我错了 点下控制台看看吧');
      this.setState(function () {
        return { a: 2 };
      });
    }
  }]);

  return R2;
}(_src.Controller);

var router = new _src.Router();
var routes = [{
  path: 'R1',
  controller: R1
}, {
  path: 'R2',
  controller: R2
}];
router.init(routes);
router.$routeChange = function (old, next) {
  console.log('$routeChange', old, next);
};
},{"../src":8}],19:[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '53084' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
      // Clear the console after HMR
      console.clear();
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},[19,3], null)
//# sourceMappingURL=/demo.c974167c.map