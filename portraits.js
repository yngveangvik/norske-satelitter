const missionImages = {
 directorate: 'https://romdirektoratet.no/satellitter-infrastruktur-og-statlige-romaktoerer',
 milspace: 'https://www.ffi.no/forskning/prosjekter/milspace2',
 hypso: 'https://hypso.space/satellites/hypso-2',
 aissat: 'https://www.highnorthnews.com/politikk/ny-satellitt-skutt-opp-for-a-sikre-norsk-havovervakning-i-arene-framover/1108210',
 catalog: 'https://space.skyrocket.de/img_sat/'
};
const portraits = Object.fromEntries([
 [62702,'62702',missionImages.directorate,'Illustrasjon: SFL'],
 [42826,'42826',missionImages.directorate,'Bilde: Romdirektoratet'],
 [42828,'norsat12',missionImages.directorate,'Illustrasjon: NorSat-1 og -2'],
 [48272,'48272',missionImages.directorate,'Bilde: Romdirektoratet'],
 [68454,'68454',missionImages.aissat,'Illustrasjon: AISSat-4'],
 [68490,'68490-2',missionImages.catalog+'mimir-1__1.jpg','Illustrasjon: Mimir-1'],
 [60531,'hypso-photo',missionImages.hypso,'Foto: NTNU SmallSat Lab'],
 [55015,'55015-0',missionImages.directorate,'Illustrasjon: NanoAvionics'],
 [55093,'55015-1',missionImages.milspace,'Illustrasjon: MilSpace2','Prosjektillustrasjon av tvillingsatellittene Birkeland og Huygens'],
 [60422,'60422-0',missionImages.catalog+'asbm-1__1.jpg','Illustrasjon: ASBM 1 og 2','Felles illustrasjon av satellittplattformen til ASBM 1 og 2'],
 [60423,'60422-0',missionImages.catalog+'asbm-1__1.jpg','Illustrasjon: ASBM 1 og 2','Felles illustrasjon av satellittplattformen til ASBM 1 og 2'],
 [32487,'32487-0',missionImages.catalog+'thor-2r__1.jpg','Illustrasjon: THOR 5'],
 [36033,'36033',missionImages.catalog+'thor-6__1.jpg','Illustrasjon: THOR 6'],
 [40613,'40613-0',missionImages.catalog+'thor-7__1.jpg','Illustrasjon: THOR 7']
].map(([id,file,source,credit,alt]) => [id,{file,source,credit,alt}]));
