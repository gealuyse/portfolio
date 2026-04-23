/* ============================================================
   PROJECT WIREFRAME 1-04 — MAIN JAVASCRIPT
   Theme: "Making the complex, clear"
   ============================================================ */

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // ── Custom Cursor ──────────────────────────────────────────
  const cursor = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursor-ring');

  if (cursor && cursorRing) {
    let mouseX = 0, mouseY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.08, ease: 'power2.out' });
      gsap.to(cursorRing, { x: mouseX, y: mouseY, duration: 0.18, ease: 'power2.out' });
    });

    // Hover states for interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .project-card, .personal-card, .tag');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // Inverted cursor on dark sections
    const footer = document.querySelector('.footer');
    if (footer) {
      ScrollTrigger.create({
        trigger: footer,
        start: 'top center',
        end: 'bottom bottom',
        onEnter: () => document.body.classList.add('cursor-inverted'),
        onLeaveBack: () => document.body.classList.remove('cursor-inverted'),
      });
    }
  }


  // ── Loader ─────────────────────────────────────────────────
  const loader = document.getElementById('loader');
  const loaderFill = document.getElementById('loader-bar-fill');

  if (loader && loaderFill) {
    // Animate the loader bar
    gsap.to(loaderFill, {
      width: '100%',
      duration: 1.6,
      ease: 'power2.inOut',
      onComplete: () => {
        gsap.to(loader, {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.inOut',
          onComplete: () => {
            loader.style.display = 'none';
            document.body.classList.remove('is-loading');
            // Trigger entrance animations after loader
            animateEntrance();
          }
        });
      }
    });
  } else {
    document.body.classList.remove('is-loading');
    animateEntrance();
  }


  // ── Header Hide/Show on Scroll ─────────────────────────────
  const header = document.querySelector('.header');
  let lastScrollY = 0;

  if (header) {
    ScrollTrigger.create({
      start: 'top -100',
      onUpdate: (self) => {
        const currentScrollY = self.scroll();
        if (currentScrollY > lastScrollY && currentScrollY > 300) {
          header.classList.add('hidden');
        } else {
          header.classList.remove('hidden');
        }
        lastScrollY = currentScrollY;
      }
    });
  }


  // ── Hero SVG Wireframe Animation (5-Phase) ─────────────────
  const heroSection = document.getElementById('hero');

  if (heroSection) {
    initHeroAnimation();
  }


  // ── Scroll Reveal Animations ───────────────────────────────
  initScrollReveals();


  // ── Smooth Scroll for Nav Links ────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        const offset = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
});


/* ================================================================
   HERO ANIMATION — 5-Phase Scroll-Driven SVG Assembly
   Undefined → First Rule → Structure → Interface Logic → Calm
   ================================================================ */

