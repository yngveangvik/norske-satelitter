const stationCategories = {
  KSAT: {
    color: "#a2a2ed",
    owner: "KSAT (Kongsberg Satellite Services)",
    function:
      "Mottak av satellittdata og kontakt med satellitter i KSATs globale nettverk.",
    source:
      "https://www.ksat.no/ground-network-services/the-ksat-global-ground-station-network/",
  },
  "Space Norway": {
    color: "#fc8c30",
    owner: "Space Norway",
    function:
      "Teleport for satellittkommunikasjon, trafikkovervåking og drift.",
    source:
      "https://spacenorway.com/infrastructure/ground-services/satellite-control-centre/",
  },
  Forsvaret: {
    color: "#1bb1b0",
    owner: "Forsvaret",
    function: "Militær satellittkommunikasjon og samband.",
    source: "https://www.forsvaret.no/om-forsvaret/organisasjon/cyberforsvaret",
  },
  Kartverket: {
    color: "#eef1fe",
    owner: "Kartverket",
    function:
      "Geodetiske målinger av jordas form, bevegelse og orientering i rommet.",
    source:
      "https://kartverket.no/en/about-kartverket/geodetic-earth-observatory/information-about-the-observatory/",
  },
};
const groundStations = [
  ["Svalbard", 78.2297, 15.4078],
  ["Troll", -72.0167, 2.5333],
  ["Tromsø", 69.6623, 18.9413],
  ["Vardø", 70.3705, 31.1107],
  ["Grimstad", 58.3405, 8.5934],
  ["Nuuk", 64.1814, -51.6941],
  ["Inuvik", 68.3195, -133.549],
  ["Fairbanks", 64.8592, -147.8492],
  ["Los Angeles", 34.0522, -118.2437],
  ["Hawaii", 19.0144, -155.6633],
  ["Panama", 8.9824, -79.5199],
  ["Punta Arenas", -52.9389, -70.8711],
  ["Puertollano", 38.6871, -4.1073],
  ["Nemea", 37.8108, 22.6606],
  ["Dubai", 25.2048, 55.2708],
  ["Hartebeesthoek", -25.8872, 27.7072],
  ["Mauritius", -20.3484, 57.5522],
  ["Singapore", 1.3521, 103.8198],
  ["Jeju", 33.4996, 126.5312],
  ["Tokyo", 35.6762, 139.6503],
  ["Awarua", -46.528, 168.3814],
  ["Nittedal", 60.1439, 10.805, "Space Norway"],
  ["Eik", 58.5384, 6.4672, "Space Norway"],
  ["Eggemoen", 60.2067, 10.3162, "Forsvaret"],
  ["Ny-Ålesund", 78.9433, 11.855, "Kartverket"],
].map(([name, latitude, longitude, category = "KSAT"]) => ({
  name,
  latitude,
  longitude,
  category,
  visible: false,
}));
Object.assign(
  groundStations.find((s) => s.name === "Svalbard"),
  {
    photo: "media/station-svalsat.jpg",
    photoSource:
      "https://www.ksat.no/news/news-archive/2023/spectacular-drone-footage-from-svalsat-the-ksat-svalbard-ground-station/",
    photoCredit: "Foto: KSAT",
  },
);
Object.assign(
  groundStations.find((s) => s.name === "Troll"),
  {
    photo: "media/station-trollsat.jpg",
    photoSource:
      "https://www.ksat.no/news/news-archive/2020/antarctica-day-2020/",
    photoCredit: "Foto: KSAT",
  },
);
Object.assign(
  groundStations.find((s) => s.name === "Nittedal"),
  {
    photo: "media/station-nittedal.jpg",
    photoSource:
      "https://spacenorway.com/infrastructure/ground-services/nittedal-teleport/",
    photoCredit: "Foto: Space Norway",
  },
);
Object.assign(
  groundStations.find((s) => s.name === "Ny-\u00c5lesund"),
  {
    photo: "media/station-ny-alesund.jpg",
    photoSource:
      "https://kartverket.no/om-kartverket/nyheter/alle/2025/april/geodesi-avtale-signert-av-kartverket-og-fn",
    photoCredit: "Foto: Bjørn-Owe Holmberg / Kartverket",
  },
);

// Explicit message keys for localised data fields.
Object.values(stationCategories)[0].functionKey =
  "ui.satellite_data_reception_and_contact_with_satellites_through_ksats_glo";
Object.values(stationCategories)[1].functionKey =
  "ui.teleport_for_satellite_communications_traffic_monitoring_and_operation";
Object.values(stationCategories)[2].ownerKey = "ui.norwegian_armed_forces";
Object.values(stationCategories)[2].functionKey =
  "ui.military_satellite_communications";
Object.values(stationCategories)[3].ownerKey = "ui.norwegian_mapping_authority";
Object.values(stationCategories)[3].functionKey =
  "ui.geodetic_measurements_of_the_earths_shape_motion_and_orientation_in_sp";
groundStations[0].photoCreditKey = "credit.station_0";
groundStations[1].photoCreditKey = "credit.station_1";
groundStations[21].photoCreditKey = "credit.station_21";
groundStations[24].photoCreditKey = "credit.station_24";
