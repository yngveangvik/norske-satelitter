function renderLaunch(id) {
  const data = launchDetails[id],
    container = $("launch-details");
  container.replaceChildren();
  if (!data) return;
  for (const [label, key] of [
    [t("ui.launched_utc"), "date"],
    [t("ui.launch_vehicle"), "rocket"],
    [t("ui.launch_site"), "place"],
    [t("ui.design_lifetime"), "lifetime"],
  ]) {
    const row = document.createElement("div"),
      dt = document.createElement("dt"),
      dd = document.createElement("dd");
    dt.textContent = label;
    if (
      key === "date" ||
      (key === "lifetime" && data.lifetime !== "Ikke oppgitt")
    ) {
      const a = document.createElement("a");
      a.href =
        key === "lifetime" ? data.lifeSource || data.source : data.source;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = dataText(data, key);
      a.title =
        key === "lifetime"
          ? t("ui.original_design_lifetime_not_remaining_service_life")
          : t("ui.launch_source");
      dd.append(a);
    } else dd.textContent = dataText(data, key);
    row.append(dt, dd);
    container.append(row);
  }
}
