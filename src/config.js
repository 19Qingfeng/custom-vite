import { normalizePath } from './utils.js';
import path from 'path';

/**
 * 加载 vite 配置文件
 * （模拟）
 */
async function resolveConfig() {
  const config = {
    root: normalizePath(process.cwd()),
    entryPoints: [path.resolve('index.html')]
  };
  return config;
}

export default resolveConfig;
