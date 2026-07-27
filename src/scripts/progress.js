(() => {
  const storageKey = 'vslive-workshop-progress-v1';
  const base = document.querySelector('meta[name="workshop-base"]')?.content || '/';
  const labs = {
    cli: [
      '01-setup',
      '02-plan-and-scaffold',
      '03-agent-mode',
      '04-design-vibes',
      '05-polish',
      '06-agents',
      '07-skills',
      '08-mcp',
      '09-bonus'
    ],
    'copilot-app': [
      '0-prerequisites',
      '1-install-copilot-app',
      '2-add-star-rating',
      '3-custom-instructions',
      '4-build-filtering',
      '5-mcp-playwright',
      '6-agent-merge',
      '7-canvases',
      '8-review'
    ],
    'visual-studio': [
      'setup',
      'part00-exploring-codebase',
      'part01-code-completion',
      'part02-enhancing-ui',
      'part03-referencing-files',
      'part04-custom-instructions',
      'part05-implementing-features',
      'part06-copilot-vision',
      'part07-debugging-with-copilot',
      'part08-commit-summary-descriptions',
      'part09-mcp',
      'part10-planning-mode',
      'part11-reusable-prompts',
      'part12-delegate-to-cloud'
    ],
    'copilot-sdk': [
      '00-preflight',
      '01-first-session',
      '02-streaming',
      '03-local-tool',
      '04-mcp-safety',
      '05-combine-tools',
      '06-structured-report',
      '07-run-explain',
      '08-model-selection'
    ]
  };

  const parseState = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || '{}');
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  };

  const saveState = (state) => localStorage.setItem(storageKey, JSON.stringify(state));
  const state = parseState();
  const normalizedPath = location.pathname.startsWith(base)
    ? location.pathname.slice(base.length)
    : location.pathname.replace(/^\/+/, '');
  const match = normalizedPath.match(/^labs\/([^/]+)\/([^/]+)\/?$/);

  const getLessonId = (href) => {
    const path = new URL(href, location.href).pathname;
    const relativePath = path.startsWith(base) ? path.slice(base.length) : path.replace(/^\/+/, '');
    const lessonMatch = relativePath.match(/^labs\/([^/]+)\/([^/]+)\/?$/);
    if (!lessonMatch || !labs[lessonMatch[1]]?.includes(lessonMatch[2])) return null;
    return `${lessonMatch[1]}/${lessonMatch[2]}`;
  };

  const updateSidebar = () => {
    document.querySelectorAll('.sidebar-content a[href]').forEach((link) => {
      const id = getLessonId(link.href);
      if (!id) return;

      let indicator = link.querySelector('.lesson-complete-indicator');
      let label = link.querySelector('.lesson-complete-label');
      if (!indicator || !label) {
        indicator = document.createElement('span');
        label = document.createElement('span');
        indicator.className = 'lesson-complete-indicator';
        indicator.textContent = '✓';
        indicator.setAttribute('aria-hidden', 'true');
        label.className = 'lesson-complete-label';
        link.append(indicator, label);
      }

      const complete = Boolean(state[id]);
      link.dataset.lessonTracked = '';
      link.dataset.lessonComplete = String(complete);
      label.textContent = complete ? ' — completed' : '';
    });
  };

  const updateLanding = () => {
    let completed = 0;
    let total = 0;
    let resumeHref = `${base}labs/cli/01-setup/`;
    let foundResume = false;

    Object.entries(labs).forEach(([lab, steps]) => {
      const done = steps.filter((step) => state[`${lab}/${step}`]).length;
      completed += done;
      total += steps.length;
      const meter = document.querySelector(`[data-lab-progress="${lab}"]`);
      if (meter) meter.style.transform = `scaleX(${done / steps.length})`;

      if (!foundResume) {
        const next = steps.find((step) => !state[`${lab}/${step}`]);
        if (next) {
          resumeHref = `${base}labs/${lab}/${next}/`;
          foundResume = true;
        }
      }
    });

    const summary = document.querySelector('[data-workshop-summary]');
    const resume = document.querySelector('[data-workshop-resume]');
    if (summary && completed > 0) {
      summary.textContent = `${completed} of ${total} steps complete. Your progress stays in this browser.`;
    }
    if (resume && completed > 0) {
      resume.href = resumeHref;
      resume.firstChild.textContent = completed === total ? 'Review the workshop ' : 'Resume workshop ';
    }
  };

  document.querySelectorAll('.expressive-code pre').forEach((codeBlock) => {
    codeBlock.tabIndex = 0;
    if (!codeBlock.getAttribute('aria-label')) {
      codeBlock.setAttribute('aria-label', 'Scrollable code example');
    }
  });

  if (match && labs[match[1]]?.includes(match[2])) {
    const id = `${match[1]}/${match[2]}`;
    const container = document.querySelector('main .sl-markdown-content');
    if (container) {
      const wrapper = document.createElement('section');
      const status = document.createElement('p');
      const button = document.createElement('button');
      wrapper.className = 'lesson-progress';
      wrapper.setAttribute('aria-label', 'Lesson progress');
      status.setAttribute('aria-live', 'polite');
      button.type = 'button';

      const render = () => {
        const complete = Boolean(state[id]);
        status.textContent = complete
          ? 'This step is complete and saved in this browser.'
          : 'Mark this step complete when you are ready to move on.';
        button.textContent = complete ? 'Completed ✓' : 'Mark step complete';
        button.dataset.complete = String(complete);
        button.setAttribute('aria-pressed', String(complete));
      };

      button.addEventListener('click', () => {
        state[id] = !state[id];
        saveState(state);
        render();
        updateSidebar();
      });

      render();
      wrapper.append(status, button);
      container.append(wrapper);
    }
  }

  updateSidebar();
  updateLanding();
})();
