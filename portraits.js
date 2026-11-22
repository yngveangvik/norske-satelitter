const missionImages = {
  directorate:
    "https://romdirektoratet.no/satellitter-infrastruktur-og-statlige-romaktoerer",
  milspace: "https://www.ffi.no/forskning/prosjekter/milspace2",
  hypso: "https://hypso.space/satellites/hypso-2",
  aissat:
    "https://www.highnorthnews.com/politikk/ny-satellitt-skutt-opp-for-a-sikre-norsk-havovervakning-i-arene-framover/1108210",
  catalog: "https://space.skyrocket.de/img_sat/",
};
const portraits = Object.fromEntries(
  [
    [62702, "62702", missionImages.directorate, "Illustrasjon: SFL"],
    [42826, "42826", missionImages.directorate, "Bilde: Romdirektoratet"],
    [
      42828,
      "norsat12",
      missionImages.directorate,
      "Illustrasjon: NorSat-1 og -2",
    ],
    [48272, "48272", missionImages.directorate, "Bilde: Romdirektoratet"],
    [68454, "68454", missionImages.aissat, "Illustrasjon: AISSat-4"],
    [
      68490,
      "68490-2",
      missionImages.catalog + "mimir-1__1.jpg",
      "Illustrasjon: Mimir-1",
    ],
    [60531, "hypso-photo", missionImages.hypso, "Foto: NTNU SmallSat Lab"],
    [55015, "55015-0", missionImages.directorate, "Illustrasjon: NanoAvionics"],
    [
      55093,
      "55015-1",
      missionImages.milspace,
      "Illustrasjon: MilSpace2",
      "Prosjektillustrasjon av tvillingsatellittene Birkeland og Huygens",
    ],
    [
      60422,
      "60422-0",
      missionImages.catalog + "asbm-1__1.jpg",
      "Illustrasjon: ASBM 1 og 2",
      "Felles illustrasjon av satellittplattformen til ASBM 1 og 2",
    ],
    [
      60423,
      "60422-0",
      missionImages.catalog + "asbm-1__1.jpg",
      "Illustrasjon: ASBM 1 og 2",
      "Felles illustrasjon av satellittplattformen til ASBM 1 og 2",
    ],
    [
      32487,
      "32487-0",
      missionImages.catalog + "thor-2r__1.jpg",
      "Illustrasjon: THOR 5",
    ],
    [
      36033,
      "36033",
      missionImages.catalog + "thor-6__1.jpg",
      "Illustrasjon: THOR 6",
    ],
    [
      40613,
      "40613-0",
      missionImages.catalog + "thor-7__1.jpg",
      "Illustrasjon: THOR 7",
    ],
  ].map(([id, file, source, credit, alt]) => [
    id,
    { file, source, credit, alt },
  ]),
);
portraits[32487].creditKey = "credit.satellite_32487_credit";
portraits[36033].creditKey = "credit.satellite_36033_credit";
portraits[40613].creditKey = "credit.satellite_40613_credit";
portraits[42826].creditKey = "credit.satellite_42826_credit";
portraits[42828].creditKey = "credit.satellite_42828_credit";
portraits[48272].creditKey = "credit.satellite_48272_credit";
portraits[55015].creditKey = "credit.satellite_55015_credit";
portraits[55093].creditKey = "credit.satellite_55093_credit";
portraits[55093].altKey = "credit.satellite_55093_alt";
portraits[60422].creditKey = "credit.satellite_60422_credit";
portraits[60422].altKey = "credit.satellite_60422_alt";
portraits[60423].creditKey = "credit.satellite_60423_credit";
portraits[60423].altKey = "credit.satellite_60423_alt";
portraits[60531].creditKey = "credit.satellite_60531_credit";
portraits[62702].creditKey = "credit.satellite_62702_credit";
portraits[68454].creditKey = "credit.satellite_68454_credit";
portraits[68490].creditKey = "credit.satellite_68490_credit";
