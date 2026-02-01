"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFunction = exports.isString = exports.isPlainObject = exports.delay = exports.isDir = exports.isFile = exports.format = void 0;
const fs = require("fs-extra");
__exportStar(require("./locale"), exports);
__exportStar(require("./api"), exports);
__exportStar(require("./node"), exports);
__exportStar(require("./placeholder"), exports);
/**
 * Format the template with specified values.
 *
 * For example:
 *
 * With the template `"Hello, {0} and {1}!"` and the values `["Jack", "Rose"]`, you'll get `"Hello, Jack and Rose!"`.
 *
 * @param {string} template The template string.
 * @param {...any[]} values The values.
 */
function format(template, ...values) {
    if (template == null) {
        return template;
    }
    return values.reduce((prev, value, index) => {
        return prev.replace(new RegExp(`\\{${index}\\}`, "gm"), value);
    }, template);
}
exports.format = format;
function isFile(filePath) {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}
exports.isFile = isFile;
function isDir(dir) {
    return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
}
exports.isDir = isDir;
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.delay = delay;
function isPlainObject(val) {
    return Object.prototype.toString.call(val) === '[object Object]';
}
exports.isPlainObject = isPlainObject;
function isString(val) {
    return typeof val === 'string' || val instanceof String;
}
exports.isString = isString;
function isFunction(val) {
    return typeof val === 'function';
}
exports.isFunction = isFunction;
//# sourceMappingURL=index.js.map