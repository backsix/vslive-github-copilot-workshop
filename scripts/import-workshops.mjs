import { execFileSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(join(root, 'workshops.sources.json'), 'utf8'));
const sourceRootArg = process.argv.indexOf('--source-root');
const cachedRoot =
  sourceRootArg >= 0 && process.argv[sourceRootArg + 1]
    ? resolve(process.argv[sourceRootArg + 1])
    : null;
const temporaryRoot = cachedRoot ? null : mkdtempSync(join(tmpdir(), 'vslive-workshops-'));
const contentRoot = join(root, 'src', 'content', 'docs', 'labs');
const labsRoot = join(root, 'labs');

const cleanTargets = [
  join(contentRoot, 'cli'),
  join(contentRoot, 'copilot-app'),
  join(contentRoot, 'visual-studio'),
  join(contentRoot, 'copilot-sdk'),
  join(contentRoot, '_images'),
  join(labsRoot, '01-copilot-cli'),
  join(labsRoot, '02-copilot-app'),
  join(labsRoot, '03-visual-studio'),
  join(labsRoot, '04-copilot-sdk')
];

for (const target of cleanTargets) {
  rmSync(target, { recursive: true, force: true });
}
mkdirSync(contentRoot, { recursive: true });
mkdirSync(labsRoot, { recursive: true });

const sources = Object.fromEntries(
  manifest.sources.map((source) => {
    const location = cachedRoot
      ? join(cachedRoot, source.cacheDirectory)
      : join(temporaryRoot, source.cacheDirectory);

    if (!cachedRoot) {
      execFileSync('git', ['clone', '--quiet', '--no-checkout', source.repository, location], {
        stdio: 'inherit'
      });
      execFileSync('git', ['-C', location, 'checkout', '--quiet', source.commit], {
        stdio: 'inherit'
      });
    }

    if (!existsSync(location)) {
      throw new Error(`Missing source cache for ${source.key}: ${location}`);
    }

    const actualCommit = execFileSync('git', ['-C', location, 'rev-parse', 'HEAD'], {
      encoding: 'utf8'
    }).trim();
    if (actualCommit !== source.commit) {
      throw new Error(
        `${source.key} cache is at ${actualCommit}, but workshops.sources.json pins ${source.commit}`
      );
    }

    return [source.key, location];
  })
);

const copyTree = (from, to) => {
  cpSync(from, to, {
    recursive: true,
    filter: (path) => {
      const name = basename(path);
      return !['.git', 'node_modules', 'bin', 'obj'].includes(name);
    }
  });
};

