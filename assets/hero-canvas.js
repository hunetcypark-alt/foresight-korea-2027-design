/* FK 2027 Hero — sphere background (v3 original) */
(function(){
  const hero = document.getElementById('hero');
  if(!hero) return;
  const cv   = document.getElementById('cv');
  const gcv  = document.getElementById('grid-cv');
  const ctx  = cv.getContext('2d');
  const gctx = gcv.getContext('2d');
  const hb   = document.getElementById('hb');
  const lw   = document.getElementById('lw');
  const cr   = document.getElementById('cr');

  const PR = Math.min(window.devicePixelRatio||1, 2);

  const oc1 = document.createElement('canvas');
  const oc2 = document.createElement('canvas');
  const ox1 = oc1.getContext('2d');
  const ox2 = oc2.getContext('2d');

  let W=0, H=0, t=0;
  let tx=.5, ty=.5, mx=.5, my=.5;

  function resize(){
    W = cv.width  = gcv.width  = oc1.width  = oc2.width  = hero.offsetWidth;
    H = cv.height = gcv.height = oc1.height = oc2.height = hero.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  hero.addEventListener('mousemove', e=>{
    const r = hero.getBoundingClientRect();
    tx = (e.clientX-r.left)/r.width;
    ty = (e.clientY-r.top)/r.height;
  });
  hero.addEventListener('mouseleave', ()=>{ tx=.5; ty=.5; });
  hero.addEventListener('touchmove', e=>{
    const r = hero.getBoundingClientRect(), tt = e.touches[0];
    tx = (tt.clientX-r.left)/r.width;
    ty = (tt.clientY-r.top)/r.height;
  }, {passive:true});

  const stars = Array.from({length:75}, ()=>({
    x:  Math.random(),
    y:  Math.random()*.75,
    r:  Math.random()*.8+.2,
    a:  Math.random()*.30+.10,
    ph: Math.random()*Math.PI*2,
    sp: Math.random()*.7+.25
  }));

  function frame(){
    requestAnimationFrame(frame);
    t  += .007;
    mx += (tx-mx)*.08;
    my += (ty-my)*.08;

    const dx = mx-.5, dy = my-.5;

    /* 패럴랙스 */
    if(lw) lw.style.transform = `translate(${dx*8}px,${dy*5}px)`;
    if(hb) hb.style.transform = `translate(${dx*4}px,${dy*3}px)`;
    if(cr) cr.style.transform = `translate(${dx*-6}px,${dy*-4}px)`;

    ctx.clearRect(0,0,W,H);
    ctx.fillStyle = '#000';
    ctx.fillRect(0,0,W,H);

    const cx = W*.5 + dx*W*.03;
    const cy = H*.5 + dy*H*.02;
    const R  = Math.min(W,H)*.60;

    /* 상단 아크 글로우 */
    const arcCX = W*.5 + dx*W*.04;
    const arcCY = H*.08 + dy*H*.03;
    const arcR  = W*.55;
    const arcG  = ctx.createRadialGradient(arcCX,arcCY,arcR*.55,arcCX,arcCY,arcR);
    arcG.addColorStop(0,    'rgba(30,90,200,0.0)');
    arcG.addColorStop(0.55, 'rgba(25,75,185,0.0)');
    arcG.addColorStop(0.75, 'rgba(40,110,230,0.18)');
    arcG.addColorStop(0.88, 'rgba(60,140,255,0.32)');
    arcG.addColorStop(0.94, 'rgba(80,170,255,0.18)');
    arcG.addColorStop(1,    'rgba(40,100,200,0.0)');
    ctx.fillStyle = arcG;
    ctx.fillRect(0,0,W,H);

    /* 아크 핫스팟 */
    const hsG = ctx.createRadialGradient(arcCX,arcCY+arcR*.82,0,arcCX,arcCY+arcR*.82,W*.28);
    hsG.addColorStop(0,   'rgba(140,200,255,0.28)');
    hsG.addColorStop(.3,  'rgba(80,160,255,0.12)');
    hsG.addColorStop(1,   'rgba(20,80,200,0)');
    ctx.fillStyle = hsG;
    ctx.fillRect(0,0,W,H);

    /* 하단 대기 글로우 */
    const botG = ctx.createRadialGradient(W*.5+dx*W*.05,H*.92,0,W*.5,H*.92,W*.5);
    botG.addColorStop(0,   'rgba(20,60,180,0.22)');
    botG.addColorStop(.4,  'rgba(10,40,140,0.10)');
    botG.addColorStop(1,   'rgba(0,10,60,0)');
    ctx.fillStyle = botG;
    ctx.fillRect(0,0,W,H);

    /* 별 파티클 */
    stars.forEach(s=>{
      const twinkle = 0.5 + Math.sin(t*s.sp+s.ph)*0.5;
      const sa = s.a * (0.25 + twinkle*0.75);
      const sr = s.r * (0.85 + twinkle*0.2);
      ctx.beginPath();
      ctx.arc(s.x*W, s.y*H, sr*PR, 0, Math.PI*2);
      ctx.fillStyle = `rgba(190,215,255,${sa})`;
      ctx.fill();
      if(twinkle > 0.78){
        const glow = ctx.createRadialGradient(s.x*W,s.y*H,0,s.x*W,s.y*H,sr*PR*4);
        glow.addColorStop(0, `rgba(180,215,255,${sa*0.3})`);
        glow.addColorStop(1, 'rgba(160,200,255,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(s.x*W,s.y*H,sr*PR*4,0,Math.PI*2);
        ctx.fill();
      }
    });

    /* 광원 */
    const lightAngle = t*.28 + dx*2.2;
    const lx = cx + Math.cos(lightAngle)*R;
    const ly = cy + Math.sin(lightAngle)*R*.7;

    /* 구체 내부 (clip) */
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx,cy,R,0,Math.PI*2);
    ctx.clip();

    const base = ctx.createRadialGradient(cx,cy-R*.15,0,cx,cy,R);
    base.addColorStop(0,   'rgba(4,8,22,1)');
    base.addColorStop(.55, 'rgba(2,5,15,1)');
    base.addColorStop(.88, 'rgba(1,3,10,1)');
    base.addColorStop(1,   'rgba(0,1,6,1)');
    ctx.fillStyle = base;
    ctx.fillRect(0,0,W,H);

    const atm = ctx.createRadialGradient(lx,ly,0,lx,ly,R*1.1);
    atm.addColorStop(0,   'rgba(30,100,160,0.10)');
    atm.addColorStop(.4,  'rgba(15,65,120,0.04)');
    atm.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = atm;
    ctx.fillRect(0,0,W,H);
    ctx.restore();

    /* 림 — 480 세그먼트 */
    ox1.clearRect(0,0,W,H);
    ox2.clearRect(0,0,W,H);
    const SEGS  = 480;
    const lDirX = (lx-cx)/R;
    const lDirY = (ly-cy)/R;

    for(let i=0; i<SEGS; i++){
      const a0       = (i/SEGS)*Math.PI*2;
      const a1       = ((i+2.2)/SEGS)*Math.PI*2;
      const segAngle = a0 + Math.PI/SEGS;
      const dot      = Math.cos(segAngle)*lDirX + Math.sin(segAngle)*lDirY;
      const bright   = Math.max(0, dot);
      if(bright < 0.018) continue;
      const bright2  = bright*bright;
      const hue      = 195 - bright*15;
      const sat      = 80  + bright*15;
      const lum      = 35  + bright*55;
      const alpha    = bright2*.95 + .02;

      ox1.beginPath();
      ox1.arc(cx,cy,R,a0,a1);
      ox1.strokeStyle = `hsla(${hue},${sat}%,${lum}%,${alpha*.42})`;
      ox1.lineWidth   = 20*PR*bright;
      ox1.stroke();

      ox2.beginPath();
      ox2.arc(cx,cy,R,a0,a1);
      ox2.strokeStyle = `hsla(${hue},${sat}%,${lum}%,${alpha*.58})`;
      ox2.lineWidth   = 5*PR*(bright*.7+.2);
      ox2.stroke();

      ctx.beginPath();
      ctx.arc(cx,cy,R,a0,a1);
      ctx.strokeStyle = `hsla(${hue+5},${sat}%,${Math.min(95,lum+18)}%,${alpha*.88})`;
      ctx.lineWidth   = 1.0*PR;
      ctx.stroke();
    }

    ctx.save(); ctx.filter=`blur(${12*PR}px)`; ctx.drawImage(oc1,0,0); ctx.restore();
    ctx.save(); ctx.filter=`blur(${4*PR}px)`;  ctx.drawImage(oc2,0,0); ctx.restore();

    /* 스팟 하이라이트 */
    ctx.save();
    ctx.filter = `blur(${R*.03}px)`;
    const sg = ctx.createRadialGradient(lx,ly,0,lx,ly,R*.28);
    sg.addColorStop(0,   'rgba(200,242,255,0.58)');
    sg.addColorStop(.2,  'rgba(120,215,245,0.28)');
    sg.addColorStop(.5,  'rgba(60,165,225,0.08)');
    sg.addColorStop(1,   'rgba(20,80,165,0)');
    ctx.fillStyle = sg;
    ctx.fillRect(0,0,W,H);
    const l2x = cx-(lx-cx)*.65, l2y = cy-(ly-cy)*.65;
    const sg2 = ctx.createRadialGradient(l2x,l2y,0,l2x,l2y,R*.20);
    sg2.addColorStop(0,  'rgba(120,80,255,0.25)');
    sg2.addColorStop(.4, 'rgba(80,60,220,0.08)');
    sg2.addColorStop(1,  'rgba(40,20,160,0)');
    ctx.fillStyle = sg2;
    ctx.fillRect(0,0,W,H);
    ctx.restore();

    /* 상단 비네팅 (grid-cv) */
    gctx.clearRect(0,0,W,H);
    const tv = gctx.createLinearGradient(0,0,0,H*0.55);
    tv.addColorStop(0,    'rgba(0,0,8,0.92)');
    tv.addColorStop(0.20, 'rgba(0,0,8,0.68)');
    tv.addColorStop(0.45, 'rgba(0,0,8,0.22)');
    tv.addColorStop(1,    'rgba(0,0,8,0)');
    gctx.fillStyle = tv;
    gctx.fillRect(0,0,W,H);
  }
  frame();
})();
