

    // Keep the green spell physically connected to the wand tip and the letter on every screen size.
    function positionHeartSpell() {
      const intro = document.getElementById('intro');
      const tip = document.querySelector('.wand-tip-anchor');
      const letter = document.getElementById('letter');
      const trail = document.querySelector('.heart-spell-trail');
      const heart = document.querySelector('.heart-spell-heart');
      const hit = document.querySelector('.heart-spell-hit');
      if (!intro || !tip || !letter || !trail || !heart || !hit) return;
      const ir = intro.getBoundingClientRect();
      const tr = tip.getBoundingClientRect();
      const lr = letter.getBoundingClientRect();
      if (!ir.width || !ir.height) return;
      const mapX = px => (px - ir.left) / ir.width * 1000;
      const mapY = py => (py - ir.top) / ir.height * 700;
      const sx = mapX(tr.left + tr.width / 2);
      const sy = mapY(tr.top + tr.height / 2);
      const tx = mapX(lr.left + lr.width * .52);
      const ty = mapY(lr.top + lr.height * .47);
      const bendX = sx + (tx - sx) * .55;
      const bendY = sy + (ty - sy) * .22;
      trail.setAttribute('d', `M ${sx.toFixed(1)} ${sy.toFixed(1)} C ${(sx+(tx-sx)*.28).toFixed(1)} ${(sy-28).toFixed(1)}, ${bendX.toFixed(1)} ${bendY.toFixed(1)}, ${tx.toFixed(1)} ${ty.toFixed(1)}`);
      const hw = Math.max(48, Math.min(74, 1000 * lr.width / ir.width * .16));
      const hh = hw * .88;
      const top = ty - hh * .40;
      const bottom = ty + hh * .54;
      const left = tx - hw * .56;
      const right = tx + hw * .56;
      const c1 = tx - hw * .34;
      const c2 = tx + hw * .34;
      heart.setAttribute('d', `M ${tx.toFixed(1)} ${bottom.toFixed(1)} C ${tx.toFixed(1)} ${bottom.toFixed(1)}, ${left.toFixed(1)} ${(ty+hh*.10).toFixed(1)}, ${left.toFixed(1)} ${(ty-hh*.12).toFixed(1)} C ${left.toFixed(1)} ${(top-hh*.16).toFixed(1)}, ${c1.toFixed(1)} ${(top-hh*.12).toFixed(1)}, ${tx.toFixed(1)} ${(ty-hh*.02).toFixed(1)} C ${c2.toFixed(1)} ${(top-hh*.12).toFixed(1)}, ${right.toFixed(1)} ${(top-hh*.16).toFixed(1)}, ${right.toFixed(1)} ${(ty-hh*.12).toFixed(1)} C ${right.toFixed(1)} ${(ty+hh*.10).toFixed(1)}, ${tx.toFixed(1)} ${bottom.toFixed(1)}, ${tx.toFixed(1)} ${bottom.toFixed(1)} Z`);
      hit.setAttribute('cx', tx.toFixed(1));
      hit.setAttribute('cy', ty.toFixed(1));
    }
    positionHeartSpell();
    window.addEventListener('resize', () => requestAnimationFrame(positionHeartSpell), {passive:true});

    // Туманное появление секций + плавные «слайды» при прокрутке.
    function revealVisible() {
      document.querySelectorAll('.mist-page, .mist-inner, .mist-item').forEach((el, i) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * .92 && r.bottom > 0) {
          const delay = el.classList.contains('mist-item') ? Math.min((i % 8) * 45, 260) : 0;
          setTimeout(() => el.classList.add('mist-visible'), delay);
        }
      });
    }

    const mistObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const siblings = el.parentElement ? [...el.parentElement.querySelectorAll('.mist-item')] : [];
        const idx = siblings.indexOf(el);
        const delay = el.classList.contains('mist-item') && idx >= 0 ? (idx % 6) * 55 : 0;
        setTimeout(() => el.classList.add('mist-visible'), delay);
        mistObserver.unobserve(el);
      });
    }, { threshold: .075, rootMargin: '0px 0px -3% 0px' });

    document.querySelectorAll('.mist-page, .mist-inner, .mist-item').forEach(el => mistObserver.observe(el));

    // v5: не перехватываем нативное открытие <details>. Это надёжнее на iPhone/Safari.
    // Само состояние [open] запускает огонь и полёт ангелочка через CSS.
    document.querySelectorAll('#reasonsGrid > details.reason-envelope').forEach(detail => {
      let burnTimer = null;
      detail.addEventListener('toggle', () => {
        if (!detail.open) {
          detail.classList.remove('burn-done');
          if (burnTimer) clearTimeout(burnTimer);
          return;
        }
        if (navigator.vibrate) { try { navigator.vibrate([12, 28, 10]); } catch (_) {} }
        const isMinecraftSpecial = detail.classList.contains('minecraft-special');
        const burnDuration = isMinecraftSpecial ? 6350 : 4280;
        burnTimer = setTimeout(() => {
          detail.classList.add('burn-done');
        }, burnDuration);
      });
    });

    // Последний сердитый конверт остаётся с прежней логикой: 😡 отскакивает и остаётся рядом.
    const dislike = document.querySelector('.dislike-envelope');
    if (dislike) {
      dislike.addEventListener('toggle', () => {
        if (dislike.open) { /* no auto-scroll: keep the viewport where the user left it */ }
      });
    }

    let heartsStarted = false;
    function startHearts() {
      if (heartsStarted) return;
      heartsStarted = true;
      window.__heartInterval = setInterval(() => {
        if (document.hidden || window.innerWidth <= 760) return;
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = Math.random() > .4 ? '♡' : '✦';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (10 + Math.random() * 18) + 'px';
        heart.style.animationDuration = (7 + Math.random() * 7) + 's';
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 15000);
      }, 850);
    }

    window.addEventListener('hashchange', () => {
      if (location.hash === '#intro') positionHeartSpell();
    });
    document.addEventListener('intro:continue', () => {
      setTimeout(() => {
        startHearts();
        revealVisible();
      }, 4500);
    });

    window.addEventListener('load', () => {
      revealVisible();
      positionHeartSpell();
      if (location.hash === '#intro') startHearts();
    });
    window.addEventListener('scroll', revealVisible, { passive:true });



