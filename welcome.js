(() => {
  const welcome = document.getElementById("welcome");
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const trail = welcome.querySelector(".welcome-trail");
  trail.replaceChildren();
  // Short arc segments fade with age, leaving the strongest trail behind the icon.
  for (let n = 0; n < 90; n++) {
    const arc = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    for (const [key, value] of Object.entries({
      cx: 175,
      cy: 175,
      r: 174,
      pathLength: 100,
    }))
      arc.setAttribute(key, value);
    arc.style.setProperty("--segment", n);
    arc.classList.add("trail-segment");
    trail.append(arc);
  }
  welcome.hidden = false;
  let finished = false;
  function finish() {
    if (finished) return;
    finished = true;
    welcome.classList.add("welcome-leaving");
    setTimeout(() => (welcome.hidden = true), motion.matches ? 0 : 250);
  }
  // The globe loads concurrently; the orbit completes exactly once.
  window.dismissWelcome = () => {};
  const orbit = welcome.querySelector(".welcome-orbit");
  orbit.addEventListener("animationend", finish, { once: true });
  setTimeout(finish, motion.matches ? 700 : 1250);
  motion.addEventListener("change", (event) => {
    if (event.matches) finish();
  });
})();
