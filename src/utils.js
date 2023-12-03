/**
 * windows 下路径适配
 * @param {*} path
 * @returns
 */
function normalizePath(path) {
  return path.replace(/\\/g, '/');
}

export { normalizePath };
