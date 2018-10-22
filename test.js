'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var easierCookie = _interopDefault(require('easier-cookie'));
var axios = _interopDefault(require('axios'));
require('reflect-metadata');

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x.default : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

function getCjsExportFromNamespace (n) {
	return n && n.default || n;
}

var _global = createCommonjsModule(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
});

var _core = createCommonjsModule(function (module) {
var core = module.exports = { version: '2.5.7' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
});
var _core_1 = _core.version;

var _isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var _anObject = function (it) {
  if (!_isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

var _fails = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors = !_fails(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

var document$1 = _global.document;
// typeof document.createElement is 'object' in old IE
var is = _isObject(document$1) && _isObject(document$1.createElement);
var _domCreate = function (it) {
  return is ? document$1.createElement(it) : {};
};

var _ie8DomDefine = !_descriptors && !_fails(function () {
  return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])

// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive = function (it, S) {
  if (!_isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var dP = Object.defineProperty;

var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  _anObject(O);
  P = _toPrimitive(P, true);
  _anObject(Attributes);
  if (_ie8DomDefine) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var _objectDp = {
	f: f
};

var _propertyDesc = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var _hide = _descriptors ? function (object, key, value) {
  return _objectDp.f(object, key, _propertyDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var hasOwnProperty = {}.hasOwnProperty;
var _has = function (it, key) {
  return hasOwnProperty.call(it, key);
};

var id = 0;
var px = Math.random();
var _uid = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

var _redefine = createCommonjsModule(function (module) {
var SRC = _uid('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

_core.inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) _has(val, 'name') || _hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) _has(val, SRC) || _hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === _global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    _hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    _hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});
});

var _aFunction = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding

var _ctx = function (fn, that, length) {
  _aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] || (_global[name] = {}) : (_global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? _ctx(out, _global) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
    // extend global
    if (target) _redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) _hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
_global.core = _core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
var _export = $export;

var toString = {}.toString;

var _cof = function (it) {
  return toString.call(it).slice(8, -1);
};

// fallback for non-array-like ES3 and non-enumerable old V8 strings

// eslint-disable-next-line no-prototype-builtins
var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return _cof(it) == 'String' ? it.split('') : Object(it);
};

// 7.2.1 RequireObjectCoercible(argument)
var _defined = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

// 7.1.13 ToObject(argument)

var _toObject = function (it) {
  return Object(_defined(it));
};

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
var _toInteger = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

// 7.1.15 ToLength

var min = Math.min;
var _toLength = function (it) {
  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

// 7.2.2 IsArray(argument)

var _isArray = Array.isArray || function isArray(arg) {
  return _cof(arg) == 'Array';
};

var _library = false;

var _shared = createCommonjsModule(function (module) {
var SHARED = '__core-js_shared__';
var store = _global[SHARED] || (_global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: _core.version,
  mode: 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});
});

var _wks = createCommonjsModule(function (module) {
var store = _shared('wks');

var Symbol = _global.Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
};

$exports.store = store;
});

var SPECIES = _wks('species');

var _arraySpeciesConstructor = function (original) {
  var C;
  if (_isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || _isArray(C.prototype))) C = undefined;
    if (_isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)


var _arraySpeciesCreate = function (original, length) {
  return new (_arraySpeciesConstructor(original))(length);
};

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex





var _arrayMethods = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || _arraySpeciesCreate;
  return function ($this, callbackfn, that) {
    var O = _toObject($this);
    var self = _iobject(O);
    var f = _ctx(callbackfn, that, 3);
    var length = _toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = _wks('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) _hide(ArrayProto, UNSCOPABLES, {});
var _addToUnscopables = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};

// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)

var $find = _arrayMethods(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
_export(_export.P + _export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
_addToUnscopables(KEY);

// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)

var $find$1 = _arrayMethods(6);
var KEY$1 = 'findIndex';
var forced$1 = true;
// Shouldn't skip holes
if (KEY$1 in []) Array(1)[KEY$1](function () { forced$1 = false; });
_export(_export.P + _export.F * forced$1, 'Array', {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $find$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
_addToUnscopables(KEY$1);

// call something on iterator step with safe closing on error

var _iterCall = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(_anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) _anObject(ret.call(iterator));
    throw e;
  }
};

var _iterators = {};

// check on default Array iterator

var ITERATOR = _wks('iterator');
var ArrayProto$1 = Array.prototype;

var _isArrayIter = function (it) {
  return it !== undefined && (_iterators.Array === it || ArrayProto$1[ITERATOR] === it);
};

var _createProperty = function (object, index, value) {
  if (index in object) _objectDp.f(object, index, _propertyDesc(0, value));
  else object[index] = value;
};

// getting tag from 19.1.3.6 Object.prototype.toString()

var TAG = _wks('toStringTag');
// ES3 wrong here
var ARG = _cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

var _classof = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? _cof(O)
    // ES3 arguments fallback
    : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

var ITERATOR$1 = _wks('iterator');

var core_getIteratorMethod = _core.getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR$1]
    || it['@@iterator']
    || _iterators[_classof(it)];
};

var ITERATOR$2 = _wks('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR$2]();
  riter['return'] = function () { SAFE_CLOSING = true; };
} catch (e) { /* empty */ }

var _iterDetect = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR$2]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR$2] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};

_export(_export.S + _export.F * !_iterDetect(function (iter) { }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = _toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = core_getIteratorMethod(O);
    var length, result, step, iterator;
    if (mapping) mapfn = _ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && _isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        _createProperty(result, index, mapping ? _iterCall(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = _toLength(O.length);
      for (result = new C(length); length > index; index++) {
        _createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

// fast apply, http://jsperf.lnkit.com/fast-apply/5
var _invoke = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};

var arraySlice = [].slice;
var factories = {};

var construct = function (F, len, args) {
  if (!(len in factories)) {
    for (var n = [], i = 0; i < len; i++) n[i] = 'a[' + i + ']';
    // eslint-disable-next-line no-new-func
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  } return factories[len](F, args);
};

var _bind = Function.bind || function bind(that /* , ...args */) {
  var fn = _aFunction(this);
  var partArgs = arraySlice.call(arguments, 1);
  var bound = function (/* args... */) {
    var args = partArgs.concat(arraySlice.call(arguments));
    return this instanceof bound ? construct(fn, args.length, args) : _invoke(fn, args, that);
  };
  if (_isObject(fn.prototype)) bound.prototype = fn.prototype;
  return bound;
};

// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)


_export(_export.P, 'Function', { bind: _bind });

// to indexed object, toObject with fallback for non-array-like ES3 strings


var _toIobject = function (it) {
  return _iobject(_defined(it));
};

var max = Math.max;
var min$1 = Math.min;
var _toAbsoluteIndex = function (index, length) {
  index = _toInteger(index);
  return index < 0 ? max(index + length, 0) : min$1(index, length);
};

// false -> Array#indexOf
// true  -> Array#includes



var _arrayIncludes = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = _toIobject($this);
    var length = _toLength(O.length);
    var index = _toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var shared = _shared('keys');

var _sharedKey = function (key) {
  return shared[key] || (shared[key] = _uid(key));
};

var arrayIndexOf = _arrayIncludes(false);
var IE_PROTO = _sharedKey('IE_PROTO');

var _objectKeysInternal = function (object, names) {
  var O = _toIobject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) _has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (_has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

// IE 8- don't enum bug keys
var _enumBugKeys = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

// 19.1.2.14 / 15.2.3.14 Object.keys(O)



var _objectKeys = Object.keys || function keys(O) {
  return _objectKeysInternal(O, _enumBugKeys);
};

var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
  _anObject(O);
  var keys = _objectKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) _objectDp.f(O, P = keys[i++], Properties[P]);
  return O;
};

var document$2 = _global.document;
var _html = document$2 && document$2.documentElement;

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])



var IE_PROTO$1 = _sharedKey('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE$1 = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = _domCreate('iframe');
  var i = _enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  _html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE$1][_enumBugKeys[i]];
  return createDict();
};

var _objectCreate = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE$1] = _anObject(O);
    result = new Empty();
    Empty[PROTOTYPE$1] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO$1] = O;
  } else result = createDict();
  return Properties === undefined ? result : _objectDps(result, Properties);
};

// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])







var rConstruct = (_global.Reflect || {}).construct;

// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = _fails(function () {
  function F() { /* empty */ }
  return !(rConstruct(function () { /* empty */ }, [], F) instanceof F);
});
var ARGS_BUG = !_fails(function () {
  rConstruct(function () { /* empty */ });
});