(function(){
  let spellRAF=0, spellStart=0;
  function trackDesktopSpell(ts){
    if (!spellStart) spellStart=ts;
    // Recompute while the wand is physically moving and the beam is drawing.
    if (typeof positionHeartSpell === 'function') positionHeartSpell();
    if (ts-spellStart < 1750) spellRAF=requestAnimationFrame(trackDesktopSpell);
  }
  function armSpellTracking(){
    cancelAnimationFrame(spellRAF); spellStart=0;
    spellRAF=requestAnimationFrame(trackDesktopSpell);
  }
  document.addEventListener('intro:continue',armSpellTracking);
})();



(function(){
  function trackV14(duration){
    const start=performance.now();
    function frame(now){
      if(typeof positionHeartSpell==='function') positionHeartSpell();
      if(now-start<duration) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  function armV14Tracking(){ trackV14(6500); }
  document.addEventListener('intro:continue',armV14Tracking);
  window.addEventListener('load',function(){
    setTimeout(function(){ if(typeof positionHeartSpell==='function') positionHeartSpell(); },60);
  });
})();



(function(){
  const IGNITION_DELAY = 1180; // flint reaches the envelope, sparks, then the paper may ignite
  document.querySelectorAll('#reasonsGrid > details.reason-envelope.minecraft-special').forEach(detail => {
    let ignitionTimer = null;
    detail.addEventListener('toggle', () => {
      if (ignitionTimer) { clearTimeout(ignitionTimer); ignitionTimer = null; }
      detail.classList.remove('flint-lit');
      if (!detail.open) return;
      ignitionTimer = setTimeout(() => {
        if (detail.open && !detail.classList.contains('burn-done')) {
          detail.classList.add('flint-lit');
        }
      }, IGNITION_DELAY);
    });
  });
})();



(function(){
  const intro=document.getElementById('intro');
  const letter=document.getElementById('letter');
  if(intro && letter){
    const fire=document.createElement('div');
    fire.className='green-spell-fire-v16';
    fire.setAttribute('aria-hidden','true');
    for(let i=0;i<9;i++){
      const tongue=document.createElement('i');
      tongue.className='gflame';
      fire.appendChild(tongue);
    }
    document.body.appendChild(fire);
    let fireTimer=0;
    function placeGreenFire(){
      const r=letter.getBoundingClientRect();
      if(!r.width || !r.height) return;
      fire.style.left=(r.left+r.width*.50)+'px';
      fire.style.top=(r.top+r.height*.50)+'px';
    }
    function armGreenFire(){
      clearTimeout(fireTimer);
      fire.classList.remove('active');
      placeGreenFire();
      fireTimer=setTimeout(function(){
        placeGreenFire();
        void fire.offsetWidth;
        fire.classList.add('active');
      },2320);
    }
    window.addEventListener('resize',()=>requestAnimationFrame(placeGreenFire),{passive:true});
    document.addEventListener('intro:continue',armGreenFire);
  }


})();



(function(){
  const intro=document.getElementById('intro');
  const letter=document.getElementById('letter');
  const envelope=document.getElementById('envelope');
  if(!intro||!letter) return;

  const front=document.createElement('div');
  front.className='intro-burn-front-v23';
  front.setAttribute('aria-hidden','true');
  document.body.appendChild(front);

  const sparks=document.createElement('div');
  sparks.className='intro-burn-sparks-v23';
  sparks.setAttribute('aria-hidden','true');
  document.body.appendChild(sparks);

  let timer=0, sparkTimer=0;
  function placeFX(){
    const r=letter.getBoundingClientRect();
    if(!r.width||!r.height) return;
    const x=r.left+r.width*.5, y=r.top+r.height*.5;
    front.style.left=x+'px'; front.style.top=y+'px';
    sparks.style.left=x+'px'; sparks.style.top=y+'px';
  }
  function makeSparkBurst(){
    sparks.innerHTML='';
    for(let i=0;i<34;i++){
      const p=document.createElement('i');
      const a=(Math.PI*2*i/34)+(Math.random()-.5)*.22;
      const d=45+Math.random()*155;
      p.style.setProperty('--sx',(Math.cos(a)*d).toFixed(1)+'px');
      p.style.setProperty('--sy',(Math.sin(a)*d).toFixed(1)+'px');
      p.style.animationDelay=(Math.random()*.34).toFixed(2)+'s';
      p.style.animationDuration=(.75+Math.random()*.7).toFixed(2)+'s';
      sparks.appendChild(p);
    }
  }
  function resetAndArm(){
    clearTimeout(timer); clearTimeout(sparkTimer);
    letter.classList.remove('spell-dissolve-v20','spell-dissolve-v21','spell-dissolve-v23');
    front.classList.remove('active'); sparks.classList.remove('active');
    placeFX();
    timer=setTimeout(function(){
      placeFX();
      letter.classList.remove('spell-dissolve-v20','spell-dissolve-v21');
      void letter.offsetWidth;
      letter.classList.add('spell-dissolve-v23');
      front.classList.remove('active'); void front.offsetWidth; front.classList.add('active');
      makeSparkBurst(); sparks.classList.add('active');
      sparkTimer=setTimeout(()=>sparks.classList.remove('active'),1800);
    },2320);
  }
  window.addEventListener('resize',()=>requestAnimationFrame(placeFX),{passive:true});
  document.addEventListener('intro:continue',resetAndArm);
})();



(function(){
  const intro=document.getElementById('intro');
  const letter=document.getElementById('letter');
  if(!intro||!letter) return;
  let dissolveTimer=0;
  function arm(){
    clearTimeout(dissolveTimer);
    letter.classList.remove('spell-dissolve-v20');
    // Force the browser to render the closed position first, then :target transition moves it out.
    requestAnimationFrame(()=>requestAnimationFrame(()=>{}));
    dissolveTimer=setTimeout(()=>{
      letter.classList.remove('spell-dissolve-v20');
      void letter.offsetWidth;
      letter.classList.add('spell-dissolve-v20');
    },2320);
  }
  document.addEventListener('intro:continue',arm);
})();



(function(){
  const intro=document.getElementById('intro');
  const letter=document.getElementById('letter');
  const envelope=document.getElementById('envelope');
  if(!intro||!letter) return;
  let timer=0;
  function resetAndArm(){
    clearTimeout(timer);
    letter.classList.remove('spell-dissolve-v20','spell-dissolve-v21');
    // Restart the entrance animation even when the intro is reopened in the same page.
    letter.style.animation='none';
    void letter.offsetWidth;
    letter.style.animation='';
    timer=setTimeout(function(){
      letter.classList.remove('spell-dissolve-v20','spell-dissolve-v21');
      void letter.offsetWidth;
      letter.classList.add('spell-dissolve-v21');
    },2320);
  }
  document.addEventListener('intro:continue',resetAndArm);
})();



/* Restore the old visible angel flight on every normal reason envelope. */
(function(){
  document.querySelectorAll('#reasonsGrid > details.reason-envelope:not(.dislike-envelope)').forEach(detail=>{
    let launched=false;
    detail.addEventListener('toggle',()=>{
      if(!detail.open || launched) return;
      launched=true;
      const seal=detail.querySelector('.angel-seal');
      if(!seal) return;
      const r=seal.getBoundingClientRect();
      const angel=document.createElement('span');
      angel.className='flying-angel-restored';
      angel.textContent='😇';
      angel.setAttribute('aria-hidden','true');
      angel.style.left=(r.left+r.width/2-17)+'px';
      angel.style.top=(r.top+r.height/2-17)+'px';
      document.body.appendChild(angel);
      setTimeout(()=>angel.remove(),2300);
    },{passive:true});
  });
})();

// ===== split-site navigation and persistence =====
(function(){
  const key='arina-opened-reasons-v1';
  function getOpened(){ try{return new Set(JSON.parse(localStorage.getItem(key)||'[]').map(Number));}catch(_){return new Set();} }
  function saveOpened(set){ try{localStorage.setItem(key,JSON.stringify([...set].sort((a,b)=>a-b)));}catch(_){} }
  document.querySelectorAll('#reasonsGrid > details.reason-envelope[data-reason]').forEach(detail=>{
    const n=Number(detail.dataset.reason);
    detail.addEventListener('toggle',()=>{
      if(!detail.open || !n) return;
      const opened=getOpened(); opened.add(n); saveOpened(opened);
    },{passive:true});
  });

  const overlay=document.querySelector('.page-transition');
  let navigating=false;
  function go(href){
    if(!href || navigating) return;
    navigating=true;
    if(overlay) overlay.classList.add('active');
    setTimeout(()=>{ location.href=href; }, 620);
  }
  document.querySelectorAll('a[data-page-link]').forEach(a=>{
    a.addEventListener('click',e=>{ e.preventDefault(); go(a.getAttribute('href')); });
  });

  // Auto-advance only after the end marker remains visible, so normal reading isn't interrupted.
  const end=document.querySelector('.page-end-trigger[data-next]');
  if(end && 'IntersectionObserver' in window){
    let timer=0;
    const io=new IntersectionObserver(entries=>{
      const hit=entries.some(e=>e.isIntersecting && e.intersectionRatio>.7);
      clearTimeout(timer);
      if(hit) timer=setTimeout(()=>go(end.dataset.next), 1150);
    },{threshold:[.7]});
    io.observe(end);
  }

  // Final page: rebuild the angel heart from reasons opened on the split pages.
  const layer=document.getElementById('angelHeartLayer');
  if(layer && document.body.classList.contains('final-page')){
    const opened=[...getOpened()].filter(n=>n>=1&&n<=100).sort((a,b)=>a-b);
    const count=opened.length;
    const total=Math.max(count,1);
    if(count){
      layer.innerHTML='';
      opened.forEach((n,i)=>{
        const dot=document.createElement('span');
        dot.className='angel-heart-dot'; dot.dataset.heartIndex=i; dot.textContent='😇';
        dot.style.opacity='0'; dot.style.transform='translate(-50%,-50%) scale(.4)';
        layer.appendChild(dot);
        setTimeout(()=>{dot.style.transition='opacity .45s ease, transform .55s cubic-bezier(.2,.8,.2,1)';dot.style.opacity='1';dot.style.transform='translate(-50%,-50%) scale(1)';},Math.min(i*22,1800));
      });
      function layout(){
        const finale=document.querySelector('.finale-inner'); const phrase=document.querySelector('.final-phrase');
        if(!finale||!phrase) return;
        const fr=finale.getBoundingClientRect(); const pr=phrase.getBoundingClientRect();
        const narrow=innerWidth<=760;
        const cx=narrow? Math.max(fr.width*.72,fr.width-64) : fr.width/2;
        const cy=narrow? (pr.bottom-fr.top)+92 : (pr.bottom-fr.top)+118;
        const sx=narrow?3.5:5.2, sy=narrow?3.4:5.0;
        layer.querySelectorAll('.angel-heart-dot').forEach((dot,i)=>{
          const t=(Math.PI*2*i/total)-Math.PI;
          const x=16*Math.pow(Math.sin(t),3);
          const y=-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t));
          dot.style.left=(cx+x*sx)+'px'; dot.style.top=(cy+y*sy)+'px';
        });
      }
      requestAnimationFrame(layout); addEventListener('resize',()=>requestAnimationFrame(layout),{passive:true});
    }
    const note=document.querySelector('.final-heart-note');
    if(note) note.textContent=count?`Открыто писем: ${count} из 100`:'Сердце будет собираться из ангелочков по мере открытия писем.';
  }
})();

/* Reveal the intro Continue button 30 seconds after the first letter is opened. */
(function(){
  const button=document.getElementById('introContinue');
  if(!button) return;
  let revealTimer=0;

  function resetTimer(){
    clearTimeout(revealTimer);
    button.classList.remove('read-complete');
    if(location.hash!=='#intro') return;
    revealTimer=setTimeout(()=>{
      if(location.hash==='#intro') button.classList.add('read-complete');
    },30000);
  }

  window.addEventListener('hashchange',resetTimer);
  window.addEventListener('load',resetTimer);
})();