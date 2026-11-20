const spaceports={"port0": {"name": "Cape Canaveral SFS, FL, USA", "short": "Cape Canaveral", "location": "Cape Canaveral SFS, FL, USA", "lat": 28.488889, "lon": -80.577778, "owner": "Se kilde", "operator": "Se kilde", "pads": ["Launch Complex 26A", "Launch Complex 18A", "Space Launch Complex 20", "Launch Complex 34", "Space Launch Complex 15", "Space Launch Complex 37B", "Launch Complex 36A", "Launch Complex 11"], "source": "https://ll.thespacedevs.com/2.3.0/locations/12/", "official": "https://ll.thespacedevs.com/2.3.0/locations/12/", "photo": null, "credit": "", "locationId": 12, "padIds": null, "visible": true, "launchPlace": "Cape Canaveral", "showUpcoming": false}, "port1": {"name": "Baikonur Cosmodrome, Republic of Kazakhstan", "short": "Bajkonur", "location": "Baikonur Cosmodrome, Republic of Kazakhstan", "lat": 45.965, "lon": 63.305, "owner": "Se kilde", "operator": "Se kilde", "pads": ["31/6", "41/15", "90", "90/20", "131", "191/66", "67/21", "200/40"], "source": "https://ll.thespacedevs.com/2.3.0/locations/15/", "official": "https://ll.thespacedevs.com/2.3.0/locations/15/", "photo": null, "credit": "", "locationId": 15, "padIds": null, "visible": true, "launchPlace": "Baikonur", "showUpcoming": false}, "port2": {"name": "Guiana Space Centre, French Guiana", "short": "Kourou", "location": "Kourou og Sinnamary · Fransk Guyana", "lat": 5.169, "lon": -52.6903, "owner": "Frankrike / CNES; ESA eier dedikert Ariane- og Vega-infrastruktur", "operator": "CNES", "pads": ["Ariane Launch Area 1 (ELV)", "Ariane Launch Area 4"], "source": "https://ll.thespacedevs.com/2.3.0/locations/13/", "official": "https://centrespatialguyanais.cnes.fr/fr", "photo": "spaceport-csg.jpg", "credit": "ESA / S. Corvaja", "locationId": 13, "padIds": null, "visible": true, "launchPlace": "Kourou", "showUpcoming": true}, "port4": {"name": "Andøya Spaceport", "short": "Andøya", "location": "Nordmela, Andøya · Norge", "lat": 69.10839, "lon": 15.58937, "owner": "Andøya Spaceport AS / Andøya Space", "operator": "Andøya Spaceport AS", "pads": ["Orbital Launch Pad"], "source": "https://ll.thespacedevs.com/2.3.0/locations/161/", "official": "https://andoyaspace.no/", "photo": "spaceport-api.jpg", "credit": "Andøya Space", "locationId": 161, "padIds": null, "visible": true, "launchPlace": "Andøya", "showUpcoming": true}, "port5": {"name": "Vandenberg SFB, CA, USA", "short": "Vandenberg", "location": "Vandenberg SFB, CA, USA", "lat": 34.75133, "lon": -120.52023, "owner": "Se kilde", "operator": "Se kilde", "pads": ["Space Launch Complex 4E", "Space Launch Complex 14", "Space Launch Complex 6", "Space Launch Complex 3E", "Space Launch Complex 8", "Space Launch Complex 2W"], "source": "https://ll.thespacedevs.com/2.3.0/locations/11/", "official": "https://ll.thespacedevs.com/2.3.0/locations/11/", "photo": null, "credit": "", "locationId": 11, "padIds": null, "visible": true, "launchPlace": "Vandenberg", "showUpcoming": false}};
let activePort=null;
const launchCache=new Map();
function describeSpaceport(){
 const p=spaceports[activePort];
 $('facts').hidden=false;$('facts').classList.remove('station-facts');
 $('metrics').hidden=true;$('launch-details').hidden=true;$('station-details').hidden=true;$('port-details').hidden=false;
 $('name').textContent=p.name;$('mission').textContent=p.location;
 $('owner-label').textContent='Eier';$('owner').textContent=p.owner;$('operator').textContent=p.operator;$('operator-row').hidden=false;
 $('portrait').hidden=!p.photo;if(p.photo)$('sat-image').src='media/'+p.photo;$('sat-image').alt=p.name;
 $('sat-credit').hidden=!p.photo;$('sat-credit').textContent='Bilde';$('sat-credit').href='https://ll.thespacedevs.com/2.3.0/locations/'+p.locationId+'/';$('sat-credit').title='Foto: '+p.credit;$('sat-credit').setAttribute('aria-label','Foto: '+p.credit);
 $('ownership-source').href=p.source;$('epoch').textContent='Omtrentlig senterpunkt';
 $('port-coordinates').textContent=Math.abs(p.lat).toFixed(4)+'° '+(p.lat<0?'S':'N')+' · '+Math.abs(p.lon).toFixed(4)+'° '+(p.lon<0?'V':'Ø');
 $('port-pads').replaceChildren(...p.pads.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
 $('port-official').href=p.official;$('port-official').textContent=p.official.includes('thespacedevs')?'Kilde: romhavn og ramper':'Romhavnens nettside';
 renderPortSatellites(p);renderNextLaunch(p);
}
function selectSpaceport(id){
 clearSatellite(false);activePort=id;const p=spaceports[id];p.visible=true;
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
 $('upcoming-launch').hidden=!p.showUpcoming;
 $('next-launch').hidden=$('launch-updated').hidden=!p.showUpcoming;
 if(!p.showUpcoming){$('next-launch').textContent='';$('launch-updated').textContent='';return;}
 const c=launchCache.get(p.short);
 $('next-launch').textContent=!c?'Henter neste planlagte oppskyting …':c.error?'Oppskytingsdata kunne ikke hentes. Se offisiell oppskytingsinformasjon.':c.item?'Neste planlagte: '+c.item.name+' · '+launchDate(c.item)+' · '+(c.item.status?.abbrev||'Planlagt')+'. Tidspunkt kan endres.':'Ingen kommende oppskyting registrert i datakilden.';
 $('launch-updated').textContent=c?.at?'Hentet '+new Date(c.at).toLocaleString('nb-NO',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'2-digit',timeZone:'Europe/Oslo'})+' · Launch Library 2':'';
}
async function loadNextLaunch(p){
 if(!p.showUpcoming)return;
 let c=launchCache.get(p.short);
 if(c&&Date.now()-c.at<15*60*1000)return;
 try{
  const response=await fetch('https://ll.thespacedevs.com/2.3.0/launches/upcoming/?location__ids='+p.locationId+(p.padIds?'&pad__ids='+p.padIds.join(','):'')+'&limit=5&ordering=net&hide_recent_previous=true&format=json',{signal:AbortSignal.timeout(10000)});
  if(!response.ok)throw new Error('Launch API '+response.status);
  const data=await response.json();if(!Array.isArray(data.results))throw new Error('Invalid response');
  const item=data.results.find(x=>x.pad?.location?.id===p.locationId&&(!p.padIds||p.padIds.includes(x.pad.id))&&Date.parse(x.net)>Date.now()&&![3,4,7].includes(x.status?.id));
  launchCache.set(p.short,{item:item||null,at:Date.now()});
 }catch{launchCache.set(p.short,{error:true,at:Date.now()});}
 if(activePort&&spaceports[activePort]===p)renderNextLaunch(p);
}
setInterval(()=>{if(activePort)loadNextLaunch(spaceports[activePort]);},60000);

function renderPortSatellites(port){
 const list=$('port-satellites');list.replaceChildren();
 for(const sat of fleet.filter(s=>(launchDetails[s.id]?.place||'').split(',')[0]===port.launchPlace)){
  const row=document.createElement('li'),button=document.createElement('button');
  button.type='button';button.textContent=sat.name;button.onclick=()=>focusSatellite(sat);
  const detail=document.createElement('span');detail.textContent=launchDetails[sat.id].date+(sat.id<0?' · '+sat.mission:'');
  row.append(button,detail);list.append(row);
 }
 if(!list.children.length){const row=document.createElement('li');row.textContent='Ingen oppskytinger registrert for satellittene i denne viseren.';list.append(row);}
}