_export(_export.S + _export.F * (NEW_TARGET_BUG || ARGS_BUG), 'Reflect', {
  construct: function construct(Target, args /* , newTarget */) {
    _aFunction(Target);
    _anObject(args);
    var newTarget = arguments.length < 3 ? Target : _aFunction(arguments[2]);
    if (ARGS_BUG && !NEW_TARGET_BUG) return rConstruct(Target, args, newTarget);
    if (Target == newTarget) {
      // w/o altered newTarget, optimization for 0-4 arguments
      switch (args.length) {
        case 0: return new Target();
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (_bind.apply(Target, $args))();
    }
    // with altered newTarget, not support built-in constructors
    var proto = newTarget.prototype;
    var instance = _objectCreate(_isObject(proto) ? proto : Object.prototype);
    var result = Function.apply.call(Target, instance, args);
    return _isObject(result) ? result : instance;
  }
});

var _fixReWks = function (KEY, length, exec) {
  var SYMBOL = _wks(KEY);
  var fns = exec(_defined, SYMBOL, ''[KEY]);
  var strfn = fns[0];
  var rxfn = fns[1];
  if (_fails(function () {
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  })) {
    _redefine(String.prototype, KEY, strfn);
    _hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};

// @@match logic
_fixReWks('match', 1, function (defined, MATCH, $match) {
  // 21.1.3.11 String.prototype.match(regexp)
  return [function match(regexp) {
    var O = defined(this);
    var fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  }, $match];
});

// @@replace logic
_fixReWks('replace', 2, function (defined, REPLACE, $replace) {
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return [function replace(searchValue, replaceValue) {
    var O = defined(this);
    var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined
      ? fn.call(searchValue, O, replaceValue)
      : $replace.call(String(O), searchValue, replaceValue);
  }, $replace];
});

var _redefineAll = function (target, src, safe) {
  for (var key in src) _redefine(target, key, src[key], safe);
  return target;
};

var _anInstance = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

var _forOf = createCommonjsModule(function (module) {
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : core_getIteratorMethod(iterable);
  var f = _ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (_isArrayIter(iterFn)) for (length = _toLength(iterable.length); length > index; index++) {
    result = entries ? f(_anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = _iterCall(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;
});

var def = _objectDp.f;

var TAG$1 = _wks('toStringTag');

var _setToStringTag = function (it, tag, stat) {
  if (it && !_has(it = stat ? it : it.prototype, TAG$1)) def(it, TAG$1, { configurable: true, value: tag });
};

var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_hide(IteratorPrototype, _wks('iterator'), function () { return this; });

var _iterCreate = function (Constructor, NAME, next) {
  Constructor.prototype = _objectCreate(IteratorPrototype, { next: _propertyDesc(1, next) });
  _setToStringTag(Constructor, NAME + ' Iterator');
};

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)


var IE_PROTO$2 = _sharedKey('IE_PROTO');
var ObjectProto = Object.prototype;

var _objectGpo = Object.getPrototypeOf || function (O) {
  O = _toObject(O);
  if (_has(O, IE_PROTO$2)) return O[IE_PROTO$2];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

var ITERATOR$3 = _wks('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

var _iterDefine = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  _iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR$3] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = _objectGpo($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      _setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (typeof IteratorPrototype[ITERATOR$3] != 'function') _hide(IteratorPrototype, ITERATOR$3, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if (BUGGY || VALUES_BUG || !proto[ITERATOR$3]) {
    _hide(proto, ITERATOR$3, $default);
  }
  // Plug for library
  _iterators[NAME] = $default;
  _iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) _redefine(proto, key, methods[key]);
    } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

var _iterStep = function (done, value) {
  return { value: value, done: !!done };
};

var SPECIES$1 = _wks('species');

var _setSpecies = function (KEY) {
  var C = _global[KEY];
  if (_descriptors && C && !C[SPECIES$1]) _objectDp.f(C, SPECIES$1, {
    configurable: true,
    get: function () { return this; }
  });
};

var _meta = createCommonjsModule(function (module) {
var META = _uid('meta');


var setDesc = _objectDp.f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !_fails(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!_isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!_has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!_has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !_has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};
});
var _meta_1 = _meta.KEY;
var _meta_2 = _meta.NEED;
var _meta_3 = _meta.fastKey;
var _meta_4 = _meta.getWeak;
var _meta_5 = _meta.onFreeze;

var _validateCollection = function (it, TYPE) {
  if (!_isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};

var dP$1 = _objectDp.f;









var fastKey = _meta.fastKey;

var SIZE = _descriptors ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

var _collectionStrong = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      _anInstance(that, C, NAME, '_i');
      that._t = NAME;         // collection type
      that._i = _objectCreate(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if (iterable != undefined) _forOf(iterable, IS_MAP, that[ADDER], that);
    });
    _redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = _validateCollection(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = _validateCollection(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        _validateCollection(this, NAME);
        var f = _ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(_validateCollection(this, NAME), key);
      }
    });
    if (_descriptors) dP$1(C.prototype, 'size', {
      get: function () {
        return _validateCollection(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    _iterDefine(C, NAME, function (iterated, kind) {
      this._t = _validateCollection(iterated, NAME); // target
      this._k = kind;                     // kind
      this._l = undefined;                // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) entry = entry.p;
      // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return _iterStep(1);
      }
      // return step by kind
      if (kind == 'keys') return _iterStep(0, entry.k);
      if (kind == 'values') return _iterStep(0, entry.v);
      return _iterStep(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    _setSpecies(NAME);
  }
};

var f$1 = {}.propertyIsEnumerable;

var _objectPie = {
	f: f$1
};

var gOPD = Object.getOwnPropertyDescriptor;

var f$2 = _descriptors ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = _toIobject(O);
  P = _toPrimitive(P, true);
  if (_ie8DomDefine) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (_has(O, P)) return _propertyDesc(!_objectPie.f.call(O, P), O[P]);
};

var _objectGopd = {
	f: f$2
};

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */


var check = function (O, proto) {
  _anObject(O);
  if (!_isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
var _setProto = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = _ctx(Function.call, _objectGopd.f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

var setPrototypeOf = _setProto.set;
var _inheritIfRequired = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && _isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};

var _collection = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = _global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  var fixMethod = function (KEY) {
    var fn = proto[KEY];
    _redefine(proto, KEY,
      KEY == 'delete' ? function (a) {
        return IS_WEAK && !_isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a) {
        return IS_WEAK && !_isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a) {
        return IS_WEAK && !_isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a) { fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b) { fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !_fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    _redefineAll(C.prototype, methods);
    _meta.NEED = true;
  } else {
    var instance = new C();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = _fails(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    var ACCEPT_ITERABLES = _iterDetect(function (iter) { new C(iter); }); // eslint-disable-line no-new
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && _fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new C();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });
    if (!ACCEPT_ITERABLES) {
      C = wrapper(function (target, iterable) {
        _anInstance(target, C, NAME);
        var that = _inheritIfRequired(new Base(), target, C);
        if (iterable != undefined) _forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
    // weak collections should not contains .clear method
    if (IS_WEAK && proto.clear) delete proto.clear;
  }

  _setToStringTag(C, NAME);

  O[NAME] = C;
  _export(_export.G + _export.W + _export.F * (C != Base), O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};

var MAP = 'Map';

// 23.1 Map Objects
var es6_map = _collection(MAP, function (get) {
  return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = _collectionStrong.getEntry(_validateCollection(this, MAP), key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return _collectionStrong.def(_validateCollection(this, MAP), key === 0 ? 0 : key, value);
  }
}, _collectionStrong, true);

// 7.3.20 SpeciesConstructor(O, defaultConstructor)


var SPECIES$2 = _wks('species');
var _speciesConstructor = function (O, D) {
  var C = _anObject(O).constructor;
  var S;
  return C === undefined || (S = _anObject(C)[SPECIES$2]) == undefined ? D : _aFunction(S);
};

var process = _global.process;
var setTask = _global.setImmediate;
var clearTask = _global.clearImmediate;
var MessageChannel = _global.MessageChannel;
var Dispatch = _global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      _invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (_cof(process) == 'process') {
    defer = function (id) {
      process.nextTick(_ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(_ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = _ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (_global.addEventListener && typeof postMessage == 'function' && !_global.importScripts) {
    defer = function (id) {
      _global.postMessage(id + '', '*');
    };
    _global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in _domCreate('script')) {
    defer = function (id) {
      _html.appendChild(_domCreate('script'))[ONREADYSTATECHANGE] = function () {
        _html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(_ctx(run, id, 1), 0);
    };
  }
}
var _task = {
  set: setTask,
  clear: clearTask
};

var macrotask = _task.set;
var Observer = _global.MutationObserver || _global.WebKitMutationObserver;
var process$1 = _global.process;
var Promise$1 = _global.Promise;
var isNode = _cof(process$1) == 'process';

var _microtask = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process$1.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process$1.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(_global.navigator && _global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise$1 && Promise$1.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise$1.resolve(undefined);
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(_global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};

// 25.4.1.5 NewPromiseCapability(C)


function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = _aFunction(resolve);
  this.reject = _aFunction(reject);
}

var f$3 = function (C) {
  return new PromiseCapability(C);
};

var _newPromiseCapability = {
	f: f$3
};

var _perform = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

var navigator = _global.navigator;

var _userAgent = navigator && navigator.userAgent || '';

var _promiseResolve = function (C, x) {
  _anObject(C);
  if (_isObject(x) && x.constructor === C) return x;
  var promiseCapability = _newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

var task = _task.set;
var microtask = _microtask();




var PROMISE = 'Promise';
var TypeError$1 = _global.TypeError;
var process$2 = _global.process;
var versions = process$2 && process$2.versions;
var v8 = versions && versions.v8 || '';
var $Promise = _global[PROMISE];
var isNode$1 = _classof(process$2) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = _newPromiseCapability.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[_wks('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode$1 || typeof PromiseRejectionEvent == 'function')
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && _userAgent.indexOf('Chrome/66') === -1;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return _isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError$1('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(_global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = _perform(function () {
        if (isNode$1) {
          process$2.emit('unhandledRejection', value, promise);
        } else if (handler = _global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = _global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode$1 || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(_global, function () {
    var handler;
    if (isNode$1) {
      process$2.emit('rejectionHandled', promise);
    } else if (handler = _global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError$1("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, _ctx($resolve, wrapper, 1), _ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    _anInstance(this, $Promise, PROMISE, '_h');
    _aFunction(executor);
    Internal.call(this);
    try {
      executor(_ctx($resolve, this, 1), _ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = _redefineAll($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(_speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode$1 ? process$2.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = _ctx($resolve, promise, 1);
    this.reject = _ctx($reject, promise, 1);
  };
  _newPromiseCapability.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

_export(_export.G + _export.W + _export.F * !USE_NATIVE, { Promise: $Promise });
_setToStringTag($Promise, PROMISE);
_setSpecies(PROMISE);
Wrapper = _core[PROMISE];

// statics
_export(_export.S + _export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
_export(_export.S + _export.F * (_library || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return _promiseResolve(_library && this === Wrapper ? $Promise : this, x);
  }
});
_export(_export.S + _export.F * !(USE_NATIVE && _iterDetect(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = _perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      _forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = _perform(function () {
      _forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});

var utils = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

/**
 * utils for InDiv
 *
 * @class Utils
 */
var Utils = /** @class */ (function () {
    /**
     * Creates an instance of Utils.
     * @memberof Utils
     */
    function Utils() {
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
    Utils.prototype.setCookie = function (name, value, options) {
        easierCookie.default.set(name, value, options);
    };
    /**
     * get Cookie with easier-cookie
     *
     * @param {string} name
     * @returns {*}
     * @memberof Utils
     */
    Utils.prototype.getCookie = function (name) {
        return easierCookie.default.get(name);
    };
    /**
     * remove Cookie with easier-cookie
     *
     * @param {string} name
     * @returns {boolean}
     * @memberof Utils
     */
    Utils.prototype.removeCookie = function (name) {
        return easierCookie.default.remove(name);
    };
    /**
     * build url query
     *
     * @param {*} object
     * @returns {string}
     * @memberof Utils
     */
    Utils.prototype.buildQuery = function (object) {
        if (!object || !(object instanceof Object))
            return '';
        var query = '?';
        for (var key in object) {
            if (!(object[key] instanceof Object)) {
                query += key + "=" + object[key].toString() + "&";
            }
            else {
                query += key + "=" + JSON.stringify(object[key]) + "&";
            }
        }
        return query.slice(0, query.length - 1);
    };
    /**
     * get one url query
     *
     * @param {string} name
     * @returns {string}
     * @memberof Utils
     */
    Utils.prototype.getQuery = function (name) {
        var parts = window.location.search.replace('?', '').split('&');
        var params = {};
        for (var i = 0; i < parts.length; i++) {
            var pairs = parts[i].split('=');
            params[pairs[0]] = pairs[1];
        }
        if (params[name]) {
            return params[name];
        }
        else {
            return '';
        }
    };
    /**
     * judge something is Function or not
     *
     * @param {*} func
     * @returns {boolean}
     * @memberof Utils
     */
    Utils.prototype.isFunction = function (func) {
        return this.toString.call(func) === '[object Function]';
    };
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
    Utils.prototype.isEqual = function (a, b, aStack, bStack) {
        // === 结果为 true 的区别出 +0 和 -0
        if (a === b)
            return a !== 0 || 1 / a === 1 / b;
        // typeof null 的结果为 object ，这里做判断，是为了让有 null 的情况尽早退出函数
        if (a == null || b == null)
            return false;
        // 判断 NaN
        if (a !== a)
            return b !== b;
        // 判断参数 a 类型，如果是基本类型，在这里可以直接返回 false
        var type = typeof a;
        if (type !== 'function' && type !== 'object' && typeof b !== 'object')
            return false;
        // 更复杂的对象使用 deepEq 函数进行深度比较
        return this.deepIsEqual(a, b, aStack, bStack);
    };
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
    Utils.prototype.deepIsEqual = function (a, b, aStack, bStack) {
        // a 和 b 的内部属性 [[class]] 相同时 返回 true
        var className = this.toString.call(a);
        if (className !== this.toString.call(b))
            return false;
        switch (className) {
            case '[object RegExp]':
            case '[object String]':
                return "" + a === "" + b;
            case '[object Number]':
                if (+a !== +a)
                    return +b !== +b;
                return +a === 0 ? 1 / +a === 1 / b : +a === +b;
            case '[object Date]':
            case '[object Boolean]':
                return +a === +b;
        }
        var areArrays = className === '[object Array]';
        // 不是数组
        if (!areArrays) {
            // 过滤掉两个函数的情况
            if (typeof a !== 'object' || typeof b !== 'object')
                return false;
            var aCtor = a.constructor;
            var bCtor = b.constructor;
            // aCtor 和 bCtor 必须都存在并且都不是 Object 构造函数的情况下，aCtor 不等于 bCtor， 那这两个对象就真的不相等啦
            if (aCtor !== bCtor && !(this.isFunction(aCtor) && aCtor instanceof aCtor && this.isFunction(bCtor) && bCtor instanceof bCtor) && ('constructor' in a && 'constructor' in b)) {
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
            if (length !== b.length)
                return false;
            while (length--) {
                if (!this.isEqual(a[length], b[length], aStack, bStack))
                    return false;
            }
        }
        else {
            var keys = Object.keys(a);
            var key = void 0;
            length = keys.length;
            if (Object.keys(b).length !== length)
                return false;
            while (length--) {
                key = keys[length];
                if (!(b.hasOwnProperty(key) && this.isEqual(a[key], b[key], aStack, bStack)))
                    return false;
            }
        }
        aStack.pop();
        bStack.pop();
        return true;
    };
    /**
     * format string for InnerHTML
     *
     * @param {string} inner
     * @returns {string}
     * @memberof Utils
     */
    Utils.prototype.formatInnerHTML = function (inner) {
        inner = inner.replace(/(\n\s*)/g, '');
        inner = inner.replace(/^[^\S\n]+/gm, '');
        return inner;
    };
    /**
     * judge evn is browser or node
     *
     * @returns {boolean}
     * @memberof Utils
     */
    Utils.prototype.isBrowser = function () {
        return typeof window !== 'undefined' && typeof window.document !== 'undefined';
    };
    return Utils;
}());
exports.default = Utils;

});

unwrapExports(utils);

var lifecycle = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

});

unwrapExports(lifecycle);

var watcher = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

var utils$$1 = new utils.default();
/**
 * Watcher for InDiv
 *
 * @class Watcher
 */
var Watcher = /** @class */ (function () {
    /**
     * Creates an instance of Watcher.
     *
     * data: watched data
     * watcher: function for data change
     * render: InDiv render
     *
     * @param {*} data
     * @param {TFnWatcher} [watcher]
     * @param {TFnRender} [render]
     * @memberof Watcher
     */
    function Watcher(data, watcher, render) {
        this.data = data;
        this.watcher = watcher;
        this.render = render;
        this.watchData(this.data);
    }
    Watcher.prototype.watchData = function (data) {
        if (!data || typeof data !== 'object')
            return;
        var vm = this;
        var _loop_1 = function (key) {
            var val = data[key];
            vm.watchData(val);
            Object.defineProperty(data, key, {
                configurable: true,
                enumerable: true,
                get: function () {
                    return val;
                },
                set: function (newVal) {
                    if (utils$$1.isEqual(newVal, val))
                        return;
                    // for watcher method
                    var oldData;
                    if (vm.watcher)
                        oldData = JSON.parse(JSON.stringify(vm.data));
                    val = newVal;
                    vm.watchData(val);
                    if (vm.watcher)
                        vm.watcher(oldData);
                    if (vm.render)
                        vm.render();
                },
            });
        };
        for (var key in data) {
            _loop_1(key);
        }
    };
    return Watcher;
}());
exports.default = Watcher;

});

unwrapExports(watcher);

var keyWatcher = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

var utils$$1 = new utils.default();
/**
 * watch a key of an Object
 *
 * @class KeyWatcher
 */
var KeyWatcher = /** @class */ (function () {
    function KeyWatcher(data, key, watcher) {
        this.data = data;
        this.key = key;
        this.watcher = watcher;
        this.watchData(this.data, this.key);
    }
    KeyWatcher.prototype.watchData = function (data, key) {
        if (!data || typeof data !== 'object' || !data[key])
            return;
        var vm = this;
        var val = data[key];
        Object.defineProperty(data, key, {
            configurable: true,
            enumerable: true,
            get: function () {
                return val;
            },
            set: function (newVal) {
                if (utils$$1.isEqual(newVal, val))
                    return;
                var oldData;
                if (vm.watcher) {
                    if (typeof val === 'object')
                        oldData = JSON.parse(JSON.stringify(val));
                    if (typeof val !== 'object' && typeof val !== 'function')
                        oldData = val;
                }
                val = newVal;
                if (vm.watcher)
                    vm.watcher(oldData);
            },
        });
    };
    return KeyWatcher;
}());
exports.default = KeyWatcher;

});

unwrapExports(keyWatcher);

var parse = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Vnode
 *
 * @class Vnode
 */
var Vnode = /** @class */ (function () {
    /**
     * Creates an instance of Vnode.
     * @param {IVnode} info
     * @memberof Vnode
     */
    function Vnode(info) {
        this.tagName = info.tagName;
        this.node = info.node;
        this.parentNode = info.parentNode;
        this.attributes = info.attributes;
        this.childNodes = info.childNodes;
        this.nodeValue = info.nodeValue;
        this.type = info.type;
        this.value = info.value;
        this.repeatData = info.repeatData;
        this.eventTypes = info.eventTypes;
        this.key = info.key;
        this.checked = false;
    }
    return Vnode;
}());
/**
 * bind nodeType and return type
 *
 * @param {Node} node
 * @returns {string}
 */
function bindNodeType(node) {
    if (node.nodeType === 1)
        return 'element';
    if (node.nodeType === 3)
        return 'text';
    if (node.nodeType === 11)
        return 'document-fragment';
    return '';
}
/**
 * bind node attributes and return TAttributes
 *
 * @param {(DocumentFragment | Element)} node
 * @returns {TAttributes[]}
 */
function bindAttributes(node) {
    var nodeAttrs = node.attributes;
    var attributes = [];
    if (nodeAttrs) {
        Array.from(nodeAttrs).forEach(function (attr) {
            attributes.push({
                name: attr.name,
                value: attr.value,
            });
        });
    }
    return attributes;
}
/**
 * parse node to VNode
 *
 * @param {(DocumentFragment | Element)} node
 * @returns {IVnode}
 */
function parseToVnode(node) {
    var childNodes = [];
    if (node.childNodes) {
        Array.from(node.childNodes).forEach(function (child) {
            childNodes.push(parseToVnode(child));
        });
    }
    return new Vnode({
        tagName: node.tagName,
        node: node,
        parentNode: node.parentNode,
        attributes: bindAttributes(node),
        childNodes: childNodes,
        nodeValue: node.nodeValue,
        type: bindNodeType(node),
        value: node.value,
        repeatData: node.repeatData ? node.repeatData : null,
        eventTypes: node.eventTypes ? node.eventTypes : null,
        key: node.indiv_repeat_key ? node.indiv_repeat_key : null,
    });
}
exports.default = parseToVnode;

});

unwrapExports(parse);

var diff = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * diff childNodes for diff VNode
 *
 * type: 0 removeChild
 * type: 1 change Child index
 *
 * @param {IVnode} newVnode
 * @param {IVnode} oldVnode
 * @param {IPatchList[]} patchList
 * @param {(oldVnode: IVnode, newVnode: IVnode) => boolean} needDiffChildCallback
 */
function diffChildNodes(oldVnode, newVnode, patchList, needDiffChildCallback) {
    if (oldVnode.childNodes.length > 0) {
        oldVnode.childNodes.forEach(function (oChild, index) {
            if (oChild.checked)
                return;
            var sameCode = newVnode.childNodes.find(function (nChild) { return (nChild.node.isEqualNode(oChild.node) && nChild.key === oChild.key && !nChild.checked) || (nChild.tagName === oChild.tagName && nChild.key === oChild.key && !nChild.checked); });
            if (sameCode) {
                var sameCodeIndex = newVnode.childNodes.findIndex(function (nChild) { return nChild === sameCode; });
                if (sameCodeIndex !== index) {
                    patchList.push({
                        type: 1,
                        newIndex: sameCodeIndex,
                        oldVnode: oChild.node,
                        parentNode: oldVnode.node,
                    });
                }
                diffVnode(oChild, sameCode, patchList, needDiffChildCallback);
                sameCode.checked = true;
            }
            else {
                patchList.push({
                    type: 0,
                    node: oChild.node,
                    parentNode: oldVnode.node,
                });
            }
            oChild.checked = true;
        });
    }
    if (newVnode.childNodes.length > 0) {
        newVnode.childNodes.forEach(function (nChild, index) {
            if (nChild.checked)
                return;
            patchList.push({
                type: 1,
                newIndex: index,
                oldVnode: nChild.node,
                parentNode: oldVnode.node,
            });
            nChild.checked = true;
        });
    }
}
/**
 * diff attributes for diff VNode
 *
 * type: 2 setAttribute
 * type: 3 removeAttribute
 *
 * @param {IVnode} oldVnode
 * @param {IVnode} newVnode
 * @param {IPatchList[]} patchList
 */
function diffAttributes(oldVnode, newVnode, patchList) {
    newVnode.attributes.forEach(function (attr) {
        var oldVnodeAttr = oldVnode.attributes.find(function (at) { return at.name === attr.name; });
        if (!oldVnodeAttr || oldVnodeAttr.value !== attr.value) {
            patchList.push({
                type: 2,
                node: oldVnode.node,
                newValue: attr,
                oldValue: oldVnodeAttr,
            });
        }
    });
    oldVnode.attributes.forEach(function (attr) {
        var newVnodeAttr = newVnode.attributes.find(function (at) { return at.name === attr.name; });
        if (!newVnodeAttr) {
            patchList.push({
                type: 3,
                node: oldVnode.node,
                oldValue: attr,
            });
        }
    });
}
/**
 * diff nodeValue for diff VNode
 *
 * type: 4 change text for node
 *
 * @param {IVnode} oldVnode
 * @param {IVnode} newVnode
 * @param {IPatchList[]} patchList
 * @returns {void}
 */
function diffNodeValue(oldVnode, newVnode, patchList) {
    if (oldVnode.nodeValue !== newVnode.nodeValue) {
        patchList.push({
            type: 4,
            node: oldVnode.node,
            newValue: newVnode.nodeValue,
            oldValue: oldVnode.nodeValue,
        });
    }
}
/**
 * diff value of input, textarea, select for diff VNode
 *
 * type: 5 change value of input
 *
 * @param {IVnode} newVnode
 * @param {IVnode} oldVnode
 * @param {IPatchList[]} patchList
 * @returns {void}
 */
function diffInputValue(oldVnode, newVnode, patchList) {
    if (oldVnode.value !== newVnode.value) {
        patchList.push({
            type: 5,
            node: oldVnode.node,
            newValue: newVnode.value,
            oldValue: oldVnode.value,
        });
    }
}
/**
 * diff repeatData of repeat node
 *
 * type: 6 change repeatData of node
 *
 * @param {IVnode} newVnode
 * @param {IVnode} oldVnode
 * @param {IPatchList[]} patchList
 * @returns {void}
 */
function diffRepeatData(oldVnode, newVnode, patchList) {
    patchList.push({
        type: 6,
        node: oldVnode.node,
        newValue: newVnode.repeatData,
    });
}
/**
 * diff event of node
 *
 * type: 7 change event of node
 * type: 8 change eventTypes of node
 *
 * @param {IVnode} oldVnode
 * @param {IVnode} newVnode
 * @param {IPatchList[]} patchList
 */
function diffEventTypes(oldVnode, newVnode, patchList) {
    var oEventTypes = JSON.parse(oldVnode.eventTypes);
    var nEventTypes = JSON.parse(newVnode.eventTypes);
    // 全部更新为新的事件
    if (nEventTypes && nEventTypes.length > 0) {
        nEventTypes.forEach(function (neventType) {
            patchList.push({
                type: 7,
                node: oldVnode.node,
                eventType: neventType,
                newValue: newVnode.node["event" + neventType],
            });
        });
    }
    if (oEventTypes && oEventTypes.length > 0) {
        // 如果新事件不存在，则删除事件
        // 如果新事件找不到旧事件中的事件，则把旧事件的事件删除
        oEventTypes.forEach(function (oeventType) {
            if (!nEventTypes || nEventTypes.length <= 0) {
                patchList.push({
                    type: 7,
                    node: oldVnode.node,
                    eventType: oeventType,
                    newValue: null,
                });
            }
            if (nEventTypes && nEventTypes.length > 0 && !nEventTypes.find(function (neventType) { return neventType === oeventType; })) {
                patchList.push({
                    type: 7,
                    node: oldVnode.node,
                    eventType: oeventType,
                    newValue: null,
                });
            }
        });
    }
    // 最后要更新下 eventTypes，否则下次 oldVnode.eventTypes 将为最开始的eventTypes
    patchList.push({
        type: 8,
        node: oldVnode.node,
        newValue: newVnode.eventTypes,
    });
}
/**
 * diff two Vnode
 *
 * if needDiffChildCallback return false, then stop diff childNodes
 *
 * @param {IVnode} oldVnode
 * @param {IVnode} newVnode
 * @param {IPatchList[]} patchList
 * @param {(oldVnode: IVnode, newVnode: IVnode) => boolean} needDiffChildCallback
 * @returns {void}
 */
function diffVnode(oldVnode, newVnode, patchList, needDiffChildCallback) {
    if (!patchList)
        throw new Error('patchList can not be null, diffVnode must need an Array');
    if (newVnode.type === 'document-fragment') {
        diffChildNodes(oldVnode, newVnode, patchList, needDiffChildCallback);
        return;
    }
    diffAttributes(oldVnode, newVnode, patchList);
    diffNodeValue(oldVnode, newVnode, patchList);
    if (oldVnode.tagName === 'INPUT' || oldVnode.tagName === 'TEXTAREA textarea' || oldVnode.tagName === 'INPUT')
        diffInputValue(oldVnode, newVnode, patchList);
    diffRepeatData(oldVnode, newVnode, patchList);
    diffEventTypes(oldVnode, newVnode, patchList);
    if (needDiffChildCallback && !needDiffChildCallback(oldVnode, newVnode))
        return;
    diffChildNodes(oldVnode, newVnode, patchList, needDiffChildCallback);
}
exports.default = diffVnode;

});

unwrapExports(diff);

var render = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * renderVnode 对比完render node
 *
 * REMOVETAG: 0, 移除dom: 0
 * REMOVETAG: 1, 移动位置: 1
 * ADDATTRIBUTES: 2, 增加属性: 2
 * REPLACEATTRIBUTES: 3, 移除属性: 3
 * TEXT: 4, 更改文字: 4
 * value: 5, 更改 input textarea select value 的值: 5
 * value: 6, 更改 node 的 repeatData: 6, render过来的的被复制的值
 * value: 7, 更改 node 的 event: 7, 修改事件
 * value: 8, 更改 node 的 eventTypes: 8, 修改node的eventTypes
 *
 * @param [] patchList
 */
function renderVnode(patchList) {
    patchList.sort(function (a, b) {
        if (a.type === b.type && a.newIndex && b.newIndex)
            return a.newIndex - b.newIndex;
        return a.type - b.type;
    });
    patchList.forEach(function (patch) {
        switch (patch.type) {
            case 0:
                patch.parentNode.removeChild(patch.node);
                break;
            case 1:
                if (!(Array.from(patch.parentNode.children).indexOf(patch.oldVnode) === patch.newIndex)) {
                    if (patch.parentNode.contains(patch.oldVnode))
                        patch.parentNode.removeChild(patch.oldVnode);
                    if (patch.parentNode.childNodes[patch.newIndex]) {
                        patch.parentNode.insertBefore(patch.oldVnode, patch.parentNode.childNodes[patch.newIndex]);
                    }
                    else {
                        patch.parentNode.appendChild(patch.oldVnode);
                    }
                }
                break;
            case 2:
                patch.node.setAttribute(patch.newValue.name, patch.newValue.value);
                break;
            case 3:
                patch.node.removeAttribute(patch.oldValue.name);
                break;
            case 4:
                patch.node.nodeValue = patch.newValue;
                break;
            case 5:
                patch.node.value = patch.newValue;
                break;
            case 6:
                patch.node.repeatData = patch.newValue;
                break;
            case 7:
                patch.node["on" + patch.eventType] = patch.newValue;
                break;
            case 8:
                patch.node.eventTypes = patch.newValue;
                break;
        }
    });
}
exports.default = renderVnode;

});

unwrapExports(render);

var virtualDom = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

exports.parseToVnode = parse.default;

exports.diffVnode = diff.default;

exports.renderVnode = render.default;

});

unwrapExports(virtualDom);
var virtualDom_1 = virtualDom.parseToVnode;
var virtualDom_2 = virtualDom.diffVnode;
var virtualDom_3 = virtualDom.renderVnode;

var compileUtils = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * compile util for nv-repeat DOM
 *
 * @export
 * @class CompileUtilForRepeat
 */
var CompileUtilForRepeat = /** @class */ (function () {
    /**
     * Creates an instance of CompileUtilForRepeat.
     *
     * @param {(Element | DocumentFragment)} [fragment]
     * @memberof CompileUtilForRepeat
     */
    function CompileUtilForRepeat(fragment) {
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
    CompileUtilForRepeat.prototype._getValueByValue = function (vm, exp, key) {
        var valueList = exp.replace('()', '').replace('$.', '').split('.');
        var value = vm;
        valueList.forEach(function (v, index) {
            if (v === key && index === 0)
                return;
            value = value[v];
        });
        return value;
    };
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
    CompileUtilForRepeat.prototype._setValueByValue = function (vm, exp, key, setValue) {
        var valueList = exp.replace('()', '').replace('$.', '').split('.');
        var value = vm;
        var lastKey;
        valueList.forEach(function (v, index) {
            if (v === key && index === 0)
                return lastKey = v;
            if (index < valueList.length)
                lastKey = v;
            if (index < valueList.length - 1)
                value = value[v];
        });
        if (lastKey)
            value[lastKey] = setValue;
    };
    /**
     * get value of VM
     *
     * @param {*} vm
     * @param {string} exp
     * @returns {*}
     * @memberof CompileUtilForRepeat
     */
    CompileUtilForRepeat.prototype._getVMVal = function (vm, exp) {
        var valueList = exp.replace('()', '').replace('$.', '').split('.');
        var value = vm;
        valueList.forEach(function (v) {
            value = value[v];
        });
        return value;
    };
    /**
     * get value by repeat value
     *
     * @param {*} val
     * @param {string} exp
     * @param {string} key
     * @returns {*}
     * @memberof CompileUtilForRepeat
     */
    CompileUtilForRepeat.prototype._getVMRepeatVal = function (val, exp, key) {
        var value;
        var valueList = exp.replace('()', '').replace('$.', '').split('.');
        valueList.forEach(function (v, index) {
            if (v === key && index === 0) {
                value = val;
                return;
            }
            value = value[v];
        });
        return value;
    };
    /**
     * get Function for vm
     *
     * @param {*} vm
     * @param {string} exp
     * @returns {Function}
     * @memberof CompileUtil
     */
    CompileUtilForRepeat.prototype._getVMFunction = function (vm, exp) {
        var fnList = exp.replace(/^(\@)/, '').replace(/\(.*\)/, '').split('.');
        var fn = vm;
        fnList.forEach(function (f) {
            fn = fn[f];
        });
        return fn;
    };
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
    CompileUtilForRepeat.prototype._getVMFunctionArguments = function (vm, exp, node, key, val) {
        var args = exp.replace(/^(\@)/, '').match(/\((.*)\)/)[1].replace(/\s+/g, '').split(',');
        var argsList = [];
        var utilVm = this;
        args.forEach(function (arg) {
            if (arg === '')
                return false;
            if (arg === '$element')
                return argsList.push(node);
            if (arg === 'true' || arg === 'false')
                return argsList.push(arg === 'true');
            if (/(\$\.).*/g.test(arg))
                return argsList.push(utilVm._getVMVal(vm.state, arg));
            if (/\'.*\'/g.test(arg))
                return argsList.push(arg.match(/\'(.*)\'/)[1]);
            if (!/\'.*\'/g.test(arg) && /^[0-9]*$/g.test(arg))
                return argsList.push(Number(arg));
            if (arg.indexOf(key) === 0 || arg.indexOf(key + ".") === 0)
                return argsList.push(utilVm._getVMRepeatVal(val, arg, key));
            if (node.repeatData) {
                // $index in this
                Object.keys(node.repeatData).forEach(function (data) {
                    if (arg.indexOf(data) === 0 || arg.indexOf(data + ".") === 0)
                        return argsList.push(utilVm._getValueByValue(node.repeatData[data], arg, data));
                });
            }
        });
        return argsList;
    };
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
    CompileUtilForRepeat.prototype.bind = function (node, key, dir, exp, index, vm, watchValue, val) {
        var repeatValue = (node.repeatData)[key];
        var value;
        if (/^(\@)/.test(exp)) {
            if (dir === 'model')
                throw new Error("directive: nv-model can't use " + exp + " as value");
            // if @Function need function return value
            var fn = this._getVMFunction(vm, exp);
            var argsList = this._getVMFunctionArguments(vm, exp, node, key, val);
            value = fn.apply(vm, argsList);
        }
        else if (exp.indexOf(key) === 0 || exp.indexOf(key + ".") === 0) {
            // repeat value
            value = this._getVMRepeatVal(repeatValue, exp, key);
        }
        else if (/(\$\.).*/.test(exp)) {
            // normal value
            value = this._getVMVal(vm.state, exp);
        }
        else if (exp === '$index') {
            value = index;
        }
        else {
            throw new Error("directive: nv-" + dir + " can't use recognize this value " + exp);
        }
        if (!node.hasChildNodes())
            this.templateUpdater(node, repeatValue, key, vm);
        var updaterFn = this[dir + "Updater"];
        switch (dir) {
            case 'model':
                var watchData = void 0;
                if (exp.indexOf(key) === 0 || exp.indexOf(key + ".") === 0) {
                    watchData = watchValue;
                }
                else {
                    watchData = this._getVMVal(vm.state, exp);
                }
                if (updaterFn)
                    updaterFn.call(this, node, value, exp, key, index, watchData, vm);
                break;
            case 'text':
                if (updaterFn)
                    updaterFn.call(this, node, value);
                break;
            case 'html':
                if (updaterFn)
                    updaterFn.call(this, node, value);
                break;
            case 'if':
                if (updaterFn)
                    updaterFn.call(this, node, value);
                break;
            case 'class':
                if (updaterFn)
                    updaterFn.call(this, node, value);
                break;
            case 'key':
                if (updaterFn)
                    updaterFn.call(this, node, value);
                break;
            default:
                this.commonUpdater.call(this, node, value, dir);
        }
    };
    /**
     * update text for {{}}
     *
     * @param {Element} node
     * @param {*} [val]
     * @param {string} [key]
     * @param {*} [vm]
     * @memberof CompileUtilForRepeat
     */
    CompileUtilForRepeat.prototype.templateUpdater = function (node, val, key, vm) {
        var text = node.textContent;
        var reg = /\{\{(.*)\}\}/g;
        if (reg.test(text)) {
            var textList = text.match(/(\{\{[^\{\}]+?\}\})/g);
            if (textList && textList.length > 0) {
                for (var i = 0; i < textList.length; i++) {
                    var exp = textList[i].replace('{{', '').replace('}}', '');
                    var value = null;
                    if (/^(\@)/.test(exp)) {
                        var fn = this._getVMFunction(vm, exp);
                        var argsList = this._getVMFunctionArguments(vm, exp, node, key, val);
                        value = fn.apply(vm, argsList);
                    }
                    else if (exp.indexOf(key) === 0 || exp.indexOf(key + ".") === 0) {
                        value = this._getVMRepeatVal(val, exp, key);
                    }
                    else if (/(\$\.).*/.test(exp)) {
                        value = this._getVMVal(vm.state, exp);
                    }
                    else {
                        throw new Error("directive: {{" + exp + "}} can't use recognize " + exp);
                    }
                    node.textContent = node.textContent.replace(textList[i], value);
                }
            }
        }
    };
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
    CompileUtilForRepeat.prototype.modelUpdater = function (node, value, exp, key, index, watchData, vm) {
        node.value = typeof value === 'undefined' ? '' : value;
        var utilVm = this;
        var func = function (event) {
            event.preventDefault();
            if (/(\$\.).*/.test(exp)) {
                var val = exp.replace('$.', '');
                if (event.target.value === watchData)
                    return;
                vm.state[val] = event.target.value;
            }
            else if (exp.indexOf(key) === 0 || exp.indexOf(key + ".") === 0) {
                if (typeof watchData[index] !== 'object')
                    watchData[index] = event.target.value;
                if (typeof watchData[index] === 'object') {
                    var vals = utilVm._getValueByValue(watchData[index], exp, key);
                    vals = event.target.value;
                    utilVm._setValueByValue(watchData[index], exp, key, vals);
                }
            }
            else {
                throw new Error('directive: nv-model can\'t use recognize this value');
            }
        };
        node.oninput = func;
        node.eventinput = func;
        if (node.eventTypes) {
            var eventlist = JSON.parse(node.eventTypes);
            eventlist.push('input');
            node.eventTypes = JSON.stringify(eventlist);
        }
        if (!node.eventTypes)
            node.eventTypes = JSON.stringify(['input']);
    };
    /**
     * update text for nv-text
     *
     * @param {Element} node
     * @param {*} value
     * @returns {void}
     * @memberof CompileUtilForRepeat
     */
    CompileUtilForRepeat.prototype.textUpdater = function (node, value) {
        if (node.tagName.toLocaleLowerCase() === 'input')
            return node.value = value;
        node.textContent = typeof value === 'undefined' ? '' : value;
    };
    /**
     * update html for nv-html
     *
     * @param {Element} node
     * @param {*} value
     * @memberof CompileUtilForRepeat
     */
    CompileUtilForRepeat.prototype.htmlUpdater = function (node, value) {
        node.innerHTML = typeof value === 'undefined' ? '' : value;
    };
    /**
     * remove or show DOM for nv-if
     *
     * @param {Element} node
     * @param {*} value
     * @memberof CompileUtilForRepeat
     */
    CompileUtilForRepeat.prototype.ifUpdater = function (node, value) {
        if (!value && this.$fragment.contains(node))
            this.$fragment.removeChild(node);
    };
    /**
     * update class for nv-class
     *
     * @param {Element} node
     * @param {*} value
     * @returns {void}
     * @memberof CompileUtilForRepeat
     */
    CompileUtilForRepeat.prototype.classUpdater = function (node, value) {
        if (!value)
            return;
        var className = node.className;
        className = className.replace(/\s$/, '');
        var space = className && String(value) ? ' ' : '';
        node.className = className + space + value;
    };
    /**
     * update value of repeat node for nv-key
     *
     * @param {Element} node
     * @param {*} value
     * @memberof CompileUtilForRepeat
     */
    CompileUtilForRepeat.prototype.keyUpdater = function (node, value) {
        node.indiv_repeat_key = value;
    };
    /**
     * commonUpdater for nv directive except repeat model text html if class
     *
     * @param {Element} node
     * @param {*} value
     * @param {string} dir
     * @memberof CompileUtil
     */
    CompileUtilForRepeat.prototype.commonUpdater = function (node, value, dir) {
        if (value)
            node[dir] = value;
        if (!value && node[dir])
            node[dir] = null;
    };
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
    CompileUtilForRepeat.prototype.eventHandler = function (node, vm, exp, eventName, key, val) {
        var eventType = eventName.split(':')[1];
        var fn = this._getVMFunction(vm, exp);
        var args = exp.replace(/^(\@)/, '').match(/\((.*)\)/)[1].replace(/ /g, '').split(',');
        var utilVm = this;
        var func = function (event) {
            var _this = this;
            var argsList = [];
            args.forEach(function (arg) {
                if (arg === '')
                    return false;
                if (arg === '$event')
                    return argsList.push(event);
                if (arg === '$element')
                    return argsList.push(node);
                if (arg === 'true' || arg === 'false')
                    return argsList.push(arg === 'true');
                if (/(\$\.).*/g.test(arg))
                    return argsList.push(utilVm._getVMVal(vm.state, arg));
                if (/\'.*\'/g.test(arg))
                    return argsList.push(arg.match(/\'(.*)\'/)[1]);
                if (!/\'.*\'/g.test(arg) && /^[0-9]*$/g.test(arg))
                    return argsList.push(Number(arg));
                if (arg.indexOf(key) === 0 || arg.indexOf(key + ".") === 0)
                    return argsList.push(utilVm._getVMRepeatVal(val, arg, key));
                if (_this.repeatData) {
                    // $index in this
                    Object.keys(_this.repeatData).forEach(function (data) {
                        if (arg.indexOf(data) === 0 || arg.indexOf(data + ".") === 0)
                            return argsList.push(utilVm._getValueByValue(_this.repeatData[data], arg, data));
                    });
                }
            });
            fn.apply(vm, argsList);
        };
        if (eventType && fn) {
            node["on" + eventType] = func;
            node["event" + eventType] = func;
            if (node.eventTypes) {
                var eventlist = JSON.parse(node.eventTypes);
                eventlist.push(eventType);
                node.eventTypes = JSON.stringify(eventlist);
            }
            if (!node.eventTypes)
                node.eventTypes = JSON.stringify([eventType]);
        }
    };
    return CompileUtilForRepeat;
}());
exports.CompileUtilForRepeat = CompileUtilForRepeat;
/**
 * compile util for Compiler
 *
 * @export
 * @class CompileUtil
 */
var CompileUtil = /** @class */ (function () {
    /**
     * Creates an instance of CompileUtil.
     *
     * @param {(Element | DocumentFragment)} [fragment]
     *  @memberof CompileUtil
     */
    function CompileUtil(fragment) {
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
    CompileUtil.prototype._getValueByValue = function (vm, exp, key) {
        var valueList = exp.replace('()', '').replace('$.', '').split('.');
        var value = vm;
        valueList.forEach(function (v, index) {
            if (v === key && index === 0)
                return;
            value = value[v];
        });
        return value;
    };
    /**
     * get value of VM
     *
     * @param {*} vm
     * @param {string} exp
     * @returns {*}
     * @memberof CompileUtil
     */
    CompileUtil.prototype._getVMVal = function (vm, exp) {
        var valueList = exp.replace('()', '').replace('$.', '').split('.');
        var value = vm;
        valueList.forEach(function (v) {
            value = value[v];
        });
        return value;
    };
    /**
     * get value by repeat value
     *
     * @param {*} vm
     * @param {string} exp
     * @returns {void}
     * @memberof CompileUtil
     */
    CompileUtil.prototype._getVMRepeatVal = function (vm, exp) {
        var vlList = exp.split(' ');
        var value = this._getVMVal(vm.state, vlList[3]);
        return value;
    };
    /**
     * get Function for vm
     *
     * @param {*} vm
     * @param {string} exp
     * @returns {Function}
     * @memberof CompileUtil
     */
    CompileUtil.prototype._getVMFunction = function (vm, exp) {
        var fnList = exp.replace(/^(\@)/, '').replace(/\(.*\)/, '').split('.');
        var fn = vm;
        fnList.forEach(function (f) {
            fn = fn[f];
        });
        return fn;
    };
    /**
     * get Function arguments for vm
     *
     * @param {*} vm
     * @param {string} exp
     * @param {Element} node
     * @returns {any[]}
     * @memberof CompileUtil
     */
    CompileUtil.prototype._getVMFunctionArguments = function (vm, exp, node) {
        var args = exp.replace(/^(\@)/, '').match(/\((.*)\)/)[1].replace(/\s+/g, '').split(',');
        var argsList = [];
        args.forEach(function (arg) {
            if (arg === '')
                return false;
            if (arg === '$element')
                return argsList.push(node);
            if (arg === 'true' || arg === 'false')
                return argsList.push(arg === 'true');
            if (/(\$\.).*/g.test(arg))
                return argsList.push(new CompileUtil()._getVMVal(vm.state, arg));
            if (/\'.*\'/g.test(arg))
                return argsList.push(arg.match(/\'(.*)\'/)[1]);
            if (!/\'.*\'/g.test(arg) && /^[0-9]*$/g.test(arg))
                return argsList.push(Number(arg));
        });
        return argsList;
    };
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
    CompileUtil.prototype.bind = function (node, vm, exp, dir) {
        var updaterFn = this[dir + "Updater"];
        var isRepeatNode = this.isRepeatNode(node);
        if (isRepeatNode) {
            // compile repeatNode's attributes
            switch (dir) {
                case 'repeat':
                    if (updaterFn)
                        updaterFn.call(this, node, this._getVMRepeatVal(vm, exp), exp, vm);
                    break;
            }
        }
        else {
            var value = null;
            // for @Function(arg)
            if (/^(\@)/.test(exp)) {
                if (dir === 'model')
                    throw new Error("directive: nv-model can't use " + exp + " as value");
                // if @Function need function return value
                var fn = this._getVMFunction(vm, exp);
                var argsList = this._getVMFunctionArguments(vm, exp, node);
                value = fn.apply(vm, argsList);
            }
            else if (/(\$\.).*/.test(exp)) {
                // normal value
                value = this._getVMVal(vm.state, exp);
            }
            else {
                throw new Error("directive: nv-" + dir + " can't use recognize this value " + exp);
            }
            // compile unrepeatNode's attributes
            switch (dir) {
                case 'model':
                    if (updaterFn)
                        updaterFn.call(this, node, value, exp, vm);
                    break;
                case 'text':
                    if (updaterFn)
                        updaterFn.call(this, node, value);
                    break;
                case 'html':
                    if (updaterFn)
                        updaterFn.call(this, node, value);
                    break;
                case 'if':
                    if (updaterFn)
                        updaterFn.call(this, node, value);
                    break;
                case 'class':
                    if (updaterFn)
                        updaterFn.call(this, node, value);
                    break;
                case 'key':
                    if (updaterFn)
                        updaterFn.call(this, node, value);
                    break;
                default:
                    this.commonUpdater.call(this, node, value, dir);
            }
            node.removeAttribute("nv-" + dir);
        }
    };
    /**
     * update text for {{}}
     *
     * @param {*} node
     * @param {*} vm
     * @param {string} exp
     * @memberof CompileUtil
     */
    CompileUtil.prototype.templateUpdater = function (node, vm, exp) {
        var _exp = exp.replace('{{', '').replace('}}', '');
        var value = null;
        if (/^(\@)/.test(_exp)) {
            var fn = this._getVMFunction(vm, _exp);
            var argsList = this._getVMFunctionArguments(vm, _exp, node);
            value = fn.apply(vm, argsList);
        }
        else if (/(\$\.).*/.test(_exp)) {
            value = this._getVMVal(vm.state, _exp);
        }
        else {
            throw new Error("directive: " + exp + " can't use recognize this value");
        }
        node.textContent = node.textContent.replace(exp, value);
    };
    /**
     * update value of input for nv-model
     *
     * @param {Element} node
     * @param {*} value
     * @param {string} exp
     * @param {*} vm
     * @memberof CompileUtil
     */
    CompileUtil.prototype.modelUpdater = function (node, value, exp, vm) {
        node.value = typeof value === 'undefined' ? '' : value;
        var val = exp.replace('$.', '');
        var func = function (event) {
            event.preventDefault();
            if (/(\$\.).*/.test(exp))
                vm.state[val] = event.target.value;
        };
        node.oninput = func;
        node.eventinput = func;
        if (node.eventTypes) {
            var eventlist = JSON.parse(node.eventTypes);
            eventlist.push('input');
            node.eventTypes = JSON.stringify(eventlist);
        }
        if (!node.eventTypes)
            node.eventTypes = JSON.stringify(['input']);
    };
    /**
     * update text for nv-text
     *
     * @param {Element} node
     * @param {*} value
     * @returns {void}
     * @memberof CompileUtil
     */
    CompileUtil.prototype.textUpdater = function (node, value) {
        if (node.tagName.toLocaleLowerCase() === 'input')
            return node.value = value;
        node.textContent = typeof value === 'undefined' ? '' : value;
    };
    /**
     * update html for nv-html
     *
     * @param {Element} node
     * @param {*} value
     * @memberof CompileUtil
     */
    CompileUtil.prototype.htmlUpdater = function (node, value) {
        node.innerHTML = typeof value === 'undefined' ? '' : value;
    };
    /**
     * remove or show DOM for nv-if
     *
     * @param {Element} node
     * @param {*} value
     * @memberof CompileUtil
     */
    CompileUtil.prototype.ifUpdater = function (node, value) {
        if (!value && this.$fragment.contains(node))
            this.$fragment.removeChild(node);
    };
    /**
     * update class for nv-class
     *
     * @param {Element} node
     * @param {*} value
     * @returns {void}
     * @memberof CompileUtil
     */
    CompileUtil.prototype.classUpdater = function (node, value) {
        if (!value)
            return;
        var className = node.className;
        className = className.replace(/\s$/, '');
        var space = className && String(value) ? ' ' : '';
        node.className = className + space + value;
    };
    /**
     * update value of repeat node for nv-key
     *
     * @param {Element} node
     * @param {*} value
     * @memberof CompileUtilForRepeat
     */
    CompileUtil.prototype.keyUpdater = function (node, value) {
        node.indiv_repeat_key = value;
    };
    /**
     * commonUpdater for nv directive except repeat model text html if class
     *
     * @param {Element} node
     * @param {*} value
     * @param {string} dir
     * @memberof CompileUtil
     */
    CompileUtil.prototype.commonUpdater = function (node, value, dir) {
        if (value)
            node[dir] = value;
        if (!value && node[dir])
            node[dir] = null;
    };
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
    CompileUtil.prototype.repeatUpdater = function (node, value, expFather, vm) {
        var _this = this;
        if (!value)
            return;
        if (value && !(value instanceof Array))
            throw new Error('compile error: nv-repeat need an Array!');
        var key = expFather.split(' ')[1];
        value.forEach(function (val, index) {
            var repeatData = {};
            repeatData[key] = val;
            repeatData.$index = index;
            var newElement = _this.cloneNode(node, repeatData);
            var nodeAttrs = newElement.attributes;
            var text = newElement.textContent;
            var reg = /\{\{(.*)\}\}/g;
            _this.$fragment.insertBefore(newElement, node);
            newElement.removeAttribute('nv-repeat');
            if (_this.isTextNode(newElement) && reg.test(text))
                new CompileUtilForRepeat(_this.$fragment).templateUpdater(newElement, val, key, vm);
            if (nodeAttrs) {
                Array.from(nodeAttrs).forEach(function (attr) {
                    var attrName = attr.name;
                    if (_this.isDirective(attrName) && attrName !== 'nv-repeat') {
                        var dir = attrName.substring(3);
                        var exp = attr.value;
                        if (_this.isEventDirective(dir)) {
                            new CompileUtilForRepeat(_this.$fragment).eventHandler(newElement, vm, exp, dir, key, val);
                        }
                        else {
                            new CompileUtilForRepeat(_this.$fragment).bind(newElement, key, dir, exp, index, vm, value, val);
                        }
                        newElement.removeAttribute(attrName);
                    }
                });
            }
            // first insert node before repeatnode, and remove repeatnode in Compile
            if (newElement.hasChildNodes() && _this.$fragment.contains(newElement))
                _this.repeatChildrenUpdater(newElement, val, expFather, index, vm, value);
        });
    };
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
    CompileUtil.prototype.repeatChildrenUpdater = function (node, value, expFather, index, vm, watchValue) {
        var _this = this;
        var key = expFather.split(' ')[1];
        Array.from(node.childNodes).forEach(function (child) {
            if (_this.isElementNode(child) && vm.$components.find(function (component) { return component.$selector === child.tagName.toLocaleLowerCase(); }))
                child.isComponent = true;
            child.repeatData = node.repeatData || {};
            child.repeatData[key] = value;
            child.repeatData.$index = index;
            if (_this.isRepeatProp(child))
                child.setAttribute("_prop-" + key, JSON.stringify(value));
            var nodeAttrs = child.attributes;
            var text = child.textContent;
            var reg = /\{\{(.*)\}\}/g;
            if (_this.isTextNode(child) && reg.test(text))
                new CompileUtilForRepeat(node).templateUpdater(child, value, key, vm);
            if (nodeAttrs) {
                Array.from(nodeAttrs).forEach(function (attr) {
                    var attrName = attr.name;
                    var exp = attr.value;
                    var dir = attrName.substring(3);
                    if (_this.isDirective(attrName) && attrName !== 'nv-repeat' && new RegExp("(^" + key + ")|(^$.)|(^@)").test(exp)) {
                        if (_this.isEventDirective(dir)) {
                            new CompileUtilForRepeat(node).eventHandler(child, vm, exp, dir, key, value);
                        }
                        else {
                            new CompileUtilForRepeat(node).bind(child, key, dir, exp, index, vm, watchValue, value);
                        }
                        child.removeAttribute(attrName);
                    }
                });
            }
            if (child.hasChildNodes() && !_this.isRepeatNode(child) && node.contains(child))
                _this.repeatChildrenUpdater(child, value, expFather, index, vm, watchValue);
            var newAttrs = child.attributes;
            if (newAttrs && node.contains(child)) {
                var restRepeat = Array.from(newAttrs).find(function (attr) { return _this.isDirective(attr.name) && attr.name === 'nv-repeat'; });
                if (restRepeat) {
                    var newWatchData = restRepeat.value.split(' ')[3];
                    // first compile and then remove repeatNode
                    if (/^(\$\.)/.test(newWatchData)) {
                        new CompileUtil(node).bind(child, vm, restRepeat.value, restRepeat.name.substring(3));
                        if (node.contains(child))
                            node.removeChild(child);
                    }
                    if (new RegExp("(^" + key + ")").test(newWatchData)) {
                        new CompileUtil(node).repeatUpdater(child, _this._getValueByValue(value, newWatchData, key), restRepeat.value, vm);
                        if (node.contains(child))
                            node.removeChild(child);
                    }
                    node.removeAttribute('nv-repeat');
                }
            }
        });
    };
    /**
     * compile event and build eventType in DOM
     *
     * @param {Element} node
     * @param {*} vm
     * @param {string} exp
     * @param {string} eventName
     * @memberof Compile
     */
    CompileUtil.prototype.eventHandler = function (node, vm, exp, eventName) {
        var eventType = eventName.split(':')[1];
        var fn = this._getVMFunction(vm, exp);
        var args = exp.replace(/^(\@)/, '').match(/\((.*)\)/)[1].replace(/\s+/g, '').split(',');
        var func = function (event) {
            var argsList = [];
            args.forEach(function (arg) {
                if (arg === '')
                    return false;
                if (arg === '$event')
                    return argsList.push(event);
                if (arg === '$element')
                    return argsList.push(node);
                if (arg === 'true' || arg === 'false')
                    return argsList.push(arg === 'true');
                if (/(\$\.).*/g.test(arg))
                    return argsList.push(new CompileUtil()._getVMVal(vm.state, arg));
                if (/\'.*\'/g.test(arg))
                    return argsList.push(arg.match(/\'(.*)\'/)[1]);
                if (!/\'.*\'/g.test(arg) && /^[0-9]*$/g.test(arg))
                    return argsList.push(Number(arg));
            });
            fn.apply(vm, argsList);
        };
        if (eventType && fn) {
            node["on" + eventType] = func;
            node["event" + eventType] = func;
            if (node.eventTypes) {
                var eventlist = JSON.parse(node.eventTypes);
                eventlist.push(eventType);
                node.eventTypes = JSON.stringify(eventlist);
            }
            if (!node.eventTypes)
                node.eventTypes = JSON.stringify([eventType]);
        }
    };
    /**
     * judge attribute is nv directive or not
     *
     * @param {string} attr
     * @returns {boolean}
     * @memberof CompileUtil
     */
    CompileUtil.prototype.isDirective = function (attr) {
        return attr.indexOf('nv-') === 0;
    };
    /**
     * judge attribute is nv event directive or not
     *
     * @param {string} event
     * @returns {boolean}
     * @memberof CompileUtil
     */
    CompileUtil.prototype.isEventDirective = function (event) {
        return event.indexOf('on') === 0;
    };
    /**
     * judge DOM is a element node or not
     *
     * @param {Element} node
     * @returns {boolean}
     * @memberof CompileUtil
     */
    CompileUtil.prototype.isElementNode = function (node) {
        return node.nodeType === 1;
    };
    /**
     * judge DOM is nv-repeat DOM or not
     *
     * @param {Element} node
     * @returns {boolean}
     * @memberof CompileUtil
     */
    CompileUtil.prototype.isRepeatNode = function (node) {
        var nodeAttrs = node.attributes;
        var result = false;
        if (nodeAttrs) {
            Array.from(nodeAttrs).forEach(function (attr) {
                var attrName = attr.name;
                if (attrName === 'nv-repeat')
                    result = true;
            });
        }
        return result;
    };
    /**
     * judge DOM is a Component DOM in a repeat DOM or not
     *
     * @param {Element} node
     * @returns {boolean}
     * @memberof CompileUtil
     */
    CompileUtil.prototype.isRepeatProp = function (node) {
        var nodeAttrs = node.attributes;
        var result = false;
        if (nodeAttrs)
            return !!(Array.from(nodeAttrs).find(function (attr) { return /^\{(.+)\}$/.test(attr.value); }));
        return result;
    };
    /**
     * judge DOM is text node or not
     *
     * @param {Element} node
     * @returns {boolean}
     * @memberof CompileUtil
     */
    CompileUtil.prototype.isTextNode = function (node) {
        return node.nodeType === 3;
    };
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
    CompileUtil.prototype.cloneNode = function (node, repeatData) {
        var newElement = node.cloneNode(true);
        if (node.eventTypes) {
            JSON.parse(node.eventTypes).forEach(function (eventType) {
                newElement["on" + eventType] = node["event" + eventType];
                newElement["event" + eventType] = node["event" + eventType];
            });
            newElement.eventTypes = node.eventTypes;
        }
        if (repeatData)
            newElement.repeatData = repeatData;
        if (node.isComponent)
            newElement.isComponent = true;
        return newElement;
    };
    return CompileUtil;
}());
exports.CompileUtil = CompileUtil;

});

unwrapExports(compileUtils);
var compileUtils_1 = compileUtils.CompileUtilForRepeat;
var compileUtils_2 = compileUtils.CompileUtil;

var compile = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



var utils$$1 = new utils.default();
/**
 * main compiler
 *
 * @class Compile
 */
var Compile = /** @class */ (function () {
    /**
     * Creates an instance of Compile.
     * @param {(string | Element)} el
     * @param {*} vm
     * @memberof Compile
     */
    function Compile(el, vm) {
        this.$vm = vm;
        this.$el = this.isElementNode(el) ? el : document.querySelector(el);
        if (this.$el) {
            this.$fragment = this.node2Fragment();
            this.init();
            var oldVnode = virtualDom.parseToVnode(this.$el);
            var newVnode = virtualDom.parseToVnode(this.$fragment);
            var patchList = [];
            virtualDom.diffVnode(oldVnode, newVnode, patchList, this.needDiffChildCallback.bind(this));
            virtualDom.renderVnode(patchList);
            this.$fragment = null;
            oldVnode = null;
            newVnode = null;
            patchList = null;
        }
    }
    /**
     * needDiffChildCallback for Virtual DOM diff
     *
     * if newVnode.node.isComponent no need diff children
     * if newVnode.tagName and oldVnode.tagName no need diff children
     *
     * @param {IVnode} oldVnode
     * @param {IVnode} newVnode
     * @returns {boolean}
     * @memberof Compile
     */
    Compile.prototype.needDiffChildCallback = function (oldVnode, newVnode) {
        // 如果为组件，则停止对比内部元素，交由对应组件diff
        if (newVnode.node.isComponent && oldVnode.node) {
            oldVnode.node.isComponent = true;
            return false;
        }
        // 如果为路由渲染层，则停止对比内部元素，交由router diff
        if (oldVnode.tagName === newVnode.tagName && newVnode.tagName === this.$vm.$vm.$routeDOMKey.toLocaleUpperCase())
            return false;
        return true;
    };
    /**
     * init compile
     *
     * @memberof Compile
     */
    Compile.prototype.init = function () {
        this.compileElement(this.$fragment);
    };
    /**
     * compile element
     *
     * @param {DocumentFragment} fragment
     * @memberof Compile
     */
    Compile.prototype.compileElement = function (fragment) {
        var elementCreated = document.createElement('div');
        elementCreated.innerHTML = utils$$1.formatInnerHTML(this.$vm.$template);
        var childNodes = elementCreated.childNodes;
        this.recursiveDOM(childNodes, fragment);
    };
    /**
     * recursive DOM for New State
     *
     * @param {(NodeListOf<Node & ChildNode>)} childNodes
     * @param {(DocumentFragment | Element)} fragment
     * @memberof Compile
     */
    Compile.prototype.recursiveDOM = function (childNodes, fragment) {
        var _this = this;
        Array.from(childNodes).forEach(function (node) {
            if (_this.isElementNode(node) && _this.$vm.$components.find(function (component) { return component.$selector === node.tagName.toLocaleLowerCase(); }))
                node.isComponent = true;
            if (node.hasChildNodes() && !_this.isRepeatNode(node))
                _this.recursiveDOM(node.childNodes, node);
            fragment.appendChild(node);
            var text = node.textContent;
            var reg = /\{\{(.*)\}\}/g;
            if (_this.isElementNode(node))
                _this.compile(node, fragment);
            if (_this.isTextNode(node) && reg.test(text)) {
                var textList = text.match(/(\{\{[^\{\}]+?\}\})/g);
                var length = textList.length;
                if (textList && length > 0) {
                    for (var i = 0; i < length; i++) {
                        _this.compileText(node, textList[i]);
                    }
                }
            }
            // after compile repeatNode, remove repeatNode
            if (_this.isRepeatNode(node) && fragment.contains(node))
                fragment.removeChild(node);
        });
    };
    /**
     * compile string to DOM
     *
     * @param {Element} node
     * @param {(DocumentFragment | Element)} fragment
     * @memberof Compile
     */
    Compile.prototype.compile = function (node, fragment) {
        var _this = this;
        var nodeAttrs = node.attributes;
        if (nodeAttrs) {
            Array.from(nodeAttrs).forEach(function (attr) {
                var attrName = attr.name;
                if (_this.isDirective(attrName)) {
                    var dir = attrName.substring(3);
                    var exp = attr.value;
                    var compileUtil = new compileUtils.CompileUtil(fragment);
                    if (_this.isEventDirective(dir)) {
                        compileUtil.eventHandler(node, _this.$vm, exp, dir);
                        node.removeAttribute(attrName);
                    }
                    else {
                        compileUtil.bind(node, _this.$vm, exp, dir);
                    }
                }
            });
        }
    };
    /**
     * create document fragment
     *
     * @returns {DocumentFragment}
     * @memberof Compile
     */
    Compile.prototype.node2Fragment = function () {
        return document.createDocumentFragment();
    };
    /**
     * compile text and use CompileUtil templateUpdater
     *
     * @param {Element} node
     * @param {string} exp
     * @memberof Compile
     */
    Compile.prototype.compileText = function (node, exp) {
        new compileUtils.CompileUtil(this.$fragment).templateUpdater(node, this.$vm, exp);
    };
    /**
     * judge attribute is nv directive or not
     *
     * @param {string} attr
     * @returns {boolean}
     * @memberof Compile
     */
    Compile.prototype.isDirective = function (attr) {
        return attr.indexOf('nv-') === 0;
    };
    /**
     * judge attribute is nv event directive or not
     *
     * @param {string} eventName
     * @returns {boolean}
     * @memberof Compile
     */
    Compile.prototype.isEventDirective = function (eventName) {
        return eventName.indexOf('on') === 0;
    };
    /**
     * judge DOM is a element node or not
     *
     * @param {(Element | string)} node
     * @returns {boolean}
     * @memberof Compile
     */
    Compile.prototype.isElementNode = function (node) {
        if (typeof node === 'string')
            return false;
        return node.nodeType === 1;
    };
    /**
     * judge DOM is nv-repeat dom or not
     *
     * @param {Element} node
     * @returns {boolean}
     * @memberof Compile
     */
    Compile.prototype.isRepeatNode = function (node) {
        var nodeAttrs = node.attributes;
        var result = false;
        if (nodeAttrs) {
            Array.from(nodeAttrs).forEach(function (attr) {
                var attrName = attr.name;
                if (attrName === 'nv-repeat')
                    result = true;
            });
        }
        return result;
    };
    /**
     * judge DOM is text node or not
     *
     * @param {Element} node
     * @returns {boolean}
     * @memberof Compile
     */
    Compile.prototype.isTextNode = function (node) {
        return node.nodeType === 3;
    };
    return Compile;
}());
exports.default = Compile;

});

unwrapExports(compile);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __exportStar(m, exports) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
}
function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

var _tslib = /*#__PURE__*/Object.freeze({
	__extends: __extends,
	get __assign () { return __assign; },
	__rest: __rest,
	__decorate: __decorate,
	__param: __param,
	__metadata: __metadata,
	__awaiter: __awaiter,
	__generator: __generator,
	__exportStar: __exportStar,
	__values: __values,
	__read: __read,
	__spread: __spread,
	__await: __await,
	__asyncGenerator: __asyncGenerator,
	__asyncDelegator: __asyncDelegator,
	__asyncValues: __asyncValues,
	__makeTemplateObject: __makeTemplateObject,
	__importStar: __importStar,
	__importDefault: __importDefault
});

var compile$1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

});

unwrapExports(compile$1);

var compileUtils$1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

});

unwrapExports(compileUtils$1);

var component = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

});

unwrapExports(component);

var indiv = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

});

unwrapExports(indiv);

var nvModule = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

});

unwrapExports(nvModule);

var keyWatcher$1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

});

unwrapExports(keyWatcher$1);

var router = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

});

unwrapExports(router);

var utils$1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

});

unwrapExports(utils$1);

var virtualDom$1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

});

unwrapExports(virtualDom$1);

var watcher$1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

});

unwrapExports(watcher$1);

var types = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

exports.ICompile = compile$1.ICompile;

exports.ICompileUtilForRepeat = compileUtils$1.ICompileUtilForRepeat;
exports.ICompileUtil = compileUtils$1.ICompileUtil;

exports.ComponentList = component.ComponentList;
exports.IComponent = component.IComponent;
exports.SetState = component.SetState;

exports.IMiddleware = indiv.IMiddleware;
exports.EsRouteObject = indiv.EsRouteObject;
exports.IInDiv = indiv.IInDiv;

exports.INvModule = nvModule.INvModule;
exports.TInjectTokenProvider = nvModule.TInjectTokenProvider;
exports.TUseClassProvider = nvModule.TUseClassProvider;
exports.TuseValueProvider = nvModule.TuseValueProvider;

exports.IKeyWatcher = keyWatcher$1.IKeyWatcher;

exports.TRouter = router.TRouter;
exports.IRouter = router.IRouter;
exports.GetLocation = router.GetLocation;
exports.SetLocation = router.SetLocation;

exports.IUtil = utils$1.IUtil;

exports.IVnode = virtualDom$1.IVnode;
exports.TAttributes = virtualDom$1.TAttributes;
exports.IPatchList = virtualDom$1.IPatchList;

exports.TFnWatcher = watcher$1.TFnWatcher;
exports.TFnRender = watcher$1.TFnRender;
exports.IWatcher = watcher$1.IWatcher;

});

unwrapExports(types);
var types_1 = types.ICompile;
var types_2 = types.ICompileUtilForRepeat;
var types_3 = types.ICompileUtil;
var types_4 = types.ComponentList;
var types_5 = types.IComponent;
var types_6 = types.SetState;
var types_7 = types.IMiddleware;
var types_8 = types.EsRouteObject;
var types_9 = types.IInDiv;
var types_10 = types.INvModule;
var types_11 = types.TInjectTokenProvider;
var types_12 = types.TUseClassProvider;
var types_13 = types.TuseValueProvider;
var types_14 = types.IKeyWatcher;
var types_15 = types.TRouter;
var types_16 = types.IRouter;
var types_17 = types.GetLocation;
var types_18 = types.SetLocation;
var types_19 = types.IUtil;
var types_20 = types.IVnode;
var types_21 = types.TAttributes;
var types_22 = types.IPatchList;
var types_23 = types.TFnWatcher;
var types_24 = types.TFnRender;
var types_25 = types.IWatcher;

var tslib_1 = getCjsExportFromNamespace(_tslib);

var router$2 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




exports.TRouter = types.TRouter;
var utils$$1 = new utils.default();
/**
 * route for InDiv
 *
 * @export
 * @class Router
 */
var Router = /** @class */ (function () {
    function Router() {
        this.routes = [];
        this.routesList = [];
        this.currentUrl = '';
        this.lastRoute = null;
        this.rootDom = null;
        this.$rootPath = '/';
        this.hasRenderComponentList = [];
        this.needRedirectPath = null;
        this.$vm = null;
        this.watcher = null;
        this.renderRouteList = [];
    }
    /**
     * bootstrap and init watch $esRouteParmasObject in InDiv
     *
     * @param {IInDiv} vm
     * @returns {void}
     * @memberof Router
     */
    Router.prototype.bootstrap = function (vm) {
        var _this = this;
        this.$vm = vm;
        this.$vm.setRootPath(this.$rootPath);
        this.$vm.$canRenderModule = false;
        this.$vm.$routeDOMKey = 'router-render';
        if (!utils$$1.isBrowser())
            return;
        window.addEventListener('load', this.refresh.bind(this), false);
        window.addEventListener('popstate', function () {
            var path;
            if (_this.$rootPath === '/') {
                path = location.pathname || '/';
            }
            else {
                path = location.pathname.replace(_this.$rootPath, '') === '' ? '/' : location.pathname.replace(_this.$rootPath, '');
            }
            _this.$vm.$esRouteObject = {
                path: path,
                query: {},
                data: null,
            };
            _this.$vm.$esRouteParmasObject = {};
        }, false);
    };
    /**
     * set rootDom
     *
     * @param {TRouter[]} arr
     * @returns {void}
     * @memberof Router
     */
    Router.prototype.init = function (arr) {
        if (!utils$$1.isBrowser())
            return;
        if (arr && arr instanceof Array) {
            var rootDom = document.querySelector('#root');
            this.rootDom = rootDom || null;
            this.routes = arr;
            this.routesList = [];
        }
        else {
            throw new Error("route error: no routes exit");
        }
    };
    Router.prototype.setRootPath = function (rootPath) {
        if (rootPath && typeof rootPath === 'string') {
            this.$rootPath = rootPath;
        }
        else {
            throw new Error('route error: rootPath is not defined or rootPath must be a String');
        }
    };
    /**
     * redirectTo a path
     *
     * @param {string} redirectTo
     * @memberof Router
     */
    Router.prototype.redirectTo = function (redirectTo) {
        var rootPath = this.$rootPath === '/' ? '' : this.$rootPath;
        history.replaceState(null, null, "" + rootPath + redirectTo);
        this.$vm.$esRouteObject = {
            path: redirectTo || '/',
            query: {},
            data: null,
        };
        this.$vm.$esRouteParmasObject = {};
    };
    /**
     * refresh if not watch $esRouteObject
     *
     * @memberof Router
     */
    Router.prototype.refresh = function () {
        if (!this.$vm.$esRouteObject || !this.watcher) {
            var path = void 0;
            if (this.$rootPath === '/') {
                path = location.pathname || '/';
            }
            else {
                path = location.pathname.replace(this.$rootPath, '') === '' ? '/' : location.pathname.replace(this.$rootPath, '');
            }
            this.$vm.$esRouteObject = {
                path: path,
                query: {},
                data: null,
            };
            this.$vm.$esRouteParmasObject = {};
            this.watcher = new keyWatcher.default(this.$vm, '$esRouteObject', this.refresh.bind(this));
        }
        this.currentUrl = this.$vm.$esRouteObject.path || '/';
        this.routesList = [];
        this.renderRouteList = this.currentUrl === '/' ? ['/'] : this.currentUrl.split('/');
        this.renderRouteList[0] = '/';
        this.distributeRoutes();
    };
    /**
     * distribute routes and decide insert or general Routes
     *
     * @returns {Promise<any>}
     * @memberof Router
     */
    Router.prototype.distributeRoutes = function () {
        return tslib_1.__awaiter(this, void 0, Promise, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.lastRoute && this.lastRoute !== this.currentUrl)) return [3 /*break*/, 2];
                        // has rendered
                        this.$vm.$esRouteParmasObject = {};
                        return [4 /*yield*/, this.insertRenderRoutes()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: 
                    // first render
                    return [4 /*yield*/, this.generalDistributeRoutes()];
                    case 3:
                        // first render
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (this.routeChange)
                            this.routeChange(this.lastRoute, this.currentUrl);
                        this.lastRoute = this.currentUrl;
                        if (this.needRedirectPath) {
                            this.redirectTo(this.needRedirectPath);
                            this.needRedirectPath = null;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * insert Routes and render
     *
     * if has rendered Routes, it will find which is different and render it
     *
     * @returns {Promise<IComponent>}
     * @memberof Router
     */
    Router.prototype.insertRenderRoutes = function () {
        return tslib_1.__awaiter(this, void 0, Promise, function () {
            var lastRouteList, _loop_1, this_1, index, state_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lastRouteList = this.lastRoute === '/' ? ['/'] : this.lastRoute.split('/');
                        lastRouteList[0] = '/';
                        _loop_1 = function (index) {
                            var path, rootRoute, lastRoute, route, needRenderRoute_1, needRenderComponent, renderDom, key, component, needRenderRoute, key, renderDom, needRenderRoute;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        path = this_1.renderRouteList[index];
                                        if (index === 0) {
                                            rootRoute = this_1.routes.find(function (route) { return route.path === "" + path || /^\/\:.+/.test(route.path); });
                                            if (!rootRoute)
                                                throw new Error("route error: wrong route instantiation in insertRenderRoutes: " + this_1.currentUrl);
                                            this_1.routesList.push(rootRoute);
                                        }
                                        else {
                                            lastRoute = this_1.routesList[index - 1].children;
                                            if (!lastRoute || !(lastRoute instanceof Array))
                                                throw new Error('route error: routes not exit or routes must be an array!');
                                            route = lastRoute.find(function (r) { return r.path === "/" + path || /^\/\:.+/.test(r.path); });
                                            if (!route)
                                                throw new Error("route error: wrong route instantiation: " + this_1.currentUrl);
                                            this_1.routesList.push(route);
                                        }
                                        if (!(path !== lastRouteList[index])) return [3 /*break*/, 3];
                                        needRenderRoute_1 = this_1.routesList[index];
                                        if (!needRenderRoute_1)
                                            throw new Error("route error: wrong route instantiation in insertRenderRoutes: " + this_1.currentUrl);
                                        needRenderComponent = this_1.$vm.$components.find(function (component) { return component.$selector === needRenderRoute_1.component; });
                                        renderDom = document.querySelectorAll('router-render')[index - 1];
                                        if (!needRenderRoute_1.component && !needRenderRoute_1.redirectTo)
                                            throw new Error("route error: path " + needRenderRoute_1.path + " need a component which has children path or need a  redirectTo which has't children path");
                                        if (/^\/\:.+/.test(needRenderRoute_1.path) && !needRenderRoute_1.redirectTo) {
                                            key = needRenderRoute_1.path.split('/:')[1];
                                            this_1.$vm.$esRouteParmasObject[key] = path;
                                        }
                                        if (!needRenderComponent) return [3 /*break*/, 2];
                                        return [4 /*yield*/, this_1.instantiateComponent(needRenderComponent, renderDom)];
                                    case 1:
                                        component = _a.sent();
                                        // insert needRenderComponent on index in this.hasRenderComponentList
                                        // and remove other component which index >= index of needRenderComponent
                                        if (component) {
                                            if (this_1.hasRenderComponentList[index])
                                                this_1.hasRenderComponentList.splice(index, 0, component);
                                            if (!this_1.hasRenderComponentList[index])
                                                this_1.hasRenderComponentList[index] = component;
                                        }
                                        else {
                                            throw new Error("route error: path " + needRenderRoute_1.path + " need a component");
                                        }
                                        this_1.routerChangeEvent(index);
                                        _a.label = 2;
                                    case 2:
                                        if (needRenderRoute_1.redirectTo && /^\/.*/.test(needRenderRoute_1.redirectTo) && (index + 1) === this_1.renderRouteList.length) {
                                            this_1.needRedirectPath = needRenderRoute_1.redirectTo;
                                            return [2 /*return*/, { value: void 0 }];
                                        }
                                        _a.label = 3;
                                    case 3:
                                        // add parmas in $esRouteParmasObject
                                        if (path === lastRouteList[index]) {
                                            needRenderRoute = this_1.routesList[index];
                                            if (/^\/\:.+/.test(needRenderRoute.path) && !needRenderRoute.redirectTo) {
                                                key = needRenderRoute.path.split('/:')[1];
                                                this_1.$vm.$esRouteParmasObject[key] = path;
                                            }
                                        }
                                        if (index === (this_1.renderRouteList.length - 1) && index < (lastRouteList.length - 1)) {
                                            renderDom = document.querySelectorAll('router-render')[index];
                                            this_1.routerChangeEvent(index);
                                            if (renderDom && renderDom.hasChildNodes())
                                                renderDom.removeChild(renderDom.childNodes[0]);
                                            needRenderRoute = this_1.routesList[index];
                                            if (needRenderRoute.redirectTo && /^\/.*/.test(needRenderRoute.redirectTo) && (index + 1) === this_1.renderRouteList.length) {
                                                this_1.needRedirectPath = needRenderRoute.redirectTo;
                                                return [2 /*return*/, { value: void 0 }];
                                            }
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        index = 0;
                        _a.label = 1;
                    case 1:
                        if (!(index < this.renderRouteList.length)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_1(index)];
                    case 2:
                        state_1 = _a.sent();
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                        _a.label = 3;
                    case 3:
                        index++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * render Routes
     *
     * first render
     *
     * @returns {Promise<IComponent>}
     * @memberof Router
     */
    Router.prototype.generalDistributeRoutes = function () {
        return tslib_1.__awaiter(this, void 0, Promise, function () {
            var _loop_2, this_2, index, state_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _loop_2 = function (index) {
                            var path, rootRoute_1, FindComponent, key, rootDom, component, lastRoute, route_1, FindComponent, key, renderDom, component;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        path = this_2.renderRouteList[index];
                                        if (!(index === 0)) return [3 /*break*/, 2];
                                        rootRoute_1 = this_2.routes.find(function (route) { return route.path === "" + path || /^\/\:.+/.test(route.path); });
                                        if (!rootRoute_1)
                                            throw new Error("route error: wrong route instantiation in generalDistributeRoutes: " + this_2.currentUrl);
                                        FindComponent = null;
                                        if (this_2.$vm.$rootModule.$components.find(function (component) { return component.$selector === rootRoute_1.component; })) {
                                            FindComponent = this_2.$vm.$rootModule.$components.find(function (component) { return component.$selector === rootRoute_1.component; });
                                        }
                                        else {
                                            throw new Error("route error: path " + rootRoute_1.path + " is undefined");
                                        }
                                        if (/^\/\:.+/.test(rootRoute_1.path)) {
                                            key = rootRoute_1.path.split('/:')[1];
                                            this_2.$vm.$esRouteParmasObject[key] = path;
                                        }
                                        if (!utils$$1.isBrowser())
                                            return [2 /*return*/, { value: void 0 }];
                                        rootDom = document.querySelector('#root');
                                        this_2.routesList.push(rootRoute_1);
                                        return [4 /*yield*/, this_2.instantiateComponent(FindComponent, rootDom)];
                                    case 1:
                                        component = _a.sent();
                                        // 因为没有 所有要push进去
                                        if (component)
                                            this_2.hasRenderComponentList.push(component);
                                        if (index === this_2.renderRouteList.length - 1)
                                            this_2.routerChangeEvent(index);
                                        if (rootRoute_1.redirectTo && /^\/.*/.test(rootRoute_1.redirectTo) && (index + 1) === this_2.renderRouteList.length) {
                                            this_2.needRedirectPath = rootRoute_1.redirectTo;
                                            this_2.renderRouteList.push(rootRoute_1.redirectTo);
                                            return [2 /*return*/, { value: void 0 }];
                                        }
                                        return [3 /*break*/, 5];
                                    case 2:
                                        lastRoute = this_2.routesList[index - 1].children;
                                        if (!lastRoute || !(lastRoute instanceof Array))
                                            throw new Error('route error: routes not exit or routes must be an array!');
                                        route_1 = lastRoute.find(function (r) { return r.path === "/" + path || /^\/\:.+/.test(r.path); });
                                        if (!route_1)
                                            throw new Error("route error: wrong route instantiation: " + this_2.currentUrl);
                                        FindComponent = null;
                                        if (this_2.$vm.$rootModule.$components.find(function (component) { return component.$selector === route_1.component; })) {
                                            FindComponent = this_2.$vm.$rootModule.$components.find(function (component) { return component.$selector === route_1.component; });
                                        }
                                        if (!route_1.component && !route_1.redirectTo)
                                            throw new Error("route error: path " + route_1.path + " need a component which has children path or need a  redirectTo which has't children path");
                                        if (/^\/\:.+/.test(route_1.path)) {
                                            key = route_1.path.split('/:')[1];
                                            this_2.$vm.$esRouteParmasObject[key] = path;
                                        }
                                        renderDom = document.querySelectorAll('router-render')[index - 1];
                                        this_2.routesList.push(route_1);
                                        if (!FindComponent) return [3 /*break*/, 4];
                                        return [4 /*yield*/, this_2.instantiateComponent(FindComponent, renderDom)];
                                    case 3:
                                        component = _a.sent();
                                        if (component)
                                            this_2.hasRenderComponentList.push(component);
                                        _a.label = 4;
                                    case 4:
                                        if (index === this_2.renderRouteList.length - 1)
                                            this_2.routerChangeEvent(index);
                                        if (route_1.redirectTo && /^\/.*/.test(route_1.redirectTo) && (index + 1) === this_2.renderRouteList.length) {
                                            this_2.needRedirectPath = route_1.redirectTo;
                                            return [2 /*return*/, { value: void 0 }];
                                        }
                                        _a.label = 5;
                                    case 5: return [2 /*return*/];
                                }
                            });
                        };
                        this_2 = this;
                        index = 0;
                        _a.label = 1;
                    case 1:
                        if (!(index < this.renderRouteList.length)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_2(index)];
                    case 2:
                        state_2 = _a.sent();
                        if (typeof state_2 === "object")
                            return [2 /*return*/, state_2.value];
                        _a.label = 3;
                    case 3:
                        index++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * emit nvRouteChange and nvOnDestory for Components
     *
     * @param {number} index
     * @memberof Router
     */
    Router.prototype.routerChangeEvent = function (index) {
        var _this = this;
        this.hasRenderComponentList.forEach(function (component, i) {
            if (component.nvRouteChange)
                component.nvRouteChange(_this.lastRoute, _this.currentUrl);
            _this.emitComponentEvent(component.$componentList, 'nvRouteChange');
            if (i >= index + 1) {
                if (component.nvOnDestory)
                    component.nvOnDestory();
                _this.emitComponentEvent(component.$componentList, 'nvOnDestory');
            }
        });
        this.hasRenderComponentList.length = index + 1;
    };
    /**
     * emit nvRouteChange and nvOnDestory for Components with recursion
     *
     * @param {ComponentList<IComponent>[]} componentList
     * @param {string} event
     * @memberof Router
     */
    Router.prototype.emitComponentEvent = function (componentList, event) {
        var _this = this;
        if (event === 'nvRouteChange') {
            componentList.forEach(function (component) {
                if (component.scope.nvRouteChange)
                    component.scope.nvRouteChange(_this.lastRoute, _this.currentUrl);
                _this.emitComponentEvent(component.scope.$componentList, event);
            });
        }
        if (event === 'nvOnDestory') {
            componentList.forEach(function (component) {
                if (component.scope.nvOnDestory)
                    component.scope.nvOnDestory();
                _this.emitComponentEvent(component.scope.$componentList, event);
            });
        }
    };
    /**
     * instantiate Component
     *
     * use InDiv renderComponent
     *
     * @param {Function} FindComponent
     * @param {Element} renderDom
     * @returns {Promise<IComponent>}
     * @memberof Router
     */
    Router.prototype.instantiateComponent = function (FindComponent, renderDom) {
        return this.$vm.renderComponent(FindComponent, renderDom);
    };
    return Router;
}());
exports.Router = Router;
/**
 * getLocation in @Component or @Directive
 *
 * get $esRouteObject and $esRouteParmasObject in InDiv
 *
 * @export
 * @returns {{
 *   path?: string;
 *   query?: any;
 *   params?: any;
 *   data?: any;
 * }}
 */
function getLocation() {
    if (!utils$$1.isBrowser())
        return {};
    return {
        path: this.$vm.$esRouteObject.path,
        query: this.$vm.$esRouteObject.query,
        params: this.$vm.$esRouteParmasObject,
        data: this.$vm.$esRouteObject.data,
    };
}
exports.getLocation = getLocation;
/**
 * setLocation in @Component or @Directive
 *
 * set $esRouteObject in InDiv
 *
 * @export
 * @param {string} path
 * @param {*} [query]
 * @param {*} [data]
 * @param {string} [title]
 * @returns {void}
 */
function setLocation(path, query, data, title) {
    if (!utils$$1.isBrowser())
        return;
    var rootPath = this.$vm.$rootPath === '/' ? '' : this.$vm.$rootPath;
    history.pushState({ path: path, query: query, data: data }, title, "" + rootPath + path + utils$$1.buildQuery(query));
    this.$vm.$esRouteObject = { path: path, query: query, data: data };
}
exports.setLocation = setLocation;

});

unwrapExports(router$2);
var router_1 = router$2.TRouter;
var router_2 = router$2.Router;
var router_3 = router$2.getLocation;
var router_4 = router$2.setLocation;

var injectable = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Decorator @Injectable
 *
 * to decorate an InDiv Service
 *
 * @param {TInjectableOptions} [options]
 * @returns {(_constructor: Function) => void}
 */
function Injectable(options) {
    return function (_constructor) {
        _constructor.isSingletonMode = true;
        if (options)
            _constructor.isSingletonMode = options.isSingletonMode;
    };
}
exports.default = Injectable;

});

unwrapExports(injectable);

var injected = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Decorator @Injected
 * declare Class which need be injected
 *
 * @export
 * @param {Function} _constructor
 */
function Injected(_constructor) {
    // through Reflect to get params types
    var paramsTypes = Reflect.getMetadata('design:paramtypes', _constructor);
    if (paramsTypes && paramsTypes.length) {
        paramsTypes.forEach(function (v) {
            if (v === _constructor) {
                throw new Error('不可以依赖自身');
            }
            else {
                if (_constructor._needInjectedClass) {
                    _constructor._needInjectedClass.push(v);
                }
                else {
                    _constructor._needInjectedClass = [v];
                }
            }
        });
    }
}
exports.default = Injected;

});

unwrapExports(injected);

var factoryCreator_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * injector: build arguments for factoryCreator
 *
 * 1. provider Component's providers
 * 2. provider rootModule's providers
 *
 * first: check _constructor has Component providers or not
 * secend: find service is a singleton service or not
 * third: if service is a singleton service, find in rootModule's $providerInstances. If not use factoryCreator instance and return
 * last: if service is a singleton service, and can't be found in rootModule's $providerInstances, then factoryCreator instance and push in rootModule's $providerInstances
 *
 * @export
 * @param {Function} _constructor
 * @param {*} rootModule
 * @returns {any[]}
 */
function injector(_constructor, rootModule) {
    var args = [];
    // for ts Dependency Injection
    if (_constructor._needInjectedClass) {
        _constructor._needInjectedClass.forEach(function (key) {
            // component injector: find service Class in providerList in Component
            if (_constructor.prototype.$providerList) {
                var _componentService = _constructor.prototype.$providerList.get(key);
                if (_componentService && !_componentService.useClass && !_componentService.useValue)
                    return args.push(factoryCreator(_componentService, rootModule));
                if (_componentService && _componentService.useClass)
                    return args.push(factoryCreator(_componentService.useClass, rootModule));
                if (_componentService && _componentService.useValue)
                    return args.push(_componentService.useValue);
            }
            // root injector: find service Class in _injectedProviders in rootModule
            var _service = _constructor._injectedProviders.has(key) ? _constructor._injectedProviders.get(key) : rootModule.$providers.find(function (service) {
                if (!service.provide && service === key)
                    return true;
                if (service.provide && service.provide === key)
                    return true;
                return false;
            });
            var findService = null;
            if (_service && !_service.useClass && !_service.useValue)
                findService = _service;
            if (_service && _service.useClass)
                findService = _service.useClass;
            if (_service && _service.useValue)
                return args.push(_service.useValue);
            if (!findService)
                throw new Error("injector injects service error: can't find provide: " + key.name + " in Component " + _constructor);
            // if service isn't a singleton service
            if (findService && !findService.isSingletonMode)
                args.push(factoryCreator(findService, rootModule));
            // if service is a singleton service
            if (findService && findService.isSingletonMode) {
                // if root injector: $providerInstances has this key
                var findServiceInStance = rootModule.$providerInstances.has(key) ? rootModule.$providerInstances.get(key) : null;
                if (findServiceInStance)
                    args.push(findServiceInStance);
                if (!findServiceInStance) {
                    var serviceInStance = factoryCreator(findService, rootModule);
                    rootModule.$providerInstances.set(key, serviceInStance);
                    args.push(serviceInStance);
                }
            }
        });
    }
    // for js Dependency Injection
    if (_constructor.injectTokens) {
        _constructor.injectTokens.forEach(function (key) {
            // component injector: find service Class in providerList in Component
            if (_constructor.prototype.$providerList) {
                var _componentService = _constructor.prototype.$providerList.get(key);
                if (_componentService && !_componentService.useClass && !_componentService.useValue)
                    throw new Error("injector injects service error: can't find provide: " + key + " in Component " + _constructor);
                if (_componentService && _componentService.useClass)
                    return args.push(factoryCreator(_componentService.useClass, rootModule));
                if (_componentService && _componentService.useValue)
                    return args.push(_componentService.useValue);
            }
            // root injector: find service Class in _injectedProviders in rootModule
            var _service = _constructor._injectedProviders.has(key) ? _constructor._injectedProviders.get(key) : rootModule.$providers.find(function (service) {
                if (service.provide && service.provide === key)
                    return true;
                return false;
            });
            var findService = null;
            if (_service && !_service.useClass && !_service.useValue)
                throw new Error("injector injects service error: can't find provide: " + key + " in Component " + _constructor);
            if (_service && _service.useClass)
                findService = _service.useClass;
            if (_service && _service.useValue)
                return args.push(_service.useValue);
            if (!findService)
                throw new Error("injector injects service error: can't find provide: " + key + " in Component " + _constructor);
            // if service isn't a singleton service
            if (findService && !findService.isSingletonMode)
                args.push(factoryCreator(findService, rootModule));
            // if service is a singleton service
            if (findService && findService.isSingletonMode) {
                var findServiceInStance = rootModule.$providerInstances.has(key) ? rootModule.$providerInstances.get(key) : null;
                if (findServiceInStance)
                    args.push(findServiceInStance);
                if (!findServiceInStance) {
                    var serviceInStance = factoryCreator(findService, rootModule);
                    rootModule.$providerInstances.set(key, serviceInStance);
                    args.push(serviceInStance);
                }
            }
        });
    }
    return args;
}
exports.injector = injector;
/**
 * create an instance with factory method
 *
 * @export
 * @param {Function} _constructor
 * @param {*} rootModule
 * @returns {*}
 */
function factoryCreator(_constructor, rootModule) {
    var args = injector(_constructor, rootModule);
    var factoryInstance = Reflect.construct(_constructor, args);
    return factoryInstance;
}
exports.factoryCreator = factoryCreator;

});

unwrapExports(factoryCreator_1);
var factoryCreator_2 = factoryCreator_1.injector;
var factoryCreator_3 = factoryCreator_1.factoryCreator;

var di = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

exports.Injectable = injectable.default;

exports.Injected = injected.default;

exports.injector = factoryCreator_1.injector;
exports.factoryCreator = factoryCreator_1.factoryCreator;

});

unwrapExports(di);
var di_1 = di.Injectable;
var di_2 = di.Injected;
var di_3 = di.injector;
var di_4 = di.factoryCreator;

var renderUtils = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


var utils$$1 = new utils.default();
/**
 * get props from value
 *
 * @param {any[]} valueList
 * @param {*} value
 * @returns {void}
 */
function getPropsValue(valueList, value) {
    var val = value;
    valueList.forEach(function (v, index) {
        if (index === 0)
            return;
        val = val[v];
    });
    return val;
}
exports.getPropsValue = getPropsValue;
/**
 * build Actions for Props in Component
 *
 * @template State
 * @template Props
 * @template Vm
 * @param {*} prop
 * @param {IComponent<State, Props, Vm>} vm
 * @returns {*}
 */
function buildProps(prop, vm) {
    if (utils$$1.isFunction(prop)) {
        return prop.bind(vm);
    }
    else {
        return prop;
    }
}
exports.buildProps = buildProps;
/**
 * build scope for Components in Component
 *
 * @template State
 * @template Props
 * @template Vm
 * @param {Function} ComponentClass
 * @param {*} props
 * @param {Element} dom
 * @param {IComponent<State, Props, Vm>} vm
 * @returns {IComponent<State, Props, Vm>}
 */
function buildScope(ComponentClass, props, dom, vm) {
    var _component = di.factoryCreator(ComponentClass, vm.$vm.$rootModule);
    _component.props = props;
    _component.renderDom = dom;
    _component.$components = vm.$components;
    _component.render = vm.$vm.render.bind(_component);
    _component.reRender = vm.$vm.reRender.bind(_component);
    return _component;
}
exports.buildScope = buildScope;

});

unwrapExports(renderUtils);
var renderUtils_1 = renderUtils.getPropsValue;
var renderUtils_2 = renderUtils.buildProps;
var renderUtils_3 = renderUtils.buildScope;

var componentRender = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



var utils$$1 = new utils.default();
/**
 * mountComponent for Components in Component
 *
 * @template State
 * @template Props
 * @template Vm
 * @param {Element} dom
 * @param {IComponent<State, Props, Vm>} vm
 */
function mountComponent(dom, vm) {
    var cacheStates = vm.$componentList.slice();
    componentsConstructor(dom, vm);
    var componentListLength = vm.$componentList.length;
    var _loop_1 = function (i) {
        var component = vm.$componentList[i];
        // find Component from cache
        var cacheComponentIndex = cacheStates.findIndex(function (cache) { return cache.dom === component.dom; });
        var cacheComponent = cacheStates[cacheComponentIndex];
        // clear cache and the rest need to be destoried
        if (cacheComponentIndex !== -1)
            cacheStates.splice(cacheComponentIndex, 1);
        if (cacheComponent) {
            component.scope = cacheComponent.scope;
            // old props: component.scope.props
            // new props: component.props
            if (!utils$$1.isEqual(component.scope.props, component.props)) {
                if (component.scope.nvReceiveProps)
                    component.scope.nvReceiveProps(component.props);
                component.scope.props = component.props;
            }
        }
        else {
            component.scope = renderUtils.buildScope(component.constructorFunction, component.props, component.dom, vm);
        }
        component.scope.$vm = vm.$vm;
        component.scope.$components = vm.$components;
        if (component.scope.nvOnInit && !cacheComponent)
            component.scope.nvOnInit();
        if (component.scope.watchData)
            component.scope.watchData();
        if (component.scope.nvBeforeMount)
            component.scope.nvBeforeMount();
    };
    for (var i = 0; i < componentListLength; i++) {
        _loop_1(i);
    }
    // the rest should use nvOnDestory
    var cacheStatesLength = cacheStates.length;
    for (var i = 0; i < cacheStatesLength; i++) {
        var cache = cacheStates[i];
        if (cache.scope.nvOnDestory)
            cache.scope.nvOnDestory();
    }
}
exports.mountComponent = mountComponent;
/**
 * construct Components in Component
 *
 * @template State
 * @template Props
 * @template Vm
 * @param {Element} dom
 * @param {IComponent<State, Props, Vm>} vm
 */
function componentsConstructor(dom, vm) {
    vm.$componentList = [];
    var routerRenderDom = dom.querySelectorAll(vm.$vm.$routeDOMKey)[0];
    vm.constructor._injectedComponents.forEach(function (value, key) {
        if (!vm.$components.find(function (component) { return component.$selector === key; }))
            vm.$components.push(value);
    });
    var componentsLength = vm.$components.length;
    var _loop_2 = function (i) {
        var name = (vm.$components[i]).$selector;
        var tags = dom.getElementsByTagName(name);
        Array.from(tags).forEach(function (node) {
            //  protect component in <router-render>
            if (routerRenderDom && routerRenderDom.contains(node))
                return;
            // protect Component in Component
            if (!node.isComponent)
                return;
            var nodeAttrs = node.attributes;
            var props = {};
            if (nodeAttrs) {
                var attrList = Array.from(nodeAttrs);
                var _propsKeys_1 = {};
                attrList.forEach(function (attr) {
                    if (/^\_prop\-(.+)/.test(attr.name)) {
                        _propsKeys_1[attr.name.replace('_prop-', '')] = JSON.parse(attr.value);
                        node.removeAttribute(attr.name);
                    }
                });
                attrList.forEach(function (attr) {
                    var attrName = attr.name;
                    if ((/^\_prop\-(.+)/.test(attrName)))
                        return;
                    var attrNameSplit = attrName.split('-');
                    if (attrNameSplit.length > 1) {
                        attrNameSplit.forEach(function (name, index) {
                            if (index === 0)
                                attrName = name;
                            if (index !== 0)
                                attrName += name.toLowerCase().replace(/( |^)[a-z]/g, function (L) { return L.toUpperCase(); });
                        });
                    }
                    var prop = /^\{(.+)\}$/.exec(attr.value);
                    if (prop) {
                        var valueList = prop[1].split('.');
                        var key = valueList[0];
                        var _prop = null;
                        if (/^(\$\.).*/g.test(prop[1])) {
                            _prop = vm.compileUtil._getVMVal(vm.state, prop[1]);
                            props[attrName] = renderUtils.buildProps(_prop, vm);
                            return;
                        }
                        if (/^(\@.).*\(.*\)$/g.test(prop[1])) {
                            var utilVm_1 = new compileUtils.CompileUtilForRepeat();
                            var fn = utilVm_1._getVMFunction(vm, prop[1]);
                            var args = prop[1].replace(/^(\@)/, '').match(/\((.*)\)/)[1].replace(/\s+/g, '').split(',');
                            var argsList_1 = [];
                            args.forEach(function (arg) {
                                if (arg === '')
                                    return false;
                                if (arg === '$element')
                                    return argsList_1.push(node);
                                if (arg === 'true' || arg === 'false')
                                    return argsList_1.push(arg === 'true');
                                if (/(\$\.).*/g.test(arg))
                                    return argsList_1.push(utilVm_1._getVMVal(vm.state, arg));
                                if (/\'.*\'/g.test(arg))
                                    return argsList_1.push(arg.match(/\'(.*)\'/)[1]);
                                if (!/\'.*\'/g.test(arg) && /^[0-9]*$/g.test(arg))
                                    return argsList_1.push(Number(arg));
                                if (node.repeatData) {
                                    // $index in this
                                    Object.keys(node.repeatData).forEach(function (data) {
                                        if (arg.indexOf(data) === 0 || arg.indexOf(data + ".") === 0)
                                            return argsList_1.push(utilVm_1._getValueByValue(node.repeatData[data], arg, data));
                                    });
                                }
                            });
                            var value = fn.apply(vm, argsList_1);
                            props[attrName] = value;
                            return;
                        }
                        if (/^(\@.).*[^\(.*\)]$/g.test(prop[1])) {
                            _prop = vm.compileUtil._getVMVal(vm, prop[1].replace(/^(\@)/, ''));
                            props[attrName] = renderUtils.buildProps(_prop, vm);
                            return;
                        }
                        if (_propsKeys_1.hasOwnProperty(key)) {
                            _prop = renderUtils.getPropsValue(valueList, _propsKeys_1[key]);
                            props[attrName] = renderUtils.buildProps(_prop, vm);
                            return;
                        }
                        if (node.repeatData && node.repeatData[key] !== null) {
                            _prop = vm.compileUtil._getValueByValue(node.repeatData[key], prop[1], key);
                            props[attrName] = renderUtils.buildProps(_prop, vm);
                            return;
                        }
                    }
                    // can't remove indiv_repeat_key
                    if (attr.name !== 'indiv_repeat_key')
                        node.removeAttribute(attrName);
                });
            }
            vm.$componentList.push({
                dom: node,
                props: props,
                scope: null,
                constructorFunction: vm.$components[i],
            });
            // after construct instance remove isComponent
            node.isComponent = false;
        });
    };
    for (var i = 0; i < componentsLength; i++) {
        _loop_2(i);
    }
}
exports.componentsConstructor = componentsConstructor;

});

unwrapExports(componentRender);
var componentRender_1 = componentRender.mountComponent;
var componentRender_2 = componentRender.componentsConstructor;

var render_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



/**
 * render function for Component
 *
 * @template State
 * @template Props
 * @template Vm
 * @returns {Promise<IComponent<State, Props, Vm>>}
 */
function render() {
    var _this = this;
    this.compileUtil = new compileUtils.CompileUtil();
    var dom = this.renderDom;
    return Promise.resolve()
        .then(function () {
        var compile$$1 = new compile.default(dom, _this);
        componentRender.mountComponent(dom, _this);
        var componentListLength = _this.$componentList.length;
        for (var i = 0; i < componentListLength; i++) {
            var component = _this.$componentList[i];
            if (component.scope.render)
                component.scope.render();
            if (component.scope.nvAfterMount)
                component.scope.nvAfterMount();
        }
        if (_this.nvHasRender)
            _this.nvHasRender();
        return _this;
    })
        .catch(function (e) {
        throw new Error("component " + _this.constructor.$selector + " render failed: " + e);
    });
}
exports.render = render;
/**
 * reRender function for Component
 *
 * @template State
 * @template Props
 * @template Vm
 * @returns {Promise<IComponent<State, Props, Vm>>}
 */
function reRender() {
    var _this = this;
    var dom = this.renderDom;
    return Promise.resolve()
        .then(function () {
        var compile$$1 = new compile.default(dom, _this);
        componentRender.mountComponent(dom, _this);
        var componentListLength = _this.$componentList.length;
        for (var i = 0; i < componentListLength; i++) {
            var component = _this.$componentList[i];
            if (component.scope.render)
                component.scope.reRender();
            if (component.scope.nvAfterMount)
                component.scope.nvAfterMount();
        }
        if (_this.nvHasRender)
            _this.nvHasRender();
        return _this;
    })
        .catch(function (e) {
        throw new Error("component " + _this.constructor.$selector + " render failed: " + e);
    });
}
exports.reRender = reRender;

});

unwrapExports(render_1);
var render_2 = render_1.render;
var render_3 = render_1.reRender;

var platformBrowser = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

exports.Compile = compile.default;

exports.CompileUtilForRepeat = compileUtils.CompileUtilForRepeat;
exports.CompileUtil = compileUtils.CompileUtil;

exports.Router = router$2.Router;
exports.TRouter = router$2.TRouter;
exports.setLocation = router$2.setLocation;
exports.getLocation = router$2.getLocation;

exports.render = render_1.render;
exports.reRender = render_1.reRender;

});

unwrapExports(platformBrowser);
var platformBrowser_1 = platformBrowser.Compile;
var platformBrowser_2 = platformBrowser.CompileUtilForRepeat;
var platformBrowser_3 = platformBrowser.CompileUtil;
var platformBrowser_4 = platformBrowser.Router;
var platformBrowser_5 = platformBrowser.TRouter;
var platformBrowser_6 = platformBrowser.setLocation;
var platformBrowser_7 = platformBrowser.getLocation;
var platformBrowser_8 = platformBrowser.render;
var platformBrowser_9 = platformBrowser.reRender;

var component$2 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


var utils$$1 = new utils.default();
/**
 * Decorator @Component
 *
 * to decorate an InDiv component
 * render function comes from InDiv instance, you can set it by youself
 *
 * @template State
 * @template Props
 * @template Vm
 * @param {TComponentOptions} options
 * @returns {(_constructor: Function) => void}
 */
function Component(options) {
    return function (_constructor) {
        _constructor.$selector = options.selector;
        _constructor._injectedComponents = new Map();
        var vm = _constructor.prototype;
        vm.$template = options.template;
        // component $providerList for injector
        if (options.providers && options.providers.length > 0) {
            vm.$providerList = new Map();
            var length = options.providers.length;
            for (var i = 0; i < length; i++) {
                var service = options.providers[i];
                if (service.provide) {
                    if (service.useClass || service.useValue)
                        vm.$providerList.set(service.provide, service);
                }
                else {
                    vm.$providerList.set(service, service);
                }
            }
        }
        vm.$components = [];
        vm.$componentList = [];
        vm.watchData = function () {
            if (this.state) {
                if (this.nvWatchState)
                    this.stateWatcher = new watcher.default(this.state, this.nvWatchState.bind(this), this.reRender.bind(this));
                if (!this.nvWatchState)
                    this.stateWatcher = new watcher.default(this.state, null, this.reRender.bind(this));
            }
        };
    };
}
exports.Component = Component;
function setState(newState) {
    if (newState && utils$$1.isFunction(newState)) {
        var _newState = newState();
        if (_newState && _newState instanceof Object) {
            if (utils$$1.isEqual(this.state, _newState))
                return;
            var _state = JSON.parse(JSON.stringify(this.state));
            Object.assign(_state, _newState);
            this.state = _state;
            if (this.nvWatchState)
                this.stateWatcher = new watcher.default(this.state, this.nvWatchState.bind(this), this.reRender.bind(this));
            if (!this.nvWatchState)
                this.stateWatcher = new watcher.default(this.state, null, this.reRender.bind(this));
            this.reRender();
        }
    }
    if (newState && newState instanceof Object) {
        if (utils$$1.isEqual(this.state, newState))
            return;
        var _state = JSON.parse(JSON.stringify(this.state));
        Object.assign(_state, newState);
        this.state = _state;
        if (this.nvWatchState)
            this.stateWatcher = new watcher.default(this.state, this.nvWatchState.bind(this), this.reRender.bind(this));
        if (!this.nvWatchState)
            this.stateWatcher = new watcher.default(this.state, null, this.reRender.bind(this));
        this.reRender();
    }
}
exports.setState = setState;

});

