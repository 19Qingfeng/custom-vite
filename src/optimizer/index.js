import { scanImports } from './scan.js';

/**
 * 分析项目中的第三方依赖
 * @param {*} config
 */
async function createOptimizeDepsRun(config) {
  const deps = await scanImports(config);
  console.log(deps, 'deps');
}

//Generate a function to add two numbers

export { createOptimizeDepsRun };
