let activeStation = null,
  showStations = false;
function switchCatalog(type) {
  const stations = type === "stations";
  $("sat-catalog").hidden = stations;
  $("station-catalog").hidden = !stations;
  $("satellittmeny").dataset.catalog = type;
}
function describeStation() {
  const s = activeStation,
    c = stationCategories[s.category];
  $("facts").hidden = false;
  $("facts").classList.add("station-facts");
  $("port-details").hidden = true;
  $("metrics").hidden = true;
  $("launch-details").hidden = true;
  $("station-details").hidden = false;
  $("name").textContent = s.name;
  $("mission").textContent = dataText(c, "function");
  $("owner-label").textContent = t("ui.owner");
  $("owner").textContent = dataText(c, "owner");
  $("operator-row").hidden = true;
  $("ownership-source").href = c.source;
  $("station-coordinates").textContent = coordinateText(
    s.latitude,
    s.longitude,
  );
  $("epoch").textContent = t("ui.approximate_map_location");
  $("portrait").hidden = false;
  $("sat-image").src = s.photo || "media/station-illustration.svg";
  $("sat-image").alt = s.photo
    ? t("ui.ground_station_at_name", { name: s.name })
    : t("ui.illustration_of_a_ground_station_antenna");
  $("sat-credit").hidden = false;
  $("sat-credit").textContent = s.photo ? "Bilde" : t("ui.illustration");
  $("sat-credit").href = s.photoSource || "media/station-illustration.svg";
  $("sat-credit").title =
    dataText(s, "photoCredit") ||
    t("ui.schematic_illustration_not_a_photograph_of_the_facility");
  syncCard();
}
function selectStation(s) {
  clearSatellite(false);
  activeStation = s;
  s.visible = true;
  showStations = true;
  updateStationList();
  lon = s.longitude * radians;
  lat = s.latitude * radians;
  target = 1.8;
  norwayFocus = true;
  describeStation();
  setMenu(false);
}
function updateStationList() {
  $("station-none").setAttribute(
    "aria-pressed",
    groundStations.every((s) => !s.visible),
  );
  $("station-all").setAttribute(
    "aria-pressed",
    groundStations.every((s) => s.visible),
  );
  for (const s of groundStations) {
    if (s.button) s.button.setAttribute("aria-pressed", s === activeStation);
  }
}
function setStationVisibility(visible) {
  groundStations.forEach((s) => (s.visible = visible));
  showStations = visible;
  if (!visible && activeStation) clearSatellite(false);
  updateStationList();
}
function initializeStations() {
  $("stations-menu").onclick = () => {
    const open = $("stations-menu").getAttribute("aria-expanded") !== "true";
    switchCatalog("stations");
    setMenu(open);
  };
  $("station-none").onclick = () => setStationVisibility(false);
  $("station-all").onclick = () => setStationVisibility(true);
  for (const [name, c] of Object.entries(stationCategories)) {
    const group = document.createElement("section");
    group.className = "station-group";
    group.style.setProperty("--station-color", c.color);
    const heading = document.createElement("h3");
    heading.textContent = name;
    group.append(heading);
    for (const s of groundStations.filter((s) => s.category === name)) {
      const row = document.createElement("div");
      row.className = "station-row";
      const b = document.createElement("button");
      b.className = "sat";
      b.style.setProperty("--dot", c.color);
      b.innerHTML = '<b aria-hidden="true"></b><span></span>';
      b.lastChild.textContent = s.name;
      b.setAttribute("aria-pressed", "false");
      b.onclick = () => selectStation(s);
      s.button = b;
      row.append(b);
      group.append(row);
      const marker = document.createElement("button");
      marker.className = "ground-marker";
      marker.style.setProperty("--station-color", c.color);
      marker.innerHTML = '<i aria-hidden="true"></i><span></span>';
      marker.lastChild.textContent = s.name;
      marker.setAttribute(
        "aria-label",
        t("ui.open_ground_station_name", { name: s.name }),
      );
      marker.onclick = () => selectStation(s);
      $("places").append(marker);
      s.marker = marker;
      s.position = surfacePoint(s.latitude, s.longitude);
    }
    $("station-list").append(group);
  }
}
function positionStations() {
  const w = mount.clientWidth,
    h = mount.clientHeight,
    occupied = [];
  const ordered = [...groundStations].sort(
    (a, b) => (b === activeStation) - (a === activeStation),
  );
  for (const s of ordered) {
    const v = s.position.clone().multiplyScalar(1.004).project(camera),
      x = ((v.x + 1) * w) / 2,
      y = ((1 - v.y) * h) / 2;
    const visible =
      showStations &&
      s.visible &&
      renderer &&
      s.position.dot(camera.position) > 1.007 &&
      v.z < 1 &&
      x > 10 &&
      x < w - 10 &&
      y > 12 &&
      y < h - 12;
    s.marker.hidden = !visible;
    if (!visible) continue;
    s.marker.style.transform =
      "translate(" + Math.round(x) + "px," + Math.round(y) + "px)";
    const overlap = occupied.some(
      (p) => Math.abs(p.x - x) < 100 && Math.abs(p.y - y) < 24,
    );
    s.marker.classList.toggle("icon-only", overlap);
    s.marker.classList.toggle("selected", s === activeStation);
    s.marker.classList.toggle("align-left", x > w - 110);
    if (!overlap) occupied.push({ x, y });
  }
}

function renderStationLanguage() {
  for (const [index, name] of Object.keys(stationCategories).entries()) {
    const heading = $("station-list").children[index]?.querySelector("h3");
    if (heading)
      heading.textContent =
        name === "Forsvaret"
          ? t("ui.norwegian_armed_forces")
          : name === "Kartverket"
            ? t("ui.norwegian_mapping_authority")
            : name;
  }
  for (const s of groundStations)
    s.marker.setAttribute(
      "aria-label",
      t("ui.open_ground_station_name", { name: s.name }),
    );
}
