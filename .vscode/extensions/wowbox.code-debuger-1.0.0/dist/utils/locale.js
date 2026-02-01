"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVSCodeLocale = exports.getNormalizedVSCodeLocale = exports.normalize = void 0;
const normalizedLocale_1 = require("../types/normalizedLocale");
/**
 * Normalizes the locale string.
 *
 * @param {string} locale The locale string, such as `"zh-CN"`, `"en-US"`...
 */
function normalize(locale) {
    switch (locale) {
        case "zh-cn":
        case "zh-CN":
            return normalizedLocale_1.NormalizedLocale.ZH_CN;
        case "en":
        case "en-us":
        case "en-US":
        default:
            return normalizedLocale_1.NormalizedLocale.EN_US;
    }
}
exports.normalize = normalize;
/**
 * Gets the normalized VSCode locale.
 */
function getNormalizedVSCodeLocale() {
    return normalize(getVSCodeLocale());
}
exports.getNormalizedVSCodeLocale = getNormalizedVSCodeLocale;
/**
 * Gets the VSCode locale string.
 */
function getVSCodeLocale() {
    try {
        return JSON.parse(process.env.VSCODE_NLS_CONFIG || "{}").locale;
    }
    catch (err) {
        return;
    }
}
exports.getVSCodeLocale = getVSCodeLocale;
//# sourceMappingURL=locale.js.map