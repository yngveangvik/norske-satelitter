let cardIdentity = "",
  selectedLabel;
let cardState = { layout: "compact" };
const mobileLayout = matchMedia(
  "(max-width:720px), (orientation:portrait) and (max-width:1024px)",
);
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
function setCardMode(mode) {
  if (mode === "minimized" && active) return;
  if (
    mode === "compact" &&
    cardState.layout === "expanded" &&
    viewMode === "pass-mode"
  )
    configureView("", true);
  if (mode === "expanded") {
    if (coverageFollow) cameraFollow = true;
    configureView("", true);
  }
  closePads();
  $("orbit-context-info").hidden = true;
  $("orbit-context").setAttribute("aria-expanded", "false");
  cardState = reduceCardState(cardState, { type: "layout", layout: mode });
  renderCardLayout();
}
function renderCardLayout() {
  const expanded = cardState.layout === "expanded",
    f = $("facts");
  f.dataset.size = cardState.layout;
  $("more-info").setAttribute("aria-expanded", expanded);
  $("more-info").setAttribute("aria-pressed", expanded);
  $("card-extra").hidden = !expanded;
  $("card-restore").hidden = cardState.layout !== "minimized";
  $("card-restore").textContent = $("name").textContent + " · ⌃";
  updateControlClearance();
  enterPanel(
    f,
    mobileLayout.matches ? "Y" : "X",
    mobileLayout.matches ? 22 : 12,
    200,
  );
}
function syncCard() {
  const identity = active
    ? "s" + active.id
    : activeStation
      ? "g" + activeStation.name
      : activePort
        ? "p" + activePort
        : "";
  if (identity !== cardIdentity) {
    closePads();
    cardIdentity = identity;
    setCardMode("compact");
    if (identity) setToolsMenu(false);
  }
  document.body.classList.toggle("has-selection", Boolean(identity));
  document.querySelector(".status").hidden = !active;
  $("sat-actions").hidden = !active;
  $("pass-mode").hidden = !active;
  const back = $("card-overview");
  if (active) $("sat-actions").insertBefore(back, $("follow"));
  else $("facts").insertBefore(back, $("card-actions"));
  $("view-info").hidden =
    !active || !["coverage", "pass-mode"].includes(viewMode);
  $("pads-toggle").hidden = !activePort;
  $("upcoming-launch").hidden =
    !activePort || !spaceports[activePort]?.showUpcoming;
  setFollowState(cameraFollow || coverageFollow);
  $("card-handle").hidden = Boolean(active);
  $("organization-summary").hidden = !active;
  $("orbit-health").hidden = !active;
  syncContext();
  $("facts").dataset.kind = active
    ? "satellite"
    : activePort
      ? "port"
      : "station";
  updateControlClearance();
  $("card-restore").textContent = $("name").textContent + " · ⌃";
}
function initializeWorld() {
  const f = $("facts");
  const orbitButton = document.createElement("button");
  orbitButton.id = "orbit-context";
  orbitButton.setAttribute("aria-expanded", "false");
  f.querySelector(".fact-heading>div").append(orbitButton);
  const explanation = document.createElement("section");
  explanation.id = "orbit-context-info";
  explanation.hidden = true;
  f.append(explanation);
  orbitButton.onclick = () => {
    const open = explanation.hidden;
    setCardMode("compact");
    configureView("", true);
    closePads();
    explanation.hidden = !open;
    orbitButton.setAttribute("aria-expanded", open);
  };
  const back = document.createElement("button");
  back.id = "card-overview";
  back.textContent = t("ui.show_globe");
  back.onclick = () => (active ? showSelectedGlobe() : clearSatellite());
  f.append(back);
  const state = document.createElement("span");
  state.id = "time-state";
  state.textContent = t("ui.real_time");
  $("clock").append(state);
  const catalogClose = document.createElement("button");
  catalogClose.className = "panel-close";
  catalogClose.textContent = "×";
  catalogClose.setAttribute("aria-label", t("ui.close_object_menu"));
  catalogClose.onclick = () => setMenu(false);
  $("satellittmeny").prepend(catalogClose);
  const handle = document.createElement("button");
  handle.id = "card-handle";
  handle.type = "button";
  handle.setAttribute("aria-label", t("ui.minimise_information_card"));
  handle.textContent = "⌄";
  f.prepend(handle);
  handle.onclick = () => setCardMode("minimized");
  const restore = document.createElement("button");
  restore.id = "card-restore";
  restore.hidden = true;
  f.append(restore);
  restore.onclick = () => setCardMode("compact");
  const extra = document.createElement("div");
  extra.id = "card-extra";
  extra.hidden = true;
  extra.append(
    $("organizations"),
    $("launch-details"),
    f.querySelector(".fact-footnote"),
  );
  f.append(extra);
  const actions = document.createElement("div");
  actions.id = "sat-actions";
  actions.append($("coverage"), $("pass-mode"), $("follow"));
  f.insertBefore(actions, extra);
  f.insertBefore($("view-info"), extra);
  const more = document.createElement("button");
  more.id = "more-info";
  more.textContent = t("ui.more_information");
  more.setAttribute("aria-expanded", "false");
  more.onclick = () =>
    setCardMode(cardState.layout === "expanded" ? "compact" : "expanded");
  f.insertBefore(more, extra);
  const padPanel = $("port-details").querySelector("details");
  padPanel.id = "pads-panel";
  padPanel.hidden = true;
  padPanel.querySelector("summary").hidden = true;
  const padButton = document.createElement("button");
  padButton.id = "pads-toggle";
  padButton.type = "button";
  padButton.textContent = t("ui.launch_pads");
  padButton.setAttribute("aria-expanded", "false");
  padButton.setAttribute("aria-pressed", "false");
  padButton.setAttribute("aria-controls", "pads-panel");
  padButton.onclick = () => {
    const open = !padPanel.open;
    setCardMode("compact");
    padPanel.open = open;
    padPanel.hidden = !open;
    padButton.setAttribute("aria-expanded", open);
    padButton.setAttribute("aria-pressed", open);
  };
  const grid = document.createElement("div");
  grid.id = "card-actions";
  f.insertBefore(grid, actions);
  grid.append(actions, padButton, more);
  const upcoming = document.createElement("div");
  upcoming.id = "upcoming-launch";
  upcoming.append($("next-launch"), $("launch-updated"));
  extra.prepend(upcoming);
  let startY = null,
    dragged = false;
  handle.onpointerdown = (e) => {
    startY = e.clientY;
    dragged = false;
    handle.setPointerCapture(e.pointerId);
  };
  handle.onpointermove = (e) => {
    if (
      active ||
      startY === null ||
      !matchMedia(
        "(max-width:720px), (orientation:portrait) and (max-width:1024px)",
      ).matches
    )
      return;
    const offset = Math.max(0, e.clientY - startY);
    if (offset > 5) dragged = true;
    f.style.transform = "translateY(" + offset + "px)";
  };
  handle.onpointerup = (e) => {
    const offset = startY === null ? 0 : e.clientY - startY;
    f.style.transform = "";
    if (!active && offset > 35) setCardMode("minimized");
    startY = null;
  };
  handle.onpointercancel = () => {
    startY = null;
    f.style.transform = "";
  };
  handle.onclick = () => {
    if (!dragged) setCardMode("minimized");
    dragged = false;
  };
  for (const [id, p] of Object.entries(spaceports)) {
    const marker = document.createElement("button");
    marker.className = "ground-marker port-marker";
    marker.innerHTML = '<i aria-hidden="true"></i><span></span>';
    marker.lastChild.textContent = p.short;
    marker.setAttribute(
      "aria-label",
      t("ui.open_spaceport_name", { name: p.short }),
    );
    marker.onclick = () => selectSpaceport(id);
    $("places").append(marker);
    p.marker = marker;
    p.position = surfacePoint(p.lat, p.lon);
  }
  const nav = document.createElement("nav");
  nav.id = "object-nav";
  nav.setAttribute("aria-label", t("ui.objects_on_the_globe"));
  document.body.append(nav);
  const media = mobileLayout;
  const tools = $("explore-tools");
  function group(id, title, ids) {
    const section = document.createElement("section");
    section.className = "menu-group";
    section.id = id;
    const heading = document.createElement("h3");
    heading.textContent = title;
    section.append(heading);
    for (const key of ids) section.append($(key));
    tools.append(section);
    return section;
  }
  group("menu-views", t("ui.view"), ["overview"]);
  group("menu-layers", t("ui.display"), ["place-toggle", "all-orbits"]);
  const objectGroup = group("menu-objects", t("ui.objects_on_the_globe"), []);
  const timeGroup = group("menu-time", t("ui.time"), []);
  function arrange() {
    const parent = media.matches ? objectGroup : nav;
    for (const id of ["menu-toggle", "stations-menu"]) parent.append($(id));
    objectGroup.hidden = !media.matches;
    $("header-actions").append($("explore"));
    const stage = $("stage"),
      timebar = document.querySelector(".timebar"),
      zoom = document.querySelector(".view-controls");
    (media.matches ? timeGroup : stage).append(timebar);
    stage.append(zoom);
    (media.matches ? timeGroup : stage).append($("clock"));
    (media.matches ? timeGroup : stage).append($("time-state"));
    extra.prepend($("pass-mode"));
    if (active) actions.insertBefore(back, $("follow"));
    else f.insertBefore(back, grid);
    layoutViewInfo();
    timeGroup.hidden = !media.matches;
    if (active && cardState.layout === "minimized") setCardMode("compact");
    updateControlClearance();
  }
  new ResizeObserver(updateControlClearance).observe(f);
  media.addEventListener("change", arrange);
  arrange();
  $("place-toggle").textContent = t("ui.place_names");
  $("explore-toggle").onclick = () => {
    setToolsMenu($("explore-toggle").getAttribute("aria-expanded") !== "true");
  };
  document.addEventListener("pointerdown", (e) => {
    if (!e.target.closest("#explore")) setToolsMenu(false);
    if (!e.target.closest("#satellittmeny,#menu-toggle,#stations-menu"))
      setMenu(false);
  });
  for (const id of ["overview"])
    $(id).addEventListener("click", () => setToolsMenu(false));
  $("card-handle").innerHTML =
    '<span class="drag-grip"></span><span aria-hidden="true">⌄</span>';
  installPanelKeyboard();
  selectedLabel = document.createElement("div");
  selectedLabel.id = "selected-satellite";
  selectedLabel.innerHTML = "<i></i><span></span>";
  $("places").append(selectedLabel);
  syncCard();
}
function positionWorld() {
  const w = mount.clientWidth,
    h = mount.clientHeight,
    occupied = [];
  for (const [id, p] of Object.entries(spaceports).sort(
    (a, b) => (b[0] === activePort) - (a[0] === activePort),
  )) {
    if (!p.marker) continue;
    const v = p.position.clone().multiplyScalar(1.004).project(camera),
      x = ((v.x + 1) * w) / 2,
      y = ((1 - v.y) * h) / 2;
    const visible =
      p.visible &&
      renderer &&
      p.position.dot(camera.position) > 1.007 &&
      v.z < 1 &&
      x > 10 &&
      x < w - 10 &&
      y > 10 &&
      y < h - 10;
    p.marker.hidden = !visible;
    if (!visible) continue;
    p.marker.style.transform = "translate(" + x + "px," + y + "px)";
    p.marker.classList.toggle("selected", id === activePort);
    p.marker.classList.toggle(
      "icon-only",
      id !== activePort &&
        (camera.position.length() > 2.5 ||
          occupied.some(
            (q) => Math.abs(q.x - x) < 110 && Math.abs(q.y - y) < 25,
          )),
    );
    p.marker.classList.toggle("align-left", x > w - 130);
    occupied.push({ x, y });
  }
  if (!selectedLabel) return;
  const visible = Boolean(active?.marker.visible);
  selectedLabel.hidden = !visible;
  if (!visible) return;
  const pos = active.marker.position,
    dir = pos.clone().sub(camera.position),
    raydir = dir.clone().normalize(),
    near = -camera.position.dot(raydir),
    closest = camera.position
      .clone()
      .addScaledVector(raydir, Math.max(0, near));
  const hidden = near > 0 && near < dir.length() && closest.length() < 1;
  const v = pos.clone().project(camera);
  selectedLabel.hidden =
    hidden || v.z > 1 || Math.abs(v.x) > 1 || Math.abs(v.y) > 1;
  selectedLabel.style.transform =
    "translate(" + ((v.x + 1) * w) / 2 + "px," + ((1 - v.y) * h) / 2 + "px)";
  selectedLabel.lastChild.textContent = active.name;
}

