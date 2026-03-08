 /* ── Cursor ── */
  const cur = document.getElementById('cur');
  const trail = document.getElementById('cur-trail');
  let mx=0, my=0, tx=0, ty=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
  (function loop(){
    cur.style.transform = `translate(${mx-5}px,${my-5}px)`;
    tx += (mx-tx)*0.12; ty += (my-ty)*0.12;
    trail.style.transform = `translate(${tx-20}px,${ty-20}px)`;
    requestAnimationFrame(loop);
  })();

  /* ── Scroll Reveal ── */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('up'); });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));

  /* ── Counter Animate ── */
  function animateCount(el, target, suffix='') {
    const start = performance.now();
    const dur = 1800;
    function step(now) {
      const p = Math.min((now-start)/dur, 1);
      const ease = 1 - Math.pow(1-p, 4);
      el.childNodes[0].textContent = Math.floor(ease * target);
      if(p < 1) requestAnimationFrame(step);
      else el.childNodes[0].textContent = target;
    }
    requestAnimationFrame(step);
  }
  const counterIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting) {
        const el = e.target;
        const t = parseInt(el.dataset.count);
        animateCount(el, t);
        counterIO.unobserve(el);
      }
    });
  }, { threshold:.5 });
  document.querySelectorAll('[data-count]').forEach(el => counterIO.observe(el));

  /* ── Active nav ── */
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(s => { if(window.scrollY >= s.offsetTop - 120) cur = s.id; });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.style.color = a.getAttribute('href')==='#'+cur ? 'var(--aqua)' : '';
    });
  });

  /* ── Contact Form ── */
  document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const st = document.getElementById('fstatus');
    const body = {
      name: document.getElementById('fname').value,
      email: document.getElementById('femail').value,
      subject: document.getElementById('fsubject').value,
      message: document.getElementById('fmessage').value
    };
    st.className = 'form-status loading';
    st.textContent = '// Sending...';
    try {
      const res = await fetch('/api/contact', {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify(body)
      });
      if(res.ok) {
        st.className = 'form-status success';
        st.textContent = '// Message sent! I\'ll get back to you soon.';
        this.reset();
      } else { throw new Error(); }
    } catch {
      st.className = 'form-status error';
      st.textContent = '// Failed. Email me directly: sumananand470@gmail.com';
    }
  });

  /* ── Particles Canvas ── */
  (function() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const COUNT = 80;
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.5 + 0.3,
        dx: (Math.random() - 0.5) * 0.35,
        dy: (Math.random() - 0.5) * 0.35,
        o: Math.random() * 0.5 + 0.1
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,217,255,${p.o})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      });

      // Draw connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i+1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,217,255,${0.06 * (1 - dist/120)})`;
            ctx.lineWidth = .5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  })();

  /* ── Shooting Stars ── */
  (function() {
    function createStar() {
      const hero = document.getElementById('hero');
      if (!hero) return;
      const star = document.createElement('div');
      star.className = 'shooting-star';
      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * (window.innerHeight * 0.6);
      const angle = Math.random() * 30 + 15;
      star.style.cssText = `
        left:${startX}px; top:${startY}px;
        opacity:0; transform:rotate(${angle}deg);
      `;
      hero.appendChild(star);
      let start = null;
      const dur = 900;
      const dist = 200 + Math.random() * 200;
      function animate(ts) {
        if (!start) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        const ease = p < .5 ? 2*p*p : -1+(4-2*p)*p;
        const o = p < .2 ? p/.2 : p > .8 ? (1-p)/.2 : 1;
        star.style.opacity = o * 0.85;
        star.style.left = (startX + ease * dist * Math.cos(angle*Math.PI/180)) + 'px';
        star.style.top  = (startY + ease * dist * Math.sin(angle*Math.PI/180)) + 'px';
        if (p < 1) requestAnimationFrame(animate);
        else star.remove();
      }
      requestAnimationFrame(animate);
    }
    setInterval(createStar, 2200);
    setTimeout(createStar, 600);
  })();

  /* ── Dark / Light Mode Toggle ── */
  (function() {
    const btn    = document.getElementById('themeToggle');
    const icon   = document.getElementById('themeIcon');
    const body   = document.body;

    // Load saved preference, fall back to dark
    const saved = localStorage.getItem('sa-theme') || 'dark';
    applyTheme(saved);

    btn.addEventListener('click', () => {
      const next = body.classList.contains('light') ? 'dark' : 'light';
      applyTheme(next);
      localStorage.setItem('sa-theme', next);

      // Ripple burst effect on toggle
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:fixed; top:50%; left:50%; transform:translate(-50%,-50%) scale(0);
        width:12px; height:12px; border-radius:50%;
        background:var(--aqua); opacity:.18; pointer-events:none; z-index:9998;
        animation: themeRipple .6s ease-out forwards;
      `;
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });

    function applyTheme(theme) {
      if (theme === 'light') {
        body.classList.add('light');
        icon.className = 'fa-solid fa-sun';
        btn.setAttribute('aria-label', 'Switch to dark mode');
      } else {
        body.classList.remove('light');
        icon.className = 'fa-solid fa-moon';
        btn.setAttribute('aria-label', 'Switch to light mode');
      }
    }
  })();
