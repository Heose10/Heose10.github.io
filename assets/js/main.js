/* =========================================================
   허세준 | Game Designer Portfolio
   ---------------------------------------------------------
   미디어 슬롯 사용법 (index.html)
   <div class="media" data-type="video|image|doc" data-title="제목" data-src=""></div>

   - data-src 가 비어 있으면 자리표시(placeholder) 레이아웃이 그려집니다.
   - video : 유튜브 주소(https://youtu.be/xxxx) 또는 mp4 경로
   - image : 이미지 경로 (예: assets/img/wolha/key-art.jpg)
   - doc   : PDF 경로 (예: assets/docs/spear-combat.pdf)
   - data-ratio="4 / 3" 처럼 비율을 바꿀 수 있습니다. (기본 16 / 9)
   ========================================================= */
(() => {
  document.documentElement.classList.add('js');

  const ICONS = {
    video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10.5"/><path d="M10 8.2v7.6l6-3.8z" fill="currentColor" stroke="none"/></svg>',
    image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="16" rx="1"/><circle cx="8.5" cy="9.5" r="1.8"/><path d="M3 17l5.5-5 4 4 3-2.5L21 18"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2.8h8.5L19 7.3v13.9H6z"/><path d="M14.3 2.8v4.6H19M9 12h7M9 15h7M9 18h4"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z" fill="currentColor"/></svg>'
  };
  const KIND = { video: 'VIDEO', image: 'IMAGE', doc: 'DOCUMENT' };
  const NOTE = { video: '영상 준비 중', image: '이미지 준비 중', doc: '문서 준비 중' };

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const youtubeId = (url) => {
    const m = url.match(/(?:youtu\.be\/|[?&]v=|embed\/|shorts\/)([\w-]{11})/);
    return m ? m[1] : null;
  };

  function renderMedia(el) {
    const type = el.dataset.type || 'image';
    const src = (el.dataset.src || '').trim();
    const title = el.dataset.title || '';
    if (el.dataset.ratio) el.style.setProperty('--ratio', el.dataset.ratio);
    el.classList.toggle('is-empty', !src);

    if (!src) {
      el.innerHTML =
        `<div class="media-ph">${ICONS[type] || ICONS.image}` +
        `<span class="ph-kind">${KIND[type] || 'MEDIA'}</span>` +
        (title ? `<span class="ph-title">${esc(title)}</span>` : '') +
        `<span class="ph-note">${NOTE[type] || ''}</span></div>`;
      return;
    }

    if (type === 'video') {
      const id = youtubeId(src);
      if (id) {
        el.innerHTML =
          `<button class="media-play" type="button" aria-label="${esc(title)} 재생">` +
          `<img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="" loading="lazy">` +
          `<span class="play-icon">${ICONS.play}</span></button>`;
        el.querySelector('button').addEventListener('click', () => {
          el.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="${esc(title)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
        });
      } else {
        el.innerHTML = `<video src="${esc(src)}" controls preload="metadata" playsinline></video>`;
      }
    } else if (type === 'doc') {
      el.innerHTML = `<a class="media-doc" href="${esc(src)}" target="_blank" rel="noopener">${ICONS.doc}<span>${esc(title || '문서 열기')} ↗</span></a>`;
    } else {
      el.innerHTML = `<img src="${esc(src)}" alt="${esc(title)}" loading="lazy">`;
    }
  }

  document.querySelectorAll('.media').forEach(renderMedia);

  /* ---------- 영상 탭 전환 ---------- */
  document.querySelectorAll('[data-tabs]').forEach((wrap) => {
    const buttons = wrap.querySelectorAll('[data-tab]');
    const panels = wrap.querySelectorAll('[data-panel]');
    buttons.forEach((btn) => btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.toggle('is-active', b === btn));
      panels.forEach((p) => {
        const show = p.dataset.panel === btn.dataset.tab;
        if (!show && !p.hidden) renderMedia(p); // 재생 중인 영상 정지
        p.hidden = !show;
      });
    }));
  });

  /* ---------- 준비 중인 링크 ---------- */
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  document.body.appendChild(toast);
  let toastTimer;
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-pending]');
    if (!link) return;
    e.preventDefault();
    toast.textContent = `${link.dataset.pending || '자료'} 준비 중입니다.`;
    toast.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-show'), 1800);
  });

  /* ---------- 헤더 / 모바일 내비 ---------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = document.querySelector('.nav-toggle');
  toggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', open);
  });
  document.querySelectorAll('.site-nav a').forEach((a) => a.addEventListener('click', () => {
    document.body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
  }));

  /* ---------- 현재 섹션 표시 ---------- */
  const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  navLinks.forEach((a) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) spy.observe(target);
  });

  /* ---------- 스크롤 등장 ---------- */
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        reveal.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach((el) => reveal.observe(el));
})();
