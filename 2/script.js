/* =================================================================
   COMPLETE JAVASCRIPT ENGINE — 4 STAGES, GALLERIES, LIGHTBOX, AUDIO
   ================================================================= */
(function () {
  const CORRECT_PASSWORD = "1692009";
  const STORY_DURATION = 5000; // 5 seconds per story

  /* ── 1. STARFIELD CANVAS ANIMATION ── */
  const canvas = document.getElementById('starfield-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let stars = [];
  let width = 0, height = 0;

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initStars();
  }

  function initStars() {
    stars = [];
    const numStars = Math.floor((width * height) / 3200);
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.6 + 0.4,
        baseAlpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        isGold: Math.random() < 0.3
      });
    }
  }

  function renderStars() {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, width, height);
    const time = Date.now() * 0.001;

    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      const alpha = star.baseAlpha + Math.sin(time * star.twinkleSpeed * 60 + star.twinklePhase) * 0.25;
      const clampedAlpha = Math.max(0.1, Math.min(1, alpha));

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = star.isGold 
        ? `rgba(243, 194, 113, ${clampedAlpha})` 
        : `rgba(255, 180, 205, ${clampedAlpha})`;
      ctx.fill();
    }
    requestAnimationFrame(renderStars);
  }

  if (canvas) {
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    renderStars();
  }

  /* ── 2. FLOATING HEARTS & BALLOONS ── */
  function createHearts() {
    const container = document.getElementById('heartsContainer');
    if (!container) return;
    const hearts = ['❤️', '💕', '💗', '💖', '✨', '🌸', '🎀'];
    for (let i = 0; i < 14; i++) {
      const heart = document.createElement('span');
      heart.className = 'floating-heart';
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.left = Math.random() * 96 + '%';
      heart.style.setProperty('--duration', (7 + Math.random() * 7) + 's');
      heart.style.setProperty('--delay', (Math.random() * 8) + 's');
      heart.style.fontSize = (14 + Math.random() * 16) + 'px';
      container.appendChild(heart);
    }
  }
  createHearts();

  function createBalloons() {
    const container = document.getElementById('balloonsContainer');
    if (!container) return;
    const balloons = ['🎈', '💖', '🎂', '✨', '🎉'];
    for (let i = 0; i < 16; i++) {
      const balloon = document.createElement('span');
      balloon.className = 'balloon';
      balloon.textContent = balloons[Math.floor(Math.random() * balloons.length)];
      balloon.style.left = Math.random() * 95 + '%';
      balloon.style.setProperty('--duration', (8 + Math.random() * 8) + 's');
      balloon.style.setProperty('--delay', (Math.random() * 8) + 's');
      balloon.style.fontSize = (20 + Math.random() * 16) + 'px';
      container.appendChild(balloon);
    }
  }
  createBalloons();

  /* ── 3. STAGE 1: PASSWORD GATE LOGIC ── */
  const gateScreen = document.getElementById('gate-screen');
  const passwordInput = document.getElementById('password-input');
  const unlockBtn = document.getElementById('unlock-btn');
  const gateErrorMsg = document.getElementById('gate-error-msg');
  const gateCard = document.querySelector('.gate-card');

  function checkPassword() {
    const entered = passwordInput ? passwordInput.value.trim() : '';
    if (entered === CORRECT_PASSWORD) {
      if (gateErrorMsg) gateErrorMsg.classList.remove('visible');
      if (unlockBtn) {
        unlockBtn.innerHTML = '💝 Unlocked!';
        unlockBtn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
      }
      setTimeout(() => {
        if (gateScreen) {
          gateScreen.classList.add('hidden');
          setTimeout(() => {
            gateScreen.style.display = 'none';
            openCountdownScreen();
          }, 600);
        }
      }, 500);
    } else {
      if (gateErrorMsg) gateErrorMsg.classList.add('visible');
      if (gateCard) {
        gateCard.classList.remove('shake');
        void gateCard.offsetWidth;
        gateCard.classList.add('shake');
      }
      if (passwordInput) {
        passwordInput.value = '';
        passwordInput.focus();
      }
    }
  }

  if (unlockBtn) unlockBtn.addEventListener('click', checkPassword);
  const gateForm = document.getElementById('gate-form');
  if (gateForm) {
    gateForm.addEventListener('submit', (e) => {
      e.preventDefault();
      checkPassword();
    });
  }
  if (passwordInput) {
    passwordInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        checkPassword();
      }
    });
  }

  /* ── 4. STAGE 2: COUNTDOWN TIMER ── */
  const countdownScreen = document.getElementById('countdown-screen');
  const startStoriesBtn = document.getElementById('start-stories-btn');
  const daysEl = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minutesEl = document.getElementById('cdMinutes');
  const secondsEl = document.getElementById('cdSeconds');

  const now = new Date();
  let targetDate = new Date(now.getFullYear(), 8, 16, 0, 0, 0); // Sept 16
  if (now > targetDate && (now - targetDate) > 24 * 60 * 60 * 1000) {
    targetDate = new Date(now.getFullYear() + 1, 8, 16, 0, 0, 0);
  }

  function updateCountdown() {
    const currentTime = new Date().getTime();
    const distance = targetDate.getTime() - currentTime;

    if (distance <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  function openCountdownScreen() {
    if (countdownScreen) {
      countdownScreen.classList.add('active');
      updateCountdown();
      setInterval(updateCountdown, 1000);
    }
  }

  if (startStoriesBtn) {
    startStoriesBtn.addEventListener('click', () => {
      if (countdownScreen) {
        countdownScreen.classList.add('hidden');
        setTimeout(() => {
          countdownScreen.style.display = 'none';
          openStoriesScreen();
        }, 500);
      }
    });
  }

  /* ── 5. STAGE 3: STORIES LOGIC ── */
  const storiesScreen = document.getElementById('stories-screen');
  const slides = document.querySelectorAll('.story-slide');
  const progressSegments = document.querySelectorAll('.progress-segment');
  const storyPrevTap = document.getElementById('story-prev-tap');
  const storyNextTap = document.getElementById('story-next-tap');
  const storyCloseBtn = document.getElementById('storyCloseBtn');
  const proceedToScrollBtn = document.getElementById('proceed-to-scroll-btn');

  let currentStory = 0;
  let storyTimer = null;

  function openStoriesScreen() {
    if (storiesScreen) {
      storiesScreen.classList.add('active');
      showStory(0);
    }
  }

  function showStory(index) {
    if (index < 0 || index >= slides.length) {
      exitStoriesToMain();
      return;
    }

    currentStory = index;

    slides.forEach((s, i) => {
      s.classList.toggle('active', i === index);
      const vid = s.querySelector('video');
      if (vid) {
        if (i === index) {
          vid.currentTime = 0;
          vid.muted = true;
          vid.defaultMuted = true;
          vid.playsInline = true;
          vid.setAttribute('playsinline', '');
          vid.setAttribute('webkit-playsinline', '');
          const p = vid.play();
          if (p !== undefined) {
            p.catch(err => console.log('Story autoplay caught:', err));
          }
        } else {
          vid.pause();
        }
      }
    });

    progressSegments.forEach((seg, i) => {
      seg.classList.remove('active', 'viewed');
      if (i < index) seg.classList.add('viewed');
      else if (i === index) seg.classList.add('active');
    });

    clearTimeout(storyTimer);
    storyTimer = setTimeout(() => {
      showStory(currentStory + 1);
    }, STORY_DURATION);
  }

  if (storyPrevTap) storyPrevTap.addEventListener('click', () => showStory(currentStory - 1 < 0 ? 0 : currentStory - 1));
  if (storyNextTap) storyNextTap.addEventListener('click', () => showStory(currentStory + 1));
  if (storyCloseBtn) storyCloseBtn.addEventListener('click', exitStoriesToMain);
  if (proceedToScrollBtn) proceedToScrollBtn.addEventListener('click', exitStoriesToMain);

  function exitStoriesToMain() {
    clearTimeout(storyTimer);
    if (storiesScreen) {
      storiesScreen.classList.add('hidden');
      setTimeout(() => {
        storiesScreen.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 500);
    }
  }

  /* ── 6. SCROLL REVEAL & BOTTOM NAVIGATION ── */
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  const navItems = document.querySelectorAll('.bottom-nav__item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const sectionId = item.dataset.section;
      const target = document.getElementById(sectionId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  const sections = document.querySelectorAll('section[id]');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(i => i.classList.remove('active'));
        const activeNav = document.querySelector(`.bottom-nav__item[data-section="${entry.target.id}"]`);
        if (activeNav) activeNav.classList.add('active');
      }
    });
  }, { threshold: 0.25, rootMargin: '-20% 0px -40% 0px' });

  sections.forEach(s => navObserver.observe(s));

  /* ── 7. GALLERY TOGGLES & FILTERS ── */
  window.filterGallery = function (type, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const cards = document.querySelectorAll('.gallery-grid .gallery-card');
    cards.forEach(card => {
      if (type === 'all' || card.dataset.type === type) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  };

  const viewBtns = document.querySelectorAll('.gallery-toggle__btn');
  const galleryViews = document.querySelectorAll('.gallery-view');
  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const view = btn.dataset.view;
      galleryViews.forEach(v => v.classList.remove('active'));
      const target = document.getElementById(
        view === 'grid' ? 'galleryGrid' :
        view === 'slider' ? 'gallerySlider' :
        'galleryMasonry'
      );
      if (target) target.classList.add('active');
    });
  });

  // Slider controls
  const sliderTrack = document.getElementById('sliderTrack');
  const sliderPrev = document.getElementById('sliderPrev');
  const sliderNext = document.getElementById('sliderNext');
  let sliderIndex = 0;

  if (sliderTrack && sliderPrev && sliderNext) {
    const slides = sliderTrack.querySelectorAll('.gallery-slider__slide');
    function updateSlider(idx) {
      if (idx < 0) idx = 0;
      if (idx >= slides.length) idx = slides.length - 1;
      sliderIndex = idx;
      sliderTrack.style.transform = `translateX(-${sliderIndex * 85}%)`;
    }
    sliderPrev.addEventListener('click', () => updateSlider(sliderIndex - 1));
    sliderNext.addEventListener('click', () => updateSlider(sliderIndex + 1));
  }

  /* ── 8. LIGHTBOX MODAL (Photos & Videos) ── */
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightboxContent');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentLightboxList = [];
  let currentLightboxIndex = 0;

  function collectLightboxMedia() {
    const items = document.querySelectorAll('.gallery-card, .media-slot');
    currentLightboxList = Array.from(items).map(item => {
      const isVideo = item.dataset.type === 'video' || item.querySelector('video') !== null;
      const media = item.querySelector(isVideo ? 'video' : 'img');
      const rawSrc = media ? (media.getAttribute('src') || media.src) : '';
      return {
        type: isVideo ? 'video' : 'image',
        src: rawSrc.split('#')[0]
      };
    }).filter(item => item.src);
  }
  collectLightboxMedia();

  window.openLightbox = function (type, src) {
    if (!lightbox || !lightboxContent) return;
    collectLightboxMedia();
    const cleanTarget = src.split('#')[0];
    const idx = currentLightboxList.findIndex(item => item.src.includes(cleanTarget) || cleanTarget.includes(item.src));
    currentLightboxIndex = idx >= 0 ? idx : 0;
    renderLightboxItem(type, cleanTarget);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  function renderLightboxItem(type, src) {
    if (!lightboxContent) return;
    lightboxContent.innerHTML = '';
    const cleanSrc = src.split('#')[0];

    if (type === 'video') {
      const wrapper = document.createElement('div');
      wrapper.className = 'lightbox__video-wrapper';

      const vid = document.createElement('video');
      vid.className = 'lightbox__video';
      vid.src = cleanSrc;
      vid.controls = true;
      vid.playsInline = true;
      vid.setAttribute('playsinline', '');
      vid.setAttribute('webkit-playsinline', '');
      vid.preload = 'auto';

      wrapper.appendChild(vid);
      lightboxContent.appendChild(wrapper);

      // Attempt to play immediately on user tap
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser policy blocks sound without interaction on this element,
          // mute and play, and show an interactive unmute badge
          vid.muted = true;
          vid.defaultMuted = true;
          vid.play().then(() => {
            showUnmuteBadge(wrapper, vid);
          }).catch(err => {
            console.warn('Video play error:', err);
          });
        });
      }
    } else {
      const img = document.createElement('img');
      img.className = 'lightbox__img';
      img.src = cleanSrc;
      lightboxContent.appendChild(img);
    }
  }

  function showUnmuteBadge(wrapper, vid) {
    if (!vid.muted) return;
    const badge = document.createElement('button');
    badge.type = 'button';
    badge.className = 'lightbox__unmute-badge';
    badge.innerHTML = '<span>🔊</span> <span>اضغط لتشغيل الصوت</span>';
    
    function unmute(e) {
      if (e) e.stopPropagation();
      vid.muted = false;
      vid.volume = 1.0;
      badge.remove();
    }
    badge.addEventListener('click', unmute);
    badge.addEventListener('touchend', unmute);
    vid.addEventListener('volumechange', () => {
      if (!vid.muted && badge.parentNode) badge.remove();
    });
    wrapper.appendChild(badge);
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    if (lightboxContent) {
      const videos = lightboxContent.querySelectorAll('video');
      videos.forEach(v => {
        v.pause();
        v.src = '';
        v.load();
      });
      lightboxContent.innerHTML = '';
    }
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxList.length) % currentLightboxList.length;
      const item = currentLightboxList[currentLightboxIndex];
      renderLightboxItem(item.type, item.src);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxList.length;
      const item = currentLightboxList[currentLightboxIndex];
      renderLightboxItem(item.type, item.src);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
    if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
  });

  /* ── 9. MUSIC TOGGLE & SYNTH CHIME FALLBACK ── */
  const musicBtn = document.getElementById('music-toggle-btn');
  const bgAudio = document.getElementById('bg-audio');
  let audioContext = null;
  let synthPlaying = false;
  let synthInterval = null;

  function playRomanticMelody() {
    try {
      if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === 'suspended') audioContext.resume();

      const notes = [261.63, 329.63, 392.00, 523.25, 440.00, 349.23, 392.00]; // C, E, G, C5, A, F, G
      let step = 0;

      synthInterval = setInterval(() => {
        if (!synthPlaying) return;
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(notes[step % notes.length], audioContext.currentTime);
        gain.gain.setValueAtTime(0.08, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.start();
        osc.stop(audioContext.currentTime + 1.2);
        step++;
      }, 700);
    } catch (e) {}
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      if (bgAudio && bgAudio.src && !bgAudio.paused) {
        bgAudio.pause();
        musicBtn.classList.remove('playing');
      } else if (bgAudio && bgAudio.src) {
        bgAudio.play().then(() => {
          musicBtn.classList.add('playing');
        }).catch(() => {
          // Fallback to synth
          if (!synthPlaying) {
            synthPlaying = true;
            playRomanticMelody();
            musicBtn.classList.add('playing');
          } else {
            synthPlaying = false;
            clearInterval(synthInterval);
            musicBtn.classList.remove('playing');
          }
        });
      }
    });
  }

  /* ── 10. MOBILE VIDEO PREVIEWS (IntersectionObserver) ── */
  function initVideoPreviews() {
    const previewVideos = document.querySelectorAll('.media-slot video, .gallery-card video');
    previewVideos.forEach(vid => {
      vid.muted = true;
      vid.defaultMuted = true;
      vid.playsInline = true;
      vid.setAttribute('playsinline', '');
      vid.setAttribute('webkit-playsinline', '');
      vid.setAttribute('loop', '');
    });

    if ('IntersectionObserver' in window) {
      const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const vid = entry.target;
          if (entry.isIntersecting) {
            vid.play().catch(() => {});
          } else {
            vid.pause();
          }
        });
      }, { threshold: 0.15 });

      previewVideos.forEach(v => videoObserver.observe(v));
    }
  }
  initVideoPreviews();

})();

