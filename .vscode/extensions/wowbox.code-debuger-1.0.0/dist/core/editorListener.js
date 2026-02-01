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
exports.initEditorListener = void 0;
const vscode = require("vscode");
const configs_1 = require("../configs");
const extension_1 = require("./extension");
class ActiveTextEditorListener {
    constructor() {
        var _a;
        // 首次立即检查
        if (vscode.window.activeTextEditor) {
            console.log(`Active doc languageId: ${(_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.languageId}`);
            this.onChange(vscode.window.activeTextEditor);
        }
        this.disposer = vscode.window.onDidChangeActiveTextEditor(editor => {
            console.log(`Active doc languageId: ${editor === null || editor === void 0 ? void 0 : editor.document.languageId}`);
            this.onChange(editor);
        });
    }
    dispose() {
        var _a;
        (_a = this.disposer) === null || _a === void 0 ? void 0 : _a.dispose();
    }
    onChange(editor, resetCache) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!editor) {
                return;
            }
            let doc = editor.document;
            let provider = yield configs_1.getProvider(doc.uri);
            if (provider && provider.extensions) {
                yield extension_1.Extension.instance.checkToInstall(provider.extensions);
            }
        });
    }
}
function initEditorListener() {
    new ActiveTextEditorListener();
}
exports.initEditorListener = initEditorListener;
//# sourceMappingURL=editorListener.js.map