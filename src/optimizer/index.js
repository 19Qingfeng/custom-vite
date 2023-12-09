import path from 'path';
import fs from 'fs-extra';
import { scanImports } from './scan.js';
import { build } from 'esbuild';

/**
 * 分析项目中的第三方依赖
 * @param {*} config
 */
async function createOptimizeDepsRun(config) {
  const deps = await scanImports(config);
  // 创建缓存目录
  const { cacheDir } = config;
  const depsCacheDir = path.resolve(cacheDir, 'deps');
  // 创建缓存对象 （_metaData.json）
  const metadata = {
    optimize: {}
  };
  for (const dep in deps) {
    // 获取需要被依赖预构建的目录
    const entry = deps[dep];
    metadata.optimize[dep] = {
      src: entry, // 依赖模块入口文件（相对路径）
      file: path.resolve(depsCacheDir, dep + '.js') // 预编译后的文件（绝对路径）
    };
  }
  // 将缓存文件写入文件系统中
  await fs.ensureDir(depsCacheDir);
  await fs.writeFile(
    path.resolve(depsCacheDir, '_metadata.json'),
    JSON.stringify(
      metadata,
      (key, value) => {
        if (key === 'file' || key === 'src') {
          // 注意写入的是相对路径
          return path.relative(depsCacheDir, value);
        }
        return value;
      },
      2
    )
  );
  // 依赖预构建
  await build({
    absWorkingDir: process.cwd(),
    define: {
      'process.env.NODE_ENV': '"development"'
    },
    entryPoints: Object.keys(deps),
    bundle: true,
    format: 'esm',
    splitting: true,
    write: true,
    outdir: depsCacheDir
  });
}

export { createOptimizeDepsRun };
