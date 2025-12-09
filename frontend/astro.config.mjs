// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import { remarkImageRow } from './src/plugins/remark-imagerow.js';

// https://astro.build/config
export default defineConfig({
  trailingSlash: 'always',
  integrations: [vue()],
  markdown: {
    remarkPlugins: [remarkImageRow],
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
