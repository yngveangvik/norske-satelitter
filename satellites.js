const fleet = [
  [62702, "NorSat-4", "LEO", "Skipsovervåking og teknologiutprøving"],
  [42826, "NorSat-1", "LEO", "Skipsovervåking og romforskning"],
  [42828, "NorSat-2", "LEO", "Skipsovervåking og maritim kommunikasjon"],
  [48272, "NorSat-3", "LEO", "Skipsovervåking og radardeteksjon"],
  [68454, "AISSat-4", "LEO", "Skipsovervåking for Kystverket"],
  [68490, "Mimir-1", "LEO", "Teknologiutprøving for Space Norway"],
  [100610, "FramSat-1", "LEO", "Studentsatellitt · tester solsensor"],
  [-1, "HYPSO-1", "LEO", "Havobservasjon · banedata utilgjengelige"],
  [-2, "SelfieSat", "LEO", "Studentsatellitt · brant opp i 2024"],
  [60531, "HYPSO-2", "LEO", "Havobservasjon for NTNU"],
  [55015, "Birkeland", "LEO", "Norsk-nederlandsk radardeteksjon"],
  [55093, "Huygens", "LEO", "Norsk-nederlandsk radardeteksjon"],
  [60422, "ASBM 1", "HEO", "Bredbånd i Arktis"],
  [60423, "ASBM 2", "HEO", "Bredbånd i Arktis"],
  [32487, "THOR 5", "GEO", "TV og datakommunikasjon"],
  [36033, "THOR 6", "GEO", "TV og datakommunikasjon"],
  [40613, "THOR 7", "GEO", "TV og bredbånd"],
].map(([id, name, type, mission]) => ({ id, name, type, mission }));

const ownership = {};
const nationalSource =
  "https://romdirektoratet.no/satellitter-infrastruktur-og-statlige-romaktoerer";
for (const id of [62702, 42826, 42828, 48272, 68454]) {
  ownership[id] = {
    owner: [62702, 42826].includes(id)
      ? "Direktoratet for romvirksomhet"
      : "Kystverket",
    operator: "Statsat (Space Norway)",
    source: nationalSource,
  };
}
ownership[68454].source =
  "https://www.kystverket.no/nyheter/2024/ny-satellitt-for-havovervakning-bygges-pa-rekordtid/";
for (const id of [68490, 60422, 60423, 32487, 36033, 40613]) {
  ownership[id] = {
    owner: "Space Norway",
    operator: "Space Norway",
    source: "https://spacenorway.com/infrastructure/satellite-fleet/",
  };
}
ownership[68490].source =
  "https://spacenorway.com/projects/our-projects/mimir/";
for (const id of [55015, 55093]) {
  ownership[id] = {
    owner: "FFI / Nederlands forsvarsdepartement (50/50)",
    operator: "Norsk drift · norske/nederlandske oppdrag",
    source: "https://www.ffi.no/forskning/prosjekter/milspace2",
  };
}
for (const id of [-1, 60531]) {
  ownership[id] = {
    owner: "NTNU",
    operator: "NTNU SmallSat Lab",
    source: "https://www.ntnu.edu/smallsat",
  };
}
for (const id of [100610, -2]) {
  ownership[id] = {
    owner: "Orbit NTNU",
    operator: "Orbit NTNU",
    source:
      id === 100610
        ? "https://orbitntnu.com/projects/FramSat-1"
        : "https://nyheter.ntnu.no/ntnu-satelitt-brant-opp-i-atmosfaeren/",
  };
}

const colors = { LEO: "#a2a2ed", HEO: "#7de0ff", GEO: "#eef1fe" };
// Explicit message keys for localised data fields.
fleet[0].missionKey = "ui.ship_monitoring_and_technology_demonstration";
fleet[1].missionKey = "ui.ship_monitoring_and_space_research";
fleet[2].missionKey = "ui.ship_monitoring_and_maritime_communications";
fleet[3].missionKey = "ui.ship_monitoring_and_radar_detection";
fleet[4].missionKey =
  "ui.ship_monitoring_for_the_norwegian_coastal_administration";
fleet[5].missionKey = "ui.technology_demonstration_for_space_norway";
fleet[6].missionKey = "ui.student_satellite_testing_a_sun_sensor";
fleet[7].missionKey = "ui.ocean_observation_orbital_data_unavailable";
fleet[8].missionKey = "ui.student_satellite_re_entered_in_2024";
fleet[9].missionKey = "ui.ocean_observation_for_ntnu";
fleet[10].missionKey = "ui.norwegiandutch_radar_detection";
fleet[11].missionKey = "ui.norwegiandutch_radar_detection";
fleet[12].missionKey = "ui.arctic_broadband";
fleet[13].missionKey = "ui.arctic_broadband";
fleet[14].missionKey = "ui.tv_and_data_communications";
fleet[15].missionKey = "ui.tv_and_data_communications";
fleet[16].missionKey = "ui.tv_and_broadband";
ownership[42826].ownerKey = "ui.norwegian_space_agency";
ownership[42828].ownerKey = "ui.norwegian_coastal_administration";
ownership[48272].ownerKey = "ui.norwegian_coastal_administration";
ownership[55015].operatorKey =
  "ui.norwegian_operations_norwegian_dutch_missions";
ownership[55093].operatorKey =
  "ui.norwegian_operations_norwegian_dutch_missions";
ownership[62702].ownerKey = "ui.norwegian_space_agency";
ownership[68454].ownerKey = "ui.norwegian_coastal_administration";
