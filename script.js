/* ==========================================================================
   PORTAL SELEKSI JURNALISTIK — script.js (VERSI FIXED & ANTI-BUG)
   ========================================================================== */

(() => {
  'use strict';

  /* ========================================================================
     1. DATABASE PESERTA
     Pastikan setiap baris data (kecuali yang paling akhir) diakhiri 
     dengan tanda koma ( , ). Jika lupa koma, web akan error/blank!
     ======================================================================== */
    const peserta = [
    { username: 'JRN26-001', nama: 'Kiki Yuliani', status: 'lulus', divisi: 'Videografi' },
    { username: 'JRN26-002', nama: 'Fadhil Luqmanul Hakim', status: 'lulus', divisi: 'Videografi' },
    { username: 'JRN26-003', nama: 'Keiko Nairuza Chaerani', status: 'lulus', divisi: 'Desain Grafis' },
    { username: 'JRN26-004', nama: 'Anatasya Putri', status: 'lulus', divisi: 'Fotografi' },
    { username: 'JRN26-005', nama: 'Ghandur Mahasin Gharaniq', status: 'lulus', divisi: 'Fotografi' },
    { username: 'JRN26-006', nama: 'Widya Khoerunnisa', status: 'lulus', divisi: 'Fotografi' },
    { username: 'JRN26-007', nama: 'Arvino Azhar Mubarok', status: 'lulus', divisi: 'Artikel' },
    { username: 'JRN26-008', nama: 'Fidela Maulida', status: 'lulus', divisi: 'Kreatif - PJ Desain Grafis' },
    { username: 'JRN26-009', nama: 'Rangga Putra Pratama', status: 'lulus', divisi: 'Videografi' },
    { username: 'JRN26-010', nama: 'Zahira Ramadhania', status: 'lulus', divisi: 'Artikel' },
    { username: 'JRN26-011', nama: 'Nury Damira Rahanayu', status: 'lulus', divisi: 'Kreatif - PJ Editing' },
    // --- DATA TAMBAHAN BARU ---
    { username: 'JRN26-012', nama: 'Witrin Nazwa Saqinah', status: 'lulus', divisi: 'Videografi' },
    { username: 'JRN26-013', nama: 'Nayla Keysheva Adhi', status: 'lulus', divisi: 'Desain Grafis' },
    { username: 'JRN26-014', nama: 'Amelia Wahyudiani', status: 'lulus', divisi: 'Fotografi' },
    { username: 'JRN26-015', nama: 'Syifa Alma Ghaitsa', status: 'lulus', divisi: 'Desain Grafis' },
    { username: 'JRN26-016', nama: 'Rifki Galih Permana', status: 'tidak lulus', divisi: '-' },
    // --- ESTER EGG ---
    { username: 'HANIP', nama: 'HANIP', status: 'lulus', divisi: 'HANIP' }
  ];
   
  /* ========================================================================
     2. UTILITAS UMUM (Diperbaiki agar aman dari Null Error)
     ======================================================================== */
  const $ = (selector, scope = document) => scope ? scope.querySelector(selector) : null;
  const $$ = (selector, scope = document) => scope ? Array.from(scope.querySelectorAll(selector)) : [];

  let screens = {}; // Dideklarasikan di sini, diisi nanti setelah HTML siap

  function showScreen(key) {
    Object.values(screens).forEach((el) => {
      if (el) el.classList.remove('is-active');
    });

    const target = screens[key];
    if (!target) return; // Mencegah error jika layar tidak ditemukan

    void target.offsetWidth;
    target.classList.add('is-active');
    target.scrollTop = 0;
    window.scrollTo(0, 0); // Diperbaiki dari bug 'instant'
  }

  function replayAnimations(root) {
    if (!root) return;
    $$('*', root).forEach((el) => {
      const name = getComputedStyle(el).animationName;
      if (name && name !== 'none') {
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = '';
      }
    });
  }

  /* ========================================================================
     !!! KUNCI PERBAIKAN: Semua logika dijalankan SETELAH HTML siap !!!
     ======================================================================== */
  document.addEventListener('DOMContentLoaded', () => {

    screens = {
      opening: $('#screen-opening'),
      home: $('#screen-home'),
      input: $('#screen-input'),
      loading: $('#screen-loading'),
      pass: $('#screen-result-pass'),
      fail: $('#screen-result-fail'),
      welcome: $('#screen-welcome'),
    };

    /* ========================================================================
       3. PARTICLE BACKGROUND
       ======================================================================== */
    const canvas = $('#particle-canvas');
    let ctx, particles = [], canvasWidth = 0, canvasHeight = 0;

    if (canvas) {
      ctx = canvas.getContext('2d');
      initParticles();
      window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
      });
    }

    function resizeCanvas() {
      if (!canvas) return;
      canvasWidth = canvas.width = window.innerWidth;
      canvasHeight = canvas.height = window.innerHeight;
    }

    function createParticles() {
      const count = Math.min(60, Math.floor((canvasWidth * canvasHeight) / 28000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        r: Math.random() * 1.6 + 0.6,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        alpha: Math.random() * 0.4 + 0.15,
        hue: Math.random() > 0.5 ? '76,125,255' : '55,224,212',
      }));
    }

    function drawParticles() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvasWidth;
        if (p.x > canvasWidth) p.x = 0;
        if (p.y < 0) p.y = canvasHeight;
        if (p.y > canvasHeight) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.hue},${p.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(drawParticles);
    }

    function initParticles() {
      resizeCanvas();
      createParticles();
      drawParticles();
    }

    /* ========================================================================
       4. OPENING SEQUENCE
       ======================================================================== */
    function runOpeningSequence() {
      const bar = $('#opening-loader-bar');
      const label = $('#opening-loader-label');

      if (!bar || !label) return showScreen('home'); // Bypass jika elemen tidak ada

      const messages = [
        'Menyiapkan portal...',
        'Memuat identitas Jurnalistik...',
        'Menyambungkan ke basis data peserta...',
        'Hampir siap...',
      ];

      let step = 0;
      label.textContent = messages[0];

      requestAnimationFrame(() => {
        bar.style.transition = 'width 2.1s cubic-bezier(0.16,1,0.3,1)';
        bar.style.width = '100%';
      });

      const msgInterval = setInterval(() => {
        step += 1;
        if (step < messages.length) {
          label.textContent = messages[step];
        }
      }, 550);

      setTimeout(() => {
        clearInterval(msgInterval);
        showScreen('home');
      }, 2600);
    }

    /* ========================================================================
       5. NAVIGASI HOME <-> INPUT
       ======================================================================== */
    function resetInputForm() {
      const input = $('#input-username');
      const group = $('#input-group');
      const error = $('#input-error');
      if (input) input.value = '';
      if (group) group.classList.remove('has-error');
      if (error) error.textContent = '';
    }

    $('#btn-open-check')?.addEventListener('click', () => {
      resetInputForm();
      showScreen('input');
      setTimeout(() => $('#input-username')?.focus(), 350);
    });

    $('#btn-back-home')?.addEventListener('click', () => showScreen('home'));
    $('#btn-fail-back')?.addEventListener('click', () => showScreen('home'));
    $('#btn-welcome-home')?.addEventListener('click', () => showScreen('home'));
    
    $('#btn-pass-back')?.addEventListener('click', () => {
      resetInputForm();
      showScreen('input');
      setTimeout(() => $('#input-username')?.focus(), 350);
    });

    $('#btn-continue')?.addEventListener('click', () => {
      showScreen('welcome');
      replayAnimations(screens.welcome);
    });

    /* ========================================================================
       6. VALIDASI & PENCARIAN PESERTA
       ======================================================================== */
    $('#input-username')?.addEventListener('input', (e) => {
      e.target.value = e.target.value.toUpperCase();
      $('#input-group')?.classList.remove('has-error');
      if ($('#input-error')) $('#input-error').textContent = '';
    });

    function showInputError(message) {
      const group = $('#input-group');
      const errorEl = $('#input-error');
      if (errorEl) errorEl.textContent = message;
      
      if (group) {
        group.classList.remove('has-error');
        void group.offsetWidth;
        group.classList.add('has-error');
      }
    }

    $('#form-username')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputEl = $('#input-username');
      if (!inputEl) return;
      
      const raw = inputEl.value.trim().toUpperCase();

      if (!raw) {
        showInputError('Username tidak boleh kosong.');
        return;
      }

      const found = peserta.find((p) => p.username.toUpperCase() === raw);

      if (!found) {
        showInputError('Username tidak ditemukan. Silakan periksa kembali username peserta kamu.');
        return;
      }

      startVerification(found);
    });

    /* ========================================================================
       7. LOADING / VERIFICATION ANIMATION
       ======================================================================== */
    const CIRCUMFERENCE = 2 * Math.PI * 42; 

    function resetLoadingScreen() {
      $$('.loading-step').forEach((step) => step.classList.remove('is-active', 'is-done'));
      if ($('#loading-percent')) $('#loading-percent').textContent = '0%';
      if ($('#loading-bar-fill')) $('#loading-bar-fill').style.width = '0%';
      if ($('.loading-spinner-arc')) $('.loading-spinner-arc').style.strokeDashoffset = String(CIRCUMFERENCE);
      if ($('#loading-status')) $('#loading-status').textContent = 'Mohon tunggu sebentar...';
    }

    function setProgress(percent) {
      if ($('#loading-percent')) $('#loading-percent').textContent = `${percent}%`;
      if ($('#loading-bar-fill')) $('#loading-bar-fill').style.width = `${percent}%`;
      const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;
      if ($('.loading-spinner-arc')) $('.loading-spinner-arc').style.strokeDashoffset = String(offset);
    }

    function startVerification(pesertaData) {
      resetLoadingScreen();
      showScreen('loading');

      const steps = $$('.loading-step');
      const stepProgress = [25, 55, 80, 100];
      const stepDelay = 620;

      if (steps.length === 0) {
        return setTimeout(() => revealResult(pesertaData), 1000);
      }

      steps.forEach((step, index) => {
        setTimeout(() => {
          if (index > 0) {
            steps[index - 1]?.classList.remove('is-active');
            steps[index - 1]?.classList.add('is-done');
          }
          step.classList.add('is-active');
          setProgress(stepProgress[index]);

          if (index === steps.length - 1) {
            setTimeout(() => {
              step.classList.remove('is-active');
              step.classList.add('is-done');
              if ($('#loading-status')) $('#loading-status').textContent = 'VERIFICATION COMPLETE';
            }, stepDelay - 150);
          }
        }, index * stepDelay);
      });

      const totalDelay = steps.length * stepDelay + 500;
      setTimeout(() => revealResult(pesertaData), totalDelay);
    }

    /* ========================================================================
       8. TAMPILKAN HASIL SELEKSI
       ======================================================================== */
    function revealResult(data) {
      if (data.status.toLowerCase() === 'lulus') {
        if ($('#pass-nama')) $('#pass-nama').textContent = data.nama;
        if ($('#pass-username')) $('#pass-username').textContent = data.username;
        if ($('#pass-divisi')) $('#pass-divisi').textContent = data.divisi;

        showScreen('pass');
        replayAnimations(screens.pass);
        spawnConfetti();
        enableTilt($('#pass-card'));
      } else {
        if ($('#fail-nama')) $('#fail-nama').textContent = data.nama;
        if ($('#fail-username')) $('#fail-username').textContent = data.username;

        showScreen('fail');
        replayAnimations(screens.fail);
        enableTilt($('#fail-card'));
      }
    }

    /* ---- Confetti ---- */
    function spawnConfetti() {
      const layer = $('#confetti-layer');
      if (!layer) return;
      
      layer.innerHTML = '';
      const colors = ['#34d399', '#4c7dff', '#37e0d4', '#f4f7fc', '#6ee7c2'];

      for (let i = 0; i < 60; i += 1) {
        const piece = document.createElement('span');
        piece.className = 'confetti-piece';
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDuration = `${2.4 + Math.random() * 1.8}s`;
        piece.style.animationDelay = `${Math.random() * 0.6}s`;
        piece.style.opacity = String(0.6 + Math.random() * 0.4);
        piece.style.transform = `rotate(${Math.random() * 360}deg)`;
        piece.style.borderRadius = Math.random() > 0.5 ? '2px' : '50%';
        layer.appendChild(piece);
      }

      setTimeout(() => { layer.innerHTML = ''; }, 4500);
    }

    /* ---- 3D Tilt untuk Digital Result Card ---- */
    function enableTilt(card) {
      if (!card || card.dataset.tiltBound) return;
      card.dataset.tiltBound = 'true';

      const maxTilt = 8; 

      function handleMove(clientX, clientY) {
        const rect = card.getBoundingClientRect();
        const x = (clientX - rect.left) / rect.width - 0.5;
        const y = (clientY - rect.top) / rect.height - 0.5;
        const rotateY = x * maxTilt * 2;
        const rotateX = -y * maxTilt * 2;
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
      }

      function resetTilt() {
        card.style.transform = 'rotateX(0deg) rotateY(0deg)';
      }

      card.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
      card.addEventListener('mouseleave', resetTilt);
      card.addEventListener('touchmove', (e) => {
        if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }, { passive: true });
      card.addEventListener('touchend', resetTilt);
    }

    // Jalankan Sequence Opening
    runOpeningSequence();
  });
})();
                              
