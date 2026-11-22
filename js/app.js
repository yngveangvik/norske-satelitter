const $ = (id) => document.getElementById(id);
let active = null,
  filter = "Alle",
  time = Date.now(),
  rate = 1,
  paused = false,
  clockLive = true;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(37, 1, 0.01, 150);
const mount = $("scene");
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  mount.append(renderer.domElement);
} catch {
  mount.style.background =
    "radial-gradient(circle at center,#302747,transparent 65%)";
  $("mode").textContent = t("ui.3d_view_requires_webgl");
}
const textures = new THREE.TextureLoader();
const dayMap = textures.load("earth.jpg");
const nightMap = textures.load("media/earth-night.png");
dayMap.colorSpace = nightMap.colorSpace = THREE.SRGBColorSpace;
let detailRequested = false;
function loadDayDetail() {
  if (
    detailRequested ||
    !renderer ||
    renderer.capabilities.maxTextureSize < 4096
  )
    return;
  detailRequested = true;
  const size = renderer.capabilities.maxTextureSize >= 8192 ? "8k" : "4k";
  textures.load("media/earth-day-" + size + ".jpg", (map) => {
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    earth.material.uniforms.dayMap.value = map;
  });
}
const sunlight = new THREE.Vector3(1, 0, 0);
const coverageCenter = new THREE.Vector3();
const coverageLimit = { value: 2 };
const coverageTint = { value: new THREE.Color(0x0370bd) };
const sphere = new THREE.SphereGeometry(1, 96, 64);
const earth = new THREE.Mesh(
  sphere,
  new THREE.ShaderMaterial({
    uniforms: {
      dayMap: { value: dayMap },
      nightMap: { value: nightMap },
      sunlight: { value: sunlight },
      coverageCenter: { value: coverageCenter },
      coverageLimit,
      coverageTint,
    },
    vertexShader: `
  varying vec2 mapUv;
  varying vec3 globeNormal;
  void main() {
   mapUv = uv;
   globeNormal = normal;
   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`,
    fragmentShader: `
  uniform sampler2D dayMap;
  uniform sampler2D nightMap;
  uniform vec3 sunlight;
  uniform vec3 coverageCenter;
  uniform float coverageLimit;
  uniform vec3 coverageTint;
  varying vec2 mapUv;
  varying vec3 globeNormal;
  void main() {
   float angle = dot(normalize(globeNormal), sunlight);
   float day = smoothstep(-0.09, 0.13, angle);
   vec3 surface = texture2D(dayMap, mapUv).rgb;
   vec3 lights = texture2D(nightMap, mapUv).rgb;
   vec3 lit = surface * (0.64 + 0.36 * max(angle, 0.0));
   vec3 dark = surface * vec3(0.029, 0.038, 0.060) + lights * 0.75;
   vec3 base = mix(dark, lit, day);
   float edge = dot(normalize(globeNormal), coverageCenter) - coverageLimit;
   float mask = smoothstep(-0.0004, 0.0004, edge);
   float rim = 1.0 - smoothstep(0.0002, 0.0012, abs(edge));
   gl_FragColor = vec4(mix(base, coverageTint, clamp(mask * 0.12 + rim * 0.16,0.0,1.0)), 1.0);
   #include <colorspace_fragment>
  }`,
  }),
);
scene.add(earth);

