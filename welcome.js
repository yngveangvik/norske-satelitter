(() => {
 const welcome=document.getElementById('welcome');
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 welcome.hidden=false;
 let finished=false;
 function finish(){if(finished)return;finished=true;welcome.classList.add('welcome-leaving');setTimeout(()=>welcome.hidden=true,motion.matches?0:250);}
 // The globe loads concurrently; the orbit completes exactly once.
 window.dismissWelcome=()=>{};
 const orbit=welcome.querySelector('.welcome-orbit');
 orbit.addEventListener('animationend',finish,{once:true});
 setTimeout(finish,motion.matches?700:1250);
 motion.addEventListener('change',event=>{if(event.matches)finish();});
})();
