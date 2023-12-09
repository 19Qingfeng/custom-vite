import { build } from 'esbuild';
import { esbuildScanPlugin } from './scanPlugin.js';

/**
 * 分析项目中的 Import
 * @param {*} config
 */
async function scanImports(config) {
  // 保存依赖
  const depImports = {};
  // 创建 Esbuild 扫描插件 TODO: 增加默认插件
  const scanPlugin = await esbuildScanPlugin(config, depImports);
  // 借助 EsBuild 进行依赖预构建
  await build({
    absWorkingDir: config.root,
    entryPoints: config.entryPoints,
    bundle: true,
    format: 'esm',
    write: false,
    plugins: [scanPlugin]
  });
  return depImports;
}

export { scanImports };
