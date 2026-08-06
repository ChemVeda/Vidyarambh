/* =====================================================
   VIDYARAMBH — shared script
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav toggle ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Active nav link for current page ---------- */
  const current = (document.body.dataset.page || '').trim();
  document.querySelectorAll('.nav-links a[data-nav]').forEach(a => {
    if (a.dataset.nav === current) a.classList.add('active');
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('in'), i * 40);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- Floating bubbles (ambient, decorative) ---------- */
  document.querySelectorAll('.bubble-field').forEach(field => {
    const count = 10;
    for (let i = 0; i < count; i++) {
      const b = document.createElement('span');
      const size = 10 + Math.random() * 26;
      b.className = 'bubble';
      b.style.width = size + 'px';
      b.style.height = size + 'px';
      b.style.left = Math.random() * 100 + '%';
      b.style.animationDuration = (8 + Math.random() * 8) + 's';
      b.style.animationDelay = (Math.random() * 8) + 's';
      field.appendChild(b);
    }
  });

  /* ---------- Kites drifting across hero (decorative) ---------- */
  document.querySelectorAll('.kite-field').forEach(field => {
    const colors = ['#FFA630', '#FF6F59', '#2FA8D5', '#2F6B3A'];
    for (let i = 0; i < 3; i++) {
      const k = document.createElement('div');
      k.className = 'kite';
      k.style.top = (10 + Math.random() * 50) + '%';
      k.style.animationDuration = (12 + Math.random() * 8) + 's';
      k.style.animationDelay = (i * 4) + 's';
      const color = colors[i % colors.length];
      k.innerHTML = `<svg viewBox="0 0 40 40"><polygon points="20,2 38,20 20,38 2,20" fill="${color}" stroke="#fff" stroke-width="1.5"/><line x1="20" y1="38" x2="26" y2="50" stroke="${color}" stroke-width="2"/></svg>`;
      field.appendChild(k);
    }
  });

  /* ---------- Balloon pop (hero interactive fun) ---------- */
  document.querySelectorAll('.balloon').forEach(balloon => {
    balloon.addEventListener('click', () => {
      if (balloon.classList.contains('pop')) return;
      balloon.classList.add('pop');
      const rect = balloon.getBoundingClientRect();
      burstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 18);
      setTimeout(() => {
        balloon.classList.remove('pop');
      }, 3500);
    });
  });

  /* ---------- Mascot speech bubble ---------- */
  const mascotWrap = document.querySelector('.mascot-wrap');
  if (mascotWrap) {
    const bubble = mascotWrap.querySelector('.speech-bubble');
    const messages = [
      'Namaste! 👋',
      'We track smiles, not just grades!',
      'Play is how I learn best!',
      'No heavy bags here!',
      'Chetna Satra starts at 8:35 AM!',
      'Admissions are open now!'
    ];
    let msgIndex = 0;
    let talkTimeout;

    const showMessage = () => {
      bubble.textContent = messages[msgIndex % messages.length];
      msgIndex++;
      mascotWrap.classList.add('talking');
      clearTimeout(talkTimeout);
      talkTimeout = setTimeout(() => mascotWrap.classList.remove('talking'), 2600);
    };

    mascotWrap.addEventListener('click', () => {
      showMessage();
      const rect = mascotWrap.getBoundingClientRect();
      burstConfetti(rect.left + rect.width / 2, rect.top + 20, 14);
    });

    // greet automatically once, shortly after load
    setTimeout(showMessage, 1200);
  }

  /* ---------- Gallery lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    document.querySelectorAll('.gallery-item img').forEach(img => {
      img.addEventListener('click', () => {
        lightboxImg.src = img.src.replace('w=600', 'w=1400');
        lightboxImg.alt = img.alt;
        lightbox.classList.add('open');
      });
    });
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
        lightbox.classList.remove('open');
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') lightbox.classList.remove('open');
    });
  }

  /* ---------- Enquiry form -> WhatsApp deep link ---------- */
  const enquiryForm = document.getElementById('enquiryForm');
  if (enquiryForm) {
    const formStatus = document.getElementById('formStatus');
    enquiryForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('parentName').value.trim();
      const age = document.getElementById('childAge').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !age || !phone) {
        formStatus.textContent = "Please fill in your name, child's age and phone number.";
        formStatus.style.color = 'var(--coral)';
        return;
      }

      const text = `Hello Vidyarambh School! I'd like to enquire about admissions.%0A%0AParent's Name: ${encodeURIComponent(name)}%0AChild's Age: ${encodeURIComponent(age)}%0APhone: ${encodeURIComponent(phone)}%0AMessage: ${encodeURIComponent(message || 'N/A')}`;
      const waLink = `https://wa.me/918252085214?text=${text}`;
      formStatus.textContent = 'Opening WhatsApp…';
      formStatus.style.color = 'var(--peepal-deep)';
      burstConfetti(window.innerWidth / 2, window.innerHeight / 3, 40);
      window.open(waLink, '_blank');
      enquiryForm.reset();
    });
  }

  /* ---------- Big CTA confetti reward (once per session) ---------- */
  document.querySelectorAll('[data-confetti]').forEach(el => {
    el.addEventListener('click', () => {
      const rect = el.getBoundingClientRect();
      burstConfetti(rect.left + rect.width / 2, rect.top, 26);
    });
  });
});

/* =====================================================
   Lightweight confetti burst (no external library)
   ===================================================== */
function burstConfetti(x, y, count) {
  let canvas = document.getElementById('confettiCanvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'confettiCanvas';
    document.body.appendChild(canvas);
  }
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  const colors = ['#FFA630', '#FF6F59', '#2FA8D5', '#2F6B3A', '#FFD166'];

  const particles = Array.from({ length: count }, () => ({
    x, y,
    vx: (Math.random() - 0.5) * 9,
    vy: Math.random() * -8 - 3,
    size: 5 + Math.random() * 5,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 14,
    gravity: 0.28,
    life: 0,
    maxLife: 70 + Math.random() * 30
  }));

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    particles.forEach(p => {
      if (p.life >= p.maxLife) return;
      alive = true;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.life++;
      const opacity = 1 - p.life / p.maxLife;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(opacity, 0);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });
    if (alive) {
      requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  requestAnimationFrame(frame);
}
