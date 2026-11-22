const launchDetails = {
  62702: {
    date: "14.01.2025",
    place: "Vandenberg, USA",
    rocket: "Falcon 9",
    lifetime: "Ikke oppgitt",
    source:
      "https://romdirektoratet.no/en/aktuelt/successful-launch-for-norways-new-satellite",
  },
  42826: {
    date: "14.07.2017",
    place: "Baikonur, Kasakhstan",
    rocket: "Sojuz-2.1a",
    lifetime: "3 år",
    source: "https://www.pmodwrc.ch/en/research-development/space/norsat-1/",
  },
  42828: {
    date: "14.07.2017",
    place: "Baikonur, Kasakhstan",
    rocket: "Sojuz",
    lifetime: "Ikke oppgitt",
    source: "https://sflmissions.com/missions/legacy-missions/",
  },
  48272: {
    date: "29.04.2021",
    place: "Kourou, Fransk Guyana",
    rocket: "Vega",
    lifetime: "Ikke oppgitt",
    source:
      "https://www.esa.int/Enabling_Support/Space_Transportation/Europe_s_Spaceport/Vega_s_first_launch_this_year",
  },
  68454: {
    date: "Mars 2026",
    place: "Vandenberg, USA",
    rocket: "Falcon 9",
    lifetime: "Ikke oppgitt",
    source:
      "https://spacenorway.com/press-release/space-norways-in-orbit-laboratory-is-now-opened-company-confirms-successful-launch/",
  },
  68490: {
    date: "Mars 2026",
    place: "Vandenberg, USA",
    rocket: "Falcon 9",
    lifetime: "7 år",
    source:
      "https://spacenorway.com/press-release/space-norways-in-orbit-laboratory-is-now-opened-company-confirms-successful-launch/",
    lifeSource:
      "https://spacenorway.com/press-release/space-norway-launches-mimir-1-our-lab-in-space/",
  },
  100610: {
    date: "05.09.2026",
    place: "Andøya, Norge",
    rocket: "Spectrum",
    lifetime: "Ikke oppgitt",
    source: "https://orbitntnu.com/projects/FramSat-1",
  },
  "-1": {
    date: "13.01.2022",
    place: "Cape Canaveral, USA",
    rocket: "Falcon 9",
    lifetime: "5 år",
    source:
      "https://www.ntnu.edu/documents/20587845/621664524/NTNU_AMOS_2021_Scr.pdf",
  },
  "-2": {
    date: "25.05.2022",
    place: "Cape Canaveral, USA",
    rocket: "Falcon 9",
    lifetime: "Ikke oppgitt",
    source: "https://nyheter.ntnu.no/ntnu-satelitt-brant-opp-i-atmosfaeren/",
  },
  60531: {
    date: "16.08.2024",
    place: "Vandenberg, USA",
    rocket: "Falcon 9",
    lifetime: "Ikke oppgitt",
    source: "https://www.ntnu.edu/smallsat",
  },
  55015: {
    date: "03.01.2023",
    place: "Cape Canaveral, USA",
    rocket: "Falcon 9",
    lifetime: "Ikke oppgitt",
    source:
      "https://www.ffi.no/aktuelt/nyheter/na-er-birkeland-og-huygens-i-bane",
  },
  55093: {
    date: "03.01.2023",
    place: "Cape Canaveral, USA",
    rocket: "Falcon 9",
    lifetime: "Ikke oppgitt",
    source:
      "https://www.ffi.no/aktuelt/nyheter/na-er-birkeland-og-huygens-i-bane",
  },
  60422: {
    date: "12.08.2024",
    place: "Vandenberg, USA",
    rocket: "Falcon 9",
    lifetime: "15 år",
    source:
      "https://spacenorway.com/press-release/space-norway-confirms-the-successful-launch-of-asbm-satellites/",
    lifeSource:
      "https://spacenorway.com/infrastructure/satellite-fleet/asbm-1-asbm-2/",
  },
  60423: {
    date: "12.08.2024",
    place: "Vandenberg, USA",
    rocket: "Falcon 9",
    lifetime: "15 år",
    source:
      "https://spacenorway.com/press-release/space-norway-confirms-the-successful-launch-of-asbm-satellites/",
    lifeSource:
      "https://spacenorway.com/infrastructure/satellite-fleet/asbm-1-asbm-2/",
  },
  32487: {
    date: "10.02.2008",
    place: "Baikonur, Kasakhstan",
    rocket: "Proton / Breeze M",
    lifetime: "Ikke oppgitt",
    source: "https://spacenorway.com/infrastructure/satellite-fleet/thor-5/",
  },
  36033: {
    date: "29.10.2009",
    place: "Kourou, Fransk Guyana",
    rocket: "Ariane 5",
    lifetime: "Ikke oppgitt",
    source: "https://spacenorway.com/infrastructure/satellite-fleet/thor-6/",
  },
  40613: {
    date: "26.04.2015",
    place: "Kourou, Fransk Guyana",
    rocket: "Ariane 5",
    lifetime: "Ca. 15 år",
    source: "https://spacenorway.com/infrastructure/satellite-fleet/thor-7/",
    lifeSource:
      "https://spacenorway.com/wp-content/uploads/2024/10/Space-Norway_Annual_Report_2020.pdf",
  },
};

// Explicit message keys for localised data fields.
Object.values(launchDetails)[0].placeKey = "ui.baikonur_kazakhstan";
Object.values(launchDetails)[0].lifetimeKey = "ui.not_specified";
Object.values(launchDetails)[1].placeKey = "ui.kourou_french_guiana";
Object.values(launchDetails)[1].lifetimeKey = "ui.not_specified";
Object.values(launchDetails)[2].placeKey = "ui.kourou_french_guiana";
Object.values(launchDetails)[2].lifetimeKey = "ui.approx_15_years";
Object.values(launchDetails)[3].placeKey = "ui.baikonur_kazakhstan";
Object.values(launchDetails)[3].lifetimeKey = "ui.3_years";
Object.values(launchDetails)[4].placeKey = "ui.baikonur_kazakhstan";
Object.values(launchDetails)[4].lifetimeKey = "ui.not_specified";
Object.values(launchDetails)[5].placeKey = "ui.kourou_french_guiana";
Object.values(launchDetails)[5].lifetimeKey = "ui.not_specified";
Object.values(launchDetails)[6].lifetimeKey = "ui.not_specified";
Object.values(launchDetails)[7].lifetimeKey = "ui.not_specified";
Object.values(launchDetails)[8].lifetimeKey = "ui.15_years";
Object.values(launchDetails)[9].lifetimeKey = "ui.15_years";
Object.values(launchDetails)[10].lifetimeKey = "ui.not_specified";
Object.values(launchDetails)[11].lifetimeKey = "ui.not_specified";
Object.values(launchDetails)[12].lifetimeKey = "ui.not_specified";
Object.values(launchDetails)[12].dateKey = "ui.march_2026";
Object.values(launchDetails)[13].lifetimeKey = "ui.7_years";
Object.values(launchDetails)[13].dateKey = "ui.march_2026";
Object.values(launchDetails)[14].placeKey = "ui.andya_norway";
Object.values(launchDetails)[14].lifetimeKey = "ui.not_specified";
Object.values(launchDetails)[15].lifetimeKey = "ui.5_years";
Object.values(launchDetails)[16].lifetimeKey = "ui.not_specified";
