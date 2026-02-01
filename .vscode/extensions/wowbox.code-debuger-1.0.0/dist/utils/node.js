"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryExecCmdSync = exports.findMoudlePath = exports.EXEC_ERROR = void 0;
const child_process_1 = require("child_process");
const readPkgUp = require("read-pkg-up");
const path = require("path");
const fs = require("fs-extra");
const api_1 = require("./api");
const i18n_1 = require("../i18n");
exports.EXEC_ERROR = "@@ERROR@@";
function findMoudlePath(fspath, mod) {
    const root = getNpmGlobalRoot();
    let modPath;
    if (fs.existsSync(path.join(root, mod))) {
        modPath = path.join(root, mod);
    }
    else {
        modPath = findPkg(fspath, mod);
    }
    if (modPath) {
        return modPath;
    }
    api_1.showSpinner(i18n_1.localize('toast.spinner.installing.nodemodule', mod));
    tryExecCmdSync(`npm i -g ${mod}`);
    api_1.clearSpinner();
    if (fs.existsSync(path.join(root, mod))) {
        return path.join(root, mod);
    }
    return;
}
exports.findMoudlePath = findMoudlePath;
/**
 * 获取全局的node_modules路径
 */
function getNpmGlobalRoot() {
    return tryExecCmdSync('npm root -g', '').trim();
}
function tryExecCmdSync(cmd, fallback = exports.EXEC_ERROR) {
    try {
        let options;
        if (process.platform === 'darwin' || process.platform === 'linux') {
            let shell = child_process_1.execSync('echo $SHELL').toString();
            shell = String(shell).replace(/\n/, '');
            options = {
                shell
            };
        }
        return child_process_1.execSync(cmd, options).toString();
    }
    catch (e) {
        return fallback;
    }
}
exports.tryExecCmdSync = tryExecCmdSync;
function findPkg(fspath, pkgName) {
    const res = readPkgUp.sync({ cwd: fspath, normalize: false });
    const { root } = path.parse(fspath);
    if (res && res.packageJson &&
        ((res.packageJson.dependencies && res.packageJson.dependencies[pkgName]) ||
            (res.packageJson.devDependencies && res.packageJson.devDependencies[pkgName]) ||
            (fs.existsSync(path.join(path.dirname(res.path), 'node_modules', pkgName))))) {
        // return resolve.sync(pkgName, {basedir: res.path});
        return path.join(path.dirname(res.path), 'node_modules', pkgName);
    }
    else if (res && res.path) {
        const parent = path.resolve(path.dirname(res.path), '..');
        if (parent !== root) {
            return findPkg(parent, pkgName);
        }
    }
    return;
}
//# sourceMappingURL=node.js.map