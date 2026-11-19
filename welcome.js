(() => {
 const welcome = document.getElementById('welcome');
 const motion = matchMedia('(prefers-reduced-motion: reduce)');
 const started = performance.now();
 const minimumDuration = 1500;
 let seen = false;
 try { seen = sessionStorage.getItem('norge-i-bane-welcome') === 'seen'; } catch {}
 let dismissed = seen || motion.matches;
 let fallback;
 let pendingDismissal;
 function fadeOut() {
  if (dismissed) return;
  dismissed = true;
  clearTimeout(fallback);
  clearTimeout(pendingDismissal);
  welcome.classList.add('welcome-leaving');
  setTimeout(() => { welcome.hidden = true; }, motion.matches ? 0 : 620);
 }
 window.dismissWelcome = () => {
  if (dismissed || pendingDismissal !== undefined) return;
  const remaining = Math.max(0, minimumDuration - (performance.now() - started));
  pendingDismissal = setTimeout(fadeOut, remaining);
 };
 if (dismissed) return;
 welcome.hidden = false;
 try { sessionStorage.setItem('norge-i-bane-welcome', 'seen'); } catch {}
 // A failed asset must never leave the welcome covering the interface.
 fallback = setTimeout(fadeOut, 3500);
 document.addEventListener('keydown', fadeOut, {once: true});
 motion.addEventListener('change', event => {
  if (event.matches) fadeOut();
 });
})();
