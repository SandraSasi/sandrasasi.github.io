(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const dialog = $('#detail-dialog');
  const content = $('#dialog-content');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let returnFocus = null;
  let toastTimer;

  const projects = {
    entertainment: { title: 'Now That’s Entertainment', category: 'web', label: 'WEB DEVELOPMENT', image: 'img/portfolio_pic4.jpg', description: 'A web project for Now That’s Entertainment, bringing its brand and services to the web.', tags: ['Web development', 'Design'], note: 'A project from my portfolio archive.' },
    hotel: { title: 'The Hotel Inspector', category: 'web', label: 'WEB DEVELOPMENT', image: 'img/portfolio_pic5.jpg', description: 'A hospitality website project for The Hotel Inspector, combining web design and development.', tags: ['Hospitality', 'Web development'], note: 'A project from my portfolio archive.' },
    qwallat: { title: 'Qwallat', category: 'design', label: 'DESIGN / PROTOTYPE', image: 'img/portfolio_pic6.jpg', description: 'A design and prototyping project exploring the way an idea becomes a digital experience.', tags: ['Design', 'Prototype'], note: 'A project from my portfolio archive.' },
    nfc: { title: 'NFC Messaging', category: 'android', label: 'ANDROID DEVELOPMENT', image: 'img/portfolio_pic7.jpg', description: 'An Android messaging application exploring near-field communication on mobile devices.', tags: ['Android', 'Java', 'NFC'], note: 'A project from my portfolio archive.' }
  };

  const tags = (items) => `<div class="detail-tags">${items.map(item => `<span class="tag">${item}</span>`).join('')}</div>`;
  const title = (eyebrow, heading) => `<p class="dialog-eyebrow">${eyebrow}</p><h2 id="dialog-title">${heading}<span>.</span></h2>`;
  const views = {
    about: () => `${title('01 / THE HUMAN BEHIND THE CODE', 'Curiosity is my operating system')}<div class="about-layout"><img class="about-portrait" src="img/profilepic.png" alt="Sandra Sasi" width="140" height="190"><div class="dialog-body"><p>I’m Sandra, a software engineer from Kochi with an entrepreneurial background and a soft spot for building things for the web.</p><p>I specialise in React, JavaScript, and GraphQL, with a focus on usability. My work has ranged from freelance websites and CMS applications to software engineering and Android development.</p><p>I try things to get a taste of them. This interface? A little glimpse of that curiosity.</p></div></div>${tags(['Kochi, India', 'Engineer', 'Entrepreneur', 'Always exploring'])}`,
    skills: () => `${title('01 / CAPABILITIES', 'The tools behind the ideas')}<div class="dialog-body"><p>My toolkit spans interfaces, APIs, and the foundations that hold them together. I enjoy connecting these pieces to build usable, thoughtful experiences.</p></div><div class="skill-detail-grid"><section class="skill-detail"><h3>Interface engineering</h3><p>React, JavaScript, TypeScript, HTML, CSS, responsive web design, and Bootstrap.</p></section><section class="skill-detail"><h3>APIs & application logic</h3><p>C#, ChaiScript, Node.js, GraphQL, Apollo Client, REST APIs, JSON, and PHP.</p></section><section class="skill-detail"><h3>Mobile exploration</h3><p>Java, Android Studio, and near-field communication projects.</p></section><section class="skill-detail"><h3>How I build</h3><p>Usability, object-oriented programming, design patterns, and turning an idea into a working experience.</p></section></div>`,
    experience: () => `${title('02 / FLIGHT LOG', 'Every chapter builds the next')}<div class="timeline"><section class="timeline-item"><span class="timeline-date">2024 — PRESENT</span><h3>TARGOBANK</h3>${tags(['C#'])}</section><section class="timeline-item"><span class="timeline-date">2021 — 2024</span><h3>Mercedes-Benz R&amp;D</h3>${tags(['TypeScript'])}</section><section class="timeline-item"><span class="timeline-date">JULY 2019 — 2021</span><h3>Senior Software Engineer</h3><p class="timeline-company">Opteamix Business Solution</p><p class="dialog-body">JavaScript engineering with React as my specialisation, including work on a US insurance brokerage project for NFP.</p></section><section class="timeline-item"><span class="timeline-date">JULY 2017 / JOINED</span><h3>Junior Developer</h3><p class="timeline-company">Malkove Technologies</p><p class="dialog-body">Built web applications, content management systems, websites, and portfolios.</p></section><section class="timeline-item"><span class="timeline-date">JUNE 2017 / CHAPTER</span><h3>Entrepreneur</h3><p class="timeline-company">Deltafolks Genesis Private Limited</p><p class="dialog-body">Explored the business side of building things, combining an entrepreneurial background with hands-on development.</p></section></div><p class="project-note">Selected chapters in my engineering journey.</p>`,
    projects: () => `${title('03 / SELECTED WORK', 'From curiosity to creation')}<p class="dialog-body">A collection of web, design, and mobile projects from my portfolio.</p><div class="filter-bar" role="group" aria-label="Filter projects"><button class="filter-button active" data-filter="all" aria-pressed="true">ALL WORK</button><button class="filter-button" data-filter="web" aria-pressed="false">WEB</button><button class="filter-button" data-filter="design" aria-pressed="false">DESIGN</button><button class="filter-button" data-filter="android" aria-pressed="false">ANDROID</button></div><div class="project-list">${Object.entries(projects).map(([key, project]) => `<button class="project-detail-card" data-project="${key}" data-category="${project.category}"><img src="${project.image}" alt="${project.title} portfolio archive artwork" width="300" height="130"><div><h3>${project.title} ↗</h3><span class="micro-label">${project.label}</span></div></button>`).join('')}</div>`,
    contact: () => `${title('04 / OPEN A CHANNEL', 'Let’s make something good')}<p class="dialog-body">Have an idea, a project, or just a good conversation in mind? I’d love to hear from you.</p><div class="contact-options"><a class="contact-option" href="mailto:sandrasasi.cek@gmail.com"><i class="fa fa-envelope-o" aria-hidden="true"></i><span><span class="micro-label">SEND A TRANSMISSION</span><strong>sandrasasi.cek@gmail.com</strong></span><span>↗</span></a><a class="contact-option" href="https://www.linkedin.com/in/sandrasasi/" target="_blank" rel="noopener noreferrer"><i class="fa fa-linkedin" aria-hidden="true"></i><span><span class="micro-label">LET’S CONNECT</span><strong>LinkedIn / sandrasasi</strong></span><span>↗</span></a><a class="contact-option" href="https://github.com/sandrasasi" target="_blank" rel="noopener noreferrer"><i class="fa fa-github" aria-hidden="true"></i><span><span class="micro-label">EXPLORE THE CODE</span><strong>GitHub / sandrasasi</strong></span><span>↗</span></a></div><button class="copy-button" id="copy-email">COPY EMAIL ADDRESS +</button>`
  };

  function syncNavigation(view) {
    $$('.dock-item').forEach(item => {
      const active = view === 'overview' ? item.getAttribute('href') === '#overview' : item.dataset.view === view || (view === 'skills' && item.dataset.view === 'about');
      item.classList.toggle('active', active);
      if (active) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    });
  }

  function displayPanel(markup, label, view) {
    if (!dialog.open) returnFocus = document.activeElement;
    content.innerHTML = markup;
    $('#dialog-label').textContent = label;
    document.body.classList.add('dialog-open');
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
    syncNavigation(view);
    $('.dialog-close').focus({ preventScroll: true });
  }

  function openView(view) {
    if (!views[view]) return;
    displayPanel(views[view](), `SS / ${view.toUpperCase()}`, view);
  }

  function openProject(key) {
    const project = projects[key];
    if (!project) return;
    displayPanel(`<button class="back-button" data-view="projects">← ALL PROJECTS</button>${title(project.label, project.title)}<img class="project-detail-image" src="${project.image}" alt="${project.title} portfolio archive artwork"><p class="dialog-body">${project.description}</p>${tags(project.tags)}<p class="project-note">${project.note}</p>`, 'SS / PROJECT ARCHIVE', 'projects');
  }

  function notify(message) {
    clearTimeout(toastTimer);
    $('#toast').textContent = message;
    $('#toast').classList.add('visible');
    toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3000);
  }

  document.addEventListener('click', async (event) => {
    const viewControl = event.target.closest('[data-view]');
    if (viewControl) openView(viewControl.dataset.view);
    const projectControl = event.target.closest('[data-project]');
    if (projectControl) openProject(projectControl.dataset.project);
    const filter = event.target.closest('[data-filter]');
    if (filter) {
      $$('.filter-button', content).forEach(button => {
        const active = button === filter;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      $$('.project-detail-card', content).forEach(card => {
        card.hidden = filter.dataset.filter !== 'all' && card.dataset.category !== filter.dataset.filter;
      });
    }
    if (event.target.closest('#copy-email')) {
      const copyButton = $('#copy-email');
      try {
        await navigator.clipboard.writeText('sandrasasi.cek@gmail.com');
        copyButton.textContent = 'EMAIL COPIED ✓';
        notify('Email address copied. Ready when you are.');
      } catch {
        copyButton.textContent = 'SELECT EMAIL TO COPY';
        const range = document.createRange();
        range.selectNodeContents($('.contact-option strong', content));
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        notify('Email selected. Press Ctrl+C or ⌘C to copy.');
      }
    }
  });

  $('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    syncNavigation('overview');
    if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
  });

  function updateTime() {
    const now = new Date();
    $('#clock').textContent = now.toLocaleTimeString('en-GB', { hour12: false });
    $('#clock').dateTime = now.toISOString();
    $('#year').textContent = now.getFullYear();
  }
  updateTime();
  setInterval(updateTime, 1000);

  const motionToggle = $('#motion-toggle');
  function setMotion(paused) {
    document.documentElement.classList.toggle('motion-paused', paused);
    motionToggle.setAttribute('aria-pressed', String(paused));
    motionToggle.setAttribute('aria-label', paused ? 'Resume interface animations' : 'Pause interface animations');
    motionToggle.title = paused ? 'Resume animations' : 'Pause animations';
  }
  let savedMotion = null;
  try { savedMotion = localStorage.getItem('sandra-motion'); } catch { /* Storage may be unavailable in private contexts. */ }
  setMotion(reducedMotion.matches || savedMotion === 'paused');
  motionToggle.addEventListener('click', () => {
    const paused = !document.documentElement.classList.contains('motion-paused');
    setMotion(paused);
    try { localStorage.setItem('sandra-motion', paused ? 'paused' : 'playing'); } catch { /* Motion controls still work without storage. */ }
  });
  reducedMotion.addEventListener('change', event => setMotion(event.matches));

  const fullscreenToggle = $('#fullscreen-toggle');
  if (!document.fullscreenEnabled) fullscreenToggle.hidden = true;
  fullscreenToggle.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch { notify('Fullscreen is unavailable in this preview.'); }
  });
  document.addEventListener('fullscreenchange', () => {
    fullscreenToggle.setAttribute('aria-label', document.fullscreenElement ? 'Exit fullscreen' : 'Enter fullscreen');
  });

  if (window.matchMedia('(pointer: fine)').matches) {
    let framePending = false;
    let pointerX = 0;
    let pointerY = 0;
    document.addEventListener('pointermove', event => {
      if (reducedMotion.matches || document.documentElement.classList.contains('motion-paused')) return;
      pointerX = (event.clientX / window.innerWidth - .5) * 12;
      pointerY = (event.clientY / window.innerHeight - .5) * 12;
      if (framePending) return;
      framePending = true;
      requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--pointer-x', `${pointerX}px`);
        document.documentElement.style.setProperty('--pointer-y', `${pointerY}px`);
        framePending = false;
      });
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => {
      document.documentElement.style.setProperty('--pointer-x', '0px');
      document.documentElement.style.setProperty('--pointer-y', '0px');
    });
  }
})();