unwrapExports(component$2);
var component_1 = component$2.Component;
var component_2 = component$2.setState;

var nvModule$2 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * build provider list in module
 *
 * set Map $providerList in module
 *
 * @param {INvModule} moduleInstance
 * @returns {void}
 */
function buildProviderList(moduleInstance) {
    if (!moduleInstance.$providers)
        return;
    var length = moduleInstance.$providers.length;
    for (var i = 0; i < length; i++) {
        var service = moduleInstance.$providers[i];
        if (service.provide) {
            if (service.useClass || service.useValue)
                moduleInstance.$providerList.set(service.provide, service);
        }
        else {
            moduleInstance.$providerList.set(service, service);
        }
    }
}
/**
 * build provider list for services in module
 *
 * set Map $providerList in services
 *
 * @param {INvModule} moduleInstance
 * @returns {void}
 */
function buildProviders4Services(moduleInstance) {
    if (!moduleInstance.$providers)
        return;
    var length = moduleInstance.$providers.length;
    var _loop_1 = function (i) {
        var service = moduleInstance.$providers[i];
        if (service.provide) {
            if (service.useClass) {
                if (!service.useClass._injectedProviders)
                    service.useClass._injectedProviders = new Map();
                moduleInstance.$providerList.forEach(function (value, key) {
                    if (!service.useClass._injectedProviders.has(key))
                        service.useClass._injectedProviders.set(key, value);
                });
            }
        }
        else {
            if (!service._injectedProviders)
                service._injectedProviders = new Map();
            moduleInstance.$providerList.set(service, service);
        }
    };
    for (var i = 0; i < length; i++) {
        _loop_1(i);
    }
}
/**
 * build provider list for component in module
 *
 * set Map _injectedProviders in component
 *
 * @param {INvModule} moduleInstance
 * @returns {void}
 */