function initHeroAnimation() {
  // Fragment definitions: each SVG element with its scattered position
  const frags = [
    { id: '#f-c-tl',     x: -80,  y: -150, r: 15,   offX: -4,  offY: -2,  offR: 1   },
    { id: '#f-c-tr',     x: 120,  y: -90,  r: -45,  offX: 5,   offY: -3,  offR: -1  },
    { id: '#f-c-bl',     x: -140, y: 180,  r: -20,  offX: -3,  offY: 4,   offR: 0   },
    { id: '#f-c-br',     x: 200,  y: 220,  r: 70,   offX: 6,   offY: 5,   offR: -2  },
    { id: '#f-e-l',      x: -100, y: 30,   r: -5,   offX: -2,  offY: 0,   offR: 0   },
    { id: '#f-e-r',      x: 150,  y: 50,   r: 10,   offX: 3,   offY: 0,   offR: 1   },
    { id: '#f-nav-txt',  x: -50,  y: -200, r: 80,   offX: 0,   offY: -5,  offR: 2   },
    { id: '#f-nav-ico',  x: 100,  y: -250, r: -60,  offX: 2,   offY: -4,  offR: 0   },
    { id: '#f-nav-div',  x: 0,    y: -120, r: 5,    offX: 0,   offY: -3,  offR: 0   },
    { id: '#f-t1',       x: -200, y: -50,  r: -15,  offX: -4,  offY: -8,  offR: -1  },
    { id: '#f-t2',       x: -180, y: 20,   r: 25,   offX: -2,  offY: -12, offR: 1   },
    { id: '#f-img-t',    x: 40,   y: -100, r: -10,  offX: 0,   offY: -4,  offR: 0   },
    { id: '#f-img-b',    x: -60,  y: 150,  r: 5,    offX: 0,   offY: 4,   offR: 0   },
    { id: '#f-img-l',    x: -120, y: 80,   r: 35,   offX: -4,  offY: 0,   offR: 0   },
    { id: '#f-img-r',    x: 250,  y: -20,  r: -45,  offX: 12,  offY: 2,   offR: -8  },
    { id: '#f-img-diag', x: 300,  y: 100,  r: 60,   offX: 18,  offY: 15,  offR: 12  },
    { id: '#f-l1',       x: -150, y: 120,  r: 10,   offX: -3,  offY: 8,   offR: 0   },
    { id: '#f-l2',       x: 100,  y: 160,  r: -20,  offX: 4,   offY: 4,   offR: -1  },
    { id: '#f-l3',       x: -220, y: 200,  r: 30,   offX: -2,  offY: -2,  offR: 1   },
    { id: '#f-l4',       x: 80,   y: 280,  r: -15,  offX: 5,   offY: -6,  offR: 0   },
    { id: '#f-cta-l',    x: -180, y: 320,  r: 40,   offX: -5,  offY: 5,   offR: 2   },
    { id: '#f-cta-r',    x: 220,  y: 250,  r: -50,  offX: 4,   offY: 3,   offR: -1  }
  ];

  // Set initial scattered state
  frags.forEach(f => {
    gsap.set(f.id, {
      x: f.x,
      y: f.y,
      rotation: f.r,
      transformOrigin: 'center'
    });
  });

  // Master scroll-driven timeline
  const mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2
    }
  });

  /* Phase 1–3: Assembly — fragments drift toward near-alignment (with offsets) */
  mainTl.addLabel('assembly', 0);
  frags.forEach((f, i) => {
    mainTl.to(f.id, {
      x: f.offX,
      y: f.offY,
      rotation: f.offR,
      duration: 0.5,
      ease: 'power2.inOut'
    }, i * 0.008); // slight stagger
  });

  // Show alignment traces
  mainTl.to('.trace', { opacity: 0.3, duration: 0.3 }, 0.15);

  /* Phase 4: Final Lock — everything snaps to 0,0,0 */
  mainTl.addLabel('lock', 0.55);
  frags.forEach((f, i) => {
    mainTl.to(f.id, {
      x: 0,
      y: 0,
      rotation: 0,
      duration: 0.3,
      ease: 'back.out(1.7)'
    }, 0.55 + i * 0.005);
  });

  /* Phase 5: Calm Clarity — traces fade, text reveals */
  mainTl.to('.trace', { opacity: 0, duration: 0.2 }, 0.7);
  mainTl.to('.hero-content', {
    opacity: 1,
    y: 0,
    duration: 0.35,
    ease: 'power2.out'
  }, 0.78);
  mainTl.to('.svg-container', {
    opacity: 0.08,
    duration: 0.35
  }, 0.78);
}


/* ================================================================
   SCROLL REVEAL — Staggered entrance for sections
   ================================================================ */

function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal');

  reveals.forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out'
        });
      }
    });
  });

  // Staggered reveals for card groups
  const staggerGroups = document.querySelectorAll('.stagger-group');
  staggerGroups.forEach(group => {
    const children = group.querySelectorAll('.stagger-item');
    ScrollTrigger.create({
      trigger: group,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(children, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out'
        });
      }
    });
  });
}


/* ================================================================
   ENTRANCE ANIMATIONS — Runs after loader completes
   ================================================================ */

function animateEntrance() {
  const tl = gsap.timeline();

  // Header slides in
  tl.from('.header', {
    y: -64,
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out'
  }, 0.1);

  // Hero name + title (initial state before scroll animation takes over)
  // The SVG fragments are already set via initHeroAnimation
}
