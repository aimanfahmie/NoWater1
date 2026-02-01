"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Extension = void 0;
const vscode = require("vscode");
const i18n_1 = require("../i18n");
const utils_1 = require("../utils");
class Extension {
    constructor() {
    }
    static create() {
        if (!Extension._instance) {
            Extension._instance = new Extension();
        }
        return Extension._instance;
    }
    static get instance() {
        return Extension.create();
    }
    /**
     * 检查并安装扩展
     * @param ids
     */
    checkToInstall(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            let uids = this.getUninstalled(ids);
            if (uids.length) {
                yield this.uninstallExtensions(uids);
                yield this.installExtensions(uids);
                utils_1.showReloadBox();
                return true;
            }
            return false;
        });
    }
    getUninstalled(ids) {
        let result = [];
        let exts = this.getAll();
        // @ts-ignore
        result = ids.map(id => {
            if (!exts.find(ext => id.toLowerCase() === ext.toLowerCase())) {
                return id;
            }
        }).filter(item => !!item);
        return result;
    }
    installExtensions(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            let steps = 0;
            let total = ids.length;
            for (const id of ids) {
                steps++;
                utils_1.showSpinner(i18n_1.localize("toast.settings.installing.extension", id), steps, total);
                yield this.installExtension(id);
            }
            utils_1.clearSpinner();
        });
    }
    uninstallExtensions(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const id of ids) {
                yield this.uninstallExtension(id);
            }
        });
    }
    /**
     * 获取全部已安装的扩展（不包括禁用的扩展）
     *
     * @param excludedPatterns The glob patterns of the extensions that should be excluded.
     */
    getAll() {
        const result = [];
        for (const ext of vscode.extensions.all) {
            if (!ext.packageJSON.isBuiltin) {
                result.push(ext.id);
            }
        }
        return result;
        ;
    }
    /**
     * 安装扩展
     * @param id
     */
    installExtension(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield vscode.commands.executeCommand('workbench.extensions.installExtension', id);
                return true;
            }
            catch (error) {
                console.log(error);
            }
            return false;
        });
    }
    /**
     * 卸载扩展
     */
    uninstallExtension(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield vscode.commands.executeCommand('workbench.extensions.uninstallExtension', id);
                return true;
            }
            catch (error) {
                console.log(error);
            }
            return false;
        });
    }
}
exports.Extension = Extension;
//# sourceMappingURL=extension.js.map