function buildProviders4Components(moduleInstance) {
    if (!moduleInstance.$providers || !moduleInstance.$components)
        return;
    var length = moduleInstance.$components.length;
    var _loop_2 = function (i) {
        var FindComponent = moduleInstance.$components[i];
        if (!FindComponent._injectedProviders)
            FindComponent._injectedProviders = new Map();
        moduleInstance.$providerList.forEach(function (value, key) {
            if (!FindComponent._injectedProviders.has(key))
                FindComponent._injectedProviders.set(key, value);
        });
    };
    for (var i = 0; i < length; i++) {
        _loop_2(i);
    }
}
/**
 * build provider list for component in module
 *
 * set Map _injectedComponents in component
 *
 * @param {INvModule} moduleInstance
 * @returns {void}
 */
function buildComponents4Components(moduleInstance) {
    if (!moduleInstance.$components)
        return;
    var length = moduleInstance.$components.length;
    var _loop_3 = function (i) {
        var FindComponent = moduleInstance.$components[i];
        if (!FindComponent._injectedComponents)
            FindComponent._injectedComponents = new Map();
        moduleInstance.$components.forEach(function (needInjectComponent) {
            if (!FindComponent._injectedComponents.has(needInjectComponent.$selector))
                FindComponent._injectedComponents.set(needInjectComponent.$selector, needInjectComponent);
        });
    };
    for (var i = 0; i < length; i++) {
        _loop_3(i);
    }
}
/**
 * build $imports for module
 *
 * @param {INvModule} moduleInstance
 * @returns {void}
 */
