# Norge i bane – GitHub Pages

## Last opp uten å installere noe

1. Pakk ut ZIP-filen på Macen.
2. Åpne repositoryet på github.com. Behold den gamle nedlastede ZIP-en som sikkerhetskopi.
3. Fjern de gamle nettstedfilene dersom du ønsker en ren erstatning. Behold repositoryet og innstillingene.
4. Velg Add file → Upload files.
5. Dra INNHOLDET i den utpakkede mappen inn: index.html, mappene css, js, libraries og media, samt de øvrige filene. Behold undermappene. Ikke last opp ZIP-filen eller en ekstra ytre mappe.
6. Velg Commit changes.
7. Under Settings → Pages velges Deploy from a branch, main og /(root), hvis dette ikke allerede er valgt.
8. Vent til publiseringen i Actions er grønn. Last nettsiden på nytt, gjerne i privat vindu første gang.

index.html skal ligge direkte på repositoryets hovednivå. css, js, libraries og media skal ligge som mapper ved siden av.

.nojekyll er med, men kan være skjult på Mac. Bibliotekmappen heter libraries, slik at løsningen også fungerer dersom denne skjulte filen ikke blir lastet opp.

## Innhold

- index.html: nettsiden og rekkefølgen på skriptene.
- css/: stilark og Suisse Intl-oppsett.
- js/: applikasjon, datakataloger, paneler og instrumentillustrasjoner.
- libraries/: Three.js og satellite.js (SGP4-beregninger).
- media/: logoer, fonter, ikoner, bilder og jordteksturer.
- earth.jpg og orbits.json: lokale startdata.
- manifest.webmanifest: innstillinger for hjemskjermikon.

Ingen installasjon, byggetrinn eller hemmelige API-nøkler kreves. Nettleseren trenger WebGL for kloden. Oppdaterte banedata og kommende oppskytinger krever at eksterne datakilder svarer; lokale banedata brukes som utgangspunkt.

## Rettet i denne pakken

Feil innhold i beregningsbiblioteket satellite.js er erstattet med riktig bibliotek. Gamle løse filer og parallelle mapper som ikke brukes av index.html er fjernet. Alle lokale filstier og avhengigheter er kontrollert, og nødvendige fonter, bilder og ikoner er inkludert. Bibliotekene ligger i libraries for å unngå GitHub Pages-filtrering av vendor.
