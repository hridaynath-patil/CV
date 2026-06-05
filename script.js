document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. Ambient Mouse Glow Tracking
     ========================================== */
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth out the coordinates using lerp
  function updateBackgroundGlow() {
    currentX += (mouseX - currentX) * 0.1;
    currentY += (mouseY - currentY) * 0.1;

    document.body.style.setProperty('--mouse-x', `${currentX}px`);
    document.body.style.setProperty('--mouse-y', `${currentY}px`);

    requestAnimationFrame(updateBackgroundGlow);
  }
  updateBackgroundGlow();


  /* ==========================================
     2. Accent Theme Switcher
     ========================================== */
  const accentButtons = document.querySelectorAll('.accent-btn');
  
  // Load saved accent
  const savedAccent = localStorage.getItem('portfolio-accent') || 'violet';
  setAccent(savedAccent);

  accentButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const accent = btn.getAttribute('data-accent');
      setAccent(accent);
    });
  });

  function setAccent(accentName) {
    document.body.setAttribute('data-accent', accentName);
    localStorage.setItem('portfolio-accent', accentName);
    
    // Update active button state
    accentButtons.forEach(btn => {
      if (btn.getAttribute('data-accent') === accentName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Make floating badges and indicators match glow color
    document.dispatchEvent(new CustomEvent('accentChanged', { detail: accentName }));
  }


  /* ==========================================
     3. Custom Trailing Cursor
     ========================================== */
  const cursor = document.getElementById('customCursor');
  const cursorDot = document.getElementById('customCursorDot');
  let cursorX = 0, cursorY = 0;
  let dotX = 0, dotY = 0;
  let targetCursorX = 0, targetCursorY = 0;
  let isCursorEnabled = localStorage.getItem('custom-cursor-disabled') !== 'true';

  // Toggle cursor setting
  const cursorToggle = document.getElementById('cursorToggle');
  if (isCursorEnabled) {
    document.body.classList.add('cursor-active');
  } else {
    cursorToggle.style.opacity = '0.5';
  }

  cursorToggle.addEventListener('click', () => {
    isCursorEnabled = !isCursorEnabled;
    if (isCursorEnabled) {
      document.body.classList.add('cursor-active');
      cursorToggle.style.opacity = '1';
      localStorage.setItem('custom-cursor-disabled', 'false');
      showToast('🎯 Custom cursor enabled', 'info');
    } else {
      document.body.classList.remove('cursor-active');
      cursorToggle.style.opacity = '0.5';
      localStorage.setItem('custom-cursor-disabled', 'true');
      showToast('🎯 Custom cursor disabled', 'info');
    }
  });

  // Only run if desktop (no touchscreen)
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  if (!isTouchDevice) {
    window.addEventListener('mousemove', (e) => {
      targetCursorX = e.clientX;
      targetCursorY = e.clientY;
    });

    function renderCursor() {
      if (isCursorEnabled) {
        // Lerp for trailing outer cursor
        cursorX += (targetCursorX - cursorX) * 0.15;
        cursorY += (targetCursorY - cursorY) * 0.15;
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;

        // Direct position for the inner dot
        dotX += (targetCursorX - dotX) * 0.4;
        dotY += (targetCursorY - dotY) * 0.4;
        cursorDot.style.left = `${dotX}px`;
        cursorDot.style.top = `${dotY}px`;
      }
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // Hover effect class additions
    const hoverables = document.querySelectorAll('a, button, .skill-tag, .project-card, .experience-card, .accent-btn');
    hoverables.forEach(item => {
      item.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
      item.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });
  }


  /* ==========================================
     4. Typewriter Title Effect
     ========================================== */
  const words = ["Software Engineer", "Full Stack Developer", "Problem Solver"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typewriterElement = document.getElementById('typewriter');

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      // Remove character
      typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // Add character
      typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentWord.length) {
      // Pause at full word
      typeSpeed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      // Move to next word
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 400;
    }

    setTimeout(type, typeSpeed);
  }
  
  // Start the loop
  setTimeout(type, 1000);


  /* ==========================================
     5. Mobile Menu Toggle & Navigation
     ========================================== */
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.mobile-link');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('open');
    mobileDrawer.classList.toggle('open');
    document.body.classList.toggle('no-scroll');
  });

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('open');
      mobileDrawer.classList.remove('open');
      document.body.classList.remove('no-scroll');
    });
  });


  /* ==========================================
     6. Skill Tag Interactive Tooltip Map
     ========================================== */
  const skillTags = document.querySelectorAll('.skill-tag');
  const tooltipElement = document.getElementById('skillTooltip');
  const tooltipValue = document.getElementById('skillTooltipValue');

  skillTags.forEach(tag => {
    tag.addEventListener('mouseenter', () => {
      // Highlight siblings
      skillTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');

      const projectData = tag.getAttribute('data-projects');
      tooltipValue.textContent = projectData;
      tooltipElement.classList.add('active');
    });

    tag.addEventListener('mouseleave', () => {
      tag.classList.remove('active');
      tooltipElement.classList.remove('active');
      tooltipValue.textContent = "Select a skill to inspect";
    });
  });


  /* ==========================================
     7. Scroll Spy active Navigation
     ========================================== */
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 250)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });


  /* ==========================================
     8. Projects Database & Detail Modals
     ========================================== */
  const projectsData = {
    'smart-dash': {
      title: "Smart Productivity Dashboard",
      tags: ["React.js", "Node.js", "MongoDB", "Express.js"],
      description: "A comprehensive and elegantly designed full-stack productivity dashboard that brings your tasks, rich notes, and personal financial management into a single unified space.",
      metrics: [
        "Built a cohesive system grouping Task Manager, Rich Notes, and a personal Finance tracker (Money Dash) under a MERN stack architecture.",
        "Engineered interactive finance features (Income, Expense logs, Category management) with custom interactive time-series AreaCharts plotting net balances.",
        "Implemented secure login & signups, dynamic user profile avatar uploads, and active theme switches synchronized across the app."
      ],
      stats: { "React.js": 45, "Node.js": 35, "MongoDB": 20 },
      source: "https://github.com/hridaynath-patil/SmartDash-Project.git",
      live: "https://smartdash-project.onrender.com/"
    },
    'anna-seva': {
      title: "अन्न सेवा (Anna Seva)",
      tags: ["Next.js 16", "SQLite", "Vanilla CSS", "App Router"],
      description: "An elegantly designed, full-stack food rescue and redistribution web application. Operated under the patronage of the Shri Vishwanathrao Shamrao Patil Charitable Trust, Anna Seva connects verified donors (banquets, caterers, restaurants, and households) with local recipient organizations (NGOs, shelter homes, and volunteers) to direct surplus food batches to those who need them most.",
      metrics: [
        "Developed under Next.js 16 (React 19) utilizing the modern App Router paradigm, using Next.js Turbopack for compilation and Vanilla CSS for dynamic interfaces.",
        "Engineered native Node.js SQLite (DatabaseSync) backend, configured with Write-Ahead Logging (WAL) and 10-second busy timeout to support smooth concurrent page rendering.",
        "Implemented secure donor authentication & registration flow with default pending status requiring direct Admin Approval.",
        "Created an interactive Available Food Directory with search & filters, a compact responsive tabular layout, and an Allocation Request claim modal.",
        "Designed a Donor Management Panel featuring listed food logs, incoming recipient request lists, impact dashboards, and read-only profile summaries.",
        "Built an Administrator Control Panel auditing trust metrics, verifying donor registrations (Approve/Reject/Remove), auditing food/allocation lists, and managing dynamic locations and static content."
      ],
      stats: { "Next.js 16": 45, "SQLite": 30, "Vanilla CSS": 25 },
      source: "https://github.com/hridaynath-patil/Anna-Seva",
      live: "https://vspatilcharitabletrust.online/"
    },
    'ebay-clone': {
      title: "eBay Clone",
      tags: ["React", "FastAPI", "MySQL", "Python"],
      description: "A comprehensive and elegantly designed full-stack e-commerce replica of eBay, bringing product discovery, listing categories, shopping cart management, and user authentication into a single unified space.",
      metrics: [
        "Built a comprehensive full-stack e-commerce system with auto-sliding carousels, Urgency & FOMO badges, and multi-action checkout flows.",
        "Engineered secure authentication endpoints using Python and FastAPI, combined with responsive multi-tab (Personal/Business) registration panels.",
        "Designed relational database schemas in MySQL to manage user profiles, dynamic shopping carts, and a seeded product inventory."
      ],
      stats: { "React": 40, "FastAPI": 30, "MySQL": 20, "CSS": 10 },
      source: "https://github.com/hridaynath-patil/Ebay_clone",
      live: "https://hridaynath-patil.github.io/Ebay_clone/"
    }
  };

  // Cache-resilience alias for legacy food-seva data-project-id clicks
  projectsData['food-seva'] = projectsData['anna-seva'];

  const projectCards = document.querySelectorAll('.project-card');
  const modal = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalTags = document.getElementById('modalTags');
  const modalDesc = document.getElementById('modalDesc');
  const modalMetrics = document.getElementById('modalMetrics');
  const modalStatsBars = document.getElementById('modalStatsBars');
  const modalSourceLink = document.getElementById('modalSourceLink');
  const modalLiveLink = document.getElementById('modalLiveLink');

  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.getAttribute('data-project-id');
      const data = projectsData[projectId];
      if (data) {
        openProjectModal(data);
      }
    });
  });

  function openProjectModal(data) {
    // Inject Info
    modalTitle.textContent = data.title;
    
    // Inject Tags
    modalTags.innerHTML = '';
    data.tags.forEach(tag => {
      const span = document.createElement('span');
      span.textContent = tag;
      modalTags.appendChild(span);
    });
    
    // Inject Desc
    modalDesc.textContent = data.description;
    
    // Inject Metrics
    modalMetrics.innerHTML = '';
    data.metrics.forEach(metric => {
      const li = document.createElement('li');
      li.textContent = metric;
      modalMetrics.appendChild(li);
    });

    // Inject Stats
    modalStatsBars.innerHTML = '';
    Object.keys(data.stats).forEach(lang => {
      const val = data.stats[lang];
      const barGroup = document.createElement('div');
      barGroup.className = 'stat-bar-group';
      barGroup.innerHTML = `
        <div class="bar-label-group">
          <span class="bar-label">${lang}</span>
          <span class="bar-percentage">${val}%</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill" style="width: 0%"></div>
        </div>
      `;
      modalStatsBars.appendChild(barGroup);
      
      // Trigger width animation shortly after modal display
      setTimeout(() => {
        const fill = barGroup.querySelector('.bar-fill');
        if (fill) fill.style.width = `${val}%`;
      }, 150);
    });

    // Set link
    modalSourceLink.href = data.source;
    if (data.live) {
      modalLiveLink.href = data.live;
      modalLiveLink.style.display = 'inline-flex';
    } else {
      modalLiveLink.style.display = 'none';
    }

    // Show Modal
    modal.classList.add('open');
    document.body.classList.add('no-scroll');
  }

  function closeProjectModal() {
    modal.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }

  modalClose.addEventListener('click', closeProjectModal);
  
  // Close Modal on outer click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeProjectModal();
    }
  });

  // Close Modal on Escape Key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeProjectModal();
    }
  });


  /* ==========================================
     9. Interactive Contact Form Submission
     ========================================== */
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text-content');
  const btnLoader = submitBtn.querySelector('.btn-loader');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Clear previous validations
    const inputs = [nameInput, emailInput, messageInput];
    inputs.forEach(input => input.classList.remove('invalid'));

    let isValid = true;

    // Name Validation
    if (nameInput.value.trim() === '') {
      nameInput.classList.add('invalid');
      isValid = false;
    }

    // Message Validation
    if (messageInput.value.trim() === '') {
      messageInput.classList.add('invalid');
      isValid = false;
    }

    // Email Validation (Regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      emailInput.classList.add('invalid');
      isValid = false;
    }

    if (!isValid) {
      showToast('❌ Please fill all required fields correctly', 'error');
      return;
    }

    // Trigger loading sequence
    submitBtn.disabled = true;
    btnText.style.opacity = '0';
    btnLoader.classList.remove('hidden');

    // Simulate mock API request delay
    setTimeout(() => {
      // Transition to success state
      btnLoader.classList.add('hidden');
      submitBtn.classList.add('success');
      submitBtn.innerHTML = '<span>Success! Sent ✓</span>';
      
      showToast('🚀 Message received! Thanks for reaching out.', 'success');
      
      // Reset form values
      setTimeout(() => {
        contactForm.reset();
        submitBtn.classList.remove('success');
        submitBtn.innerHTML = `
          <span class="btn-text-content">Send Message</span>
          <div class="btn-loader hidden">
            <div class="spinner"></div>
          </div>
        `;
        submitBtn.disabled = false;
      }, 4000);

    }, 1800);
  });


  /* ==========================================
     10. Toast Notification System
     ========================================== */
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast hover-glow`;
    
    let icon = '🔔';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'info') icon = '🎯';

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
    `;

    toastContainer.appendChild(toast);
    
    // Trigger entry transition
    setTimeout(() => toast.classList.add('show'), 50);

    // Auto removal
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

});