// Passive pushbroom field of view: a cross-track line, never an emitted pulse.
const scanSegments = 48;
const scanPositions = new Float32Array(scanSegments * 9);
const scanGeometry = new THREE.BufferGeometry();
scanGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(scanPositions, 3),
);
const scanBeam = new THREE.Mesh(
  scanGeometry,
  new THREE.MeshBasicMaterial({
    color: 0xff2638,
    transparent: true,
    opacity: 0.09,
    depthWrite: false,
    side: THREE.DoubleSide,
  }),
);
scanBeam.visible = false;
scanBeam.frustumCulled = false;
scene.add(scanBeam);
const scanLineGeometry = new THREE.BufferGeometry();
const scanLinePositions = new Float32Array((scanSegments + 1) * 3);
scanLineGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(scanLinePositions, 3),
);
const scanLine = new THREE.Line(
  scanLineGeometry,
  new THREE.LineBasicMaterial({
    color: 0xff2638,
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
  }),
);
scanLine.visible = false;
scanLine.frustumCulled = false;
scene.add(scanLine);
function updateScan() {
  scanBeam.visible = scanLine.visible =
    viewMode === "coverage" &&
    payload === "hypso" &&
    Boolean(active?.marker.visible);
  if (!scanBeam.visible) return;
  const apex = active.marker.position;
  const axis = apex.clone().normalize();
  const later = new Date(time + 1000);
  const next = satellite.propagate(active.record, later);
  if (!next.position) {
    scanBeam.visible = scanLine.visible = false;
    return;
  }
  const along = earthVector(
    satellite.eciToEcf(next.position, satellite.gstime(later)),
  )
    .normalize()
    .addScaledVector(axis, -1);
  along.addScaledVector(axis, -along.dot(axis)).normalize();
  const across = new THREE.Vector3().crossVectors(axis, along).normalize();
  // Schematic nadir view, ~70 km swath at 500 km altitude; not live attitude.
  const halfWidth =
    Math.max(0, apex.length() - 1) * Math.tan((4 * Math.PI) / 180);
  for (let i = 0; i <= scanSegments; i++) {
    const angle = ((i / scanSegments) * 2 - 1) * halfWidth;
    const point = axis
      .clone()
      .multiplyScalar(Math.cos(angle))
      .addScaledVector(across, Math.sin(angle))
      .multiplyScalar(1.002);
    point.toArray(scanLinePositions, i * 3);
    if (i < scanSegments) apex.toArray(scanPositions, i * 9);
    if (i < scanSegments) point.toArray(scanPositions, i * 9 + 3);
    if (i > 0) point.toArray(scanPositions, (i - 1) * 9 + 6);
  }
  scanGeometry.attributes.position.needsUpdate = true;
  scanLineGeometry.attributes.position.needsUpdate = true;
}

const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(1.018, 96, 64),
  new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {},
    vertexShader:
      "varying vec3 n; varying vec3 v; void main(){vec4 p=modelViewMatrix*vec4(position,1.);n=normalize(normalMatrix*normal);v=normalize(-p.xyz);gl_Position=projectionMatrix*p;}",
    fragmentShader:
      "varying vec3 n; varying vec3 v; void main(){float g=pow(1.-clamp(dot(normalize(n),normalize(v)),0.,1.),4.);gl_FragColor=vec4(.30,.50,1.,g*.45);}",
  }),
);
scene.add(atmosphere);
const starPoints = [];
for (let i = 0; i < 1300; i++) {
  const z = 1 - (2 * (i + 0.5)) / 1300,
    angle = i * 2.39996323,
    r = Math.sqrt(1 - z * z);
  starPoints.push(65 * r * Math.cos(angle), 65 * z, 65 * r * Math.sin(angle));
}
const stars = new THREE.BufferGeometry();
stars.setAttribute("position", new THREE.Float32BufferAttribute(starPoints, 3));
scene.add(
  new THREE.Points(
    stars,
    new THREE.PointsMaterial({
      color: 0xb4abde,
      size: 0.065,
      transparent: true,
      opacity: 0.65,
    }),
  ),
);
const spriteTexture = textures.load("media/icons/satellite-solid.svg");
spriteTexture.colorSpace = THREE.SRGBColorSpace;
for (const sat of fleet) {
  sat.shown = true;
  sat.marker = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: spriteTexture,
      color: colors[sat.type],
      depthWrite: false,
      alphaTest: 0.08,
    }),
  );
  sat.marker.visible = false;
  sat.marker.userData.sat = sat;
  scene.add(sat.marker);
}
const path = new THREE.Line(
  new THREE.BufferGeometry(),
  new THREE.LineBasicMaterial({
    color: 0xfc8c30,
    transparent: true,
    opacity: 0.88,
  }),
);
const fleetPaths = fleet.map((sat) => {
  const line = new THREE.Line(
    new THREE.BufferGeometry(),
    new THREE.LineBasicMaterial({
      color: colors[sat.type],
      transparent: true,
      opacity: 0.45,
    }),
  );
  line.visible = false;
  scene.add(line);
  return line;
});
let showAllOrbits = true;
scene.add(path);
let lon = 0.24,
  lat = 1.12,
  distance = 3.6,
  target = 3.6,
  orbitDirty = true,
  lastPath = 0;
