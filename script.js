// -----------------------------
// Smooth scroll for nav links
// -----------------------------
document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    if (this.getAttribute('href').startsWith('#')) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// -----------------------------
// Hero background animation (tech-like particle network)
// -----------------------------
const canvas = document.getElementById('hero-bg');
if (canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particlesArray = [];
  const particleCount = 80;

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 1 - 0.5;
      this.speedY = Math.random() * 1 - 0.5;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
      if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }
    draw() {
      ctx.fillStyle = '#00d4ff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function init() {
    particlesArray = [];
    for (let i = 0; i < particleCount; i++) {
      particlesArray.push(new Particle());
    }
  }

  function connect() {
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 120) {
          ctx.strokeStyle = 'rgba(0,212,255,0.2)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => { p.update(); p.draw(); });
    connect();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
  });

  init();
  animate();
}

// -----------------------------
// Scroll reveal effect (replays)
// -----------------------------
const reveals = document.querySelectorAll('.reveal');
if (reveals.length > 0) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('active');
        }, index * 150);
      } else {
        entry.target.classList.remove('active');
      }
    });
  }, { threshold: 0.2 });

  reveals.forEach(r => revealObserver.observe(r));
}

// -----------------------------
// Typing animation for hero title (replays)
// -----------------------------
const typingTarget = document.querySelector('.hero h1');
if (typingTarget) {
  const fullText = "Welcome to CreativeGrid";
  let typingIndex = 0;
  let typingInterval;

  function startTyping() {
    typingTarget.textContent = "";
    typingIndex = 0;
    clearInterval(typingInterval);
    typingInterval = setInterval(() => {
      typingTarget.textContent += fullText.charAt(typingIndex);
      typingIndex++;
      if (typingIndex >= fullText.length) {
        clearInterval(typingInterval);
      }
    }, 100); // typing speed
  }

  // Run once on load
  startTyping();

  // Replay typing when hero comes back into view
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startTyping();
      } else {
        clearInterval(typingInterval);
        typingTarget.textContent = ""; // reset when leaving
      }
    });
  }, { threshold: 0.6 });

  heroObserver.observe(typingTarget);
}

// -----------------------------
// GALLERY PAGE
// -----------------------------
const filterButtons = document.querySelectorAll('.filter-bar button');
const galleryItems = document.querySelectorAll('.gallery-item');

if (filterButtons.length > 0 && galleryItems.length > 0) {
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // active button highlight
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        if (category === 'all' || item.classList.contains(category)) {
          item.style.display = 'block';
          setTimeout(() => item.style.opacity = '1', 50);
        } else {
          item.style.opacity = '0';
          setTimeout(() => item.style.display = 'none', 300);
        }
      });
    });
  });
}

// -----------------------------
// Reactions (likes/hearts/etc.)
// -----------------------------
document.querySelectorAll('.reactions span').forEach(reaction => {
  reaction.addEventListener('click', () => {
    let count = parseInt(reaction.getAttribute('data-count')) || 0;
    count++;
    reaction.setAttribute('data-count', count);
    reaction.innerHTML = reaction.getAttribute('data-icon') + " " + count;
  });
});

// -----------------------------
// Lightbox for gallery images
// -----------------------------
const lightboxLinks = document.querySelectorAll('.gallery-item a');
if (lightboxLinks.length > 0) {
  lightboxLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const imgSrc = link.getAttribute('href');
      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.innerHTML = `<img src="${imgSrc}" alt=""><span class="close">&times;</span>`;
      document.body.appendChild(lightbox);

      // Close on click
      lightbox.addEventListener('click', (e) => {
        if (e.target.classList.contains('close') || e.target === lightbox) {
          lightbox.remove();
        }
      });
    });
  });
}
