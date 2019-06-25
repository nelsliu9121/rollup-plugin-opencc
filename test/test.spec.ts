/* eslint-env mocha */
import assert from 'assert';
import { rollup } from 'rollup';

import openccPlugin from '../src';

const getOutputFromGenerated = generated => (generated.output ? generated.output[0] : generated);

describe('rollup-plugin-opencc', () => {
    it('should transform TC', async () => {
        const bundle = await rollup({
            input: 'test/fixtures/text.js',
            plugins: [
                openccPlugin()
            ]
        });

        const { code } = getOutputFromGenerated(await bundle.generate({ format: 'es' }));

        assert.strictEqual(code.trim(), '台湾')
    })
});
