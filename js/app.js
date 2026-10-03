/* খামারি বাজার - shared: data store (localStorage, পরে MySQL API দিয়ে বদলাবে), auth, navbar */
const KB = (() => {
  const CATS = [
    // বাংলাদেশে ভোগের র‍্যাঙ্ক অনুযায়ী সাজানো; groups = জাতের ধরন (প্রকার)
    { id: 'chicken', name: 'মুরগি', icon: 'game-icons:chicken', groups: [
      { t: 'বাণিজ্যিক', b: ['ব্রয়লার', 'লেয়ার', 'সোনালী', 'কালার বার্ড'] },
      { t: 'দেশি ও অন্যান্য', b: ['দেশি মুরগি', 'ফাউমি', 'আসিল', 'পাকিস্তানি কক'] }] },
    { id: 'cow', name: 'গরু', icon: 'game-icons:cow', groups: [
      { t: 'দেশি জাত', b: ['রেড চিটাগাং', 'পাবনা', 'গয়াল', 'দেশি গরু'] },
      { t: 'বিদেশি / ক্রস', b: ['শাহিওয়াল', 'ফ্রিজিয়ান', 'ব্রাহমা', 'জার্সি', 'সাহিওয়াল ক্রস'] }] },
    { id: 'goat', name: 'ছাগল', icon: 'game-icons:goat', groups: [
      { t: 'দেশি জাত', b: ['ব্ল্যাক বেঙ্গল', 'দেশি ছাগল'] },
      { t: 'বিদেশি / ক্রস', b: ['যমুনাপাড়ি', 'বিটল', 'সিরোহি', 'বরবরি', 'ক্রস ব্রিড'] }] },
    { id: 'duck', name: 'হাঁস', icon: 'game-icons:duck', groups: [
      { t: 'দেশি', b: ['দেশি হাঁস', 'জিন্ডিং'] },
      { t: 'উন্নত ও বিদেশি', b: ['খাকি ক্যাম্পবেল', 'মাসকোভি', 'পিকিন'] }] },
    { id: 'sheep', name: 'ভেড়া', icon: 'game-icons:sheep', groups: [
      { t: 'দেশি', b: ['গ্যারোল', 'দেশি ভেড়া'] },
      { t: 'ক্রস ও বিদেশি', b: ['দুম্বা', 'ক্রসব্রিড'] }] },
    { id: 'buffalo', name: 'মহিষ', icon: 'game-icons:buffalo-head', groups: [
      { t: 'দেশি', b: ['দেশি মহিষ'] },
      { t: 'ক্রস / বিদেশি', b: ['মুররাহ', 'নীলি রাভি', 'মেডিটেরেনিয়ান ক্রস'] }] },
    { id: 'pigeon', name: 'কবুতর', icon: 'game-icons:dove', breeds: ['গিরিবাজ', 'লোটন', 'জ্যাকোবিন', 'ফ্যানটেল', 'দেশি'] },
    { id: 'fish', name: 'মাছ', icon: 'fa6-solid:fish', breeds: ['রুই', 'কাতলা', 'তেলাপিয়া', 'পাঙ্গাস', 'শিং-মাগুর', 'দেশি মাছ'] },
    { id: 'shrimp', name: 'চিংড়ি', icon: 'game-icons:shrimp', breeds: ['গলদা চিংড়ি', 'বাগদা চিংড়ি', 'হরিণা চিংড়ি'] },
    { id: 'turkey', name: 'টার্কি', icon: 'game-icons:rooster', breeds: ['ব্রোঞ্জ', 'সাদা টার্কি', 'বোরবন রেড', 'দেশি'] },
    { id: 'quail', name: 'কোয়েল', icon: 'fa6-solid:kiwi-bird', breeds: ['জাপানিজ কোয়েল', 'ব্রয়লার কোয়েল', 'লেয়ার কোয়েল'] },
    { id: 'goose', name: 'রাজহাঁস', icon: 'game-icons:goose', breeds: ['দেশি রাজহাঁস', 'সাদা রাজহাঁস', 'চাইনিজ গিজ'] },
    { id: 'rabbit', name: 'খরগোশ', icon: 'game-icons:rabbit', breeds: ['নিউজিল্যান্ড হোয়াইট', 'ক্যালিফোর্নিয়ান', 'দেশি', 'লায়নহেড'] },
    { id: 'horse', name: 'ঘোড়া', icon: 'fa6-solid:horse', breeds: ['দেশি ঘোড়া', 'আরবি', 'পনি'] },
    { id: 'camel', name: 'উট', icon: 'game-icons:camel', breeds: ['আরবি উট', 'দেশি উট'] },
  ];
  CATS.forEach(c => { if (c.groups) c.breeds = c.groups.flatMap(g => g.b); });
  const DISTRICTS = 'ঢাকা,গাজীপুর,নারায়ণগঞ্জ,নরসিংদী,মানিকগঞ্জ,মুন্সিগঞ্জ,টাঙ্গাইল,কিশোরগঞ্জ,ময়মনসিংহ,জামালপুর,শেরপুর,নেত্রকোণা,ফরিদপুর,গোপালগঞ্জ,মাদারীপুর,রাজবাড়ী,শরীয়তপুর,চট্টগ্রাম,কক্সবাজার,কুমিল্লা,ব্রাহ্মণবাড়িয়া,চাঁদপুর,নোয়াখালী,ফেনী,লক্ষ্মীপুর,খাগড়াছড়ি,রাঙামাটি,বান্দরবান,রাজশাহী,নাটোর,নওগাঁ,চাঁপাইনবাবগঞ্জ,পাবনা,সিরাজগঞ্জ,বগুড়া,জয়পুরহাট,খুলনা,যশোর,সাতক্ষীরা,বাগেরহাট,নড়াইল,মাগুরা,ঝিনাইদহ,কুষ্টিয়া,চুয়াডাঙ্গা,মেহেরপুর,বরিশাল,পটুয়াখালী,ভোলা,পিরোজপুর,ঝালকাঠি,বরগুনা,সিলেট,মৌলভীবাজার,হবিগঞ্জ,সুনামগঞ্জ,রংপুর,দিনাজপুর,গাইবান্ধা,কুড়িগ্রাম,লালমনিরহাট,নীলফামারী,পঞ্চগড়,ঠাকুরগাঁও'.split(',');

  // ---------- icons (react-icons sets, inline SVG) ----------
  const ICONS = window.KB_ICONS || {};
  const ic = (name, cls = '') => {
    const i = ICONS[name] || ICONS['lucide:paw-print']; if (!i) return '';
    return `<svg class="ic ${cls}" viewBox="0 0 ${i.w} ${i.h}" width="1em" height="1em" fill="currentColor" aria-hidden="true">${i.b}</svg>`;
  };
  const hydrate = (root = document) => root.querySelectorAll('[data-ic]').forEach(el => { el.innerHTML = ic(el.dataset.ic); });
  document.addEventListener('DOMContentLoaded', () => hydrate());
  // প্রোফাইল ছবি থাকলে ছবি, না থাকলে নামের প্রথম অক্ষর
  const avatar = (u, cls = '') => {
    const l = esc((u && u.name || 'খ')[0]);
    return u && u.photo
      ? `<span class="avatar has-img ${cls}">${l}<img src="${esc(u.photo)}" alt="" loading="lazy" onerror="this.remove()"></span>`
      : `<span class="avatar ${cls}">${l}</span>`;
  };
  // ক্যাটাগরির আসল ছবি (img/category/web/<id>.webp)
  const CAT_IMG = new Set(['chicken', 'cow', 'goat', 'duck', 'sheep', 'buffalo', 'pigeon', 'fish', 'shrimp', 'turkey', 'quail', 'goose', 'rabbit', 'horse', 'camel']);
  const applyCatImg = () => CATS.forEach(c => { if (!c.img && CAT_IMG.has(c.id)) c.img = `img/category/web/${c.id}.webp`; });
  const catPic = (c, cls = '') => c && c.img ? `<img class="cpic ${cls}" src="${esc(c.img)}" alt="${esc(c.name)}" loading="lazy" decoding="async">` : ic(c ? c.icon : 'lucide:paw-print');
  const catOf = id => CATS.find(c => c.id === id) || CATS[0];
  // সংখ্যা সবসময় ইংরেজি অঙ্কে, Geist ফন্টে দেখানো হয় (CSS-এ শুধু অঙ্কের জন্য লোড হয়)
  const bn = n => String(n).replace(/[০-৯]/g, d => '০১২৩৪৫৬৭৮৯'.indexOf(d));
  const money = n => '৳' + bn(Number(n).toLocaleString('en-IN'));
  const esc = s => bn(String(s ?? '')).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ago = ts => {
    const m = Math.floor((Date.now() - ts) / 60000);
    if (m < 1) return 'এইমাত্র';
    if (m < 60) return bn(m) + ' মিনিট আগে';
    const h = Math.floor(m / 60);
    if (h < 24) return bn(h) + ' ঘণ্টা আগে';
    return bn(Math.floor(h / 24)) + ' দিন আগে';
  };
  // ছবি না থাকলে ব্র্যান্ড রঙের প্লেসহোল্ডার
  const ph = (icon, i = 0) => {
    const cc = CATS.find(c => c.icon === icon); if (cc && cc.img) return cc.img;
    const k = ICONS[icon] || { b: '', w: 512, h: 512 }, s = 110 / Math.max(k.w, k.h);
    return 'data:image/svg+xml,' + encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${i % 2 ? '#2a5640' : '#1b3a2a'}"/><stop offset="1" stop-color="#12291e"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/><circle cx="200" cy="150" r="96" fill="none" stroke="#fff" stroke-opacity=".25" stroke-dasharray="6 6"/><g color="#f5a623" fill="currentColor" transform="translate(${200 - k.w * s / 2} ${150 - k.h * s / 2}) scale(${s})">${k.b}</g></svg>`);
  };

  // ---------- store ----------
  const get = (k, d) => { try { return JSON.parse(localStorage.getItem('kb_' + k)) ?? d; } catch { return d; } };
  const set = (k, v) => { try { localStorage.setItem('kb_' + k, JSON.stringify(v)); } catch { toast('স্টোরেজ ভরে গেছে, ছবি কম দিন'); } };
  // অ্যাডমিনের সেভ করা ক্যাটাগরি থাকলে সেটাই ব্যবহার হবে
  const savedCats = get('cats', null);
  if (Array.isArray(savedCats) && savedCats.length) CATS.splice(0, CATS.length, ...savedCats);
  applyCatImg();
  const saveCats = list => { CATS.splice(0, CATS.length, ...list); applyCatImg(); set('cats', list); };

  // পুরনো ডেমো ডেটা থেকে শিরোনামে থাকা সংখ্যা সরানো (পরিমাণ এখন আলাদা ঘরে)
  if (get('seeded') && get('seedv') !== 2) {
    const fix = {101: "কুরবানির জন্য সুন্দর দেশি ষাঁড় গরু", 102: "ব্ল্যাক বেঙ্গল খাসি বিক্রি হবে", 103: "খাঁটি দেশি মুরগি", 105: "ডিমপাড়া খাকি ক্যাম্পবেল হাঁস", 106: "বড় সাইজের দুম্বা - কুরবানির জন্য", 110: "যমুনাপাড়ি ছাগল"};
    set('posts', get('posts', []).map(p => fix[p.id] ? { ...p, title: fix[p.id] } : p)); set('seedv', 2);
  }
  function seed() {
    if (get('seeded')) return;
    const now = Date.now(), H = 3600e3;
    const u = [
      { id: 1, name: 'খামারি অ্যাডমিন', phone: '01700000000', pass: 'admin123', role: 'admin' },
      { id: 2, name: 'আব্দুর রহিম', phone: '01711111111', pass: '123456', role: 'user' },
      { id: 3, name: 'সুমাইয়া আক্তার', phone: '01822222222', pass: '123456', role: 'user' },
      { id: 4, name: 'মোঃ কামাল হোসেন', phone: '01933333333', pass: '123456', role: 'user' },
    ];
    const P = (id, seller, cat, breed, title, count, avg, price, ptype, dist, addr, age, desc, hrs, status) => ({
      id, sellerId: seller, cat, breed, title, count, avg, total: +(count * avg).toFixed(1), price, ptype, district: dist, address: addr, age,
      desc, phone: u.find(x => x.id === seller).phone, images: [], status, createdAt: now - hrs * H,
    });
    set('users', u);
    set('posts', [
      P(101, 2, 'cow', 'দেশি', 'কুরবানির জন্য সুন্দর দেশি ষাঁড় গরু', 3, 320, 135000, 'piece', 'সিরাজগঞ্জ', 'শাহজাদপুর, সিরাজগঞ্জ সদর', '3 বছর', 'নিজের খামারে লালন-পালন করা। দেশি খাবারে বড় করা, কোনো ইনজেকশন বা হরমোন দেওয়া হয়নি। সম্পূর্ণ সুস্থ ও টিকা দেওয়া। সরাসরি এসে দেখে নিতে পারবেন।', 3, 'approved'),
      P(102, 3, 'goat', 'ব্ল্যাক বেঙ্গল', 'ব্ল্যাক বেঙ্গল খাসি বিক্রি হবে', 12, 22, 18500, 'piece', 'যশোর', 'ঝিকরগাছা, যশোর', '1.5 বছর', 'খাঁটি ব্ল্যাক বেঙ্গল জাতের খাসি। মাংস সুস্বাদু ও চর্বি কম। একসাথে নিলে দামে ছাড় দেওয়া হবে।', 7, 'approved'),
      P(103, 4, 'chicken', 'দেশি', 'খাঁটি দেশি মুরগি', 50, 1.6, 620, 'piece', 'ময়মনসিংহ', 'ত্রিশাল, ময়মনসিংহ', '5 মাস', 'ফ্রি-রেঞ্জে পালিত দেশি মুরগি। বাজার দরের চেয়ে কম দামে সরাসরি খামার থেকে। ডেলিভারির ব্যবস্থা আছে।', 12, 'approved'),
      P(104, 2, 'cow', 'শাহিওয়াল', 'শাহিওয়াল জাতের দুধেল গাভী, দৈনিক 14 লিটার', 1, 380, 145000, 'piece', 'পাবনা', 'ঈশ্বরদী, পাবনা', '4 বছর', 'দ্বিতীয় বাচ্চার গাভী, প্রতিদিন গড়ে 14 লিটার দুধ দেয়। শান্ত স্বভাবের, সব টিকা দেওয়া।', 20, 'approved'),
      P(105, 3, 'duck', 'খাকি ক্যাম্পবেল', 'ডিমপাড়া খাকি ক্যাম্পবেল হাঁস', 20, 1.9, 480, 'piece', 'বরিশাল', 'বাকেরগঞ্জ, বরিশাল', '8 মাস', 'প্রতিদিন নিয়মিত ডিম দেয়। সুস্থ ও সবল, খামার থেকে সরাসরি।', 30, 'approved'),
      P(106, 4, 'sheep', 'দুম্বা', 'বড় সাইজের দুম্বা, কুরবানির জন্য', 2, 65, 85000, 'piece', 'গাজীপুর', 'কালিয়াকৈর, গাজীপুর', '2 বছর', 'স্বাস্থ্যবান ও সুন্দর গড়নের দুম্বা। পরিবহনে সহযোগিতা করা হবে।', 36, 'approved'),
      P(107, 2, 'fish', 'রুই', 'জ্যান্ত রুই মাছ, পুকুর থেকে সরাসরি', 200, 2.2, 290, 'kg', 'কুমিল্লা', 'চান্দিনা, কুমিল্লা', '1 বছর', 'নিজের পুকুরের টাটকা রুই। ধরে দেওয়া হবে, পরিমাণ অনুযায়ী দাম আলোচনা সাপেক্ষে।', 50, 'approved'),
      P(108, 3, 'pigeon', 'গিরিবাজ', 'গিরিবাজ কবুতর জোড়া, প্রজননক্ষম', 6, 0.4, 3500, 'piece', 'ঢাকা', 'মিরপুর, ঢাকা', '1 বছর', 'ভালো জাতের গিরিবাজ, বাচ্চা তুলছে। জোড়া হিসেবে বিক্রি।', 70, 'approved'),
      P(109, 4, 'cow', 'ফ্রিজিয়ান', 'ফ্রিজিয়ান ক্রস ষাঁড়, মোটাতাজা', 2, 450, 210000, 'piece', 'রাজশাহী', 'পুঠিয়া, রাজশাহী', '3 বছর', 'অনেক বড় সাইজ, প্রাকৃতিক খাবারে মোটাতাজা করা। দেখতে এলে খামার ঘুরে দেখাবো।', 2, 'pending'),
      P(110, 2, 'goat', 'যমুনাপাড়ি', 'যমুনাপাড়ি ছাগল', 4, 45, 32000, 'piece', 'টাঙ্গাইল', 'মধুপুর, টাঙ্গাইল', '2 বছর', 'লম্বা কান, বড় গড়ন। কুরবানির জন্য উপযুক্ত।', 5, 'pending'),
    ].map(p => { p.age = bn(p.age.replace('3', '3')); return p; }));
    set('seeded', 1); set('seedv', 2);
  }
  seed();
  // ডেমো ডেটা থেকে লম্বা ড্যাশ সরানো
  {
    const list = get('posts', []); let ch = false;
    list.forEach(x => ['title', 'desc'].forEach(k => { if (typeof x[k] === 'string' && x[k].includes('\u2014')) { x[k] = x[k].replace(/\s*\u2014\s*/g, ', '); ch = true; } }));
    if (ch) set('posts', list);
  }
  // ডেমো পোস্টে আসল ছবি (img/post/web/*.webp) + একটি মহিষের পোস্ট
  {
    const IMG = { 101: 'cow', 102: 'goat', 103: 'chicken', 104: 'cow', 105: 'ducks', 106: 'sheeps', 107: 'fish', 108: 'pigeons', 109: 'cow', 110: 'goat', 111: 'buffalo' };
    const list = get('posts', []); let ch = false;
    if (!list.some(x => x.id === 111) && get('users', []).some(x => x.id === 3)) {
      list.push({ id: 111, sellerId: 3, cat: 'buffalo', breed: 'দেশি মহিষ', title: 'দেশি মহিষ বিক্রি হবে', count: 2, avg: 380, total: 760, price: 120000, ptype: 'piece', district: 'নওগাঁ', address: 'ধামইরহাট, নওগাঁ', age: '4 বছর',
        desc: 'শক্তিশালী ও সুস্থ দেশি মহিষ। নিজের খামারে প্রাকৃতিক খাবারে বড় করা। হালচাষ ও দুধ, দুই কাজেই ভালো। সরাসরি এসে দেখে নিতে পারবেন।', phone: '01822222222', images: [], status: 'approved', createdAt: Date.now() - 9 * 3600e3 });
      ch = true;
    }
    list.forEach(x => { if (IMG[x.id] && (!x.images || !x.images.length)) { x.images = [`img/post/web/${IMG[x.id]}.webp`]; ch = true; } });
    if (ch) set('posts', list);
  }
  {
    const P = { 1: 'men/75', 2: 'men/32', 3: 'women/44', 4: 'men/46' }, ul = get('users', []); let ch = false;
    ul.forEach(x => { if (P[x.id] && !x.photo) { x.photo = 'https://randomuser.me/api/portraits/' + P[x.id] + '.jpg'; ch = true; } });
    if (ch) set('users', ul);
  }

  const users = () => get('users', []);
  const posts = () => get('posts', []);
  const savePosts = p => set('posts', p);
  const me = () => { const id = get('session'); return id ? users().find(u => u.id === id && !u.blocked) || null : null; };
  const loginUser = (phone, pass) => { const u = users().find(x => x.phone === phone && x.pass === pass); if (u && u.blocked) return { blocked: true }; if (u) set('session', u.id); return u; };
  const register = (name, phone, pass) => {
    const list = users();
    if (list.some(u => u.phone === phone)) return null;
    const u = { id: Date.now(), name, phone, pass, role: 'user' };
    list.push(u); set('users', list); set('session', u.id); return u;
  };
  const logout = () => { localStorage.removeItem('kb_session'); location.href = '/'; };
  const requireLogin = () => { if (!me()) { location.href = '/login?next=' + encodeURIComponent(location.pathname + location.search); return false; } return true; };


  // ডেমো: কয়েকটি পোস্টে একাধিক ছবি, যাতে কোলাজ দেখা যায়
  if (!get('multiimg')) {
    const W = n => `img/post/web/${n}.webp`;
    const MULTI = { 101: ['cow', 'buffalo', 'sheeps', 'goat', 'chicken', 'fish'], 102: ['goat', 'sheeps', 'cow'], 103: ['chicken', 'ducks'], 104: ['cow', 'buffalo', 'goat', 'pigeons'] };
    const list = get('posts', []);
    list.forEach(x => { if (MULTI[x.id] && (x.images || []).length <= 1) x.images = MULTI[x.id].map(W); });
    set('posts', list); set('multiimg', 1);
  }

  // ---------- ব্লগ ----------
  const BLOG_CATS = ['পশু পালন', 'কুরবানি', 'খামার ব্যবস্থাপনা', 'মাছ চাষ', 'বাজার ও দাম', 'টিপস'];
  const DAY = 86400e3;
  const BLOG_SEED = [
    { id: 201, title: 'কুরবানির পশু কেনার আগে যে 7টি বিষয় অবশ্যই দেখবেন', cat: 'কুরবানি', cover: 'img/post/web/cow.webp', daysAgo: 2,
      excerpt: 'হাটে যাওয়ার আগে একটু প্রস্তুতি নিলেই ভালো পশু সঠিক দামে কেনা সহজ হয়। জেনে নিন দরকারি সাতটি বিষয়।',
      body: `কুরবানির সময় পশুর বাজার সরগরম থাকে। তাড়াহুড়োয় কিনলে ঠকে যাওয়ার সম্ভাবনা বেশি, তাই আগে থেকেই কিছু বিষয় জেনে রাখা ভালো।

## 1. পশুর বয়স ও দাঁত দেখুন
কুরবানির জন্য গরু-মহিষের বয়স কমপক্ষে 2 বছর এবং ছাগল-ভেড়ার বয়স কমপক্ষে 1 বছর হতে হয়। দাঁত দেখে বয়স মোটামুটি বোঝা যায়, তাই বিক্রেতার কথার সঙ্গে নিজেও যাচাই করুন।

## 2. সুস্থতার লক্ষণ
পশুর চোখ পরিষ্কার, নাক ভেজা, চামড়া মসৃণ এবং চলাফেরা স্বাভাবিক কি না দেখুন। খোঁড়ানো, অতিরিক্ত লালা বা ঝিমানো ভাব থাকলে এড়িয়ে চলুন।

## 3. ওজন ও দামের হিসাব
চোখের আন্দাজে না কিনে সম্ভব হলে ওজন বা মাংসের পরিমাণ সম্পর্কে বিক্রেতার কাছে স্পষ্ট জানতে চান। খামারি বাজারে প্রতিটি পোস্টে গড় ওজন ও মোট ওজন আলাদা করে দেওয়া থাকে।

## 4. সরাসরি খামারির সঙ্গে কথা বলুন
মধ্যস্বত্বভোগী ছাড়া সরাসরি খামারির কাছ থেকে কিনলে দাম কম পড়ে এবং পশুর খাবার ও পরিচর্যা সম্পর্কে সঠিক তথ্য পাওয়া যায়।

## 5. অগ্রিম টাকা নয়
পশু নিজে দেখার আগে কাউকে অগ্রিম টাকা পাঠাবেন না। সরাসরি গিয়ে দেখে, দাম ঠিক করে তারপর লেনদেন করুন।

- হরমোন বা ইনজেকশন দেওয়া হয়েছে কি না জিজ্ঞাসা করুন
- টিকা দেওয়া আছে কি না জেনে নিন
- পরিবহনের ব্যবস্থা আগেই ঠিক করে রাখুন

সবশেষে মনে রাখুন, ভালো পশু চেনার সবচেয়ে বড় উপায় হলো নিজে দেখা এবং ধৈর্য ধরে দরদাম করা।` },
    { id: 202, title: 'দেশি মুরগি পালনে সফল হওয়ার সহজ টিপস', cat: 'পশু পালন', cover: 'img/post/web/chicken.webp', daysAgo: 5,
      excerpt: 'অল্প জায়গা আর কম খরচে দেশি মুরগি পালন করে ভালো আয় করা সম্ভব। শুরু করার আগে এই বিষয়গুলো জানা থাকলে ঝুঁকি কমে।',
      body: `দেশি মুরগির চাহিদা সারা বছরই থাকে এবং বাজারে দামও ভালো পাওয়া যায়। সঠিক নিয়মে পালন করলে বাড়ির উঠানেই ছোট পরিসরে খামার গড়ে তোলা যায়।

## জায়গা ও ঘর
মুরগির ঘর শুকনো, আলো-বাতাস চলাচলের উপযোগী এবং শিয়াল-বিড়ালের হাত থেকে নিরাপদ হওয়া চাই। প্রতিটি মুরগির জন্য কমপক্ষে 2 বর্গফুট জায়গা রাখুন।

## খাবার ও পানি
সকালে ও বিকেলে নিয়মিত খাবার দিন। দানাদার খাবারের পাশাপাশি শাকসবজি ও কেঁচো জাতীয় প্রোটিন মুরগির বৃদ্ধি ভালো রাখে। পরিষ্কার পানি সবসময় হাতের কাছে রাখুন।

## রোগ প্রতিরোধ
রাণীক্ষেত, গামবোরো ও ফাউল পক্সের টিকা সময়মতো দিন। অসুস্থ মুরগিকে আলাদা করে ফেলুন, তাহলে সংক্রমণ ছড়ায় না।

## বিক্রির সময়
সাধারণত 5 থেকে 6 মাস বয়সে দেশি মুরগি বিক্রির উপযোগী হয়। খামারি বাজারে পোস্ট করে সরাসরি ক্রেতার সঙ্গে যোগাযোগ করলে ভালো দাম পাওয়া যায়।` },
    { id: 203, title: 'ব্ল্যাক বেঙ্গল ছাগল পালনের শুরুর গাইড', cat: 'খামার ব্যবস্থাপনা', cover: 'img/post/web/goat.webp', daysAgo: 9,
      excerpt: 'কম খরচে বেশি আয়ের জন্য ব্ল্যাক বেঙ্গল ছাগল দেশের সেরা পছন্দগুলোর একটি। জেনে নিন কীভাবে শুরু করবেন।',
      body: `ব্ল্যাক বেঙ্গল ছাগল আকারে ছোট হলেও এর মাংস অত্যন্ত সুস্বাদু এবং বাজারে চাহিদা বেশি। বছরে দুইবার এবং প্রতিবারে 2 থেকে 3টি বাচ্চা দেওয়ার কারণে খামারিদের কাছে এটি জনপ্রিয়।

## ঘর তৈরি
মাটি থেকে কিছুটা উঁচুতে মাচা করে ঘর বানালে ছাগল শুকনো থাকে এবং রোগ কম হয়। ঘরে পর্যাপ্ত আলো-বাতাস থাকা জরুরি।

## খাবার
কাঁঠাল পাতা, ঘাস ও দানাদার মিশ্রণ ছাগলের প্রধান খাবার। প্রতিদিন তাজা পানি এবং সামান্য লবণ দিলে স্বাস্থ্য ভালো থাকে।

## টিকা ও কৃমিনাশক
পিপিআর রোগের টিকা এবং নিয়মিত কৃমিনাশক ওষুধ খাওয়ানো অত্যন্ত জরুরি। স্থানীয় প্রাণিসম্পদ অফিস থেকে পরামর্শ নিতে পারেন।

## কখন বিক্রি করবেন
কুরবানি বা বিয়ের মৌসুমে দাম বেশি পাওয়া যায়। ভালো ছবি ও সঠিক ওজনের তথ্যসহ পোস্ট দিলে ক্রেতা দ্রুত যোগাযোগ করেন।` },
    { id: 204, title: 'পুকুরে মাছ চাষে বর্ষার যত্ন', cat: 'মাছ চাষ', cover: 'img/post/web/fish.webp', daysAgo: 14,
      excerpt: 'বর্ষায় পানির মান দ্রুত বদলে যায়। পুকুরের মাছ সুস্থ রাখতে এই কয়েকটি কাজ নিয়মিত করুন।',
      body: `বর্ষাকালে অতিরিক্ত বৃষ্টিতে পুকুরের পানির মান বদলে যায় এবং মাছ রোগে আক্রান্ত হওয়ার ঝুঁকি বাড়ে। একটু সতর্ক থাকলে বড় ক্ষতি এড়ানো যায়।

## পানির মান পরীক্ষা
সপ্তাহে অন্তত একবার পানির রং ও গন্ধ লক্ষ্য করুন। পানি ঘোলা বা দুর্গন্ধযুক্ত হলে চুন প্রয়োগ করুন।

## পাড় ও বাঁধ মেরামত
ভারী বৃষ্টিতে পুকুরের পাড় ভেঙে মাছ বেরিয়ে যেতে পারে। আগেই বাঁধ উঁচু ও মজবুত করে নিন।

## খাবার কমিয়ে দিন
মেঘলা দিনে মাছ কম খাবার খায়, তাই খাবারের পরিমাণ কিছুটা কমিয়ে দিন। অতিরিক্ত খাবার পানিতে পচে পরিবেশ নষ্ট করে।

## বিক্রির প্রস্তুতি
মাছ বাজারে তোলার আগে ওজন ও পরিমাণ ঠিক করে খামারি বাজারে পোস্ট দিন, এতে ক্রেতারা আগেই দাম জেনে যোগাযোগ করতে পারেন।` },
    { id: 205, title: 'পশু বিক্রির পোস্টে ভালো ছবি তোলার 5টি কৌশল', cat: 'টিপস', cover: 'img/post/web/sheeps.webp', daysAgo: 20,
      excerpt: 'ভালো ছবি থাকলে ক্রেতা বেশি আগ্রহ দেখান। মোবাইল দিয়েই কীভাবে আকর্ষণীয় ছবি তুলবেন, জেনে নিন।',
      body: `একটি ভালো ছবি পোস্টের দর্শক অনেকগুণ বাড়িয়ে দিতে পারে। দামি ক্যামেরা ছাড়াই শুধু মোবাইল দিয়ে এই কৌশলগুলো কাজে লাগাতে পারেন।

- সকাল বা বিকেলের নরম আলোতে ছবি তুলুন
- পশুর সম্পূর্ণ শরীর দেখা যায় এমন পাশের ছবি দিন
- পেছনে পরিষ্কার ও ঝামেলাহীন জায়গা বেছে নিন
- সামনে, পাশে ও পেছন থেকে অন্তত তিনটি ছবি দিন
- ক্যামেরার লেন্স পরিষ্কার রাখুন

## পোস্টে কী লিখবেন
জাত, বয়স, ওজন ও খাবারের ধরন স্পষ্ট লিখুন। শিরোনামে সংখ্যা না দিয়ে পরিমাণ আলাদা ঘরে দিন, এতে পোস্ট দেখতে পরিষ্কার লাগে।

ভালো ছবি ও সঠিক তথ্য থাকলে ক্রেতার বিশ্বাস বাড়ে এবং দ্রুত বিক্রি হয়।` },
  ];
  const blogsRaw = () => get('blogs', []);
  const blogs = () => blogsRaw().filter(b => b.published !== false).sort((a, b) => b.createdAt - a.createdAt);
  const saveBlogs = l => set('blogs', l);
  if (!get('blogseed')) {
    saveBlogs(BLOG_SEED.map(s => ({ id: s.id, title: s.title, cat: s.cat, cover: s.cover, excerpt: s.excerpt, body: s.body, authorId: 1, published: true, createdAt: Date.now() - s.daysAgo * DAY })));
    set('blogseed', 1);
  }
  const MONTHS = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
  const fmtDate = ts => { const d = new Date(ts); return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`; };
  const readMin = t => Math.max(1, Math.round(String(t || '').split(/\s+/).length / 160));
  // সাধারণ মার্কডাউন: "## শিরোনাম", "- তালিকা", ফাঁকা লাইনে নতুন অনুচ্ছেদ
  const blogBody = text => String(text || '').split(/\n{2,}/).map(chunk => {
    const lines = chunk.split('\n').filter(Boolean);
    if (lines.every(l => l.startsWith('- '))) return `<ul>${lines.map(l => `<li>${esc(l.slice(2))}</li>`).join('')}</ul>`;
    if (lines[0] && lines[0].startsWith('## ')) {
      const rest = lines.slice(1).join('\n');
      return `<h2>${esc(lines[0].slice(3))}</h2>` + (rest ? `<p>${esc(rest).replace(/\n/g, '<br>')}</p>` : '');
    }
    return `<p>${esc(lines.join('\n')).replace(/\n/g, '<br>')}</p>`;
  }).join('');
  const blogCard = b => {
    const au = users().find(x => x.id === b.authorId);
    return `<a class="bcard" href="/blog?id=${b.id}">
      <div class="bcard-img"><img src="${esc(b.cover)}" alt="" loading="lazy" decoding="async"><span class="bcard-tag">${esc(b.cat)}</span></div>
      <div class="bcard-body">
        <div class="bcard-meta"><span>${ic('lucide:calendar')} ${fmtDate(b.createdAt)}</span><span>${ic('lucide:clock')} ${bn(readMin(b.body))} মিনিট</span></div>
        <h3>${esc(b.title)}</h3><p>${esc(b.excerpt)}</p>
        <div class="bcard-foot"><span class="bcard-au">${avatar(au, 'sm')}<b>${esc(au ? au.name : 'খামারি বাজার')}</b></span><span class="bcard-more">আরও পড়ুন ${ic('lucide:arrow-right')}</span></div>
      </div></a>`;
  };

  // ---------- UI ----------
  const I = {
    search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    home: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11 12 3l9 8v10h-6v-6H9v6H3z"/></svg>',
    grid: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
    plus: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    user: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg>',
    menu: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    leaf: '<svg viewBox="0 0 120 120" fill="#fff"><path d="M16 104C14 60 40 24 104 14c4 0 5 3 4 6-8 40-30 66-72 72-2 6-3 12-4 12-3 0-6-2-6-0z"/></svg>',
  };

  function mountNav(active) {
    const u = me();
    const link = (href, key, t) => `<a href="${href}" class="${active === key ? 'on' : ''}">${t}</a>`;
    document.getElementById('nav').innerHTML = `
    <header class="nav"><div class="wrap nav-in">
      <a class="brand" href="/"><img src="logo.png" alt="খামারি বাজার" height="52"><b class="brand-name">খামারি বাজার</b></a>
      <nav class="nav-links">${link('/', 'home', 'হোম')}${link('/feed', 'browse', 'পশু দেখুন')}${link('/blogs', 'blog', 'ব্লগ')}${link('/sell', 'sell', 'বিক্রি করুন')}${u && u.role === 'admin' ? link('/admin', 'admin', 'অ্যাডমিন') : ''}</nav>
      <form class="nav-search" id="navSearch">${I.search}<input type="search" placeholder="গরু, ছাগল, মুরগি খুঁজুন…" aria-label="খুঁজুন"></form>
      <div class="nav-actions">
        <a class="btn btn-amber btn-sm" href="/sell">+ বিক্রি করুন</a>
        ${u ? `<div class="menu" id="umenu"><button class="user-btn" aria-haspopup="true">${avatar(u)}<span>${esc(u.name.split(' ')[0])}</span></button>
          <div class="menu-pop"><a href="/my">আমার পোস্ট</a>${u.role === 'admin' ? '<a href="/admin">অ্যাডমিন প্যানেল</a>' : ''}<button id="lo">লগআউট</button></div></div>`
        : '<a class="btn btn-ghost btn-sm" href="/login">লগইন</a>'}
        <button class="burger" id="burger" aria-label="মেনু">${I.menu}</button>
      </div></div></header>
    <div class="drawer" id="drawer"><div class="bg"></div><aside class="pan" role="dialog" aria-label="মেনু">
      <div class="dr-head">
        <button class="dr-x" id="drx" aria-label="বন্ধ করুন">${ic('lucide:x')}</button>
        <div class="dr-brand"><img src="logo.png" alt="" class="dr-logo"><b>খামারি বাজার</b></div>
        ${u ? `<div class="dr-user">${avatar(u, 'big')}<div><b>${esc(u.name)}</b><small>${bn(esc(u.phone))}${u.role === 'admin' ? ' · অ্যাডমিন' : ''}</small></div></div>`
          : `<div class="dr-guest"><b>স্বাগতম!</b><small>লগইন করলে যোগাযোগ নম্বর দেখতে পাবেন</small><a class="btn btn-amber btn-sm" href="/login">লগইন / রেজিস্ট্রেশন</a></div>`}
      </div>
      <div class="dr-body">
        <a class="dr-sell" href="/sell"><span>${ic('lucide:plus')}</span><div><b>বিক্রি করুন</b><small>বিনামূল্যে পোস্ট দিন</small></div><i>${ic('lucide:chevron-right')}</i></a>
        <h5>ক্যাটাগরি</h5>
        <div class="dr-cats">${CATS.map(c => `<a href="/feed?cat=${c.id}"><i>${catPic(c)}</i>${c.name}</a>`).join('')}</div>
        <h5>মেনু</h5>
        <nav class="dr-nav">
          <a href="/"><i>${ic('lucide:house')}</i>হোম<em>${ic('lucide:chevron-right')}</em></a>
          <a href="/feed"><i>${ic('game-icons:cow')}</i>সব পশু দেখুন<em>${ic('lucide:chevron-right')}</em></a>
          <a href="/blogs"><i>${ic('lucide:book-open')}</i>ব্লগ<em>${ic('lucide:chevron-right')}</em></a>
          ${u ? `<a href="/my"><i>${ic('lucide:clipboard-list')}</i>আমার পোস্ট<em>${ic('lucide:chevron-right')}</em></a>${u.role === 'admin' ? `<a href="/admin"><i>${ic('lucide:shield-check')}</i>অ্যাডমিন প্যানেল<em>${ic('lucide:chevron-right')}</em></a>` : ''}` : ''}
        </nav>
      </div>
      ${u ? `<button class="dr-out" id="lo2">${ic('lucide:log-out')} লগআউট</button>` : ''}
      <p class="dr-copy">© ${bn(new Date().getFullYear())} খামারি বাজার। সর্বস্বত্ব সংরক্ষিত।</p>
    </aside></div>
    <nav class="tabbar">
      <a href="/" class="${active === 'home' ? 'on' : ''}">${I.home}হোম</a>
      <a href="/feed" class="${active === 'browse' ? 'on' : ''}">${I.grid}ফিড</a>
      <a href="/sell" class="plus" aria-label="বিক্রি করুন">${I.plus}</a>
      <a href="/feed?s=1">${I.search}খুঁজুন</a>
      <a href="${u ? '/my' : '/login'}" class="${active === 'my' ? 'on' : ''}">${I.user}${u ? 'আমার' : 'লগইন'}</a>
    </nav>`;
    const $ = id => document.getElementById(id);
    const dr = (on) => { $('drawer').classList.toggle('open', on); document.body.style.overflow = on ? 'hidden' : ''; };
    $('burger').onclick = () => dr(true);
    $('drawer').querySelector('.bg').onclick = $('drx').onclick = () => dr(false);
    $('drawer').querySelectorAll('a').forEach(a => a.addEventListener('click', () => dr(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') dr(false); });
    if (u) {
      $('umenu').querySelector('button').onclick = e => { e.stopPropagation(); $('umenu').classList.toggle('open'); };
      document.addEventListener('click', () => $('umenu').classList.remove('open'));
      $('lo').onclick = logout; $('lo2').onclick = e => { e.preventDefault(); logout(); };
    }
    $('navSearch').onsubmit = e => {
      e.preventDefault();
      const q = e.target.querySelector('input').value.trim();
      location.href = '/?q=' + encodeURIComponent(q) + '#feed';
    };
  }

  function mountFooter() {
    const el = document.getElementById('footer'); if (!el) return;
    const u = me(), L = (href, t) => `<a href="${href}">${ic('lucide:chevron-right')}<span>${t}</span></a>`;
    const trust = [['lucide:badge-check', 'যাচাইকৃত বিক্রেতা', 'অ্যাডমিন রিভিউ করা পোস্ট'], ['lucide:phone', 'সরাসরি যোগাযোগ', 'মধ্যস্বত্বভোগী ছাড়াই'], ['lucide:tags', 'বিনামূল্যে পোস্ট', 'কোনো কমিশন নেই'], ['lucide:map-pin', 'সারা বাংলাদেশে', '64 জেলা থেকে পশু']];
    const dist = ['ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'সিলেট', 'বরিশাল', 'রংপুর', 'ময়মনসিংহ'];
    const bl = document.body.hasAttribute('data-noblog') ? [] : blogs().slice(0, 3);
    const blogSec = bl.length ? `
    <section class="fblogs"><div class="wrap">
      <div class="fb-head"><div><span class="fb-k">${ic('lucide:book-open')} আমাদের ব্লগ</span><h2>খামার ও পশু পালনের কাজের টিপস</h2></div>
        <a class="btn btn-green" href="/blogs">সব ব্লগ দেখুন ${ic('lucide:arrow-right')}</a></div>
      <div class="fb-grid">${bl.map(blogCard).join('')}</div>
    </div></section>` : '';
    el.innerHTML = blogSec + `
    <footer class="ft">
      <div class="ft-trust"><div class="wrap ft-trust-in">${trust.map(([i, t, s]) => `<div><span>${ic(i)}</span><div><b>${t}</b><small>${s}</small></div></div>`).join('')}</div></div>
      <div class="wrap">
        <div class="ft-top">
          <div class="ft-brand">
            <img class="ft-logo" src="logo.png" alt="খামারি বাজার" height="64">
            <p>গ্রাম থেকে সরাসরি চাষির হাত থেকে আপনার বাজার। গরু, ছাগল, মুরগিসহ সব ধরনের পশু, দাম দেখে সরাসরি খামারির সঙ্গে যোগাযোগ করুন।</p>
            <div class="ft-soc"><a href="#" aria-label="ফেসবুক">${ic('fa6-brands:facebook')}</a><a href="#" aria-label="হোয়াটসঅ্যাপ">${ic('fa6-brands:whatsapp')}</a><a href="#" aria-label="টেলিগ্রাম">${ic('fa6-brands:telegram')}</a></div>
            <a class="ft-sell" href="/sell">${ic('lucide:plus')} পশু বিক্রি করুন</a>
          </div>
          <div class="ft-col"><h4>দ্রুত লিংক</h4>
            ${L('/', 'হোম')}${L('/feed', 'সব পশু দেখুন')}${L('/sell', 'বিক্রি করুন')}${L('/blogs', 'ব্লগ')}${u ? L('/my', 'আমার পোস্ট') : L('/login', 'লগইন / রেজিস্ট্রেশন')}${u && u.role === 'admin' ? L('/admin', 'অ্যাডমিন প্যানেল') : ''}</div>
          <div class="ft-col"><h4>ক্যাটাগরি</h4>
            ${CATS.slice(0, 7).map(c => L(`/feed?cat=${c.id}`, c.name)).join('')}${L('/feed', 'সব ক্যাটাগরি')}</div>
          <div class="ft-col"><h4>জনপ্রিয় জেলা</h4>
            ${dist.map(d => L(`/feed?q=${encodeURIComponent(d)}`, d)).join('')}</div>
          <div class="ft-col"><h4>সহায়তা</h4>
            ${L('/#feed', 'কীভাবে কাজ করে')}${L('/#feed', 'নিরাপদ কেনাকাটা')}${L('#', 'আমাদের সম্পর্কে')}${L('#', 'যোগাযোগ')}${L('#', 'গোপনীয়তা নীতি')}${L('#', 'শর্তাবলী')}</div>
        </div>
        <div class="ft-bot">
          <span class="ft-c">© ${bn(new Date().getFullYear())} খামারি বাজার। সর্বস্বত্ব সংরক্ষিত।</span>
          <span class="ft-dev">Developed by <a href="https://kamrulhasan.site" target="_blank" rel="noopener">Kamrul Hasan</a></span>
          <span class="ft-made">বাংলাদেশে তৈরি <svg viewBox="0 0 30 18" width="22" height="14" aria-hidden="true"><rect width="30" height="18" rx="2.5" fill="#006a4e"/><circle cx="13.5" cy="9" r="5.4" fill="#f42a41"/></svg></span>
          <button class="ft-up" id="ftUp" aria-label="উপরে যান">${ic('lucide:arrow-up')} <span>উপরে</span></button>
        </div>
      </div>
    </footer>`;
    const up = document.getElementById('ftUp'); if (up) up.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  let tt;
  function toast(msg) {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2600);
  }

  // ছবি ছোট করে (স্টোরেজ বাঁচাতে)
  const shrink = (file, max = 800) => new Promise(res => {
    const r = new FileReader();
    r.onload = () => {
      const im = new Image();
      im.onload = () => {
        const s = Math.min(1, max / Math.max(im.width, im.height));
        const c = document.createElement('canvas'); c.width = im.width * s; c.height = im.height * s;
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        res(c.toDataURL('image/jpeg', .72));
      };
      im.src = r.result;
    };
    r.readAsDataURL(file);
  });


  // ---------- custom dropdown (browser default select ব্যবহার হয় না) ----------
  const CHEV = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
  const valDesc = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
  const sheetMq = window.matchMedia('(max-width:860px)');
  const closeAll = except => document.querySelectorAll('.dd.open').forEach(d => { if (d !== except) d.classList.remove('open'); });
  document.addEventListener('click', e => { if (!e.target.closest('.dd')) closeAll(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

  function enhanceSelects(root = document) {
    root.querySelectorAll('select:not([data-dd])').forEach(sel => {
      sel.dataset.dd = 1; sel.classList.add('dd-native'); sel.tabIndex = -1; sel.setAttribute('aria-hidden', 'true');
      const wrap = document.createElement('div'); wrap.className = 'dd';
      sel.before(wrap); wrap.appendChild(sel);
      const btn = document.createElement('button'); btn.type = 'button'; btn.className = ('dd-btn ' + sel.className.replace('dd-native', '')).trim();
      btn.setAttribute('aria-haspopup', 'listbox'); btn.setAttribute('aria-label', sel.getAttribute('aria-label') || '');
      btn.innerHTML = '<span class="dd-val"></span>' + CHEV;
      const panel = document.createElement('div'); panel.className = 'dd-panel';
      panel.innerHTML = '<div class="dd-grab"></div><div class="dd-search hide"><input type="text" placeholder="খুঁজুন…" aria-label="খুঁজুন" autocomplete="off"></div><ul class="dd-list" role="listbox"></ul>';
      const bg = document.createElement('div'); bg.className = 'dd-bg';
      wrap.append(btn, bg, panel);
      const list = panel.querySelector('.dd-list'), search = panel.querySelector('input'), sbox = panel.querySelector('.dd-search');
      let act = -1;

      const lab = o => (o.dataset.img ? `<span class="dd-pic"><img src="${esc(o.dataset.img)}" alt="" loading="lazy" decoding="async"></span>` : '') + `<span class="dd-tx">${esc(o.text)}</span>`;
      const sync = () => {
        const o = sel.options[sel.selectedIndex];
        btn.querySelector('.dd-val').innerHTML = o ? lab(o) : '';
        btn.classList.toggle('ph', !sel.value);
      };
      Object.defineProperty(sel, 'value', { get() { return valDesc.get.call(sel); }, set(v) { valDesc.set.call(sel, v); sync(); }, configurable: true });
      sel.addEventListener('change', sync);

      const items = () => [...list.children];
      const setAct = i => {
        const it = items(); if (!it.length) return;
        act = Math.max(0, Math.min(it.length - 1, i));
        it.forEach((li, k) => li.classList.toggle('act', k === act));
        it[act].scrollIntoView({ block: 'nearest' });
      };
      const render = () => {
        const q = search.value.trim();
        list.innerHTML = [...sel.options].filter(o => !q || o.text.includes(q)).map(o =>
          `<li class="dd-opt${o.value === sel.value ? ' on' : ''}${o.value ? '' : ' ph'}" role="option" data-v="${esc(o.value)}">${lab(o)}</li>`).join('')
          || '<li class="dd-none">কিছু পাওয়া যায়নি</li>';
      };
      const open = () => {
        closeAll(wrap); search.value = ''; render();
        sbox.classList.toggle('hide', sel.options.length < 11);
        wrap.classList.add('open');
        const on = list.querySelector('.on'); act = on ? items().indexOf(on) : 0;
        setAct(act); if (on) on.scrollIntoView({ block: 'center' });
        if (!sheetMq.matches && !sbox.classList.contains('hide')) search.focus({ preventScroll: true });
      };
      const close = () => { wrap.classList.remove('open'); btn.focus({ preventScroll: true }); };
      const pick = li => {
        if (!li || li.classList.contains('dd-none')) return;
        valDesc.set.call(sel, li.dataset.v); sync();
        sel.dispatchEvent(new Event('change', { bubbles: true })); wrap.classList.remove('open');
      };

      btn.onclick = () => wrap.classList.contains('open') ? close() : open();
      bg.onclick = () => wrap.classList.remove('open');
      list.onclick = e => pick(e.target.closest('.dd-opt'));
      search.oninput = () => { render(); setAct(0); };
      const keys = e => {
        const o = wrap.classList.contains('open');
        if (!o && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) { e.preventDefault(); open(); return; }
        if (!o) return;
        if (e.key === 'ArrowDown') { e.preventDefault(); setAct(act + 1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setAct(act - 1); }
        else if (e.key === 'Enter') { e.preventDefault(); pick(items()[act]); btn.focus({ preventScroll: true }); }
        else if (e.key === 'Escape') { e.stopPropagation(); close(); }
        else if (e.key === 'Tab') wrap.classList.remove('open');
      };
      btn.onkeydown = keys; search.onkeydown = keys;
      sync();
    });
  }
  document.addEventListener('DOMContentLoaded', () => enhanceSelects());


  return { BLOG_CATS, blogs, blogsRaw, saveBlogs, fmtDate, readMin, blogBody, blogCard, catPic, avatar, saveCats, ic, hydrate, enhanceSelects, CATS, DISTRICTS, catOf, bn, money, esc, ago, ph, get, set, users, posts, savePosts, me, loginUser, register, logout, requireLogin, mountNav, mountFooter, toast, shrink, I };
})();
