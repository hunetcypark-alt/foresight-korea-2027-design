/* FK 2027 — State Switcher
   Each phase rewrites: hero CTA + hint, GNB items visibility,
   purchase banner content/visibility. */

const STATES = {
  presale: {
    label: '사전판매',
    hero: {
      cta: '등록하기',
      variant: '',
      hint: { dim: 'EARLY BIRD', main: '얼리버드 마감 D-34' },
      sub: 'AX · Transforming into an AI-Native Company',
    },
    gnb: { events:true, register:true, webinar:false, vod:false },
    purchase: { show:true, mode:'reg' },
  },
  closed: {
    label: '판매마감',
    hero: {
      cta: '등록 마감',
      variant: 'disabled',
      hint: { dim:'SOLD OUT', main:'D-2 · 사전판매 종료' },
      sub: 'AX · Transforming into an AI-Native Company',
    },
    gnb: { events:true, register:true, webinar:false, vod:false },
    purchase: { show:true, mode:'reg', allEnded:true },
  },
  eventday: {
    label: '행사 당일',
    hero: {
      cta: '라이브 보기',
      variant: 'live',
      hint: { dim:'LIVE NOW', main:'세션 2 진행 중 · Track B' },
      sub: '2026.10.01 · 그랜드 인터컨티넨탈 서울 파르나스',
    },
    gnb: { events:false, register:true, webinar:true, vod:false },
    purchase: { show:false },
  },
  replay: {
    label: '다시보기',
    hero: {
      cta: '다시보기',
      variant: 'replay',
      hint: { dim:'REPLAY · 참석자 전용', main:'~ 2027.01.01 까지' },
      sub: '포럼 영상 다시보기 — ALL PASS · LIVE PASS 구매자 무료 제공',
    },
    gnb: { events:false, register:true, webinar:false, vod:false },
    purchase: { show:false },
  },
  vodsale: {
    label: 'VOD 판매',
    hero: {
      cta: 'VOD 구매하기',
      variant: 'vod',
      hint: { dim:'VOD ON SALE', main:'AX 5개 트랙 · 30개 세션' },
      sub: 'VOD로 만나는 FORESIGHT KOREA 2027',
    },
    gnb: { events:false, register:false, webinar:false, vod:true },
    purchase: { show:true, mode:'vod' },
  },
  vodend: {
    label: 'VOD 종료',
    hero: {
      cta: '2028 알림 신청',
      variant: '',
      hint: { dim:'NEXT', main:'FORESIGHT KOREA 2028 알림 신청' },
      sub: 'FORESIGHT KOREA 2027 · 다시 만나는 날을 기다립니다',
    },
    gnb: { events:false, register:false, webinar:false, vod:false },
    purchase: { show:false },
  },
};

function applyState(key){
  const s = STATES[key];
  if(!s) return;

  // Hero CTA
  const btn = document.getElementById('hero-cta');
  btn.innerHTML = `<span>${s.hero.cta}</span> <span class="arrow">→</span>`;
  btn.dataset.variant = s.hero.variant || '';

  // Hero hint
  const hint = document.getElementById('hero-hint');
  hint.innerHTML = s.hero.hint.dim
    ? `<span class="dim">${s.hero.hint.dim}</span>${s.hero.hint.main}`
    : s.hero.hint.main;

  // Hero sub
  document.getElementById('hero-sub').innerHTML = `<strong>${s.hero.sub.split('·')[0].trim()}</strong>${s.hero.sub.includes('·')?'  ·  '+s.hero.sub.split('·').slice(1).join('·').trim():''}`;

  // GNB items
  const map = { events:'gnb-events', register:'gnb-register', webinar:'gnb-webinar', vod:'gnb-vod' };
  Object.keys(map).forEach(k=>{
    const el = document.getElementById(map[k]);
    if(!el) return;
    el.classList.toggle('is-hidden', !s.gnb[k]);
  });

  // Registration / Purchase
  const pur = document.getElementById('purchase');
  const regBlock  = document.getElementById('reg-block');
  const vodBanner = document.getElementById('vod-banner');
  if(!s.purchase || !s.purchase.show){
    pur.classList.add('is-hidden');
    stopCountdown();
  }else{
    pur.classList.remove('is-hidden');
    if(s.purchase.mode === 'vod'){
      if(regBlock)  regBlock.hidden  = true;
      if(vodBanner) vodBanner.hidden = false;
      stopCountdown();
    }else{
      if(vodBanner) vodBanner.hidden = true;
      if(regBlock)  regBlock.hidden  = false;
      applyRegState(!!s.purchase.allEnded);
    }
  }

  // Switcher buttons
  document.querySelectorAll('#state-switcher button').forEach(b=>{
    b.classList.toggle('on', b.dataset.state === key);
  });

  // Persist
  try{ localStorage.setItem('fk27_state', key); }catch(_){}
}

/* ── Registration tickets + live countdown ── */
const REG_STATUS_LABEL = { ended:'판매종료', selling:'판매중', upcoming:'판매예정' };
let _regTimer = null;

function applyRegState(allEnded){
  document.querySelectorAll('#reg-tickets .tkt').forEach(t=>{
    let st = t.dataset.status0 || t.dataset.status;
    if(allEnded && st === 'selling') st = 'ended';
    t.dataset.status = st;
    const lab = t.querySelector('.tkt-status');
    if(lab) lab.textContent = REG_STATUS_LABEL[st] || lab.textContent;
  });
  const cap = document.getElementById('reg-count-cap');
  const cnt = document.getElementById('reg-count');
  if(allEnded){
    if(cnt) cnt.style.display = 'none';
    if(cap) cap.textContent = '사전판매가 종료되었습니다.';
    stopCountdown();
  }else{
    if(cnt) cnt.style.display = '';
    startCountdown();
  }
}

function stopCountdown(){ if(_regTimer){ clearInterval(_regTimer); _regTimer = null; } }

function startCountdown(){
  stopCountdown();
  const sell = document.querySelector('#reg-tickets .tkt[data-status="selling"]');
  const cnt  = document.getElementById('reg-count');
  const cap  = document.getElementById('reg-count-cap');
  if(!sell || !cnt) return;
  const tier = (sell.querySelector('.tkt-tier') || {}).textContent || '';
  if(cap) cap.innerHTML = `<b>${tier}</b> 마감까지`;
  const deadline = new Date(sell.dataset.deadline || Date.now()).getTime();
  const set = (k,v)=>{ const el = cnt.querySelector(`[data-c="${k}"]`); if(el) el.textContent = String(v).padStart(2,'0'); };
  function tick(){
    let diff = Math.max(0, deadline - Date.now());
    const d = Math.floor(diff/86400000); diff -= d*86400000;
    const h = Math.floor(diff/3600000);  diff -= h*3600000;
    const m = Math.floor(diff/60000);    diff -= m*60000;
    const sec = Math.floor(diff/1000);
    set('days', d); set('hours', h); set('mins', m); set('secs', sec);
  }
  tick();
  _regTimer = setInterval(tick, 1000);
}

