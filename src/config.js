import { normalizePath } from './utils.js';
import path from 'path';
import resolve from 'resolve';

/**
 * 寻找所在项目目录（实际源码中该函数是寻找传入目录所在最近的包相关信息）
 * @param {*} basedir
 * @returns
 */
function findNearestPackageData(basedir) {
  // 原始启动目录
  const originalBasedir = basedir;
  const pckDir = path.dirname(resolve.sync(`${originalBasedir}/package.json`));
  return path.resolve(pckDir, 'node_modules', '.custom-vite');
}

/**
 * 加载 vite 配置文件
 * （模拟）
 */
async function resolveConfig() {
  const config = {
    root: normalizePath(process.cwd()),
    cacheDir: findNearestPackageData(normalizePath(process.cwd())),
    entryPoints: [path.resolve('index.html')]
  };
  return config;
}

export default resolveConfig;
