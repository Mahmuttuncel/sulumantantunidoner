(() => {
  'use strict';

  const C = CONFIG;
  const B = C.business;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Yardımcılar ---------- */
  // XSS'e karşı CONFIG metinlerini kaçır
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const price = (p) => `${Number(p).toLocaleString('tr-TR')} ${C.currency}`;
  const getPath = (obj, path) => path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);

  const fullAddress = [B.address.street, B.address.district, B.address.city].filter(Boolean).join(', ');
  const telHref = `tel:+${B.phone}`;
  const igHref = `https://www.instagram.com/${B.instagram}/`;
  const dirHref = B.mapsLink || `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(B.name + ', ' + fullAddress)}`;
  const mapSrc = B.mapEmbed || `https://maps.google.com/maps?q=${encodeURIComponent(B.name + ', ' + fullAddress)}&z=16&output=embed`;

  // wa.me linki – ürün adı verilirse hazır mesaja eklenir
  const wa = (product) => {
    const msg = product ? C.whatsapp.product.replace('{urun}', product) : C.whatsapp.general;
    return `https://wa.me/${B.whatsapp}?text=${encodeURIComponent(msg)}`;
  };

  /* ---------- İkonlar (inline SVG, harici dosya yok) ---------- */
  const ICONS = {
    wa: '<path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.24-9.44 9.45-9.44a9.4 9.4 0 0 1 9.43 9.45c0 5.2-4.24 9.43-9.45 9.43zm8.03-17.47A11.3 11.3 0 0 0 12.05.7C5.8.7.7 5.8.7 12.05c0 2 .52 3.95 1.52 5.67L.6 23.3l5.72-1.5a11.3 11.3 0 0 0 5.42 1.38h.01c6.25 0 11.34-5.09 11.35-11.34a11.3 11.3 0 0 0-3.32-8.02z"/>',
    star: '<path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
    pin: '<path d="M12 22s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="10" r="2.5"/>',
    nav: '<path d="M3 11l19-9-9 19-2-8-8-2z"/>',
    ig: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>',
    flame: '<path d="M12 22c4 0 7-2.8 7-6.8 0-3.5-2.2-5.9-4-7.7-.4 2-1.3 3.3-2.6 3.9C13 8 11.6 4.6 9 2c.3 3.6-1.5 5.7-3 7.6C4.8 11.2 5 13 5 15.2 5 19.2 8 22 12 22z"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 4 13c0-6 6-10 16-10 0 10-4 17-9 17z"/><path d="M4 21c3-5 6-8 10-10"/>',
    bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    tag: '<path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    bag: '<path d="M6 7h12l-1 14H7z"/><path d="M9 7a3 3 0 0 1 6 0"/>',
    scooter: '<circle cx="5.5" cy="17.5" r="2.5"/><circle cx="18.5" cy="17.5" r="2.5"/><path d="M15 6h4l2 6m-9-6h3l-3 11.5M8 17.5h8M5.5 15A2.5 2.5 0 0 1 8 12.5h1"/>',
    utensils: '<path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2M15 11v11M5 2v7a2 2 0 0 0 2 2 2 2 0 0 0 2-2V2M7 11v11"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>'
  };
  const FILLED = new Set(['wa', 'star']);
  const icon = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false" ${
    FILLED.has(n) ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'
  }>${ICONS[n] || ''}</svg>`;

  /* ---------- Görsel / placeholder ---------- */
  const PH = [
    ['#F2B544', '#C8281E', '#4A120C'],
    ['#E8A317', '#8E2A14', '#231713'],
    ['#F6C46A', '#B5361E', '#3A1C12'],
    ['#EB8A34', '#C8281E', '#1C1917']
  ];
  // src doluysa gerçek görsel (lazy-load), boşsa placeholder.
  // BURAYA GERÇEK FOTOĞRAF → CONFIG'teki "img" alanına WebP yolunu yazmanız yeterli.
  function media(src, alt, emoji = '🌯', i = 0) {
    if (src) {
      return `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async" width="800" height="600">`;
    }
    const [a, b, c] = PH[i % PH.length];
    return `<div class="ph" role="img" aria-label="${esc(alt)}" style="--a:${a};--b:${b};--c:${c}">
      <span class="ph__emoji" aria-hidden="true">${emoji}</span>
      <span class="ph__note" aria-hidden="true">BURAYA GERÇEK FOTOĞRAF</span>
    </div>`;
  }

  /* ---------- Çalışma saatleri / açık-kapalı ---------- */
  const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const DAY_FULL = { Mo: 'Monday', Tu: 'Tuesday', We: 'Wednesday', Th: 'Thursday', Fr: 'Friday', Sa: 'Saturday', Su: 'Sunday' };
  const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  const now = new Date();
  const today = DAYS[now.getDay()];
  const todayHours = C.hours.find((h) => h.days.includes(today));

  function openStatus() {
    const yesterday = DAYS[(now.getDay() + 6) % 7];
    const mins = now.getHours() * 60 + now.getMinutes();
    for (const h of C.hours) {
      const o = toMin(h.open), c = toMin(h.close);
      const overnight = c <= o; // gece yarısını geçen vardiya
      if (h.days.includes(today) && (overnight ? mins >= o : mins >= o && mins < c)) return { open: true, until: h.close };
      if (h.days.includes(yesterday) && overnight && mins < c) return { open: true, until: h.close };
    }
    return { open: false };
  }
  const status = openStatus();
  const statusText = status.open ? `Şu an açık · ${status.until}'a kadar` : (todayHours ? `Şu an kapalı · ${todayHours.open}'de açılır` : 'Bugün kapalı');

  /* ---------- Metin bağlama (data-t="bolum.alan") ---------- */
  $$('[data-t]').forEach((el) => { el.textContent = getPath(C.texts, el.dataset.t) || ''; });
  $$('.eyebrow').forEach((el) => el.insertAdjacentHTML('afterbegin', icon('flame')));

  /* ---------- Logo ---------- */
  $('#logo').innerHTML = `
    <span class="logo__mark" style="${B.logoImg ? 'padding:0;overflow:hidden;background:transparent;' : ''}">
      ${B.logoImg ? `<img src="${esc(B.logoImg)}" alt="${esc(B.name)} ikonu" style="width:100%;height:100%;object-fit:cover;border-radius:12px;">` : icon('flame')}
    </span>
    <span class="logo__text"><span class="logo__name">${esc(B.logoText)}</span><span class="logo__sub">${esc(B.logoSub)}</span></span>`;

  /* ---------- Header ---------- */
  const hdrOrder = $('#hdr-order');
  if (hdrOrder) {
    hdrOrder.href = '#siparis';
    hdrOrder.addEventListener('click', openOrderModal);
  }
  const hdr = $('#hdr');
  const onScroll = () => hdr.classList.toggle('solid', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Tema (açık / koyu) ---------- */
  const themeBtn = $('#theme-toggle');
  themeBtn.innerHTML = icon('moon', 'i-moon') + icon('sun', 'i-sun');
  const metaTheme = $('meta[name="theme-color"]');
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    themeBtn.setAttribute('aria-pressed', t === 'dark');
    themeBtn.setAttribute('aria-label', t === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç');
    metaTheme.setAttribute('content', t === 'dark' ? '#1C1917' : '#F6EBD9');
  }
  applyTheme(document.documentElement.getAttribute('data-theme'));
  themeBtn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* ---------- 1. Hero ---------- */
  const H = C.hero;
  const heroMedia = $('#hero-media');
  if (H.video) {
    // BURAYA GERÇEK VİDEO – hareket hassasiyeti varsa otomatik oynatılmaz
    heroMedia.innerHTML = `<video ${reduceMotion ? '' : 'autoplay'} muted loop playsinline preload="metadata" ${H.image ? `poster="${esc(H.image)}"` : ''} aria-hidden="true"><source src="${esc(H.video)}" type="video/mp4"></video>`;
  } else if (H.image) {
    // Hero görseli LCP olduğu için lazy değil, öncelikli yüklenir
    heroMedia.innerHTML = `<img src="${esc(H.image)}" alt="Kızgın saçta pişen tantuni" fetchpriority="high" decoding="async" width="1600" height="1000">`;
  } else {
    // Placeholder: kıvılcımlar + buhar
    let embers = '';
    for (let i = 0; i < 18; i++) {
      embers += `<span class="ember" style="left:${Math.random() * 100}%;--s:${3 + Math.random() * 5}px;--dur:${5 + Math.random() * 6}s;--delay:${-Math.random() * 10}s;--x:${(Math.random() - .5) * 120}px"></span>`;
    }
    heroMedia.innerHTML = `<div class="hero__ph" role="img" aria-label="Kızgın saçta pişen tantuni">
      <span class="steam"></span><span class="steam"></span><span class="steam"></span>
      ${embers}
      <span class="hero__ph-emoji" aria-hidden="true">🌯</span>
      <span class="hero__ph-note" aria-hidden="true">BURAYA GERÇEK VİDEO / FOTOĞRAF</span>
    </div>`;
  }
  $('#hero-eyebrow').textContent = H.eyebrow;
  $('#hero-title').innerHTML = `${esc(H.title)} <span class="accent">${esc(H.titleAccent)}</span>`;
  $('#hero-sub').textContent = H.sub;
  const heroOnlineOrder = $('#hero-online-order');
  if (heroOnlineOrder) {
    heroOnlineOrder.innerHTML = `${icon('bag')} ${esc(H.onlineOrderBtn || 'Sipariş Ver')}`;
    heroOnlineOrder.addEventListener('click', openOrderModal);
  }
  const heroOrder = $('#hero-order');
  heroOrder.href = wa();
  heroOrder.innerHTML = `${icon('wa')} ${esc(H.orderBtn)}`;
  $('#hero-menu').innerHTML = `${esc(H.menuBtn)} ${icon('arrow')}`;
  $('#hero-chips').innerHTML =
    `<li class="chip"><span class="dot ${status.open ? '' : 'closed'}"></span>${esc(statusText)}</li>` +
    H.chips.map((c) => `<li class="chip">${esc(c)}</li>`).join('');

  /* ---------- 2. Popüler ürünler ---------- */
  $('#popular-grid').innerHTML = C.popular.map((p, i) => `
    <article class="card reveal" style="--d:${(i % 3) * 90}ms">
      <div class="card__media">
        ${media(p.img, p.name + ' – ' + p.desc, p.emoji, i)}
        ${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ''}
      </div>
      <div class="card__body">
        <h3 class="card__title">${esc(p.name)}</h3>
        <p class="card__desc">${esc(p.desc)}</p>
        <div class="card__foot">
          <span class="price">${price(p.price)}</span>
          <a class="btn btn--red" href="${wa(p.name)}" target="_blank" rel="noopener" aria-label="${esc(p.name)} için WhatsApp'tan sipariş ver">${icon('wa')} Sipariş Ver</a>
        </div>
      </div>
    </article>`).join('');

  /* ---------- 3. Menü (erişilebilir sekmeler) ---------- */
  const tabsEl = $('#menu-tabs');
  tabsEl.innerHTML = C.menu.map((cat, i) => `
    <button class="tab" role="tab" type="button" id="tab-${cat.id}" data-id="${cat.id}"
      aria-controls="panel-${cat.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">
      ${esc(cat.name)}<span class="tab__count">${cat.items.length}</span>
    </button>`).join('');
  $('#menu-panels').innerHTML = C.menu.map((cat, i) => `
    <div class="panel" role="tabpanel" id="panel-${cat.id}" aria-labelledby="tab-${cat.id}" tabindex="0" ${i === 0 ? '' : 'hidden'}>
      <ul class="menu-list">
        ${cat.items.map((it) => `
          <li class="menu-item">
            <div>
              <h3 class="menu-item__name">${esc(it.name)}</h3>
              ${it.desc ? `<p class="menu-item__desc">${esc(it.desc)}</p>` : ''}
            </div>
            <span class="price">${price(it.price)}</span>
            <a class="mini-wa" href="${wa(it.name)}" target="_blank" rel="noopener" aria-label="${esc(it.name)} sipariş ver (WhatsApp)">${icon('wa')}</a>
          </li>`).join('')}
      </ul>
    </div>`).join('');

  function selectTab(id, focus = false) {
    $$('.tab', tabsEl).forEach((t) => {
      const on = t.dataset.id === id;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      if (on) {
        if (focus) t.focus();
        // Seçili sekmeyi yatay kaydırmada ortala (mobil)
        tabsEl.scrollTo({ left: t.offsetLeft - (tabsEl.clientWidth - t.offsetWidth) / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    });
    $$('.panel').forEach((p) => { p.hidden = p.id !== `panel-${id}`; });
  }
  tabsEl.addEventListener('click', (e) => {
    const t = e.target.closest('.tab');
    if (t) selectTab(t.dataset.id);
  });
  // Klavye: ← → Home End
  tabsEl.addEventListener('keydown', (e) => {
    const tabs = $$('.tab', tabsEl);
    let i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    if (e.key === 'ArrowRight') i = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') i = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') i = 0;
    else if (e.key === 'End') i = tabs.length - 1;
    else return;
    e.preventDefault();
    selectTab(tabs[i].dataset.id, true);
  });
  // QR menü uyumu: site.com/#menu veya site.com/#menu-doner gibi linkler doğrudan çalışır
  function handleHash() {
    const m = location.hash.match(/^#menu-([\w-]+)$/);
    if (m && C.menu.some((c) => c.id === m[1])) {
      selectTab(m[1]);
      $('#menu').scrollIntoView();
    }
  }
  window.addEventListener('hashchange', handleHash);
  handleHash();

  /* ---------- 4. Neden biz ---------- */
  $('#why-grid').innerHTML = C.why.map((w, i) => `
    <div class="why__item reveal" style="--d:${i * 90}ms">
      <div class="why__icon">${icon(w.icon)}</div>
      <h3 class="why__title">${esc(w.title)}</h3>
      <p class="why__text">${esc(w.text)}</p>
    </div>`).join('');

  /* ---------- 5. Sipariş seçenekleri ---------- */
  const orderBtn = (cls, href, ic, title, sub, ext = true) => `
    <a class="order-btn ${cls} reveal" href="${href}" ${ext ? 'target="_blank" rel="noopener"' : ''}>
      <span class="order-btn__icon">${icon(ic)}</span>
      <span class="order-btn__text"><span class="order-btn__title">${esc(title)}</span><span class="order-btn__sub">${esc(sub)}</span></span>
      <span class="order-btn__arrow">${icon('arrow')}</span>
    </a>`;
  $('#order-grid').innerHTML =
    orderBtn('order-btn--wa', wa(), 'wa', "WhatsApp'tan Sipariş", 'Hazır mesajla, tek dokunuş') +
    orderBtn('order-btn--tel', telHref, 'phone', 'Hemen Ara', B.phoneDisplay, false) +
    orderBtn('order-btn--map', dirHref, 'nav', 'Gel Al', 'Yol tarifi için dokun');

  const activePlatforms = C.platforms.filter((p) => p.url);
  if (activePlatforms.length) {
    $('#platforms').innerHTML = `<p class="platforms-title">Paket servis platformları</p>
      <div class="order-grid">${activePlatforms.map((p) => `
        <a class="order-btn reveal" style="background:${esc(p.color)}" href="${esc(p.url)}" target="_blank" rel="noopener">
          <span class="order-btn__icon">${icon('bag')}</span>
          <span class="order-btn__text"><span class="order-btn__title">${esc(p.name)}</span><span class="order-btn__sub">Online sipariş ver</span></span>
          <span class="order-btn__arrow">${icon('arrow')}</span>
        </a>`).join('')}</div>`;
  }

  /* ---------- 6. Instagram (Saçtan Kareler) ---------- */
  const igGrid = $('#ig-grid');
  const igBtn = $('#ig-btn');
  if (igBtn) {
    igBtn.href = igHref;
    igBtn.innerHTML = `${icon('ig')} ${esc(C.texts.instagram.button || "Bizi Instagram'da Takip Et")}`;
  }

  async function loadInstagramFeed() {
    let posts = C.instagramPosts || [];
    const api = C.instagram?.apiUrl;

    if (api) {
      try {
        const res = await fetch(api);
        if (res.ok) {
          const data = await res.json();
          const rawPosts = Array.isArray(data) ? data : (data.data || data.posts || []);
          if (rawPosts.length > 0) {
            posts = rawPosts.slice(0, 6).map((item) => ({
              img: item.sizes?.medium?.mediaUrl || item.media_url || item.img || item.image,
              alt: item.caption || item.alt || "Sülüman Tantuni Instagram",
              url: item.permalink || item.url || igHref,
              emoji: '🌯'
            }));
          }
        }
      } catch (err) {
        console.warn('Instagram API verisi alınamadı, yerel görseller kullanılıyor:', err);
      }
    }

    if (igGrid) {
      igGrid.innerHTML = posts.slice(0, 6).map((p, i) => `
        <a class="ig-tile reveal in" style="--d:${i * 60}ms" href="${esc(p.url || igHref)}" target="_blank" rel="noopener" aria-label="Instagram: ${esc(p.alt)}">
          ${media(p.img, p.alt, p.emoji || '🌯', i + 1)}
          <span class="ig-tile__ov">
            ${icon('ig')}
            <span class="ig-tile__label">Instagram'da Gör</span>
          </span>
        </a>`).join('');
    }
  }
  loadInstagramFeed();

  /* ---------- 7. Google Haritalar Yorumları ---------- */
  const stars = (n) => `<div class="stars" role="img" aria-label="5 üzerinden ${n} yıldız">${
    [1, 2, 3, 4, 5].map((i) => icon('star', i <= n ? '' : 'off')).join('')}</div>`;

  const googleIconSvg = `<svg class="google-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" style="flex-shrink:0"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>`;

  async function loadGoogleReviews() {
    const g = C.googleReviews || {};
    const summaryEl = $('#google-summary');
    const reviewsEl = $('#reviews');

    let reviewItems = C.reviews || [];

    if (g.apiUrl) {
      try {
        const res = await fetch(g.apiUrl);
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data) ? data : (data.result?.reviews || data.reviews || []);
          if (items.length > 0) {
            reviewItems = items.map((r) => ({
              name: r.author_name || r.name,
              rating: r.rating || 5,
              text: r.text || r.content,
              time: r.relative_time_description || r.time || 'Google Haritalar',
              avatar: r.profile_photo_url || null
            }));
          }
        }
      } catch (err) {
        console.warn('Google Maps API verisi alınamadı, doğrulanmış yorumlar kullanılıyor:', err);
      }
    }

    if (summaryEl) {
      summaryEl.innerHTML = `
        <div class="google-card">
          <div class="google-card__main">
            <div class="google-card__logo">${googleIconSvg}</div>
            <div class="google-card__score-wrap">
              <div class="google-card__rating">
                <span class="google-card__num">${esc(g.rating || '4.9')}</span>
                <span class="google-card__stars">${stars(5)}</span>
              </div>
              <div class="google-card__sub">Google Haritalar Puanı · ${esc(g.totalReviews || '140+')} Müşteri Değerlendirmesi</div>
            </div>
          </div>
          <div class="google-card__actions">
            <a class="btn btn--outline btn--sm" href="${esc(g.writeReviewUrl || dirHref)}" target="_blank" rel="noopener">
              ${icon('star')} Yorum Yaz
            </a>
            <a class="btn btn--red btn--sm" href="${esc(g.mapsUrl || dirHref)}" target="_blank" rel="noopener">
              Tüm Yorumları Gör →
            </a>
          </div>
        </div>`;
    }

    if (reviewsEl) {
      reviewsEl.innerHTML = reviewItems.map((r, i) => `
        <figure class="review reveal in" style="--d:${i * 80}ms; margin:0">
          <div class="review__top">
            ${stars(r.rating || 5)}
            <span class="review__source-badge">
              ${googleIconSvg}
              <span>Google</span>
            </span>
          </div>
          <blockquote class="review__text">${esc(r.text)}</blockquote>
          <figcaption class="review__who">
            ${r.avatar ? `<img class="avatar avatar--img" src="${esc(r.avatar)}" alt="${esc(r.name)}" loading="lazy">` : `<span class="avatar" aria-hidden="true">${esc(r.name.charAt(0))}</span>`}
            <div class="review__author">
              <span class="review__name">${esc(r.name)}</span>
              <span class="review__time">${esc(r.time || 'Doğrulanmış Müşteri')}</span>
            </div>
          </figcaption>
        </figure>`).join('');
    }
  }
  loadGoogleReviews();

  /* ---------- 8. Konum & saatler ---------- */
  $('#map').innerHTML = `<iframe src="${esc(mapSrc)}" title="${esc(B.name)} konumu – Google Haritalar" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`;
  $('#info').innerHTML = `
    <div><span class="status ${status.open ? '' : 'closed'}"><span class="dot ${status.open ? '' : 'closed'}"></span>${esc(statusText)}</span></div>
    <div class="info__row">${icon('pin')}<div><div class="info__label">Adres</div><div class="info__val">${esc(fullAddress)}</div></div></div>
    <div class="info__row">${icon('phone')}<div><div class="info__label">Telefon</div><div class="info__val"><a href="${telHref}">${esc(B.phoneDisplay)}</a></div></div></div>
    <div class="info__row">${icon('clock')}<div style="flex:1"><div class="info__label">Çalışma saatleri</div>
      <ul class="hours">${C.hours.map((h) => `<li class="${h.days.includes(today) ? 'today' : ''}"><span>${esc(h.label)}</span><span>${esc(h.open)} – ${esc(h.close)}</span></li>`).join('')}</ul>
    </div></div>
    <div class="info__actions">
      <a class="btn btn--red btn--lg" href="${dirHref}" target="_blank" rel="noopener">${icon('nav')} ${esc(C.texts.location.button)}</a>
      <a class="btn btn--outline btn--lg" href="${telHref}">${icon('phone')} Ara</a>
    </div>`;

  /* ---------- 9. Footer ---------- */
  $('#ftr-grid').innerHTML = `
    <div>
      <a class="logo" href="#top" aria-label="Başa dön">${$('#logo').innerHTML}</a>
      <p class="ftr__tag">${esc(C.texts.footer)}</p>
      <div class="socials">
        <a href="${igHref}" target="_blank" rel="noopener" aria-label="Instagram @${esc(B.instagram)}">${icon('ig')}</a>
        <a href="${wa()}" target="_blank" rel="noopener" aria-label="WhatsApp">${icon('wa')}</a>
        <a href="${telHref}" aria-label="Telefon">${icon('phone')}</a>
      </div>
    </div>
    <div>
      <h3>İletişim</h3>
      <ul class="ftr__links">
        <li><a href="${telHref}">${icon('phone')} ${esc(B.phoneDisplay)}</a></li>
        <li><a href="${wa()}" target="_blank" rel="noopener">${icon('wa')} WhatsApp</a></li>
        <li><a href="${igHref}" target="_blank" rel="noopener">${icon('ig')} @${esc(B.instagram)}</a></li>
        <li><a href="${dirHref}" target="_blank" rel="noopener">${icon('pin')} ${esc(fullAddress)}</a></li>
      </ul>
    </div>
    <div>
      <h3>Sayfa</h3>
      <ul class="ftr__links">
        <li><a href="#populer">Popüler</a></li>
        <li><a href="#menu">Menü</a></li>
        <li><a href="#siparis">Sipariş</a></li>
        <li><a href="#konum">Konum & Saatler</a></li>
      </ul>
    </div>`;
  $('#ftr-bottom').innerHTML = `<span>© ${now.getFullYear()} ${esc(B.name)}</span><span>Afiyet olsun 🌶️</span>`;

  /* ---------- Mobil sabit bar ---------- */
  $('#mbar').innerHTML = `
    <a class="mbar__tel" href="${telHref}">${icon('phone')}<span>Ara</span></a>
    <a class="mbar__wa" href="${wa()}" target="_blank" rel="noopener">${icon('wa')}<span>WhatsApp</span></a>
    <a href="${dirHref}" target="_blank" rel="noopener">${icon('nav')}<span>Yol Tarifi</span></a>`;

  /* ---------- 10. Sipariş Modalı (Pop-up) ---------- */
  const modal = $('#order-modal');
  const modalCloseBtn = $('#modal-close');
  const modalOverlay = $('#modal-overlay');

  function openOrderModal(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!modal) return;
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    if (modalCloseBtn) modalCloseBtn.focus();
  }

  function closeOrderModal() {
    if (!modal) return;
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeOrderModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeOrderModal);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.hasAttribute('hidden')) {
      closeOrderModal();
    }
  });

  const modalPlatforms = $('#modal-platforms');
  if (modalPlatforms) {
    const activeModalPlatforms = C.platforms.filter((p) => p.url);
    modalPlatforms.innerHTML = activeModalPlatforms.map((p) => {
      const isYemeksepeti = (p.id === 'yemeksepeti') || p.name.toLowerCase().includes('yemeksepeti');
      const isTrendyol = (p.id === 'trendyol') || p.name.toLowerCase().includes('trendyol');
      const cardCls = isYemeksepeti ? 'platform-card--yemeksepeti' : (isTrendyol ? 'platform-card--trendyol' : '');
      const badgeCls = isTrendyol ? 'platform-badge--orange' : '';
      const platformIcon = isYemeksepeti ? icon('utensils') : (isTrendyol ? icon('scooter') : icon('bag'));
      const badge = p.badge || (isYemeksepeti ? 'Popüler' : (isTrendyol ? 'Hızlı Teslimat' : ''));
      const desc = p.desc || (isYemeksepeti ? 'Online sipariş & güncel menü' : (isTrendyol ? 'Sıcak lezzetler kapınızda' : 'Online sipariş ver'));

      return `
        <a class="platform-card ${cardCls}" href="${esc(p.url)}" target="_blank" rel="noopener" style="--p-color:${esc(p.color)}">
          <div class="platform-card__logo">${platformIcon}</div>
          <div class="platform-card__info">
            <div class="platform-card__name">
              <span>${esc(p.name)}</span>
              ${badge ? `<span class="platform-badge ${badgeCls}">${esc(badge)}</span>` : ''}
            </div>
            <div class="platform-card__desc">${esc(desc)}</div>
          </div>
          <div class="platform-card__action">
            <span class="platform-action-btn">Sipariş Ver</span>
            ${icon('arrow')}
          </div>
        </a>`;
    }).join('');
  }

  const modalDirect = $('#modal-direct');
  if (modalDirect) {
    modalDirect.innerHTML = `
      <a class="direct-btn direct-btn--wa" href="${wa()}" target="_blank" rel="noopener">
        ${icon('wa')}
        <div class="direct-btn__text">
          <strong>WhatsApp</strong>
          <span>Mesajla sipariş ver</span>
        </div>
        <span class="direct-btn__arrow">→</span>
      </a>
      <a class="direct-btn direct-btn--tel" href="${telHref}">
        ${icon('phone')}
        <div class="direct-btn__text">
          <strong>Telefonla Ara</strong>
          <span>${esc(B.phoneDisplay)}</span>
        </div>
        <span class="direct-btn__arrow">→</span>
      </a>`;
  }

  /* ---------- Scroll'da beliren bölümler ---------- */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }

  /* ---------- SEO: schema.org Restaurant + LocalBusiness JSON-LD ---------- */
  const ld = {
    '@context': 'https://schema.org',
    '@type': ['Restaurant', 'LocalBusiness'],
    name: B.name,
    url: B.url,
    image: C.hero.image || 'Gorsel/Gorsel1.jpg', // BURAYA GERÇEK FOTOĞRAF
    telephone: '+' + B.phone,
    priceRange: B.priceRange,
    servesCuisine: ['Türk Mutfağı', 'Tantuni', 'Döner'],
    acceptsReservations: false,
    menu: B.url + '#menu',
    address: {
      '@type': 'PostalAddress',
      streetAddress: B.address.street,
      addressLocality: B.address.district,
      addressRegion: B.address.city,
      postalCode: B.address.postalCode || undefined,
      addressCountry: B.address.country
    },
    geo: B.geo.lat ? { '@type': 'GeoCoordinates', latitude: B.geo.lat, longitude: B.geo.lng } : undefined,
    hasMap: B.mapsLink || undefined,
    sameAs: [igHref],
    openingHoursSpecification: C.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days.map((d) => 'https://schema.org/' + DAY_FULL[d]),
      opens: h.open,
      closes: h.close
    })),
    hasMenu: {
      '@type': 'Menu',
      url: B.url + '#menu',
      hasMenuSection: C.menu.map((cat) => ({
        '@type': 'MenuSection',
        name: cat.name,
        hasMenuItem: cat.items.map((it) => ({
          '@type': 'MenuItem',
          name: it.name,
          description: it.desc,
          offers: { '@type': 'Offer', price: it.price, priceCurrency: 'TRY' }
        }))
      }))
    }
  };
  const ldScript = document.createElement('script');
  ldScript.type = 'application/ld+json';
  ldScript.textContent = JSON.stringify(ld);
  document.head.appendChild(ldScript);
})();