// Init
document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('#state-switcher button').forEach(b=>{
    b.addEventListener('click', ()=> applyState(b.dataset.state));
  });

  // 판매중 카드 전체 클릭 → register 페이지 이동
  document.querySelectorAll('.tkt[data-status="selling"]').forEach(card=>{
    card.style.cursor = 'pointer';
    card.addEventListener('click', e=>{
      if(e.target.closest('.tkt-cta')) return;
      switchPage('register');
    });
  });

  // Forum Archive dropdown
  const archBtn  = document.getElementById('gn-archive-btn');
  const archMenu = document.getElementById('gn-archive-menu');
  if(archBtn && archMenu){
    archBtn.addEventListener('click', (e)=>{
      e.stopPropagation();
      const open = archMenu.classList.toggle('open');
      archBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', (e)=>{
      if(!archMenu.contains(e.target) && e.target !== archBtn){
        archMenu.classList.remove('open');
        archBtn.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape'){
        archMenu.classList.remove('open');
        archBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  let init = 'presale';
  // Snapshot ticket baseline statuses (so 'closed' state can be reverted)
  document.querySelectorAll('#reg-tickets .tkt').forEach(t=>{ t.dataset.status0 = t.dataset.status; });
  applyState(init);

  // 카드 스포트라이트 — hover 시 커서 위치가 밝아짐 (히어로 느낌)
  const cardSel = '.lc,.agenda,.tr,.sp,.pp,.iv-main,.iv-thumb,.arc';
  document.addEventListener('pointermove', (e)=>{
    const card = e.target.closest(cardSel);
    if(!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
  }, { passive:true });

  // 스크롤 리빌 (몰입감) — .reveal 요소 + K커브 그래프
  // (IntersectionObserver 대신 스크롤 기반: 샌드박스 프리뷰에서도 안정적)
  const reveals = [...document.querySelectorAll('.reveal')];
  reveals.forEach(el=>{
    const sibs = [...el.parentElement.children].filter(c=>c.classList.contains('reveal'));
    const i = sibs.indexOf(el);
    if(i > 0) el.style.animationDelay = Math.min(i,5)*0.09 + 's';
  });
  let revRemaining = reveals.slice();
  let revTimer = null;
  function checkReveals(){
    const vh = window.innerHeight || document.documentElement.clientHeight;
    for(let k = revRemaining.length - 1; k >= 0; k--){
      const el = revRemaining[k];
      if(el.getBoundingClientRect().top < vh * 0.72){
        el.classList.add('in');
        // 안전망: 프리뷰가 애니메이션을 commit하지 않고 멈추는 경우 대비 —
        // 충분히 지난 뒤 애니메이션을 해제해 선언된 최종상태(보임)가 항상 적용되도록
        const delay = el.classList.contains('kcurve') ? 3000 : 1500;
        setTimeout((()=>{ el.classList.add('reveal-done'); }), delay);
        revRemaining.splice(k, 1);
      }
    }
    if(revRemaining.length === 0 && revTimer){ clearInterval(revTimer); revTimer = null; }
  }
  window.addEventListener('scroll', checkReveals, { passive:true });
  window.addEventListener('resize', checkReveals, { passive:true });
  checkReveals();                       // 초기 1회
  setTimeout(checkReveals, 200);         // 레이아웃 안정 후 보정
  revTimer = setInterval(checkReveals, 350); // rAF 드롭 대비 안전망
});

/* ── 전역 커서 앰비언트 빛 — 커서 위치에 직접 중심, 히어로 제외 ── */
(function(){
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var el = document.getElementById('cursor-ambient');
  if(!el) return;
  var heroEl = document.getElementById('hero');

  var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;

  function inHero(clientY){
    if(!heroEl) return false;
    var r = heroEl.getBoundingClientRect();
    return clientY >= r.top && clientY <= r.bottom;
  }

  function tick(){
    cx += (tx - cx) * 0.07;
    cy += (ty - cy) * 0.07;
    el.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px)';
    if(Math.abs(tx - cx) > 0.2 || Math.abs(ty - cy) > 0.2){
      raf = requestAnimationFrame(tick);
    } else { raf = null; }
  }
  function kick(){ if(!raf) raf = requestAnimationFrame(tick); }

  var homePageEl = document.getElementById('page-home');
  function isHomePage(){ return homePageEl && homePageEl.classList.contains('active'); }

  document.addEventListener('mousemove', function(e){
    tx = e.clientX;
    ty = e.clientY;
    el.classList.toggle('active', isHomePage() && !inHero(e.clientY));
    kick();
  }, { passive:true });
})();


/* ── 키노트 대형 배너 — 사진 패럴럭스 (히어로/컨셉 마우스무브와 동일 계열) ── */
(function(){
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var banners = Array.prototype.slice.call(document.querySelectorAll('.spb'));
  banners.forEach(function(spb){
    var photo = spb.querySelector('.spb-photo'); if(!photo) return;
    var tx=0,ty=0,cx=0,cy=0,raf=null,MX=22,MY=14;
    function tick(){
      cx+=(tx-cx)*0.08; cy+=(ty-cy)*0.08;
      photo.style.transform='translate3d('+cx.toFixed(2)+'px,'+cy.toFixed(2)+'px,0)';
      if(Math.abs(tx-cx)>0.1||Math.abs(ty-cy)>0.1) raf=requestAnimationFrame(tick); else raf=null;
    }
    function kick(){ if(raf==null) raf=requestAnimationFrame(tick); }
    spb.addEventListener('pointermove',function(e){
      var r=spb.getBoundingClientRect();
      tx=((e.clientX-r.left)/r.width-0.5)*MX*-2;
      ty=((e.clientY-r.top)/r.height-0.5)*MY*-2;
      kick();
    },{passive:true});
    spb.addEventListener('pointerleave',function(){ tx=0;ty=0;kick(); },{passive:true});
  });
})();


/* ── 트랙 아코디언 — flex 클래스 토글 + 자동순환 ── */
(function(){
  var grid = document.querySelector('#tracks .tr-grid');
  if(!grid) return;

  function isAccordion(){ return window.innerWidth >= 1024; }

  var cards = Array.prototype.slice.call(grid.querySelectorAll('.tr'));
  var current = 0;
  var timer = null;
  var paused = false;

  function open(idx){
    current = idx;
    cards.forEach(function(c, i){
      c.classList.toggle('is-open', i === idx);
    });
  }

  function next(){ open((current + 1) % cards.length); }

  function startAuto(){
    clearInterval(timer);
    timer = setInterval(function(){ if(!paused) next(); }, 7000);
  }

  cards.forEach(function(card, idx){
    card.addEventListener('mouseenter', function(){
      if(!isAccordion()) return;
      paused = true;
      open(idx);
    });
  });

  grid.addEventListener('mouseleave', function(){
    paused = false;
  });

  if(isAccordion()){
    open(0);
    startAuto();
  }
})();

/* ── 트랙 리스트 단순 라이즈 등장 (순차 없음 · 스크롤 기반) ── */
(function(){
  var els = Array.prototype.slice.call(document.querySelectorAll('.srise'));
  if(!els.length) return;
  var timer=null;
  function check(){
    var vh = window.innerHeight || document.documentElement.clientHeight;
    for(var i=els.length-1;i>=0;i--){
      if(els[i].getBoundingClientRect().top < vh*0.72){
        var el=els[i];
        el.classList.add('in');
        setTimeout((function(n){ return function(){ n.classList.add('srise-done'); }; })(el), 1200);
        els.splice(i,1);
      }
    }
    if(!els.length){ window.removeEventListener('scroll',check); if(timer) clearInterval(timer); }
  }
  window.addEventListener('scroll',check,{passive:true});
  window.addEventListener('resize',check,{passive:true});
  timer=setInterval(check,300);
  check();
})();

/* ── SPA Page Switching ── */
(function(){
  function switchPage(id){
    document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
    var target = document.getElementById('page-'+id);
    if(target) target.classList.add('active');

    document.querySelectorAll('#gnb-nav .gn-items a[data-page]').forEach(function(a){
      a.classList.toggle('on', a.dataset.page === id);
      a.style.color = a.dataset.page === id ? 'rgb(223,7,46)' : 'rgb(0,0,0)';
      a.style.borderColor = a.dataset.page === id ? 'rgb(223,7,46)' : 'transparent';
    });

    window.scrollTo({top:0,behavior:'instant'});

    /* home이 아닌 페이지로 전환 시 커서 앰비언트 즉시 비활성화 */
    var ca = document.getElementById('cursor-ambient');
    if(ca) ca.classList.toggle('active', id === 'home');

    /* reveal 재실행 */
    if(target){
      target.querySelectorAll('.reveal:not(.in)').forEach(function(el){
        el.classList.add('in');
        setTimeout(function(){ el.classList.add('reveal-done'); }, 1200);
      });
    }

    /* Program & Speakers 탭 초기화 */
    if(id === 'program') initProgTabs();
  }

  /* Program & Speakers 트랙 탭 */
  function initProgTabs(){
    var tabs  = document.querySelectorAll('.prog-tab');
    var panels= document.querySelectorAll('.prog-panel');
    var ink   = document.querySelector('.prog-tab-ink');
    if(!tabs.length) return;

    function activate(idx){
      tabs.forEach(function(t,i){
        t.classList.toggle('on', i===idx);
      });
      panels.forEach(function(p,i){
        p.classList.toggle('on', i===idx);
      });
      if(ink){
        var tab = tabs[idx];
        ink.style.left  = tab.offsetLeft+'px';
        ink.style.width = tab.offsetWidth+'px';
        var acc = getComputedStyle(tab).getPropertyValue('--acc').trim();
        if(acc){ ink.style.background = acc; ink.style.boxShadow='0 0 16px '+acc; }
      }
    }
    tabs.forEach(function(t,i){
      t.addEventListener('click', function(){ activate(i); });
    });
    activate(0);
  }

  /* GNB 링크에 data-page 연결 */
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('#gnb-nav .gn-items a[data-page]').forEach(function(a){
      a.addEventListener('click', function(e){
        e.preventDefault();
        switchPage(a.dataset.page);
      });
    });
    /* 최초 활성 페이지 = home */
    var home = document.getElementById('page-home');
    if(home) home.classList.add('active');
  });

  /* 모바일 드로어 active 링크 동기화 */
  function syncMobNav(pageId) {
    document.querySelectorAll('.mob-drawer-nav a[data-page]').forEach(function(a) {
      a.classList.toggle('on', a.dataset.page === pageId);
    });
  }
  /* 하단 내비게이션 바 active 동기화 */
  function syncBottomNav(pageId) {
    document.querySelectorAll('.mob-bn-item[data-page]').forEach(function(a) {
      a.classList.toggle('active', a.dataset.page === pageId);
    });
  }
  var _origSwitch = switchPage;
  window.switchPage = function(id) {
    _origSwitch(id);
    syncMobNav(id);
    syncBottomNav(id);
  };
})();

