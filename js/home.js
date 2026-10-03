(() => {
  const { CATS, DISTRICTS, catOf, bn, money, esc, ago, ph, posts, users, ic, avatar, catPic } = KB;
  const $ = id => document.getElementById(id);
  const qs = new URLSearchParams(location.search);
  const st = { cat: qs.get('cat') || '', q: qs.get('q') || '', dist: '', breed: '', min: 0, max: 0, sort: 'new', shown: 6 };

  // ---------- filter controls ----------
  const S = st;
  CATS.forEach(c => [$('hc'), $('fc')].forEach(s => { const o = new Option(c.name, c.id); if (c.img) o.dataset.img = c.img; s.add(o); }));
  [$('hc'), $('fc')].forEach(s => { s.options[0].dataset.img = 'img/category/web/all.webp'; });
  DISTRICTS.forEach(d => $('fd').add(new Option(d, d)));
  $('hc').value = $('fc').value = S.cat; $('hq').value = S.q;

  // সব + 10টি জনপ্রিয় + "আরও দেখুন" = 12টি সমান কার্ড
  $('catsWrap').innerHTML = (`<button class="cat" data-c=""><i><img class="cpic" src="img/category/web/all.webp" alt="সব" loading="lazy" decoding="async"></i>সব</button>`
    + CATS.slice(0, 10).map(c => `<button class="cat" data-c="${c.id}"><i>${catPic(c)}</i>${c.name}</button>`).join('')
    + `<button class="cat all" id="allBtn"><i>${ic('lucide:layout-grid')}</i>আরও দেখুন</button>`).replace(/<button class="cat/g, '<div class="swiper-slide"><button class="cat').replace(/<\/button>/g, '</button></div>');
  const catSw = new Swiper('#cats', { slidesPerView: 'auto', spaceBetween: 10, breakpoints: { 0: { spaceBetween: 2 }, 861: { spaceBetween: 10 } }, freeMode: true, grabCursor: true, navigation: { nextEl: '.cat-next', prevEl: '.cat-prev' } });
  // কিনারার ফেড: শুরুতে বাঁয়ে, শেষে ডানে লুকায়
  const fadeSw = () => { const w = document.querySelector('.cats-sw'); w.classList.toggle('at-start', catSw.isBeginning); w.classList.toggle('at-end', catSw.isEnd); };
  catSw.on('progress', fadeSw); catSw.on('resize', fadeSw); catSw.on('update', fadeSw); fadeSw();
  $('allGrid').innerHTML = `<button class="cat" data-c=""><i><img class="cpic" src="img/category/web/all.webp" alt="সব" loading="lazy" decoding="async"></i>সব পশু</button>` + CATS.map(c => `<button class="cat" data-c="${c.id}"><i>${catPic(c)}</i>${c.name}</button>`).join('');
  const sheet = on => { $('allSheet').classList.toggle('open', on); document.body.style.overflow = on ? 'hidden' : ''; };
  $('allBtn').onclick = () => sheet(true);
  $('allSheet').onclick = e => { if (e.target === $('allSheet') || e.target.closest('#allX') || e.target.closest('[data-c]')) sheet(false); };

  // মোবাইলে ফিল্টার বটম-শিট
  const fsheet = on => { $('fPanel').classList.toggle('open', on); $('fBg').classList.toggle('open', on); document.body.style.overflow = on ? 'hidden' : ''; };
  $('fOpen').onclick = () => fsheet(true);
  $('fClose').onclick = $('fApply').onclick = $('fBg').onclick = () => fsheet(false);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { sheet(false); fsheet(false); } });

  function setBreeds() {
    const fb = $('fb'); fb.length = 1;
    if (S.cat) catOf(S.cat).breeds.forEach(b => fb.add(new Option(b, b)));
    S.breed = ''; fb.value = ''; $('fbw').classList.toggle('hide', !S.cat);
  }
  function setCat(c) { S.cat = c; setBreeds(); S.shown = 6; $('hc').value = $('fc').value = c; render(); }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-c]'); if (b) setCat(b.dataset.c);
  });
  $('heroSearch').onsubmit = e => { e.preventDefault(); S.q = $('hq').value.trim(); setCat($('hc').value); $('feed').scrollIntoView({ behavior: 'smooth' }); };
  $('hc').onchange = () => setCat($('hc').value);
  $('fc').onchange = () => setCat($('fc').value);
  $('fb').onchange = e => { S.breed = e.target.value; S.shown = 6; render(); };
  $('fd').onchange = e => { S.dist = e.target.value; S.shown = 6; render(); };
  $('pmin').oninput = e => { S.min = +e.target.value || 0; S.shown = 6; render(); };
  $('pmax').oninput = e => { S.max = +e.target.value || 0; S.shown = 6; render(); };
  $('qp').onclick = e => {
    const b = e.target.closest('[data-max]'); if (!b) return;
    const v = +b.dataset.max; S.min = 0; $('pmin').value = ''; S.max = S.max === v ? 0 : v; $('pmax').value = S.max || ''; S.shown = 6; render();
  };
  $('sortSeg').onclick = e => { const b = e.target.closest('[data-s]'); if (b) { S.sort = b.dataset.s; render(); } };
  function resetAll() {
    Object.assign(S, { q: '', dist: '', min: 0, max: 0, sort: 'new' });
    $('fd').value = $('pmin').value = $('pmax').value = $('hq').value = ''; setCat('');
  }
  $('reset').onclick = resetAll;
  $('fActive').onclick = e => {
    const b = e.target.closest('[data-k]'); if (!b) return; const k = b.dataset.k;
    if (k === 'cat') setCat('');
    else if (k === 'breed') { S.breed = ''; $('fb').value = ''; render(); }
    else if (k === 'dist') { S.dist = ''; $('fd').value = ''; render(); }
    else if (k === 'price') { S.min = S.max = 0; $('pmin').value = $('pmax').value = ''; render(); }
    else if (k === 'q') { S.q = ''; $('hq').value = ''; render(); }
  };

  // ---------- render ----------
  function gallery(p) {
    const c = catOf(p.cat);
    const im = p.images.length ? p.images : [ph(c.icon, 0)];
    const n = Math.min(im.length, 3), extra = im.length - 3;
    const imgs = im.slice(0, n).map((s, i) => i === 2 && extra > 0
      ? `<div class="more" data-more="+${bn(extra)}"><img src="${s}" loading="lazy" alt=""></div>`
      : `<img src="${s}" loading="lazy" alt="${esc(p.title)}">`).join('');
    return `<a class="gal n${n} pc-media" href="post.html?id=${p.id}" aria-label="বিস্তারিত দেখুন">${imgs}
      <span class="pc-price">${money(p.price)} <small>/ ${p.ptype === 'kg' ? 'কেজি' : 'প্রতিটি'}</small></span>
      ${im.length > 1 ? `<span class="pc-imgs">${ic('lucide:images')} ${bn(im.length)}</span>` : ''}</a>`;
  }
  function card(p, i) {
    const c = catOf(p.cat), seller = users().find(u => u.id === p.sellerId);
    return `<article class="pc" id="p-${p.id}" style="animation-delay:${(i % 6) * 40}ms">
      <header class="pc-h">${avatar(seller)}
        <div class="pc-who"><b>${esc(seller?.name || 'খামারি')} ${ic('lucide:badge-check', 'vf')}</b>
          <small>${ago(p.createdAt)} · ${ic('lucide:map-pin')} ${esc(p.district)} · ${ic('lucide:globe')}</small></div>
        <span class="pc-cat">${c.name}</span>
        <div class="pc-more" data-id="${p.id}"><button class="pc-mb" data-soc="menu" aria-label="আরও">${ic('lucide:ellipsis')}</button>
          <div class="soc-menu"><button data-soc="save">${ic('lucide:bookmark')}<em>সংরক্ষণ করুন</em></button>
            <button data-soc="copy">${ic('lucide:link')}<em>লিংক কপি করুন</em></button>
            <button data-soc="report">${ic('lucide:flag')}<em>রিপোর্ট করুন</em></button></div></div></header>
      <h3 class="pc-t"><a href="post.html?id=${p.id}">${esc(p.title)}</a></h3>
      <div class="pc-dw"><p class="pc-d">${esc(p.desc)}</p><button class="pc-dm hide" data-dmore>আরও দেখুন</button></div>
      ${gallery(p)}
      <div class="pc-row">
        <dl class="pc-info">
          <div><dt>জাত</dt><dd>${esc(p.breed)}</dd></div>
          <div><dt>পরিমাণ</dt><dd>${bn(p.count)}টি</dd></div>
          <div><dt>গড় ওজন</dt><dd>${bn(p.avg)} কেজি</dd></div>
          <div><dt>মোট ওজন</dt><dd>${bn(p.total)} কেজি</dd></div>
        </dl>
        <a class="pc-btn" href="post.html?id=${p.id}">${KB.me() ? '' : ic('lucide:lock') + ' '}বিস্তারিত ${ic('lucide:arrow-right')}</a>
      </div>
      ${Social.block(p)}
    </article>`;
  }

  // লম্বা বিবরণ কেটে "আরও দেখুন" বাটন দেখানো
  function fitDesc(root = document) {
    root.querySelectorAll('.pc-dw').forEach(w => {
      const d = w.querySelector('.pc-d'), b = w.querySelector('.pc-dm');
      if (d.classList.contains('open')) return;
      b.classList.toggle('hide', d.scrollHeight <= d.clientHeight + 1);
    });
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-dmore]'); if (!b) return;
    const d = b.parentElement.querySelector('.pc-d'), on = d.classList.toggle('open');
    b.textContent = on ? 'কম দেখুন' : 'আরও দেখুন';
  });
  let rz; window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => fitDesc(), 150); });

  // ---------- অটো লোড (স্ক্রল করে নিচে গেলেই আরও পোস্ট) ----------
  let cur = [], loading = false;
  const PAGE = 6;
  function syncMore() {
    const more = cur.length > S.shown;
    $('more').classList.toggle('hide', !more);
    $('feedEnd').classList.toggle('hide', more || cur.length <= PAGE);
  }
  function loadMore() {
    if (loading || cur.length <= S.shown) return;
    loading = true;
    setTimeout(() => {                       // সামান্য বিরতি, যাতে লোডিং স্পিনার দেখা যায়
      const start = S.shown; S.shown += PAGE;
      $('list').insertAdjacentHTML('beforeend', cur.slice(start, S.shown).map((p, i) => card(p, i)).join(''));
      fitDesc(); syncMore(); loading = false;
      if (io) { io.unobserve($('more')); io.observe($('more')); }   // এখনও স্ক্রিনে থাকলে আবার চালু
    }, 450);
  }
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) loadMore(); }, { rootMargin: '500px 0px' }) : null;
  if (io) io.observe($('more'));
  else { $('more').innerHTML = '<button class="btn btn-green" id="moreBtn">আরও দেখুন</button>'; document.addEventListener('click', e => { if (e.target.closest('#moreBtn')) loadMore(); }); }

  function render() {
    document.querySelectorAll('.cat[data-c]').forEach(b => b.classList.toggle('on', b.dataset.c === S.cat));
    const all = posts().filter(p => p.status === 'approved');
    let list = all.filter(p =>
      (!S.cat || p.cat === S.cat) && (!S.breed || p.breed === S.breed) && (!S.dist || p.district === S.dist) && (!S.min || p.price >= S.min) && (!S.max || p.price <= S.max) &&
      (!S.q || [p.title, p.breed, p.district, p.desc, catOf(p.cat).name].join(' ').includes(S.q)));
    list.sort((a, b) => S.sort === 'low' ? a.price - b.price : S.sort === 'high' ? b.price - a.price : b.createdAt - a.createdAt);
    cur = list;
    const fmt = n => KB.money(n);
    const chips = [];
    if (S.cat) chips.push(['cat', `${ic(catOf(S.cat).icon)} ${catOf(S.cat).name}`]);
    if (S.breed) chips.push(['breed', esc(S.breed)]);
    if (S.dist) chips.push(['dist', `${ic('lucide:map-pin')} ${esc(S.dist)}`]);
    if (S.min || S.max) chips.push(['price', S.min && S.max ? `${fmt(S.min)} – ${fmt(S.max)}` : S.max ? `≤ ${fmt(S.max)}` : `≥ ${fmt(S.min)}`]);
    if (S.q) chips.push(['q', `"${esc(S.q)}"`]);
    $('fActive').innerHTML = chips.map(([k, t]) => `<span class="achip">${t}<button data-k="${k}" aria-label="সরান">${ic('lucide:x')}</button></span>`).join('');
    $('rCount').textContent = $('rCount2').textContent = bn(list.length);
    [$('fCount'), $('fCount2')].forEach(el => { el.textContent = bn(chips.length); el.classList.toggle('hide', !chips.length); });
    $('reset').classList.toggle('hide', !chips.length && S.sort === 'new');
    document.querySelectorAll('#sortSeg [data-s]').forEach(b => b.classList.toggle('on', b.dataset.s === S.sort));
    document.querySelectorAll('#qp [data-max]').forEach(b => b.classList.toggle('on', !S.min && S.max === +b.dataset.max));
    $('list').innerHTML = list.length
      ? list.slice(0, S.shown).map(card).join('')
      : `<div class="empty card"><i>${ic('lucide:search-x')}</i><h3>কিছু পাওয়া যায়নি</h3><p>অন্য ক্যাটাগরি বা জেলা দিয়ে চেষ্টা করুন।</p></div>`;
    syncMore();
    fitDesc();
  }
  setBreeds();
  render();
  if (document.fonts) document.fonts.ready.then(() => fitDesc());
  window.addEventListener('load', () => fitDesc());
  // হিরো ছবির প্যারালাক্স (শুধু ডেস্কটপে; স্ক্রল করলে ছবি আস্তে নিচে নামে)
  (() => {
    const layer = document.querySelector('.hero-bg > div'), hero = document.querySelector('.hero');
    if (!layer || !matchMedia('(min-width:861px)').matches || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    let tick = false;
    const upd = () => { tick = false; const h = hero.offsetHeight; if (scrollY > h * 2) return; layer.style.transform = `translate3d(0,${Math.min(scrollY * 0.28, h * 0.13).toFixed(1)}px,0)`; };
    addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
    addEventListener('resize', upd); upd();
  })();
  if (qs.get('s')) { scrollTo(0, 0); $('hq').focus(); }
})();