function resize() {
  if (!renderer) return;
  const { clientWidth: w, clientHeight: h } = mount;
  if (!w || !h) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(mount);
const fmt = (n, digits = 0) =>
  n.toLocaleString(uiLocale(), {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
const epoch = (s) =>
  new Date(/Z$/.test(s.omm.EPOCH) ? s.omm.EPOCH : s.omm.EPOCH + "Z");
function renderList() {
  $("list").replaceChildren();
  const actions = document.createElement("div");
  actions.className = "layer-actions";
  for (const [label, visible] of [
    [t("ui.show_all"), true],
    [t("ui.show_none"), false],
  ]) {
    const button = document.createElement("button");
    button.textContent = label;
    button.setAttribute(
      "aria-pressed",
      fleet.every((s) => Boolean(s.shown) !== visible)
        ? "false"
        : String(fleet.every((s) => Boolean(s.shown) === visible)),
    );
    button.onclick = () => setSatelliteVisibility(visible);
    actions.append(button);
  }
  $("list").append(actions);
  for (const sat of fleet.filter(
    (s) => filter === "Alle" || filter === s.type,
  )) {
    const b = document.createElement("button");
    b.className = "sat";
    b.style.setProperty("--dot", colors[sat.type]);
    b.setAttribute("aria-pressed", sat === active);
    b.innerHTML = '<b aria-hidden="true"></b><span></span><small></small>';
    b.children[1].textContent = sat.name;
    b.children[2].textContent =
      sat.id === -2
        ? t("ui.ended")
        : sat.id === -1
          ? t("ui.no_orbit")
          : sat.type;
    b.onclick = () => focusSatellite(sat);
    $("list").append(b);
  }
}
function setSatelliteVisibility(visible) {
  fleet.forEach((s) => (s.shown = visible));
  if (!visible && active) clearSatellite(false);
  orbitDirty = true;
  renderList();
}
let portraitId;
function describe() {
  if (activePort) {
    describeSpaceport();
    return;
  }
  $("port-details").hidden = true;
  if (activeStation) {
    describeStation();
    return;
  }
  $("facts").classList.remove("station-facts");
  $("metrics").hidden = false;
  $("launch-details").hidden = false;
  $("station-details").hidden = true;
  $("sat-credit").textContent = t("ui.image");
  $("facts").hidden = !active;
  for (const id of ["coverage", "pass-mode", "follow"])
    $(id).disabled = !active || active.id < 0;
  if (!active) {
    syncCard();
    return;
  }
  if (portraitId !== active.id) {
    portraitId = active.id;
    const photo = portraits[active.id];
    $("portrait").hidden = !photo;
    $("sat-credit").hidden = !photo;
    if (photo) {
      $("sat-image").src = "media/" + photo.file + ".webp";
      $("sat-image").alt = dataText(photo, "alt") || active.name;
      $("sat-credit").href = photo.source;
      $("sat-credit").title = dataText(photo, "credit");
      $("sat-credit").setAttribute("aria-label", dataText(photo, "credit"));
    }
  }
  renderLaunch(active.id);
  const org = ownership[active.id];
  $("organization-summary").textContent =
    (org.owner === org.operator ? t("ui.owner_and_operator") : t("ui.owner")) +
    ": " +
    dataText(org, "owner") +
    (org.owner === org.operator
      ? ""
      : " · " + t("ui.operator") + ": " + dataText(org, "operator"));
  $("orbit-health").textContent = active.refreshFailed
    ? t("ui.orbit_refresh_failed")
    : active.omm && Date.now() - epoch(active).getTime() > 7 * 86400000
      ? t("ui.orbit_old")
      : "";
  $("owner").textContent = dataText(org, "owner");
  $("operator").textContent = dataText(org, "operator");
  $("ownership-source").href = org.source;
  $("owner-label").textContent =
    org.owner === org.operator ? t("ui.owner_and_operator") : t("ui.owner");
  $("operator-row").hidden = org.owner === org.operator;
  $("name").textContent = active.name;
  $("mission").textContent = dataText(active, "mission");
  $("inc").textContent = active.omm
    ? fmt(active.omm.INCLINATION, 2) + "°"
    : "–";
  $("period").textContent = active.omm
    ? fmt(1440 / active.omm.MEAN_MOTION, 1) + " min"
    : "–";
  $("epoch").textContent = active.omm
    ? t("ui.orbit_epoch_label") +
      epoch(active).toLocaleString(uiLocale(), {
        timeZone: "UTC",
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }) +
      " UTC"
    : t("ui.orbital_data_unavailable");
  syncCard();
}
function clearSatellite(resetCamera = true) {
  cameraFollow = false;
  setFollowState(false);
  activePort = null;
  activeStation = null;
  portraitId = undefined;
  updateStationList();
  releaseFollow();
  active = null;
  configureView("", true);
  if (resetCamera) {
    norwayFocus = false;
    lon = 0.24;
    lat = 1.12;
    target = Math.max(3.6, 3.4 / Math.max(0.45, camera.aspect));
  }
  renderList();
  describe();
}
$("overview").onclick = () => clearSatellite();
$("close-facts").onclick = () => {
  clearSatellite();
  $("menu-toggle").focus({ preventScroll: true });
};

function select(sat) {
  activePort = null;
  activeStation = null;
  portraitId = undefined;
  updateStationList();
  if (active !== sat) {
    configureView("", true);
    coverageFree = false;
    coverageFollow = false;
  }
  if (viewMode !== "pass-mode") norwayFocus = false;
  passKey = "";
  sat.shown = true;
  active = sat;
  target = sat.type === "LEO" ? 3.6 : Math.max(22, 22 / (camera.aspect || 1));
  orbitDirty = true;

  renderList();
  describe();
  explainView();
}
document.querySelectorAll("[data-filter]").forEach(
  (button) =>
    (button.onclick = () => {
      filter = button.dataset.filter;
      document
        .querySelectorAll("[data-filter]")
        .forEach((b) => b.setAttribute("aria-pressed", b === button));
      if (active && filter !== "Alle" && active.type !== filter)
        clearSatellite();
      else renderList();
    }),
);
$("all-orbits").onclick = () => {
  showAllOrbits = !showAllOrbits;
  $("all-orbits").setAttribute("aria-pressed", showAllOrbits);
  orbitDirty = true;
};
function zoom(factor) {
  if (cameraFollow || coverageFollow) {
    followGap = Math.max(0.09, Math.min(10, followGap * factor));
    return;
  }
  target = Math.max(coverageFree ? 0.09 : 1.35, Math.min(48, target * factor));
}
$("plus").onclick = () => zoom(0.8);
$("minus").onclick = () => zoom(1.25);
$("rate").onchange = (e) => {
  rate = Number(e.target.value);
  clockLive = false;
  renderClock();
};
$("pause").onclick = () => {
  clockLive = false;
  paused = !paused;
  $("pause").textContent = paused ? t("ui.play") : t("ui.pause");
};
$("now").onclick = () => {
  clockLive = true;
  time = Date.now();
  rate = 1;
  paused = false;
  orbitDirty = true;
  $("rate").value = "1";
  $("pause").textContent = t("ui.pause");
};
const ray = new THREE.Raycaster();
const pointers = new Map();
let tap = null;
function releaseFollow() {
  if (!cameraFollow && !coverageFollow) return;
  cameraFollow = false;
  setFollowState(false);
  if (viewMode === "coverage") {
    // Release only the camera: keep payload effects and their controls active.
    coverageFollow = false;
    coverageFree = true;
    coveragePivot.copy(look);
    const offset = camera.position.clone().sub(coveragePivot);
    target = distance = offset.length();
    const radial = offset.normalize();
    lon = Math.atan2(-radial.z, radial.x);
    lat = Math.asin(Math.max(-1, Math.min(1, radial.y)));
    return;
  }
  const radial = camera.position.clone().normalize();
  configureView("", true);
  lon = Math.atan2(-radial.z, radial.x);
  lat = Math.asin(radial.y);
  target = distance = camera.position.length() || 3.6;
}

function pinchDistance() {
  const [a, b] = pointers.values();
  return Math.hypot(a.x - b.x, a.y - b.y);
}
mount.onpointerdown = (e) => {
  if (!renderer || e.button !== 0) return;
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  tap =
    pointers.size === 1
      ? { id: e.pointerId, x: e.clientX, y: e.clientY }
      : null;
  mount.setPointerCapture(e.pointerId);
};
mount.onpointermove = (e) => {
  const previous = pointers.get(e.pointerId);
  if (!previous) return;
  const before = pointers.size >= 2 ? pinchDistance() : 0;
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pointers.size >= 2) {
    const after = pinchDistance();
    if (before > 0 && after > 0) zoom(before / after);
    return;
  }
  if (tap && Math.hypot(e.clientX - tap.x, e.clientY - tap.y) < 5) return;
  tap = null;
  releaseFollow();
  norwayFocus = false;
  lon -= (e.clientX - previous.x) * 0.006;
  lat = Math.max(-1.55, Math.min(1.55, lat + (e.clientY - previous.y) * 0.006));
};
mount.onpointerup = (e) => {
  if (tap?.id === e.pointerId) {
    const rect = mount.getBoundingClientRect();
    ray.setFromCamera(
      {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: 1 - ((e.clientY - rect.top) / rect.height) * 2,
      },
      camera,
    );
    const hit = ray.intersectObjects([
      earth,
      ...fleet.filter((s) => s.marker.visible).map((s) => s.marker),
    ])[0];
    if (hit?.object.userData.sat) focusSatellite(hit.object.userData.sat);
  }
  pointers.delete(e.pointerId);
  tap = null;
};
mount.onpointercancel = mount.onlostpointercapture = (e) => {
  pointers.delete(e.pointerId);
  if (tap?.id === e.pointerId) tap = null;
};
mount.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    zoom(Math.exp(e.deltaY * 0.001));
  },
  { passive: false },
);
function earthVector(xyz) {
  return new THREE.Vector3(
    xyz.x / 6378.137,
    xyz.z / 6378.137,
    -xyz.y / 6378.137,
  );
}
function replaceLine(line, points) {
  line.geometry.dispose();
  line.geometry = new THREE.BufferGeometry().setFromPoints(points);
}
function buildPath(sat, date, sidereal) {
  const orbit = [];
  if (!sat?.record) return orbit;
  const duration = 86400000 / sat.omm.MEAN_MOTION;
  for (let i = 0; i <= 200; i++) {
    const at = new Date(date.getTime() + (duration * i) / 200);
    const state = satellite.propagate(sat.record, at);
    if (!state?.position) continue;
    orbit.push(earthVector(satellite.eciToEcf(state.position, sidereal)));
  }
  return orbit;
}
function updatePaths(date, sidereal) {
  fleetPaths.forEach((line, index) => {
    const sat = fleet[index];
    line.material.color.set(sat === active ? 0xfc8c30 : colors[sat.type]);
    line.material.opacity = sat === active ? 0.95 : active ? 0.055 : 0.35;
    line.visible = showAllOrbits && sat.shown && Boolean(sat.record);
    if (line.visible) replaceLine(line, buildPath(sat, date, sidereal));
  });
  path.visible = !showAllOrbits && Boolean(active?.record);
  if (path.visible) replaceLine(path, buildPath(active, date, sidereal));
  orbitDirty = false;
  lastPath = time;
}
const center = new THREE.Vector3();
const cameraGoal = new THREE.Vector3();
const look = new THREE.Vector3();
const cameraPosition = new THREE.Vector3();
const direction = new THREE.Vector3();
const goalDirection = new THREE.Vector3();
const rotation = new THREE.Quaternion();
const cameraStep = new THREE.Quaternion();
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
let followGap = 0.3;
function focusSatellite(sat) {
  setMenu(false);
  select(sat);
  if (sat.id < 0) {
    configureView("");
    return;
  }
  cameraFollow = true;
  setFollowState(true);
  followGap = sat.type === "LEO" ? 0.3 : 0.85;
}