function buildImports(moduleInstance) {
    if (!moduleInstance.$imports)
        return;
    var length = moduleInstance.$imports.length;
    for (var i = 0; i < length; i++) {
        var ModuleImport = moduleInstance.$imports[i];
        var moduleImport = factoryModule(ModuleImport);
        var exportsLength = moduleImport.$exportsList.length;
        var _loop_4 = function (i_1) {
            var exportFromModule = moduleImport.$exportsList[i_1];
            if (!moduleInstance.$components.find(function (component) { return component.$selector === exportFromModule.$selector; }))
                moduleInstance.$components.push(exportFromModule);
        };
        for (var i_1 = 0; i_1 < exportsLength; i_1++) {
            _loop_4(i_1);
        }
    }
}
/**
 * build $exportsList for module
 *
 * @param {INvModule} moduleInstance
 * @returns {void}
 */
function buildExports(moduleInstance) {
    if (!moduleInstance.$exports)
        return;
    var length = moduleInstance.$exports.length;
    var _loop_5 = function (i) {
        var ModuleExport = moduleInstance.$exports[i];
        // 如果导出的是模块
        if (ModuleExport.nvType === 'nvModule') {
            var moduleInstanceOfExport = factoryModule(ModuleExport);
            // 被导出的模块中的导出
            var moduleInstanceOfExportLength = moduleInstanceOfExport.$exportsList.length;
            var _loop_6 = function (j) {
                var moduleExportFromModuleOfExport = moduleInstanceOfExport.$exportsList[j];
                if (!moduleInstance.$exportsList.find(function (component) { return component.$selector === moduleExportFromModuleOfExport.$selector; }))
                    moduleInstance.$exportsList.push(moduleExportFromModuleOfExport);
            };
            for (var j = 0; j < moduleInstanceOfExportLength; j++) {
                _loop_6(j);
            }
        }
        // 如果导出的是组件
        if (ModuleExport.nvType !== 'nvModule') {
            if (!moduleInstance.$exportsList.find(function (component) { return component.$selector === ModuleExport.$selector; }))
                moduleInstance.$exportsList.push(ModuleExport);
        }
    };
    for (var i = 0; i < length; i++) {
        _loop_5(i);
    }
}
/**
 * Decorator @NvModule
 *
 * to decorate an InDiv NvModule
 *
 * @export
 * @param {TNvModuleOptions} options
 * @returns {(_constructor: Function) => void}
 */
