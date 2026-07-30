import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import remarkGithubAdmonitionsToDirectives from 'remark-github-admonitions-to-directives';

const base = process.env.BASE_PATH || '/';
const site = process.env.SITE_URL || 'http://localhost:4321';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  markdown: {
    remarkPlugins: [
      [
        remarkGithubAdmonitionsToDirectives,
        {
          mapping: {
            NOTE: 'note',
            TIP: 'tip',
            IMPORTANT: 'note',
            WARNING: 'caution',
            CAUTION: 'danger'
          }
        }
      ]
    ]
  },
  integrations: [
    starlight({
      title: 'VS Live × GitHub Copilot',
      description:
        'Four hands-on GitHub Copilot labs for VS Live Redmond with Kayla Cinnamon and James Montemagno.',
      favicon: '/favicon.svg',
      logo: {
        src: './src/assets/mark.svg',
        replacesTitle: false
      },
      customCss: ['./src/styles/global.css', './src/styles/starlight.css'],
      components: {
        Footer: './src/components/LessonFooter.astro'
      },
      sidebar: [
        { label: 'Workshop home', link: '/' },
        { label: 'Prepare', link: '/prepare/' },
        {
          label: '1 · Copilot CLI',
          items: [
            { label: 'Lab overview', link: '/labs/cli/' },
            { label: 'Setup & context', link: '/labs/cli/01-setup/' },
            { label: 'Plan & scaffold', link: '/labs/cli/02-plan-and-scaffold/' },
            { label: 'Build the game', link: '/labs/cli/03-agent-mode/' },
            { label: 'Design-first theming', link: '/labs/cli/04-design-vibes/' },
            { label: 'Polish & parallel work', link: '/labs/cli/05-polish/' },
            { label: 'Specialized agents', link: '/labs/cli/06-agents/' },
            { label: 'Skills', link: '/labs/cli/07-skills/' },
            { label: 'MCP servers', link: '/labs/cli/08-mcp/' },
            { label: 'Bonus', link: '/labs/cli/09-bonus/' }
          ]
        },
        {
          label: '2 · Copilot App',
          items: [
            { label: 'Lab overview', link: '/labs/copilot-app/' },
            { label: 'Prerequisites', link: '/labs/copilot-app/0-prerequisites/' },
            { label: 'Install the app', link: '/labs/copilot-app/1-install-copilot-app/' },
            { label: 'First agent session', link: '/labs/copilot-app/2-add-star-rating/' },
            { label: 'Custom instructions', link: '/labs/copilot-app/3-custom-instructions/' },
            { label: 'Build with Autopilot', link: '/labs/copilot-app/4-build-filtering/' },
            { label: 'Playwright MCP', link: '/labs/copilot-app/5-mcp-playwright/' },
            { label: 'Agent Merge', link: '/labs/copilot-app/6-agent-merge/' },
            { label: 'Canvases', link: '/labs/copilot-app/7-canvases/' },
            { label: 'Automations', link: '/labs/copilot-app/8-automations/' }
          ]
        },
        {
          label: '3 · Visual Studio 2026',
          items: [
            { label: 'Lab overview', link: '/labs/visual-studio/' },
            { label: 'Setup', link: '/labs/visual-studio/setup/' },
            { label: 'Explore the codebase', link: '/labs/visual-studio/part00-exploring-codebase/' },
            { label: 'Code completion', link: '/labs/visual-studio/part01-code-completion/' },
            { label: 'Inline chat', link: '/labs/visual-studio/part02-enhancing-ui/' },
            { label: 'Reference files', link: '/labs/visual-studio/part03-referencing-files/' },
            { label: 'Custom instructions', link: '/labs/visual-studio/part04-custom-instructions/' },
            { label: 'Copilot Agent', link: '/labs/visual-studio/part05-implementing-features/' },
            { label: 'Copilot Vision', link: '/labs/visual-studio/part06-copilot-vision/' },
            { label: 'Debugging', link: '/labs/visual-studio/part07-debugging-with-copilot/' },
            { label: 'Commit summaries', link: '/labs/visual-studio/part08-commit-summary-descriptions/' },
            { label: 'MCP servers', link: '/labs/visual-studio/part09-mcp/' },
            { label: 'Planning mode', link: '/labs/visual-studio/part10-planning-mode/' },
            { label: 'Prompt files', link: '/labs/visual-studio/part11-reusable-prompts/' },
            { label: 'Delegate to cloud', link: '/labs/visual-studio/part12-delegate-to-cloud/' }
          ]
        },
        {
          label: '4 · Copilot SDK',
          items: [
            { label: 'Lab overview', link: '/labs/copilot-sdk/' },
            { label: 'Preflight', link: '/labs/copilot-sdk/00-preflight/' },
            { label: 'First session', link: '/labs/copilot-sdk/01-first-session/' },
            { label: 'Streaming', link: '/labs/copilot-sdk/02-streaming/' },
            { label: 'Local tools', link: '/labs/copilot-sdk/03-local-tool/' },
            { label: 'MCP safety', link: '/labs/copilot-sdk/04-mcp-safety/' },
            { label: 'Combine tools', link: '/labs/copilot-sdk/05-combine-tools/' },
            { label: 'Structured report', link: '/labs/copilot-sdk/06-structured-report/' },
            { label: 'Run & explain', link: '/labs/copilot-sdk/07-run-explain/' },
            { label: 'Optional: model selection', link: '/labs/copilot-sdk/08-model-selection/' }
          ]
        },
        { label: 'Resources & attribution', link: '/resources/' }
      ]
    })
  ]
});
