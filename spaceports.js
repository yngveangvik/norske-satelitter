const spaceports={
 andoya:{name:'Andøya Spaceport',location:'Nordmela, Andøya · Norge',lat:69.10839,lon:15.58937,owner:'Andøya Spaceport AS / Andøya Space',operator:'Andøya Spaceport AS',pads:['Orbital rampe — Spectrum (Isar Aerospace).','Én operativ rampe; flere ramper er planlagt.'],source:'https://prod.luftfartstilsynet.no/en/space/andoya-spaceport/',official:'https://andoyaspace.no/',photo:'spaceport-api.jpg',credit:'Andøya Space',locationId:161},
 guiana:{name:'Guiana Space Centre',location:'Kourou og Sinnamary · Fransk Guyana',lat:5.2,lon:-52.77,owner:'Frankrike / CNES; ESA eier dedikert Ariane- og Vega-infrastruktur',operator:'CNES',pads:['ELA-4 — Ariane 6.','ELV (tidligere ELA-1) — Vega-C.','ELM / Diamant — fem planlagte ramper for små bæreraketter og CALLISTO.','ELM2 (tidligere ELS / Soyuz) — ombygging planlagt, to ramper.','ELA-3 og ELA-2 — tidligere Ariane-anlegg, planlagt gjenbruk for Vega-E.'],source:'https://centrespatialguyanais.cnes.fr/fr/installations-lancement',official:'https://centrespatialguyanais.cnes.fr/fr',photo:'spaceport-csg.jpg',credit:'ESA / S. Corvaja',locationId:13}
};
let activePort=null;
const launchCache=new Map();
function describeSpaceport(){
 const p=spaceports[activePort];
 $('facts').hidden=false;$('facts').classList.remove('station-facts');
 $('metrics').hidden=true;$('launch-details').hidden=true;$('station-details').hidden=true;$('port-details').hidden=false;
 $('name').textContent=p.name;$('mission').textContent=p.location;
 $('owner-label').textContent='Eier';$('owner').textContent=p.owner;$('operator').textContent=p.operator;$('operator-row').hidden=false;
 $('portrait').hidden=false;$('sat-image').src='media/'+p.photo;$('sat-image').alt=p.name;
 $('sat-credit').hidden=false;$('sat-credit').textContent='Bilde';$('sat-credit').href='https://ll.thespacedevs.com/2.3.0/locations/'+p.locationId+'/';$('sat-credit').title='Foto: '+p.credit;$('sat-credit').setAttribute('aria-label','Foto: '+p.credit);
 $('ownership-source').href=p.source;$('epoch').textContent='Omtrentlig senterpunkt';
 $('port-coordinates').textContent=Math.abs(p.lat).toFixed(4)+'° N · '+Math.abs(p.lon).toFixed(4)+'° '+(p.lon<0?'V':'Ø');
 $('port-pads').replaceChildren(...p.pads.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
 $('port-official').href=p.official;
 renderNextLaunch(p);
}
function selectSpaceport(id){
 clearSatellite(false);activePort=id;const p=spaceports[id];
 lon=p.lon*radians;lat=p.lat*radians;target=1.8;norwayFocus=true;
 $('port-details').querySelector('details').open=false;
 setMenu(false);$('explore-toggle').setAttribute('aria-expanded','false');describeSpaceport();loadNextLaunch(p);
}
function launchDate(item){
 const d=new Date(item.net);if(!Number.isFinite(d.getTime()))return 'Tidspunkt ikke fastsatt';
 const precision=item.net_precision?.abbrev;
 if(precision==='Y')return 'Tidligst '+d.getUTCFullYear();
 if(/^Q[1-4]$/.test(precision||''))return precision.slice(1)+'. kvartal '+d.getUTCFullYear();
 if(precision==='M')return d.toLocaleDateString('nb-NO',{month:'long',year:'numeric',timeZone:'UTC'});
 if(['MIN','SEC','HR'].includes(precision))return d.toLocaleString('nb-NO',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'Europe/Oslo'})+' norsk tid';
 if(precision==='DAY')return d.toLocaleDateString('nb-NO',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
 return 'Tidsvindu ikke presisert – se kilden';
}
function renderNextLaunch(p){
 const c=launchCache.get(p.locationId);
 $('next-launch').textContent=!c?'Henter neste planlagte oppskyting …':c.error?'Oppskytingsdata kunne ikke hentes. Se offisiell oppskytingsinformasjon.':c.item?'Neste planlagte: '+c.item.name+' · '+launchDate(c.item)+' · '+(c.item.status?.abbrev||'Planlagt')+'. Tidspunkt kan endres.':'Ingen kommende oppskyting registrert i datakilden.';
 $('launch-updated').textContent=c?.at?'Hentet '+new Date(c.at).toLocaleString('nb-NO',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'2-digit',timeZone:'Europe/Oslo'})+' · Launch Library 2':'';
}
async function loadNextLaunch(p){
 let c=launchCache.get(p.locationId);
 if(c&&Date.now()-c.at<15*60*1000)return;
 try{
  const response=await fetch('https://ll.thespacedevs.com/2.3.0/launches/upcoming/?location__ids='+p.locationId+'&limit=5&ordering=net&hide_recent_previous=true&format=json',{signal:AbortSignal.timeout(10000)});
  if(!response.ok)throw new Error('Launch API '+response.status);
  const data=await response.json();if(!Array.isArray(data.results))throw new Error('Invalid response');
  const item=data.results.find(x=>x.pad?.location?.id===p.locationId&&Date.parse(x.net)>Date.now()&&![3,4,7].includes(x.status?.id));
  launchCache.set(p.locationId,{item:item||null,at:Date.now()});
 }catch{launchCache.set(p.locationId,{error:true,at:Date.now()});}
 if(activePort&&spaceports[activePort]===p)renderNextLaunch(p);
}
setInterval(()=>{if(activePort)loadNextLaunch(spaceports[activePort]);},60000);
