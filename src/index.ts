import * as opencc from 'node-opencc';
import { PluginImpl } from 'rollup';
import { createFilter } from 'rollup-pluginutils';
import MagicString from "magic-string";

interface PluginOption {
    include?: (string | RegExp)[] | string | RegExp | null;
    exclude?: (string | RegExp)[] | string | RegExp | null;
    sourceMap?: boolean;
    translation?: string;
}

const openccPlugin: PluginImpl<PluginOption> = (options = {}) => {
    const regexp = new RegExp(/[\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}]+/u);
    const filter = createFilter(options.include, options.exclude);
    const translation = options.translation || "traditionalToSimplified";

    return {
        name: 'opencc',
        transform(code: string, id: string) {
            if (!filter(id)) return null;
            let match: RegExpExecArray | null;
            const ms = new MagicString(code);
            while ((match = regexp.exec(code))) {
                const start = match.index;
                const end = start + match[0].length;
                const replacement = opencc[translation](match[0]);

                ms.overwrite(start, end, replacement);
            }

            return {
                code: ms.toString(),
                map: options.sourceMap === true ? ms.generateMap({hires: true}) as any : {mappings: ""},
            };
        }
    };
};

export default openccPlugin;
