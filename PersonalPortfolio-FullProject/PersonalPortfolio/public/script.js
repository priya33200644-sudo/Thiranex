const projectList = document.getElementById('projectList');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitButton = document.getElementById('submitButton');
const menuToggle = document.getElementById('menuToggle');
const navigation = document.getElementById('navigation');

document.getElementById('year').textContent = new Date().getFullYear();

menuToggle.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

navigation.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

function addTextElement(parent, tag, text, className = '') {
  const element = document.createElement(tag);
  element.textContent = text ?? '';
  if (className) element.className = className;
  parent.appendChild(element);
  return element;
}

async function loadProjects() {
  try {
    const response = await fetch('/api/projects');
    if (!response.ok) throw new Error('Project request failed');

    const projects = await response.json();
    projectList.replaceChildren();

    if (!Array.isArray(projects) || projects.length === 0) {
      addTextElement(projectList, 'p', 'No projects have been added yet.', 'loading');
      return;
    }

    projects.forEach((project, index) => {
      const card = document.createElement('article');
      card.className = 'project-card';

      addTextElement(card, 'span', String(index + 1).padStart(2, '0'), 'project-number');
      addTextElement(card, 'h3', project.title);
      addTextElement(card, 'p', project.description);
      addTextElement(card, 'p', `Technologies: ${project.technologies}`, 'project-tech');

      if (project.project_link) {
        try {
          const url = new URL(project.project_link);
          if (url.protocol === 'https:' || url.protocol === 'http:') {
            const link = document.createElement('a');
            link.href = url.href;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.className = 'project-link';
            link.textContent = 'View Project ↗';
            card.appendChild(link);
          }
        } catch {
          // Invalid links are ignored.
        }
      }

      projectList.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    projectList.replaceChildren();
    addTextElement(
      projectList,
      'p',
      'Unable to load projects. Check that the server and MySQL are running.',
      'loading'
    );
  }
}

contactForm.addEventListener('submit', async event => {
  event.preventDefault();
  formStatus.classList.remove('error');

  const data = {
    name: contactForm.elements.name.value.trim(),
    email: contactForm.elements.email.value.trim(),
    message: contactForm.elements.message.value.trim()
  };

  if (!data.name || !data.email || !data.message) {
    formStatus.textContent = 'Please complete all fields.';
    formStatus.classList.add('error');
    return;
  }

  submitButton.disabled = true;
  formStatus.textContent = 'Sending your message...';

  try {
    const response = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Unable to send message.');

    formStatus.textContent = result.message;
    contactForm.reset();
  } catch (error) {
    formStatus.textContent = error.message || 'Server unavailable. Please try again.';
    formStatus.classList.add('error');
  } finally {
    submitButton.disabled = false;
  }
});

loadProjects();
