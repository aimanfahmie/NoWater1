"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileExtname = exports.getFileDirname = exports.getFileBasename = exports.getFileBasenameNoExtension = exports.getRelativeFile = exports.getFileNoExtension = exports.getFile = exports.getWorkspaceRootFolderName = exports.getWorkspaceFolder = exports.getReplacedString = void 0;
const vscode = require("vscode");
const path = require("path");
const api_1 = require("./api");
const PlaceHolders = [
    { regex: /\$\{workspaceFolder\}/g, val: getWorkspaceFolder },
    { regex: /\$\{workspaceRootFolderName\}/g, val: getWorkspaceRootFolderName },
    { regex: /\$\{file\}/g, val: getFile },
    { regex: /\$\{fileNoExtension\}/g, val: getFileNoExtension },
    { regex: /\$\{relativeFile\}/g, val: getRelativeFile },
    { regex: /\$\{fileBasenameNoExtension\}/g, val: getFileBasenameNoExtension },
    { regex: /\$\{fileBasename\}/g, val: getFileBasename },
    { regex: /\$\{fileDirname\}/g, val: getFileDirname },
    { regex: /\$\{fileExtname\}/g, val: getFileExtname }
];
function getReplacedString(message, uri) {
    let result = message;
    PlaceHolders.forEach(placeholder => {
        result = result.replace(placeholder.regex, placeholder.val(uri) || '');
    });
    return result;
}
exports.getReplacedString = getReplacedString;
// 根据配置来决定是否使用当前文件夹作为工作目录
function getWorkspaceFolder(uri) {
    var _a;
    if (vscode.workspace.workspaceFolders) {
        const fileDirectoryAsCwd = api_1.getVSCodeSetting('code-debuger', 'fileDirectoryAsCwd');
        return fileDirectoryAsCwd ? getFileDirname(uri) : (_a = vscode.workspace.getWorkspaceFolder(uri)) === null || _a === void 0 ? void 0 : _a.uri.fsPath;
    }
    return;
}
exports.getWorkspaceFolder = getWorkspaceFolder;
function getWorkspaceRootFolderName(uri) {
    let workspacePath = getWorkspaceFolder(uri);
    if (workspacePath) {
        return path.basename(workspacePath);
    }
    return;
}
exports.getWorkspaceRootFolderName = getWorkspaceRootFolderName;
function getFile(uri) {
    return uri.fsPath;
}
exports.getFile = getFile;
// 无文件名后缀的文件路径
function getFileNoExtension(uri) {
    let filepath = getFile(uri);
    let extension = path.extname(filepath);
    return filepath.substring(0, filepath.length - extension.length);
}
exports.getFileNoExtension = getFileNoExtension;
// 相对工作目录路径
function getRelativeFile(uri) {
    return path.relative(getFile(uri), getWorkspaceFolder(uri) || '');
}
exports.getRelativeFile = getRelativeFile;
// 无后缀文件名
function getFileBasenameNoExtension(uri) {
    let filepath = getFile(uri);
    return path.basename(filepath, path.extname(filepath));
}
exports.getFileBasenameNoExtension = getFileBasenameNoExtension;
// 文件名
function getFileBasename(uri) {
    return path.basename(getFile(uri));
}
exports.getFileBasename = getFileBasename;
// 是文件夹路径
function getFileDirname(uri) {
    return path.dirname(getFile(uri));
}
exports.getFileDirname = getFileDirname;
function getFileExtname(uri) {
    return path.extname(getFile(uri));
}
exports.getFileExtname = getFileExtname;
//# sourceMappingURL=placeholder.js.map