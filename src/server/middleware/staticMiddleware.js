import serveStatic from 'serve-static';

function staticMiddleware({ root }) {
  return serveStatic(root);
}

export default staticMiddleware;
