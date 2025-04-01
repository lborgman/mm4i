var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from2, except, desc) => {
  if (from2 && typeof from2 === "object" || typeof from2 === "function") {
    for (let key of __getOwnPropNames(from2))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from2[key], enumerable: !(desc = __getOwnPropDesc(from2, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/dexie/dist/dexie.js
var require_dexie = __commonJS({
  "node_modules/dexie/dist/dexie.js"(exports, module) {
    (function(global2, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, global2.Dexie = factory());
    })(exports, function() {
      "use strict";
      var extendStatics2 = function(d, b) {
        extendStatics2 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics2(d, b);
      };
      function __extends2(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics2(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      }
      var __assign = function() {
        __assign = Object.assign || function __assign2(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
        };
        return __assign.apply(this, arguments);
      };
      function __spreadArray2(to, from2, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from2.length, ar; i < l; i++) {
          if (ar || !(i in from2)) {
            if (!ar) ar = Array.prototype.slice.call(from2, 0, i);
            ar[i] = from2[i];
          }
        }
        return to.concat(ar || Array.prototype.slice.call(from2));
      }
      var _global = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
      var keys = Object.keys;
      var isArray4 = Array.isArray;
      if (typeof Promise !== "undefined" && !_global.Promise) {
        _global.Promise = Promise;
      }
      function extend(obj, extension) {
        if (typeof extension !== "object")
          return obj;
        keys(extension).forEach(function(key) {
          obj[key] = extension[key];
        });
        return obj;
      }
      var getProto = Object.getPrototypeOf;
      var _hasOwn = {}.hasOwnProperty;
      function hasOwn(obj, prop) {
        return _hasOwn.call(obj, prop);
      }
      function props(proto, extension) {
        if (typeof extension === "function")
          extension = extension(getProto(proto));
        (typeof Reflect === "undefined" ? keys : Reflect.ownKeys)(extension).forEach(function(key) {
          setProp(proto, key, extension[key]);
        });
      }
      var defineProperty = Object.defineProperty;
      function setProp(obj, prop, functionOrGetSet, options) {
        defineProperty(obj, prop, extend(functionOrGetSet && hasOwn(functionOrGetSet, "get") && typeof functionOrGetSet.get === "function" ? { get: functionOrGetSet.get, set: functionOrGetSet.set, configurable: true } : { value: functionOrGetSet, configurable: true, writable: true }, options));
      }
      function derive(Child) {
        return {
          from: function(Parent) {
            Child.prototype = Object.create(Parent.prototype);
            setProp(Child.prototype, "constructor", Child);
            return {
              extend: props.bind(null, Child.prototype)
            };
          }
        };
      }
      var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
      function getPropertyDescriptor(obj, prop) {
        var pd = getOwnPropertyDescriptor(obj, prop);
        var proto;
        return pd || (proto = getProto(obj)) && getPropertyDescriptor(proto, prop);
      }
      var _slice = [].slice;
      function slice(args, start, end) {
        return _slice.call(args, start, end);
      }
      function override(origFunc, overridedFactory) {
        return overridedFactory(origFunc);
      }
      function assert2(b) {
        if (!b)
          throw new Error("Assertion Failed");
      }
      function asap$1(fn) {
        if (_global.setImmediate)
          setImmediate(fn);
        else
          setTimeout(fn, 0);
      }
      function arrayToObject(array, extractor) {
        return array.reduce(function(result, item, i) {
          var nameAndValue = extractor(item, i);
          if (nameAndValue)
            result[nameAndValue[0]] = nameAndValue[1];
          return result;
        }, {});
      }
      function getByKeyPath(obj, keyPath) {
        if (typeof keyPath === "string" && hasOwn(obj, keyPath))
          return obj[keyPath];
        if (!keyPath)
          return obj;
        if (typeof keyPath !== "string") {
          var rv = [];
          for (var i = 0, l = keyPath.length; i < l; ++i) {
            var val = getByKeyPath(obj, keyPath[i]);
            rv.push(val);
          }
          return rv;
        }
        var period = keyPath.indexOf(".");
        if (period !== -1) {
          var innerObj = obj[keyPath.substr(0, period)];
          return innerObj == null ? void 0 : getByKeyPath(innerObj, keyPath.substr(period + 1));
        }
        return void 0;
      }
      function setByKeyPath(obj, keyPath, value) {
        if (!obj || keyPath === void 0)
          return;
        if ("isFrozen" in Object && Object.isFrozen(obj))
          return;
        if (typeof keyPath !== "string" && "length" in keyPath) {
          assert2(typeof value !== "string" && "length" in value);
          for (var i = 0, l = keyPath.length; i < l; ++i) {
            setByKeyPath(obj, keyPath[i], value[i]);
          }
        } else {
          var period = keyPath.indexOf(".");
          if (period !== -1) {
            var currentKeyPath = keyPath.substr(0, period);
            var remainingKeyPath = keyPath.substr(period + 1);
            if (remainingKeyPath === "")
              if (value === void 0) {
                if (isArray4(obj) && !isNaN(parseInt(currentKeyPath)))
                  obj.splice(currentKeyPath, 1);
                else
                  delete obj[currentKeyPath];
              } else
                obj[currentKeyPath] = value;
            else {
              var innerObj = obj[currentKeyPath];
              if (!innerObj || !hasOwn(obj, currentKeyPath))
                innerObj = obj[currentKeyPath] = {};
              setByKeyPath(innerObj, remainingKeyPath, value);
            }
          } else {
            if (value === void 0) {
              if (isArray4(obj) && !isNaN(parseInt(keyPath)))
                obj.splice(keyPath, 1);
              else
                delete obj[keyPath];
            } else
              obj[keyPath] = value;
          }
        }
      }
      function delByKeyPath(obj, keyPath) {
        if (typeof keyPath === "string")
          setByKeyPath(obj, keyPath, void 0);
        else if ("length" in keyPath)
          [].map.call(keyPath, function(kp) {
            setByKeyPath(obj, kp, void 0);
          });
      }
      function shallowClone(obj) {
        var rv = {};
        for (var m in obj) {
          if (hasOwn(obj, m))
            rv[m] = obj[m];
        }
        return rv;
      }
      var concat3 = [].concat;
      function flatten2(a) {
        return concat3.apply([], a);
      }
      var intrinsicTypeNames = "BigUint64Array,BigInt64Array,Array,Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,FileSystemDirectoryHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat(flatten2([8, 16, 32, 64].map(function(num) {
        return ["Int", "Uint", "Float"].map(function(t) {
          return t + num + "Array";
        });
      }))).filter(function(t) {
        return _global[t];
      });
      var intrinsicTypes = new Set(intrinsicTypeNames.map(function(t) {
        return _global[t];
      }));
      function cloneSimpleObjectTree(o) {
        var rv = {};
        for (var k in o)
          if (hasOwn(o, k)) {
            var v = o[k];
            rv[k] = !v || typeof v !== "object" || intrinsicTypes.has(v.constructor) ? v : cloneSimpleObjectTree(v);
          }
        return rv;
      }
      function objectIsEmpty(o) {
        for (var k in o)
          if (hasOwn(o, k))
            return false;
        return true;
      }
      var circularRefs = null;
      function deepClone2(any) {
        circularRefs = /* @__PURE__ */ new WeakMap();
        var rv = innerDeepClone(any);
        circularRefs = null;
        return rv;
      }
      function innerDeepClone(x) {
        if (!x || typeof x !== "object")
          return x;
        var rv = circularRefs.get(x);
        if (rv)
          return rv;
        if (isArray4(x)) {
          rv = [];
          circularRefs.set(x, rv);
          for (var i = 0, l = x.length; i < l; ++i) {
            rv.push(innerDeepClone(x[i]));
          }
        } else if (intrinsicTypes.has(x.constructor)) {
          rv = x;
        } else {
          var proto = getProto(x);
          rv = proto === Object.prototype ? {} : Object.create(proto);
          circularRefs.set(x, rv);
          for (var prop in x) {
            if (hasOwn(x, prop)) {
              rv[prop] = innerDeepClone(x[prop]);
            }
          }
        }
        return rv;
      }
      var toString = {}.toString;
      function toStringTag(o) {
        return toString.call(o).slice(8, -1);
      }
      var iteratorSymbol = typeof Symbol !== "undefined" ? Symbol.iterator : "@@iterator";
      var getIteratorOf = typeof iteratorSymbol === "symbol" ? function(x) {
        var i;
        return x != null && (i = x[iteratorSymbol]) && i.apply(x);
      } : function() {
        return null;
      };
      function delArrayItem(a, x) {
        var i = a.indexOf(x);
        if (i >= 0)
          a.splice(i, 1);
        return i >= 0;
      }
      var NO_CHAR_ARRAY = {};
      function getArrayOf(arrayLike) {
        var i, a, x, it;
        if (arguments.length === 1) {
          if (isArray4(arrayLike))
            return arrayLike.slice();
          if (this === NO_CHAR_ARRAY && typeof arrayLike === "string")
            return [arrayLike];
          if (it = getIteratorOf(arrayLike)) {
            a = [];
            while (x = it.next(), !x.done)
              a.push(x.value);
            return a;
          }
          if (arrayLike == null)
            return [arrayLike];
          i = arrayLike.length;
          if (typeof i === "number") {
            a = new Array(i);
            while (i--)
              a[i] = arrayLike[i];
            return a;
          }
          return [arrayLike];
        }
        i = arguments.length;
        a = new Array(i);
        while (i--)
          a[i] = arguments[i];
        return a;
      }
      var isAsyncFunction = typeof Symbol !== "undefined" ? function(fn) {
        return fn[Symbol.toStringTag] === "AsyncFunction";
      } : function() {
        return false;
      };
      var dexieErrorNames = [
        "Modify",
        "Bulk",
        "OpenFailed",
        "VersionChange",
        "Schema",
        "Upgrade",
        "InvalidTable",
        "MissingAPI",
        "NoSuchDatabase",
        "InvalidArgument",
        "SubTransaction",
        "Unsupported",
        "Internal",
        "DatabaseClosed",
        "PrematureCommit",
        "ForeignAwait"
      ];
      var idbDomErrorNames = [
        "Unknown",
        "Constraint",
        "Data",
        "TransactionInactive",
        "ReadOnly",
        "Version",
        "NotFound",
        "InvalidState",
        "InvalidAccess",
        "Abort",
        "Timeout",
        "QuotaExceeded",
        "Syntax",
        "DataClone"
      ];
      var errorList = dexieErrorNames.concat(idbDomErrorNames);
      var defaultTexts = {
        VersionChanged: "Database version changed by other database connection",
        DatabaseClosed: "Database has been closed",
        Abort: "Transaction aborted",
        TransactionInactive: "Transaction has already completed or failed",
        MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb"
      };
      function DexieError(name, msg) {
        this.name = name;
        this.message = msg;
      }
      derive(DexieError).from(Error).extend({
        toString: function() {
          return this.name + ": " + this.message;
        }
      });
      function getMultiErrorMessage(msg, failures) {
        return msg + ". Errors: " + Object.keys(failures).map(function(key) {
          return failures[key].toString();
        }).filter(function(v, i, s) {
          return s.indexOf(v) === i;
        }).join("\n");
      }
      function ModifyError(msg, failures, successCount, failedKeys) {
        this.failures = failures;
        this.failedKeys = failedKeys;
        this.successCount = successCount;
        this.message = getMultiErrorMessage(msg, failures);
      }
      derive(ModifyError).from(DexieError);
      function BulkError(msg, failures) {
        this.name = "BulkError";
        this.failures = Object.keys(failures).map(function(pos) {
          return failures[pos];
        });
        this.failuresByPos = failures;
        this.message = getMultiErrorMessage(msg, this.failures);
      }
      derive(BulkError).from(DexieError);
      var errnames = errorList.reduce(function(obj, name) {
        return obj[name] = name + "Error", obj;
      }, {});
      var BaseException = DexieError;
      var exceptions = errorList.reduce(function(obj, name) {
        var fullName = name + "Error";
        function DexieError2(msgOrInner, inner) {
          this.name = fullName;
          if (!msgOrInner) {
            this.message = defaultTexts[name] || fullName;
            this.inner = null;
          } else if (typeof msgOrInner === "string") {
            this.message = "".concat(msgOrInner).concat(!inner ? "" : "\n " + inner);
            this.inner = inner || null;
          } else if (typeof msgOrInner === "object") {
            this.message = "".concat(msgOrInner.name, " ").concat(msgOrInner.message);
            this.inner = msgOrInner;
          }
        }
        derive(DexieError2).from(BaseException);
        obj[name] = DexieError2;
        return obj;
      }, {});
      exceptions.Syntax = SyntaxError;
      exceptions.Type = TypeError;
      exceptions.Range = RangeError;
      var exceptionMap = idbDomErrorNames.reduce(function(obj, name) {
        obj[name + "Error"] = exceptions[name];
        return obj;
      }, {});
      function mapError(domError, message) {
        if (!domError || domError instanceof DexieError || domError instanceof TypeError || domError instanceof SyntaxError || !domError.name || !exceptionMap[domError.name])
          return domError;
        var rv = new exceptionMap[domError.name](message || domError.message, domError);
        if ("stack" in domError) {
          setProp(rv, "stack", { get: function() {
            return this.inner.stack;
          } });
        }
        return rv;
      }
      var fullNameExceptions = errorList.reduce(function(obj, name) {
        if (["Syntax", "Type", "Range"].indexOf(name) === -1)
          obj[name + "Error"] = exceptions[name];
        return obj;
      }, {});
      fullNameExceptions.ModifyError = ModifyError;
      fullNameExceptions.DexieError = DexieError;
      fullNameExceptions.BulkError = BulkError;
      function nop() {
      }
      function mirror(val) {
        return val;
      }
      function pureFunctionChain(f1, f2) {
        if (f1 == null || f1 === mirror)
          return f2;
        return function(val) {
          return f2(f1(val));
        };
      }
      function callBoth(on1, on2) {
        return function() {
          on1.apply(this, arguments);
          on2.apply(this, arguments);
        };
      }
      function hookCreatingChain(f1, f2) {
        if (f1 === nop)
          return f2;
        return function() {
          var res = f1.apply(this, arguments);
          if (res !== void 0)
            arguments[0] = res;
          var onsuccess = this.onsuccess, onerror = this.onerror;
          this.onsuccess = null;
          this.onerror = null;
          var res2 = f2.apply(this, arguments);
          if (onsuccess)
            this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
          if (onerror)
            this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
          return res2 !== void 0 ? res2 : res;
        };
      }
      function hookDeletingChain(f1, f2) {
        if (f1 === nop)
          return f2;
        return function() {
          f1.apply(this, arguments);
          var onsuccess = this.onsuccess, onerror = this.onerror;
          this.onsuccess = this.onerror = null;
          f2.apply(this, arguments);
          if (onsuccess)
            this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
          if (onerror)
            this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
        };
      }
      function hookUpdatingChain(f1, f2) {
        if (f1 === nop)
          return f2;
        return function(modifications) {
          var res = f1.apply(this, arguments);
          extend(modifications, res);
          var onsuccess = this.onsuccess, onerror = this.onerror;
          this.onsuccess = null;
          this.onerror = null;
          var res2 = f2.apply(this, arguments);
          if (onsuccess)
            this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
          if (onerror)
            this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
          return res === void 0 ? res2 === void 0 ? void 0 : res2 : extend(res, res2);
        };
      }
      function reverseStoppableEventChain(f1, f2) {
        if (f1 === nop)
          return f2;
        return function() {
          if (f2.apply(this, arguments) === false)
            return false;
          return f1.apply(this, arguments);
        };
      }
      function promisableChain(f1, f2) {
        if (f1 === nop)
          return f2;
        return function() {
          var res = f1.apply(this, arguments);
          if (res && typeof res.then === "function") {
            var thiz = this, i = arguments.length, args = new Array(i);
            while (i--)
              args[i] = arguments[i];
            return res.then(function() {
              return f2.apply(thiz, args);
            });
          }
          return f2.apply(this, arguments);
        };
      }
      var debug = typeof location !== "undefined" && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
      function setDebug(value, filter2) {
        debug = value;
      }
      var INTERNAL = {};
      var ZONE_ECHO_LIMIT = 100, _a$1 = typeof Promise === "undefined" ? [] : function() {
        var globalP = Promise.resolve();
        if (typeof crypto === "undefined" || !crypto.subtle)
          return [globalP, getProto(globalP), globalP];
        var nativeP = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
        return [
          nativeP,
          getProto(nativeP),
          globalP
        ];
      }(), resolvedNativePromise = _a$1[0], nativePromiseProto = _a$1[1], resolvedGlobalPromise = _a$1[2], nativePromiseThen = nativePromiseProto && nativePromiseProto.then;
      var NativePromise = resolvedNativePromise && resolvedNativePromise.constructor;
      var patchGlobalPromise = !!resolvedGlobalPromise;
      function schedulePhysicalTick() {
        queueMicrotask(physicalTick);
      }
      var asap = function(callback, args) {
        microtickQueue.push([callback, args]);
        if (needsNewPhysicalTick) {
          schedulePhysicalTick();
          needsNewPhysicalTick = false;
        }
      };
      var isOutsideMicroTick = true, needsNewPhysicalTick = true, unhandledErrors = [], rejectingErrors = [], rejectionMapper = mirror;
      var globalPSD = {
        id: "global",
        global: true,
        ref: 0,
        unhandleds: [],
        onunhandled: nop,
        pgp: false,
        env: {},
        finalize: nop
      };
      var PSD = globalPSD;
      var microtickQueue = [];
      var numScheduledCalls = 0;
      var tickFinalizers = [];
      function DexiePromise(fn) {
        if (typeof this !== "object")
          throw new TypeError("Promises must be constructed via new");
        this._listeners = [];
        this._lib = false;
        var psd = this._PSD = PSD;
        if (typeof fn !== "function") {
          if (fn !== INTERNAL)
            throw new TypeError("Not a function");
          this._state = arguments[1];
          this._value = arguments[2];
          if (this._state === false)
            handleRejection(this, this._value);
          return;
        }
        this._state = null;
        this._value = null;
        ++psd.ref;
        executePromiseTask(this, fn);
      }
      var thenProp = {
        get: function() {
          var psd = PSD, microTaskId = totalEchoes;
          function then(onFulfilled, onRejected) {
            var _this = this;
            var possibleAwait = !psd.global && (psd !== PSD || microTaskId !== totalEchoes);
            var cleanup = possibleAwait && !decrementExpectedAwaits();
            var rv = new DexiePromise(function(resolve2, reject) {
              propagateToListener(_this, new Listener(nativeAwaitCompatibleWrap(onFulfilled, psd, possibleAwait, cleanup), nativeAwaitCompatibleWrap(onRejected, psd, possibleAwait, cleanup), resolve2, reject, psd));
            });
            if (this._consoleTask)
              rv._consoleTask = this._consoleTask;
            return rv;
          }
          then.prototype = INTERNAL;
          return then;
        },
        set: function(value) {
          setProp(this, "then", value && value.prototype === INTERNAL ? thenProp : {
            get: function() {
              return value;
            },
            set: thenProp.set
          });
        }
      };
      props(DexiePromise.prototype, {
        then: thenProp,
        _then: function(onFulfilled, onRejected) {
          propagateToListener(this, new Listener(null, null, onFulfilled, onRejected, PSD));
        },
        catch: function(onRejected) {
          if (arguments.length === 1)
            return this.then(null, onRejected);
          var type6 = arguments[0], handler = arguments[1];
          return typeof type6 === "function" ? this.then(null, function(err) {
            return err instanceof type6 ? handler(err) : PromiseReject(err);
          }) : this.then(null, function(err) {
            return err && err.name === type6 ? handler(err) : PromiseReject(err);
          });
        },
        finally: function(onFinally) {
          return this.then(function(value) {
            return DexiePromise.resolve(onFinally()).then(function() {
              return value;
            });
          }, function(err) {
            return DexiePromise.resolve(onFinally()).then(function() {
              return PromiseReject(err);
            });
          });
        },
        timeout: function(ms, msg) {
          var _this = this;
          return ms < Infinity ? new DexiePromise(function(resolve2, reject) {
            var handle = setTimeout(function() {
              return reject(new exceptions.Timeout(msg));
            }, ms);
            _this.then(resolve2, reject).finally(clearTimeout.bind(null, handle));
          }) : this;
        }
      });
      if (typeof Symbol !== "undefined" && Symbol.toStringTag)
        setProp(DexiePromise.prototype, Symbol.toStringTag, "Dexie.Promise");
      globalPSD.env = snapShot();
      function Listener(onFulfilled, onRejected, resolve2, reject, zone) {
        this.onFulfilled = typeof onFulfilled === "function" ? onFulfilled : null;
        this.onRejected = typeof onRejected === "function" ? onRejected : null;
        this.resolve = resolve2;
        this.reject = reject;
        this.psd = zone;
      }
      props(DexiePromise, {
        all: function() {
          var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
          return new DexiePromise(function(resolve2, reject) {
            if (values.length === 0)
              resolve2([]);
            var remaining = values.length;
            values.forEach(function(a, i) {
              return DexiePromise.resolve(a).then(function(x) {
                values[i] = x;
                if (!--remaining)
                  resolve2(values);
              }, reject);
            });
          });
        },
        resolve: function(value) {
          if (value instanceof DexiePromise)
            return value;
          if (value && typeof value.then === "function")
            return new DexiePromise(function(resolve2, reject) {
              value.then(resolve2, reject);
            });
          var rv = new DexiePromise(INTERNAL, true, value);
          return rv;
        },
        reject: PromiseReject,
        race: function() {
          var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
          return new DexiePromise(function(resolve2, reject) {
            values.map(function(value) {
              return DexiePromise.resolve(value).then(resolve2, reject);
            });
          });
        },
        PSD: {
          get: function() {
            return PSD;
          },
          set: function(value) {
            return PSD = value;
          }
        },
        totalEchoes: { get: function() {
          return totalEchoes;
        } },
        newPSD: newScope,
        usePSD,
        scheduler: {
          get: function() {
            return asap;
          },
          set: function(value) {
            asap = value;
          }
        },
        rejectionMapper: {
          get: function() {
            return rejectionMapper;
          },
          set: function(value) {
            rejectionMapper = value;
          }
        },
        follow: function(fn, zoneProps) {
          return new DexiePromise(function(resolve2, reject) {
            return newScope(function(resolve3, reject2) {
              var psd = PSD;
              psd.unhandleds = [];
              psd.onunhandled = reject2;
              psd.finalize = callBoth(function() {
                var _this = this;
                run_at_end_of_this_or_next_physical_tick(function() {
                  _this.unhandleds.length === 0 ? resolve3() : reject2(_this.unhandleds[0]);
                });
              }, psd.finalize);
              fn();
            }, zoneProps, resolve2, reject);
          });
        }
      });
      if (NativePromise) {
        if (NativePromise.allSettled)
          setProp(DexiePromise, "allSettled", function() {
            var possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
            return new DexiePromise(function(resolve2) {
              if (possiblePromises.length === 0)
                resolve2([]);
              var remaining = possiblePromises.length;
              var results = new Array(remaining);
              possiblePromises.forEach(function(p, i) {
                return DexiePromise.resolve(p).then(function(value) {
                  return results[i] = { status: "fulfilled", value };
                }, function(reason) {
                  return results[i] = { status: "rejected", reason };
                }).then(function() {
                  return --remaining || resolve2(results);
                });
              });
            });
          });
        if (NativePromise.any && typeof AggregateError !== "undefined")
          setProp(DexiePromise, "any", function() {
            var possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
            return new DexiePromise(function(resolve2, reject) {
              if (possiblePromises.length === 0)
                reject(new AggregateError([]));
              var remaining = possiblePromises.length;
              var failures = new Array(remaining);
              possiblePromises.forEach(function(p, i) {
                return DexiePromise.resolve(p).then(function(value) {
                  return resolve2(value);
                }, function(failure) {
                  failures[i] = failure;
                  if (!--remaining)
                    reject(new AggregateError(failures));
                });
              });
            });
          });
        if (NativePromise.withResolvers)
          DexiePromise.withResolvers = NativePromise.withResolvers;
      }
      function executePromiseTask(promise, fn) {
        try {
          fn(function(value) {
            if (promise._state !== null)
              return;
            if (value === promise)
              throw new TypeError("A promise cannot be resolved with itself.");
            var shouldExecuteTick = promise._lib && beginMicroTickScope();
            if (value && typeof value.then === "function") {
              executePromiseTask(promise, function(resolve2, reject) {
                value instanceof DexiePromise ? value._then(resolve2, reject) : value.then(resolve2, reject);
              });
            } else {
              promise._state = true;
              promise._value = value;
              propagateAllListeners(promise);
            }
            if (shouldExecuteTick)
              endMicroTickScope();
          }, handleRejection.bind(null, promise));
        } catch (ex) {
          handleRejection(promise, ex);
        }
      }
      function handleRejection(promise, reason) {
        rejectingErrors.push(reason);
        if (promise._state !== null)
          return;
        var shouldExecuteTick = promise._lib && beginMicroTickScope();
        reason = rejectionMapper(reason);
        promise._state = false;
        promise._value = reason;
        addPossiblyUnhandledError(promise);
        propagateAllListeners(promise);
        if (shouldExecuteTick)
          endMicroTickScope();
      }
      function propagateAllListeners(promise) {
        var listeners = promise._listeners;
        promise._listeners = [];
        for (var i = 0, len = listeners.length; i < len; ++i) {
          propagateToListener(promise, listeners[i]);
        }
        var psd = promise._PSD;
        --psd.ref || psd.finalize();
        if (numScheduledCalls === 0) {
          ++numScheduledCalls;
          asap(function() {
            if (--numScheduledCalls === 0)
              finalizePhysicalTick();
          }, []);
        }
      }
      function propagateToListener(promise, listener) {
        if (promise._state === null) {
          promise._listeners.push(listener);
          return;
        }
        var cb = promise._state ? listener.onFulfilled : listener.onRejected;
        if (cb === null) {
          return (promise._state ? listener.resolve : listener.reject)(promise._value);
        }
        ++listener.psd.ref;
        ++numScheduledCalls;
        asap(callListener, [cb, promise, listener]);
      }
      function callListener(cb, promise, listener) {
        try {
          var ret, value = promise._value;
          if (!promise._state && rejectingErrors.length)
            rejectingErrors = [];
          ret = debug && promise._consoleTask ? promise._consoleTask.run(function() {
            return cb(value);
          }) : cb(value);
          if (!promise._state && rejectingErrors.indexOf(value) === -1) {
            markErrorAsHandled(promise);
          }
          listener.resolve(ret);
        } catch (e) {
          listener.reject(e);
        } finally {
          if (--numScheduledCalls === 0)
            finalizePhysicalTick();
          --listener.psd.ref || listener.psd.finalize();
        }
      }
      function physicalTick() {
        usePSD(globalPSD, function() {
          beginMicroTickScope() && endMicroTickScope();
        });
      }
      function beginMicroTickScope() {
        var wasRootExec = isOutsideMicroTick;
        isOutsideMicroTick = false;
        needsNewPhysicalTick = false;
        return wasRootExec;
      }
      function endMicroTickScope() {
        var callbacks, i, l;
        do {
          while (microtickQueue.length > 0) {
            callbacks = microtickQueue;
            microtickQueue = [];
            l = callbacks.length;
            for (i = 0; i < l; ++i) {
              var item = callbacks[i];
              item[0].apply(null, item[1]);
            }
          }
        } while (microtickQueue.length > 0);
        isOutsideMicroTick = true;
        needsNewPhysicalTick = true;
      }
      function finalizePhysicalTick() {
        var unhandledErrs = unhandledErrors;
        unhandledErrors = [];
        unhandledErrs.forEach(function(p) {
          p._PSD.onunhandled.call(null, p._value, p);
        });
        var finalizers = tickFinalizers.slice(0);
        var i = finalizers.length;
        while (i)
          finalizers[--i]();
      }
      function run_at_end_of_this_or_next_physical_tick(fn) {
        function finalizer() {
          fn();
          tickFinalizers.splice(tickFinalizers.indexOf(finalizer), 1);
        }
        tickFinalizers.push(finalizer);
        ++numScheduledCalls;
        asap(function() {
          if (--numScheduledCalls === 0)
            finalizePhysicalTick();
        }, []);
      }
      function addPossiblyUnhandledError(promise) {
        if (!unhandledErrors.some(function(p) {
          return p._value === promise._value;
        }))
          unhandledErrors.push(promise);
      }
      function markErrorAsHandled(promise) {
        var i = unhandledErrors.length;
        while (i)
          if (unhandledErrors[--i]._value === promise._value) {
            unhandledErrors.splice(i, 1);
            return;
          }
      }
      function PromiseReject(reason) {
        return new DexiePromise(INTERNAL, false, reason);
      }
      function wrap(fn, errorCatcher) {
        var psd = PSD;
        return function() {
          var wasRootExec = beginMicroTickScope(), outerScope = PSD;
          try {
            switchToZone(psd, true);
            return fn.apply(this, arguments);
          } catch (e) {
            errorCatcher && errorCatcher(e);
          } finally {
            switchToZone(outerScope, false);
            if (wasRootExec)
              endMicroTickScope();
          }
        };
      }
      var task = { awaits: 0, echoes: 0, id: 0 };
      var taskCounter = 0;
      var zoneStack = [];
      var zoneEchoes = 0;
      var totalEchoes = 0;
      var zone_id_counter = 0;
      function newScope(fn, props2, a1, a2) {
        var parent = PSD, psd = Object.create(parent);
        psd.parent = parent;
        psd.ref = 0;
        psd.global = false;
        psd.id = ++zone_id_counter;
        globalPSD.env;
        psd.env = patchGlobalPromise ? {
          Promise: DexiePromise,
          PromiseProp: { value: DexiePromise, configurable: true, writable: true },
          all: DexiePromise.all,
          race: DexiePromise.race,
          allSettled: DexiePromise.allSettled,
          any: DexiePromise.any,
          resolve: DexiePromise.resolve,
          reject: DexiePromise.reject
        } : {};
        if (props2)
          extend(psd, props2);
        ++parent.ref;
        psd.finalize = function() {
          --this.parent.ref || this.parent.finalize();
        };
        var rv = usePSD(psd, fn, a1, a2);
        if (psd.ref === 0)
          psd.finalize();
        return rv;
      }
      function incrementExpectedAwaits() {
        if (!task.id)
          task.id = ++taskCounter;
        ++task.awaits;
        task.echoes += ZONE_ECHO_LIMIT;
        return task.id;
      }
      function decrementExpectedAwaits() {
        if (!task.awaits)
          return false;
        if (--task.awaits === 0)
          task.id = 0;
        task.echoes = task.awaits * ZONE_ECHO_LIMIT;
        return true;
      }
      if (("" + nativePromiseThen).indexOf("[native code]") === -1) {
        incrementExpectedAwaits = decrementExpectedAwaits = nop;
      }
      function onPossibleParallellAsync(possiblePromise) {
        if (task.echoes && possiblePromise && possiblePromise.constructor === NativePromise) {
          incrementExpectedAwaits();
          return possiblePromise.then(function(x) {
            decrementExpectedAwaits();
            return x;
          }, function(e) {
            decrementExpectedAwaits();
            return rejection(e);
          });
        }
        return possiblePromise;
      }
      function zoneEnterEcho(targetZone) {
        ++totalEchoes;
        if (!task.echoes || --task.echoes === 0) {
          task.echoes = task.awaits = task.id = 0;
        }
        zoneStack.push(PSD);
        switchToZone(targetZone, true);
      }
      function zoneLeaveEcho() {
        var zone = zoneStack[zoneStack.length - 1];
        zoneStack.pop();
        switchToZone(zone, false);
      }
      function switchToZone(targetZone, bEnteringZone) {
        var currentZone = PSD;
        if (bEnteringZone ? task.echoes && (!zoneEchoes++ || targetZone !== PSD) : zoneEchoes && (!--zoneEchoes || targetZone !== PSD)) {
          queueMicrotask(bEnteringZone ? zoneEnterEcho.bind(null, targetZone) : zoneLeaveEcho);
        }
        if (targetZone === PSD)
          return;
        PSD = targetZone;
        if (currentZone === globalPSD)
          globalPSD.env = snapShot();
        if (patchGlobalPromise) {
          var GlobalPromise = globalPSD.env.Promise;
          var targetEnv = targetZone.env;
          if (currentZone.global || targetZone.global) {
            Object.defineProperty(_global, "Promise", targetEnv.PromiseProp);
            GlobalPromise.all = targetEnv.all;
            GlobalPromise.race = targetEnv.race;
            GlobalPromise.resolve = targetEnv.resolve;
            GlobalPromise.reject = targetEnv.reject;
            if (targetEnv.allSettled)
              GlobalPromise.allSettled = targetEnv.allSettled;
            if (targetEnv.any)
              GlobalPromise.any = targetEnv.any;
          }
        }
      }
      function snapShot() {
        var GlobalPromise = _global.Promise;
        return patchGlobalPromise ? {
          Promise: GlobalPromise,
          PromiseProp: Object.getOwnPropertyDescriptor(_global, "Promise"),
          all: GlobalPromise.all,
          race: GlobalPromise.race,
          allSettled: GlobalPromise.allSettled,
          any: GlobalPromise.any,
          resolve: GlobalPromise.resolve,
          reject: GlobalPromise.reject
        } : {};
      }
      function usePSD(psd, fn, a1, a2, a3) {
        var outerScope = PSD;
        try {
          switchToZone(psd, true);
          return fn(a1, a2, a3);
        } finally {
          switchToZone(outerScope, false);
        }
      }
      function nativeAwaitCompatibleWrap(fn, zone, possibleAwait, cleanup) {
        return typeof fn !== "function" ? fn : function() {
          var outerZone = PSD;
          if (possibleAwait)
            incrementExpectedAwaits();
          switchToZone(zone, true);
          try {
            return fn.apply(this, arguments);
          } finally {
            switchToZone(outerZone, false);
            if (cleanup)
              queueMicrotask(decrementExpectedAwaits);
          }
        };
      }
      function execInGlobalContext(cb) {
        if (Promise === NativePromise && task.echoes === 0) {
          if (zoneEchoes === 0) {
            cb();
          } else {
            enqueueNativeMicroTask(cb);
          }
        } else {
          setTimeout(cb, 0);
        }
      }
      var rejection = DexiePromise.reject;
      function tempTransaction(db, mode, storeNames, fn) {
        if (!db.idbdb || !db._state.openComplete && (!PSD.letThrough && !db._vip)) {
          if (db._state.openComplete) {
            return rejection(new exceptions.DatabaseClosed(db._state.dbOpenError));
          }
          if (!db._state.isBeingOpened) {
            if (!db._state.autoOpen)
              return rejection(new exceptions.DatabaseClosed());
            db.open().catch(nop);
          }
          return db._state.dbReadyPromise.then(function() {
            return tempTransaction(db, mode, storeNames, fn);
          });
        } else {
          var trans = db._createTransaction(mode, storeNames, db._dbSchema);
          try {
            trans.create();
            db._state.PR1398_maxLoop = 3;
          } catch (ex) {
            if (ex.name === errnames.InvalidState && db.isOpen() && --db._state.PR1398_maxLoop > 0) {
              console.warn("Dexie: Need to reopen db");
              db.close({ disableAutoOpen: false });
              return db.open().then(function() {
                return tempTransaction(db, mode, storeNames, fn);
              });
            }
            return rejection(ex);
          }
          return trans._promise(mode, function(resolve2, reject) {
            return newScope(function() {
              PSD.trans = trans;
              return fn(resolve2, reject, trans);
            });
          }).then(function(result) {
            if (mode === "readwrite")
              try {
                trans.idbtrans.commit();
              } catch (_a2) {
              }
            return mode === "readonly" ? result : trans._completion.then(function() {
              return result;
            });
          });
        }
      }
      var DEXIE_VERSION = "4.0.10";
      var maxString = String.fromCharCode(65535);
      var minKey = -Infinity;
      var INVALID_KEY_ARGUMENT = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.";
      var STRING_EXPECTED = "String expected.";
      var connections = [];
      var DBNAMES_DB = "__dbnames";
      var READONLY = "readonly";
      var READWRITE = "readwrite";
      function combine(filter1, filter2) {
        return filter1 ? filter2 ? function() {
          return filter1.apply(this, arguments) && filter2.apply(this, arguments);
        } : filter1 : filter2;
      }
      var AnyRange = {
        type: 3,
        lower: -Infinity,
        lowerOpen: false,
        upper: [[]],
        upperOpen: false
      };
      function workaroundForUndefinedPrimKey(keyPath) {
        return typeof keyPath === "string" && !/\./.test(keyPath) ? function(obj) {
          if (obj[keyPath] === void 0 && keyPath in obj) {
            obj = deepClone2(obj);
            delete obj[keyPath];
          }
          return obj;
        } : function(obj) {
          return obj;
        };
      }
      function Entity2() {
        throw exceptions.Type();
      }
      function cmp2(a, b) {
        try {
          var ta = type5(a);
          var tb = type5(b);
          if (ta !== tb) {
            if (ta === "Array")
              return 1;
            if (tb === "Array")
              return -1;
            if (ta === "binary")
              return 1;
            if (tb === "binary")
              return -1;
            if (ta === "string")
              return 1;
            if (tb === "string")
              return -1;
            if (ta === "Date")
              return 1;
            if (tb !== "Date")
              return NaN;
            return -1;
          }
          switch (ta) {
            case "number":
            case "Date":
            case "string":
              return a > b ? 1 : a < b ? -1 : 0;
            case "binary": {
              return compareUint8Arrays(getUint8Array(a), getUint8Array(b));
            }
            case "Array":
              return compareArrays(a, b);
          }
        } catch (_a2) {
        }
        return NaN;
      }
      function compareArrays(a, b) {
        var al = a.length;
        var bl = b.length;
        var l = al < bl ? al : bl;
        for (var i = 0; i < l; ++i) {
          var res = cmp2(a[i], b[i]);
          if (res !== 0)
            return res;
        }
        return al === bl ? 0 : al < bl ? -1 : 1;
      }
      function compareUint8Arrays(a, b) {
        var al = a.length;
        var bl = b.length;
        var l = al < bl ? al : bl;
        for (var i = 0; i < l; ++i) {
          if (a[i] !== b[i])
            return a[i] < b[i] ? -1 : 1;
        }
        return al === bl ? 0 : al < bl ? -1 : 1;
      }
      function type5(x) {
        var t = typeof x;
        if (t !== "object")
          return t;
        if (ArrayBuffer.isView(x))
          return "binary";
        var tsTag = toStringTag(x);
        return tsTag === "ArrayBuffer" ? "binary" : tsTag;
      }
      function getUint8Array(a) {
        if (a instanceof Uint8Array)
          return a;
        if (ArrayBuffer.isView(a))
          return new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
        return new Uint8Array(a);
      }
      var Table = function() {
        function Table2() {
        }
        Table2.prototype._trans = function(mode, fn, writeLocked) {
          var trans = this._tx || PSD.trans;
          var tableName = this.name;
          var task2 = debug && typeof console !== "undefined" && console.createTask && console.createTask("Dexie: ".concat(mode === "readonly" ? "read" : "write", " ").concat(this.name));
          function checkTableInTransaction(resolve2, reject, trans2) {
            if (!trans2.schema[tableName])
              throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
            return fn(trans2.idbtrans, trans2);
          }
          var wasRootExec = beginMicroTickScope();
          try {
            var p = trans && trans.db._novip === this.db._novip ? trans === PSD.trans ? trans._promise(mode, checkTableInTransaction, writeLocked) : newScope(function() {
              return trans._promise(mode, checkTableInTransaction, writeLocked);
            }, { trans, transless: PSD.transless || PSD }) : tempTransaction(this.db, mode, [this.name], checkTableInTransaction);
            if (task2) {
              p._consoleTask = task2;
              p = p.catch(function(err) {
                console.trace(err);
                return rejection(err);
              });
            }
            return p;
          } finally {
            if (wasRootExec)
              endMicroTickScope();
          }
        };
        Table2.prototype.get = function(keyOrCrit, cb) {
          var _this = this;
          if (keyOrCrit && keyOrCrit.constructor === Object)
            return this.where(keyOrCrit).first(cb);
          if (keyOrCrit == null)
            return rejection(new exceptions.Type("Invalid argument to Table.get()"));
          return this._trans("readonly", function(trans) {
            return _this.core.get({ trans, key: keyOrCrit }).then(function(res) {
              return _this.hook.reading.fire(res);
            });
          }).then(cb);
        };
        Table2.prototype.where = function(indexOrCrit) {
          if (typeof indexOrCrit === "string")
            return new this.db.WhereClause(this, indexOrCrit);
          if (isArray4(indexOrCrit))
            return new this.db.WhereClause(this, "[".concat(indexOrCrit.join("+"), "]"));
          var keyPaths = keys(indexOrCrit);
          if (keyPaths.length === 1)
            return this.where(keyPaths[0]).equals(indexOrCrit[keyPaths[0]]);
          var compoundIndex = this.schema.indexes.concat(this.schema.primKey).filter(function(ix) {
            if (ix.compound && keyPaths.every(function(keyPath) {
              return ix.keyPath.indexOf(keyPath) >= 0;
            })) {
              for (var i = 0; i < keyPaths.length; ++i) {
                if (keyPaths.indexOf(ix.keyPath[i]) === -1)
                  return false;
              }
              return true;
            }
            return false;
          }).sort(function(a, b) {
            return a.keyPath.length - b.keyPath.length;
          })[0];
          if (compoundIndex && this.db._maxKey !== maxString) {
            var keyPathsInValidOrder = compoundIndex.keyPath.slice(0, keyPaths.length);
            return this.where(keyPathsInValidOrder).equals(keyPathsInValidOrder.map(function(kp) {
              return indexOrCrit[kp];
            }));
          }
          if (!compoundIndex && debug)
            console.warn("The query ".concat(JSON.stringify(indexOrCrit), " on ").concat(this.name, " would benefit from a ") + "compound index [".concat(keyPaths.join("+"), "]"));
          var idxByName = this.schema.idxByName;
          function equals(a, b) {
            return cmp2(a, b) === 0;
          }
          var _a2 = keyPaths.reduce(function(_a3, keyPath) {
            var prevIndex = _a3[0], prevFilterFn = _a3[1];
            var index = idxByName[keyPath];
            var value = indexOrCrit[keyPath];
            return [
              prevIndex || index,
              prevIndex || !index ? combine(prevFilterFn, index && index.multi ? function(x) {
                var prop = getByKeyPath(x, keyPath);
                return isArray4(prop) && prop.some(function(item) {
                  return equals(value, item);
                });
              } : function(x) {
                return equals(value, getByKeyPath(x, keyPath));
              }) : prevFilterFn
            ];
          }, [null, null]), idx = _a2[0], filterFunction = _a2[1];
          return idx ? this.where(idx.name).equals(indexOrCrit[idx.keyPath]).filter(filterFunction) : compoundIndex ? this.filter(filterFunction) : this.where(keyPaths).equals("");
        };
        Table2.prototype.filter = function(filterFunction) {
          return this.toCollection().and(filterFunction);
        };
        Table2.prototype.count = function(thenShortcut) {
          return this.toCollection().count(thenShortcut);
        };
        Table2.prototype.offset = function(offset) {
          return this.toCollection().offset(offset);
        };
        Table2.prototype.limit = function(numRows) {
          return this.toCollection().limit(numRows);
        };
        Table2.prototype.each = function(callback) {
          return this.toCollection().each(callback);
        };
        Table2.prototype.toArray = function(thenShortcut) {
          return this.toCollection().toArray(thenShortcut);
        };
        Table2.prototype.toCollection = function() {
          return new this.db.Collection(new this.db.WhereClause(this));
        };
        Table2.prototype.orderBy = function(index) {
          return new this.db.Collection(new this.db.WhereClause(this, isArray4(index) ? "[".concat(index.join("+"), "]") : index));
        };
        Table2.prototype.reverse = function() {
          return this.toCollection().reverse();
        };
        Table2.prototype.mapToClass = function(constructor) {
          var _a2 = this, db = _a2.db, tableName = _a2.name;
          this.schema.mappedClass = constructor;
          if (constructor.prototype instanceof Entity2) {
            constructor = function(_super) {
              __extends2(class_1, _super);
              function class_1() {
                return _super !== null && _super.apply(this, arguments) || this;
              }
              Object.defineProperty(class_1.prototype, "db", {
                get: function() {
                  return db;
                },
                enumerable: false,
                configurable: true
              });
              class_1.prototype.table = function() {
                return tableName;
              };
              return class_1;
            }(constructor);
          }
          var inheritedProps = /* @__PURE__ */ new Set();
          for (var proto = constructor.prototype; proto; proto = getProto(proto)) {
            Object.getOwnPropertyNames(proto).forEach(function(propName) {
              return inheritedProps.add(propName);
            });
          }
          var readHook = function(obj) {
            if (!obj)
              return obj;
            var res = Object.create(constructor.prototype);
            for (var m in obj)
              if (!inheritedProps.has(m))
                try {
                  res[m] = obj[m];
                } catch (_) {
                }
            return res;
          };
          if (this.schema.readHook) {
            this.hook.reading.unsubscribe(this.schema.readHook);
          }
          this.schema.readHook = readHook;
          this.hook("reading", readHook);
          return constructor;
        };
        Table2.prototype.defineClass = function() {
          function Class(content) {
            extend(this, content);
          }
          return this.mapToClass(Class);
        };
        Table2.prototype.add = function(obj, key) {
          var _this = this;
          var _a2 = this.schema.primKey, auto = _a2.auto, keyPath = _a2.keyPath;
          var objToAdd = obj;
          if (keyPath && auto) {
            objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
          }
          return this._trans("readwrite", function(trans) {
            return _this.core.mutate({ trans, type: "add", keys: key != null ? [key] : null, values: [objToAdd] });
          }).then(function(res) {
            return res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult;
          }).then(function(lastResult) {
            if (keyPath) {
              try {
                setByKeyPath(obj, keyPath, lastResult);
              } catch (_) {
              }
            }
            return lastResult;
          });
        };
        Table2.prototype.update = function(keyOrObject, modifications) {
          if (typeof keyOrObject === "object" && !isArray4(keyOrObject)) {
            var key = getByKeyPath(keyOrObject, this.schema.primKey.keyPath);
            if (key === void 0)
              return rejection(new exceptions.InvalidArgument("Given object does not contain its primary key"));
            return this.where(":id").equals(key).modify(modifications);
          } else {
            return this.where(":id").equals(keyOrObject).modify(modifications);
          }
        };
        Table2.prototype.put = function(obj, key) {
          var _this = this;
          var _a2 = this.schema.primKey, auto = _a2.auto, keyPath = _a2.keyPath;
          var objToAdd = obj;
          if (keyPath && auto) {
            objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
          }
          return this._trans("readwrite", function(trans) {
            return _this.core.mutate({ trans, type: "put", values: [objToAdd], keys: key != null ? [key] : null });
          }).then(function(res) {
            return res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult;
          }).then(function(lastResult) {
            if (keyPath) {
              try {
                setByKeyPath(obj, keyPath, lastResult);
              } catch (_) {
              }
            }
            return lastResult;
          });
        };
        Table2.prototype.delete = function(key) {
          var _this = this;
          return this._trans("readwrite", function(trans) {
            return _this.core.mutate({ trans, type: "delete", keys: [key] });
          }).then(function(res) {
            return res.numFailures ? DexiePromise.reject(res.failures[0]) : void 0;
          });
        };
        Table2.prototype.clear = function() {
          var _this = this;
          return this._trans("readwrite", function(trans) {
            return _this.core.mutate({ trans, type: "deleteRange", range: AnyRange });
          }).then(function(res) {
            return res.numFailures ? DexiePromise.reject(res.failures[0]) : void 0;
          });
        };
        Table2.prototype.bulkGet = function(keys2) {
          var _this = this;
          return this._trans("readonly", function(trans) {
            return _this.core.getMany({
              keys: keys2,
              trans
            }).then(function(result) {
              return result.map(function(res) {
                return _this.hook.reading.fire(res);
              });
            });
          });
        };
        Table2.prototype.bulkAdd = function(objects, keysOrOptions, options) {
          var _this = this;
          var keys2 = Array.isArray(keysOrOptions) ? keysOrOptions : void 0;
          options = options || (keys2 ? void 0 : keysOrOptions);
          var wantResults = options ? options.allKeys : void 0;
          return this._trans("readwrite", function(trans) {
            var _a2 = _this.schema.primKey, auto = _a2.auto, keyPath = _a2.keyPath;
            if (keyPath && keys2)
              throw new exceptions.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
            if (keys2 && keys2.length !== objects.length)
              throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
            var numObjects = objects.length;
            var objectsToAdd = keyPath && auto ? objects.map(workaroundForUndefinedPrimKey(keyPath)) : objects;
            return _this.core.mutate({ trans, type: "add", keys: keys2, values: objectsToAdd, wantResults }).then(function(_a3) {
              var numFailures = _a3.numFailures, results = _a3.results, lastResult = _a3.lastResult, failures = _a3.failures;
              var result = wantResults ? results : lastResult;
              if (numFailures === 0)
                return result;
              throw new BulkError("".concat(_this.name, ".bulkAdd(): ").concat(numFailures, " of ").concat(numObjects, " operations failed"), failures);
            });
          });
        };
        Table2.prototype.bulkPut = function(objects, keysOrOptions, options) {
          var _this = this;
          var keys2 = Array.isArray(keysOrOptions) ? keysOrOptions : void 0;
          options = options || (keys2 ? void 0 : keysOrOptions);
          var wantResults = options ? options.allKeys : void 0;
          return this._trans("readwrite", function(trans) {
            var _a2 = _this.schema.primKey, auto = _a2.auto, keyPath = _a2.keyPath;
            if (keyPath && keys2)
              throw new exceptions.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
            if (keys2 && keys2.length !== objects.length)
              throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
            var numObjects = objects.length;
            var objectsToPut = keyPath && auto ? objects.map(workaroundForUndefinedPrimKey(keyPath)) : objects;
            return _this.core.mutate({ trans, type: "put", keys: keys2, values: objectsToPut, wantResults }).then(function(_a3) {
              var numFailures = _a3.numFailures, results = _a3.results, lastResult = _a3.lastResult, failures = _a3.failures;
              var result = wantResults ? results : lastResult;
              if (numFailures === 0)
                return result;
              throw new BulkError("".concat(_this.name, ".bulkPut(): ").concat(numFailures, " of ").concat(numObjects, " operations failed"), failures);
            });
          });
        };
        Table2.prototype.bulkUpdate = function(keysAndChanges) {
          var _this = this;
          var coreTable = this.core;
          var keys2 = keysAndChanges.map(function(entry) {
            return entry.key;
          });
          var changeSpecs = keysAndChanges.map(function(entry) {
            return entry.changes;
          });
          var offsetMap = [];
          return this._trans("readwrite", function(trans) {
            return coreTable.getMany({ trans, keys: keys2, cache: "clone" }).then(function(objs) {
              var resultKeys = [];
              var resultObjs = [];
              keysAndChanges.forEach(function(_a2, idx) {
                var key = _a2.key, changes = _a2.changes;
                var obj = objs[idx];
                if (obj) {
                  for (var _i = 0, _b = Object.keys(changes); _i < _b.length; _i++) {
                    var keyPath = _b[_i];
                    var value = changes[keyPath];
                    if (keyPath === _this.schema.primKey.keyPath) {
                      if (cmp2(value, key) !== 0) {
                        throw new exceptions.Constraint("Cannot update primary key in bulkUpdate()");
                      }
                    } else {
                      setByKeyPath(obj, keyPath, value);
                    }
                  }
                  offsetMap.push(idx);
                  resultKeys.push(key);
                  resultObjs.push(obj);
                }
              });
              var numEntries = resultKeys.length;
              return coreTable.mutate({
                trans,
                type: "put",
                keys: resultKeys,
                values: resultObjs,
                updates: {
                  keys: keys2,
                  changeSpecs
                }
              }).then(function(_a2) {
                var numFailures = _a2.numFailures, failures = _a2.failures;
                if (numFailures === 0)
                  return numEntries;
                for (var _i = 0, _b = Object.keys(failures); _i < _b.length; _i++) {
                  var offset = _b[_i];
                  var mappedOffset = offsetMap[Number(offset)];
                  if (mappedOffset != null) {
                    var failure = failures[offset];
                    delete failures[offset];
                    failures[mappedOffset] = failure;
                  }
                }
                throw new BulkError("".concat(_this.name, ".bulkUpdate(): ").concat(numFailures, " of ").concat(numEntries, " operations failed"), failures);
              });
            });
          });
        };
        Table2.prototype.bulkDelete = function(keys2) {
          var _this = this;
          var numKeys = keys2.length;
          return this._trans("readwrite", function(trans) {
            return _this.core.mutate({ trans, type: "delete", keys: keys2 });
          }).then(function(_a2) {
            var numFailures = _a2.numFailures, lastResult = _a2.lastResult, failures = _a2.failures;
            if (numFailures === 0)
              return lastResult;
            throw new BulkError("".concat(_this.name, ".bulkDelete(): ").concat(numFailures, " of ").concat(numKeys, " operations failed"), failures);
          });
        };
        return Table2;
      }();
      function Events(ctx) {
        var evs = {};
        var rv = function(eventName, subscriber) {
          if (subscriber) {
            var i2 = arguments.length, args = new Array(i2 - 1);
            while (--i2)
              args[i2 - 1] = arguments[i2];
            evs[eventName].subscribe.apply(null, args);
            return ctx;
          } else if (typeof eventName === "string") {
            return evs[eventName];
          }
        };
        rv.addEventType = add4;
        for (var i = 1, l = arguments.length; i < l; ++i) {
          add4(arguments[i]);
        }
        return rv;
        function add4(eventName, chainFunction, defaultFunction) {
          if (typeof eventName === "object")
            return addConfiguredEvents(eventName);
          if (!chainFunction)
            chainFunction = reverseStoppableEventChain;
          if (!defaultFunction)
            defaultFunction = nop;
          var context2 = {
            subscribers: [],
            fire: defaultFunction,
            subscribe: function(cb) {
              if (context2.subscribers.indexOf(cb) === -1) {
                context2.subscribers.push(cb);
                context2.fire = chainFunction(context2.fire, cb);
              }
            },
            unsubscribe: function(cb) {
              context2.subscribers = context2.subscribers.filter(function(fn) {
                return fn !== cb;
              });
              context2.fire = context2.subscribers.reduce(chainFunction, defaultFunction);
            }
          };
          evs[eventName] = rv[eventName] = context2;
          return context2;
        }
        function addConfiguredEvents(cfg) {
          keys(cfg).forEach(function(eventName) {
            var args = cfg[eventName];
            if (isArray4(args)) {
              add4(eventName, cfg[eventName][0], cfg[eventName][1]);
            } else if (args === "asap") {
              var context2 = add4(eventName, mirror, function fire() {
                var i2 = arguments.length, args2 = new Array(i2);
                while (i2--)
                  args2[i2] = arguments[i2];
                context2.subscribers.forEach(function(fn) {
                  asap$1(function fireEvent() {
                    fn.apply(null, args2);
                  });
                });
              });
            } else
              throw new exceptions.InvalidArgument("Invalid event config");
          });
        }
      }
      function makeClassConstructor(prototype, constructor) {
        derive(constructor).from({ prototype });
        return constructor;
      }
      function createTableConstructor(db) {
        return makeClassConstructor(Table.prototype, function Table2(name, tableSchema, trans) {
          this.db = db;
          this._tx = trans;
          this.name = name;
          this.schema = tableSchema;
          this.hook = db._allTables[name] ? db._allTables[name].hook : Events(null, {
            "creating": [hookCreatingChain, nop],
            "reading": [pureFunctionChain, mirror],
            "updating": [hookUpdatingChain, nop],
            "deleting": [hookDeletingChain, nop]
          });
        });
      }
      function isPlainKeyRange(ctx, ignoreLimitFilter) {
        return !(ctx.filter || ctx.algorithm || ctx.or) && (ignoreLimitFilter ? ctx.justLimit : !ctx.replayFilter);
      }
      function addFilter(ctx, fn) {
        ctx.filter = combine(ctx.filter, fn);
      }
      function addReplayFilter(ctx, factory, isLimitFilter) {
        var curr = ctx.replayFilter;
        ctx.replayFilter = curr ? function() {
          return combine(curr(), factory());
        } : factory;
        ctx.justLimit = isLimitFilter && !curr;
      }
      function addMatchFilter(ctx, fn) {
        ctx.isMatch = combine(ctx.isMatch, fn);
      }
      function getIndexOrStore(ctx, coreSchema) {
        if (ctx.isPrimKey)
          return coreSchema.primaryKey;
        var index = coreSchema.getIndexByKeyPath(ctx.index);
        if (!index)
          throw new exceptions.Schema("KeyPath " + ctx.index + " on object store " + coreSchema.name + " is not indexed");
        return index;
      }
      function openCursor(ctx, coreTable, trans) {
        var index = getIndexOrStore(ctx, coreTable.schema);
        return coreTable.openCursor({
          trans,
          values: !ctx.keysOnly,
          reverse: ctx.dir === "prev",
          unique: !!ctx.unique,
          query: {
            index,
            range: ctx.range
          }
        });
      }
      function iter(ctx, fn, coreTrans, coreTable) {
        var filter2 = ctx.replayFilter ? combine(ctx.filter, ctx.replayFilter()) : ctx.filter;
        if (!ctx.or) {
          return iterate(openCursor(ctx, coreTable, coreTrans), combine(ctx.algorithm, filter2), fn, !ctx.keysOnly && ctx.valueMapper);
        } else {
          var set_1 = {};
          var union = function(item, cursor, advance) {
            if (!filter2 || filter2(cursor, advance, function(result) {
              return cursor.stop(result);
            }, function(err) {
              return cursor.fail(err);
            })) {
              var primaryKey = cursor.primaryKey;
              var key = "" + primaryKey;
              if (key === "[object ArrayBuffer]")
                key = "" + new Uint8Array(primaryKey);
              if (!hasOwn(set_1, key)) {
                set_1[key] = true;
                fn(item, cursor, advance);
              }
            }
          };
          return Promise.all([
            ctx.or._iterate(union, coreTrans),
            iterate(openCursor(ctx, coreTable, coreTrans), ctx.algorithm, union, !ctx.keysOnly && ctx.valueMapper)
          ]);
        }
      }
      function iterate(cursorPromise, filter2, fn, valueMapper) {
        var mappedFn = valueMapper ? function(x, c, a) {
          return fn(valueMapper(x), c, a);
        } : fn;
        var wrappedFn = wrap(mappedFn);
        return cursorPromise.then(function(cursor) {
          if (cursor) {
            return cursor.start(function() {
              var c = function() {
                return cursor.continue();
              };
              if (!filter2 || filter2(cursor, function(advancer) {
                return c = advancer;
              }, function(val) {
                cursor.stop(val);
                c = nop;
              }, function(e) {
                cursor.fail(e);
                c = nop;
              }))
                wrappedFn(cursor.value, cursor, function(advancer) {
                  return c = advancer;
                });
              c();
            });
          }
        });
      }
      var PropModSymbol2 = Symbol();
      var PropModification2 = function() {
        function PropModification3(spec) {
          Object.assign(this, spec);
        }
        PropModification3.prototype.execute = function(value) {
          var _a2;
          if (this.add !== void 0) {
            var term = this.add;
            if (isArray4(term)) {
              return __spreadArray2(__spreadArray2([], isArray4(value) ? value : [], true), term, true).sort();
            }
            if (typeof term === "number")
              return (Number(value) || 0) + term;
            if (typeof term === "bigint") {
              try {
                return BigInt(value) + term;
              } catch (_b) {
                return BigInt(0) + term;
              }
            }
            throw new TypeError("Invalid term ".concat(term));
          }
          if (this.remove !== void 0) {
            var subtrahend_1 = this.remove;
            if (isArray4(subtrahend_1)) {
              return isArray4(value) ? value.filter(function(item) {
                return !subtrahend_1.includes(item);
              }).sort() : [];
            }
            if (typeof subtrahend_1 === "number")
              return Number(value) - subtrahend_1;
            if (typeof subtrahend_1 === "bigint") {
              try {
                return BigInt(value) - subtrahend_1;
              } catch (_c) {
                return BigInt(0) - subtrahend_1;
              }
            }
            throw new TypeError("Invalid subtrahend ".concat(subtrahend_1));
          }
          var prefixToReplace = (_a2 = this.replacePrefix) === null || _a2 === void 0 ? void 0 : _a2[0];
          if (prefixToReplace && typeof value === "string" && value.startsWith(prefixToReplace)) {
            return this.replacePrefix[1] + value.substring(prefixToReplace.length);
          }
          return value;
        };
        return PropModification3;
      }();
      var Collection = function() {
        function Collection2() {
        }
        Collection2.prototype._read = function(fn, cb) {
          var ctx = this._ctx;
          return ctx.error ? ctx.table._trans(null, rejection.bind(null, ctx.error)) : ctx.table._trans("readonly", fn).then(cb);
        };
        Collection2.prototype._write = function(fn) {
          var ctx = this._ctx;
          return ctx.error ? ctx.table._trans(null, rejection.bind(null, ctx.error)) : ctx.table._trans("readwrite", fn, "locked");
        };
        Collection2.prototype._addAlgorithm = function(fn) {
          var ctx = this._ctx;
          ctx.algorithm = combine(ctx.algorithm, fn);
        };
        Collection2.prototype._iterate = function(fn, coreTrans) {
          return iter(this._ctx, fn, coreTrans, this._ctx.table.core);
        };
        Collection2.prototype.clone = function(props2) {
          var rv = Object.create(this.constructor.prototype), ctx = Object.create(this._ctx);
          if (props2)
            extend(ctx, props2);
          rv._ctx = ctx;
          return rv;
        };
        Collection2.prototype.raw = function() {
          this._ctx.valueMapper = null;
          return this;
        };
        Collection2.prototype.each = function(fn) {
          var ctx = this._ctx;
          return this._read(function(trans) {
            return iter(ctx, fn, trans, ctx.table.core);
          });
        };
        Collection2.prototype.count = function(cb) {
          var _this = this;
          return this._read(function(trans) {
            var ctx = _this._ctx;
            var coreTable = ctx.table.core;
            if (isPlainKeyRange(ctx, true)) {
              return coreTable.count({
                trans,
                query: {
                  index: getIndexOrStore(ctx, coreTable.schema),
                  range: ctx.range
                }
              }).then(function(count2) {
                return Math.min(count2, ctx.limit);
              });
            } else {
              var count = 0;
              return iter(ctx, function() {
                ++count;
                return false;
              }, trans, coreTable).then(function() {
                return count;
              });
            }
          }).then(cb);
        };
        Collection2.prototype.sortBy = function(keyPath, cb) {
          var parts = keyPath.split(".").reverse(), lastPart = parts[0], lastIndex = parts.length - 1;
          function getval(obj, i) {
            if (i)
              return getval(obj[parts[i]], i - 1);
            return obj[lastPart];
          }
          var order = this._ctx.dir === "next" ? 1 : -1;
          function sorter(a, b) {
            var aVal = getval(a, lastIndex), bVal = getval(b, lastIndex);
            return cmp2(aVal, bVal) * order;
          }
          return this.toArray(function(a) {
            return a.sort(sorter);
          }).then(cb);
        };
        Collection2.prototype.toArray = function(cb) {
          var _this = this;
          return this._read(function(trans) {
            var ctx = _this._ctx;
            if (ctx.dir === "next" && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
              var valueMapper_1 = ctx.valueMapper;
              var index = getIndexOrStore(ctx, ctx.table.core.schema);
              return ctx.table.core.query({
                trans,
                limit: ctx.limit,
                values: true,
                query: {
                  index,
                  range: ctx.range
                }
              }).then(function(_a2) {
                var result = _a2.result;
                return valueMapper_1 ? result.map(valueMapper_1) : result;
              });
            } else {
              var a_1 = [];
              return iter(ctx, function(item) {
                return a_1.push(item);
              }, trans, ctx.table.core).then(function() {
                return a_1;
              });
            }
          }, cb);
        };
        Collection2.prototype.offset = function(offset) {
          var ctx = this._ctx;
          if (offset <= 0)
            return this;
          ctx.offset += offset;
          if (isPlainKeyRange(ctx)) {
            addReplayFilter(ctx, function() {
              var offsetLeft = offset;
              return function(cursor, advance) {
                if (offsetLeft === 0)
                  return true;
                if (offsetLeft === 1) {
                  --offsetLeft;
                  return false;
                }
                advance(function() {
                  cursor.advance(offsetLeft);
                  offsetLeft = 0;
                });
                return false;
              };
            });
          } else {
            addReplayFilter(ctx, function() {
              var offsetLeft = offset;
              return function() {
                return --offsetLeft < 0;
              };
            });
          }
          return this;
        };
        Collection2.prototype.limit = function(numRows) {
          this._ctx.limit = Math.min(this._ctx.limit, numRows);
          addReplayFilter(this._ctx, function() {
            var rowsLeft = numRows;
            return function(cursor, advance, resolve2) {
              if (--rowsLeft <= 0)
                advance(resolve2);
              return rowsLeft >= 0;
            };
          }, true);
          return this;
        };
        Collection2.prototype.until = function(filterFunction, bIncludeStopEntry) {
          addFilter(this._ctx, function(cursor, advance, resolve2) {
            if (filterFunction(cursor.value)) {
              advance(resolve2);
              return bIncludeStopEntry;
            } else {
              return true;
            }
          });
          return this;
        };
        Collection2.prototype.first = function(cb) {
          return this.limit(1).toArray(function(a) {
            return a[0];
          }).then(cb);
        };
        Collection2.prototype.last = function(cb) {
          return this.reverse().first(cb);
        };
        Collection2.prototype.filter = function(filterFunction) {
          addFilter(this._ctx, function(cursor) {
            return filterFunction(cursor.value);
          });
          addMatchFilter(this._ctx, filterFunction);
          return this;
        };
        Collection2.prototype.and = function(filter2) {
          return this.filter(filter2);
        };
        Collection2.prototype.or = function(indexName) {
          return new this.db.WhereClause(this._ctx.table, indexName, this);
        };
        Collection2.prototype.reverse = function() {
          this._ctx.dir = this._ctx.dir === "prev" ? "next" : "prev";
          if (this._ondirectionchange)
            this._ondirectionchange(this._ctx.dir);
          return this;
        };
        Collection2.prototype.desc = function() {
          return this.reverse();
        };
        Collection2.prototype.eachKey = function(cb) {
          var ctx = this._ctx;
          ctx.keysOnly = !ctx.isMatch;
          return this.each(function(val, cursor) {
            cb(cursor.key, cursor);
          });
        };
        Collection2.prototype.eachUniqueKey = function(cb) {
          this._ctx.unique = "unique";
          return this.eachKey(cb);
        };
        Collection2.prototype.eachPrimaryKey = function(cb) {
          var ctx = this._ctx;
          ctx.keysOnly = !ctx.isMatch;
          return this.each(function(val, cursor) {
            cb(cursor.primaryKey, cursor);
          });
        };
        Collection2.prototype.keys = function(cb) {
          var ctx = this._ctx;
          ctx.keysOnly = !ctx.isMatch;
          var a = [];
          return this.each(function(item, cursor) {
            a.push(cursor.key);
          }).then(function() {
            return a;
          }).then(cb);
        };
        Collection2.prototype.primaryKeys = function(cb) {
          var ctx = this._ctx;
          if (ctx.dir === "next" && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
            return this._read(function(trans) {
              var index = getIndexOrStore(ctx, ctx.table.core.schema);
              return ctx.table.core.query({
                trans,
                values: false,
                limit: ctx.limit,
                query: {
                  index,
                  range: ctx.range
                }
              });
            }).then(function(_a2) {
              var result = _a2.result;
              return result;
            }).then(cb);
          }
          ctx.keysOnly = !ctx.isMatch;
          var a = [];
          return this.each(function(item, cursor) {
            a.push(cursor.primaryKey);
          }).then(function() {
            return a;
          }).then(cb);
        };
        Collection2.prototype.uniqueKeys = function(cb) {
          this._ctx.unique = "unique";
          return this.keys(cb);
        };
        Collection2.prototype.firstKey = function(cb) {
          return this.limit(1).keys(function(a) {
            return a[0];
          }).then(cb);
        };
        Collection2.prototype.lastKey = function(cb) {
          return this.reverse().firstKey(cb);
        };
        Collection2.prototype.distinct = function() {
          var ctx = this._ctx, idx = ctx.index && ctx.table.schema.idxByName[ctx.index];
          if (!idx || !idx.multi)
            return this;
          var set = {};
          addFilter(this._ctx, function(cursor) {
            var strKey = cursor.primaryKey.toString();
            var found = hasOwn(set, strKey);
            set[strKey] = true;
            return !found;
          });
          return this;
        };
        Collection2.prototype.modify = function(changes) {
          var _this = this;
          var ctx = this._ctx;
          return this._write(function(trans) {
            var modifyer;
            if (typeof changes === "function") {
              modifyer = changes;
            } else {
              var keyPaths = keys(changes);
              var numKeys = keyPaths.length;
              modifyer = function(item) {
                var anythingModified = false;
                for (var i = 0; i < numKeys; ++i) {
                  var keyPath = keyPaths[i];
                  var val = changes[keyPath];
                  var origVal = getByKeyPath(item, keyPath);
                  if (val instanceof PropModification2) {
                    setByKeyPath(item, keyPath, val.execute(origVal));
                    anythingModified = true;
                  } else if (origVal !== val) {
                    setByKeyPath(item, keyPath, val);
                    anythingModified = true;
                  }
                }
                return anythingModified;
              };
            }
            var coreTable = ctx.table.core;
            var _a2 = coreTable.schema.primaryKey, outbound = _a2.outbound, extractKey = _a2.extractKey;
            var limit = 200;
            var modifyChunkSize = _this.db._options.modifyChunkSize;
            if (modifyChunkSize) {
              if (typeof modifyChunkSize == "object") {
                limit = modifyChunkSize[coreTable.name] || modifyChunkSize["*"] || 200;
              } else {
                limit = modifyChunkSize;
              }
            }
            var totalFailures = [];
            var successCount = 0;
            var failedKeys = [];
            var applyMutateResult = function(expectedCount, res) {
              var failures = res.failures, numFailures = res.numFailures;
              successCount += expectedCount - numFailures;
              for (var _i = 0, _a3 = keys(failures); _i < _a3.length; _i++) {
                var pos = _a3[_i];
                totalFailures.push(failures[pos]);
              }
            };
            return _this.clone().primaryKeys().then(function(keys2) {
              var criteria = isPlainKeyRange(ctx) && ctx.limit === Infinity && (typeof changes !== "function" || changes === deleteCallback) && {
                index: ctx.index,
                range: ctx.range
              };
              var nextChunk = function(offset) {
                var count = Math.min(limit, keys2.length - offset);
                return coreTable.getMany({
                  trans,
                  keys: keys2.slice(offset, offset + count),
                  cache: "immutable"
                }).then(function(values) {
                  var addValues = [];
                  var putValues = [];
                  var putKeys = outbound ? [] : null;
                  var deleteKeys = [];
                  for (var i = 0; i < count; ++i) {
                    var origValue = values[i];
                    var ctx_1 = {
                      value: deepClone2(origValue),
                      primKey: keys2[offset + i]
                    };
                    if (modifyer.call(ctx_1, ctx_1.value, ctx_1) !== false) {
                      if (ctx_1.value == null) {
                        deleteKeys.push(keys2[offset + i]);
                      } else if (!outbound && cmp2(extractKey(origValue), extractKey(ctx_1.value)) !== 0) {
                        deleteKeys.push(keys2[offset + i]);
                        addValues.push(ctx_1.value);
                      } else {
                        putValues.push(ctx_1.value);
                        if (outbound)
                          putKeys.push(keys2[offset + i]);
                      }
                    }
                  }
                  return Promise.resolve(addValues.length > 0 && coreTable.mutate({ trans, type: "add", values: addValues }).then(function(res) {
                    for (var pos in res.failures) {
                      deleteKeys.splice(parseInt(pos), 1);
                    }
                    applyMutateResult(addValues.length, res);
                  })).then(function() {
                    return (putValues.length > 0 || criteria && typeof changes === "object") && coreTable.mutate({
                      trans,
                      type: "put",
                      keys: putKeys,
                      values: putValues,
                      criteria,
                      changeSpec: typeof changes !== "function" && changes,
                      isAdditionalChunk: offset > 0
                    }).then(function(res) {
                      return applyMutateResult(putValues.length, res);
                    });
                  }).then(function() {
                    return (deleteKeys.length > 0 || criteria && changes === deleteCallback) && coreTable.mutate({
                      trans,
                      type: "delete",
                      keys: deleteKeys,
                      criteria,
                      isAdditionalChunk: offset > 0
                    }).then(function(res) {
                      return applyMutateResult(deleteKeys.length, res);
                    });
                  }).then(function() {
                    return keys2.length > offset + count && nextChunk(offset + limit);
                  });
                });
              };
              return nextChunk(0).then(function() {
                if (totalFailures.length > 0)
                  throw new ModifyError("Error modifying one or more objects", totalFailures, successCount, failedKeys);
                return keys2.length;
              });
            });
          });
        };
        Collection2.prototype.delete = function() {
          var ctx = this._ctx, range = ctx.range;
          if (isPlainKeyRange(ctx) && (ctx.isPrimKey || range.type === 3)) {
            return this._write(function(trans) {
              var primaryKey = ctx.table.core.schema.primaryKey;
              var coreRange = range;
              return ctx.table.core.count({ trans, query: { index: primaryKey, range: coreRange } }).then(function(count) {
                return ctx.table.core.mutate({ trans, type: "deleteRange", range: coreRange }).then(function(_a2) {
                  var failures = _a2.failures;
                  _a2.lastResult;
                  _a2.results;
                  var numFailures = _a2.numFailures;
                  if (numFailures)
                    throw new ModifyError("Could not delete some values", Object.keys(failures).map(function(pos) {
                      return failures[pos];
                    }), count - numFailures);
                  return count - numFailures;
                });
              });
            });
          }
          return this.modify(deleteCallback);
        };
        return Collection2;
      }();
      var deleteCallback = function(value, ctx) {
        return ctx.value = null;
      };
      function createCollectionConstructor(db) {
        return makeClassConstructor(Collection.prototype, function Collection2(whereClause, keyRangeGenerator) {
          this.db = db;
          var keyRange = AnyRange, error = null;
          if (keyRangeGenerator)
            try {
              keyRange = keyRangeGenerator();
            } catch (ex) {
              error = ex;
            }
          var whereCtx = whereClause._ctx;
          var table = whereCtx.table;
          var readingHook = table.hook.reading.fire;
          this._ctx = {
            table,
            index: whereCtx.index,
            isPrimKey: !whereCtx.index || table.schema.primKey.keyPath && whereCtx.index === table.schema.primKey.name,
            range: keyRange,
            keysOnly: false,
            dir: "next",
            unique: "",
            algorithm: null,
            filter: null,
            replayFilter: null,
            justLimit: true,
            isMatch: null,
            offset: 0,
            limit: Infinity,
            error,
            or: whereCtx.or,
            valueMapper: readingHook !== mirror ? readingHook : null
          };
        });
      }
      function simpleCompare(a, b) {
        return a < b ? -1 : a === b ? 0 : 1;
      }
      function simpleCompareReverse(a, b) {
        return a > b ? -1 : a === b ? 0 : 1;
      }
      function fail(collectionOrWhereClause, err, T) {
        var collection = collectionOrWhereClause instanceof WhereClause ? new collectionOrWhereClause.Collection(collectionOrWhereClause) : collectionOrWhereClause;
        collection._ctx.error = T ? new T(err) : new TypeError(err);
        return collection;
      }
      function emptyCollection(whereClause) {
        return new whereClause.Collection(whereClause, function() {
          return rangeEqual("");
        }).limit(0);
      }
      function upperFactory(dir) {
        return dir === "next" ? function(s) {
          return s.toUpperCase();
        } : function(s) {
          return s.toLowerCase();
        };
      }
      function lowerFactory(dir) {
        return dir === "next" ? function(s) {
          return s.toLowerCase();
        } : function(s) {
          return s.toUpperCase();
        };
      }
      function nextCasing(key, lowerKey, upperNeedle, lowerNeedle, cmp3, dir) {
        var length = Math.min(key.length, lowerNeedle.length);
        var llp = -1;
        for (var i = 0; i < length; ++i) {
          var lwrKeyChar = lowerKey[i];
          if (lwrKeyChar !== lowerNeedle[i]) {
            if (cmp3(key[i], upperNeedle[i]) < 0)
              return key.substr(0, i) + upperNeedle[i] + upperNeedle.substr(i + 1);
            if (cmp3(key[i], lowerNeedle[i]) < 0)
              return key.substr(0, i) + lowerNeedle[i] + upperNeedle.substr(i + 1);
            if (llp >= 0)
              return key.substr(0, llp) + lowerKey[llp] + upperNeedle.substr(llp + 1);
            return null;
          }
          if (cmp3(key[i], lwrKeyChar) < 0)
            llp = i;
        }
        if (length < lowerNeedle.length && dir === "next")
          return key + upperNeedle.substr(key.length);
        if (length < key.length && dir === "prev")
          return key.substr(0, upperNeedle.length);
        return llp < 0 ? null : key.substr(0, llp) + lowerNeedle[llp] + upperNeedle.substr(llp + 1);
      }
      function addIgnoreCaseAlgorithm(whereClause, match, needles, suffix) {
        var upper, lower, compare3, upperNeedles, lowerNeedles, direction, nextKeySuffix, needlesLen = needles.length;
        if (!needles.every(function(s) {
          return typeof s === "string";
        })) {
          return fail(whereClause, STRING_EXPECTED);
        }
        function initDirection(dir) {
          upper = upperFactory(dir);
          lower = lowerFactory(dir);
          compare3 = dir === "next" ? simpleCompare : simpleCompareReverse;
          var needleBounds = needles.map(function(needle) {
            return { lower: lower(needle), upper: upper(needle) };
          }).sort(function(a, b) {
            return compare3(a.lower, b.lower);
          });
          upperNeedles = needleBounds.map(function(nb) {
            return nb.upper;
          });
          lowerNeedles = needleBounds.map(function(nb) {
            return nb.lower;
          });
          direction = dir;
          nextKeySuffix = dir === "next" ? "" : suffix;
        }
        initDirection("next");
        var c = new whereClause.Collection(whereClause, function() {
          return createRange(upperNeedles[0], lowerNeedles[needlesLen - 1] + suffix);
        });
        c._ondirectionchange = function(direction2) {
          initDirection(direction2);
        };
        var firstPossibleNeedle = 0;
        c._addAlgorithm(function(cursor, advance, resolve2) {
          var key = cursor.key;
          if (typeof key !== "string")
            return false;
          var lowerKey = lower(key);
          if (match(lowerKey, lowerNeedles, firstPossibleNeedle)) {
            return true;
          } else {
            var lowestPossibleCasing = null;
            for (var i = firstPossibleNeedle; i < needlesLen; ++i) {
              var casing = nextCasing(key, lowerKey, upperNeedles[i], lowerNeedles[i], compare3, direction);
              if (casing === null && lowestPossibleCasing === null)
                firstPossibleNeedle = i + 1;
              else if (lowestPossibleCasing === null || compare3(lowestPossibleCasing, casing) > 0) {
                lowestPossibleCasing = casing;
              }
            }
            if (lowestPossibleCasing !== null) {
              advance(function() {
                cursor.continue(lowestPossibleCasing + nextKeySuffix);
              });
            } else {
              advance(resolve2);
            }
            return false;
          }
        });
        return c;
      }
      function createRange(lower, upper, lowerOpen, upperOpen) {
        return {
          type: 2,
          lower,
          upper,
          lowerOpen,
          upperOpen
        };
      }
      function rangeEqual(value) {
        return {
          type: 1,
          lower: value,
          upper: value
        };
      }
      var WhereClause = function() {
        function WhereClause2() {
        }
        Object.defineProperty(WhereClause2.prototype, "Collection", {
          get: function() {
            return this._ctx.table.db.Collection;
          },
          enumerable: false,
          configurable: true
        });
        WhereClause2.prototype.between = function(lower, upper, includeLower, includeUpper) {
          includeLower = includeLower !== false;
          includeUpper = includeUpper === true;
          try {
            if (this._cmp(lower, upper) > 0 || this._cmp(lower, upper) === 0 && (includeLower || includeUpper) && !(includeLower && includeUpper))
              return emptyCollection(this);
            return new this.Collection(this, function() {
              return createRange(lower, upper, !includeLower, !includeUpper);
            });
          } catch (e) {
            return fail(this, INVALID_KEY_ARGUMENT);
          }
        };
        WhereClause2.prototype.equals = function(value) {
          if (value == null)
            return fail(this, INVALID_KEY_ARGUMENT);
          return new this.Collection(this, function() {
            return rangeEqual(value);
          });
        };
        WhereClause2.prototype.above = function(value) {
          if (value == null)
            return fail(this, INVALID_KEY_ARGUMENT);
          return new this.Collection(this, function() {
            return createRange(value, void 0, true);
          });
        };
        WhereClause2.prototype.aboveOrEqual = function(value) {
          if (value == null)
            return fail(this, INVALID_KEY_ARGUMENT);
          return new this.Collection(this, function() {
            return createRange(value, void 0, false);
          });
        };
        WhereClause2.prototype.below = function(value) {
          if (value == null)
            return fail(this, INVALID_KEY_ARGUMENT);
          return new this.Collection(this, function() {
            return createRange(void 0, value, false, true);
          });
        };
        WhereClause2.prototype.belowOrEqual = function(value) {
          if (value == null)
            return fail(this, INVALID_KEY_ARGUMENT);
          return new this.Collection(this, function() {
            return createRange(void 0, value);
          });
        };
        WhereClause2.prototype.startsWith = function(str) {
          if (typeof str !== "string")
            return fail(this, STRING_EXPECTED);
          return this.between(str, str + maxString, true, true);
        };
        WhereClause2.prototype.startsWithIgnoreCase = function(str) {
          if (str === "")
            return this.startsWith(str);
          return addIgnoreCaseAlgorithm(this, function(x, a) {
            return x.indexOf(a[0]) === 0;
          }, [str], maxString);
        };
        WhereClause2.prototype.equalsIgnoreCase = function(str) {
          return addIgnoreCaseAlgorithm(this, function(x, a) {
            return x === a[0];
          }, [str], "");
        };
        WhereClause2.prototype.anyOfIgnoreCase = function() {
          var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
          if (set.length === 0)
            return emptyCollection(this);
          return addIgnoreCaseAlgorithm(this, function(x, a) {
            return a.indexOf(x) !== -1;
          }, set, "");
        };
        WhereClause2.prototype.startsWithAnyOfIgnoreCase = function() {
          var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
          if (set.length === 0)
            return emptyCollection(this);
          return addIgnoreCaseAlgorithm(this, function(x, a) {
            return a.some(function(n) {
              return x.indexOf(n) === 0;
            });
          }, set, maxString);
        };
        WhereClause2.prototype.anyOf = function() {
          var _this = this;
          var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
          var compare3 = this._cmp;
          try {
            set.sort(compare3);
          } catch (e) {
            return fail(this, INVALID_KEY_ARGUMENT);
          }
          if (set.length === 0)
            return emptyCollection(this);
          var c = new this.Collection(this, function() {
            return createRange(set[0], set[set.length - 1]);
          });
          c._ondirectionchange = function(direction) {
            compare3 = direction === "next" ? _this._ascending : _this._descending;
            set.sort(compare3);
          };
          var i = 0;
          c._addAlgorithm(function(cursor, advance, resolve2) {
            var key = cursor.key;
            while (compare3(key, set[i]) > 0) {
              ++i;
              if (i === set.length) {
                advance(resolve2);
                return false;
              }
            }
            if (compare3(key, set[i]) === 0) {
              return true;
            } else {
              advance(function() {
                cursor.continue(set[i]);
              });
              return false;
            }
          });
          return c;
        };
        WhereClause2.prototype.notEqual = function(value) {
          return this.inAnyRange([[minKey, value], [value, this.db._maxKey]], { includeLowers: false, includeUppers: false });
        };
        WhereClause2.prototype.noneOf = function() {
          var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
          if (set.length === 0)
            return new this.Collection(this);
          try {
            set.sort(this._ascending);
          } catch (e) {
            return fail(this, INVALID_KEY_ARGUMENT);
          }
          var ranges = set.reduce(function(res, val) {
            return res ? res.concat([[res[res.length - 1][1], val]]) : [[minKey, val]];
          }, null);
          ranges.push([set[set.length - 1], this.db._maxKey]);
          return this.inAnyRange(ranges, { includeLowers: false, includeUppers: false });
        };
        WhereClause2.prototype.inAnyRange = function(ranges, options) {
          var _this = this;
          var cmp3 = this._cmp, ascending = this._ascending, descending = this._descending, min = this._min, max = this._max;
          if (ranges.length === 0)
            return emptyCollection(this);
          if (!ranges.every(function(range) {
            return range[0] !== void 0 && range[1] !== void 0 && ascending(range[0], range[1]) <= 0;
          })) {
            return fail(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", exceptions.InvalidArgument);
          }
          var includeLowers = !options || options.includeLowers !== false;
          var includeUppers = options && options.includeUppers === true;
          function addRange2(ranges2, newRange) {
            var i = 0, l = ranges2.length;
            for (; i < l; ++i) {
              var range = ranges2[i];
              if (cmp3(newRange[0], range[1]) < 0 && cmp3(newRange[1], range[0]) > 0) {
                range[0] = min(range[0], newRange[0]);
                range[1] = max(range[1], newRange[1]);
                break;
              }
            }
            if (i === l)
              ranges2.push(newRange);
            return ranges2;
          }
          var sortDirection = ascending;
          function rangeSorter(a, b) {
            return sortDirection(a[0], b[0]);
          }
          var set;
          try {
            set = ranges.reduce(addRange2, []);
            set.sort(rangeSorter);
          } catch (ex) {
            return fail(this, INVALID_KEY_ARGUMENT);
          }
          var rangePos = 0;
          var keyIsBeyondCurrentEntry = includeUppers ? function(key) {
            return ascending(key, set[rangePos][1]) > 0;
          } : function(key) {
            return ascending(key, set[rangePos][1]) >= 0;
          };
          var keyIsBeforeCurrentEntry = includeLowers ? function(key) {
            return descending(key, set[rangePos][0]) > 0;
          } : function(key) {
            return descending(key, set[rangePos][0]) >= 0;
          };
          function keyWithinCurrentRange(key) {
            return !keyIsBeyondCurrentEntry(key) && !keyIsBeforeCurrentEntry(key);
          }
          var checkKey = keyIsBeyondCurrentEntry;
          var c = new this.Collection(this, function() {
            return createRange(set[0][0], set[set.length - 1][1], !includeLowers, !includeUppers);
          });
          c._ondirectionchange = function(direction) {
            if (direction === "next") {
              checkKey = keyIsBeyondCurrentEntry;
              sortDirection = ascending;
            } else {
              checkKey = keyIsBeforeCurrentEntry;
              sortDirection = descending;
            }
            set.sort(rangeSorter);
          };
          c._addAlgorithm(function(cursor, advance, resolve2) {
            var key = cursor.key;
            while (checkKey(key)) {
              ++rangePos;
              if (rangePos === set.length) {
                advance(resolve2);
                return false;
              }
            }
            if (keyWithinCurrentRange(key)) {
              return true;
            } else if (_this._cmp(key, set[rangePos][1]) === 0 || _this._cmp(key, set[rangePos][0]) === 0) {
              return false;
            } else {
              advance(function() {
                if (sortDirection === ascending)
                  cursor.continue(set[rangePos][0]);
                else
                  cursor.continue(set[rangePos][1]);
              });
              return false;
            }
          });
          return c;
        };
        WhereClause2.prototype.startsWithAnyOf = function() {
          var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
          if (!set.every(function(s) {
            return typeof s === "string";
          })) {
            return fail(this, "startsWithAnyOf() only works with strings");
          }
          if (set.length === 0)
            return emptyCollection(this);
          return this.inAnyRange(set.map(function(str) {
            return [str, str + maxString];
          }));
        };
        return WhereClause2;
      }();
      function createWhereClauseConstructor(db) {
        return makeClassConstructor(WhereClause.prototype, function WhereClause2(table, index, orCollection) {
          this.db = db;
          this._ctx = {
            table,
            index: index === ":id" ? null : index,
            or: orCollection
          };
          this._cmp = this._ascending = cmp2;
          this._descending = function(a, b) {
            return cmp2(b, a);
          };
          this._max = function(a, b) {
            return cmp2(a, b) > 0 ? a : b;
          };
          this._min = function(a, b) {
            return cmp2(a, b) < 0 ? a : b;
          };
          this._IDBKeyRange = db._deps.IDBKeyRange;
          if (!this._IDBKeyRange)
            throw new exceptions.MissingAPI();
        });
      }
      function eventRejectHandler(reject) {
        return wrap(function(event) {
          preventDefault(event);
          reject(event.target.error);
          return false;
        });
      }
      function preventDefault(event) {
        if (event.stopPropagation)
          event.stopPropagation();
        if (event.preventDefault)
          event.preventDefault();
      }
      var DEXIE_STORAGE_MUTATED_EVENT_NAME = "storagemutated";
      var STORAGE_MUTATED_DOM_EVENT_NAME = "x-storagemutated-1";
      var globalEvents = Events(null, DEXIE_STORAGE_MUTATED_EVENT_NAME);
      var Transaction = function() {
        function Transaction2() {
        }
        Transaction2.prototype._lock = function() {
          assert2(!PSD.global);
          ++this._reculock;
          if (this._reculock === 1 && !PSD.global)
            PSD.lockOwnerFor = this;
          return this;
        };
        Transaction2.prototype._unlock = function() {
          assert2(!PSD.global);
          if (--this._reculock === 0) {
            if (!PSD.global)
              PSD.lockOwnerFor = null;
            while (this._blockedFuncs.length > 0 && !this._locked()) {
              var fnAndPSD = this._blockedFuncs.shift();
              try {
                usePSD(fnAndPSD[1], fnAndPSD[0]);
              } catch (e) {
              }
            }
          }
          return this;
        };
        Transaction2.prototype._locked = function() {
          return this._reculock && PSD.lockOwnerFor !== this;
        };
        Transaction2.prototype.create = function(idbtrans) {
          var _this = this;
          if (!this.mode)
            return this;
          var idbdb = this.db.idbdb;
          var dbOpenError = this.db._state.dbOpenError;
          assert2(!this.idbtrans);
          if (!idbtrans && !idbdb) {
            switch (dbOpenError && dbOpenError.name) {
              case "DatabaseClosedError":
                throw new exceptions.DatabaseClosed(dbOpenError);
              case "MissingAPIError":
                throw new exceptions.MissingAPI(dbOpenError.message, dbOpenError);
              default:
                throw new exceptions.OpenFailed(dbOpenError);
            }
          }
          if (!this.active)
            throw new exceptions.TransactionInactive();
          assert2(this._completion._state === null);
          idbtrans = this.idbtrans = idbtrans || (this.db.core ? this.db.core.transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability }) : idbdb.transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability }));
          idbtrans.onerror = wrap(function(ev) {
            preventDefault(ev);
            _this._reject(idbtrans.error);
          });
          idbtrans.onabort = wrap(function(ev) {
            preventDefault(ev);
            _this.active && _this._reject(new exceptions.Abort(idbtrans.error));
            _this.active = false;
            _this.on("abort").fire(ev);
          });
          idbtrans.oncomplete = wrap(function() {
            _this.active = false;
            _this._resolve();
            if ("mutatedParts" in idbtrans) {
              globalEvents.storagemutated.fire(idbtrans["mutatedParts"]);
            }
          });
          return this;
        };
        Transaction2.prototype._promise = function(mode, fn, bWriteLock) {
          var _this = this;
          if (mode === "readwrite" && this.mode !== "readwrite")
            return rejection(new exceptions.ReadOnly("Transaction is readonly"));
          if (!this.active)
            return rejection(new exceptions.TransactionInactive());
          if (this._locked()) {
            return new DexiePromise(function(resolve2, reject) {
              _this._blockedFuncs.push([function() {
                _this._promise(mode, fn, bWriteLock).then(resolve2, reject);
              }, PSD]);
            });
          } else if (bWriteLock) {
            return newScope(function() {
              var p2 = new DexiePromise(function(resolve2, reject) {
                _this._lock();
                var rv = fn(resolve2, reject, _this);
                if (rv && rv.then)
                  rv.then(resolve2, reject);
              });
              p2.finally(function() {
                return _this._unlock();
              });
              p2._lib = true;
              return p2;
            });
          } else {
            var p = new DexiePromise(function(resolve2, reject) {
              var rv = fn(resolve2, reject, _this);
              if (rv && rv.then)
                rv.then(resolve2, reject);
            });
            p._lib = true;
            return p;
          }
        };
        Transaction2.prototype._root = function() {
          return this.parent ? this.parent._root() : this;
        };
        Transaction2.prototype.waitFor = function(promiseLike) {
          var root = this._root();
          var promise = DexiePromise.resolve(promiseLike);
          if (root._waitingFor) {
            root._waitingFor = root._waitingFor.then(function() {
              return promise;
            });
          } else {
            root._waitingFor = promise;
            root._waitingQueue = [];
            var store = root.idbtrans.objectStore(root.storeNames[0]);
            (function spin() {
              ++root._spinCount;
              while (root._waitingQueue.length)
                root._waitingQueue.shift()();
              if (root._waitingFor)
                store.get(-Infinity).onsuccess = spin;
            })();
          }
          var currentWaitPromise = root._waitingFor;
          return new DexiePromise(function(resolve2, reject) {
            promise.then(function(res) {
              return root._waitingQueue.push(wrap(resolve2.bind(null, res)));
            }, function(err) {
              return root._waitingQueue.push(wrap(reject.bind(null, err)));
            }).finally(function() {
              if (root._waitingFor === currentWaitPromise) {
                root._waitingFor = null;
              }
            });
          });
        };
        Transaction2.prototype.abort = function() {
          if (this.active) {
            this.active = false;
            if (this.idbtrans)
              this.idbtrans.abort();
            this._reject(new exceptions.Abort());
          }
        };
        Transaction2.prototype.table = function(tableName) {
          var memoizedTables = this._memoizedTables || (this._memoizedTables = {});
          if (hasOwn(memoizedTables, tableName))
            return memoizedTables[tableName];
          var tableSchema = this.schema[tableName];
          if (!tableSchema) {
            throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
          }
          var transactionBoundTable = new this.db.Table(tableName, tableSchema, this);
          transactionBoundTable.core = this.db.core.table(tableName);
          memoizedTables[tableName] = transactionBoundTable;
          return transactionBoundTable;
        };
        return Transaction2;
      }();
      function createTransactionConstructor(db) {
        return makeClassConstructor(Transaction.prototype, function Transaction2(mode, storeNames, dbschema, chromeTransactionDurability, parent) {
          var _this = this;
          this.db = db;
          this.mode = mode;
          this.storeNames = storeNames;
          this.schema = dbschema;
          this.chromeTransactionDurability = chromeTransactionDurability;
          this.idbtrans = null;
          this.on = Events(this, "complete", "error", "abort");
          this.parent = parent || null;
          this.active = true;
          this._reculock = 0;
          this._blockedFuncs = [];
          this._resolve = null;
          this._reject = null;
          this._waitingFor = null;
          this._waitingQueue = null;
          this._spinCount = 0;
          this._completion = new DexiePromise(function(resolve2, reject) {
            _this._resolve = resolve2;
            _this._reject = reject;
          });
          this._completion.then(function() {
            _this.active = false;
            _this.on.complete.fire();
          }, function(e) {
            var wasActive = _this.active;
            _this.active = false;
            _this.on.error.fire(e);
            _this.parent ? _this.parent._reject(e) : wasActive && _this.idbtrans && _this.idbtrans.abort();
            return rejection(e);
          });
        });
      }
      function createIndexSpec(name, keyPath, unique2, multi, auto, compound, isPrimKey) {
        return {
          name,
          keyPath,
          unique: unique2,
          multi,
          auto,
          compound,
          src: (unique2 && !isPrimKey ? "&" : "") + (multi ? "*" : "") + (auto ? "++" : "") + nameFromKeyPath(keyPath)
        };
      }
      function nameFromKeyPath(keyPath) {
        return typeof keyPath === "string" ? keyPath : keyPath ? "[" + [].join.call(keyPath, "+") + "]" : "";
      }
      function createTableSchema(name, primKey, indexes) {
        return {
          name,
          primKey,
          indexes,
          mappedClass: null,
          idxByName: arrayToObject(indexes, function(index) {
            return [index.name, index];
          })
        };
      }
      function safariMultiStoreFix(storeNames) {
        return storeNames.length === 1 ? storeNames[0] : storeNames;
      }
      var getMaxKey = function(IdbKeyRange) {
        try {
          IdbKeyRange.only([[]]);
          getMaxKey = function() {
            return [[]];
          };
          return [[]];
        } catch (e) {
          getMaxKey = function() {
            return maxString;
          };
          return maxString;
        }
      };
      function getKeyExtractor(keyPath) {
        if (keyPath == null) {
          return function() {
            return void 0;
          };
        } else if (typeof keyPath === "string") {
          return getSinglePathKeyExtractor(keyPath);
        } else {
          return function(obj) {
            return getByKeyPath(obj, keyPath);
          };
        }
      }
      function getSinglePathKeyExtractor(keyPath) {
        var split = keyPath.split(".");
        if (split.length === 1) {
          return function(obj) {
            return obj[keyPath];
          };
        } else {
          return function(obj) {
            return getByKeyPath(obj, keyPath);
          };
        }
      }
      function arrayify(arrayLike) {
        return [].slice.call(arrayLike);
      }
      var _id_counter = 0;
      function getKeyPathAlias(keyPath) {
        return keyPath == null ? ":id" : typeof keyPath === "string" ? keyPath : "[".concat(keyPath.join("+"), "]");
      }
      function createDBCore(db, IdbKeyRange, tmpTrans) {
        function extractSchema(db2, trans) {
          var tables2 = arrayify(db2.objectStoreNames);
          return {
            schema: {
              name: db2.name,
              tables: tables2.map(function(table) {
                return trans.objectStore(table);
              }).map(function(store) {
                var keyPath = store.keyPath, autoIncrement = store.autoIncrement;
                var compound = isArray4(keyPath);
                var outbound = keyPath == null;
                var indexByKeyPath = {};
                var result = {
                  name: store.name,
                  primaryKey: {
                    name: null,
                    isPrimaryKey: true,
                    outbound,
                    compound,
                    keyPath,
                    autoIncrement,
                    unique: true,
                    extractKey: getKeyExtractor(keyPath)
                  },
                  indexes: arrayify(store.indexNames).map(function(indexName) {
                    return store.index(indexName);
                  }).map(function(index) {
                    var name = index.name, unique2 = index.unique, multiEntry = index.multiEntry, keyPath2 = index.keyPath;
                    var compound2 = isArray4(keyPath2);
                    var result2 = {
                      name,
                      compound: compound2,
                      keyPath: keyPath2,
                      unique: unique2,
                      multiEntry,
                      extractKey: getKeyExtractor(keyPath2)
                    };
                    indexByKeyPath[getKeyPathAlias(keyPath2)] = result2;
                    return result2;
                  }),
                  getIndexByKeyPath: function(keyPath2) {
                    return indexByKeyPath[getKeyPathAlias(keyPath2)];
                  }
                };
                indexByKeyPath[":id"] = result.primaryKey;
                if (keyPath != null) {
                  indexByKeyPath[getKeyPathAlias(keyPath)] = result.primaryKey;
                }
                return result;
              })
            },
            hasGetAll: tables2.length > 0 && "getAll" in trans.objectStore(tables2[0]) && !(typeof navigator !== "undefined" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604)
          };
        }
        function makeIDBKeyRange(range) {
          if (range.type === 3)
            return null;
          if (range.type === 4)
            throw new Error("Cannot convert never type to IDBKeyRange");
          var lower = range.lower, upper = range.upper, lowerOpen = range.lowerOpen, upperOpen = range.upperOpen;
          var idbRange = lower === void 0 ? upper === void 0 ? null : IdbKeyRange.upperBound(upper, !!upperOpen) : upper === void 0 ? IdbKeyRange.lowerBound(lower, !!lowerOpen) : IdbKeyRange.bound(lower, upper, !!lowerOpen, !!upperOpen);
          return idbRange;
        }
        function createDbCoreTable(tableSchema) {
          var tableName = tableSchema.name;
          function mutate(_a3) {
            var trans = _a3.trans, type6 = _a3.type, keys2 = _a3.keys, values = _a3.values, range = _a3.range;
            return new Promise(function(resolve2, reject) {
              resolve2 = wrap(resolve2);
              var store = trans.objectStore(tableName);
              var outbound = store.keyPath == null;
              var isAddOrPut = type6 === "put" || type6 === "add";
              if (!isAddOrPut && type6 !== "delete" && type6 !== "deleteRange")
                throw new Error("Invalid operation type: " + type6);
              var length = (keys2 || values || { length: 1 }).length;
              if (keys2 && values && keys2.length !== values.length) {
                throw new Error("Given keys array must have same length as given values array.");
              }
              if (length === 0)
                return resolve2({ numFailures: 0, failures: {}, results: [], lastResult: void 0 });
              var req;
              var reqs = [];
              var failures = [];
              var numFailures = 0;
              var errorHandler = function(event) {
                ++numFailures;
                preventDefault(event);
              };
              if (type6 === "deleteRange") {
                if (range.type === 4)
                  return resolve2({ numFailures, failures, results: [], lastResult: void 0 });
                if (range.type === 3)
                  reqs.push(req = store.clear());
                else
                  reqs.push(req = store.delete(makeIDBKeyRange(range)));
              } else {
                var _a4 = isAddOrPut ? outbound ? [values, keys2] : [values, null] : [keys2, null], args1 = _a4[0], args2 = _a4[1];
                if (isAddOrPut) {
                  for (var i = 0; i < length; ++i) {
                    reqs.push(req = args2 && args2[i] !== void 0 ? store[type6](args1[i], args2[i]) : store[type6](args1[i]));
                    req.onerror = errorHandler;
                  }
                } else {
                  for (var i = 0; i < length; ++i) {
                    reqs.push(req = store[type6](args1[i]));
                    req.onerror = errorHandler;
                  }
                }
              }
              var done = function(event) {
                var lastResult = event.target.result;
                reqs.forEach(function(req2, i2) {
                  return req2.error != null && (failures[i2] = req2.error);
                });
                resolve2({
                  numFailures,
                  failures,
                  results: type6 === "delete" ? keys2 : reqs.map(function(req2) {
                    return req2.result;
                  }),
                  lastResult
                });
              };
              req.onerror = function(event) {
                errorHandler(event);
                done(event);
              };
              req.onsuccess = done;
            });
          }
          function openCursor2(_a3) {
            var trans = _a3.trans, values = _a3.values, query2 = _a3.query, reverse = _a3.reverse, unique2 = _a3.unique;
            return new Promise(function(resolve2, reject) {
              resolve2 = wrap(resolve2);
              var index = query2.index, range = query2.range;
              var store = trans.objectStore(tableName);
              var source = index.isPrimaryKey ? store : store.index(index.name);
              var direction = reverse ? unique2 ? "prevunique" : "prev" : unique2 ? "nextunique" : "next";
              var req = values || !("openKeyCursor" in source) ? source.openCursor(makeIDBKeyRange(range), direction) : source.openKeyCursor(makeIDBKeyRange(range), direction);
              req.onerror = eventRejectHandler(reject);
              req.onsuccess = wrap(function(ev) {
                var cursor = req.result;
                if (!cursor) {
                  resolve2(null);
                  return;
                }
                cursor.___id = ++_id_counter;
                cursor.done = false;
                var _cursorContinue = cursor.continue.bind(cursor);
                var _cursorContinuePrimaryKey = cursor.continuePrimaryKey;
                if (_cursorContinuePrimaryKey)
                  _cursorContinuePrimaryKey = _cursorContinuePrimaryKey.bind(cursor);
                var _cursorAdvance = cursor.advance.bind(cursor);
                var doThrowCursorIsNotStarted = function() {
                  throw new Error("Cursor not started");
                };
                var doThrowCursorIsStopped = function() {
                  throw new Error("Cursor not stopped");
                };
                cursor.trans = trans;
                cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsNotStarted;
                cursor.fail = wrap(reject);
                cursor.next = function() {
                  var _this = this;
                  var gotOne = 1;
                  return this.start(function() {
                    return gotOne-- ? _this.continue() : _this.stop();
                  }).then(function() {
                    return _this;
                  });
                };
                cursor.start = function(callback) {
                  var iterationPromise = new Promise(function(resolveIteration, rejectIteration) {
                    resolveIteration = wrap(resolveIteration);
                    req.onerror = eventRejectHandler(rejectIteration);
                    cursor.fail = rejectIteration;
                    cursor.stop = function(value) {
                      cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsStopped;
                      resolveIteration(value);
                    };
                  });
                  var guardedCallback = function() {
                    if (req.result) {
                      try {
                        callback();
                      } catch (err) {
                        cursor.fail(err);
                      }
                    } else {
                      cursor.done = true;
                      cursor.start = function() {
                        throw new Error("Cursor behind last entry");
                      };
                      cursor.stop();
                    }
                  };
                  req.onsuccess = wrap(function(ev2) {
                    req.onsuccess = guardedCallback;
                    guardedCallback();
                  });
                  cursor.continue = _cursorContinue;
                  cursor.continuePrimaryKey = _cursorContinuePrimaryKey;
                  cursor.advance = _cursorAdvance;
                  guardedCallback();
                  return iterationPromise;
                };
                resolve2(cursor);
              }, reject);
            });
          }
          function query(hasGetAll2) {
            return function(request) {
              return new Promise(function(resolve2, reject) {
                resolve2 = wrap(resolve2);
                var trans = request.trans, values = request.values, limit = request.limit, query2 = request.query;
                var nonInfinitLimit = limit === Infinity ? void 0 : limit;
                var index = query2.index, range = query2.range;
                var store = trans.objectStore(tableName);
                var source = index.isPrimaryKey ? store : store.index(index.name);
                var idbKeyRange = makeIDBKeyRange(range);
                if (limit === 0)
                  return resolve2({ result: [] });
                if (hasGetAll2) {
                  var req = values ? source.getAll(idbKeyRange, nonInfinitLimit) : source.getAllKeys(idbKeyRange, nonInfinitLimit);
                  req.onsuccess = function(event) {
                    return resolve2({ result: event.target.result });
                  };
                  req.onerror = eventRejectHandler(reject);
                } else {
                  var count_1 = 0;
                  var req_1 = values || !("openKeyCursor" in source) ? source.openCursor(idbKeyRange) : source.openKeyCursor(idbKeyRange);
                  var result_1 = [];
                  req_1.onsuccess = function(event) {
                    var cursor = req_1.result;
                    if (!cursor)
                      return resolve2({ result: result_1 });
                    result_1.push(values ? cursor.value : cursor.primaryKey);
                    if (++count_1 === limit)
                      return resolve2({ result: result_1 });
                    cursor.continue();
                  };
                  req_1.onerror = eventRejectHandler(reject);
                }
              });
            };
          }
          return {
            name: tableName,
            schema: tableSchema,
            mutate,
            getMany: function(_a3) {
              var trans = _a3.trans, keys2 = _a3.keys;
              return new Promise(function(resolve2, reject) {
                resolve2 = wrap(resolve2);
                var store = trans.objectStore(tableName);
                var length = keys2.length;
                var result = new Array(length);
                var keyCount = 0;
                var callbackCount = 0;
                var req;
                var successHandler = function(event) {
                  var req2 = event.target;
                  if ((result[req2._pos] = req2.result) != null)
                    ;
                  if (++callbackCount === keyCount)
                    resolve2(result);
                };
                var errorHandler = eventRejectHandler(reject);
                for (var i = 0; i < length; ++i) {
                  var key = keys2[i];
                  if (key != null) {
                    req = store.get(keys2[i]);
                    req._pos = i;
                    req.onsuccess = successHandler;
                    req.onerror = errorHandler;
                    ++keyCount;
                  }
                }
                if (keyCount === 0)
                  resolve2(result);
              });
            },
            get: function(_a3) {
              var trans = _a3.trans, key = _a3.key;
              return new Promise(function(resolve2, reject) {
                resolve2 = wrap(resolve2);
                var store = trans.objectStore(tableName);
                var req = store.get(key);
                req.onsuccess = function(event) {
                  return resolve2(event.target.result);
                };
                req.onerror = eventRejectHandler(reject);
              });
            },
            query: query(hasGetAll),
            openCursor: openCursor2,
            count: function(_a3) {
              var query2 = _a3.query, trans = _a3.trans;
              var index = query2.index, range = query2.range;
              return new Promise(function(resolve2, reject) {
                var store = trans.objectStore(tableName);
                var source = index.isPrimaryKey ? store : store.index(index.name);
                var idbKeyRange = makeIDBKeyRange(range);
                var req = idbKeyRange ? source.count(idbKeyRange) : source.count();
                req.onsuccess = wrap(function(ev) {
                  return resolve2(ev.target.result);
                });
                req.onerror = eventRejectHandler(reject);
              });
            }
          };
        }
        var _a2 = extractSchema(db, tmpTrans), schema = _a2.schema, hasGetAll = _a2.hasGetAll;
        var tables = schema.tables.map(function(tableSchema) {
          return createDbCoreTable(tableSchema);
        });
        var tableMap = {};
        tables.forEach(function(table) {
          return tableMap[table.name] = table;
        });
        return {
          stack: "dbcore",
          transaction: db.transaction.bind(db),
          table: function(name) {
            var result = tableMap[name];
            if (!result)
              throw new Error("Table '".concat(name, "' not found"));
            return tableMap[name];
          },
          MIN_KEY: -Infinity,
          MAX_KEY: getMaxKey(IdbKeyRange),
          schema
        };
      }
      function createMiddlewareStack(stackImpl, middlewares) {
        return middlewares.reduce(function(down, _a2) {
          var create5 = _a2.create;
          return __assign(__assign({}, down), create5(down));
        }, stackImpl);
      }
      function createMiddlewareStacks(middlewares, idbdb, _a2, tmpTrans) {
        var IDBKeyRange2 = _a2.IDBKeyRange;
        _a2.indexedDB;
        var dbcore = createMiddlewareStack(createDBCore(idbdb, IDBKeyRange2, tmpTrans), middlewares.dbcore);
        return {
          dbcore
        };
      }
      function generateMiddlewareStacks(db, tmpTrans) {
        var idbdb = tmpTrans.db;
        var stacks = createMiddlewareStacks(db._middlewares, idbdb, db._deps, tmpTrans);
        db.core = stacks.dbcore;
        db.tables.forEach(function(table) {
          var tableName = table.name;
          if (db.core.schema.tables.some(function(tbl) {
            return tbl.name === tableName;
          })) {
            table.core = db.core.table(tableName);
            if (db[tableName] instanceof db.Table) {
              db[tableName].core = table.core;
            }
          }
        });
      }
      function setApiOnPlace(db, objs, tableNames, dbschema) {
        tableNames.forEach(function(tableName) {
          var schema = dbschema[tableName];
          objs.forEach(function(obj) {
            var propDesc = getPropertyDescriptor(obj, tableName);
            if (!propDesc || "value" in propDesc && propDesc.value === void 0) {
              if (obj === db.Transaction.prototype || obj instanceof db.Transaction) {
                setProp(obj, tableName, {
                  get: function() {
                    return this.table(tableName);
                  },
                  set: function(value) {
                    defineProperty(this, tableName, { value, writable: true, configurable: true, enumerable: true });
                  }
                });
              } else {
                obj[tableName] = new db.Table(tableName, schema);
              }
            }
          });
        });
      }
      function removeTablesApi(db, objs) {
        objs.forEach(function(obj) {
          for (var key in obj) {
            if (obj[key] instanceof db.Table)
              delete obj[key];
          }
        });
      }
      function lowerVersionFirst(a, b) {
        return a._cfg.version - b._cfg.version;
      }
      function runUpgraders(db, oldVersion, idbUpgradeTrans, reject) {
        var globalSchema = db._dbSchema;
        if (idbUpgradeTrans.objectStoreNames.contains("$meta") && !globalSchema.$meta) {
          globalSchema.$meta = createTableSchema("$meta", parseIndexSyntax("")[0], []);
          db._storeNames.push("$meta");
        }
        var trans = db._createTransaction("readwrite", db._storeNames, globalSchema);
        trans.create(idbUpgradeTrans);
        trans._completion.catch(reject);
        var rejectTransaction = trans._reject.bind(trans);
        var transless = PSD.transless || PSD;
        newScope(function() {
          PSD.trans = trans;
          PSD.transless = transless;
          if (oldVersion === 0) {
            keys(globalSchema).forEach(function(tableName) {
              createTable(idbUpgradeTrans, tableName, globalSchema[tableName].primKey, globalSchema[tableName].indexes);
            });
            generateMiddlewareStacks(db, idbUpgradeTrans);
            DexiePromise.follow(function() {
              return db.on.populate.fire(trans);
            }).catch(rejectTransaction);
          } else {
            generateMiddlewareStacks(db, idbUpgradeTrans);
            return getExistingVersion(db, trans, oldVersion).then(function(oldVersion2) {
              return updateTablesAndIndexes(db, oldVersion2, trans, idbUpgradeTrans);
            }).catch(rejectTransaction);
          }
        });
      }
      function patchCurrentVersion(db, idbUpgradeTrans) {
        createMissingTables(db._dbSchema, idbUpgradeTrans);
        if (idbUpgradeTrans.db.version % 10 === 0 && !idbUpgradeTrans.objectStoreNames.contains("$meta")) {
          idbUpgradeTrans.db.createObjectStore("$meta").add(Math.ceil(idbUpgradeTrans.db.version / 10 - 1), "version");
        }
        var globalSchema = buildGlobalSchema(db, db.idbdb, idbUpgradeTrans);
        adjustToExistingIndexNames(db, db._dbSchema, idbUpgradeTrans);
        var diff = getSchemaDiff(globalSchema, db._dbSchema);
        var _loop_1 = function(tableChange2) {
          if (tableChange2.change.length || tableChange2.recreate) {
            console.warn("Unable to patch indexes of table ".concat(tableChange2.name, " because it has changes on the type of index or primary key."));
            return { value: void 0 };
          }
          var store = idbUpgradeTrans.objectStore(tableChange2.name);
          tableChange2.add.forEach(function(idx) {
            if (debug)
              console.debug("Dexie upgrade patch: Creating missing index ".concat(tableChange2.name, ".").concat(idx.src));
            addIndex(store, idx);
          });
        };
        for (var _i = 0, _a2 = diff.change; _i < _a2.length; _i++) {
          var tableChange = _a2[_i];
          var state_1 = _loop_1(tableChange);
          if (typeof state_1 === "object")
            return state_1.value;
        }
      }
      function getExistingVersion(db, trans, oldVersion) {
        if (trans.storeNames.includes("$meta")) {
          return trans.table("$meta").get("version").then(function(metaVersion) {
            return metaVersion != null ? metaVersion : oldVersion;
          });
        } else {
          return DexiePromise.resolve(oldVersion);
        }
      }
      function updateTablesAndIndexes(db, oldVersion, trans, idbUpgradeTrans) {
        var queue = [];
        var versions = db._versions;
        var globalSchema = db._dbSchema = buildGlobalSchema(db, db.idbdb, idbUpgradeTrans);
        var versToRun = versions.filter(function(v) {
          return v._cfg.version >= oldVersion;
        });
        if (versToRun.length === 0) {
          return DexiePromise.resolve();
        }
        versToRun.forEach(function(version) {
          queue.push(function() {
            var oldSchema = globalSchema;
            var newSchema = version._cfg.dbschema;
            adjustToExistingIndexNames(db, oldSchema, idbUpgradeTrans);
            adjustToExistingIndexNames(db, newSchema, idbUpgradeTrans);
            globalSchema = db._dbSchema = newSchema;
            var diff = getSchemaDiff(oldSchema, newSchema);
            diff.add.forEach(function(tuple) {
              createTable(idbUpgradeTrans, tuple[0], tuple[1].primKey, tuple[1].indexes);
            });
            diff.change.forEach(function(change) {
              if (change.recreate) {
                throw new exceptions.Upgrade("Not yet support for changing primary key");
              } else {
                var store_1 = idbUpgradeTrans.objectStore(change.name);
                change.add.forEach(function(idx) {
                  return addIndex(store_1, idx);
                });
                change.change.forEach(function(idx) {
                  store_1.deleteIndex(idx.name);
                  addIndex(store_1, idx);
                });
                change.del.forEach(function(idxName) {
                  return store_1.deleteIndex(idxName);
                });
              }
            });
            var contentUpgrade = version._cfg.contentUpgrade;
            if (contentUpgrade && version._cfg.version > oldVersion) {
              generateMiddlewareStacks(db, idbUpgradeTrans);
              trans._memoizedTables = {};
              var upgradeSchema_1 = shallowClone(newSchema);
              diff.del.forEach(function(table) {
                upgradeSchema_1[table] = oldSchema[table];
              });
              removeTablesApi(db, [db.Transaction.prototype]);
              setApiOnPlace(db, [db.Transaction.prototype], keys(upgradeSchema_1), upgradeSchema_1);
              trans.schema = upgradeSchema_1;
              var contentUpgradeIsAsync_1 = isAsyncFunction(contentUpgrade);
              if (contentUpgradeIsAsync_1) {
                incrementExpectedAwaits();
              }
              var returnValue_1;
              var promiseFollowed = DexiePromise.follow(function() {
                returnValue_1 = contentUpgrade(trans);
                if (returnValue_1) {
                  if (contentUpgradeIsAsync_1) {
                    var decrementor = decrementExpectedAwaits.bind(null, null);
                    returnValue_1.then(decrementor, decrementor);
                  }
                }
              });
              return returnValue_1 && typeof returnValue_1.then === "function" ? DexiePromise.resolve(returnValue_1) : promiseFollowed.then(function() {
                return returnValue_1;
              });
            }
          });
          queue.push(function(idbtrans) {
            var newSchema = version._cfg.dbschema;
            deleteRemovedTables(newSchema, idbtrans);
            removeTablesApi(db, [db.Transaction.prototype]);
            setApiOnPlace(db, [db.Transaction.prototype], db._storeNames, db._dbSchema);
            trans.schema = db._dbSchema;
          });
          queue.push(function(idbtrans) {
            if (db.idbdb.objectStoreNames.contains("$meta")) {
              if (Math.ceil(db.idbdb.version / 10) === version._cfg.version) {
                db.idbdb.deleteObjectStore("$meta");
                delete db._dbSchema.$meta;
                db._storeNames = db._storeNames.filter(function(name) {
                  return name !== "$meta";
                });
              } else {
                idbtrans.objectStore("$meta").put(version._cfg.version, "version");
              }
            }
          });
        });
        function runQueue() {
          return queue.length ? DexiePromise.resolve(queue.shift()(trans.idbtrans)).then(runQueue) : DexiePromise.resolve();
        }
        return runQueue().then(function() {
          createMissingTables(globalSchema, idbUpgradeTrans);
        });
      }
      function getSchemaDiff(oldSchema, newSchema) {
        var diff = {
          del: [],
          add: [],
          change: []
        };
        var table;
        for (table in oldSchema) {
          if (!newSchema[table])
            diff.del.push(table);
        }
        for (table in newSchema) {
          var oldDef = oldSchema[table], newDef = newSchema[table];
          if (!oldDef) {
            diff.add.push([table, newDef]);
          } else {
            var change = {
              name: table,
              def: newDef,
              recreate: false,
              del: [],
              add: [],
              change: []
            };
            if ("" + (oldDef.primKey.keyPath || "") !== "" + (newDef.primKey.keyPath || "") || oldDef.primKey.auto !== newDef.primKey.auto) {
              change.recreate = true;
              diff.change.push(change);
            } else {
              var oldIndexes = oldDef.idxByName;
              var newIndexes = newDef.idxByName;
              var idxName = void 0;
              for (idxName in oldIndexes) {
                if (!newIndexes[idxName])
                  change.del.push(idxName);
              }
              for (idxName in newIndexes) {
                var oldIdx = oldIndexes[idxName], newIdx = newIndexes[idxName];
                if (!oldIdx)
                  change.add.push(newIdx);
                else if (oldIdx.src !== newIdx.src)
                  change.change.push(newIdx);
              }
              if (change.del.length > 0 || change.add.length > 0 || change.change.length > 0) {
                diff.change.push(change);
              }
            }
          }
        }
        return diff;
      }
      function createTable(idbtrans, tableName, primKey, indexes) {
        var store = idbtrans.db.createObjectStore(tableName, primKey.keyPath ? { keyPath: primKey.keyPath, autoIncrement: primKey.auto } : { autoIncrement: primKey.auto });
        indexes.forEach(function(idx) {
          return addIndex(store, idx);
        });
        return store;
      }
      function createMissingTables(newSchema, idbtrans) {
        keys(newSchema).forEach(function(tableName) {
          if (!idbtrans.db.objectStoreNames.contains(tableName)) {
            if (debug)
              console.debug("Dexie: Creating missing table", tableName);
            createTable(idbtrans, tableName, newSchema[tableName].primKey, newSchema[tableName].indexes);
          }
        });
      }
      function deleteRemovedTables(newSchema, idbtrans) {
        [].slice.call(idbtrans.db.objectStoreNames).forEach(function(storeName) {
          return newSchema[storeName] == null && idbtrans.db.deleteObjectStore(storeName);
        });
      }
      function addIndex(store, idx) {
        store.createIndex(idx.name, idx.keyPath, { unique: idx.unique, multiEntry: idx.multi });
      }
      function buildGlobalSchema(db, idbdb, tmpTrans) {
        var globalSchema = {};
        var dbStoreNames = slice(idbdb.objectStoreNames, 0);
        dbStoreNames.forEach(function(storeName) {
          var store = tmpTrans.objectStore(storeName);
          var keyPath = store.keyPath;
          var primKey = createIndexSpec(nameFromKeyPath(keyPath), keyPath || "", true, false, !!store.autoIncrement, keyPath && typeof keyPath !== "string", true);
          var indexes = [];
          for (var j = 0; j < store.indexNames.length; ++j) {
            var idbindex = store.index(store.indexNames[j]);
            keyPath = idbindex.keyPath;
            var index = createIndexSpec(idbindex.name, keyPath, !!idbindex.unique, !!idbindex.multiEntry, false, keyPath && typeof keyPath !== "string", false);
            indexes.push(index);
          }
          globalSchema[storeName] = createTableSchema(storeName, primKey, indexes);
        });
        return globalSchema;
      }
      function readGlobalSchema(db, idbdb, tmpTrans) {
        db.verno = idbdb.version / 10;
        var globalSchema = db._dbSchema = buildGlobalSchema(db, idbdb, tmpTrans);
        db._storeNames = slice(idbdb.objectStoreNames, 0);
        setApiOnPlace(db, [db._allTables], keys(globalSchema), globalSchema);
      }
      function verifyInstalledSchema(db, tmpTrans) {
        var installedSchema = buildGlobalSchema(db, db.idbdb, tmpTrans);
        var diff = getSchemaDiff(installedSchema, db._dbSchema);
        return !(diff.add.length || diff.change.some(function(ch) {
          return ch.add.length || ch.change.length;
        }));
      }
      function adjustToExistingIndexNames(db, schema, idbtrans) {
        var storeNames = idbtrans.db.objectStoreNames;
        for (var i = 0; i < storeNames.length; ++i) {
          var storeName = storeNames[i];
          var store = idbtrans.objectStore(storeName);
          db._hasGetAll = "getAll" in store;
          for (var j = 0; j < store.indexNames.length; ++j) {
            var indexName = store.indexNames[j];
            var keyPath = store.index(indexName).keyPath;
            var dexieName = typeof keyPath === "string" ? keyPath : "[" + slice(keyPath).join("+") + "]";
            if (schema[storeName]) {
              var indexSpec = schema[storeName].idxByName[dexieName];
              if (indexSpec) {
                indexSpec.name = indexName;
                delete schema[storeName].idxByName[dexieName];
                schema[storeName].idxByName[indexName] = indexSpec;
              }
            }
          }
        }
        if (typeof navigator !== "undefined" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && _global.WorkerGlobalScope && _global instanceof _global.WorkerGlobalScope && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) {
          db._hasGetAll = false;
        }
      }
      function parseIndexSyntax(primKeyAndIndexes) {
        return primKeyAndIndexes.split(",").map(function(index, indexNum) {
          index = index.trim();
          var name = index.replace(/([&*]|\+\+)/g, "");
          var keyPath = /^\[/.test(name) ? name.match(/^\[(.*)\]$/)[1].split("+") : name;
          return createIndexSpec(name, keyPath || null, /\&/.test(index), /\*/.test(index), /\+\+/.test(index), isArray4(keyPath), indexNum === 0);
        });
      }
      var Version = function() {
        function Version2() {
        }
        Version2.prototype._parseStoresSpec = function(stores, outSchema) {
          keys(stores).forEach(function(tableName) {
            if (stores[tableName] !== null) {
              var indexes = parseIndexSyntax(stores[tableName]);
              var primKey = indexes.shift();
              primKey.unique = true;
              if (primKey.multi)
                throw new exceptions.Schema("Primary key cannot be multi-valued");
              indexes.forEach(function(idx) {
                if (idx.auto)
                  throw new exceptions.Schema("Only primary key can be marked as autoIncrement (++)");
                if (!idx.keyPath)
                  throw new exceptions.Schema("Index must have a name and cannot be an empty string");
              });
              outSchema[tableName] = createTableSchema(tableName, primKey, indexes);
            }
          });
        };
        Version2.prototype.stores = function(stores) {
          var db = this.db;
          this._cfg.storesSource = this._cfg.storesSource ? extend(this._cfg.storesSource, stores) : stores;
          var versions = db._versions;
          var storesSpec = {};
          var dbschema = {};
          versions.forEach(function(version) {
            extend(storesSpec, version._cfg.storesSource);
            dbschema = version._cfg.dbschema = {};
            version._parseStoresSpec(storesSpec, dbschema);
          });
          db._dbSchema = dbschema;
          removeTablesApi(db, [db._allTables, db, db.Transaction.prototype]);
          setApiOnPlace(db, [db._allTables, db, db.Transaction.prototype, this._cfg.tables], keys(dbschema), dbschema);
          db._storeNames = keys(dbschema);
          return this;
        };
        Version2.prototype.upgrade = function(upgradeFunction) {
          this._cfg.contentUpgrade = promisableChain(this._cfg.contentUpgrade || nop, upgradeFunction);
          return this;
        };
        return Version2;
      }();
      function createVersionConstructor(db) {
        return makeClassConstructor(Version.prototype, function Version2(versionNumber) {
          this.db = db;
          this._cfg = {
            version: versionNumber,
            storesSource: null,
            dbschema: {},
            tables: {},
            contentUpgrade: null
          };
        });
      }
      function getDbNamesTable(indexedDB2, IDBKeyRange2) {
        var dbNamesDB = indexedDB2["_dbNamesDB"];
        if (!dbNamesDB) {
          dbNamesDB = indexedDB2["_dbNamesDB"] = new Dexie$1(DBNAMES_DB, {
            addons: [],
            indexedDB: indexedDB2,
            IDBKeyRange: IDBKeyRange2
          });
          dbNamesDB.version(1).stores({ dbnames: "name" });
        }
        return dbNamesDB.table("dbnames");
      }
      function hasDatabasesNative(indexedDB2) {
        return indexedDB2 && typeof indexedDB2.databases === "function";
      }
      function getDatabaseNames(_a2) {
        var indexedDB2 = _a2.indexedDB, IDBKeyRange2 = _a2.IDBKeyRange;
        return hasDatabasesNative(indexedDB2) ? Promise.resolve(indexedDB2.databases()).then(function(infos) {
          return infos.map(function(info) {
            return info.name;
          }).filter(function(name) {
            return name !== DBNAMES_DB;
          });
        }) : getDbNamesTable(indexedDB2, IDBKeyRange2).toCollection().primaryKeys();
      }
      function _onDatabaseCreated(_a2, name) {
        var indexedDB2 = _a2.indexedDB, IDBKeyRange2 = _a2.IDBKeyRange;
        !hasDatabasesNative(indexedDB2) && name !== DBNAMES_DB && getDbNamesTable(indexedDB2, IDBKeyRange2).put({ name }).catch(nop);
      }
      function _onDatabaseDeleted(_a2, name) {
        var indexedDB2 = _a2.indexedDB, IDBKeyRange2 = _a2.IDBKeyRange;
        !hasDatabasesNative(indexedDB2) && name !== DBNAMES_DB && getDbNamesTable(indexedDB2, IDBKeyRange2).delete(name).catch(nop);
      }
      function vip(fn) {
        return newScope(function() {
          PSD.letThrough = true;
          return fn();
        });
      }
      function idbReady() {
        var isSafari = !navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent);
        if (!isSafari || !indexedDB.databases)
          return Promise.resolve();
        var intervalId;
        return new Promise(function(resolve2) {
          var tryIdb = function() {
            return indexedDB.databases().finally(resolve2);
          };
          intervalId = setInterval(tryIdb, 100);
          tryIdb();
        }).finally(function() {
          return clearInterval(intervalId);
        });
      }
      var _a;
      function isEmptyRange(node) {
        return !("from" in node);
      }
      var RangeSet2 = function(fromOrTree, to) {
        if (this) {
          extend(this, arguments.length ? { d: 1, from: fromOrTree, to: arguments.length > 1 ? to : fromOrTree } : { d: 0 });
        } else {
          var rv = new RangeSet2();
          if (fromOrTree && "d" in fromOrTree) {
            extend(rv, fromOrTree);
          }
          return rv;
        }
      };
      props(RangeSet2.prototype, (_a = {
        add: function(rangeSet) {
          mergeRanges2(this, rangeSet);
          return this;
        },
        addKey: function(key) {
          addRange(this, key, key);
          return this;
        },
        addKeys: function(keys2) {
          var _this = this;
          keys2.forEach(function(key) {
            return addRange(_this, key, key);
          });
          return this;
        },
        hasKey: function(key) {
          var node = getRangeSetIterator(this).next(key).value;
          return node && cmp2(node.from, key) <= 0 && cmp2(node.to, key) >= 0;
        }
      }, _a[iteratorSymbol] = function() {
        return getRangeSetIterator(this);
      }, _a));
      function addRange(target, from2, to) {
        var diff = cmp2(from2, to);
        if (isNaN(diff))
          return;
        if (diff > 0)
          throw RangeError();
        if (isEmptyRange(target))
          return extend(target, { from: from2, to, d: 1 });
        var left = target.l;
        var right = target.r;
        if (cmp2(to, target.from) < 0) {
          left ? addRange(left, from2, to) : target.l = { from: from2, to, d: 1, l: null, r: null };
          return rebalance(target);
        }
        if (cmp2(from2, target.to) > 0) {
          right ? addRange(right, from2, to) : target.r = { from: from2, to, d: 1, l: null, r: null };
          return rebalance(target);
        }
        if (cmp2(from2, target.from) < 0) {
          target.from = from2;
          target.l = null;
          target.d = right ? right.d + 1 : 1;
        }
        if (cmp2(to, target.to) > 0) {
          target.to = to;
          target.r = null;
          target.d = target.l ? target.l.d + 1 : 1;
        }
        var rightWasCutOff = !target.r;
        if (left && !target.l) {
          mergeRanges2(target, left);
        }
        if (right && rightWasCutOff) {
          mergeRanges2(target, right);
        }
      }
      function mergeRanges2(target, newSet) {
        function _addRangeSet(target2, _a2) {
          var from2 = _a2.from, to = _a2.to, l = _a2.l, r = _a2.r;
          addRange(target2, from2, to);
          if (l)
            _addRangeSet(target2, l);
          if (r)
            _addRangeSet(target2, r);
        }
        if (!isEmptyRange(newSet))
          _addRangeSet(target, newSet);
      }
      function rangesOverlap2(rangeSet1, rangeSet2) {
        var i1 = getRangeSetIterator(rangeSet2);
        var nextResult1 = i1.next();
        if (nextResult1.done)
          return false;
        var a = nextResult1.value;
        var i2 = getRangeSetIterator(rangeSet1);
        var nextResult2 = i2.next(a.from);
        var b = nextResult2.value;
        while (!nextResult1.done && !nextResult2.done) {
          if (cmp2(b.from, a.to) <= 0 && cmp2(b.to, a.from) >= 0)
            return true;
          cmp2(a.from, b.from) < 0 ? a = (nextResult1 = i1.next(b.from)).value : b = (nextResult2 = i2.next(a.from)).value;
        }
        return false;
      }
      function getRangeSetIterator(node) {
        var state = isEmptyRange(node) ? null : { s: 0, n: node };
        return {
          next: function(key) {
            var keyProvided = arguments.length > 0;
            while (state) {
              switch (state.s) {
                case 0:
                  state.s = 1;
                  if (keyProvided) {
                    while (state.n.l && cmp2(key, state.n.from) < 0)
                      state = { up: state, n: state.n.l, s: 1 };
                  } else {
                    while (state.n.l)
                      state = { up: state, n: state.n.l, s: 1 };
                  }
                case 1:
                  state.s = 2;
                  if (!keyProvided || cmp2(key, state.n.to) <= 0)
                    return { value: state.n, done: false };
                case 2:
                  if (state.n.r) {
                    state.s = 3;
                    state = { up: state, n: state.n.r, s: 0 };
                    continue;
                  }
                case 3:
                  state = state.up;
              }
            }
            return { done: true };
          }
        };
      }
      function rebalance(target) {
        var _a2, _b;
        var diff = (((_a2 = target.r) === null || _a2 === void 0 ? void 0 : _a2.d) || 0) - (((_b = target.l) === null || _b === void 0 ? void 0 : _b.d) || 0);
        var r = diff > 1 ? "r" : diff < -1 ? "l" : "";
        if (r) {
          var l = r === "r" ? "l" : "r";
          var rootClone = __assign({}, target);
          var oldRootRight = target[r];
          target.from = oldRootRight.from;
          target.to = oldRootRight.to;
          target[r] = oldRootRight[r];
          rootClone[r] = oldRootRight[l];
          target[l] = rootClone;
          rootClone.d = computeDepth(rootClone);
        }
        target.d = computeDepth(target);
      }
      function computeDepth(_a2) {
        var r = _a2.r, l = _a2.l;
        return (r ? l ? Math.max(r.d, l.d) : r.d : l ? l.d : 0) + 1;
      }
      function extendObservabilitySet(target, newSet) {
        keys(newSet).forEach(function(part) {
          if (target[part])
            mergeRanges2(target[part], newSet[part]);
          else
            target[part] = cloneSimpleObjectTree(newSet[part]);
        });
        return target;
      }
      function obsSetsOverlap(os1, os2) {
        return os1.all || os2.all || Object.keys(os1).some(function(key) {
          return os2[key] && rangesOverlap2(os2[key], os1[key]);
        });
      }
      var cache = {};
      var unsignaledParts = {};
      var isTaskEnqueued = false;
      function signalSubscribersLazily(part, optimistic) {
        extendObservabilitySet(unsignaledParts, part);
        if (!isTaskEnqueued) {
          isTaskEnqueued = true;
          setTimeout(function() {
            isTaskEnqueued = false;
            var parts = unsignaledParts;
            unsignaledParts = {};
            signalSubscribersNow(parts, false);
          }, 0);
        }
      }
      function signalSubscribersNow(updatedParts, deleteAffectedCacheEntries) {
        if (deleteAffectedCacheEntries === void 0) {
          deleteAffectedCacheEntries = false;
        }
        var queriesToSignal = /* @__PURE__ */ new Set();
        if (updatedParts.all) {
          for (var _i = 0, _a2 = Object.values(cache); _i < _a2.length; _i++) {
            var tblCache = _a2[_i];
            collectTableSubscribers(tblCache, updatedParts, queriesToSignal, deleteAffectedCacheEntries);
          }
        } else {
          for (var key in updatedParts) {
            var parts = /^idb\:\/\/(.*)\/(.*)\//.exec(key);
            if (parts) {
              var dbName = parts[1], tableName = parts[2];
              var tblCache = cache["idb://".concat(dbName, "/").concat(tableName)];
              if (tblCache)
                collectTableSubscribers(tblCache, updatedParts, queriesToSignal, deleteAffectedCacheEntries);
            }
          }
        }
        queriesToSignal.forEach(function(requery) {
          return requery();
        });
      }
      function collectTableSubscribers(tblCache, updatedParts, outQueriesToSignal, deleteAffectedCacheEntries) {
        var updatedEntryLists = [];
        for (var _i = 0, _a2 = Object.entries(tblCache.queries.query); _i < _a2.length; _i++) {
          var _b = _a2[_i], indexName = _b[0], entries = _b[1];
          var filteredEntries = [];
          for (var _c = 0, entries_1 = entries; _c < entries_1.length; _c++) {
            var entry = entries_1[_c];
            if (obsSetsOverlap(updatedParts, entry.obsSet)) {
              entry.subscribers.forEach(function(requery) {
                return outQueriesToSignal.add(requery);
              });
            } else if (deleteAffectedCacheEntries) {
              filteredEntries.push(entry);
            }
          }
          if (deleteAffectedCacheEntries)
            updatedEntryLists.push([indexName, filteredEntries]);
        }
        if (deleteAffectedCacheEntries) {
          for (var _d = 0, updatedEntryLists_1 = updatedEntryLists; _d < updatedEntryLists_1.length; _d++) {
            var _e = updatedEntryLists_1[_d], indexName = _e[0], filteredEntries = _e[1];
            tblCache.queries.query[indexName] = filteredEntries;
          }
        }
      }
      function dexieOpen(db) {
        var state = db._state;
        var indexedDB2 = db._deps.indexedDB;
        if (state.isBeingOpened || db.idbdb)
          return state.dbReadyPromise.then(function() {
            return state.dbOpenError ? rejection(state.dbOpenError) : db;
          });
        state.isBeingOpened = true;
        state.dbOpenError = null;
        state.openComplete = false;
        var openCanceller = state.openCanceller;
        var nativeVerToOpen = Math.round(db.verno * 10);
        var schemaPatchMode = false;
        function throwIfCancelled() {
          if (state.openCanceller !== openCanceller)
            throw new exceptions.DatabaseClosed("db.open() was cancelled");
        }
        var resolveDbReady = state.dbReadyResolve, upgradeTransaction = null, wasCreated = false;
        var tryOpenDB = function() {
          return new DexiePromise(function(resolve2, reject) {
            throwIfCancelled();
            if (!indexedDB2)
              throw new exceptions.MissingAPI();
            var dbName = db.name;
            var req = state.autoSchema || !nativeVerToOpen ? indexedDB2.open(dbName) : indexedDB2.open(dbName, nativeVerToOpen);
            if (!req)
              throw new exceptions.MissingAPI();
            req.onerror = eventRejectHandler(reject);
            req.onblocked = wrap(db._fireOnBlocked);
            req.onupgradeneeded = wrap(function(e) {
              upgradeTransaction = req.transaction;
              if (state.autoSchema && !db._options.allowEmptyDB) {
                req.onerror = preventDefault;
                upgradeTransaction.abort();
                req.result.close();
                var delreq = indexedDB2.deleteDatabase(dbName);
                delreq.onsuccess = delreq.onerror = wrap(function() {
                  reject(new exceptions.NoSuchDatabase("Database ".concat(dbName, " doesnt exist")));
                });
              } else {
                upgradeTransaction.onerror = eventRejectHandler(reject);
                var oldVer = e.oldVersion > Math.pow(2, 62) ? 0 : e.oldVersion;
                wasCreated = oldVer < 1;
                db.idbdb = req.result;
                if (schemaPatchMode) {
                  patchCurrentVersion(db, upgradeTransaction);
                }
                runUpgraders(db, oldVer / 10, upgradeTransaction, reject);
              }
            }, reject);
            req.onsuccess = wrap(function() {
              upgradeTransaction = null;
              var idbdb = db.idbdb = req.result;
              var objectStoreNames = slice(idbdb.objectStoreNames);
              if (objectStoreNames.length > 0)
                try {
                  var tmpTrans = idbdb.transaction(safariMultiStoreFix(objectStoreNames), "readonly");
                  if (state.autoSchema)
                    readGlobalSchema(db, idbdb, tmpTrans);
                  else {
                    adjustToExistingIndexNames(db, db._dbSchema, tmpTrans);
                    if (!verifyInstalledSchema(db, tmpTrans) && !schemaPatchMode) {
                      console.warn("Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Dexie will add missing parts and increment native version number to workaround this.");
                      idbdb.close();
                      nativeVerToOpen = idbdb.version + 1;
                      schemaPatchMode = true;
                      return resolve2(tryOpenDB());
                    }
                  }
                  generateMiddlewareStacks(db, tmpTrans);
                } catch (e) {
                }
              connections.push(db);
              idbdb.onversionchange = wrap(function(ev) {
                state.vcFired = true;
                db.on("versionchange").fire(ev);
              });
              idbdb.onclose = wrap(function(ev) {
                db.on("close").fire(ev);
              });
              if (wasCreated)
                _onDatabaseCreated(db._deps, dbName);
              resolve2();
            }, reject);
          }).catch(function(err) {
            switch (err === null || err === void 0 ? void 0 : err.name) {
              case "UnknownError":
                if (state.PR1398_maxLoop > 0) {
                  state.PR1398_maxLoop--;
                  console.warn("Dexie: Workaround for Chrome UnknownError on open()");
                  return tryOpenDB();
                }
                break;
              case "VersionError":
                if (nativeVerToOpen > 0) {
                  nativeVerToOpen = 0;
                  return tryOpenDB();
                }
                break;
            }
            return DexiePromise.reject(err);
          });
        };
        return DexiePromise.race([
          openCanceller,
          (typeof navigator === "undefined" ? DexiePromise.resolve() : idbReady()).then(tryOpenDB)
        ]).then(function() {
          throwIfCancelled();
          state.onReadyBeingFired = [];
          return DexiePromise.resolve(vip(function() {
            return db.on.ready.fire(db.vip);
          })).then(function fireRemainders() {
            if (state.onReadyBeingFired.length > 0) {
              var remainders_1 = state.onReadyBeingFired.reduce(promisableChain, nop);
              state.onReadyBeingFired = [];
              return DexiePromise.resolve(vip(function() {
                return remainders_1(db.vip);
              })).then(fireRemainders);
            }
          });
        }).finally(function() {
          if (state.openCanceller === openCanceller) {
            state.onReadyBeingFired = null;
            state.isBeingOpened = false;
          }
        }).catch(function(err) {
          state.dbOpenError = err;
          try {
            upgradeTransaction && upgradeTransaction.abort();
          } catch (_a2) {
          }
          if (openCanceller === state.openCanceller) {
            db._close();
          }
          return rejection(err);
        }).finally(function() {
          state.openComplete = true;
          resolveDbReady();
        }).then(function() {
          if (wasCreated) {
            var everything_1 = {};
            db.tables.forEach(function(table) {
              table.schema.indexes.forEach(function(idx) {
                if (idx.name)
                  everything_1["idb://".concat(db.name, "/").concat(table.name, "/").concat(idx.name)] = new RangeSet2(-Infinity, [[[]]]);
              });
              everything_1["idb://".concat(db.name, "/").concat(table.name, "/")] = everything_1["idb://".concat(db.name, "/").concat(table.name, "/:dels")] = new RangeSet2(-Infinity, [[[]]]);
            });
            globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME).fire(everything_1);
            signalSubscribersNow(everything_1, true);
          }
          return db;
        });
      }
      function awaitIterator(iterator2) {
        var callNext = function(result) {
          return iterator2.next(result);
        }, doThrow = function(error) {
          return iterator2.throw(error);
        }, onSuccess = step(callNext), onError = step(doThrow);
        function step(getNext) {
          return function(val) {
            var next = getNext(val), value = next.value;
            return next.done ? value : !value || typeof value.then !== "function" ? isArray4(value) ? Promise.all(value).then(onSuccess, onError) : onSuccess(value) : value.then(onSuccess, onError);
          };
        }
        return step(callNext)();
      }
      function extractTransactionArgs(mode, _tableArgs_, scopeFunc) {
        var i = arguments.length;
        if (i < 2)
          throw new exceptions.InvalidArgument("Too few arguments");
        var args = new Array(i - 1);
        while (--i)
          args[i - 1] = arguments[i];
        scopeFunc = args.pop();
        var tables = flatten2(args);
        return [mode, tables, scopeFunc];
      }
      function enterTransactionScope(db, mode, storeNames, parentTransaction, scopeFunc) {
        return DexiePromise.resolve().then(function() {
          var transless = PSD.transless || PSD;
          var trans = db._createTransaction(mode, storeNames, db._dbSchema, parentTransaction);
          trans.explicit = true;
          var zoneProps = {
            trans,
            transless
          };
          if (parentTransaction) {
            trans.idbtrans = parentTransaction.idbtrans;
          } else {
            try {
              trans.create();
              trans.idbtrans._explicit = true;
              db._state.PR1398_maxLoop = 3;
            } catch (ex) {
              if (ex.name === errnames.InvalidState && db.isOpen() && --db._state.PR1398_maxLoop > 0) {
                console.warn("Dexie: Need to reopen db");
                db.close({ disableAutoOpen: false });
                return db.open().then(function() {
                  return enterTransactionScope(db, mode, storeNames, null, scopeFunc);
                });
              }
              return rejection(ex);
            }
          }
          var scopeFuncIsAsync = isAsyncFunction(scopeFunc);
          if (scopeFuncIsAsync) {
            incrementExpectedAwaits();
          }
          var returnValue;
          var promiseFollowed = DexiePromise.follow(function() {
            returnValue = scopeFunc.call(trans, trans);
            if (returnValue) {
              if (scopeFuncIsAsync) {
                var decrementor = decrementExpectedAwaits.bind(null, null);
                returnValue.then(decrementor, decrementor);
              } else if (typeof returnValue.next === "function" && typeof returnValue.throw === "function") {
                returnValue = awaitIterator(returnValue);
              }
            }
          }, zoneProps);
          return (returnValue && typeof returnValue.then === "function" ? DexiePromise.resolve(returnValue).then(function(x) {
            return trans.active ? x : rejection(new exceptions.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"));
          }) : promiseFollowed.then(function() {
            return returnValue;
          })).then(function(x) {
            if (parentTransaction)
              trans._resolve();
            return trans._completion.then(function() {
              return x;
            });
          }).catch(function(e) {
            trans._reject(e);
            return rejection(e);
          });
        });
      }
      function pad(a, value, count) {
        var result = isArray4(a) ? a.slice() : [a];
        for (var i = 0; i < count; ++i)
          result.push(value);
        return result;
      }
      function createVirtualIndexMiddleware(down) {
        return __assign(__assign({}, down), { table: function(tableName) {
          var table = down.table(tableName);
          var schema = table.schema;
          var indexLookup = {};
          var allVirtualIndexes = [];
          function addVirtualIndexes(keyPath, keyTail, lowLevelIndex) {
            var keyPathAlias = getKeyPathAlias(keyPath);
            var indexList = indexLookup[keyPathAlias] = indexLookup[keyPathAlias] || [];
            var keyLength = keyPath == null ? 0 : typeof keyPath === "string" ? 1 : keyPath.length;
            var isVirtual = keyTail > 0;
            var virtualIndex = __assign(__assign({}, lowLevelIndex), { name: isVirtual ? "".concat(keyPathAlias, "(virtual-from:").concat(lowLevelIndex.name, ")") : lowLevelIndex.name, lowLevelIndex, isVirtual, keyTail, keyLength, extractKey: getKeyExtractor(keyPath), unique: !isVirtual && lowLevelIndex.unique });
            indexList.push(virtualIndex);
            if (!virtualIndex.isPrimaryKey) {
              allVirtualIndexes.push(virtualIndex);
            }
            if (keyLength > 1) {
              var virtualKeyPath = keyLength === 2 ? keyPath[0] : keyPath.slice(0, keyLength - 1);
              addVirtualIndexes(virtualKeyPath, keyTail + 1, lowLevelIndex);
            }
            indexList.sort(function(a, b) {
              return a.keyTail - b.keyTail;
            });
            return virtualIndex;
          }
          var primaryKey = addVirtualIndexes(schema.primaryKey.keyPath, 0, schema.primaryKey);
          indexLookup[":id"] = [primaryKey];
          for (var _i = 0, _a2 = schema.indexes; _i < _a2.length; _i++) {
            var index = _a2[_i];
            addVirtualIndexes(index.keyPath, 0, index);
          }
          function findBestIndex(keyPath) {
            var result2 = indexLookup[getKeyPathAlias(keyPath)];
            return result2 && result2[0];
          }
          function translateRange(range, keyTail) {
            return {
              type: range.type === 1 ? 2 : range.type,
              lower: pad(range.lower, range.lowerOpen ? down.MAX_KEY : down.MIN_KEY, keyTail),
              lowerOpen: true,
              upper: pad(range.upper, range.upperOpen ? down.MIN_KEY : down.MAX_KEY, keyTail),
              upperOpen: true
            };
          }
          function translateRequest(req) {
            var index2 = req.query.index;
            return index2.isVirtual ? __assign(__assign({}, req), { query: {
              index: index2.lowLevelIndex,
              range: translateRange(req.query.range, index2.keyTail)
            } }) : req;
          }
          var result = __assign(__assign({}, table), { schema: __assign(__assign({}, schema), { primaryKey, indexes: allVirtualIndexes, getIndexByKeyPath: findBestIndex }), count: function(req) {
            return table.count(translateRequest(req));
          }, query: function(req) {
            return table.query(translateRequest(req));
          }, openCursor: function(req) {
            var _a3 = req.query.index, keyTail = _a3.keyTail, isVirtual = _a3.isVirtual, keyLength = _a3.keyLength;
            if (!isVirtual)
              return table.openCursor(req);
            function createVirtualCursor(cursor) {
              function _continue(key) {
                key != null ? cursor.continue(pad(key, req.reverse ? down.MAX_KEY : down.MIN_KEY, keyTail)) : req.unique ? cursor.continue(cursor.key.slice(0, keyLength).concat(req.reverse ? down.MIN_KEY : down.MAX_KEY, keyTail)) : cursor.continue();
              }
              var virtualCursor = Object.create(cursor, {
                continue: { value: _continue },
                continuePrimaryKey: {
                  value: function(key, primaryKey2) {
                    cursor.continuePrimaryKey(pad(key, down.MAX_KEY, keyTail), primaryKey2);
                  }
                },
                primaryKey: {
                  get: function() {
                    return cursor.primaryKey;
                  }
                },
                key: {
                  get: function() {
                    var key = cursor.key;
                    return keyLength === 1 ? key[0] : key.slice(0, keyLength);
                  }
                },
                value: {
                  get: function() {
                    return cursor.value;
                  }
                }
              });
              return virtualCursor;
            }
            return table.openCursor(translateRequest(req)).then(function(cursor) {
              return cursor && createVirtualCursor(cursor);
            });
          } });
          return result;
        } });
      }
      var virtualIndexMiddleware = {
        stack: "dbcore",
        name: "VirtualIndexMiddleware",
        level: 1,
        create: createVirtualIndexMiddleware
      };
      function getObjectDiff(a, b, rv, prfx) {
        rv = rv || {};
        prfx = prfx || "";
        keys(a).forEach(function(prop) {
          if (!hasOwn(b, prop)) {
            rv[prfx + prop] = void 0;
          } else {
            var ap = a[prop], bp = b[prop];
            if (typeof ap === "object" && typeof bp === "object" && ap && bp) {
              var apTypeName = toStringTag(ap);
              var bpTypeName = toStringTag(bp);
              if (apTypeName !== bpTypeName) {
                rv[prfx + prop] = b[prop];
              } else if (apTypeName === "Object") {
                getObjectDiff(ap, bp, rv, prfx + prop + ".");
              } else if (ap !== bp) {
                rv[prfx + prop] = b[prop];
              }
            } else if (ap !== bp)
              rv[prfx + prop] = b[prop];
          }
        });
        keys(b).forEach(function(prop) {
          if (!hasOwn(a, prop)) {
            rv[prfx + prop] = b[prop];
          }
        });
        return rv;
      }
      function getEffectiveKeys(primaryKey, req) {
        if (req.type === "delete")
          return req.keys;
        return req.keys || req.values.map(primaryKey.extractKey);
      }
      var hooksMiddleware = {
        stack: "dbcore",
        name: "HooksMiddleware",
        level: 2,
        create: function(downCore) {
          return __assign(__assign({}, downCore), { table: function(tableName) {
            var downTable = downCore.table(tableName);
            var primaryKey = downTable.schema.primaryKey;
            var tableMiddleware = __assign(__assign({}, downTable), { mutate: function(req) {
              var dxTrans = PSD.trans;
              var _a2 = dxTrans.table(tableName).hook, deleting = _a2.deleting, creating = _a2.creating, updating = _a2.updating;
              switch (req.type) {
                case "add":
                  if (creating.fire === nop)
                    break;
                  return dxTrans._promise("readwrite", function() {
                    return addPutOrDelete(req);
                  }, true);
                case "put":
                  if (creating.fire === nop && updating.fire === nop)
                    break;
                  return dxTrans._promise("readwrite", function() {
                    return addPutOrDelete(req);
                  }, true);
                case "delete":
                  if (deleting.fire === nop)
                    break;
                  return dxTrans._promise("readwrite", function() {
                    return addPutOrDelete(req);
                  }, true);
                case "deleteRange":
                  if (deleting.fire === nop)
                    break;
                  return dxTrans._promise("readwrite", function() {
                    return deleteRange(req);
                  }, true);
              }
              return downTable.mutate(req);
              function addPutOrDelete(req2) {
                var dxTrans2 = PSD.trans;
                var keys2 = req2.keys || getEffectiveKeys(primaryKey, req2);
                if (!keys2)
                  throw new Error("Keys missing");
                req2 = req2.type === "add" || req2.type === "put" ? __assign(__assign({}, req2), { keys: keys2 }) : __assign({}, req2);
                if (req2.type !== "delete")
                  req2.values = __spreadArray2([], req2.values, true);
                if (req2.keys)
                  req2.keys = __spreadArray2([], req2.keys, true);
                return getExistingValues(downTable, req2, keys2).then(function(existingValues) {
                  var contexts = keys2.map(function(key, i) {
                    var existingValue = existingValues[i];
                    var ctx = { onerror: null, onsuccess: null };
                    if (req2.type === "delete") {
                      deleting.fire.call(ctx, key, existingValue, dxTrans2);
                    } else if (req2.type === "add" || existingValue === void 0) {
                      var generatedPrimaryKey = creating.fire.call(ctx, key, req2.values[i], dxTrans2);
                      if (key == null && generatedPrimaryKey != null) {
                        key = generatedPrimaryKey;
                        req2.keys[i] = key;
                        if (!primaryKey.outbound) {
                          setByKeyPath(req2.values[i], primaryKey.keyPath, key);
                        }
                      }
                    } else {
                      var objectDiff = getObjectDiff(existingValue, req2.values[i]);
                      var additionalChanges_1 = updating.fire.call(ctx, objectDiff, key, existingValue, dxTrans2);
                      if (additionalChanges_1) {
                        var requestedValue_1 = req2.values[i];
                        Object.keys(additionalChanges_1).forEach(function(keyPath) {
                          if (hasOwn(requestedValue_1, keyPath)) {
                            requestedValue_1[keyPath] = additionalChanges_1[keyPath];
                          } else {
                            setByKeyPath(requestedValue_1, keyPath, additionalChanges_1[keyPath]);
                          }
                        });
                      }
                    }
                    return ctx;
                  });
                  return downTable.mutate(req2).then(function(_a3) {
                    var failures = _a3.failures, results = _a3.results, numFailures = _a3.numFailures, lastResult = _a3.lastResult;
                    for (var i = 0; i < keys2.length; ++i) {
                      var primKey = results ? results[i] : keys2[i];
                      var ctx = contexts[i];
                      if (primKey == null) {
                        ctx.onerror && ctx.onerror(failures[i]);
                      } else {
                        ctx.onsuccess && ctx.onsuccess(
                          req2.type === "put" && existingValues[i] ? req2.values[i] : primKey
                        );
                      }
                    }
                    return { failures, results, numFailures, lastResult };
                  }).catch(function(error) {
                    contexts.forEach(function(ctx) {
                      return ctx.onerror && ctx.onerror(error);
                    });
                    return Promise.reject(error);
                  });
                });
              }
              function deleteRange(req2) {
                return deleteNextChunk(req2.trans, req2.range, 1e4);
              }
              function deleteNextChunk(trans, range, limit) {
                return downTable.query({ trans, values: false, query: { index: primaryKey, range }, limit }).then(function(_a3) {
                  var result = _a3.result;
                  return addPutOrDelete({ type: "delete", keys: result, trans }).then(function(res) {
                    if (res.numFailures > 0)
                      return Promise.reject(res.failures[0]);
                    if (result.length < limit) {
                      return { failures: [], numFailures: 0, lastResult: void 0 };
                    } else {
                      return deleteNextChunk(trans, __assign(__assign({}, range), { lower: result[result.length - 1], lowerOpen: true }), limit);
                    }
                  });
                });
              }
            } });
            return tableMiddleware;
          } });
        }
      };
      function getExistingValues(table, req, effectiveKeys) {
        return req.type === "add" ? Promise.resolve([]) : table.getMany({ trans: req.trans, keys: effectiveKeys, cache: "immutable" });
      }
      function getFromTransactionCache(keys2, cache2, clone2) {
        try {
          if (!cache2)
            return null;
          if (cache2.keys.length < keys2.length)
            return null;
          var result = [];
          for (var i = 0, j = 0; i < cache2.keys.length && j < keys2.length; ++i) {
            if (cmp2(cache2.keys[i], keys2[j]) !== 0)
              continue;
            result.push(clone2 ? deepClone2(cache2.values[i]) : cache2.values[i]);
            ++j;
          }
          return result.length === keys2.length ? result : null;
        } catch (_a2) {
          return null;
        }
      }
      var cacheExistingValuesMiddleware = {
        stack: "dbcore",
        level: -1,
        create: function(core) {
          return {
            table: function(tableName) {
              var table = core.table(tableName);
              return __assign(__assign({}, table), { getMany: function(req) {
                if (!req.cache) {
                  return table.getMany(req);
                }
                var cachedResult = getFromTransactionCache(req.keys, req.trans["_cache"], req.cache === "clone");
                if (cachedResult) {
                  return DexiePromise.resolve(cachedResult);
                }
                return table.getMany(req).then(function(res) {
                  req.trans["_cache"] = {
                    keys: req.keys,
                    values: req.cache === "clone" ? deepClone2(res) : res
                  };
                  return res;
                });
              }, mutate: function(req) {
                if (req.type !== "add")
                  req.trans["_cache"] = null;
                return table.mutate(req);
              } });
            }
          };
        }
      };
      function isCachableContext(ctx, table) {
        return ctx.trans.mode === "readonly" && !!ctx.subscr && !ctx.trans.explicit && ctx.trans.db._options.cache !== "disabled" && !table.schema.primaryKey.outbound;
      }
      function isCachableRequest(type6, req) {
        switch (type6) {
          case "query":
            return req.values && !req.unique;
          case "get":
            return false;
          case "getMany":
            return false;
          case "count":
            return false;
          case "openCursor":
            return false;
        }
      }
      var observabilityMiddleware = {
        stack: "dbcore",
        level: 0,
        name: "Observability",
        create: function(core) {
          var dbName = core.schema.name;
          var FULL_RANGE = new RangeSet2(core.MIN_KEY, core.MAX_KEY);
          return __assign(__assign({}, core), { transaction: function(stores, mode, options) {
            if (PSD.subscr && mode !== "readonly") {
              throw new exceptions.ReadOnly("Readwrite transaction in liveQuery context. Querier source: ".concat(PSD.querier));
            }
            return core.transaction(stores, mode, options);
          }, table: function(tableName) {
            var table = core.table(tableName);
            var schema = table.schema;
            var primaryKey = schema.primaryKey, indexes = schema.indexes;
            var extractKey = primaryKey.extractKey, outbound = primaryKey.outbound;
            var indexesWithAutoIncPK = primaryKey.autoIncrement && indexes.filter(function(index) {
              return index.compound && index.keyPath.includes(primaryKey.keyPath);
            });
            var tableClone = __assign(__assign({}, table), { mutate: function(req) {
              var _a2, _b;
              var trans = req.trans;
              var mutatedParts = req.mutatedParts || (req.mutatedParts = {});
              var getRangeSet = function(indexName) {
                var part = "idb://".concat(dbName, "/").concat(tableName, "/").concat(indexName);
                return mutatedParts[part] || (mutatedParts[part] = new RangeSet2());
              };
              var pkRangeSet = getRangeSet("");
              var delsRangeSet = getRangeSet(":dels");
              var type6 = req.type;
              var _c = req.type === "deleteRange" ? [req.range] : req.type === "delete" ? [req.keys] : req.values.length < 50 ? [getEffectiveKeys(primaryKey, req).filter(function(id) {
                return id;
              }), req.values] : [], keys2 = _c[0], newObjs = _c[1];
              var oldCache = req.trans["_cache"];
              if (isArray4(keys2)) {
                pkRangeSet.addKeys(keys2);
                var oldObjs = type6 === "delete" || keys2.length === newObjs.length ? getFromTransactionCache(keys2, oldCache) : null;
                if (!oldObjs) {
                  delsRangeSet.addKeys(keys2);
                }
                if (oldObjs || newObjs) {
                  trackAffectedIndexes(getRangeSet, schema, oldObjs, newObjs);
                }
              } else if (keys2) {
                var range = {
                  from: (_a2 = keys2.lower) !== null && _a2 !== void 0 ? _a2 : core.MIN_KEY,
                  to: (_b = keys2.upper) !== null && _b !== void 0 ? _b : core.MAX_KEY
                };
                delsRangeSet.add(range);
                pkRangeSet.add(range);
              } else {
                pkRangeSet.add(FULL_RANGE);
                delsRangeSet.add(FULL_RANGE);
                schema.indexes.forEach(function(idx) {
                  return getRangeSet(idx.name).add(FULL_RANGE);
                });
              }
              return table.mutate(req).then(function(res) {
                if (keys2 && (req.type === "add" || req.type === "put")) {
                  pkRangeSet.addKeys(res.results);
                  if (indexesWithAutoIncPK) {
                    indexesWithAutoIncPK.forEach(function(idx) {
                      var idxVals = req.values.map(function(v) {
                        return idx.extractKey(v);
                      });
                      var pkPos = idx.keyPath.findIndex(function(prop) {
                        return prop === primaryKey.keyPath;
                      });
                      for (var i = 0, len = res.results.length; i < len; ++i) {
                        idxVals[i][pkPos] = res.results[i];
                      }
                      getRangeSet(idx.name).addKeys(idxVals);
                    });
                  }
                }
                trans.mutatedParts = extendObservabilitySet(trans.mutatedParts || {}, mutatedParts);
                return res;
              });
            } });
            var getRange = function(_a2) {
              var _b, _c;
              var _d = _a2.query, index = _d.index, range = _d.range;
              return [
                index,
                new RangeSet2((_b = range.lower) !== null && _b !== void 0 ? _b : core.MIN_KEY, (_c = range.upper) !== null && _c !== void 0 ? _c : core.MAX_KEY)
              ];
            };
            var readSubscribers = {
              get: function(req) {
                return [primaryKey, new RangeSet2(req.key)];
              },
              getMany: function(req) {
                return [primaryKey, new RangeSet2().addKeys(req.keys)];
              },
              count: getRange,
              query: getRange,
              openCursor: getRange
            };
            keys(readSubscribers).forEach(function(method) {
              tableClone[method] = function(req) {
                var subscr = PSD.subscr;
                var isLiveQuery = !!subscr;
                var cachable = isCachableContext(PSD, table) && isCachableRequest(method, req);
                var obsSet = cachable ? req.obsSet = {} : subscr;
                if (isLiveQuery) {
                  var getRangeSet = function(indexName) {
                    var part = "idb://".concat(dbName, "/").concat(tableName, "/").concat(indexName);
                    return obsSet[part] || (obsSet[part] = new RangeSet2());
                  };
                  var pkRangeSet_1 = getRangeSet("");
                  var delsRangeSet_1 = getRangeSet(":dels");
                  var _a2 = readSubscribers[method](req), queriedIndex = _a2[0], queriedRanges = _a2[1];
                  if (method === "query" && queriedIndex.isPrimaryKey && !req.values) {
                    delsRangeSet_1.add(queriedRanges);
                  } else {
                    getRangeSet(queriedIndex.name || "").add(queriedRanges);
                  }
                  if (!queriedIndex.isPrimaryKey) {
                    if (method === "count") {
                      delsRangeSet_1.add(FULL_RANGE);
                    } else {
                      var keysPromise_1 = method === "query" && outbound && req.values && table.query(__assign(__assign({}, req), { values: false }));
                      return table[method].apply(this, arguments).then(function(res) {
                        if (method === "query") {
                          if (outbound && req.values) {
                            return keysPromise_1.then(function(_a3) {
                              var resultingKeys = _a3.result;
                              pkRangeSet_1.addKeys(resultingKeys);
                              return res;
                            });
                          }
                          var pKeys = req.values ? res.result.map(extractKey) : res.result;
                          if (req.values) {
                            pkRangeSet_1.addKeys(pKeys);
                          } else {
                            delsRangeSet_1.addKeys(pKeys);
                          }
                        } else if (method === "openCursor") {
                          var cursor_1 = res;
                          var wantValues_1 = req.values;
                          return cursor_1 && Object.create(cursor_1, {
                            key: {
                              get: function() {
                                delsRangeSet_1.addKey(cursor_1.primaryKey);
                                return cursor_1.key;
                              }
                            },
                            primaryKey: {
                              get: function() {
                                var pkey = cursor_1.primaryKey;
                                delsRangeSet_1.addKey(pkey);
                                return pkey;
                              }
                            },
                            value: {
                              get: function() {
                                wantValues_1 && pkRangeSet_1.addKey(cursor_1.primaryKey);
                                return cursor_1.value;
                              }
                            }
                          });
                        }
                        return res;
                      });
                    }
                  }
                }
                return table[method].apply(this, arguments);
              };
            });
            return tableClone;
          } });
        }
      };
      function trackAffectedIndexes(getRangeSet, schema, oldObjs, newObjs) {
        function addAffectedIndex(ix) {
          var rangeSet = getRangeSet(ix.name || "");
          function extractKey(obj) {
            return obj != null ? ix.extractKey(obj) : null;
          }
          var addKeyOrKeys = function(key) {
            return ix.multiEntry && isArray4(key) ? key.forEach(function(key2) {
              return rangeSet.addKey(key2);
            }) : rangeSet.addKey(key);
          };
          (oldObjs || newObjs).forEach(function(_, i) {
            var oldKey = oldObjs && extractKey(oldObjs[i]);
            var newKey = newObjs && extractKey(newObjs[i]);
            if (cmp2(oldKey, newKey) !== 0) {
              if (oldKey != null)
                addKeyOrKeys(oldKey);
              if (newKey != null)
                addKeyOrKeys(newKey);
            }
          });
        }
        schema.indexes.forEach(addAffectedIndex);
      }
      function adjustOptimisticFromFailures(tblCache, req, res) {
        if (res.numFailures === 0)
          return req;
        if (req.type === "deleteRange") {
          return null;
        }
        var numBulkOps = req.keys ? req.keys.length : "values" in req && req.values ? req.values.length : 1;
        if (res.numFailures === numBulkOps) {
          return null;
        }
        var clone2 = __assign({}, req);
        if (isArray4(clone2.keys)) {
          clone2.keys = clone2.keys.filter(function(_, i) {
            return !(i in res.failures);
          });
        }
        if ("values" in clone2 && isArray4(clone2.values)) {
          clone2.values = clone2.values.filter(function(_, i) {
            return !(i in res.failures);
          });
        }
        return clone2;
      }
      function isAboveLower(key, range) {
        return range.lower === void 0 ? true : range.lowerOpen ? cmp2(key, range.lower) > 0 : cmp2(key, range.lower) >= 0;
      }
      function isBelowUpper(key, range) {
        return range.upper === void 0 ? true : range.upperOpen ? cmp2(key, range.upper) < 0 : cmp2(key, range.upper) <= 0;
      }
      function isWithinRange(key, range) {
        return isAboveLower(key, range) && isBelowUpper(key, range);
      }
      function applyOptimisticOps(result, req, ops, table, cacheEntry, immutable) {
        if (!ops || ops.length === 0)
          return result;
        var index = req.query.index;
        var multiEntry = index.multiEntry;
        var queryRange = req.query.range;
        var primaryKey = table.schema.primaryKey;
        var extractPrimKey = primaryKey.extractKey;
        var extractIndex = index.extractKey;
        var extractLowLevelIndex = (index.lowLevelIndex || index).extractKey;
        var finalResult = ops.reduce(function(result2, op) {
          var modifedResult = result2;
          var includedValues = [];
          if (op.type === "add" || op.type === "put") {
            var includedPKs = new RangeSet2();
            for (var i = op.values.length - 1; i >= 0; --i) {
              var value = op.values[i];
              var pk = extractPrimKey(value);
              if (includedPKs.hasKey(pk))
                continue;
              var key = extractIndex(value);
              if (multiEntry && isArray4(key) ? key.some(function(k) {
                return isWithinRange(k, queryRange);
              }) : isWithinRange(key, queryRange)) {
                includedPKs.addKey(pk);
                includedValues.push(value);
              }
            }
          }
          switch (op.type) {
            case "add": {
              var existingKeys_1 = new RangeSet2().addKeys(req.values ? result2.map(function(v) {
                return extractPrimKey(v);
              }) : result2);
              modifedResult = result2.concat(req.values ? includedValues.filter(function(v) {
                var key2 = extractPrimKey(v);
                if (existingKeys_1.hasKey(key2))
                  return false;
                existingKeys_1.addKey(key2);
                return true;
              }) : includedValues.map(function(v) {
                return extractPrimKey(v);
              }).filter(function(k) {
                if (existingKeys_1.hasKey(k))
                  return false;
                existingKeys_1.addKey(k);
                return true;
              }));
              break;
            }
            case "put": {
              var keySet_1 = new RangeSet2().addKeys(op.values.map(function(v) {
                return extractPrimKey(v);
              }));
              modifedResult = result2.filter(
                function(item) {
                  return !keySet_1.hasKey(req.values ? extractPrimKey(item) : item);
                }
              ).concat(
                req.values ? includedValues : includedValues.map(function(v) {
                  return extractPrimKey(v);
                })
              );
              break;
            }
            case "delete":
              var keysToDelete_1 = new RangeSet2().addKeys(op.keys);
              modifedResult = result2.filter(function(item) {
                return !keysToDelete_1.hasKey(req.values ? extractPrimKey(item) : item);
              });
              break;
            case "deleteRange":
              var range_1 = op.range;
              modifedResult = result2.filter(function(item) {
                return !isWithinRange(extractPrimKey(item), range_1);
              });
              break;
          }
          return modifedResult;
        }, result);
        if (finalResult === result)
          return result;
        finalResult.sort(function(a, b) {
          return cmp2(extractLowLevelIndex(a), extractLowLevelIndex(b)) || cmp2(extractPrimKey(a), extractPrimKey(b));
        });
        if (req.limit && req.limit < Infinity) {
          if (finalResult.length > req.limit) {
            finalResult.length = req.limit;
          } else if (result.length === req.limit && finalResult.length < req.limit) {
            cacheEntry.dirty = true;
          }
        }
        return immutable ? Object.freeze(finalResult) : finalResult;
      }
      function areRangesEqual(r1, r2) {
        return cmp2(r1.lower, r2.lower) === 0 && cmp2(r1.upper, r2.upper) === 0 && !!r1.lowerOpen === !!r2.lowerOpen && !!r1.upperOpen === !!r2.upperOpen;
      }
      function compareLowers(lower1, lower2, lowerOpen1, lowerOpen2) {
        if (lower1 === void 0)
          return lower2 !== void 0 ? -1 : 0;
        if (lower2 === void 0)
          return 1;
        var c = cmp2(lower1, lower2);
        if (c === 0) {
          if (lowerOpen1 && lowerOpen2)
            return 0;
          if (lowerOpen1)
            return 1;
          if (lowerOpen2)
            return -1;
        }
        return c;
      }
      function compareUppers(upper1, upper2, upperOpen1, upperOpen2) {
        if (upper1 === void 0)
          return upper2 !== void 0 ? 1 : 0;
        if (upper2 === void 0)
          return -1;
        var c = cmp2(upper1, upper2);
        if (c === 0) {
          if (upperOpen1 && upperOpen2)
            return 0;
          if (upperOpen1)
            return -1;
          if (upperOpen2)
            return 1;
        }
        return c;
      }
      function isSuperRange(r1, r2) {
        return compareLowers(r1.lower, r2.lower, r1.lowerOpen, r2.lowerOpen) <= 0 && compareUppers(r1.upper, r2.upper, r1.upperOpen, r2.upperOpen) >= 0;
      }
      function findCompatibleQuery(dbName, tableName, type6, req) {
        var tblCache = cache["idb://".concat(dbName, "/").concat(tableName)];
        if (!tblCache)
          return [];
        var queries = tblCache.queries[type6];
        if (!queries)
          return [null, false, tblCache, null];
        var indexName = req.query ? req.query.index.name : null;
        var entries = queries[indexName || ""];
        if (!entries)
          return [null, false, tblCache, null];
        switch (type6) {
          case "query":
            var equalEntry = entries.find(function(entry) {
              return entry.req.limit === req.limit && entry.req.values === req.values && areRangesEqual(entry.req.query.range, req.query.range);
            });
            if (equalEntry)
              return [
                equalEntry,
                true,
                tblCache,
                entries
              ];
            var superEntry = entries.find(function(entry) {
              var limit = "limit" in entry.req ? entry.req.limit : Infinity;
              return limit >= req.limit && (req.values ? entry.req.values : true) && isSuperRange(entry.req.query.range, req.query.range);
            });
            return [superEntry, false, tblCache, entries];
          case "count":
            var countQuery = entries.find(function(entry) {
              return areRangesEqual(entry.req.query.range, req.query.range);
            });
            return [countQuery, !!countQuery, tblCache, entries];
        }
      }
      function subscribeToCacheEntry(cacheEntry, container, requery, signal) {
        cacheEntry.subscribers.add(requery);
        signal.addEventListener("abort", function() {
          cacheEntry.subscribers.delete(requery);
          if (cacheEntry.subscribers.size === 0) {
            enqueForDeletion(cacheEntry, container);
          }
        });
      }
      function enqueForDeletion(cacheEntry, container) {
        setTimeout(function() {
          if (cacheEntry.subscribers.size === 0) {
            delArrayItem(container, cacheEntry);
          }
        }, 3e3);
      }
      var cacheMiddleware = {
        stack: "dbcore",
        level: 0,
        name: "Cache",
        create: function(core) {
          var dbName = core.schema.name;
          var coreMW = __assign(__assign({}, core), { transaction: function(stores, mode, options) {
            var idbtrans = core.transaction(stores, mode, options);
            if (mode === "readwrite") {
              var ac_1 = new AbortController();
              var signal = ac_1.signal;
              var endTransaction = function(wasCommitted) {
                return function() {
                  ac_1.abort();
                  if (mode === "readwrite") {
                    var affectedSubscribers_1 = /* @__PURE__ */ new Set();
                    for (var _i = 0, stores_1 = stores; _i < stores_1.length; _i++) {
                      var storeName = stores_1[_i];
                      var tblCache = cache["idb://".concat(dbName, "/").concat(storeName)];
                      if (tblCache) {
                        var table = core.table(storeName);
                        var ops = tblCache.optimisticOps.filter(function(op) {
                          return op.trans === idbtrans;
                        });
                        if (idbtrans._explicit && wasCommitted && idbtrans.mutatedParts) {
                          for (var _a2 = 0, _b = Object.values(tblCache.queries.query); _a2 < _b.length; _a2++) {
                            var entries = _b[_a2];
                            for (var _c = 0, _d = entries.slice(); _c < _d.length; _c++) {
                              var entry = _d[_c];
                              if (obsSetsOverlap(entry.obsSet, idbtrans.mutatedParts)) {
                                delArrayItem(entries, entry);
                                entry.subscribers.forEach(function(requery) {
                                  return affectedSubscribers_1.add(requery);
                                });
                              }
                            }
                          }
                        } else if (ops.length > 0) {
                          tblCache.optimisticOps = tblCache.optimisticOps.filter(function(op) {
                            return op.trans !== idbtrans;
                          });
                          for (var _e = 0, _f = Object.values(tblCache.queries.query); _e < _f.length; _e++) {
                            var entries = _f[_e];
                            for (var _g = 0, _h = entries.slice(); _g < _h.length; _g++) {
                              var entry = _h[_g];
                              if (entry.res != null && idbtrans.mutatedParts) {
                                if (wasCommitted && !entry.dirty) {
                                  var freezeResults = Object.isFrozen(entry.res);
                                  var modRes = applyOptimisticOps(entry.res, entry.req, ops, table, entry, freezeResults);
                                  if (entry.dirty) {
                                    delArrayItem(entries, entry);
                                    entry.subscribers.forEach(function(requery) {
                                      return affectedSubscribers_1.add(requery);
                                    });
                                  } else if (modRes !== entry.res) {
                                    entry.res = modRes;
                                    entry.promise = DexiePromise.resolve({ result: modRes });
                                  }
                                } else {
                                  if (entry.dirty) {
                                    delArrayItem(entries, entry);
                                  }
                                  entry.subscribers.forEach(function(requery) {
                                    return affectedSubscribers_1.add(requery);
                                  });
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                    affectedSubscribers_1.forEach(function(requery) {
                      return requery();
                    });
                  }
                };
              };
              idbtrans.addEventListener("abort", endTransaction(false), {
                signal
              });
              idbtrans.addEventListener("error", endTransaction(false), {
                signal
              });
              idbtrans.addEventListener("complete", endTransaction(true), {
                signal
              });
            }
            return idbtrans;
          }, table: function(tableName) {
            var downTable = core.table(tableName);
            var primKey = downTable.schema.primaryKey;
            var tableMW = __assign(__assign({}, downTable), { mutate: function(req) {
              var trans = PSD.trans;
              if (primKey.outbound || trans.db._options.cache === "disabled" || trans.explicit || trans.idbtrans.mode !== "readwrite") {
                return downTable.mutate(req);
              }
              var tblCache = cache["idb://".concat(dbName, "/").concat(tableName)];
              if (!tblCache)
                return downTable.mutate(req);
              var promise = downTable.mutate(req);
              if ((req.type === "add" || req.type === "put") && (req.values.length >= 50 || getEffectiveKeys(primKey, req).some(function(key) {
                return key == null;
              }))) {
                promise.then(function(res) {
                  var reqWithResolvedKeys = __assign(__assign({}, req), { values: req.values.map(function(value, i) {
                    var _a2;
                    if (res.failures[i])
                      return value;
                    var valueWithKey = ((_a2 = primKey.keyPath) === null || _a2 === void 0 ? void 0 : _a2.includes(".")) ? deepClone2(value) : __assign({}, value);
                    setByKeyPath(valueWithKey, primKey.keyPath, res.results[i]);
                    return valueWithKey;
                  }) });
                  var adjustedReq = adjustOptimisticFromFailures(tblCache, reqWithResolvedKeys, res);
                  tblCache.optimisticOps.push(adjustedReq);
                  queueMicrotask(function() {
                    return req.mutatedParts && signalSubscribersLazily(req.mutatedParts);
                  });
                });
              } else {
                tblCache.optimisticOps.push(req);
                req.mutatedParts && signalSubscribersLazily(req.mutatedParts);
                promise.then(function(res) {
                  if (res.numFailures > 0) {
                    delArrayItem(tblCache.optimisticOps, req);
                    var adjustedReq = adjustOptimisticFromFailures(tblCache, req, res);
                    if (adjustedReq) {
                      tblCache.optimisticOps.push(adjustedReq);
                    }
                    req.mutatedParts && signalSubscribersLazily(req.mutatedParts);
                  }
                });
                promise.catch(function() {
                  delArrayItem(tblCache.optimisticOps, req);
                  req.mutatedParts && signalSubscribersLazily(req.mutatedParts);
                });
              }
              return promise;
            }, query: function(req) {
              var _a2;
              if (!isCachableContext(PSD, downTable) || !isCachableRequest("query", req))
                return downTable.query(req);
              var freezeResults = ((_a2 = PSD.trans) === null || _a2 === void 0 ? void 0 : _a2.db._options.cache) === "immutable";
              var _b = PSD, requery = _b.requery, signal = _b.signal;
              var _c = findCompatibleQuery(dbName, tableName, "query", req), cacheEntry = _c[0], exactMatch = _c[1], tblCache = _c[2], container = _c[3];
              if (cacheEntry && exactMatch) {
                cacheEntry.obsSet = req.obsSet;
              } else {
                var promise = downTable.query(req).then(function(res) {
                  var result = res.result;
                  if (cacheEntry)
                    cacheEntry.res = result;
                  if (freezeResults) {
                    for (var i = 0, l = result.length; i < l; ++i) {
                      Object.freeze(result[i]);
                    }
                    Object.freeze(result);
                  } else {
                    res.result = deepClone2(result);
                  }
                  return res;
                }).catch(function(error) {
                  if (container && cacheEntry)
                    delArrayItem(container, cacheEntry);
                  return Promise.reject(error);
                });
                cacheEntry = {
                  obsSet: req.obsSet,
                  promise,
                  subscribers: /* @__PURE__ */ new Set(),
                  type: "query",
                  req,
                  dirty: false
                };
                if (container) {
                  container.push(cacheEntry);
                } else {
                  container = [cacheEntry];
                  if (!tblCache) {
                    tblCache = cache["idb://".concat(dbName, "/").concat(tableName)] = {
                      queries: {
                        query: {},
                        count: {}
                      },
                      objs: /* @__PURE__ */ new Map(),
                      optimisticOps: [],
                      unsignaledParts: {}
                    };
                  }
                  tblCache.queries.query[req.query.index.name || ""] = container;
                }
              }
              subscribeToCacheEntry(cacheEntry, container, requery, signal);
              return cacheEntry.promise.then(function(res) {
                return {
                  result: applyOptimisticOps(res.result, req, tblCache === null || tblCache === void 0 ? void 0 : tblCache.optimisticOps, downTable, cacheEntry, freezeResults)
                };
              });
            } });
            return tableMW;
          } });
          return coreMW;
        }
      };
      function vipify(target, vipDb) {
        return new Proxy(target, {
          get: function(target2, prop, receiver) {
            if (prop === "db")
              return vipDb;
            return Reflect.get(target2, prop, receiver);
          }
        });
      }
      var Dexie$1 = function() {
        function Dexie3(name, options) {
          var _this = this;
          this._middlewares = {};
          this.verno = 0;
          var deps = Dexie3.dependencies;
          this._options = options = __assign({
            addons: Dexie3.addons,
            autoOpen: true,
            indexedDB: deps.indexedDB,
            IDBKeyRange: deps.IDBKeyRange,
            cache: "cloned"
          }, options);
          this._deps = {
            indexedDB: options.indexedDB,
            IDBKeyRange: options.IDBKeyRange
          };
          var addons = options.addons;
          this._dbSchema = {};
          this._versions = [];
          this._storeNames = [];
          this._allTables = {};
          this.idbdb = null;
          this._novip = this;
          var state = {
            dbOpenError: null,
            isBeingOpened: false,
            onReadyBeingFired: null,
            openComplete: false,
            dbReadyResolve: nop,
            dbReadyPromise: null,
            cancelOpen: nop,
            openCanceller: null,
            autoSchema: true,
            PR1398_maxLoop: 3,
            autoOpen: options.autoOpen
          };
          state.dbReadyPromise = new DexiePromise(function(resolve2) {
            state.dbReadyResolve = resolve2;
          });
          state.openCanceller = new DexiePromise(function(_, reject) {
            state.cancelOpen = reject;
          });
          this._state = state;
          this.name = name;
          this.on = Events(this, "populate", "blocked", "versionchange", "close", { ready: [promisableChain, nop] });
          this.on.ready.subscribe = override(this.on.ready.subscribe, function(subscribe) {
            return function(subscriber, bSticky) {
              Dexie3.vip(function() {
                var state2 = _this._state;
                if (state2.openComplete) {
                  if (!state2.dbOpenError)
                    DexiePromise.resolve().then(subscriber);
                  if (bSticky)
                    subscribe(subscriber);
                } else if (state2.onReadyBeingFired) {
                  state2.onReadyBeingFired.push(subscriber);
                  if (bSticky)
                    subscribe(subscriber);
                } else {
                  subscribe(subscriber);
                  var db_1 = _this;
                  if (!bSticky)
                    subscribe(function unsubscribe() {
                      db_1.on.ready.unsubscribe(subscriber);
                      db_1.on.ready.unsubscribe(unsubscribe);
                    });
                }
              });
            };
          });
          this.Collection = createCollectionConstructor(this);
          this.Table = createTableConstructor(this);
          this.Transaction = createTransactionConstructor(this);
          this.Version = createVersionConstructor(this);
          this.WhereClause = createWhereClauseConstructor(this);
          this.on("versionchange", function(ev) {
            if (ev.newVersion > 0)
              console.warn("Another connection wants to upgrade database '".concat(_this.name, "'. Closing db now to resume the upgrade."));
            else
              console.warn("Another connection wants to delete database '".concat(_this.name, "'. Closing db now to resume the delete request."));
            _this.close({ disableAutoOpen: false });
          });
          this.on("blocked", function(ev) {
            if (!ev.newVersion || ev.newVersion < ev.oldVersion)
              console.warn("Dexie.delete('".concat(_this.name, "') was blocked"));
            else
              console.warn("Upgrade '".concat(_this.name, "' blocked by other connection holding version ").concat(ev.oldVersion / 10));
          });
          this._maxKey = getMaxKey(options.IDBKeyRange);
          this._createTransaction = function(mode, storeNames, dbschema, parentTransaction) {
            return new _this.Transaction(mode, storeNames, dbschema, _this._options.chromeTransactionDurability, parentTransaction);
          };
          this._fireOnBlocked = function(ev) {
            _this.on("blocked").fire(ev);
            connections.filter(function(c) {
              return c.name === _this.name && c !== _this && !c._state.vcFired;
            }).map(function(c) {
              return c.on("versionchange").fire(ev);
            });
          };
          this.use(cacheExistingValuesMiddleware);
          this.use(cacheMiddleware);
          this.use(observabilityMiddleware);
          this.use(virtualIndexMiddleware);
          this.use(hooksMiddleware);
          var vipDB = new Proxy(this, {
            get: function(_, prop, receiver) {
              if (prop === "_vip")
                return true;
              if (prop === "table")
                return function(tableName) {
                  return vipify(_this.table(tableName), vipDB);
                };
              var rv = Reflect.get(_, prop, receiver);
              if (rv instanceof Table)
                return vipify(rv, vipDB);
              if (prop === "tables")
                return rv.map(function(t) {
                  return vipify(t, vipDB);
                });
              if (prop === "_createTransaction")
                return function() {
                  var tx = rv.apply(this, arguments);
                  return vipify(tx, vipDB);
                };
              return rv;
            }
          });
          this.vip = vipDB;
          addons.forEach(function(addon) {
            return addon(_this);
          });
        }
        Dexie3.prototype.version = function(versionNumber) {
          if (isNaN(versionNumber) || versionNumber < 0.1)
            throw new exceptions.Type("Given version is not a positive number");
          versionNumber = Math.round(versionNumber * 10) / 10;
          if (this.idbdb || this._state.isBeingOpened)
            throw new exceptions.Schema("Cannot add version when database is open");
          this.verno = Math.max(this.verno, versionNumber);
          var versions = this._versions;
          var versionInstance = versions.filter(function(v) {
            return v._cfg.version === versionNumber;
          })[0];
          if (versionInstance)
            return versionInstance;
          versionInstance = new this.Version(versionNumber);
          versions.push(versionInstance);
          versions.sort(lowerVersionFirst);
          versionInstance.stores({});
          this._state.autoSchema = false;
          return versionInstance;
        };
        Dexie3.prototype._whenReady = function(fn) {
          var _this = this;
          return this.idbdb && (this._state.openComplete || PSD.letThrough || this._vip) ? fn() : new DexiePromise(function(resolve2, reject) {
            if (_this._state.openComplete) {
              return reject(new exceptions.DatabaseClosed(_this._state.dbOpenError));
            }
            if (!_this._state.isBeingOpened) {
              if (!_this._state.autoOpen) {
                reject(new exceptions.DatabaseClosed());
                return;
              }
              _this.open().catch(nop);
            }
            _this._state.dbReadyPromise.then(resolve2, reject);
          }).then(fn);
        };
        Dexie3.prototype.use = function(_a2) {
          var stack = _a2.stack, create5 = _a2.create, level = _a2.level, name = _a2.name;
          if (name)
            this.unuse({ stack, name });
          var middlewares = this._middlewares[stack] || (this._middlewares[stack] = []);
          middlewares.push({ stack, create: create5, level: level == null ? 10 : level, name });
          middlewares.sort(function(a, b) {
            return a.level - b.level;
          });
          return this;
        };
        Dexie3.prototype.unuse = function(_a2) {
          var stack = _a2.stack, name = _a2.name, create5 = _a2.create;
          if (stack && this._middlewares[stack]) {
            this._middlewares[stack] = this._middlewares[stack].filter(function(mw) {
              return create5 ? mw.create !== create5 : name ? mw.name !== name : false;
            });
          }
          return this;
        };
        Dexie3.prototype.open = function() {
          var _this = this;
          return usePSD(
            globalPSD,
            function() {
              return dexieOpen(_this);
            }
          );
        };
        Dexie3.prototype._close = function() {
          var state = this._state;
          var idx = connections.indexOf(this);
          if (idx >= 0)
            connections.splice(idx, 1);
          if (this.idbdb) {
            try {
              this.idbdb.close();
            } catch (e) {
            }
            this.idbdb = null;
          }
          if (!state.isBeingOpened) {
            state.dbReadyPromise = new DexiePromise(function(resolve2) {
              state.dbReadyResolve = resolve2;
            });
            state.openCanceller = new DexiePromise(function(_, reject) {
              state.cancelOpen = reject;
            });
          }
        };
        Dexie3.prototype.close = function(_a2) {
          var _b = _a2 === void 0 ? { disableAutoOpen: true } : _a2, disableAutoOpen = _b.disableAutoOpen;
          var state = this._state;
          if (disableAutoOpen) {
            if (state.isBeingOpened) {
              state.cancelOpen(new exceptions.DatabaseClosed());
            }
            this._close();
            state.autoOpen = false;
            state.dbOpenError = new exceptions.DatabaseClosed();
          } else {
            this._close();
            state.autoOpen = this._options.autoOpen || state.isBeingOpened;
            state.openComplete = false;
            state.dbOpenError = null;
          }
        };
        Dexie3.prototype.delete = function(closeOptions) {
          var _this = this;
          if (closeOptions === void 0) {
            closeOptions = { disableAutoOpen: true };
          }
          var hasInvalidArguments = arguments.length > 0 && typeof arguments[0] !== "object";
          var state = this._state;
          return new DexiePromise(function(resolve2, reject) {
            var doDelete = function() {
              _this.close(closeOptions);
              var req = _this._deps.indexedDB.deleteDatabase(_this.name);
              req.onsuccess = wrap(function() {
                _onDatabaseDeleted(_this._deps, _this.name);
                resolve2();
              });
              req.onerror = eventRejectHandler(reject);
              req.onblocked = _this._fireOnBlocked;
            };
            if (hasInvalidArguments)
              throw new exceptions.InvalidArgument("Invalid closeOptions argument to db.delete()");
            if (state.isBeingOpened) {
              state.dbReadyPromise.then(doDelete);
            } else {
              doDelete();
            }
          });
        };
        Dexie3.prototype.backendDB = function() {
          return this.idbdb;
        };
        Dexie3.prototype.isOpen = function() {
          return this.idbdb !== null;
        };
        Dexie3.prototype.hasBeenClosed = function() {
          var dbOpenError = this._state.dbOpenError;
          return dbOpenError && dbOpenError.name === "DatabaseClosed";
        };
        Dexie3.prototype.hasFailed = function() {
          return this._state.dbOpenError !== null;
        };
        Dexie3.prototype.dynamicallyOpened = function() {
          return this._state.autoSchema;
        };
        Object.defineProperty(Dexie3.prototype, "tables", {
          get: function() {
            var _this = this;
            return keys(this._allTables).map(function(name) {
              return _this._allTables[name];
            });
          },
          enumerable: false,
          configurable: true
        });
        Dexie3.prototype.transaction = function() {
          var args = extractTransactionArgs.apply(this, arguments);
          return this._transaction.apply(this, args);
        };
        Dexie3.prototype._transaction = function(mode, tables, scopeFunc) {
          var _this = this;
          var parentTransaction = PSD.trans;
          if (!parentTransaction || parentTransaction.db !== this || mode.indexOf("!") !== -1)
            parentTransaction = null;
          var onlyIfCompatible = mode.indexOf("?") !== -1;
          mode = mode.replace("!", "").replace("?", "");
          var idbMode, storeNames;
          try {
            storeNames = tables.map(function(table) {
              var storeName = table instanceof _this.Table ? table.name : table;
              if (typeof storeName !== "string")
                throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
              return storeName;
            });
            if (mode == "r" || mode === READONLY)
              idbMode = READONLY;
            else if (mode == "rw" || mode == READWRITE)
              idbMode = READWRITE;
            else
              throw new exceptions.InvalidArgument("Invalid transaction mode: " + mode);
            if (parentTransaction) {
              if (parentTransaction.mode === READONLY && idbMode === READWRITE) {
                if (onlyIfCompatible) {
                  parentTransaction = null;
                } else
                  throw new exceptions.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
              }
              if (parentTransaction) {
                storeNames.forEach(function(storeName) {
                  if (parentTransaction && parentTransaction.storeNames.indexOf(storeName) === -1) {
                    if (onlyIfCompatible) {
                      parentTransaction = null;
                    } else
                      throw new exceptions.SubTransaction("Table " + storeName + " not included in parent transaction.");
                  }
                });
              }
              if (onlyIfCompatible && parentTransaction && !parentTransaction.active) {
                parentTransaction = null;
              }
            }
          } catch (e) {
            return parentTransaction ? parentTransaction._promise(null, function(_, reject) {
              reject(e);
            }) : rejection(e);
          }
          var enterTransaction = enterTransactionScope.bind(null, this, idbMode, storeNames, parentTransaction, scopeFunc);
          return parentTransaction ? parentTransaction._promise(idbMode, enterTransaction, "lock") : PSD.trans ? usePSD(PSD.transless, function() {
            return _this._whenReady(enterTransaction);
          }) : this._whenReady(enterTransaction);
        };
        Dexie3.prototype.table = function(tableName) {
          if (!hasOwn(this._allTables, tableName)) {
            throw new exceptions.InvalidTable("Table ".concat(tableName, " does not exist"));
          }
          return this._allTables[tableName];
        };
        return Dexie3;
      }();
      var symbolObservable = typeof Symbol !== "undefined" && "observable" in Symbol ? Symbol.observable : "@@observable";
      var Observable2 = function() {
        function Observable3(subscribe) {
          this._subscribe = subscribe;
        }
        Observable3.prototype.subscribe = function(x, error, complete) {
          return this._subscribe(!x || typeof x === "function" ? { next: x, error, complete } : x);
        };
        Observable3.prototype[symbolObservable] = function() {
          return this;
        };
        return Observable3;
      }();
      var domDeps;
      try {
        domDeps = {
          indexedDB: _global.indexedDB || _global.mozIndexedDB || _global.webkitIndexedDB || _global.msIndexedDB,
          IDBKeyRange: _global.IDBKeyRange || _global.webkitIDBKeyRange
        };
      } catch (e) {
        domDeps = { indexedDB: null, IDBKeyRange: null };
      }
      function liveQuery2(querier) {
        var hasValue = false;
        var currentValue;
        var observable2 = new Observable2(function(observer) {
          var scopeFuncIsAsync = isAsyncFunction(querier);
          function execute(ctx) {
            var wasRootExec = beginMicroTickScope();
            try {
              if (scopeFuncIsAsync) {
                incrementExpectedAwaits();
              }
              var rv = newScope(querier, ctx);
              if (scopeFuncIsAsync) {
                rv = rv.finally(decrementExpectedAwaits);
              }
              return rv;
            } finally {
              wasRootExec && endMicroTickScope();
            }
          }
          var closed = false;
          var abortController;
          var accumMuts = {};
          var currentObs = {};
          var subscription = {
            get closed() {
              return closed;
            },
            unsubscribe: function() {
              if (closed)
                return;
              closed = true;
              if (abortController)
                abortController.abort();
              if (startedListening2)
                globalEvents.storagemutated.unsubscribe(mutationListener);
            }
          };
          observer.start && observer.start(subscription);
          var startedListening2 = false;
          var doQuery = function() {
            return execInGlobalContext(_doQuery);
          };
          function shouldNotify() {
            return obsSetsOverlap(currentObs, accumMuts);
          }
          var mutationListener = function(parts) {
            extendObservabilitySet(accumMuts, parts);
            if (shouldNotify()) {
              doQuery();
            }
          };
          var _doQuery = function() {
            if (closed || !domDeps.indexedDB) {
              return;
            }
            accumMuts = {};
            var subscr = {};
            if (abortController)
              abortController.abort();
            abortController = new AbortController();
            var ctx = {
              subscr,
              signal: abortController.signal,
              requery: doQuery,
              querier,
              trans: null
            };
            var ret = execute(ctx);
            Promise.resolve(ret).then(function(result) {
              hasValue = true;
              currentValue = result;
              if (closed || ctx.signal.aborted) {
                return;
              }
              accumMuts = {};
              currentObs = subscr;
              if (!objectIsEmpty(currentObs) && !startedListening2) {
                globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, mutationListener);
                startedListening2 = true;
              }
              execInGlobalContext(function() {
                return !closed && observer.next && observer.next(result);
              });
            }, function(err) {
              hasValue = false;
              if (!["DatabaseClosedError", "AbortError"].includes(err === null || err === void 0 ? void 0 : err.name)) {
                if (!closed)
                  execInGlobalContext(function() {
                    if (closed)
                      return;
                    observer.error && observer.error(err);
                  });
              }
            });
          };
          setTimeout(doQuery, 0);
          return subscription;
        });
        observable2.hasValue = function() {
          return hasValue;
        };
        observable2.getValue = function() {
          return currentValue;
        };
        return observable2;
      }
      var Dexie2 = Dexie$1;
      props(Dexie2, __assign(__assign({}, fullNameExceptions), {
        delete: function(databaseName) {
          var db = new Dexie2(databaseName, { addons: [] });
          return db.delete();
        },
        exists: function(name) {
          return new Dexie2(name, { addons: [] }).open().then(function(db) {
            db.close();
            return true;
          }).catch("NoSuchDatabaseError", function() {
            return false;
          });
        },
        getDatabaseNames: function(cb) {
          try {
            return getDatabaseNames(Dexie2.dependencies).then(cb);
          } catch (_a2) {
            return rejection(new exceptions.MissingAPI());
          }
        },
        defineClass: function() {
          function Class(content) {
            extend(this, content);
          }
          return Class;
        },
        ignoreTransaction: function(scopeFunc) {
          return PSD.trans ? usePSD(PSD.transless, scopeFunc) : scopeFunc();
        },
        vip,
        async: function(generatorFn) {
          return function() {
            try {
              var rv = awaitIterator(generatorFn.apply(this, arguments));
              if (!rv || typeof rv.then !== "function")
                return DexiePromise.resolve(rv);
              return rv;
            } catch (e) {
              return rejection(e);
            }
          };
        },
        spawn: function(generatorFn, args, thiz) {
          try {
            var rv = awaitIterator(generatorFn.apply(thiz, args || []));
            if (!rv || typeof rv.then !== "function")
              return DexiePromise.resolve(rv);
            return rv;
          } catch (e) {
            return rejection(e);
          }
        },
        currentTransaction: {
          get: function() {
            return PSD.trans || null;
          }
        },
        waitFor: function(promiseOrFunction, optionalTimeout) {
          var promise = DexiePromise.resolve(typeof promiseOrFunction === "function" ? Dexie2.ignoreTransaction(promiseOrFunction) : promiseOrFunction).timeout(optionalTimeout || 6e4);
          return PSD.trans ? PSD.trans.waitFor(promise) : promise;
        },
        Promise: DexiePromise,
        debug: {
          get: function() {
            return debug;
          },
          set: function(value) {
            setDebug(value);
          }
        },
        derive,
        extend,
        props,
        override,
        Events,
        on: globalEvents,
        liveQuery: liveQuery2,
        extendObservabilitySet,
        getByKeyPath,
        setByKeyPath,
        delByKeyPath,
        shallowClone,
        deepClone: deepClone2,
        getObjectDiff,
        cmp: cmp2,
        asap: asap$1,
        minKey,
        addons: [],
        connections,
        errnames,
        dependencies: domDeps,
        cache,
        semVer: DEXIE_VERSION,
        version: DEXIE_VERSION.split(".").map(function(n) {
          return parseInt(n);
        }).reduce(function(p, c, i) {
          return p + c / Math.pow(10, i * 2);
        })
      }));
      Dexie2.maxKey = getMaxKey(Dexie2.dependencies.IDBKeyRange);
      if (typeof dispatchEvent !== "undefined" && typeof addEventListener !== "undefined") {
        globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, function(updatedParts) {
          if (!propagatingLocally) {
            var event_1;
            event_1 = new CustomEvent(STORAGE_MUTATED_DOM_EVENT_NAME, {
              detail: updatedParts
            });
            propagatingLocally = true;
            dispatchEvent(event_1);
            propagatingLocally = false;
          }
        });
        addEventListener(STORAGE_MUTATED_DOM_EVENT_NAME, function(_a2) {
          var detail = _a2.detail;
          if (!propagatingLocally) {
            propagateLocally(detail);
          }
        });
      }
      function propagateLocally(updateParts) {
        var wasMe = propagatingLocally;
        try {
          propagatingLocally = true;
          globalEvents.storagemutated.fire(updateParts);
          signalSubscribersNow(updateParts, true);
        } finally {
          propagatingLocally = wasMe;
        }
      }
      var propagatingLocally = false;
      var bc;
      var createBC = function() {
      };
      if (typeof BroadcastChannel !== "undefined") {
        createBC = function() {
          bc = new BroadcastChannel(STORAGE_MUTATED_DOM_EVENT_NAME);
          bc.onmessage = function(ev) {
            return ev.data && propagateLocally(ev.data);
          };
        };
        createBC();
        if (typeof bc.unref === "function") {
          bc.unref();
        }
        globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, function(changedParts) {
          if (!propagatingLocally) {
            bc.postMessage(changedParts);
          }
        });
      }
      if (typeof addEventListener !== "undefined") {
        addEventListener("pagehide", function(event) {
          if (!Dexie$1.disableBfCache && event.persisted) {
            if (debug)
              console.debug("Dexie: handling persisted pagehide");
            bc === null || bc === void 0 ? void 0 : bc.close();
            for (var _i = 0, connections_1 = connections; _i < connections_1.length; _i++) {
              var db = connections_1[_i];
              db.close({ disableAutoOpen: false });
            }
          }
        });
        addEventListener("pageshow", function(event) {
          if (!Dexie$1.disableBfCache && event.persisted) {
            if (debug)
              console.debug("Dexie: handling persisted pageshow");
            createBC();
            propagateLocally({ all: new RangeSet2(-Infinity, [[]]) });
          }
        });
      }
      function add3(value) {
        return new PropModification2({ add: value });
      }
      function remove2(value) {
        return new PropModification2({ remove: value });
      }
      function replacePrefix2(a, b) {
        return new PropModification2({ replacePrefix: [a, b] });
      }
      DexiePromise.rejectionMapper = mapError;
      setDebug(debug);
      var namedExports = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        Dexie: Dexie$1,
        liveQuery: liveQuery2,
        Entity: Entity2,
        cmp: cmp2,
        PropModSymbol: PropModSymbol2,
        PropModification: PropModification2,
        replacePrefix: replacePrefix2,
        add: add3,
        remove: remove2,
        "default": Dexie$1,
        RangeSet: RangeSet2,
        mergeRanges: mergeRanges2,
        rangesOverlap: rangesOverlap2
      });
      __assign(Dexie$1, namedExports, { default: Dexie$1 });
      return Dexie$1;
    });
  }
});

// node_modules/simple-peer/simplepeer.min.js
var require_simplepeer_min = __commonJS({
  "node_modules/simple-peer/simplepeer.min.js"(exports, module) {
    (function(e) {
      if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
      else if ("function" == typeof define && define.amd) define([], e);
      else {
        var t;
        t = "undefined" == typeof window ? "undefined" == typeof global ? "undefined" == typeof self ? this : self : global : window, t.SimplePeer = e();
      }
    })(function() {
      var t = Math.floor, n = Math.abs, r = Math.pow;
      return (/* @__PURE__ */ function() {
        function d(s, e, n2) {
          function t2(o, i) {
            if (!e[o]) {
              if (!s[o]) {
                var l = "function" == typeof __require && __require;
                if (!i && l) return l(o, true);
                if (r2) return r2(o, true);
                var c = new Error("Cannot find module '" + o + "'");
                throw c.code = "MODULE_NOT_FOUND", c;
              }
              var a2 = e[o] = { exports: {} };
              s[o][0].call(a2.exports, function(e2) {
                var r3 = s[o][1][e2];
                return t2(r3 || e2);
              }, a2, a2.exports, d, s, e, n2);
            }
            return e[o].exports;
          }
          for (var r2 = "function" == typeof __require && __require, a = 0; a < n2.length; a++) t2(n2[a]);
          return t2;
        }
        return d;
      }())({ 1: [function(e, t2, n2) {
        "use strict";
        function r2(e2) {
          var t3 = e2.length;
          if (0 < t3 % 4) throw new Error("Invalid string. Length must be a multiple of 4");
          var n3 = e2.indexOf("=");
          -1 === n3 && (n3 = t3);
          var r3 = n3 === t3 ? 0 : 4 - n3 % 4;
          return [n3, r3];
        }
        function a(e2, t3, n3) {
          return 3 * (t3 + n3) / 4 - n3;
        }
        function o(e2) {
          var t3, n3, o2 = r2(e2), d2 = o2[0], s2 = o2[1], l2 = new p(a(e2, d2, s2)), c2 = 0, f2 = 0 < s2 ? d2 - 4 : d2;
          for (n3 = 0; n3 < f2; n3 += 4) t3 = u[e2.charCodeAt(n3)] << 18 | u[e2.charCodeAt(n3 + 1)] << 12 | u[e2.charCodeAt(n3 + 2)] << 6 | u[e2.charCodeAt(n3 + 3)], l2[c2++] = 255 & t3 >> 16, l2[c2++] = 255 & t3 >> 8, l2[c2++] = 255 & t3;
          return 2 === s2 && (t3 = u[e2.charCodeAt(n3)] << 2 | u[e2.charCodeAt(n3 + 1)] >> 4, l2[c2++] = 255 & t3), 1 === s2 && (t3 = u[e2.charCodeAt(n3)] << 10 | u[e2.charCodeAt(n3 + 1)] << 4 | u[e2.charCodeAt(n3 + 2)] >> 2, l2[c2++] = 255 & t3 >> 8, l2[c2++] = 255 & t3), l2;
        }
        function d(e2) {
          return c[63 & e2 >> 18] + c[63 & e2 >> 12] + c[63 & e2 >> 6] + c[63 & e2];
        }
        function s(e2, t3, n3) {
          for (var r3, a2 = [], o2 = t3; o2 < n3; o2 += 3) r3 = (16711680 & e2[o2] << 16) + (65280 & e2[o2 + 1] << 8) + (255 & e2[o2 + 2]), a2.push(d(r3));
          return a2.join("");
        }
        function l(e2) {
          for (var t3, n3 = e2.length, r3 = n3 % 3, a2 = [], o2 = 16383, d2 = 0, l2 = n3 - r3; d2 < l2; d2 += o2) a2.push(s(e2, d2, d2 + o2 > l2 ? l2 : d2 + o2));
          return 1 === r3 ? (t3 = e2[n3 - 1], a2.push(c[t3 >> 2] + c[63 & t3 << 4] + "==")) : 2 === r3 && (t3 = (e2[n3 - 2] << 8) + e2[n3 - 1], a2.push(c[t3 >> 10] + c[63 & t3 >> 4] + c[63 & t3 << 2] + "=")), a2.join("");
        }
        n2.byteLength = function(e2) {
          var t3 = r2(e2), n3 = t3[0], a2 = t3[1];
          return 3 * (n3 + a2) / 4 - a2;
        }, n2.toByteArray = o, n2.fromByteArray = l;
        for (var c = [], u = [], p = "undefined" == typeof Uint8Array ? Array : Uint8Array, f = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", g = 0, _ = f.length; g < _; ++g) c[g] = f[g], u[f.charCodeAt(g)] = g;
        u[45] = 62, u[95] = 63;
      }, {}], 2: [function() {
      }, {}], 3: [function(e, t2, n2) {
        (function() {
          (function() {
            "use strict";
            var t3 = String.fromCharCode, o = Math.min;
            function d(e2) {
              if (2147483647 < e2) throw new RangeError('The value "' + e2 + '" is invalid for option "size"');
              var t4 = new Uint8Array(e2);
              return t4.__proto__ = s.prototype, t4;
            }
            function s(e2, t4, n3) {
              if ("number" == typeof e2) {
                if ("string" == typeof t4) throw new TypeError('The "string" argument must be of type string. Received type number');
                return p(e2);
              }
              return l(e2, t4, n3);
            }
            function l(e2, t4, n3) {
              if ("string" == typeof e2) return f(e2, t4);
              if (ArrayBuffer.isView(e2)) return g(e2);
              if (null == e2) throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e2);
              if (K(e2, ArrayBuffer) || e2 && K(e2.buffer, ArrayBuffer)) return _(e2, t4, n3);
              if ("number" == typeof e2) throw new TypeError('The "value" argument must not be of type number. Received type number');
              var r2 = e2.valueOf && e2.valueOf();
              if (null != r2 && r2 !== e2) return s.from(r2, t4, n3);
              var a = h(e2);
              if (a) return a;
              if ("undefined" != typeof Symbol && null != Symbol.toPrimitive && "function" == typeof e2[Symbol.toPrimitive]) return s.from(e2[Symbol.toPrimitive]("string"), t4, n3);
              throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e2);
            }
            function c(e2) {
              if ("number" != typeof e2) throw new TypeError('"size" argument must be of type number');
              else if (0 > e2) throw new RangeError('The value "' + e2 + '" is invalid for option "size"');
            }
            function u(e2, t4, n3) {
              return c(e2), 0 >= e2 ? d(e2) : void 0 === t4 ? d(e2) : "string" == typeof n3 ? d(e2).fill(t4, n3) : d(e2).fill(t4);
            }
            function p(e2) {
              return c(e2), d(0 > e2 ? 0 : 0 | m(e2));
            }
            function f(e2, t4) {
              if (("string" != typeof t4 || "" === t4) && (t4 = "utf8"), !s.isEncoding(t4)) throw new TypeError("Unknown encoding: " + t4);
              var n3 = 0 | b(e2, t4), r2 = d(n3), a = r2.write(e2, t4);
              return a !== n3 && (r2 = r2.slice(0, a)), r2;
            }
            function g(e2) {
              for (var t4 = 0 > e2.length ? 0 : 0 | m(e2.length), n3 = d(t4), r2 = 0; r2 < t4; r2 += 1) n3[r2] = 255 & e2[r2];
              return n3;
            }
            function _(e2, t4, n3) {
              if (0 > t4 || e2.byteLength < t4) throw new RangeError('"offset" is outside of buffer bounds');
              if (e2.byteLength < t4 + (n3 || 0)) throw new RangeError('"length" is outside of buffer bounds');
              var r2;
              return r2 = void 0 === t4 && void 0 === n3 ? new Uint8Array(e2) : void 0 === n3 ? new Uint8Array(e2, t4) : new Uint8Array(e2, t4, n3), r2.__proto__ = s.prototype, r2;
            }
            function h(e2) {
              if (s.isBuffer(e2)) {
                var t4 = 0 | m(e2.length), n3 = d(t4);
                return 0 === n3.length ? n3 : (e2.copy(n3, 0, 0, t4), n3);
              }
              return void 0 === e2.length ? "Buffer" === e2.type && Array.isArray(e2.data) ? g(e2.data) : void 0 : "number" != typeof e2.length || X(e2.length) ? d(0) : g(e2);
            }
            function m(e2) {
              if (e2 >= 2147483647) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + 2147483647 .toString(16) + " bytes");
              return 0 | e2;
            }
            function b(e2, t4) {
              if (s.isBuffer(e2)) return e2.length;
              if (ArrayBuffer.isView(e2) || K(e2, ArrayBuffer)) return e2.byteLength;
              if ("string" != typeof e2) throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof e2);
              var n3 = e2.length, r2 = 2 < arguments.length && true === arguments[2];
              if (!r2 && 0 === n3) return 0;
              for (var a = false; ; ) switch (t4) {
                case "ascii":
                case "latin1":
                case "binary":
                  return n3;
                case "utf8":
                case "utf-8":
                  return H(e2).length;
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                  return 2 * n3;
                case "hex":
                  return n3 >>> 1;
                case "base64":
                  return z(e2).length;
                default:
                  if (a) return r2 ? -1 : H(e2).length;
                  t4 = ("" + t4).toLowerCase(), a = true;
              }
            }
            function y(e2, t4, n3) {
              var r2 = false;
              if ((void 0 === t4 || 0 > t4) && (t4 = 0), t4 > this.length) return "";
              if ((void 0 === n3 || n3 > this.length) && (n3 = this.length), 0 >= n3) return "";
              if (n3 >>>= 0, t4 >>>= 0, n3 <= t4) return "";
              for (e2 || (e2 = "utf8"); ; ) switch (e2) {
                case "hex":
                  return P(this, t4, n3);
                case "utf8":
                case "utf-8":
                  return x(this, t4, n3);
                case "ascii":
                  return D(this, t4, n3);
                case "latin1":
                case "binary":
                  return I(this, t4, n3);
                case "base64":
                  return A(this, t4, n3);
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                  return M(this, t4, n3);
                default:
                  if (r2) throw new TypeError("Unknown encoding: " + e2);
                  e2 = (e2 + "").toLowerCase(), r2 = true;
              }
            }
            function C(e2, t4, n3) {
              var r2 = e2[t4];
              e2[t4] = e2[n3], e2[n3] = r2;
            }
            function R(e2, t4, n3, r2, a) {
              if (0 === e2.length) return -1;
              if ("string" == typeof n3 ? (r2 = n3, n3 = 0) : 2147483647 < n3 ? n3 = 2147483647 : -2147483648 > n3 && (n3 = -2147483648), n3 = +n3, X(n3) && (n3 = a ? 0 : e2.length - 1), 0 > n3 && (n3 = e2.length + n3), n3 >= e2.length) {
                if (a) return -1;
                n3 = e2.length - 1;
              } else if (0 > n3) if (a) n3 = 0;
              else return -1;
              if ("string" == typeof t4 && (t4 = s.from(t4, r2)), s.isBuffer(t4)) return 0 === t4.length ? -1 : E(e2, t4, n3, r2, a);
              if ("number" == typeof t4) return t4 &= 255, "function" == typeof Uint8Array.prototype.indexOf ? a ? Uint8Array.prototype.indexOf.call(e2, t4, n3) : Uint8Array.prototype.lastIndexOf.call(e2, t4, n3) : E(e2, [t4], n3, r2, a);
              throw new TypeError("val must be string, number or Buffer");
            }
            function E(e2, t4, n3, r2, a) {
              function o2(e3, t5) {
                return 1 === d2 ? e3[t5] : e3.readUInt16BE(t5 * d2);
              }
              var d2 = 1, s2 = e2.length, l2 = t4.length;
              if (void 0 !== r2 && (r2 = (r2 + "").toLowerCase(), "ucs2" === r2 || "ucs-2" === r2 || "utf16le" === r2 || "utf-16le" === r2)) {
                if (2 > e2.length || 2 > t4.length) return -1;
                d2 = 2, s2 /= 2, l2 /= 2, n3 /= 2;
              }
              var c2;
              if (a) {
                var u2 = -1;
                for (c2 = n3; c2 < s2; c2++) if (o2(e2, c2) !== o2(t4, -1 === u2 ? 0 : c2 - u2)) -1 !== u2 && (c2 -= c2 - u2), u2 = -1;
                else if (-1 === u2 && (u2 = c2), c2 - u2 + 1 === l2) return u2 * d2;
              } else for (n3 + l2 > s2 && (n3 = s2 - l2), c2 = n3; 0 <= c2; c2--) {
                for (var p2 = true, f2 = 0; f2 < l2; f2++) if (o2(e2, c2 + f2) !== o2(t4, f2)) {
                  p2 = false;
                  break;
                }
                if (p2) return c2;
              }
              return -1;
            }
            function w(e2, t4, n3, r2) {
              n3 = +n3 || 0;
              var a = e2.length - n3;
              r2 ? (r2 = +r2, r2 > a && (r2 = a)) : r2 = a;
              var o2 = t4.length;
              r2 > o2 / 2 && (r2 = o2 / 2);
              for (var d2, s2 = 0; s2 < r2; ++s2) {
                if (d2 = parseInt(t4.substr(2 * s2, 2), 16), X(d2)) return s2;
                e2[n3 + s2] = d2;
              }
              return s2;
            }
            function S(e2, t4, n3, r2) {
              return G(H(t4, e2.length - n3), e2, n3, r2);
            }
            function T(e2, t4, n3, r2) {
              return G(Y(t4), e2, n3, r2);
            }
            function v(e2, t4, n3, r2) {
              return T(e2, t4, n3, r2);
            }
            function k(e2, t4, n3, r2) {
              return G(z(t4), e2, n3, r2);
            }
            function L(e2, t4, n3, r2) {
              return G(V(t4, e2.length - n3), e2, n3, r2);
            }
            function A(e2, t4, n3) {
              return 0 === t4 && n3 === e2.length ? $.fromByteArray(e2) : $.fromByteArray(e2.slice(t4, n3));
            }
            function x(e2, t4, n3) {
              n3 = o(e2.length, n3);
              for (var r2 = [], a = t4; a < n3; ) {
                var d2 = e2[a], s2 = null, l2 = 239 < d2 ? 4 : 223 < d2 ? 3 : 191 < d2 ? 2 : 1;
                if (a + l2 <= n3) {
                  var c2, u2, p2, f2;
                  1 === l2 ? 128 > d2 && (s2 = d2) : 2 === l2 ? (c2 = e2[a + 1], 128 == (192 & c2) && (f2 = (31 & d2) << 6 | 63 & c2, 127 < f2 && (s2 = f2))) : 3 === l2 ? (c2 = e2[a + 1], u2 = e2[a + 2], 128 == (192 & c2) && 128 == (192 & u2) && (f2 = (15 & d2) << 12 | (63 & c2) << 6 | 63 & u2, 2047 < f2 && (55296 > f2 || 57343 < f2) && (s2 = f2))) : 4 === l2 ? (c2 = e2[a + 1], u2 = e2[a + 2], p2 = e2[a + 3], 128 == (192 & c2) && 128 == (192 & u2) && 128 == (192 & p2) && (f2 = (15 & d2) << 18 | (63 & c2) << 12 | (63 & u2) << 6 | 63 & p2, 65535 < f2 && 1114112 > f2 && (s2 = f2))) : void 0;
                }
                null === s2 ? (s2 = 65533, l2 = 1) : 65535 < s2 && (s2 -= 65536, r2.push(55296 | 1023 & s2 >>> 10), s2 = 56320 | 1023 & s2), r2.push(s2), a += l2;
              }
              return N(r2);
            }
            function N(e2) {
              var n3 = e2.length;
              if (n3 <= 4096) return t3.apply(String, e2);
              for (var r2 = "", a = 0; a < n3; ) r2 += t3.apply(String, e2.slice(a, a += 4096));
              return r2;
            }
            function D(e2, n3, r2) {
              var a = "";
              r2 = o(e2.length, r2);
              for (var d2 = n3; d2 < r2; ++d2) a += t3(127 & e2[d2]);
              return a;
            }
            function I(e2, n3, r2) {
              var a = "";
              r2 = o(e2.length, r2);
              for (var d2 = n3; d2 < r2; ++d2) a += t3(e2[d2]);
              return a;
            }
            function P(e2, t4, n3) {
              var r2 = e2.length;
              (!t4 || 0 > t4) && (t4 = 0), (!n3 || 0 > n3 || n3 > r2) && (n3 = r2);
              for (var a = "", o2 = t4; o2 < n3; ++o2) a += W(e2[o2]);
              return a;
            }
            function M(e2, n3, r2) {
              for (var a = e2.slice(n3, r2), o2 = "", d2 = 0; d2 < a.length; d2 += 2) o2 += t3(a[d2] + 256 * a[d2 + 1]);
              return o2;
            }
            function O(e2, t4, n3) {
              if (0 != e2 % 1 || 0 > e2) throw new RangeError("offset is not uint");
              if (e2 + t4 > n3) throw new RangeError("Trying to access beyond buffer length");
            }
            function F(e2, t4, n3, r2, a, o2) {
              if (!s.isBuffer(e2)) throw new TypeError('"buffer" argument must be a Buffer instance');
              if (t4 > a || t4 < o2) throw new RangeError('"value" argument is out of bounds');
              if (n3 + r2 > e2.length) throw new RangeError("Index out of range");
            }
            function B(e2, t4, n3, r2) {
              if (n3 + r2 > e2.length) throw new RangeError("Index out of range");
              if (0 > n3) throw new RangeError("Index out of range");
            }
            function U(e2, t4, n3, r2, a) {
              return t4 = +t4, n3 >>>= 0, a || B(e2, t4, n3, 4, 34028234663852886e22, -34028234663852886e22), J.write(e2, t4, n3, r2, 23, 4), n3 + 4;
            }
            function j(e2, t4, n3, r2, a) {
              return t4 = +t4, n3 >>>= 0, a || B(e2, t4, n3, 8, 17976931348623157e292, -17976931348623157e292), J.write(e2, t4, n3, r2, 52, 8), n3 + 8;
            }
            function q(e2) {
              if (e2 = e2.split("=")[0], e2 = e2.trim().replace(Q, ""), 2 > e2.length) return "";
              for (; 0 != e2.length % 4; ) e2 += "=";
              return e2;
            }
            function W(e2) {
              return 16 > e2 ? "0" + e2.toString(16) : e2.toString(16);
            }
            function H(e2, t4) {
              t4 = t4 || 1 / 0;
              for (var n3, r2 = e2.length, a = null, o2 = [], d2 = 0; d2 < r2; ++d2) {
                if (n3 = e2.charCodeAt(d2), 55295 < n3 && 57344 > n3) {
                  if (!a) {
                    if (56319 < n3) {
                      -1 < (t4 -= 3) && o2.push(239, 191, 189);
                      continue;
                    } else if (d2 + 1 === r2) {
                      -1 < (t4 -= 3) && o2.push(239, 191, 189);
                      continue;
                    }
                    a = n3;
                    continue;
                  }
                  if (56320 > n3) {
                    -1 < (t4 -= 3) && o2.push(239, 191, 189), a = n3;
                    continue;
                  }
                  n3 = (a - 55296 << 10 | n3 - 56320) + 65536;
                } else a && -1 < (t4 -= 3) && o2.push(239, 191, 189);
                if (a = null, 128 > n3) {
                  if (0 > (t4 -= 1)) break;
                  o2.push(n3);
                } else if (2048 > n3) {
                  if (0 > (t4 -= 2)) break;
                  o2.push(192 | n3 >> 6, 128 | 63 & n3);
                } else if (65536 > n3) {
                  if (0 > (t4 -= 3)) break;
                  o2.push(224 | n3 >> 12, 128 | 63 & n3 >> 6, 128 | 63 & n3);
                } else if (1114112 > n3) {
                  if (0 > (t4 -= 4)) break;
                  o2.push(240 | n3 >> 18, 128 | 63 & n3 >> 12, 128 | 63 & n3 >> 6, 128 | 63 & n3);
                } else throw new Error("Invalid code point");
              }
              return o2;
            }
            function Y(e2) {
              for (var t4 = [], n3 = 0; n3 < e2.length; ++n3) t4.push(255 & e2.charCodeAt(n3));
              return t4;
            }
            function V(e2, t4) {
              for (var n3, r2, a, o2 = [], d2 = 0; d2 < e2.length && !(0 > (t4 -= 2)); ++d2) n3 = e2.charCodeAt(d2), r2 = n3 >> 8, a = n3 % 256, o2.push(a), o2.push(r2);
              return o2;
            }
            function z(e2) {
              return $.toByteArray(q(e2));
            }
            function G(e2, t4, n3, r2) {
              for (var a = 0; a < r2 && !(a + n3 >= t4.length || a >= e2.length); ++a) t4[a + n3] = e2[a];
              return a;
            }
            function K(e2, t4) {
              return e2 instanceof t4 || null != e2 && null != e2.constructor && null != e2.constructor.name && e2.constructor.name === t4.name;
            }
            function X(e2) {
              return e2 !== e2;
            }
            var $ = e("base64-js"), J = e("ieee754");
            n2.Buffer = s, n2.SlowBuffer = function(e2) {
              return +e2 != e2 && (e2 = 0), s.alloc(+e2);
            }, n2.INSPECT_MAX_BYTES = 50;
            n2.kMaxLength = 2147483647, s.TYPED_ARRAY_SUPPORT = function() {
              try {
                var e2 = new Uint8Array(1);
                return e2.__proto__ = { __proto__: Uint8Array.prototype, foo: function() {
                  return 42;
                } }, 42 === e2.foo();
              } catch (t4) {
                return false;
              }
            }(), s.TYPED_ARRAY_SUPPORT || "undefined" == typeof console || "function" != typeof console.error || console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), Object.defineProperty(s.prototype, "parent", { enumerable: true, get: function() {
              return s.isBuffer(this) ? this.buffer : void 0;
            } }), Object.defineProperty(s.prototype, "offset", { enumerable: true, get: function() {
              return s.isBuffer(this) ? this.byteOffset : void 0;
            } }), "undefined" != typeof Symbol && null != Symbol.species && s[Symbol.species] === s && Object.defineProperty(s, Symbol.species, { value: null, configurable: true, enumerable: false, writable: false }), s.poolSize = 8192, s.from = function(e2, t4, n3) {
              return l(e2, t4, n3);
            }, s.prototype.__proto__ = Uint8Array.prototype, s.__proto__ = Uint8Array, s.alloc = function(e2, t4, n3) {
              return u(e2, t4, n3);
            }, s.allocUnsafe = function(e2) {
              return p(e2);
            }, s.allocUnsafeSlow = function(e2) {
              return p(e2);
            }, s.isBuffer = function(e2) {
              return null != e2 && true === e2._isBuffer && e2 !== s.prototype;
            }, s.compare = function(e2, t4) {
              if (K(e2, Uint8Array) && (e2 = s.from(e2, e2.offset, e2.byteLength)), K(t4, Uint8Array) && (t4 = s.from(t4, t4.offset, t4.byteLength)), !s.isBuffer(e2) || !s.isBuffer(t4)) throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
              if (e2 === t4) return 0;
              for (var n3 = e2.length, r2 = t4.length, d2 = 0, l2 = o(n3, r2); d2 < l2; ++d2) if (e2[d2] !== t4[d2]) {
                n3 = e2[d2], r2 = t4[d2];
                break;
              }
              return n3 < r2 ? -1 : r2 < n3 ? 1 : 0;
            }, s.isEncoding = function(e2) {
              switch ((e2 + "").toLowerCase()) {
                case "hex":
                case "utf8":
                case "utf-8":
                case "ascii":
                case "latin1":
                case "binary":
                case "base64":
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                  return true;
                default:
                  return false;
              }
            }, s.concat = function(e2, t4) {
              if (!Array.isArray(e2)) throw new TypeError('"list" argument must be an Array of Buffers');
              if (0 === e2.length) return s.alloc(0);
              var n3;
              if (t4 === void 0) for (t4 = 0, n3 = 0; n3 < e2.length; ++n3) t4 += e2[n3].length;
              var r2 = s.allocUnsafe(t4), a = 0;
              for (n3 = 0; n3 < e2.length; ++n3) {
                var o2 = e2[n3];
                if (K(o2, Uint8Array) && (o2 = s.from(o2)), !s.isBuffer(o2)) throw new TypeError('"list" argument must be an Array of Buffers');
                o2.copy(r2, a), a += o2.length;
              }
              return r2;
            }, s.byteLength = b, s.prototype._isBuffer = true, s.prototype.swap16 = function() {
              var e2 = this.length;
              if (0 != e2 % 2) throw new RangeError("Buffer size must be a multiple of 16-bits");
              for (var t4 = 0; t4 < e2; t4 += 2) C(this, t4, t4 + 1);
              return this;
            }, s.prototype.swap32 = function() {
              var e2 = this.length;
              if (0 != e2 % 4) throw new RangeError("Buffer size must be a multiple of 32-bits");
              for (var t4 = 0; t4 < e2; t4 += 4) C(this, t4, t4 + 3), C(this, t4 + 1, t4 + 2);
              return this;
            }, s.prototype.swap64 = function() {
              var e2 = this.length;
              if (0 != e2 % 8) throw new RangeError("Buffer size must be a multiple of 64-bits");
              for (var t4 = 0; t4 < e2; t4 += 8) C(this, t4, t4 + 7), C(this, t4 + 1, t4 + 6), C(this, t4 + 2, t4 + 5), C(this, t4 + 3, t4 + 4);
              return this;
            }, s.prototype.toString = function() {
              var e2 = this.length;
              return 0 === e2 ? "" : 0 === arguments.length ? x(this, 0, e2) : y.apply(this, arguments);
            }, s.prototype.toLocaleString = s.prototype.toString, s.prototype.equals = function(e2) {
              if (!s.isBuffer(e2)) throw new TypeError("Argument must be a Buffer");
              return this === e2 || 0 === s.compare(this, e2);
            }, s.prototype.inspect = function() {
              var e2 = "", t4 = n2.INSPECT_MAX_BYTES;
              return e2 = this.toString("hex", 0, t4).replace(/(.{2})/g, "$1 ").trim(), this.length > t4 && (e2 += " ... "), "<Buffer " + e2 + ">";
            }, s.prototype.compare = function(e2, t4, n3, r2, a) {
              if (K(e2, Uint8Array) && (e2 = s.from(e2, e2.offset, e2.byteLength)), !s.isBuffer(e2)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e2);
              if (void 0 === t4 && (t4 = 0), void 0 === n3 && (n3 = e2 ? e2.length : 0), void 0 === r2 && (r2 = 0), void 0 === a && (a = this.length), 0 > t4 || n3 > e2.length || 0 > r2 || a > this.length) throw new RangeError("out of range index");
              if (r2 >= a && t4 >= n3) return 0;
              if (r2 >= a) return -1;
              if (t4 >= n3) return 1;
              if (t4 >>>= 0, n3 >>>= 0, r2 >>>= 0, a >>>= 0, this === e2) return 0;
              for (var d2 = a - r2, l2 = n3 - t4, c2 = o(d2, l2), u2 = this.slice(r2, a), p2 = e2.slice(t4, n3), f2 = 0; f2 < c2; ++f2) if (u2[f2] !== p2[f2]) {
                d2 = u2[f2], l2 = p2[f2];
                break;
              }
              return d2 < l2 ? -1 : l2 < d2 ? 1 : 0;
            }, s.prototype.includes = function(e2, t4, n3) {
              return -1 !== this.indexOf(e2, t4, n3);
            }, s.prototype.indexOf = function(e2, t4, n3) {
              return R(this, e2, t4, n3, true);
            }, s.prototype.lastIndexOf = function(e2, t4, n3) {
              return R(this, e2, t4, n3, false);
            }, s.prototype.write = function(e2, t4, n3, r2) {
              if (void 0 === t4) r2 = "utf8", n3 = this.length, t4 = 0;
              else if (void 0 === n3 && "string" == typeof t4) r2 = t4, n3 = this.length, t4 = 0;
              else if (isFinite(t4)) t4 >>>= 0, isFinite(n3) ? (n3 >>>= 0, void 0 === r2 && (r2 = "utf8")) : (r2 = n3, n3 = void 0);
              else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
              var a = this.length - t4;
              if ((void 0 === n3 || n3 > a) && (n3 = a), 0 < e2.length && (0 > n3 || 0 > t4) || t4 > this.length) throw new RangeError("Attempt to write outside buffer bounds");
              r2 || (r2 = "utf8");
              for (var o2 = false; ; ) switch (r2) {
                case "hex":
                  return w(this, e2, t4, n3);
                case "utf8":
                case "utf-8":
                  return S(this, e2, t4, n3);
                case "ascii":
                  return T(this, e2, t4, n3);
                case "latin1":
                case "binary":
                  return v(this, e2, t4, n3);
                case "base64":
                  return k(this, e2, t4, n3);
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                  return L(this, e2, t4, n3);
                default:
                  if (o2) throw new TypeError("Unknown encoding: " + r2);
                  r2 = ("" + r2).toLowerCase(), o2 = true;
              }
            }, s.prototype.toJSON = function() {
              return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
            };
            s.prototype.slice = function(e2, t4) {
              var n3 = this.length;
              e2 = ~~e2, t4 = t4 === void 0 ? n3 : ~~t4, 0 > e2 ? (e2 += n3, 0 > e2 && (e2 = 0)) : e2 > n3 && (e2 = n3), 0 > t4 ? (t4 += n3, 0 > t4 && (t4 = 0)) : t4 > n3 && (t4 = n3), t4 < e2 && (t4 = e2);
              var r2 = this.subarray(e2, t4);
              return r2.__proto__ = s.prototype, r2;
            }, s.prototype.readUIntLE = function(e2, t4, n3) {
              e2 >>>= 0, t4 >>>= 0, n3 || O(e2, t4, this.length);
              for (var r2 = this[e2], a = 1, o2 = 0; ++o2 < t4 && (a *= 256); ) r2 += this[e2 + o2] * a;
              return r2;
            }, s.prototype.readUIntBE = function(e2, t4, n3) {
              e2 >>>= 0, t4 >>>= 0, n3 || O(e2, t4, this.length);
              for (var r2 = this[e2 + --t4], a = 1; 0 < t4 && (a *= 256); ) r2 += this[e2 + --t4] * a;
              return r2;
            }, s.prototype.readUInt8 = function(e2, t4) {
              return e2 >>>= 0, t4 || O(e2, 1, this.length), this[e2];
            }, s.prototype.readUInt16LE = function(e2, t4) {
              return e2 >>>= 0, t4 || O(e2, 2, this.length), this[e2] | this[e2 + 1] << 8;
            }, s.prototype.readUInt16BE = function(e2, t4) {
              return e2 >>>= 0, t4 || O(e2, 2, this.length), this[e2] << 8 | this[e2 + 1];
            }, s.prototype.readUInt32LE = function(e2, t4) {
              return e2 >>>= 0, t4 || O(e2, 4, this.length), (this[e2] | this[e2 + 1] << 8 | this[e2 + 2] << 16) + 16777216 * this[e2 + 3];
            }, s.prototype.readUInt32BE = function(e2, t4) {
              return e2 >>>= 0, t4 || O(e2, 4, this.length), 16777216 * this[e2] + (this[e2 + 1] << 16 | this[e2 + 2] << 8 | this[e2 + 3]);
            }, s.prototype.readIntLE = function(e2, t4, n3) {
              e2 >>>= 0, t4 >>>= 0, n3 || O(e2, t4, this.length);
              for (var a = this[e2], o2 = 1, d2 = 0; ++d2 < t4 && (o2 *= 256); ) a += this[e2 + d2] * o2;
              return o2 *= 128, a >= o2 && (a -= r(2, 8 * t4)), a;
            }, s.prototype.readIntBE = function(e2, t4, n3) {
              e2 >>>= 0, t4 >>>= 0, n3 || O(e2, t4, this.length);
              for (var a = t4, o2 = 1, d2 = this[e2 + --a]; 0 < a && (o2 *= 256); ) d2 += this[e2 + --a] * o2;
              return o2 *= 128, d2 >= o2 && (d2 -= r(2, 8 * t4)), d2;
            }, s.prototype.readInt8 = function(e2, t4) {
              return e2 >>>= 0, t4 || O(e2, 1, this.length), 128 & this[e2] ? -1 * (255 - this[e2] + 1) : this[e2];
            }, s.prototype.readInt16LE = function(e2, t4) {
              e2 >>>= 0, t4 || O(e2, 2, this.length);
              var n3 = this[e2] | this[e2 + 1] << 8;
              return 32768 & n3 ? 4294901760 | n3 : n3;
            }, s.prototype.readInt16BE = function(e2, t4) {
              e2 >>>= 0, t4 || O(e2, 2, this.length);
              var n3 = this[e2 + 1] | this[e2] << 8;
              return 32768 & n3 ? 4294901760 | n3 : n3;
            }, s.prototype.readInt32LE = function(e2, t4) {
              return e2 >>>= 0, t4 || O(e2, 4, this.length), this[e2] | this[e2 + 1] << 8 | this[e2 + 2] << 16 | this[e2 + 3] << 24;
            }, s.prototype.readInt32BE = function(e2, t4) {
              return e2 >>>= 0, t4 || O(e2, 4, this.length), this[e2] << 24 | this[e2 + 1] << 16 | this[e2 + 2] << 8 | this[e2 + 3];
            }, s.prototype.readFloatLE = function(e2, t4) {
              return e2 >>>= 0, t4 || O(e2, 4, this.length), J.read(this, e2, true, 23, 4);
            }, s.prototype.readFloatBE = function(e2, t4) {
              return e2 >>>= 0, t4 || O(e2, 4, this.length), J.read(this, e2, false, 23, 4);
            }, s.prototype.readDoubleLE = function(e2, t4) {
              return e2 >>>= 0, t4 || O(e2, 8, this.length), J.read(this, e2, true, 52, 8);
            }, s.prototype.readDoubleBE = function(e2, t4) {
              return e2 >>>= 0, t4 || O(e2, 8, this.length), J.read(this, e2, false, 52, 8);
            }, s.prototype.writeUIntLE = function(e2, t4, n3, a) {
              if (e2 = +e2, t4 >>>= 0, n3 >>>= 0, !a) {
                var o2 = r(2, 8 * n3) - 1;
                F(this, e2, t4, n3, o2, 0);
              }
              var d2 = 1, s2 = 0;
              for (this[t4] = 255 & e2; ++s2 < n3 && (d2 *= 256); ) this[t4 + s2] = 255 & e2 / d2;
              return t4 + n3;
            }, s.prototype.writeUIntBE = function(e2, t4, n3, a) {
              if (e2 = +e2, t4 >>>= 0, n3 >>>= 0, !a) {
                var o2 = r(2, 8 * n3) - 1;
                F(this, e2, t4, n3, o2, 0);
              }
              var d2 = n3 - 1, s2 = 1;
              for (this[t4 + d2] = 255 & e2; 0 <= --d2 && (s2 *= 256); ) this[t4 + d2] = 255 & e2 / s2;
              return t4 + n3;
            }, s.prototype.writeUInt8 = function(e2, t4, n3) {
              return e2 = +e2, t4 >>>= 0, n3 || F(this, e2, t4, 1, 255, 0), this[t4] = 255 & e2, t4 + 1;
            }, s.prototype.writeUInt16LE = function(e2, t4, n3) {
              return e2 = +e2, t4 >>>= 0, n3 || F(this, e2, t4, 2, 65535, 0), this[t4] = 255 & e2, this[t4 + 1] = e2 >>> 8, t4 + 2;
            }, s.prototype.writeUInt16BE = function(e2, t4, n3) {
              return e2 = +e2, t4 >>>= 0, n3 || F(this, e2, t4, 2, 65535, 0), this[t4] = e2 >>> 8, this[t4 + 1] = 255 & e2, t4 + 2;
            }, s.prototype.writeUInt32LE = function(e2, t4, n3) {
              return e2 = +e2, t4 >>>= 0, n3 || F(this, e2, t4, 4, 4294967295, 0), this[t4 + 3] = e2 >>> 24, this[t4 + 2] = e2 >>> 16, this[t4 + 1] = e2 >>> 8, this[t4] = 255 & e2, t4 + 4;
            }, s.prototype.writeUInt32BE = function(e2, t4, n3) {
              return e2 = +e2, t4 >>>= 0, n3 || F(this, e2, t4, 4, 4294967295, 0), this[t4] = e2 >>> 24, this[t4 + 1] = e2 >>> 16, this[t4 + 2] = e2 >>> 8, this[t4 + 3] = 255 & e2, t4 + 4;
            }, s.prototype.writeIntLE = function(e2, t4, n3, a) {
              if (e2 = +e2, t4 >>>= 0, !a) {
                var o2 = r(2, 8 * n3 - 1);
                F(this, e2, t4, n3, o2 - 1, -o2);
              }
              var d2 = 0, s2 = 1, l2 = 0;
              for (this[t4] = 255 & e2; ++d2 < n3 && (s2 *= 256); ) 0 > e2 && 0 === l2 && 0 !== this[t4 + d2 - 1] && (l2 = 1), this[t4 + d2] = 255 & (e2 / s2 >> 0) - l2;
              return t4 + n3;
            }, s.prototype.writeIntBE = function(e2, t4, n3, a) {
              if (e2 = +e2, t4 >>>= 0, !a) {
                var o2 = r(2, 8 * n3 - 1);
                F(this, e2, t4, n3, o2 - 1, -o2);
              }
              var d2 = n3 - 1, s2 = 1, l2 = 0;
              for (this[t4 + d2] = 255 & e2; 0 <= --d2 && (s2 *= 256); ) 0 > e2 && 0 === l2 && 0 !== this[t4 + d2 + 1] && (l2 = 1), this[t4 + d2] = 255 & (e2 / s2 >> 0) - l2;
              return t4 + n3;
            }, s.prototype.writeInt8 = function(e2, t4, n3) {
              return e2 = +e2, t4 >>>= 0, n3 || F(this, e2, t4, 1, 127, -128), 0 > e2 && (e2 = 255 + e2 + 1), this[t4] = 255 & e2, t4 + 1;
            }, s.prototype.writeInt16LE = function(e2, t4, n3) {
              return e2 = +e2, t4 >>>= 0, n3 || F(this, e2, t4, 2, 32767, -32768), this[t4] = 255 & e2, this[t4 + 1] = e2 >>> 8, t4 + 2;
            }, s.prototype.writeInt16BE = function(e2, t4, n3) {
              return e2 = +e2, t4 >>>= 0, n3 || F(this, e2, t4, 2, 32767, -32768), this[t4] = e2 >>> 8, this[t4 + 1] = 255 & e2, t4 + 2;
            }, s.prototype.writeInt32LE = function(e2, t4, n3) {
              return e2 = +e2, t4 >>>= 0, n3 || F(this, e2, t4, 4, 2147483647, -2147483648), this[t4] = 255 & e2, this[t4 + 1] = e2 >>> 8, this[t4 + 2] = e2 >>> 16, this[t4 + 3] = e2 >>> 24, t4 + 4;
            }, s.prototype.writeInt32BE = function(e2, t4, n3) {
              return e2 = +e2, t4 >>>= 0, n3 || F(this, e2, t4, 4, 2147483647, -2147483648), 0 > e2 && (e2 = 4294967295 + e2 + 1), this[t4] = e2 >>> 24, this[t4 + 1] = e2 >>> 16, this[t4 + 2] = e2 >>> 8, this[t4 + 3] = 255 & e2, t4 + 4;
            }, s.prototype.writeFloatLE = function(e2, t4, n3) {
              return U(this, e2, t4, true, n3);
            }, s.prototype.writeFloatBE = function(e2, t4, n3) {
              return U(this, e2, t4, false, n3);
            }, s.prototype.writeDoubleLE = function(e2, t4, n3) {
              return j(this, e2, t4, true, n3);
            }, s.prototype.writeDoubleBE = function(e2, t4, n3) {
              return j(this, e2, t4, false, n3);
            }, s.prototype.copy = function(e2, t4, n3, r2) {
              if (!s.isBuffer(e2)) throw new TypeError("argument should be a Buffer");
              if (n3 || (n3 = 0), r2 || 0 === r2 || (r2 = this.length), t4 >= e2.length && (t4 = e2.length), t4 || (t4 = 0), 0 < r2 && r2 < n3 && (r2 = n3), r2 === n3) return 0;
              if (0 === e2.length || 0 === this.length) return 0;
              if (0 > t4) throw new RangeError("targetStart out of bounds");
              if (0 > n3 || n3 >= this.length) throw new RangeError("Index out of range");
              if (0 > r2) throw new RangeError("sourceEnd out of bounds");
              r2 > this.length && (r2 = this.length), e2.length - t4 < r2 - n3 && (r2 = e2.length - t4 + n3);
              var a = r2 - n3;
              if (this === e2 && "function" == typeof Uint8Array.prototype.copyWithin) this.copyWithin(t4, n3, r2);
              else if (this === e2 && n3 < t4 && t4 < r2) for (var o2 = a - 1; 0 <= o2; --o2) e2[o2 + t4] = this[o2 + n3];
              else Uint8Array.prototype.set.call(e2, this.subarray(n3, r2), t4);
              return a;
            }, s.prototype.fill = function(e2, t4, n3, r2) {
              if ("string" == typeof e2) {
                if ("string" == typeof t4 ? (r2 = t4, t4 = 0, n3 = this.length) : "string" == typeof n3 && (r2 = n3, n3 = this.length), void 0 !== r2 && "string" != typeof r2) throw new TypeError("encoding must be a string");
                if ("string" == typeof r2 && !s.isEncoding(r2)) throw new TypeError("Unknown encoding: " + r2);
                if (1 === e2.length) {
                  var a = e2.charCodeAt(0);
                  ("utf8" === r2 && 128 > a || "latin1" === r2) && (e2 = a);
                }
              } else "number" == typeof e2 && (e2 &= 255);
              if (0 > t4 || this.length < t4 || this.length < n3) throw new RangeError("Out of range index");
              if (n3 <= t4) return this;
              t4 >>>= 0, n3 = n3 === void 0 ? this.length : n3 >>> 0, e2 || (e2 = 0);
              var o2;
              if ("number" == typeof e2) for (o2 = t4; o2 < n3; ++o2) this[o2] = e2;
              else {
                var d2 = s.isBuffer(e2) ? e2 : s.from(e2, r2), l2 = d2.length;
                if (0 === l2) throw new TypeError('The value "' + e2 + '" is invalid for argument "value"');
                for (o2 = 0; o2 < n3 - t4; ++o2) this[o2 + t4] = d2[o2 % l2];
              }
              return this;
            };
            var Q = /[^+/0-9A-Za-z-_]/g;
          }).call(this);
        }).call(this, e("buffer").Buffer);
      }, { "base64-js": 1, buffer: 3, ieee754: 9 }], 4: [function(e, t2, n2) {
        (function(a) {
          (function() {
            function r2() {
              let e2;
              try {
                e2 = n2.storage.getItem("debug");
              } catch (e3) {
              }
              return !e2 && "undefined" != typeof a && "env" in a && (e2 = a.env.DEBUG), e2;
            }
            n2.formatArgs = function(e2) {
              if (e2[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + e2[0] + (this.useColors ? "%c " : " ") + "+" + t2.exports.humanize(this.diff), !this.useColors) return;
              const n3 = "color: " + this.color;
              e2.splice(1, 0, n3, "color: inherit");
              let r3 = 0, a2 = 0;
              e2[0].replace(/%[a-zA-Z%]/g, (e3) => {
                "%%" === e3 || (r3++, "%c" === e3 && (a2 = r3));
              }), e2.splice(a2, 0, n3);
            }, n2.save = function(e2) {
              try {
                e2 ? n2.storage.setItem("debug", e2) : n2.storage.removeItem("debug");
              } catch (e3) {
              }
            }, n2.load = r2, n2.useColors = function() {
              return !!("undefined" != typeof window && window.process && ("renderer" === window.process.type || window.process.__nwjs)) || !("undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) && ("undefined" != typeof document && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || "undefined" != typeof window && window.console && (window.console.firebug || window.console.exception && window.console.table) || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && 31 <= parseInt(RegExp.$1, 10) || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
            }, n2.storage = function() {
              try {
                return localStorage;
              } catch (e2) {
              }
            }(), n2.destroy = /* @__PURE__ */ (() => {
              let e2 = false;
              return () => {
                e2 || (e2 = true, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
              };
            })(), n2.colors = ["#0000CC", "#0000FF", "#0033CC", "#0033FF", "#0066CC", "#0066FF", "#0099CC", "#0099FF", "#00CC00", "#00CC33", "#00CC66", "#00CC99", "#00CCCC", "#00CCFF", "#3300CC", "#3300FF", "#3333CC", "#3333FF", "#3366CC", "#3366FF", "#3399CC", "#3399FF", "#33CC00", "#33CC33", "#33CC66", "#33CC99", "#33CCCC", "#33CCFF", "#6600CC", "#6600FF", "#6633CC", "#6633FF", "#66CC00", "#66CC33", "#9900CC", "#9900FF", "#9933CC", "#9933FF", "#99CC00", "#99CC33", "#CC0000", "#CC0033", "#CC0066", "#CC0099", "#CC00CC", "#CC00FF", "#CC3300", "#CC3333", "#CC3366", "#CC3399", "#CC33CC", "#CC33FF", "#CC6600", "#CC6633", "#CC9900", "#CC9933", "#CCCC00", "#CCCC33", "#FF0000", "#FF0033", "#FF0066", "#FF0099", "#FF00CC", "#FF00FF", "#FF3300", "#FF3333", "#FF3366", "#FF3399", "#FF33CC", "#FF33FF", "#FF6600", "#FF6633", "#FF9900", "#FF9933", "#FFCC00", "#FFCC33"], n2.log = console.debug || console.log || (() => {
            }), t2.exports = e("./common")(n2);
            const { formatters: o } = t2.exports;
            o.j = function(e2) {
              try {
                return JSON.stringify(e2);
              } catch (e3) {
                return "[UnexpectedJSONParseError]: " + e3.message;
              }
            };
          }).call(this);
        }).call(this, e("_process"));
      }, { "./common": 5, _process: 12 }], 5: [function(e, t2) {
        t2.exports = function(t3) {
          function r2(e2) {
            function t4(...e3) {
              if (!t4.enabled) return;
              const a2 = t4, o3 = +/* @__PURE__ */ new Date(), i = o3 - (n2 || o3);
              a2.diff = i, a2.prev = n2, a2.curr = o3, n2 = o3, e3[0] = r2.coerce(e3[0]), "string" != typeof e3[0] && e3.unshift("%O");
              let d = 0;
              e3[0] = e3[0].replace(/%([a-zA-Z%])/g, (t5, n3) => {
                if ("%%" === t5) return "%";
                d++;
                const o4 = r2.formatters[n3];
                if ("function" == typeof o4) {
                  const n4 = e3[d];
                  t5 = o4.call(a2, n4), e3.splice(d, 1), d--;
                }
                return t5;
              }), r2.formatArgs.call(a2, e3);
              const s = a2.log || r2.log;
              s.apply(a2, e3);
            }
            let n2, o2 = null;
            return t4.namespace = e2, t4.useColors = r2.useColors(), t4.color = r2.selectColor(e2), t4.extend = a, t4.destroy = r2.destroy, Object.defineProperty(t4, "enabled", { enumerable: true, configurable: false, get: () => null === o2 ? r2.enabled(e2) : o2, set: (e3) => {
              o2 = e3;
            } }), "function" == typeof r2.init && r2.init(t4), t4;
          }
          function a(e2, t4) {
            const n2 = r2(this.namespace + ("undefined" == typeof t4 ? ":" : t4) + e2);
            return n2.log = this.log, n2;
          }
          function o(e2) {
            return e2.toString().substring(2, e2.toString().length - 2).replace(/\.\*\?$/, "*");
          }
          return r2.debug = r2, r2.default = r2, r2.coerce = function(e2) {
            return e2 instanceof Error ? e2.stack || e2.message : e2;
          }, r2.disable = function() {
            const e2 = [...r2.names.map(o), ...r2.skips.map(o).map((e3) => "-" + e3)].join(",");
            return r2.enable(""), e2;
          }, r2.enable = function(e2) {
            r2.save(e2), r2.names = [], r2.skips = [];
            let t4;
            const n2 = ("string" == typeof e2 ? e2 : "").split(/[\s,]+/), a2 = n2.length;
            for (t4 = 0; t4 < a2; t4++) n2[t4] && (e2 = n2[t4].replace(/\*/g, ".*?"), "-" === e2[0] ? r2.skips.push(new RegExp("^" + e2.substr(1) + "$")) : r2.names.push(new RegExp("^" + e2 + "$")));
          }, r2.enabled = function(e2) {
            if ("*" === e2[e2.length - 1]) return true;
            let t4, n2;
            for (t4 = 0, n2 = r2.skips.length; t4 < n2; t4++) if (r2.skips[t4].test(e2)) return false;
            for (t4 = 0, n2 = r2.names.length; t4 < n2; t4++) if (r2.names[t4].test(e2)) return true;
            return false;
          }, r2.humanize = e("ms"), r2.destroy = function() {
            console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
          }, Object.keys(t3).forEach((e2) => {
            r2[e2] = t3[e2];
          }), r2.names = [], r2.skips = [], r2.formatters = {}, r2.selectColor = function(e2) {
            let t4 = 0;
            for (let n2 = 0; n2 < e2.length; n2++) t4 = (t4 << 5) - t4 + e2.charCodeAt(n2), t4 |= 0;
            return r2.colors[n(t4) % r2.colors.length];
          }, r2.enable(r2.load()), r2;
        };
      }, { ms: 11 }], 6: [function(e, t2) {
        "use strict";
        function n2(e2, t3) {
          for (const n3 in t3) Object.defineProperty(e2, n3, { value: t3[n3], enumerable: true, configurable: true });
          return e2;
        }
        t2.exports = function(e2, t3, r2) {
          if (!e2 || "string" == typeof e2) throw new TypeError("Please pass an Error to err-code");
          r2 || (r2 = {}), "object" == typeof t3 && (r2 = t3, t3 = ""), t3 && (r2.code = t3);
          try {
            return n2(e2, r2);
          } catch (t4) {
            r2.message = e2.message, r2.stack = e2.stack;
            const a = function() {
            };
            a.prototype = Object.create(Object.getPrototypeOf(e2));
            const o = n2(new a(), r2);
            return o;
          }
        };
      }, {}], 7: [function(e, t2) {
        "use strict";
        function n2(e2) {
          console && console.warn && console.warn(e2);
        }
        function r2() {
          r2.init.call(this);
        }
        function a(e2) {
          if ("function" != typeof e2) throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof e2);
        }
        function o(e2) {
          return void 0 === e2._maxListeners ? r2.defaultMaxListeners : e2._maxListeners;
        }
        function i(e2, t3, r3, i2) {
          var d2, s2, l2;
          if (a(r3), s2 = e2._events, void 0 === s2 ? (s2 = e2._events = /* @__PURE__ */ Object.create(null), e2._eventsCount = 0) : (void 0 !== s2.newListener && (e2.emit("newListener", t3, r3.listener ? r3.listener : r3), s2 = e2._events), l2 = s2[t3]), void 0 === l2) l2 = s2[t3] = r3, ++e2._eventsCount;
          else if ("function" == typeof l2 ? l2 = s2[t3] = i2 ? [r3, l2] : [l2, r3] : i2 ? l2.unshift(r3) : l2.push(r3), d2 = o(e2), 0 < d2 && l2.length > d2 && !l2.warned) {
            l2.warned = true;
            var c2 = new Error("Possible EventEmitter memory leak detected. " + l2.length + " " + (t3 + " listeners added. Use emitter.setMaxListeners() to increase limit"));
            c2.name = "MaxListenersExceededWarning", c2.emitter = e2, c2.type = t3, c2.count = l2.length, n2(c2);
          }
          return e2;
        }
        function d() {
          if (!this.fired) return this.target.removeListener(this.type, this.wrapFn), this.fired = true, 0 === arguments.length ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
        }
        function s(e2, t3, n3) {
          var r3 = { fired: false, wrapFn: void 0, target: e2, type: t3, listener: n3 }, a2 = d.bind(r3);
          return a2.listener = n3, r3.wrapFn = a2, a2;
        }
        function l(e2, t3, n3) {
          var r3 = e2._events;
          if (r3 === void 0) return [];
          var a2 = r3[t3];
          return void 0 === a2 ? [] : "function" == typeof a2 ? n3 ? [a2.listener || a2] : [a2] : n3 ? f(a2) : u(a2, a2.length);
        }
        function c(e2) {
          var t3 = this._events;
          if (t3 !== void 0) {
            var n3 = t3[e2];
            if ("function" == typeof n3) return 1;
            if (void 0 !== n3) return n3.length;
          }
          return 0;
        }
        function u(e2, t3) {
          for (var n3 = Array(t3), r3 = 0; r3 < t3; ++r3) n3[r3] = e2[r3];
          return n3;
        }
        function p(e2, t3) {
          for (; t3 + 1 < e2.length; t3++) e2[t3] = e2[t3 + 1];
          e2.pop();
        }
        function f(e2) {
          for (var t3 = Array(e2.length), n3 = 0; n3 < t3.length; ++n3) t3[n3] = e2[n3].listener || e2[n3];
          return t3;
        }
        function g(e2, t3, n3) {
          "function" == typeof e2.on && _(e2, "error", t3, n3);
        }
        function _(e2, t3, n3, r3) {
          if ("function" == typeof e2.on) r3.once ? e2.once(t3, n3) : e2.on(t3, n3);
          else if ("function" == typeof e2.addEventListener) e2.addEventListener(t3, function a2(o2) {
            r3.once && e2.removeEventListener(t3, a2), n3(o2);
          });
          else throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof e2);
        }
        var h, m = "object" == typeof Reflect ? Reflect : null, b = m && "function" == typeof m.apply ? m.apply : function(e2, t3, n3) {
          return Function.prototype.apply.call(e2, t3, n3);
        };
        h = m && "function" == typeof m.ownKeys ? m.ownKeys : Object.getOwnPropertySymbols ? function(e2) {
          return Object.getOwnPropertyNames(e2).concat(Object.getOwnPropertySymbols(e2));
        } : function(e2) {
          return Object.getOwnPropertyNames(e2);
        };
        var y = Number.isNaN || function(e2) {
          return e2 !== e2;
        };
        t2.exports = r2, t2.exports.once = function(e2, t3) {
          return new Promise(function(n3, r3) {
            function a2(n4) {
              e2.removeListener(t3, o2), r3(n4);
            }
            function o2() {
              "function" == typeof e2.removeListener && e2.removeListener("error", a2), n3([].slice.call(arguments));
            }
            _(e2, t3, o2, { once: true }), "error" !== t3 && g(e2, a2, { once: true });
          });
        }, r2.EventEmitter = r2, r2.prototype._events = void 0, r2.prototype._eventsCount = 0, r2.prototype._maxListeners = void 0;
        var C = 10;
        Object.defineProperty(r2, "defaultMaxListeners", { enumerable: true, get: function() {
          return C;
        }, set: function(e2) {
          if ("number" != typeof e2 || 0 > e2 || y(e2)) throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + e2 + ".");
          C = e2;
        } }), r2.init = function() {
          (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) && (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
        }, r2.prototype.setMaxListeners = function(e2) {
          if ("number" != typeof e2 || 0 > e2 || y(e2)) throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + e2 + ".");
          return this._maxListeners = e2, this;
        }, r2.prototype.getMaxListeners = function() {
          return o(this);
        }, r2.prototype.emit = function(e2) {
          for (var t3 = [], n3 = 1; n3 < arguments.length; n3++) t3.push(arguments[n3]);
          var r3 = "error" === e2, a2 = this._events;
          if (a2 !== void 0) r3 = r3 && a2.error === void 0;
          else if (!r3) return false;
          if (r3) {
            var o2;
            if (0 < t3.length && (o2 = t3[0]), o2 instanceof Error) throw o2;
            var d2 = new Error("Unhandled error." + (o2 ? " (" + o2.message + ")" : ""));
            throw d2.context = o2, d2;
          }
          var s2 = a2[e2];
          if (s2 === void 0) return false;
          if ("function" == typeof s2) b(s2, this, t3);
          else for (var l2 = s2.length, c2 = u(s2, l2), n3 = 0; n3 < l2; ++n3) b(c2[n3], this, t3);
          return true;
        }, r2.prototype.addListener = function(e2, t3) {
          return i(this, e2, t3, false);
        }, r2.prototype.on = r2.prototype.addListener, r2.prototype.prependListener = function(e2, t3) {
          return i(this, e2, t3, true);
        }, r2.prototype.once = function(e2, t3) {
          return a(t3), this.on(e2, s(this, e2, t3)), this;
        }, r2.prototype.prependOnceListener = function(e2, t3) {
          return a(t3), this.prependListener(e2, s(this, e2, t3)), this;
        }, r2.prototype.removeListener = function(e2, t3) {
          var n3, r3, o2, d2, s2;
          if (a(t3), r3 = this._events, void 0 === r3) return this;
          if (n3 = r3[e2], void 0 === n3) return this;
          if (n3 === t3 || n3.listener === t3) 0 == --this._eventsCount ? this._events = /* @__PURE__ */ Object.create(null) : (delete r3[e2], r3.removeListener && this.emit("removeListener", e2, n3.listener || t3));
          else if ("function" != typeof n3) {
            for (o2 = -1, d2 = n3.length - 1; 0 <= d2; d2--) if (n3[d2] === t3 || n3[d2].listener === t3) {
              s2 = n3[d2].listener, o2 = d2;
              break;
            }
            if (0 > o2) return this;
            0 === o2 ? n3.shift() : p(n3, o2), 1 === n3.length && (r3[e2] = n3[0]), void 0 !== r3.removeListener && this.emit("removeListener", e2, s2 || t3);
          }
          return this;
        }, r2.prototype.off = r2.prototype.removeListener, r2.prototype.removeAllListeners = function(e2) {
          var t3, n3, r3;
          if (n3 = this._events, void 0 === n3) return this;
          if (void 0 === n3.removeListener) return 0 === arguments.length ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : void 0 !== n3[e2] && (0 == --this._eventsCount ? this._events = /* @__PURE__ */ Object.create(null) : delete n3[e2]), this;
          if (0 === arguments.length) {
            var a2, o2 = Object.keys(n3);
            for (r3 = 0; r3 < o2.length; ++r3) a2 = o2[r3], "removeListener" !== a2 && this.removeAllListeners(a2);
            return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
          }
          if (t3 = n3[e2], "function" == typeof t3) this.removeListener(e2, t3);
          else if (void 0 !== t3) for (r3 = t3.length - 1; 0 <= r3; r3--) this.removeListener(e2, t3[r3]);
          return this;
        }, r2.prototype.listeners = function(e2) {
          return l(this, e2, true);
        }, r2.prototype.rawListeners = function(e2) {
          return l(this, e2, false);
        }, r2.listenerCount = function(e2, t3) {
          return "function" == typeof e2.listenerCount ? e2.listenerCount(t3) : c.call(e2, t3);
        }, r2.prototype.listenerCount = c, r2.prototype.eventNames = function() {
          return 0 < this._eventsCount ? h(this._events) : [];
        };
      }, {}], 8: [function(e, t2) {
        t2.exports = function() {
          if ("undefined" == typeof globalThis) return null;
          var e2 = { RTCPeerConnection: globalThis.RTCPeerConnection || globalThis.mozRTCPeerConnection || globalThis.webkitRTCPeerConnection, RTCSessionDescription: globalThis.RTCSessionDescription || globalThis.mozRTCSessionDescription || globalThis.webkitRTCSessionDescription, RTCIceCandidate: globalThis.RTCIceCandidate || globalThis.mozRTCIceCandidate || globalThis.webkitRTCIceCandidate };
          return e2.RTCPeerConnection ? e2 : null;
        };
      }, {}], 9: [function(e, a, o) {
        o.read = function(t2, n2, a2, o2, l) {
          var c, u, p = 8 * l - o2 - 1, f = (1 << p) - 1, g = f >> 1, _ = -7, h = a2 ? l - 1 : 0, b = a2 ? -1 : 1, d = t2[n2 + h];
          for (h += b, c = d & (1 << -_) - 1, d >>= -_, _ += p; 0 < _; c = 256 * c + t2[n2 + h], h += b, _ -= 8) ;
          for (u = c & (1 << -_) - 1, c >>= -_, _ += o2; 0 < _; u = 256 * u + t2[n2 + h], h += b, _ -= 8) ;
          if (0 === c) c = 1 - g;
          else {
            if (c === f) return u ? NaN : (d ? -1 : 1) * (1 / 0);
            u += r(2, o2), c -= g;
          }
          return (d ? -1 : 1) * u * r(2, c - o2);
        }, o.write = function(a2, o2, l, u, p, f) {
          var h, b, y, g = Math.LN2, _ = Math.log, C = 8 * f - p - 1, R = (1 << C) - 1, E = R >> 1, w = 23 === p ? r(2, -24) - r(2, -77) : 0, S = u ? 0 : f - 1, T = u ? 1 : -1, d = 0 > o2 || 0 === o2 && 0 > 1 / o2 ? 1 : 0;
          for (o2 = n(o2), isNaN(o2) || o2 === 1 / 0 ? (b = isNaN(o2) ? 1 : 0, h = R) : (h = t(_(o2) / g), 1 > o2 * (y = r(2, -h)) && (h--, y *= 2), o2 += 1 <= h + E ? w / y : w * r(2, 1 - E), 2 <= o2 * y && (h++, y /= 2), h + E >= R ? (b = 0, h = R) : 1 <= h + E ? (b = (o2 * y - 1) * r(2, p), h += E) : (b = o2 * r(2, E - 1) * r(2, p), h = 0)); 8 <= p; a2[l + S] = 255 & b, S += T, b /= 256, p -= 8) ;
          for (h = h << p | b, C += p; 0 < C; a2[l + S] = 255 & h, S += T, h /= 256, C -= 8) ;
          a2[l + S - T] |= 128 * d;
        };
      }, {}], 10: [function(e, t2) {
        t2.exports = "function" == typeof Object.create ? function(e2, t3) {
          t3 && (e2.super_ = t3, e2.prototype = Object.create(t3.prototype, { constructor: { value: e2, enumerable: false, writable: true, configurable: true } }));
        } : function(e2, t3) {
          if (t3) {
            e2.super_ = t3;
            var n2 = function() {
            };
            n2.prototype = t3.prototype, e2.prototype = new n2(), e2.prototype.constructor = e2;
          }
        };
      }, {}], 11: [function(e, t2) {
        var r2 = Math.round;
        function a(e2) {
          if (e2 += "", !(100 < e2.length)) {
            var t3 = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(e2);
            if (t3) {
              var r3 = parseFloat(t3[1]), n2 = (t3[2] || "ms").toLowerCase();
              return "years" === n2 || "year" === n2 || "yrs" === n2 || "yr" === n2 || "y" === n2 ? 315576e5 * r3 : "weeks" === n2 || "week" === n2 || "w" === n2 ? 6048e5 * r3 : "days" === n2 || "day" === n2 || "d" === n2 ? 864e5 * r3 : "hours" === n2 || "hour" === n2 || "hrs" === n2 || "hr" === n2 || "h" === n2 ? 36e5 * r3 : "minutes" === n2 || "minute" === n2 || "mins" === n2 || "min" === n2 || "m" === n2 ? 6e4 * r3 : "seconds" === n2 || "second" === n2 || "secs" === n2 || "sec" === n2 || "s" === n2 ? 1e3 * r3 : "milliseconds" === n2 || "millisecond" === n2 || "msecs" === n2 || "msec" === n2 || "ms" === n2 ? r3 : void 0;
            }
          }
        }
        function o(e2) {
          var t3 = n(e2);
          return 864e5 <= t3 ? r2(e2 / 864e5) + "d" : 36e5 <= t3 ? r2(e2 / 36e5) + "h" : 6e4 <= t3 ? r2(e2 / 6e4) + "m" : 1e3 <= t3 ? r2(e2 / 1e3) + "s" : e2 + "ms";
        }
        function i(e2) {
          var t3 = n(e2);
          return 864e5 <= t3 ? s(e2, t3, 864e5, "day") : 36e5 <= t3 ? s(e2, t3, 36e5, "hour") : 6e4 <= t3 ? s(e2, t3, 6e4, "minute") : 1e3 <= t3 ? s(e2, t3, 1e3, "second") : e2 + " ms";
        }
        function s(e2, t3, a2, n2) {
          return r2(e2 / a2) + " " + n2 + (t3 >= 1.5 * a2 ? "s" : "");
        }
        var l = 24 * (60 * 6e4);
        t2.exports = function(e2, t3) {
          t3 = t3 || {};
          var n2 = typeof e2;
          if ("string" == n2 && 0 < e2.length) return a(e2);
          if ("number" === n2 && isFinite(e2)) return t3.long ? i(e2) : o(e2);
          throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(e2));
        };
      }, {}], 12: [function(e, t2) {
        function n2() {
          throw new Error("setTimeout has not been defined");
        }
        function r2() {
          throw new Error("clearTimeout has not been defined");
        }
        function a(t3) {
          if (c === setTimeout) return setTimeout(t3, 0);
          if ((c === n2 || !c) && setTimeout) return c = setTimeout, setTimeout(t3, 0);
          try {
            return c(t3, 0);
          } catch (n3) {
            try {
              return c.call(null, t3, 0);
            } catch (n4) {
              return c.call(this, t3, 0);
            }
          }
        }
        function o(t3) {
          if (u === clearTimeout) return clearTimeout(t3);
          if ((u === r2 || !u) && clearTimeout) return u = clearTimeout, clearTimeout(t3);
          try {
            return u(t3);
          } catch (n3) {
            try {
              return u.call(null, t3);
            } catch (n4) {
              return u.call(this, t3);
            }
          }
        }
        function i() {
          _ && f && (_ = false, f.length ? g = f.concat(g) : h = -1, g.length && d());
        }
        function d() {
          if (!_) {
            var e2 = a(i);
            _ = true;
            for (var t3 = g.length; t3; ) {
              for (f = g, g = []; ++h < t3; ) f && f[h].run();
              h = -1, t3 = g.length;
            }
            f = null, _ = false, o(e2);
          }
        }
        function s(e2, t3) {
          this.fun = e2, this.array = t3;
        }
        function l() {
        }
        var c, u, p = t2.exports = {};
        (function() {
          try {
            c = "function" == typeof setTimeout ? setTimeout : n2;
          } catch (t3) {
            c = n2;
          }
          try {
            u = "function" == typeof clearTimeout ? clearTimeout : r2;
          } catch (t3) {
            u = r2;
          }
        })();
        var f, g = [], _ = false, h = -1;
        p.nextTick = function(e2) {
          var t3 = Array(arguments.length - 1);
          if (1 < arguments.length) for (var n3 = 1; n3 < arguments.length; n3++) t3[n3 - 1] = arguments[n3];
          g.push(new s(e2, t3)), 1 !== g.length || _ || a(d);
        }, s.prototype.run = function() {
          this.fun.apply(null, this.array);
        }, p.title = "browser", p.browser = true, p.env = {}, p.argv = [], p.version = "", p.versions = {}, p.on = l, p.addListener = l, p.once = l, p.off = l, p.removeListener = l, p.removeAllListeners = l, p.emit = l, p.prependListener = l, p.prependOnceListener = l, p.listeners = function() {
          return [];
        }, p.binding = function() {
          throw new Error("process.binding is not supported");
        }, p.cwd = function() {
          return "/";
        }, p.chdir = function() {
          throw new Error("process.chdir is not supported");
        }, p.umask = function() {
          return 0;
        };
      }, {}], 13: [function(e, t2) {
        (function(e2) {
          (function() {
            let n2;
            t2.exports = "function" == typeof queueMicrotask ? queueMicrotask.bind("undefined" == typeof window ? e2 : window) : (e3) => (n2 || (n2 = Promise.resolve())).then(e3).catch((e4) => setTimeout(() => {
              throw e4;
            }, 0));
          }).call(this);
        }).call(this, "undefined" == typeof global ? "undefined" == typeof self ? "undefined" == typeof window ? {} : window : self : global);
      }, {}], 14: [function(e, t2) {
        (function(n2, r2) {
          (function() {
            "use strict";
            var a = e("safe-buffer").Buffer, o = r2.crypto || r2.msCrypto;
            t2.exports = o && o.getRandomValues ? function(e2, t3) {
              if (e2 > 4294967295) throw new RangeError("requested too many random bytes");
              var r3 = a.allocUnsafe(e2);
              if (0 < e2) if (65536 < e2) for (var i = 0; i < e2; i += 65536) o.getRandomValues(r3.slice(i, i + 65536));
              else o.getRandomValues(r3);
              return "function" == typeof t3 ? n2.nextTick(function() {
                t3(null, r3);
              }) : r3;
            } : function() {
              throw new Error("Secure random number generation is not supported by this browser.\nUse Chrome, Firefox or Internet Explorer 11");
            };
          }).call(this);
        }).call(this, e("_process"), "undefined" == typeof global ? "undefined" == typeof self ? "undefined" == typeof window ? {} : window : self : global);
      }, { _process: 12, "safe-buffer": 30 }], 15: [function(e, t2) {
        "use strict";
        function n2(e2, t3) {
          e2.prototype = Object.create(t3.prototype), e2.prototype.constructor = e2, e2.__proto__ = t3;
        }
        function r2(e2, t3, r3) {
          function a2(e3, n3, r4) {
            return "string" == typeof t3 ? t3 : t3(e3, n3, r4);
          }
          r3 || (r3 = Error);
          var o2 = function(e3) {
            function t4(t5, n3, r4) {
              return e3.call(this, a2(t5, n3, r4)) || this;
            }
            return n2(t4, e3), t4;
          }(r3);
          o2.prototype.name = r3.name, o2.prototype.code = e2, s[e2] = o2;
        }
        function a(e2, t3) {
          if (Array.isArray(e2)) {
            var n3 = e2.length;
            return e2 = e2.map(function(e3) {
              return e3 + "";
            }), 2 < n3 ? "one of ".concat(t3, " ").concat(e2.slice(0, n3 - 1).join(", "), ", or ") + e2[n3 - 1] : 2 === n3 ? "one of ".concat(t3, " ").concat(e2[0], " or ").concat(e2[1]) : "of ".concat(t3, " ").concat(e2[0]);
          }
          return "of ".concat(t3, " ").concat(e2 + "");
        }
        function o(e2, t3, n3) {
          return e2.substr(!n3 || 0 > n3 ? 0 : +n3, t3.length) === t3;
        }
        function i(e2, t3, n3) {
          return (void 0 === n3 || n3 > e2.length) && (n3 = e2.length), e2.substring(n3 - t3.length, n3) === t3;
        }
        function d(e2, t3, n3) {
          return "number" != typeof n3 && (n3 = 0), !(n3 + t3.length > e2.length) && -1 !== e2.indexOf(t3, n3);
        }
        var s = {};
        r2("ERR_INVALID_OPT_VALUE", function(e2, t3) {
          return 'The value "' + t3 + '" is invalid for option "' + e2 + '"';
        }, TypeError), r2("ERR_INVALID_ARG_TYPE", function(e2, t3, n3) {
          var r3;
          "string" == typeof t3 && o(t3, "not ") ? (r3 = "must not be", t3 = t3.replace(/^not /, "")) : r3 = "must be";
          var s2;
          if (i(e2, " argument")) s2 = "The ".concat(e2, " ").concat(r3, " ").concat(a(t3, "type"));
          else {
            var l = d(e2, ".") ? "property" : "argument";
            s2 = 'The "'.concat(e2, '" ').concat(l, " ").concat(r3, " ").concat(a(t3, "type"));
          }
          return s2 += ". Received type ".concat(typeof n3), s2;
        }, TypeError), r2("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF"), r2("ERR_METHOD_NOT_IMPLEMENTED", function(e2) {
          return "The " + e2 + " method is not implemented";
        }), r2("ERR_STREAM_PREMATURE_CLOSE", "Premature close"), r2("ERR_STREAM_DESTROYED", function(e2) {
          return "Cannot call " + e2 + " after a stream was destroyed";
        }), r2("ERR_MULTIPLE_CALLBACK", "Callback called multiple times"), r2("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable"), r2("ERR_STREAM_WRITE_AFTER_END", "write after end"), r2("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError), r2("ERR_UNKNOWN_ENCODING", function(e2) {
          return "Unknown encoding: " + e2;
        }, TypeError), r2("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event"), t2.exports.codes = s;
      }, {}], 16: [function(e, t2) {
        (function(n2) {
          (function() {
            "use strict";
            function r2(e2) {
              return this instanceof r2 ? void (d.call(this, e2), s.call(this, e2), this.allowHalfOpen = true, e2 && (false === e2.readable && (this.readable = false), false === e2.writable && (this.writable = false), false === e2.allowHalfOpen && (this.allowHalfOpen = false, this.once("end", a)))) : new r2(e2);
            }
            function a() {
              this._writableState.ended || n2.nextTick(o, this);
            }
            function o(e2) {
              e2.end();
            }
            var i = Object.keys || function(e2) {
              var t3 = [];
              for (var n3 in e2) t3.push(n3);
              return t3;
            };
            t2.exports = r2;
            var d = e("./_stream_readable"), s = e("./_stream_writable");
            e("inherits")(r2, d);
            for (var l, c = i(s.prototype), u = 0; u < c.length; u++) l = c[u], r2.prototype[l] || (r2.prototype[l] = s.prototype[l]);
            Object.defineProperty(r2.prototype, "writableHighWaterMark", { enumerable: false, get: function() {
              return this._writableState.highWaterMark;
            } }), Object.defineProperty(r2.prototype, "writableBuffer", { enumerable: false, get: function() {
              return this._writableState && this._writableState.getBuffer();
            } }), Object.defineProperty(r2.prototype, "writableLength", { enumerable: false, get: function() {
              return this._writableState.length;
            } }), Object.defineProperty(r2.prototype, "destroyed", { enumerable: false, get: function() {
              return void 0 !== this._readableState && void 0 !== this._writableState && this._readableState.destroyed && this._writableState.destroyed;
            }, set: function(e2) {
              void 0 === this._readableState || void 0 === this._writableState || (this._readableState.destroyed = e2, this._writableState.destroyed = e2);
            } });
          }).call(this);
        }).call(this, e("_process"));
      }, { "./_stream_readable": 18, "./_stream_writable": 20, _process: 12, inherits: 10 }], 17: [function(e, t2) {
        "use strict";
        function n2(e2) {
          return this instanceof n2 ? void r2.call(this, e2) : new n2(e2);
        }
        t2.exports = n2;
        var r2 = e("./_stream_transform");
        e("inherits")(n2, r2), n2.prototype._transform = function(e2, t3, n3) {
          n3(null, e2);
        };
      }, { "./_stream_transform": 19, inherits: 10 }], 18: [function(e, t2) {
        (function(n2, r2) {
          (function() {
            "use strict";
            function a(e2) {
              return P.from(e2);
            }
            function o(e2) {
              return P.isBuffer(e2) || e2 instanceof M;
            }
            function i(e2, t3, n3) {
              return "function" == typeof e2.prependListener ? e2.prependListener(t3, n3) : void (e2._events && e2._events[t3] ? Array.isArray(e2._events[t3]) ? e2._events[t3].unshift(n3) : e2._events[t3] = [n3, e2._events[t3]] : e2.on(t3, n3));
            }
            function d(t3, n3, r3) {
              A = A || e("./_stream_duplex"), t3 = t3 || {}, "boolean" != typeof r3 && (r3 = n3 instanceof A), this.objectMode = !!t3.objectMode, r3 && (this.objectMode = this.objectMode || !!t3.readableObjectMode), this.highWaterMark = H(this, t3, "readableHighWaterMark", r3), this.buffer = new j(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = false, this.endEmitted = false, this.reading = false, this.sync = true, this.needReadable = false, this.emittedReadable = false, this.readableListening = false, this.resumeScheduled = false, this.paused = true, this.emitClose = false !== t3.emitClose, this.autoDestroy = !!t3.autoDestroy, this.destroyed = false, this.defaultEncoding = t3.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = false, this.decoder = null, this.encoding = null, t3.encoding && (!F && (F = e("string_decoder/").StringDecoder), this.decoder = new F(t3.encoding), this.encoding = t3.encoding);
            }
            function s(t3) {
              if (A = A || e("./_stream_duplex"), !(this instanceof s)) return new s(t3);
              var n3 = this instanceof A;
              this._readableState = new d(t3, this, n3), this.readable = true, t3 && ("function" == typeof t3.read && (this._read = t3.read), "function" == typeof t3.destroy && (this._destroy = t3.destroy)), I.call(this);
            }
            function l(e2, t3, n3, r3, o2) {
              x("readableAddChunk", t3);
              var i2 = e2._readableState;
              if (null === t3) i2.reading = false, g(e2, i2);
              else {
                var d2;
                if (o2 || (d2 = u(i2, t3)), d2) X(e2, d2);
                else if (!(i2.objectMode || t3 && 0 < t3.length)) r3 || (i2.reading = false, m(e2, i2));
                else if ("string" == typeof t3 || i2.objectMode || Object.getPrototypeOf(t3) === P.prototype || (t3 = a(t3)), r3) i2.endEmitted ? X(e2, new K()) : c(e2, i2, t3, true);
                else if (i2.ended) X(e2, new z());
                else {
                  if (i2.destroyed) return false;
                  i2.reading = false, i2.decoder && !n3 ? (t3 = i2.decoder.write(t3), i2.objectMode || 0 !== t3.length ? c(e2, i2, t3, false) : m(e2, i2)) : c(e2, i2, t3, false);
                }
              }
              return !i2.ended && (i2.length < i2.highWaterMark || 0 === i2.length);
            }
            function c(e2, t3, n3, r3) {
              t3.flowing && 0 === t3.length && !t3.sync ? (t3.awaitDrain = 0, e2.emit("data", n3)) : (t3.length += t3.objectMode ? 1 : n3.length, r3 ? t3.buffer.unshift(n3) : t3.buffer.push(n3), t3.needReadable && _(e2)), m(e2, t3);
            }
            function u(e2, t3) {
              var n3;
              return o(t3) || "string" == typeof t3 || void 0 === t3 || e2.objectMode || (n3 = new V("chunk", ["string", "Buffer", "Uint8Array"], t3)), n3;
            }
            function p(e2) {
              return 1073741824 <= e2 ? e2 = 1073741824 : (e2--, e2 |= e2 >>> 1, e2 |= e2 >>> 2, e2 |= e2 >>> 4, e2 |= e2 >>> 8, e2 |= e2 >>> 16, e2++), e2;
            }
            function f(e2, t3) {
              return 0 >= e2 || 0 === t3.length && t3.ended ? 0 : t3.objectMode ? 1 : e2 === e2 ? (e2 > t3.highWaterMark && (t3.highWaterMark = p(e2)), e2 <= t3.length ? e2 : t3.ended ? t3.length : (t3.needReadable = true, 0)) : t3.flowing && t3.length ? t3.buffer.head.data.length : t3.length;
            }
            function g(e2, t3) {
              if (x("onEofChunk"), !t3.ended) {
                if (t3.decoder) {
                  var n3 = t3.decoder.end();
                  n3 && n3.length && (t3.buffer.push(n3), t3.length += t3.objectMode ? 1 : n3.length);
                }
                t3.ended = true, t3.sync ? _(e2) : (t3.needReadable = false, !t3.emittedReadable && (t3.emittedReadable = true, h(e2)));
              }
            }
            function _(e2) {
              var t3 = e2._readableState;
              x("emitReadable", t3.needReadable, t3.emittedReadable), t3.needReadable = false, t3.emittedReadable || (x("emitReadable", t3.flowing), t3.emittedReadable = true, n2.nextTick(h, e2));
            }
            function h(e2) {
              var t3 = e2._readableState;
              x("emitReadable_", t3.destroyed, t3.length, t3.ended), !t3.destroyed && (t3.length || t3.ended) && (e2.emit("readable"), t3.emittedReadable = false), t3.needReadable = !t3.flowing && !t3.ended && t3.length <= t3.highWaterMark, S(e2);
            }
            function m(e2, t3) {
              t3.readingMore || (t3.readingMore = true, n2.nextTick(b, e2, t3));
            }
            function b(e2, t3) {
              for (; !t3.reading && !t3.ended && (t3.length < t3.highWaterMark || t3.flowing && 0 === t3.length); ) {
                var n3 = t3.length;
                if (x("maybeReadMore read 0"), e2.read(0), n3 === t3.length) break;
              }
              t3.readingMore = false;
            }
            function y(e2) {
              return function() {
                var t3 = e2._readableState;
                x("pipeOnDrain", t3.awaitDrain), t3.awaitDrain && t3.awaitDrain--, 0 === t3.awaitDrain && D(e2, "data") && (t3.flowing = true, S(e2));
              };
            }
            function C(e2) {
              var t3 = e2._readableState;
              t3.readableListening = 0 < e2.listenerCount("readable"), t3.resumeScheduled && !t3.paused ? t3.flowing = true : 0 < e2.listenerCount("data") && e2.resume();
            }
            function R(e2) {
              x("readable nexttick read 0"), e2.read(0);
            }
            function E(e2, t3) {
              t3.resumeScheduled || (t3.resumeScheduled = true, n2.nextTick(w, e2, t3));
            }
            function w(e2, t3) {
              x("resume", t3.reading), t3.reading || e2.read(0), t3.resumeScheduled = false, e2.emit("resume"), S(e2), t3.flowing && !t3.reading && e2.read(0);
            }
            function S(e2) {
              var t3 = e2._readableState;
              for (x("flow", t3.flowing); t3.flowing && null !== e2.read(); ) ;
            }
            function T(e2, t3) {
              if (0 === t3.length) return null;
              var n3;
              return t3.objectMode ? n3 = t3.buffer.shift() : !e2 || e2 >= t3.length ? (n3 = t3.decoder ? t3.buffer.join("") : 1 === t3.buffer.length ? t3.buffer.first() : t3.buffer.concat(t3.length), t3.buffer.clear()) : n3 = t3.buffer.consume(e2, t3.decoder), n3;
            }
            function v(e2) {
              var t3 = e2._readableState;
              x("endReadable", t3.endEmitted), t3.endEmitted || (t3.ended = true, n2.nextTick(k, t3, e2));
            }
            function k(e2, t3) {
              if (x("endReadableNT", e2.endEmitted, e2.length), !e2.endEmitted && 0 === e2.length && (e2.endEmitted = true, t3.readable = false, t3.emit("end"), e2.autoDestroy)) {
                var n3 = t3._writableState;
                (!n3 || n3.autoDestroy && n3.finished) && t3.destroy();
              }
            }
            function L(e2, t3) {
              for (var n3 = 0, r3 = e2.length; n3 < r3; n3++) if (e2[n3] === t3) return n3;
              return -1;
            }
            t2.exports = s;
            var A;
            s.ReadableState = d;
            var x, N = e("events").EventEmitter, D = function(e2, t3) {
              return e2.listeners(t3).length;
            }, I = e("./internal/streams/stream"), P = e("buffer").Buffer, M = r2.Uint8Array || function() {
            }, O = e("util");
            x = O && O.debuglog ? O.debuglog("stream") : function() {
            };
            var F, B, U, j = e("./internal/streams/buffer_list"), q = e("./internal/streams/destroy"), W = e("./internal/streams/state"), H = W.getHighWaterMark, Y = e("../errors").codes, V = Y.ERR_INVALID_ARG_TYPE, z = Y.ERR_STREAM_PUSH_AFTER_EOF, G = Y.ERR_METHOD_NOT_IMPLEMENTED, K = Y.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;
            e("inherits")(s, I);
            var X = q.errorOrDestroy, $ = ["error", "close", "destroy", "pause", "resume"];
            Object.defineProperty(s.prototype, "destroyed", { enumerable: false, get: function() {
              return void 0 !== this._readableState && this._readableState.destroyed;
            }, set: function(e2) {
              this._readableState && (this._readableState.destroyed = e2);
            } }), s.prototype.destroy = q.destroy, s.prototype._undestroy = q.undestroy, s.prototype._destroy = function(e2, t3) {
              t3(e2);
            }, s.prototype.push = function(e2, t3) {
              var n3, r3 = this._readableState;
              return r3.objectMode ? n3 = true : "string" == typeof e2 && (t3 = t3 || r3.defaultEncoding, t3 !== r3.encoding && (e2 = P.from(e2, t3), t3 = ""), n3 = true), l(this, e2, t3, false, n3);
            }, s.prototype.unshift = function(e2) {
              return l(this, e2, null, true, false);
            }, s.prototype.isPaused = function() {
              return false === this._readableState.flowing;
            }, s.prototype.setEncoding = function(t3) {
              F || (F = e("string_decoder/").StringDecoder);
              var n3 = new F(t3);
              this._readableState.decoder = n3, this._readableState.encoding = this._readableState.decoder.encoding;
              for (var r3 = this._readableState.buffer.head, a2 = ""; null !== r3; ) a2 += n3.write(r3.data), r3 = r3.next;
              return this._readableState.buffer.clear(), "" !== a2 && this._readableState.buffer.push(a2), this._readableState.length = a2.length, this;
            };
            s.prototype.read = function(e2) {
              x("read", e2), e2 = parseInt(e2, 10);
              var t3 = this._readableState, r3 = e2;
              if (0 !== e2 && (t3.emittedReadable = false), 0 === e2 && t3.needReadable && ((0 === t3.highWaterMark ? 0 < t3.length : t3.length >= t3.highWaterMark) || t3.ended)) return x("read: emitReadable", t3.length, t3.ended), 0 === t3.length && t3.ended ? v(this) : _(this), null;
              if (e2 = f(e2, t3), 0 === e2 && t3.ended) return 0 === t3.length && v(this), null;
              var a2 = t3.needReadable;
              x("need readable", a2), (0 === t3.length || t3.length - e2 < t3.highWaterMark) && (a2 = true, x("length less than watermark", a2)), t3.ended || t3.reading ? (a2 = false, x("reading or ended", a2)) : a2 && (x("do read"), t3.reading = true, t3.sync = true, 0 === t3.length && (t3.needReadable = true), this._read(t3.highWaterMark), t3.sync = false, !t3.reading && (e2 = f(r3, t3)));
              var o2;
              return o2 = 0 < e2 ? T(e2, t3) : null, null === o2 ? (t3.needReadable = t3.length <= t3.highWaterMark, e2 = 0) : (t3.length -= e2, t3.awaitDrain = 0), 0 === t3.length && (!t3.ended && (t3.needReadable = true), r3 !== e2 && t3.ended && v(this)), null !== o2 && this.emit("data", o2), o2;
            }, s.prototype._read = function() {
              X(this, new G("_read()"));
            }, s.prototype.pipe = function(e2, t3) {
              function r3(e3, t4) {
                x("onunpipe"), e3 === p2 && t4 && false === t4.hasUnpiped && (t4.hasUnpiped = true, o2());
              }
              function a2() {
                x("onend"), e2.end();
              }
              function o2() {
                x("cleanup"), e2.removeListener("close", l2), e2.removeListener("finish", c2), e2.removeListener("drain", h2), e2.removeListener("error", s2), e2.removeListener("unpipe", r3), p2.removeListener("end", a2), p2.removeListener("end", u2), p2.removeListener("data", d2), m2 = true, f2.awaitDrain && (!e2._writableState || e2._writableState.needDrain) && h2();
              }
              function d2(t4) {
                x("ondata");
                var n3 = e2.write(t4);
                x("dest.write", n3), false === n3 && ((1 === f2.pipesCount && f2.pipes === e2 || 1 < f2.pipesCount && -1 !== L(f2.pipes, e2)) && !m2 && (x("false write response, pause", f2.awaitDrain), f2.awaitDrain++), p2.pause());
              }
              function s2(t4) {
                x("onerror", t4), u2(), e2.removeListener("error", s2), 0 === D(e2, "error") && X(e2, t4);
              }
              function l2() {
                e2.removeListener("finish", c2), u2();
              }
              function c2() {
                x("onfinish"), e2.removeListener("close", l2), u2();
              }
              function u2() {
                x("unpipe"), p2.unpipe(e2);
              }
              var p2 = this, f2 = this._readableState;
              switch (f2.pipesCount) {
                case 0:
                  f2.pipes = e2;
                  break;
                case 1:
                  f2.pipes = [f2.pipes, e2];
                  break;
                default:
                  f2.pipes.push(e2);
              }
              f2.pipesCount += 1, x("pipe count=%d opts=%j", f2.pipesCount, t3);
              var g2 = (!t3 || false !== t3.end) && e2 !== n2.stdout && e2 !== n2.stderr, _2 = g2 ? a2 : u2;
              f2.endEmitted ? n2.nextTick(_2) : p2.once("end", _2), e2.on("unpipe", r3);
              var h2 = y(p2);
              e2.on("drain", h2);
              var m2 = false;
              return p2.on("data", d2), i(e2, "error", s2), e2.once("close", l2), e2.once("finish", c2), e2.emit("pipe", p2), f2.flowing || (x("pipe resume"), p2.resume()), e2;
            }, s.prototype.unpipe = function(e2) {
              var t3 = this._readableState, n3 = { hasUnpiped: false };
              if (0 === t3.pipesCount) return this;
              if (1 === t3.pipesCount) return e2 && e2 !== t3.pipes ? this : (e2 || (e2 = t3.pipes), t3.pipes = null, t3.pipesCount = 0, t3.flowing = false, e2 && e2.emit("unpipe", this, n3), this);
              if (!e2) {
                var r3 = t3.pipes, a2 = t3.pipesCount;
                t3.pipes = null, t3.pipesCount = 0, t3.flowing = false;
                for (var o2 = 0; o2 < a2; o2++) r3[o2].emit("unpipe", this, { hasUnpiped: false });
                return this;
              }
              var d2 = L(t3.pipes, e2);
              return -1 === d2 ? this : (t3.pipes.splice(d2, 1), t3.pipesCount -= 1, 1 === t3.pipesCount && (t3.pipes = t3.pipes[0]), e2.emit("unpipe", this, n3), this);
            }, s.prototype.on = function(e2, t3) {
              var r3 = I.prototype.on.call(this, e2, t3), a2 = this._readableState;
              return "data" === e2 ? (a2.readableListening = 0 < this.listenerCount("readable"), false !== a2.flowing && this.resume()) : "readable" == e2 && !a2.endEmitted && !a2.readableListening && (a2.readableListening = a2.needReadable = true, a2.flowing = false, a2.emittedReadable = false, x("on readable", a2.length, a2.reading), a2.length ? _(this) : !a2.reading && n2.nextTick(R, this)), r3;
            }, s.prototype.addListener = s.prototype.on, s.prototype.removeListener = function(e2, t3) {
              var r3 = I.prototype.removeListener.call(this, e2, t3);
              return "readable" === e2 && n2.nextTick(C, this), r3;
            }, s.prototype.removeAllListeners = function(e2) {
              var t3 = I.prototype.removeAllListeners.apply(this, arguments);
              return ("readable" === e2 || void 0 === e2) && n2.nextTick(C, this), t3;
            }, s.prototype.resume = function() {
              var e2 = this._readableState;
              return e2.flowing || (x("resume"), e2.flowing = !e2.readableListening, E(this, e2)), e2.paused = false, this;
            }, s.prototype.pause = function() {
              return x("call pause flowing=%j", this._readableState.flowing), false !== this._readableState.flowing && (x("pause"), this._readableState.flowing = false, this.emit("pause")), this._readableState.paused = true, this;
            }, s.prototype.wrap = function(e2) {
              var t3 = this, r3 = this._readableState, a2 = false;
              for (var o2 in e2.on("end", function() {
                if (x("wrapped end"), r3.decoder && !r3.ended) {
                  var e3 = r3.decoder.end();
                  e3 && e3.length && t3.push(e3);
                }
                t3.push(null);
              }), e2.on("data", function(n3) {
                if ((x("wrapped data"), r3.decoder && (n3 = r3.decoder.write(n3)), !(r3.objectMode && (null === n3 || void 0 === n3))) && (r3.objectMode || n3 && n3.length)) {
                  var o3 = t3.push(n3);
                  o3 || (a2 = true, e2.pause());
                }
              }), e2) void 0 === this[o2] && "function" == typeof e2[o2] && (this[o2] = /* @__PURE__ */ function(t4) {
                return function() {
                  return e2[t4].apply(e2, arguments);
                };
              }(o2));
              for (var i2 = 0; i2 < $.length; i2++) e2.on($[i2], this.emit.bind(this, $[i2]));
              return this._read = function(t4) {
                x("wrapped _read", t4), a2 && (a2 = false, e2.resume());
              }, this;
            }, "function" == typeof Symbol && (s.prototype[Symbol.asyncIterator] = function() {
              return void 0 === B && (B = e("./internal/streams/async_iterator")), B(this);
            }), Object.defineProperty(s.prototype, "readableHighWaterMark", { enumerable: false, get: function() {
              return this._readableState.highWaterMark;
            } }), Object.defineProperty(s.prototype, "readableBuffer", { enumerable: false, get: function() {
              return this._readableState && this._readableState.buffer;
            } }), Object.defineProperty(s.prototype, "readableFlowing", { enumerable: false, get: function() {
              return this._readableState.flowing;
            }, set: function(e2) {
              this._readableState && (this._readableState.flowing = e2);
            } }), s._fromList = T, Object.defineProperty(s.prototype, "readableLength", { enumerable: false, get: function() {
              return this._readableState.length;
            } }), "function" == typeof Symbol && (s.from = function(t3, n3) {
              return void 0 === U && (U = e("./internal/streams/from")), U(s, t3, n3);
            });
          }).call(this);
        }).call(this, e("_process"), "undefined" == typeof global ? "undefined" == typeof self ? "undefined" == typeof window ? {} : window : self : global);
      }, { "../errors": 15, "./_stream_duplex": 16, "./internal/streams/async_iterator": 21, "./internal/streams/buffer_list": 22, "./internal/streams/destroy": 23, "./internal/streams/from": 25, "./internal/streams/state": 27, "./internal/streams/stream": 28, _process: 12, buffer: 3, events: 7, inherits: 10, "string_decoder/": 31, util: 2 }], 19: [function(e, t2) {
        "use strict";
        function n2(e2, t3) {
          var n3 = this._transformState;
          n3.transforming = false;
          var r3 = n3.writecb;
          if (null === r3) return this.emit("error", new s());
          n3.writechunk = null, n3.writecb = null, null != t3 && this.push(t3), r3(e2);
          var a2 = this._readableState;
          a2.reading = false, (a2.needReadable || a2.length < a2.highWaterMark) && this._read(a2.highWaterMark);
        }
        function r2(e2) {
          return this instanceof r2 ? void (u.call(this, e2), this._transformState = { afterTransform: n2.bind(this), needTransform: false, transforming: false, writecb: null, writechunk: null, writeencoding: null }, this._readableState.needReadable = true, this._readableState.sync = false, e2 && ("function" == typeof e2.transform && (this._transform = e2.transform), "function" == typeof e2.flush && (this._flush = e2.flush)), this.on("prefinish", a)) : new r2(e2);
        }
        function a() {
          var e2 = this;
          "function" != typeof this._flush || this._readableState.destroyed ? o(this, null, null) : this._flush(function(t3, n3) {
            o(e2, t3, n3);
          });
        }
        function o(e2, t3, n3) {
          if (t3) return e2.emit("error", t3);
          if (null != n3 && e2.push(n3), e2._writableState.length) throw new c();
          if (e2._transformState.transforming) throw new l();
          return e2.push(null);
        }
        t2.exports = r2;
        var i = e("../errors").codes, d = i.ERR_METHOD_NOT_IMPLEMENTED, s = i.ERR_MULTIPLE_CALLBACK, l = i.ERR_TRANSFORM_ALREADY_TRANSFORMING, c = i.ERR_TRANSFORM_WITH_LENGTH_0, u = e("./_stream_duplex");
        e("inherits")(r2, u), r2.prototype.push = function(e2, t3) {
          return this._transformState.needTransform = false, u.prototype.push.call(this, e2, t3);
        }, r2.prototype._transform = function(e2, t3, n3) {
          n3(new d("_transform()"));
        }, r2.prototype._write = function(e2, t3, n3) {
          var r3 = this._transformState;
          if (r3.writecb = n3, r3.writechunk = e2, r3.writeencoding = t3, !r3.transforming) {
            var a2 = this._readableState;
            (r3.needTransform || a2.needReadable || a2.length < a2.highWaterMark) && this._read(a2.highWaterMark);
          }
        }, r2.prototype._read = function() {
          var e2 = this._transformState;
          null === e2.writechunk || e2.transforming ? e2.needTransform = true : (e2.transforming = true, this._transform(e2.writechunk, e2.writeencoding, e2.afterTransform));
        }, r2.prototype._destroy = function(e2, t3) {
          u.prototype._destroy.call(this, e2, function(e3) {
            t3(e3);
          });
        };
      }, { "../errors": 15, "./_stream_duplex": 16, inherits: 10 }], 20: [function(e, t2) {
        (function(n2, r2) {
          (function() {
            "use strict";
            function a(e2) {
              var t3 = this;
              this.next = null, this.entry = null, this.finish = function() {
                v(t3, e2);
              };
            }
            function o(e2) {
              return x.from(e2);
            }
            function i(e2) {
              return x.isBuffer(e2) || e2 instanceof N;
            }
            function d() {
            }
            function s(t3, n3, r3) {
              k = k || e("./_stream_duplex"), t3 = t3 || {}, "boolean" != typeof r3 && (r3 = n3 instanceof k), this.objectMode = !!t3.objectMode, r3 && (this.objectMode = this.objectMode || !!t3.writableObjectMode), this.highWaterMark = P(this, t3, "writableHighWaterMark", r3), this.finalCalled = false, this.needDrain = false, this.ending = false, this.ended = false, this.finished = false, this.destroyed = false;
              var o2 = false === t3.decodeStrings;
              this.decodeStrings = !o2, this.defaultEncoding = t3.defaultEncoding || "utf8", this.length = 0, this.writing = false, this.corked = 0, this.sync = true, this.bufferProcessing = false, this.onwrite = function(e2) {
                m(n3, e2);
              }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = false, this.errorEmitted = false, this.emitClose = false !== t3.emitClose, this.autoDestroy = !!t3.autoDestroy, this.bufferedRequestCount = 0, this.corkedRequestsFree = new a(this);
            }
            function l(t3) {
              k = k || e("./_stream_duplex");
              var n3 = this instanceof k;
              return n3 || V.call(l, this) ? void (this._writableState = new s(t3, this, n3), this.writable = true, t3 && ("function" == typeof t3.write && (this._write = t3.write), "function" == typeof t3.writev && (this._writev = t3.writev), "function" == typeof t3.destroy && (this._destroy = t3.destroy), "function" == typeof t3.final && (this._final = t3.final)), A.call(this)) : new l(t3);
            }
            function c(e2, t3) {
              var r3 = new W();
              Y(e2, r3), n2.nextTick(t3, r3);
            }
            function u(e2, t3, r3, a2) {
              var o2;
              return null === r3 ? o2 = new q() : "string" != typeof r3 && !t3.objectMode && (o2 = new O("chunk", ["string", "Buffer"], r3)), !o2 || (Y(e2, o2), n2.nextTick(a2, o2), false);
            }
            function p(e2, t3, n3) {
              return e2.objectMode || false === e2.decodeStrings || "string" != typeof t3 || (t3 = x.from(t3, n3)), t3;
            }
            function f(e2, t3, n3, r3, a2, o2) {
              if (!n3) {
                var i2 = p(t3, r3, a2);
                r3 !== i2 && (n3 = true, a2 = "buffer", r3 = i2);
              }
              var d2 = t3.objectMode ? 1 : r3.length;
              t3.length += d2;
              var s2 = t3.length < t3.highWaterMark;
              if (s2 || (t3.needDrain = true), t3.writing || t3.corked) {
                var l2 = t3.lastBufferedRequest;
                t3.lastBufferedRequest = { chunk: r3, encoding: a2, isBuf: n3, callback: o2, next: null }, l2 ? l2.next = t3.lastBufferedRequest : t3.bufferedRequest = t3.lastBufferedRequest, t3.bufferedRequestCount += 1;
              } else g(e2, t3, false, d2, r3, a2, o2);
              return s2;
            }
            function g(e2, t3, n3, r3, a2, o2, i2) {
              t3.writelen = r3, t3.writecb = i2, t3.writing = true, t3.sync = true, t3.destroyed ? t3.onwrite(new j("write")) : n3 ? e2._writev(a2, t3.onwrite) : e2._write(a2, o2, t3.onwrite), t3.sync = false;
            }
            function _(e2, t3, r3, a2, o2) {
              --t3.pendingcb, r3 ? (n2.nextTick(o2, a2), n2.nextTick(S, e2, t3), e2._writableState.errorEmitted = true, Y(e2, a2)) : (o2(a2), e2._writableState.errorEmitted = true, Y(e2, a2), S(e2, t3));
            }
            function h(e2) {
              e2.writing = false, e2.writecb = null, e2.length -= e2.writelen, e2.writelen = 0;
            }
            function m(e2, t3) {
              var r3 = e2._writableState, a2 = r3.sync, o2 = r3.writecb;
              if ("function" != typeof o2) throw new B();
              if (h(r3), t3) _(e2, r3, a2, t3, o2);
              else {
                var i2 = R(r3) || e2.destroyed;
                i2 || r3.corked || r3.bufferProcessing || !r3.bufferedRequest || C(e2, r3), a2 ? n2.nextTick(b, e2, r3, i2, o2) : b(e2, r3, i2, o2);
              }
            }
            function b(e2, t3, n3, r3) {
              n3 || y(e2, t3), t3.pendingcb--, r3(), S(e2, t3);
            }
            function y(e2, t3) {
              0 === t3.length && t3.needDrain && (t3.needDrain = false, e2.emit("drain"));
            }
            function C(e2, t3) {
              t3.bufferProcessing = true;
              var n3 = t3.bufferedRequest;
              if (e2._writev && n3 && n3.next) {
                var r3 = t3.bufferedRequestCount, o2 = Array(r3), i2 = t3.corkedRequestsFree;
                i2.entry = n3;
                for (var d2 = 0, s2 = true; n3; ) o2[d2] = n3, n3.isBuf || (s2 = false), n3 = n3.next, d2 += 1;
                o2.allBuffers = s2, g(e2, t3, true, t3.length, o2, "", i2.finish), t3.pendingcb++, t3.lastBufferedRequest = null, i2.next ? (t3.corkedRequestsFree = i2.next, i2.next = null) : t3.corkedRequestsFree = new a(t3), t3.bufferedRequestCount = 0;
              } else {
                for (; n3; ) {
                  var l2 = n3.chunk, c2 = n3.encoding, u2 = n3.callback, p2 = t3.objectMode ? 1 : l2.length;
                  if (g(e2, t3, false, p2, l2, c2, u2), n3 = n3.next, t3.bufferedRequestCount--, t3.writing) break;
                }
                null === n3 && (t3.lastBufferedRequest = null);
              }
              t3.bufferedRequest = n3, t3.bufferProcessing = false;
            }
            function R(e2) {
              return e2.ending && 0 === e2.length && null === e2.bufferedRequest && !e2.finished && !e2.writing;
            }
            function E(e2, t3) {
              e2._final(function(n3) {
                t3.pendingcb--, n3 && Y(e2, n3), t3.prefinished = true, e2.emit("prefinish"), S(e2, t3);
              });
            }
            function w(e2, t3) {
              t3.prefinished || t3.finalCalled || ("function" != typeof e2._final || t3.destroyed ? (t3.prefinished = true, e2.emit("prefinish")) : (t3.pendingcb++, t3.finalCalled = true, n2.nextTick(E, e2, t3)));
            }
            function S(e2, t3) {
              var n3 = R(t3);
              if (n3 && (w(e2, t3), 0 === t3.pendingcb && (t3.finished = true, e2.emit("finish"), t3.autoDestroy))) {
                var r3 = e2._readableState;
                (!r3 || r3.autoDestroy && r3.endEmitted) && e2.destroy();
              }
              return n3;
            }
            function T(e2, t3, r3) {
              t3.ending = true, S(e2, t3), r3 && (t3.finished ? n2.nextTick(r3) : e2.once("finish", r3)), t3.ended = true, e2.writable = false;
            }
            function v(e2, t3, n3) {
              var r3 = e2.entry;
              for (e2.entry = null; r3; ) {
                var a2 = r3.callback;
                t3.pendingcb--, a2(n3), r3 = r3.next;
              }
              t3.corkedRequestsFree.next = e2;
            }
            t2.exports = l;
            var k;
            l.WritableState = s;
            var L = { deprecate: e("util-deprecate") }, A = e("./internal/streams/stream"), x = e("buffer").Buffer, N = r2.Uint8Array || function() {
            }, D = e("./internal/streams/destroy"), I = e("./internal/streams/state"), P = I.getHighWaterMark, M = e("../errors").codes, O = M.ERR_INVALID_ARG_TYPE, F = M.ERR_METHOD_NOT_IMPLEMENTED, B = M.ERR_MULTIPLE_CALLBACK, U = M.ERR_STREAM_CANNOT_PIPE, j = M.ERR_STREAM_DESTROYED, q = M.ERR_STREAM_NULL_VALUES, W = M.ERR_STREAM_WRITE_AFTER_END, H = M.ERR_UNKNOWN_ENCODING, Y = D.errorOrDestroy;
            e("inherits")(l, A), s.prototype.getBuffer = function() {
              for (var e2 = this.bufferedRequest, t3 = []; e2; ) t3.push(e2), e2 = e2.next;
              return t3;
            }, function() {
              try {
                Object.defineProperty(s.prototype, "buffer", { get: L.deprecate(function() {
                  return this.getBuffer();
                }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003") });
              } catch (e2) {
              }
            }();
            var V;
            "function" == typeof Symbol && Symbol.hasInstance && "function" == typeof Function.prototype[Symbol.hasInstance] ? (V = Function.prototype[Symbol.hasInstance], Object.defineProperty(l, Symbol.hasInstance, { value: function(e2) {
              return !!V.call(this, e2) || !(this !== l) && e2 && e2._writableState instanceof s;
            } })) : V = function(e2) {
              return e2 instanceof this;
            }, l.prototype.pipe = function() {
              Y(this, new U());
            }, l.prototype.write = function(e2, t3, n3) {
              var r3 = this._writableState, a2 = false, s2 = !r3.objectMode && i(e2);
              return s2 && !x.isBuffer(e2) && (e2 = o(e2)), "function" == typeof t3 && (n3 = t3, t3 = null), s2 ? t3 = "buffer" : !t3 && (t3 = r3.defaultEncoding), "function" != typeof n3 && (n3 = d), r3.ending ? c(this, n3) : (s2 || u(this, r3, e2, n3)) && (r3.pendingcb++, a2 = f(this, r3, s2, e2, t3, n3)), a2;
            }, l.prototype.cork = function() {
              this._writableState.corked++;
            }, l.prototype.uncork = function() {
              var e2 = this._writableState;
              e2.corked && (e2.corked--, !e2.writing && !e2.corked && !e2.bufferProcessing && e2.bufferedRequest && C(this, e2));
            }, l.prototype.setDefaultEncoding = function(e2) {
              if ("string" == typeof e2 && (e2 = e2.toLowerCase()), !(-1 < ["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((e2 + "").toLowerCase()))) throw new H(e2);
              return this._writableState.defaultEncoding = e2, this;
            }, Object.defineProperty(l.prototype, "writableBuffer", { enumerable: false, get: function() {
              return this._writableState && this._writableState.getBuffer();
            } }), Object.defineProperty(l.prototype, "writableHighWaterMark", { enumerable: false, get: function() {
              return this._writableState.highWaterMark;
            } }), l.prototype._write = function(e2, t3, n3) {
              n3(new F("_write()"));
            }, l.prototype._writev = null, l.prototype.end = function(e2, t3, n3) {
              var r3 = this._writableState;
              return "function" == typeof e2 ? (n3 = e2, e2 = null, t3 = null) : "function" == typeof t3 && (n3 = t3, t3 = null), null !== e2 && void 0 !== e2 && this.write(e2, t3), r3.corked && (r3.corked = 1, this.uncork()), r3.ending || T(this, r3, n3), this;
            }, Object.defineProperty(l.prototype, "writableLength", { enumerable: false, get: function() {
              return this._writableState.length;
            } }), Object.defineProperty(l.prototype, "destroyed", { enumerable: false, get: function() {
              return void 0 !== this._writableState && this._writableState.destroyed;
            }, set: function(e2) {
              this._writableState && (this._writableState.destroyed = e2);
            } }), l.prototype.destroy = D.destroy, l.prototype._undestroy = D.undestroy, l.prototype._destroy = function(e2, t3) {
              t3(e2);
            };
          }).call(this);
        }).call(this, e("_process"), "undefined" == typeof global ? "undefined" == typeof self ? "undefined" == typeof window ? {} : window : self : global);
      }, { "../errors": 15, "./_stream_duplex": 16, "./internal/streams/destroy": 23, "./internal/streams/state": 27, "./internal/streams/stream": 28, _process: 12, buffer: 3, inherits: 10, "util-deprecate": 32 }], 21: [function(e, t2) {
        (function(n2) {
          (function() {
            "use strict";
            function r2(e2, t3, n3) {
              return t3 in e2 ? Object.defineProperty(e2, t3, { value: n3, enumerable: true, configurable: true, writable: true }) : e2[t3] = n3, e2;
            }
            function a(e2, t3) {
              return { value: e2, done: t3 };
            }
            function o(e2) {
              var t3 = e2[c];
              if (null !== t3) {
                var n3 = e2[h].read();
                null !== n3 && (e2[g] = null, e2[c] = null, e2[u] = null, t3(a(n3, false)));
              }
            }
            function i(e2) {
              n2.nextTick(o, e2);
            }
            function d(e2, t3) {
              return function(n3, r3) {
                e2.then(function() {
                  return t3[f] ? void n3(a(void 0, true)) : void t3[_](n3, r3);
                }, r3);
              };
            }
            var s, l = e("./end-of-stream"), c = Symbol("lastResolve"), u = Symbol("lastReject"), p = Symbol("error"), f = Symbol("ended"), g = Symbol("lastPromise"), _ = Symbol("handlePromise"), h = Symbol("stream"), m = Object.getPrototypeOf(function() {
            }), b = Object.setPrototypeOf((s = { get stream() {
              return this[h];
            }, next: function() {
              var e2 = this, t3 = this[p];
              if (null !== t3) return Promise.reject(t3);
              if (this[f]) return Promise.resolve(a(void 0, true));
              if (this[h].destroyed) return new Promise(function(t4, r4) {
                n2.nextTick(function() {
                  e2[p] ? r4(e2[p]) : t4(a(void 0, true));
                });
              });
              var r3, o2 = this[g];
              if (o2) r3 = new Promise(d(o2, this));
              else {
                var i2 = this[h].read();
                if (null !== i2) return Promise.resolve(a(i2, false));
                r3 = new Promise(this[_]);
              }
              return this[g] = r3, r3;
            } }, r2(s, Symbol.asyncIterator, function() {
              return this;
            }), r2(s, "return", function() {
              var e2 = this;
              return new Promise(function(t3, n3) {
                e2[h].destroy(null, function(e3) {
                  return e3 ? void n3(e3) : void t3(a(void 0, true));
                });
              });
            }), s), m);
            t2.exports = function(e2) {
              var t3, n3 = Object.create(b, (t3 = {}, r2(t3, h, { value: e2, writable: true }), r2(t3, c, { value: null, writable: true }), r2(t3, u, { value: null, writable: true }), r2(t3, p, { value: null, writable: true }), r2(t3, f, { value: e2._readableState.endEmitted, writable: true }), r2(t3, _, { value: function(e3, t4) {
                var r3 = n3[h].read();
                r3 ? (n3[g] = null, n3[c] = null, n3[u] = null, e3(a(r3, false))) : (n3[c] = e3, n3[u] = t4);
              }, writable: true }), t3));
              return n3[g] = null, l(e2, function(e3) {
                if (e3 && "ERR_STREAM_PREMATURE_CLOSE" !== e3.code) {
                  var t4 = n3[u];
                  return null !== t4 && (n3[g] = null, n3[c] = null, n3[u] = null, t4(e3)), void (n3[p] = e3);
                }
                var r3 = n3[c];
                null !== r3 && (n3[g] = null, n3[c] = null, n3[u] = null, r3(a(void 0, true))), n3[f] = true;
              }), e2.on("readable", i.bind(null, n3)), n3;
            };
          }).call(this);
        }).call(this, e("_process"));
      }, { "./end-of-stream": 24, _process: 12 }], 22: [function(e, t2) {
        "use strict";
        function n2(e2, t3) {
          var n3 = Object.keys(e2);
          if (Object.getOwnPropertySymbols) {
            var r3 = Object.getOwnPropertySymbols(e2);
            t3 && (r3 = r3.filter(function(t4) {
              return Object.getOwnPropertyDescriptor(e2, t4).enumerable;
            })), n3.push.apply(n3, r3);
          }
          return n3;
        }
        function r2(e2) {
          for (var t3, r3 = 1; r3 < arguments.length; r3++) t3 = null == arguments[r3] ? {} : arguments[r3], r3 % 2 ? n2(Object(t3), true).forEach(function(n3) {
            a(e2, n3, t3[n3]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t3)) : n2(Object(t3)).forEach(function(n3) {
            Object.defineProperty(e2, n3, Object.getOwnPropertyDescriptor(t3, n3));
          });
          return e2;
        }
        function a(e2, t3, n3) {
          return t3 in e2 ? Object.defineProperty(e2, t3, { value: n3, enumerable: true, configurable: true, writable: true }) : e2[t3] = n3, e2;
        }
        function o(e2, t3) {
          if (!(e2 instanceof t3)) throw new TypeError("Cannot call a class as a function");
        }
        function i(e2, t3) {
          for (var n3, r3 = 0; r3 < t3.length; r3++) n3 = t3[r3], n3.enumerable = n3.enumerable || false, n3.configurable = true, "value" in n3 && (n3.writable = true), Object.defineProperty(e2, n3.key, n3);
        }
        function d(e2, t3, n3) {
          return t3 && i(e2.prototype, t3), n3 && i(e2, n3), e2;
        }
        function s(e2, t3, n3) {
          u.prototype.copy.call(e2, t3, n3);
        }
        var l = e("buffer"), u = l.Buffer, p = e("util"), f = p.inspect, g = f && f.custom || "inspect";
        t2.exports = function() {
          function e2() {
            o(this, e2), this.head = null, this.tail = null, this.length = 0;
          }
          return d(e2, [{ key: "push", value: function(e3) {
            var t3 = { data: e3, next: null };
            0 < this.length ? this.tail.next = t3 : this.head = t3, this.tail = t3, ++this.length;
          } }, { key: "unshift", value: function(e3) {
            var t3 = { data: e3, next: this.head };
            0 === this.length && (this.tail = t3), this.head = t3, ++this.length;
          } }, { key: "shift", value: function() {
            if (0 !== this.length) {
              var e3 = this.head.data;
              return this.head = 1 === this.length ? this.tail = null : this.head.next, --this.length, e3;
            }
          } }, { key: "clear", value: function() {
            this.head = this.tail = null, this.length = 0;
          } }, { key: "join", value: function(e3) {
            if (0 === this.length) return "";
            for (var t3 = this.head, n3 = "" + t3.data; t3 = t3.next; ) n3 += e3 + t3.data;
            return n3;
          } }, { key: "concat", value: function(e3) {
            if (0 === this.length) return u.alloc(0);
            for (var t3 = u.allocUnsafe(e3 >>> 0), n3 = this.head, r3 = 0; n3; ) s(n3.data, t3, r3), r3 += n3.data.length, n3 = n3.next;
            return t3;
          } }, { key: "consume", value: function(e3, t3) {
            var n3;
            return e3 < this.head.data.length ? (n3 = this.head.data.slice(0, e3), this.head.data = this.head.data.slice(e3)) : e3 === this.head.data.length ? n3 = this.shift() : n3 = t3 ? this._getString(e3) : this._getBuffer(e3), n3;
          } }, { key: "first", value: function() {
            return this.head.data;
          } }, { key: "_getString", value: function(e3) {
            var t3 = this.head, r3 = 1, a2 = t3.data;
            for (e3 -= a2.length; t3 = t3.next; ) {
              var o2 = t3.data, i2 = e3 > o2.length ? o2.length : e3;
              if (a2 += i2 === o2.length ? o2 : o2.slice(0, e3), e3 -= i2, 0 === e3) {
                i2 === o2.length ? (++r3, this.head = t3.next ? t3.next : this.tail = null) : (this.head = t3, t3.data = o2.slice(i2));
                break;
              }
              ++r3;
            }
            return this.length -= r3, a2;
          } }, { key: "_getBuffer", value: function(e3) {
            var t3 = u.allocUnsafe(e3), r3 = this.head, a2 = 1;
            for (r3.data.copy(t3), e3 -= r3.data.length; r3 = r3.next; ) {
              var o2 = r3.data, i2 = e3 > o2.length ? o2.length : e3;
              if (o2.copy(t3, t3.length - e3, 0, i2), e3 -= i2, 0 === e3) {
                i2 === o2.length ? (++a2, this.head = r3.next ? r3.next : this.tail = null) : (this.head = r3, r3.data = o2.slice(i2));
                break;
              }
              ++a2;
            }
            return this.length -= a2, t3;
          } }, { key: g, value: function(e3, t3) {
            return f(this, r2({}, t3, { depth: 0, customInspect: false }));
          } }]), e2;
        }();
      }, { buffer: 3, util: 2 }], 23: [function(e, t2) {
        (function(e2) {
          (function() {
            "use strict";
            function n2(e3, t3) {
              a(e3, t3), r2(e3);
            }
            function r2(e3) {
              e3._writableState && !e3._writableState.emitClose || e3._readableState && !e3._readableState.emitClose || e3.emit("close");
            }
            function a(e3, t3) {
              e3.emit("error", t3);
            }
            t2.exports = { destroy: function(t3, o) {
              var i = this, d = this._readableState && this._readableState.destroyed, s = this._writableState && this._writableState.destroyed;
              return d || s ? (o ? o(t3) : t3 && (this._writableState ? !this._writableState.errorEmitted && (this._writableState.errorEmitted = true, e2.nextTick(a, this, t3)) : e2.nextTick(a, this, t3)), this) : (this._readableState && (this._readableState.destroyed = true), this._writableState && (this._writableState.destroyed = true), this._destroy(t3 || null, function(t4) {
                !o && t4 ? i._writableState ? i._writableState.errorEmitted ? e2.nextTick(r2, i) : (i._writableState.errorEmitted = true, e2.nextTick(n2, i, t4)) : e2.nextTick(n2, i, t4) : o ? (e2.nextTick(r2, i), o(t4)) : e2.nextTick(r2, i);
              }), this);
            }, undestroy: function() {
              this._readableState && (this._readableState.destroyed = false, this._readableState.reading = false, this._readableState.ended = false, this._readableState.endEmitted = false), this._writableState && (this._writableState.destroyed = false, this._writableState.ended = false, this._writableState.ending = false, this._writableState.finalCalled = false, this._writableState.prefinished = false, this._writableState.finished = false, this._writableState.errorEmitted = false);
            }, errorOrDestroy: function(e3, t3) {
              var n3 = e3._readableState, r3 = e3._writableState;
              n3 && n3.autoDestroy || r3 && r3.autoDestroy ? e3.destroy(t3) : e3.emit("error", t3);
            } };
          }).call(this);
        }).call(this, e("_process"));
      }, { _process: 12 }], 24: [function(e, t2) {
        "use strict";
        function n2(e2) {
          var t3 = false;
          return function() {
            if (!t3) {
              t3 = true;
              for (var n3 = arguments.length, r3 = Array(n3), a2 = 0; a2 < n3; a2++) r3[a2] = arguments[a2];
              e2.apply(this, r3);
            }
          };
        }
        function r2() {
        }
        function a(e2) {
          return e2.setHeader && "function" == typeof e2.abort;
        }
        function o(e2, t3, d) {
          if ("function" == typeof t3) return o(e2, null, t3);
          t3 || (t3 = {}), d = n2(d || r2);
          var s = t3.readable || false !== t3.readable && e2.readable, l = t3.writable || false !== t3.writable && e2.writable, c = function() {
            e2.writable || p();
          }, u = e2._writableState && e2._writableState.finished, p = function() {
            l = false, u = true, s || d.call(e2);
          }, f = e2._readableState && e2._readableState.endEmitted, g = function() {
            s = false, f = true, l || d.call(e2);
          }, _ = function(t4) {
            d.call(e2, t4);
          }, h = function() {
            var t4;
            return s && !f ? (e2._readableState && e2._readableState.ended || (t4 = new i()), d.call(e2, t4)) : l && !u ? (e2._writableState && e2._writableState.ended || (t4 = new i()), d.call(e2, t4)) : void 0;
          }, m = function() {
            e2.req.on("finish", p);
          };
          return a(e2) ? (e2.on("complete", p), e2.on("abort", h), e2.req ? m() : e2.on("request", m)) : l && !e2._writableState && (e2.on("end", c), e2.on("close", c)), e2.on("end", g), e2.on("finish", p), false !== t3.error && e2.on("error", _), e2.on("close", h), function() {
            e2.removeListener("complete", p), e2.removeListener("abort", h), e2.removeListener("request", m), e2.req && e2.req.removeListener("finish", p), e2.removeListener("end", c), e2.removeListener("close", c), e2.removeListener("finish", p), e2.removeListener("end", g), e2.removeListener("error", _), e2.removeListener("close", h);
          };
        }
        var i = e("../../../errors").codes.ERR_STREAM_PREMATURE_CLOSE;
        t2.exports = o;
      }, { "../../../errors": 15 }], 25: [function(e, t2) {
        t2.exports = function() {
          throw new Error("Readable.from is not available in the browser");
        };
      }, {}], 26: [function(e, t2) {
        "use strict";
        function n2(e2) {
          var t3 = false;
          return function() {
            t3 || (t3 = true, e2.apply(void 0, arguments));
          };
        }
        function r2(e2) {
          if (e2) throw e2;
        }
        function a(e2) {
          return e2.setHeader && "function" == typeof e2.abort;
        }
        function o(t3, r3, o2, i2) {
          i2 = n2(i2);
          var d2 = false;
          t3.on("close", function() {
            d2 = true;
          }), l === void 0 && (l = e("./end-of-stream")), l(t3, { readable: r3, writable: o2 }, function(e2) {
            return e2 ? i2(e2) : void (d2 = true, i2());
          });
          var s2 = false;
          return function(e2) {
            if (!d2) return s2 ? void 0 : (s2 = true, a(t3) ? t3.abort() : "function" == typeof t3.destroy ? t3.destroy() : void i2(e2 || new p("pipe")));
          };
        }
        function i(e2) {
          e2();
        }
        function d(e2, t3) {
          return e2.pipe(t3);
        }
        function s(e2) {
          return e2.length ? "function" == typeof e2[e2.length - 1] ? e2.pop() : r2 : r2;
        }
        var l, c = e("../../../errors").codes, u = c.ERR_MISSING_ARGS, p = c.ERR_STREAM_DESTROYED;
        t2.exports = function() {
          for (var e2 = arguments.length, t3 = Array(e2), n3 = 0; n3 < e2; n3++) t3[n3] = arguments[n3];
          var r3 = s(t3);
          if (Array.isArray(t3[0]) && (t3 = t3[0]), 2 > t3.length) throw new u("streams");
          var a2, l2 = t3.map(function(e3, n4) {
            var d2 = n4 < t3.length - 1;
            return o(e3, d2, 0 < n4, function(e4) {
              a2 || (a2 = e4), e4 && l2.forEach(i), d2 || (l2.forEach(i), r3(a2));
            });
          });
          return t3.reduce(d);
        };
      }, { "../../../errors": 15, "./end-of-stream": 24 }], 27: [function(e, n2) {
        "use strict";
        function r2(e2, t2, n3) {
          return null == e2.highWaterMark ? t2 ? e2[n3] : null : e2.highWaterMark;
        }
        var a = e("../../../errors").codes.ERR_INVALID_OPT_VALUE;
        n2.exports = { getHighWaterMark: function(e2, n3, o, i) {
          var d = r2(n3, i, o);
          if (null != d) {
            if (!(isFinite(d) && t(d) === d) || 0 > d) {
              var s = i ? o : "highWaterMark";
              throw new a(s, d);
            }
            return t(d);
          }
          return e2.objectMode ? 16 : 16384;
        } };
      }, { "../../../errors": 15 }], 28: [function(e, t2) {
        t2.exports = e("events").EventEmitter;
      }, { events: 7 }], 29: [function(e, t2, n2) {
        n2 = t2.exports = e("./lib/_stream_readable.js"), n2.Stream = n2, n2.Readable = n2, n2.Writable = e("./lib/_stream_writable.js"), n2.Duplex = e("./lib/_stream_duplex.js"), n2.Transform = e("./lib/_stream_transform.js"), n2.PassThrough = e("./lib/_stream_passthrough.js"), n2.finished = e("./lib/internal/streams/end-of-stream.js"), n2.pipeline = e("./lib/internal/streams/pipeline.js");
      }, { "./lib/_stream_duplex.js": 16, "./lib/_stream_passthrough.js": 17, "./lib/_stream_readable.js": 18, "./lib/_stream_transform.js": 19, "./lib/_stream_writable.js": 20, "./lib/internal/streams/end-of-stream.js": 24, "./lib/internal/streams/pipeline.js": 26 }], 30: [function(e, t2, n2) {
        function r2(e2, t3) {
          for (var n3 in e2) t3[n3] = e2[n3];
        }
        function a(e2, t3, n3) {
          return i(e2, t3, n3);
        }
        var o = e("buffer"), i = o.Buffer;
        i.from && i.alloc && i.allocUnsafe && i.allocUnsafeSlow ? t2.exports = o : (r2(o, n2), n2.Buffer = a), a.prototype = Object.create(i.prototype), r2(i, a), a.from = function(e2, t3, n3) {
          if ("number" == typeof e2) throw new TypeError("Argument must not be a number");
          return i(e2, t3, n3);
        }, a.alloc = function(e2, t3, n3) {
          if ("number" != typeof e2) throw new TypeError("Argument must be a number");
          var r3 = i(e2);
          return void 0 === t3 ? r3.fill(0) : "string" == typeof n3 ? r3.fill(t3, n3) : r3.fill(t3), r3;
        }, a.allocUnsafe = function(e2) {
          if ("number" != typeof e2) throw new TypeError("Argument must be a number");
          return i(e2);
        }, a.allocUnsafeSlow = function(e2) {
          if ("number" != typeof e2) throw new TypeError("Argument must be a number");
          return o.SlowBuffer(e2);
        };
      }, { buffer: 3 }], 31: [function(e, t2, n2) {
        "use strict";
        function r2(e2) {
          if (!e2) return "utf8";
          for (var t3; ; ) switch (e2) {
            case "utf8":
            case "utf-8":
              return "utf8";
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return "utf16le";
            case "latin1":
            case "binary":
              return "latin1";
            case "base64":
            case "ascii":
            case "hex":
              return e2;
            default:
              if (t3) return;
              e2 = ("" + e2).toLowerCase(), t3 = true;
          }
        }
        function a(e2) {
          var t3 = r2(e2);
          if ("string" != typeof t3 && (m.isEncoding === b || !b(e2))) throw new Error("Unknown encoding: " + e2);
          return t3 || e2;
        }
        function o(e2) {
          this.encoding = a(e2);
          var t3;
          switch (this.encoding) {
            case "utf16le":
              this.text = u, this.end = p, t3 = 4;
              break;
            case "utf8":
              this.fillLast = c, t3 = 4;
              break;
            case "base64":
              this.text = f, this.end = g, t3 = 3;
              break;
            default:
              return this.write = _, void (this.end = h);
          }
          this.lastNeed = 0, this.lastTotal = 0, this.lastChar = m.allocUnsafe(t3);
        }
        function d(e2) {
          if (127 >= e2) return 0;
          return 6 == e2 >> 5 ? 2 : 14 == e2 >> 4 ? 3 : 30 == e2 >> 3 ? 4 : 2 == e2 >> 6 ? -1 : -2;
        }
        function s(e2, t3, n3) {
          var r3 = t3.length - 1;
          if (r3 < n3) return 0;
          var a2 = d(t3[r3]);
          return 0 <= a2 ? (0 < a2 && (e2.lastNeed = a2 - 1), a2) : --r3 < n3 || -2 === a2 ? 0 : (a2 = d(t3[r3]), 0 <= a2) ? (0 < a2 && (e2.lastNeed = a2 - 2), a2) : --r3 < n3 || -2 === a2 ? 0 : (a2 = d(t3[r3]), 0 <= a2 ? (0 < a2 && (2 === a2 ? a2 = 0 : e2.lastNeed = a2 - 3), a2) : 0);
        }
        function l(e2, t3) {
          if (128 != (192 & t3[0])) return e2.lastNeed = 0, "\uFFFD";
          if (1 < e2.lastNeed && 1 < t3.length) {
            if (128 != (192 & t3[1])) return e2.lastNeed = 1, "\uFFFD";
            if (2 < e2.lastNeed && 2 < t3.length && 128 != (192 & t3[2])) return e2.lastNeed = 2, "\uFFFD";
          }
        }
        function c(e2) {
          var t3 = this.lastTotal - this.lastNeed, n3 = l(this, e2, t3);
          return void 0 === n3 ? this.lastNeed <= e2.length ? (e2.copy(this.lastChar, t3, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal)) : void (e2.copy(this.lastChar, t3, 0, e2.length), this.lastNeed -= e2.length) : n3;
        }
        function u(e2, t3) {
          if (0 == (e2.length - t3) % 2) {
            var n3 = e2.toString("utf16le", t3);
            if (n3) {
              var r3 = n3.charCodeAt(n3.length - 1);
              if (55296 <= r3 && 56319 >= r3) return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = e2[e2.length - 2], this.lastChar[1] = e2[e2.length - 1], n3.slice(0, -1);
            }
            return n3;
          }
          return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = e2[e2.length - 1], e2.toString("utf16le", t3, e2.length - 1);
        }
        function p(e2) {
          var t3 = e2 && e2.length ? this.write(e2) : "";
          if (this.lastNeed) {
            var n3 = this.lastTotal - this.lastNeed;
            return t3 + this.lastChar.toString("utf16le", 0, n3);
          }
          return t3;
        }
        function f(e2, t3) {
          var r3 = (e2.length - t3) % 3;
          return 0 == r3 ? e2.toString("base64", t3) : (this.lastNeed = 3 - r3, this.lastTotal = 3, 1 == r3 ? this.lastChar[0] = e2[e2.length - 1] : (this.lastChar[0] = e2[e2.length - 2], this.lastChar[1] = e2[e2.length - 1]), e2.toString("base64", t3, e2.length - r3));
        }
        function g(e2) {
          var t3 = e2 && e2.length ? this.write(e2) : "";
          return this.lastNeed ? t3 + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : t3;
        }
        function _(e2) {
          return e2.toString(this.encoding);
        }
        function h(e2) {
          return e2 && e2.length ? this.write(e2) : "";
        }
        var m = e("safe-buffer").Buffer, b = m.isEncoding || function(e2) {
          switch (e2 = "" + e2, e2 && e2.toLowerCase()) {
            case "hex":
            case "utf8":
            case "utf-8":
            case "ascii":
            case "binary":
            case "base64":
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
            case "raw":
              return true;
            default:
              return false;
          }
        };
        n2.StringDecoder = o, o.prototype.write = function(e2) {
          if (0 === e2.length) return "";
          var t3, n3;
          if (this.lastNeed) {
            if (t3 = this.fillLast(e2), void 0 === t3) return "";
            n3 = this.lastNeed, this.lastNeed = 0;
          } else n3 = 0;
          return n3 < e2.length ? t3 ? t3 + this.text(e2, n3) : this.text(e2, n3) : t3 || "";
        }, o.prototype.end = function(e2) {
          var t3 = e2 && e2.length ? this.write(e2) : "";
          return this.lastNeed ? t3 + "\uFFFD" : t3;
        }, o.prototype.text = function(e2, t3) {
          var n3 = s(this, e2, t3);
          if (!this.lastNeed) return e2.toString("utf8", t3);
          this.lastTotal = n3;
          var r3 = e2.length - (n3 - this.lastNeed);
          return e2.copy(this.lastChar, 0, r3), e2.toString("utf8", t3, r3);
        }, o.prototype.fillLast = function(e2) {
          return this.lastNeed <= e2.length ? (e2.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal)) : void (e2.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e2.length), this.lastNeed -= e2.length);
        };
      }, { "safe-buffer": 30 }], 32: [function(e, t2) {
        (function(e2) {
          (function() {
            function n2(t3) {
              try {
                if (!e2.localStorage) return false;
              } catch (e3) {
                return false;
              }
              var n3 = e2.localStorage[t3];
              return null != n3 && "true" === (n3 + "").toLowerCase();
            }
            t2.exports = function(e3, t3) {
              function r2() {
                if (!a) {
                  if (n2("throwDeprecation")) throw new Error(t3);
                  else n2("traceDeprecation") ? console.trace(t3) : console.warn(t3);
                  a = true;
                }
                return e3.apply(this, arguments);
              }
              if (n2("noDeprecation")) return e3;
              var a = false;
              return r2;
            };
          }).call(this);
        }).call(this, "undefined" == typeof global ? "undefined" == typeof self ? "undefined" == typeof window ? {} : window : self : global);
      }, {}], "/": [function(e, t2) {
        function n2(e2) {
          return e2.replace(/a=ice-options:trickle\s\n/g, "");
        }
        function r2(e2) {
          console.warn(e2);
        }
        const a = e("debug")("simple-peer"), o = e("get-browser-rtc"), i = e("randombytes"), d = e("readable-stream"), s = e("queue-microtask"), l = e("err-code"), { Buffer: c } = e("buffer"), u = 65536;
        class p extends d.Duplex {
          constructor(e2) {
            if (e2 = Object.assign({ allowHalfOpen: false }, e2), super(e2), this._id = i(4).toString("hex").slice(0, 7), this._debug("new peer %o", e2), this.channelName = e2.initiator ? e2.channelName || i(20).toString("hex") : null, this.initiator = e2.initiator || false, this.channelConfig = e2.channelConfig || p.channelConfig, this.channelNegotiated = this.channelConfig.negotiated, this.config = Object.assign({}, p.config, e2.config), this.offerOptions = e2.offerOptions || {}, this.answerOptions = e2.answerOptions || {}, this.sdpTransform = e2.sdpTransform || ((e3) => e3), this.streams = e2.streams || (e2.stream ? [e2.stream] : []), this.trickle = void 0 === e2.trickle || e2.trickle, this.allowHalfTrickle = void 0 !== e2.allowHalfTrickle && e2.allowHalfTrickle, this.iceCompleteTimeout = e2.iceCompleteTimeout || 5e3, this.destroyed = false, this.destroying = false, this._connected = false, this.remoteAddress = void 0, this.remoteFamily = void 0, this.remotePort = void 0, this.localAddress = void 0, this.localFamily = void 0, this.localPort = void 0, this._wrtc = e2.wrtc && "object" == typeof e2.wrtc ? e2.wrtc : o(), !this._wrtc) if ("undefined" == typeof window) throw l(new Error("No WebRTC support: Specify `opts.wrtc` option in this environment"), "ERR_WEBRTC_SUPPORT");
            else throw l(new Error("No WebRTC support: Not a supported browser"), "ERR_WEBRTC_SUPPORT");
            this._pcReady = false, this._channelReady = false, this._iceComplete = false, this._iceCompleteTimer = null, this._channel = null, this._pendingCandidates = [], this._isNegotiating = false, this._firstNegotiation = true, this._batchedNegotiation = false, this._queuedNegotiation = false, this._sendersAwaitingStable = [], this._senderMap = /* @__PURE__ */ new Map(), this._closingInterval = null, this._remoteTracks = [], this._remoteStreams = [], this._chunk = null, this._cb = null, this._interval = null;
            try {
              this._pc = new this._wrtc.RTCPeerConnection(this.config);
            } catch (e3) {
              return void this.destroy(l(e3, "ERR_PC_CONSTRUCTOR"));
            }
            this._isReactNativeWebrtc = "number" == typeof this._pc._peerConnectionId, this._pc.oniceconnectionstatechange = () => {
              this._onIceStateChange();
            }, this._pc.onicegatheringstatechange = () => {
              this._onIceStateChange();
            }, this._pc.onconnectionstatechange = () => {
              this._onConnectionStateChange();
            }, this._pc.onsignalingstatechange = () => {
              this._onSignalingStateChange();
            }, this._pc.onicecandidate = (e3) => {
              this._onIceCandidate(e3);
            }, "object" == typeof this._pc.peerIdentity && this._pc.peerIdentity.catch((e3) => {
              this.destroy(l(e3, "ERR_PC_PEER_IDENTITY"));
            }), this.initiator || this.channelNegotiated ? this._setupData({ channel: this._pc.createDataChannel(this.channelName, this.channelConfig) }) : this._pc.ondatachannel = (e3) => {
              this._setupData(e3);
            }, this.streams && this.streams.forEach((e3) => {
              this.addStream(e3);
            }), this._pc.ontrack = (e3) => {
              this._onTrack(e3);
            }, this._debug("initial negotiation"), this._needsNegotiation(), this._onFinishBound = () => {
              this._onFinish();
            }, this.once("finish", this._onFinishBound);
          }
          get bufferSize() {
            return this._channel && this._channel.bufferedAmount || 0;
          }
          get connected() {
            return this._connected && "open" === this._channel.readyState;
          }
          address() {
            return { port: this.localPort, family: this.localFamily, address: this.localAddress };
          }
          signal(e2) {
            if (!this.destroying) {
              if (this.destroyed) throw l(new Error("cannot signal after peer is destroyed"), "ERR_DESTROYED");
              if ("string" == typeof e2) try {
                e2 = JSON.parse(e2);
              } catch (t3) {
                e2 = {};
              }
              this._debug("signal()"), e2.renegotiate && this.initiator && (this._debug("got request to renegotiate"), this._needsNegotiation()), e2.transceiverRequest && this.initiator && (this._debug("got request for transceiver"), this.addTransceiver(e2.transceiverRequest.kind, e2.transceiverRequest.init)), e2.candidate && (this._pc.remoteDescription && this._pc.remoteDescription.type ? this._addIceCandidate(e2.candidate) : this._pendingCandidates.push(e2.candidate)), e2.sdp && this._pc.setRemoteDescription(new this._wrtc.RTCSessionDescription(e2)).then(() => {
                this.destroyed || (this._pendingCandidates.forEach((e3) => {
                  this._addIceCandidate(e3);
                }), this._pendingCandidates = [], "offer" === this._pc.remoteDescription.type && this._createAnswer());
              }).catch((e3) => {
                this.destroy(l(e3, "ERR_SET_REMOTE_DESCRIPTION"));
              }), e2.sdp || e2.candidate || e2.renegotiate || e2.transceiverRequest || this.destroy(l(new Error("signal() called with invalid signal data"), "ERR_SIGNALING"));
            }
          }
          _addIceCandidate(e2) {
            const t3 = new this._wrtc.RTCIceCandidate(e2);
            this._pc.addIceCandidate(t3).catch((e3) => {
              !t3.address || t3.address.endsWith(".local") ? r2("Ignoring unsupported ICE candidate.") : this.destroy(l(e3, "ERR_ADD_ICE_CANDIDATE"));
            });
          }
          send(e2) {
            if (!this.destroying) {
              if (this.destroyed) throw l(new Error("cannot send after peer is destroyed"), "ERR_DESTROYED");
              this._channel.send(e2);
            }
          }
          addTransceiver(e2, t3) {
            if (!this.destroying) {
              if (this.destroyed) throw l(new Error("cannot addTransceiver after peer is destroyed"), "ERR_DESTROYED");
              if (this._debug("addTransceiver()"), this.initiator) try {
                this._pc.addTransceiver(e2, t3), this._needsNegotiation();
              } catch (e3) {
                this.destroy(l(e3, "ERR_ADD_TRANSCEIVER"));
              }
              else this.emit("signal", { type: "transceiverRequest", transceiverRequest: { kind: e2, init: t3 } });
            }
          }
          addStream(e2) {
            if (!this.destroying) {
              if (this.destroyed) throw l(new Error("cannot addStream after peer is destroyed"), "ERR_DESTROYED");
              this._debug("addStream()"), e2.getTracks().forEach((t3) => {
                this.addTrack(t3, e2);
              });
            }
          }
          addTrack(e2, t3) {
            if (this.destroying) return;
            if (this.destroyed) throw l(new Error("cannot addTrack after peer is destroyed"), "ERR_DESTROYED");
            this._debug("addTrack()");
            const n3 = this._senderMap.get(e2) || /* @__PURE__ */ new Map();
            let r3 = n3.get(t3);
            if (!r3) r3 = this._pc.addTrack(e2, t3), n3.set(t3, r3), this._senderMap.set(e2, n3), this._needsNegotiation();
            else if (r3.removed) throw l(new Error("Track has been removed. You should enable/disable tracks that you want to re-add."), "ERR_SENDER_REMOVED");
            else throw l(new Error("Track has already been added to that stream."), "ERR_SENDER_ALREADY_ADDED");
          }
          replaceTrack(e2, t3, n3) {
            if (this.destroying) return;
            if (this.destroyed) throw l(new Error("cannot replaceTrack after peer is destroyed"), "ERR_DESTROYED");
            this._debug("replaceTrack()");
            const r3 = this._senderMap.get(e2), a2 = r3 ? r3.get(n3) : null;
            if (!a2) throw l(new Error("Cannot replace track that was never added."), "ERR_TRACK_NOT_ADDED");
            t3 && this._senderMap.set(t3, r3), null == a2.replaceTrack ? this.destroy(l(new Error("replaceTrack is not supported in this browser"), "ERR_UNSUPPORTED_REPLACETRACK")) : a2.replaceTrack(t3);
          }
          removeTrack(e2, t3) {
            if (this.destroying) return;
            if (this.destroyed) throw l(new Error("cannot removeTrack after peer is destroyed"), "ERR_DESTROYED");
            this._debug("removeSender()");
            const n3 = this._senderMap.get(e2), r3 = n3 ? n3.get(t3) : null;
            if (!r3) throw l(new Error("Cannot remove track that was never added."), "ERR_TRACK_NOT_ADDED");
            try {
              r3.removed = true, this._pc.removeTrack(r3);
            } catch (e3) {
              "NS_ERROR_UNEXPECTED" === e3.name ? this._sendersAwaitingStable.push(r3) : this.destroy(l(e3, "ERR_REMOVE_TRACK"));
            }
            this._needsNegotiation();
          }
          removeStream(e2) {
            if (!this.destroying) {
              if (this.destroyed) throw l(new Error("cannot removeStream after peer is destroyed"), "ERR_DESTROYED");
              this._debug("removeSenders()"), e2.getTracks().forEach((t3) => {
                this.removeTrack(t3, e2);
              });
            }
          }
          _needsNegotiation() {
            this._debug("_needsNegotiation"), this._batchedNegotiation || (this._batchedNegotiation = true, s(() => {
              this._batchedNegotiation = false, this.initiator || !this._firstNegotiation ? (this._debug("starting batched negotiation"), this.negotiate()) : this._debug("non-initiator initial negotiation request discarded"), this._firstNegotiation = false;
            }));
          }
          negotiate() {
            if (!this.destroying) {
              if (this.destroyed) throw l(new Error("cannot negotiate after peer is destroyed"), "ERR_DESTROYED");
              this.initiator ? this._isNegotiating ? (this._queuedNegotiation = true, this._debug("already negotiating, queueing")) : (this._debug("start negotiation"), setTimeout(() => {
                this._createOffer();
              }, 0)) : this._isNegotiating ? (this._queuedNegotiation = true, this._debug("already negotiating, queueing")) : (this._debug("requesting negotiation from initiator"), this.emit("signal", { type: "renegotiate", renegotiate: true })), this._isNegotiating = true;
            }
          }
          destroy(e2) {
            this._destroy(e2, () => {
            });
          }
          _destroy(e2, t3) {
            this.destroyed || this.destroying || (this.destroying = true, this._debug("destroying (error: %s)", e2 && (e2.message || e2)), s(() => {
              if (this.destroyed = true, this.destroying = false, this._debug("destroy (error: %s)", e2 && (e2.message || e2)), this.readable = this.writable = false, this._readableState.ended || this.push(null), this._writableState.finished || this.end(), this._connected = false, this._pcReady = false, this._channelReady = false, this._remoteTracks = null, this._remoteStreams = null, this._senderMap = null, clearInterval(this._closingInterval), this._closingInterval = null, clearInterval(this._interval), this._interval = null, this._chunk = null, this._cb = null, this._onFinishBound && this.removeListener("finish", this._onFinishBound), this._onFinishBound = null, this._channel) {
                try {
                  this._channel.close();
                } catch (e3) {
                }
                this._channel.onmessage = null, this._channel.onopen = null, this._channel.onclose = null, this._channel.onerror = null;
              }
              if (this._pc) {
                try {
                  this._pc.close();
                } catch (e3) {
                }
                this._pc.oniceconnectionstatechange = null, this._pc.onicegatheringstatechange = null, this._pc.onsignalingstatechange = null, this._pc.onicecandidate = null, this._pc.ontrack = null, this._pc.ondatachannel = null;
              }
              this._pc = null, this._channel = null, e2 && this.emit("error", e2), this.emit("close"), t3();
            }));
          }
          _setupData(e2) {
            if (!e2.channel) return this.destroy(l(new Error("Data channel event is missing `channel` property"), "ERR_DATA_CHANNEL"));
            this._channel = e2.channel, this._channel.binaryType = "arraybuffer", "number" == typeof this._channel.bufferedAmountLowThreshold && (this._channel.bufferedAmountLowThreshold = u), this.channelName = this._channel.label, this._channel.onmessage = (e3) => {
              this._onChannelMessage(e3);
            }, this._channel.onbufferedamountlow = () => {
              this._onChannelBufferedAmountLow();
            }, this._channel.onopen = () => {
              this._onChannelOpen();
            }, this._channel.onclose = () => {
              this._onChannelClose();
            }, this._channel.onerror = (e3) => {
              const t4 = e3.error instanceof Error ? e3.error : new Error(`Datachannel error: ${e3.message} ${e3.filename}:${e3.lineno}:${e3.colno}`);
              this.destroy(l(t4, "ERR_DATA_CHANNEL"));
            };
            let t3 = false;
            this._closingInterval = setInterval(() => {
              this._channel && "closing" === this._channel.readyState ? (t3 && this._onChannelClose(), t3 = true) : t3 = false;
            }, 5e3);
          }
          _read() {
          }
          _write(e2, t3, n3) {
            if (this.destroyed) return n3(l(new Error("cannot write after peer is destroyed"), "ERR_DATA_CHANNEL"));
            if (this._connected) {
              try {
                this.send(e2);
              } catch (e3) {
                return this.destroy(l(e3, "ERR_DATA_CHANNEL"));
              }
              this._channel.bufferedAmount > u ? (this._debug("start backpressure: bufferedAmount %d", this._channel.bufferedAmount), this._cb = n3) : n3(null);
            } else this._debug("write before connect"), this._chunk = e2, this._cb = n3;
          }
          _onFinish() {
            if (!this.destroyed) {
              const e2 = () => {
                setTimeout(() => this.destroy(), 1e3);
              };
              this._connected ? e2() : this.once("connect", e2);
            }
          }
          _startIceCompleteTimeout() {
            this.destroyed || this._iceCompleteTimer || (this._debug("started iceComplete timeout"), this._iceCompleteTimer = setTimeout(() => {
              this._iceComplete || (this._iceComplete = true, this._debug("iceComplete timeout completed"), this.emit("iceTimeout"), this.emit("_iceComplete"));
            }, this.iceCompleteTimeout));
          }
          _createOffer() {
            this.destroyed || this._pc.createOffer(this.offerOptions).then((e2) => {
              if (this.destroyed) return;
              this.trickle || this.allowHalfTrickle || (e2.sdp = n2(e2.sdp)), e2.sdp = this.sdpTransform(e2.sdp);
              const t3 = () => {
                if (!this.destroyed) {
                  const t4 = this._pc.localDescription || e2;
                  this._debug("signal"), this.emit("signal", { type: t4.type, sdp: t4.sdp });
                }
              };
              this._pc.setLocalDescription(e2).then(() => {
                this._debug("createOffer success"), this.destroyed || (this.trickle || this._iceComplete ? t3() : this.once("_iceComplete", t3));
              }).catch((e3) => {
                this.destroy(l(e3, "ERR_SET_LOCAL_DESCRIPTION"));
              });
            }).catch((e2) => {
              this.destroy(l(e2, "ERR_CREATE_OFFER"));
            });
          }
          _requestMissingTransceivers() {
            this._pc.getTransceivers && this._pc.getTransceivers().forEach((e2) => {
              e2.mid || !e2.sender.track || e2.requested || (e2.requested = true, this.addTransceiver(e2.sender.track.kind));
            });
          }
          _createAnswer() {
            this.destroyed || this._pc.createAnswer(this.answerOptions).then((e2) => {
              if (this.destroyed) return;
              this.trickle || this.allowHalfTrickle || (e2.sdp = n2(e2.sdp)), e2.sdp = this.sdpTransform(e2.sdp);
              const t3 = () => {
                if (!this.destroyed) {
                  const t4 = this._pc.localDescription || e2;
                  this._debug("signal"), this.emit("signal", { type: t4.type, sdp: t4.sdp }), this.initiator || this._requestMissingTransceivers();
                }
              };
              this._pc.setLocalDescription(e2).then(() => {
                this.destroyed || (this.trickle || this._iceComplete ? t3() : this.once("_iceComplete", t3));
              }).catch((e3) => {
                this.destroy(l(e3, "ERR_SET_LOCAL_DESCRIPTION"));
              });
            }).catch((e2) => {
              this.destroy(l(e2, "ERR_CREATE_ANSWER"));
            });
          }
          _onConnectionStateChange() {
            this.destroyed || "failed" === this._pc.connectionState && this.destroy(l(new Error("Connection failed."), "ERR_CONNECTION_FAILURE"));
          }
          _onIceStateChange() {
            if (this.destroyed) return;
            const e2 = this._pc.iceConnectionState, t3 = this._pc.iceGatheringState;
            this._debug("iceStateChange (connection: %s) (gathering: %s)", e2, t3), this.emit("iceStateChange", e2, t3), ("connected" === e2 || "completed" === e2) && (this._pcReady = true, this._maybeReady()), "failed" === e2 && this.destroy(l(new Error("Ice connection failed."), "ERR_ICE_CONNECTION_FAILURE")), "closed" === e2 && this.destroy(l(new Error("Ice connection closed."), "ERR_ICE_CONNECTION_CLOSED"));
          }
          getStats(e2) {
            const t3 = (e3) => ("[object Array]" === Object.prototype.toString.call(e3.values) && e3.values.forEach((t4) => {
              Object.assign(e3, t4);
            }), e3);
            0 === this._pc.getStats.length || this._isReactNativeWebrtc ? this._pc.getStats().then((n3) => {
              const r3 = [];
              n3.forEach((e3) => {
                r3.push(t3(e3));
              }), e2(null, r3);
            }, (t4) => e2(t4)) : 0 < this._pc.getStats.length ? this._pc.getStats((n3) => {
              if (this.destroyed) return;
              const r3 = [];
              n3.result().forEach((e3) => {
                const n4 = {};
                e3.names().forEach((t4) => {
                  n4[t4] = e3.stat(t4);
                }), n4.id = e3.id, n4.type = e3.type, n4.timestamp = e3.timestamp, r3.push(t3(n4));
              }), e2(null, r3);
            }, (t4) => e2(t4)) : e2(null, []);
          }
          _maybeReady() {
            if (this._debug("maybeReady pc %s channel %s", this._pcReady, this._channelReady), this._connected || this._connecting || !this._pcReady || !this._channelReady) return;
            this._connecting = true;
            const e2 = () => {
              this.destroyed || this.getStats((t3, n3) => {
                if (this.destroyed) return;
                t3 && (n3 = []);
                const r3 = {}, a2 = {}, o2 = {};
                let i2 = false;
                n3.forEach((e3) => {
                  ("remotecandidate" === e3.type || "remote-candidate" === e3.type) && (r3[e3.id] = e3), ("localcandidate" === e3.type || "local-candidate" === e3.type) && (a2[e3.id] = e3), ("candidatepair" === e3.type || "candidate-pair" === e3.type) && (o2[e3.id] = e3);
                });
                const d2 = (e3) => {
                  i2 = true;
                  let t4 = a2[e3.localCandidateId];
                  t4 && (t4.ip || t4.address) ? (this.localAddress = t4.ip || t4.address, this.localPort = +t4.port) : t4 && t4.ipAddress ? (this.localAddress = t4.ipAddress, this.localPort = +t4.portNumber) : "string" == typeof e3.googLocalAddress && (t4 = e3.googLocalAddress.split(":"), this.localAddress = t4[0], this.localPort = +t4[1]), this.localAddress && (this.localFamily = this.localAddress.includes(":") ? "IPv6" : "IPv4");
                  let n4 = r3[e3.remoteCandidateId];
                  n4 && (n4.ip || n4.address) ? (this.remoteAddress = n4.ip || n4.address, this.remotePort = +n4.port) : n4 && n4.ipAddress ? (this.remoteAddress = n4.ipAddress, this.remotePort = +n4.portNumber) : "string" == typeof e3.googRemoteAddress && (n4 = e3.googRemoteAddress.split(":"), this.remoteAddress = n4[0], this.remotePort = +n4[1]), this.remoteAddress && (this.remoteFamily = this.remoteAddress.includes(":") ? "IPv6" : "IPv4"), this._debug("connect local: %s:%s remote: %s:%s", this.localAddress, this.localPort, this.remoteAddress, this.remotePort);
                };
                if (n3.forEach((e3) => {
                  "transport" === e3.type && e3.selectedCandidatePairId && d2(o2[e3.selectedCandidatePairId]), ("googCandidatePair" === e3.type && "true" === e3.googActiveConnection || ("candidatepair" === e3.type || "candidate-pair" === e3.type) && e3.selected) && d2(e3);
                }), !i2 && (!Object.keys(o2).length || Object.keys(a2).length)) return void setTimeout(e2, 100);
                if (this._connecting = false, this._connected = true, this._chunk) {
                  try {
                    this.send(this._chunk);
                  } catch (e4) {
                    return this.destroy(l(e4, "ERR_DATA_CHANNEL"));
                  }
                  this._chunk = null, this._debug('sent chunk from "write before connect"');
                  const e3 = this._cb;
                  this._cb = null, e3(null);
                }
                "number" != typeof this._channel.bufferedAmountLowThreshold && (this._interval = setInterval(() => this._onInterval(), 150), this._interval.unref && this._interval.unref()), this._debug("connect"), this.emit("connect");
              });
            };
            e2();
          }
          _onInterval() {
            this._cb && this._channel && !(this._channel.bufferedAmount > u) && this._onChannelBufferedAmountLow();
          }
          _onSignalingStateChange() {
            this.destroyed || ("stable" === this._pc.signalingState && (this._isNegotiating = false, this._debug("flushing sender queue", this._sendersAwaitingStable), this._sendersAwaitingStable.forEach((e2) => {
              this._pc.removeTrack(e2), this._queuedNegotiation = true;
            }), this._sendersAwaitingStable = [], this._queuedNegotiation ? (this._debug("flushing negotiation queue"), this._queuedNegotiation = false, this._needsNegotiation()) : (this._debug("negotiated"), this.emit("negotiated"))), this._debug("signalingStateChange %s", this._pc.signalingState), this.emit("signalingStateChange", this._pc.signalingState));
          }
          _onIceCandidate(e2) {
            this.destroyed || (e2.candidate && this.trickle ? this.emit("signal", { type: "candidate", candidate: { candidate: e2.candidate.candidate, sdpMLineIndex: e2.candidate.sdpMLineIndex, sdpMid: e2.candidate.sdpMid } }) : !e2.candidate && !this._iceComplete && (this._iceComplete = true, this.emit("_iceComplete")), e2.candidate && this._startIceCompleteTimeout());
          }
          _onChannelMessage(e2) {
            if (this.destroyed) return;
            let t3 = e2.data;
            t3 instanceof ArrayBuffer && (t3 = c.from(t3)), this.push(t3);
          }
          _onChannelBufferedAmountLow() {
            if (!this.destroyed && this._cb) {
              this._debug("ending backpressure: bufferedAmount %d", this._channel.bufferedAmount);
              const e2 = this._cb;
              this._cb = null, e2(null);
            }
          }
          _onChannelOpen() {
            this._connected || this.destroyed || (this._debug("on channel open"), this._channelReady = true, this._maybeReady());
          }
          _onChannelClose() {
            this.destroyed || (this._debug("on channel close"), this.destroy());
          }
          _onTrack(e2) {
            this.destroyed || e2.streams.forEach((t3) => {
              this._debug("on track"), this.emit("track", e2.track, t3), this._remoteTracks.push({ track: e2.track, stream: t3 }), this._remoteStreams.some((e3) => e3.id === t3.id) || (this._remoteStreams.push(t3), s(() => {
                this._debug("on stream"), this.emit("stream", t3);
              }));
            });
          }
          _debug() {
            const e2 = [].slice.call(arguments);
            e2[0] = "[" + this._id + "] " + e2[0], a.apply(null, e2);
          }
        }
        p.WEBRTC_SUPPORT = !!o(), p.config = { iceServers: [{ urls: ["stun:stun.l.google.com:19302", "stun:global.stun.twilio.com:3478"] }], sdpSemantics: "unified-plan" }, p.channelConfig = {}, t2.exports = p;
      }, { buffer: 3, debug: 4, "err-code": 6, "get-browser-rtc": 8, "queue-microtask": 13, randombytes: 14, "readable-stream": 29 }] }, {}, [])("/");
    });
  }
});

// node_modules/@babel/runtime/helpers/esm/typeof.js
function _typeof(o) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof(o);
}

// node_modules/@babel/runtime/helpers/esm/toPrimitive.js
function toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}

// node_modules/@babel/runtime/helpers/esm/toPropertyKey.js
function toPropertyKey(t) {
  var i = toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}

// node_modules/@babel/runtime/helpers/esm/createClass.js
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: false
  }), e;
}

// node_modules/rxdb/dist/esm/plugins/utils/utils-array.js
function lastOfArray(ar) {
  return ar[ar.length - 1];
}
function toArray(input) {
  return Array.isArray(input) ? input.slice(0) : [input];
}
function batchArray(array, batchSize) {
  array = array.slice(0);
  var ret = [];
  while (array.length) {
    var batch = array.splice(0, batchSize);
    ret.push(batch);
  }
  return ret;
}
function isMaybeReadonlyArray(x) {
  return Array.isArray(x);
}
function arrayFilterNotEmpty(value) {
  if (value === null || value === void 0) {
    return false;
  }
  return true;
}
function countUntilNotMatching(ar, matchingFn) {
  var count = 0;
  var idx = -1;
  for (var item of ar) {
    idx = idx + 1;
    var matching = matchingFn(item, idx);
    if (matching) {
      count = count + 1;
    } else {
      break;
    }
  }
  return count;
}
function appendToArray(ar, add3) {
  var addSize = add3.length;
  if (addSize === 0) {
    return;
  }
  var baseSize = ar.length;
  ar.length = baseSize + add3.length;
  for (var i = 0; i < addSize; ++i) {
    ar[baseSize + i] = add3[i];
  }
}
function uniqueArray(arrArg) {
  return arrArg.filter(function(elem, pos, arr) {
    return arr.indexOf(elem) === pos;
  });
}

// node_modules/rxdb/dist/esm/plugins/utils/utils-revision.js
function getHeightOfRevision(revision) {
  var useChars = "";
  for (var index = 0; index < revision.length; index++) {
    var char = revision[index];
    if (char === "-") {
      return parseInt(useChars, 10);
    }
    useChars += char;
  }
  throw new Error("malformatted revision: " + revision);
}
function createRevision(databaseInstanceToken, previousDocData) {
  var newRevisionHeight = !previousDocData ? 1 : getHeightOfRevision(previousDocData._rev) + 1;
  return newRevisionHeight + "-" + databaseInstanceToken;
}

// node_modules/rxdb/dist/esm/plugins/utils/utils-object.js
function deepFreeze(o) {
  Object.freeze(o);
  Object.getOwnPropertyNames(o).forEach(function(prop) {
    if (Object.prototype.hasOwnProperty.call(o, prop) && o[prop] !== null && (typeof o[prop] === "object" || typeof o[prop] === "function") && !Object.isFrozen(o[prop])) {
      deepFreeze(o[prop]);
    }
  });
  return o;
}
function objectPathMonad(objectPath) {
  var split = objectPath.split(".");
  var splitLength = split.length;
  if (splitLength === 1) {
    return (obj) => obj[objectPath];
  }
  return (obj) => {
    var currentVal = obj;
    for (var i = 0; i < splitLength; ++i) {
      var subPath = split[i];
      currentVal = currentVal[subPath];
      if (typeof currentVal === "undefined") {
        return currentVal;
      }
    }
    return currentVal;
  };
}
function flattenObject(ob) {
  var toReturn = {};
  for (var i in ob) {
    if (!Object.prototype.hasOwnProperty.call(ob, i)) continue;
    if (typeof ob[i] === "object") {
      var flatObject = flattenObject(ob[i]);
      for (var x in flatObject) {
        if (!Object.prototype.hasOwnProperty.call(flatObject, x)) continue;
        toReturn[i + "." + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
}
function flatClone(obj) {
  return Object.assign({}, obj);
}
function firstPropertyNameOfObject(obj) {
  return Object.keys(obj)[0];
}
function sortObject(obj, noArraySort = false) {
  if (!obj) return obj;
  if (!noArraySort && Array.isArray(obj)) {
    return obj.sort((a, b) => {
      if (typeof a === "string" && typeof b === "string") return a.localeCompare(b);
      if (typeof a === "object") return 1;
      else return -1;
    }).map((i) => sortObject(i, noArraySort));
  }
  if (typeof obj === "object" && !Array.isArray(obj)) {
    var out = {};
    Object.keys(obj).sort((a, b) => a.localeCompare(b)).forEach((key) => {
      out[key] = sortObject(obj[key], noArraySort);
    });
    return out;
  }
  return obj;
}
function deepClone(src) {
  if (!src) {
    return src;
  }
  if (src === null || typeof src !== "object") {
    return src;
  }
  if (Array.isArray(src)) {
    var ret = new Array(src.length);
    var i = ret.length;
    while (i--) {
      ret[i] = deepClone(src[i]);
    }
    return ret;
  }
  var dest = {};
  for (var key in src) {
    dest[key] = deepClone(src[key]);
  }
  return dest;
}
var clone = deepClone;
function overwriteGetterForCaching(obj, getterName, value) {
  Object.defineProperty(obj, getterName, {
    get: function() {
      return value;
    }
  });
  return value;
}
function findUndefinedPath(obj, parentPath = "") {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }
  for (var key of Object.keys(obj)) {
    var value = obj[key];
    var currentPath = parentPath ? parentPath + "." + key : key;
    if (typeof value === "undefined") {
      return currentPath;
    }
    if (typeof value === "object" && value !== null) {
      var result = findUndefinedPath(value, currentPath);
      if (result) {
        return result;
      }
    }
  }
  return false;
}

// node_modules/rxdb/dist/esm/plugins/utils/utils-document.js
var RX_META_LWT_MINIMUM = 1;
function getDefaultRxDocumentMeta() {
  return {
    /**
     * Set this to 1 to not waste performance
     * while calling new Date()..
     * The storage wrappers will anyway update
     * the lastWrite time while calling transformDocumentDataFromRxDBToRxStorage()
     */
    lwt: RX_META_LWT_MINIMUM
  };
}
function getDefaultRevision() {
  return "";
}
function stripMetaDataFromDocument(docData) {
  return Object.assign({}, docData, {
    _meta: void 0,
    _deleted: void 0,
    _rev: void 0
  });
}
function areRxDocumentArraysEqual(primaryPath, ar1, ar2) {
  if (ar1.length !== ar2.length) {
    return false;
  }
  var i = 0;
  var len = ar1.length;
  while (i < len) {
    var row1 = ar1[i];
    var row2 = ar2[i];
    i++;
    if (row1._rev !== row2._rev || row1[primaryPath] !== row2[primaryPath]) {
      return false;
    }
  }
  return true;
}

// node_modules/rxdb/dist/esm/plugins/utils/utils-hash.js
async function nativeSha256(input) {
  var data = new TextEncoder().encode(input);
  var hashBuffer = await crypto.subtle.digest("SHA-256", data);
  var hash = Array.prototype.map.call(new Uint8Array(hashBuffer), (x) => ("00" + x.toString(16)).slice(-2)).join("");
  return hash;
}
var defaultHashSha256 = nativeSha256;
function hashStringToNumber(str) {
  var nr = 0;
  var len = str.length;
  for (var i = 0; i < len; i++) {
    nr = nr + str.charCodeAt(i);
    nr |= 0;
  }
  return nr;
}

// node_modules/rxdb/dist/esm/plugins/utils/utils-promise.js
function nextTick() {
  return new Promise((res) => setTimeout(res, 0));
}
function promiseWait(ms = 0) {
  return new Promise((res) => setTimeout(res, ms));
}
function toPromise(maybePromise) {
  if (maybePromise && typeof maybePromise.then === "function") {
    return maybePromise;
  } else {
    return Promise.resolve(maybePromise);
  }
}
var PROMISE_RESOLVE_TRUE = Promise.resolve(true);
var PROMISE_RESOLVE_FALSE = Promise.resolve(false);
var PROMISE_RESOLVE_NULL = Promise.resolve(null);
var PROMISE_RESOLVE_VOID = Promise.resolve();
function requestIdlePromiseNoQueue(timeout = 1e4) {
  if (typeof requestIdleCallback === "function") {
    return new Promise((res) => {
      requestIdleCallback(() => res(), {
        timeout
      });
    });
  } else {
    return promiseWait(0);
  }
}
var idlePromiseQueue = PROMISE_RESOLVE_VOID;
function requestIdlePromise(timeout = void 0) {
  idlePromiseQueue = idlePromiseQueue.then(() => {
    return requestIdlePromiseNoQueue(timeout);
  });
  return idlePromiseQueue;
}
function promiseSeries(tasks, initial) {
  return tasks.reduce((current, next) => current.then(next), Promise.resolve(initial));
}

// node_modules/rxdb/dist/esm/plugins/utils/utils-regex.js
var REGEX_ALL_DOTS = /\./g;

// node_modules/rxdb/dist/esm/plugins/utils/utils-string.js
var COUCH_NAME_CHARS = "abcdefghijklmnopqrstuvwxyz";
function randomToken(length = 10) {
  var text = "";
  for (var i = 0; i < length; i++) {
    text += COUCH_NAME_CHARS.charAt(Math.floor(Math.random() * COUCH_NAME_CHARS.length));
  }
  return text;
}
function ucfirst(str) {
  str += "";
  var f = str.charAt(0).toUpperCase();
  return f + str.substr(1);
}
function trimDots(str) {
  while (str.charAt(0) === ".") {
    str = str.substr(1);
  }
  while (str.slice(-1) === ".") {
    str = str.slice(0, -1);
  }
  return str;
}
function isFolderPath(name) {
  if (name.includes("/") || // unix
  name.includes("\\")) {
    return true;
  } else {
    return false;
  }
}

// node_modules/rxdb/dist/esm/plugins/utils/utils-object-deep-equal.js
function deepEqual(a, b) {
  if (a === b) return true;
  if (a && b && typeof a == "object" && typeof b == "object") {
    if (a.constructor !== b.constructor) return false;
    var length;
    var i;
    if (Array.isArray(a)) {
      length = a.length;
      if (length !== b.length) return false;
      for (i = length; i-- !== 0; ) if (!deepEqual(a[i], b[i])) return false;
      return true;
    }
    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
    var keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;
    for (i = length; i-- !== 0; ) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
    for (i = length; i-- !== 0; ) {
      var key = keys[i];
      if (!deepEqual(a[key], b[key])) return false;
    }
    return true;
  }
  return a !== a && b !== b;
}

// node_modules/rxdb/dist/esm/plugins/utils/utils-object-dot-prop.js
var isObject = (value) => {
  var type5 = typeof value;
  return value !== null && (type5 === "object" || type5 === "function");
};
var disallowedKeys = /* @__PURE__ */ new Set(["__proto__", "prototype", "constructor"]);
var digits = new Set("0123456789");
function getPathSegments(path) {
  var parts = [];
  var currentSegment = "";
  var currentPart = "start";
  var isIgnoring = false;
  for (var character of path) {
    switch (character) {
      case "\\": {
        if (currentPart === "index") {
          throw new Error("Invalid character in an index");
        }
        if (currentPart === "indexEnd") {
          throw new Error("Invalid character after an index");
        }
        if (isIgnoring) {
          currentSegment += character;
        }
        currentPart = "property";
        isIgnoring = !isIgnoring;
        break;
      }
      case ".": {
        if (currentPart === "index") {
          throw new Error("Invalid character in an index");
        }
        if (currentPart === "indexEnd") {
          currentPart = "property";
          break;
        }
        if (isIgnoring) {
          isIgnoring = false;
          currentSegment += character;
          break;
        }
        if (disallowedKeys.has(currentSegment)) {
          return [];
        }
        parts.push(currentSegment);
        currentSegment = "";
        currentPart = "property";
        break;
      }
      case "[": {
        if (currentPart === "index") {
          throw new Error("Invalid character in an index");
        }
        if (currentPart === "indexEnd") {
          currentPart = "index";
          break;
        }
        if (isIgnoring) {
          isIgnoring = false;
          currentSegment += character;
          break;
        }
        if (currentPart === "property") {
          if (disallowedKeys.has(currentSegment)) {
            return [];
          }
          parts.push(currentSegment);
          currentSegment = "";
        }
        currentPart = "index";
        break;
      }
      case "]": {
        if (currentPart === "index") {
          parts.push(Number.parseInt(currentSegment, 10));
          currentSegment = "";
          currentPart = "indexEnd";
          break;
        }
        if (currentPart === "indexEnd") {
          throw new Error("Invalid character after an index");
        }
      }
      default: {
        if (currentPart === "index" && !digits.has(character)) {
          throw new Error("Invalid character in an index");
        }
        if (currentPart === "indexEnd") {
          throw new Error("Invalid character after an index");
        }
        if (currentPart === "start") {
          currentPart = "property";
        }
        if (isIgnoring) {
          isIgnoring = false;
          currentSegment += "\\";
        }
        currentSegment += character;
      }
    }
  }
  if (isIgnoring) {
    currentSegment += "\\";
  }
  switch (currentPart) {
    case "property": {
      if (disallowedKeys.has(currentSegment)) {
        return [];
      }
      parts.push(currentSegment);
      break;
    }
    case "index": {
      throw new Error("Index was not closed");
    }
    case "start": {
      parts.push("");
      break;
    }
  }
  return parts;
}
function isStringIndex(object, key) {
  if (typeof key !== "number" && Array.isArray(object)) {
    var index = Number.parseInt(key, 10);
    return Number.isInteger(index) && object[index] === object[key];
  }
  return false;
}
function assertNotStringIndex(object, key) {
  if (isStringIndex(object, key)) {
    throw new Error("Cannot use string index");
  }
}
function getProperty(object, path, value) {
  if (Array.isArray(path)) {
    path = path.join(".");
  }
  if (!path.includes(".") && !path.includes("[")) {
    return object[path];
  }
  if (!isObject(object) || typeof path !== "string") {
    return value === void 0 ? object : value;
  }
  var pathArray = getPathSegments(path);
  if (pathArray.length === 0) {
    return value;
  }
  for (var index = 0; index < pathArray.length; index++) {
    var key = pathArray[index];
    if (isStringIndex(object, key)) {
      object = index === pathArray.length - 1 ? void 0 : null;
    } else {
      object = object[key];
    }
    if (object === void 0 || object === null) {
      if (index !== pathArray.length - 1) {
        return value;
      }
      break;
    }
  }
  return object === void 0 ? value : object;
}
function setProperty(object, path, value) {
  if (Array.isArray(path)) {
    path = path.join(".");
  }
  if (!isObject(object) || typeof path !== "string") {
    return object;
  }
  var root = object;
  var pathArray = getPathSegments(path);
  for (var index = 0; index < pathArray.length; index++) {
    var key = pathArray[index];
    assertNotStringIndex(object, key);
    if (index === pathArray.length - 1) {
      object[key] = value;
    } else if (!isObject(object[key])) {
      object[key] = typeof pathArray[index + 1] === "number" ? [] : {};
    }
    object = object[key];
  }
  return root;
}

// node_modules/rxdb/dist/esm/plugins/utils/utils-map.js
function getFromMapOrThrow(map2, key) {
  var val = map2.get(key);
  if (typeof val === "undefined") {
    throw new Error("missing value from map " + key);
  }
  return val;
}
function getFromMapOrCreate(map2, index, creator, ifWasThere) {
  var value = map2.get(index);
  if (typeof value === "undefined") {
    value = creator();
    map2.set(index, value);
  } else if (ifWasThere) {
    ifWasThere(value);
  }
  return value;
}

// node_modules/rxdb/dist/esm/plugins/utils/utils-error.js
function pluginMissing(pluginKey) {
  var keyParts = pluginKey.split("-");
  var pluginName = "RxDB";
  keyParts.forEach((part) => {
    pluginName += ucfirst(part);
  });
  pluginName += "Plugin";
  return new Error("You are using a function which must be overwritten by a plugin.\n        You should either prevent the usage of this function or add the plugin via:\n            import { " + pluginName + " } from 'rxdb/plugins/" + pluginKey + "';\n            addRxPlugin(" + pluginName + ");\n        ");
}
function errorToPlainJson(err) {
  var ret = {
    name: err.name,
    message: err.message,
    rxdb: err.rxdb,
    parameters: err.parameters,
    extensions: err.extensions,
    code: err.code,
    url: err.url,
    /**
     * stack must be last to make it easier to read the json in a console.
     * Also we ensure that each linebreak is spaced so that the chrome devtools
     * shows urls to the source code that can be clicked to inspect
     * the correct place in the code.
     */
    stack: !err.stack ? void 0 : err.stack.replace(/\n/g, " \n ")
  };
  return ret;
}

// node_modules/rxdb/dist/esm/plugins/utils/utils-time.js
var _lastNow = 0;
function now() {
  var ret = Date.now();
  ret = ret + 0.01;
  if (ret <= _lastNow) {
    ret = _lastNow + 0.01;
  }
  var twoDecimals = parseFloat(ret.toFixed(2));
  _lastNow = twoDecimals;
  return twoDecimals;
}

// node_modules/rxdb/dist/esm/plugins/utils/utils-other.js
function ensureNotFalsy(obj, message) {
  if (!obj) {
    if (!message) {
      message = "";
    }
    throw new Error("ensureNotFalsy() is falsy: " + message);
  }
  return obj;
}
var RXJS_SHARE_REPLAY_DEFAULTS = {
  bufferSize: 1,
  refCount: true
};

// node_modules/rxdb/dist/esm/plugins/utils/utils-rxdb-version.js
var RXDB_VERSION = "16.8.1";

// node_modules/rxdb/dist/esm/plugins/utils/utils-global.js
var RXDB_UTILS_GLOBAL = {};

// node_modules/rxdb/dist/esm/plugins/utils/utils-premium.js
var PREMIUM_FLAG_HASH = "6da4936d1425ff3a5c44c02342c6daf791d266be3ae8479b8ec59e261df41b93";
var NON_PREMIUM_COLLECTION_LIMIT = 16;
var hasPremiumPromise = PROMISE_RESOLVE_FALSE;
var premiumChecked = false;
async function hasPremiumFlag() {
  if (premiumChecked) {
    return hasPremiumPromise;
  }
  premiumChecked = true;
  hasPremiumPromise = (async () => {
    if (RXDB_UTILS_GLOBAL.premium && typeof RXDB_UTILS_GLOBAL.premium === "string" && await defaultHashSha256(RXDB_UTILS_GLOBAL.premium) === PREMIUM_FLAG_HASH) {
      return true;
    } else {
      return false;
    }
  })();
  return hasPremiumPromise;
}

// node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t2, e2) {
    return t2.__proto__ = e2, t2;
  }, _setPrototypeOf(t, e);
}

// node_modules/@babel/runtime/helpers/esm/inheritsLoose.js
function _inheritsLoose(t, o) {
  t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o);
}

// node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js
function _getPrototypeOf(t) {
  return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t2) {
    return t2.__proto__ || Object.getPrototypeOf(t2);
  }, _getPrototypeOf(t);
}

// node_modules/@babel/runtime/helpers/esm/isNativeFunction.js
function _isNativeFunction(t) {
  try {
    return -1 !== Function.toString.call(t).indexOf("[native code]");
  } catch (n) {
    return "function" == typeof t;
  }
}

// node_modules/@babel/runtime/helpers/esm/isNativeReflectConstruct.js
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch (t2) {
  }
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct2() {
    return !!t;
  })();
}

// node_modules/@babel/runtime/helpers/esm/construct.js
function _construct(t, e, r) {
  if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments);
  var o = [null];
  o.push.apply(o, e);
  var p = new (t.bind.apply(t, o))();
  return r && _setPrototypeOf(p, r.prototype), p;
}

// node_modules/@babel/runtime/helpers/esm/wrapNativeSuper.js
function _wrapNativeSuper(t) {
  var r = "function" == typeof Map ? /* @__PURE__ */ new Map() : void 0;
  return _wrapNativeSuper = function _wrapNativeSuper2(t2) {
    if (null === t2 || !_isNativeFunction(t2)) return t2;
    if ("function" != typeof t2) throw new TypeError("Super expression must either be null or a function");
    if (void 0 !== r) {
      if (r.has(t2)) return r.get(t2);
      r.set(t2, Wrapper);
    }
    function Wrapper() {
      return _construct(t2, arguments, _getPrototypeOf(this).constructor);
    }
    return Wrapper.prototype = Object.create(t2.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    }), _setPrototypeOf(Wrapper, t2);
  }, _wrapNativeSuper(t);
}

// node_modules/rxdb/dist/esm/overwritable.js
var overwritable = {
  /**
   * if this method is overwritten with one
   * that returns true, we do additional checks
   * which help the developer but have bad performance
   */
  isDevMode() {
    return false;
  },
  /**
   * Deep freezes and object when in dev-mode.
   * Deep-Freezing has the same performance as deep-cloning, so we only do that in dev-mode.
   * Also, we can ensure the readonly state via typescript
   * @link https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
   */
  deepFreezeWhenDevMode(obj) {
    return obj;
  },
  /**
   * overwritten to map error-codes to text-messages
   */
  tunnelErrorMessage(message) {
    return "\n        RxDB Error-Code: " + message + ".\n        Hint: Error messages are not included in RxDB core to reduce build size.\n        To show the full error messages and to ensure that you do not make any mistakes when using RxDB,\n        use the dev-mode plugin when you are in development mode: https://rxdb.info/dev-mode.html?console=error\n        ";
  }
};

// node_modules/rxdb/dist/esm/rx-error.js
function parametersToString(parameters) {
  var ret = "";
  if (Object.keys(parameters).length === 0) return ret;
  ret += "-".repeat(20) + "\n";
  ret += "Parameters:\n";
  ret += Object.keys(parameters).map((k) => {
    var paramStr = "[object Object]";
    try {
      if (k === "errors") {
        paramStr = parameters[k].map((err) => JSON.stringify(err, Object.getOwnPropertyNames(err)));
      } else {
        paramStr = JSON.stringify(parameters[k], function(_k, v) {
          return v === void 0 ? null : v;
        }, 2);
      }
    } catch (e) {
    }
    return k + ": " + paramStr;
  }).join("\n");
  ret += "\n";
  return ret;
}
function messageForError(message, code, parameters) {
  return "\n" + message + "\n" + parametersToString(parameters);
}
var RxError = /* @__PURE__ */ function(_Error) {
  function RxError2(code, message, parameters = {}) {
    var _this;
    var mes = messageForError(message, code, parameters);
    _this = _Error.call(this, mes) || this;
    _this.code = code;
    _this.message = mes;
    _this.url = getErrorUrl(code);
    _this.parameters = parameters;
    _this.rxdb = true;
    return _this;
  }
  _inheritsLoose(RxError2, _Error);
  var _proto = RxError2.prototype;
  _proto.toString = function toString() {
    return this.message;
  };
  return _createClass(RxError2, [{
    key: "name",
    get: function() {
      return "RxError (" + this.code + ")";
    }
  }, {
    key: "typeError",
    get: function() {
      return false;
    }
  }]);
}(/* @__PURE__ */ _wrapNativeSuper(Error));
var RxTypeError = /* @__PURE__ */ function(_TypeError) {
  function RxTypeError2(code, message, parameters = {}) {
    var _this2;
    var mes = messageForError(message, code, parameters);
    _this2 = _TypeError.call(this, mes) || this;
    _this2.code = code;
    _this2.message = mes;
    _this2.url = getErrorUrl(code);
    _this2.parameters = parameters;
    _this2.rxdb = true;
    return _this2;
  }
  _inheritsLoose(RxTypeError2, _TypeError);
  var _proto2 = RxTypeError2.prototype;
  _proto2.toString = function toString() {
    return this.message;
  };
  return _createClass(RxTypeError2, [{
    key: "name",
    get: function() {
      return "RxTypeError (" + this.code + ")";
    }
  }, {
    key: "typeError",
    get: function() {
      return true;
    }
  }]);
}(/* @__PURE__ */ _wrapNativeSuper(TypeError));
function getErrorUrl(code) {
  return "https://rxdb.info/errors.html?console=errors#" + code;
}
function errorUrlHint(code) {
  return "\nFind out more about this error here: " + getErrorUrl(code) + " \n";
}
function newRxError(code, parameters) {
  return new RxError(code, overwritable.tunnelErrorMessage(code) + errorUrlHint(code), parameters);
}
function newRxTypeError(code, parameters) {
  return new RxTypeError(code, overwritable.tunnelErrorMessage(code) + errorUrlHint(code), parameters);
}
function isBulkWriteConflictError(err) {
  if (err && err.status === 409) {
    return err;
  } else {
    return false;
  }
}
var STORAGE_WRITE_ERROR_CODE_TO_MESSAGE = {
  409: "document write conflict",
  422: "schema validation error",
  510: "attachment data missing"
};
function rxStorageWriteErrorToRxError(err) {
  return newRxError("COL20", {
    name: STORAGE_WRITE_ERROR_CODE_TO_MESSAGE[err.status],
    document: err.documentId,
    writeError: err
  });
}

// node_modules/rxdb/dist/esm/hooks.js
var HOOKS = {
  /**
   * Runs before a plugin is added.
   * Use this to block the usage of non-compatible plugins.
   */
  preAddRxPlugin: [],
  /**
   * functions that run before the database is created
   */
  preCreateRxDatabase: [],
  /**
   * runs after the database is created and prepared
   * but before the instance is returned to the user
   * @async
   */
  createRxDatabase: [],
  preCreateRxCollection: [],
  createRxCollection: [],
  createRxState: [],
  /**
  * runs at the end of the close-process of a collection
  * @async
  */
  postCloseRxCollection: [],
  /**
   * Runs after a collection is removed.
   * @async
   */
  postRemoveRxCollection: [],
  /**
    * functions that get the json-schema as input
    * to do additionally checks/manipulation
    */
  preCreateRxSchema: [],
  /**
   * functions that run after the RxSchema is created
   * gets RxSchema as attribute
   */
  createRxSchema: [],
  prePrepareRxQuery: [],
  preCreateRxQuery: [],
  /**
   * Runs before a query is send to the
   * prepareQuery function of the storage engine.
   */
  prePrepareQuery: [],
  createRxDocument: [],
  /**
   * runs after a RxDocument is created,
   * cannot be async
   */
  postCreateRxDocument: [],
  /**
   * Runs before a RxStorageInstance is created
   * gets the params of createStorageInstance()
   * as attribute so you can manipulate them.
   * Notice that you have to clone stuff before mutating the inputs.
   */
  preCreateRxStorageInstance: [],
  preStorageWrite: [],
  /**
   * runs on the document-data before the document is migrated
   * {
   *   doc: Object, // original doc-data
   *   migrated: // migrated doc-data after run through migration-strategies
   * }
   */
  preMigrateDocument: [],
  /**
   * runs after the migration of a document has been done
   */
  postMigrateDocument: [],
  /**
   * runs at the beginning of the close-process of a database
   */
  preCloseRxDatabase: [],
  /**
   * runs after a database has been removed
   * @async
   */
  postRemoveRxDatabase: [],
  postCleanup: [],
  /**
   * runs before the replication writes the rows to master
   * but before the rows have been modified
   * @async
   */
  preReplicationMasterWrite: [],
  /**
   * runs after the replication has been sent to the server
   * but before the new documents have been handled
   * @async
   */
  preReplicationMasterWriteDocumentsHandle: []
};
function runPluginHooks(hookKey, obj) {
  if (HOOKS[hookKey].length > 0) {
    HOOKS[hookKey].forEach((fun) => fun(obj));
  }
}
async function runAsyncPluginHooks(hookKey, obj) {
  for (var fn of HOOKS[hookKey]) {
    await fn(obj);
  }
}

// node_modules/rxdb/dist/esm/rx-schema-helper.js
function getSchemaByObjectPath(rxJsonSchema, path) {
  var usePath = path;
  usePath = usePath.replace(REGEX_ALL_DOTS, ".properties.");
  usePath = "properties." + usePath;
  usePath = trimDots(usePath);
  var ret = getProperty(rxJsonSchema, usePath);
  return ret;
}
function fillPrimaryKey(primaryPath, jsonSchema, documentData) {
  if (typeof jsonSchema.primaryKey === "string") {
    return documentData;
  }
  var newPrimary = getComposedPrimaryKeyOfDocumentData(jsonSchema, documentData);
  var existingPrimary = documentData[primaryPath];
  if (existingPrimary && existingPrimary !== newPrimary) {
    throw newRxError("DOC19", {
      args: {
        documentData,
        existingPrimary,
        newPrimary
      },
      schema: jsonSchema
    });
  }
  documentData[primaryPath] = newPrimary;
  return documentData;
}
function getPrimaryFieldOfPrimaryKey(primaryKey) {
  if (typeof primaryKey === "string") {
    return primaryKey;
  } else {
    return primaryKey.key;
  }
}
function getLengthOfPrimaryKey(schema) {
  var primaryPath = getPrimaryFieldOfPrimaryKey(schema.primaryKey);
  var schemaPart = getSchemaByObjectPath(schema, primaryPath);
  return ensureNotFalsy(schemaPart.maxLength);
}
function getComposedPrimaryKeyOfDocumentData(jsonSchema, documentData) {
  if (typeof jsonSchema.primaryKey === "string") {
    return documentData[jsonSchema.primaryKey];
  }
  var compositePrimary = jsonSchema.primaryKey;
  return compositePrimary.fields.map((field) => {
    var value = getProperty(documentData, field);
    if (typeof value === "undefined") {
      throw newRxError("DOC18", {
        args: {
          field,
          documentData
        }
      });
    }
    return value;
  }).join(compositePrimary.separator);
}
function normalizeRxJsonSchema(jsonSchema) {
  var normalizedSchema = sortObject(jsonSchema, true);
  return normalizedSchema;
}
function getDefaultIndex(primaryPath) {
  return ["_deleted", primaryPath];
}
function fillWithDefaultSettings(schemaObj) {
  schemaObj = flatClone(schemaObj);
  var primaryPath = getPrimaryFieldOfPrimaryKey(schemaObj.primaryKey);
  schemaObj.properties = flatClone(schemaObj.properties);
  schemaObj.additionalProperties = false;
  if (!Object.prototype.hasOwnProperty.call(schemaObj, "keyCompression")) {
    schemaObj.keyCompression = false;
  }
  schemaObj.indexes = schemaObj.indexes ? schemaObj.indexes.slice(0) : [];
  schemaObj.required = schemaObj.required ? schemaObj.required.slice(0) : [];
  schemaObj.encrypted = schemaObj.encrypted ? schemaObj.encrypted.slice(0) : [];
  schemaObj.properties._rev = {
    type: "string",
    minLength: 1
  };
  schemaObj.properties._attachments = {
    type: "object"
  };
  schemaObj.properties._deleted = {
    type: "boolean"
  };
  schemaObj.properties._meta = RX_META_SCHEMA;
  schemaObj.required = schemaObj.required ? schemaObj.required.slice(0) : [];
  schemaObj.required.push("_deleted");
  schemaObj.required.push("_rev");
  schemaObj.required.push("_meta");
  schemaObj.required.push("_attachments");
  var finalFields = getFinalFields(schemaObj);
  appendToArray(schemaObj.required, finalFields);
  schemaObj.required = schemaObj.required.filter((field) => !field.includes(".")).filter((elem, pos, arr) => arr.indexOf(elem) === pos);
  schemaObj.version = schemaObj.version || 0;
  var useIndexes = schemaObj.indexes.map((index) => {
    var arIndex = isMaybeReadonlyArray(index) ? index.slice(0) : [index];
    if (!arIndex.includes(primaryPath)) {
      arIndex.push(primaryPath);
    }
    if (arIndex[0] !== "_deleted") {
      arIndex.unshift("_deleted");
    }
    return arIndex;
  });
  if (useIndexes.length === 0) {
    useIndexes.push(getDefaultIndex(primaryPath));
  }
  useIndexes.push(["_meta.lwt", primaryPath]);
  if (schemaObj.internalIndexes) {
    schemaObj.internalIndexes.map((idx) => {
      useIndexes.push(idx);
    });
  }
  var hasIndex = /* @__PURE__ */ new Set();
  useIndexes.filter((index) => {
    var indexStr = index.join(",");
    if (hasIndex.has(indexStr)) {
      return false;
    } else {
      hasIndex.add(indexStr);
      return true;
    }
  });
  schemaObj.indexes = useIndexes;
  return schemaObj;
}
var RX_META_SCHEMA = {
  type: "object",
  properties: {
    /**
     * The last-write time.
     * Unix time in milliseconds.
     */
    lwt: {
      type: "number",
      /**
       * We use 1 as minimum so that the value is never falsy.
       */
      minimum: RX_META_LWT_MINIMUM,
      maximum: 1e15,
      multipleOf: 0.01
    }
  },
  /**
   * Additional properties are allowed
   * and can be used by plugins to set various flags.
   */
  additionalProperties: true,
  required: ["lwt"]
};
function getFinalFields(jsonSchema) {
  var ret = Object.keys(jsonSchema.properties).filter((key) => jsonSchema.properties[key].final);
  var primaryPath = getPrimaryFieldOfPrimaryKey(jsonSchema.primaryKey);
  ret.push(primaryPath);
  if (typeof jsonSchema.primaryKey !== "string") {
    jsonSchema.primaryKey.fields.forEach((field) => ret.push(field));
  }
  return ret;
}
function fillObjectWithDefaults(rxSchema, obj) {
  var defaultKeys = Object.keys(rxSchema.defaultValues);
  for (var i = 0; i < defaultKeys.length; ++i) {
    var key = defaultKeys[i];
    if (!Object.prototype.hasOwnProperty.call(obj, key) || typeof obj[key] === "undefined") {
      obj[key] = rxSchema.defaultValues[key];
    }
  }
  return obj;
}

// node_modules/rxdb/dist/esm/rx-schema.js
var RxSchema = /* @__PURE__ */ function() {
  function RxSchema2(jsonSchema, hashFunction) {
    this.jsonSchema = jsonSchema;
    this.hashFunction = hashFunction;
    this.indexes = getIndexes(this.jsonSchema);
    this.primaryPath = getPrimaryFieldOfPrimaryKey(this.jsonSchema.primaryKey);
    if (!jsonSchema.properties[this.primaryPath].maxLength) {
      throw newRxError("SC39", {
        schema: jsonSchema
      });
    }
    this.finalFields = getFinalFields(this.jsonSchema);
  }
  var _proto = RxSchema2.prototype;
  _proto.validateChange = function validateChange(dataBefore, dataAfter) {
    this.finalFields.forEach((fieldName) => {
      if (!deepEqual(dataBefore[fieldName], dataAfter[fieldName])) {
        throw newRxError("DOC9", {
          dataBefore,
          dataAfter,
          fieldName,
          schema: this.jsonSchema
        });
      }
    });
  };
  _proto.getDocumentPrototype = function getDocumentPrototype2() {
    var proto = {};
    var pathProperties = getSchemaByObjectPath(this.jsonSchema, "");
    Object.keys(pathProperties).forEach((key) => {
      var fullPath = key;
      proto.__defineGetter__(key, function() {
        if (!this.get || typeof this.get !== "function") {
          return void 0;
        }
        var ret = this.get(fullPath);
        return ret;
      });
      Object.defineProperty(proto, key + "$", {
        get: function() {
          return this.get$(fullPath);
        },
        enumerable: false,
        configurable: false
      });
      Object.defineProperty(proto, key + "$$", {
        get: function() {
          return this.get$$(fullPath);
        },
        enumerable: false,
        configurable: false
      });
      Object.defineProperty(proto, key + "_", {
        get: function() {
          return this.populate(fullPath);
        },
        enumerable: false,
        configurable: false
      });
    });
    overwriteGetterForCaching(this, "getDocumentPrototype", () => proto);
    return proto;
  };
  _proto.getPrimaryOfDocumentData = function getPrimaryOfDocumentData(documentData) {
    return getComposedPrimaryKeyOfDocumentData(this.jsonSchema, documentData);
  };
  return _createClass(RxSchema2, [{
    key: "version",
    get: function() {
      return this.jsonSchema.version;
    }
  }, {
    key: "defaultValues",
    get: function() {
      var values = {};
      Object.entries(this.jsonSchema.properties).filter(([, v]) => Object.prototype.hasOwnProperty.call(v, "default")).forEach(([k, v]) => values[k] = v.default);
      return overwriteGetterForCaching(this, "defaultValues", values);
    }
    /**
     * @overrides itself on the first call
     */
  }, {
    key: "hash",
    get: function() {
      return overwriteGetterForCaching(this, "hash", this.hashFunction(JSON.stringify(this.jsonSchema)));
    }
  }]);
}();
function getIndexes(jsonSchema) {
  return (jsonSchema.indexes || []).map((index) => isMaybeReadonlyArray(index) ? index : [index]);
}
function getPreviousVersions(schema) {
  var version = schema.version ? schema.version : 0;
  var c = 0;
  return new Array(version).fill(0).map(() => c++);
}
function createRxSchema(jsonSchema, hashFunction, runPreCreateHooks = true) {
  if (runPreCreateHooks) {
    runPluginHooks("preCreateRxSchema", jsonSchema);
  }
  var useJsonSchema = fillWithDefaultSettings(jsonSchema);
  useJsonSchema = normalizeRxJsonSchema(useJsonSchema);
  overwritable.deepFreezeWhenDevMode(useJsonSchema);
  var schema = new RxSchema(useJsonSchema, hashFunction);
  runPluginHooks("createRxSchema", schema);
  return schema;
}

// node_modules/rxjs/dist/esm5/internal/util/isFunction.js
function isFunction(value) {
  return typeof value === "function";
}

// node_modules/rxjs/dist/esm5/internal/util/lift.js
function hasLift(source) {
  return isFunction(source === null || source === void 0 ? void 0 : source.lift);
}
function operate(init) {
  return function(source) {
    if (hasLift(source)) {
      return source.lift(function(liftedSource) {
        try {
          return init(liftedSource, this);
        } catch (err) {
          this.error(err);
        }
      });
    }
    throw new TypeError("Unable to lift unknown Observable type");
  };
}

// node_modules/tslib/tslib.es6.mjs
var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
    d2.__proto__ = b2;
  } || function(d2, b2) {
    for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
  };
  return extendStatics(d, b);
};
function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
    throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve2) {
      resolve2(value);
    });
  }
  return new (P || (P = Promise))(function(resolve2, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() {
    if (t[0] & 1) throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
    return this;
  }), g;
  function verb(n) {
    return function(v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return { value: op[1], done: false };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
}
function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function() {
      if (o && i >= o.length) o = void 0;
      return { value: o && o[i++], done: !o };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
}
function __spreadArray(to, from2, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from2.length, ar; i < l; i++) {
    if (ar || !(i in from2)) {
      if (!ar) ar = Array.prototype.slice.call(from2, 0, i);
      ar[i] = from2[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from2));
}
function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}
function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function awaitReturn(f) {
    return function(v) {
      return Promise.resolve(v).then(f, reject);
    };
  }
  function verb(n, f) {
    if (g[n]) {
      i[n] = function(v) {
        return new Promise(function(a, b) {
          q.push([n, v, a, b]) > 1 || resume(n, v);
        });
      };
      if (f) i[n] = f(i[n]);
    }
  }
  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f, v) {
    if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
  }
}
function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function(v) {
      return new Promise(function(resolve2, reject) {
        v = o[n](v), settle(resolve2, reject, v.done, v.value);
      });
    };
  }
  function settle(resolve2, reject, d, v) {
    Promise.resolve(v).then(function(v2) {
      resolve2({ value: v2, done: d });
    }, reject);
  }
}

// node_modules/rxjs/dist/esm5/internal/util/isArrayLike.js
var isArrayLike = function(x) {
  return x && typeof x.length === "number" && typeof x !== "function";
};

// node_modules/rxjs/dist/esm5/internal/util/isPromise.js
function isPromise(value) {
  return isFunction(value === null || value === void 0 ? void 0 : value.then);
}

// node_modules/rxjs/dist/esm5/internal/util/createErrorClass.js
function createErrorClass(createImpl) {
  var _super = function(instance) {
    Error.call(instance);
    instance.stack = new Error().stack;
  };
  var ctorFunc = createImpl(_super);
  ctorFunc.prototype = Object.create(Error.prototype);
  ctorFunc.prototype.constructor = ctorFunc;
  return ctorFunc;
}

// node_modules/rxjs/dist/esm5/internal/util/UnsubscriptionError.js
var UnsubscriptionError = createErrorClass(function(_super) {
  return function UnsubscriptionErrorImpl(errors) {
    _super(this);
    this.message = errors ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function(err, i) {
      return i + 1 + ") " + err.toString();
    }).join("\n  ") : "";
    this.name = "UnsubscriptionError";
    this.errors = errors;
  };
});

// node_modules/rxjs/dist/esm5/internal/util/arrRemove.js
function arrRemove(arr, item) {
  if (arr) {
    var index = arr.indexOf(item);
    0 <= index && arr.splice(index, 1);
  }
}

// node_modules/rxjs/dist/esm5/internal/Subscription.js
var Subscription = function() {
  function Subscription2(initialTeardown) {
    this.initialTeardown = initialTeardown;
    this.closed = false;
    this._parentage = null;
    this._finalizers = null;
  }
  Subscription2.prototype.unsubscribe = function() {
    var e_1, _a, e_2, _b;
    var errors;
    if (!this.closed) {
      this.closed = true;
      var _parentage = this._parentage;
      if (_parentage) {
        this._parentage = null;
        if (Array.isArray(_parentage)) {
          try {
            for (var _parentage_1 = __values(_parentage), _parentage_1_1 = _parentage_1.next(); !_parentage_1_1.done; _parentage_1_1 = _parentage_1.next()) {
              var parent_1 = _parentage_1_1.value;
              parent_1.remove(this);
            }
          } catch (e_1_1) {
            e_1 = { error: e_1_1 };
          } finally {
            try {
              if (_parentage_1_1 && !_parentage_1_1.done && (_a = _parentage_1.return)) _a.call(_parentage_1);
            } finally {
              if (e_1) throw e_1.error;
            }
          }
        } else {
          _parentage.remove(this);
        }
      }
      var initialFinalizer = this.initialTeardown;
      if (isFunction(initialFinalizer)) {
        try {
          initialFinalizer();
        } catch (e) {
          errors = e instanceof UnsubscriptionError ? e.errors : [e];
        }
      }
      var _finalizers = this._finalizers;
      if (_finalizers) {
        this._finalizers = null;
        try {
          for (var _finalizers_1 = __values(_finalizers), _finalizers_1_1 = _finalizers_1.next(); !_finalizers_1_1.done; _finalizers_1_1 = _finalizers_1.next()) {
            var finalizer = _finalizers_1_1.value;
            try {
              execFinalizer(finalizer);
            } catch (err) {
              errors = errors !== null && errors !== void 0 ? errors : [];
              if (err instanceof UnsubscriptionError) {
                errors = __spreadArray(__spreadArray([], __read(errors)), __read(err.errors));
              } else {
                errors.push(err);
              }
            }
          }
        } catch (e_2_1) {
          e_2 = { error: e_2_1 };
        } finally {
          try {
            if (_finalizers_1_1 && !_finalizers_1_1.done && (_b = _finalizers_1.return)) _b.call(_finalizers_1);
          } finally {
            if (e_2) throw e_2.error;
          }
        }
      }
      if (errors) {
        throw new UnsubscriptionError(errors);
      }
    }
  };
  Subscription2.prototype.add = function(teardown) {
    var _a;
    if (teardown && teardown !== this) {
      if (this.closed) {
        execFinalizer(teardown);
      } else {
        if (teardown instanceof Subscription2) {
          if (teardown.closed || teardown._hasParent(this)) {
            return;
          }
          teardown._addParent(this);
        }
        (this._finalizers = (_a = this._finalizers) !== null && _a !== void 0 ? _a : []).push(teardown);
      }
    }
  };
  Subscription2.prototype._hasParent = function(parent) {
    var _parentage = this._parentage;
    return _parentage === parent || Array.isArray(_parentage) && _parentage.includes(parent);
  };
  Subscription2.prototype._addParent = function(parent) {
    var _parentage = this._parentage;
    this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
  };
  Subscription2.prototype._removeParent = function(parent) {
    var _parentage = this._parentage;
    if (_parentage === parent) {
      this._parentage = null;
    } else if (Array.isArray(_parentage)) {
      arrRemove(_parentage, parent);
    }
  };
  Subscription2.prototype.remove = function(teardown) {
    var _finalizers = this._finalizers;
    _finalizers && arrRemove(_finalizers, teardown);
    if (teardown instanceof Subscription2) {
      teardown._removeParent(this);
    }
  };
  Subscription2.EMPTY = function() {
    var empty = new Subscription2();
    empty.closed = true;
    return empty;
  }();
  return Subscription2;
}();
var EMPTY_SUBSCRIPTION = Subscription.EMPTY;
function isSubscription(value) {
  return value instanceof Subscription || value && "closed" in value && isFunction(value.remove) && isFunction(value.add) && isFunction(value.unsubscribe);
}
function execFinalizer(finalizer) {
  if (isFunction(finalizer)) {
    finalizer();
  } else {
    finalizer.unsubscribe();
  }
}

// node_modules/rxjs/dist/esm5/internal/config.js
var config = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: false,
  useDeprecatedNextContext: false
};

// node_modules/rxjs/dist/esm5/internal/scheduler/timeoutProvider.js
var timeoutProvider = {
  setTimeout: function(handler, timeout) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
      args[_i - 2] = arguments[_i];
    }
    var delegate = timeoutProvider.delegate;
    if (delegate === null || delegate === void 0 ? void 0 : delegate.setTimeout) {
      return delegate.setTimeout.apply(delegate, __spreadArray([handler, timeout], __read(args)));
    }
    return setTimeout.apply(void 0, __spreadArray([handler, timeout], __read(args)));
  },
  clearTimeout: function(handle) {
    var delegate = timeoutProvider.delegate;
    return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearTimeout) || clearTimeout)(handle);
  },
  delegate: void 0
};

// node_modules/rxjs/dist/esm5/internal/util/reportUnhandledError.js
function reportUnhandledError(err) {
  timeoutProvider.setTimeout(function() {
    var onUnhandledError = config.onUnhandledError;
    if (onUnhandledError) {
      onUnhandledError(err);
    } else {
      throw err;
    }
  });
}

// node_modules/rxjs/dist/esm5/internal/util/noop.js
function noop() {
}

// node_modules/rxjs/dist/esm5/internal/NotificationFactories.js
var COMPLETE_NOTIFICATION = function() {
  return createNotification("C", void 0, void 0);
}();
function errorNotification(error) {
  return createNotification("E", void 0, error);
}
function nextNotification(value) {
  return createNotification("N", value, void 0);
}
function createNotification(kind, value, error) {
  return {
    kind,
    value,
    error
  };
}

// node_modules/rxjs/dist/esm5/internal/util/errorContext.js
var context = null;
function errorContext(cb) {
  if (config.useDeprecatedSynchronousErrorHandling) {
    var isRoot = !context;
    if (isRoot) {
      context = { errorThrown: false, error: null };
    }
    cb();
    if (isRoot) {
      var _a = context, errorThrown = _a.errorThrown, error = _a.error;
      context = null;
      if (errorThrown) {
        throw error;
      }
    }
  } else {
    cb();
  }
}
function captureError(err) {
  if (config.useDeprecatedSynchronousErrorHandling && context) {
    context.errorThrown = true;
    context.error = err;
  }
}

// node_modules/rxjs/dist/esm5/internal/Subscriber.js
var Subscriber = function(_super) {
  __extends(Subscriber2, _super);
  function Subscriber2(destination) {
    var _this = _super.call(this) || this;
    _this.isStopped = false;
    if (destination) {
      _this.destination = destination;
      if (isSubscription(destination)) {
        destination.add(_this);
      }
    } else {
      _this.destination = EMPTY_OBSERVER;
    }
    return _this;
  }
  Subscriber2.create = function(next, error, complete) {
    return new SafeSubscriber(next, error, complete);
  };
  Subscriber2.prototype.next = function(value) {
    if (this.isStopped) {
      handleStoppedNotification(nextNotification(value), this);
    } else {
      this._next(value);
    }
  };
  Subscriber2.prototype.error = function(err) {
    if (this.isStopped) {
      handleStoppedNotification(errorNotification(err), this);
    } else {
      this.isStopped = true;
      this._error(err);
    }
  };
  Subscriber2.prototype.complete = function() {
    if (this.isStopped) {
      handleStoppedNotification(COMPLETE_NOTIFICATION, this);
    } else {
      this.isStopped = true;
      this._complete();
    }
  };
  Subscriber2.prototype.unsubscribe = function() {
    if (!this.closed) {
      this.isStopped = true;
      _super.prototype.unsubscribe.call(this);
      this.destination = null;
    }
  };
  Subscriber2.prototype._next = function(value) {
    this.destination.next(value);
  };
  Subscriber2.prototype._error = function(err) {
    try {
      this.destination.error(err);
    } finally {
      this.unsubscribe();
    }
  };
  Subscriber2.prototype._complete = function() {
    try {
      this.destination.complete();
    } finally {
      this.unsubscribe();
    }
  };
  return Subscriber2;
}(Subscription);
var _bind = Function.prototype.bind;
function bind(fn, thisArg) {
  return _bind.call(fn, thisArg);
}
var ConsumerObserver = function() {
  function ConsumerObserver2(partialObserver) {
    this.partialObserver = partialObserver;
  }
  ConsumerObserver2.prototype.next = function(value) {
    var partialObserver = this.partialObserver;
    if (partialObserver.next) {
      try {
        partialObserver.next(value);
      } catch (error) {
        handleUnhandledError(error);
      }
    }
  };
  ConsumerObserver2.prototype.error = function(err) {
    var partialObserver = this.partialObserver;
    if (partialObserver.error) {
      try {
        partialObserver.error(err);
      } catch (error) {
        handleUnhandledError(error);
      }
    } else {
      handleUnhandledError(err);
    }
  };
  ConsumerObserver2.prototype.complete = function() {
    var partialObserver = this.partialObserver;
    if (partialObserver.complete) {
      try {
        partialObserver.complete();
      } catch (error) {
        handleUnhandledError(error);
      }
    }
  };
  return ConsumerObserver2;
}();
var SafeSubscriber = function(_super) {
  __extends(SafeSubscriber2, _super);
  function SafeSubscriber2(observerOrNext, error, complete) {
    var _this = _super.call(this) || this;
    var partialObserver;
    if (isFunction(observerOrNext) || !observerOrNext) {
      partialObserver = {
        next: observerOrNext !== null && observerOrNext !== void 0 ? observerOrNext : void 0,
        error: error !== null && error !== void 0 ? error : void 0,
        complete: complete !== null && complete !== void 0 ? complete : void 0
      };
    } else {
      var context_1;
      if (_this && config.useDeprecatedNextContext) {
        context_1 = Object.create(observerOrNext);
        context_1.unsubscribe = function() {
          return _this.unsubscribe();
        };
        partialObserver = {
          next: observerOrNext.next && bind(observerOrNext.next, context_1),
          error: observerOrNext.error && bind(observerOrNext.error, context_1),
          complete: observerOrNext.complete && bind(observerOrNext.complete, context_1)
        };
      } else {
        partialObserver = observerOrNext;
      }
    }
    _this.destination = new ConsumerObserver(partialObserver);
    return _this;
  }
  return SafeSubscriber2;
}(Subscriber);
function handleUnhandledError(error) {
  if (config.useDeprecatedSynchronousErrorHandling) {
    captureError(error);
  } else {
    reportUnhandledError(error);
  }
}
function defaultErrorHandler(err) {
  throw err;
}
function handleStoppedNotification(notification, subscriber) {
  var onStoppedNotification = config.onStoppedNotification;
  onStoppedNotification && timeoutProvider.setTimeout(function() {
    return onStoppedNotification(notification, subscriber);
  });
}
var EMPTY_OBSERVER = {
  closed: true,
  next: noop,
  error: defaultErrorHandler,
  complete: noop
};

// node_modules/rxjs/dist/esm5/internal/symbol/observable.js
var observable = function() {
  return typeof Symbol === "function" && Symbol.observable || "@@observable";
}();

// node_modules/rxjs/dist/esm5/internal/util/identity.js
function identity(x) {
  return x;
}

// node_modules/rxjs/dist/esm5/internal/util/pipe.js
function pipeFromArray(fns) {
  if (fns.length === 0) {
    return identity;
  }
  if (fns.length === 1) {
    return fns[0];
  }
  return function piped(input) {
    return fns.reduce(function(prev, fn) {
      return fn(prev);
    }, input);
  };
}

// node_modules/rxjs/dist/esm5/internal/Observable.js
var Observable = function() {
  function Observable2(subscribe) {
    if (subscribe) {
      this._subscribe = subscribe;
    }
  }
  Observable2.prototype.lift = function(operator) {
    var observable2 = new Observable2();
    observable2.source = this;
    observable2.operator = operator;
    return observable2;
  };
  Observable2.prototype.subscribe = function(observerOrNext, error, complete) {
    var _this = this;
    var subscriber = isSubscriber(observerOrNext) ? observerOrNext : new SafeSubscriber(observerOrNext, error, complete);
    errorContext(function() {
      var _a = _this, operator = _a.operator, source = _a.source;
      subscriber.add(operator ? operator.call(subscriber, source) : source ? _this._subscribe(subscriber) : _this._trySubscribe(subscriber));
    });
    return subscriber;
  };
  Observable2.prototype._trySubscribe = function(sink) {
    try {
      return this._subscribe(sink);
    } catch (err) {
      sink.error(err);
    }
  };
  Observable2.prototype.forEach = function(next, promiseCtor) {
    var _this = this;
    promiseCtor = getPromiseCtor(promiseCtor);
    return new promiseCtor(function(resolve2, reject) {
      var subscriber = new SafeSubscriber({
        next: function(value) {
          try {
            next(value);
          } catch (err) {
            reject(err);
            subscriber.unsubscribe();
          }
        },
        error: reject,
        complete: resolve2
      });
      _this.subscribe(subscriber);
    });
  };
  Observable2.prototype._subscribe = function(subscriber) {
    var _a;
    return (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber);
  };
  Observable2.prototype[observable] = function() {
    return this;
  };
  Observable2.prototype.pipe = function() {
    var operations = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      operations[_i] = arguments[_i];
    }
    return pipeFromArray(operations)(this);
  };
  Observable2.prototype.toPromise = function(promiseCtor) {
    var _this = this;
    promiseCtor = getPromiseCtor(promiseCtor);
    return new promiseCtor(function(resolve2, reject) {
      var value;
      _this.subscribe(function(x) {
        return value = x;
      }, function(err) {
        return reject(err);
      }, function() {
        return resolve2(value);
      });
    });
  };
  Observable2.create = function(subscribe) {
    return new Observable2(subscribe);
  };
  return Observable2;
}();
function getPromiseCtor(promiseCtor) {
  var _a;
  return (_a = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : config.Promise) !== null && _a !== void 0 ? _a : Promise;
}
function isObserver(value) {
  return value && isFunction(value.next) && isFunction(value.error) && isFunction(value.complete);
}
function isSubscriber(value) {
  return value && value instanceof Subscriber || isObserver(value) && isSubscription(value);
}

// node_modules/rxjs/dist/esm5/internal/util/isInteropObservable.js
function isInteropObservable(input) {
  return isFunction(input[observable]);
}

// node_modules/rxjs/dist/esm5/internal/util/isAsyncIterable.js
function isAsyncIterable(obj) {
  return Symbol.asyncIterator && isFunction(obj === null || obj === void 0 ? void 0 : obj[Symbol.asyncIterator]);
}

// node_modules/rxjs/dist/esm5/internal/util/throwUnobservableError.js
function createInvalidObservableTypeError(input) {
  return new TypeError("You provided " + (input !== null && typeof input === "object" ? "an invalid object" : "'" + input + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
}

// node_modules/rxjs/dist/esm5/internal/symbol/iterator.js
function getSymbolIterator() {
  if (typeof Symbol !== "function" || !Symbol.iterator) {
    return "@@iterator";
  }
  return Symbol.iterator;
}
var iterator = getSymbolIterator();

// node_modules/rxjs/dist/esm5/internal/util/isIterable.js
function isIterable(input) {
  return isFunction(input === null || input === void 0 ? void 0 : input[iterator]);
}

// node_modules/rxjs/dist/esm5/internal/util/isReadableStreamLike.js
function readableStreamLikeToAsyncGenerator(readableStream) {
  return __asyncGenerator(this, arguments, function readableStreamLikeToAsyncGenerator_1() {
    var reader, _a, value, done;
    return __generator(this, function(_b) {
      switch (_b.label) {
        case 0:
          reader = readableStream.getReader();
          _b.label = 1;
        case 1:
          _b.trys.push([1, , 9, 10]);
          _b.label = 2;
        case 2:
          if (false) return [3, 8];
          return [4, __await(reader.read())];
        case 3:
          _a = _b.sent(), value = _a.value, done = _a.done;
          if (!done) return [3, 5];
          return [4, __await(void 0)];
        case 4:
          return [2, _b.sent()];
        case 5:
          return [4, __await(value)];
        case 6:
          return [4, _b.sent()];
        case 7:
          _b.sent();
          return [3, 2];
        case 8:
          return [3, 10];
        case 9:
          reader.releaseLock();
          return [7];
        case 10:
          return [2];
      }
    });
  });
}
function isReadableStreamLike(obj) {
  return isFunction(obj === null || obj === void 0 ? void 0 : obj.getReader);
}

// node_modules/rxjs/dist/esm5/internal/observable/innerFrom.js
function innerFrom(input) {
  if (input instanceof Observable) {
    return input;
  }
  if (input != null) {
    if (isInteropObservable(input)) {
      return fromInteropObservable(input);
    }
    if (isArrayLike(input)) {
      return fromArrayLike(input);
    }
    if (isPromise(input)) {
      return fromPromise(input);
    }
    if (isAsyncIterable(input)) {
      return fromAsyncIterable(input);
    }
    if (isIterable(input)) {
      return fromIterable(input);
    }
    if (isReadableStreamLike(input)) {
      return fromReadableStreamLike(input);
    }
  }
  throw createInvalidObservableTypeError(input);
}
function fromInteropObservable(obj) {
  return new Observable(function(subscriber) {
    var obs = obj[observable]();
    if (isFunction(obs.subscribe)) {
      return obs.subscribe(subscriber);
    }
    throw new TypeError("Provided object does not correctly implement Symbol.observable");
  });
}
function fromArrayLike(array) {
  return new Observable(function(subscriber) {
    for (var i = 0; i < array.length && !subscriber.closed; i++) {
      subscriber.next(array[i]);
    }
    subscriber.complete();
  });
}
function fromPromise(promise) {
  return new Observable(function(subscriber) {
    promise.then(function(value) {
      if (!subscriber.closed) {
        subscriber.next(value);
        subscriber.complete();
      }
    }, function(err) {
      return subscriber.error(err);
    }).then(null, reportUnhandledError);
  });
}
function fromIterable(iterable) {
  return new Observable(function(subscriber) {
    var e_1, _a;
    try {
      for (var iterable_1 = __values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
        var value = iterable_1_1.value;
        subscriber.next(value);
        if (subscriber.closed) {
          return;
        }
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (iterable_1_1 && !iterable_1_1.done && (_a = iterable_1.return)) _a.call(iterable_1);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
    subscriber.complete();
  });
}
function fromAsyncIterable(asyncIterable) {
  return new Observable(function(subscriber) {
    process2(asyncIterable, subscriber).catch(function(err) {
      return subscriber.error(err);
    });
  });
}
function fromReadableStreamLike(readableStream) {
  return fromAsyncIterable(readableStreamLikeToAsyncGenerator(readableStream));
}
function process2(asyncIterable, subscriber) {
  var asyncIterable_1, asyncIterable_1_1;
  var e_2, _a;
  return __awaiter(this, void 0, void 0, function() {
    var value, e_2_1;
    return __generator(this, function(_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 5, 6, 11]);
          asyncIterable_1 = __asyncValues(asyncIterable);
          _b.label = 1;
        case 1:
          return [4, asyncIterable_1.next()];
        case 2:
          if (!(asyncIterable_1_1 = _b.sent(), !asyncIterable_1_1.done)) return [3, 4];
          value = asyncIterable_1_1.value;
          subscriber.next(value);
          if (subscriber.closed) {
            return [2];
          }
          _b.label = 3;
        case 3:
          return [3, 1];
        case 4:
          return [3, 11];
        case 5:
          e_2_1 = _b.sent();
          e_2 = { error: e_2_1 };
          return [3, 11];
        case 6:
          _b.trys.push([6, , 9, 10]);
          if (!(asyncIterable_1_1 && !asyncIterable_1_1.done && (_a = asyncIterable_1.return))) return [3, 8];
          return [4, _a.call(asyncIterable_1)];
        case 7:
          _b.sent();
          _b.label = 8;
        case 8:
          return [3, 10];
        case 9:
          if (e_2) throw e_2.error;
          return [7];
        case 10:
          return [7];
        case 11:
          subscriber.complete();
          return [2];
      }
    });
  });
}

// node_modules/rxjs/dist/esm5/internal/operators/OperatorSubscriber.js
function createOperatorSubscriber(destination, onNext, onComplete, onError, onFinalize) {
  return new OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize);
}
var OperatorSubscriber = function(_super) {
  __extends(OperatorSubscriber2, _super);
  function OperatorSubscriber2(destination, onNext, onComplete, onError, onFinalize, shouldUnsubscribe) {
    var _this = _super.call(this, destination) || this;
    _this.onFinalize = onFinalize;
    _this.shouldUnsubscribe = shouldUnsubscribe;
    _this._next = onNext ? function(value) {
      try {
        onNext(value);
      } catch (err) {
        destination.error(err);
      }
    } : _super.prototype._next;
    _this._error = onError ? function(err) {
      try {
        onError(err);
      } catch (err2) {
        destination.error(err2);
      } finally {
        this.unsubscribe();
      }
    } : _super.prototype._error;
    _this._complete = onComplete ? function() {
      try {
        onComplete();
      } catch (err) {
        destination.error(err);
      } finally {
        this.unsubscribe();
      }
    } : _super.prototype._complete;
    return _this;
  }
  OperatorSubscriber2.prototype.unsubscribe = function() {
    var _a;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      var closed_1 = this.closed;
      _super.prototype.unsubscribe.call(this);
      !closed_1 && ((_a = this.onFinalize) === null || _a === void 0 ? void 0 : _a.call(this));
    }
  };
  return OperatorSubscriber2;
}(Subscriber);

// node_modules/rxjs/dist/esm5/internal/scheduler/dateTimestampProvider.js
var dateTimestampProvider = {
  now: function() {
    return (dateTimestampProvider.delegate || Date).now();
  },
  delegate: void 0
};

// node_modules/rxjs/dist/esm5/internal/util/isScheduler.js
function isScheduler(value) {
  return value && isFunction(value.schedule);
}

// node_modules/rxjs/dist/esm5/internal/util/args.js
function last(arr) {
  return arr[arr.length - 1];
}
function popResultSelector(args) {
  return isFunction(last(args)) ? args.pop() : void 0;
}
function popScheduler(args) {
  return isScheduler(last(args)) ? args.pop() : void 0;
}
function popNumber(args, defaultValue) {
  return typeof last(args) === "number" ? args.pop() : defaultValue;
}

// node_modules/rxjs/dist/esm5/internal/util/executeSchedule.js
function executeSchedule(parentSubscription, scheduler, work, delay, repeat) {
  if (delay === void 0) {
    delay = 0;
  }
  if (repeat === void 0) {
    repeat = false;
  }
  var scheduleSubscription = scheduler.schedule(function() {
    work();
    if (repeat) {
      parentSubscription.add(this.schedule(null, delay));
    } else {
      this.unsubscribe();
    }
  }, delay);
  parentSubscription.add(scheduleSubscription);
  if (!repeat) {
    return scheduleSubscription;
  }
}

// node_modules/rxjs/dist/esm5/internal/util/argsArgArrayOrObject.js
var isArray = Array.isArray;
var getPrototypeOf = Object.getPrototypeOf;
var objectProto = Object.prototype;
var getKeys = Object.keys;
function argsArgArrayOrObject(args) {
  if (args.length === 1) {
    var first_1 = args[0];
    if (isArray(first_1)) {
      return { args: first_1, keys: null };
    }
    if (isPOJO(first_1)) {
      var keys = getKeys(first_1);
      return {
        args: keys.map(function(key) {
          return first_1[key];
        }),
        keys
      };
    }
  }
  return { args, keys: null };
}
function isPOJO(obj) {
  return obj && typeof obj === "object" && getPrototypeOf(obj) === objectProto;
}

// node_modules/rxjs/dist/esm5/internal/operators/observeOn.js
function observeOn(scheduler, delay) {
  if (delay === void 0) {
    delay = 0;
  }
  return operate(function(source, subscriber) {
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      return executeSchedule(subscriber, scheduler, function() {
        return subscriber.next(value);
      }, delay);
    }, function() {
      return executeSchedule(subscriber, scheduler, function() {
        return subscriber.complete();
      }, delay);
    }, function(err) {
      return executeSchedule(subscriber, scheduler, function() {
        return subscriber.error(err);
      }, delay);
    }));
  });
}

// node_modules/rxjs/dist/esm5/internal/operators/subscribeOn.js
function subscribeOn(scheduler, delay) {
  if (delay === void 0) {
    delay = 0;
  }
  return operate(function(source, subscriber) {
    subscriber.add(scheduler.schedule(function() {
      return source.subscribe(subscriber);
    }, delay));
  });
}

// node_modules/rxjs/dist/esm5/internal/scheduled/scheduleObservable.js
function scheduleObservable(input, scheduler) {
  return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
}

// node_modules/rxjs/dist/esm5/internal/scheduled/schedulePromise.js
function schedulePromise(input, scheduler) {
  return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
}

// node_modules/rxjs/dist/esm5/internal/scheduled/scheduleArray.js
function scheduleArray(input, scheduler) {
  return new Observable(function(subscriber) {
    var i = 0;
    return scheduler.schedule(function() {
      if (i === input.length) {
        subscriber.complete();
      } else {
        subscriber.next(input[i++]);
        if (!subscriber.closed) {
          this.schedule();
        }
      }
    });
  });
}

// node_modules/rxjs/dist/esm5/internal/scheduled/scheduleIterable.js
function scheduleIterable(input, scheduler) {
  return new Observable(function(subscriber) {
    var iterator2;
    executeSchedule(subscriber, scheduler, function() {
      iterator2 = input[iterator]();
      executeSchedule(subscriber, scheduler, function() {
        var _a;
        var value;
        var done;
        try {
          _a = iterator2.next(), value = _a.value, done = _a.done;
        } catch (err) {
          subscriber.error(err);
          return;
        }
        if (done) {
          subscriber.complete();
        } else {
          subscriber.next(value);
        }
      }, 0, true);
    });
    return function() {
      return isFunction(iterator2 === null || iterator2 === void 0 ? void 0 : iterator2.return) && iterator2.return();
    };
  });
}

// node_modules/rxjs/dist/esm5/internal/scheduled/scheduleAsyncIterable.js
function scheduleAsyncIterable(input, scheduler) {
  if (!input) {
    throw new Error("Iterable cannot be null");
  }
  return new Observable(function(subscriber) {
    executeSchedule(subscriber, scheduler, function() {
      var iterator2 = input[Symbol.asyncIterator]();
      executeSchedule(subscriber, scheduler, function() {
        iterator2.next().then(function(result) {
          if (result.done) {
            subscriber.complete();
          } else {
            subscriber.next(result.value);
          }
        });
      }, 0, true);
    });
  });
}

// node_modules/rxjs/dist/esm5/internal/scheduled/scheduleReadableStreamLike.js
function scheduleReadableStreamLike(input, scheduler) {
  return scheduleAsyncIterable(readableStreamLikeToAsyncGenerator(input), scheduler);
}

// node_modules/rxjs/dist/esm5/internal/scheduled/scheduled.js
function scheduled(input, scheduler) {
  if (input != null) {
    if (isInteropObservable(input)) {
      return scheduleObservable(input, scheduler);
    }
    if (isArrayLike(input)) {
      return scheduleArray(input, scheduler);
    }
    if (isPromise(input)) {
      return schedulePromise(input, scheduler);
    }
    if (isAsyncIterable(input)) {
      return scheduleAsyncIterable(input, scheduler);
    }
    if (isIterable(input)) {
      return scheduleIterable(input, scheduler);
    }
    if (isReadableStreamLike(input)) {
      return scheduleReadableStreamLike(input, scheduler);
    }
  }
  throw createInvalidObservableTypeError(input);
}

// node_modules/rxjs/dist/esm5/internal/observable/from.js
function from(input, scheduler) {
  return scheduler ? scheduled(input, scheduler) : innerFrom(input);
}

// node_modules/rxjs/dist/esm5/internal/operators/map.js
function map(project, thisArg) {
  return operate(function(source, subscriber) {
    var index = 0;
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      subscriber.next(project.call(thisArg, value, index++));
    }));
  });
}

// node_modules/rxjs/dist/esm5/internal/util/mapOneOrManyArgs.js
var isArray2 = Array.isArray;
function callOrApply(fn, args) {
  return isArray2(args) ? fn.apply(void 0, __spreadArray([], __read(args))) : fn(args);
}
function mapOneOrManyArgs(fn) {
  return map(function(args) {
    return callOrApply(fn, args);
  });
}

// node_modules/rxjs/dist/esm5/internal/util/createObject.js
function createObject(keys, values) {
  return keys.reduce(function(result, key, i) {
    return result[key] = values[i], result;
  }, {});
}

// node_modules/rxjs/dist/esm5/internal/observable/combineLatest.js
function combineLatest() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  var scheduler = popScheduler(args);
  var resultSelector = popResultSelector(args);
  var _a = argsArgArrayOrObject(args), observables = _a.args, keys = _a.keys;
  if (observables.length === 0) {
    return from([], scheduler);
  }
  var result = new Observable(combineLatestInit(observables, scheduler, keys ? function(values) {
    return createObject(keys, values);
  } : identity));
  return resultSelector ? result.pipe(mapOneOrManyArgs(resultSelector)) : result;
}
function combineLatestInit(observables, scheduler, valueTransform) {
  if (valueTransform === void 0) {
    valueTransform = identity;
  }
  return function(subscriber) {
    maybeSchedule(scheduler, function() {
      var length = observables.length;
      var values = new Array(length);
      var active = length;
      var remainingFirstValues = length;
      var _loop_1 = function(i2) {
        maybeSchedule(scheduler, function() {
          var source = from(observables[i2], scheduler);
          var hasFirstValue = false;
          source.subscribe(createOperatorSubscriber(subscriber, function(value) {
            values[i2] = value;
            if (!hasFirstValue) {
              hasFirstValue = true;
              remainingFirstValues--;
            }
            if (!remainingFirstValues) {
              subscriber.next(valueTransform(values.slice()));
            }
          }, function() {
            if (!--active) {
              subscriber.complete();
            }
          }));
        }, subscriber);
      };
      for (var i = 0; i < length; i++) {
        _loop_1(i);
      }
    }, subscriber);
  };
}
function maybeSchedule(scheduler, execute, subscription) {
  if (scheduler) {
    executeSchedule(subscription, scheduler, execute);
  } else {
    execute();
  }
}

// node_modules/rxjs/dist/esm5/internal/operators/mergeInternals.js
function mergeInternals(source, subscriber, project, concurrent, onBeforeNext, expand, innerSubScheduler, additionalFinalizer) {
  var buffer = [];
  var active = 0;
  var index = 0;
  var isComplete = false;
  var checkComplete = function() {
    if (isComplete && !buffer.length && !active) {
      subscriber.complete();
    }
  };
  var outerNext = function(value) {
    return active < concurrent ? doInnerSub(value) : buffer.push(value);
  };
  var doInnerSub = function(value) {
    expand && subscriber.next(value);
    active++;
    var innerComplete = false;
    innerFrom(project(value, index++)).subscribe(createOperatorSubscriber(subscriber, function(innerValue) {
      onBeforeNext === null || onBeforeNext === void 0 ? void 0 : onBeforeNext(innerValue);
      if (expand) {
        outerNext(innerValue);
      } else {
        subscriber.next(innerValue);
      }
    }, function() {
      innerComplete = true;
    }, void 0, function() {
      if (innerComplete) {
        try {
          active--;
          var _loop_1 = function() {
            var bufferedValue = buffer.shift();
            if (innerSubScheduler) {
              executeSchedule(subscriber, innerSubScheduler, function() {
                return doInnerSub(bufferedValue);
              });
            } else {
              doInnerSub(bufferedValue);
            }
          };
          while (buffer.length && active < concurrent) {
            _loop_1();
          }
          checkComplete();
        } catch (err) {
          subscriber.error(err);
        }
      }
    }));
  };
  source.subscribe(createOperatorSubscriber(subscriber, outerNext, function() {
    isComplete = true;
    checkComplete();
  }));
  return function() {
    additionalFinalizer === null || additionalFinalizer === void 0 ? void 0 : additionalFinalizer();
  };
}

// node_modules/rxjs/dist/esm5/internal/operators/mergeMap.js
function mergeMap(project, resultSelector, concurrent) {
  if (concurrent === void 0) {
    concurrent = Infinity;
  }
  if (isFunction(resultSelector)) {
    return mergeMap(function(a, i) {
      return map(function(b, ii) {
        return resultSelector(a, b, i, ii);
      })(innerFrom(project(a, i)));
    }, concurrent);
  } else if (typeof resultSelector === "number") {
    concurrent = resultSelector;
  }
  return operate(function(source, subscriber) {
    return mergeInternals(source, subscriber, project, concurrent);
  });
}

// node_modules/rxjs/dist/esm5/internal/operators/mergeAll.js
function mergeAll(concurrent) {
  if (concurrent === void 0) {
    concurrent = Infinity;
  }
  return mergeMap(identity, concurrent);
}

// node_modules/rxjs/dist/esm5/internal/operators/concatAll.js
function concatAll() {
  return mergeAll(1);
}

// node_modules/rxjs/dist/esm5/internal/util/ObjectUnsubscribedError.js
var ObjectUnsubscribedError = createErrorClass(function(_super) {
  return function ObjectUnsubscribedErrorImpl() {
    _super(this);
    this.name = "ObjectUnsubscribedError";
    this.message = "object unsubscribed";
  };
});

// node_modules/rxjs/dist/esm5/internal/Subject.js
var Subject = function(_super) {
  __extends(Subject2, _super);
  function Subject2() {
    var _this = _super.call(this) || this;
    _this.closed = false;
    _this.currentObservers = null;
    _this.observers = [];
    _this.isStopped = false;
    _this.hasError = false;
    _this.thrownError = null;
    return _this;
  }
  Subject2.prototype.lift = function(operator) {
    var subject = new AnonymousSubject(this, this);
    subject.operator = operator;
    return subject;
  };
  Subject2.prototype._throwIfClosed = function() {
    if (this.closed) {
      throw new ObjectUnsubscribedError();
    }
  };
  Subject2.prototype.next = function(value) {
    var _this = this;
    errorContext(function() {
      var e_1, _a;
      _this._throwIfClosed();
      if (!_this.isStopped) {
        if (!_this.currentObservers) {
          _this.currentObservers = Array.from(_this.observers);
        }
        try {
          for (var _b = __values(_this.currentObservers), _c = _b.next(); !_c.done; _c = _b.next()) {
            var observer = _c.value;
            observer.next(value);
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
      }
    });
  };
  Subject2.prototype.error = function(err) {
    var _this = this;
    errorContext(function() {
      _this._throwIfClosed();
      if (!_this.isStopped) {
        _this.hasError = _this.isStopped = true;
        _this.thrownError = err;
        var observers = _this.observers;
        while (observers.length) {
          observers.shift().error(err);
        }
      }
    });
  };
  Subject2.prototype.complete = function() {
    var _this = this;
    errorContext(function() {
      _this._throwIfClosed();
      if (!_this.isStopped) {
        _this.isStopped = true;
        var observers = _this.observers;
        while (observers.length) {
          observers.shift().complete();
        }
      }
    });
  };
  Subject2.prototype.unsubscribe = function() {
    this.isStopped = this.closed = true;
    this.observers = this.currentObservers = null;
  };
  Object.defineProperty(Subject2.prototype, "observed", {
    get: function() {
      var _a;
      return ((_a = this.observers) === null || _a === void 0 ? void 0 : _a.length) > 0;
    },
    enumerable: false,
    configurable: true
  });
  Subject2.prototype._trySubscribe = function(subscriber) {
    this._throwIfClosed();
    return _super.prototype._trySubscribe.call(this, subscriber);
  };
  Subject2.prototype._subscribe = function(subscriber) {
    this._throwIfClosed();
    this._checkFinalizedStatuses(subscriber);
    return this._innerSubscribe(subscriber);
  };
  Subject2.prototype._innerSubscribe = function(subscriber) {
    var _this = this;
    var _a = this, hasError = _a.hasError, isStopped = _a.isStopped, observers = _a.observers;
    if (hasError || isStopped) {
      return EMPTY_SUBSCRIPTION;
    }
    this.currentObservers = null;
    observers.push(subscriber);
    return new Subscription(function() {
      _this.currentObservers = null;
      arrRemove(observers, subscriber);
    });
  };
  Subject2.prototype._checkFinalizedStatuses = function(subscriber) {
    var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, isStopped = _a.isStopped;
    if (hasError) {
      subscriber.error(thrownError);
    } else if (isStopped) {
      subscriber.complete();
    }
  };
  Subject2.prototype.asObservable = function() {
    var observable2 = new Observable();
    observable2.source = this;
    return observable2;
  };
  Subject2.create = function(destination, source) {
    return new AnonymousSubject(destination, source);
  };
  return Subject2;
}(Observable);
var AnonymousSubject = function(_super) {
  __extends(AnonymousSubject2, _super);
  function AnonymousSubject2(destination, source) {
    var _this = _super.call(this) || this;
    _this.destination = destination;
    _this.source = source;
    return _this;
  }
  AnonymousSubject2.prototype.next = function(value) {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.next) === null || _b === void 0 ? void 0 : _b.call(_a, value);
  };
  AnonymousSubject2.prototype.error = function(err) {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.call(_a, err);
  };
  AnonymousSubject2.prototype.complete = function() {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.complete) === null || _b === void 0 ? void 0 : _b.call(_a);
  };
  AnonymousSubject2.prototype._subscribe = function(subscriber) {
    var _a, _b;
    return (_b = (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber)) !== null && _b !== void 0 ? _b : EMPTY_SUBSCRIPTION;
  };
  return AnonymousSubject2;
}(Subject);

// node_modules/rxjs/dist/esm5/internal/observable/concat.js
function concat() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  return concatAll()(from(args, popScheduler(args)));
}

// node_modules/rxjs/dist/esm5/internal/observable/empty.js
var EMPTY = new Observable(function(subscriber) {
  return subscriber.complete();
});

// node_modules/rxjs/dist/esm5/internal/operators/distinctUntilChanged.js
function distinctUntilChanged(comparator, keySelector) {
  if (keySelector === void 0) {
    keySelector = identity;
  }
  comparator = comparator !== null && comparator !== void 0 ? comparator : defaultCompare;
  return operate(function(source, subscriber) {
    var previousKey;
    var first = true;
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      var currentKey = keySelector(value);
      if (first || !comparator(previousKey, currentKey)) {
        first = false;
        previousKey = currentKey;
        subscriber.next(value);
      }
    }));
  });
}
function defaultCompare(a, b) {
  return a === b;
}

// node_modules/rxjs/dist/esm5/internal/operators/filter.js
function filter(predicate, thisArg) {
  return operate(function(source, subscriber) {
    var index = 0;
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      return predicate.call(thisArg, value, index++) && subscriber.next(value);
    }));
  });
}

// node_modules/rxjs/dist/esm5/internal/util/EmptyError.js
var EmptyError = createErrorClass(function(_super) {
  return function EmptyErrorImpl() {
    _super(this);
    this.name = "EmptyError";
    this.message = "no elements in sequence";
  };
});

// node_modules/rxjs/dist/esm5/internal/operators/merge.js
function merge() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  var scheduler = popScheduler(args);
  var concurrent = popNumber(args, Infinity);
  return operate(function(source, subscriber) {
    mergeAll(concurrent)(from(__spreadArray([source], __read(args)), scheduler)).subscribe(subscriber);
  });
}

// node_modules/rxjs/dist/esm5/internal/operators/mergeWith.js
function mergeWith() {
  var otherSources = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    otherSources[_i] = arguments[_i];
  }
  return merge.apply(void 0, __spreadArray([], __read(otherSources)));
}

// node_modules/rxjs/dist/esm5/internal/BehaviorSubject.js
var BehaviorSubject = function(_super) {
  __extends(BehaviorSubject2, _super);
  function BehaviorSubject2(_value) {
    var _this = _super.call(this) || this;
    _this._value = _value;
    return _this;
  }
  Object.defineProperty(BehaviorSubject2.prototype, "value", {
    get: function() {
      return this.getValue();
    },
    enumerable: false,
    configurable: true
  });
  BehaviorSubject2.prototype._subscribe = function(subscriber) {
    var subscription = _super.prototype._subscribe.call(this, subscriber);
    !subscription.closed && subscriber.next(this._value);
    return subscription;
  };
  BehaviorSubject2.prototype.getValue = function() {
    var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, _value = _a._value;
    if (hasError) {
      throw thrownError;
    }
    this._throwIfClosed();
    return _value;
  };
  BehaviorSubject2.prototype.next = function(value) {
    _super.prototype.next.call(this, this._value = value);
  };
  return BehaviorSubject2;
}(Subject);

// node_modules/rxjs/dist/esm5/internal/ReplaySubject.js
var ReplaySubject = function(_super) {
  __extends(ReplaySubject2, _super);
  function ReplaySubject2(_bufferSize, _windowTime, _timestampProvider) {
    if (_bufferSize === void 0) {
      _bufferSize = Infinity;
    }
    if (_windowTime === void 0) {
      _windowTime = Infinity;
    }
    if (_timestampProvider === void 0) {
      _timestampProvider = dateTimestampProvider;
    }
    var _this = _super.call(this) || this;
    _this._bufferSize = _bufferSize;
    _this._windowTime = _windowTime;
    _this._timestampProvider = _timestampProvider;
    _this._buffer = [];
    _this._infiniteTimeWindow = true;
    _this._infiniteTimeWindow = _windowTime === Infinity;
    _this._bufferSize = Math.max(1, _bufferSize);
    _this._windowTime = Math.max(1, _windowTime);
    return _this;
  }
  ReplaySubject2.prototype.next = function(value) {
    var _a = this, isStopped = _a.isStopped, _buffer = _a._buffer, _infiniteTimeWindow = _a._infiniteTimeWindow, _timestampProvider = _a._timestampProvider, _windowTime = _a._windowTime;
    if (!isStopped) {
      _buffer.push(value);
      !_infiniteTimeWindow && _buffer.push(_timestampProvider.now() + _windowTime);
    }
    this._trimBuffer();
    _super.prototype.next.call(this, value);
  };
  ReplaySubject2.prototype._subscribe = function(subscriber) {
    this._throwIfClosed();
    this._trimBuffer();
    var subscription = this._innerSubscribe(subscriber);
    var _a = this, _infiniteTimeWindow = _a._infiniteTimeWindow, _buffer = _a._buffer;
    var copy = _buffer.slice();
    for (var i = 0; i < copy.length && !subscriber.closed; i += _infiniteTimeWindow ? 1 : 2) {
      subscriber.next(copy[i]);
    }
    this._checkFinalizedStatuses(subscriber);
    return subscription;
  };
  ReplaySubject2.prototype._trimBuffer = function() {
    var _a = this, _bufferSize = _a._bufferSize, _timestampProvider = _a._timestampProvider, _buffer = _a._buffer, _infiniteTimeWindow = _a._infiniteTimeWindow;
    var adjustedBufferSize = (_infiniteTimeWindow ? 1 : 2) * _bufferSize;
    _bufferSize < Infinity && adjustedBufferSize < _buffer.length && _buffer.splice(0, _buffer.length - adjustedBufferSize);
    if (!_infiniteTimeWindow) {
      var now3 = _timestampProvider.now();
      var last2 = 0;
      for (var i = 1; i < _buffer.length && _buffer[i] <= now3; i += 2) {
        last2 = i;
      }
      last2 && _buffer.splice(0, last2 + 1);
    }
  };
  return ReplaySubject2;
}(Subject);

// node_modules/rxjs/dist/esm5/internal/operators/share.js
function share(options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.connector, connector = _a === void 0 ? function() {
    return new Subject();
  } : _a, _b = options.resetOnError, resetOnError = _b === void 0 ? true : _b, _c = options.resetOnComplete, resetOnComplete = _c === void 0 ? true : _c, _d = options.resetOnRefCountZero, resetOnRefCountZero = _d === void 0 ? true : _d;
  return function(wrapperSource) {
    var connection;
    var resetConnection;
    var subject;
    var refCount = 0;
    var hasCompleted = false;
    var hasErrored = false;
    var cancelReset = function() {
      resetConnection === null || resetConnection === void 0 ? void 0 : resetConnection.unsubscribe();
      resetConnection = void 0;
    };
    var reset = function() {
      cancelReset();
      connection = subject = void 0;
      hasCompleted = hasErrored = false;
    };
    var resetAndUnsubscribe = function() {
      var conn = connection;
      reset();
      conn === null || conn === void 0 ? void 0 : conn.unsubscribe();
    };
    return operate(function(source, subscriber) {
      refCount++;
      if (!hasErrored && !hasCompleted) {
        cancelReset();
      }
      var dest = subject = subject !== null && subject !== void 0 ? subject : connector();
      subscriber.add(function() {
        refCount--;
        if (refCount === 0 && !hasErrored && !hasCompleted) {
          resetConnection = handleReset(resetAndUnsubscribe, resetOnRefCountZero);
        }
      });
      dest.subscribe(subscriber);
      if (!connection && refCount > 0) {
        connection = new SafeSubscriber({
          next: function(value) {
            return dest.next(value);
          },
          error: function(err) {
            hasErrored = true;
            cancelReset();
            resetConnection = handleReset(reset, resetOnError, err);
            dest.error(err);
          },
          complete: function() {
            hasCompleted = true;
            cancelReset();
            resetConnection = handleReset(reset, resetOnComplete);
            dest.complete();
          }
        });
        innerFrom(source).subscribe(connection);
      }
    })(wrapperSource);
  };
}
function handleReset(reset, on) {
  var args = [];
  for (var _i = 2; _i < arguments.length; _i++) {
    args[_i - 2] = arguments[_i];
  }
  if (on === true) {
    reset();
    return;
  }
  if (on === false) {
    return;
  }
  var onSubscriber = new SafeSubscriber({
    next: function() {
      onSubscriber.unsubscribe();
      reset();
    }
  });
  return innerFrom(on.apply(void 0, __spreadArray([], __read(args)))).subscribe(onSubscriber);
}

// node_modules/rxjs/dist/esm5/internal/operators/shareReplay.js
function shareReplay(configOrBufferSize, windowTime, scheduler) {
  var _a, _b, _c;
  var bufferSize;
  var refCount = false;
  if (configOrBufferSize && typeof configOrBufferSize === "object") {
    _a = configOrBufferSize.bufferSize, bufferSize = _a === void 0 ? Infinity : _a, _b = configOrBufferSize.windowTime, windowTime = _b === void 0 ? Infinity : _b, _c = configOrBufferSize.refCount, refCount = _c === void 0 ? false : _c, scheduler = configOrBufferSize.scheduler;
  } else {
    bufferSize = configOrBufferSize !== null && configOrBufferSize !== void 0 ? configOrBufferSize : Infinity;
  }
  return share({
    connector: function() {
      return new ReplaySubject(bufferSize, windowTime, scheduler);
    },
    resetOnError: true,
    resetOnComplete: false,
    resetOnRefCountZero: refCount
  });
}

// node_modules/rxjs/dist/esm5/internal/operators/startWith.js
function startWith() {
  var values = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    values[_i] = arguments[_i];
  }
  var scheduler = popScheduler(values);
  return operate(function(source, subscriber) {
    (scheduler ? concat(values, source, scheduler) : concat(values, source)).subscribe(subscriber);
  });
}

// node_modules/rxdb/dist/esm/rx-change-event.js
function getDocumentDataOfRxChangeEvent(rxChangeEvent) {
  if (rxChangeEvent.documentData) {
    return rxChangeEvent.documentData;
  } else {
    return rxChangeEvent.previousDocumentData;
  }
}
function rxChangeEventToEventReduceChangeEvent(rxChangeEvent) {
  switch (rxChangeEvent.operation) {
    case "INSERT":
      return {
        operation: rxChangeEvent.operation,
        id: rxChangeEvent.documentId,
        doc: rxChangeEvent.documentData,
        previous: null
      };
    case "UPDATE":
      return {
        operation: rxChangeEvent.operation,
        id: rxChangeEvent.documentId,
        doc: overwritable.deepFreezeWhenDevMode(rxChangeEvent.documentData),
        previous: rxChangeEvent.previousDocumentData ? rxChangeEvent.previousDocumentData : "UNKNOWN"
      };
    case "DELETE":
      return {
        operation: rxChangeEvent.operation,
        id: rxChangeEvent.documentId,
        doc: null,
        previous: rxChangeEvent.previousDocumentData
      };
  }
}
var EVENT_BULK_CACHE = /* @__PURE__ */ new Map();
function rxChangeEventBulkToRxChangeEvents(eventBulk) {
  return getFromMapOrCreate(EVENT_BULK_CACHE, eventBulk, () => {
    var events = new Array(eventBulk.events.length);
    var rawEvents = eventBulk.events;
    var collectionName = eventBulk.collectionName;
    var isLocal = eventBulk.isLocal;
    var deepFreezeWhenDevMode2 = overwritable.deepFreezeWhenDevMode;
    for (var index = 0; index < rawEvents.length; index++) {
      var event = rawEvents[index];
      events[index] = {
        documentId: event.documentId,
        collectionName,
        isLocal,
        operation: event.operation,
        documentData: deepFreezeWhenDevMode2(event.documentData),
        previousDocumentData: deepFreezeWhenDevMode2(event.previousDocumentData)
      };
    }
    return events;
  });
}

// node_modules/rxjs/dist/esm5/internal/firstValueFrom.js
function firstValueFrom(source, config2) {
  var hasConfig = typeof config2 === "object";
  return new Promise(function(resolve2, reject) {
    var subscriber = new SafeSubscriber({
      next: function(value) {
        resolve2(value);
        subscriber.unsubscribe();
      },
      error: reject,
      complete: function() {
        if (hasConfig) {
          resolve2(config2.defaultValue);
        } else {
          reject(new EmptyError());
        }
      }
    });
    source.subscribe(subscriber);
  });
}

// node_modules/rxjs/dist/esm5/internal/observable/merge.js
function merge2() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  var scheduler = popScheduler(args);
  var concurrent = popNumber(args, Infinity);
  var sources = args;
  return !sources.length ? EMPTY : sources.length === 1 ? innerFrom(sources[0]) : mergeAll(concurrent)(from(sources, scheduler));
}

// node_modules/rxdb/dist/esm/query-planner.js
var INDEX_MAX = String.fromCharCode(65535);
var INDEX_MIN = Number.MIN_SAFE_INTEGER;
function getQueryPlan(schema, query) {
  var selector = query.selector;
  var indexes = schema.indexes ? schema.indexes.slice(0) : [];
  if (query.index) {
    indexes = [query.index];
  }
  var hasDescSorting = !!query.sort.find((sortField) => Object.values(sortField)[0] === "desc");
  var sortIrrelevevantFields = /* @__PURE__ */ new Set();
  Object.keys(selector).forEach((fieldName) => {
    var schemaPart = getSchemaByObjectPath(schema, fieldName);
    if (schemaPart && schemaPart.type === "boolean" && Object.prototype.hasOwnProperty.call(selector[fieldName], "$eq")) {
      sortIrrelevevantFields.add(fieldName);
    }
  });
  var optimalSortIndex = query.sort.map((sortField) => Object.keys(sortField)[0]);
  var optimalSortIndexCompareString = optimalSortIndex.filter((f) => !sortIrrelevevantFields.has(f)).join(",");
  var currentBestQuality = -1;
  var currentBestQueryPlan;
  indexes.forEach((index) => {
    var inclusiveEnd = true;
    var inclusiveStart = true;
    var opts = index.map((indexField) => {
      var matcher = selector[indexField];
      var operators = matcher ? Object.keys(matcher) : [];
      var matcherOpts = {};
      if (!matcher || !operators.length) {
        var startKey = inclusiveStart ? INDEX_MIN : INDEX_MAX;
        matcherOpts = {
          startKey,
          endKey: inclusiveEnd ? INDEX_MAX : INDEX_MIN,
          inclusiveStart: true,
          inclusiveEnd: true
        };
      } else {
        operators.forEach((operator) => {
          if (LOGICAL_OPERATORS.has(operator)) {
            var operatorValue = matcher[operator];
            var partialOpts = getMatcherQueryOpts(operator, operatorValue);
            matcherOpts = Object.assign(matcherOpts, partialOpts);
          }
        });
      }
      if (typeof matcherOpts.startKey === "undefined") {
        matcherOpts.startKey = INDEX_MIN;
      }
      if (typeof matcherOpts.endKey === "undefined") {
        matcherOpts.endKey = INDEX_MAX;
      }
      if (typeof matcherOpts.inclusiveStart === "undefined") {
        matcherOpts.inclusiveStart = true;
      }
      if (typeof matcherOpts.inclusiveEnd === "undefined") {
        matcherOpts.inclusiveEnd = true;
      }
      if (inclusiveStart && !matcherOpts.inclusiveStart) {
        inclusiveStart = false;
      }
      if (inclusiveEnd && !matcherOpts.inclusiveEnd) {
        inclusiveEnd = false;
      }
      return matcherOpts;
    });
    var startKeys = opts.map((opt) => opt.startKey);
    var endKeys = opts.map((opt) => opt.endKey);
    var queryPlan = {
      index,
      startKeys,
      endKeys,
      inclusiveEnd,
      inclusiveStart,
      sortSatisfiedByIndex: !hasDescSorting && optimalSortIndexCompareString === index.filter((f) => !sortIrrelevevantFields.has(f)).join(","),
      selectorSatisfiedByIndex: isSelectorSatisfiedByIndex(index, query.selector, startKeys, endKeys)
    };
    var quality = rateQueryPlan(schema, query, queryPlan);
    if (quality >= currentBestQuality || query.index) {
      currentBestQuality = quality;
      currentBestQueryPlan = queryPlan;
    }
  });
  if (!currentBestQueryPlan) {
    throw newRxError("SNH", {
      query
    });
  }
  return currentBestQueryPlan;
}
var LOGICAL_OPERATORS = /* @__PURE__ */ new Set(["$eq", "$gt", "$gte", "$lt", "$lte"]);
var LOWER_BOUND_LOGICAL_OPERATORS = /* @__PURE__ */ new Set(["$eq", "$gt", "$gte"]);
var UPPER_BOUND_LOGICAL_OPERATORS = /* @__PURE__ */ new Set(["$eq", "$lt", "$lte"]);
function isSelectorSatisfiedByIndex(index, selector, startKeys, endKeys) {
  var selectorEntries = Object.entries(selector);
  var hasNonMatchingOperator = selectorEntries.find(([fieldName2, operation2]) => {
    if (!index.includes(fieldName2)) {
      return true;
    }
    var hasNonLogicOperator = Object.entries(operation2).find(([op, _value]) => !LOGICAL_OPERATORS.has(op));
    return hasNonLogicOperator;
  });
  if (hasNonMatchingOperator) {
    return false;
  }
  if (selector.$and || selector.$or) {
    return false;
  }
  var satisfieldLowerBound = [];
  var lowerOperatorFieldNames = /* @__PURE__ */ new Set();
  for (var [fieldName, operation] of Object.entries(selector)) {
    if (!index.includes(fieldName)) {
      return false;
    }
    var lowerLogicOps = Object.keys(operation).filter((key) => LOWER_BOUND_LOGICAL_OPERATORS.has(key));
    if (lowerLogicOps.length > 1) {
      return false;
    }
    var hasLowerLogicOp = lowerLogicOps[0];
    if (hasLowerLogicOp) {
      lowerOperatorFieldNames.add(fieldName);
    }
    if (hasLowerLogicOp !== "$eq") {
      if (satisfieldLowerBound.length > 0) {
        return false;
      } else {
        satisfieldLowerBound.push(hasLowerLogicOp);
      }
    }
  }
  var satisfieldUpperBound = [];
  var upperOperatorFieldNames = /* @__PURE__ */ new Set();
  for (var [_fieldName, _operation] of Object.entries(selector)) {
    if (!index.includes(_fieldName)) {
      return false;
    }
    var upperLogicOps = Object.keys(_operation).filter((key) => UPPER_BOUND_LOGICAL_OPERATORS.has(key));
    if (upperLogicOps.length > 1) {
      return false;
    }
    var hasUperLogicOp = upperLogicOps[0];
    if (hasUperLogicOp) {
      upperOperatorFieldNames.add(_fieldName);
    }
    if (hasUperLogicOp !== "$eq") {
      if (satisfieldUpperBound.length > 0) {
        return false;
      } else {
        satisfieldUpperBound.push(hasUperLogicOp);
      }
    }
  }
  var i = 0;
  for (var _fieldName2 of index) {
    for (var set of [lowerOperatorFieldNames, upperOperatorFieldNames]) {
      if (!set.has(_fieldName2) && set.size > 0) {
        return false;
      }
      set.delete(_fieldName2);
    }
    var startKey = startKeys[i];
    var endKey = endKeys[i];
    if (startKey !== endKey && lowerOperatorFieldNames.size > 0 && upperOperatorFieldNames.size > 0) {
      return false;
    }
    i++;
  }
  return true;
}
function getMatcherQueryOpts(operator, operatorValue) {
  switch (operator) {
    case "$eq":
      return {
        startKey: operatorValue,
        endKey: operatorValue,
        inclusiveEnd: true,
        inclusiveStart: true
      };
    case "$lte":
      return {
        endKey: operatorValue,
        inclusiveEnd: true
      };
    case "$gte":
      return {
        startKey: operatorValue,
        inclusiveStart: true
      };
    case "$lt":
      return {
        endKey: operatorValue,
        inclusiveEnd: false
      };
    case "$gt":
      return {
        startKey: operatorValue,
        inclusiveStart: false
      };
    default:
      throw new Error("SNH");
  }
}
function rateQueryPlan(schema, query, queryPlan) {
  var quality = 0;
  var addQuality = (value) => {
    if (value > 0) {
      quality = quality + value;
    }
  };
  var pointsPerMatchingKey = 10;
  var nonMinKeyCount = countUntilNotMatching(queryPlan.startKeys, (keyValue) => keyValue !== INDEX_MIN && keyValue !== INDEX_MAX);
  addQuality(nonMinKeyCount * pointsPerMatchingKey);
  var nonMaxKeyCount = countUntilNotMatching(queryPlan.startKeys, (keyValue) => keyValue !== INDEX_MAX && keyValue !== INDEX_MIN);
  addQuality(nonMaxKeyCount * pointsPerMatchingKey);
  var equalKeyCount = countUntilNotMatching(queryPlan.startKeys, (keyValue, idx) => {
    if (keyValue === queryPlan.endKeys[idx]) {
      return true;
    } else {
      return false;
    }
  });
  addQuality(equalKeyCount * pointsPerMatchingKey * 1.5);
  var pointsIfNoReSortMustBeDone = queryPlan.sortSatisfiedByIndex ? 5 : 0;
  addQuality(pointsIfNoReSortMustBeDone);
  return quality;
}

// node_modules/mingo/dist/esm/util.js
var MingoError = class extends Error {
};
var MISSING = Symbol("missing");
var CYCLE_FOUND_ERROR = Object.freeze(
  new Error("mingo: cycle detected while processing object/array")
);
var DEFAULT_HASH_FUNCTION = (value) => {
  const s = stringify(value);
  let hash = 0;
  let i = s.length;
  while (i) hash = (hash << 5) - hash ^ s.charCodeAt(--i);
  return hash >>> 0;
};
var isPrimitive = (v) => typeof v !== "object" && typeof v !== "function" || v === null;
var isScalar = (v) => isPrimitive(v) || isDate(v) || isRegExp(v);
var SORT_ORDER = {
  undefined: 1,
  null: 2,
  number: 3,
  string: 4,
  symbol: 5,
  object: 6,
  array: 7,
  arraybuffer: 8,
  boolean: 9,
  date: 10,
  regexp: 11,
  function: 12
};
var compare = (a, b) => {
  if (a === MISSING) a = void 0;
  if (b === MISSING) b = void 0;
  const [u, v] = [a, b].map((n) => SORT_ORDER[typeOf(n)]);
  if (u !== v) return u - v;
  if (isEqual(a, b)) return 0;
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
};
var ValueMap = class _ValueMap extends Map {
  // The hash function
  #hashFn = DEFAULT_HASH_FUNCTION;
  // maps the hashcode to key set
  #keyMap = /* @__PURE__ */ new Map();
  // returns a tuple of [<masterKey>, <hash>]. Expects an object key.
  #unpack = (key) => {
    const hash = this.#hashFn(key);
    return [(this.#keyMap.get(hash) || []).find((k) => isEqual(k, key)), hash];
  };
  constructor() {
    super();
  }
  /**
   * Returns a new {@link ValueMap} object.
   * @param fn An optional custom hash function
   */
  static init(fn) {
    const m = new _ValueMap();
    if (fn) m.#hashFn = fn;
    return m;
  }
  clear() {
    super.clear();
    this.#keyMap.clear();
  }
  /**
   * @returns true if an element in the Map existed and has been removed, or false if the element does not exist.
   */
  delete(key) {
    if (isPrimitive(key)) return super.delete(key);
    const [masterKey, hash] = this.#unpack(key);
    if (!super.delete(masterKey)) return false;
    this.#keyMap.set(
      hash,
      this.#keyMap.get(hash).filter((k) => !isEqual(k, masterKey))
    );
    return true;
  }
  /**
   * Returns a specified element from the Map object. If the value that is associated to the provided key is an object, then you will get a reference to that object and any change made to that object will effectively modify it inside the Map.
   * @returns Returns the element associated with the specified key. If no element is associated with the specified key, undefined is returned.
   */
  get(key) {
    if (isPrimitive(key)) return super.get(key);
    const [masterKey, _] = this.#unpack(key);
    return super.get(masterKey);
  }
  /**
   * @returns boolean indicating whether an element with the specified key exists or not.
   */
  has(key) {
    if (isPrimitive(key)) return super.has(key);
    const [masterKey, _] = this.#unpack(key);
    return super.has(masterKey);
  }
  /**
   * Adds a new element with a specified key and value to the Map. If an element with the same key already exists, the element will be updated.
   */
  set(key, value) {
    if (isPrimitive(key)) return super.set(key, value);
    const [masterKey, hash] = this.#unpack(key);
    if (super.has(masterKey)) {
      super.set(masterKey, value);
    } else {
      super.set(key, value);
      const keys = this.#keyMap.get(hash) || [];
      keys.push(key);
      this.#keyMap.set(hash, keys);
    }
    return this;
  }
  /**
   * @returns the number of elements in the Map.
   */
  get size() {
    return super.size;
  }
};
function assert(condition, message) {
  if (!condition) throw new MingoError(message);
}
var typeOf = (v) => {
  const s = Object.prototype.toString.call(v);
  const t = s.substring(8, s.length - 1).toLowerCase();
  if (t !== "object") return t;
  const ctor = v.constructor;
  return ctor == null || ctor === Object ? t : ctor.name;
};
var isBoolean = (v) => typeof v === "boolean";
var isString = (v) => typeof v === "string";
var isSymbol = (v) => typeof v === "symbol";
var isNumber = (v) => !isNaN(v) && typeof v === "number";
var isArray3 = Array.isArray;
var isObject2 = (v) => {
  if (!v) return false;
  const p = Object.getPrototypeOf(v);
  return (p === Object.prototype || p === null) && typeOf(v) === "object";
};
var isObjectLike = (v) => !isPrimitive(v);
var isDate = (v) => v instanceof Date;
var isRegExp = (v) => v instanceof RegExp;
var isFunction2 = (v) => typeof v === "function";
var isNil = (v) => v === null || v === void 0;
var truthy = (arg, strict = true) => !!arg || strict && arg === "";
var isEmpty = (x) => isNil(x) || isString(x) && !x || isArray3(x) && x.length === 0 || isObject2(x) && Object.keys(x).length === 0;
var ensureArray = (x) => isArray3(x) ? x : [x];
var has = (obj, prop) => !!obj && Object.prototype.hasOwnProperty.call(obj, prop);
var isTypedArray = (v) => typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView(v);
var cloneDeep = (v, refs) => {
  if (isNil(v) || isBoolean(v) || isNumber(v) || isString(v)) return v;
  if (isDate(v)) return new Date(v);
  if (isRegExp(v)) return new RegExp(v);
  if (isTypedArray(v)) {
    const ctor = v.constructor;
    return new ctor(v);
  }
  if (!(refs instanceof Set)) refs = /* @__PURE__ */ new Set();
  if (refs.has(v)) throw CYCLE_FOUND_ERROR;
  refs.add(v);
  try {
    if (isArray3(v)) {
      const arr = new Array(v.length);
      for (let i = 0; i < v.length; i++) arr[i] = cloneDeep(v[i], refs);
      return arr;
    }
    if (isObject2(v)) {
      const obj = {};
      for (const k of Object.keys(v)) obj[k] = cloneDeep(v[k], refs);
      return obj;
    }
  } finally {
    refs.delete(v);
  }
  return v;
};
var isMissing = (v) => v === MISSING;
function merge3(target, input) {
  if (isMissing(target) || isNil(target)) return input;
  if (isMissing(input) || isNil(input)) return target;
  if (isPrimitive(target) || isPrimitive(input)) return input;
  if (isArray3(target) && isArray3(input)) {
    assert(
      target.length === input.length,
      "arrays must be of equal length to merge."
    );
  }
  for (const k of Object.keys(input)) {
    target[k] = merge3(target[k], input[k]);
  }
  return target;
}
function intersection(input, hashFunction = DEFAULT_HASH_FUNCTION) {
  const vmaps = [ValueMap.init(hashFunction), ValueMap.init(hashFunction)];
  if (input.length === 0) return [];
  if (input.some((arr) => arr.length === 0)) return [];
  if (input.length === 1) return [...input];
  input[input.length - 1].forEach((v) => vmaps[0].set(v, true));
  for (let i = input.length - 2; i > -1; i--) {
    input[i].forEach((v) => {
      if (vmaps[0].has(v)) vmaps[1].set(v, true);
    });
    if (vmaps[1].size === 0) return [];
    vmaps.reverse();
    vmaps[1].clear();
  }
  return Array.from(vmaps[0].keys());
}
function flatten(xs, depth = 1) {
  const arr = new Array();
  function flatten2(ys, n) {
    for (let i = 0, len = ys.length; i < len; i++) {
      if (isArray3(ys[i]) && (n > 0 || n < 0)) {
        flatten2(ys[i], Math.max(-1, n - 1));
      } else {
        arr.push(ys[i]);
      }
    }
  }
  flatten2(xs, depth);
  return arr;
}
var objToString = Object.prototype.toString;
function hasCustomToString(o) {
  if (isTypedArray(o)) return true;
  if (typeof o.toString === "function") {
    let proto = Object.getPrototypeOf(o);
    while (proto !== null) {
      if (has(proto, "toString") && proto.toString !== objToString) {
        return true;
      }
      proto = Object.getPrototypeOf(proto);
    }
  }
  return false;
}
function isEqual(a, b) {
  if (a === b || Object.is(a, b)) return true;
  if (a === null || b === null) return false;
  if (typeof a !== typeof b) return false;
  if (typeof a !== "object") return false;
  if (a.constructor !== b.constructor) return false;
  if (a instanceof Date) return +a === +b;
  if (a instanceof RegExp) return a.toString() === b.toString();
  const ctor = a.constructor;
  if (ctor === Array || ctor === Object) {
    const aKeys = Object.keys(a).sort();
    const bKeys = Object.keys(b).sort();
    if (aKeys.length !== bKeys.length) return false;
    for (let i = 0, k = aKeys[i]; i < aKeys.length; k = aKeys[++i]) {
      if (k !== bKeys[i] || !isEqual(a[k], b[k])) return false;
    }
    return true;
  }
  return hasCustomToString(a) && a.toString() === b.toString();
}
var stringify = (v, refs) => {
  if (v === null) return "null";
  if (v === void 0) return "undefined";
  if (isString(v) || isNumber(v) || isBoolean(v)) return JSON.stringify(v);
  if (isDate(v)) return v.toISOString();
  if (isRegExp(v) || isSymbol(v) || isFunction2(v))
    return v.toString();
  if (isTypedArray(v))
    return typeOf(v) + "[" + v.toString() + "]";
  if (!(refs instanceof Set)) refs = /* @__PURE__ */ new Set();
  if (refs.has(v)) throw CYCLE_FOUND_ERROR;
  try {
    refs.add(v);
    if (isArray3(v)) return "[" + v.map((s) => stringify(s, refs)).join(",") + "]";
    if (isObject2(v)) {
      const keys = Object.keys(v).sort();
      return "{" + keys.map((k) => `${k}:${stringify(v[k], refs)}`).join() + "}";
    }
    if (hasCustomToString(v)) {
      return typeOf(v) + "(" + JSON.stringify(v.toString()) + ")";
    }
    throw new Error(
      "mingo: cannot stringify custom type without explicit toString() method."
    );
  } finally {
    refs.delete(v);
  }
};
function hashCode(value, hashFunction) {
  if (isNil(value)) return null;
  hashFunction = hashFunction || DEFAULT_HASH_FUNCTION;
  return hashFunction(value);
}
function groupBy(collection, keyFn, hashFunction = DEFAULT_HASH_FUNCTION) {
  if (collection.length < 1) return /* @__PURE__ */ new Map();
  const lookup = /* @__PURE__ */ new Map();
  const result = /* @__PURE__ */ new Map();
  for (let i = 0; i < collection.length; i++) {
    const obj = collection[i];
    const key = keyFn(obj, i);
    const hash = hashCode(key, hashFunction);
    if (hash === null) {
      if (result.has(null)) {
        result.get(null).push(obj);
      } else {
        result.set(null, [obj]);
      }
    } else {
      const existingKey = lookup.has(hash) ? lookup.get(hash).find((k) => isEqual(k, key)) : null;
      if (isNil(existingKey)) {
        result.set(key, [obj]);
        if (lookup.has(hash)) {
          lookup.get(hash).push(key);
        } else {
          lookup.set(hash, [key]);
        }
      } else {
        result.get(existingKey).push(obj);
      }
    }
  }
  return result;
}
function getValue(obj, key) {
  return isArray3(obj) || isObject2(obj) ? obj[key] : void 0;
}
function unwrap(arr, depth) {
  if (depth < 1) return arr;
  while (depth-- && arr.length === 1) arr = arr[0];
  return arr;
}
function resolve(obj, selector, options) {
  let depth = 0;
  function resolve2(o, path) {
    let value = o;
    for (let i = 0; i < path.length; i++) {
      const field = path[i];
      const isText = /^\d+$/.exec(field) === null;
      if (isText && isArray3(value)) {
        if (i === 0 && depth > 0) break;
        depth += 1;
        const subpath = path.slice(i);
        value = value.reduce((acc, item) => {
          const v = resolve2(item, subpath);
          if (v !== void 0) acc.push(v);
          return acc;
        }, []);
        break;
      } else {
        value = getValue(value, field);
      }
      if (value === void 0) break;
    }
    return value;
  }
  const res = isScalar(obj) ? obj : resolve2(obj, selector.split("."));
  return isArray3(res) && options?.unwrapArray ? unwrap(res, depth) : res;
}
function resolveGraph(obj, selector, options) {
  const sep = selector.indexOf(".");
  const key = sep == -1 ? selector : selector.substring(0, sep);
  const next = selector.substring(sep + 1);
  const hasNext = sep != -1;
  if (isArray3(obj)) {
    const isIndex = /^\d+$/.test(key);
    const arr = isIndex && options?.preserveIndex ? [...obj] : [];
    if (isIndex) {
      const index = parseInt(key);
      let value2 = getValue(obj, index);
      if (hasNext) {
        value2 = resolveGraph(value2, next, options);
      }
      if (options?.preserveIndex) {
        arr[index] = value2;
      } else {
        arr.push(value2);
      }
    } else {
      for (const item of obj) {
        const value2 = resolveGraph(item, selector, options);
        if (options?.preserveMissing) {
          arr.push(value2 == void 0 ? MISSING : value2);
        } else if (value2 != void 0 || options?.preserveIndex) {
          arr.push(value2);
        }
      }
    }
    return arr;
  }
  const res = options?.preserveKeys ? { ...obj } : {};
  let value = getValue(obj, key);
  if (hasNext) {
    value = resolveGraph(value, next, options);
  }
  if (value === void 0) return void 0;
  res[key] = value;
  return res;
}
function filterMissing(obj) {
  if (isArray3(obj)) {
    for (let i = obj.length - 1; i >= 0; i--) {
      if (obj[i] === MISSING) {
        obj.splice(i, 1);
      } else {
        filterMissing(obj[i]);
      }
    }
  } else if (isObject2(obj)) {
    for (const k in obj) {
      if (has(obj, k)) {
        filterMissing(obj[k]);
      }
    }
  }
}
var NUMBER_RE = /^\d+$/;
function walk(obj, selector, fn, options) {
  const names = selector.split(".");
  const key = names[0];
  const next = names.slice(1).join(".");
  if (names.length === 1) {
    if (isObject2(obj) || isArray3(obj) && NUMBER_RE.test(key)) {
      fn(obj, key);
    }
  } else {
    if (options?.buildGraph && isNil(obj[key])) {
      obj[key] = {};
    }
    const item = obj[key];
    if (!item) return;
    const isNextArrayIndex = !!(names.length > 1 && NUMBER_RE.test(names[1]));
    if (isArray3(item) && options?.descendArray && !isNextArrayIndex) {
      item.forEach((e) => walk(e, next, fn, options));
    } else {
      walk(item, next, fn, options);
    }
  }
}
function setValue(obj, selector, value) {
  walk(
    obj,
    selector,
    (item, key) => {
      item[key] = isFunction2(value) ? value(item[key]) : value;
    },
    { buildGraph: true }
  );
}
function removeValue(obj, selector, options) {
  walk(
    obj,
    selector,
    (item, key) => {
      if (isArray3(item)) {
        if (/^\d+$/.test(key)) {
          item.splice(parseInt(key), 1);
        } else if (options && options.descendArray) {
          for (const elem of item) {
            if (isObject2(elem)) {
              delete elem[key];
            }
          }
        }
      } else if (isObject2(item)) {
        delete item[key];
      }
    },
    options
  );
}
var OPERATOR_NAME_PATTERN = /^\$[a-zA-Z0-9_]+$/;
function isOperator(name) {
  return OPERATOR_NAME_PATTERN.test(name);
}
function normalize(expr) {
  if (isScalar(expr)) {
    return isRegExp(expr) ? { $regex: expr } : { $eq: expr };
  }
  if (isObjectLike(expr)) {
    if (!Object.keys(expr).some(isOperator)) return { $eq: expr };
    if (has(expr, "$regex")) {
      const newExpr = { ...expr };
      newExpr["$regex"] = new RegExp(
        expr["$regex"],
        expr["$options"]
      );
      delete newExpr["$options"];
      return newExpr;
    }
  }
  return expr;
}

// node_modules/mingo/dist/esm/core.js
var ProcessingMode = /* @__PURE__ */ ((ProcessingMode2) => {
  ProcessingMode2[ProcessingMode2["CLONE_OFF"] = 0] = "CLONE_OFF";
  ProcessingMode2[ProcessingMode2["CLONE_INPUT"] = 1] = "CLONE_INPUT";
  ProcessingMode2[ProcessingMode2["CLONE_OUTPUT"] = 2] = "CLONE_OUTPUT";
  ProcessingMode2[ProcessingMode2["CLONE_ALL"] = 3] = "CLONE_ALL";
  return ProcessingMode2;
})(ProcessingMode || {});
var ComputeOptions = class _ComputeOptions {
  #options;
  /** Reference to the root object when processing subgraphs of the object. */
  #root;
  #local;
  constructor(options, root, local) {
    this.#options = options;
    this.update(root, local);
  }
  /**
   * Initialize new ComputeOptions.
   * @returns {ComputeOptions}
   */
  static init(options, root, local) {
    return !(options instanceof _ComputeOptions) ? new _ComputeOptions(options, root, local) : new _ComputeOptions(options.#options, options.root ?? root, {
      ...options.#local,
      ...local,
      variables: Object.assign(
        {},
        options.#local?.variables,
        local?.variables
      )
    });
  }
  /**
   * Updates the internal state.
   *
   * @param root The new root context for this object.
   * @param local The new local state to merge into current if it exists.
   * @returns
   */
  update(root, local) {
    this.#root = root;
    const variables = Object.assign(
      {},
      this.#local?.variables,
      local?.variables
    );
    if (Object.keys(variables).length) {
      this.#local = { ...local, variables };
    } else {
      this.#local = local ?? {};
    }
    return this;
  }
  getOptions() {
    return Object.freeze({
      ...this.#options,
      context: Context.from(this.#options.context)
    });
  }
  get root() {
    return this.#root;
  }
  get local() {
    return this.#local;
  }
  get idKey() {
    return this.#options.idKey;
  }
  get collation() {
    return this.#options?.collation;
  }
  get processingMode() {
    return this.#options?.processingMode || 0;
  }
  get useStrictMode() {
    return this.#options?.useStrictMode;
  }
  get scriptEnabled() {
    return this.#options?.scriptEnabled;
  }
  get useGlobalContext() {
    return this.#options?.useGlobalContext;
  }
  get hashFunction() {
    return this.#options?.hashFunction;
  }
  get collectionResolver() {
    return this.#options?.collectionResolver;
  }
  get jsonSchemaValidator() {
    return this.#options?.jsonSchemaValidator;
  }
  get variables() {
    return this.#options?.variables;
  }
  get context() {
    return this.#options?.context;
  }
};
function initOptions(options) {
  return options instanceof ComputeOptions ? options.getOptions() : Object.freeze({
    idKey: "_id",
    scriptEnabled: true,
    useStrictMode: true,
    useGlobalContext: true,
    processingMode: 0,
    ...options,
    context: options?.context ? Context.from(options?.context) : Context.init()
  });
}
var OperatorType = /* @__PURE__ */ ((OperatorType2) => {
  OperatorType2["ACCUMULATOR"] = "accumulator";
  OperatorType2["EXPRESSION"] = "expression";
  OperatorType2["PIPELINE"] = "pipeline";
  OperatorType2["PROJECTION"] = "projection";
  OperatorType2["QUERY"] = "query";
  OperatorType2["WINDOW"] = "window";
  return OperatorType2;
})(OperatorType || {});
var Context = class _Context {
  #operators = /* @__PURE__ */ new Map();
  constructor() {
  }
  static init() {
    return new _Context();
  }
  static from(ctx) {
    const instance = _Context.init();
    if (isNil(ctx)) return instance;
    ctx.#operators.forEach((v, k) => instance.addOperators(k, v));
    return instance;
  }
  addOperators(type5, operators) {
    if (!this.#operators.has(type5)) this.#operators.set(type5, {});
    for (const [name, fn] of Object.entries(operators)) {
      if (!this.getOperator(type5, name)) {
        this.#operators.get(type5)[name] = fn;
      }
    }
    return this;
  }
  getOperator(type5, name) {
    const ops = this.#operators.get(type5) ?? {};
    return ops[name] ?? null;
  }
  addAccumulatorOps(ops) {
    return this.addOperators("accumulator", ops);
  }
  addExpressionOps(ops) {
    return this.addOperators("expression", ops);
  }
  addQueryOps(ops) {
    return this.addOperators("query", ops);
  }
  addPipelineOps(ops) {
    return this.addOperators("pipeline", ops);
  }
  addProjectionOps(ops) {
    return this.addOperators("projection", ops);
  }
  addWindowOps(ops) {
    return this.addOperators("window", ops);
  }
};
var GLOBAL_CONTEXT = Context.init();
function useOperators(type5, operators) {
  for (const [name, fn] of Object.entries(operators)) {
    assert(
      isFunction2(fn) && isOperator(name),
      `'${name}' is not a valid operator`
    );
    const currentFn = getOperator(type5, name, null);
    assert(
      !currentFn || fn === currentFn,
      `${name} already exists for '${type5}' operators. Cannot change operator function once registered.`
    );
  }
  switch (type5) {
    case "accumulator":
      GLOBAL_CONTEXT.addAccumulatorOps(operators);
      break;
    case "expression":
      GLOBAL_CONTEXT.addExpressionOps(operators);
      break;
    case "pipeline":
      GLOBAL_CONTEXT.addPipelineOps(operators);
      break;
    case "projection":
      GLOBAL_CONTEXT.addProjectionOps(operators);
      break;
    case "query":
      GLOBAL_CONTEXT.addQueryOps(operators);
      break;
    case "window":
      GLOBAL_CONTEXT.addWindowOps(operators);
      break;
  }
}
function getOperator(type5, name, options) {
  const { context: ctx, useGlobalContext: fallback } = options || {};
  const fn = ctx ? ctx.getOperator(type5, name) : null;
  return !fn && fallback ? GLOBAL_CONTEXT.getOperator(type5, name) : fn;
}
function computeValue(obj, expr, operator, options) {
  const copts = ComputeOptions.init(options, obj);
  return !!operator && isOperator(operator) ? computeOperator(obj, expr, operator, copts) : computeExpression(obj, expr, copts);
}
var SYSTEM_VARS = ["$$ROOT", "$$CURRENT", "$$REMOVE", "$$NOW"];
function computeExpression(obj, expr, options) {
  if (isString(expr) && expr.length > 0 && expr[0] === "$") {
    if (REDACT_ACTIONS.includes(expr)) return expr;
    let ctx = options.root;
    const arr = expr.split(".");
    if (SYSTEM_VARS.includes(arr[0])) {
      switch (arr[0]) {
        case "$$ROOT":
          break;
        case "$$CURRENT":
          ctx = obj;
          break;
        case "$$REMOVE":
          ctx = void 0;
          break;
        case "$$NOW":
          ctx = /* @__PURE__ */ new Date();
          break;
      }
      expr = expr.slice(arr[0].length + 1);
    } else if (arr[0].slice(0, 2) === "$$") {
      ctx = Object.assign(
        {},
        // global vars
        options.variables,
        // current item is added before local variables because the binding may be changed.
        { this: obj },
        // local vars
        options?.local?.variables
      );
      const name = arr[0].slice(2);
      assert(has(ctx, name), `Use of undefined variable: ${name}`);
      expr = expr.slice(2);
    } else {
      expr = expr.slice(1);
    }
    return expr === "" ? ctx : resolve(ctx, expr);
  }
  if (isArray3(expr)) {
    return expr.map((item) => computeExpression(obj, item, options));
  }
  if (isObject2(expr)) {
    const result = {};
    const elems = Object.entries(expr);
    for (const [key, val] of elems) {
      if (isOperator(key)) {
        assert(elems.length == 1, "expression must have single operator.");
        return computeOperator(obj, val, key, options);
      }
      result[key] = computeExpression(obj, val, options);
    }
    return result;
  }
  return expr;
}
function computeOperator(obj, expr, operator, options) {
  const callExpression = getOperator(
    "expression",
    operator,
    options
  );
  if (callExpression) return callExpression(obj, expr, options);
  const callAccumulator = getOperator(
    "accumulator",
    operator,
    options
  );
  assert(!!callAccumulator, `accumulator '${operator}' is not registered.`);
  if (!isArray3(obj)) {
    obj = computeExpression(obj, expr, options);
    expr = null;
  }
  assert(isArray3(obj), `arguments must resolve to array for ${operator}.`);
  return callAccumulator(
    obj,
    expr,
    options.update(null, options.local)
    // reset the root object.
  );
}
var REDACT_ACTIONS = ["$$KEEP", "$$PRUNE", "$$DESCEND"];

// node_modules/mingo/dist/esm/lazy.js
function Lazy(source) {
  return source instanceof Iterator2 ? source : new Iterator2(source);
}
function concat2(...iterators) {
  let index = 0;
  return Lazy(() => {
    while (index < iterators.length) {
      const o = iterators[index].next();
      if (!o.done) return o;
      index++;
    }
    return { done: true };
  });
}
function isGenerator(o) {
  return !!o && typeof o === "object" && o?.next instanceof Function;
}
function dropItem(array, i) {
  const rest = array.slice(i + 1);
  array.splice(i);
  Array.prototype.push.apply(array, rest);
}
var DONE = new Error();
function createCallback(nextFn, iteratees, buffer) {
  let done = false;
  let index = -1;
  let bufferIndex = 0;
  return function(storeResult) {
    try {
      outer: while (!done) {
        let o = nextFn();
        index++;
        let i = -1;
        const size = iteratees.length;
        let innerDone = false;
        while (++i < size) {
          const r = iteratees[i];
          switch (r.action) {
            case 0:
              o = r.func(o, index);
              break;
            case 1:
              if (!r.func(o, index)) continue outer;
              break;
            case 2:
              --r.count;
              if (!r.count) innerDone = true;
              break;
            case 3:
              --r.count;
              if (!r.count) dropItem(iteratees, i);
              continue outer;
            default:
              break outer;
          }
        }
        done = innerDone;
        if (storeResult) {
          buffer[bufferIndex++] = o;
        } else {
          return { value: o, done: false };
        }
      }
    } catch (e) {
      if (e !== DONE) throw e;
    }
    done = true;
    return { done };
  };
}
var Iterator2 = class {
  /**
   * @param {*} source An iterable object or function.
   *    Array - return one element per cycle
   *    Object{next:Function} - call next() for the next value (this also handles generator functions)
   *    Function - call to return the next value
   * @param {Function} fn An optional transformation function
   */
  constructor(source) {
    this.#iteratees = [];
    this.#yieldedValues = [];
    this.isDone = false;
    let nextVal;
    if (source instanceof Function) {
      source = { next: source };
    }
    if (isGenerator(source)) {
      const src = source;
      nextVal = () => {
        const o = src.next();
        if (o.done) throw DONE;
        return o.value;
      };
    } else if (isArray3(source)) {
      const data = source;
      const size = data.length;
      let index = 0;
      nextVal = () => {
        if (index < size) return data[index++];
        throw DONE;
      };
    } else if (!(source instanceof Function)) {
      throw new MingoError(
        `Lazy must be initialized with an array, generator, or function.`
      );
    }
    this.#getNext = createCallback(
      nextVal,
      this.#iteratees,
      this.#yieldedValues
    );
  }
  #iteratees;
  #yieldedValues;
  #getNext;
  /**
   * Add an iteratee to this lazy sequence
   */
  push(action, value) {
    if (typeof value === "function") {
      this.#iteratees.push({ action, func: value });
    } else if (typeof value === "number") {
      this.#iteratees.push({ action, count: value });
    }
    return this;
  }
  next() {
    return this.#getNext();
  }
  // Iteratees methods
  /**
   * Transform each item in the sequence to a new value
   * @param {Function} f
   */
  map(f) {
    return this.push(0, f);
  }
  /**
   * Select only items matching the given predicate
   * @param {Function} pred
   */
  filter(predicate) {
    return this.push(1, predicate);
  }
  /**
   * Take given numbe for values from sequence
   * @param {Number} n A number greater than 0
   */
  take(n) {
    return n > 0 ? this.push(2, n) : this;
  }
  /**
   * Drop a number of values from the sequence
   * @param {Number} n Number of items to drop greater than 0
   */
  drop(n) {
    return n > 0 ? this.push(3, n) : this;
  }
  // Transformations
  /**
   * Returns a new lazy object with results of the transformation
   * The entire sequence is realized.
   *
   * @param {Callback<Source, Any[]>} fn Tranform function of type (Array) => (Any)
   */
  transform(fn) {
    const self2 = this;
    let iter;
    return Lazy(() => {
      if (!iter) {
        iter = Lazy(fn(self2.value()));
      }
      return iter.next();
    });
  }
  // Terminal methods
  /**
   * Returns the fully realized values of the iterators.
   * The return value will be an array unless `lazy.first()` was used.
   * The realized values are cached for subsequent calls.
   */
  value() {
    if (!this.isDone) {
      this.isDone = this.#getNext(true).done;
    }
    return this.#yieldedValues;
  }
  /**
   * Execute the funcion for each value. Will stop when an execution returns false.
   * @param {Function} f
   * @returns {Boolean} false iff `f` return false for AnyVal execution, otherwise true
   */
  each(f) {
    for (; ; ) {
      const o = this.next();
      if (o.done) break;
      if (f(o.value) === false) return false;
    }
    return true;
  }
  /**
   * Returns the reduction of sequence according the reducing function
   *
   * @param {*} f a reducing function
   * @param {*} initialValue
   */
  reduce(f, initialValue) {
    let o = this.next();
    if (initialValue === void 0 && !o.done) {
      initialValue = o.value;
      o = this.next();
    }
    while (!o.done) {
      initialValue = f(initialValue, o.value);
      o = this.next();
    }
    return initialValue;
  }
  /**
   * Returns the number of matched items in the sequence
   */
  size() {
    return this.reduce(
      (acc, _) => ++acc,
      0
    );
  }
  [Symbol.iterator]() {
    return this;
  }
};

// node_modules/mingo/dist/esm/operators/pipeline/limit.js
var $limit = (collection, expr, _options) => collection.take(expr);

// node_modules/mingo/dist/esm/operators/pipeline/project.js
var $project = (collection, expr, options) => {
  if (isEmpty(expr)) return collection;
  validateExpression(expr, options);
  return collection.map(createHandler(expr, ComputeOptions.init(options)));
};
function createHandler(expr, options, isRoot = true) {
  const idKey = options.idKey;
  const expressionKeys = Object.keys(expr);
  const excludedKeys = new Array();
  const includedKeys = new Array();
  const handlers = {};
  for (const key of expressionKeys) {
    const subExpr = expr[key];
    if (isNumber(subExpr) || isBoolean(subExpr)) {
      if (subExpr) {
        includedKeys.push(key);
      } else {
        excludedKeys.push(key);
      }
    } else if (isArray3(subExpr)) {
      handlers[key] = (o) => subExpr.map((v) => computeValue(o, v, null, options.update(o)) ?? null);
    } else if (isObject2(subExpr)) {
      const subExprKeys = Object.keys(subExpr);
      const operator = subExprKeys.length == 1 ? subExprKeys[0] : "";
      const projectFn = getOperator(
        "projection",
        operator,
        options
      );
      if (projectFn) {
        const foundSlice = operator === "$slice";
        if (foundSlice && !ensureArray(subExpr[operator]).every(isNumber)) {
          handlers[key] = (o) => computeValue(o, subExpr, key, options.update(o));
        } else {
          handlers[key] = (o) => projectFn(o, subExpr[operator], key, options.update(o));
        }
      } else if (isOperator(operator)) {
        handlers[key] = (o) => computeValue(o, subExpr[operator], operator, options);
      } else {
        validateExpression(subExpr, options);
        handlers[key] = (o) => {
          if (!has(o, key)) return computeValue(o, subExpr, null, options);
          if (isRoot) options.update(o);
          const target = resolve(o, key);
          const fn = createHandler(subExpr, options, false);
          if (isArray3(target)) return target.map(fn);
          if (isObject2(target)) return fn(target);
          return fn(o);
        };
      }
    } else {
      handlers[key] = isString(subExpr) && subExpr[0] === "$" ? (o) => computeValue(o, subExpr, key, options) : (_) => subExpr;
    }
  }
  const handlerKeys = Object.keys(handlers);
  const idKeyExcluded = excludedKeys.includes(idKey);
  const idKeyOnlyExcluded = isRoot && idKeyExcluded && excludedKeys.length === 1 && !includedKeys.length && !handlerKeys.length;
  if (idKeyOnlyExcluded) {
    return (o) => {
      const newObj = { ...o };
      delete newObj[idKey];
      return newObj;
    };
  }
  const idKeyImplicit = isRoot && !idKeyExcluded && !includedKeys.includes(idKey);
  const opts = {
    preserveMissing: true
  };
  return (o) => {
    const newObj = {};
    if (excludedKeys.length && !includedKeys.length) {
      merge3(newObj, o);
      for (const k of excludedKeys) {
        removeValue(newObj, k, { descendArray: true });
      }
    }
    for (const k of includedKeys) {
      const pathObj = resolveGraph(o, k, opts) ?? {};
      merge3(newObj, pathObj);
    }
    if (includedKeys.length) filterMissing(newObj);
    for (const k of handlerKeys) {
      const value = handlers[k](o);
      if (value === void 0) {
        removeValue(newObj, k, { descendArray: true });
      } else {
        setValue(newObj, k, value);
      }
    }
    if (idKeyImplicit && has(o, idKey)) {
      newObj[idKey] = resolve(o, idKey);
    }
    return newObj;
  };
}
function validateExpression(expr, options) {
  let exclusions = false;
  let inclusions = false;
  for (const [k, v] of Object.entries(expr)) {
    assert(!k.startsWith("$"), "Field names may not start with '$'.");
    assert(
      !k.endsWith(".$"),
      "Positional projection operator '$' is not supported."
    );
    if (k === options?.idKey) continue;
    if (v === 0 || v === false) {
      exclusions = true;
    } else if (v === 1 || v === true) {
      inclusions = true;
    }
    assert(
      !(exclusions && inclusions),
      "Projection cannot have a mix of inclusion and exclusion."
    );
  }
}

// node_modules/mingo/dist/esm/operators/pipeline/skip.js
var $skip = (collection, expr, _options) => {
  return collection.drop(expr);
};

// node_modules/mingo/dist/esm/operators/pipeline/sort.js
var $sort = (collection, sortKeys, options) => {
  if (isEmpty(sortKeys) || !isObject2(sortKeys)) return collection;
  let cmp2 = compare;
  const collationSpec = options.collation;
  if (isObject2(collationSpec) && isString(collationSpec.locale)) {
    cmp2 = collationComparator(collationSpec);
  }
  return collection.transform((coll) => {
    const modifiers = Object.keys(sortKeys);
    for (const key of modifiers.reverse()) {
      const groups = groupBy(
        coll,
        (obj) => resolve(obj, key),
        options.hashFunction
      );
      const sortedKeys = Array.from(groups.keys()).sort(cmp2);
      if (sortKeys[key] === -1) sortedKeys.reverse();
      let i = 0;
      for (const k of sortedKeys) for (const v of groups.get(k)) coll[i++] = v;
      assert(i == coll.length, "bug: counter must match collection size.");
    }
    return coll;
  });
};
var COLLATION_STRENGTH = {
  // Only strings that differ in base letters compare as unequal. Examples: a ≠ b, a = á, a = A.
  1: "base",
  //  Only strings that differ in base letters or accents and other diacritic marks compare as unequal.
  // Examples: a ≠ b, a ≠ á, a = A.
  2: "accent",
  // Strings that differ in base letters, accents and other diacritic marks, or case compare as unequal.
  // Other differences may also be taken into consideration. Examples: a ≠ b, a ≠ á, a ≠ A
  3: "variant"
  // case - Only strings that differ in base letters or case compare as unequal. Examples: a ≠ b, a = á, a ≠ A.
};
function collationComparator(spec) {
  const localeOpt = {
    sensitivity: COLLATION_STRENGTH[spec.strength || 3],
    caseFirst: spec.caseFirst === "off" ? "false" : spec.caseFirst || "false",
    numeric: spec.numericOrdering || false,
    ignorePunctuation: spec.alternate === "shifted"
  };
  if ((spec.caseLevel || false) === true) {
    if (localeOpt.sensitivity === "base") localeOpt.sensitivity = "case";
    if (localeOpt.sensitivity === "accent") localeOpt.sensitivity = "variant";
  }
  const collator = new Intl.Collator(spec.locale, localeOpt);
  return (a, b) => {
    if (!isString(a) || !isString(b)) return compare(a, b);
    const i = collator.compare(a, b);
    if (i < 0) return -1;
    if (i > 0) return 1;
    return 0;
  };
}

// node_modules/mingo/dist/esm/cursor.js
var OPERATORS = { $sort, $skip, $limit };
var Cursor = class {
  #source;
  #predicate;
  #projection;
  #options;
  #operators = {};
  #result = null;
  #buffer = [];
  constructor(source, predicate, projection, options) {
    this.#source = source;
    this.#predicate = predicate;
    this.#projection = projection;
    this.#options = options;
  }
  /** Returns the iterator from running the query */
  fetch() {
    if (this.#result) return this.#result;
    this.#result = Lazy(this.#source).filter(this.#predicate);
    const mode = this.#options.processingMode;
    if (mode & ProcessingMode.CLONE_INPUT) this.#result.map(cloneDeep);
    for (const op of ["$sort", "$skip", "$limit"]) {
      if (has(this.#operators, op)) {
        this.#result = OPERATORS[op](
          this.#result,
          this.#operators[op],
          this.#options
        );
      }
    }
    if (Object.keys(this.#projection).length) {
      this.#result = $project(this.#result, this.#projection, this.#options);
    }
    if (mode & ProcessingMode.CLONE_OUTPUT) this.#result.map(cloneDeep);
    return this.#result;
  }
  /** Returns an iterator with the buffered data included */
  fetchAll() {
    const buffered = Lazy([...this.#buffer]);
    this.#buffer = [];
    return concat2(buffered, this.fetch());
  }
  /**
   * Return remaining objects in the cursor as an array. This method exhausts the cursor
   * @returns {Array}
   */
  all() {
    return this.fetchAll().value();
  }
  /**
   * Returns the number of objects return in the cursor. This method exhausts the cursor
   * @returns {Number}
   */
  count() {
    return this.all().length;
  }
  /**
   * Returns a cursor that begins returning results only after passing or skipping a number of documents.
   * @param {Number} n the number of results to skip.
   * @return {Cursor} Returns the cursor, so you can chain this call.
   */
  skip(n) {
    this.#operators["$skip"] = n;
    return this;
  }
  /**
   * Constrains the size of a cursor's result set.
   * @param {Number} n the number of results to limit to.
   * @return {Cursor} Returns the cursor, so you can chain this call.
   */
  limit(n) {
    this.#operators["$limit"] = n;
    return this;
  }
  /**
   * Returns results ordered according to a sort specification.
   * @param {AnyObject} modifier an object of key and values specifying the sort order. 1 for ascending and -1 for descending
   * @return {Cursor} Returns the cursor, so you can chain this call.
   */
  sort(modifier) {
    this.#operators["$sort"] = modifier;
    return this;
  }
  /**
   * Specifies the collation for the cursor returned by the `mingo.Query.find`
   * @param {*} spec
   */
  collation(spec) {
    this.#options = { ...this.#options, collation: spec };
    return this;
  }
  /**
   * Returns the next document in a cursor.
   * @returns {AnyObject | Boolean}
   */
  next() {
    if (this.#buffer.length > 0) {
      return this.#buffer.pop();
    }
    const o = this.fetch().next();
    if (o.done) return;
    return o.value;
  }
  /**
   * Returns true if the cursor has documents and can be iterated.
   * @returns {boolean}
   */
  hasNext() {
    if (this.#buffer.length > 0) return true;
    const o = this.fetch().next();
    if (o.done) return false;
    this.#buffer.push(o.value);
    return true;
  }
  /**
   * Applies a function to each document in a cursor and collects the return values in an array.
   * @param fn
   * @returns {Array}
   */
  map(fn) {
    return this.all().map(fn);
  }
  /**
   * Applies a JavaScript function for every document in a cursor.
   * @param fn
   */
  forEach(fn) {
    this.all().forEach(fn);
  }
  [Symbol.iterator]() {
    return this.fetchAll();
  }
};

// node_modules/mingo/dist/esm/query.js
var TOP_LEVEL_OPS = new Set(
  Array.from(["$and", "$or", "$nor", "$expr", "$jsonSchema"])
);
var Query = class {
  #compiled;
  #options;
  #condition;
  constructor(condition, options) {
    this.#condition = cloneDeep(condition);
    this.#options = initOptions(options);
    this.#compiled = [];
    this.compile();
  }
  compile() {
    assert(
      isObject2(this.#condition),
      `query criteria must be an object: ${JSON.stringify(this.#condition)}`
    );
    const whereOperator = {};
    for (const [field, expr] of Object.entries(this.#condition)) {
      if ("$where" === field) {
        assert(
          this.#options.scriptEnabled,
          "$where operator requires 'scriptEnabled' option to be true."
        );
        Object.assign(whereOperator, { field, expr });
      } else if (TOP_LEVEL_OPS.has(field)) {
        this.processOperator(field, field, expr);
      } else {
        assert(!isOperator(field), `unknown top level operator: ${field}`);
        for (const [operator, val] of Object.entries(
          normalize(expr)
        )) {
          this.processOperator(field, operator, val);
        }
      }
      if (whereOperator.field) {
        this.processOperator(
          whereOperator.field,
          whereOperator.field,
          whereOperator.expr
        );
      }
    }
  }
  processOperator(field, operator, value) {
    const call = getOperator("query", operator, this.#options);
    assert(!!call, `unknown query operator ${operator}`);
    this.#compiled.push(call(field, value, this.#options));
  }
  /**
   * Checks if the object passes the query criteria. Returns true if so, false otherwise.
   *
   * @param obj The object to test
   * @returns {boolean}
   */
  test(obj) {
    return this.#compiled.every((p) => p(obj));
  }
  /**
   * Returns a cursor to select matching documents from the input source.
   *
   * @param source A source providing a sequence of documents
   * @param projection An optional projection criteria
   * @returns {Cursor} A Cursor for iterating over the results
   */
  find(collection, projection) {
    return new Cursor(
      collection,
      (o) => this.test(o),
      projection || {},
      this.#options
    );
  }
  /**
   * Remove matched documents from the collection returning the remainder
   *
   * @param collection An array of documents
   * @returns {Array} A new array with matching elements removed
   */
  remove(collection) {
    return collection.reduce((acc, obj) => {
      if (!this.test(obj)) acc.push(obj);
      return acc;
    }, []);
  }
};

// node_modules/mingo/dist/esm/operators/pipeline/bucketAuto.js
var PREFERRED_NUMBERS = Object.freeze({
  // "Least rounded" Renard number series, taken from Wikipedia page on preferred
  // numbers: https://en.wikipedia.org/wiki/Preferred_number#Renard_numbers
  R5: [10, 16, 25, 40, 63],
  R10: [100, 125, 160, 200, 250, 315, 400, 500, 630, 800],
  R20: [
    100,
    112,
    125,
    140,
    160,
    180,
    200,
    224,
    250,
    280,
    315,
    355,
    400,
    450,
    500,
    560,
    630,
    710,
    800,
    900
  ],
  R40: [
    100,
    106,
    112,
    118,
    125,
    132,
    140,
    150,
    160,
    170,
    180,
    190,
    200,
    212,
    224,
    236,
    250,
    265,
    280,
    300,
    315,
    355,
    375,
    400,
    425,
    450,
    475,
    500,
    530,
    560,
    600,
    630,
    670,
    710,
    750,
    800,
    850,
    900,
    950
  ],
  R80: [
    103,
    109,
    115,
    122,
    128,
    136,
    145,
    155,
    165,
    175,
    185,
    195,
    206,
    218,
    230,
    243,
    258,
    272,
    290,
    307,
    325,
    345,
    365,
    387,
    412,
    437,
    462,
    487,
    515,
    545,
    575,
    615,
    650,
    690,
    730,
    775,
    825,
    875,
    925,
    975
  ],
  // https://en.wikipedia.org/wiki/Preferred_number#1-2-5_series
  "1-2-5": [10, 20, 50],
  // E series, taken from Wikipedia page on preferred numbers:
  // https://en.wikipedia.org/wiki/Preferred_number#E_series
  E6: [10, 15, 22, 33, 47, 68],
  E12: [10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82],
  E24: [
    10,
    11,
    12,
    13,
    15,
    16,
    18,
    20,
    22,
    24,
    27,
    30,
    33,
    36,
    39,
    43,
    47,
    51,
    56,
    62,
    68,
    75,
    82,
    91
  ],
  E48: [
    100,
    105,
    110,
    115,
    121,
    127,
    133,
    140,
    147,
    154,
    162,
    169,
    178,
    187,
    196,
    205,
    215,
    226,
    237,
    249,
    261,
    274,
    287,
    301,
    316,
    332,
    348,
    365,
    383,
    402,
    422,
    442,
    464,
    487,
    511,
    536,
    562,
    590,
    619,
    649,
    681,
    715,
    750,
    787,
    825,
    866,
    909,
    953
  ],
  E96: [
    100,
    102,
    105,
    107,
    110,
    113,
    115,
    118,
    121,
    124,
    127,
    130,
    133,
    137,
    140,
    143,
    147,
    150,
    154,
    158,
    162,
    165,
    169,
    174,
    178,
    182,
    187,
    191,
    196,
    200,
    205,
    210,
    215,
    221,
    226,
    232,
    237,
    243,
    249,
    255,
    261,
    267,
    274,
    280,
    287,
    294,
    301,
    309,
    316,
    324,
    332,
    340,
    348,
    357,
    365,
    374,
    383,
    392,
    402,
    412,
    422,
    432,
    442,
    453,
    464,
    475,
    487,
    499,
    511,
    523,
    536,
    549,
    562,
    576,
    590,
    604,
    619,
    634,
    649,
    665,
    681,
    698,
    715,
    732,
    750,
    768,
    787,
    806,
    825,
    845,
    866,
    887,
    909,
    931,
    953,
    976
  ],
  E192: [
    100,
    101,
    102,
    104,
    105,
    106,
    107,
    109,
    110,
    111,
    113,
    114,
    115,
    117,
    118,
    120,
    121,
    123,
    124,
    126,
    127,
    129,
    130,
    132,
    133,
    135,
    137,
    138,
    140,
    142,
    143,
    145,
    147,
    149,
    150,
    152,
    154,
    156,
    158,
    160,
    162,
    164,
    165,
    167,
    169,
    172,
    174,
    176,
    178,
    180,
    182,
    184,
    187,
    189,
    191,
    193,
    196,
    198,
    200,
    203,
    205,
    208,
    210,
    213,
    215,
    218,
    221,
    223,
    226,
    229,
    232,
    234,
    237,
    240,
    243,
    246,
    249,
    252,
    255,
    258,
    261,
    264,
    267,
    271,
    274,
    277,
    280,
    284,
    287,
    291,
    294,
    298,
    301,
    305,
    309,
    312,
    316,
    320,
    324,
    328,
    332,
    336,
    340,
    344,
    348,
    352,
    357,
    361,
    365,
    370,
    374,
    379,
    383,
    388,
    392,
    397,
    402,
    407,
    412,
    417,
    422,
    427,
    432,
    437,
    442,
    448,
    453,
    459,
    464,
    470,
    475,
    481,
    487,
    493,
    499,
    505,
    511,
    517,
    523,
    530,
    536,
    542,
    549,
    556,
    562,
    569,
    576,
    583,
    590,
    597,
    604,
    612,
    619,
    626,
    634,
    642,
    649,
    657,
    665,
    673,
    681,
    690,
    698,
    706,
    715,
    723,
    732,
    741,
    750,
    759,
    768,
    777,
    787,
    796,
    806,
    816,
    825,
    835,
    845,
    856,
    866,
    876,
    887,
    898,
    909,
    920,
    931,
    942,
    953,
    965,
    976,
    988
  ]
});

// node_modules/mingo/dist/esm/operators/expression/date/_internal.js
var DAYS_PER_WEEK = 7;
var MILLIS_PER_DAY = 1e3 * 60 * 60 * 24;
var TIMEUNIT_IN_MILLIS = {
  week: MILLIS_PER_DAY * DAYS_PER_WEEK,
  day: MILLIS_PER_DAY,
  hour: 1e3 * 60 * 60,
  minute: 1e3 * 60,
  second: 1e3,
  millisecond: 1
};
var DAYS_OF_WEEK = [
  "monday",
  "mon",
  "tuesday",
  "tue",
  "wednesday",
  "wed",
  "thursday",
  "thu",
  "friday",
  "fri",
  "saturday",
  "sat",
  "sunday",
  "sun"
];
var DAYS_OF_WEEK_SET = new Set(DAYS_OF_WEEK);
var ISO_WEEKDAY_MAP = Object.freeze({
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
  sun: 7
});
var DATE_SYM_TABLE = Object.freeze({
  "%Y": { name: "year", padding: 4, re: /([0-9]{4})/ },
  "%G": { name: "year", padding: 4, re: /([0-9]{4})/ },
  "%m": { name: "month", padding: 2, re: /(0[1-9]|1[012])/ },
  "%d": { name: "day", padding: 2, re: /(0[1-9]|[12][0-9]|3[01])/ },
  "%H": { name: "hour", padding: 2, re: /([01][0-9]|2[0-3])/ },
  "%M": { name: "minute", padding: 2, re: /([0-5][0-9])/ },
  "%S": { name: "second", padding: 2, re: /([0-5][0-9]|60)/ },
  "%L": { name: "millisecond", padding: 3, re: /([0-9]{3})/ },
  "%u": { name: "weekday", padding: 1, re: /([1-7])/ },
  "%U": { name: "week", padding: 2, re: /([1-4][0-9]?|5[0-3]?)/ },
  "%V": { name: "isoWeek", padding: 2, re: /([1-4][0-9]?|5[0-3]?)/ },
  "%z": {
    name: "timezone",
    padding: 2,
    re: /(([+-][01][0-9]|2[0-3]):?([0-5][0-9])?)/
  },
  "%Z": { name: "minuteOffset", padding: 3, re: /([+-][0-9]{3})/ }
  // "%%": "%",
});

// node_modules/mingo/dist/esm/operators/pipeline/densify.js
var EMPTY_OBJECT = Object.freeze({});

// node_modules/mingo/dist/esm/operators/window/_internal.js
var MILLIS_PER_UNIT = {
  week: MILLIS_PER_DAY * 7,
  day: MILLIS_PER_DAY,
  hour: MILLIS_PER_DAY / 24,
  minute: 6e4,
  second: 1e3,
  millisecond: 1
};

// node_modules/mingo/dist/esm/operators/_predicates.js
function createQueryOperator(predicate) {
  const f = (selector, value, options) => {
    const opts = { unwrapArray: true };
    const depth = Math.max(1, selector.split(".").length - 1);
    return (obj) => {
      const lhs = resolve(obj, selector, opts);
      return predicate(lhs, value, { ...options, depth });
    };
  };
  return f;
}
function createExpressionOperator(predicate) {
  return (obj, expr, options) => {
    const args = computeValue(obj, expr, null, options);
    return predicate(...args);
  };
}
function $eq(a, b, options) {
  if (isEqual(a, b)) return true;
  if (isNil(a) && isNil(b)) return true;
  if (isArray3(a)) {
    return a.some((v) => isEqual(v, b)) || flatten(a, options?.depth).some((v) => isEqual(v, b));
  }
  return false;
}
function $ne(a, b, options) {
  return !$eq(a, b, options);
}
function $in(a, b, options) {
  if (isNil(a)) return b.some((v) => v === null);
  return intersection([ensureArray(a), b], options?.hashFunction).length > 0;
}
function $nin(a, b, options) {
  return !$in(a, b, options);
}
function $lt(a, b, _options) {
  return compare2(a, b, (x, y) => compare(x, y) < 0);
}
function $lte(a, b, _options) {
  return compare2(a, b, (x, y) => compare(x, y) <= 0);
}
function $gt(a, b, _options) {
  return compare2(a, b, (x, y) => compare(x, y) > 0);
}
function $gte(a, b, _options) {
  return compare2(a, b, (x, y) => compare(x, y) >= 0);
}
function $mod(a, b, _options) {
  return ensureArray(a).some(
    (x) => b.length === 2 && x % b[0] === b[1]
  );
}
function $regex(a, b, options) {
  const lhs = ensureArray(a);
  const match = (x) => isString(x) && truthy(b.exec(x), options?.useStrictMode);
  return lhs.some(match) || flatten(lhs, 1).some(match);
}
function $exists(a, b, _options) {
  return (b === false || b === 0) && a === void 0 || (b === true || b === 1) && a !== void 0;
}
function $all(values, queries, options) {
  if (!isArray3(values) || !isArray3(queries) || !values.length || !queries.length) {
    return false;
  }
  let matched = true;
  for (const query of queries) {
    if (!matched) break;
    if (isObject2(query) && Object.keys(query).includes("$elemMatch")) {
      matched = $elemMatch(values, query["$elemMatch"], options);
    } else if (isRegExp(query)) {
      matched = values.some((s) => typeof s === "string" && query.test(s));
    } else {
      matched = values.some((v) => isEqual(query, v));
    }
  }
  return matched;
}
function $size(a, b, _options) {
  return Array.isArray(a) && a.length === b;
}
function isNonBooleanOperator(name) {
  return isOperator(name) && ["$and", "$or", "$nor"].indexOf(name) === -1;
}
function $elemMatch(a, b, options) {
  if (isArray3(a) && !isEmpty(a)) {
    let format = (x) => x;
    let criteria = b;
    if (Object.keys(b).every(isNonBooleanOperator)) {
      criteria = { temp: b };
      format = (x) => ({ temp: x });
    }
    const query = new Query(criteria, options);
    for (let i = 0, len = a.length; i < len; i++) {
      if (query.test(format(a[i]))) {
        return true;
      }
    }
  }
  return false;
}
var isNull = (a) => a === null;
var compareFuncs = {
  array: isArray3,
  boolean: isBoolean,
  bool: isBoolean,
  date: isDate,
  number: isNumber,
  int: isNumber,
  long: isNumber,
  double: isNumber,
  decimal: isNumber,
  null: isNull,
  object: isObject2,
  regexp: isRegExp,
  regex: isRegExp,
  string: isString,
  // added for completeness
  undefined: isNil,
  // deprecated
  function: (_) => {
    throw new MingoError("unsupported type key `function`.");
  },
  // Mongo identifiers
  1: isNumber,
  //double
  2: isString,
  3: isObject2,
  4: isArray3,
  6: isNil,
  // deprecated
  8: isBoolean,
  9: isDate,
  10: isNull,
  11: isRegExp,
  16: isNumber,
  //int
  18: isNumber,
  //long
  19: isNumber
  //decimal
};
function compareType(a, b, _) {
  const f = compareFuncs[b];
  return f ? f(a) : false;
}
function $type(a, b, options) {
  return isArray3(b) ? b.findIndex((t) => compareType(a, t, options)) >= 0 : compareType(a, b, options);
}
function compare2(a, b, f) {
  return ensureArray(a).some((x) => typeOf(x) === typeOf(b) && f(x, b));
}

// node_modules/mingo/dist/esm/operators/expression/array/nin.js
var $nin2 = createExpressionOperator($nin);

// node_modules/mingo/dist/esm/operators/expression/bitwise/_internal.js
var bitwise = (op, compute) => (obj, expr, options) => {
  assert(isArray3(expr), `${op}: expression must be an array.`);
  const nums = computeValue(obj, expr, null, options);
  if (nums.some(isNil)) return null;
  assert(
    nums.every(isNumber),
    `${op}: expression must evalue to array of numbers.`
  );
  return compute(nums);
};

// node_modules/mingo/dist/esm/operators/expression/bitwise/bitAnd.js
var $bitAnd = bitwise(
  "$bitAnd",
  (nums) => nums.reduce((a, b) => a & b, -1)
);

// node_modules/mingo/dist/esm/operators/expression/bitwise/bitOr.js
var $bitOr = bitwise(
  "$bitOr",
  (nums) => nums.reduce((a, b) => a | b, 0)
);

// node_modules/mingo/dist/esm/operators/expression/bitwise/bitXor.js
var $bitXor = bitwise(
  "$bitXor",
  (nums) => nums.reduce((a, b) => a ^ b, 0)
);

// node_modules/mingo/dist/esm/operators/expression/comparison/eq.js
var $eq2 = createExpressionOperator($eq);

// node_modules/mingo/dist/esm/operators/expression/comparison/gt.js
var $gt2 = createExpressionOperator($gt);

// node_modules/mingo/dist/esm/operators/expression/comparison/gte.js
var $gte2 = createExpressionOperator($gte);

// node_modules/mingo/dist/esm/operators/expression/comparison/lt.js
var $lt2 = createExpressionOperator($lt);

// node_modules/mingo/dist/esm/operators/expression/comparison/lte.js
var $lte2 = createExpressionOperator($lte);

// node_modules/mingo/dist/esm/operators/expression/comparison/ne.js
var $ne2 = createExpressionOperator($ne);

// node_modules/mingo/dist/esm/operators/expression/date/dateFromString.js
var buildMap = (letters, sign) => {
  const h = {};
  letters.split("").forEach((v, i) => h[v] = sign * (i + 1));
  return h;
};
var TZ_LETTER_OFFSETS = {
  ...buildMap("ABCDEFGHIKLM", 1),
  ...buildMap("NOPQRSTUVWXY", -1),
  Z: 0
};

// node_modules/mingo/dist/esm/operators/expression/trignometry/_internal.js
var FIXED_POINTS = {
  undefined: null,
  null: null,
  NaN: NaN,
  Infinity: new Error(),
  "-Infinity": new Error()
};
function createTrignometryOperator(f, fixedPoints = FIXED_POINTS) {
  const fp = Object.assign({}, FIXED_POINTS, fixedPoints);
  const keySet = new Set(Object.keys(fp));
  return (obj, expr, options) => {
    const n = computeValue(obj, expr, null, options);
    if (keySet.has(`${n}`)) {
      const res = fp[`${n}`];
      if (res instanceof Error) {
        throw new MingoError(
          `cannot apply $${f.name} to -inf, value must in (-inf,inf)`
        );
      }
      return res;
    }
    return f(n);
  };
}

// node_modules/mingo/dist/esm/operators/expression/trignometry/acos.js
var $acos = createTrignometryOperator(Math.acos, {
  Infinity: Infinity,
  0: new Error()
});

// node_modules/mingo/dist/esm/operators/expression/trignometry/acosh.js
var $acosh = createTrignometryOperator(Math.acosh, {
  Infinity: Infinity,
  0: new Error()
});

// node_modules/mingo/dist/esm/operators/expression/trignometry/asin.js
var $asin = createTrignometryOperator(Math.asin);

// node_modules/mingo/dist/esm/operators/expression/trignometry/asinh.js
var $asinh = createTrignometryOperator(Math.asinh, {
  Infinity: Infinity,
  "-Infinity": -Infinity
});

// node_modules/mingo/dist/esm/operators/expression/trignometry/atan.js
var $atan = createTrignometryOperator(Math.atan);

// node_modules/mingo/dist/esm/operators/expression/trignometry/atanh.js
var $atanh = createTrignometryOperator(Math.atanh, {
  1: Infinity,
  "-1": -Infinity
});

// node_modules/mingo/dist/esm/operators/expression/trignometry/cos.js
var $cos = createTrignometryOperator(Math.cos);

// node_modules/mingo/dist/esm/operators/expression/trignometry/cosh.js
var $cosh = createTrignometryOperator(Math.cosh, {
  "-Infinity": Infinity,
  Infinity: Infinity
});

// node_modules/mingo/dist/esm/operators/expression/trignometry/degreesToRadians.js
var RADIANS_FACTOR = Math.PI / 180;
var $degreesToRadians = createTrignometryOperator(
  (n) => n * RADIANS_FACTOR,
  {
    Infinity: Infinity,
    "-Infinity": Infinity
  }
);

// node_modules/mingo/dist/esm/operators/expression/trignometry/radiansToDegrees.js
var DEGREES_FACTOR = 180 / Math.PI;
var $radiansToDegrees = createTrignometryOperator(
  (n) => n * DEGREES_FACTOR,
  {
    Infinity: Infinity,
    "-Infinity": -Infinity
  }
);

// node_modules/mingo/dist/esm/operators/expression/trignometry/sin.js
var $sin = createTrignometryOperator(Math.sin);

// node_modules/mingo/dist/esm/operators/expression/trignometry/sinh.js
var $sinh = createTrignometryOperator(Math.sinh, {
  "-Infinity": -Infinity,
  Infinity: Infinity
});

// node_modules/mingo/dist/esm/operators/expression/trignometry/tan.js
var $tan = createTrignometryOperator(Math.tan);

// node_modules/mingo/dist/esm/operators/expression/type/_internal.js
var MAX_LONG = Number.MAX_SAFE_INTEGER;
var MIN_LONG = Number.MIN_SAFE_INTEGER;

// node_modules/mingo/dist/esm/operators/query/logical/and.js
var $and = (_, rhs, options) => {
  assert(
    isArray3(rhs),
    "Invalid expression: $and expects value to be an Array."
  );
  const queries = rhs.map((expr) => new Query(expr, options));
  return (obj) => queries.every((q) => q.test(obj));
};

// node_modules/mingo/dist/esm/operators/query/logical/or.js
var $or = (_, rhs, options) => {
  assert(isArray3(rhs), "Invalid expression. $or expects value to be an Array");
  const queries = rhs.map((expr) => new Query(expr, options));
  return (obj) => queries.some((q) => q.test(obj));
};

// node_modules/mingo/dist/esm/operators/query/logical/nor.js
var $nor = (_, rhs, options) => {
  assert(
    isArray3(rhs),
    "Invalid expression. $nor expects value to be an array."
  );
  const f = $or("$or", rhs, options);
  return (obj) => !f(obj);
};

// node_modules/mingo/dist/esm/operators/query/logical/not.js
var $not = (selector, rhs, options) => {
  const criteria = {};
  criteria[selector] = normalize(rhs);
  const query = new Query(criteria, options);
  return (obj) => !query.test(obj);
};

// node_modules/mingo/dist/esm/operators/query/comparison/eq.js
var $eq3 = createQueryOperator($eq);

// node_modules/mingo/dist/esm/operators/query/comparison/gt.js
var $gt3 = createQueryOperator($gt);

// node_modules/mingo/dist/esm/operators/query/comparison/gte.js
var $gte3 = createQueryOperator($gte);

// node_modules/mingo/dist/esm/operators/query/comparison/in.js
var $in2 = createQueryOperator($in);

// node_modules/mingo/dist/esm/operators/query/comparison/lt.js
var $lt3 = createQueryOperator($lt);

// node_modules/mingo/dist/esm/operators/query/comparison/lte.js
var $lte3 = createQueryOperator($lte);

// node_modules/mingo/dist/esm/operators/query/comparison/ne.js
var $ne3 = createQueryOperator($ne);

// node_modules/mingo/dist/esm/operators/query/comparison/nin.js
var $nin3 = createQueryOperator($nin);

// node_modules/mingo/dist/esm/operators/query/evaluation/mod.js
var $mod2 = createQueryOperator($mod);

// node_modules/mingo/dist/esm/operators/query/evaluation/regex.js
var $regex2 = createQueryOperator($regex);

// node_modules/mingo/dist/esm/operators/query/array/all.js
var $all2 = createQueryOperator($all);

// node_modules/mingo/dist/esm/operators/query/array/elemMatch.js
var $elemMatch2 = createQueryOperator($elemMatch);

// node_modules/mingo/dist/esm/operators/query/array/size.js
var $size2 = createQueryOperator($size);

// node_modules/mingo/dist/esm/operators/query/element/exists.js
var $exists2 = createQueryOperator($exists);

// node_modules/mingo/dist/esm/operators/query/element/type.js
var $type2 = createQueryOperator($type);

// node_modules/rxdb/dist/esm/rx-query-mingo.js
var mingoInitDone = false;
function getMingoQuery(selector) {
  if (!mingoInitDone) {
    useOperators(OperatorType.PIPELINE, {
      $sort,
      $project
    });
    useOperators(OperatorType.QUERY, {
      $and,
      $eq: $eq3,
      $elemMatch: $elemMatch2,
      $exists: $exists2,
      $gt: $gt3,
      $gte: $gte3,
      $in: $in2,
      $lt: $lt3,
      $lte: $lte3,
      $ne: $ne3,
      $nin: $nin3,
      $mod: $mod2,
      $nor,
      $not,
      $or,
      $regex: $regex2,
      $size: $size2,
      $type: $type2
    });
    mingoInitDone = true;
  }
  return new Query(selector);
}

// node_modules/rxdb/dist/esm/rx-query-helper.js
function normalizeMangoQuery(schema, mangoQuery) {
  var primaryKey = getPrimaryFieldOfPrimaryKey(schema.primaryKey);
  mangoQuery = flatClone(mangoQuery);
  var normalizedMangoQuery = clone(mangoQuery);
  if (typeof normalizedMangoQuery.skip !== "number") {
    normalizedMangoQuery.skip = 0;
  }
  if (!normalizedMangoQuery.selector) {
    normalizedMangoQuery.selector = {};
  } else {
    normalizedMangoQuery.selector = normalizedMangoQuery.selector;
    Object.entries(normalizedMangoQuery.selector).forEach(([field, matcher]) => {
      if (typeof matcher !== "object" || matcher === null) {
        normalizedMangoQuery.selector[field] = {
          $eq: matcher
        };
      }
    });
  }
  if (normalizedMangoQuery.index) {
    var indexAr = toArray(normalizedMangoQuery.index);
    if (!indexAr.includes(primaryKey)) {
      indexAr.push(primaryKey);
    }
    normalizedMangoQuery.index = indexAr;
  }
  if (!normalizedMangoQuery.sort) {
    if (normalizedMangoQuery.index) {
      normalizedMangoQuery.sort = normalizedMangoQuery.index.map((field) => {
        return {
          [field]: "asc"
        };
      });
    } else {
      if (schema.indexes) {
        var fieldsWithLogicalOperator = /* @__PURE__ */ new Set();
        Object.entries(normalizedMangoQuery.selector).forEach(([field, matcher]) => {
          var hasLogical = false;
          if (typeof matcher === "object" && matcher !== null) {
            hasLogical = !!Object.keys(matcher).find((operator) => LOGICAL_OPERATORS.has(operator));
          } else {
            hasLogical = true;
          }
          if (hasLogical) {
            fieldsWithLogicalOperator.add(field);
          }
        });
        var currentFieldsAmount = -1;
        var currentBestIndexForSort;
        schema.indexes.forEach((index) => {
          var useIndex2 = isMaybeReadonlyArray(index) ? index : [index];
          var firstWrongIndex = useIndex2.findIndex((indexField) => !fieldsWithLogicalOperator.has(indexField));
          if (firstWrongIndex > 0 && firstWrongIndex > currentFieldsAmount) {
            currentFieldsAmount = firstWrongIndex;
            currentBestIndexForSort = useIndex2;
          }
        });
        if (currentBestIndexForSort) {
          normalizedMangoQuery.sort = currentBestIndexForSort.map((field) => {
            return {
              [field]: "asc"
            };
          });
        }
      }
      if (!normalizedMangoQuery.sort) {
        if (schema.indexes && schema.indexes.length > 0) {
          var firstIndex = schema.indexes[0];
          var useIndex = isMaybeReadonlyArray(firstIndex) ? firstIndex : [firstIndex];
          normalizedMangoQuery.sort = useIndex.map((field) => ({
            [field]: "asc"
          }));
        } else {
          normalizedMangoQuery.sort = [{
            [primaryKey]: "asc"
          }];
        }
      }
    }
  } else {
    var isPrimaryInSort = normalizedMangoQuery.sort.find((p) => firstPropertyNameOfObject(p) === primaryKey);
    if (!isPrimaryInSort) {
      normalizedMangoQuery.sort = normalizedMangoQuery.sort.slice(0);
      normalizedMangoQuery.sort.push({
        [primaryKey]: "asc"
      });
    }
  }
  return normalizedMangoQuery;
}
function getSortComparator(schema, query) {
  if (!query.sort) {
    throw newRxError("SNH", {
      query
    });
  }
  var sortParts = [];
  query.sort.forEach((sortBlock) => {
    var key = Object.keys(sortBlock)[0];
    var direction = Object.values(sortBlock)[0];
    sortParts.push({
      key,
      direction,
      getValueFn: objectPathMonad(key)
    });
  });
  var fun = (a, b) => {
    for (var i = 0; i < sortParts.length; ++i) {
      var sortPart = sortParts[i];
      var valueA = sortPart.getValueFn(a);
      var valueB = sortPart.getValueFn(b);
      if (valueA !== valueB) {
        var ret = sortPart.direction === "asc" ? compare(valueA, valueB) : compare(valueB, valueA);
        return ret;
      }
    }
  };
  return fun;
}
function getQueryMatcher(_schema, query) {
  if (!query.sort) {
    throw newRxError("SNH", {
      query
    });
  }
  var mingoQuery = getMingoQuery(query.selector);
  var fun = (doc) => {
    return mingoQuery.test(doc);
  };
  return fun;
}
async function runQueryUpdateFunction(rxQuery, fn) {
  var docs = await rxQuery.exec();
  if (!docs) {
    return null;
  }
  if (Array.isArray(docs)) {
    return Promise.all(docs.map((doc) => fn(doc)));
  } else if (docs instanceof Map) {
    return Promise.all([...docs.values()].map((doc) => fn(doc)));
  } else {
    var result = await fn(docs);
    return result;
  }
}
function prepareQuery(schema, mutateableQuery) {
  if (!mutateableQuery.sort) {
    throw newRxError("SNH", {
      query: mutateableQuery
    });
  }
  var queryPlan = getQueryPlan(schema, mutateableQuery);
  return {
    query: mutateableQuery,
    queryPlan
  };
}

// node_modules/rxdb/dist/esm/rx-storage-helper.js
var INTERNAL_STORAGE_NAME = "_rxdb_internal";
async function getSingleDocument(storageInstance, documentId) {
  var results = await storageInstance.findDocumentsById([documentId], false);
  var doc = results[0];
  if (doc) {
    return doc;
  } else {
    return void 0;
  }
}
async function writeSingle(instance, writeRow, context2) {
  var writeResult = await instance.bulkWrite([writeRow], context2);
  if (writeResult.error.length > 0) {
    var error = writeResult.error[0];
    throw error;
  } else {
    var primaryPath = getPrimaryFieldOfPrimaryKey(instance.schema.primaryKey);
    var success = getWrittenDocumentsFromBulkWriteResponse(primaryPath, [writeRow], writeResult);
    var ret = success[0];
    return ret;
  }
}
function stackCheckpoints(checkpoints) {
  return Object.assign({}, ...checkpoints);
}
function throwIfIsStorageWriteError(collection, documentId, writeData, error) {
  if (error) {
    if (error.status === 409) {
      throw newRxError("CONFLICT", {
        collection: collection.name,
        id: documentId,
        writeError: error,
        data: writeData
      });
    } else if (error.status === 422) {
      throw newRxError("VD2", {
        collection: collection.name,
        id: documentId,
        writeError: error,
        data: writeData
      });
    } else {
      throw error;
    }
  }
}
function categorizeBulkWriteRows(storageInstance, primaryPath, docsInDb, bulkWriteRows, context2, onInsert, onUpdate) {
  var hasAttachments = !!storageInstance.schema.attachments;
  var bulkInsertDocs = [];
  var bulkUpdateDocs = [];
  var errors = [];
  var eventBulkId = randomToken(10);
  var eventBulk = {
    id: eventBulkId,
    events: [],
    checkpoint: null,
    context: context2
  };
  var eventBulkEvents = eventBulk.events;
  var attachmentsAdd = [];
  var attachmentsRemove = [];
  var attachmentsUpdate = [];
  var hasDocsInDb = docsInDb.size > 0;
  var newestRow;
  var rowAmount = bulkWriteRows.length;
  var _loop = function() {
    var writeRow = bulkWriteRows[rowId];
    var document2 = writeRow.document;
    var previous = writeRow.previous;
    var docId = document2[primaryPath];
    var documentDeleted = document2._deleted;
    var previousDeleted = previous && previous._deleted;
    var documentInDb = void 0;
    if (hasDocsInDb) {
      documentInDb = docsInDb.get(docId);
    }
    var attachmentError;
    if (!documentInDb) {
      var insertedIsDeleted = documentDeleted ? true : false;
      if (hasAttachments) {
        Object.entries(document2._attachments).forEach(([attachmentId, attachmentData]) => {
          if (!attachmentData.data) {
            attachmentError = {
              documentId: docId,
              isError: true,
              status: 510,
              writeRow,
              attachmentId
            };
            errors.push(attachmentError);
          } else {
            attachmentsAdd.push({
              documentId: docId,
              attachmentId,
              attachmentData,
              digest: attachmentData.digest
            });
          }
        });
      }
      if (!attachmentError) {
        if (hasAttachments) {
          bulkInsertDocs.push(stripAttachmentsDataFromRow(writeRow));
          if (onInsert) {
            onInsert(document2);
          }
        } else {
          bulkInsertDocs.push(writeRow);
          if (onInsert) {
            onInsert(document2);
          }
        }
        newestRow = writeRow;
      }
      if (!insertedIsDeleted) {
        var event = {
          documentId: docId,
          operation: "INSERT",
          documentData: hasAttachments ? stripAttachmentsDataFromDocument(document2) : document2,
          previousDocumentData: hasAttachments && previous ? stripAttachmentsDataFromDocument(previous) : previous
        };
        eventBulkEvents.push(event);
      }
    } else {
      var revInDb = documentInDb._rev;
      if (!previous || !!previous && revInDb !== previous._rev) {
        var err = {
          isError: true,
          status: 409,
          documentId: docId,
          writeRow,
          documentInDb
        };
        errors.push(err);
        return 1;
      }
      var updatedRow = hasAttachments ? stripAttachmentsDataFromRow(writeRow) : writeRow;
      if (hasAttachments) {
        if (documentDeleted) {
          if (previous) {
            Object.keys(previous._attachments).forEach((attachmentId) => {
              attachmentsRemove.push({
                documentId: docId,
                attachmentId,
                digest: ensureNotFalsy(previous)._attachments[attachmentId].digest
              });
            });
          }
        } else {
          Object.entries(document2._attachments).find(([attachmentId, attachmentData]) => {
            var previousAttachmentData = previous ? previous._attachments[attachmentId] : void 0;
            if (!previousAttachmentData && !attachmentData.data) {
              attachmentError = {
                documentId: docId,
                documentInDb,
                isError: true,
                status: 510,
                writeRow,
                attachmentId
              };
            }
            return true;
          });
          if (!attachmentError) {
            Object.entries(document2._attachments).forEach(([attachmentId, attachmentData]) => {
              var previousAttachmentData = previous ? previous._attachments[attachmentId] : void 0;
              if (!previousAttachmentData) {
                attachmentsAdd.push({
                  documentId: docId,
                  attachmentId,
                  attachmentData,
                  digest: attachmentData.digest
                });
              } else {
                var newDigest = updatedRow.document._attachments[attachmentId].digest;
                if (attachmentData.data && /**
                 * Performance shortcut,
                 * do not update the attachment data if it did not change.
                 */
                previousAttachmentData.digest !== newDigest) {
                  attachmentsUpdate.push({
                    documentId: docId,
                    attachmentId,
                    attachmentData,
                    digest: attachmentData.digest
                  });
                }
              }
            });
          }
        }
      }
      if (attachmentError) {
        errors.push(attachmentError);
      } else {
        if (hasAttachments) {
          bulkUpdateDocs.push(stripAttachmentsDataFromRow(updatedRow));
          if (onUpdate) {
            onUpdate(document2);
          }
        } else {
          bulkUpdateDocs.push(updatedRow);
          if (onUpdate) {
            onUpdate(document2);
          }
        }
        newestRow = updatedRow;
      }
      var eventDocumentData = null;
      var previousEventDocumentData = null;
      var operation = null;
      if (previousDeleted && !documentDeleted) {
        operation = "INSERT";
        eventDocumentData = hasAttachments ? stripAttachmentsDataFromDocument(document2) : document2;
      } else if (previous && !previousDeleted && !documentDeleted) {
        operation = "UPDATE";
        eventDocumentData = hasAttachments ? stripAttachmentsDataFromDocument(document2) : document2;
        previousEventDocumentData = previous;
      } else if (documentDeleted) {
        operation = "DELETE";
        eventDocumentData = ensureNotFalsy(document2);
        previousEventDocumentData = previous;
      } else {
        throw newRxError("SNH", {
          args: {
            writeRow
          }
        });
      }
      var _event = {
        documentId: docId,
        documentData: eventDocumentData,
        previousDocumentData: previousEventDocumentData,
        operation
      };
      eventBulkEvents.push(_event);
    }
  };
  for (var rowId = 0; rowId < rowAmount; rowId++) {
    if (_loop()) continue;
  }
  return {
    bulkInsertDocs,
    bulkUpdateDocs,
    newestRow,
    errors,
    eventBulk,
    attachmentsAdd,
    attachmentsRemove,
    attachmentsUpdate
  };
}
function stripAttachmentsDataFromRow(writeRow) {
  return {
    previous: writeRow.previous,
    document: stripAttachmentsDataFromDocument(writeRow.document)
  };
}
function getAttachmentSize(attachmentBase64String) {
  return atob(attachmentBase64String).length;
}
function attachmentWriteDataToNormalData(writeData) {
  var data = writeData.data;
  if (!data) {
    return writeData;
  }
  var ret = {
    length: getAttachmentSize(data),
    digest: writeData.digest,
    type: writeData.type
  };
  return ret;
}
function stripAttachmentsDataFromDocument(doc) {
  if (!doc._attachments || Object.keys(doc._attachments).length === 0) {
    return doc;
  }
  var useDoc = flatClone(doc);
  useDoc._attachments = {};
  Object.entries(doc._attachments).forEach(([attachmentId, attachmentData]) => {
    useDoc._attachments[attachmentId] = attachmentWriteDataToNormalData(attachmentData);
  });
  return useDoc;
}
function flatCloneDocWithMeta(doc) {
  return Object.assign({}, doc, {
    _meta: flatClone(doc._meta)
  });
}
function getWrappedStorageInstance(database, storageInstance, rxJsonSchema) {
  overwritable.deepFreezeWhenDevMode(rxJsonSchema);
  var primaryPath = getPrimaryFieldOfPrimaryKey(storageInstance.schema.primaryKey);
  var ret = {
    originalStorageInstance: storageInstance,
    schema: storageInstance.schema,
    internals: storageInstance.internals,
    collectionName: storageInstance.collectionName,
    databaseName: storageInstance.databaseName,
    options: storageInstance.options,
    async bulkWrite(rows, context2) {
      var databaseToken = database.token;
      var toStorageWriteRows = new Array(rows.length);
      var time = now();
      for (var index = 0; index < rows.length; index++) {
        var writeRow = rows[index];
        var document2 = flatCloneDocWithMeta(writeRow.document);
        document2._meta.lwt = time;
        var previous = writeRow.previous;
        document2._rev = createRevision(databaseToken, previous);
        toStorageWriteRows[index] = {
          document: document2,
          previous
        };
      }
      runPluginHooks("preStorageWrite", {
        storageInstance: this.originalStorageInstance,
        rows: toStorageWriteRows
      });
      var writeResult = await database.lockedRun(() => storageInstance.bulkWrite(toStorageWriteRows, context2));
      var useWriteResult = {
        error: []
      };
      BULK_WRITE_ROWS_BY_RESPONSE.set(useWriteResult, toStorageWriteRows);
      var reInsertErrors = writeResult.error.length === 0 ? [] : writeResult.error.filter((error) => {
        if (error.status === 409 && !error.writeRow.previous && !error.writeRow.document._deleted && ensureNotFalsy(error.documentInDb)._deleted) {
          return true;
        }
        useWriteResult.error.push(error);
        return false;
      });
      if (reInsertErrors.length > 0) {
        var reInsertIds = /* @__PURE__ */ new Set();
        var reInserts = reInsertErrors.map((error) => {
          reInsertIds.add(error.documentId);
          return {
            previous: error.documentInDb,
            document: Object.assign({}, error.writeRow.document, {
              _rev: createRevision(database.token, error.documentInDb)
            })
          };
        });
        var subResult = await database.lockedRun(() => storageInstance.bulkWrite(reInserts, context2));
        appendToArray(useWriteResult.error, subResult.error);
        var successArray = getWrittenDocumentsFromBulkWriteResponse(primaryPath, toStorageWriteRows, useWriteResult, reInsertIds);
        var subSuccess = getWrittenDocumentsFromBulkWriteResponse(primaryPath, reInserts, subResult);
        appendToArray(successArray, subSuccess);
        return useWriteResult;
      }
      return useWriteResult;
    },
    query(preparedQuery) {
      return database.lockedRun(() => storageInstance.query(preparedQuery));
    },
    count(preparedQuery) {
      return database.lockedRun(() => storageInstance.count(preparedQuery));
    },
    findDocumentsById(ids, deleted) {
      return database.lockedRun(() => storageInstance.findDocumentsById(ids, deleted));
    },
    getAttachmentData(documentId, attachmentId, digest) {
      return database.lockedRun(() => storageInstance.getAttachmentData(documentId, attachmentId, digest));
    },
    getChangedDocumentsSince: !storageInstance.getChangedDocumentsSince ? void 0 : (limit, checkpoint) => {
      return database.lockedRun(() => storageInstance.getChangedDocumentsSince(ensureNotFalsy(limit), checkpoint));
    },
    cleanup(minDeletedTime) {
      return database.lockedRun(() => storageInstance.cleanup(minDeletedTime));
    },
    remove() {
      database.storageInstances.delete(ret);
      return database.lockedRun(() => storageInstance.remove());
    },
    close() {
      database.storageInstances.delete(ret);
      return database.lockedRun(() => storageInstance.close());
    },
    changeStream() {
      return storageInstance.changeStream();
    }
  };
  database.storageInstances.add(ret);
  return ret;
}
function ensureRxStorageInstanceParamsAreCorrect(params) {
  if (params.schema.keyCompression) {
    throw newRxError("UT5", {
      args: {
        params
      }
    });
  }
  if (hasEncryption(params.schema)) {
    throw newRxError("UT6", {
      args: {
        params
      }
    });
  }
  if (params.schema.attachments && params.schema.attachments.compression) {
    throw newRxError("UT7", {
      args: {
        params
      }
    });
  }
}
function hasEncryption(jsonSchema) {
  if (!!jsonSchema.encrypted && jsonSchema.encrypted.length > 0 || jsonSchema.attachments && jsonSchema.attachments.encrypted) {
    return true;
  } else {
    return false;
  }
}
function getChangedDocumentsSinceQuery(storageInstance, limit, checkpoint) {
  var primaryPath = getPrimaryFieldOfPrimaryKey(storageInstance.schema.primaryKey);
  var sinceLwt = checkpoint ? checkpoint.lwt : RX_META_LWT_MINIMUM;
  var sinceId = checkpoint ? checkpoint.id : "";
  return normalizeMangoQuery(storageInstance.schema, {
    selector: {
      $or: [{
        "_meta.lwt": {
          $gt: sinceLwt
        }
      }, {
        "_meta.lwt": {
          $eq: sinceLwt
        },
        [primaryPath]: {
          $gt: checkpoint ? sinceId : ""
        }
      }],
      // add this hint for better index usage
      "_meta.lwt": {
        $gte: sinceLwt
      }
    },
    sort: [{
      "_meta.lwt": "asc"
    }, {
      [primaryPath]: "asc"
    }],
    skip: 0,
    limit
    /**
     * DO NOT SET A SPECIFIC INDEX HERE!
     * The query might be modified by some plugin
     * before sending it to the storage.
     * We can be sure that in the end the query planner
     * will find the best index.
     */
    // index: ['_meta.lwt', primaryPath]
  });
}
async function getChangedDocumentsSince(storageInstance, limit, checkpoint) {
  if (storageInstance.getChangedDocumentsSince) {
    return storageInstance.getChangedDocumentsSince(limit, checkpoint);
  }
  var primaryPath = getPrimaryFieldOfPrimaryKey(storageInstance.schema.primaryKey);
  var query = prepareQuery(storageInstance.schema, getChangedDocumentsSinceQuery(storageInstance, limit, checkpoint));
  var result = await storageInstance.query(query);
  var documents = result.documents;
  var lastDoc = lastOfArray(documents);
  return {
    documents,
    checkpoint: lastDoc ? {
      id: lastDoc[primaryPath],
      lwt: lastDoc._meta.lwt
    } : checkpoint ? checkpoint : {
      id: "",
      lwt: 0
    }
  };
}
var BULK_WRITE_ROWS_BY_RESPONSE = /* @__PURE__ */ new WeakMap();
var BULK_WRITE_SUCCESS_MAP = /* @__PURE__ */ new WeakMap();
function getWrittenDocumentsFromBulkWriteResponse(primaryPath, writeRows, response, reInsertIds) {
  return getFromMapOrCreate(BULK_WRITE_SUCCESS_MAP, response, () => {
    var ret = [];
    var realWriteRows = BULK_WRITE_ROWS_BY_RESPONSE.get(response);
    if (!realWriteRows) {
      realWriteRows = writeRows;
    }
    if (response.error.length > 0 || reInsertIds) {
      var errorIds = reInsertIds ? reInsertIds : /* @__PURE__ */ new Set();
      for (var index = 0; index < response.error.length; index++) {
        var error = response.error[index];
        errorIds.add(error.documentId);
      }
      for (var _index = 0; _index < realWriteRows.length; _index++) {
        var doc = realWriteRows[_index].document;
        if (!errorIds.has(doc[primaryPath])) {
          ret.push(stripAttachmentsDataFromDocument(doc));
        }
      }
    } else {
      ret.length = writeRows.length - response.error.length;
      for (var _index2 = 0; _index2 < realWriteRows.length; _index2++) {
        var _doc = realWriteRows[_index2].document;
        ret[_index2] = stripAttachmentsDataFromDocument(_doc);
      }
    }
    return ret;
  });
}

// node_modules/rxdb/dist/esm/incremental-write.js
var IncrementalWriteQueue = /* @__PURE__ */ function() {
  function IncrementalWriteQueue2(storageInstance, primaryPath, preWrite, postWrite) {
    this.queueByDocId = /* @__PURE__ */ new Map();
    this.isRunning = false;
    this.storageInstance = storageInstance;
    this.primaryPath = primaryPath;
    this.preWrite = preWrite;
    this.postWrite = postWrite;
  }
  var _proto = IncrementalWriteQueue2.prototype;
  _proto.addWrite = function addWrite(lastKnownDocumentState, modifier) {
    var docId = lastKnownDocumentState[this.primaryPath];
    var ar = getFromMapOrCreate(this.queueByDocId, docId, () => []);
    var ret = new Promise((resolve2, reject) => {
      var item = {
        lastKnownDocumentState,
        modifier,
        resolve: resolve2,
        reject
      };
      ensureNotFalsy(ar).push(item);
      this.triggerRun();
    });
    return ret;
  };
  _proto.triggerRun = async function triggerRun() {
    if (this.isRunning === true || this.queueByDocId.size === 0) {
      return;
    }
    this.isRunning = true;
    var writeRows = [];
    var itemsById = this.queueByDocId;
    this.queueByDocId = /* @__PURE__ */ new Map();
    await Promise.all(Array.from(itemsById.entries()).map(async ([_docId, items]) => {
      var oldData = findNewestOfDocumentStates(items.map((i) => i.lastKnownDocumentState));
      var newData = oldData;
      for (var item of items) {
        try {
          newData = await item.modifier(
            /**
             * We have to clone() each time because the modifier
             * might throw while it already changed some properties
             * of the document.
             */
            clone(newData)
          );
        } catch (err) {
          item.reject(err);
          item.reject = () => {
          };
          item.resolve = () => {
          };
        }
      }
      try {
        await this.preWrite(newData, oldData);
      } catch (err) {
        items.forEach((item2) => item2.reject(err));
        return;
      }
      writeRows.push({
        previous: oldData,
        document: newData
      });
    }));
    var writeResult = writeRows.length > 0 ? await this.storageInstance.bulkWrite(writeRows, "incremental-write") : {
      error: []
    };
    await Promise.all(getWrittenDocumentsFromBulkWriteResponse(this.primaryPath, writeRows, writeResult).map((result) => {
      var docId = result[this.primaryPath];
      this.postWrite(result);
      var items = getFromMapOrThrow(itemsById, docId);
      items.forEach((item) => item.resolve(result));
    }));
    writeResult.error.forEach((error) => {
      var docId = error.documentId;
      var items = getFromMapOrThrow(itemsById, docId);
      var isConflict = isBulkWriteConflictError(error);
      if (isConflict) {
        var ar = getFromMapOrCreate(this.queueByDocId, docId, () => []);
        items.reverse().forEach((item) => {
          item.lastKnownDocumentState = ensureNotFalsy(isConflict.documentInDb);
          ensureNotFalsy(ar).unshift(item);
        });
      } else {
        var rxError = rxStorageWriteErrorToRxError(error);
        items.forEach((item) => item.reject(rxError));
      }
    });
    this.isRunning = false;
    return this.triggerRun();
  };
  return IncrementalWriteQueue2;
}();
function modifierFromPublicToInternal(publicModifier) {
  var ret = async (docData) => {
    var withoutMeta = stripMetaDataFromDocument(docData);
    withoutMeta._deleted = docData._deleted;
    var modified = await publicModifier(withoutMeta);
    var reattachedMeta = Object.assign({}, modified, {
      _meta: docData._meta,
      _attachments: docData._attachments,
      _rev: docData._rev,
      _deleted: typeof modified._deleted !== "undefined" ? modified._deleted : docData._deleted
    });
    if (typeof reattachedMeta._deleted === "undefined") {
      reattachedMeta._deleted = false;
    }
    return reattachedMeta;
  };
  return ret;
}
function findNewestOfDocumentStates(docs) {
  var newest = docs[0];
  var newestRevisionHeight = getHeightOfRevision(newest._rev);
  docs.forEach((doc) => {
    var height = getHeightOfRevision(doc._rev);
    if (height > newestRevisionHeight) {
      newest = doc;
      newestRevisionHeight = height;
    }
  });
  return newest;
}

// node_modules/rxdb/dist/esm/rx-document.js
var basePrototype = {
  get primaryPath() {
    var _this = this;
    if (!_this.isInstanceOfRxDocument) {
      return void 0;
    }
    return _this.collection.schema.primaryPath;
  },
  get primary() {
    var _this = this;
    if (!_this.isInstanceOfRxDocument) {
      return void 0;
    }
    return _this._data[_this.primaryPath];
  },
  get revision() {
    var _this = this;
    if (!_this.isInstanceOfRxDocument) {
      return void 0;
    }
    return _this._data._rev;
  },
  get deleted$() {
    var _this = this;
    if (!_this.isInstanceOfRxDocument) {
      return void 0;
    }
    return _this.$.pipe(map((d) => d._data._deleted));
  },
  get deleted$$() {
    var _this = this;
    var reactivity = _this.collection.database.getReactivityFactory();
    return reactivity.fromObservable(_this.deleted$, _this.getLatest().deleted, _this.collection.database);
  },
  get deleted() {
    var _this = this;
    if (!_this.isInstanceOfRxDocument) {
      return void 0;
    }
    return _this._data._deleted;
  },
  getLatest() {
    var latestDocData = this.collection._docCache.getLatestDocumentData(this.primary);
    return this.collection._docCache.getCachedRxDocument(latestDocData);
  },
  /**
   * returns the observable which emits the plain-data of this document
   */
  get $() {
    var _this = this;
    var id = this.primary;
    return _this.collection.eventBulks$.pipe(filter((bulk) => !bulk.isLocal), map((bulk) => bulk.events.find((ev) => ev.documentId === id)), filter((event) => !!event), map((changeEvent) => getDocumentDataOfRxChangeEvent(ensureNotFalsy(changeEvent))), startWith(_this.collection._docCache.getLatestDocumentData(id)), distinctUntilChanged((prev, curr) => prev._rev === curr._rev), map((docData) => this.collection._docCache.getCachedRxDocument(docData)), shareReplay(RXJS_SHARE_REPLAY_DEFAULTS));
  },
  get $$() {
    var _this = this;
    var reactivity = _this.collection.database.getReactivityFactory();
    return reactivity.fromObservable(_this.$, _this.getLatest()._data, _this.collection.database);
  },
  /**
   * returns observable of the value of the given path
   */
  get$(path) {
    if (overwritable.isDevMode()) {
      if (path.includes(".item.")) {
        throw newRxError("DOC1", {
          path
        });
      }
      if (path === this.primaryPath) {
        throw newRxError("DOC2");
      }
      if (this.collection.schema.finalFields.includes(path)) {
        throw newRxError("DOC3", {
          path
        });
      }
      var schemaObj = getSchemaByObjectPath(this.collection.schema.jsonSchema, path);
      if (!schemaObj) {
        throw newRxError("DOC4", {
          path
        });
      }
    }
    return this.$.pipe(map((data) => getProperty(data, path)), distinctUntilChanged());
  },
  get$$(path) {
    var obs = this.get$(path);
    var reactivity = this.collection.database.getReactivityFactory();
    return reactivity.fromObservable(obs, this.getLatest().get(path), this.collection.database);
  },
  /**
   * populate the given path
   */
  populate(path) {
    var schemaObj = getSchemaByObjectPath(this.collection.schema.jsonSchema, path);
    var value = this.get(path);
    if (!value) {
      return PROMISE_RESOLVE_NULL;
    }
    if (!schemaObj) {
      throw newRxError("DOC5", {
        path
      });
    }
    if (!schemaObj.ref) {
      throw newRxError("DOC6", {
        path,
        schemaObj
      });
    }
    var refCollection = this.collection.database.collections[schemaObj.ref];
    if (!refCollection) {
      throw newRxError("DOC7", {
        ref: schemaObj.ref,
        path,
        schemaObj
      });
    }
    if (schemaObj.type === "array") {
      return refCollection.findByIds(value).exec().then((res) => {
        var valuesIterator = res.values();
        return Array.from(valuesIterator);
      });
    } else {
      return refCollection.findOne(value).exec();
    }
  },
  /**
   * get data by objectPath
   * @hotPath Performance here is really important,
   * run some tests before changing anything.
   */
  get(objPath) {
    return getDocumentProperty(this, objPath);
  },
  toJSON(withMetaFields = false) {
    if (!withMetaFields) {
      var data = flatClone(this._data);
      delete data._rev;
      delete data._attachments;
      delete data._deleted;
      delete data._meta;
      return overwritable.deepFreezeWhenDevMode(data);
    } else {
      return overwritable.deepFreezeWhenDevMode(this._data);
    }
  },
  toMutableJSON(withMetaFields = false) {
    return clone(this.toJSON(withMetaFields));
  },
  /**
   * updates document
   * @overwritten by plugin (optional)
   * @param updateObj mongodb-like syntax
   */
  update(_updateObj) {
    throw pluginMissing("update");
  },
  incrementalUpdate(_updateObj) {
    throw pluginMissing("update");
  },
  updateCRDT(_updateObj) {
    throw pluginMissing("crdt");
  },
  putAttachment() {
    throw pluginMissing("attachments");
  },
  getAttachment() {
    throw pluginMissing("attachments");
  },
  allAttachments() {
    throw pluginMissing("attachments");
  },
  get allAttachments$() {
    throw pluginMissing("attachments");
  },
  async modify(mutationFunction, _context) {
    var oldData = this._data;
    var newData = await modifierFromPublicToInternal(mutationFunction)(oldData);
    return this._saveData(newData, oldData);
  },
  /**
   * runs an incremental update over the document
   * @param function that takes the document-data and returns a new data-object
   */
  incrementalModify(mutationFunction, _context) {
    return this.collection.incrementalWriteQueue.addWrite(this._data, modifierFromPublicToInternal(mutationFunction)).then((result) => this.collection._docCache.getCachedRxDocument(result));
  },
  patch(patch) {
    var oldData = this._data;
    var newData = clone(oldData);
    Object.entries(patch).forEach(([k, v]) => {
      newData[k] = v;
    });
    return this._saveData(newData, oldData);
  },
  /**
   * patches the given properties
   */
  incrementalPatch(patch) {
    return this.incrementalModify((docData) => {
      Object.entries(patch).forEach(([k, v]) => {
        docData[k] = v;
      });
      return docData;
    });
  },
  /**
   * saves the new document-data
   * and handles the events
   */
  async _saveData(newData, oldData) {
    newData = flatClone(newData);
    if (this._data._deleted) {
      throw newRxError("DOC11", {
        id: this.primary,
        document: this
      });
    }
    await beforeDocumentUpdateWrite(this.collection, newData, oldData);
    var writeRows = [{
      previous: oldData,
      document: newData
    }];
    var writeResult = await this.collection.storageInstance.bulkWrite(writeRows, "rx-document-save-data");
    var isError = writeResult.error[0];
    throwIfIsStorageWriteError(this.collection, this.primary, newData, isError);
    await this.collection._runHooks("post", "save", newData, this);
    return this.collection._docCache.getCachedRxDocument(getWrittenDocumentsFromBulkWriteResponse(this.collection.schema.primaryPath, writeRows, writeResult)[0]);
  },
  /**
   * Remove the document.
   * Notice that there is no hard delete,
   * instead deleted documents get flagged with _deleted=true.
   */
  async remove() {
    if (this.deleted) {
      return Promise.reject(newRxError("DOC13", {
        document: this,
        id: this.primary
      }));
    }
    var removeResult = await this.collection.bulkRemove([this]);
    if (removeResult.error.length > 0) {
      var error = removeResult.error[0];
      throwIfIsStorageWriteError(this.collection, this.primary, this._data, error);
    }
    return removeResult.success[0];
  },
  incrementalRemove() {
    return this.incrementalModify(async (docData) => {
      await this.collection._runHooks("pre", "remove", docData, this);
      docData._deleted = true;
      return docData;
    }).then(async (newDoc) => {
      await this.collection._runHooks("post", "remove", newDoc._data, newDoc);
      return newDoc;
    });
  },
  close() {
    throw newRxError("DOC14");
  }
};
function createRxDocumentConstructor(proto = basePrototype) {
  var constructor = function RxDocumentConstructor(collection, docData) {
    this.collection = collection;
    this._data = docData;
    this._propertyCache = /* @__PURE__ */ new Map();
    this.isInstanceOfRxDocument = true;
  };
  constructor.prototype = proto;
  return constructor;
}
function createWithConstructor(constructor, collection, jsonData) {
  var doc = new constructor(collection, jsonData);
  runPluginHooks("createRxDocument", doc);
  return doc;
}
function beforeDocumentUpdateWrite(collection, newData, oldData) {
  newData._meta = Object.assign({}, oldData._meta, newData._meta);
  if (overwritable.isDevMode()) {
    collection.schema.validateChange(oldData, newData);
  }
  return collection._runHooks("pre", "save", newData, oldData);
}
function getDocumentProperty(doc, objPath) {
  return getFromMapOrCreate(doc._propertyCache, objPath, () => {
    var valueObj = getProperty(doc._data, objPath);
    if (typeof valueObj !== "object" || valueObj === null || Array.isArray(valueObj)) {
      return overwritable.deepFreezeWhenDevMode(valueObj);
    }
    var proxy = new Proxy(
      /**
       * In dev-mode, the _data is deep-frozen
       * so we have to flat clone here so that
       * the proxy can work.
       */
      flatClone(valueObj),
      {
        /**
         * @performance is really important here
         * because people access nested properties very often
         * and might not be aware that this is internally using a Proxy
         */
        get(target, property) {
          if (typeof property !== "string") {
            return target[property];
          }
          var lastChar = property.charAt(property.length - 1);
          if (lastChar === "$") {
            if (property.endsWith("$$")) {
              var key = property.slice(0, -2);
              return doc.get$$(trimDots(objPath + "." + key));
            } else {
              var _key = property.slice(0, -1);
              return doc.get$(trimDots(objPath + "." + _key));
            }
          } else if (lastChar === "_") {
            var _key2 = property.slice(0, -1);
            return doc.populate(trimDots(objPath + "." + _key2));
          } else {
            var plainValue = target[property];
            if (typeof plainValue === "number" || typeof plainValue === "string" || typeof plainValue === "boolean") {
              return plainValue;
            }
            return getDocumentProperty(doc, trimDots(objPath + "." + property));
          }
        }
      }
    );
    return proxy;
  });
}

// node_modules/event-reduce-js/dist/esm/src/util.js
function lastOfArray2(ar) {
  return ar[ar.length - 1];
}
function isObject3(value) {
  const type5 = typeof value;
  return value !== null && (type5 === "object" || type5 === "function");
}
function getProperty2(object, path, value) {
  if (Array.isArray(path)) {
    path = path.join(".");
  }
  if (!isObject3(object) || typeof path !== "string") {
    return value === void 0 ? object : value;
  }
  const pathArray = path.split(".");
  if (pathArray.length === 0) {
    return value;
  }
  for (let index = 0; index < pathArray.length; index++) {
    const key = pathArray[index];
    if (isStringIndex2(object, key)) {
      object = index === pathArray.length - 1 ? void 0 : null;
    } else {
      object = object[key];
    }
    if (object === void 0 || object === null) {
      if (index !== pathArray.length - 1) {
        return value;
      }
      break;
    }
  }
  return object === void 0 ? value : object;
}
function isStringIndex2(object, key) {
  if (typeof key !== "number" && Array.isArray(object)) {
    const index = Number.parseInt(key, 10);
    return Number.isInteger(index) && object[index] === object[key];
  }
  return false;
}

// node_modules/event-reduce-js/dist/esm/src/states/state-resolver.js
var hasLimit = (input) => {
  return !!input.queryParams.limit;
};
var isFindOne = (input) => {
  return input.queryParams.limit === 1;
};
var hasSkip = (input) => {
  if (input.queryParams.skip && input.queryParams.skip > 0) {
    return true;
  } else {
    return false;
  }
};
var isDelete = (input) => {
  return input.changeEvent.operation === "DELETE";
};
var isInsert = (input) => {
  return input.changeEvent.operation === "INSERT";
};
var isUpdate = (input) => {
  return input.changeEvent.operation === "UPDATE";
};
var wasLimitReached = (input) => {
  return hasLimit(input) && input.previousResults.length >= input.queryParams.limit;
};
var sortParamsChanged = (input) => {
  const sortFields = input.queryParams.sortFields;
  const prev = input.changeEvent.previous;
  const doc = input.changeEvent.doc;
  if (!doc) {
    return false;
  }
  if (!prev) {
    return true;
  }
  for (let i = 0; i < sortFields.length; i++) {
    const field = sortFields[i];
    const beforeData = getProperty2(prev, field);
    const afterData = getProperty2(doc, field);
    if (beforeData !== afterData) {
      return true;
    }
  }
  return false;
};
var wasInResult = (input) => {
  const id = input.changeEvent.id;
  if (input.keyDocumentMap) {
    const has2 = input.keyDocumentMap.has(id);
    return has2;
  } else {
    const primary = input.queryParams.primaryKey;
    const results = input.previousResults;
    for (let i = 0; i < results.length; i++) {
      const item = results[i];
      if (item[primary] === id) {
        return true;
      }
    }
    return false;
  }
};
var wasFirst = (input) => {
  const first = input.previousResults[0];
  if (first && first[input.queryParams.primaryKey] === input.changeEvent.id) {
    return true;
  } else {
    return false;
  }
};
var wasLast = (input) => {
  const last2 = lastOfArray2(input.previousResults);
  if (last2 && last2[input.queryParams.primaryKey] === input.changeEvent.id) {
    return true;
  } else {
    return false;
  }
};
var wasSortedBeforeFirst = (input) => {
  const prev = input.changeEvent.previous;
  if (!prev) {
    return false;
  }
  const first = input.previousResults[0];
  if (!first) {
    return false;
  }
  if (first[input.queryParams.primaryKey] === input.changeEvent.id) {
    return true;
  }
  const comp = input.queryParams.sortComparator(prev, first);
  return comp < 0;
};
var wasSortedAfterLast = (input) => {
  const prev = input.changeEvent.previous;
  if (!prev) {
    return false;
  }
  const last2 = lastOfArray2(input.previousResults);
  if (!last2) {
    return false;
  }
  if (last2[input.queryParams.primaryKey] === input.changeEvent.id) {
    return true;
  }
  const comp = input.queryParams.sortComparator(prev, last2);
  return comp > 0;
};
var isSortedBeforeFirst = (input) => {
  const doc = input.changeEvent.doc;
  if (!doc) {
    return false;
  }
  const first = input.previousResults[0];
  if (!first) {
    return false;
  }
  if (first[input.queryParams.primaryKey] === input.changeEvent.id) {
    return true;
  }
  const comp = input.queryParams.sortComparator(doc, first);
  return comp < 0;
};
var isSortedAfterLast = (input) => {
  const doc = input.changeEvent.doc;
  if (!doc) {
    return false;
  }
  const last2 = lastOfArray2(input.previousResults);
  if (!last2) {
    return false;
  }
  if (last2[input.queryParams.primaryKey] === input.changeEvent.id) {
    return true;
  }
  const comp = input.queryParams.sortComparator(doc, last2);
  return comp > 0;
};
var wasMatching = (input) => {
  const prev = input.changeEvent.previous;
  if (!prev) {
    return false;
  }
  return input.queryParams.queryMatcher(prev);
};
var doesMatchNow = (input) => {
  const doc = input.changeEvent.doc;
  if (!doc) {
    return false;
  }
  const ret = input.queryParams.queryMatcher(doc);
  return ret;
};
var wasResultsEmpty = (input) => {
  return input.previousResults.length === 0;
};

// node_modules/event-reduce-js/dist/esm/src/states/index.js
var stateResolveFunctionByIndex = {
  0: isInsert,
  1: isUpdate,
  2: isDelete,
  3: hasLimit,
  4: isFindOne,
  5: hasSkip,
  6: wasResultsEmpty,
  7: wasLimitReached,
  8: wasFirst,
  9: wasLast,
  10: sortParamsChanged,
  11: wasInResult,
  12: wasSortedBeforeFirst,
  13: wasSortedAfterLast,
  14: isSortedBeforeFirst,
  15: isSortedAfterLast,
  16: wasMatching,
  17: doesMatchNow
};

// node_modules/array-push-at-sort-position/dist/esm/index.js
function pushAtSortPosition(array, item, compareFunction, low) {
  var length = array.length;
  var high = length - 1;
  var mid = 0;
  if (length === 0) {
    array.push(item);
    return 0;
  }
  var lastMidDoc;
  while (low <= high) {
    mid = low + (high - low >> 1);
    lastMidDoc = array[mid];
    if (compareFunction(lastMidDoc, item) <= 0) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  if (compareFunction(lastMidDoc, item) <= 0) {
    mid++;
  }
  array.splice(mid, 0, item);
  return mid;
}

// node_modules/event-reduce-js/dist/esm/src/actions/action-functions.js
var doNothing = (_input) => {
};
var insertFirst = (input) => {
  input.previousResults.unshift(input.changeEvent.doc);
  if (input.keyDocumentMap) {
    input.keyDocumentMap.set(input.changeEvent.id, input.changeEvent.doc);
  }
};
var insertLast = (input) => {
  input.previousResults.push(input.changeEvent.doc);
  if (input.keyDocumentMap) {
    input.keyDocumentMap.set(input.changeEvent.id, input.changeEvent.doc);
  }
};
var removeFirstItem = (input) => {
  const first = input.previousResults.shift();
  if (input.keyDocumentMap && first) {
    input.keyDocumentMap.delete(first[input.queryParams.primaryKey]);
  }
};
var removeLastItem = (input) => {
  const last2 = input.previousResults.pop();
  if (input.keyDocumentMap && last2) {
    input.keyDocumentMap.delete(last2[input.queryParams.primaryKey]);
  }
};
var removeFirstInsertLast = (input) => {
  removeFirstItem(input);
  insertLast(input);
};
var removeLastInsertFirst = (input) => {
  removeLastItem(input);
  insertFirst(input);
};
var removeFirstInsertFirst = (input) => {
  removeFirstItem(input);
  insertFirst(input);
};
var removeLastInsertLast = (input) => {
  removeLastItem(input);
  insertLast(input);
};
var removeExisting = (input) => {
  if (input.keyDocumentMap) {
    input.keyDocumentMap.delete(input.changeEvent.id);
  }
  const primary = input.queryParams.primaryKey;
  const results = input.previousResults;
  for (let i = 0; i < results.length; i++) {
    const item = results[i];
    if (item[primary] === input.changeEvent.id) {
      results.splice(i, 1);
      break;
    }
  }
};
var replaceExisting = (input) => {
  const doc = input.changeEvent.doc;
  const primary = input.queryParams.primaryKey;
  const results = input.previousResults;
  for (let i = 0; i < results.length; i++) {
    const item = results[i];
    if (item[primary] === input.changeEvent.id) {
      results[i] = doc;
      if (input.keyDocumentMap) {
        input.keyDocumentMap.set(input.changeEvent.id, doc);
      }
      break;
    }
  }
};
var alwaysWrong = (input) => {
  const wrongHuman = {
    _id: "wrongHuman" + (/* @__PURE__ */ new Date()).getTime()
  };
  input.previousResults.length = 0;
  input.previousResults.push(wrongHuman);
  if (input.keyDocumentMap) {
    input.keyDocumentMap.clear();
    input.keyDocumentMap.set(wrongHuman._id, wrongHuman);
  }
};
var insertAtSortPosition = (input) => {
  const docId = input.changeEvent.id;
  const doc = input.changeEvent.doc;
  if (input.keyDocumentMap) {
    if (input.keyDocumentMap.has(docId)) {
      return;
    }
    input.keyDocumentMap.set(docId, doc);
  } else {
    const isDocInResults = input.previousResults.find((d) => d[input.queryParams.primaryKey] === docId);
    if (isDocInResults) {
      return;
    }
  }
  pushAtSortPosition(input.previousResults, doc, input.queryParams.sortComparator, 0);
};
var removeExistingAndInsertAtSortPosition = (input) => {
  removeExisting(input);
  insertAtSortPosition(input);
};
var runFullQueryAgain = (_input) => {
  throw new Error("Action runFullQueryAgain must be implemented by yourself");
};
var unknownAction = (_input) => {
  throw new Error("Action unknownAction should never be called");
};

// node_modules/event-reduce-js/dist/esm/src/actions/index.js
var orderedActionList = [
  "doNothing",
  "insertFirst",
  "insertLast",
  "removeFirstItem",
  "removeLastItem",
  "removeFirstInsertLast",
  "removeLastInsertFirst",
  "removeFirstInsertFirst",
  "removeLastInsertLast",
  "removeExisting",
  "replaceExisting",
  "alwaysWrong",
  "insertAtSortPosition",
  "removeExistingAndInsertAtSortPosition",
  "runFullQueryAgain",
  "unknownAction"
];
var actionFunctions = {
  doNothing,
  insertFirst,
  insertLast,
  removeFirstItem,
  removeLastItem,
  removeFirstInsertLast,
  removeLastInsertFirst,
  removeFirstInsertFirst,
  removeLastInsertLast,
  removeExisting,
  replaceExisting,
  alwaysWrong,
  insertAtSortPosition,
  removeExistingAndInsertAtSortPosition,
  runFullQueryAgain,
  unknownAction
};

// node_modules/binary-decision-diagram/dist/esm/src/minimal-string/string-format.js
var CHAR_CODE_OFFSET = 40;
function getNumberOfChar(char) {
  const charCode = char.charCodeAt(0);
  return charCode - CHAR_CODE_OFFSET;
}

// node_modules/binary-decision-diagram/dist/esm/src/util.js
function booleanToBooleanString(b) {
  if (b) {
    return "1";
  } else {
    return "0";
  }
}
function makeid(length = 6) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
var nodeIdPrefix = makeid(4);
function splitStringToChunks(str, chunkSize) {
  const chunks = [];
  for (let i = 0, charsLength = str.length; i < charsLength; i += chunkSize) {
    chunks.push(str.substring(i, i + chunkSize));
  }
  return chunks;
}

// node_modules/binary-decision-diagram/dist/esm/src/minimal-string/minimal-string-to-simple-bdd.js
function minimalStringToSimpleBdd(str) {
  const nodesById = /* @__PURE__ */ new Map();
  const leafNodeAmount = parseInt(str.charAt(0) + str.charAt(1), 10);
  const lastLeafNodeChar = 2 + leafNodeAmount * 2;
  const leafNodeChars = str.substring(2, lastLeafNodeChar);
  const leafNodeChunks = splitStringToChunks(leafNodeChars, 2);
  for (let i = 0; i < leafNodeChunks.length; i++) {
    const chunk = leafNodeChunks[i];
    const id = chunk.charAt(0);
    const value = getNumberOfChar(chunk.charAt(1));
    nodesById.set(id, value);
  }
  const internalNodeChars = str.substring(lastLeafNodeChar, str.length - 3);
  const internalNodeChunks = splitStringToChunks(internalNodeChars, 4);
  for (let i = 0; i < internalNodeChunks.length; i++) {
    const chunk = internalNodeChunks[i];
    const id = chunk.charAt(0);
    const idOf0Branch = chunk.charAt(1);
    const idOf1Branch = chunk.charAt(2);
    const level = getNumberOfChar(chunk.charAt(3));
    if (!nodesById.has(idOf0Branch)) {
      throw new Error("missing node with id " + idOf0Branch);
    }
    if (!nodesById.has(idOf1Branch)) {
      throw new Error("missing node with id " + idOf1Branch);
    }
    const node0 = nodesById.get(idOf0Branch);
    const node1 = nodesById.get(idOf1Branch);
    const node = {
      l: level,
      // level is first for prettier json output
      0: node0,
      1: node1
    };
    nodesById.set(id, node);
  }
  const last3 = str.slice(-3);
  const idOf0 = last3.charAt(0);
  const idOf1 = last3.charAt(1);
  const levelOfRoot = getNumberOfChar(last3.charAt(2));
  const nodeOf0 = nodesById.get(idOf0);
  const nodeOf1 = nodesById.get(idOf1);
  const rootNode = {
    l: levelOfRoot,
    0: nodeOf0,
    1: nodeOf1
  };
  return rootNode;
}

// node_modules/binary-decision-diagram/dist/esm/src/minimal-string/resolve-with-simple-bdd.js
function resolveWithSimpleBdd(simpleBdd2, fns, input) {
  let currentNode = simpleBdd2;
  let currentLevel = simpleBdd2.l;
  while (true) {
    const booleanResult = fns[currentLevel](input);
    const branchKey = booleanToBooleanString(booleanResult);
    currentNode = currentNode[branchKey];
    if (typeof currentNode === "number" || typeof currentNode === "string") {
      return currentNode;
    } else {
      currentLevel = currentNode.l;
    }
  }
}

// node_modules/event-reduce-js/dist/esm/src/bdd/bdd.generated.js
var minimalBddString = "14a1b,c+d2e5f0g/h.i4j*k-l)m(n6oeh6pnm6qen6ril6snh6tin6ubo9vce9wmh9xns9yne9zmi9{cm9|ad9}cp9~aq9\x7Fae9\xA1bf9\xA2bq9\xA3cg9\xA4ck9\xA5cn9\xA6nd9\xA7np9\xA8nq9\xA9nf9\xAAng9\xABnm9\xACnk9\xADmr9\xAEms9\xAFmt9\xB0mj9\xB1mk9\xB2ml9\xB3mn9\xB4mc8\xB5\xB3{8\xB6\xAF}8\xB7\xB0\xA48\xB8\xB3\xA78\xB9mn8\xBA\xB3\xAB8\xBB\xB3m8\xBCm\xB44\xBDz\xB24\xBE\xB3w4\xBFz\xB54\xC0\xAF\xB64\xC1\xB0\xB74\xC2\xB3\xBA4\xC3\xB3\xB84\xC4m\xB94\xC5v\xA47\xC6yn7\xC7\xC0\xC17\xC8~\x7F7\xC9\xA5\xA47\xCA\xC3\xC47\xCB\xA8n7\xCC\xBA\xB97\xCD\xAD\xB07\xCE\xAEm7\xCF\xAF\xB07\xD0\xB1m7\xD1\xB3m7\xD2\xBCm5\xD3\xC4m5\xD4\xB9m5\xD5\xBD\xB05\xD6\xBEm5\xD7\xBF\xB05\xD8\xC7\xCF5\xD9\xC2m5\xDA\xCA\xD15\xDB\xB1m5\xDC\xBAm5\xDD\xCC\xD15\xDE\xD5\xCD2\xDF|\x7F2\xE0\xA1u2\xE1\xA3\xC52\xE2\xD6\xCE2\xE3\xA6\xC62\xE4\xA9x2\xE5\xAA\xC62\xE6\xD7\xD82\xE7|\xC82\xE8\xA1\xA22\xE9\xA3\xC92\xEA\xA4\xA52\xEB\xD9\xDA2\xEC\xA6\xCB2\xED\xA9n2\xEE\xAAn2\xEF\xDB\xD02\xF0\xDC\xDD2\xF1\xACn2\xF2\xD2\xD3/\xF3an/\xF4bn/\xF5cn/\xF6\xDE\xE2/\xF7\xDF\xE3/\xF8\xE0\xE4/\xF9\xE1\xE5/\xFA\xE6\xEB/\xFB\xE7\xEC/\xFC\xE8\xED/\xFD\xE9\xEE/\xFE\xCD\xCE/\xFF\xCF\xD1/\u0100\xF2\xD4,\u0101cn,\u0102\xF6\xEF,\u0103\xA4\xF1,\u0104\xFA\xF0,\u0105\xEA\xF1,\u0106\xFE\xD0,\u0107\xFF\xD1,\u0108ac0\u0109bc0\u010A\xF3\xF50\u010B\xF4\u01010\u010C\xDF\xE10\u010D\xE0\xA40\u010E\xE7\xE90\u010F\xE8\xEA0\u0110\xF7\xF90\u0111\xF8\u01030\u0112\xFB\xFD0\u0113\xFC\u01050\u0114m\xD2-\u0115m\u0100-\u0116\xDE\xE6-\u0117\u010C\u010E-\u0118\u010D\u010F-\u0119\u0102\u0104-\u011A\u0110\u0112-\u011B\u0111\u0113-\u011C\xB2\xBB-\u011D\xCD\xCF-\u011E\u0106\u0107-\u011F\xB2\xB3-\u0120\u0114\u01083\u0121\u0115\u010A3\u0122\u0116\u01173\u0123\u0119\u011A3\u0124\u0122\u011D(\u0125\u011C\u011F(\u0126\u0123\u011E(\u0127\u0120\u0121+\u0128\u0109\u010B+\u0129\u0124\u0126+\u012A\u0118\u011B+\u012B\u0127\u01281\u012C\u0129\u012A1\u012D\u012C\u012B*\u012E\u0125m*\u012D\u012E.";
var simpleBdd;
function getSimpleBdd() {
  if (!simpleBdd) {
    simpleBdd = minimalStringToSimpleBdd(minimalBddString);
  }
  return simpleBdd;
}
var resolveInput = (input) => {
  return resolveWithSimpleBdd(getSimpleBdd(), stateResolveFunctionByIndex, input);
};

// node_modules/event-reduce-js/dist/esm/src/index.js
function calculateActionName(input) {
  const resolvedActionId = resolveInput(input);
  return orderedActionList[resolvedActionId];
}
function runAction(action, queryParams, changeEvent, previousResults, keyDocumentMap) {
  const fn = actionFunctions[action];
  fn({
    queryParams,
    changeEvent,
    previousResults,
    keyDocumentMap
  });
  return previousResults;
}

// node_modules/rxdb/dist/esm/event-reduce.js
function getSortFieldsOfQuery(primaryKey, query) {
  if (!query.sort || query.sort.length === 0) {
    return [primaryKey];
  } else {
    return query.sort.map((part) => Object.keys(part)[0]);
  }
}
var RXQUERY_QUERY_PARAMS_CACHE = /* @__PURE__ */ new WeakMap();
function getQueryParams(rxQuery) {
  return getFromMapOrCreate(RXQUERY_QUERY_PARAMS_CACHE, rxQuery, () => {
    var collection = rxQuery.collection;
    var normalizedMangoQuery = normalizeMangoQuery(collection.storageInstance.schema, clone(rxQuery.mangoQuery));
    var primaryKey = collection.schema.primaryPath;
    var sortComparator = getSortComparator(collection.schema.jsonSchema, normalizedMangoQuery);
    var useSortComparator = (docA, docB) => {
      var sortComparatorData = {
        docA,
        docB,
        rxQuery
      };
      return sortComparator(sortComparatorData.docA, sortComparatorData.docB);
    };
    var queryMatcher = getQueryMatcher(collection.schema.jsonSchema, normalizedMangoQuery);
    var useQueryMatcher = (doc) => {
      var queryMatcherData = {
        doc,
        rxQuery
      };
      return queryMatcher(queryMatcherData.doc);
    };
    var ret = {
      primaryKey: rxQuery.collection.schema.primaryPath,
      skip: normalizedMangoQuery.skip,
      limit: normalizedMangoQuery.limit,
      sortFields: getSortFieldsOfQuery(primaryKey, normalizedMangoQuery),
      sortComparator: useSortComparator,
      queryMatcher: useQueryMatcher
    };
    return ret;
  });
}
function calculateNewResults(rxQuery, rxChangeEvents) {
  if (!rxQuery.collection.database.eventReduce) {
    return {
      runFullQueryAgain: true
    };
  }
  var queryParams = getQueryParams(rxQuery);
  var previousResults = ensureNotFalsy(rxQuery._result).docsData.slice(0);
  var previousResultsMap = ensureNotFalsy(rxQuery._result).docsDataMap;
  var changed = false;
  var eventReduceEvents = [];
  for (var index = 0; index < rxChangeEvents.length; index++) {
    var cE = rxChangeEvents[index];
    var eventReduceEvent = rxChangeEventToEventReduceChangeEvent(cE);
    if (eventReduceEvent) {
      eventReduceEvents.push(eventReduceEvent);
    }
  }
  var foundNonOptimizeable = eventReduceEvents.find((eventReduceEvent2) => {
    var stateResolveFunctionInput = {
      queryParams,
      changeEvent: eventReduceEvent2,
      previousResults,
      keyDocumentMap: previousResultsMap
    };
    var actionName = calculateActionName(stateResolveFunctionInput);
    if (actionName === "runFullQueryAgain") {
      return true;
    } else if (actionName !== "doNothing") {
      changed = true;
      runAction(actionName, queryParams, eventReduceEvent2, previousResults, previousResultsMap);
      return false;
    }
  });
  if (foundNonOptimizeable) {
    return {
      runFullQueryAgain: true
    };
  } else {
    return {
      runFullQueryAgain: false,
      changed,
      newResults: previousResults
    };
  }
}

// node_modules/rxdb/dist/esm/query-cache.js
var QueryCache = /* @__PURE__ */ function() {
  function QueryCache2() {
    this._map = /* @__PURE__ */ new Map();
  }
  var _proto = QueryCache2.prototype;
  _proto.getByQuery = function getByQuery(rxQuery) {
    var stringRep = rxQuery.toString();
    var ret = getFromMapOrCreate(this._map, stringRep, () => rxQuery);
    return ret;
  };
  return QueryCache2;
}();
function createQueryCache() {
  return new QueryCache();
}
function uncacheRxQuery(queryCache, rxQuery) {
  rxQuery.uncached = true;
  var stringRep = rxQuery.toString();
  queryCache._map.delete(stringRep);
}
function countRxQuerySubscribers(rxQuery) {
  return rxQuery.refCount$.observers.length;
}
var DEFAULT_TRY_TO_KEEP_MAX = 100;
var DEFAULT_UNEXECUTED_LIFETIME = 30 * 1e3;
var defaultCacheReplacementPolicyMonad = (tryToKeepMax, unExecutedLifetime) => (_collection, queryCache) => {
  if (queryCache._map.size < tryToKeepMax) {
    return;
  }
  var minUnExecutedLifetime = now() - unExecutedLifetime;
  var maybeUncache = [];
  var queriesInCache = Array.from(queryCache._map.values());
  for (var rxQuery of queriesInCache) {
    if (countRxQuerySubscribers(rxQuery) > 0) {
      continue;
    }
    if (rxQuery._lastEnsureEqual === 0 && rxQuery._creationTime < minUnExecutedLifetime) {
      uncacheRxQuery(queryCache, rxQuery);
      continue;
    }
    maybeUncache.push(rxQuery);
  }
  var mustUncache = maybeUncache.length - tryToKeepMax;
  if (mustUncache <= 0) {
    return;
  }
  var sortedByLastUsage = maybeUncache.sort((a, b) => a._lastEnsureEqual - b._lastEnsureEqual);
  var toRemove = sortedByLastUsage.slice(0, mustUncache);
  toRemove.forEach((rxQuery2) => uncacheRxQuery(queryCache, rxQuery2));
};
var defaultCacheReplacementPolicy = defaultCacheReplacementPolicyMonad(DEFAULT_TRY_TO_KEEP_MAX, DEFAULT_UNEXECUTED_LIFETIME);
var COLLECTIONS_WITH_RUNNING_CLEANUP = /* @__PURE__ */ new WeakSet();
function triggerCacheReplacement(rxCollection) {
  if (COLLECTIONS_WITH_RUNNING_CLEANUP.has(rxCollection)) {
    return;
  }
  COLLECTIONS_WITH_RUNNING_CLEANUP.add(rxCollection);
  nextTick().then(() => requestIdlePromise(200)).then(() => {
    if (!rxCollection.closed) {
      rxCollection.cacheReplacementPolicy(rxCollection, rxCollection._queryCache);
    }
    COLLECTIONS_WITH_RUNNING_CLEANUP.delete(rxCollection);
  });
}

// node_modules/rxdb/dist/esm/doc-cache.js
var DocumentCache = /* @__PURE__ */ function() {
  function DocumentCache2(primaryPath, changes$, documentCreator) {
    this.cacheItemByDocId = /* @__PURE__ */ new Map();
    this.tasks = /* @__PURE__ */ new Set();
    this.registry = typeof FinalizationRegistry === "function" ? new FinalizationRegistry((docMeta) => {
      var docId = docMeta.docId;
      var cacheItem = this.cacheItemByDocId.get(docId);
      if (cacheItem) {
        cacheItem[0].delete(docMeta.revisionHeight);
        if (cacheItem[0].size === 0) {
          this.cacheItemByDocId.delete(docId);
        }
      }
    }) : void 0;
    this.primaryPath = primaryPath;
    this.changes$ = changes$;
    this.documentCreator = documentCreator;
    changes$.subscribe((events) => {
      this.tasks.add(() => {
        var cacheItemByDocId = this.cacheItemByDocId;
        for (var index = 0; index < events.length; index++) {
          var event = events[index];
          var cacheItem = cacheItemByDocId.get(event.documentId);
          if (cacheItem) {
            var documentData = event.documentData;
            if (!documentData) {
              documentData = event.previousDocumentData;
            }
            cacheItem[1] = documentData;
          }
        }
      });
      if (this.tasks.size <= 1) {
        requestIdlePromiseNoQueue().then(() => {
          this.processTasks();
        });
      }
    });
  }
  var _proto = DocumentCache2.prototype;
  _proto.processTasks = function processTasks() {
    if (this.tasks.size === 0) {
      return;
    }
    var tasks = Array.from(this.tasks);
    tasks.forEach((task) => task());
    this.tasks.clear();
  };
  _proto.getLatestDocumentData = function getLatestDocumentData(docId) {
    this.processTasks();
    var cacheItem = getFromMapOrThrow(this.cacheItemByDocId, docId);
    return cacheItem[1];
  };
  _proto.getLatestDocumentDataIfExists = function getLatestDocumentDataIfExists(docId) {
    this.processTasks();
    var cacheItem = this.cacheItemByDocId.get(docId);
    if (cacheItem) {
      return cacheItem[1];
    }
  };
  return _createClass(DocumentCache2, [{
    key: "getCachedRxDocuments",
    get: function() {
      var fn = getCachedRxDocumentMonad(this);
      return overwriteGetterForCaching(this, "getCachedRxDocuments", fn);
    }
  }, {
    key: "getCachedRxDocument",
    get: function() {
      var fn = getCachedRxDocumentMonad(this);
      return overwriteGetterForCaching(this, "getCachedRxDocument", (doc) => fn([doc])[0]);
    }
  }]);
}();
function getCachedRxDocumentMonad(docCache) {
  var primaryPath = docCache.primaryPath;
  var cacheItemByDocId = docCache.cacheItemByDocId;
  var registry = docCache.registry;
  var deepFreezeWhenDevMode2 = overwritable.deepFreezeWhenDevMode;
  var documentCreator = docCache.documentCreator;
  var fn = (docsData) => {
    var ret = new Array(docsData.length);
    var registryTasks = [];
    for (var index = 0; index < docsData.length; index++) {
      var docData = docsData[index];
      var docId = docData[primaryPath];
      var revisionHeight = getHeightOfRevision(docData._rev);
      var byRev = void 0;
      var cachedRxDocumentWeakRef = void 0;
      var cacheItem = cacheItemByDocId.get(docId);
      if (!cacheItem) {
        byRev = /* @__PURE__ */ new Map();
        cacheItem = [byRev, docData];
        cacheItemByDocId.set(docId, cacheItem);
      } else {
        byRev = cacheItem[0];
        cachedRxDocumentWeakRef = byRev.get(revisionHeight);
      }
      var cachedRxDocument = cachedRxDocumentWeakRef ? cachedRxDocumentWeakRef.deref() : void 0;
      if (!cachedRxDocument) {
        docData = deepFreezeWhenDevMode2(docData);
        cachedRxDocument = documentCreator(docData);
        byRev.set(revisionHeight, createWeakRefWithFallback(cachedRxDocument));
        if (registry) {
          registryTasks.push(cachedRxDocument);
        }
      }
      ret[index] = cachedRxDocument;
    }
    if (registryTasks.length > 0 && registry) {
      docCache.tasks.add(() => {
        for (var _index = 0; _index < registryTasks.length; _index++) {
          var doc = registryTasks[_index];
          registry.register(doc, {
            docId: doc.primary,
            revisionHeight: getHeightOfRevision(doc.revision)
          });
        }
      });
      if (docCache.tasks.size <= 1) {
        requestIdlePromiseNoQueue().then(() => {
          docCache.processTasks();
        });
      }
    }
    return ret;
  };
  return fn;
}
function mapDocumentsDataToCacheDocs(docCache, docsData) {
  var getCachedRxDocuments = docCache.getCachedRxDocuments;
  return getCachedRxDocuments(docsData);
}
var HAS_WEAK_REF = typeof WeakRef === "function";
var createWeakRefWithFallback = HAS_WEAK_REF ? createWeakRef : createWeakRefFallback;
function createWeakRef(obj) {
  return new WeakRef(obj);
}
function createWeakRefFallback(obj) {
  return {
    deref() {
      return obj;
    }
  };
}

// node_modules/rxdb/dist/esm/rx-query-single-result.js
var RxQuerySingleResult = /* @__PURE__ */ function() {
  function RxQuerySingleResult2(query, docsDataFromStorageInstance, count) {
    this.time = now();
    this.query = query;
    this.count = count;
    this.documents = mapDocumentsDataToCacheDocs(this.query.collection._docCache, docsDataFromStorageInstance);
  }
  var _proto = RxQuerySingleResult2.prototype;
  _proto.getValue = function getValue2(throwIfMissing) {
    var op = this.query.op;
    if (op === "count") {
      return this.count;
    } else if (op === "findOne") {
      var doc = this.documents.length === 0 ? null : this.documents[0];
      if (!doc && throwIfMissing) {
        throw newRxError("QU10", {
          collection: this.query.collection.name,
          query: this.query.mangoQuery,
          op
        });
      } else {
        return doc;
      }
    } else if (op === "findByIds") {
      return this.docsMap;
    } else {
      return this.documents.slice(0);
    }
  };
  return _createClass(RxQuerySingleResult2, [{
    key: "docsData",
    get: function() {
      return overwriteGetterForCaching(this, "docsData", this.documents.map((d) => d._data));
    }
    // A key->document map, used in the event reduce optimization.
  }, {
    key: "docsDataMap",
    get: function() {
      var map2 = /* @__PURE__ */ new Map();
      this.documents.forEach((d) => {
        map2.set(d.primary, d._data);
      });
      return overwriteGetterForCaching(this, "docsDataMap", map2);
    }
  }, {
    key: "docsMap",
    get: function() {
      var map2 = /* @__PURE__ */ new Map();
      var documents = this.documents;
      for (var i = 0; i < documents.length; i++) {
        var doc = documents[i];
        map2.set(doc.primary, doc);
      }
      return overwriteGetterForCaching(this, "docsMap", map2);
    }
  }]);
}();

// node_modules/rxdb/dist/esm/rx-query.js
var _queryCount = 0;
var newQueryID = function() {
  return ++_queryCount;
};
var RxQueryBase = /* @__PURE__ */ function() {
  function RxQueryBase2(op, mangoQuery, collection, other = {}) {
    this.id = newQueryID();
    this._execOverDatabaseCount = 0;
    this._creationTime = now();
    this._lastEnsureEqual = 0;
    this.uncached = false;
    this.refCount$ = new BehaviorSubject(null);
    this._result = null;
    this._latestChangeEvent = -1;
    this._ensureEqualQueue = PROMISE_RESOLVE_FALSE;
    this.op = op;
    this.mangoQuery = mangoQuery;
    this.collection = collection;
    this.other = other;
    if (!mangoQuery) {
      this.mangoQuery = _getDefaultQuery();
    }
    this.isFindOneByIdQuery = isFindOneByIdQuery(this.collection.schema.primaryPath, mangoQuery);
  }
  var _proto = RxQueryBase2.prototype;
  _proto._setResultData = function _setResultData(newResultData) {
    if (typeof newResultData === "undefined") {
      throw newRxError("QU18", {
        database: this.collection.database.name,
        collection: this.collection.name
      });
    }
    if (typeof newResultData === "number") {
      this._result = new RxQuerySingleResult(this, [], newResultData);
      return;
    } else if (newResultData instanceof Map) {
      newResultData = Array.from(newResultData.values());
    }
    var newQueryResult = new RxQuerySingleResult(this, newResultData, newResultData.length);
    this._result = newQueryResult;
  };
  _proto._execOverDatabase = async function _execOverDatabase() {
    this._execOverDatabaseCount = this._execOverDatabaseCount + 1;
    if (this.op === "count") {
      var preparedQuery = this.getPreparedQuery();
      var result = await this.collection.storageInstance.count(preparedQuery);
      if (result.mode === "slow" && !this.collection.database.allowSlowCount) {
        throw newRxError("QU14", {
          collection: this.collection,
          queryObj: this.mangoQuery
        });
      } else {
        return result.count;
      }
    }
    if (this.op === "findByIds") {
      var ids = ensureNotFalsy(this.mangoQuery.selector)[this.collection.schema.primaryPath].$in;
      var ret = /* @__PURE__ */ new Map();
      var mustBeQueried = [];
      ids.forEach((id) => {
        var docData = this.collection._docCache.getLatestDocumentDataIfExists(id);
        if (docData) {
          if (!docData._deleted) {
            var doc = this.collection._docCache.getCachedRxDocument(docData);
            ret.set(id, doc);
          }
        } else {
          mustBeQueried.push(id);
        }
      });
      if (mustBeQueried.length > 0) {
        var docs = await this.collection.storageInstance.findDocumentsById(mustBeQueried, false);
        docs.forEach((docData) => {
          var doc = this.collection._docCache.getCachedRxDocument(docData);
          ret.set(doc.primary, doc);
        });
      }
      return ret;
    }
    var docsPromise = queryCollection(this);
    return docsPromise.then((docs2) => {
      return docs2;
    });
  };
  _proto.exec = async function exec(throwIfMissing) {
    if (throwIfMissing && this.op !== "findOne") {
      throw newRxError("QU9", {
        collection: this.collection.name,
        query: this.mangoQuery,
        op: this.op
      });
    }
    await _ensureEqual(this);
    var useResult = ensureNotFalsy(this._result);
    return useResult.getValue(throwIfMissing);
  };
  _proto.toString = function toString() {
    var stringObj = sortObject({
      op: this.op,
      query: normalizeMangoQuery(this.collection.schema.jsonSchema, this.mangoQuery),
      other: this.other
    }, true);
    var value = JSON.stringify(stringObj);
    this.toString = () => value;
    return value;
  };
  _proto.getPreparedQuery = function getPreparedQuery() {
    var hookInput = {
      rxQuery: this,
      // can be mutated by the hooks so we have to deep clone first.
      mangoQuery: normalizeMangoQuery(this.collection.schema.jsonSchema, this.mangoQuery)
    };
    hookInput.mangoQuery.selector._deleted = {
      $eq: false
    };
    if (hookInput.mangoQuery.index) {
      hookInput.mangoQuery.index.unshift("_deleted");
    }
    runPluginHooks("prePrepareQuery", hookInput);
    var value = prepareQuery(this.collection.schema.jsonSchema, hookInput.mangoQuery);
    this.getPreparedQuery = () => value;
    return value;
  };
  _proto.doesDocumentDataMatch = function doesDocumentDataMatch(docData) {
    if (docData._deleted) {
      return false;
    }
    return this.queryMatcher(docData);
  };
  _proto.remove = async function remove2() {
    var docs = await this.exec();
    if (Array.isArray(docs)) {
      var result = await this.collection.bulkRemove(docs);
      if (result.error.length > 0) {
        throw rxStorageWriteErrorToRxError(result.error[0]);
      } else {
        return result.success;
      }
    } else {
      return docs.remove();
    }
  };
  _proto.incrementalRemove = function incrementalRemove() {
    return runQueryUpdateFunction(this.asRxQuery, (doc) => doc.incrementalRemove());
  };
  _proto.update = function update(_updateObj) {
    throw pluginMissing("update");
  };
  _proto.patch = function patch(_patch) {
    return runQueryUpdateFunction(this.asRxQuery, (doc) => doc.patch(_patch));
  };
  _proto.incrementalPatch = function incrementalPatch(patch) {
    return runQueryUpdateFunction(this.asRxQuery, (doc) => doc.incrementalPatch(patch));
  };
  _proto.modify = function modify(mutationFunction) {
    return runQueryUpdateFunction(this.asRxQuery, (doc) => doc.modify(mutationFunction));
  };
  _proto.incrementalModify = function incrementalModify(mutationFunction) {
    return runQueryUpdateFunction(this.asRxQuery, (doc) => doc.incrementalModify(mutationFunction));
  };
  _proto.where = function where(_queryObj) {
    throw pluginMissing("query-builder");
  };
  _proto.sort = function sort(_params) {
    throw pluginMissing("query-builder");
  };
  _proto.skip = function skip(_amount) {
    throw pluginMissing("query-builder");
  };
  _proto.limit = function limit(_amount) {
    throw pluginMissing("query-builder");
  };
  return _createClass(RxQueryBase2, [{
    key: "$",
    get: function() {
      if (!this._$) {
        var results$ = this.collection.eventBulks$.pipe(
          /**
           * Performance shortcut.
           * Changes to local documents are not relevant for the query.
           */
          filter((bulk) => !bulk.isLocal),
          /**
           * Start once to ensure the querying also starts
           * when there where no changes.
           */
          startWith(null),
          // ensure query results are up to date.
          mergeMap(() => _ensureEqual(this)),
          // use the current result set, written by _ensureEqual().
          map(() => this._result),
          // do not run stuff above for each new subscriber, only once.
          shareReplay(RXJS_SHARE_REPLAY_DEFAULTS),
          // do not proceed if result set has not changed.
          distinctUntilChanged((prev, curr) => {
            if (prev && prev.time === ensureNotFalsy(curr).time) {
              return true;
            } else {
              return false;
            }
          }),
          filter((result) => !!result),
          /**
           * Map the result set to a single RxDocument or an array,
           * depending on query type
           */
          map((result) => {
            return ensureNotFalsy(result).getValue();
          })
        );
        this._$ = merge2(
          results$,
          /**
           * Also add the refCount$ to the query observable
           * to allow us to count the amount of subscribers.
           */
          this.refCount$.pipe(filter(() => false))
        );
      }
      return this._$;
    }
  }, {
    key: "$$",
    get: function() {
      var reactivity = this.collection.database.getReactivityFactory();
      return reactivity.fromObservable(this.$, void 0, this.collection.database);
    }
    // stores the changeEvent-number of the last handled change-event
    /**
     * ensures that the exec-runs
     * are not run in parallel
     */
  }, {
    key: "queryMatcher",
    get: function() {
      var schema = this.collection.schema.jsonSchema;
      var normalizedQuery = normalizeMangoQuery(this.collection.schema.jsonSchema, this.mangoQuery);
      return overwriteGetterForCaching(this, "queryMatcher", getQueryMatcher(schema, normalizedQuery));
    }
  }, {
    key: "asRxQuery",
    get: function() {
      return this;
    }
  }]);
}();
function _getDefaultQuery() {
  return {
    selector: {}
  };
}
function tunnelQueryCache(rxQuery) {
  return rxQuery.collection._queryCache.getByQuery(rxQuery);
}
function createRxQuery(op, queryObj, collection, other) {
  runPluginHooks("preCreateRxQuery", {
    op,
    queryObj,
    collection,
    other
  });
  var ret = new RxQueryBase(op, queryObj, collection, other);
  ret = tunnelQueryCache(ret);
  triggerCacheReplacement(collection);
  return ret;
}
function _isResultsInSync(rxQuery) {
  var currentLatestEventNumber = rxQuery.asRxQuery.collection._changeEventBuffer.getCounter();
  if (rxQuery._latestChangeEvent >= currentLatestEventNumber) {
    return true;
  } else {
    return false;
  }
}
async function _ensureEqual(rxQuery) {
  if (rxQuery.collection.awaitBeforeReads.size > 0) {
    await Promise.all(Array.from(rxQuery.collection.awaitBeforeReads).map((fn) => fn()));
  }
  if (rxQuery.collection.database.closed || _isResultsInSync(rxQuery)) {
    return false;
  }
  rxQuery._ensureEqualQueue = rxQuery._ensureEqualQueue.then(() => __ensureEqual(rxQuery));
  return rxQuery._ensureEqualQueue;
}
function __ensureEqual(rxQuery) {
  rxQuery._lastEnsureEqual = now();
  if (
    // db is closed
    rxQuery.collection.database.closed || // nothing happened since last run
    _isResultsInSync(rxQuery)
  ) {
    return PROMISE_RESOLVE_FALSE;
  }
  var ret = false;
  var mustReExec = false;
  if (rxQuery._latestChangeEvent === -1) {
    mustReExec = true;
  }
  if (!mustReExec) {
    var missedChangeEvents = rxQuery.asRxQuery.collection._changeEventBuffer.getFrom(rxQuery._latestChangeEvent + 1);
    if (missedChangeEvents === null) {
      mustReExec = true;
    } else {
      rxQuery._latestChangeEvent = rxQuery.asRxQuery.collection._changeEventBuffer.getCounter();
      var runChangeEvents = rxQuery.asRxQuery.collection._changeEventBuffer.reduceByLastOfDoc(missedChangeEvents);
      if (rxQuery.op === "count") {
        var previousCount = ensureNotFalsy(rxQuery._result).count;
        var newCount = previousCount;
        runChangeEvents.forEach((cE) => {
          var didMatchBefore = cE.previousDocumentData && rxQuery.doesDocumentDataMatch(cE.previousDocumentData);
          var doesMatchNow2 = rxQuery.doesDocumentDataMatch(cE.documentData);
          if (!didMatchBefore && doesMatchNow2) {
            newCount++;
          }
          if (didMatchBefore && !doesMatchNow2) {
            newCount--;
          }
        });
        if (newCount !== previousCount) {
          ret = true;
          rxQuery._setResultData(newCount);
        }
      } else {
        var eventReduceResult = calculateNewResults(rxQuery, runChangeEvents);
        if (eventReduceResult.runFullQueryAgain) {
          mustReExec = true;
        } else if (eventReduceResult.changed) {
          ret = true;
          rxQuery._setResultData(eventReduceResult.newResults);
        }
      }
    }
  }
  if (mustReExec) {
    return rxQuery._execOverDatabase().then((newResultData) => {
      rxQuery._latestChangeEvent = rxQuery.collection._changeEventBuffer.getCounter();
      if (typeof newResultData === "number") {
        if (!rxQuery._result || newResultData !== rxQuery._result.count) {
          ret = true;
          rxQuery._setResultData(newResultData);
        }
        return ret;
      }
      if (!rxQuery._result || !areRxDocumentArraysEqual(rxQuery.collection.schema.primaryPath, newResultData, rxQuery._result.docsData)) {
        ret = true;
        rxQuery._setResultData(newResultData);
      }
      return ret;
    });
  }
  return Promise.resolve(ret);
}
async function queryCollection(rxQuery) {
  var docs = [];
  var collection = rxQuery.collection;
  if (rxQuery.isFindOneByIdQuery) {
    if (Array.isArray(rxQuery.isFindOneByIdQuery)) {
      var docIds = rxQuery.isFindOneByIdQuery;
      docIds = docIds.filter((docId2) => {
        var docData2 = rxQuery.collection._docCache.getLatestDocumentDataIfExists(docId2);
        if (docData2) {
          if (!docData2._deleted) {
            docs.push(docData2);
          }
          return false;
        } else {
          return true;
        }
      });
      if (docIds.length > 0) {
        var docsFromStorage = await collection.storageInstance.findDocumentsById(docIds, false);
        appendToArray(docs, docsFromStorage);
      }
    } else {
      var docId = rxQuery.isFindOneByIdQuery;
      var docData = rxQuery.collection._docCache.getLatestDocumentDataIfExists(docId);
      if (!docData) {
        var fromStorageList = await collection.storageInstance.findDocumentsById([docId], false);
        if (fromStorageList[0]) {
          docData = fromStorageList[0];
        }
      }
      if (docData && !docData._deleted) {
        docs.push(docData);
      }
    }
  } else {
    var preparedQuery = rxQuery.getPreparedQuery();
    var queryResult = await collection.storageInstance.query(preparedQuery);
    docs = queryResult.documents;
  }
  return docs;
}
function isFindOneByIdQuery(primaryPath, query) {
  if (!query.skip && query.selector && Object.keys(query.selector).length === 1 && query.selector[primaryPath]) {
    var value = query.selector[primaryPath];
    if (typeof value === "string") {
      return value;
    } else if (Object.keys(value).length === 1 && typeof value.$eq === "string") {
      return value.$eq;
    }
    if (Object.keys(value).length === 1 && Array.isArray(value.$eq) && // must only contain strings
    !value.$eq.find((r) => typeof r !== "string")) {
      return value.$eq;
    }
  }
  return false;
}

// node_modules/rxdb/dist/esm/rx-database-internal-store.js
var INTERNAL_CONTEXT_COLLECTION = "collection";
var INTERNAL_CONTEXT_STORAGE_TOKEN = "storage-token";
var INTERNAL_CONTEXT_MIGRATION_STATUS = "rx-migration-status";
var INTERNAL_CONTEXT_PIPELINE_CHECKPOINT = "rx-pipeline-checkpoint";
var INTERNAL_STORE_SCHEMA_TITLE = "RxInternalDocument";
var INTERNAL_STORE_SCHEMA = fillWithDefaultSettings({
  version: 0,
  title: INTERNAL_STORE_SCHEMA_TITLE,
  primaryKey: {
    key: "id",
    fields: ["context", "key"],
    separator: "|"
  },
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 200
    },
    key: {
      type: "string"
    },
    context: {
      type: "string",
      enum: [INTERNAL_CONTEXT_COLLECTION, INTERNAL_CONTEXT_STORAGE_TOKEN, INTERNAL_CONTEXT_MIGRATION_STATUS, INTERNAL_CONTEXT_PIPELINE_CHECKPOINT, "OTHER"]
    },
    data: {
      type: "object",
      additionalProperties: true
    }
  },
  indexes: [],
  required: ["key", "context", "data"],
  additionalProperties: false,
  /**
   * If the sharding plugin is used,
   * it must not shard on the internal RxStorageInstance
   * because that one anyway has only a small amount of documents
   * and also its creation is in the hot path of the initial page load,
   * so we should spend less time creating multiple RxStorageInstances.
   */
  sharding: {
    shards: 1,
    mode: "collection"
  }
});
function getPrimaryKeyOfInternalDocument(key, context2) {
  return getComposedPrimaryKeyOfDocumentData(INTERNAL_STORE_SCHEMA, {
    key,
    context: context2
  });
}
async function getAllCollectionDocuments(storageInstance) {
  var getAllQueryPrepared = prepareQuery(storageInstance.schema, {
    selector: {
      context: INTERNAL_CONTEXT_COLLECTION,
      _deleted: {
        $eq: false
      }
    },
    sort: [{
      id: "asc"
    }],
    skip: 0
  });
  var queryResult = await storageInstance.query(getAllQueryPrepared);
  var allDocs = queryResult.documents;
  return allDocs;
}
var STORAGE_TOKEN_DOCUMENT_KEY = "storageToken";
var STORAGE_TOKEN_DOCUMENT_ID = getPrimaryKeyOfInternalDocument(STORAGE_TOKEN_DOCUMENT_KEY, INTERNAL_CONTEXT_STORAGE_TOKEN);
async function ensureStorageTokenDocumentExists(rxDatabase) {
  var storageToken = randomToken(10);
  var passwordHash = rxDatabase.password ? await rxDatabase.hashFunction(JSON.stringify(rxDatabase.password)) : void 0;
  var docData = {
    id: STORAGE_TOKEN_DOCUMENT_ID,
    context: INTERNAL_CONTEXT_STORAGE_TOKEN,
    key: STORAGE_TOKEN_DOCUMENT_KEY,
    data: {
      rxdbVersion: rxDatabase.rxdbVersion,
      token: storageToken,
      /**
       * We add the instance token here
       * to be able to detect if a given RxDatabase instance
       * is the first instance that was ever created
       * or if databases have existed earlier on that storage
       * with the same database name.
       */
      instanceToken: rxDatabase.token,
      passwordHash
    },
    _deleted: false,
    _meta: getDefaultRxDocumentMeta(),
    _rev: getDefaultRevision(),
    _attachments: {}
  };
  var writeRows = [{
    document: docData
  }];
  var writeResult = await rxDatabase.internalStore.bulkWrite(writeRows, "internal-add-storage-token");
  if (!writeResult.error[0]) {
    return getWrittenDocumentsFromBulkWriteResponse("id", writeRows, writeResult)[0];
  }
  var error = ensureNotFalsy(writeResult.error[0]);
  if (error.isError && isBulkWriteConflictError(error)) {
    var conflictError = error;
    if (!isDatabaseStateVersionCompatibleWithDatabaseCode(conflictError.documentInDb.data.rxdbVersion, rxDatabase.rxdbVersion)) {
      throw newRxError("DM5", {
        args: {
          database: rxDatabase.name,
          databaseStateVersion: conflictError.documentInDb.data.rxdbVersion,
          codeVersion: rxDatabase.rxdbVersion
        }
      });
    }
    if (passwordHash && passwordHash !== conflictError.documentInDb.data.passwordHash) {
      throw newRxError("DB1", {
        passwordHash,
        existingPasswordHash: conflictError.documentInDb.data.passwordHash
      });
    }
    var storageTokenDocInDb = conflictError.documentInDb;
    return ensureNotFalsy(storageTokenDocInDb);
  }
  throw error;
}
function isDatabaseStateVersionCompatibleWithDatabaseCode(databaseStateVersion, codeVersion) {
  if (!databaseStateVersion) {
    return false;
  }
  var stateMajor = databaseStateVersion.split(".")[0];
  var codeMajor = codeVersion.split(".")[0];
  if (stateMajor === "15" && codeMajor === "16") {
    return true;
  }
  if (stateMajor !== codeMajor) {
    return false;
  }
  return true;
}
async function addConnectedStorageToCollection(collection, storageCollectionName, schema) {
  if (collection.schema.version !== schema.version) {
    throw newRxError("SNH", {
      schema,
      version: collection.schema.version,
      name: collection.name,
      collection,
      args: {
        storageCollectionName
      }
    });
  }
  var collectionNameWithVersion = _collectionNamePrimary(collection.name, collection.schema.jsonSchema);
  var collectionDocId = getPrimaryKeyOfInternalDocument(collectionNameWithVersion, INTERNAL_CONTEXT_COLLECTION);
  while (true) {
    var collectionDoc = await getSingleDocument(collection.database.internalStore, collectionDocId);
    var saveData = clone(ensureNotFalsy(collectionDoc));
    var alreadyThere = saveData.data.connectedStorages.find((row) => row.collectionName === storageCollectionName && row.schema.version === schema.version);
    if (alreadyThere) {
      return;
    }
    saveData.data.connectedStorages.push({
      collectionName: storageCollectionName,
      schema
    });
    try {
      await writeSingle(collection.database.internalStore, {
        previous: ensureNotFalsy(collectionDoc),
        document: saveData
      }, "add-connected-storage-to-collection");
    } catch (err) {
      if (!isBulkWriteConflictError(err)) {
        throw err;
      }
    }
  }
}
async function removeConnectedStorageFromCollection(collection, storageCollectionName, schema) {
  if (collection.schema.version !== schema.version) {
    throw newRxError("SNH", {
      schema,
      version: collection.schema.version,
      name: collection.name,
      collection,
      args: {
        storageCollectionName
      }
    });
  }
  var collectionNameWithVersion = _collectionNamePrimary(collection.name, collection.schema.jsonSchema);
  var collectionDocId = getPrimaryKeyOfInternalDocument(collectionNameWithVersion, INTERNAL_CONTEXT_COLLECTION);
  while (true) {
    var collectionDoc = await getSingleDocument(collection.database.internalStore, collectionDocId);
    var saveData = clone(ensureNotFalsy(collectionDoc));
    var isThere = saveData.data.connectedStorages.find((row) => row.collectionName === storageCollectionName && row.schema.version === schema.version);
    if (!isThere) {
      return;
    }
    saveData.data.connectedStorages = saveData.data.connectedStorages.filter((item) => item.collectionName !== storageCollectionName);
    try {
      await writeSingle(collection.database.internalStore, {
        previous: ensureNotFalsy(collectionDoc),
        document: saveData
      }, "remove-connected-storage-from-collection");
    } catch (err) {
      if (!isBulkWriteConflictError(err)) {
        throw err;
      }
    }
  }
}
function _collectionNamePrimary(name, schema) {
  return name + "-" + schema.version;
}

// node_modules/rxdb/dist/esm/rx-collection-helper.js
function fillObjectDataBeforeInsert(schema, data) {
  data = flatClone(data);
  data = fillObjectWithDefaults(schema, data);
  if (typeof schema.jsonSchema.primaryKey !== "string") {
    data = fillPrimaryKey(schema.primaryPath, schema.jsonSchema, data);
  }
  data._meta = getDefaultRxDocumentMeta();
  if (!Object.prototype.hasOwnProperty.call(data, "_deleted")) {
    data._deleted = false;
  }
  if (!Object.prototype.hasOwnProperty.call(data, "_attachments")) {
    data._attachments = {};
  }
  if (!Object.prototype.hasOwnProperty.call(data, "_rev")) {
    data._rev = getDefaultRevision();
  }
  return data;
}
async function createRxCollectionStorageInstance(rxDatabase, storageInstanceCreationParams) {
  storageInstanceCreationParams.multiInstance = rxDatabase.multiInstance;
  var storageInstance = await rxDatabase.storage.createStorageInstance(storageInstanceCreationParams);
  return storageInstance;
}
async function removeCollectionStorages(storage, databaseInternalStorage, databaseInstanceToken, databaseName, collectionName, multiInstance, password, hashFunction) {
  var allCollectionMetaDocs = await getAllCollectionDocuments(databaseInternalStorage);
  var relevantCollectionMetaDocs = allCollectionMetaDocs.filter((metaDoc) => metaDoc.data.name === collectionName);
  var removeStorages = [];
  relevantCollectionMetaDocs.forEach((metaDoc) => {
    removeStorages.push({
      collectionName: metaDoc.data.name,
      schema: metaDoc.data.schema,
      isCollection: true
    });
    metaDoc.data.connectedStorages.forEach((row) => removeStorages.push({
      collectionName: row.collectionName,
      isCollection: false,
      schema: row.schema
    }));
  });
  var alreadyAdded = /* @__PURE__ */ new Set();
  removeStorages = removeStorages.filter((row) => {
    var key = row.collectionName + "||" + row.schema.version;
    if (alreadyAdded.has(key)) {
      return false;
    } else {
      alreadyAdded.add(key);
      return true;
    }
  });
  await Promise.all(removeStorages.map(async (row) => {
    var storageInstance = await storage.createStorageInstance({
      collectionName: row.collectionName,
      databaseInstanceToken,
      databaseName,
      /**
       * multiInstance must be set to true if multiInstance
       * was true on the database
       * so that the storageInstance can inform other
       * instances about being removed.
       */
      multiInstance,
      options: {},
      schema: row.schema,
      password,
      devMode: overwritable.isDevMode()
    });
    await storageInstance.remove();
    if (row.isCollection) {
      await runAsyncPluginHooks("postRemoveRxCollection", {
        storage,
        databaseName,
        collectionName
      });
    }
  }));
  if (hashFunction) {
    var writeRows = relevantCollectionMetaDocs.map((doc) => {
      var writeDoc = flatCloneDocWithMeta(doc);
      writeDoc._deleted = true;
      writeDoc._meta.lwt = now();
      writeDoc._rev = createRevision(databaseInstanceToken, doc);
      return {
        previous: doc,
        document: writeDoc
      };
    });
    await databaseInternalStorage.bulkWrite(writeRows, "rx-database-remove-collection-all");
  }
}
function ensureRxCollectionIsNotClosed(collection) {
  if (collection.closed) {
    throw newRxError("COL21", {
      collection: collection.name,
      version: collection.schema.version
    });
  }
}

// node_modules/rxdb/dist/esm/change-event-buffer.js
var ChangeEventBuffer = /* @__PURE__ */ function() {
  function ChangeEventBuffer2(collection) {
    this.subs = [];
    this.counter = 0;
    this.eventCounterMap = /* @__PURE__ */ new WeakMap();
    this.buffer = [];
    this.limit = 100;
    this.tasks = /* @__PURE__ */ new Set();
    this.collection = collection;
    this.subs.push(this.collection.eventBulks$.pipe(filter((bulk) => !bulk.isLocal)).subscribe((eventBulk) => {
      this.tasks.add(() => this._handleChangeEvents(eventBulk.events));
      if (this.tasks.size <= 1) {
        requestIdlePromiseNoQueue().then(() => {
          this.processTasks();
        });
      }
    }));
  }
  var _proto = ChangeEventBuffer2.prototype;
  _proto.processTasks = function processTasks() {
    if (this.tasks.size === 0) {
      return;
    }
    var tasks = Array.from(this.tasks);
    tasks.forEach((task) => task());
    this.tasks.clear();
  };
  _proto._handleChangeEvents = function _handleChangeEvents(events) {
    var counterBefore = this.counter;
    this.counter = this.counter + events.length;
    if (events.length > this.limit) {
      this.buffer = events.slice(events.length * -1);
    } else {
      appendToArray(this.buffer, events);
      this.buffer = this.buffer.slice(this.limit * -1);
    }
    var counterBase = counterBefore + 1;
    var eventCounterMap = this.eventCounterMap;
    for (var index = 0; index < events.length; index++) {
      var event = events[index];
      eventCounterMap.set(event, counterBase + index);
    }
  };
  _proto.getCounter = function getCounter() {
    this.processTasks();
    return this.counter;
  };
  _proto.getBuffer = function getBuffer() {
    this.processTasks();
    return this.buffer;
  };
  _proto.getArrayIndexByPointer = function getArrayIndexByPointer(pointer) {
    this.processTasks();
    var oldestEvent = this.buffer[0];
    var oldestCounter = this.eventCounterMap.get(oldestEvent);
    if (pointer < oldestCounter) return null;
    var rest = pointer - oldestCounter;
    return rest;
  };
  _proto.getFrom = function getFrom(pointer) {
    this.processTasks();
    var ret = [];
    var currentIndex = this.getArrayIndexByPointer(pointer);
    if (currentIndex === null)
      return null;
    while (true) {
      var nextEvent = this.buffer[currentIndex];
      currentIndex++;
      if (!nextEvent) {
        return ret;
      } else {
        ret.push(nextEvent);
      }
    }
  };
  _proto.runFrom = function runFrom(pointer, fn) {
    this.processTasks();
    var ret = this.getFrom(pointer);
    if (ret === null) {
      throw new Error("out of bounds");
    } else {
      ret.forEach((cE) => fn(cE));
    }
  };
  _proto.reduceByLastOfDoc = function reduceByLastOfDoc(changeEvents) {
    this.processTasks();
    return changeEvents.slice(0);
  };
  _proto.close = function close6() {
    this.tasks.clear();
    this.subs.forEach((sub) => sub.unsubscribe());
  };
  return ChangeEventBuffer2;
}();
function createChangeEventBuffer(collection) {
  return new ChangeEventBuffer(collection);
}

// node_modules/rxdb/dist/esm/rx-document-prototype-merge.js
var constructorForCollection = /* @__PURE__ */ new WeakMap();
function getDocumentPrototype(rxCollection) {
  var schemaProto = rxCollection.schema.getDocumentPrototype();
  var ormProto = getDocumentOrmPrototype(rxCollection);
  var baseProto = basePrototype;
  var proto = {};
  [schemaProto, ormProto, baseProto].forEach((obj) => {
    var props = Object.getOwnPropertyNames(obj);
    props.forEach((key) => {
      var desc = Object.getOwnPropertyDescriptor(obj, key);
      var enumerable = true;
      if (key.startsWith("_") || key.endsWith("_") || key.startsWith("$") || key.endsWith("$")) enumerable = false;
      if (typeof desc.value === "function") {
        Object.defineProperty(proto, key, {
          get() {
            return desc.value.bind(this);
          },
          enumerable,
          configurable: false
        });
      } else {
        desc.enumerable = enumerable;
        desc.configurable = false;
        if (desc.writable) desc.writable = false;
        Object.defineProperty(proto, key, desc);
      }
    });
  });
  return proto;
}
function getRxDocumentConstructor(rxCollection) {
  return getFromMapOrCreate(constructorForCollection, rxCollection, () => createRxDocumentConstructor(getDocumentPrototype(rxCollection)));
}
function createNewRxDocument(rxCollection, documentConstructor, docData) {
  var doc = createWithConstructor(documentConstructor, rxCollection, overwritable.deepFreezeWhenDevMode(docData));
  rxCollection._runHooksSync("post", "create", docData, doc);
  runPluginHooks("postCreateRxDocument", doc);
  return doc;
}
function getDocumentOrmPrototype(rxCollection) {
  var proto = {};
  Object.entries(rxCollection.methods).forEach(([k, v]) => {
    proto[k] = v;
  });
  return proto;
}

// node_modules/rxdb/dist/esm/replication-protocol/default-conflict-handler.js
var defaultConflictHandler = {
  isEqual(a, b) {
    return deepEqual(stripAttachmentsDataFromDocument(a), stripAttachmentsDataFromDocument(b));
  },
  resolve(i) {
    return i.realMasterState;
  }
};

// node_modules/rxdb/dist/esm/rx-collection.js
var HOOKS_WHEN = ["pre", "post"];
var HOOKS_KEYS = ["insert", "save", "remove", "create"];
var hooksApplied = false;
var OPEN_COLLECTIONS = /* @__PURE__ */ new Set();
var RxCollectionBase = /* @__PURE__ */ function() {
  function RxCollectionBase2(database, name, schema, internalStorageInstance, instanceCreationOptions = {}, migrationStrategies = {}, methods = {}, attachments = {}, options = {}, cacheReplacementPolicy = defaultCacheReplacementPolicy, statics = {}, conflictHandler = defaultConflictHandler) {
    this.storageInstance = {};
    this.timeouts = /* @__PURE__ */ new Set();
    this.incrementalWriteQueue = {};
    this.awaitBeforeReads = /* @__PURE__ */ new Set();
    this._incrementalUpsertQueues = /* @__PURE__ */ new Map();
    this.synced = false;
    this.hooks = {};
    this._subs = [];
    this._docCache = {};
    this._queryCache = createQueryCache();
    this.$ = {};
    this.checkpoint$ = {};
    this._changeEventBuffer = {};
    this.eventBulks$ = {};
    this.onClose = [];
    this.closed = false;
    this.onRemove = [];
    this.database = database;
    this.name = name;
    this.schema = schema;
    this.internalStorageInstance = internalStorageInstance;
    this.instanceCreationOptions = instanceCreationOptions;
    this.migrationStrategies = migrationStrategies;
    this.methods = methods;
    this.attachments = attachments;
    this.options = options;
    this.cacheReplacementPolicy = cacheReplacementPolicy;
    this.statics = statics;
    this.conflictHandler = conflictHandler;
    _applyHookFunctions(this.asRxCollection);
    if (database) {
      this.eventBulks$ = database.eventBulks$.pipe(filter((changeEventBulk) => changeEventBulk.collectionName === this.name));
    } else {
    }
    if (this.database) {
      OPEN_COLLECTIONS.add(this);
    }
  }
  var _proto = RxCollectionBase2.prototype;
  _proto.prepare = async function prepare() {
    if (!await hasPremiumFlag()) {
      var count = 0;
      while (count < 10 && OPEN_COLLECTIONS.size > NON_PREMIUM_COLLECTION_LIMIT) {
        count++;
        await this.promiseWait(30);
      }
      if (OPEN_COLLECTIONS.size > NON_PREMIUM_COLLECTION_LIMIT) {
        throw newRxError("COL23", {
          database: this.database.name,
          collection: this.name,
          args: {
            existing: Array.from(OPEN_COLLECTIONS.values()).map((c) => ({
              db: c.database ? c.database.name : "",
              c: c.name
            }))
          }
        });
      }
    }
    this.storageInstance = getWrappedStorageInstance(this.database, this.internalStorageInstance, this.schema.jsonSchema);
    this.incrementalWriteQueue = new IncrementalWriteQueue(this.storageInstance, this.schema.primaryPath, (newData, oldData) => beforeDocumentUpdateWrite(this, newData, oldData), (result) => this._runHooks("post", "save", result));
    this.$ = this.eventBulks$.pipe(mergeMap((changeEventBulk) => rxChangeEventBulkToRxChangeEvents(changeEventBulk)));
    this.checkpoint$ = this.eventBulks$.pipe(map((changeEventBulk) => changeEventBulk.checkpoint));
    this._changeEventBuffer = createChangeEventBuffer(this.asRxCollection);
    var documentConstructor;
    this._docCache = new DocumentCache(this.schema.primaryPath, this.eventBulks$.pipe(filter((bulk) => !bulk.isLocal), map((bulk) => bulk.events)), (docData) => {
      if (!documentConstructor) {
        documentConstructor = getRxDocumentConstructor(this.asRxCollection);
      }
      return createNewRxDocument(this.asRxCollection, documentConstructor, docData);
    });
    var listenToRemoveSub = this.database.internalStore.changeStream().pipe(filter((bulk) => {
      var key = this.name + "-" + this.schema.version;
      var found = bulk.events.find((event) => {
        return event.documentData.context === "collection" && event.documentData.key === key && event.operation === "DELETE";
      });
      return !!found;
    })).subscribe(async () => {
      await this.close();
      await Promise.all(this.onRemove.map((fn) => fn()));
    });
    this._subs.push(listenToRemoveSub);
    var databaseStorageToken = await this.database.storageToken;
    var subDocs = this.storageInstance.changeStream().subscribe((eventBulk) => {
      var changeEventBulk = {
        id: eventBulk.id,
        isLocal: false,
        internal: false,
        collectionName: this.name,
        storageToken: databaseStorageToken,
        events: eventBulk.events,
        databaseToken: this.database.token,
        checkpoint: eventBulk.checkpoint,
        context: eventBulk.context
      };
      this.database.$emit(changeEventBulk);
    });
    this._subs.push(subDocs);
    return PROMISE_RESOLVE_VOID;
  };
  _proto.cleanup = function cleanup(_minimumDeletedTime) {
    ensureRxCollectionIsNotClosed(this);
    throw pluginMissing("cleanup");
  };
  _proto.migrationNeeded = function migrationNeeded() {
    throw pluginMissing("migration-schema");
  };
  _proto.getMigrationState = function getMigrationState() {
    throw pluginMissing("migration-schema");
  };
  _proto.startMigration = function startMigration(batchSize = 10) {
    ensureRxCollectionIsNotClosed(this);
    return this.getMigrationState().startMigration(batchSize);
  };
  _proto.migratePromise = function migratePromise(batchSize = 10) {
    return this.getMigrationState().migratePromise(batchSize);
  };
  _proto.insert = async function insert(json) {
    ensureRxCollectionIsNotClosed(this);
    var writeResult = await this.bulkInsert([json]);
    var isError = writeResult.error[0];
    throwIfIsStorageWriteError(this, json[this.schema.primaryPath], json, isError);
    var insertResult = ensureNotFalsy(writeResult.success[0]);
    return insertResult;
  };
  _proto.insertIfNotExists = async function insertIfNotExists(json) {
    var writeResult = await this.bulkInsert([json]);
    if (writeResult.error.length > 0) {
      var error = writeResult.error[0];
      if (error.status === 409) {
        var conflictDocData = error.documentInDb;
        return mapDocumentsDataToCacheDocs(this._docCache, [conflictDocData])[0];
      } else {
        throw error;
      }
    }
    return writeResult.success[0];
  };
  _proto.bulkInsert = async function bulkInsert(docsData) {
    ensureRxCollectionIsNotClosed(this);
    if (docsData.length === 0) {
      return {
        success: [],
        error: []
      };
    }
    var primaryPath = this.schema.primaryPath;
    var ids = /* @__PURE__ */ new Set();
    var insertRows;
    if (this.hasHooks("pre", "insert")) {
      insertRows = await Promise.all(docsData.map((docData2) => {
        var useDocData2 = fillObjectDataBeforeInsert(this.schema, docData2);
        return this._runHooks("pre", "insert", useDocData2).then(() => {
          ids.add(useDocData2[primaryPath]);
          return {
            document: useDocData2
          };
        });
      }));
    } else {
      insertRows = new Array(docsData.length);
      var _schema = this.schema;
      for (var index = 0; index < docsData.length; index++) {
        var docData = docsData[index];
        var useDocData = fillObjectDataBeforeInsert(_schema, docData);
        ids.add(useDocData[primaryPath]);
        insertRows[index] = {
          document: useDocData
        };
      }
    }
    if (ids.size !== docsData.length) {
      throw newRxError("COL22", {
        collection: this.name,
        args: {
          documents: docsData
        }
      });
    }
    var results = await this.storageInstance.bulkWrite(insertRows, "rx-collection-bulk-insert");
    var rxDocuments;
    var collection = this;
    var ret = {
      get success() {
        if (!rxDocuments) {
          var success = getWrittenDocumentsFromBulkWriteResponse(collection.schema.primaryPath, insertRows, results);
          rxDocuments = mapDocumentsDataToCacheDocs(collection._docCache, success);
        }
        return rxDocuments;
      },
      error: results.error
    };
    if (this.hasHooks("post", "insert")) {
      var docsMap = /* @__PURE__ */ new Map();
      insertRows.forEach((row) => {
        var doc = row.document;
        docsMap.set(doc[primaryPath], doc);
      });
      await Promise.all(ret.success.map((doc) => {
        return this._runHooks("post", "insert", docsMap.get(doc.primary), doc);
      }));
    }
    return ret;
  };
  _proto.bulkRemove = async function bulkRemove(idsOrDocs) {
    ensureRxCollectionIsNotClosed(this);
    var primaryPath = this.schema.primaryPath;
    if (idsOrDocs.length === 0) {
      return {
        success: [],
        error: []
      };
    }
    var rxDocumentMap;
    if (typeof idsOrDocs[0] === "string") {
      rxDocumentMap = await this.findByIds(idsOrDocs).exec();
    } else {
      rxDocumentMap = /* @__PURE__ */ new Map();
      idsOrDocs.forEach((d) => rxDocumentMap.set(d.primary, d));
    }
    var docsData = [];
    var docsMap = /* @__PURE__ */ new Map();
    Array.from(rxDocumentMap.values()).forEach((rxDocument) => {
      var data = rxDocument.toMutableJSON(true);
      docsData.push(data);
      docsMap.set(rxDocument.primary, data);
    });
    await Promise.all(docsData.map((doc) => {
      var primary = doc[this.schema.primaryPath];
      return this._runHooks("pre", "remove", doc, rxDocumentMap.get(primary));
    }));
    var removeDocs = docsData.map((doc) => {
      var writeDoc = flatClone(doc);
      writeDoc._deleted = true;
      return {
        previous: doc,
        document: writeDoc
      };
    });
    var results = await this.storageInstance.bulkWrite(removeDocs, "rx-collection-bulk-remove");
    var success = getWrittenDocumentsFromBulkWriteResponse(this.schema.primaryPath, removeDocs, results);
    var deletedRxDocuments = [];
    var successIds = success.map((d) => {
      var id = d[primaryPath];
      var doc = this._docCache.getCachedRxDocument(d);
      deletedRxDocuments.push(doc);
      return id;
    });
    await Promise.all(successIds.map((id) => {
      return this._runHooks("post", "remove", docsMap.get(id), rxDocumentMap.get(id));
    }));
    return {
      success: deletedRxDocuments,
      error: results.error
    };
  };
  _proto.bulkUpsert = async function bulkUpsert(docsData) {
    ensureRxCollectionIsNotClosed(this);
    var insertData = [];
    var useJsonByDocId = /* @__PURE__ */ new Map();
    docsData.forEach((docData) => {
      var useJson = fillObjectDataBeforeInsert(this.schema, docData);
      var primary = useJson[this.schema.primaryPath];
      if (!primary) {
        throw newRxError("COL3", {
          primaryPath: this.schema.primaryPath,
          data: useJson,
          schema: this.schema.jsonSchema
        });
      }
      useJsonByDocId.set(primary, useJson);
      insertData.push(useJson);
    });
    var insertResult = await this.bulkInsert(insertData);
    var success = insertResult.success.slice(0);
    var error = [];
    await Promise.all(insertResult.error.map(async (err) => {
      if (err.status !== 409) {
        error.push(err);
      } else {
        var id = err.documentId;
        var writeData = getFromMapOrThrow(useJsonByDocId, id);
        var docDataInDb = ensureNotFalsy(err.documentInDb);
        var doc = this._docCache.getCachedRxDocuments([docDataInDb])[0];
        var newDoc = await doc.incrementalModify(() => writeData);
        success.push(newDoc);
      }
    }));
    return {
      error,
      success
    };
  };
  _proto.upsert = async function upsert(json) {
    ensureRxCollectionIsNotClosed(this);
    var bulkResult = await this.bulkUpsert([json]);
    throwIfIsStorageWriteError(this.asRxCollection, json[this.schema.primaryPath], json, bulkResult.error[0]);
    return bulkResult.success[0];
  };
  _proto.incrementalUpsert = function incrementalUpsert(json) {
    ensureRxCollectionIsNotClosed(this);
    var useJson = fillObjectDataBeforeInsert(this.schema, json);
    var primary = useJson[this.schema.primaryPath];
    if (!primary) {
      throw newRxError("COL4", {
        data: json
      });
    }
    var queue = this._incrementalUpsertQueues.get(primary);
    if (!queue) {
      queue = PROMISE_RESOLVE_VOID;
    }
    queue = queue.then(() => _incrementalUpsertEnsureRxDocumentExists(this, primary, useJson)).then((wasInserted) => {
      if (!wasInserted.inserted) {
        return _incrementalUpsertUpdate(wasInserted.doc, useJson);
      } else {
        return wasInserted.doc;
      }
    });
    this._incrementalUpsertQueues.set(primary, queue);
    return queue;
  };
  _proto.find = function find(queryObj) {
    ensureRxCollectionIsNotClosed(this);
    runPluginHooks("prePrepareRxQuery", {
      op: "find",
      queryObj,
      collection: this
    });
    if (!queryObj) {
      queryObj = _getDefaultQuery();
    }
    var query = createRxQuery("find", queryObj, this);
    return query;
  };
  _proto.findOne = function findOne(queryObj) {
    ensureRxCollectionIsNotClosed(this);
    runPluginHooks("prePrepareRxQuery", {
      op: "findOne",
      queryObj,
      collection: this
    });
    var query;
    if (typeof queryObj === "string") {
      query = createRxQuery("findOne", {
        selector: {
          [this.schema.primaryPath]: queryObj
        },
        limit: 1
      }, this);
    } else {
      if (!queryObj) {
        queryObj = _getDefaultQuery();
      }
      if (queryObj.limit) {
        throw newRxError("QU6");
      }
      queryObj = flatClone(queryObj);
      queryObj.limit = 1;
      query = createRxQuery("findOne", queryObj, this);
    }
    return query;
  };
  _proto.count = function count(queryObj) {
    ensureRxCollectionIsNotClosed(this);
    if (!queryObj) {
      queryObj = _getDefaultQuery();
    }
    var query = createRxQuery("count", queryObj, this);
    return query;
  };
  _proto.findByIds = function findByIds(ids) {
    ensureRxCollectionIsNotClosed(this);
    var mangoQuery = {
      selector: {
        [this.schema.primaryPath]: {
          $in: ids.slice(0)
        }
      }
    };
    var query = createRxQuery("findByIds", mangoQuery, this);
    return query;
  };
  _proto.exportJSON = function exportJSON() {
    throw pluginMissing("json-dump");
  };
  _proto.importJSON = function importJSON(_exportedJSON) {
    throw pluginMissing("json-dump");
  };
  _proto.insertCRDT = function insertCRDT(_updateObj) {
    throw pluginMissing("crdt");
  };
  _proto.addPipeline = function addPipeline(_options) {
    throw pluginMissing("pipeline");
  };
  _proto.addHook = function addHook(when, key, fun, parallel = false) {
    if (typeof fun !== "function") {
      throw newRxTypeError("COL7", {
        key,
        when
      });
    }
    if (!HOOKS_WHEN.includes(when)) {
      throw newRxTypeError("COL8", {
        key,
        when
      });
    }
    if (!HOOKS_KEYS.includes(key)) {
      throw newRxError("COL9", {
        key
      });
    }
    if (when === "post" && key === "create" && parallel === true) {
      throw newRxError("COL10", {
        when,
        key,
        parallel
      });
    }
    var boundFun = fun.bind(this);
    var runName = parallel ? "parallel" : "series";
    this.hooks[key] = this.hooks[key] || {};
    this.hooks[key][when] = this.hooks[key][when] || {
      series: [],
      parallel: []
    };
    this.hooks[key][when][runName].push(boundFun);
  };
  _proto.getHooks = function getHooks(when, key) {
    if (!this.hooks[key] || !this.hooks[key][when]) {
      return {
        series: [],
        parallel: []
      };
    }
    return this.hooks[key][when];
  };
  _proto.hasHooks = function hasHooks(when, key) {
    if (!this.hooks[key] || !this.hooks[key][when]) {
      return false;
    }
    var hooks = this.getHooks(when, key);
    if (!hooks) {
      return false;
    }
    return hooks.series.length > 0 || hooks.parallel.length > 0;
  };
  _proto._runHooks = function _runHooks(when, key, data, instance) {
    var hooks = this.getHooks(when, key);
    if (!hooks) {
      return PROMISE_RESOLVE_VOID;
    }
    var tasks = hooks.series.map((hook) => () => hook(data, instance));
    return promiseSeries(tasks).then(() => Promise.all(hooks.parallel.map((hook) => hook(data, instance))));
  };
  _proto._runHooksSync = function _runHooksSync(when, key, data, instance) {
    if (!this.hasHooks(when, key)) {
      return;
    }
    var hooks = this.getHooks(when, key);
    if (!hooks) return;
    hooks.series.forEach((hook) => hook(data, instance));
  };
  _proto.promiseWait = function promiseWait2(time) {
    var ret = new Promise((res) => {
      var timeout = setTimeout(() => {
        this.timeouts.delete(timeout);
        res();
      }, time);
      this.timeouts.add(timeout);
    });
    return ret;
  };
  _proto.close = async function close6() {
    if (this.closed) {
      return PROMISE_RESOLVE_FALSE;
    }
    OPEN_COLLECTIONS.delete(this);
    await Promise.all(this.onClose.map((fn) => fn()));
    this.closed = true;
    Array.from(this.timeouts).forEach((timeout) => clearTimeout(timeout));
    if (this._changeEventBuffer) {
      this._changeEventBuffer.close();
    }
    return this.database.requestIdlePromise().then(() => this.storageInstance.close()).then(() => {
      this._subs.forEach((sub) => sub.unsubscribe());
      delete this.database.collections[this.name];
      return runAsyncPluginHooks("postCloseRxCollection", this).then(() => true);
    });
  };
  _proto.remove = async function remove2() {
    await this.close();
    await Promise.all(this.onRemove.map((fn) => fn()));
    await removeCollectionStorages(this.database.storage, this.database.internalStore, this.database.token, this.database.name, this.name, this.database.multiInstance, this.database.password, this.database.hashFunction);
  };
  return _createClass(RxCollectionBase2, [{
    key: "insert$",
    get: function() {
      return this.$.pipe(filter((cE) => cE.operation === "INSERT"));
    }
  }, {
    key: "update$",
    get: function() {
      return this.$.pipe(filter((cE) => cE.operation === "UPDATE"));
    }
  }, {
    key: "remove$",
    get: function() {
      return this.$.pipe(filter((cE) => cE.operation === "DELETE"));
    }
    // defaults
    /**
     * Internally only use eventBulks$
     * Do not use .$ or .observable$ because that has to transform
     * the events which decreases performance.
     */
    /**
     * When the collection is closed,
     * these functions will be called an awaited.
     * Used to automatically clean up stuff that
     * belongs to this collection.
    */
  }, {
    key: "asRxCollection",
    get: function() {
      return this;
    }
  }]);
}();
function _applyHookFunctions(collection) {
  if (hooksApplied) return;
  hooksApplied = true;
  var colProto = Object.getPrototypeOf(collection);
  HOOKS_KEYS.forEach((key) => {
    HOOKS_WHEN.map((when) => {
      var fnName = when + ucfirst(key);
      colProto[fnName] = function(fun, parallel) {
        return this.addHook(when, key, fun, parallel);
      };
    });
  });
}
function _incrementalUpsertUpdate(doc, json) {
  return doc.incrementalModify((_innerDoc) => {
    return json;
  });
}
function _incrementalUpsertEnsureRxDocumentExists(rxCollection, primary, json) {
  var docDataFromCache = rxCollection._docCache.getLatestDocumentDataIfExists(primary);
  if (docDataFromCache) {
    return Promise.resolve({
      doc: rxCollection._docCache.getCachedRxDocuments([docDataFromCache])[0],
      inserted: false
    });
  }
  return rxCollection.findOne(primary).exec().then((doc) => {
    if (!doc) {
      return rxCollection.insert(json).then((newDoc) => ({
        doc: newDoc,
        inserted: true
      }));
    } else {
      return {
        doc,
        inserted: false
      };
    }
  });
}
function createRxCollection({
  database,
  name,
  schema,
  instanceCreationOptions = {},
  migrationStrategies = {},
  autoMigrate = true,
  statics = {},
  methods = {},
  attachments = {},
  options = {},
  localDocuments = false,
  cacheReplacementPolicy = defaultCacheReplacementPolicy,
  conflictHandler = defaultConflictHandler
}) {
  var storageInstanceCreationParams = {
    databaseInstanceToken: database.token,
    databaseName: database.name,
    collectionName: name,
    schema: schema.jsonSchema,
    options: instanceCreationOptions,
    multiInstance: database.multiInstance,
    password: database.password,
    devMode: overwritable.isDevMode()
  };
  runPluginHooks("preCreateRxStorageInstance", storageInstanceCreationParams);
  return createRxCollectionStorageInstance(database, storageInstanceCreationParams).then((storageInstance) => {
    var collection = new RxCollectionBase(database, name, schema, storageInstance, instanceCreationOptions, migrationStrategies, methods, attachments, options, cacheReplacementPolicy, statics, conflictHandler);
    return collection.prepare().then(() => {
      Object.entries(statics).forEach(([funName, fun]) => {
        Object.defineProperty(collection, funName, {
          get: () => fun.bind(collection)
        });
      });
      var ret = PROMISE_RESOLVE_VOID;
      if (autoMigrate && collection.schema.version !== 0) {
        ret = collection.migratePromise();
      }
      return ret;
    }).then(() => {
      runPluginHooks("createRxCollection", {
        collection,
        creator: {
          name,
          schema,
          storageInstance,
          instanceCreationOptions,
          migrationStrategies,
          methods,
          attachments,
          options,
          cacheReplacementPolicy,
          localDocuments,
          statics
        }
      });
      return collection;
    }).catch((err) => {
      OPEN_COLLECTIONS.delete(collection);
      return storageInstance.close().then(() => Promise.reject(err));
    });
  });
}

// node_modules/custom-idle-queue/dist/es/index.js
var IdleQueue = function IdleQueue2() {
  var parallels = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1;
  this._parallels = parallels || 1;
  this._qC = 0;
  this._iC = /* @__PURE__ */ new Set();
  this._lHN = 0;
  this._hPM = /* @__PURE__ */ new Map();
  this._pHM = /* @__PURE__ */ new Map();
};
IdleQueue.prototype = {
  isIdle: function isIdle() {
    return this._qC < this._parallels;
  },
  /**
   * creates a lock in the queue
   * and returns an unlock-function to remove the lock from the queue
   * @return {function} unlock function than must be called afterwards
   */
  lock: function lock() {
    this._qC++;
  },
  unlock: function unlock() {
    this._qC--;
    _tryIdleCall(this);
  },
  /**
   * wraps a function with lock/unlock and runs it
   * @param  {function}  fun
   * @return {Promise<any>}
   */
  wrapCall: function wrapCall(fun) {
    var _this = this;
    this.lock();
    var maybePromise;
    try {
      maybePromise = fun();
    } catch (err) {
      this.unlock();
      throw err;
    }
    if (!maybePromise.then || typeof maybePromise.then !== "function") {
      this.unlock();
      return maybePromise;
    } else {
      return maybePromise.then(function(ret) {
        _this.unlock();
        return ret;
      })["catch"](function(err) {
        _this.unlock();
        throw err;
      });
    }
  },
  /**
   * does the same as requestIdleCallback() but uses promises instead of the callback
   * @param {{timeout?: number}} options like timeout
   * @return {Promise<void>} promise that resolves when the database is in idle-mode
   */
  requestIdlePromise: function requestIdlePromise2(options) {
    var _this2 = this;
    options = options || {};
    var resolve2;
    var prom = new Promise(function(res) {
      return resolve2 = res;
    });
    var resolveFromOutside = function resolveFromOutside2() {
      _removeIdlePromise(_this2, prom);
      resolve2();
    };
    prom._manRes = resolveFromOutside;
    if (options.timeout) {
      var timeoutObj = setTimeout(function() {
        prom._manRes();
      }, options.timeout);
      prom._timeoutObj = timeoutObj;
    }
    this._iC.add(prom);
    _tryIdleCall(this);
    return prom;
  },
  /**
   * remove the promise so it will never be resolved
   * @param  {Promise} promise from requestIdlePromise()
   * @return {void}
   */
  cancelIdlePromise: function cancelIdlePromise(promise) {
    _removeIdlePromise(this, promise);
  },
  /**
   * api equal to
   * @link https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback
   * @param  {Function} callback
   * @param  {options}   options  [description]
   * @return {number} handle which can be used with cancelIdleCallback()
   */
  requestIdleCallback: function requestIdleCallback2(callback, options) {
    var handle = this._lHN++;
    var promise = this.requestIdlePromise(options);
    this._hPM.set(handle, promise);
    this._pHM.set(promise, handle);
    promise.then(function() {
      return callback();
    });
    return handle;
  },
  /**
   * API equal to
   * @link https://developer.mozilla.org/en-US/docs/Web/API/Window/cancelIdleCallback
   * @param  {number} handle returned from requestIdleCallback()
   * @return {void}
   */
  cancelIdleCallback: function cancelIdleCallback(handle) {
    var promise = this._hPM.get(handle);
    this.cancelIdlePromise(promise);
  },
  /**
   * clears and resets everything
   * @return {void}
   */
  clear: function clear() {
    var _this3 = this;
    this._iC.forEach(function(promise) {
      return _removeIdlePromise(_this3, promise);
    });
    this._qC = 0;
    this._iC.clear();
    this._hPM = /* @__PURE__ */ new Map();
    this._pHM = /* @__PURE__ */ new Map();
  }
};
function _resolveOneIdleCall(idleQueue) {
  if (idleQueue._iC.size === 0) return;
  var iterator2 = idleQueue._iC.values();
  var oldestPromise = iterator2.next().value;
  oldestPromise._manRes();
  setTimeout(function() {
    return _tryIdleCall(idleQueue);
  }, 0);
}
function _removeIdlePromise(idleQueue, promise) {
  if (!promise) return;
  if (promise._timeoutObj) clearTimeout(promise._timeoutObj);
  if (idleQueue._pHM.has(promise)) {
    var handle = idleQueue._pHM.get(promise);
    idleQueue._hPM["delete"](handle);
    idleQueue._pHM["delete"](promise);
  }
  idleQueue._iC["delete"](promise);
}
function _tryIdleCall(idleQueue) {
  if (idleQueue._tryIR || idleQueue._iC.size === 0) return;
  idleQueue._tryIR = true;
  setTimeout(function() {
    if (!idleQueue.isIdle()) {
      idleQueue._tryIR = false;
      return;
    }
    setTimeout(function() {
      if (!idleQueue.isIdle()) {
        idleQueue._tryIR = false;
        return;
      }
      _resolveOneIdleCall(idleQueue);
      idleQueue._tryIR = false;
    }, 0);
  }, 0);
}

// node_modules/oblivious-set/dist/esm/src/index.js
var ObliviousSet = class {
  ttl;
  map = /* @__PURE__ */ new Map();
  /**
   * Creating calls to setTimeout() is expensive,
   * so we only do that if there is not timeout already open.
   */
  _to = false;
  constructor(ttl) {
    this.ttl = ttl;
  }
  has(value) {
    return this.map.has(value);
  }
  add(value) {
    this.map.set(value, now2());
    if (!this._to) {
      this._to = true;
      setTimeout(() => {
        this._to = false;
        removeTooOldValues(this);
      }, 0);
    }
  }
  clear() {
    this.map.clear();
  }
};
function removeTooOldValues(obliviousSet) {
  const olderThen = now2() - obliviousSet.ttl;
  const iterator2 = obliviousSet.map[Symbol.iterator]();
  while (true) {
    const next = iterator2.next().value;
    if (!next) {
      return;
    }
    const value = next[0];
    const time = next[1];
    if (time < olderThen) {
      obliviousSet.map.delete(value);
    } else {
      return;
    }
  }
}
function now2() {
  return Date.now();
}

// node_modules/rxdb/dist/esm/rx-database.js
var USED_DATABASE_NAMES = /* @__PURE__ */ new Set();
var DB_COUNT = 0;
var RxDatabaseBase = /* @__PURE__ */ function() {
  function RxDatabaseBase2(name, token, storage, instanceCreationOptions, password, multiInstance, eventReduce = false, options = {}, internalStore, hashFunction, cleanupPolicy, allowSlowCount, reactivity) {
    this.idleQueue = new IdleQueue();
    this.rxdbVersion = RXDB_VERSION;
    this.storageInstances = /* @__PURE__ */ new Set();
    this._subs = [];
    this.startupErrors = [];
    this.onClose = [];
    this.closed = false;
    this.collections = {};
    this.states = {};
    this.eventBulks$ = new Subject();
    this.observable$ = this.eventBulks$.pipe(mergeMap((changeEventBulk) => rxChangeEventBulkToRxChangeEvents(changeEventBulk)));
    this.storageToken = PROMISE_RESOLVE_FALSE;
    this.storageTokenDocument = PROMISE_RESOLVE_FALSE;
    this.emittedEventBulkIds = new ObliviousSet(60 * 1e3);
    this.name = name;
    this.token = token;
    this.storage = storage;
    this.instanceCreationOptions = instanceCreationOptions;
    this.password = password;
    this.multiInstance = multiInstance;
    this.eventReduce = eventReduce;
    this.options = options;
    this.internalStore = internalStore;
    this.hashFunction = hashFunction;
    this.cleanupPolicy = cleanupPolicy;
    this.allowSlowCount = allowSlowCount;
    this.reactivity = reactivity;
    DB_COUNT++;
    if (this.name !== "pseudoInstance") {
      this.internalStore = getWrappedStorageInstance(this.asRxDatabase, internalStore, INTERNAL_STORE_SCHEMA);
      this.storageTokenDocument = ensureStorageTokenDocumentExists(this.asRxDatabase).catch((err) => this.startupErrors.push(err));
      this.storageToken = this.storageTokenDocument.then((doc) => doc.data.token).catch((err) => this.startupErrors.push(err));
    }
  }
  var _proto = RxDatabaseBase2.prototype;
  _proto.getReactivityFactory = function getReactivityFactory() {
    if (!this.reactivity) {
      throw newRxError("DB14", {
        database: this.name
      });
    }
    return this.reactivity;
  };
  _proto.$emit = function $emit(changeEventBulk) {
    if (this.emittedEventBulkIds.has(changeEventBulk.id)) {
      return;
    }
    this.emittedEventBulkIds.add(changeEventBulk.id);
    this.eventBulks$.next(changeEventBulk);
  };
  _proto.removeCollectionDoc = async function removeCollectionDoc(name, schema) {
    var doc = await getSingleDocument(this.internalStore, getPrimaryKeyOfInternalDocument(_collectionNamePrimary(name, schema), INTERNAL_CONTEXT_COLLECTION));
    if (!doc) {
      throw newRxError("SNH", {
        name,
        schema
      });
    }
    var writeDoc = flatCloneDocWithMeta(doc);
    writeDoc._deleted = true;
    await this.internalStore.bulkWrite([{
      document: writeDoc,
      previous: doc
    }], "rx-database-remove-collection");
  };
  _proto.addCollections = async function addCollections(collectionCreators) {
    var jsonSchemas = {};
    var schemas = {};
    var bulkPutDocs = [];
    var useArgsByCollectionName = {};
    await Promise.all(Object.entries(collectionCreators).map(async ([name, args]) => {
      var collectionName = name;
      var rxJsonSchema = args.schema;
      jsonSchemas[collectionName] = rxJsonSchema;
      var schema = createRxSchema(rxJsonSchema, this.hashFunction);
      schemas[collectionName] = schema;
      if (this.collections[name]) {
        throw newRxError("DB3", {
          name
        });
      }
      var collectionNameWithVersion = _collectionNamePrimary(name, rxJsonSchema);
      var collectionDocData = {
        id: getPrimaryKeyOfInternalDocument(collectionNameWithVersion, INTERNAL_CONTEXT_COLLECTION),
        key: collectionNameWithVersion,
        context: INTERNAL_CONTEXT_COLLECTION,
        data: {
          name: collectionName,
          schemaHash: await schema.hash,
          schema: schema.jsonSchema,
          version: schema.version,
          connectedStorages: []
        },
        _deleted: false,
        _meta: getDefaultRxDocumentMeta(),
        _rev: getDefaultRevision(),
        _attachments: {}
      };
      bulkPutDocs.push({
        document: collectionDocData
      });
      var useArgs = Object.assign({}, args, {
        name: collectionName,
        schema,
        database: this
      });
      var hookData = flatClone(args);
      hookData.database = this;
      hookData.name = name;
      runPluginHooks("preCreateRxCollection", hookData);
      useArgs.conflictHandler = hookData.conflictHandler;
      useArgsByCollectionName[collectionName] = useArgs;
    }));
    var putDocsResult = await this.internalStore.bulkWrite(bulkPutDocs, "rx-database-add-collection");
    await ensureNoStartupErrors(this);
    await Promise.all(putDocsResult.error.map(async (error) => {
      if (error.status !== 409) {
        throw newRxError("DB12", {
          database: this.name,
          writeError: error
        });
      }
      var docInDb = ensureNotFalsy(error.documentInDb);
      var collectionName = docInDb.data.name;
      var schema = schemas[collectionName];
      if (docInDb.data.schemaHash !== await schema.hash) {
        throw newRxError("DB6", {
          database: this.name,
          collection: collectionName,
          previousSchemaHash: docInDb.data.schemaHash,
          schemaHash: await schema.hash,
          previousSchema: docInDb.data.schema,
          schema: ensureNotFalsy(jsonSchemas[collectionName])
        });
      }
    }));
    var ret = {};
    await Promise.all(Object.keys(collectionCreators).map(async (collectionName) => {
      var useArgs = useArgsByCollectionName[collectionName];
      var collection = await createRxCollection(useArgs);
      ret[collectionName] = collection;
      this.collections[collectionName] = collection;
      if (!this[collectionName]) {
        Object.defineProperty(this, collectionName, {
          get: () => this.collections[collectionName]
        });
      }
    }));
    return ret;
  };
  _proto.lockedRun = function lockedRun(fn) {
    return this.idleQueue.wrapCall(fn);
  };
  _proto.requestIdlePromise = function requestIdlePromise3() {
    return this.idleQueue.requestIdlePromise();
  };
  _proto.exportJSON = function exportJSON(_collections) {
    throw pluginMissing("json-dump");
  };
  _proto.addState = function addState(_name) {
    throw pluginMissing("state");
  };
  _proto.importJSON = function importJSON(_exportedJSON) {
    throw pluginMissing("json-dump");
  };
  _proto.backup = function backup(_options) {
    throw pluginMissing("backup");
  };
  _proto.leaderElector = function leaderElector() {
    throw pluginMissing("leader-election");
  };
  _proto.isLeader = function isLeader2() {
    throw pluginMissing("leader-election");
  };
  _proto.waitForLeadership = function waitForLeadership2() {
    throw pluginMissing("leader-election");
  };
  _proto.migrationStates = function migrationStates() {
    throw pluginMissing("migration-schema");
  };
  _proto.close = async function close6() {
    if (this.closed) {
      return PROMISE_RESOLVE_FALSE;
    }
    this.closed = true;
    await runAsyncPluginHooks("preCloseRxDatabase", this);
    this.eventBulks$.complete();
    DB_COUNT--;
    this._subs.map((sub) => sub.unsubscribe());
    if (this.name === "pseudoInstance") {
      return PROMISE_RESOLVE_FALSE;
    }
    return this.requestIdlePromise().then(() => Promise.all(this.onClose.map((fn) => fn()))).then(() => Promise.all(Object.keys(this.collections).map((key) => this.collections[key]).map((col) => col.close()))).then(() => this.internalStore.close()).then(() => USED_DATABASE_NAMES.delete(this.storage.name + "|" + this.name)).then(() => true);
  };
  _proto.remove = function remove2() {
    return this.close().then(() => removeRxDatabase(this.name, this.storage, this.multiInstance, this.password));
  };
  return _createClass(RxDatabaseBase2, [{
    key: "$",
    get: function() {
      return this.observable$;
    }
  }, {
    key: "asRxDatabase",
    get: function() {
      return this;
    }
  }]);
}();
function throwIfDatabaseNameUsed(name, storage) {
  var key = storage.name + "|" + name;
  if (!USED_DATABASE_NAMES.has(key)) {
    return;
  } else {
    throw newRxError("DB8", {
      name,
      storage: storage.name,
      link: "https://rxdb.info/rx-database.html#ignoreduplicate"
    });
  }
}
async function createRxDatabaseStorageInstance(databaseInstanceToken, storage, databaseName, options, multiInstance, password) {
  var internalStore = await storage.createStorageInstance({
    databaseInstanceToken,
    databaseName,
    collectionName: INTERNAL_STORAGE_NAME,
    schema: INTERNAL_STORE_SCHEMA,
    options,
    multiInstance,
    password,
    devMode: overwritable.isDevMode()
  });
  return internalStore;
}
function createRxDatabase({
  storage,
  instanceCreationOptions,
  name,
  password,
  multiInstance = true,
  eventReduce = true,
  ignoreDuplicate = false,
  options = {},
  cleanupPolicy,
  allowSlowCount = false,
  localDocuments = false,
  hashFunction = defaultHashSha256,
  reactivity
}) {
  runPluginHooks("preCreateRxDatabase", {
    storage,
    instanceCreationOptions,
    name,
    password,
    multiInstance,
    eventReduce,
    ignoreDuplicate,
    options,
    localDocuments
  });
  if (!ignoreDuplicate) {
    throwIfDatabaseNameUsed(name, storage);
  } else {
    if (!overwritable.isDevMode()) {
      throw newRxError("DB9", {
        database: name
      });
    }
  }
  USED_DATABASE_NAMES.add(storage.name + "|" + name);
  var databaseInstanceToken = randomToken(10);
  return createRxDatabaseStorageInstance(databaseInstanceToken, storage, name, instanceCreationOptions, multiInstance, password).catch((err) => {
    USED_DATABASE_NAMES.delete(storage.name + "|" + name);
    throw err;
  }).then((storageInstance) => {
    var rxDatabase = new RxDatabaseBase(name, databaseInstanceToken, storage, instanceCreationOptions, password, multiInstance, eventReduce, options, storageInstance, hashFunction, cleanupPolicy, allowSlowCount, reactivity);
    return runAsyncPluginHooks("createRxDatabase", {
      database: rxDatabase,
      creator: {
        storage,
        instanceCreationOptions,
        name,
        password,
        multiInstance,
        eventReduce,
        ignoreDuplicate,
        options,
        localDocuments
      }
    }).then(() => rxDatabase);
  });
}
async function removeRxDatabase(databaseName, storage, multiInstance = true, password) {
  var databaseInstanceToken = randomToken(10);
  var dbInternalsStorageInstance = await createRxDatabaseStorageInstance(databaseInstanceToken, storage, databaseName, {}, multiInstance, password);
  var collectionDocs = await getAllCollectionDocuments(dbInternalsStorageInstance);
  var collectionNames = /* @__PURE__ */ new Set();
  collectionDocs.forEach((doc) => collectionNames.add(doc.data.name));
  var removedCollectionNames = Array.from(collectionNames);
  await Promise.all(removedCollectionNames.map((collectionName) => removeCollectionStorages(storage, dbInternalsStorageInstance, databaseInstanceToken, databaseName, collectionName, multiInstance, password)));
  await runAsyncPluginHooks("postRemoveRxDatabase", {
    databaseName,
    storage
  });
  await dbInternalsStorageInstance.remove();
  return removedCollectionNames;
}
async function ensureNoStartupErrors(rxDatabase) {
  await rxDatabase.storageToken;
  if (rxDatabase.startupErrors[0]) {
    throw rxDatabase.startupErrors[0];
  }
}

// node_modules/rxdb/dist/esm/plugin.js
var PROTOTYPES = {
  RxSchema: RxSchema.prototype,
  RxDocument: basePrototype,
  RxQuery: RxQueryBase.prototype,
  RxCollection: RxCollectionBase.prototype,
  RxDatabase: RxDatabaseBase.prototype
};
var ADDED_PLUGINS = /* @__PURE__ */ new Set();
var ADDED_PLUGIN_NAMES = /* @__PURE__ */ new Set();
function addRxPlugin(plugin) {
  runPluginHooks("preAddRxPlugin", {
    plugin,
    plugins: ADDED_PLUGINS
  });
  if (ADDED_PLUGINS.has(plugin)) {
    return;
  } else {
    if (ADDED_PLUGIN_NAMES.has(plugin.name)) {
      throw newRxError("PL3", {
        name: plugin.name,
        plugin
      });
    }
    ADDED_PLUGINS.add(plugin);
    ADDED_PLUGIN_NAMES.add(plugin.name);
  }
  if (!plugin.rxdb) {
    throw newRxTypeError("PL1", {
      plugin
    });
  }
  if (plugin.init) {
    plugin.init();
  }
  if (plugin.prototypes) {
    Object.entries(plugin.prototypes).forEach(([name, fun]) => {
      return fun(PROTOTYPES[name]);
    });
  }
  if (plugin.overwritable) {
    Object.assign(overwritable, plugin.overwritable);
  }
  if (plugin.hooks) {
    Object.entries(plugin.hooks).forEach(([name, hooksObj]) => {
      if (hooksObj.after) {
        HOOKS[name].push(hooksObj.after);
      }
      if (hooksObj.before) {
        HOOKS[name].unshift(hooksObj.before);
      }
    });
  }
}

// node_modules/rxdb/dist/esm/replication-protocol/checkpoint.js
async function getLastCheckpointDoc(state, direction) {
  var checkpointDocId = getComposedPrimaryKeyOfDocumentData(state.input.metaInstance.schema, {
    isCheckpoint: "1",
    itemId: direction
  });
  var checkpointResult = await state.input.metaInstance.findDocumentsById([checkpointDocId], false);
  var checkpointDoc = checkpointResult[0];
  state.lastCheckpointDoc[direction] = checkpointDoc;
  if (checkpointDoc) {
    return checkpointDoc.checkpointData;
  } else {
    return void 0;
  }
}
async function setCheckpoint(state, direction, checkpoint) {
  state.checkpointQueue = state.checkpointQueue.then(async () => {
    var previousCheckpointDoc = state.lastCheckpointDoc[direction];
    if (checkpoint && /**
     * If the replication is already canceled,
     * we do not write a checkpoint
     * because that could mean we write a checkpoint
     * for data that has been fetched from the master
     * but not been written to the child.
     */
    !state.events.canceled.getValue() && /**
     * Only write checkpoint if it is different from before
     * to have less writes to the storage.
     */
    (!previousCheckpointDoc || JSON.stringify(previousCheckpointDoc.checkpointData) !== JSON.stringify(checkpoint))) {
      var newDoc = {
        id: "",
        isCheckpoint: "1",
        itemId: direction,
        _deleted: false,
        _attachments: {},
        checkpointData: checkpoint,
        _meta: getDefaultRxDocumentMeta(),
        _rev: getDefaultRevision()
      };
      newDoc.id = getComposedPrimaryKeyOfDocumentData(state.input.metaInstance.schema, newDoc);
      while (!state.events.canceled.getValue()) {
        if (previousCheckpointDoc) {
          newDoc.checkpointData = stackCheckpoints([previousCheckpointDoc.checkpointData, newDoc.checkpointData]);
        }
        newDoc._meta.lwt = now();
        newDoc._rev = createRevision(await state.checkpointKey, previousCheckpointDoc);
        if (state.events.canceled.getValue()) {
          return;
        }
        var writeRows = [{
          previous: previousCheckpointDoc,
          document: newDoc
        }];
        var result = await state.input.metaInstance.bulkWrite(writeRows, "replication-set-checkpoint");
        var successDoc = getWrittenDocumentsFromBulkWriteResponse(state.primaryPath, writeRows, result)[0];
        if (successDoc) {
          state.lastCheckpointDoc[direction] = successDoc;
          return;
        } else {
          var error = result.error[0];
          if (error.status !== 409) {
            throw error;
          } else {
            previousCheckpointDoc = ensureNotFalsy(error.documentInDb);
            newDoc._rev = createRevision(await state.checkpointKey, previousCheckpointDoc);
          }
        }
      }
    }
  });
  await state.checkpointQueue;
}
async function getCheckpointKey(input) {
  var hash = await input.hashFunction([input.identifier, input.forkInstance.databaseName, input.forkInstance.collectionName].join("||"));
  return "rx_storage_replication_" + hash;
}

// node_modules/rxdb/dist/esm/replication-protocol/helper.js
function docStateToWriteDoc(databaseInstanceToken, hasAttachments, keepMeta, docState, previous) {
  var docData = Object.assign({}, docState, {
    _attachments: hasAttachments && docState._attachments ? docState._attachments : {},
    _meta: keepMeta ? docState._meta : Object.assign({}, previous ? previous._meta : {}, {
      lwt: now()
    }),
    _rev: keepMeta ? docState._rev : getDefaultRevision()
  });
  if (!docData._rev) {
    docData._rev = createRevision(databaseInstanceToken, previous);
  }
  return docData;
}
function writeDocToDocState(writeDoc, keepAttachments, keepMeta) {
  var ret = flatClone(writeDoc);
  if (!keepAttachments) {
    delete ret._attachments;
  }
  if (!keepMeta) {
    delete ret._meta;
    delete ret._rev;
  }
  return ret;
}
function stripAttachmentsDataFromMetaWriteRows(state, rows) {
  if (!state.hasAttachments) {
    return rows;
  }
  return rows.map((row) => {
    var document2 = clone(row.document);
    document2.docData = stripAttachmentsDataFromDocument(document2.docData);
    return {
      document: document2,
      previous: row.previous
    };
  });
}
function getUnderlyingPersistentStorage(instance) {
  while (true) {
    if (instance.underlyingPersistentStorage) {
      instance = instance.underlyingPersistentStorage;
    } else {
      return instance;
    }
  }
}

// node_modules/rxdb/dist/esm/replication-protocol/meta-instance.js
var META_INSTANCE_SCHEMA_TITLE = "RxReplicationProtocolMetaData";
function getRxReplicationMetaInstanceSchema(replicatedDocumentsSchema, encrypted) {
  var parentPrimaryKeyLength = getLengthOfPrimaryKey(replicatedDocumentsSchema);
  var baseSchema = {
    title: META_INSTANCE_SCHEMA_TITLE,
    primaryKey: {
      key: "id",
      fields: ["itemId", "isCheckpoint"],
      separator: "|"
    },
    type: "object",
    version: replicatedDocumentsSchema.version,
    additionalProperties: false,
    properties: {
      id: {
        type: "string",
        minLength: 1,
        // add +1 for the '|' and +1 for the 'isCheckpoint' flag
        maxLength: parentPrimaryKeyLength + 2
      },
      isCheckpoint: {
        type: "string",
        enum: ["0", "1"],
        minLength: 1,
        maxLength: 1
      },
      itemId: {
        type: "string",
        /**
         * ensure that all values of RxStorageReplicationDirection ('DOWN' has 4 chars) fit into it
         * because checkpoints use the itemId field for that.
         */
        maxLength: parentPrimaryKeyLength > 4 ? parentPrimaryKeyLength : 4
      },
      checkpointData: {
        type: "object",
        additionalProperties: true
      },
      docData: {
        type: "object",
        properties: replicatedDocumentsSchema.properties
      },
      isResolvedConflict: {
        type: "string"
      }
    },
    keyCompression: replicatedDocumentsSchema.keyCompression,
    required: ["id", "isCheckpoint", "itemId"]
  };
  if (encrypted) {
    baseSchema.encrypted = ["docData"];
  }
  var metaInstanceSchema = fillWithDefaultSettings(baseSchema);
  return metaInstanceSchema;
}
function getAssumedMasterState(state, docIds) {
  return state.input.metaInstance.findDocumentsById(docIds.map((docId) => {
    var useId = getComposedPrimaryKeyOfDocumentData(state.input.metaInstance.schema, {
      itemId: docId,
      isCheckpoint: "0"
    });
    return useId;
  }), true).then((metaDocs) => {
    var ret = {};
    Object.values(metaDocs).forEach((metaDoc) => {
      ret[metaDoc.itemId] = {
        docData: metaDoc.docData,
        metaDocument: metaDoc
      };
    });
    return ret;
  });
}
async function getMetaWriteRow(state, newMasterDocState, previous, isResolvedConflict) {
  var docId = newMasterDocState[state.primaryPath];
  var newMeta = previous ? flatCloneDocWithMeta(previous) : {
    id: "",
    isCheckpoint: "0",
    itemId: docId,
    docData: newMasterDocState,
    _attachments: {},
    _deleted: false,
    _rev: getDefaultRevision(),
    _meta: {
      lwt: 0
    }
  };
  newMeta.docData = newMasterDocState;
  if (isResolvedConflict) {
    newMeta.isResolvedConflict = isResolvedConflict;
  }
  newMeta._meta.lwt = now();
  newMeta.id = getComposedPrimaryKeyOfDocumentData(state.input.metaInstance.schema, newMeta);
  newMeta._rev = createRevision(await state.checkpointKey, previous);
  var ret = {
    previous,
    document: newMeta
  };
  return ret;
}

// node_modules/rxdb/dist/esm/replication-protocol/downstream.js
async function startReplicationDownstream(state) {
  if (state.input.initialCheckpoint && state.input.initialCheckpoint.downstream) {
    var checkpointDoc = await getLastCheckpointDoc(state, "down");
    if (!checkpointDoc) {
      await setCheckpoint(state, "down", state.input.initialCheckpoint.downstream);
    }
  }
  var identifierHash = await state.input.hashFunction(state.input.identifier);
  var replicationHandler = state.input.replicationHandler;
  var timer = 0;
  var openTasks = [];
  function addNewTask(task) {
    state.stats.down.addNewTask = state.stats.down.addNewTask + 1;
    var taskWithTime = {
      time: timer++,
      task
    };
    openTasks.push(taskWithTime);
    state.streamQueue.down = state.streamQueue.down.then(() => {
      var useTasks = [];
      while (openTasks.length > 0) {
        state.events.active.down.next(true);
        var innerTaskWithTime = ensureNotFalsy(openTasks.shift());
        if (innerTaskWithTime.time < lastTimeMasterChangesRequested) {
          continue;
        }
        if (innerTaskWithTime.task === "RESYNC") {
          if (useTasks.length === 0) {
            useTasks.push(innerTaskWithTime.task);
            break;
          } else {
            break;
          }
        }
        useTasks.push(innerTaskWithTime.task);
      }
      if (useTasks.length === 0) {
        return;
      }
      if (useTasks[0] === "RESYNC") {
        return downstreamResyncOnce();
      } else {
        return downstreamProcessChanges(useTasks);
      }
    }).then(() => {
      state.events.active.down.next(false);
      if (!state.firstSyncDone.down.getValue() && !state.events.canceled.getValue()) {
        state.firstSyncDone.down.next(true);
      }
    });
  }
  addNewTask("RESYNC");
  if (!state.events.canceled.getValue()) {
    var sub = replicationHandler.masterChangeStream$.pipe(mergeMap(async (ev) => {
      await firstValueFrom(state.events.active.up.pipe(filter((s) => !s)));
      return ev;
    })).subscribe((task) => {
      state.stats.down.masterChangeStreamEmit = state.stats.down.masterChangeStreamEmit + 1;
      addNewTask(task);
    });
    firstValueFrom(state.events.canceled.pipe(filter((canceled) => !!canceled))).then(() => sub.unsubscribe());
  }
  var lastTimeMasterChangesRequested = -1;
  async function downstreamResyncOnce() {
    state.stats.down.downstreamResyncOnce = state.stats.down.downstreamResyncOnce + 1;
    if (state.events.canceled.getValue()) {
      return;
    }
    state.checkpointQueue = state.checkpointQueue.then(() => getLastCheckpointDoc(state, "down"));
    var lastCheckpoint = await state.checkpointQueue;
    var promises = [];
    while (!state.events.canceled.getValue()) {
      lastTimeMasterChangesRequested = timer++;
      var downResult = await replicationHandler.masterChangesSince(lastCheckpoint, state.input.pullBatchSize);
      if (downResult.documents.length === 0) {
        break;
      }
      lastCheckpoint = stackCheckpoints([lastCheckpoint, downResult.checkpoint]);
      promises.push(persistFromMaster(downResult.documents, lastCheckpoint));
      if (downResult.documents.length < state.input.pullBatchSize) {
        break;
      }
    }
    await Promise.all(promises);
  }
  function downstreamProcessChanges(tasks) {
    state.stats.down.downstreamProcessChanges = state.stats.down.downstreamProcessChanges + 1;
    var docsOfAllTasks = [];
    var lastCheckpoint = null;
    tasks.forEach((task) => {
      if (task === "RESYNC") {
        throw new Error("SNH");
      }
      appendToArray(docsOfAllTasks, task.documents);
      lastCheckpoint = stackCheckpoints([lastCheckpoint, task.checkpoint]);
    });
    return persistFromMaster(docsOfAllTasks, ensureNotFalsy(lastCheckpoint));
  }
  var persistenceQueue = PROMISE_RESOLVE_VOID;
  var nonPersistedFromMaster = {
    docs: {}
  };
  function persistFromMaster(docs, checkpoint) {
    var primaryPath = state.primaryPath;
    state.stats.down.persistFromMaster = state.stats.down.persistFromMaster + 1;
    docs.forEach((docData) => {
      var docId = docData[primaryPath];
      nonPersistedFromMaster.docs[docId] = docData;
    });
    nonPersistedFromMaster.checkpoint = checkpoint;
    persistenceQueue = persistenceQueue.then(() => {
      var downDocsById = nonPersistedFromMaster.docs;
      nonPersistedFromMaster.docs = {};
      var useCheckpoint = nonPersistedFromMaster.checkpoint;
      var docIds = Object.keys(downDocsById);
      if (state.events.canceled.getValue() || docIds.length === 0) {
        return PROMISE_RESOLVE_VOID;
      }
      var writeRowsToFork = [];
      var writeRowsToForkById = {};
      var writeRowsToMeta = {};
      var useMetaWriteRows = [];
      return Promise.all([state.input.forkInstance.findDocumentsById(docIds, true), getAssumedMasterState(state, docIds)]).then(([currentForkStateList, assumedMasterState]) => {
        var currentForkState = /* @__PURE__ */ new Map();
        currentForkStateList.forEach((doc) => currentForkState.set(doc[primaryPath], doc));
        return Promise.all(docIds.map(async (docId) => {
          var forkStateFullDoc = currentForkState.get(docId);
          var forkStateDocData = forkStateFullDoc ? writeDocToDocState(forkStateFullDoc, state.hasAttachments, false) : void 0;
          var masterState = downDocsById[docId];
          var assumedMaster = assumedMasterState[docId];
          if (assumedMaster && forkStateFullDoc && assumedMaster.metaDocument.isResolvedConflict === forkStateFullDoc._rev) {
            await state.streamQueue.up;
          }
          var isAssumedMasterEqualToForkState = !assumedMaster || !forkStateDocData ? false : state.input.conflictHandler.isEqual(assumedMaster.docData, forkStateDocData, "downstream-check-if-equal-0");
          if (!isAssumedMasterEqualToForkState && assumedMaster && assumedMaster.docData._rev && forkStateFullDoc && forkStateFullDoc._meta[state.input.identifier] && getHeightOfRevision(forkStateFullDoc._rev) === forkStateFullDoc._meta[state.input.identifier]) {
            isAssumedMasterEqualToForkState = true;
          }
          if (forkStateFullDoc && assumedMaster && isAssumedMasterEqualToForkState === false || forkStateFullDoc && !assumedMaster) {
            return PROMISE_RESOLVE_VOID;
          }
          var areStatesExactlyEqual = !forkStateDocData ? false : state.input.conflictHandler.isEqual(masterState, forkStateDocData, "downstream-check-if-equal-1");
          if (forkStateDocData && areStatesExactlyEqual) {
            if (!assumedMaster || isAssumedMasterEqualToForkState === false) {
              useMetaWriteRows.push(await getMetaWriteRow(state, forkStateDocData, assumedMaster ? assumedMaster.metaDocument : void 0));
            }
            return PROMISE_RESOLVE_VOID;
          }
          var newForkState = Object.assign({}, masterState, forkStateFullDoc ? {
            _meta: flatClone(forkStateFullDoc._meta),
            _attachments: state.hasAttachments && masterState._attachments ? masterState._attachments : {},
            _rev: getDefaultRevision()
          } : {
            _meta: {
              lwt: now()
            },
            _rev: getDefaultRevision(),
            _attachments: state.hasAttachments && masterState._attachments ? masterState._attachments : {}
          });
          if (masterState._rev) {
            var nextRevisionHeight = !forkStateFullDoc ? 1 : getHeightOfRevision(forkStateFullDoc._rev) + 1;
            newForkState._meta[state.input.identifier] = nextRevisionHeight;
            if (state.input.keepMeta) {
              newForkState._rev = masterState._rev;
            }
          }
          if (state.input.keepMeta && masterState._meta) {
            newForkState._meta = masterState._meta;
          }
          var forkWriteRow = {
            previous: forkStateFullDoc,
            document: newForkState
          };
          forkWriteRow.document._rev = forkWriteRow.document._rev ? forkWriteRow.document._rev : createRevision(identifierHash, forkWriteRow.previous);
          writeRowsToFork.push(forkWriteRow);
          writeRowsToForkById[docId] = forkWriteRow;
          writeRowsToMeta[docId] = await getMetaWriteRow(state, masterState, assumedMaster ? assumedMaster.metaDocument : void 0);
        }));
      }).then(async () => {
        if (writeRowsToFork.length > 0) {
          return state.input.forkInstance.bulkWrite(writeRowsToFork, await state.downstreamBulkWriteFlag).then((forkWriteResult) => {
            var success = getWrittenDocumentsFromBulkWriteResponse(state.primaryPath, writeRowsToFork, forkWriteResult);
            success.forEach((doc) => {
              var docId = doc[primaryPath];
              state.events.processed.down.next(writeRowsToForkById[docId]);
              useMetaWriteRows.push(writeRowsToMeta[docId]);
            });
            var mustThrow;
            forkWriteResult.error.forEach((error) => {
              if (error.status === 409) {
                return;
              }
              var throwMe = newRxError("RC_PULL", {
                writeError: error
              });
              state.events.error.next(throwMe);
              mustThrow = throwMe;
            });
            if (mustThrow) {
              throw mustThrow;
            }
          });
        }
      }).then(() => {
        if (useMetaWriteRows.length > 0) {
          return state.input.metaInstance.bulkWrite(stripAttachmentsDataFromMetaWriteRows(state, useMetaWriteRows), "replication-down-write-meta").then((metaWriteResult) => {
            metaWriteResult.error.forEach((writeError) => {
              state.events.error.next(newRxError("RC_PULL", {
                id: writeError.documentId,
                writeError
              }));
            });
          });
        }
      }).then(() => {
        setCheckpoint(state, "down", useCheckpoint);
      });
    }).catch((unhandledError) => state.events.error.next(unhandledError));
    return persistenceQueue;
  }
}

// node_modules/rxdb/dist/esm/replication-protocol/conflicts.js
async function resolveConflictError(state, input, forkState) {
  var conflictHandler = state.input.conflictHandler;
  var isEqual2 = conflictHandler.isEqual(input.realMasterState, input.newDocumentState, "replication-resolve-conflict");
  if (isEqual2) {
    return void 0;
  } else {
    var resolved = await conflictHandler.resolve(input, "replication-resolve-conflict");
    var resolvedDoc = Object.assign({}, resolved, {
      /**
       * Because the resolved conflict is written to the fork,
       * we have to keep/update the forks _meta data, not the masters.
       */
      _meta: flatClone(forkState._meta),
      _rev: getDefaultRevision(),
      _attachments: flatClone(forkState._attachments)
    });
    resolvedDoc._meta.lwt = now();
    resolvedDoc._rev = createRevision(await state.checkpointKey, forkState);
    return resolvedDoc;
  }
}

// node_modules/rxdb/dist/esm/plugins/attachments/attachments-utils.js
async function fillWriteDataForAttachmentsChange(primaryPath, storageInstance, newDocument, originalDocument) {
  if (!newDocument._attachments || originalDocument && !originalDocument._attachments) {
    throw new Error("_attachments missing");
  }
  var docId = newDocument[primaryPath];
  var originalAttachmentsIds = new Set(originalDocument && originalDocument._attachments ? Object.keys(originalDocument._attachments) : []);
  await Promise.all(Object.entries(newDocument._attachments).map(async ([key, value]) => {
    if ((!originalAttachmentsIds.has(key) || originalDocument && ensureNotFalsy(originalDocument._attachments)[key].digest !== value.digest) && !value.data) {
      var attachmentDataString = await storageInstance.getAttachmentData(docId, key, value.digest);
      value.data = attachmentDataString;
    }
  }));
  return newDocument;
}

// node_modules/rxdb/dist/esm/replication-protocol/upstream.js
async function startReplicationUpstream(state) {
  if (state.input.initialCheckpoint && state.input.initialCheckpoint.upstream) {
    var checkpointDoc = await getLastCheckpointDoc(state, "up");
    if (!checkpointDoc) {
      await setCheckpoint(state, "up", state.input.initialCheckpoint.upstream);
    }
  }
  var replicationHandler = state.input.replicationHandler;
  state.streamQueue.up = state.streamQueue.up.then(() => {
    return upstreamInitialSync().then(() => {
      return processTasks();
    });
  });
  var timer = 0;
  var initialSyncStartTime = -1;
  var openTasks = [];
  var persistenceQueue = PROMISE_RESOLVE_FALSE;
  var nonPersistedFromMaster = {
    docs: {}
  };
  var sub = state.input.forkInstance.changeStream().subscribe((eventBulk) => {
    if (state.events.paused.getValue()) {
      return;
    }
    state.stats.up.forkChangeStreamEmit = state.stats.up.forkChangeStreamEmit + 1;
    openTasks.push({
      task: eventBulk,
      time: timer++
    });
    if (!state.events.active.up.getValue()) {
      state.events.active.up.next(true);
    }
    if (state.input.waitBeforePersist) {
      return state.input.waitBeforePersist().then(() => processTasks());
    } else {
      return processTasks();
    }
  });
  var subResync = replicationHandler.masterChangeStream$.pipe(filter((ev) => ev === "RESYNC")).subscribe(() => {
    openTasks.push({
      task: "RESYNC",
      time: timer++
    });
    processTasks();
  });
  firstValueFrom(state.events.canceled.pipe(filter((canceled) => !!canceled))).then(() => {
    sub.unsubscribe();
    subResync.unsubscribe();
  });
  async function upstreamInitialSync() {
    state.stats.up.upstreamInitialSync = state.stats.up.upstreamInitialSync + 1;
    if (state.events.canceled.getValue()) {
      return;
    }
    state.checkpointQueue = state.checkpointQueue.then(() => getLastCheckpointDoc(state, "up"));
    var lastCheckpoint = await state.checkpointQueue;
    var promises = /* @__PURE__ */ new Set();
    var _loop = async function() {
      initialSyncStartTime = timer++;
      if (promises.size > 3) {
        await Promise.race(Array.from(promises));
      }
      var upResult = await getChangedDocumentsSince(state.input.forkInstance, state.input.pushBatchSize, lastCheckpoint);
      if (upResult.documents.length === 0) {
        return 1;
      }
      lastCheckpoint = stackCheckpoints([lastCheckpoint, upResult.checkpoint]);
      var promise = persistToMaster(upResult.documents, ensureNotFalsy(lastCheckpoint));
      promises.add(promise);
      promise.catch().then(() => promises.delete(promise));
    };
    while (!state.events.canceled.getValue()) {
      if (await _loop()) break;
    }
    var resolvedPromises = await Promise.all(promises);
    var hadConflicts = resolvedPromises.find((r) => !!r);
    if (hadConflicts) {
      await upstreamInitialSync();
    } else if (!state.firstSyncDone.up.getValue() && !state.events.canceled.getValue()) {
      state.firstSyncDone.up.next(true);
    }
  }
  function processTasks() {
    if (state.events.canceled.getValue() || openTasks.length === 0) {
      state.events.active.up.next(false);
      return;
    }
    state.stats.up.processTasks = state.stats.up.processTasks + 1;
    state.events.active.up.next(true);
    state.streamQueue.up = state.streamQueue.up.then(async () => {
      var docs = [];
      var checkpoint = {};
      while (openTasks.length > 0) {
        var taskWithTime = ensureNotFalsy(openTasks.shift());
        if (taskWithTime.time < initialSyncStartTime) {
          continue;
        }
        if (taskWithTime.task === "RESYNC") {
          state.events.active.up.next(false);
          await upstreamInitialSync();
          return;
        }
        if (taskWithTime.task.context !== await state.downstreamBulkWriteFlag) {
          appendToArray(docs, taskWithTime.task.events.map((r) => {
            return r.documentData;
          }));
        }
        checkpoint = stackCheckpoints([checkpoint, taskWithTime.task.checkpoint]);
      }
      await persistToMaster(docs, checkpoint);
      if (openTasks.length === 0) {
        state.events.active.up.next(false);
      } else {
        return processTasks();
      }
    });
  }
  function persistToMaster(docs, checkpoint) {
    state.stats.up.persistToMaster = state.stats.up.persistToMaster + 1;
    docs.forEach((docData) => {
      var docId = docData[state.primaryPath];
      nonPersistedFromMaster.docs[docId] = docData;
    });
    nonPersistedFromMaster.checkpoint = checkpoint;
    persistenceQueue = persistenceQueue.then(async () => {
      if (state.events.canceled.getValue()) {
        return false;
      }
      var upDocsById = nonPersistedFromMaster.docs;
      nonPersistedFromMaster.docs = {};
      var useCheckpoint = nonPersistedFromMaster.checkpoint;
      var docIds = Object.keys(upDocsById);
      function rememberCheckpointBeforeReturn() {
        return setCheckpoint(state, "up", useCheckpoint);
      }
      ;
      if (docIds.length === 0) {
        rememberCheckpointBeforeReturn();
        return false;
      }
      var assumedMasterState = await getAssumedMasterState(state, docIds);
      var writeRowsToMaster = {};
      var writeRowsToMasterIds = [];
      var writeRowsToMeta = {};
      var forkStateById = {};
      await Promise.all(docIds.map(async (docId) => {
        var fullDocData = upDocsById[docId];
        forkStateById[docId] = fullDocData;
        var docData = writeDocToDocState(fullDocData, state.hasAttachments, !!state.input.keepMeta);
        var assumedMasterDoc = assumedMasterState[docId];
        if (assumedMasterDoc && // if the isResolvedConflict is correct, we do not have to compare the documents.
        assumedMasterDoc.metaDocument.isResolvedConflict !== fullDocData._rev && state.input.conflictHandler.isEqual(assumedMasterDoc.docData, docData, "upstream-check-if-equal") || /**
         * If the master works with _rev fields,
         * we use that to check if our current doc state
         * is different from the assumedMasterDoc.
         */
        assumedMasterDoc && assumedMasterDoc.docData._rev && getHeightOfRevision(fullDocData._rev) === fullDocData._meta[state.input.identifier]) {
          return;
        }
        writeRowsToMasterIds.push(docId);
        writeRowsToMaster[docId] = {
          assumedMasterState: assumedMasterDoc ? assumedMasterDoc.docData : void 0,
          newDocumentState: docData
        };
        writeRowsToMeta[docId] = await getMetaWriteRow(state, docData, assumedMasterDoc ? assumedMasterDoc.metaDocument : void 0);
      }));
      if (writeRowsToMasterIds.length === 0) {
        rememberCheckpointBeforeReturn();
        return false;
      }
      var writeRowsArray = Object.values(writeRowsToMaster);
      var conflictIds = /* @__PURE__ */ new Set();
      var conflictsById = {};
      var writeBatches = batchArray(writeRowsArray, state.input.pushBatchSize);
      await Promise.all(writeBatches.map(async (writeBatch) => {
        if (state.hasAttachments) {
          await Promise.all(writeBatch.map(async (row) => {
            row.newDocumentState = await fillWriteDataForAttachmentsChange(state.primaryPath, state.input.forkInstance, clone(row.newDocumentState), row.assumedMasterState);
          }));
        }
        var masterWriteResult = await replicationHandler.masterWrite(writeBatch);
        masterWriteResult.forEach((conflictDoc) => {
          var id = conflictDoc[state.primaryPath];
          conflictIds.add(id);
          conflictsById[id] = conflictDoc;
        });
      }));
      var useWriteRowsToMeta = [];
      writeRowsToMasterIds.forEach((docId) => {
        if (!conflictIds.has(docId)) {
          state.events.processed.up.next(writeRowsToMaster[docId]);
          useWriteRowsToMeta.push(writeRowsToMeta[docId]);
        }
      });
      if (state.events.canceled.getValue()) {
        return false;
      }
      if (useWriteRowsToMeta.length > 0) {
        await state.input.metaInstance.bulkWrite(stripAttachmentsDataFromMetaWriteRows(state, useWriteRowsToMeta), "replication-up-write-meta");
      }
      var hadConflictWrites = false;
      if (conflictIds.size > 0) {
        state.stats.up.persistToMasterHadConflicts = state.stats.up.persistToMasterHadConflicts + 1;
        var conflictWriteFork = [];
        var conflictWriteMeta = {};
        await Promise.all(Object.entries(conflictsById).map(([docId, realMasterState]) => {
          var writeToMasterRow = writeRowsToMaster[docId];
          var input = {
            newDocumentState: writeToMasterRow.newDocumentState,
            assumedMasterState: writeToMasterRow.assumedMasterState,
            realMasterState
          };
          return resolveConflictError(state, input, forkStateById[docId]).then(async (resolved) => {
            if (resolved) {
              state.events.resolvedConflicts.next({
                input,
                output: resolved
              });
              conflictWriteFork.push({
                previous: forkStateById[docId],
                document: resolved
              });
              var assumedMasterDoc = assumedMasterState[docId];
              conflictWriteMeta[docId] = await getMetaWriteRow(state, ensureNotFalsy(realMasterState), assumedMasterDoc ? assumedMasterDoc.metaDocument : void 0, resolved._rev);
            }
          });
        }));
        if (conflictWriteFork.length > 0) {
          hadConflictWrites = true;
          state.stats.up.persistToMasterConflictWrites = state.stats.up.persistToMasterConflictWrites + 1;
          var forkWriteResult = await state.input.forkInstance.bulkWrite(conflictWriteFork, "replication-up-write-conflict");
          var mustThrow;
          forkWriteResult.error.forEach((error) => {
            if (error.status === 409) {
              return;
            }
            var throwMe = newRxError("RC_PUSH", {
              writeError: error
            });
            state.events.error.next(throwMe);
            mustThrow = throwMe;
          });
          if (mustThrow) {
            throw mustThrow;
          }
          var useMetaWrites = [];
          var success = getWrittenDocumentsFromBulkWriteResponse(state.primaryPath, conflictWriteFork, forkWriteResult);
          success.forEach((docData) => {
            var docId = docData[state.primaryPath];
            useMetaWrites.push(conflictWriteMeta[docId]);
          });
          if (useMetaWrites.length > 0) {
            await state.input.metaInstance.bulkWrite(stripAttachmentsDataFromMetaWriteRows(state, useMetaWrites), "replication-up-write-conflict-meta");
          }
        }
      }
      rememberCheckpointBeforeReturn();
      return hadConflictWrites;
    }).catch((unhandledError) => {
      state.events.error.next(unhandledError);
      return false;
    });
    return persistenceQueue;
  }
}

// node_modules/rxdb/dist/esm/replication-protocol/index.js
function replicateRxStorageInstance(input) {
  input = flatClone(input);
  input.forkInstance = getUnderlyingPersistentStorage(input.forkInstance);
  input.metaInstance = getUnderlyingPersistentStorage(input.metaInstance);
  var checkpointKeyPromise = getCheckpointKey(input);
  var state = {
    primaryPath: getPrimaryFieldOfPrimaryKey(input.forkInstance.schema.primaryKey),
    hasAttachments: !!input.forkInstance.schema.attachments,
    input,
    checkpointKey: checkpointKeyPromise,
    downstreamBulkWriteFlag: checkpointKeyPromise.then((checkpointKey) => "replication-downstream-" + checkpointKey),
    events: {
      canceled: new BehaviorSubject(false),
      paused: new BehaviorSubject(false),
      active: {
        down: new BehaviorSubject(true),
        up: new BehaviorSubject(true)
      },
      processed: {
        down: new Subject(),
        up: new Subject()
      },
      resolvedConflicts: new Subject(),
      error: new Subject()
    },
    stats: {
      down: {
        addNewTask: 0,
        downstreamProcessChanges: 0,
        downstreamResyncOnce: 0,
        masterChangeStreamEmit: 0,
        persistFromMaster: 0
      },
      up: {
        forkChangeStreamEmit: 0,
        persistToMaster: 0,
        persistToMasterConflictWrites: 0,
        persistToMasterHadConflicts: 0,
        processTasks: 0,
        upstreamInitialSync: 0
      }
    },
    firstSyncDone: {
      down: new BehaviorSubject(false),
      up: new BehaviorSubject(false)
    },
    streamQueue: {
      down: PROMISE_RESOLVE_VOID,
      up: PROMISE_RESOLVE_VOID
    },
    checkpointQueue: PROMISE_RESOLVE_VOID,
    lastCheckpointDoc: {}
  };
  startReplicationDownstream(state);
  startReplicationUpstream(state);
  return state;
}
function awaitRxStorageReplicationFirstInSync(state) {
  return firstValueFrom(combineLatest([state.firstSyncDone.down.pipe(filter((v) => !!v)), state.firstSyncDone.up.pipe(filter((v) => !!v))])).then(() => {
  });
}
function awaitRxStorageReplicationInSync(replicationState) {
  return Promise.all([replicationState.streamQueue.up, replicationState.streamQueue.down, replicationState.checkpointQueue]);
}
function rxStorageInstanceToReplicationHandler(instance, conflictHandler, databaseInstanceToken, keepMeta = false) {
  instance = getUnderlyingPersistentStorage(instance);
  var hasAttachments = !!instance.schema.attachments;
  var primaryPath = getPrimaryFieldOfPrimaryKey(instance.schema.primaryKey);
  var replicationHandler = {
    masterChangeStream$: instance.changeStream().pipe(mergeMap(async (eventBulk) => {
      var ret = {
        checkpoint: eventBulk.checkpoint,
        documents: await Promise.all(eventBulk.events.map(async (event) => {
          var docData = writeDocToDocState(event.documentData, hasAttachments, keepMeta);
          if (hasAttachments) {
            docData = await fillWriteDataForAttachmentsChange(
              primaryPath,
              instance,
              clone(docData),
              /**
               * Notice that the master never knows
               * the client state of the document.
               * Therefore we always send all attachments data.
               */
              void 0
            );
          }
          return docData;
        }))
      };
      return ret;
    })),
    masterChangesSince(checkpoint, batchSize) {
      return getChangedDocumentsSince(instance, batchSize, checkpoint).then(async (result) => {
        return {
          checkpoint: result.documents.length > 0 ? result.checkpoint : checkpoint,
          documents: await Promise.all(result.documents.map(async (plainDocumentData) => {
            var docData = writeDocToDocState(plainDocumentData, hasAttachments, keepMeta);
            if (hasAttachments) {
              docData = await fillWriteDataForAttachmentsChange(
                primaryPath,
                instance,
                clone(docData),
                /**
                 * Notice the the master never knows
                 * the client state of the document.
                 * Therefore we always send all attachments data.
                 */
                void 0
              );
            }
            return docData;
          }))
        };
      });
    },
    async masterWrite(rows) {
      var rowById = {};
      rows.forEach((row) => {
        var docId = row.newDocumentState[primaryPath];
        rowById[docId] = row;
      });
      var ids = Object.keys(rowById);
      var masterDocsStateList = await instance.findDocumentsById(ids, true);
      var masterDocsState = /* @__PURE__ */ new Map();
      masterDocsStateList.forEach((doc) => masterDocsState.set(doc[primaryPath], doc));
      var conflicts = [];
      var writeRows = [];
      await Promise.all(Object.entries(rowById).map(([id, row]) => {
        var masterState = masterDocsState.get(id);
        if (!masterState) {
          writeRows.push({
            document: docStateToWriteDoc(databaseInstanceToken, hasAttachments, keepMeta, row.newDocumentState)
          });
        } else if (masterState && !row.assumedMasterState) {
          conflicts.push(writeDocToDocState(masterState, hasAttachments, keepMeta));
        } else if (conflictHandler.isEqual(writeDocToDocState(masterState, hasAttachments, keepMeta), ensureNotFalsy(row.assumedMasterState), "rxStorageInstanceToReplicationHandler-masterWrite") === true) {
          writeRows.push({
            previous: masterState,
            document: docStateToWriteDoc(databaseInstanceToken, hasAttachments, keepMeta, row.newDocumentState, masterState)
          });
        } else {
          conflicts.push(writeDocToDocState(masterState, hasAttachments, keepMeta));
        }
      }));
      if (writeRows.length > 0) {
        var result = await instance.bulkWrite(writeRows, "replication-master-write");
        result.error.forEach((err) => {
          if (err.status !== 409) {
            throw newRxError("SNH", {
              name: "non conflict error",
              error: err
            });
          } else {
            conflicts.push(writeDocToDocState(ensureNotFalsy(err.documentInDb), hasAttachments, keepMeta));
          }
        });
      }
      return conflicts;
    }
  };
  return replicationHandler;
}
async function cancelRxStorageReplication(replicationState) {
  replicationState.events.canceled.next(true);
  replicationState.events.active.up.complete();
  replicationState.events.active.down.complete();
  replicationState.events.processed.up.complete();
  replicationState.events.processed.down.complete();
  replicationState.events.resolvedConflicts.complete();
  replicationState.events.canceled.complete();
  await replicationState.checkpointQueue;
}

// node_modules/broadcast-channel/dist/esbrowser/util.js
function isPromise2(obj) {
  return obj && typeof obj.then === "function";
}
var PROMISE_RESOLVED_FALSE = Promise.resolve(false);
var PROMISE_RESOLVED_TRUE = Promise.resolve(true);
var PROMISE_RESOLVED_VOID = Promise.resolve();
function sleep(time, resolveWith) {
  if (!time) time = 0;
  return new Promise(function(res) {
    return setTimeout(function() {
      return res(resolveWith);
    }, time);
  });
}
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function randomToken2() {
  return Math.random().toString(36).substring(2);
}
var lastMs = 0;
function microSeconds() {
  var ret = Date.now() * 1e3;
  if (ret <= lastMs) {
    ret = lastMs + 1;
  }
  lastMs = ret;
  return ret;
}
function supportsWebLockAPI() {
  if (typeof navigator !== "undefined" && typeof navigator.locks !== "undefined" && typeof navigator.locks.request === "function") {
    return true;
  } else {
    return false;
  }
}

// node_modules/broadcast-channel/dist/esbrowser/methods/native.js
var microSeconds2 = microSeconds;
var type = "native";
function create(channelName) {
  var state = {
    time: microSeconds(),
    messagesCallback: null,
    bc: new BroadcastChannel(channelName),
    subFns: []
    // subscriberFunctions
  };
  state.bc.onmessage = function(msgEvent) {
    if (state.messagesCallback) {
      state.messagesCallback(msgEvent.data);
    }
  };
  return state;
}
function close(channelState) {
  channelState.bc.close();
  channelState.subFns = [];
}
function postMessage(channelState, messageJson) {
  try {
    channelState.bc.postMessage(messageJson, false);
    return PROMISE_RESOLVED_VOID;
  } catch (err) {
    return Promise.reject(err);
  }
}
function onMessage(channelState, fn) {
  channelState.messagesCallback = fn;
}
function canBeUsed() {
  if (typeof globalThis !== "undefined" && globalThis.Deno && globalThis.Deno.args) {
    return true;
  }
  if ((typeof window !== "undefined" || typeof self !== "undefined") && typeof BroadcastChannel === "function") {
    if (BroadcastChannel._pubkey) {
      throw new Error("BroadcastChannel: Do not overwrite window.BroadcastChannel with this module, this is not a polyfill");
    }
    return true;
  } else {
    return false;
  }
}
function averageResponseTime() {
  return 150;
}
var NativeMethod = {
  create,
  close,
  onMessage,
  postMessage,
  canBeUsed,
  type,
  averageResponseTime,
  microSeconds: microSeconds2
};

// node_modules/broadcast-channel/dist/esbrowser/options.js
function fillOptionsWithDefaults() {
  var originalOptions = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  var options = JSON.parse(JSON.stringify(originalOptions));
  if (typeof options.webWorkerSupport === "undefined") options.webWorkerSupport = true;
  if (!options.idb) options.idb = {};
  if (!options.idb.ttl) options.idb.ttl = 1e3 * 45;
  if (!options.idb.fallbackInterval) options.idb.fallbackInterval = 150;
  if (originalOptions.idb && typeof originalOptions.idb.onclose === "function") options.idb.onclose = originalOptions.idb.onclose;
  if (!options.localstorage) options.localstorage = {};
  if (!options.localstorage.removeTimeout) options.localstorage.removeTimeout = 1e3 * 60;
  if (originalOptions.methods) options.methods = originalOptions.methods;
  if (!options.node) options.node = {};
  if (!options.node.ttl) options.node.ttl = 1e3 * 60 * 2;
  if (!options.node.maxParallelWrites) options.node.maxParallelWrites = 2048;
  if (typeof options.node.useFastPath === "undefined") options.node.useFastPath = true;
  return options;
}

// node_modules/broadcast-channel/dist/esbrowser/methods/indexed-db.js
var microSeconds3 = microSeconds;
var DB_PREFIX = "pubkey.broadcast-channel-0-";
var OBJECT_STORE_ID = "messages";
var TRANSACTION_SETTINGS = {
  durability: "relaxed"
};
var type2 = "idb";
function getIdb() {
  if (typeof indexedDB !== "undefined") return indexedDB;
  if (typeof window !== "undefined") {
    if (typeof window.mozIndexedDB !== "undefined") return window.mozIndexedDB;
    if (typeof window.webkitIndexedDB !== "undefined") return window.webkitIndexedDB;
    if (typeof window.msIndexedDB !== "undefined") return window.msIndexedDB;
  }
  return false;
}
function commitIndexedDBTransaction(tx) {
  if (tx.commit) {
    tx.commit();
  }
}
function createDatabase(channelName) {
  var IndexedDB = getIdb();
  var dbName = DB_PREFIX + channelName;
  var openRequest = IndexedDB.open(dbName);
  openRequest.onupgradeneeded = function(ev) {
    var db = ev.target.result;
    db.createObjectStore(OBJECT_STORE_ID, {
      keyPath: "id",
      autoIncrement: true
    });
  };
  return new Promise(function(res, rej) {
    openRequest.onerror = function(ev) {
      return rej(ev);
    };
    openRequest.onsuccess = function() {
      res(openRequest.result);
    };
  });
}
function writeMessage(db, readerUuid, messageJson) {
  var time = Date.now();
  var writeObject = {
    uuid: readerUuid,
    time,
    data: messageJson
  };
  var tx = db.transaction([OBJECT_STORE_ID], "readwrite", TRANSACTION_SETTINGS);
  return new Promise(function(res, rej) {
    tx.oncomplete = function() {
      return res();
    };
    tx.onerror = function(ev) {
      return rej(ev);
    };
    var objectStore = tx.objectStore(OBJECT_STORE_ID);
    objectStore.add(writeObject);
    commitIndexedDBTransaction(tx);
  });
}
function getMessagesHigherThan(db, lastCursorId) {
  var tx = db.transaction(OBJECT_STORE_ID, "readonly", TRANSACTION_SETTINGS);
  var objectStore = tx.objectStore(OBJECT_STORE_ID);
  var ret = [];
  var keyRangeValue = IDBKeyRange.bound(lastCursorId + 1, Infinity);
  if (objectStore.getAll) {
    var getAllRequest = objectStore.getAll(keyRangeValue);
    return new Promise(function(res, rej) {
      getAllRequest.onerror = function(err) {
        return rej(err);
      };
      getAllRequest.onsuccess = function(e) {
        res(e.target.result);
      };
    });
  }
  function openCursor() {
    try {
      keyRangeValue = IDBKeyRange.bound(lastCursorId + 1, Infinity);
      return objectStore.openCursor(keyRangeValue);
    } catch (e) {
      return objectStore.openCursor();
    }
  }
  return new Promise(function(res, rej) {
    var openCursorRequest = openCursor();
    openCursorRequest.onerror = function(err) {
      return rej(err);
    };
    openCursorRequest.onsuccess = function(ev) {
      var cursor = ev.target.result;
      if (cursor) {
        if (cursor.value.id < lastCursorId + 1) {
          cursor["continue"](lastCursorId + 1);
        } else {
          ret.push(cursor.value);
          cursor["continue"]();
        }
      } else {
        commitIndexedDBTransaction(tx);
        res(ret);
      }
    };
  });
}
function removeMessagesById(channelState, ids) {
  if (channelState.closed) {
    return Promise.resolve([]);
  }
  var tx = channelState.db.transaction(OBJECT_STORE_ID, "readwrite", TRANSACTION_SETTINGS);
  var objectStore = tx.objectStore(OBJECT_STORE_ID);
  return Promise.all(ids.map(function(id) {
    var deleteRequest = objectStore["delete"](id);
    return new Promise(function(res) {
      deleteRequest.onsuccess = function() {
        return res();
      };
    });
  }));
}
function getOldMessages(db, ttl) {
  var olderThen = Date.now() - ttl;
  var tx = db.transaction(OBJECT_STORE_ID, "readonly", TRANSACTION_SETTINGS);
  var objectStore = tx.objectStore(OBJECT_STORE_ID);
  var ret = [];
  return new Promise(function(res) {
    objectStore.openCursor().onsuccess = function(ev) {
      var cursor = ev.target.result;
      if (cursor) {
        var msgObk = cursor.value;
        if (msgObk.time < olderThen) {
          ret.push(msgObk);
          cursor["continue"]();
        } else {
          commitIndexedDBTransaction(tx);
          res(ret);
        }
      } else {
        res(ret);
      }
    };
  });
}
function cleanOldMessages(channelState) {
  return getOldMessages(channelState.db, channelState.options.idb.ttl).then(function(tooOld) {
    return removeMessagesById(channelState, tooOld.map(function(msg) {
      return msg.id;
    }));
  });
}
function create2(channelName, options) {
  options = fillOptionsWithDefaults(options);
  return createDatabase(channelName).then(function(db) {
    var state = {
      closed: false,
      lastCursorId: 0,
      channelName,
      options,
      uuid: randomToken2(),
      /**
       * emittedMessagesIds
       * contains all messages that have been emitted before
       * @type {ObliviousSet}
       */
      eMIs: new ObliviousSet(options.idb.ttl * 2),
      // ensures we do not read messages in parallel
      writeBlockPromise: PROMISE_RESOLVED_VOID,
      messagesCallback: null,
      readQueuePromises: [],
      db
    };
    db.onclose = function() {
      state.closed = true;
      if (options.idb.onclose) options.idb.onclose();
    };
    _readLoop(state);
    return state;
  });
}
function _readLoop(state) {
  if (state.closed) return;
  readNewMessages(state).then(function() {
    return sleep(state.options.idb.fallbackInterval);
  }).then(function() {
    return _readLoop(state);
  });
}
function _filterMessage(msgObj, state) {
  if (msgObj.uuid === state.uuid) return false;
  if (state.eMIs.has(msgObj.id)) return false;
  if (msgObj.data.time < state.messagesCallbackTime) return false;
  return true;
}
function readNewMessages(state) {
  if (state.closed) return PROMISE_RESOLVED_VOID;
  if (!state.messagesCallback) return PROMISE_RESOLVED_VOID;
  return getMessagesHigherThan(state.db, state.lastCursorId).then(function(newerMessages) {
    var useMessages = newerMessages.filter(function(msgObj) {
      return !!msgObj;
    }).map(function(msgObj) {
      if (msgObj.id > state.lastCursorId) {
        state.lastCursorId = msgObj.id;
      }
      return msgObj;
    }).filter(function(msgObj) {
      return _filterMessage(msgObj, state);
    }).sort(function(msgObjA, msgObjB) {
      return msgObjA.time - msgObjB.time;
    });
    useMessages.forEach(function(msgObj) {
      if (state.messagesCallback) {
        state.eMIs.add(msgObj.id);
        state.messagesCallback(msgObj.data);
      }
    });
    return PROMISE_RESOLVED_VOID;
  });
}
function close2(channelState) {
  channelState.closed = true;
  channelState.db.close();
}
function postMessage2(channelState, messageJson) {
  channelState.writeBlockPromise = channelState.writeBlockPromise.then(function() {
    return writeMessage(channelState.db, channelState.uuid, messageJson);
  }).then(function() {
    if (randomInt(0, 10) === 0) {
      cleanOldMessages(channelState);
    }
  });
  return channelState.writeBlockPromise;
}
function onMessage2(channelState, fn, time) {
  channelState.messagesCallbackTime = time;
  channelState.messagesCallback = fn;
  readNewMessages(channelState);
}
function canBeUsed2() {
  return !!getIdb();
}
function averageResponseTime2(options) {
  return options.idb.fallbackInterval * 2;
}
var IndexedDBMethod = {
  create: create2,
  close: close2,
  onMessage: onMessage2,
  postMessage: postMessage2,
  canBeUsed: canBeUsed2,
  type: type2,
  averageResponseTime: averageResponseTime2,
  microSeconds: microSeconds3
};

// node_modules/broadcast-channel/dist/esbrowser/methods/localstorage.js
var microSeconds4 = microSeconds;
var KEY_PREFIX = "pubkey.broadcastChannel-";
var type3 = "localstorage";
function getLocalStorage() {
  var localStorage2;
  if (typeof window === "undefined") return null;
  try {
    localStorage2 = window.localStorage;
    localStorage2 = window["ie8-eventlistener/storage"] || window.localStorage;
  } catch (e) {
  }
  return localStorage2;
}
function storageKey(channelName) {
  return KEY_PREFIX + channelName;
}
function postMessage3(channelState, messageJson) {
  return new Promise(function(res) {
    sleep().then(function() {
      var key = storageKey(channelState.channelName);
      var writeObj = {
        token: randomToken2(),
        time: Date.now(),
        data: messageJson,
        uuid: channelState.uuid
      };
      var value = JSON.stringify(writeObj);
      getLocalStorage().setItem(key, value);
      var ev = document.createEvent("Event");
      ev.initEvent("storage", true, true);
      ev.key = key;
      ev.newValue = value;
      window.dispatchEvent(ev);
      res();
    });
  });
}
function addStorageEventListener(channelName, fn) {
  var key = storageKey(channelName);
  var listener = function listener2(ev) {
    if (ev.key === key) {
      fn(JSON.parse(ev.newValue));
    }
  };
  window.addEventListener("storage", listener);
  return listener;
}
function removeStorageEventListener(listener) {
  window.removeEventListener("storage", listener);
}
function create3(channelName, options) {
  options = fillOptionsWithDefaults(options);
  if (!canBeUsed3()) {
    throw new Error("BroadcastChannel: localstorage cannot be used");
  }
  var uuid = randomToken2();
  var eMIs = new ObliviousSet(options.localstorage.removeTimeout);
  var state = {
    channelName,
    uuid,
    eMIs
    // emittedMessagesIds
  };
  state.listener = addStorageEventListener(channelName, function(msgObj) {
    if (!state.messagesCallback) return;
    if (msgObj.uuid === uuid) return;
    if (!msgObj.token || eMIs.has(msgObj.token)) return;
    if (msgObj.data.time && msgObj.data.time < state.messagesCallbackTime) return;
    eMIs.add(msgObj.token);
    state.messagesCallback(msgObj.data);
  });
  return state;
}
function close3(channelState) {
  removeStorageEventListener(channelState.listener);
}
function onMessage3(channelState, fn, time) {
  channelState.messagesCallbackTime = time;
  channelState.messagesCallback = fn;
}
function canBeUsed3() {
  var ls = getLocalStorage();
  if (!ls) return false;
  try {
    var key = "__broadcastchannel_check";
    ls.setItem(key, "works");
    ls.removeItem(key);
  } catch (e) {
    return false;
  }
  return true;
}
function averageResponseTime3() {
  var defaultTime = 120;
  var userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes("safari") && !userAgent.includes("chrome")) {
    return defaultTime * 2;
  }
  return defaultTime;
}
var LocalstorageMethod = {
  create: create3,
  close: close3,
  onMessage: onMessage3,
  postMessage: postMessage3,
  canBeUsed: canBeUsed3,
  type: type3,
  averageResponseTime: averageResponseTime3,
  microSeconds: microSeconds4
};

// node_modules/broadcast-channel/dist/esbrowser/methods/simulate.js
var microSeconds5 = microSeconds;
var type4 = "simulate";
var SIMULATE_CHANNELS = /* @__PURE__ */ new Set();
function create4(channelName) {
  var state = {
    time: microSeconds5(),
    name: channelName,
    messagesCallback: null
  };
  SIMULATE_CHANNELS.add(state);
  return state;
}
function close4(channelState) {
  SIMULATE_CHANNELS["delete"](channelState);
}
var SIMULATE_DELAY_TIME = 5;
function postMessage4(channelState, messageJson) {
  return new Promise(function(res) {
    return setTimeout(function() {
      var channelArray = Array.from(SIMULATE_CHANNELS);
      channelArray.forEach(function(channel) {
        if (channel.name === channelState.name && // has same name
        channel !== channelState && // not own channel
        !!channel.messagesCallback && // has subscribers
        channel.time < messageJson.time) {
          channel.messagesCallback(messageJson);
        }
      });
      res();
    }, SIMULATE_DELAY_TIME);
  });
}
function onMessage4(channelState, fn) {
  channelState.messagesCallback = fn;
}
function canBeUsed4() {
  return true;
}
function averageResponseTime4() {
  return SIMULATE_DELAY_TIME;
}
var SimulateMethod = {
  create: create4,
  close: close4,
  onMessage: onMessage4,
  postMessage: postMessage4,
  canBeUsed: canBeUsed4,
  type: type4,
  averageResponseTime: averageResponseTime4,
  microSeconds: microSeconds5
};

// node_modules/broadcast-channel/dist/esbrowser/method-chooser.js
var METHODS = [
  NativeMethod,
  // fastest
  IndexedDBMethod,
  LocalstorageMethod
];
function chooseMethod(options) {
  var chooseMethods = [].concat(options.methods, METHODS).filter(Boolean);
  if (options.type) {
    if (options.type === "simulate") {
      return SimulateMethod;
    }
    var ret = chooseMethods.find(function(m) {
      return m.type === options.type;
    });
    if (!ret) throw new Error("method-type " + options.type + " not found");
    else return ret;
  }
  if (!options.webWorkerSupport) {
    chooseMethods = chooseMethods.filter(function(m) {
      return m.type !== "idb";
    });
  }
  var useMethod = chooseMethods.find(function(method) {
    return method.canBeUsed();
  });
  if (!useMethod) {
    throw new Error("No usable method found in " + JSON.stringify(METHODS.map(function(m) {
      return m.type;
    })));
  } else {
    return useMethod;
  }
}

// node_modules/broadcast-channel/dist/esbrowser/broadcast-channel.js
var OPEN_BROADCAST_CHANNELS = /* @__PURE__ */ new Set();
var lastId = 0;
var BroadcastChannel2 = function BroadcastChannel3(name, options) {
  this.id = lastId++;
  OPEN_BROADCAST_CHANNELS.add(this);
  this.name = name;
  if (ENFORCED_OPTIONS) {
    options = ENFORCED_OPTIONS;
  }
  this.options = fillOptionsWithDefaults(options);
  this.method = chooseMethod(this.options);
  this._iL = false;
  this._onML = null;
  this._addEL = {
    message: [],
    internal: []
  };
  this._uMP = /* @__PURE__ */ new Set();
  this._befC = [];
  this._prepP = null;
  _prepareChannel(this);
};
BroadcastChannel2._pubkey = true;
var ENFORCED_OPTIONS;
BroadcastChannel2.prototype = {
  postMessage: function postMessage5(msg) {
    if (this.closed) {
      throw new Error("BroadcastChannel.postMessage(): Cannot post message after channel has closed " + /**
       * In the past when this error appeared, it was really hard to debug.
       * So now we log the msg together with the error so it at least
       * gives some clue about where in your application this happens.
       */
      JSON.stringify(msg));
    }
    return _post(this, "message", msg);
  },
  postInternal: function postInternal(msg) {
    return _post(this, "internal", msg);
  },
  set onmessage(fn) {
    var time = this.method.microSeconds();
    var listenObj = {
      time,
      fn
    };
    _removeListenerObject(this, "message", this._onML);
    if (fn && typeof fn === "function") {
      this._onML = listenObj;
      _addListenerObject(this, "message", listenObj);
    } else {
      this._onML = null;
    }
  },
  addEventListener: function addEventListener2(type5, fn) {
    var time = this.method.microSeconds();
    var listenObj = {
      time,
      fn
    };
    _addListenerObject(this, type5, listenObj);
  },
  removeEventListener: function removeEventListener(type5, fn) {
    var obj = this._addEL[type5].find(function(obj2) {
      return obj2.fn === fn;
    });
    _removeListenerObject(this, type5, obj);
  },
  close: function close5() {
    var _this = this;
    if (this.closed) {
      return;
    }
    OPEN_BROADCAST_CHANNELS["delete"](this);
    this.closed = true;
    var awaitPrepare = this._prepP ? this._prepP : PROMISE_RESOLVED_VOID;
    this._onML = null;
    this._addEL.message = [];
    return awaitPrepare.then(function() {
      return Promise.all(Array.from(_this._uMP));
    }).then(function() {
      return Promise.all(_this._befC.map(function(fn) {
        return fn();
      }));
    }).then(function() {
      return _this.method.close(_this._state);
    });
  },
  get type() {
    return this.method.type;
  },
  get isClosed() {
    return this.closed;
  }
};
function _post(broadcastChannel, type5, msg) {
  var time = broadcastChannel.method.microSeconds();
  var msgObj = {
    time,
    type: type5,
    data: msg
  };
  var awaitPrepare = broadcastChannel._prepP ? broadcastChannel._prepP : PROMISE_RESOLVED_VOID;
  return awaitPrepare.then(function() {
    var sendPromise = broadcastChannel.method.postMessage(broadcastChannel._state, msgObj);
    broadcastChannel._uMP.add(sendPromise);
    sendPromise["catch"]().then(function() {
      return broadcastChannel._uMP["delete"](sendPromise);
    });
    return sendPromise;
  });
}
function _prepareChannel(channel) {
  var maybePromise = channel.method.create(channel.name, channel.options);
  if (isPromise2(maybePromise)) {
    channel._prepP = maybePromise;
    maybePromise.then(function(s) {
      channel._state = s;
    });
  } else {
    channel._state = maybePromise;
  }
}
function _hasMessageListeners(channel) {
  if (channel._addEL.message.length > 0) return true;
  if (channel._addEL.internal.length > 0) return true;
  return false;
}
function _addListenerObject(channel, type5, obj) {
  channel._addEL[type5].push(obj);
  _startListening(channel);
}
function _removeListenerObject(channel, type5, obj) {
  channel._addEL[type5] = channel._addEL[type5].filter(function(o) {
    return o !== obj;
  });
  _stopListening(channel);
}
function _startListening(channel) {
  if (!channel._iL && _hasMessageListeners(channel)) {
    var listenerFn = function listenerFn2(msgObj) {
      channel._addEL[msgObj.type].forEach(function(listenerObject) {
        if (msgObj.time >= listenerObject.time) {
          listenerObject.fn(msgObj.data);
        }
      });
    };
    var time = channel.method.microSeconds();
    if (channel._prepP) {
      channel._prepP.then(function() {
        channel._iL = true;
        channel.method.onMessage(channel._state, listenerFn, time);
      });
    } else {
      channel._iL = true;
      channel.method.onMessage(channel._state, listenerFn, time);
    }
  }
}
function _stopListening(channel) {
  if (channel._iL && !_hasMessageListeners(channel)) {
    channel._iL = false;
    var time = channel.method.microSeconds();
    channel.method.onMessage(channel._state, null, time);
  }
}

// node_modules/unload/dist/es/browser.js
function addBrowser(fn) {
  if (typeof WorkerGlobalScope === "function" && self instanceof WorkerGlobalScope) {
    var oldClose = self.close.bind(self);
    self.close = function() {
      fn();
      return oldClose();
    };
  } else {
    if (typeof window.addEventListener !== "function") {
      return;
    }
    window.addEventListener("beforeunload", function() {
      fn();
    }, true);
    window.addEventListener("unload", function() {
      fn();
    }, true);
  }
}

// node_modules/unload/dist/es/node.js
function addNode(fn) {
  process.on("exit", function() {
    return fn();
  });
  process.on("beforeExit", function() {
    return fn().then(function() {
      return process.exit();
    });
  });
  process.on("SIGINT", function() {
    return fn().then(function() {
      return process.exit();
    });
  });
  process.on("uncaughtException", function(err) {
    return fn().then(function() {
      console.trace(err);
      process.exit(101);
    });
  });
}

// node_modules/unload/dist/es/index.js
var isNode = Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) === "[object process]";
var USE_METHOD = isNode ? addNode : addBrowser;
var LISTENERS = /* @__PURE__ */ new Set();
var startedListening = false;
function startListening() {
  if (startedListening) {
    return;
  }
  startedListening = true;
  USE_METHOD(runAll);
}
function add(fn) {
  startListening();
  if (typeof fn !== "function") {
    throw new Error("Listener is no function");
  }
  LISTENERS.add(fn);
  var addReturn = {
    remove: function remove2() {
      return LISTENERS["delete"](fn);
    },
    run: function run() {
      LISTENERS["delete"](fn);
      return fn();
    }
  };
  return addReturn;
}
function runAll() {
  var promises = [];
  LISTENERS.forEach(function(fn) {
    promises.push(fn());
    LISTENERS["delete"](fn);
  });
  return Promise.all(promises);
}

// node_modules/broadcast-channel/dist/esbrowser/leader-election-util.js
function sendLeaderMessage(leaderElector, action) {
  var msgJson = {
    context: "leader",
    action,
    token: leaderElector.token
  };
  return leaderElector.broadcastChannel.postInternal(msgJson);
}
function beLeader(leaderElector) {
  leaderElector.isLeader = true;
  leaderElector._hasLeader = true;
  var unloadFn = add(function() {
    return leaderElector.die();
  });
  leaderElector._unl.push(unloadFn);
  var isLeaderListener = function isLeaderListener2(msg) {
    if (msg.context === "leader" && msg.action === "apply") {
      sendLeaderMessage(leaderElector, "tell");
    }
    if (msg.context === "leader" && msg.action === "tell" && !leaderElector._dpLC) {
      leaderElector._dpLC = true;
      leaderElector._dpL();
      sendLeaderMessage(leaderElector, "tell");
    }
  };
  leaderElector.broadcastChannel.addEventListener("internal", isLeaderListener);
  leaderElector._lstns.push(isLeaderListener);
  return sendLeaderMessage(leaderElector, "tell");
}

// node_modules/broadcast-channel/dist/esbrowser/leader-election-web-lock.js
var LeaderElectionWebLock = function LeaderElectionWebLock2(broadcastChannel, options) {
  var _this = this;
  this.broadcastChannel = broadcastChannel;
  broadcastChannel._befC.push(function() {
    return _this.die();
  });
  this._options = options;
  this.isLeader = false;
  this.isDead = false;
  this.token = randomToken2();
  this._lstns = [];
  this._unl = [];
  this._dpL = function() {
  };
  this._dpLC = false;
  this._wKMC = {};
  this.lN = "pubkey-bc||" + broadcastChannel.method.type + "||" + broadcastChannel.name;
};
LeaderElectionWebLock.prototype = {
  hasLeader: function hasLeader() {
    var _this2 = this;
    return navigator.locks.query().then(function(locks) {
      var relevantLocks = locks.held ? locks.held.filter(function(lock2) {
        return lock2.name === _this2.lN;
      }) : [];
      if (relevantLocks && relevantLocks.length > 0) {
        return true;
      } else {
        return false;
      }
    });
  },
  awaitLeadership: function awaitLeadership() {
    var _this3 = this;
    if (!this._wLMP) {
      this._wKMC.c = new AbortController();
      var returnPromise = new Promise(function(res, rej) {
        _this3._wKMC.res = res;
        _this3._wKMC.rej = rej;
      });
      this._wLMP = new Promise(function(res) {
        navigator.locks.request(_this3.lN, {
          signal: _this3._wKMC.c.signal
        }, function() {
          _this3._wKMC.c = void 0;
          beLeader(_this3);
          res();
          return returnPromise;
        })["catch"](function() {
        });
      });
    }
    return this._wLMP;
  },
  set onduplicate(_fn) {
  },
  die: function die() {
    var _this4 = this;
    this._lstns.forEach(function(listener) {
      return _this4.broadcastChannel.removeEventListener("internal", listener);
    });
    this._lstns = [];
    this._unl.forEach(function(uFn) {
      return uFn.remove();
    });
    this._unl = [];
    if (this.isLeader) {
      this.isLeader = false;
    }
    this.isDead = true;
    if (this._wKMC.res) {
      this._wKMC.res();
    }
    if (this._wKMC.c) {
      this._wKMC.c.abort("LeaderElectionWebLock.die() called");
    }
    return sendLeaderMessage(this, "death");
  }
};

// node_modules/broadcast-channel/dist/esbrowser/leader-election.js
var LeaderElection = function LeaderElection2(broadcastChannel, options) {
  var _this = this;
  this.broadcastChannel = broadcastChannel;
  this._options = options;
  this.isLeader = false;
  this._hasLeader = false;
  this.isDead = false;
  this.token = randomToken2();
  this._aplQ = PROMISE_RESOLVED_VOID;
  this._aplQC = 0;
  this._unl = [];
  this._lstns = [];
  this._dpL = function() {
  };
  this._dpLC = false;
  var hasLeaderListener = function hasLeaderListener2(msg) {
    if (msg.context === "leader") {
      if (msg.action === "death") {
        _this._hasLeader = false;
      }
      if (msg.action === "tell") {
        _this._hasLeader = true;
      }
    }
  };
  this.broadcastChannel.addEventListener("internal", hasLeaderListener);
  this._lstns.push(hasLeaderListener);
};
LeaderElection.prototype = {
  hasLeader: function hasLeader2() {
    return Promise.resolve(this._hasLeader);
  },
  /**
   * Returns true if the instance is leader,
   * false if not.
   * @async
   */
  applyOnce: function applyOnce(isFromFallbackInterval) {
    var _this2 = this;
    if (this.isLeader) {
      return sleep(0, true);
    }
    if (this.isDead) {
      return sleep(0, false);
    }
    if (this._aplQC > 1) {
      return this._aplQ;
    }
    var applyRun = function applyRun2() {
      if (_this2.isLeader) {
        return PROMISE_RESOLVED_TRUE;
      }
      var stopCriteria = false;
      var stopCriteriaPromiseResolve;
      var stopCriteriaPromise = new Promise(function(res) {
        stopCriteriaPromiseResolve = function stopCriteriaPromiseResolve2() {
          stopCriteria = true;
          res();
        };
      });
      var handleMessage = function handleMessage2(msg) {
        if (msg.context === "leader" && msg.token != _this2.token) {
          if (msg.action === "apply") {
            if (msg.token > _this2.token) {
              stopCriteriaPromiseResolve();
            }
          }
          if (msg.action === "tell") {
            stopCriteriaPromiseResolve();
            _this2._hasLeader = true;
          }
        }
      };
      _this2.broadcastChannel.addEventListener("internal", handleMessage);
      var waitForAnswerTime = isFromFallbackInterval ? _this2._options.responseTime * 4 : _this2._options.responseTime;
      return sendLeaderMessage(_this2, "apply").then(function() {
        return Promise.race([sleep(waitForAnswerTime), stopCriteriaPromise.then(function() {
          return Promise.reject(new Error());
        })]);
      }).then(function() {
        return sendLeaderMessage(_this2, "apply");
      }).then(function() {
        return Promise.race([sleep(waitForAnswerTime), stopCriteriaPromise.then(function() {
          return Promise.reject(new Error());
        })]);
      })["catch"](function() {
      }).then(function() {
        _this2.broadcastChannel.removeEventListener("internal", handleMessage);
        if (!stopCriteria) {
          return beLeader(_this2).then(function() {
            return true;
          });
        } else {
          return false;
        }
      });
    };
    this._aplQC = this._aplQC + 1;
    this._aplQ = this._aplQ.then(function() {
      return applyRun();
    }).then(function() {
      _this2._aplQC = _this2._aplQC - 1;
    });
    return this._aplQ.then(function() {
      return _this2.isLeader;
    });
  },
  awaitLeadership: function awaitLeadership2() {
    if (
      /* _awaitLeadershipPromise */
      !this._aLP
    ) {
      this._aLP = _awaitLeadershipOnce(this);
    }
    return this._aLP;
  },
  set onduplicate(fn) {
    this._dpL = fn;
  },
  die: function die2() {
    var _this3 = this;
    this._lstns.forEach(function(listener) {
      return _this3.broadcastChannel.removeEventListener("internal", listener);
    });
    this._lstns = [];
    this._unl.forEach(function(uFn) {
      return uFn.remove();
    });
    this._unl = [];
    if (this.isLeader) {
      this._hasLeader = false;
      this.isLeader = false;
    }
    this.isDead = true;
    return sendLeaderMessage(this, "death");
  }
};
function _awaitLeadershipOnce(leaderElector) {
  if (leaderElector.isLeader) {
    return PROMISE_RESOLVED_VOID;
  }
  return new Promise(function(res) {
    var resolved = false;
    function finish() {
      if (resolved) {
        return;
      }
      resolved = true;
      leaderElector.broadcastChannel.removeEventListener("internal", whenDeathListener);
      res(true);
    }
    leaderElector.applyOnce().then(function() {
      if (leaderElector.isLeader) {
        finish();
      }
    });
    var tryOnFallBack = function tryOnFallBack2() {
      return sleep(leaderElector._options.fallbackInterval).then(function() {
        if (leaderElector.isDead || resolved) {
          return;
        }
        if (leaderElector.isLeader) {
          finish();
        } else {
          return leaderElector.applyOnce(true).then(function() {
            if (leaderElector.isLeader) {
              finish();
            } else {
              tryOnFallBack2();
            }
          });
        }
      });
    };
    tryOnFallBack();
    var whenDeathListener = function whenDeathListener2(msg) {
      if (msg.context === "leader" && msg.action === "death") {
        leaderElector._hasLeader = false;
        leaderElector.applyOnce().then(function() {
          if (leaderElector.isLeader) {
            finish();
          }
        });
      }
    };
    leaderElector.broadcastChannel.addEventListener("internal", whenDeathListener);
    leaderElector._lstns.push(whenDeathListener);
  });
}
function fillOptionsWithDefaults2(options, channel) {
  if (!options) options = {};
  options = JSON.parse(JSON.stringify(options));
  if (!options.fallbackInterval) {
    options.fallbackInterval = 3e3;
  }
  if (!options.responseTime) {
    options.responseTime = channel.method.averageResponseTime(channel.options);
  }
  return options;
}
function createLeaderElection(channel, options) {
  if (channel._leaderElector) {
    throw new Error("BroadcastChannel already has a leader-elector");
  }
  options = fillOptionsWithDefaults2(options, channel);
  var elector = supportsWebLockAPI() ? new LeaderElectionWebLock(channel, options) : new LeaderElection(channel, options);
  channel._befC.push(function() {
    return elector.die();
  });
  channel._leaderElector = elector;
  return elector;
}

// node_modules/rxdb/dist/esm/rx-storage-multiinstance.js
var BROADCAST_CHANNEL_BY_TOKEN = /* @__PURE__ */ new Map();
function getBroadcastChannelReference(storageName, databaseInstanceToken, databaseName, refObject) {
  var state = BROADCAST_CHANNEL_BY_TOKEN.get(databaseInstanceToken);
  if (!state) {
    state = {
      /**
       * We have to use the databaseName instead of the databaseInstanceToken
       * in the BroadcastChannel name because different instances must end with the same
       * channel name to be able to broadcast messages between each other.
       */
      bc: new BroadcastChannel2(["RxDB:", storageName, databaseName].join("|")),
      refs: /* @__PURE__ */ new Set()
    };
    BROADCAST_CHANNEL_BY_TOKEN.set(databaseInstanceToken, state);
  }
  state.refs.add(refObject);
  return state.bc;
}
function removeBroadcastChannelReference(databaseInstanceToken, refObject) {
  var state = BROADCAST_CHANNEL_BY_TOKEN.get(databaseInstanceToken);
  if (!state) {
    return;
  }
  state.refs.delete(refObject);
  if (state.refs.size === 0) {
    BROADCAST_CHANNEL_BY_TOKEN.delete(databaseInstanceToken);
    return state.bc.close();
  }
}
function addRxStorageMultiInstanceSupport(storageName, instanceCreationParams, instance, providedBroadcastChannel) {
  if (!instanceCreationParams.multiInstance) {
    return;
  }
  var broadcastChannel = providedBroadcastChannel ? providedBroadcastChannel : getBroadcastChannelReference(storageName, instanceCreationParams.databaseInstanceToken, instance.databaseName, instance);
  var changesFromOtherInstances$ = new Subject();
  var eventListener = (msg) => {
    if (msg.storageName === storageName && msg.databaseName === instanceCreationParams.databaseName && msg.collectionName === instanceCreationParams.collectionName && msg.version === instanceCreationParams.schema.version) {
      changesFromOtherInstances$.next(msg.eventBulk);
    }
  };
  broadcastChannel.addEventListener("message", eventListener);
  var oldChangestream$ = instance.changeStream();
  var closed = false;
  var sub = oldChangestream$.subscribe((eventBulk) => {
    if (closed) {
      return;
    }
    broadcastChannel.postMessage({
      storageName,
      databaseName: instanceCreationParams.databaseName,
      collectionName: instanceCreationParams.collectionName,
      version: instanceCreationParams.schema.version,
      eventBulk
    });
  });
  instance.changeStream = function() {
    return changesFromOtherInstances$.asObservable().pipe(mergeWith(oldChangestream$));
  };
  var oldClose = instance.close.bind(instance);
  instance.close = async function() {
    closed = true;
    sub.unsubscribe();
    broadcastChannel.removeEventListener("message", eventListener);
    if (!providedBroadcastChannel) {
      await removeBroadcastChannelReference(instanceCreationParams.databaseInstanceToken, instance);
    }
    return oldClose();
  };
  var oldRemove = instance.remove.bind(instance);
  instance.remove = async function() {
    closed = true;
    sub.unsubscribe();
    broadcastChannel.removeEventListener("message", eventListener);
    if (!providedBroadcastChannel) {
      await removeBroadcastChannelReference(instanceCreationParams.databaseInstanceToken, instance);
    }
    return oldRemove();
  };
}

// node_modules/rxdb/dist/esm/plugins/dev-mode/error-messages.js
var ERROR_MESSAGES = {
  // util.js / config
  UT1: "given name is no string or empty",
  UT2: "collection- and database-names must match the regex to be compatible with couchdb databases.\n    See https://neighbourhood.ie/blog/2020/10/13/everything-you-need-to-know-about-couchdb-database-names/\n    info: if your database-name specifies a folder, the name must contain the slash-char '/' or '\\'",
  UT3: "replication-direction must either be push or pull or both. But not none",
  UT4: "given leveldown is no valid adapter",
  UT5: "keyCompression is set to true in the schema but no key-compression handler is used in the storage",
  UT6: "schema contains encrypted fields but no encryption handler is used in the storage",
  UT7: "attachments.compression is enabled but no attachment-compression plugin is used",
  // plugins
  PL1: "Given plugin is not RxDB plugin.",
  // removed in 14.0.0 - PouchDB RxStorage was removed - PL2: 'You tried importing a RxDB plugin to pouchdb. Use addRxPlugin() instead.',
  PL3: "A plugin with the same name was already added but it was not the exact same JavaScript object",
  // pouch-db.js
  // removed in 12.0.0 - P1: 'PouchDB.getBatch: limit must be > 2',
  P2: "bulkWrite() cannot be called with an empty array",
  // removed in 12.0.0 - P3: 'bulkAddRevisions cannot be called with an empty array',
  // rx-query
  QU1: "RxQuery._execOverDatabase(): op not known",
  // removed in 9.0.0 - QU2: 'limit() must get a number',
  // removed in 9.0.0 - QU3: 'skip() must get a number',
  QU4: "RxQuery.regex(): You cannot use .regex() on the primary field",
  QU5: "RxQuery.sort(): does not work because key is not defined in the schema",
  QU6: "RxQuery.limit(): cannot be called on .findOne()",
  // removed in 12.0.0 (should by ensured by the typings) - QU7: 'query must be an object',
  // removed in 12.0.0 (should by ensured by the typings) - QU8: 'query cannot be an array',
  QU9: "throwIfMissing can only be used in findOne queries",
  QU10: "result empty and throwIfMissing: true",
  QU11: "RxQuery: no valid query params given",
  QU12: "Given index is not in schema",
  QU13: "A top level field of the query is not included in the schema",
  QU14: "Running a count() query in slow mode is now allowed. Either run a count() query with a selector that fully matches an index or set allowSlowCount=true when calling the createRxDatabase",
  QU15: "For count queries it is not allowed to use skip or limit",
  QU16: "$regex queries must be defined by a string, not an RegExp instance. This is because RegExp objects cannot be JSON stringified and also they are mutable which would be dangerous",
  QU17: "Chained queries cannot be used on findByIds() RxQuery instances",
  QU18: "Malformed query result data. This likely happens because you create a OPFS-storage RxDatabase inside of a worker but did not set the usesRxDatabaseInWorker setting. https://rxdb.info/rx-storage-opfs.html#setting-usesrxdatabaseinworker-when-a-rxdatabase-is-also-used-inside-of-the-worker ",
  QU19: "Queries must not contain fields or properties with the value `undefined`: https://github.com/pubkey/rxdb/issues/6792#issuecomment-2624555824 ",
  // mquery.js
  MQ1: "path must be a string or object",
  MQ2: "Invalid argument",
  MQ3: "Invalid sort() argument. Must be a string, object, or array",
  MQ4: "Invalid argument. Expected instanceof mquery or plain object",
  MQ5: "method must be used after where() when called with these arguments",
  MQ6: "Can't mix sort syntaxes. Use either array or object | .sort([['field', 1], ['test', -1]]) | .sort({ field: 1, test: -1 })",
  MQ7: "Invalid sort value",
  MQ8: "Can't mix sort syntaxes. Use either array or object",
  // rx-database
  DB1: "RxDocument.prepare(): another instance on this adapter has a different password",
  DB2: "RxDatabase.addCollections(): collection-names cannot start with underscore _",
  DB3: "RxDatabase.addCollections(): collection already exists. use myDatabase[collectionName] to get it",
  DB4: "RxDatabase.addCollections(): schema is missing",
  DB5: "RxDatabase.addCollections(): collection-name not allowed",
  DB6: "RxDatabase.addCollections(): another instance created this collection with a different schema. Read this https://rxdb.info/questions-answers.html?console=qa#cant-change-the-schema ",
  // removed in 13.0.0 (now part of the encryption plugin) DB7: 'RxDatabase.addCollections(): schema encrypted but no password given',
  DB8: "createRxDatabase(): A RxDatabase with the same name and adapter already exists.\nMake sure to use this combination only once or set ignoreDuplicate to true if you do this intentional-\nThis often happens in react projects with hot reload that reloads the code without reloading the process.",
  DB9: "ignoreDuplicate is only allowed in dev-mode and must never be used in production",
  // removed in 14.0.0 - PouchDB RxStorage is removed - DB9: 'createRxDatabase(): Adapter not added. Use addPouchPlugin(require(\'pouchdb-adapter-[adaptername]\'));',
  // removed in 14.0.0 - PouchDB RxStorage is removed DB10: 'createRxDatabase(): To use leveldown-adapters, you have to add the leveldb-plugin. Use addPouchPlugin(require(\'pouchdb-adapter-leveldb\'));',
  DB11: "createRxDatabase(): Invalid db-name, folder-paths must not have an ending slash",
  DB12: "RxDatabase.addCollections(): could not write to internal store",
  DB13: "createRxDatabase(): Invalid db-name or collection name, name contains the dollar sign",
  DB14: "no custom reactivity factory added on database creation",
  // rx-collection
  COL1: "RxDocument.insert() You cannot insert an existing document",
  COL2: "RxCollection.insert() fieldName ._id can only be used as primaryKey",
  COL3: "RxCollection.upsert() does not work without primary",
  COL4: "RxCollection.incrementalUpsert() does not work without primary",
  COL5: "RxCollection.find() if you want to search by _id, use .findOne(_id)",
  COL6: "RxCollection.findOne() needs a queryObject or string. Notice that in RxDB, primary keys must be strings and cannot be numbers.",
  COL7: "hook must be a function",
  COL8: "hooks-when not known",
  COL9: "RxCollection.addHook() hook-name not known",
  COL10: "RxCollection .postCreate-hooks cannot be async",
  COL11: "migrationStrategies must be an object",
  COL12: "A migrationStrategy is missing or too much",
  COL13: "migrationStrategy must be a function",
  COL14: "given static method-name is not a string",
  COL15: "static method-names cannot start with underscore _",
  COL16: "given static method is not a function",
  COL17: "RxCollection.ORM: statics-name not allowed",
  COL18: "collection-method not allowed because fieldname is in the schema",
  // removed in 14.0.0, use CONFLICT instead - COL19: 'Document update conflict. When changing a document you must work on the previous revision',
  COL20: "Storage write error",
  COL21: "The RxCollection is closed or removed already, either from this JavaScript realm or from another, like a browser tab",
  CONFLICT: "Document update conflict. When changing a document you must work on the previous revision",
  COL22: ".bulkInsert() and .bulkUpsert() cannot be run with multiple documents that have the same primary key",
  COL23: "In the open-source version of RxDB, the amount of collections that can exist in parallel is limited to " + NON_PREMIUM_COLLECTION_LIMIT + ". If you already purchased the premium access, you can remove this limit: https://rxdb.info/rx-collection.html#faq",
  // rx-document.js
  DOC1: "RxDocument.get$ cannot get observable of in-array fields because order cannot be guessed",
  DOC2: "cannot observe primary path",
  DOC3: "final fields cannot be observed",
  DOC4: "RxDocument.get$ cannot observe a non-existed field",
  DOC5: "RxDocument.populate() cannot populate a non-existed field",
  DOC6: "RxDocument.populate() cannot populate because path has no ref",
  DOC7: "RxDocument.populate() ref-collection not in database",
  DOC8: "RxDocument.set(): primary-key cannot be modified",
  DOC9: "final fields cannot be modified",
  DOC10: "RxDocument.set(): cannot set childpath when rootPath not selected",
  DOC11: "RxDocument.save(): can't save deleted document",
  // removed in 10.0.0 DOC12: 'RxDocument.save(): error',
  DOC13: "RxDocument.remove(): Document is already deleted",
  DOC14: "RxDocument.close() does not exist",
  DOC15: "query cannot be an array",
  DOC16: "Since version 8.0.0 RxDocument.set() can only be called on temporary RxDocuments",
  DOC17: "Since version 8.0.0 RxDocument.save() can only be called on non-temporary documents",
  DOC18: "Document property for composed primary key is missing",
  DOC19: "Value of primary key(s) cannot be changed",
  DOC20: "PrimaryKey missing",
  DOC21: "PrimaryKey must be equal to PrimaryKey.trim(). It cannot start or end with a whitespace",
  DOC22: "PrimaryKey must not contain a linebreak",
  DOC23: 'PrimaryKey must not contain a double-quote ["]',
  DOC24: "Given document data could not be structured cloned. This happens if you pass non-plain-json data into it, like a Date() object or a Function. In vue.js this happens if you use ref() on the document data which transforms it into a Proxy object.",
  // data-migrator.js
  DM1: "migrate() Migration has already run",
  DM2: "migration of document failed final document does not match final schema",
  DM3: "migration already running",
  DM4: "Migration errored",
  DM5: "Cannot open database state with newer RxDB version. You have to migrate your database state first. See https://rxdb.info/migration-storage.html?console=storage ",
  // plugins/attachments.js
  AT1: "to use attachments, please define this in your schema",
  // plugins/encryption-crypto-js.js
  EN1: "password is not valid",
  EN2: "validatePassword: min-length of password not complied",
  EN3: "Schema contains encrypted properties but no password is given",
  EN4: "Password not valid",
  // plugins/json-dump.js
  JD1: "You must create the collections before you can import their data",
  JD2: "RxCollection.importJSON(): the imported json relies on a different schema",
  JD3: "RxCollection.importJSON(): json.passwordHash does not match the own",
  // plugins/leader-election.js
  // plugins/local-documents.js
  LD1: "RxDocument.allAttachments$ can't use attachments on local documents",
  LD2: "RxDocument.get(): objPath must be a string",
  LD3: "RxDocument.get$ cannot get observable of in-array fields because order cannot be guessed",
  LD4: "cannot observe primary path",
  LD5: "RxDocument.set() id cannot be modified",
  LD6: "LocalDocument: Function is not usable on local documents",
  LD7: "Local document already exists",
  LD8: "localDocuments not activated. Set localDocuments=true on creation, when you want to store local documents on the RxDatabase or RxCollection.",
  // plugins/replication.js
  RC1: "Replication: already added",
  RC2: "replicateCouchDB() query must be from the same RxCollection",
  // removed in 14.0.0 - PouchDB RxStorage is removed RC3: 'RxCollection.syncCouchDB() Do not use a collection\'s pouchdb as remote, use the collection instead',
  RC4: "RxCouchDBReplicationState.awaitInitialReplication() cannot await initial replication when live: true",
  RC5: "RxCouchDBReplicationState.awaitInitialReplication() cannot await initial replication if multiInstance because the replication might run on another instance",
  RC6: "syncFirestore() serverTimestampField MUST NOT be part of the collections schema and MUST NOT be nested.",
  RC7: "SimplePeer requires to have process.nextTick() polyfilled, see https://rxdb.info/replication-webrtc.html?console=webrtc ",
  RC_PULL: "RxReplication pull handler threw an error - see .errors for more details",
  RC_STREAM: "RxReplication pull stream$ threw an error - see .errors for more details",
  RC_PUSH: "RxReplication push handler threw an error - see .errors for more details",
  RC_PUSH_NO_AR: "RxReplication push handler did not return an array with the conflicts",
  RC_WEBRTC_PEER: "RxReplication WebRTC Peer has error",
  RC_COUCHDB_1: "replicateCouchDB() url must end with a slash like 'https://example.com/mydatabase/'",
  RC_COUCHDB_2: "replicateCouchDB() did not get valid result with rows.",
  RC_OUTDATED: "Outdated client, update required. Replication was canceled",
  RC_UNAUTHORIZED: "Unauthorized client, update the replicationState.headers to set correct auth data",
  RC_FORBIDDEN: "Client behaves wrong so the replication was canceled. Mostly happens if the client tries to write data that it is not allowed to",
  // plugins/dev-mode/check-schema.js
  SC1: "fieldnames do not match the regex",
  SC2: "SchemaCheck: name 'item' reserved for array-fields",
  SC3: "SchemaCheck: fieldname has a ref-array but items-type is not string",
  SC4: "SchemaCheck: fieldname has a ref but is not type string, [string,null] or array<string>",
  SC6: "SchemaCheck: primary can only be defined at top-level",
  SC7: "SchemaCheck: default-values can only be defined at top-level",
  SC8: "SchemaCheck: first level-fields cannot start with underscore _",
  SC10: "SchemaCheck: schema defines ._rev, this will be done automatically",
  SC11: "SchemaCheck: schema needs a number >=0 as version",
  // removed in 10.0.0 - SC12: 'SchemaCheck: primary can only be defined once',
  SC13: "SchemaCheck: primary is always index, do not declare it as index",
  SC14: "SchemaCheck: primary is always unique, do not declare it as index",
  SC15: "SchemaCheck: primary cannot be encrypted",
  SC16: "SchemaCheck: primary must have type: string",
  SC17: "SchemaCheck: top-level fieldname is not allowed",
  SC18: "SchemaCheck: indexes must be an array",
  SC19: "SchemaCheck: indexes must contain strings or arrays of strings",
  SC20: "SchemaCheck: indexes.array must contain strings",
  SC21: "SchemaCheck: given index is not defined in schema",
  SC22: "SchemaCheck: given indexKey is not type:string",
  SC23: "SchemaCheck: fieldname is not allowed",
  SC24: "SchemaCheck: required fields must be set via array. See https://spacetelescope.github.io/understanding-json-schema/reference/object.html#required",
  SC25: "SchemaCheck: compoundIndexes needs to be specified in the indexes field",
  SC26: "SchemaCheck: indexes needs to be specified at collection schema level",
  // removed in 16.0.0 - SC27: 'SchemaCheck: encrypted fields need to be specified at collection schema level',
  SC28: "SchemaCheck: encrypted fields is not defined in the schema",
  SC29: "SchemaCheck: missing object key 'properties'",
  SC30: "SchemaCheck: primaryKey is required",
  SC32: "SchemaCheck: primary field must have the type string/number/integer",
  SC33: "SchemaCheck: used primary key is not a property in the schema",
  SC34: "Fields of type string that are used in an index, must have set the maxLength attribute in the schema",
  SC35: "Fields of type number/integer that are used in an index, must have set the multipleOf attribute in the schema",
  SC36: "A field of this type cannot be used as index",
  SC37: "Fields of type number that are used in an index, must have set the minimum and maximum attribute in the schema",
  SC38: "Fields of type boolean that are used in an index, must be required in the schema",
  SC39: "The primary key must have the maxLength attribute set. Ensure you use the dev-mode plugin when developing with RxDB.",
  SC40: "$ref fields in the schema are not allowed. RxDB cannot resolve related schemas because it would have a negative performance impact.It would have to run http requests on runtime. $ref fields should be resolved during build time.",
  SC41: "minimum, maximum and maxLength values for indexes must be real numbers, not Infinity or -Infinity",
  // plugins/dev-mode
  // removed in 13.9.0, use PL3 instead - DEV1: 'dev-mode added multiple times',
  DVM1: "When dev-mode is enabled, your storage must use one of the schema validators at the top level. This is because most problems people have with RxDB is because they store data that is not valid to the schema which causes strange bugs and problems.",
  // plugins/validate.js
  VD1: "Sub-schema not found, does the schemaPath exists in your schema?",
  VD2: "object does not match schema",
  // plugins/in-memory.js
  // removed in 14.0.0 - PouchDB RxStorage is removed IM1: 'InMemory: Memory-Adapter must be added. Use addPouchPlugin(require(\'pouchdb-adapter-memory\'));',
  // removed in 14.0.0 - PouchDB RxStorage is removed IM2: 'inMemoryCollection.sync(): Do not replicate with the in-memory instance. Replicate with the parent instead',
  // plugins/server.js
  S1: "You cannot create collections after calling RxDatabase.server()",
  // plugins/replication-graphql.js
  GQL1: "GraphQL replication: cannot find sub schema by key",
  // removed in 13.0.0, use RC_PULL instead - GQL2: 'GraphQL replication: unknown errors occurred in replication pull - see innerErrors for more details',
  GQL3: "GraphQL replication: pull returns more documents then batchSize",
  // removed in 13.0.0, use RC_PUSH instead - GQL4: 'GraphQL replication: unknown errors occurred in replication push - see innerErrors for more details',
  // plugins/crdt/
  CRDT1: "CRDT operations cannot be used because the crdt options are not set in the schema.",
  CRDT2: "RxDocument.incrementalModify() cannot be used when CRDTs are activated.",
  CRDT3: "To use CRDTs you MUST NOT set a conflictHandler because the default CRDT conflict handler must be used",
  // plugins/storage-dexie/
  DXE1: "non-required index fields are not possible with the dexie.js RxStorage: https://github.com/pubkey/rxdb/pull/6643#issuecomment-2505310082",
  // removed in 15.0.0, added boolean index support to dexie storage - DXE1: 'The dexie.js RxStorage does not support boolean indexes, see https://rxdb.info/rx-storage-dexie.html#boolean-index',
  // plugins/storage-sqlite-trial/
  SQL1: "The trial version of the SQLite storage does not support attachments.",
  SQL2: "The trial version of the SQLite storage is limited to contain 300 documents",
  SQL3: "The trial version of the SQLite storage is limited to running 110 operations",
  // plugins/storage-remote
  RM1: "Cannot communicate with a remote that was build on a different RxDB version. Did you forget to rebuild your workers when updating RxDB?",
  /**
   * Should never be thrown, use this for
   * null checks etc. so you do not have to increase the
   * build size with error message strings.
   */
  SNH: "This should never happen"
};

// node_modules/rxdb/dist/esm/plugins/dev-mode/entity-properties.js
var _rxCollectionProperties;
function rxCollectionProperties() {
  if (!_rxCollectionProperties) {
    var pseudoInstance = new RxCollectionBase();
    var ownProperties = Object.getOwnPropertyNames(pseudoInstance);
    var prototypeProperties = Object.getOwnPropertyNames(Object.getPrototypeOf(pseudoInstance));
    _rxCollectionProperties = [...ownProperties, ...prototypeProperties];
  }
  return _rxCollectionProperties;
}
var _rxDatabaseProperties;
function rxDatabaseProperties() {
  if (!_rxDatabaseProperties) {
    var pseudoInstance = new RxDatabaseBase("pseudoInstance", "memory");
    var ownProperties = Object.getOwnPropertyNames(pseudoInstance);
    var prototypeProperties = Object.getOwnPropertyNames(Object.getPrototypeOf(pseudoInstance));
    _rxDatabaseProperties = [...ownProperties, ...prototypeProperties];
    pseudoInstance.close();
  }
  return _rxDatabaseProperties;
}
var pseudoConstructor = createRxDocumentConstructor(basePrototype);
var pseudoRxDocument = new pseudoConstructor();
var _rxDocumentProperties;
function rxDocumentProperties() {
  if (!_rxDocumentProperties) {
    var reserved = ["deleted", "synced"];
    var ownProperties = Object.getOwnPropertyNames(pseudoRxDocument);
    var prototypeProperties = Object.getOwnPropertyNames(basePrototype);
    _rxDocumentProperties = [...ownProperties, ...prototypeProperties, ...reserved];
  }
  return _rxDocumentProperties;
}

// node_modules/rxdb/dist/esm/plugins/dev-mode/check-schema.js
function checkFieldNameRegex(fieldName) {
  if (fieldName === "_deleted") {
    return;
  }
  if (["properties"].includes(fieldName)) {
    throw newRxError("SC23", {
      fieldName
    });
  }
  var regexStr = "^[a-zA-Z](?:[[a-zA-Z0-9_]*]?[a-zA-Z0-9])?$";
  var regex = new RegExp(regexStr);
  if (
    /**
     * It must be allowed to set _id as primaryKey.
     * This makes it sometimes easier to work with RxDB+CouchDB
     * @link https://github.com/pubkey/rxdb/issues/681
     */
    fieldName !== "_id" && !fieldName.match(regex)
  ) {
    throw newRxError("SC1", {
      regex: regexStr,
      fieldName
    });
  }
}
function validateFieldsDeep(rxJsonSchema) {
  var primaryPath = getPrimaryFieldOfPrimaryKey(rxJsonSchema.primaryKey);
  function checkField(fieldName, schemaObj, path) {
    if (typeof fieldName === "string" && typeof schemaObj === "object" && !Array.isArray(schemaObj) && path.split(".").pop() !== "patternProperties") checkFieldNameRegex(fieldName);
    if (Object.prototype.hasOwnProperty.call(schemaObj, "item") && schemaObj.type !== "array") {
      throw newRxError("SC2", {
        fieldName
      });
    }
    if (Object.prototype.hasOwnProperty.call(schemaObj, "required") && typeof schemaObj.required === "boolean") {
      throw newRxError("SC24", {
        fieldName
      });
    }
    if (Object.prototype.hasOwnProperty.call(schemaObj, "$ref")) {
      throw newRxError("SC40", {
        fieldName
      });
    }
    if (Object.prototype.hasOwnProperty.call(schemaObj, "ref")) {
      if (Array.isArray(schemaObj.type)) {
        if (schemaObj.type.length > 2 || !schemaObj.type.includes("string") || !schemaObj.type.includes("null")) {
          throw newRxError("SC4", {
            fieldName
          });
        }
      } else {
        switch (schemaObj.type) {
          case "string":
            break;
          case "array":
            if (!schemaObj.items || !schemaObj.items.type || schemaObj.items.type !== "string") {
              throw newRxError("SC3", {
                fieldName
              });
            }
            break;
          default:
            throw newRxError("SC4", {
              fieldName
            });
        }
      }
    }
    var isNested = path.split(".").length >= 2;
    if (isNested) {
      if (schemaObj.default) {
        throw newRxError("SC7", {
          path
        });
      }
    }
    if (!isNested) {
      if (fieldName === "_id" && primaryPath !== "_id") {
        throw newRxError("COL2", {
          fieldName
        });
      }
      if (fieldName.charAt(0) === "_") {
        if (
          // exceptional allow underscore on these fields.
          fieldName === "_id" || fieldName === "_deleted"
        ) {
          return;
        }
        throw newRxError("SC8", {
          fieldName
        });
      }
    }
  }
  function traverse(currentObj, currentPath) {
    if (!currentObj || typeof currentObj !== "object") {
      return;
    }
    Object.keys(currentObj).forEach((attributeName) => {
      var schemaObj = currentObj[attributeName];
      if (!currentObj.properties && schemaObj && typeof schemaObj === "object" && !Array.isArray(currentObj)) {
        checkField(attributeName, schemaObj, currentPath);
      }
      var nextPath = currentPath;
      if (attributeName !== "properties") nextPath = nextPath + "." + attributeName;
      traverse(schemaObj, nextPath);
    });
  }
  traverse(rxJsonSchema, "");
  return true;
}
function checkPrimaryKey(jsonSchema) {
  if (!jsonSchema.primaryKey) {
    throw newRxError("SC30", {
      schema: jsonSchema
    });
  }
  function validatePrimarySchemaPart(schemaPart2) {
    if (!schemaPart2) {
      throw newRxError("SC33", {
        schema: jsonSchema
      });
    }
    var type5 = schemaPart2.type;
    if (!type5 || !["string", "number", "integer"].includes(type5)) {
      throw newRxError("SC32", {
        schema: jsonSchema,
        args: {
          schemaPart: schemaPart2
        }
      });
    }
  }
  if (typeof jsonSchema.primaryKey === "string") {
    var key = jsonSchema.primaryKey;
    var schemaPart = jsonSchema.properties[key];
    validatePrimarySchemaPart(schemaPart);
  } else {
    var compositePrimaryKey = jsonSchema.primaryKey;
    var keySchemaPart = getSchemaByObjectPath(jsonSchema, compositePrimaryKey.key);
    validatePrimarySchemaPart(keySchemaPart);
    compositePrimaryKey.fields.forEach((field) => {
      var schemaPart2 = getSchemaByObjectPath(jsonSchema, field);
      validatePrimarySchemaPart(schemaPart2);
    });
  }
  var primaryPath = getPrimaryFieldOfPrimaryKey(jsonSchema.primaryKey);
  var primaryPathSchemaPart = jsonSchema.properties[primaryPath];
  if (!primaryPathSchemaPart.maxLength) {
    throw newRxError("SC39", {
      schema: jsonSchema,
      args: {
        primaryPathSchemaPart
      }
    });
  } else if (!isFinite(primaryPathSchemaPart.maxLength)) {
    throw newRxError("SC41", {
      schema: jsonSchema,
      args: {
        primaryPathSchemaPart
      }
    });
  }
}
function getSchemaPropertyRealPath(shortPath) {
  var pathParts = shortPath.split(".");
  var realPath = "";
  for (var i = 0; i < pathParts.length; i += 1) {
    if (pathParts[i] !== "[]") {
      realPath = realPath.concat(".properties.".concat(pathParts[i]));
    } else {
      realPath = realPath.concat(".items");
    }
  }
  return trimDots(realPath);
}
function checkSchema(jsonSchema) {
  if (!jsonSchema.primaryKey) {
    throw newRxError("SC30", {
      schema: jsonSchema
    });
  }
  if (!Object.prototype.hasOwnProperty.call(jsonSchema, "properties")) {
    throw newRxError("SC29", {
      schema: jsonSchema
    });
  }
  if (jsonSchema.properties._rev) {
    throw newRxError("SC10", {
      schema: jsonSchema
    });
  }
  if (!Object.prototype.hasOwnProperty.call(jsonSchema, "version") || typeof jsonSchema.version !== "number" || jsonSchema.version < 0) {
    throw newRxError("SC11", {
      version: jsonSchema.version
    });
  }
  validateFieldsDeep(jsonSchema);
  checkPrimaryKey(jsonSchema);
  Object.keys(jsonSchema.properties).forEach((key) => {
    var value = jsonSchema.properties[key];
    if (key === jsonSchema.primaryKey) {
      if (jsonSchema.indexes && jsonSchema.indexes.includes(key)) {
        throw newRxError("SC13", {
          value,
          schema: jsonSchema
        });
      }
      if (value.unique) {
        throw newRxError("SC14", {
          value,
          schema: jsonSchema
        });
      }
      if (jsonSchema.encrypted && jsonSchema.encrypted.includes(key)) {
        throw newRxError("SC15", {
          value,
          schema: jsonSchema
        });
      }
      if (value.type !== "string") {
        throw newRxError("SC16", {
          value,
          schema: jsonSchema
        });
      }
    }
    if (rxDocumentProperties().includes(key)) {
      throw newRxError("SC17", {
        key,
        schema: jsonSchema
      });
    }
  });
  if (jsonSchema.indexes) {
    if (!isMaybeReadonlyArray(jsonSchema.indexes)) {
      throw newRxError("SC18", {
        indexes: jsonSchema.indexes,
        schema: jsonSchema
      });
    }
    jsonSchema.indexes.forEach((index) => {
      if (!(typeof index === "string" || Array.isArray(index))) {
        throw newRxError("SC19", {
          index,
          schema: jsonSchema
        });
      }
      if (Array.isArray(index)) {
        for (var i = 0; i < index.length; i += 1) {
          if (typeof index[i] !== "string") {
            throw newRxError("SC20", {
              index,
              schema: jsonSchema
            });
          }
        }
      }
      var indexAsArray = isMaybeReadonlyArray(index) ? index : [index];
      indexAsArray.forEach((fieldName) => {
        var schemaPart = getSchemaByObjectPath(jsonSchema, fieldName);
        var type5 = schemaPart.type;
        switch (type5) {
          case "string":
            var maxLength = schemaPart.maxLength;
            if (!maxLength) {
              throw newRxError("SC34", {
                index,
                field: fieldName,
                schema: jsonSchema
              });
            }
            break;
          case "number":
          case "integer":
            var multipleOf = schemaPart.multipleOf;
            if (!multipleOf) {
              throw newRxError("SC35", {
                index,
                field: fieldName,
                schema: jsonSchema
              });
            }
            var maximum = schemaPart.maximum;
            var minimum = schemaPart.minimum;
            if (typeof maximum === "undefined" || typeof minimum === "undefined") {
              throw newRxError("SC37", {
                index,
                field: fieldName,
                schema: jsonSchema
              });
            }
            if (!isFinite(maximum) || !isFinite(minimum)) {
              throw newRxError("SC41", {
                index,
                field: fieldName,
                schema: jsonSchema
              });
            }
            break;
          case "boolean":
            var parentPath = "";
            var lastPathPart = fieldName;
            if (fieldName.includes(".")) {
              var partParts = fieldName.split(".");
              lastPathPart = partParts.pop();
              parentPath = partParts.join(".");
            }
            var parentSchemaPart = parentPath === "" ? jsonSchema : getSchemaByObjectPath(jsonSchema, parentPath);
            if (!parentSchemaPart.required || !parentSchemaPart.required.includes(lastPathPart)) {
              throw newRxError("SC38", {
                index,
                field: fieldName,
                schema: jsonSchema
              });
            }
            break;
          default:
            throw newRxError("SC36", {
              fieldName,
              type: schemaPart.type,
              schema: jsonSchema
            });
        }
      });
    });
  }
  Object.keys(flattenObject(jsonSchema)).map((key) => {
    var split = key.split(".");
    split.pop();
    return split.join(".");
  }).filter((key) => key !== "").filter((elem, pos, arr) => arr.indexOf(elem) === pos).filter((key) => {
    var value = getProperty(jsonSchema, key);
    return value && !!value.index;
  }).forEach((key) => {
    key = key.replace("properties.", "");
    key = key.replace(/\.properties\./g, ".");
    throw newRxError("SC26", {
      index: trimDots(key),
      schema: jsonSchema
    });
  });
  (jsonSchema.indexes || []).reduce((indexPaths, currentIndex) => {
    if (isMaybeReadonlyArray(currentIndex)) {
      appendToArray(indexPaths, currentIndex);
    } else {
      indexPaths.push(currentIndex);
    }
    return indexPaths;
  }, []).filter((elem, pos, arr) => arr.indexOf(elem) === pos).map((indexPath) => {
    var realPath = getSchemaPropertyRealPath(indexPath);
    var schemaObj = getProperty(jsonSchema, realPath);
    if (!schemaObj || typeof schemaObj !== "object") {
      throw newRxError("SC21", {
        index: indexPath,
        schema: jsonSchema
      });
    }
    return {
      indexPath,
      schemaObj
    };
  }).filter((index) => index.schemaObj.type !== "string" && index.schemaObj.type !== "integer" && index.schemaObj.type !== "number" && index.schemaObj.type !== "boolean").forEach((index) => {
    throw newRxError("SC22", {
      key: index.indexPath,
      type: index.schemaObj.type,
      schema: jsonSchema
    });
  });
  if (jsonSchema.encrypted) {
    jsonSchema.encrypted.forEach((propPath) => {
      var realPath = getSchemaPropertyRealPath(propPath);
      var schemaObj = getProperty(jsonSchema, realPath);
      if (!schemaObj || typeof schemaObj !== "object") {
        throw newRxError("SC28", {
          field: propPath,
          schema: jsonSchema
        });
      }
    });
  }
}

// node_modules/rxdb/dist/esm/plugins/dev-mode/check-orm.js
function checkOrmMethods(statics) {
  if (!statics) {
    return;
  }
  Object.entries(statics).forEach(([k, v]) => {
    if (typeof k !== "string") {
      throw newRxTypeError("COL14", {
        name: k
      });
    }
    if (k.startsWith("_")) {
      throw newRxTypeError("COL15", {
        name: k
      });
    }
    if (typeof v !== "function") {
      throw newRxTypeError("COL16", {
        name: k,
        type: typeof k
      });
    }
    if (rxCollectionProperties().includes(k) || rxDocumentProperties().includes(k)) {
      throw newRxError("COL17", {
        name: k
      });
    }
  });
}
function checkOrmDocumentMethods(schema, methods) {
  var topLevelFields = Object.keys(schema.properties);
  if (!methods) {
    return;
  }
  Object.keys(methods).filter((funName) => topLevelFields.includes(funName)).forEach((funName) => {
    throw newRxError("COL18", {
      funName
    });
  });
}

// node_modules/rxdb/dist/esm/plugins/dev-mode/check-migration-strategies.js
function checkMigrationStrategies(schema, migrationStrategies) {
  if (typeof migrationStrategies !== "object" || Array.isArray(migrationStrategies)) {
    throw newRxTypeError("COL11", {
      schema
    });
  }
  var previousVersions = getPreviousVersions(schema);
  if (previousVersions.length !== Object.keys(migrationStrategies).length) {
    throw newRxError("COL12", {
      have: Object.keys(migrationStrategies),
      should: previousVersions
    });
  }
  previousVersions.map((vNr) => ({
    v: vNr,
    s: migrationStrategies[vNr + 1]
  })).filter((strategy) => typeof strategy.s !== "function").forEach((strategy) => {
    throw newRxTypeError("COL13", {
      version: strategy.v,
      type: typeof strategy,
      schema
    });
  });
  return true;
}

// node_modules/rxdb/dist/esm/plugins/dev-mode/unallowed-properties.js
function ensureCollectionNameValid(args) {
  if (rxDatabaseProperties().includes(args.name)) {
    throw newRxError("DB5", {
      name: args.name
    });
  }
  validateDatabaseName(args.name);
}
function ensureDatabaseNameIsValid(args) {
  validateDatabaseName(args.name);
  if (args.name.includes("$")) {
    throw newRxError("DB13", {
      name: args.name
    });
  }
  if (isFolderPath(args.name)) {
    if (args.name.endsWith("/") || args.name.endsWith("\\")) {
      throw newRxError("DB11", {
        name: args.name
      });
    }
  }
}
var validCouchDBStringRegexStr = "^[a-z][_$a-zA-Z0-9\\-]*$";
var validCouchDBStringRegex = new RegExp(validCouchDBStringRegexStr);
function validateDatabaseName(name) {
  if (typeof name !== "string" || name.length === 0) {
    throw newRxTypeError("UT1", {
      name
    });
  }
  if (isFolderPath(name)) {
    return true;
  }
  if (!name.match(validCouchDBStringRegex) && /**
   * The string ':memory:' is used in the SQLite RxStorage
   * to persist data into a memory state. Often used in tests.
   */
  name !== ":memory:") {
    throw newRxError("UT2", {
      regex: validCouchDBStringRegexStr,
      givenName: name
    });
  }
  return true;
}

// node_modules/rxdb/dist/esm/plugins/dev-mode/check-query.js
function checkQuery(args) {
  var isPlainObject = Object.prototype.toString.call(args.queryObj) === "[object Object]";
  if (!isPlainObject) {
    throw newRxTypeError("QU11", {
      op: args.op,
      collection: args.collection.name,
      queryObj: args.queryObj
    });
  }
  var validKeys = ["selector", "limit", "skip", "sort", "index"];
  Object.keys(args.queryObj).forEach((key) => {
    if (!validKeys.includes(key)) {
      throw newRxTypeError("QU11", {
        op: args.op,
        collection: args.collection.name,
        queryObj: args.queryObj,
        key,
        args: {
          validKeys
        }
      });
    }
  });
  if (args.op === "count" && (args.queryObj.limit || args.queryObj.skip)) {
    throw newRxError("QU15", {
      collection: args.collection.name,
      query: args.queryObj
    });
  }
  ensureObjectDoesNotContainRegExp(args.queryObj);
}
function checkMangoQuery(args) {
  var schema = args.rxQuery.collection.schema.jsonSchema;
  var undefinedFieldPath = findUndefinedPath(args.mangoQuery);
  if (undefinedFieldPath) {
    throw newRxError("QU19", {
      field: undefinedFieldPath,
      query: args.mangoQuery
    });
  }
  var massagedSelector = args.mangoQuery.selector;
  var schemaTopLevelFields = Object.keys(schema.properties);
  Object.keys(massagedSelector).filter((fieldOrOperator) => !fieldOrOperator.startsWith("$")).filter((field) => !field.includes(".")).forEach((field) => {
    if (!schemaTopLevelFields.includes(field)) {
      throw newRxError("QU13", {
        schema,
        field,
        query: args.mangoQuery
      });
    }
  });
  var schemaIndexes = schema.indexes ? schema.indexes : [];
  var index = args.mangoQuery.index;
  if (index) {
    var isInSchema = schemaIndexes.find((schemaIndex) => deepEqual(schemaIndex, index));
    if (!isInSchema) {
      throw newRxError("QU12", {
        collection: args.rxQuery.collection.name,
        query: args.mangoQuery,
        schema
      });
    }
  }
  if (args.rxQuery.op === "count") {
    if (!areSelectorsSatisfiedByIndex(args.rxQuery.collection.schema.jsonSchema, args.mangoQuery) && !args.rxQuery.collection.database.allowSlowCount) {
      throw newRxError("QU14", {
        collection: args.rxQuery.collection,
        query: args.mangoQuery
      });
    }
  }
  if (args.mangoQuery.sort) {
    args.mangoQuery.sort.map((sortPart) => Object.keys(sortPart)[0]).filter((field) => !field.includes(".")).forEach((field) => {
      if (!schemaTopLevelFields.includes(field)) {
        throw newRxError("QU13", {
          schema,
          field,
          query: args.mangoQuery
        });
      }
    });
  }
  ensureObjectDoesNotContainRegExp(args.mangoQuery);
}
function areSelectorsSatisfiedByIndex(schema, query) {
  var preparedQuery = prepareQuery(schema, query);
  return preparedQuery.queryPlan.selectorSatisfiedByIndex;
}
function ensureObjectDoesNotContainRegExp(selector) {
  if (typeof selector !== "object" || selector === null) {
    return;
  }
  var keys = Object.keys(selector);
  keys.forEach((key) => {
    var value = selector[key];
    if (value instanceof RegExp) {
      throw newRxError("QU16", {
        field: key,
        query: selector
      });
    } else if (Array.isArray(value)) {
      value.forEach((item) => ensureObjectDoesNotContainRegExp(item));
    } else {
      ensureObjectDoesNotContainRegExp(value);
    }
  });
}
function isQueryAllowed(args) {
  if (args.op === "findOne") {
    if (typeof args.queryObj === "number" || Array.isArray(args.queryObj)) {
      throw newRxTypeError("COL6", {
        collection: args.collection.name,
        queryObj: args.queryObj
      });
    }
  } else if (args.op === "find") {
    if (typeof args.queryObj === "string") {
      throw newRxError("COL5", {
        collection: args.collection.name,
        queryObj: args.queryObj
      });
    }
  }
}

// node_modules/rxdb/dist/esm/plugins/dev-mode/check-document.js
function ensurePrimaryKeyValid(primaryKey, docData) {
  if (!primaryKey) {
    throw newRxError("DOC20", {
      primaryKey,
      document: docData
    });
  }
  if (primaryKey !== primaryKey.trim()) {
    throw newRxError("DOC21", {
      primaryKey,
      document: docData
    });
  }
  if (primaryKey.includes("\r") || primaryKey.includes("\n")) {
    throw newRxError("DOC22", {
      primaryKey,
      document: docData
    });
  }
  if (primaryKey.includes('"')) {
    throw newRxError("DOC23", {
      primaryKey,
      document: docData
    });
  }
}
function containsDateInstance(obj) {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (obj[key] instanceof Date) {
        return true;
      }
      if (typeof obj[key] === "object" && containsDateInstance(obj[key])) {
        return true;
      }
    }
  }
  return false;
}
function checkWriteRows(storageInstance, rows) {
  var primaryPath = getPrimaryFieldOfPrimaryKey(storageInstance.schema.primaryKey);
  var _loop = function(writeRow2) {
    writeRow2.document = fillPrimaryKey(primaryPath, storageInstance.schema, writeRow2.document);
    if (writeRow2.previous) {
      Object.keys(writeRow2.previous._meta).forEach((metaFieldName) => {
        if (!Object.prototype.hasOwnProperty.call(writeRow2.document._meta, metaFieldName)) {
          throw newRxError("SNH", {
            dataBefore: writeRow2.previous,
            dataAfter: writeRow2.document,
            args: {
              metaFieldName
            }
          });
        }
      });
    }
    try {
      if (typeof structuredClone === "function") {
        structuredClone(writeRow2);
      } else {
        JSON.parse(JSON.stringify(writeRow2));
      }
    } catch (err) {
      throw newRxError("DOC24", {
        collection: storageInstance.collectionName,
        document: writeRow2.document
      });
    }
    if (containsDateInstance(writeRow2.document)) {
      throw newRxError("DOC24", {
        collection: storageInstance.collectionName,
        document: writeRow2.document
      });
    }
  };
  for (var writeRow of rows) {
    _loop(writeRow);
  }
}

// node_modules/rxdb/dist/esm/plugins/dev-mode/dev-mode-tracking.js
var iframeShown = false;
var links = [{
  text: "JavaScript Database",
  url: "https://rxdb.info/"
}, {
  text: "React Native Database",
  url: "https://rxdb.info/react-native-database.html"
}, {
  text: "Local First",
  url: "https://rxdb.info/articles/local-first-future.html"
}, {
  text: "Angular IndexedDB",
  url: "https://rxdb.info/articles/angular-indexeddb.html"
}, {
  text: "React IndexedDB",
  url: "https://rxdb.info/articles/react-indexeddb.html"
}, {
  text: "Firestore Alternative",
  url: "https://rxdb.info/articles/firestore-alternative.html"
}, {
  text: "Offline Database",
  url: "https://rxdb.info/articles/offline-database.html"
}, {
  text: "JSON Database",
  url: "https://rxdb.info/articles/json-database.html"
}, {
  text: "NodeJS Database",
  url: "https://rxdb.info/nodejs-database.html"
}];
async function addDevModeTrackingIframe() {
  if (iframeShown || typeof window === "undefined" || typeof location === "undefined") {
    return;
  }
  if (await hasPremiumFlag()) {
    return;
  }
  iframeShown = true;
  var containerDiv = document.createElement("div");
  containerDiv.style.visibility = "hidden";
  containerDiv.style.position = "absolute";
  containerDiv.style.top = "0";
  containerDiv.style.left = "0";
  containerDiv.style.opacity = "0.1";
  containerDiv.style.width = "1px";
  containerDiv.style.height = "1px";
  containerDiv.style.overflow = "hidden";
  var iframe = document.createElement("iframe");
  iframe.width = "1px";
  iframe.height = "1px";
  iframe.src = "https://rxdb.info/html/dev-mode-iframe.html?version=" + RXDB_VERSION;
  containerDiv.appendChild(iframe);
  var hashNr = hashStringToNumber(location.host);
  var useLinkId = hashNr % links.length;
  var useLink = links[useLinkId];
  var link = document.createElement("a");
  link.href = useLink.url;
  link.target = "_blank";
  link.innerText = useLink.text;
  var p = document.createElement("p");
  p.innerText = "This is the iframe which is shown when the RxDB Dev-Mode is enabled. Also see ";
  p.appendChild(link);
  containerDiv.appendChild(p);
  document.body.appendChild(containerDiv);
}

// node_modules/rxdb/dist/esm/plugins/dev-mode/index.js
var showDevModeWarning = true;
function deepFreezeWhenDevMode(obj) {
  if (!obj || typeof obj === "string" || typeof obj === "number") {
    return obj;
  }
  return deepFreeze(obj);
}
var DEV_MODE_PLUGIN_NAME = "dev-mode";
var RxDBDevModePlugin = {
  name: DEV_MODE_PLUGIN_NAME,
  rxdb: true,
  init: () => {
    addDevModeTrackingIframe();
    if (showDevModeWarning) {
      console.warn([
        "-------------- RxDB dev-mode warning -------------------------------",
        "you are seeing this because you use the RxDB dev-mode plugin https://rxdb.info/dev-mode.html?console=dev-mode ",
        "This is great in development mode, because it will run many checks to ensure",
        "that you use RxDB correct. If you see this in production mode,",
        "you did something wrong because the dev-mode plugin will decrease the performance.",
        "",
        "\u{1F917} Hint: To get the most out of RxDB, check out the Premium Plugins",
        "to get access to faster storages and more professional features: https://rxdb.info/premium/?console=dev-mode ",
        "",
        "You can disable this warning by calling disableWarnings() from the dev-mode plugin.",
        // '',
        // 'Also take part in the RxDB User Survey: https://rxdb.info/survey.html',
        "---------------------------------------------------------------------"
      ].join("\n"));
    }
  },
  overwritable: {
    isDevMode() {
      return true;
    },
    deepFreezeWhenDevMode,
    tunnelErrorMessage(code) {
      if (!ERROR_MESSAGES[code]) {
        console.error("RxDB: Error-Code not known: " + code);
        throw new Error("Error-Code " + code + " not known, contact the maintainer");
      }
      var errorMessage = ERROR_MESSAGES[code];
      return "\nError message: " + errorMessage + "\nError code: " + code;
    }
  },
  hooks: {
    preCreateRxSchema: {
      after: checkSchema
    },
    preCreateRxDatabase: {
      before: function(args) {
        if (!args.storage.name.startsWith("validate-")) {
          throw newRxError("DVM1", {
            database: args.name,
            storage: args.storage.name
          });
        }
      },
      after: function(args) {
        ensureDatabaseNameIsValid(args);
      }
    },
    createRxDatabase: {
      after: async function(args) {
      }
    },
    preCreateRxCollection: {
      after: function(args) {
        ensureCollectionNameValid(args);
        checkOrmDocumentMethods(args.schema, args.methods);
        if (args.name.charAt(0) === "_") {
          throw newRxError("DB2", {
            name: args.name
          });
        }
        if (!args.schema) {
          throw newRxError("DB4", {
            name: args.name,
            args
          });
        }
      }
    },
    createRxDocument: {
      before: function(doc) {
        ensurePrimaryKeyValid(doc.primary, doc.toJSON(true));
      }
    },
    prePrepareRxQuery: {
      after: function(args) {
        isQueryAllowed(args);
      }
    },
    preCreateRxQuery: {
      after: function(args) {
        checkQuery(args);
      }
    },
    prePrepareQuery: {
      after: (args) => {
        checkMangoQuery(args);
      }
    },
    preStorageWrite: {
      before: (args) => {
        checkWriteRows(args.storageInstance, args.rows);
      }
    },
    createRxCollection: {
      after: (args) => {
        checkOrmMethods(args.creator.statics);
        checkOrmMethods(args.creator.methods);
        checkOrmMethods(args.creator.attachments);
        if (args.creator.schema && args.creator.migrationStrategies) {
          checkMigrationStrategies(args.creator.schema, args.creator.migrationStrategies);
        }
      }
    }
  }
};

// node_modules/dexie/import-wrapper.mjs
var import_dexie = __toESM(require_dexie(), 1);
var DexieSymbol = Symbol.for("Dexie");
var Dexie = globalThis[DexieSymbol] || (globalThis[DexieSymbol] = import_dexie.default);
if (import_dexie.default.semVer !== Dexie.semVer) {
  throw new Error(`Two different versions of Dexie loaded in the same app: ${import_dexie.default.semVer} and ${Dexie.semVer}`);
}
var {
  liveQuery,
  mergeRanges,
  rangesOverlap,
  RangeSet,
  cmp,
  Entity,
  PropModSymbol,
  PropModification,
  replacePrefix,
  add: add2,
  remove
} = Dexie;

// node_modules/rxdb/dist/esm/plugins/storage-dexie/dexie-helper.js
var DEXIE_DOCS_TABLE_NAME = "docs";
var DEXIE_CHANGES_TABLE_NAME = "changes";
var DEXIE_ATTACHMENTS_TABLE_NAME = "attachments";
var RX_STORAGE_NAME_DEXIE = "dexie";
var DEXIE_STATE_DB_BY_NAME = /* @__PURE__ */ new Map();
var REF_COUNT_PER_DEXIE_DB = /* @__PURE__ */ new Map();
function getDexieDbWithTables(databaseName, collectionName, settings, schema) {
  var dexieDbName = "rxdb-dexie-" + databaseName + "--" + schema.version + "--" + collectionName;
  var state = getFromMapOrCreate(DEXIE_STATE_DB_BY_NAME, dexieDbName, () => {
    var value = (async () => {
      var useSettings = flatClone(settings);
      useSettings.autoOpen = false;
      var dexieDb = new Dexie(dexieDbName, useSettings);
      if (settings.onCreate) {
        await settings.onCreate(dexieDb, dexieDbName);
      }
      var dexieStoresSettings = {
        [DEXIE_DOCS_TABLE_NAME]: getDexieStoreSchema(schema),
        [DEXIE_CHANGES_TABLE_NAME]: "++sequence, id",
        [DEXIE_ATTACHMENTS_TABLE_NAME]: "id"
      };
      dexieDb.version(1).stores(dexieStoresSettings);
      await dexieDb.open();
      return {
        dexieDb,
        dexieTable: dexieDb[DEXIE_DOCS_TABLE_NAME],
        dexieAttachmentsTable: dexieDb[DEXIE_ATTACHMENTS_TABLE_NAME],
        booleanIndexes: getBooleanIndexes(schema)
      };
    })();
    DEXIE_STATE_DB_BY_NAME.set(dexieDbName, state);
    REF_COUNT_PER_DEXIE_DB.set(state, 0);
    return value;
  });
  return state;
}
async function closeDexieDb(statePromise) {
  var state = await statePromise;
  var prevCount = REF_COUNT_PER_DEXIE_DB.get(statePromise);
  var newCount = prevCount - 1;
  if (newCount === 0) {
    state.dexieDb.close();
    REF_COUNT_PER_DEXIE_DB.delete(statePromise);
  } else {
    REF_COUNT_PER_DEXIE_DB.set(statePromise, newCount);
  }
}
var DEXIE_PIPE_SUBSTITUTE = "__";
function dexieReplaceIfStartsWithPipe(str) {
  var split = str.split(".");
  if (split.length > 1) {
    return split.map((part) => dexieReplaceIfStartsWithPipe(part)).join(".");
  }
  if (str.startsWith("|")) {
    var withoutFirst = str.substring(1);
    return DEXIE_PIPE_SUBSTITUTE + withoutFirst;
  } else {
    return str;
  }
}
function dexieReplaceIfStartsWithPipeRevert(str) {
  var split = str.split(".");
  if (split.length > 1) {
    return split.map((part) => dexieReplaceIfStartsWithPipeRevert(part)).join(".");
  }
  if (str.startsWith(DEXIE_PIPE_SUBSTITUTE)) {
    var withoutFirst = str.substring(DEXIE_PIPE_SUBSTITUTE.length);
    return "|" + withoutFirst;
  } else {
    return str;
  }
}
function fromStorageToDexie(booleanIndexes, inputDoc) {
  if (!inputDoc) {
    return inputDoc;
  }
  var d = flatClone(inputDoc);
  d = fromStorageToDexieField(d);
  booleanIndexes.forEach((idx) => {
    var val = getProperty(inputDoc, idx);
    var newVal = val ? "1" : "0";
    var useIndex = dexieReplaceIfStartsWithPipe(idx);
    setProperty(d, useIndex, newVal);
  });
  return d;
}
function fromDexieToStorage(booleanIndexes, d) {
  if (!d) {
    return d;
  }
  d = flatClone(d);
  d = fromDexieToStorageField(d);
  booleanIndexes.forEach((idx) => {
    var val = getProperty(d, idx);
    var newVal = val === "1" ? true : false;
    setProperty(d, idx, newVal);
  });
  return d;
}
function fromStorageToDexieField(documentData) {
  if (!documentData || typeof documentData === "string" || typeof documentData === "number" || typeof documentData === "boolean") {
    return documentData;
  } else if (Array.isArray(documentData)) {
    return documentData.map((row) => fromStorageToDexieField(row));
  } else if (typeof documentData === "object") {
    var ret = {};
    Object.entries(documentData).forEach(([key, value]) => {
      if (typeof value === "object") {
        value = fromStorageToDexieField(value);
      }
      ret[dexieReplaceIfStartsWithPipe(key)] = value;
    });
    return ret;
  }
}
function fromDexieToStorageField(documentData) {
  if (!documentData || typeof documentData === "string" || typeof documentData === "number" || typeof documentData === "boolean") {
    return documentData;
  } else if (Array.isArray(documentData)) {
    return documentData.map((row) => fromDexieToStorageField(row));
  } else if (typeof documentData === "object") {
    var ret = {};
    Object.entries(documentData).forEach(([key, value]) => {
      if (typeof value === "object" || Array.isArray(documentData)) {
        value = fromDexieToStorageField(value);
      }
      ret[dexieReplaceIfStartsWithPipeRevert(key)] = value;
    });
    return ret;
  }
}
function getDexieStoreSchema(rxJsonSchema) {
  var parts = [];
  var primaryKey = getPrimaryFieldOfPrimaryKey(rxJsonSchema.primaryKey);
  parts.push([primaryKey]);
  parts.push(["_deleted", primaryKey]);
  if (rxJsonSchema.indexes) {
    rxJsonSchema.indexes.forEach((index) => {
      var arIndex = toArray(index);
      parts.push(arIndex);
    });
  }
  parts.push(["_meta.lwt", primaryKey]);
  parts.push(["_meta.lwt"]);
  parts = parts.map((part) => {
    return part.map((str) => dexieReplaceIfStartsWithPipe(str));
  });
  var dexieSchemaRows = parts.map((part) => {
    if (part.length === 1) {
      return part[0];
    } else {
      return "[" + part.join("+") + "]";
    }
  });
  dexieSchemaRows = dexieSchemaRows.filter((elem, pos, arr) => arr.indexOf(elem) === pos);
  var dexieSchema = dexieSchemaRows.join(", ");
  return dexieSchema;
}
async function getDocsInDb(internals, docIds) {
  var state = await internals;
  var docsInDb = await state.dexieTable.bulkGet(docIds);
  return docsInDb.map((d) => fromDexieToStorage(state.booleanIndexes, d));
}
function attachmentObjectId(documentId, attachmentId) {
  return documentId + "||" + attachmentId;
}
function getBooleanIndexes(schema) {
  var checkedFields = /* @__PURE__ */ new Set();
  var ret = [];
  if (!schema.indexes) {
    return ret;
  }
  schema.indexes.forEach((index) => {
    var fields = toArray(index);
    fields.forEach((field) => {
      if (checkedFields.has(field)) {
        return;
      }
      checkedFields.add(field);
      var schemaObj = getSchemaByObjectPath(schema, field);
      if (schemaObj.type === "boolean") {
        ret.push(field);
      }
    });
  });
  ret.push("_deleted");
  return uniqueArray(ret);
}

// node_modules/rxdb/dist/esm/plugins/storage-dexie/dexie-query.js
function mapKeyForKeyRange(k) {
  if (k === INDEX_MIN) {
    return -Infinity;
  } else {
    return k;
  }
}
function rangeFieldToBooleanSubstitute(booleanIndexes, fieldName, value) {
  if (booleanIndexes.includes(fieldName)) {
    var newValue = value === INDEX_MAX || value === true ? "1" : "0";
    return newValue;
  } else {
    return value;
  }
}
function getKeyRangeByQueryPlan(booleanIndexes, queryPlan, IDBKeyRange2) {
  if (!IDBKeyRange2) {
    if (typeof window === "undefined") {
      throw new Error("IDBKeyRange missing");
    } else {
      IDBKeyRange2 = window.IDBKeyRange;
    }
  }
  var startKeys = queryPlan.startKeys.map((v, i) => {
    var fieldName = queryPlan.index[i];
    return rangeFieldToBooleanSubstitute(booleanIndexes, fieldName, v);
  }).map(mapKeyForKeyRange);
  var endKeys = queryPlan.endKeys.map((v, i) => {
    var fieldName = queryPlan.index[i];
    return rangeFieldToBooleanSubstitute(booleanIndexes, fieldName, v);
  }).map(mapKeyForKeyRange);
  var keyRange = IDBKeyRange2.bound(startKeys, endKeys, !queryPlan.inclusiveStart, !queryPlan.inclusiveEnd);
  return keyRange;
}
async function dexieQuery(instance, preparedQuery) {
  var state = await instance.internals;
  var query = preparedQuery.query;
  var skip = query.skip ? query.skip : 0;
  var limit = query.limit ? query.limit : Infinity;
  var skipPlusLimit = skip + limit;
  var queryPlan = preparedQuery.queryPlan;
  var queryMatcher = false;
  if (!queryPlan.selectorSatisfiedByIndex) {
    queryMatcher = getQueryMatcher(instance.schema, preparedQuery.query);
  }
  var keyRange = getKeyRangeByQueryPlan(state.booleanIndexes, queryPlan, state.dexieDb._options.IDBKeyRange);
  var queryPlanFields = queryPlan.index;
  var rows = [];
  await state.dexieDb.transaction("r", state.dexieTable, async (dexieTx) => {
    var tx = dexieTx.idbtrans;
    var store = tx.objectStore(DEXIE_DOCS_TABLE_NAME);
    var index;
    var indexName;
    indexName = "[" + queryPlanFields.map((field) => dexieReplaceIfStartsWithPipe(field)).join("+") + "]";
    index = store.index(indexName);
    var cursorReq = index.openCursor(keyRange);
    await new Promise((res) => {
      cursorReq.onsuccess = function(e) {
        var cursor = e.target.result;
        if (cursor) {
          var docData = fromDexieToStorage(state.booleanIndexes, cursor.value);
          if (!queryMatcher || queryMatcher(docData)) {
            rows.push(docData);
          }
          if (queryPlan.sortSatisfiedByIndex && rows.length === skipPlusLimit) {
            res();
          } else {
            cursor.continue();
          }
        } else {
          res();
        }
      };
    });
  });
  if (!queryPlan.sortSatisfiedByIndex) {
    var sortComparator = getSortComparator(instance.schema, preparedQuery.query);
    rows = rows.sort(sortComparator);
  }
  rows = rows.slice(skip, skipPlusLimit);
  return {
    documents: rows
  };
}
async function dexieCount(instance, preparedQuery) {
  var state = await instance.internals;
  var queryPlan = preparedQuery.queryPlan;
  var queryPlanFields = queryPlan.index;
  var keyRange = getKeyRangeByQueryPlan(state.booleanIndexes, queryPlan, state.dexieDb._options.IDBKeyRange);
  var count = -1;
  await state.dexieDb.transaction("r", state.dexieTable, async (dexieTx) => {
    var tx = dexieTx.idbtrans;
    var store = tx.objectStore(DEXIE_DOCS_TABLE_NAME);
    var index;
    var indexName;
    indexName = "[" + queryPlanFields.map((field) => dexieReplaceIfStartsWithPipe(field)).join("+") + "]";
    index = store.index(indexName);
    var request = index.count(keyRange);
    count = await new Promise((res, rej) => {
      request.onsuccess = function() {
        res(request.result);
      };
      request.onerror = (err) => rej(err);
    });
  });
  return count;
}

// node_modules/rxdb/dist/esm/plugins/storage-dexie/rx-storage-instance-dexie.js
var instanceId = now();
var shownNonPremiumLog = false;
var RxStorageInstanceDexie = /* @__PURE__ */ function() {
  function RxStorageInstanceDexie2(storage, databaseName, collectionName, schema, internals, options, settings, devMode) {
    this.changes$ = new Subject();
    this.instanceId = instanceId++;
    this.storage = storage;
    this.databaseName = databaseName;
    this.collectionName = collectionName;
    this.schema = schema;
    this.internals = internals;
    this.options = options;
    this.settings = settings;
    this.devMode = devMode;
    this.primaryPath = getPrimaryFieldOfPrimaryKey(this.schema.primaryKey);
  }
  var _proto = RxStorageInstanceDexie2.prototype;
  _proto.bulkWrite = async function bulkWrite(documentWrites, context2) {
    ensureNotClosed(this);
    if (!shownNonPremiumLog && !await hasPremiumFlag()) {
      console.warn(["-------------- RxDB Open Core RxStorage -------------------------------", "You are using the free Dexie.js based RxStorage implementation from RxDB https://rxdb.info/rx-storage-dexie.html?console=dexie ", "While this is a great option, we want to let you know that there are faster storage solutions available in our premium plugins.", "For professional users and production environments, we highly recommend considering these premium options to enhance performance and reliability.", " https://rxdb.info/premium/?console=dexie ", "If you already purchased premium access you can disable this log by calling the setPremiumFlag() function from rxdb-premium/plugins/shared.", "---------------------------------------------------------------------"].join("\n"));
      shownNonPremiumLog = true;
    } else {
      shownNonPremiumLog = true;
    }
    documentWrites.forEach((row) => {
      if (!row.document._rev || row.previous && !row.previous._rev) {
        throw newRxError("SNH", {
          args: {
            row
          }
        });
      }
    });
    var state = await this.internals;
    var ret = {
      error: []
    };
    if (this.devMode) {
      documentWrites = documentWrites.map((row) => {
        var doc = flatCloneDocWithMeta(row.document);
        return {
          previous: row.previous,
          document: doc
        };
      });
    }
    var documentKeys = documentWrites.map((writeRow) => writeRow.document[this.primaryPath]);
    var categorized;
    await state.dexieDb.transaction("rw", state.dexieTable, state.dexieAttachmentsTable, async () => {
      var docsInDbMap = /* @__PURE__ */ new Map();
      var docsInDbWithInternals = await getDocsInDb(this.internals, documentKeys);
      docsInDbWithInternals.forEach((docWithDexieInternals) => {
        var doc = docWithDexieInternals;
        if (doc) {
          docsInDbMap.set(doc[this.primaryPath], doc);
        }
        return doc;
      });
      categorized = categorizeBulkWriteRows(this, this.primaryPath, docsInDbMap, documentWrites, context2);
      ret.error = categorized.errors;
      var bulkPutDocs = [];
      categorized.bulkInsertDocs.forEach((row) => {
        bulkPutDocs.push(row.document);
      });
      categorized.bulkUpdateDocs.forEach((row) => {
        bulkPutDocs.push(row.document);
      });
      bulkPutDocs = bulkPutDocs.map((d) => fromStorageToDexie(state.booleanIndexes, d));
      if (bulkPutDocs.length > 0) {
        await state.dexieTable.bulkPut(bulkPutDocs);
      }
      var putAttachments = [];
      categorized.attachmentsAdd.forEach((attachment) => {
        putAttachments.push({
          id: attachmentObjectId(attachment.documentId, attachment.attachmentId),
          data: attachment.attachmentData.data
        });
      });
      categorized.attachmentsUpdate.forEach((attachment) => {
        putAttachments.push({
          id: attachmentObjectId(attachment.documentId, attachment.attachmentId),
          data: attachment.attachmentData.data
        });
      });
      await state.dexieAttachmentsTable.bulkPut(putAttachments);
      await state.dexieAttachmentsTable.bulkDelete(categorized.attachmentsRemove.map((attachment) => attachmentObjectId(attachment.documentId, attachment.attachmentId)));
    });
    categorized = ensureNotFalsy(categorized);
    if (categorized.eventBulk.events.length > 0) {
      var lastState = ensureNotFalsy(categorized.newestRow).document;
      categorized.eventBulk.checkpoint = {
        id: lastState[this.primaryPath],
        lwt: lastState._meta.lwt
      };
      this.changes$.next(categorized.eventBulk);
    }
    return ret;
  };
  _proto.findDocumentsById = async function findDocumentsById(ids, deleted) {
    ensureNotClosed(this);
    var state = await this.internals;
    var ret = [];
    await state.dexieDb.transaction("r", state.dexieTable, async () => {
      var docsInDb = await getDocsInDb(this.internals, ids);
      docsInDb.forEach((documentInDb) => {
        if (documentInDb && (!documentInDb._deleted || deleted)) {
          ret.push(documentInDb);
        }
      });
    });
    return ret;
  };
  _proto.query = function query(preparedQuery) {
    ensureNotClosed(this);
    return dexieQuery(this, preparedQuery);
  };
  _proto.count = async function count(preparedQuery) {
    if (preparedQuery.queryPlan.selectorSatisfiedByIndex) {
      var result = await dexieCount(this, preparedQuery);
      return {
        count: result,
        mode: "fast"
      };
    } else {
      var _result = await dexieQuery(this, preparedQuery);
      return {
        count: _result.documents.length,
        mode: "slow"
      };
    }
  };
  _proto.changeStream = function changeStream() {
    ensureNotClosed(this);
    return this.changes$.asObservable();
  };
  _proto.cleanup = async function cleanup(minimumDeletedTime) {
    ensureNotClosed(this);
    var state = await this.internals;
    await state.dexieDb.transaction("rw", state.dexieTable, async () => {
      var maxDeletionTime = now() - minimumDeletedTime;
      var toRemove = await state.dexieTable.where("_meta.lwt").below(maxDeletionTime).toArray();
      var removeIds = [];
      toRemove.forEach((doc) => {
        if (doc._deleted === "1") {
          removeIds.push(doc[this.primaryPath]);
        }
      });
      await state.dexieTable.bulkDelete(removeIds);
    });
    return true;
  };
  _proto.getAttachmentData = async function getAttachmentData(documentId, attachmentId, _digest) {
    ensureNotClosed(this);
    var state = await this.internals;
    var id = attachmentObjectId(documentId, attachmentId);
    return await state.dexieDb.transaction("r", state.dexieAttachmentsTable, async () => {
      var attachment = await state.dexieAttachmentsTable.get(id);
      if (attachment) {
        return attachment.data;
      } else {
        throw new Error("attachment missing documentId: " + documentId + " attachmentId: " + attachmentId);
      }
    });
  };
  _proto.remove = async function remove2() {
    ensureNotClosed(this);
    var state = await this.internals;
    await state.dexieTable.clear();
    return this.close();
  };
  _proto.close = function close6() {
    if (this.closed) {
      return this.closed;
    }
    this.closed = (async () => {
      this.changes$.complete();
      await closeDexieDb(this.internals);
    })();
    return this.closed;
  };
  return RxStorageInstanceDexie2;
}();
async function createDexieStorageInstance(storage, params, settings) {
  var internals = getDexieDbWithTables(params.databaseName, params.collectionName, settings, params.schema);
  var instance = new RxStorageInstanceDexie(storage, params.databaseName, params.collectionName, params.schema, internals, params.options, settings, params.devMode);
  await addRxStorageMultiInstanceSupport(RX_STORAGE_NAME_DEXIE, params, instance);
  return Promise.resolve(instance);
}
function ensureNotClosed(instance) {
  if (instance.closed) {
    throw new Error("RxStorageInstanceDexie is closed " + instance.databaseName + "-" + instance.collectionName);
  }
}

// node_modules/rxdb/dist/esm/plugins/storage-dexie/rx-storage-dexie.js
var RxStorageDexie = /* @__PURE__ */ function() {
  function RxStorageDexie2(settings) {
    this.name = RX_STORAGE_NAME_DEXIE;
    this.rxdbVersion = RXDB_VERSION;
    this.settings = settings;
  }
  var _proto = RxStorageDexie2.prototype;
  _proto.createStorageInstance = function createStorageInstance(params) {
    ensureRxStorageInstanceParamsAreCorrect(params);
    if (params.schema.indexes) {
      var indexFields = params.schema.indexes.flat();
      indexFields.filter((indexField) => !indexField.includes(".")).forEach((indexField) => {
        if (!params.schema.required || !params.schema.required.includes(indexField)) {
          throw newRxError("DXE1", {
            field: indexField,
            schema: params.schema
          });
        }
      });
    }
    return createDexieStorageInstance(this, params, this.settings);
  };
  return RxStorageDexie2;
}();
function getRxStorageDexie(settings = {}) {
  var storage = new RxStorageDexie(settings);
  return storage;
}

// node_modules/rxdb/dist/esm/plugins/leader-election/index.js
var LEADER_ELECTORS_OF_DB = /* @__PURE__ */ new WeakMap();
var LEADER_ELECTOR_BY_BROADCAST_CHANNEL = /* @__PURE__ */ new WeakMap();
function getLeaderElectorByBroadcastChannel(broadcastChannel) {
  return getFromMapOrCreate(LEADER_ELECTOR_BY_BROADCAST_CHANNEL, broadcastChannel, () => createLeaderElection(broadcastChannel));
}
function getForDatabase() {
  var broadcastChannel = getBroadcastChannelReference(this.storage.name, this.token, this.name, this);
  var oldClose = this.close.bind(this);
  this.close = function() {
    removeBroadcastChannelReference(this.token, this);
    return oldClose();
  };
  var elector = getLeaderElectorByBroadcastChannel(broadcastChannel);
  if (!elector) {
    elector = getLeaderElectorByBroadcastChannel(broadcastChannel);
    LEADER_ELECTORS_OF_DB.set(this, elector);
  }
  this.leaderElector = () => elector;
  return elector;
}
function isLeader() {
  if (!this.multiInstance) {
    return true;
  }
  return this.leaderElector().isLeader;
}
function waitForLeadership() {
  if (!this.multiInstance) {
    return PROMISE_RESOLVE_TRUE;
  } else {
    return this.leaderElector().awaitLeadership().then(() => true);
  }
}
function onClose(db) {
  var has2 = LEADER_ELECTORS_OF_DB.get(db);
  if (has2) {
    has2.die();
  }
}
var rxdb = true;
var prototypes = {
  RxDatabase: (proto) => {
    proto.leaderElector = getForDatabase;
    proto.isLeader = isLeader;
    proto.waitForLeadership = waitForLeadership;
  }
};
var RxDBLeaderElectionPlugin = {
  name: "leader-election",
  rxdb,
  prototypes,
  hooks: {
    preCloseRxDatabase: {
      after: onClose
    }
  }
};

// node_modules/rxdb/dist/esm/plugins/replication/replication-helper.js
var DEFAULT_MODIFIER = (d) => Promise.resolve(d);
function swapDefaultDeletedTodeletedField(deletedField, doc) {
  if (deletedField === "_deleted") {
    return doc;
  } else {
    doc = flatClone(doc);
    var isDeleted = !!doc._deleted;
    doc[deletedField] = isDeleted;
    delete doc._deleted;
    return doc;
  }
}
function handlePulledDocuments(collection, deletedField, docs) {
  return docs.map((doc) => {
    var useDoc = flatClone(doc);
    if (deletedField !== "_deleted") {
      var isDeleted = !!useDoc[deletedField];
      useDoc._deleted = isDeleted;
      delete useDoc[deletedField];
    } else {
      useDoc._deleted = !!useDoc._deleted;
    }
    var primaryPath = collection.schema.primaryPath;
    useDoc[primaryPath] = getComposedPrimaryKeyOfDocumentData(collection.schema.jsonSchema, useDoc);
    return useDoc;
  });
}
function awaitRetry(collection, retryTime) {
  if (typeof window === "undefined" || typeof window !== "object" || typeof window.addEventListener === "undefined" || navigator.onLine) {
    return collection.promiseWait(retryTime);
  }
  var listener;
  var onlineAgain = new Promise((res) => {
    listener = () => {
      window.removeEventListener("online", listener);
      res();
    };
    window.addEventListener("online", listener);
  });
  return Promise.race([onlineAgain, collection.promiseWait(retryTime)]).then(() => {
    window.removeEventListener("online", listener);
  });
}
function preventHibernateBrowserTab(replicationState) {
  function simulateActivity() {
    if (typeof document === "undefined" || typeof document.dispatchEvent !== "function") {
      return;
    }
    var event = new Event("mousemove");
    document.dispatchEvent(event);
  }
  var intervalId = setInterval(simulateActivity, 20 * 1e3);
  replicationState.onCancel.push(() => clearInterval(intervalId));
}

// node_modules/rxdb/dist/esm/plugins/replication/index.js
var REPLICATION_STATE_BY_COLLECTION = /* @__PURE__ */ new WeakMap();
var RxReplicationState = /* @__PURE__ */ function() {
  function RxReplicationState2(replicationIdentifier, collection, deletedField, pull, push, live, retryTime, autoStart, toggleOnDocumentVisible) {
    this.subs = [];
    this.subjects = {
      received: new Subject(),
      // all documents that are received from the endpoint
      sent: new Subject(),
      // all documents that are send to the endpoint
      error: new Subject(),
      // all errors that are received from the endpoint, emits new Error() objects
      canceled: new BehaviorSubject(false),
      // true when the replication was canceled
      active: new BehaviorSubject(false)
      // true when something is running, false when not
    };
    this.received$ = this.subjects.received.asObservable();
    this.sent$ = this.subjects.sent.asObservable();
    this.error$ = this.subjects.error.asObservable();
    this.canceled$ = this.subjects.canceled.asObservable();
    this.active$ = this.subjects.active.asObservable();
    this.wasStarted = false;
    this.onCancel = [];
    this.callOnStart = void 0;
    this.remoteEvents$ = new Subject();
    this.replicationIdentifier = replicationIdentifier;
    this.collection = collection;
    this.deletedField = deletedField;
    this.pull = pull;
    this.push = push;
    this.live = live;
    this.retryTime = retryTime;
    this.autoStart = autoStart;
    this.toggleOnDocumentVisible = toggleOnDocumentVisible;
    this.metaInfoPromise = (async () => {
      var metaInstanceCollectionName = "rx-replication-meta-" + await collection.database.hashFunction([this.collection.name, this.replicationIdentifier].join("-"));
      var metaInstanceSchema = getRxReplicationMetaInstanceSchema(this.collection.schema.jsonSchema, hasEncryption(this.collection.schema.jsonSchema));
      return {
        collectionName: metaInstanceCollectionName,
        schema: metaInstanceSchema
      };
    })();
    var replicationStates = getFromMapOrCreate(REPLICATION_STATE_BY_COLLECTION, collection, () => []);
    replicationStates.push(this);
    this.collection.onClose.push(() => this.cancel());
    Object.keys(this.subjects).forEach((key) => {
      Object.defineProperty(this, key + "$", {
        get: function() {
          return this.subjects[key].asObservable();
        }
      });
    });
    var startPromise = new Promise((res) => {
      this.callOnStart = res;
    });
    this.startPromise = startPromise;
  }
  var _proto = RxReplicationState2.prototype;
  _proto.start = async function start() {
    if (this.isStopped()) {
      return;
    }
    if (this.internalReplicationState) {
      this.internalReplicationState.events.paused.next(false);
    }
    if (this.wasStarted) {
      this.reSync();
      return;
    }
    this.wasStarted = true;
    if (!this.toggleOnDocumentVisible) {
      preventHibernateBrowserTab(this);
    }
    var pullModifier = this.pull && this.pull.modifier ? this.pull.modifier : DEFAULT_MODIFIER;
    var pushModifier = this.push && this.push.modifier ? this.push.modifier : DEFAULT_MODIFIER;
    var database = this.collection.database;
    var metaInfo = await this.metaInfoPromise;
    var [metaInstance] = await Promise.all([this.collection.database.storage.createStorageInstance({
      databaseName: database.name,
      collectionName: metaInfo.collectionName,
      databaseInstanceToken: database.token,
      multiInstance: database.multiInstance,
      options: {},
      schema: metaInfo.schema,
      password: database.password,
      devMode: overwritable.isDevMode()
    }), addConnectedStorageToCollection(this.collection, metaInfo.collectionName, metaInfo.schema)]);
    this.metaInstance = metaInstance;
    this.internalReplicationState = replicateRxStorageInstance({
      pushBatchSize: this.push && this.push.batchSize ? this.push.batchSize : 100,
      pullBatchSize: this.pull && this.pull.batchSize ? this.pull.batchSize : 100,
      initialCheckpoint: {
        upstream: this.push ? this.push.initialCheckpoint : void 0,
        downstream: this.pull ? this.pull.initialCheckpoint : void 0
      },
      forkInstance: this.collection.storageInstance,
      metaInstance: this.metaInstance,
      hashFunction: database.hashFunction,
      identifier: "rxdbreplication" + this.replicationIdentifier,
      conflictHandler: this.collection.conflictHandler,
      replicationHandler: {
        masterChangeStream$: this.remoteEvents$.asObservable().pipe(filter((_v) => !!this.pull), mergeMap(async (ev) => {
          if (ev === "RESYNC") {
            return ev;
          }
          var useEv = flatClone(ev);
          useEv.documents = handlePulledDocuments(this.collection, this.deletedField, useEv.documents);
          useEv.documents = await Promise.all(useEv.documents.map((d) => pullModifier(d)));
          return useEv;
        })),
        masterChangesSince: async (checkpoint, batchSize) => {
          if (!this.pull) {
            return {
              checkpoint: null,
              documents: []
            };
          }
          var done = false;
          var result = {};
          while (!done && !this.isStoppedOrPaused()) {
            try {
              result = await this.pull.handler(checkpoint, batchSize);
              done = true;
            } catch (err) {
              var emitError = newRxError("RC_PULL", {
                checkpoint,
                errors: toArray(err).map((er) => errorToPlainJson(er)),
                direction: "pull"
              });
              this.subjects.error.next(emitError);
              await awaitRetry(this.collection, ensureNotFalsy(this.retryTime));
            }
          }
          if (this.isStoppedOrPaused()) {
            return {
              checkpoint: null,
              documents: []
            };
          }
          var useResult = flatClone(result);
          useResult.documents = handlePulledDocuments(this.collection, this.deletedField, useResult.documents);
          useResult.documents = await Promise.all(useResult.documents.map((d) => pullModifier(d)));
          return useResult;
        },
        masterWrite: async (rows) => {
          if (!this.push) {
            return [];
          }
          var done = false;
          await runAsyncPluginHooks("preReplicationMasterWrite", {
            rows,
            collection: this.collection
          });
          var useRowsOrNull = await Promise.all(rows.map(async (row) => {
            row.newDocumentState = await pushModifier(row.newDocumentState);
            if (row.newDocumentState === null) {
              return null;
            }
            if (row.assumedMasterState) {
              row.assumedMasterState = await pushModifier(row.assumedMasterState);
            }
            if (this.deletedField !== "_deleted") {
              row.newDocumentState = swapDefaultDeletedTodeletedField(this.deletedField, row.newDocumentState);
              if (row.assumedMasterState) {
                row.assumedMasterState = swapDefaultDeletedTodeletedField(this.deletedField, row.assumedMasterState);
              }
            }
            return row;
          }));
          var useRows = useRowsOrNull.filter(arrayFilterNotEmpty);
          var result = null;
          if (useRows.length === 0) {
            done = true;
            result = [];
          }
          while (!done && !this.isStoppedOrPaused()) {
            try {
              result = await this.push.handler(useRows);
              if (!Array.isArray(result)) {
                throw newRxError("RC_PUSH_NO_AR", {
                  pushRows: rows,
                  direction: "push",
                  args: {
                    result
                  }
                });
              }
              done = true;
            } catch (err) {
              var emitError = err.rxdb ? err : newRxError("RC_PUSH", {
                pushRows: rows,
                errors: toArray(err).map((er) => errorToPlainJson(er)),
                direction: "push"
              });
              this.subjects.error.next(emitError);
              await awaitRetry(this.collection, ensureNotFalsy(this.retryTime));
            }
          }
          if (this.isStoppedOrPaused()) {
            return [];
          }
          await runAsyncPluginHooks("preReplicationMasterWriteDocumentsHandle", {
            result,
            collection: this.collection
          });
          var conflicts = handlePulledDocuments(this.collection, this.deletedField, ensureNotFalsy(result));
          return conflicts;
        }
      }
    });
    this.subs.push(this.internalReplicationState.events.error.subscribe((err) => {
      this.subjects.error.next(err);
    }), this.internalReplicationState.events.processed.down.subscribe((row) => this.subjects.received.next(row.document)), this.internalReplicationState.events.processed.up.subscribe((writeToMasterRow) => {
      this.subjects.sent.next(writeToMasterRow.newDocumentState);
    }), combineLatest([this.internalReplicationState.events.active.down, this.internalReplicationState.events.active.up]).subscribe(([down, up]) => {
      var isActive = down || up;
      this.subjects.active.next(isActive);
    }));
    if (this.pull && this.pull.stream$ && this.live) {
      this.subs.push(this.pull.stream$.subscribe({
        next: (ev) => {
          if (!this.isStoppedOrPaused()) {
            this.remoteEvents$.next(ev);
          }
        },
        error: (err) => {
          this.subjects.error.next(err);
        }
      }));
    }
    if (!this.live) {
      await awaitRxStorageReplicationFirstInSync(this.internalReplicationState);
      await awaitRxStorageReplicationInSync(this.internalReplicationState);
      await this.cancel();
    }
    this.callOnStart();
  };
  _proto.pause = function pause() {
    ensureNotFalsy(this.internalReplicationState).events.paused.next(true);
  };
  _proto.isPaused = function isPaused() {
    return this.internalReplicationState ? this.internalReplicationState.events.paused.getValue() : false;
  };
  _proto.isStopped = function isStopped() {
    if (this.subjects.canceled.getValue()) {
      return true;
    }
    return false;
  };
  _proto.isStoppedOrPaused = function isStoppedOrPaused() {
    return this.isPaused() || this.isStopped();
  };
  _proto.awaitInitialReplication = async function awaitInitialReplication() {
    await this.startPromise;
    return awaitRxStorageReplicationFirstInSync(ensureNotFalsy(this.internalReplicationState));
  };
  _proto.awaitInSync = async function awaitInSync() {
    await this.startPromise;
    await awaitRxStorageReplicationFirstInSync(ensureNotFalsy(this.internalReplicationState));
    var t = 2;
    while (t > 0) {
      t--;
      await this.collection.database.requestIdlePromise();
      await awaitRxStorageReplicationInSync(ensureNotFalsy(this.internalReplicationState));
    }
    return true;
  };
  _proto.reSync = function reSync() {
    this.remoteEvents$.next("RESYNC");
  };
  _proto.emitEvent = function emitEvent(ev) {
    this.remoteEvents$.next(ev);
  };
  _proto.cancel = async function cancel() {
    if (this.isStopped()) {
      return PROMISE_RESOLVE_FALSE;
    }
    var promises = this.onCancel.map((fn) => toPromise(fn()));
    if (this.internalReplicationState) {
      await cancelRxStorageReplication(this.internalReplicationState);
    }
    if (this.metaInstance) {
      promises.push(ensureNotFalsy(this.internalReplicationState).checkpointQueue.then(() => ensureNotFalsy(this.metaInstance).close()));
    }
    this.subs.forEach((sub) => sub.unsubscribe());
    this.subjects.canceled.next(true);
    this.subjects.active.complete();
    this.subjects.canceled.complete();
    this.subjects.error.complete();
    this.subjects.received.complete();
    this.subjects.sent.complete();
    return Promise.all(promises);
  };
  _proto.remove = async function remove2() {
    await ensureNotFalsy(this.metaInstance).remove();
    var metaInfo = await this.metaInfoPromise;
    await this.cancel();
    await removeConnectedStorageFromCollection(this.collection, metaInfo.collectionName, metaInfo.schema);
  };
  return RxReplicationState2;
}();
function replicateRxCollection({
  replicationIdentifier,
  collection,
  deletedField = "_deleted",
  pull,
  push,
  live = true,
  retryTime = 1e3 * 5,
  waitForLeadership: waitForLeadership2 = true,
  autoStart = true,
  toggleOnDocumentVisible = false
}) {
  addRxPlugin(RxDBLeaderElectionPlugin);
  if (!pull && !push) {
    throw newRxError("UT3", {
      collection: collection.name,
      args: {
        replicationIdentifier
      }
    });
  }
  var replicationState = new RxReplicationState(replicationIdentifier, collection, deletedField, pull, push, live, retryTime, autoStart, toggleOnDocumentVisible);
  if (toggleOnDocumentVisible && typeof document !== "undefined" && typeof document.addEventListener === "function" && typeof document.visibilityState === "string") {
    var handler = () => {
      if (replicationState.isStopped()) {
        return;
      }
      var isVisible = document.visibilityState;
      if (isVisible) {
        replicationState.start();
      } else {
        if (!collection.database.isLeader()) {
          replicationState.pause();
        }
      }
    };
    document.addEventListener("visibilitychange", handler);
    replicationState.onCancel.push(() => document.removeEventListener("visibilitychange", handler));
  }
  startReplicationOnLeaderShip(waitForLeadership2, replicationState);
  return replicationState;
}
function startReplicationOnLeaderShip(waitForLeadership2, replicationState) {
  var mustWaitForLeadership = waitForLeadership2 && replicationState.collection.database.multiInstance;
  var waitTillRun = mustWaitForLeadership ? replicationState.collection.database.waitForLeadership() : PROMISE_RESOLVE_TRUE;
  return waitTillRun.then(() => {
    if (replicationState.isStopped()) {
      return;
    }
    if (replicationState.autoStart) {
      replicationState.start();
    }
  });
}

// node_modules/rxdb/dist/esm/plugins/replication-webrtc/webrtc-helper.js
async function isMasterInWebRTCReplication(hashFunction, ownStorageToken, otherStorageToken) {
  var isMaster = await hashFunction([ownStorageToken, otherStorageToken].join("|")) > await hashFunction([otherStorageToken, ownStorageToken].join("|"));
  return isMaster;
}
function sendMessageAndAwaitAnswer(handler, peer, message) {
  var requestId = message.id;
  var answerPromise = firstValueFrom(handler.response$.pipe(filter((d) => d.peer === peer), filter((d) => d.response.id === requestId), map((d) => d.response)));
  handler.send(peer, message);
  return answerPromise;
}

// node_modules/rxdb/dist/esm/plugins/replication-webrtc/connection-handler-simple-peer.js
var import_simplepeer_min = __toESM(require_simplepeer_min(), 1);
var Peer = import_simplepeer_min.default;
function sendMessage(ws, msg) {
  ws.send(JSON.stringify(msg));
}
var DEFAULT_SIGNALING_SERVER_HOSTNAME = "signaling.rxdb.info";
var DEFAULT_SIGNALING_SERVER = "wss://" + DEFAULT_SIGNALING_SERVER_HOSTNAME + "/";
var defaultServerWarningShown = false;
var SIMPLE_PEER_PING_INTERVAL = 1e3 * 60 * 2;
function getConnectionHandlerSimplePeer({
  signalingServerUrl,
  wrtc,
  config: config2,
  webSocketConstructor
}) {
  ensureProcessNextTickIsSet();
  signalingServerUrl = signalingServerUrl ? signalingServerUrl : DEFAULT_SIGNALING_SERVER;
  webSocketConstructor = webSocketConstructor ? webSocketConstructor : WebSocket;
  if (signalingServerUrl.includes(DEFAULT_SIGNALING_SERVER_HOSTNAME) && !defaultServerWarningShown) {
    defaultServerWarningShown = true;
    console.warn(["RxDB Warning: You are using the RxDB WebRTC replication plugin", "but you did not specify your own signaling server url.", "By default it will use a signaling server provided by RxDB at " + DEFAULT_SIGNALING_SERVER, "This server is made for demonstration purposes and tryouts. It is not reliable and might be offline at any time.", "In production you must always use your own signaling server instead.", "Learn how to run your own server at https://rxdb.info/replication-webrtc.html", "Also leave a \u2B50 at the RxDB github repo \u{1F64F} https://github.com/pubkey/rxdb \u{1F64F}"].join(" "));
  }
  var creator = async (options) => {
    var connect$ = new Subject();
    var disconnect$ = new Subject();
    var message$ = new Subject();
    var response$ = new Subject();
    var error$ = new Subject();
    var peers = /* @__PURE__ */ new Map();
    var closed = false;
    var ownPeerId;
    var socket = void 0;
    createSocket();
    (async () => {
      while (true) {
        await promiseWait(SIMPLE_PEER_PING_INTERVAL / 2);
        if (closed) {
          break;
        }
        if (socket) {
          sendMessage(socket, {
            type: "ping"
          });
        }
      }
    })();
    function createSocket() {
      if (closed) {
        return;
      }
      socket = new webSocketConstructor(signalingServerUrl);
      socket.onclose = () => createSocket();
      socket.onopen = () => {
        ensureNotFalsy(socket).onmessage = (msgEvent) => {
          var msg = JSON.parse(msgEvent.data);
          switch (msg.type) {
            case "init":
              ownPeerId = msg.yourPeerId;
              sendMessage(ensureNotFalsy(socket), {
                type: "join",
                room: options.topic
              });
              break;
            case "joined":
              var createPeerConnection = function(remotePeerId) {
                var disconnected = false;
                var newSimplePeer = new Peer({
                  initiator: remotePeerId > ownPeerId,
                  wrtc,
                  config: config2,
                  trickle: true
                });
                newSimplePeer.id = randomToken(10);
                peers.set(remotePeerId, newSimplePeer);
                newSimplePeer.on("signal", (signal) => {
                  sendMessage(ensureNotFalsy(socket), {
                    type: "signal",
                    senderPeerId: ownPeerId,
                    receiverPeerId: remotePeerId,
                    room: options.topic,
                    data: signal
                  });
                });
                newSimplePeer.on("data", (messageOrResponse) => {
                  messageOrResponse = JSON.parse(messageOrResponse.toString());
                  if (messageOrResponse.result) {
                    response$.next({
                      peer: newSimplePeer,
                      response: messageOrResponse
                    });
                  } else {
                    message$.next({
                      peer: newSimplePeer,
                      message: messageOrResponse
                    });
                  }
                });
                newSimplePeer.on("error", (error) => {
                  error$.next(newRxError("RC_WEBRTC_PEER", {
                    error
                  }));
                  newSimplePeer.destroy();
                  if (!disconnected) {
                    disconnected = true;
                    disconnect$.next(newSimplePeer);
                  }
                });
                newSimplePeer.on("connect", () => {
                  connect$.next(newSimplePeer);
                });
                newSimplePeer.on("close", () => {
                  if (!disconnected) {
                    disconnected = true;
                    disconnect$.next(newSimplePeer);
                  }
                  createPeerConnection(remotePeerId);
                });
              };
              msg.otherPeerIds.forEach((remotePeerId) => {
                if (remotePeerId === ownPeerId || peers.has(remotePeerId)) {
                  return;
                } else {
                  createPeerConnection(remotePeerId);
                }
              });
              break;
            case "signal":
              var peer = getFromMapOrThrow(peers, msg.senderPeerId);
              peer.signal(msg.data);
              break;
          }
        };
      };
    }
    ;
    var handler = {
      error$,
      connect$,
      disconnect$,
      message$,
      response$,
      async send(peer, message) {
        await peer.send(JSON.stringify(message));
      },
      close() {
        closed = true;
        ensureNotFalsy(socket).close();
        error$.complete();
        connect$.complete();
        disconnect$.complete();
        message$.complete();
        response$.complete();
        return PROMISE_RESOLVE_VOID;
      }
    };
    return handler;
  };
  return creator;
}
function ensureProcessNextTickIsSet() {
  if (typeof process === "undefined" || typeof process.nextTick !== "function") {
    throw newRxError("RC7");
  }
}

// node_modules/rxdb/dist/esm/plugins/replication-webrtc/index.js
async function replicateWebRTC(options) {
  var collection = options.collection;
  addRxPlugin(RxDBLeaderElectionPlugin);
  if (options.pull) {
    if (!options.pull.batchSize) {
      options.pull.batchSize = 20;
    }
  }
  if (options.push) {
    if (!options.push.batchSize) {
      options.push.batchSize = 20;
    }
  }
  if (collection.database.multiInstance) {
    await collection.database.waitForLeadership();
  }
  var requestCounter = 0;
  var requestFlag = randomToken(10);
  function getRequestId() {
    var count = requestCounter++;
    return collection.database.token + "|" + requestFlag + "|" + count;
  }
  var storageToken = await collection.database.storageToken;
  var pool = new RxWebRTCReplicationPool(collection, options, await options.connectionHandlerCreator(options));
  pool.subs.push(pool.connectionHandler.error$.subscribe((err) => pool.error$.next(err)), pool.connectionHandler.disconnect$.subscribe((peer) => pool.removePeer(peer)));
  pool.subs.push(pool.connectionHandler.message$.pipe(filter((data) => data.message.method === "token")).subscribe((data) => {
    pool.connectionHandler.send(data.peer, {
      id: data.message.id,
      result: storageToken
    });
  }));
  var connectSub = pool.connectionHandler.connect$.pipe(filter(() => !pool.canceled)).subscribe(async (peer) => {
    if (options.isPeerValid) {
      var isValid = await options.isPeerValid(peer);
      if (!isValid) {
        return;
      }
    }
    var peerToken;
    try {
      var tokenResponse = await sendMessageAndAwaitAnswer(pool.connectionHandler, peer, {
        id: getRequestId(),
        method: "token",
        params: []
      });
      peerToken = tokenResponse.result;
    } catch (error) {
      pool.error$.next(newRxError("RC_WEBRTC_PEER", {
        error
      }));
      return;
    }
    var isMaster = await isMasterInWebRTCReplication(collection.database.hashFunction, storageToken, peerToken);
    var replicationState;
    if (isMaster) {
      var masterHandler = pool.masterReplicationHandler;
      var masterChangeStreamSub = masterHandler.masterChangeStream$.subscribe((ev) => {
        var streamResponse = {
          id: "masterChangeStream$",
          result: ev
        };
        pool.connectionHandler.send(peer, streamResponse);
      });
      pool.subs.push(masterChangeStreamSub, pool.connectionHandler.disconnect$.pipe(filter((p) => p === peer)).subscribe(() => masterChangeStreamSub.unsubscribe()));
      var messageSub = pool.connectionHandler.message$.pipe(filter((data) => data.peer === peer), filter((data) => data.message.method !== "token")).subscribe(async (data) => {
        var {
          peer: msgPeer,
          message
        } = data;
        var method = masterHandler[message.method].bind(masterHandler);
        var result = await method(...message.params);
        var response = {
          id: message.id,
          result
        };
        pool.connectionHandler.send(msgPeer, response);
      });
      pool.subs.push(messageSub);
    } else {
      replicationState = replicateRxCollection({
        replicationIdentifier: [collection.name, options.topic, peerToken].join("||"),
        collection,
        autoStart: true,
        deletedField: "_deleted",
        live: true,
        retryTime: options.retryTime,
        waitForLeadership: false,
        pull: options.pull ? Object.assign({}, options.pull, {
          async handler(lastPulledCheckpoint) {
            var answer = await sendMessageAndAwaitAnswer(pool.connectionHandler, peer, {
              method: "masterChangesSince",
              params: [lastPulledCheckpoint, ensureNotFalsy(options.pull).batchSize],
              id: getRequestId()
            });
            return answer.result;
          },
          stream$: pool.connectionHandler.response$.pipe(filter((m) => m.response.id === "masterChangeStream$"), map((m) => m.response.result))
        }) : void 0,
        push: options.push ? Object.assign({}, options.push, {
          async handler(docs) {
            var answer = await sendMessageAndAwaitAnswer(pool.connectionHandler, peer, {
              method: "masterWrite",
              params: [docs],
              id: getRequestId()
            });
            return answer.result;
          }
        }) : void 0
      });
    }
    pool.addPeer(peer, replicationState);
  });
  pool.subs.push(connectSub);
  return pool;
}
var RxWebRTCReplicationPool = /* @__PURE__ */ function() {
  function RxWebRTCReplicationPool2(collection, options, connectionHandler) {
    this.peerStates$ = new BehaviorSubject(/* @__PURE__ */ new Map());
    this.canceled = false;
    this.subs = [];
    this.error$ = new Subject();
    this.collection = collection;
    this.options = options;
    this.connectionHandler = connectionHandler;
    this.collection.onClose.push(() => this.cancel());
    this.masterReplicationHandler = rxStorageInstanceToReplicationHandler(collection.storageInstance, collection.conflictHandler, collection.database.token);
  }
  var _proto = RxWebRTCReplicationPool2.prototype;
  _proto.addPeer = function addPeer(peer, replicationState) {
    var peerState = {
      peer,
      replicationState,
      subs: []
    };
    this.peerStates$.next(this.peerStates$.getValue().set(peer, peerState));
    if (replicationState) {
      peerState.subs.push(replicationState.error$.subscribe((ev) => this.error$.next(ev)));
    }
  };
  _proto.removePeer = function removePeer(peer) {
    var peerState = getFromMapOrThrow(this.peerStates$.getValue(), peer);
    this.peerStates$.getValue().delete(peer);
    this.peerStates$.next(this.peerStates$.getValue());
    peerState.subs.forEach((sub) => sub.unsubscribe());
    if (peerState.replicationState) {
      peerState.replicationState.cancel();
    }
  };
  _proto.awaitFirstPeer = function awaitFirstPeer() {
    return firstValueFrom(this.peerStates$.pipe(filter((peerStates) => peerStates.size > 0)));
  };
  _proto.cancel = async function cancel() {
    if (this.canceled) {
      return;
    }
    this.canceled = true;
    this.subs.forEach((sub) => sub.unsubscribe());
    Array.from(this.peerStates$.getValue().keys()).forEach((peer) => {
      this.removePeer(peer);
    });
    await this.connectionHandler.close();
  };
  return RxWebRTCReplicationPool2;
}();

// rxdb-setup.js
var RXDB_SETUP_VER = "0.0.1";
window["logConsoleHereIs"](`here is rxdb-setup.js, module, ${RXDB_SETUP_VER}`);
var styleLog = "background:red; color:white; font-size:20px; padding:5px;";
console.log(`%chere is rxdb-setup.js`, styleLog);
if (document.currentScript) {
  throw "rxdb-setup.js is not loaded as module";
}
function getVersion() {
  return `rxdb-setup.js ${RXDB_SETUP_VER}`;
}
addRxPlugin(RxDBDevModePlugin);
var ourDB = await createRxDatabase({
  name: "mm4i",
  // the name of the database
  storage: getRxStorageDexie()
});
console.log(`%cAfter createRxDatabase`, styleLog, ourDB);
function getDB() {
  return ourDB;
}
await ourDB.addCollections({
  mindmaps: {
    id: {
      type: "string",
      maxLength: 100,
      primary: true
    },
    version: 0,
    schema: {
      version: 0,
      type: "object",
      primaryKey: "id",
      properties: {
        id: { type: "string", maxLength: 100 },
        content: { type: "string" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      },
      required: ["id", "content", "createdAt", "updatedAt"]
    }
  }
});
async function replicateMindmaps(room, secret) {
  const tofRoom = typeof room;
  if (tofRoom !== "string") {
    throw new Error(`room must be string, but has type "${tofRoom}"`);
  }
  const tofSecret = typeof secret;
  if (tofSecret !== "string") {
    throw new Error(`secret must be string, but has type "${tofSecret}"`);
  }
  try {
    const replication = await replicateWebRTC({
      collection: ourDB.mindmaps,
      topic: room,
      // <- set any app-specific room id here.
      secret,
      // Removed as it is not a valid property
      connectionHandlerCreator: getConnectionHandlerSimplePeer({}),
      pull: {},
      push: {}
    });
    return replication;
  } catch (err) {
    console.error("Replication error:", err);
    return null;
  }
}
window.process = {
  nextTick: (fn, ...args) => setTimeout(() => fn(...args))
};
var iceServers = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun.l.google.com:5349" },
  { urls: "stun:stun1.l.google.com:3478" },
  { urls: "stun:stun1.l.google.com:5349" },
  { urls: "stun:stun2.l.google.com:19302" },
  { urls: "stun:stun2.l.google.com:5349" },
  { urls: "stun:stun3.l.google.com:3478" },
  { urls: "stun:stun3.l.google.com:5349" },
  { urls: "stun:stun4.l.google.com:19302" },
  { urls: "stun:stun4.l.google.com:5349" }
];
function getOurICEServer() {
  const n = 3;
  const rec = iceServers[n];
  return rec;
}
export {
  getDB,
  getOurICEServer,
  getVersion,
  replicateMindmaps
};
/*! Bundled license information:

dexie/dist/dexie.js:
  (*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** *)

simple-peer/simplepeer.min.js:
  (*!
  * The buffer module from node.js, for the browser.
  *
  * @author   Feross Aboukhadijeh <https://feross.org>
  * @license  MIT
  *)
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)
  (*! queue-microtask. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> *)
  (*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> *)
  (*! simple-peer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> *)
*/