function NvModule(options) {
    return function (_constructor) {
        _constructor.nvType = 'nvModule';
        var vm = _constructor.prototype;
        vm.$providerList = new Map();
        vm.$providerInstances = new Map();
        if (options.imports)
            vm.$imports = options.imports;
        if (options.components)
            vm.$components = options.components;
        if (options.providers)
            vm.$providers = options.providers;
        if (options.exports) {
            vm.$exports = options.exports;
            vm.$exportsList = [];
        }
        if (options.bootstrap)
            vm.$bootstrap = options.bootstrap;
    };
}
exports.NvModule = NvModule;
/**
 * create an NvModule instance with factory method
 *
 * @export
 * @param {Function} NM
 * @returns {INvModule}
 */
function factoryModule(NM) {
    var moduleInstance = new NM();
    buildProviderList(moduleInstance);
    buildProviders4Services(moduleInstance);
    buildComponents4Components(moduleInstance);
    buildProviders4Components(moduleInstance);
    buildImports(moduleInstance);
    buildExports(moduleInstance);
    return moduleInstance;
}
exports.factoryModule = factoryModule;

});

unwrapExports(nvModule$2);
var nvModule_1 = nvModule$2.NvModule;
var nvModule_2 = nvModule$2.factoryModule;

var indiv$2 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




