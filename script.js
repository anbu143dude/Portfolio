'use strict';
(() => {
 const root = document.documentElement;
 const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
 const toggle = document.querySelector('.motion-toggle');
 const play = document.querySelector('.showcase-play');
 const tabs = [...document.querySelectorAll('[data-view]')];
 const screens = [...document.querySelectorAll('[data-screen]')];
 const showcase = document.querySelector('.motion-showcase');
 const targets = document.querySelectorAll('.section-title, .projects article, .timeline article, .expertise, .credentials, .contact');
 let enabled = !motion.matches, current = 0, playing = enabled, timer = null, visible = true;
 function selectScreen(index) {
  current = index;
  screens.forEach((screen,i)=>{ screen.hidden=i!==index; screen.classList.toggle('is-current',i===index); });
  tabs.forEach((tab,i)=>tab.setAttribute('aria-pressed',String(i===index)));
 }
 function syncPlayback() {
  clearInterval(timer); timer=null;
  const run=playing&&enabled&&visible&&!document.hidden;
  root.classList.toggle('showcase-running',run);
  play.hidden=false;
  play.disabled=!enabled;
  play.setAttribute('aria-pressed',String(playing&&enabled));
  play.textContent=!enabled?'Motion paused':playing?'Pause showcase':'Play showcase';
  if(run) timer=setInterval(()=>selectScreen((current+1)%screens.length),5200);
 }
 function setMotion(on) {
  enabled=on&&!motion.matches;
  root.classList.toggle('motion-enabled',enabled);
  root.classList.remove('motion-ready');
  targets.forEach(el=>{el.removeAttribute('data-aos');el.classList.remove('aos-init','aos-animate');});
  if(enabled&&window.AOS) {
   try {
    targets.forEach(el=>el.setAttribute('data-aos','fade-up'));
    window.AOS.init({duration:650,offset:35,once:true,mirror:false,easing:'ease-out-cubic'});
    root.classList.add('motion-ready');
   } catch (_) { root.classList.remove('motion-ready'); }
  }
  toggle.hidden=false;
  toggle.disabled=motion.matches;
  toggle.setAttribute('aria-pressed',String(enabled));
  toggle.textContent=motion.matches?'Reduced motion enabled':enabled?'Animations on · Turn off':'Animations off · Turn on';
  if(!enabled) playing=false;
  syncPlayback();
 }
 tabs.forEach((tab,i)=>tab.addEventListener('click',()=>{playing=false;selectScreen(i);syncPlayback();}));
 play.addEventListener('click',()=>{playing=!playing;syncPlayback();});
 toggle.addEventListener('click',()=>{const next=!enabled;playing=next;setMotion(next);});
 if(motion.addEventListener) motion.addEventListener('change',()=>{playing=!motion.matches;setMotion(!motion.matches);});
 document.addEventListener('visibilitychange',syncPlayback);
 if('IntersectionObserver' in window) new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;syncPlayback();},{threshold:.15}).observe(showcase);
 // Keyboard focus pauses automatic changes while the visitor explores controls.
 showcase.addEventListener('focusin',event=>{if(event.target!==play){playing=false;syncPlayback();}});
 document.querySelectorAll('details').forEach(el=>el.addEventListener('toggle',()=>{if(window.AOS)window.AOS.refresh();}));
 setMotion(enabled);
})();