function selectedScreenExclusion() {
  const obj = active?.marker.visible
    ? active.marker.position
    : activeStation?.position || spaceports[activePort]?.position;
  if (!obj) return null;
  const v = obj.clone().project(camera);
  if (v.z > 1) return null;
  return {
    x: ((v.x + 1) * mount.clientWidth) / 2,
    y: ((1 - v.y) * mount.clientHeight) / 2,
  };
}
function frameCardOffset() {
  const f = $("facts"),
    w = mount.clientWidth,
    h = mount.clientHeight;
  if (!w || !h) return;
  let dx = 0,
    dy = 0;
  if (
    !f.hidden &&
    cardState.layout !== "minimized" &&
    cardState.layout !== "expanded"
  ) {
    const mobile = matchMedia(
      "(max-width:720px), (orientation:portrait) and (max-width:1024px)",
    ).matches;
    if (mobile) dy = -Math.min(f.offsetHeight, h * 0.55) / 2;
    else dx = -Math.min(f.offsetWidth + 20, w * 0.45) / 2;
  }
  if (dx || dy) camera.setViewOffset(w, h, -dx, -dy, w, h);
  else if (camera.view?.enabled) camera.clearViewOffset();
}

function closePads() {
  const panel = $("pads-panel"),
    button = $("pads-toggle");
  if (panel) {
    panel.open = false;
    panel.hidden = true;
  }
  if (button) {
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-pressed", "false");
  }
}