var utils$$1 = new utils.default();
/**
 * main: for new InDiv
 *
 * @class InDiv
 */
var InDiv = /** @class */ (function () {
    function InDiv() {
        this.modalList = [];
        if (!utils$$1.isBrowser())
            return;
        this.rootDom = document.querySelector('#root');
        this.$rootPath = '/';
        this.$canRenderModule = true;
        this.$routeDOMKey = 'router-render';
        this.$rootModule = null;
        this.$esRouteObject = null;
        this.$esRouteParmasObject = {};
        // render,reRender for Component
        // developer can use function use(modal: IMiddleware<InDiv>): number to change render and reRender
        this.render = platformBrowser.render;
        this.reRender = platformBrowser.reRender;
    }
    /**
     * for using middleware and use bootstrap method of middleware
     *
     * @param {IMiddleware<InDiv>} modal
     * @returns {number}
     * @memberof InDiv
     */
    InDiv.prototype.use = function (modal) {
        modal.bootstrap(this);
        this.modalList.push(modal);
        return this.modalList.findIndex(function (md) { return utils$$1.isEqual(md, modal); });
    };
    /**
     * for Middleware set RootPath
     *
     * if not use, rootPath will be <router-render />
     *
     * @param {string} rootPath
     * @memberof InDiv
     */
    InDiv.prototype.setRootPath = function (rootPath) {
        if (rootPath && typeof rootPath === 'string') {
            this.$rootPath = rootPath;
        }
        else {
            throw new Error('rootPath is not defined or rootPath must be a String');
        }
    };
    /**
     * for Middleware set component Render function
     *
     * @template R
     * @template Re
     * @param {R} [render]
     * @param {Re} [reRender]
     * @memberof InDiv
     */
    InDiv.prototype.setComponentRender = function (render, reRender) {
        this.render = render;
        this.reRender = reRender;
    };
    /**
     * bootstrap NvModule
     *
     * if not use Route it will be used
     *
     * @param {Function} Esmodule
     * @returns {void}
     * @memberof InDiv
     */
    InDiv.prototype.bootstrapModule = function (Esmodule) {
        if (!Esmodule)
            throw new Error('must send a root module');
        this.$rootModule = nvModule$2.factoryModule(Esmodule);
        this.$components = this.$rootModule.$components.slice();
    };
    /**
     * init InDiv and renderModuleBootstrap()
     *
     * @returns {void}
     * @memberof InDiv
     */
    InDiv.prototype.init = function () {
        if (!utils$$1.isBrowser())
            return;
        if (!this.$rootModule)
            throw new Error('must use bootstrapModule to declare a root NvModule before init');
        if (this.$canRenderModule)
            this.renderModuleBootstrap();
    };
    /**
     * render NvModule Bootstrap
     *
     * @returns {void}
     * @memberof InDiv
     */
    InDiv.prototype.renderModuleBootstrap = function () {
        if (!this.$rootModule.$bootstrap)
            throw new Error('need bootstrap for render Module Bootstrap');
        var BootstrapComponent = this.$rootModule.$bootstrap;
        this.renderComponent(BootstrapComponent, this.rootDom);
    };
    /**
     * expose function for render Component
     *
     * @param {Function} BootstrapComponent
     * @param {Element} renderDOM
     * @returns {Promise<IComponent>}
     * @memberof InDiv
     */
    InDiv.prototype.renderComponent = function (BootstrapComponent, renderDOM) {
        var component = di.factoryCreator(BootstrapComponent, this.$rootModule);
        component.$vm = this;
        component.$components = this.$rootModule.$components;
        component.render = this.render.bind(component);
        component.reRender = this.reRender.bind(component);
        if (component.nvOnInit)
            component.nvOnInit();
        if (component.watchData)
            component.watchData();
        if (!component.$template)
            throw new Error('must decaler this.$template in bootstrap()');
        var template = component.$template;
        if (template && typeof template === 'string' && renderDOM) {
            if (component.nvBeforeMount)
                component.nvBeforeMount();
            return this.replaceDom(component, renderDOM)
                .then(function (_component) {
                if (_component.nvAfterMount)
                    _component.nvAfterMount();
                return _component;
            });
        }
        else {
            throw new Error('renderBootstrap failed: template or rootDom is not exit');
        }
    };
    /**
     * render adn replace DOM
     *
     * @param {IComponent} component
     * @param {Element} renderDOM
     * @returns {Promise<IComponent>}
     * @memberof InDiv
     */
    InDiv.prototype.replaceDom = function (component, renderDOM) {
        component.renderDom = renderDOM;
        return component.render();
    };
    return InDiv;
}());
exports.default = InDiv;

});

