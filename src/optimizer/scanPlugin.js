import nodePath from 'path';
import fs from 'fs-extra';
const htmlTypesRe = /(\.html)$/;

const scriptModuleRe = /<script\s+type="module"\s+src\="(.+?)">/;

function esbuildScanPlugin() {
  return {
    name: 'ScanPlugin',
    setup(build) {
      // 引入时处理 HTML 入口文件
      build.onResolve({ filter: htmlTypesRe }, async ({ path, importer }) => {
        // 将传入的路径转化为绝对路径
        const resolved = await nodePath.resolve(path);
        if (resolved) {
          return {
            path: resolved?.id || resolved,
            namespace: 'html'
          };
        }
      });

      // 当加载命名空间为 html 的文件时
      build.onLoad({ filter: /.*/, namespace: 'html' }, async ({ path }) => {
        // 将 HTML 文件转化为 js 入口文件
        const htmlContent = fs.readFileSync(path, 'utf-8');
        console.log(htmlContent, 'htmlContent');
        const [, src] = htmlContent.match(scriptModuleRe);
        console.log('匹配到的 src 内容', src);
        const jsContent = `import ${JSON.stringify(src)}`;
        return {
          contents: jsContent,
          loader: 'js'
        };
      });
    }
  };
}

export { esbuildScanPlugin };