function enterPanel(el, axis, amount, duration = 180) {
  if (reduceMotion.matches || el.hidden || !el.animate) return;
  el.animate(
    [
      { opacity: 0, transform: `translate${axis}(${amount}px)` },
      { opacity: 1, transform: "none" },
    ],
    { duration, easing: "cubic-bezier(.2,.7,.3,1)" },
  );
}
function installPanelKeyboard() {
  const mobile = mobileLayout,
    menu = $("satellittmeny"),
    facts = $("facts");
  // Keep keyboard navigation inside the visible full-screen mobile surface.
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Tab" || !mobile.matches) return;
    const panel =
      $("explore-toggle").getAttribute("aria-expanded") === "true"
        ? $("explore")
        : !$("layout").classList.contains("menu-closed")
          ? menu
          : !facts.hidden &&
              cardState.layout !== "minimized" &&
              (!active || cardState.layout === "expanded")
            ? facts
            : null;
    if (!panel) return;
    const items = [
      ...panel.querySelectorAll('button,a[href],select,input,[tabindex="0"]'),
    ].filter((el) => el.getClientRects().length && !el.disabled);
    if (!items.length) return;
    const first = items[0],
      last = items[items.length - 1];
    if (
      e.shiftKey &&
      (!panel.contains(document.activeElement) ||
        document.activeElement === first)
    ) {
      e.preventDefault();
      last.focus();
    } else if (
      !e.shiftKey &&
      (!panel.contains(document.activeElement) ||
        document.activeElement === last)
    ) {
      e.preventDefault();
      first.focus();
    }
  });
}

