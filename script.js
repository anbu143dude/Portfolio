'use strict';
(() => {
 const root=document.documentElement;
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 const toggle=document.querySelector('.motion-toggle');
 const nav=document.querySelector('.section-nav');
 const indicator=document.querySelector('.nav-indicator');
 const links=[...nav.querySelectorAll('a')];
 let motion=!preference.matches;
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
  if(motion&&window.AOS){
   try{
    targets.forEach((el,i)=>{el.setAttribute('data-aos','fade-up');el.setAttribute('data-aos-delay',String(i<3?i*85:0));});
    window.AOS.init({duration:600,offset:20,once:true,easing:'ease-out-cubic'});
    root.classList.add('motion-ready');
   }catch(_){root.classList.remove('motion-ready');}
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
  if(window.AOS)window.AOS.refresh();
 }));
 positionIndicator(links[0]);fromHash();setMotion(motion);
})();
