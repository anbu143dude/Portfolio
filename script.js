'use strict';
(() => {
 const root=document.documentElement;
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 const toggle=document.querySelector('.motion-toggle');
 const nav=document.querySelector('.section-nav');
 const indicator=document.querySelector('.nav-indicator');
 const links=[...nav.querySelectorAll('a')];
 let motion=!preference.matches;
 let observer=null;
 let seen=new WeakSet();
 const targets=[...document.querySelectorAll('.impact,.panel,.contact-bar')];
 function positionIndicator(link){
  indicator.style.width=link.offsetWidth+'px';
  indicator.style.height=link.offsetHeight+'px';
  indicator.style.transform='translateX('+link.offsetLeft+'px)';
  nav.classList.add('nav-ready');
 }
 function activate(link){
  links.forEach(a=>a.removeAttribute('aria-current'));
  link.setAttribute('aria-current','location');
  positionIndicator(link);
 }
 links.forEach(link=>link.addEventListener('click',()=>activate(link)));
 function fromHash(){const link=links.find(a=>a.hash===location.hash);if(link)activate(link);}
 window.addEventListener('hashchange',fromHash);
 window.addEventListener('resize',()=>positionIndicator(nav.querySelector('[aria-current]')||links[0]));
 if(document.fonts)document.fonts.ready.then(()=>positionIndicator(nav.querySelector('[aria-current]')||links[0]));
 function setMotion(on){
  motion=on&&!preference.matches;
  root.classList.toggle('motion-enabled',motion);
  root.classList.remove('motion-ready');
  targets.forEach(el=>{el.removeAttribute('data-aos');el.removeAttribute('data-aos-delay');el.classList.remove('aos-init','aos-animate');});
  if(observer) observer.disconnect();
  targets.forEach(el=>el.getAnimations().forEach(animation=>animation.cancel()));
  seen=new WeakSet();
  if(motion && 'IntersectionObserver' in window){
   observer=new IntersectionObserver(entries=>{
    let stagger=0;
    entries.forEach(entry=>{
     if(!entry.isIntersecting || seen.has(entry.target))return;
     seen.add(entry.target);
     observer.unobserve(entry.target);
     if(typeof entry.target.animate!=='function')return;
     entry.target.animate(
      [{transform:'translateY(22px) scale(.985)',opacity:.82},
       {transform:'translateY(0) scale(1)',opacity:1}],
      {duration:620,delay:Math.min(stagger++,3)*85,easing:'cubic-bezier(.2,.8,.2,1)'}
     );
    });
   },{threshold:0.01});
   targets.forEach(el=>observer.observe(el));
  }
  toggle.hidden=false;
  toggle.disabled=preference.matches;
  toggle.setAttribute('aria-pressed',String(motion));
  toggle.textContent=preference.matches?'Reduced motion':motion?'Motion on':'Motion off';
  indicator.style.transition=motion?'':'none';
 }
 toggle.addEventListener('click',()=>setMotion(!motion));
 preference.addEventListener('change',()=>setMotion(!preference.matches));
 document.querySelectorAll('details').forEach(detail=>detail.addEventListener('toggle',()=>{
  const body=detail.querySelector('.detail-body');
  if(detail.open&&motion&&body.animate)body.animate([{opacity:0,transform:'translateY(-8px)'},{opacity:1,transform:'translateY(0)'}],{duration:340,easing:'cubic-bezier(.2,.8,.2,1)'});

 }));
 positionIndicator(links[0]);fromHash();setMotion(motion);
})();
