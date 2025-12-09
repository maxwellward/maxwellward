import { visit } from 'unist-util-visit';

export function remarkImageRow() {
  return (tree) => {
    visit(tree, 'paragraph', (node, index, parent) => {
      if (!node.children || node.children.length === 0) return;

      const first = node.children[0];
      if (first.type !== 'text' || !first.value.startsWith('::imagerow[')) return;

      const last = node.children[node.children.length - 1];
      if (last.type !== 'text' || !last.value.endsWith(']')) return;

      // Extract URLs from link nodes (markdown auto-links https://)
      const urls = [];
      for (const child of node.children) {
        if (child.type === 'link') {
          urls.push(child.url);
        }
      }

      if (urls.length === 0) return;

      const imagesHtml = urls
        .map((url) => `<img src="${url}" alt="" loading="lazy" />`)
        .join('');

      const htmlNode = {
        type: 'html',
        value: `<div class="image-row">${imagesHtml}</div>`,
      };

      parent.children.splice(index, 1, htmlNode);
    });
  };
}
