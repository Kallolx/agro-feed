/* খামারি বাজার - social layer (mock): reactions, comments, share, save. Data lives in localStorage until the backend exists. */
const Social = (() => {
  const { ic, bn, esc, ago, toast, get, set, me, users, posts, avatar } = KB;

  // Facebook-style reactions
  const R = [
    { k: 'like',  n: 'লাইক',     i: 'fluent-emoji-flat:thumbs-up' },
    { k: 'love',  n: 'ভালোবাসা', i: 'fluent-emoji-flat:red-heart' },
    { k: 'care',  n: 'কেয়ার',    i: 'fluent-emoji-flat:smiling-face-with-hearts' },
    { k: 'haha',  n: 'হা হা',    i: 'fluent-emoji-flat:face-with-tears-of-joy' },
    { k: 'wow',   n: 'ওয়াও',    i: 'fluent-emoji-flat:face-with-open-mouth' },
    { k: 'sad',   n: 'দুঃখ',     i: 'fluent-emoji-flat:crying-face' },
    { k: 'angry', n: 'রাগ',      i: 'fluent-emoji-flat:angry-face' },
  ];
  const RK = Object.fromEntries(R.map(r => [r.k, r]));
  const rIcon = (k, cls = '') => ic(RK[k].i, cls) || ic('lucide:thumbs-up', cls);

  // deterministic fake numbers so every post looks "alive"
  const hash = (id, n) => { const x = Math.sin(id * 12.9898 + n * 78.233) * 43758.5453; return x - Math.floor(x); };
  const base = id => ({
    like: Math.floor(hash(id, 1) * 38) + 2, love: Math.floor(hash(id, 2) * 16), care: Math.floor(hash(id, 3) * 6),
    haha: Math.floor(hash(id, 4) * 5), wow: Math.floor(hash(id, 5) * 5), sad: Math.floor(hash(id, 6) * 2), angry: 0,
  });
  const SEED = [
    ['রহিম উদ্দিন', 'মাশাআল্লাহ, দারুণ জাত! বাচ্চা কি আছে?', 'men/12'], ['সালমা বেগম', 'দাম কি আলোচনা সাপেক্ষে?', 'women/65'],
    ['জাহিদ হাসান', 'ঢাকায় ডেলিভারি করা যাবে কি?', 'men/54'], ['নুসরাত জাহান', 'অনেক সুন্দর! আরও ছবি দেবেন প্লিজ।', 'women/26'],
    ['কামরুল ইসলাম', 'আমি আগ্রহী, ফোনে যোগাযোগ করছি।', 'men/68'],
  ];

  const reacts = () => get('react', {});
  const counts = id => { const c = base(id); Object.values(reacts()[id] || {}).forEach(t => { if (c[t] != null) c[t]++; }); return c; };
  const mine = id => { const u = me(); return u ? (reacts()[id] || {})[u.id] || null : null; };
  const seeded = p => Array.from({ length: Math.floor(hash(p.id, 7) * 4) }, (_, i) => {
    const s = SEED[Math.floor(hash(p.id, 10 + i) * SEED.length)];
    return { id: `s${p.id}_${i}`, name: s[0], text: s[1], photo: 'https://randomuser.me/api/portraits/' + s[2] + '.jpg', ts: Math.min(p.createdAt + (i + 1) * 22 * 60000, Date.now() - 60000), seed: 1, likes: Math.floor(hash(p.id, 20 + i) * 6) };
  });
  const comments = p => seeded(p).concat(get('comments', {})[p.id] || []).sort((a, b) => a.ts - b.ts);
  const shares = id => Math.floor(hash(id, 8) * 9) + ((get('shares', {}))[id] || 0);
  const clikes = () => get('clikes', {});
  const isSaved = id => { const u = me(); return !!u && (get('saved', {})[u.id] || []).includes(id); };
  const postUrl = id => new URL('/post?id=' + id, location.origin).href;

  // UI state (survives re-render)
  const open = new Set(), full = new Set(), drafts = {};

  const stack = c => R.map(r => [r, c[r.k]]).filter(x => x[1] > 0).sort((a, b) => b[1] - a[1]).slice(0, 3);

  const inner = p => {
    const c = counts(p.id), total = Object.values(c).reduce((a, b) => a + b, 0), my = mine(p.id), cm = comments(p), u = me();
    const st = stack(c);
    const label = my ? `<span class="rl r-${my}">${rIcon(my, 'rl-i')}<em>${RK[my].n}</em></span>` : `<span class="rl">${ic('lucide:thumbs-up')}<em>লাইক</em></span>`;
    const title = R.filter(r => c[r.k]).map(r => `${r.n} ${bn(c[r.k])}`).join(' · ');
    const shown = full.has(p.id) ? cm : cm.slice(-2), cl = clikes();
    return `
    <div class="soc-stats">
      <span class="soc-rs" title="${esc(title)}">${total ? `<span class="rstack">${st.map(([r]) => `<span class="ri">${rIcon(r.k)}</span>`).join('')}</span><b>${bn(total)}</b>` : '<small>প্রথম প্রতিক্রিয়া দিন</small>'}</span>
      <span class="soc-sr"><button data-soc="cmt">${bn(cm.length)} মন্তব্য</button><span>${bn(shares(p.id))} শেয়ার</span></span>
    </div>
    <div class="soc-act">
      <div class="soc-rw">
        <button class="soc-b ${my ? 'on' : ''}" data-soc="react" aria-label="প্রতিক্রিয়া">${label}</button>
        <div class="soc-pop" role="menu">${R.map(r => `<button data-soc="pick" data-r="${r.k}" aria-label="${r.n}" title="${r.n}">${rIcon(r.k)}<span>${r.n}</span></button>`).join('')}</div>
      </div>
      <button class="soc-b" data-soc="cmt"><span class="rl">${ic('lucide:message-circle')}<em>মন্তব্য <span class="cc">(${bn(cm.length)})</span></em></span></button>
      <button class="soc-b" data-soc="share"><span class="rl">${ic('lucide:share-2')}<em>শেয়ার</em></span></button>
      <button class="soc-b ${isSaved(p.id) ? 'on sv' : ''}" data-soc="save" aria-label="সংরক্ষণ"><span class="rl">${ic('lucide:bookmark')}<em class="hide-s">সেভ</em></span></button>
    </div>
    <div class="soc-cm ${open.has(p.id) ? '' : 'hide'}">
      ${cm.length > 2 && !full.has(p.id) ? `<button class="cm-more" data-soc="allcm">আগের ${bn(cm.length - 2)}টি মন্তব্য দেখুন</button>` : ''}
      ${shown.map(x => {
        const own = u && x.uid === u.id, lk = (x.likes || 0) + (cl[x.id] || []).length, liked = u && (cl[x.id] || []).includes(u.id);
        return `<div class="cm">${avatar({ name: x.name, photo: x.photo || (users().find(y => y.id === x.uid) || {}).photo }, 'sm')}<div class="cm-b"><div class="cm-bub"><b>${esc(x.name)}</b><p>${esc(x.text)}</p>${lk ? `<span class="cm-lk">${rIcon('like')}${bn(lk)}</span>` : ''}</div>
          <div class="cm-meta"><span>${ago(x.ts)}</span><button data-soc="clike" data-cid="${x.id}" class="${liked ? 'on' : ''}">লাইক</button><button data-soc="reply" data-name="${esc(x.name)}">উত্তর দিন</button>${own ? `<button data-soc="cdel" data-cid="${x.id}">মুছুন</button>` : ''}</div></div></div>`;
      }).join('')}
      ${u ? `<div class="cm-in">${avatar(u, 'sm')}<input data-cin placeholder="মন্তব্য লিখুন…" value="${esc(drafts[p.id] || '')}" maxlength="300"><button data-soc="csend" aria-label="পাঠান">${ic('lucide:send')}</button></div>`
        : `<a class="cm-login" href="/login?next=${encodeURIComponent(location.pathname + location.search)}">${ic('lucide:message-circle')} মন্তব্য করতে লগইন করুন</a>`}
    </div>`;
  };
  const block = p => `<div class="soc" data-id="${p.id}">${inner(p)}</div>`;

  const refresh = id => {
    const p = posts().find(x => x.id === id); if (!p) return;
    document.querySelectorAll(`.soc[data-id="${id}"]`).forEach(el => { el.innerHTML = inner(p); });
    document.querySelectorAll(`.pc-more[data-id="${id}"] [data-soc="save"] em`).forEach(em => { em.textContent = isSaved(id) ? 'সংরক্ষিত' : 'সংরক্ষণ করুন'; });
  };

  const need = id => {
    if (me()) return true;
    toast('এই কাজের জন্য লগইন করুন');
    setTimeout(() => { location.href = '/login?next=' + encodeURIComponent(location.pathname + location.search + '#p-' + id); }, 700);
    return false;
  };
  const setReact = (id, k) => {
    if (!need(id)) return;
    const u = me(), all = reacts(); all[id] = all[id] || {};
    if (all[id][u.id] === k || !k) delete all[id][u.id]; else all[id][u.id] = k;
    set('react', all); refresh(id);
  };
  const copy = async text => {
    try { await navigator.clipboard.writeText(text); } catch { const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); }
    toast('লিংক কপি হয়েছে');
  };
  const bump = id => { const s = get('shares', {}); s[id] = (s[id] || 0) + 1; set('shares', s); refresh(id); };

  // ---------- share sheet ----------
  let sheet;
  const shareSheet = p => {
    if (!sheet) { sheet = document.createElement('div'); sheet.className = 'modal sheet'; sheet.id = 'socShare'; document.body.appendChild(sheet); sheet.onclick = e => { if (e.target === sheet || e.target.closest('[data-sx]')) sheet.classList.remove('open'); }; }
    const url = postUrl(p.id), txt = `${p.title} | খামারি বাজার`, q = encodeURIComponent;
    const T = [
      ['fa6-brands:whatsapp', 'হোয়াটসঅ্যাপ', `https://wa.me/?text=${q(txt + ' ' + url)}`],
      ['fa6-brands:facebook', 'ফেসবুক', `https://www.facebook.com/sharer/sharer.php?u=${q(url)}`],
      ['fa6-brands:facebook-messenger', 'মেসেঞ্জার', `https://www.facebook.com/dialog/send?link=${q(url)}&app_id=966242223397117&redirect_uri=${q(url)}`],
      ['fa6-brands:telegram', 'টেলিগ্রাম', `https://t.me/share/url?url=${q(url)}&text=${q(txt)}`],
      ['lucide:message-square-text', 'এসএমএস', `sms:?&body=${q(txt + ' ' + url)}`],
      ['lucide:mail', 'ইমেইল', `mailto:?subject=${q(txt)}&body=${q(url)}`],
    ];
    sheet.innerHTML = `<div class="box"><div class="sheet-h"><h3>শেয়ার করুন</h3><button data-sx aria-label="বন্ধ করুন">${ic('lucide:x')}</button></div>
      <p class="sh-t">${esc(p.title)}</p>
      <div class="sh-link"><input readonly value="${esc(url)}" aria-label="লিংক"><button class="btn btn-green btn-sm" data-sc>${ic('lucide:copy')} কপি</button></div>
      <div class="sh-grid">${T.map(([i, n, h]) => `<a href="${h}" target="_blank" rel="noopener" data-sh><span>${ic(i)}</span>${n}</a>`).join('')}
        ${navigator.share ? `<button data-sn><span>${ic('lucide:share-2')}</span>আরও</button>` : ''}</div></div>`;
    sheet.classList.add('open');
    sheet.querySelector('[data-sc]').onclick = () => { copy(url); bump(p.id); };
    sheet.querySelectorAll('[data-sh]').forEach(a => a.addEventListener('click', () => { bump(p.id); }));
    const sn = sheet.querySelector('[data-sn]'); if (sn) sn.onclick = () => navigator.share({ title: p.title, text: txt, url }).then(() => bump(p.id)).catch(() => {});
  };


  // ---------- ছবির গ্যালারি (বড় পর্দায় দেখা) ----------
  const gal = { imgs: [], i: 0, title: '' };
  let glb;
  const galBuild = () => {
    glb = document.createElement('div'); glb.className = 'glb'; glb.setAttribute('role', 'dialog'); glb.setAttribute('aria-modal', 'true'); glb.setAttribute('aria-label', 'ছবির গ্যালারি');
    glb.innerHTML = `<div class="glb-top"><span class="glb-c"></span><span class="glb-t"></span><button class="glb-x" aria-label="বন্ধ করুন">${ic('lucide:x')}</button></div>
      <button class="glb-nav glb-p" aria-label="আগের ছবি">${ic('lucide:chevron-left')}</button>
      <div class="glb-stage"><img alt=""></div>
      <button class="glb-nav glb-n" aria-label="পরের ছবি">${ic('lucide:chevron-right')}</button>
      <div class="glb-th"></div>`;
    document.body.appendChild(glb);
    glb.addEventListener('click', e => {
      if (e.target.closest('.glb-x') || e.target.classList.contains('glb-stage') || e.target === glb) return galClose();
      if (e.target.closest('.glb-p')) return galShow(gal.i - 1);
      if (e.target.closest('.glb-n')) return galShow(gal.i + 1);
      const t = e.target.closest('[data-ti]'); if (t) galShow(+t.dataset.ti);
    });
    let x0 = null;
    glb.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    glb.addEventListener('touchend', e => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 50) galShow(gal.i + (dx < 0 ? 1 : -1)); }, { passive: true });
  };
  const galShow = i => {
    const n = gal.imgs.length; gal.i = (i + n) % n;
    const img = glb.querySelector('.glb-stage img'); img.src = gal.imgs[gal.i]; img.alt = gal.title;
    glb.querySelector('.glb-c').textContent = `${bn(gal.i + 1)} / ${bn(n)}`;
    glb.querySelector('.glb-t').textContent = gal.title;
    glb.querySelectorAll('.glb-th button').forEach((b, k) => b.classList.toggle('on', k === gal.i));
    const on = glb.querySelector('.glb-th .on'); if (on) on.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    [gal.i + 1, gal.i - 1].forEach(k => { const im = new Image(); im.src = gal.imgs[(k + n) % n]; });   // পাশের ছবি আগে থেকে লোড
  };
  const galClose = () => { glb.classList.remove('open'); document.body.style.overflow = ''; };
  const openGal = (imgs, i, title) => {
    if (!glb) galBuild();
    gal.imgs = imgs; gal.title = title || '';
    const multi = imgs.length > 1;
    glb.classList.toggle('single', !multi);
    glb.querySelector('.glb-th').innerHTML = multi ? imgs.map((s, k) => `<button data-ti="${k}" aria-label="ছবি ${bn(k + 1)}"><img src="${s}" alt=""></button>`).join('') : '';
    glb.classList.add('open'); document.body.style.overflow = 'hidden';
    galShow(i);
  };
  document.addEventListener('keydown', e => {
    if (!glb || !glb.classList.contains('open')) return;
    if (e.key === 'Escape') galClose();
    else if (e.key === 'ArrowLeft') galShow(gal.i - 1);
    else if (e.key === 'ArrowRight') galShow(gal.i + 1);
  });

  // ---------- events ----------
  let lpT, lpFired = false;
  document.addEventListener('touchstart', e => {
    const b = e.target.closest('[data-soc="react"]'); if (!b) return;
    lpFired = false; lpT = setTimeout(() => { lpFired = true; b.closest('.soc-rw').classList.add('pop'); navigator.vibrate && navigator.vibrate(12); }, 420);
  }, { passive: true });
  ['touchend', 'touchmove', 'touchcancel'].forEach(ev => document.addEventListener(ev, () => clearTimeout(lpT), { passive: true }));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && sheet) sheet.classList.remove('open');
    if (e.key === 'Enter' && e.target.matches('[data-cin]')) { e.preventDefault(); e.target.closest('.cm-in').querySelector('[data-soc="csend"]').click(); }
  });
  document.addEventListener('input', e => { if (e.target.matches('[data-cin]')) drafts[+e.target.closest('.soc').dataset.id] = e.target.value; });

  document.addEventListener('click', e => {
    const gi = e.target.closest('.gi');
    if (gi) {
      const box = gi.closest('.clg'), p0 = posts().find(x => x.id === +box.dataset.pid);
      if (p0) { const imgs = p0.images.length ? p0.images : [KB.ph(KB.catOf(p0.cat).icon, 0)]; openGal(imgs, +gi.dataset.gi, p0.title); }
      return;
    }
    const t = e.target.closest('[data-soc]');
    if (!e.target.closest('.soc-rw')) document.querySelectorAll('.soc-rw.pop').forEach(x => x.classList.remove('pop'));
    if (!e.target.closest('.pc-more')) document.querySelectorAll('.pc-more.open').forEach(x => x.classList.remove('open'));
    if (!t) return;
    const root = t.closest('.soc') || t.closest('.pc-more'), id = +(root && root.dataset.id), p = posts().find(x => x.id === id);
    switch (t.dataset.soc) {
      case 'react':
        if (lpFired) { lpFired = false; return; }
        setReact(id, mine(id) ? null : 'like'); break;
      case 'pick': t.closest('.soc-rw').classList.remove('pop'); setReact(id, t.dataset.r); break;
      case 'cmt': open.has(id) ? open.delete(id) : open.add(id); refresh(id);
        if (open.has(id)) { const i = document.querySelector(`.soc[data-id="${id}"] [data-cin]`); if (i) i.focus({ preventScroll: true }); } break;
      case 'allcm': full.add(id); refresh(id); break;
      case 'share': if (p) shareSheet(p); break;
      case 'save': {
        if (!need(id)) return;
        const u = me(), s = get('saved', {}); s[u.id] = s[u.id] || [];
        const had = s[u.id].includes(id); s[u.id] = had ? s[u.id].filter(x => x !== id) : [...s[u.id], id];
        set('saved', s); toast(had ? 'সংরক্ষণ সরানো হয়েছে' : 'পোস্ট সংরক্ষণ করা হয়েছে'); refresh(id); break;
      }
      case 'menu': t.closest('.pc-more').classList.toggle('open'); break;
      case 'copy': copy(postUrl(id)); t.closest('.pc-more').classList.remove('open'); break;
      case 'report': if (need(id)) { toast('রিপোর্ট জমা হয়েছে, ধন্যবাদ'); t.closest('.pc-more').classList.remove('open'); } break;
      case 'csend': {
        if (!need(id)) return;
        const inp = t.closest('.cm-in').querySelector('[data-cin]'), text = inp.value.trim(); if (!text) return;
        const u = me(), all = get('comments', {}); all[id] = all[id] || [];
        all[id].push({ id: 'c' + Date.now(), uid: u.id, name: u.name, text, ts: Date.now(), likes: 0 });
        set('comments', all); delete drafts[id]; open.add(id); full.add(id); refresh(id); break;
      }
      case 'clike': {
        if (!need(id)) return;
        const u = me(), cl = clikes(), cid = t.dataset.cid; cl[cid] = cl[cid] || [];
        cl[cid] = cl[cid].includes(u.id) ? cl[cid].filter(x => x !== u.id) : [...cl[cid], u.id]; set('clikes', cl); refresh(id); break;
      }
      case 'cdel': {
        const all = get('comments', {}); all[id] = (all[id] || []).filter(x => x.id !== t.dataset.cid); set('comments', all); refresh(id); break;
      }
      case 'reply': {
        const inp = root.querySelector('[data-cin]'); if (!inp) { need(id); return; }
        inp.value = '@' + t.dataset.name + ' '; drafts[id] = inp.value; inp.focus(); break;
      }
    }
  });

  return { block, refresh, isSaved, openGal, R, rIcon };
})();
