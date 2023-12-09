import { normalizePath } from '../utils.js';

/**
 * 创建 Vite 插件容器
 * Vite 中正是自己实现了一套所谓的插件系统，可以完美的在 Vite 中使用 RollupPlugin。
 * 简单来说，插件容器更多像是实现了一个所谓的 Adaptor，这也就是为什么 VitePlugin 和 RollupPlugin 可以互相兼容的原因
 * @param plugin 插件数组
 * @param root 项目根目录
 */
async function createPluginContainer({ plugins }) {
  const container = {
    /**
     * ResolveId 插件容器方法
     * @param {*} path
     * @param {*} importer
     * @returns
     */
    async resolveId(path, importer) {
      let resolved = path;
      for (const plugin of plugins) {
        if (plugin.resolveId) {
          const result = await plugin.resolveId(resolved, importer);
          if (result) {
            resolved = result.id || result;
            break;
          }
        }
      }
      return {
        id: normalizePath(resolved)
      };
    }
  };

  return container;
}

export { createPluginContainer };
