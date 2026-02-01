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
exports.deactivate = exports.activate = void 0;
const command_1 = require("./core/command");
const editorListener_1 = require("./core/editorListener");
const i18n_1 = require("./i18n");
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        // 设置 i18n
        i18n_1.setup(context.extensionPath);
        // 注册命令
        command_1.initCommand(context);
        // 监控文件当前文件
        editorListener_1.initEditorListener();
    });
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map