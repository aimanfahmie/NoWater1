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
exports.initCommand = void 0;
const vscode = require("vscode");
const configs_1 = require("../configs");
const utils_1 = require("../utils");
const fs = require("fs-extra");
const extension_1 = require("./extension");
const i18n_1 = require("../i18n");
const path = require("path");
function initCommand(context) {
    vscode.commands.executeCommand('setContext', 'code-debuger:languages', configs_1.getSuportLanguages());
    utils_1.registerCommand(context, "code-debuger.debugFile", debugFile);
}
exports.initCommand = initCommand;
function debugFile(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        // 快捷键调用时，uri未定义
        if (!uri) {
            if (vscode.window.activeTextEditor) {
                uri = vscode.window.activeTextEditor.document.uri;
            }
            else {
                return;
            }
        }
        if (uri.scheme === "file") {
            let provider = yield configs_1.getProvider(uri);
            if (!provider)
                return;
            // 扩展
            if (provider.extensions) {
                const hasUninstalled = yield extension_1.Extension.instance.checkToInstall(provider.extensions);
                if (hasUninstalled) {
                    return;
                }
            }
            // 编译命令
            if (provider.commands) {
                let workspace = utils_1.getWorkspaceFolder(uri);
                if (workspace) {
                    process.chdir(workspace);
                }
                for (const key in provider.commands) {
                    let cmd = provider.commands[key];
                    utils_1.showSpinner(i18n_1.localize('toast.spinner.runing', cmd));
                    // 执行命令报错
                    if (utils_1.tryExecCmdSync(cmd) === utils_1.EXEC_ERROR) {
                        utils_1.clearSpinner();
                        vscode.window.showErrorMessage(i18n_1.localize('error.command', cmd));
                        return;
                    }
                }
                utils_1.clearSpinner();
            }
            // 自定义命令
            if (provider.configuration.command) {
                return vscode.commands.executeCommand(provider.configuration.command);
            }
            // @ts-ignore
            vscode.debug.startDebugging(undefined, provider.configuration);
            vscode.debug.onDidTerminateDebugSession(e => {
                if (e.configuration.name === 'Rust') {
                    fs.emptyDirSync(path.join(e.configuration.cwd, '.debug'));
                    fs.removeSync(path.join(e.configuration.cwd, '.debug'));
                }
                else if (e.configuration.type === (provider === null || provider === void 0 ? void 0 : provider.configuration.type) ||
                    e.configuration.type === 'lldb' ||
                    e.configuration.name === (provider === null || provider === void 0 ? void 0 : provider.configuration.name) ||
                    e.configuration.program === (provider === null || provider === void 0 ? void 0 : provider.configuration.program)) {
                    clearLLDB(uri);
                }
            });
            vscode.commands.executeCommand('workbench.debug.action.focusRepl');
        }
    });
}
function clearLLDB(uri) {
    let outfile = utils_1.getFileNoExtension(uri);
    if (utils_1.isFile(outfile)) {
        fs.unlinkSync(outfile);
    }
    let outdir = `${outfile}.dSYM`;
    if (utils_1.isDir(outdir)) {
        fs.removeSync(outdir);
    }
}
//# sourceMappingURL=command.js.map