let prev = performance.now(),
  lastText = 0;
function frame(real) {
  const elapsed = real - prev;
  if (!paused) time = advanceClock(time, Date.now(), elapsed, rate, clockLive);
  prev = real;
  const date = new Date(time),
    sidereal = satellite.gstime(date);
  const [x, y, z] = satellite.sunPos(satellite.jday(date)).rsun;
  sunlight
    .copy(earthVector(satellite.eciToEcf({ x, y, z }, sidereal)))
    .normalize();
  distance += (target - distance) * 0.09;
  cameraGoal.set(
    distance * Math.cos(lat) * Math.cos(lon),
    distance * Math.sin(lat),
    -distance * Math.cos(lat) * Math.sin(lon),
  );
  center.set(0, 0, 0);
  if (coverageFree) {
    cameraGoal.add(coveragePivot);
    if (cameraGoal.length() < 1.03) cameraGoal.setLength(1.03);
    center.copy(coveragePivot);
  }
  const showText = real - lastText > 150;
  if (orbitDirty || Math.abs(time - lastPath) > Math.max(10000, rate * 180))
    updatePaths(date, sidereal);
  for (const sat of fleet) {
    const visible = sat.record && sat.shown;
    const state = visible ? satellite.propagate(sat.record, date) : null;
    sat.marker.visible = Boolean(state?.position);
    if (state?.position) {
      sat.marker.position.copy(
        earthVector(satellite.eciToEcf(state.position, sidereal)),
      );
    }
    if (sat === active && showText) {
      $("height").textContent = state?.position
        ? fmt(satellite.eciToGeodetic(state.position, sidereal).height) + " km"
        : "–";
      $("speed").textContent = state?.velocity
        ? fmt(
            Math.hypot(state.velocity.x, state.velocity.y, state.velocity.z),
            2,
          ) + " km/s"
        : "–";
    }
  }
  if ((cameraFollow || coverageFollow) && active?.marker.visible) {
    const radius = active.marker.position.length();
    cameraGoal.copy(active.marker.position).setLength(radius + followGap);
    center.copy(active.marker.position).setLength(1);
    if (coverageFollow) {
      // Oblique view: show both the spacecraft and the connection to the ground.
      const radial = active.marker.position.clone().normalize();
      const side = new THREE.Vector3(
        Math.abs(radial.y) > 0.9 ? 1 : 0,
        Math.abs(radial.y) > 0.9 ? 0 : 1,
        0,
      )
        .cross(radial)
        .normalize();
      center.copy(radial).multiplyScalar(1 + (radius - 1) * 0.55);
      const extent = Math.max(0.12, radius - center.length() + followGap);
      cameraGoal
        .copy(center)
        .addScaledVector(radial, extent)
        .addScaledVector(side, extent * 0.85);
    }
  } else if (norwayFocus) {
    center.copy(cameraGoal).normalize().multiplyScalar(0.56);
  }
  const blend = reducedMotion.matches
    ? 1
    : 1 - Math.exp(-Math.min(65, Math.max(0, elapsed)) / 125);
  if (cameraPosition.lengthSq() === 0 || blend === 1) {
    cameraPosition.copy(cameraGoal);
    look.copy(center);
  } else {
    const oldRadius = cameraPosition.length(),
      newRadius = cameraGoal.length();
    direction.copy(cameraPosition).normalize();
    goalDirection.copy(cameraGoal).normalize();
    rotation.setFromUnitVectors(direction, goalDirection);
    cameraStep.identity().slerp(rotation, blend);
    cameraPosition
      .copy(direction.applyQuaternion(cameraStep))
      .multiplyScalar(oldRadius + (newRadius - oldRadius) * blend);
    look.lerp(center, blend);
  }
  camera.position.copy(cameraPosition);
  for (const sat of fleet)
    if (sat.marker.visible) {
      // Pulse brightness in sRGB while preserving the icon's screen size.
      const brightness = reducedMotion.matches
        ? 1
        : 0.76 + 0.24 * (0.5 + 0.5 * Math.sin(real * 0.0021));
      if (sat === active) sat.marker.material.color.set(0xfc8c30);
      else
        sat.marker.material.color.setRGB(
          brightness,
          brightness,
          brightness,
          THREE.SRGBColorSpace,
        );
      sat.marker.scale.setScalar(
        camera.position.distanceTo(sat.marker.position) *
          (sat === active ? 0.022 : 0.015),
      );
    }

  frameCardOffset();
  camera.lookAt(look);
  camera.updateMatrixWorld();
  if (camera.position.length() < 2.95) loadDayDetail();
  positionPlaces();
  positionStations();
  positionWorld();
  updateMobileBrand();
  coverageLimit.value = 2;
  coverageTint.value.set(0x1bb1b0);
  if (
    viewMode === "coverage" &&
    payload === "comms" &&
    arcticPair.includes(active?.id)
  ) {
    coverageCenter.set(0, 1, 0);
    coverageLimit.value = Math.sin(65 * radians);
  } else if (
    viewMode === "coverage" &&
    (payload === "ais" || (payload === "comms" && active?.type === "GEO")) &&
    active?.marker.visible
  ) {
    const elevation = 10 * radians;
    const radius = active.marker.position.length();
    coverageCenter.copy(active.marker.position).normalize();
    coverageLimit.value = Math.cos(
      Math.acos(Math.min(1, Math.cos(elevation) / radius)) - elevation,
    );
  }
  updateScan(real);
  updateInstrumentFX(real);
  if (showText) {
    lastText = real;
    if (viewMode === "pass-mode") explainView();
    renderClock();
  }
  if (renderer) {
    renderer.render(scene, camera);
    if (dayMap.image?.complete && nightMap.image?.complete)
      window.dismissWelcome?.();
  } else {
    window.dismissWelcome?.();
  }
  requestAnimationFrame(frame);
}
function accept(rows) {
  for (const omm of rows) {
    const sat = fleet.find((s) => s.id === Number(omm.NORAD_CAT_ID));
    if (
      !sat ||
      !omm.EPOCH ||
      !(omm.MEAN_MOTION > 0) ||
      sat.omm?.EPOCH >= omm.EPOCH
    )
      continue;
    try {
      sat.record = satellite.json2satrec(omm);
      sat.omm = omm;
    } catch {}
  }
  describe();
  orbitDirty = true;
}
const refreshKey = "norway-orbits-v2";
async function init() {
  try {
    accept(await (await fetch("orbits.json")).json());
  } catch {}
  let cached;
  try {
    cached = JSON.parse(localStorage.getItem(refreshKey));
    if (cached?.rows) accept(cached.rows);
    for (const sat of fleet)
      sat.refreshFailed = Boolean(cached?.failed?.includes(sat.id));
    describe();
  } catch {}
  if (Date.now() - (cached?.attempt || 0) < 7200000) return;
  const initial = fleet.map((s) => s.omm).filter(Boolean);
  const attempt = Date.now();
  try {
    localStorage.setItem(
      refreshKey,
      JSON.stringify({ attempt, rows: initial }),
    );
  } catch {}
  const requested = fleet.filter((s) => s.id > 0);
  requested.forEach((s) => (s.refreshFailed = true));
  const rows = (
    await Promise.allSettled(
      fleet
        .filter((s) => s.id > 0)
        .map(async (sat) => {
          const response = await fetch(
            "https://celestrak.org/NORAD/elements/gp.php?CATNR=" +
              sat.id +
              "&FORMAT=JSON",
            { signal: AbortSignal.timeout(9000) },
          );
          if (!response.ok) {
            sat.refreshFailed = true;
            throw new Error("Banedata utilgjengelig");
          }
          const data = await response.json();
          sat.refreshFailed =
            !Array.isArray(data) ||
            !data.some((row) => Number(row.NORAD_CAT_ID) === sat.id);
          return data;
        }),
    )
  ).flatMap((result) =>
    result.status === "fulfilled" && Array.isArray(result.value)
      ? result.value
      : [],
  );
  accept(rows);
  try {
    localStorage.setItem(
      refreshKey,
      JSON.stringify({
        attempt,
        rows: fleet.map((s) => s.omm).filter(Boolean),
        failed: fleet.filter((s) => s.refreshFailed).map((s) => s.id),
      }),
    );
  } catch {}
}
initializeExploration();
initializeStations();
initializeWorld();
initializeLanguage();
renderList();
describe();
resize();
clearSatellite();
distance = target;
init();
setInterval(init, 7200000);
requestAnimationFrame(frame);

function renderClock() {
  $("clock").textContent =
    new Date(time).toISOString().slice(0, 19).replace("T", " ") + " UTC";
  const simulated = paused || rate !== 1 || Math.abs(time - Date.now()) > 10000;
  $("time-state").textContent = simulated
    ? t("ui.simulation") + (paused ? " · " + t("ui.paused") : "")
    : t("ui.real_time");
  $("time-state").dataset.simulated = String(simulated);
}