/* ── 모바일 드로어 ── */
(function(){
  var hamburger  = document.getElementById('gn-hamburger');
  var drawer     = document.getElementById('mob-drawer');
  var overlay    = document.getElementById('mob-overlay');
  var drawerClose= document.getElementById('mob-drawer-close');
  if(!hamburger || !drawer) return;

  function open() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    hamburger.setAttribute('aria-expanded','true');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded','false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', open);
  if(drawerClose) drawerClose.addEventListener('click', close);
  if(overlay)     overlay.addEventListener('click', close);
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') close();
  });

  window.closeMobDrawer = close;
})();

/* ── Program & Speakers 트랙 탭 ── */
(function(){
  var nav = document.getElementById('prog-tab-nav');
  if(!nav) return;
  var tabs   = Array.prototype.slice.call(nav.querySelectorAll('.ptab'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.ptab-panel'));

  function activate(id){
    tabs.forEach(function(t){ t.classList.toggle('on', t.dataset.panel === id); });
    panels.forEach(function(p){ p.classList.toggle('on', p.dataset.panel === id); });
  }

  tabs.forEach(function(t){
    t.addEventListener('click', function(){ activate(t.dataset.panel); });
  });
  // Keynote 기본 활성
  activate('kn');
})();

/* ── Register 탭 전환 ── */
function switchRegTab(tab) {
  var panels = { register: document.getElementById('reg-panel-register'), confirm: document.getElementById('reg-panel-confirm') };
  var tabs = { register: document.getElementById('reg-tab-register'), confirm: document.getElementById('reg-tab-confirm') };
  Object.keys(panels).forEach(function(k) {
    if (panels[k]) panels[k].hidden = (k !== tab);
    if (tabs[k]) tabs[k].classList.toggle('reg-tab-active', k === tab);
  });
}

/* ── My Forum 탭 전환 ── */
function switchMfTab(tab) {
  var panels = { payment: document.getElementById('mf-panel-payment'), list: document.getElementById('mf-panel-list') };
  var tabs = { payment: document.getElementById('mf-tab-payment'), list: document.getElementById('mf-tab-list') };
  Object.keys(panels).forEach(function(k) {
    if (panels[k]) panels[k].style.display = (k === tab ? 'block' : 'none');
    if (tabs[k]) {
      tabs[k].style.color = k === tab ? '#20222d' : '#c8c8c8';
      tabs[k].style.borderBottomColor = k === tab ? '#13151b' : 'transparent';
    }
  });
}

/* ── Program Speakers 사이드바 스크롤 액티브 ── */
(function(){
  var sidebar = document.getElementById('pg-sidebar');
  if(!sidebar) return;
  var items = sidebar.querySelectorAll('.pg-sb-item[data-section]');
  var sections = [];
  items.forEach(function(item){
    var el = document.getElementById(item.dataset.section);
    if(el) sections.push({el:el, item:item});
  });
  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        var id = entry.target.id;
        items.forEach(function(it){ it.classList.toggle('active', it.dataset.section === id); });
      }
    });
  },{rootMargin:'-10% 0px -65% 0px'});
  sections.forEach(function(s){ observer.observe(s.el); });
})();

