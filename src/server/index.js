import connect from 'connect';
import http from 'node:http';
import staticMiddleware from './middleware/staticMiddleware.js';
import resolveConfig from '../config.js';
import { createOptimizeDepsRun } from '../optimizer/index.js';

/**
 * 创建开发服务器
 */
async function createServer() {
  const app = connect();
  const config = await resolveConfig();
  app.use(staticMiddleware(config));

  const server = {
    async listen(port, callback) {
      // 启动服务之前进行预构建
      await runOptimize(config, server);

      http.createServer(app).listen(port, callback);
    }
  };
  return server;
}

/**
 * 预构建
 * @param {*} config
 */
async function runOptimize(config, server) {
  const depsMetaData = await createOptimizeDepsRun(config);
  server._depMetaData = depsMetaData;
}

export { createServer };
