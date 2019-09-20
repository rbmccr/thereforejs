"use strict";
exports.__esModule = true;
var Snatcher = /** @class */ (function () {
    function Snatcher(x) {
        this.acceptedConsoleMethods = ['error', 'group', 'info', 'log', 'table', 'trace', 'warn'];
        this.errorMsg = 'Snatcher method contains an invalid config object. Check class instances and individual function calls.';
        this.config = x ? x : null;
    }
    Snatcher.prototype.watch = function (callback, config) {
        if (config === void 0) { config = this.config; }
        if (!config) {
            return console.error(this.errorMsg);
        }
        var ct = config["try"];
        var cc = config["catch"];
        var cf = config["finally"];
        try {
            var x = void 0;
            x = callback();
            if (x) {
                return x;
            }
            else if (ct) {
                if (ct.execute) {
                    x = ct.execute();
                }
                if (x) {
                    return x;
                }
                else if (ct["default"]) {
                    return ct["default"];
                }
            }
        }
        catch (err) {
            if (cc) {
                if (cc.report && this.acceptedConsoleMethods.includes(cc.report)) {
                    console[cc.report](err);
                }
                if (cc.execute) {
                    var y = cc.execute();
                    if (y) {
                        return y;
                    }
                }
                if (cc.provideErr) {
                    return err;
                }
                else if (cc["default"]) {
                    return cc["default"];
                }
            }
        }
        finally {
            if (cf) {
                var z = void 0;
                if (cf.execute) {
                    z = cf.execute();
                }
                if (z) {
                    return z;
                }
                else if (cf["default"]) {
                    return cf["default"];
                }
            }
        }
    };
    return Snatcher;
}());
exports["default"] = Snatcher;
