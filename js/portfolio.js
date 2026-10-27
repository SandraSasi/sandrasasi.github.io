const projects = {
  entertainment: {
    title: 'Now That’s Entertainment',
    category: 'WEB / WEBSITE',
    description: 'A website project for Now That’s Entertainment, part of my work building websites for businesses.',
    focus: 'Business websites, web development, and presenting a brand online.'
  },
  hotel: {
    title: 'The Hotel Inspector',
    category: 'WEB / WEBSITE',
    description: 'A website project for The Hotel Inspector, bringing a hospitality business to the web.',
    focus: 'Website development and a clear online presence for a business.'
  },
  nfc: {
    title: 'NFC Messaging',
    category: 'MOBILE / ANDROID RESEARCH & DEVELOPMENT',
    description: 'An Android research and development project exploring a messaging application using NFC technology with encryption.',
    focus: 'Android development, near-field communication, and encrypted messaging.'
  },
  qwallat: {
    title: 'Qwallat',
    category: 'DESIGN / PROTOTYPE',
    description: 'A design and prototype project from my earlier portfolio, exploring an idea before taking it into development.',
    focus: 'Design exploration and prototyping.'
  }
};

const filterButtons = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('[data-category]');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    let visible = 0;
    filterButtons.forEach(filter => {
      const active = filter === button;
      filter.classList.toggle('is-active', active);
      filter.setAttribute('aria-pressed', String(active));
    });
    cards.forEach(card => {
      card.hidden = selected !== 'all' && card.dataset.category !== selected;
      if (!card.hidden) visible += 1;
    });
    document.getElementById('filter-status').textContent = `Showing ${visible} ${visible === 1 ? 'project' : 'projects'}.`;
  });
});

const dialog = document.querySelector('.project-dialog');
let projectTrigger;
document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => {
    const project = projects[button.dataset.project];
    if (!project) return;
    projectTrigger = button;
    document.getElementById('dialog-title').textContent = project.title;
    document.getElementById('dialog-category').textContent = project.category;
    document.getElementById('dialog-description').textContent = project.description;
    document.getElementById('dialog-focus').textContent = project.focus;
    dialog.showModal();
    document.body.classList.add('has-dialog');
  });
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('has-dialog');
  projectTrigger?.focus({ preventScroll: true });
});
document.getElementById('year').textContent = String(new Date().getFullYear());
