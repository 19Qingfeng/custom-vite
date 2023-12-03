#!/usr/bin/env node
import { createServer } from '../src/server/index.js';

(async function () {
  const server = await createServer();
  server.listen('9999', () => {
    console.log('start server on 9999');
  });
})();
