// No DOM mutation observer: every display string has an explicit message key.
let displayLanguage = "nb";
try {
  displayLanguage =
    localStorage.getItem("norge-language") === "en" ? "en" : "nb";
} catch {}
function uiLocale() {
  return displayLanguage === "en" ? "en-GB" : "nb-NO";
}
function t(key, params = {}) {
  const message = messages[key];
  if (!message) throw new Error("Unknown translation key: " + key);
  return message[displayLanguage].replace(/\{(\w+)\}/g, (_, name) =>
    String(params[name] ?? "{" + name + "}"),
  );
}
function dataText(record, field) {
  return record[field + "Key"] ? t(record[field + "Key"]) : record[field];
}
function coordinateText(lat, lon) {
  return (
    Math.abs(lat).toFixed(4) +
    "° " +
    (lat < 0 ? "S" : "N") +
    " · " +
    Math.abs(lon).toFixed(4) +
    "° " +
    (displayLanguage === "en" ? (lon < 0 ? "W" : "E") : lon < 0 ? "V" : "Ø")
  );
}
function localizeStatic() {
  for (const el of document.querySelectorAll("[data-i18n]"))
    el.textContent = t(el.dataset.i18n);
  for (const attr of ["aria-label", "title", "alt"])
    for (const el of document.querySelectorAll("[data-i18n-" + attr + "]"))
      el.setAttribute(attr, t(el.getAttribute("data-i18n-" + attr)));
}
function setLanguage(language) {
  if (!["nb", "en"].includes(language))
    throw new Error("Unsupported display language");
  displayLanguage = language;
  try {
    localStorage.setItem("norge-language", language);
  } catch {}
  document.documentElement.lang = language;
  localizeStatic();
  for (const logo of document.querySelectorAll(
    "header .brand img,#welcome .welcome-brand>img",
  )) {
    logo.src =
      language === "en" ? "media/agency-en.png" : "media/romdirektoratet.png";
    if (logo.closest("header")) logo.alt = t("ui.norwegian_space_agency");
  }
  document.title = t("ui.norway_in_orbit");
  for (const b of document.querySelectorAll("[data-language]"))
    b.setAttribute("aria-pressed", String(b.dataset.language === language));
  renderList();
  renderStationLanguage();
  portraitId = undefined;
  describe();
  explainView();
  renderCardLabels();
  setFollowState(cameraFollow || coverageFollow);
  renderClock();
}
function initializeLanguage() {
  const section = document.createElement("section");
  section.className = "menu-group";
  section.classList.add("language-group");
  section.innerHTML =
    '<div id="language-options" role="group" data-i18n-aria-label="ui.display_language"><button type="button" lang="nb" data-language="nb" title="Norsk">NO</button><button type="button" lang="en" data-language="en" title="English">EN</button></div>';
  document.getElementById("explore-tools").append(section);
  for (const b of section.querySelectorAll("button"))
    b.onclick = () => setLanguage(b.dataset.language);
  setLanguage(displayLanguage);
}
