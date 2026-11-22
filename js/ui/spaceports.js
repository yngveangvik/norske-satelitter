let activePort = null;
const launchCache = new Map();
function describeSpaceport() {
  const p = spaceports[activePort];
  $("facts").hidden = false;
  $("facts").classList.remove("station-facts");
  $("metrics").hidden = true;
  $("launch-details").hidden = true;
  $("station-details").hidden = true;
  $("port-details").hidden = false;
  $("name").textContent = p.name;
  $("mission").textContent = dataText(p, "location");
  $("owner-label").textContent = t("ui.owner");
  $("owner").textContent = dataText(p, "owner");
  $("operator").textContent = dataText(p, "operator");
  $("operator-row").hidden = false;
  $("portrait").hidden = !p.photo;
  if (p.photo) $("sat-image").src = "media/" + p.photo;
  $("sat-image").alt = p.name;
  $("sat-credit").hidden = !p.photo;
  $("sat-credit").textContent = t("ui.image");
  $("sat-credit").href =
    "https://ll.thespacedevs.com/2.3.0/locations/" + p.locationId + "/";
  $("sat-credit").title = t("ui.photo_name", { name: p.credit });
  $("sat-credit").setAttribute(
    "aria-label",
    t("ui.photo_name", { name: p.credit }),
  );
  $("ownership-source").href = p.source;
  $("epoch").textContent = t("ui.approximate_centre_point");
  $("port-coordinates").textContent = coordinateText(p.lat, p.lon);
  $("port-pads").replaceChildren(
    ...p.pads.map((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      return li;
    }),
  );
  $("port-official").href = p.official;
  $("port-official").textContent = p.official.includes("thespacedevs")
    ? "Kilde: romhavn og ramper"
    : t("ui.spaceport_website");
  renderPortSatellites(p);
  renderNextLaunch(p);
  syncCard();
}
function selectSpaceport(id) {
  clearSatellite(false);
  activePort = id;
  const p = spaceports[id];
  p.visible = true;
  lon = p.lon * radians;
  lat = p.lat * radians;
  target = 1.8;
  norwayFocus = true;
  $("port-details").querySelector("details").open = false;
  setMenu(false);
  setToolsMenu(false);
  describeSpaceport();
  loadNextLaunch(p);
}
function launchDate(item) {
  const d = new Date(item.net);
  if (!Number.isFinite(d.getTime())) return t("ui.time_to_be_determined");
  const precision = item.net_precision?.abbrev;
  if (precision === "Y")
    return t("ui.no_earlier_than_year", { year: d.getUTCFullYear() });
  if (/^Q[1-4]$/.test(precision || ""))
    return t("ui.quarter_quarter_year", {
      quarter: precision.slice(1),
      year: d.getUTCFullYear(),
    });
  if (precision === "M")
    return d.toLocaleDateString(uiLocale(), {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  if (["MIN", "SEC", "HR"].includes(precision))
    return t("ui.date_norwegian_time", {
      date: d.toLocaleString(uiLocale(), {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Oslo",
      }),
    });
  if (precision === "DAY")
    return d.toLocaleDateString(uiLocale(), {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  return t("ui.launch_window_unspecified_see_source");
}
function renderNextLaunch(p) {
  $("upcoming-launch").hidden = !p.showUpcoming;
  $("next-launch").hidden = $("launch-updated").hidden = !p.showUpcoming;
  if (!p.showUpcoming) {
    $("next-launch").textContent = "";
    $("launch-updated").textContent = "";
    return;
  }
  const c = launchCache.get(p.short);
  $("next-launch").textContent = !c
    ? t("ui.loading_next_scheduled_launch")
    : c.error
      ? t(
          "ui.launch_data_could_not_be_retrieved_see_the_official_launch_information",
        )
      : c.item
        ? t(
            "ui.next_scheduled_launch_name_date_status_schedule_subject_to_change",
            {
              name: c.item.name,
              date: launchDate(c.item),
              status: c.item.status?.abbrev || t("ui.scheduled"),
            },
          )
        : t("ui.no_upcoming_launch_recorded_in_the_data_source");
  $("launch-updated").textContent = c?.at
    ? t("ui.retrieved_date_launch_library_2", {
        date: new Date(c.at).toLocaleString(uiLocale(), {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          timeZone: "Europe/Oslo",
        }),
      })
    : "";
}
async function loadNextLaunch(p) {
  if (!p.showUpcoming) return;
  let c = launchCache.get(p.short);
  if (c && Date.now() - c.at < 15 * 60 * 1000) return;
  try {
    const response = await fetch(
      "https://ll.thespacedevs.com/2.3.0/launches/upcoming/?location__ids=" +
        p.locationId +
        (p.padIds ? "&pad__ids=" + p.padIds.join(",") : "") +
        "&limit=5&ordering=net&hide_recent_previous=true&format=json",
      { signal: AbortSignal.timeout(10000) },
    );
    if (!response.ok) throw new Error("Launch API " + response.status);
    const data = await response.json();
    if (!Array.isArray(data.results)) throw new Error("Invalid response");
    const item = data.results.find(
      (x) =>
        x.pad?.location?.id === p.locationId &&
        (!p.padIds || p.padIds.includes(x.pad.id)) &&
        Date.parse(x.net) > Date.now() &&
        ![3, 4, 7].includes(x.status?.id),
    );
    launchCache.set(p.short, { item: item || null, at: Date.now() });
  } catch {
    launchCache.set(p.short, { error: true, at: Date.now() });
  }
  if (activePort && spaceports[activePort] === p) renderNextLaunch(p);
}
setInterval(() => {
  if (activePort) loadNextLaunch(spaceports[activePort]);
}, 60000);

function renderPortSatellites(port) {
  const list = $("port-satellites");
  list.replaceChildren();
  for (const sat of fleet.filter(
    (s) =>
      (launchDetails[s.id]?.place || "").split(",")[0] === port.launchPlace,
  )) {
    const row = document.createElement("li"),
      button = document.createElement("button");
    button.type = "button";
    button.textContent = sat.name;
    button.onclick = () => focusSatellite(sat);
    const detail = document.createElement("span");
    detail.textContent =
      dataText(launchDetails[sat.id], "date") +
      (sat.id < 0 ? " · " + dataText(sat, "mission") : "");
    row.append(button, detail);
    list.append(row);
  }
  if (!list.children.length) {
    const row = document.createElement("li");
    row.textContent = t(
      "ui.no_launches_recorded_for_the_satellites_in_this_viewer",
    );
    list.append(row);
  }
}