function syncContext() {
  const b = $("orbit-context"),
    info = $("orbit-context-info");
  if (!b) return;
  b.hidden = !active;
  if (!active) {
    info.hidden = true;
    return;
  }
  const types = {
    LEO: [
      t("ui.low_earth_orbit_leo"),
      t(
        "ui.the_satellite_orbits_below_about_2_000_km_and_typically_takes_around_9",
      ),
      '<ellipse cx="100" cy="60" rx="72" ry="43"/>',
    ],
    GEO: [
      t("ui.geostationary_orbit_geo"),
      t(
        "ui.about_35_786_km_above_the_equator_the_satellite_completes_an_orbit_in_",
      ),
      '<ellipse cx="100" cy="60" rx="80" ry="20"/>',
    ],
    HEO: [
      t("ui.highly_elliptical_orbit_heo"),
      t(
        "ui.an_elongated_orbit_the_satellite_moves_slowest_farthest_from_earth_all",
      ),
      '<ellipse cx="100" cy="60" rx="85" ry="38"/>',
    ],
  };
  const [name, text, shape] = types[active.type] || types.LEO;
  b.textContent = t("ui.name_explanation", { name });
  if (
    info.dataset.type !== active.type ||
    info.dataset.language !== displayLanguage
  ) {
    info.dataset.type = active.type;
    info.dataset.language = displayLanguage;
    info.innerHTML =
      '<svg viewBox="0 0 200 120" role="img"><g fill="none" stroke="#fc8c30" stroke-width="1.5">' +
      shape +
      '</g><circle cx="' +
      (active.type === "HEO" ? 60 : 100) +
      '" cy="60" r="23" fill="#515151"/><text x="100" y="117" text-anchor="middle" fill="#a8a8a8" font-size="10"></text></svg><p></p>';
    info
      .querySelector("svg")
      .setAttribute(
        "aria-label",
        t("ui.simplified_illustration_of_name", { name }),
      );
    info.querySelector("text").textContent = t("ui.schematic_not_to_scale");
    info.lastChild.textContent = text;
  }

  $("coverage").textContent = t("ui.how_satellite_works");
}

