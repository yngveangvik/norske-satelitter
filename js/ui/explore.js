const radians = Math.PI / 180;
const aisSatellites = new Set([62702, 42826, 42828, 48272, 68454]);
const arcticPair = [60422, 60423];
const modes = ["coverage", "pass-mode"];
let cameraFollow = false;
let viewMode = "",
  nextPass = null,
  passKey = "",
  norwayFocus = false,
  showPlaces = true;
function surfacePoint(lat, lon) {
  const a = lat * radians,
    b = lon * radians;
  return new THREE.Vector3(
    Math.cos(a) * Math.cos(b),
    Math.sin(a),
    -Math.cos(a) * Math.sin(b),
  );
}
function configureView(mode, keepCamera = false) {
  if (!["", "coverage", "pass-mode"].includes(mode))
    throw new Error("Invalid satellite view");
  if (mode && !active) return;
  if (mode) {
    setCardMode(mode === "pass-mode" ? "expanded" : "compact");
    closePads();
  }
  const wasFollowing = cameraFollow || coverageFollow;
  coverageFollow = mode === "coverage";
  coverageFree = false;
  if (mode === "coverage" && !wasFollowing)
    followGap = active.type === "LEO" ? 0.3 : 0.85;
  viewMode = mode;
  norwayFocus = false;
  orbitDirty = true;
  passKey = "";
  modes.forEach((id) => $(id).setAttribute("aria-pressed", id === mode));
  $("view-info").hidden = !["coverage", "pass-mode"].includes(mode);
  $("pass-tools").hidden = mode !== "pass-mode";
  if (mode === "coverage") {
    // Keep the selected satellite under the camera without changing zoom.
  } else if (mode) {
    target =
      active.type === "LEO"
        ? 3.6
        : Math.max(22, 22 / Math.max(0.54, camera.aspect));
    if (mode === "pass-mode") centerPlace();
  } else if (!keepCamera) {
    target =
      !active || active.type === "LEO"
        ? 3.6
        : Math.max(22, 22 / Math.max(0.54, camera.aspect));
  }
  layoutViewInfo();
  explainView();
  setFollowState(cameraFollow || coverageFollow);
}
function centerPlace() {
  const [, a, b] = places[Number($("observer").value)];
  lon = b * radians;
  lat = a * radians;
  target = 3.6;
  norwayFocus = false;
}
function setToolsMenu(open) {
  if (open) setMenu(false);
  const previous = $("explore-toggle").getAttribute("aria-expanded") === "true";
  $("explore-toggle").setAttribute("aria-expanded", open);
  if (open && !previous) enterPanel($("explore-tools"), "Y", -8, 150);
}
function setMenu(open) {
  if (open) setToolsMenu(false);
  const previous = !$("layout").classList.contains("menu-closed");
  $("layout").classList.toggle("menu-closed", !open);
  $("satellittmeny").inert = !open;
  const stations = $("satellittmeny").dataset.catalog === "stations";
  $("menu-toggle").setAttribute("aria-expanded", open && !stations);
  $("stations-menu").setAttribute("aria-expanded", open && stations);
  if (open && !previous)
    enterPanel(
      $("satellittmeny"),
      mobileLayout.matches ? "Y" : "X",
      mobileLayout.matches ? 16 : -16,
    );
}
function initializeExploration() {
  const menu = $("menu-toggle");
  menu.onclick = () => {
    const open = menu.getAttribute("aria-expanded") === "false";
    switchCatalog("satellites");
    setMenu(open);
  };
  const explore = $("explore-toggle");

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (
      menu.getAttribute("aria-expanded") === "true" ||
      $("stations-menu").getAttribute("aria-expanded") === "true"
    ) {
      setMenu(false);
      menu.focus();
    } else if (explore.getAttribute("aria-expanded") === "true") {
      setToolsMenu(false);
      explore.focus();
    } else if (active || activeStation || activePort) $("close-facts").click();
  });
  for (const [id, [name, lat, lon]] of places.entries()) {
    const label = document.createElement("span");
    label.className = "place";
    label.textContent = name;
    $("places").append(label);
    const option = new Option(name, id);
    $("observer").add(option);
    placeLabels.push({ label, position: surfacePoint(lat, lon) });
  }
  $("observer").value = String(places.findIndex((p) => p[0] === "Oslo"));
  $("observer").onchange = () => {
    passKey = "";
    centerPlace();
    explainView();
  };
  $("jump").onclick = () => {
    if (!nextPass) return;
    time = nextPass.peak;
    paused = true;
    clockLive = false;
    $("pause").textContent = t("ui.play");
    orbitDirty = true;
    centerPlace();
    explainView();
  };
  modes.forEach(
    (id) => ($(id).onclick = () => configureView(viewMode === id ? "" : id)),
  );
  $("follow").onclick = () => {
    const enabled = !(cameraFollow || coverageFollow);
    if (!enabled) releaseFollow();
    cameraFollow = enabled;
    if (enabled && viewMode === "coverage") {
      coverageFollow = true;
      coverageFree = false;
    }
    setFollowState(enabled);
  };
  $("place-toggle").onclick = () => {
    showPlaces = !showPlaces;
    $("place-toggle").setAttribute("aria-pressed", showPlaces);
  };
}
const placeLabels = [];
function positionPlaces() {
  const w = mount.clientWidth,
    h = mount.clientHeight,
    occupied = [],
    selected = selectedScreenExclusion();
  for (const [i, { label, position }] of placeLabels.entries()) {
    const p = position.clone().multiplyScalar(1.004).project(camera),
      x = ((p.x + 1) * w) / 2,
      y = ((1 - p.y) * h) / 2;
    const threshold = [0, 2.7, 1.95, 1.48][places[i][3]];
    let visible =
      showPlaces &&
      renderer &&
      camera.position.length() < threshold &&
      position.dot(camera.position) > 1.007 &&
      p.z < 1 &&
      x > 5 &&
      x < w - 20 &&
      y > 5 &&
      y < h - 22;
    if (
      selected &&
      Math.abs(x - selected.x) < 150 &&
      Math.abs(y - selected.y) < 35
    )
      visible = false;
    const width = label.offsetWidth || places[i][0].length * 7 + 12;
    if (
      visible &&
      occupied.some(
        (r) =>
          x < r.x + r.w + 8 && x + width > r.x - 8 && Math.abs(y - r.y) < 22,
      )
    )
      visible = false;
    label.hidden = !visible;
    if (visible) {
      occupied.push({ x, y, w: width });
      label.classList.remove("label-left");
      label.style.transform =
        "translate(" +
        Math.round(Math.min(x + 8, w - width - 5)) +
        "px," +
        Math.round(y - 6) +
        "px)";
    }
  }
}
function findPass(sat, place, from) {
  if (!sat.record) return null;
  const [, lat, lon] = place;
  const observer = {
    latitude: lat * radians,
    longitude: lon * radians,
    height: 0,
  };
  const limit = 10 * radians,
    step = 30000;
  const elevation = (ms) => {
    const at = new Date(ms),
      state = satellite.propagate(sat.record, at);
    return state?.position
      ? satellite.ecfToLookAngles(
          observer,
          satellite.eciToEcf(state.position, satellite.gstime(at)),
        ).elevation
      : -Math.PI;
  };
  const crossing = (a, b, rising) => {
    while (b - a > 1000) {
      const mid = (a + b) / 2;
      if (elevation(mid) >= limit === rising) b = mid;
      else a = mid;
    }
    return b;
  };
  const first = elevation(from);
  let start = first >= limit ? from : null,
    peak = start,
    best = first;
  for (let ms = from + step; ms <= from + 3 * 86400000; ms += step) {
    const next = elevation(ms);
    if (start === null && next >= limit) {
      start = crossing(ms - step, ms, true);
      peak = ms;
      best = next;
    }
    if (start !== null) {
      if (next > best) {
        best = next;
        peak = ms;
      }
      if (next < limit) {
        const end = crossing(ms - step, ms, false);
        let a = Math.max(start, peak - step),
          b = Math.min(end, peak + step);
        while (b - a > 1000) {
          const l = (2 * a + b) / 3,
            r = (a + 2 * b) / 3;
          if (elevation(l) < elevation(r)) a = l;
          else b = r;
        }
        peak = (a + b) / 2;
        return { start, end, peak, elevation: elevation(peak) / radians };
      }
    }
  }
  return start !== null ? { continuous: true } : null;
}
function explainView() {
  const field = $("view-message");
  $("payload-options").hidden = viewMode !== "coverage";
  if (viewMode === "coverage") {
    syncPayload();
    syncContext();
    field.textContent = payloadExplanation();
  }
  if (viewMode === "pass-mode") {
    const place = places[Number($("observer").value)];
    const now = Date.now();
    const key =
      active.id +
      " " +
      active.omm?.EPOCH +
      " " +
      place[0] +
      " " +
      Math.floor(now / 60000);
    if (key !== passKey) {
      passKey = key;
      nextPass = findPass(active, place, now);
    }
    $("jump").disabled = !nextPass || nextPass.continuous;
    if (!nextPass) {
      field.textContent = active.record
        ? t("ui.no_pass_above_10_during_the_next_three_days")
        : t("ui.waiting_for_orbital_data");
      return;
    }
    if (nextPass.continuous) {
      field.textContent = t(
        "ui.name_stays_above_10_elevation_throughout_the_checked_period",
        { name: active.name },
      );
      return;
    }
    const format = new Intl.DateTimeFormat(uiLocale(), {
      timeZone: "Europe/Oslo",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
    const minutes = Math.ceil(Math.max(0, nextPass.start - now) / 60000);
    const when =
      minutes >= 60
        ? t("ui.hours_h_minutes_min", {
            hours: Math.floor(minutes / 60),
            minutes: minutes % 60,
          })
        : minutes + " min";
    field.textContent = t("ui.pass_max_elevation_above_the_horizon", {
      pass: minutes
        ? t("ui.in_when_date_norwegian_time", {
            when,
            date: format.format(nextPass.start),
          })
        : t("ui.pass_in_progress"),
      elevation: Math.round(nextPass.elevation),
    });
  }
}
