'use strict';
(() => {
 const descriptions = [
 'Version-controlled code and peer review form the starting point for a repeatable delivery workflow.',
 'Reusable Terraform modules describe Azure resources and make infrastructure changes consistent and reviewable.',
 'Build pipelines validate changes and promote applications through controlled environments with security and release gates.',
 'Monitoring, logs and automation support troubleshooting, operational visibility and continuous improvement.'
 ];
 const steps = document.querySelectorAll('.flow-step');
 const detail = document.getElementById('stage-detail');
 steps.forEach(button => button.addEventListener('click', () => {
  steps.forEach(step => { const active = step === button; step.classList.toggle('is-active', active); step.setAttribute('aria-pressed', String(active)); });
  detail.textContent = descriptions[Number(button.dataset.stage)];
 }));
 const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
 const toggle = document.querySelector('.motion-toggle');
 const targets = document.querySelectorAll('.section-title, .projects article, .timeline article, .expertise, .credentials, .contact');
 let enabled = !motion.matches;
 function setMotion(on) {
  enabled = on && Boolean(window.AOS);
  document.documentElement.classList.remove('motion-ready');
  targets.forEach(el => { el.removeAttribute('data-aos'); el.classList.remove('aos-init', 'aos-animate'); });
  if (enabled) {
   try {
    targets.forEach(el => el.setAttribute('data-aos', 'fade-up'));
    window.AOS.init({duration:500, offset:35, once:true, mirror:false, easing:'ease-out-cubic', disable:motion.matches});
    document.documentElement.classList.add('motion-ready');
   } catch (_) { enabled=false; document.documentElement.classList.remove('motion-ready'); }
  }
  toggle.setAttribute('aria-pressed', String(enabled));
  toggle.textContent = enabled ? 'Animations on · Turn off' : 'Animations off · Turn on';
 }
 if (window.AOS) { toggle.hidden=false; setMotion(enabled); toggle.addEventListener('click',()=>setMotion(!enabled)); }
 if (motion.addEventListener) motion.addEventListener('change',()=>setMotion(!motion.matches));
 document.querySelectorAll('details').forEach(el=>el.addEventListener('toggle',()=>{if(window.AOS)window.AOS.refresh();}));
})();
