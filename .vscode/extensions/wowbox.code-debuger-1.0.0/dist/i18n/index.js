"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localize = exports.locale = exports.setup = void 0;
const utils_1 = require("../utils");
const normalizedLocale_1 = require("../types/normalizedLocale");
const fs_extra_1 = require("fs-extra");
const path = require("path");
const DEFAULT_LOCALE_FILENAME = 'package.nls.json';
let instance;
class I18n {
    constructor(extensionPath) {
        this._extensionPath = extensionPath;
        this._locale = utils_1.getNormalizedVSCodeLocale();
        this._bundle = this.prepare();
    }
    static create(extensionPath) {
        if (!I18n.instance || I18n.instance._extensionPath !== extensionPath) {
            I18n.instance = new I18n(extensionPath);
        }
        return I18n.instance;
    }
    get locale() {
        return this._locale;
    }
    localize(key, ...templateValues) {
        const message = this._bundle[key];
        if (templateValues.length > 0) {
            return utils_1.format(message, ...templateValues);
        }
        return message;
    }
    prepare() {
        const filename = (this.locale === normalizedLocale_1.NormalizedLocale.EN_US) ? DEFAULT_LOCALE_FILENAME : `package.nls.${this.locale}.json`;
        let bundle;
        try {
            bundle = fs_extra_1.readJsonSync(path.resolve(this._extensionPath, filename), { encoding: 'utf8' });
        }
        catch (error) {
            bundle = fs_extra_1.readJsonSync(path.resolve(this._extensionPath, DEFAULT_LOCALE_FILENAME), { encoding: "utf8" });
        }
        return bundle;
    }
}
/**
 * 初始化 i18n
 * @param extensionPath
 */
function setup(extensionPath) {
    instance = I18n.create(extensionPath);
}
exports.setup = setup;
/**
 * 获取vscode的语言版本（EN_US | ZH_CN）
 */
function locale() {
    return instance.locale;
}
exports.locale = locale;
/**
 * 获取本地化的文本信息
 * @param key message的key
 * @param templateValues
 */
function localize(key, ...templateValues) {
    return instance.localize(key, ...templateValues);
}
exports.localize = localize;
//# sourceMappingURL=index.js.map