/* ── Sidebar stuck (tablet · mobile): pg-tab-bar가 뷰포트 밖으로 나가면 고정 탭바 표시 ── */
(function(){
  var sidebar = document.getElementById('pg-sidebar');
  var tabBar = document.querySelector('.pg-tab-bar');
  if(!sidebar || !tabBar) return;
  new IntersectionObserver(function(entries){
    if(window.innerWidth >= 1024) return;
    sidebar.classList.toggle('is-stuck', !entries[0].isIntersecting);
  }, {threshold:0, rootMargin:'-1px 0px 0px 0px'}).observe(tabBar);
})();

/* ── Program 탭 전환 ── */
function switchPgTab(tab) {
  var panels = { speakers: document.getElementById('pg-panel-speakers'), timetable: document.getElementById('pg-panel-timetable') };
  var tabs = { speakers: document.getElementById('pg-tab-speakers'), timetable: document.getElementById('pg-tab-timetable') };
  Object.keys(panels).forEach(function(k) {
    if (panels[k]) panels[k].hidden = (k !== tab);
    if (tabs[k]) {
      tabs[k].style.color = k === tab ? 'var(--fg-100)' : 'var(--fg-45)';
      tabs[k].style.borderBottomColor = k === tab ? 'var(--fg-100)' : 'transparent';
    }
  });
}

/* ── FAQ 아코디언 ── */
function toggleFaq(btn) {
  var answer = btn.nextElementSibling;
  var arrow = btn.querySelector('.faq-arrow');
  var isOpen = window.getComputedStyle(answer).display !== 'none';
  answer.style.display = isOpen ? 'none' : 'block';
  if (arrow) arrow.style.transform = isOpen ? '' : 'rotate(180deg)';
  btn.style.borderBottomColor = isOpen ? '#e1e2e4' : 'transparent';
}

/* ── Program 탭 바 스티키 / 언픽스 ── */
(function(){
  var tabNav = document.getElementById('prog-tab-nav');
  var speakers = document.getElementById('speakers'); /* Home speakers 섹션 */
  if(!tabNav) return;

  /* ptab-panels 끝에 센티넬 삽입 */
  var panels = document.querySelector('#page-program .ptab-panels');
  if(panels){
    var sentinel = document.createElement('div');
    sentinel.id = 'prog-sentinel';
    panels.appendChild(sentinel);

    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        /* 센티넬이 뷰포트에 들어오면(= 패널 끝 도달) 탭 고정 해제 */
        tabNav.style.position = e.isIntersecting ? 'relative' : '';
        tabNav.style.top = e.isIntersecting ? 'auto' : '';
      });
    }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });

    obs.observe(sentinel);
  }
})();

/* ── Home Speakers 트랙 탭 스크롤 + 활성화 ── */
function spScrollTo(id, btn){
  var el = document.getElementById(id);
  if(!el) return;
  var navH = 60 + 56; /* GNB + 탭바 */
  var top = el.getBoundingClientRect().top + window.scrollY - navH;
  window.scrollTo({top: top, behavior: 'smooth'});
  document.querySelectorAll('.sp-track-btn').forEach(function(b){ b.classList.remove('on'); });
  if(btn) btn.classList.add('on');
}

/* Speakers 탭바 — JS sticky */
(function(){
  var nav     = document.getElementById('sp-track-nav');
  var section = document.getElementById('speakers');
  var tracks  = ['sp-trz-a','sp-trz-b','sp-trz-c','sp-trz-d','sp-trz-e'];
  if(!nav || !section) return;

  var GNB_H = 60;
  var fixed = false;
  var navH  = nav.offsetHeight;

  /* placeholder — 고정 시 레이아웃 자리 유지 */
  var ph = document.createElement('div');
  ph.style.cssText = 'height:0;display:none';
  nav.parentNode.insertBefore(ph, nav);

  /* 기준 Y: 탭바 상단의 문서 절대 위치 (한 번만 계산) */
  var triggerY = (function(){
    var el = nav, y = 0;
    while(el){ y += el.offsetTop; el = el.offsetParent; }
    return y - GNB_H - 100;
  })();

  var secEnd = section.offsetTop + section.offsetHeight;

  var gnbEl = document.getElementById('gnb-nav');
  var GNB_H = gnbEl ? gnbEl.offsetHeight : 60;

  function pin(){
    if(fixed) return;
    fixed = true;
    navH  = nav.offsetHeight;
    ph.style.height  = navH + 'px';
    ph.style.display = 'block';
    nav.style.position   = 'fixed';
    nav.style.top        = GNB_H + 'px';
    nav.style.left       = '0';
    nav.style.width      = '100vw';
    nav.style.zIndex     = '40';
  }

  function unpin(){
    if(!fixed) return;
    fixed = false;
    ph.style.display   = 'none';
    nav.style.position = '';
    nav.style.top      = '';
    nav.style.left     = '';
    nav.style.width    = '';
    nav.style.zIndex   = '';
  }

  function onScroll(){
    var y = window.scrollY;
    if(y >= triggerY && y < secEnd - navH - GNB_H){ pin(); } else { unpin(); }

    /* 활성 탭 */
    var active = null;
    tracks.forEach(function(id){
      var el = document.getElementById(id);
      if(el && el.getBoundingClientRect().top <= GNB_H + navH + 20) active = id;
    });
    document.querySelectorAll('.sp-track-btn').forEach(function(b, i){
      b.classList.toggle('on', tracks[i] === active || (!active && i === 0));
    });
  }

  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', function(){
    triggerY = (function(){
      var el = nav, y = 0;
      if(fixed){ y = ph.offsetTop; return y - GNB_H; }
      while(el){ y += el.offsetTop; el = el.offsetParent; }
      return y - GNB_H;
    })();
    secEnd = section.offsetTop + section.offsetHeight;
    onScroll();
  });
  onScroll();
})();