unwrapExports(indiv$2);

var http = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

var NVHttp = /** @class */ (function () {
    function NVHttp() {
    }
    NVHttp.prototype.get = function (url, params) {
        return new Promise(function (resolve, reject) {
            var pms = params ? { params: params } : null;
            axios.default.get(url, pms)
                .then(function (res) {
                resolve(res.data);
            })
                .catch(function (e) {
                reject(e.response.data);
            });
        });
    };
    NVHttp.prototype.delete = function (url, params) {
        return new Promise(function (resolve, reject) {
            var pms = params ? { params: params } : null;
            axios.default.delete(url, pms)
                .then(function (res) {
                resolve(res.data);
            })
                .catch(function (e) {
                reject(e.response.data);
            });
        });
    };
    NVHttp.prototype.post = function (url, params) {
        return new Promise(function (resolve, reject) {
            axios.default.post(url, params)
                .then(function (res) {
                resolve(res.data);
            })
                .catch(function (e) {
                reject(e.response.data);
            });
        });
    };
    NVHttp.prototype.put = function (url, params) {
        return new Promise(function (resolve, reject) {
            axios.default.put(url, params)
                .then(function (res) {
                resolve(res.data);
            })
                .catch(function (e) {
                reject(e.response.data);
            });
        });
    };
    NVHttp.prototype.patch = function (url, params) {
        return new Promise(function (resolve, reject) {
            axios.default.patch(url, params)
                .then(function (res) {
                resolve(res.data);
            })
                .catch(function (e) {
                reject(e.response.data);
            });
        });
    };
    return NVHttp;
}());
exports.default = NVHttp;

});

unwrapExports(http);

var src = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });











exports.Utils = utils.default;

exports.OnInit = lifecycle.OnInit;
exports.BeforeMount = lifecycle.BeforeMount;
exports.AfterMount = lifecycle.AfterMount;
exports.OnDestory = lifecycle.OnDestory;
exports.HasRender = lifecycle.HasRender;
exports.WatchState = lifecycle.WatchState;
exports.RouteChange = lifecycle.RouteChange;
exports.ReceiveProps = lifecycle.ReceiveProps;
exports.SetState = lifecycle.SetState;
exports.SetLocation = lifecycle.SetLocation;
exports.GetLocation = lifecycle.GetLocation;

exports.Watcher = watcher.default;

exports.KeyWatcher = keyWatcher.default;

exports.Compile = platformBrowser.Compile;
exports.CompileUtil = platformBrowser.CompileUtil;
exports.CompileUtilForRepeat = platformBrowser.CompileUtilForRepeat;
exports.Router = platformBrowser.Router;
exports.TRouter = platformBrowser.TRouter;
exports.setLocation = platformBrowser.setLocation;
exports.getLocation = platformBrowser.getLocation;

exports.Component = component$2.Component;
exports.setState = component$2.setState;

exports.InDiv = indiv$2.default;

exports.NvModule = nvModule$2.NvModule;
exports.factoryModule = nvModule$2.factoryModule;

exports.NVHttp = http.default;

exports.Injectable = di.Injectable;
exports.Injected = di.Injected;
exports.injector = di.injector;
exports.factoryCreator = di.factoryCreator;

});

var index$g = unwrapExports(src);
var src_1 = src.Utils;
var src_2 = src.OnInit;
var src_3 = src.BeforeMount;
var src_4 = src.AfterMount;
var src_5 = src.OnDestory;
var src_6 = src.HasRender;
var src_7 = src.WatchState;
var src_8 = src.RouteChange;
var src_9 = src.ReceiveProps;
var src_10 = src.SetState;
var src_11 = src.SetLocation;
var src_12 = src.GetLocation;
var src_13 = src.Watcher;
var src_14 = src.KeyWatcher;
var src_15 = src.Compile;
var src_16 = src.CompileUtil;
var src_17 = src.CompileUtilForRepeat;
var src_18 = src.Router;
var src_19 = src.TRouter;
var src_20 = src.setLocation;
var src_21 = src.getLocation;
var src_22 = src.Component;
var src_23 = src.setState;
var src_24 = src.InDiv;
var src_25 = src.NvModule;
var src_26 = src.factoryModule;
var src_27 = src.NVHttp;
var src_28 = src.Injectable;
var src_29 = src.Injected;
var src_30 = src.injector;
var src_31 = src.factoryCreator;

exports.default = index$g;
exports.Utils = src_1;
exports.OnInit = src_2;
exports.BeforeMount = src_3;
exports.AfterMount = src_4;
exports.OnDestory = src_5;
exports.HasRender = src_6;
exports.WatchState = src_7;
exports.RouteChange = src_8;
exports.ReceiveProps = src_9;
exports.SetState = src_10;
exports.SetLocation = src_11;
exports.GetLocation = src_12;
exports.Watcher = src_13;
exports.KeyWatcher = src_14;
exports.Compile = src_15;
exports.CompileUtil = src_16;
exports.CompileUtilForRepeat = src_17;
exports.Router = src_18;
exports.TRouter = src_19;
exports.setLocation = src_20;
exports.getLocation = src_21;
exports.Component = src_22;
exports.setState = src_23;
exports.InDiv = src_24;
exports.NvModule = src_25;
exports.factoryModule = src_26;
exports.NVHttp = src_27;
exports.Injectable = src_28;
exports.Injected = src_29;
exports.injector = src_30;
exports.factoryCreator = src_31;