const brandMobileLayout = mobileLayout;
function mobileBrandOpacity(zoomDistance, overviewDistance) {
  const start = overviewDistance * 0.45,
    end = overviewDistance * 0.85;
  const t = Math.max(0, Math.min(1, (zoomDistance - start) / (end - start)));
  return t * t * (3 - 2 * t);
}
function updateMobileBrand() {
  const brand = document.querySelector("body>header .brand");
  if (!brand) return;
  let opacity = 1;
  if (brandMobileLayout.matches) {
    const overview = Math.max(3.6, 3.4 / Math.max(0.45, camera.aspect));
    const zoomDistance =
      active?.marker.visible && (cameraFollow || coverageFollow)
        ? camera.position.distanceTo(active.marker.position)
        : camera.position.length();
    opacity = mobileBrandOpacity(zoomDistance, overview);
  }
  brand.style.setProperty("--brand-opacity", opacity.toFixed(3));
  brand.classList.toggle("brand-faded", opacity < 0.01);
}

function renderCardLabels() {
  const labels = {
    "more-info": "ui.more_information",
    "pads-toggle": "ui.launch_pads",
    "card-overview": "ui.show_globe",
  };
  for (const [id, key] of Object.entries(labels)) $(id).textContent = t(key);
  const headings = {
    "menu-views": "ui.view",
    "menu-layers": "ui.display",
    "menu-time": "ui.time",
    "menu-objects": "ui.objects_on_the_globe",
  };
  for (const [id, key] of Object.entries(headings))
    $(id).querySelector("h3").textContent = t(key);
  $("card-handle").setAttribute(
    "aria-label",
    t("ui.minimise_information_card"),
  );
  document
    .querySelector(".panel-close")
    .setAttribute("aria-label", t("ui.close_object_menu"));
  $("language-options").setAttribute("aria-label", t("ui.display_language"));
  for (const p of Object.values(spaceports))
    p.marker.setAttribute(
      "aria-label",
      t("ui.open_spaceport_name", { name: p.short }),
    );
}

function layoutViewInfo() {
  const info = $("view-info"),
    extra = $("card-extra");
  if (viewMode === "pass-mode") extra.insertBefore(info, $("organizations"));
  else $("facts").insertBefore(info, extra);
}
function updateControlClearance() {
  const facts = $("facts");
  const height =
    mobileLayout.matches &&
    !facts.hidden &&
    cardState.layout === "compact" &&
    active
      ? facts.offsetHeight
      : 0;
  document.body.style.setProperty("--card-clearance", height + "px");
}

function showSelectedGlobe() {
  releaseFollow();
  configureView("", true);
  setCardMode("compact");
  norwayFocus = false;
  lon = 0.24;
  lat = 1.12;
  target = Math.max(3.6, 3.4 / Math.max(0.45, camera.aspect));
  setFollowState(false);
}

function setFollowState(enabled) {
  $("follow").setAttribute("aria-pressed", String(Boolean(enabled)));
  $("follow").textContent = t(
    enabled ? "ui.stop_following" : "ui.follow_satellite",
  );
}
