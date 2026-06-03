/* FK 2027 — State Switcher
   Each phase rewrites: hero CTA + hint, GNB items visibility,
   purchase banner content/visibility. */

const STATES = {
  presale: {
    label: '사전판매',
    hero: {
      cta: '사전 등록하기',
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
  try{ const saved = localStorage.getItem('fk27_state'); if(saved && STATES[saved]) init = saved; }catch(_){}
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
      if(el.getBoundingClientRect().top < vh * 0.88){
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
      if(els[i].getBoundingClientRect().top < vh*0.9){
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
  var _origSwitch = switchPage;
  window.switchPage = function(id) {
    _origSwitch(id);
    syncMobNav(id);
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
    if (tabs[k]) {
      tabs[k].style.color = k === tab ? '#20222d' : '#c8c8c8';
      tabs[k].style.borderBottomColor = k === tab ? '#13151b' : 'transparent';
    }
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

/* ── FAQ 아코디언 ── */
function toggleFaq(btn) {
  var answer = btn.nextElementSibling;
  var arrow = btn.querySelector('.faq-arrow');
  var isOpen = answer.style.display !== 'none';
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
    'A-1':{bio:'윤상하 실장은 대외경제정책연구원(KIEP)에서 국제거시금융을 연구하고 있습니다. 글로벌 경기 사이클, 무역·금융 흐름, 신흥국 경제를 중심으로 한국 기업과 정책 당국에 실질적인 거시 분석을 제공해 왔습니다.',tags:['#성장전망','#물가','#교역질서'],desc:'2027년 세계 경제는 선진국 성장 둔화와 신흥국 분화, 구조적 인플레이션 잔존, 탈세계화 흐름 속 교역 패턴 재편이라는 세 가지 큰 변수를 동시에 마주하고 있습니다.\n\n미국은 고금리 장기화의 후유증이 가시지 않은 상황에서 대선 이후 정책 불확실성이 커지고 있으며, 유럽은 구조적 경쟁력 약화와 에너지 전환 비용 부담이 맞물려 저성장 기조를 이어갈 가능성이 높습니다. 반면 인도·동남아를 중심으로 한 아시아 신흥국의 성장 모멘텀은 상대적으로 견조하게 유지될 전망입니다.\n\n물가 측면에서는 서비스 인플레이션 고착화, 지정학적 공급 충격, 기후변화에 따른 식품·에너지 변동성이 2%대 목표로의 완전한 복귀를 늦추는 요인으로 작용하고 있습니다. 각국 중앙은행의 금리 인하 경로가 예상보다 완만하게 진행될 경우, 기업의 자본조달 비용과 소비심리에 추가적인 부담이 될 수 있습니다.\n\n교역 구조 측면에서는 미·중 디커플링이 가속화되면서 글로벌 공급망이 Friend-shoring과 Near-shoring 중심으로 재편되고 있습니다. 이에 따라 한국 기업은 미국·유럽 시장을 위한 공급망과 중국·동남아 시장을 위한 공급망을 사실상 이원화해야 하는 전략적 도전에 직면해 있습니다.\n\n본 세션에서는 이러한 거시 변수들을 사업계획의 전제 조건으로 전환하는 방법론을 실질적으로 다룹니다. 성장률·환율·금리·교역량의 시나리오별 가정값 설정, 각 가정이 매출·원가·재무에 미치는 민감도 분석, 그리고 불확실성에 강한 사업계획 구조 설계까지—2027년 전략 기획의 출발점이 될 핵심 프레임워크를 제공합니다.'},
    'A-2':{bio:'이승주 교수는 중앙대학교 정치국제학과 교수로 국제관계와 지정학을 전공합니다. 미·중 전략 경쟁, 한반도 안보, 동아시아 국제질서를 연구하며 기업과 정부 자문에 폭넓게 참여하고 있습니다.',tags:['#지정학리스크','#공급망','#한국기업'],desc:'미·중 전략 경쟁, 러·우 전쟁, 중동 불안이 동시에 진행되는 2027년의 지정학 지형을 분석합니다. 한국 기업이 노출된 지정학 리스크를 유형별로 분류하고, 생산기지·수출 전략·현지화 결정에 반영할 수 있는 실전 프레임을 제공합니다.'},
    'A-3':{bio:'강명수 센터장은 삼일PwC의 국제통상솔루션센터장으로 관세·통상 규제·공급망 리스크 분야의 전문가입니다. 국내 주요 대기업의 무역 구조 재편 및 통상 전략 자문을 담당하고 있습니다.',tags:['#에너지','#물류','#원가전략'],desc:'에너지 전환 가속화와 물류 초크포인트 집중이 글로벌 원가 구조를 어떻게 바꾸는지 분석합니다. 공급망 다변화·에너지 비용 내재화·물류 리스크 헷징 전략을 통해 기업이 충격을 선제적으로 흡수하는 방법을 제시합니다.'},
    'A-4':{tags:['#환율','#금리','#자본비용'],desc:'고금리·달러 강세 구조가 기업 재무에 미치는 영향을 데이터로 분석하고, 2027년 환율·금리·자본비용의 시나리오별 대응 전략을 다룹니다. CFO와 전략기획 담당자가 즉시 활용할 수 있는 재무 리스크 지도를 제공합니다.'},
    'A-5':{bio:'주원 실장은 현대경제연구원에서 거시경제 분석을 담당하고 있습니다. 한국 경제의 구조적 전환, 소득 양극화, 소비·고용 트렌드를 연구하며 다수의 경제 전망 보고서를 발표해 왔습니다.',tags:['#K자양극화','#한국경제','#방어전략'],desc:'AI·자동화·플랫폼 독점이 심화시키는 K자형 양극화 속에서 한국 기업이 위쪽 곡선에 올라타기 위한 조건을 분석합니다. 성장 기회 포착을 위한 포지셔닝 전략과, 하방 압력을 방어하는 비용 구조 혁신 방향을 제시합니다.'},
    'A-6':{tags:['#시나리오경영','#예산','#불확실성'],desc:'불확실성을 숫자로 전환하는 시나리오 플래닝 방법론을 소개합니다. 기준·낙관·비관 시나리오를 설계하고, 이를 연간 예산과 실행계획에 연동하는 구체적 프로세스와 도구를 다룹니다.'},
    'B-1':{tags:['#AI플래닝','#애자일전략','#계획혁신'],desc:'연간 계획 주기가 AI 시대의 변화 속도를 감당하지 못하는 근본적 이유를 진단합니다. AI Adaptive Planning으로 전략을 분기가 아닌 실시간으로 조정하는 방법론과, 이를 위한 데이터 인프라·의사결정 구조 변화를 제시합니다.'},
    'B-2':{tags:['#레거시탈피','#포트폴리오','#AX도약'],desc:'성장을 가로막는 레거시 사업·프로세스·조직 관성을 진단하는 프레임을 소개합니다. AI Native 도약을 위해 무엇을 유지하고, 무엇을 버려야 하는지 포트폴리오 재설계 원칙과 실행 로드맵을 제시합니다.'},
    'B-3':{tags:['#DualAX','#사업모델','#실행역량'],desc:'사업 모델 혁신(외부)과 실행 역량 구축(내부)을 동시에 추진하는 Dual AX 전략의 설계 원칙을 다룹니다. 두 축을 분리하지 않고 통합 추진하는 기업이 왜 더 빠른 성과를 내는지, 사례와 함께 설명합니다.'},
    'B-4':{tags:['#플랫폼생태계','#비즈니스재정의','#AX사례'],desc:'제품 기업이 플랫폼 생태계로 진화한 국내외 선도 기업의 전환 사례를 분석합니다. 생태계 설계 원칙, 파트너십 구조, 데이터 레버리지 전략 등 플랫폼으로의 전환을 위한 실질적 조건을 제시합니다.'},
    'B-5':{tags:['#실행속도','#하이퍼조직','#의사결정'],desc:'하이퍼 스냅스 조직이 의사결정-실행 사이클을 극단적으로 단축하는 구조와 문화를 분석합니다. 권한 위임, 정보 흐름 최적화, OKR 운용 방식의 변화가 실행 속도에 미치는 효과를 사례로 설명합니다.'},
    'B-6':{tags:['#1인유니콘','#실리콘밸리','#AI극한활용'],desc:'AI로 소수 인력이 유니콘급 기업을 만드는 실리콘밸리의 사례가 전통 대기업에 던지는 질문을 탐구합니다. 인원 대비 성과 밀도를 높이는 AI 활용 전략과, 한국 기업이 이를 현실적으로 적용하는 방안을 모색합니다.'},
    'C-1':{tags:['#피지컬AI','#스틸칼라','#제조혁신'],desc:'휴머노이드 로봇과 피지컬 AI가 제조·물류·건설 현장에서 인간 노동을 어떻게 대체하고 보완하는지 분석합니다. 스틸칼라 확산이 인력 계획·공정 설계·원가 구조에 미치는 영향과 경영자의 준비 과제를 다룹니다.'},
    'C-2':{bio:'백서인 교수는 한양대학교에서 중국 경제와 기술 혁신을 연구합니다. 중국 AI 산업 생태계, 디지털 경제 정책, 한·중 기술 경쟁 구도를 전문으로 하며 기업 자문과 정책 연구를 병행하고 있습니다.',tags:['#중국AI','#딥시크','#기술경쟁'],desc:'딥시크를 비롯한 중국 AI 기술의 급격한 성장이 미국 주도 AI 생태계와 글로벌 기술 패권 경쟁을 어떻게 재편하는지 진단합니다. 한국 기업이 중국 AI 굴기에서 위협과 기회를 동시에 읽는 전략적 관점을 제공합니다.'},
    'C-3':{tags:['#AI투자ROI','#비용효율','#성과측정'],desc:'AI 투자에서 실제 비즈니스 가치를 만드는 기업과 그러지 못하는 기업의 결정적 차이를 분석합니다. 워크슬롭 효과를 피하고 ROI를 창출하는 AI 투자 포트폴리오 구성 원칙과 성과 측정 방법론을 제시합니다.'},
    'C-4':{bio:'이동근 AI센터장은 KPMG 한국에서 AI 전략 및 디지털 전환 컨설팅을 이끌고 있습니다. 금융·제조·유통 등 다양한 산업의 AI 도입 프로젝트를 수행하며 실전 사례 기반의 인사이트를 제공합니다.',tags:['#전사AI','#도입전략','#성공패턴'],desc:'전사 AI 도입 프로젝트의 성공 조건과 반복되는 실패 패턴을 실제 기업 컨설팅 경험을 바탕으로 분석합니다. 경영진이 놓치는 핵심 의사결정 포인트와 조직 준비도 진단 프레임을 제공합니다.'},
    'C-5':{tags:['#AI에이전트','#자율의사결정','#거버넌스'],desc:'AI 에이전트가 가격 결정·공급망 조정·투자 실행 등 경제적 결정을 자율적으로 내리는 시대의 통제 메커니즘을 탐구합니다. 인간의 감독 범위와 AI 자율성의 경계를 설계하는 기업 거버넌스 프레임을 제시합니다.'},
    'C-6':{tags:['#섀도우AI','#조직설계','#AI문화'],desc:'임직원이 비공식 채널로 활용하는 섀도우 AI를 조직 성과로 전환하는 방법을 다룹니다. 통제와 자율의 균형을 맞추는 AI 사용 정책 설계, 내부 AI 챔피언 육성, 사내 AI 거버넌스 구조를 소개합니다.'},
    'D-1':{bio:'전미영 박사는 트렌드코리아컴퍼니의 수석연구원으로 소비자 행동과 라이프스타일 트렌드를 연구합니다. 《트렌드코리아》 시리즈의 공동저자로 매년 국내 소비 트렌드를 선도적으로 전망해 왔습니다.',tags:['#AI소비자','#구매여정','#트렌드2027'],desc:'AI 검색·추천·개인화를 일상으로 받아들인 소비자가 어떻게 정보를 탐색하고 구매를 결정하는지 트렌드 데이터로 분석합니다. 2027년 마케터가 재설계해야 할 고객 여정의 핵심 변곡점을 제시합니다.'},
    'D-2':{bio:'윤성훈 파트너는 글로벌 전략 컨설팅 펌 Kearney의 파트너로 마케팅 전략과 소비재 산업을 전문으로 합니다. AI 시대의 브랜드 전략과 고객 여정 혁신 분야에서 국내외 기업의 전략 수립을 지원하고 있습니다.',tags:['#AI검색','#브랜드전략','#GEO'],desc:'구글 검색 대신 AI 어시스턴트로 정보를 얻는 소비자 시대, 브랜드가 AI 추천 결과에 포함되기 위한 생성형 엔진 최적화(GEO) 전략을 다룹니다. SEO 이후의 브랜드 가시성 확보 방법론을 실전 사례와 함께 제시합니다.'},
    'D-3':{bio:'이승무 교수는 한국종합예술원(K-Arts)에서 미디어와 엔터테인먼트 경영을 가르칩니다. 디지털 광고 생태계, 미디어 투자 전략, 크리에이티브 경제를 연구하며 실무와 학문을 연결하는 강연으로 정평이 나 있습니다.',tags:['#미디어믹스','#채널전략','#AI최적화'],desc:'AI 기반 미디어 바잉과 성과 측정이 광고 생태계를 어떻게 재편하는지 분석합니다. 채널 믹스 최적화, 크리에이티브 AI 자동화, 증분 효과 측정 방법론의 변화를 실제 집행 데이터 기반으로 설명합니다.'},
    'D-4':{bio:'송수진 교수는 고려대학교 경영대학에서 마케팅을 가르치고 있습니다. AI 기반 퍼포먼스 마케팅, 디지털 광고 효과 측정, 소비자 의사결정을 연구하며 국내 주요 기업의 마케팅 전략 자문을 담당합니다.',tags:['#퍼포먼스마케팅','#AI측정','#AX사례'],desc:'AI 타겟팅·예산 자동 최적화·멀티터치 어트리뷰션이 퍼포먼스 마케팅의 구조를 어떻게 바꾸는지 실제 캠페인 사례로 분석합니다. 자동화 영역과 인간의 판단이 여전히 필요한 영역을 구분하는 실전 기준을 제시합니다.'},
    'D-5':{tags:['#AI마케팅조직','#에이전트협업','#조직설계'],desc:'콘텐츠 제작·캠페인 실행·성과 분석을 AI 에이전트가 담당하는 마케팅 조직의 미래 구조를 탐구합니다. 마케터의 역할 재정의, 에이전트 관리 역량, AI 네이티브 마케팅팀 빌딩 전략을 다룹니다.'},
    'D-6':{tags:['#고객경험','#AI개인화','#CX혁신'],desc:'AI가 고객 서비스·개인화 추천·옴니채널 경험 통합을 어떻게 혁신하는지 국내외 기업 사례로 분석합니다. 고객 접점의 AI 전환이 NPS·재구매율·LTV에 미친 실제 성과와 구현 로드맵을 제시합니다.'},
    'E-1':{bio:'이중학 교수는 동국대학교 경영학부 교수로 인적자원관리와 조직행동을 전공합니다. AI 시대 직무 재설계와 조직 변화 관리를 연구하며 기업 현장과의 협력 연구를 활발히 진행하고 있습니다.',tags:['#직무재설계','#AI네이티브HR','#빅테크사례'],desc:'구글·아마존·메타 등 글로벌 빅테크가 AI 시대에 맞춰 직무 정의·채용 기준·평가 방식을 어떻게 바꿨는지 분석합니다. 한국 기업이 AI Native 직무 체계를 설계하는 데 적용할 수 있는 프레임워크를 제시합니다.'},
    'E-2':{tags:['#AI리스킬링','#역량교육','#프롬프트'],desc:'프롬프트 엔지니어링이 기본 업무 역량이 된 시대, 임직원 AI 역량 격차를 진단하고 체계적으로 끌어올리는 리스킬링 전략을 다룹니다. 직급별·직무별 AI 교육 커리큘럼 설계와 내재화 촉진 방법론을 소개합니다.'},
    'E-3':{tags:['#프롬프트리더십','#조직변화','#리더역할'],desc:'AI 전환을 주도하는 리더가 갖춰야 할 새로운 리더십 언어와 행동 양식을 탐구합니다. 구성원의 AI 실험을 촉진하고, 실패를 학습으로 전환하며, AI 친화적 문화를 만드는 프롬프트 리더십의 실천 방법을 제시합니다.'},
    'E-4':{bio:'한광모 본부장은 SAP 한국에서 HR 솔루션 및 인재 관리 사업을 이끌고 있습니다. AI 기반 채용·평가·리스킬링 솔루션 도입 프로젝트를 다수 수행하며 HR 테크 분야의 실전 전문가로 활동하고 있습니다.',tags:['#AI채용','#성과평가','#HRtech'],desc:'AI 스크리닝·역량 면접 보조·성과 패턴 분석을 도입한 기업의 HR 혁신 사례를 분석합니다. AI Native HR 시스템이 채용 품질·평가 공정성·인재 유지율에 미친 실제 효과와 단계별 도입 로드맵을 소개합니다.'},
    'E-5':{tags:['#AI내재화','#변화관리','#임원리더십'],desc:'전사 AI 내재화에 성공한 기업의 C-레벨 경영진이 어떻게 조직의 저항을 극복하고 변화의 동력을 유지했는지 생생한 경험을 공유합니다. 변화 관리의 핵심 레버와 성공 요인을 실전 관점에서 정리합니다.'},
    'E-6':{tags:['#연공서열','#AI속도','#한국형전환'],desc:'연공서열 문화와 AI 시대 실행 속도 사이의 충돌을 현실적으로 해결한 한국 기업의 조직 전환 사례를 분석합니다. 세대 간 AI 역량 격차를 좁히고, 속도와 경험을 공존시키는 한국형 조직 혁신 방법론을 제시합니다.'}
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
    /* 연사소개 탭 */
    var spkDescEl = document.getElementById('sess-speaker-desc');
    if(spkDescEl) spkDescEl.textContent = isTbd
      ? '해당 세션의 연사는 현재 섭외 진행 중입니다. 확정 후 연사 소개가 업데이트됩니다.'
      : (data.bio || '연사 소개가 준비 중입니다.');

    /* 세션소개 탭 */
    var sessDescEl = document.getElementById('sess-session-desc');
    if(sessDescEl) sessDescEl.textContent = isTbd
      ? '해당 세션의 내용은 현재 준비 중입니다. 확정 후 세션 소개가 업데이트됩니다.'
      : (data.desc || '');

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

    var spkEl2 = document.getElementById('sess-speaker-desc');
    if(spkEl2) spkEl2.textContent = isTbd
      ? '해당 세션의 연사는 현재 섭외 진행 중입니다. 확정 후 연사 소개가 업데이트됩니다.'
      : (data.bio || '연사 소개가 준비 중입니다.');

    var sesEl2 = document.getElementById('sess-session-desc');
    if(sesEl2) sesEl2.textContent = isTbd
      ? '해당 세션의 내용은 현재 준비 중입니다. 확정 후 세션 소개가 업데이트됩니다.'
      : (data.desc || '');

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

  /* 카드 클릭 → 모달 (document 위임, 모달 내부 클릭 제외) */
  document.addEventListener('click', function(e){
    if(e.target.closest('#sess-overlay')) return;
    var c5 = e.target.closest('.pgtl-c5');
    if(c5){ openModal(c5); return; }
    var sc = e.target.closest('article.sc');
    if(sc){ openModalFromSc(sc); }
  });
})();

/* ── 홈 전체 섹션 사이드 내비게이션 ── */
(function(){
  var nav = document.getElementById('cxt-sidenav');
  if(!nav) return;
  var dots = nav.querySelectorAll('.cxt-dot');
  var sectionIds = ['intro','concept','tracks','speakers','purchase','insight','archive'];
  var targets = {};
  sectionIds.forEach(function(id){ targets[id] = document.getElementById(id); });

  dots.forEach(function(dot){
    dot.addEventListener('click', function(){
      var el = targets[dot.dataset.target];
      if(el) el.scrollIntoView({ behavior:'smooth', block:'start' });
    });
  });

  function setActive(id){
    dots.forEach(function(d){
      d.classList.toggle('active', d.dataset.target === id);
    });
  }

  var heroVisible = true;
  var heroEl = document.getElementById('hero');
  if(heroEl){
    new IntersectionObserver(function(entries){
      heroVisible = entries[0].isIntersecting;
      updateNavVisibility();
    }, { threshold: 0.05 }).observe(heroEl);
  }

  function updateNavVisibility(){
    if(heroVisible){ nav.classList.remove('visible'); return; }
    var anyVisible = sectionIds.some(function(id){
      var s = targets[id];
      if(!s) return false;
      var r = s.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    });
    nav.classList.toggle('visible', anyVisible);
  }

  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting) setActive(entry.target.id);
    });
    updateNavVisibility();
  }, { threshold: 0.15, rootMargin:'-60px 0px 0px 0px' });

  sectionIds.forEach(function(id){ if(targets[id]) observer.observe(targets[id]); });
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

  /* 판매중 카드로 초기 스크롤 */
  function scrollToSelling(){
    if(window.innerWidth >= 1024) return;
    var selling = tickets.querySelector('.tkt[data-status="selling"]');
    if(!selling) return;
    var offset = selling.offsetLeft - (tickets.offsetWidth - selling.offsetWidth) / 2;
    tickets.scrollLeft = offset;
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