/* ── 세션 상세 모달 ── */
(function(){
  var overlay  = document.getElementById('sess-overlay');
  if(!overlay) return;
  var topEl    = document.getElementById('sess-top');
  var trkLbl   = document.getElementById('sess-track-label');
  var titleEl  = document.getElementById('sess-title');
  var orgEl    = document.getElementById('sess-org');
  var nameEl   = document.getElementById('sess-name');
  var descEl   = document.getElementById('sess-desc');
  var closeBtn = document.getElementById('sess-close-btn');

  var TRACK_COLORS = {'A':'#3cc6ff','B':'#4aa6ff','C':'#5a8dff','D':'#6f7bf0','E':'#8b5cf6'};

  var SESS_DATA = {
    'A-1': { tags: ['#거시경제','#성장률','#글로벌교역'] },
    'A-2': { tags: ['#한국경제','#K자성장','#경기전망'] },
    'A-3': { tags: ['#지정학리스크','#미중갈등','#공급망'] },
    'A-4': { tags: ['#자본시장','#금리전망','#AI버블'] },
    'A-5': { tags: ['#반도체인프라','#전력병목','#에너지'] },
    'A-6': { tags: ['#정부정책','#예산안','#기업규제'] },
    'B-1': { tags: ['#AI네이티브','#미래기업','#디지털전환'] },
    'B-2': { tags: ['#AX마스터플랜','#조직재설계','#AI네이티브'] },
    'B-3': { tags: ['#포트폴리오','#리밸런싱','#사업구조'] },
    'B-4': { tags: ['#PoC','#ROI','#가치창출'] },
    'B-5': { tags: ['#신사업전략','#AX혁신','#비즈니스모델'] },
    'B-6': { tags: ['#실리콘밸리','#경영트렌드','#빅테크'] },
    'C-1': { tags: ['#파운데이션모델','#AI인프라','#클라우드'] },
    'C-2': { tags: ['#테크트렌드','#바이오','#초연결망'] },
    'C-3': { tags: ['#다크팩토리','#피지컬AI','#제조혁신'] },
    'C-4': { tags: ['#휴머노이드','#로봇공학','#스틸칼라'] },
    'C-5': { tags: ['#AI에이전트','#오토파일럿','#업무자동화'] },
    'C-6': { tags: ['#중국AI','#로봇기술','#테크패권'] },
    'D-1': { tags: ['#소비트렌드','#2027전망','#소비심리'] },
    'D-2': { tags: ['#소비자경험','#CX','#AX마케팅'] },
    'D-3': { tags: ['#GEO','#AI검색','#브랜드노출'] },
    'D-4': { tags: ['#퍼포먼스마케팅','#AI최적화','#마케팅ROI'] },
    'D-5': { tags: ['#AX성공사례','#마케팅혁신','#고객경험'] },
    'D-6': { tags: ['#콘텐츠마케팅','#미디어트렌드','#스토리텔링'] },
    'E-1': { tags: ['#하이브리드인재','#HR트렌드','#조직관리'] },
    'E-2': { tags: ['#일의미래','#직무재설계','#AInative'] },
    'E-3': { tags: ['#AI디렉터','#협업툴','#일하는방식'] },
    'E-4': { tags: ['#워크슬롭','#가짜생산성','#조직진단'] },
    'E-5': { tags: ['#보상체계','#정서적연봉','#HR평가'] },
    'E-6': { tags: ['#HR성공사례','#인재채용','#성과평가'] }
  };

  function getSessionId(card) {
    var trk = (card.querySelector('.pgtl-c5-trk')||{}).textContent||'';
    var letter = trk.replace('TRACK','').trim();
    var row = card.closest('.pgtl-row--tr');
    var allRows = Array.prototype.slice.call(document.querySelectorAll('.pgtl-row--tr'));
    var rowIdx = allRows.indexOf(row) + 1;
    return letter + '-' + rowIdx;
  }

  function openModal(card) {
    var trk   = (card.querySelector('.pgtl-c5-trk')||{}).textContent||'';
    var ttl   = (card.querySelector('.pgtl-c5-title')||{}).textContent||'';
    var spkEl = card.querySelector('.pgtl-c5-spk');
    var spk   = spkEl ? spkEl.textContent.trim() : '';
    var isTbd = card.classList.contains('pgtl-c5-nd');
    var letter= trk.replace('TRACK','').trim();
    var color = TRACK_COLORS[letter] || card.style.getPropertyValue('--tc') || '#228be6';
    var sessId= getSessionId(card);
    var data  = SESS_DATA[sessId] || {};

    var photoImg = document.querySelector('.sess-photo-img');
    /* 스피커 패널의 매칭 카드에서 이미지 우선 조회 */
    var scImg = '';
    document.querySelectorAll('article.sc').forEach(function(sc){
      if(!scImg && ((sc.querySelector('.sc-no')||{}).textContent||'').trim() === sessId){
        scImg = ((sc.querySelector('.sc-photo img')||{}).src) || '';
      }
    });
    var resolvedSrcPg = scImg || data.photo || 'assets/img/man.svg';
    if(photoImg) photoImg.src = resolvedSrcPg;

    var orgTxt='', nameTxt='';
    if(spk.indexOf('·') > -1){
      var p = spk.split('·');
      orgTxt  = p[0].trim();
      nameTxt = p[1].trim();
    } else {
      nameTxt = spk;
    }

    topEl.style.background = color;
    trkLbl.textContent     = trk.trim();
    titleEl.textContent    = ttl.trim();
    orgEl.textContent      = orgTxt;
    nameEl.textContent     = nameTxt;
    nameEl.className       = 'sess-name' + (isTbd ? ' is-tbd' : '');
    var photoWrapPg = document.querySelector('.sess-photo-wrap');
    if(photoWrapPg){
      photoWrapPg.style.setProperty('--ph-acc', color);
      photoWrapPg.classList.toggle('no-real-photo', resolvedSrcPg.includes('man.svg'));
    }
    /* 연사소개 탭 */
    var spkDescEl = document.getElementById('sess-speaker-desc');
    if(spkDescEl) spkDescEl.textContent = isTbd
      ? '해당 세션의 연사는 현재 섭외 진행 중입니다. 확정 후 연사 소개가 업데이트됩니다.'
      : (data.bio || '연사 소개가 준비 중입니다.');

    /* 세션소개 탭 */
    var sessDescEl = document.getElementById('sess-session-desc');
    if(sessDescEl) sessDescEl.textContent = isTbd
      ? '해당 세션의 내용은 현재 준비 중입니다. 확정 후 세션 소개가 업데이트됩니다.'
      : (data.desc || '세션 소개가 준비 중입니다.');

    /* 태그 렌더링 */
    var tagsEl = document.getElementById('sess-tags');
    if(tagsEl){
      tagsEl.innerHTML = '';
      var tags = data.tags || [];
      tags.forEach(function(tag){
        var span = document.createElement('span');
        span.className = 'sess-tag';
        span.textContent = tag;
        tagsEl.appendChild(span);
      });
    }

    /* 탭 초기화: 연사소개로 리셋 */
    switchSessTab('speaker');

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function switchSessTab(tab) {
    document.querySelectorAll('.sess-tab').forEach(function(btn){
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    var panels = ['speaker','session'];
    panels.forEach(function(p){
      var el = document.getElementById('sess-panel-' + p);
      if(el) el.style.display = (p === tab) ? '' : 'none';
    });
  }

  /* 탭 클릭 */
  overlay.addEventListener('click', function(e){
    var tab = e.target.closest('.sess-tab');
    if(tab && tab.dataset.tab) switchSessTab(tab.dataset.tab);
  });

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  overlay.addEventListener('click', function(e){ if(e.target===overlay) closeModal(); });
  if(closeBtn) closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeModal(); });

  /* 홈 .sc 카드 → 모달 (Program 카드와 동일) */
  function openModalFromSc(card) {
    var sessNo  = ((card.querySelector('.sc-no')||{}).textContent||'').trim();  // e.g. "A-1"
    var ttl     = ((card.querySelector('.sc-title')||{}).textContent||'').trim();
    var orgTxt  = ((card.querySelector('.sc-co')||{}).textContent||'').trim();
    var nameTxt = ((card.querySelector('.sc-name')||{}).textContent||'').trim();
    var isTbd   = card.classList.contains('is-tbd');
    var letter  = sessNo.split('-')[0];
    var color   = TRACK_COLORS[letter] || '#228be6';
    var data    = SESS_DATA[sessNo] || {};

    topEl.style.background = color;
    trkLbl.textContent     = 'TRACK ' + letter;
    titleEl.textContent    = ttl;
    orgEl.textContent      = orgTxt;
    nameEl.textContent     = nameTxt;
    nameEl.className       = 'sess-name' + (isTbd ? ' is-tbd' : '');

    var photoImg = document.querySelector('.sess-photo-img');
    var cardPhotoSrc = ((card.querySelector('.sc-photo img')||{}).src) || '';
    var resolvedSrc = cardPhotoSrc || (data.photo || 'assets/img/man.svg');
    if(photoImg) photoImg.src = resolvedSrc;
    var photoWrap = document.querySelector('.sess-photo-wrap');
    if(photoWrap){
      photoWrap.style.setProperty('--ph-acc', color);
      photoWrap.classList.toggle('no-real-photo', resolvedSrc.includes('man.svg'));
    }

    var spkEl2 = document.getElementById('sess-speaker-desc');
    if(spkEl2) spkEl2.textContent = isTbd
      ? '해당 세션의 연사는 현재 섭외 진행 중입니다. 확정 후 연사 소개가 업데이트됩니다.'
      : (data.bio || '연사 소개가 준비 중입니다.');

    var sesEl2 = document.getElementById('sess-session-desc');
    if(sesEl2) sesEl2.textContent = isTbd
      ? '해당 세션의 내용은 현재 준비 중입니다. 확정 후 세션 소개가 업데이트됩니다.'
      : (data.desc || '세션 소개가 준비 중입니다.');

    var tagsEl = document.getElementById('sess-tags');
    if(tagsEl){
      tagsEl.innerHTML = '';
      (data.tags||[]).forEach(function(tag){
        var span = document.createElement('span');
        span.className = 'sess-tag';
        span.textContent = tag;
        tagsEl.appendChild(span);
      });
    }

    switchSessTab('speaker');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  /* 키노트 카드 → 모달 */
  function openModalFromKn() {
    var card   = document.querySelector('.pg-kn-hero-card');
    var title  = ((card && card.querySelector('.pg-kn-hero-title'))||{}).textContent || '';
    var org    = ((card && card.querySelector('.pg-kn-hero-org'))||{}).textContent || '';
    var name   = ((card && card.querySelector('.pg-kn-hero-name'))||{}).textContent || '';
    var photo  = ((card && card.querySelector('.pg-kn-hero-photo img'))||{}).src || '';

    topEl.style.background = '#3a6bff';
    trkLbl.textContent     = 'KEYNOTE';
    titleEl.textContent    = title;
    orgEl.textContent      = org;
    nameEl.textContent     = name;
    nameEl.className       = 'sess-name';

    var photoImg = document.querySelector('.sess-photo-img');
    if(photoImg) photoImg.src = photo || 'assets/img/man.svg';

    var spkDescEl = document.getElementById('sess-speaker-desc');
    if(spkDescEl) spkDescEl.textContent = '연사 소개가 준비 중입니다.';

    var sessDescEl = document.getElementById('sess-session-desc');
    if(sessDescEl) sessDescEl.textContent = '세션 소개가 준비 중입니다.';

    var tagsEl = document.getElementById('sess-tags');
    if(tagsEl) tagsEl.innerHTML = '';

    switchSessTab('speaker');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  /* 홈 키노트 배너 버튼 → 이정동 교수 모달 */
  function openModalFromKnBanner() {
    topEl.style.background = '#3a6bff';
    trkLbl.textContent     = 'KEYNOTE';
    titleEl.textContent    = "AX 시대의 개념설계: 모방의 한계를 넘는 '최초의 질문'";
    orgEl.textContent      = '서울대학교';
    nameEl.textContent     = '이정동 교수';
    nameEl.className       = 'sess-name';

    var photoImg = document.querySelector('.sess-photo-img');
    if(photoImg) photoImg.src = 'assets/img/man.svg';
    var photoWrap = document.querySelector('.sess-photo-wrap');
    if(photoWrap){
      photoWrap.style.setProperty('--ph-acc','#5a8dff');
      photoWrap.classList.add('no-real-photo');
    }

    var spkDescEl = document.getElementById('sess-speaker-desc');
    if(spkDescEl) spkDescEl.textContent = 'TBD';

    var sessDescEl = document.getElementById('sess-session-desc');
    if(sessDescEl) sessDescEl.textContent = 'TBD';

    var tagsEl = document.getElementById('sess-tags');
    if(tagsEl){
      tagsEl.innerHTML = '';
      ['#AX전환','#AI네이티브','#초거대AI'].forEach(function(tag){
        var span = document.createElement('span');
        span.className = 'sess-tag';
        span.textContent = tag;
        tagsEl.appendChild(span);
      });
    }

    switchSessTab('speaker');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  /* 카드 클릭 → 모달 (document 위임, 모달 내부 클릭 제외) */
  document.addEventListener('click', function(e){
    if(e.target.closest('#sess-overlay')) return;
    var knBtn = e.target.closest('#kn-profile-btn');
    if(knBtn){ openModalFromKnBanner(); return; }
    var kn = e.target.closest('.pg-kn-hero-card');
    if(kn){ openModalFromKn(); return; }
    var c5 = e.target.closest('.pgtl-c5');
    if(c5){
      if(!c5.closest('#pg-panel-timetable')) openModal(c5);
      return;
    }
    var sc = e.target.closest('article.sc');
    if(sc){ openModalFromSc(sc); }
  });
})();



/* ── 모바일/태블릿 인사이트 캐러셀 ── */
(function(){
  var slider = document.querySelector('.iv2-slider');
  if(!slider) return;
  var grid   = slider.querySelector('.iv2-grid');
  var items  = Array.prototype.slice.call(grid.querySelectorAll('.iv2'));
  var arrows = Array.prototype.slice.call(slider.querySelectorAll('.iv2-arrow'));
  if(!items.length || arrows.length < 2) return;

  var cur = 0;

  function perPage(){
    if(window.innerWidth <= 767)  return 1;
    if(window.innerWidth <= 1023) return 2;
    return items.length;
  }

  function render(){
    var pp = perPage();
    var isCarousel = pp < items.length;
    arrows[0].style.display = isCarousel ? '' : 'none';
    arrows[1].style.display = isCarousel ? '' : 'none';
    if(!isCarousel){
      items.forEach(function(el){ el.classList.remove('iv2-hidden'); });
      return;
    }
    items.forEach(function(el, i){
      el.classList.toggle('iv2-hidden', i < cur || i >= cur + pp);
    });
    arrows[0].disabled = cur === 0;
    arrows[1].disabled = cur + pp >= items.length;
  }

  arrows[0].addEventListener('click', function(){ if(cur > 0){ cur--; render(); } });
  arrows[1].addEventListener('click', function(){
    if(cur + perPage() < items.length){ cur++; render(); }
  });

  window.addEventListener('resize', function(){ cur = 0; render(); });
  render();
})();

/* ── 모바일/태블릿 등록 카드 캐러셀 ── */
(function(){
  var tickets = document.getElementById('reg-tickets');
  if(!tickets) return;
  if(window.innerWidth >= 1024) return;

  /* 화살표 버튼 동적 삽입 */
  var nav = document.createElement('div');
  nav.className = 'reg-mob-nav';
  nav.innerHTML =
    '<button class="reg-mob-btn" id="reg-prev" aria-label="이전">←</button>' +
    '<button class="reg-mob-btn" id="reg-next" aria-label="다음">→</button>';
  tickets.parentNode.insertBefore(nav, tickets.nextSibling);

  function cardW(){
    var first = tickets.querySelector('.tkt');
    return first ? first.offsetWidth + 16 : 0;
  }

  document.getElementById('reg-prev').addEventListener('click', function(){
    tickets.scrollBy({ left: -cardW(), behavior: 'smooth' });
  });
  document.getElementById('reg-next').addEventListener('click', function(){
    tickets.scrollBy({ left:  cardW(), behavior: 'smooth' });
  });

  /* 판매중 카드로 초기 스크롤 — 가운데 정렬 */
  function scrollToSelling(){
    if(window.innerWidth >= 1024) return;
    var selling = tickets.querySelector('.tkt[data-status="selling"]');
    if(!selling) return;
    tickets.scrollLeft = selling.offsetLeft - (tickets.offsetWidth - selling.offsetWidth) / 2;
  }
  window.addEventListener('load', scrollToSelling);
  window.addEventListener('resize', function(){ scrollToSelling(); });
})();

/* ── 인사이트 닷 페이지네이션 ── */
(function(){
  var grid = document.querySelector('.iv2-grid');
  if(!grid) return;
  var slider = grid.parentNode;
  var items  = Array.prototype.slice.call(grid.querySelectorAll('.iv2'));
  if(items.length <= 1) return;

  /* 닷 컨테이너 삽입 */
  var dotsWrap = document.createElement('div');
  dotsWrap.className = 'iv2-dots';
  slider.parentNode.insertBefore(dotsWrap, slider.nextSibling);

  items.forEach(function(_, i){
    var d = document.createElement('button');
    d.className = 'iv2-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', '영상 ' + (i + 1));
    d.addEventListener('click', function(){
      var item = items[i];
      grid.scrollLeft = item.offsetLeft - (grid.offsetWidth - item.offsetWidth) / 2;
    });
    dotsWrap.appendChild(d);
  });

  var dots = Array.prototype.slice.call(dotsWrap.querySelectorAll('.iv2-dot'));

  grid.addEventListener('scroll', function(){
    var itemW = items[0] ? items[0].offsetWidth + 16 : 1;
    var idx = Math.round(grid.scrollLeft / itemW);
    idx = Math.max(0, Math.min(idx, items.length - 1));
    dots.forEach(function(d, i){ d.classList.toggle('active', i === idx); });
  }, { passive: true });

  function updateDots(){
    var pp = window.innerWidth <= 767 ? 1 : 2;
    var show = window.innerWidth <= 1023 && items.length > pp;
    dotsWrap.style.display = show ? 'flex' : 'none';
  }
  window.addEventListener('resize', updateDots);
  updateDots();
})();


/* ── Stats 카드: deal 등장 + 두둥실 float ───────────────────────────── */
;(function () {
  var grid = document.querySelector('.stats-grid');
  if (!grid) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll('.stat-card'));
  if (!cards.length) return;

  /* 초기 펼쳐진(spread) 위치 — 중앙에서 부채꼴로 퍼진 상태 */
  var spreads = [
    'translateX(-300px) translateY(80px) rotateZ(-16deg) scale(0.82)',
    'translateX(-110px) translateY(36px) rotateZ(-7deg)  scale(0.92)',
    'translateX( 110px) translateY(36px) rotateZ( 7deg)  scale(0.92)',
    'translateX( 300px) translateY(80px) rotateZ( 16deg) scale(0.82)'
  ];

  /* 초기 숨김 (transition 없이 즉시) */
  cards.forEach(function (card, i) {
    card.style.transition = 'none';
    card.style.transform  = spreads[i] || '';
    card.style.opacity    = '0';
  });

  var triggered = false;

  var observer = new IntersectionObserver(function (entries) {
    if (triggered || !entries[0].isIntersecting) return;
    triggered = true;
    observer.disconnect();

    cards.forEach(function (card, i) {
      /* 카드마다 80ms 스태거 */
      setTimeout(function () {
        card.style.transition = [
          'transform 0.92s cubic-bezier(0.22,1,0.36,1)',
          'opacity   0.65s ease'
        ].join(',');
        card.style.transform = 'none';
        card.style.opacity   = '1';

        /* deal 완료 후 float 시작 */
        setTimeout(function () {
          card.style.transition = '';
          card.style.transform  = '';
          card.style.opacity    = '';
          card.classList.add('is-floating');
        }, 960);
      }, i * 85);
    });
  }, { threshold: 0.28 });

  observer.observe(grid);
})();

/* ── Registration 카드 deal-in + float ── */
;(function () {
  var grid = document.querySelector('#reg-panel-register .reg-passcard-grid');
  if (!grid) return;
  var cards = Array.prototype.slice.call(grid.querySelectorAll('.reg-passcard'));
  var spreads = [
    'translateX(-180px) translateY(50px) rotateZ(-11deg) scale(0.88)',
    'translateX( 180px) translateY(50px) rotateZ( 11deg) scale(0.88)'
  ];
  cards.forEach(function (card, i) {
    card.style.transition = 'none';
    card.style.transform  = spreads[i] || '';
    card.style.opacity    = '0';
  });
  var triggered = false;
  var observer = new IntersectionObserver(function (entries) {
    if (triggered || !entries[0].isIntersecting) return;
    triggered = true;
    observer.disconnect();
    cards.forEach(function (card, i) {
      setTimeout(function () {
        card.style.transition = [
          'transform 0.88s cubic-bezier(0.22,1,0.36,1)',
          'opacity   0.60s ease'
        ].join(',');
        card.style.transform = 'none';
        card.style.opacity   = '1';
        setTimeout(function () {
          card.style.transition = '';
          card.style.transform  = '';
          card.style.opacity    = '';
          card.classList.add('is-floating');
        }, 940);
      }, i * 100);
    });
  }, { threshold: 0.2 });
  observer.observe(grid);
})();

/* ── 인사이트 프리뷰 슬라이더 + 유튜브 모달 ── */
(function(){
  var viewport   = document.getElementById('iv-viewport');
  var track      = document.getElementById('iv-track');
  var btnPrev    = document.getElementById('iv-prev');
  var btnNext    = document.getElementById('iv-next');
  var modal      = document.getElementById('iv-modal');
  var modalBg    = document.getElementById('iv-modal-bg');
  var modalClose = document.getElementById('iv-modal-close');
  var iframe     = document.getElementById('iv-modal-iframe');
  if(!track || !modal) return;

  var slides = track.querySelectorAll('.iv-slide');
  var idx = 0;

  function visibleCount(){
    var vw = viewport.offsetWidth;
    if(vw < 680) return 1;
    if(vw < 1024) return 2;
    return 3;
  }

  function maxIdx(){ return Math.max(0, slides.length - visibleCount()); }

  function goTo(n){
    idx = Math.max(0, Math.min(n, maxIdx()));
    var slideW = slides[0].offsetWidth + 16;
    viewport.scrollTo({ left: idx * slideW, behavior: 'smooth' });
    btnPrev.disabled = idx === 0;
    btnNext.disabled = idx >= maxIdx();
  }

  /* 스크롤로 idx 동기화 */
  viewport.addEventListener('scroll', function(){
    var slideW = slides[0].offsetWidth + 16;
    idx = Math.round(viewport.scrollLeft / slideW);
    btnPrev.disabled = idx === 0;
    btnNext.disabled = idx >= maxIdx();
  }, {passive:true});

  btnPrev.addEventListener('click', function(){ goTo(idx - 1); });
  btnNext.addEventListener('click', function(){ goTo(idx + 1); });
  window.addEventListener('resize', function(){ goTo(idx); });
  goTo(0);

  /* 카드 클릭 → 모달 */
  track.addEventListener('click', function(e){
    var card = e.target.closest('.iv-card');
    if(!card) return;
    e.preventDefault();
    var ytid = card.dataset.ytid;
    if(!ytid) return;
    iframe.src = 'https://www.youtube.com/embed/' + ytid + '?autoplay=1&rel=0';
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  });

  function closeModal(){
    modal.setAttribute('hidden','');
    iframe.src = '';
    document.body.style.overflow = '';
  }

  modalBg.addEventListener('click', closeModal);
  modalClose.addEventListener('click', closeModal);
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeModal();
  });
})();

/* ── Concept · AX 히어로: 스크롤 인뷰 시 1회 재생 (AX 좌측 이동 + 텍스트 좌→우 노출) ── */
(function(){
  var cxHero = document.getElementById('cx-hero');
  if(!cxHero) return;
  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        cxHero.classList.add('cx-inview');
        observer.unobserve(cxHero);
      }
    });
  },{threshold:0.4});
  observer.observe(cxHero);
})();



