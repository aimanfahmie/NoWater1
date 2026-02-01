"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVSCodeSetting = exports.reloadWindow = exports.clearSpinner = exports.showSpinner = exports.showReloadBox = exports.showConfirmBox = exports.registerCommand = void 0;
const vscode = require("vscode");
const i18n_1 = require("../i18n");
/**
 * Register extension command on VSCode.
 * @param context
 * @param command
 * @param callback
 */
function registerCommand(context, command, callback) {
    context.subscriptions.push(vscode.commands.registerCommand(command, callback));
}
exports.registerCommand = registerCommand;
/**
 * 显示信息dialog
 * @param message
 * @param buttons
 */
function showConfirmBox(message, ...buttons) {
    return vscode.window.showInformationMessage(message, ...buttons);
}
exports.showConfirmBox = showConfirmBox;
/**
 * Shows a `Reload VSCode` prompt dialog.
 */
function showReloadBox(msg) {
    const reloadButton = i18n_1.localize("toast.box.reload");
    const message = msg || i18n_1.localize("toast.box.reload.message");
    vscode.window.showInformationMessage(message, reloadButton).then((selection) => {
        if (selection === reloadButton) {
            reloadWindow();
        }
    });
}
exports.showReloadBox = showReloadBox;
let spinnerTimer;
const spinner = {
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
    interval: 100
};
/**
 * 在statusbar显示进度信息
 * @param message
 */
function showSpinner(message, progress, total) {
    clearSpinner();
    let text = "";
    if (progress && total) {
        text = `[${progress}/${total}]`;
    }
    if (message) {
        text = text ? `${text} ${message}` : `${message}`;
    }
    if (text) {
        text = ` ${text.trim()}`;
    }
    let step = 0;
    const frames = spinner.frames;
    const length = frames.length;
    spinnerTimer = setInterval(() => {
        vscode.window.setStatusBarMessage(`${frames[step]}${message}`);
        step = (step + 1) % length;
    }, spinner.interval);
}
exports.showSpinner = showSpinner;
function clearSpinner(message = '') {
    if (spinnerTimer) {
        clearInterval(spinnerTimer);
        spinnerTimer = null;
    }
    vscode.window.setStatusBarMessage(message);
}
exports.clearSpinner = clearSpinner;
/**
 * 重新启动窗口
 */
function reloadWindow() {
    vscode.commands.executeCommand('workbench.action.reloadWindow');
}
exports.reloadWindow = reloadWindow;
/**
 * 获取配置
 * @param section
 * @param key
 * @param defaultValue
 * @returns
 */
function getVSCodeSetting(section, key, defaultValue) {
    return vscode.workspace.getConfiguration(section).get(key, defaultValue);
}
exports.getVSCodeSetting = getVSCodeSetting;
//# sourceMappingURL=api.js.map