const stationCategories={
 KSAT:{color:'#a2a2ed',owner:'KSAT (Kongsberg Satellite Services)',function:'Mottak av satellittdata og kontakt med satellitter i KSATs globale nettverk.',source:'https://www.ksat.no/ground-network-services/the-ksat-global-ground-station-network/'},
 'Space Norway':{color:'#fc8c30',owner:'Space Norway',function:'Teleport for satellittkommunikasjon, trafikkovervåking og drift.',source:'https://spacenorway.com/infrastructure/ground-services/satellite-control-centre/'},
 Forsvaret:{color:'#1bb1b0',owner:'Forsvaret',function:'Militær satellittkommunikasjon og samband.',source:'https://www.forsvaret.no/om-forsvaret/organisasjon/cyberforsvaret'},
 Kartverket:{color:'#eef1fe',owner:'Kartverket',function:'Geodetiske målinger av jordas form, bevegelse og orientering i rommet.',source:'https://kartverket.no/en/about-kartverket/geodetic-earth-observatory/information-about-the-observatory/'}
};
const groundStations=[
 ['Svalbard',78.2297,15.4078],['Troll',-72.0167,2.5333],['Tromsø',69.6623,18.9413],['Vardø',70.3705,31.1107],['Grimstad',58.3405,8.5934],['Nuuk',64.1814,-51.6941],['Inuvik',68.3195,-133.5490],['Fairbanks',64.8592,-147.8492],['Los Angeles',34.0522,-118.2437],['Hawaii',19.0144,-155.6633],['Panama',8.9824,-79.5199],['Punta Arenas',-52.9389,-70.8711],['Puertollano',38.6871,-4.1073],['Nemea',37.8108,22.6606],['Dubai',25.2048,55.2708],['Hartebeesthoek',-25.8872,27.7072],['Mauritius',-20.3484,57.5522],['Singapore',1.3521,103.8198],['Jeju',33.4996,126.5312],['Tokyo',35.6762,139.6503],['Awarua',-46.5280,168.3814],
 ['Nittedal',60.1439,10.8050,'Space Norway'],['Eik',58.5384,6.4672,'Space Norway'],['Eggemoen',60.2067,10.3162,'Forsvaret'],['Ny-Ålesund',78.9433,11.8550,'Kartverket']
].map(([name,latitude,longitude,category='KSAT'])=>({name,latitude,longitude,category,visible:false}));
let activeStation=null,showStations=false;
function stationMenu(open){
 setMenu(open);if(open)switchCatalog('stations');
}
function switchCatalog(type){
 const stations=type==='stations';
 $('sat-catalog').hidden=stations;$('station-catalog').hidden=!stations;
 $('satellittmeny').dataset.catalog=type;
}
function describeStation(){
 const s=activeStation,c=stationCategories[s.category];
 $('facts').hidden=false;$('facts').classList.add('station-facts');
 $('metrics').hidden=true;$('launch-details').hidden=true;$('station-details').hidden=false;
 $('name').textContent=s.name;$('mission').textContent=c.function;
 $('owner-label').textContent='Eier';$('owner').textContent=c.owner;$('operator-row').hidden=true;
 $('ownership-source').href=c.source;
 $('station-coordinates').textContent=Math.abs(s.latitude).toFixed(4)+'° '+(s.latitude<0?'S':'N')+' · '+Math.abs(s.longitude).toFixed(4)+'° '+(s.longitude<0?'V':'Ø');
 $('epoch').textContent='Omtrentlig kartplassering';
 $('portrait').hidden=false;$('sat-image').src=s.photo||'media/station-illustration.svg';
 $('sat-image').alt=s.photo?'Bakkestasjonen i '+s.name:'Illustrasjon av en bakkeantenne';
 $('sat-credit').hidden=false;$('sat-credit').textContent=s.photo?'Bilde':'Illustrasjon';
 $('sat-credit').href=s.photoSource||'media/station-illustration.svg';$('sat-credit').title=s.photoCredit||'Skjematisk illustrasjon, ikke et foto av anlegget';
}
function selectStation(s){
 clearSatellite(false);activeStation=s;s.visible=true;showStations=true;updateStationList();
 lon=s.longitude*radians;lat=s.latitude*radians;target=1.8;norwayFocus=true;
 describeStation();setMenu(false);
}
function updateStationList(){
 $('station-none').setAttribute('aria-pressed',groundStations.every(s=>!s.visible));
 $('station-all').setAttribute('aria-pressed',groundStations.every(s=>s.visible));
 for(const s of groundStations){if(s.checkbox)s.checkbox.checked=s.visible;if(s.button)s.button.setAttribute('aria-pressed',s===activeStation);}
}
function setStationVisibility(visible){
 groundStations.forEach(s=>s.visible=visible);showStations=visible;
 if(!visible&&activeStation)clearSatellite(false);
 updateStationList();
}
function initializeStations(){
 $('stations-menu').onclick=()=>{const open=$('stations-menu').getAttribute('aria-expanded')!=='true';switchCatalog('stations');setMenu(open);};
 $('station-none').onclick=()=>setStationVisibility(false);
 $('station-all').onclick=()=>setStationVisibility(true);
 for(const [name,c] of Object.entries(stationCategories)){
  const group=document.createElement('section');group.className='station-group';group.style.setProperty('--station-color',c.color);
  const heading=document.createElement('h3');heading.textContent=name;group.append(heading);
  for(const s of groundStations.filter(s=>s.category===name)){
   const row=document.createElement('div');row.className='station-row';
   const b=document.createElement('button');b.className='sat';b.style.setProperty('--dot',c.color);b.innerHTML='<b aria-hidden="true"></b><span></span>';b.lastChild.textContent=s.name;b.setAttribute('aria-pressed','false');b.onclick=()=>selectStation(s);s.button=b;row.append(b);group.append(row);
   const marker=document.createElement('button');marker.className='ground-marker';marker.style.setProperty('--station-color',c.color);marker.innerHTML='<i aria-hidden="true"></i><span></span>';marker.lastChild.textContent=s.name;marker.setAttribute('aria-label','Åpne bakkestasjonen '+s.name);marker.onclick=()=>selectStation(s);$('places').append(marker);s.marker=marker;s.position=surfacePoint(s.latitude,s.longitude);
  }
  $('station-list').append(group);
 }
}
function positionStations(){
 const w=mount.clientWidth,h=mount.clientHeight,occupied=[];
 const ordered=[...groundStations].sort((a,b)=>(b===activeStation)-(a===activeStation));
 for(const s of ordered){
  const v=s.position.clone().multiplyScalar(1.004).project(camera),x=(v.x+1)*w/2,y=(1-v.y)*h/2;
  const visible=showStations&&s.visible&&renderer&&s.position.dot(camera.position)>1.007&&v.z<1&&x>10&&x<w-10&&y>12&&y<h-12;
  s.marker.hidden=!visible;if(!visible)continue;
  s.marker.style.transform='translate('+Math.round(x)+'px,'+Math.round(y)+'px)';
  const overlap=occupied.some(p=>Math.abs(p.x-x)<100&&Math.abs(p.y-y)<24);
  s.marker.classList.toggle('icon-only',overlap);s.marker.classList.toggle('selected',s===activeStation);
  s.marker.classList.toggle('align-left',x>w-110);
  if(!overlap)occupied.push({x,y});
 }
}

Object.assign(groundStations.find(s=>s.name==="Svalbard"),{"photo": "media/station-svalsat.jpg", "photoSource": "https://www.ksat.no/news/news-archive/2023/spectacular-drone-footage-from-svalsat-the-ksat-svalbard-ground-station/", "photoCredit": "Foto: KSAT"});
Object.assign(groundStations.find(s=>s.name==="Troll"),{"photo": "media/station-trollsat.jpg", "photoSource": "https://www.ksat.no/news/news-archive/2020/antarctica-day-2020/", "photoCredit": "Foto: KSAT"});
Object.assign(groundStations.find(s=>s.name==="Nittedal"),{"photo": "media/station-nittedal.jpg", "photoSource": "https://spacenorway.com/infrastructure/ground-services/nittedal-teleport/", "photoCredit": "Foto: Space Norway"});
Object.assign(groundStations.find(s=>s.name==="Ny-\u00c5lesund"),{"photo": "media/station-ny-alesund.jpg", "photoSource": "https://kartverket.no/om-kartverket/nyheter/alle/2025/april/geodesi-avtale-signert-av-kartverket-og-fn", "photoCredit": "Foto: Bjørn-Owe Holmberg / Kartverket"});