const titleFromMarkdown = (markdown, fallback) => {
  const heading = markdown.match(/^#\s+(.+)$/m)?.[1];
  return (heading || fallback)
    .replaceAll('"', "'")
    .replace(/<[^>]+>/g, '')
    .trim();
};

const stripTrack = (markdown, trackToRemove) =>
  markdown
    .replace(
      new RegExp(
        `<!-- track:${trackToRemove}:start -->[\\s\\S]*?<!-- track:${trackToRemove}:end -->`,
        'g'
      ),
      ''
    )
    .replace(/<!-- track:(?:cli|vscode):(start|end) -->/g, '');

const normalizeLinks = (markdown, isIndex) =>
  markdown.replace(
    /(\]\(|:\s*)(?:\.\/)?([A-Za-z0-9_-]+)\.md(#[^\s)]*)?/g,
    (_, prefix, slug, hash = '') => `${prefix}${isIndex ? './' : '../'}${slug}/${hash}`
  );

const normalizeMarkdown = (sourceFile, destinationFile, options = {}) => {
  let markdown = readFileSync(sourceFile, 'utf8').replace(/\r\n/g, '\n');
  if (options.removeTrack) {
    markdown = stripTrack(markdown, options.removeTrack);
  }

  const isIndex = basename(destinationFile) === 'index.md';
  markdown = normalizeLinks(markdown, isIndex);

  if (options.replacements) {
    for (const [pattern, replacement] of options.replacements) {
      markdown = markdown.replace(pattern, replacement);
    }
  }

  if (markdown.startsWith('---\n')) {
    const end = markdown.indexOf('\n---', 4);
    const frontmatter = markdown.slice(4, end).replace(/^slug:.*\n?/m, '');
    markdown = `---\n${frontmatter.trim()}\n---${markdown.slice(end + 4)}`;
  } else {
    const title = titleFromMarkdown(markdown, basename(sourceFile, '.md'));
    markdown = `---\ntitle: "${title}"\n---\n\n${markdown}`;
  }

  if (options.intro) {
    markdown = markdown.replace(
      /^(---\n[\s\S]*?\n---)\n?/,
      `$1\n\n${options.intro}\n\n`
    );
  }

  mkdirSync(dirname(destinationFile), { recursive: true });
  writeFileSync(destinationFile, markdown.trimEnd() + '\n');
};

const importMarkdownDirectory = (sourceDirectory, destinationDirectory, options = {}) => {
  for (const name of readdirSync(sourceDirectory)) {
    if (!name.endsWith('.md')) continue;
    if (options.exclude?.includes(name)) continue;
    const destinationName = options.indexFile === name ? 'index.md' : name;
    normalizeMarkdown(join(sourceDirectory, name), join(destinationDirectory, destinationName), options);
  }
};

importMarkdownDirectory(
  join(sources.cli, 'workshop'),
  join(contentRoot, 'cli'),
  {
    indexFile: '00-overview.md',
    removeTrack: 'vscode',
    replacements: [
      [
        /> \*\*Duration:\*\*.*$/m,
        '> **Duration:** 60–90 minutes for the facilitated core; advanced deep dives are available if time permits.'
      ],
      [
        /The workshop supports \*\*two tracks\*\*: a VS Code experience and a GitHub Copilot CLI experience\./,
        'This VS Live edition focuses on the GitHub Copilot CLI experience.'
      ],
      [
        /## 🎯 Choose Your Track[\s\S]*?---/,
        '## Workshop path\n\nFollow the CLI instructions throughout this edition. Parts 1–5 form the facilitated core; Parts 6–8 are advanced deep dives, and Part 9 is optional.\n\n---'
      ],
      [
        /> 💡 \*\*Tip:\*\* Use the DevContainer for a pre-configured environment if you want a fast start in VS Code\./,
        '> **Tip:** The included Dev Container provides a pre-configured terminal environment if you prefer containers.'
      ],
      [
        /1\. Open \[github\.com\/copilot-dev-days\/mona-mayhem\][\s\S]*?3\. Name it `my-mona-mayhem` and set visibility to \*\*Public\*\* \(if you created from template\)/,
        `1. Open the \`labs/01-copilot-cli\` folder in this repository.
2. Copy its contents into a new GitHub repository named \`my-mona-mayhem\`.
3. Clone your new repository locally, then continue from that folder.`
      ]
    ]
  }
);

importMarkdownDirectory(
  join(sources['copilot-app'], 'docs', 'app'),
  join(contentRoot, 'copilot-app'),
  {
    indexFile: 'README.md',
    intro:
      '> [!NOTE]\n> This lab uses the separate [Tailspin Toys template repository](https://github.com/github-samples/tailspin-toys). Because the exercises use issues, branches, sessions, and pull requests, Lesson 0 guides you through creating your own GitHub repository from that template.'
  }
);

const appImagesSource = join(sources['copilot-app'], 'docs', '_images');
const appImagesDestination = join(contentRoot, '_images');
mkdirSync(appImagesDestination, { recursive: true });
for (const name of readdirSync(appImagesSource)) {
  if (name.startsWith('app-')) {
    cpSync(join(appImagesSource, name), join(appImagesDestination, name));
  }
}

importMarkdownDirectory(
  join(sources['visual-studio'], 'lab'),
  join(contentRoot, 'visual-studio'),
  {
    replacements: [
      [/\(\.\/images\/4-instructions\.png\)/g, '(./images/04-instructions.png)'],
      [/\(\.\/impags\//g, '(./images/'],
      [/agent mdoe/g, 'agent mode'],
      [
        /## Clone Lab Repository[\s\S]*?The code is now opened in Visual Studio\. Feel free to take a look at it or skip to the next section to start the app\./,
        `## Open the included lab solution

The TinyShop source is included in this combined workshop repository.

1. [] If you need cloud delegation or repository write access, fork this combined workshop repository to your GitHub account and clone your fork.
2. [] In Visual Studio, select **File -> Open -> Project/Solution**.
3. [] Open \`labs/03-visual-studio/src/TinyShop.sln\`.

If an instructor provided a prepared fork, use that repository instead.`
      ]
    ]
  }
);
copyTree(
  join(sources['visual-studio'], 'lab', 'images'),
  join(contentRoot, 'visual-studio', 'images')
);

importMarkdownDirectory(
  join(sources['copilot-sdk'], 'workshop'),
  join(contentRoot, 'copilot-sdk'),
  {
    replacements: [
      [
        /```bash\ngit clone https:\/\/github\.com\/jamesmontemagno\/copilot-sdk-workshop\.git\ncd copilot-sdk-workshop\ncode \.\n```/,
        `\`\`\`bash
cd labs/04-copilot-sdk
code .
\`\`\``
      ],
      [
        /github\.com\/codemillmatt\/copilot-sdk-workshop/g,
        'github.com/jamesmontemagno/copilot-sdk-workshop'
      ]
    ]
  }
);

for (const template of ['visual-studio', 'copilot-sdk']) {
  cpSync(
    join(root, 'scripts', 'templates', `${template}-index.md`),
    join(contentRoot, template, 'index.md')
  );
}

for (const entry of ['.devcontainer', '.vscode', 'public', 'src']) {
  const source = join(sources.cli, entry);
  if (existsSync(source)) copyTree(source, join(labsRoot, '01-copilot-cli', entry));
}
for (const entry of [
  '.gitignore',
  'LICENSE',
  'README.md',
  'astro.config.mjs',
  'package.json',
  'package-lock.json',
  'tsconfig.json'
]) {
  cpSync(join(sources.cli, entry), join(labsRoot, '01-copilot-cli', entry));
}

copyTree(join(sources['visual-studio'], 'src'), join(labsRoot, '03-visual-studio', 'src'));
for (const entry of ['LICENSE', 'README.md', 'eshop.png']) {
  cpSync(
    join(sources['visual-studio'], entry),
    join(labsRoot, '03-visual-studio', entry)
  );
}
copyTree(
  join(sources['visual-studio'], '.github'),
  join(labsRoot, '03-visual-studio', '.github')
);

for (const entry of ['start', 'checkpoints', 'samples', 'src']) {
  copyTree(
    join(sources['copilot-sdk'], entry),
    join(labsRoot, '04-copilot-sdk', entry)
  );
}
for (const entry of ['Directory.Build.props', 'README.md']) {
  cpSync(
    join(sources['copilot-sdk'], entry),
    join(labsRoot, '04-copilot-sdk', entry)
  );
}

if (temporaryRoot) {
  rmSync(temporaryRoot, { recursive: true, force: true });
}

console.log(`Imported ${manifest.sources.length} pinned workshop sources.`);
