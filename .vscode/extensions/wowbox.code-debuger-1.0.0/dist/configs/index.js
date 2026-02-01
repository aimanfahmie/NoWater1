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
exports.getSuportLanguages = exports.getProvider = void 0;
const utils_1 = require("../utils");
const path = require("path");
const vscode = require("vscode");
const i18n_1 = require("../i18n");
const Providers = {
    "javascript": {
        configuration: {
            name: 'Node',
            type: 'node',
        }
    },
    "typescript": {
        configuration: {
            name: "Typescript",
            type: "node",
        }
    },
    "python": {
        configuration: {
            name: 'Python',
            type: 'python',
        },
        extensions: [
            "ms-python.python"
        ]
    },
    "go": {
        configuration: {
            name: 'Golang',
            type: 'go',
        },
        extensions: [
            "golang.go"
        ]
    },
    "dart": {
        configuration: {
            name: 'Dart',
            type: 'dart',
        },
        extensions: [
            "dart-code.dart-code"
        ]
    },
    "coffeescript": {
        configuration: {
            name: 'Coffee',
            type: 'node',
        }
    },
    "c": {
        configuration: {
            name: 'Clang',
            type: 'lldb',
            program: '${fileNoExtension}',
        },
        commands: [
            'gcc -g ${file} -o ${fileNoExtension}'
        ],
        extensions: [
            "vadimcn.vscode-lldb"
        ]
    },
    "cpp": {
        configuration: {
            name: 'C++',
            type: 'lldb',
            program: '${fileNoExtension}',
        },
        commands: [
            'gcc -g ${file} -o ${fileNoExtension} -lstdc++'
        ],
        extensions: [
            "vadimcn.vscode-lldb"
        ]
    },
    "rust": {
        configuration: {
            name: "Rust",
            type: "lldb",
            program: path.join('${workspaceFolder}', '.debug', 'debug', '${workspaceRootFolderName}')
        },
        commands: [
            // 'rustc -g ${file} -o ${fileNoExtension}'
            'cargo build --target-dir "' + path.join('${workspaceFolder}', '.debug') + '"'
        ],
        extensions: [
            "vadimcn.vscode-lldb",
            "rust-lang.rust-analyzer"
        ]
    },
    "shellscript": {
        configuration: {
            name: "Bash",
            type: "bashdb",
        },
        extensions: [
            "rogalmic.bash-debug"
        ]
    },
    "lua": {
        configuration: {
            name: "Lua",
            type: "lrdb",
        },
        extensions: [
            "satoren.lrdb"
        ]
    }
};
function getProvider(uri, ...args) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!utils_1.isFile(uri.fsPath))
            return;
        let document = yield getDocument(uri);
        // @ts-ignore
        let provider = Providers[document.languageId];
        if (!provider) {
            return;
        }
        const base = {
            configuration: {
                request: 'launch',
                program: uri.fsPath,
                cwd: '${workspaceFolder}',
                args,
                smartStep: true,
                sourceMaps: true,
                stopOnEntry: false
            }
        };
        if (document.languageId === "typescript") {
            let tsnodePath = utils_1.findMoudlePath(uri.fsPath, 'ts-node');
            if (tsnodePath) {
                let configuration = Object.assign(base.configuration, provider.configuration, { runtimeArgs: ["-r", path.join(tsnodePath, 'register')] });
                let result = Object.assign(base, provider, { configuration });
                result = replaceProvider(result, uri);
                return result;
            }
            else {
                vscode.window.showErrorMessage(i18n_1.localize('error.no.ts-node'));
            }
        }
        else {
            let configuration = Object.assign(base.configuration, provider.configuration);
            let result = Object.assign(base, provider, { configuration });
            result = replaceProvider(result, uri);
            return result;
        }
        return;
    });
}
exports.getProvider = getProvider;
function getSuportLanguages() {
    return Object.keys(Providers);
}
exports.getSuportLanguages = getSuportLanguages;
function getDocument(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        const editors = vscode.window.visibleTextEditors;
        for (const key in editors) {
            const editor = editors[key];
            if (editor.document.uri.fsPath === uri.fsPath) {
                return editor.document;
            }
        }
        let document = yield vscode.workspace.openTextDocument(uri);
        return document;
    });
}
function replaceProvider(provider, uri) {
    for (const key in provider) {
        // @ts-ignore
        let value = provider[key];
        if (typeof value === 'string') {
            if (value.indexOf('${') !== -1) {
                // @ts-ignore
                provider[key] = utils_1.getReplacedString(value, uri);
            }
        }
        else if (utils_1.isPlainObject(value) || Array.isArray(value)) {
            value = replaceProvider(value, uri);
        }
    }
    return provider;
}
//# sourceMappingURL=index.js.map