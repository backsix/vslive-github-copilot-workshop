import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const docsRoot = join(root, 'src', 'content', 'docs');
const required = [
  'prepare.md',
  'resources.md',
  'labs/cli/index.md',
  'labs/copilot-app/index.md',
  'labs/visual-studio/index.md',
  'labs/copilot-sdk/index.md'
];
const errors = [];

for (const path of required) {
  if (!existsSync(join(docsRoot, path))) errors.push(`Missing required page: ${path}`);
}

const walk = (directory) => {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) walk(path);
    if (entry.isFile() && ['.md', '.mdx'].includes(extname(entry.name))) {
      const markdown = readFileSync(path, 'utf8');
      if (!/^---\r?\n/.test(markdown)) errors.push(`Missing frontmatter: ${path}`);
      if (/]\([^)\s]+\.md(?:#[^)]+)?\)/.test(markdown)) {
        errors.push(`Unnormalized Markdown link: ${path}`);
      }
      for (const image of markdown.matchAll(/!\[[^\]]*]\((?!https?:|data:)([^)\s]+)\)/g)) {
        const imagePath = resolve(path, '..', image[1].split(/[?#]/)[0]);
        if (!existsSync(imagePath)) errors.push(`Missing image ${image[1]} in ${path}`);
      }
    }
  }
};

walk(docsRoot);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Workshop content structure is valid.');
