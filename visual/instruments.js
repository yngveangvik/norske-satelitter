// Schematic instrument illustrations, independent of live payload operations.
let payload = "ais",
  payloadSat = null,
  coverageFollow = false,
  coverageFree = false;
const coveragePivot = new THREE.Vector3();
function payloads(s) {
  if (!s) return [];
  if (s.id === 62702) return ["ais", "camera"];
  if (s.id === 48272) return ["ais", "radar"];
  if (s.id === 42828) return ["ais", "comms"];
  if (aisSatellites.has(s.id)) return ["ais"];
  if (s.name.startsWith("HYPSO")) return ["hypso", "camera"];
  if ([55015, 55093].includes(s.id)) return ["radar"];
  if (s.type === "GEO" || s.type === "HEO") return ["comms"];
  if (s.id === 100610) return ["solar", "radio"];
  return ["radio"];
}
function syncPayload() {
  const options = payloads(active);
  if (payloadSat !== active?.id) {
    payloadSat = active?.id;
    payload = options[0];
  }
  const bar = $("payload-options");
  bar.hidden = viewMode !== "coverage";
  bar.replaceChildren(
    ...options.map((k) => {
      const b = document.createElement("button");
      b.textContent = payloadLabel(k);
      b.setAttribute("aria-pressed", k === payload);
      b.onclick = () => {
        payload = k;
        explainView();
        syncContext();
      };
      return b;
    }),
  );
}
function payloadExplanation() {
  const text = {
    ais: t("ui.ships_transmit_ais_messages_to_the_satellite"),
    radar: t(
      "ui.the_satellite_receives_signals_from_ships_navigation_radars_it_does_no",
    ),
    camera: t(
      "ui.the_camera_records_light_from_the_surface_the_pyramid_and_footprint_il",
    ),
    hypso: t(
      "ui.the_camera_records_one_narrow_line_at_a_time_the_satellites_motion_bui",
    ),
    comms: t(
      "ui.signals_travel_between_the_ground_and_satellite_in_both_directions_the",
    ),
    solar: t(
      "ui.the_sun_sensor_measures_the_direction_of_the_sun_and_helps_determine_t",
    ),
    radio: t(
      "ui.a_schematic_radio_link_shows_how_the_satellite_sends_experimental_data",
    ),
  };
  return (
    (text[payload] || "") +
    " " +
    t(
      "ui.the_animation_illustrates_how_it_works_rather_than_actual_signals_or_o",
    )
  );
}
let instrumentFX;
function createInstrumentFX() {
  const group = new THREE.Group();
  scene.add(group);
  const color = 0x1bb1b0;
  const links = [],
    dots = [],
    ships = [],
    rings = [];
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#b9fffa";
  ctx.beginPath();
  ctx.moveTo(32, 4);
  ctx.lineTo(46, 24);
  ctx.lineTo(44, 56);
  ctx.lineTo(20, 56);
  ctx.lineTo(18, 24);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#2c2754";
  ctx.fillRect(25, 25, 14, 17);
  const texture = new THREE.CanvasTexture(canvas);
  for (let i = 0; i < 3; i++) {
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(),
        new THREE.Vector3(),
      ]),
      new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.13,
        depthWrite: false,
      }),
    );
    group.add(line);
    links.push(line);
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.0018, 8, 6),
      new THREE.MeshBasicMaterial({ color }),
    );
    group.add(dot);
    dots.push(dot);
    const ship = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
      }),
    );
    ship.scale.setScalar(0.009);
    group.add(ship);
    ships.push(ship);
    const ring = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(
        Array.from({ length: 48 }, () => new THREE.Vector3()),
      ),
      new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.4,
        depthWrite: false,
      }),
    );
    group.add(ring);
    rings.push(ring);
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(36), 3),
  );
  const pyramid = new THREE.Mesh(
    geom,
    new THREE.MeshBasicMaterial({
      color: 0xff2638,
      transparent: true,
      opacity: 0.07,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  );
  group.add(pyramid);
  const footprint = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(
      Array.from({ length: 4 }, () => new THREE.Vector3()),
    ),
    new THREE.LineBasicMaterial({
      color: 0xff2638,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    }),
  );
  group.add(footprint);
  const image = new THREE.Mesh(
    new THREE.BufferGeometry(),
    new THREE.MeshBasicMaterial({
      color: 0xff2638,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  );
  group.add(image);
  instrumentFX = {
    group,
    links,
    dots,
    ships,
    rings,
    pyramid,
    footprint,
    image,
  };
}
function updateInstrumentFX(real) {
  if (!instrumentFX) createInstrumentFX();
  const f = instrumentFX;
  f.group.visible = viewMode === "coverage" && Boolean(active?.marker.visible);
  if (!f.group.visible) return;
  const apex = active.marker.position,
    axis = apex.clone().normalize();
  const u = new THREE.Vector3(
      Math.abs(axis.y) > 0.9 ? 1 : 0,
      Math.abs(axis.y) > 0.9 ? 0 : 1,
      0,
    )
      .cross(axis)
      .normalize(),
    v = new THREE.Vector3().crossVectors(axis, u);
  const optical = payload === "camera",
    hypso = payload === "hypso";
  f.pyramid.visible = f.footprint.visible = optical;
  f.image.visible = optical || hypso;
  const point = (x, y) =>
    axis
      .clone()
      .addScaledVector(u, x)
      .addScaledVector(v, y)
      .normalize()
      .multiplyScalar(1.002);
  if (optical) {
    const corners = [
      point(-0.007, -0.005),
      point(0.007, -0.005),
      point(0.007, 0.005),
      point(-0.007, 0.005),
    ];
    const pos = f.pyramid.geometry.attributes.position.array;
    corners.forEach((p, i) => {
      apex.toArray(pos, i * 9);
      p.toArray(pos, i * 9 + 3);
      corners[(i + 1) % 4].toArray(pos, i * 9 + 6);
    });
    f.pyramid.geometry.attributes.position.needsUpdate = true;
    f.pyramid.frustumCulled = false;
    f.footprint.geometry.setFromPoints(corners);
    f.footprint.frustumCulled = false;
    f.image.geometry.setFromPoints([
      corners[0],
      corners[1],
      corners[2],
      corners[0],
      corners[2],
      corners[3],
    ]);
    f.image.frustumCulled = false;
    f.image.material.opacity = reducedMotion.matches
      ? 0.12
      : 0.08 + 0.15 * Math.pow(Math.max(0, Math.sin(real * 0.0018)), 8);
  }
  if (hypso && scanLine.visible) {
    const left = new THREE.Vector3().fromArray(scanLinePositions, 0),
      right = new THREE.Vector3().fromArray(
        scanLinePositions,
        scanSegments * 3,
      );
    const next = satellite.propagate(active.record, new Date(time + 1000));
    if (next.position) {
      const along = earthVector(
        satellite.eciToEcf(
          next.position,
          satellite.gstime(new Date(time + 1000)),
        ),
      )
        .normalize()
        .sub(axis);
      along.addScaledVector(axis, -along.dot(axis)).normalize();
      const backL = left
          .clone()
          .addScaledVector(along, -0.01)
          .normalize()
          .multiplyScalar(1.002),
        backR = right
          .clone()
          .addScaledVector(along, -0.01)
          .normalize()
          .multiplyScalar(1.002);
      f.image.geometry.setFromPoints([left, right, backR, left, backR, backL]);
      f.image.frustumCulled = false;
      f.image.material.opacity = 0.09;
    }
  }
  for (let i = 0; i < 3; i++) {
    const visible = !optical && !hypso && (payload !== "solar" || i === 0);
    f.links[i].visible = f.dots[i].visible = visible;
    f.ships[i].visible = visible && ["ais", "radar"].includes(payload);
    f.rings[i].visible = visible && payload === "radar";
    if (!visible) continue;
    const start =
      payload === "solar"
        ? apex.clone().addScaledVector(sunlight, 0.18)
        : point((i - 1) * 0.035, 0.015 * (i % 2 ? 1 : -1));
    const end = apex;
    f.links[i].geometry.setFromPoints([start, end]);
    f.links[i].frustumCulled = false;
    let t = reducedMotion.matches
      ? 0.5
      : (real / (1700 + i * 379) + i * 0.31) % 1;
    if (["comms", "radio"].includes(payload) && i % 2) t = 1 - t;
    f.dots[i].position.copy(start).lerp(end, t);
    f.dots[i].material.color.set(payload === "solar" ? 0xfc8c30 : 0x1bb1b0);
    f.ships[i].position.copy(start);
    if (payload === "radar") {
      const r = reducedMotion.matches
        ? 0.01
        : 0.003 + 0.018 * ((real / 2200 + i * 0.33) % 1);
      f.rings[i].geometry.setFromPoints(
        Array.from({ length: 48 }, (_, j) =>
          start
            .clone()
            .addScaledVector(u, r * Math.cos((j * Math.PI) / 24))
            .addScaledVector(v, r * Math.sin((j * Math.PI) / 24))
            .normalize()
            .multiplyScalar(1.003),
        ),
      );
      f.rings[i].frustumCulled = false;
    }
  }
}

function payloadLabel(k) {
  const keys = {
    camera: "ui.camera",
    radar: "ui.radar_detection",
    hypso: "ui.hyperspectral_camera",
    comms: "ui.communications",
    solar: "ui.sun_sensor",
    radio: "ui.radio_link",
  };
  return keys[k] ? t(keys[k]) : "AIS";
}
