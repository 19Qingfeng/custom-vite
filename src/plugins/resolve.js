import os from 'os';
import path from 'path';
import resolve from 'resolve';
import fs from 'fs';

const windowsDrivePathPrefixRE = /^[A-Za-z]:[/\\]/;

const isWindows = os.platform() === 'win32';

// 裸包导入的正则
const bareImportRE = /^(?![a-zA-Z]:)[\w@](?!.*:\/\/)/;

/**
 * 这个函数的作用就是寻找模块的入口文件
 * 这块我们简单写，源码中多了 exports、imports、main、module、yarn pnp 等等之类的判断
 * @param {*} id
 * @param {*} importer
 */
function tryNodeResolve(id, importer, root) {
  const pkgDir = resolve.sync(`${id}/package.json`, {
    basedir: root
  });
  const pkg = JSON.parse(fs.readFileSync(pkgDir, 'utf-8'));
  const entryPoint = pkg.module ?? pkg.main;
  const entryPointsPath = path.join(path.dirname(pkgDir), entryPoint);
  return {
    id: entryPointsPath
  };
}

function withTrailingSlash(path) {
  if (path[path.length - 1] !== '/') {
    return `${path}/`;
  }
  return path;
}

/**
 * path.isAbsolute also returns true for drive relative paths on windows (e.g. /something)
 * this function returns false for them but true for absolute paths (e.g. C:/something)
 */
export const isNonDriveRelativeAbsolutePath = (p) => {
  if (!isWindows) return p[0] === '/';
  return windowsDrivePathPrefixRE.test(p);
};

/**
 * 寻找模块所在绝对路径的插件
 * 既是一个 vite 插件，也是一个 Rollup 插件
 * @param {*} param0
 * @returns
 */
function resolvePlugin({ root }) {
  // 相对路径
  // window 下的 /
  // 绝对路径
  return {
    name: 'vite:resolvePlugin',

    async resolveId(id, importer) {
      // 如果是 / 开头的绝对路径，同时前缀并不是在该项目（root） 中，那么 vite 会将该路径当作绝对的 url 来处理（拼接项目所在前缀）
      // /foo -> /fs-root/foo
      if (id[0] === '/' && !id.startsWith(withTrailingSlash(root))) {
        const fsPath = path.resolve(root, id.slice(1));
        return fsPath;
      }

      // 相对路径
      if (id.startsWith('.')) {
        const basedir = importer ? path.dirname(importer) : process.cwd();
        const fsPath = path.resolve(basedir, id);

        return {
          id: fsPath
        };
      }

      // drive relative fs paths (only windows)
      if (isWindows && id.startsWith('/')) {
        // 同样为相对路径
        const basedir = importer ? path.dirname(importer) : process.cwd();
        const fsPath = path.resolve(basedir, id);
        return {
          id: fsPath
        };
      }

      // 绝对路径
      if (isNonDriveRelativeAbsolutePath(id)) {
        return {
          id
        };
      }

      // bare package imports, perform node resolve
      if (bareImportRE.test(id)) {
        // 寻找包所在的路径地址
        const res = tryNodeResolve(id, importer, root);
        return res;
      }
    }
  };
}

export default resolvePlugin;
