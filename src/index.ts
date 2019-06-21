import * as opencc from 'node-opencc';
import { PluginImpl } from 'rollup';
import { createFilter } from 'rollup-pluginutils';

interface PluginOption {
  include?: Array<string | RegExp> | string | RegExp | null,
	exclude?: Array<string | RegExp> | string | RegExp | null,
  translation?: string;
}

const openccPlugin: PluginImpl<PluginOption> = (options = {}) => {
  const filter = createFilter(options.include, options.exclude);
  const translation = options.translation || "traditionalToSimplified";

  return {
    name: 'opencc',
    transform(code, id) {
      if (!filter(id)) return null;
      return {
        code: opencc[translation](code),
      };
    }
  };
};

export default openccPlugin;
