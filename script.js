// --- Spotlight Effect ---
// Adds a glowing gradient that follows the mouse cursor on cards
function initSpotlights() {
  document.querySelectorAll('.spotlight').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    });
  });
}

// --- Smooth Scroll for Anchor Links ---
// (CSS scroll-margin-top handles the navbar offset, see style.css)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      closeMobileNav();
    }
  });
});

// --- Navbar Blur Effect on Scroll ---
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.background = "rgba(228, 232, 230, 0.92)";
    navbar.style.borderBottom = "1px solid var(--border-hover)";
  } else {
    navbar.style.background = "rgba(228, 232, 230, 0.75)";
    navbar.style.borderBottom = "1px solid var(--border)";
  }
});

// --- Mobile Nav Toggle ---
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

function closeMobileNav() {
  if (navLinks && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });
}

// --- Dynamic Footer Year ---
const yearEl = document.getElementById('current-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// --- Projects: loaded dynamically from projects.json ---
// To add a project, just add an entry to projects.json — no HTML/JS editing needed.
async function loadProjects() {
  const container = document.querySelector('.projects-container');
  if (!container) return;

  try {
    const response = await fetch('projects.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const projects = await response.json();

    if (!Array.isArray(projects) || projects.length === 0) {
      container.innerHTML = '<p class="projects-empty">No projects yet — add one in projects.json.</p>';
      return;
    }

    container.innerHTML = projects.map(renderProjectCard).join('');
  } catch (err) {
    console.error('Could not load projects.json:', err);
    container.innerHTML = '<p class="projects-error">Couldn\'t load projects right now. Check that projects.json is present.</p>';
  } finally {
    // Re-bind interactive behavior for the freshly injected cards
    initSpotlights();
  }
}

function renderProjectCard(project) {
  const {
    title = 'Untitled project',
    description = '',
    icon = 'fa-solid fa-code',
    tech = [],
    github,
    live
  } = project;

  const techTags = tech.map(t => `<span>${escapeHtml(t)}</span>`).join('');

  const githubLink = github
    ? `<a href="${escapeHtml(github)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(title)} on GitHub"><i class="fa-brands fa-github"></i></a>`
    : '';
  const liveLink = live
    ? `<a href="${escapeHtml(live)}" target="_blank" rel="noopener noreferrer" aria-label="View ${escapeHtml(title)} live"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>`
    : '';

  return `
    <div class="project-card spotlight">
      <div class="project-content">
        <div class="project-top">
          <i class="${escapeHtml(icon)} folder-icon"></i>
          <div class="links">${githubLink}${liveLink}</div>
        </div>
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(description)}</p>
        <div class="tech-list">${techTags}</div>
      </div>
    </div>
  `;
}

// Minimal HTML-escaping since project data could come from an edited JSON file
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// --- Social/Associative: loaded dynamically from social.json ---
// To add an engagement, just add an entry to social.json — no HTML/JS editing needed.
async function loadSocial() {
  const container = document.querySelector('.social-container');
  if (!container) return;

  try {
    const response = await fetch('social.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const entries = await response.json();

    if (!Array.isArray(entries) || entries.length === 0) {
      container.innerHTML = '<p class="projects-empty">Aucun engagement pour le moment — ajoutez-en un dans social.json.</p>';
      return;
    }

    container.innerHTML = entries.map(renderSocialCard).join('');
  } catch (err) {
    console.error('Could not load social.json:', err);
    container.innerHTML = '<p class="projects-error">Impossible de charger les engagements. Vérifiez que social.json est présent.</p>';
  } finally {
    // Re-bind interactive behavior for the freshly injected cards
    initSpotlights();
  }
}

function renderSocialCard(entry) {
  const {
    org = 'Association',
    role = '',
    period = '',
    description = '',
    icon = 'fa-solid fa-people-group'
  } = entry;

  return `
    <div class="social-card spotlight">
      <div class="social-top">
        <i class="${escapeHtml(icon)} social-icon"></i>
        <span class="social-period">${escapeHtml(period)}</span>
      </div>
      <h3>${escapeHtml(org)}</h3>
      <span class="social-role">${escapeHtml(role)}</span>
      <p>${escapeHtml(description)}</p>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  initSpotlights();
  loadProjects();
  loadSocial();
});
