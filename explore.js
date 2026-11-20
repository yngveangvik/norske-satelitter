const places = [["New York", 40.7128, -74.006, 1], ["London", 51.5074, -0.1278, 1], ["Paris", 48.8566, 2.3522, 1], ["Washington D.C.", 38.9072, -77.0369, 1], ["Los Angeles", 34.0522, -118.2437, 1], ["Tokyo", 35.6762, 139.6503, 1], ["Beijing", 39.9042, 116.4074, 1], ["Shanghai", 31.2304, 121.4737, 1], ["Hongkong", 22.3193, 114.1694, 1], ["Singapore", 1.3521, 103.8198, 1], ["Dubai", 25.2048, 55.2708, 1], ["Delhi", 28.6139, 77.209, 1], ["Mumbai", 19.076, 72.8777, 1], ["São Paulo", -23.5505, -46.6333, 1], ["Cairo", 30.0444, 31.2357, 1], ["Houston", 29.7604, -95.3698, 1], ["Pasadena", 34.1478, -118.1445, 1], ["Berlin", 52.52, 13.405, 2], ["Roma", 41.9028, 12.4964, 2], ["Madrid", 40.4168, -3.7038, 2], ["Brussel", 50.8503, 4.3517, 2], ["Amsterdam", 52.3676, 4.9041, 2], ["Frankfurt", 50.1109, 8.6821, 2], ["Istanbul", 41.0082, 28.9784, 2], ["Moskva", 55.7558, 37.6173, 2], ["Chicago", 41.8781, -87.6298, 2], ["San Francisco", 37.7749, -122.4194, 2], ["Toronto", 43.6532, -79.3832, 2], ["Mexico by", 19.4326, -99.1332, 2], ["Seoul", 37.5665, 126.978, 2], ["Bangkok", 13.7563, 100.5018, 2], ["Jakarta", -6.2088, 106.8456, 2], ["Sydney", -33.8688, 151.2093, 2], ["Johannesburg", -26.2041, 28.0473, 2], ["Lagos", 6.5244, 3.3792, 2], ["Buenos Aires", -34.6037, -58.3816, 2], ["Rio de Janeiro", -22.9068, -43.1729, 2], ["Huntsville", 34.7304, -86.5861, 2], ["Oslo", 59.9139, 10.7522, 3], ["Genève", 46.2044, 6.1432, 3], ["Reykjavik", 64.1466, -21.9426, 3], ["Tromsø", 69.6492, 18.9553, 3], ["Longyearbyen", 78.2232, 15.6469, 3], ["Nuuk", 64.1814, -51.6941, 3], ["Anchorage", 61.2181, -149.9003, 3], ["Rotterdam", 51.9244, 4.4777, 3], ["Panama by", 8.9824, -79.5199, 3], ["Honolulu", 21.3099, -157.8581, 3], ["Nairobi", -1.2921, 36.8219, 3], ["Addis Abeba", 9.03, 38.74, 3], ["Bogotá", 4.711, -74.0721, 3], ["Manila", 14.5995, 120.9842, 3], ["Taipei", 25.033, 121.5654, 3], ["Riyadh", 24.7136, 46.6753, 3], ["Melbourne", -37.8136, 144.9631, 3], ["Brasília", -15.7939, -47.8828, 3], ["Cape Town", -33.9249, 18.4241, 3], ["Peenemünde", 54.137, 13.768, 3], ["Koroljov", 55.916, 37.854, 3], ["Darmstadt", 49.8728, 8.6512, 3], ["Noordwijk", 52.239, 4.447, 3]];
const radians = Math.PI / 180;
const aisSatellites = new Set([62702,42826,42828,48272,68454]);
const comparison = [62702,60422,40613];
const arcticPair = [60422,60423];
const arcticSource = 'https://spacenorway.com/infrastructure/satellite-fleet/asbm-1-asbm-2/';
const modes = ['coverage','pass-mode','follow'];
let viewMode = '', nextPass = null, passKey = '', norwayFocus = false, showPlaces = true;
function surfacePoint(lat,lon) {
 const a=lat*radians,b=lon*radians;
 return new THREE.Vector3(Math.cos(a)*Math.cos(b),Math.sin(a),-Math.cos(a)*Math.sin(b));
}
function extraSatellites(){return null;}
function configureView(mode, keepCamera=false) {
 if(guideOpen)closeOrbitGuide();
 const wasFollowing=viewMode==='follow'||coverageFollow;
 coverageFollow=mode==='coverage';coverageFree=false;
 if(mode==='coverage'&&!wasFollowing)followGap=active.type==='LEO'?.30:.85;
 viewMode=mode;
 if(mode==='follow')followGap=active.type==='LEO'?.30:.85;
 norwayFocus=false;
 orbitDirty=true;
 passKey='';
 modes.forEach(id=>$(id).setAttribute('aria-pressed',id===mode));
 $('view-info').hidden=!['coverage','pass-mode'].includes(mode);
 $('pass-tools').hidden=mode!=='pass-mode';
 $('view-source').hidden=mode!=='arctic';
 $('view-source').href=arcticSource;
 if(mode==='coverage'){
  // Keep the selected satellite under the camera without changing zoom.
 } else if (mode) {
  target=active.type==='LEO'?3.6:Math.max(22,22/Math.max(.54,camera.aspect));
  if(mode==='pass-mode') centerPlace(false);
 } else if(!keepCamera) {
  target=!active||active.type==='LEO'?3.6:Math.max(22,22/Math.max(.54,camera.aspect));
 }
 explainView();
}
function centerPlace(close) {
 const [,a,b]=close?['Norge',63.8,11.5]:places[Number($('observer').value)];
 lon=b*radians;lat=a*radians;target=close?1.52:3.6;norwayFocus=close;
}
function setMenu(open){
 const menu=$('menu-toggle');
 $('layout').classList.toggle('menu-closed',!open);
 $('satellittmeny').inert=!open;
 const stationMode=$('satellittmeny').dataset.catalog==='stations';
 menu.setAttribute('aria-expanded',open&&!stationMode);
 $('stations-menu').setAttribute('aria-expanded',open&&stationMode);
 menu.textContent='Satellitter';
}
function initializeExploration() {
 const menu=$('menu-toggle');
 menu.onclick=()=>{const open=menu.getAttribute('aria-expanded')==='false';switchCatalog('satellites');setMenu(open);};
 const explore=$('explore-toggle');
 const mobileLayout=matchMedia('(max-width:720px), (orientation:portrait) and (max-width:1024px)');
 const controls=document.querySelector('.view-controls');
 const timebar=document.querySelector('.timebar');
 const stage=$('stage');
 explore.onclick=()=>explore.setAttribute('aria-expanded',explore.getAttribute('aria-expanded')==='false');
 document.addEventListener('keydown',event=>{
  if(event.key!=='Escape')return;
  if(menu.getAttribute('aria-expanded')==='true'||$('stations-menu').getAttribute('aria-expanded')==='true'){setMenu(false);menu.focus();}
  else if(explore.getAttribute('aria-expanded')==='true'){explore.setAttribute('aria-expanded','false');explore.focus();}
  else if(guideOpen){closeOrbitGuide();}
  else if(active||activeStation||activePort)$('close-facts').click();
 });
 for(const [id,[name,lat,lon]] of places.entries()) {
  const portId=null;
  const label=document.createElement(portId?'button':'span');
  if(portId){label.type='button';label.onclick=()=>selectSpaceport(portId);label.setAttribute('aria-label','Åpne '+name);}
  label.className='place';
  label.textContent=name;
  $('places').append(label);
  const option=new Option(name,id);
  $('observer').add(option);
  placeLabels.push({label,position:surfacePoint(lat,lon)});
 }
 $('observer').value=String(places.findIndex(p=>p[0]==='Oslo'));
 $('observer').onchange=()=>{passKey='';centerPlace(false);explainView();};
 $('jump').onclick=()=>{
  if(!nextPass)return;
  time=nextPass.peak;
  paused=true;
  $('pause').textContent='Spill av';
  orbitDirty=true;
  centerPlace(false);
  explainView();
 };
 modes.forEach(id=>$(id).onclick=()=>configureView(viewMode===id?'':id));
 $('place-toggle').onclick=()=>{showPlaces=!showPlaces;$('place-toggle').setAttribute('aria-pressed',showPlaces);};
}
const placeLabels=[];
const projected=new THREE.Vector3();
function positionPlaces(){
 const w=mount.clientWidth,h=mount.clientHeight,occupied=[],selected=selectedScreenExclusion();
 for(const [i,{label,position}] of placeLabels.entries()){
  const p=position.clone().multiplyScalar(1.004).project(camera),x=(p.x+1)*w/2,y=(1-p.y)*h/2;
  const threshold=[0,2.7,1.95,1.48][places[i][3]];
  let visible=showPlaces&&renderer&&camera.position.length()<threshold&&position.dot(camera.position)>1.007&&p.z<1&&x>5&&x<w-20&&y>5&&y<h-22;
  if(selected&&Math.abs(x-selected.x)<150&&Math.abs(y-selected.y)<35)visible=false;
  const width=label.offsetWidth||places[i][0].length*7+12;
  if(visible&&occupied.some(r=>x<r.x+r.w+8&&x+width>r.x-8&&Math.abs(y-r.y)<22))visible=false;
  label.hidden=!visible;
  if(visible){occupied.push({x,y,w:width});label.classList.remove('label-left');label.style.transform='translate('+Math.round(Math.min(x+8,w-width-5))+'px,'+Math.round(y-6)+'px)';}
 }
}
function findPass(sat, place, from) {
 if(!sat.record)return null;
 const [,lat,lon]=place;
 const observer={latitude:lat*radians,longitude:lon*radians,height:0};
 const limit=10*radians, step=30000;
 const elevation=ms=>{
  const at=new Date(ms),state=satellite.propagate(sat.record,at);
  return state?.position?satellite.ecfToLookAngles(observer,satellite.eciToEcf(state.position,satellite.gstime(at))).elevation:-Math.PI;
 };
 const crossing=(a,b,rising)=>{
  while(b-a>1000){
   const mid=(a+b)/2;
   if((elevation(mid)>=limit)===rising)b=mid;
   else a=mid;
  }
  return b;
 };
 const first=elevation(from);
 let start=first>=limit?from:null,peak=start,best=first;
 for(let ms=from+step;ms<=from+3*86400000;ms+=step){
  const next=elevation(ms);
  if(start===null&&next>=limit){start=crossing(ms-step,ms,true);peak=ms;best=next;}
  if(start!==null){
   if(next>best){best=next;peak=ms;}
   if(next<limit){
    const end=crossing(ms-step,ms,false);
    let a=Math.max(start,peak-step),b=Math.min(end,peak+step);
    while(b-a>1000){
     const l=(2*a+b)/3,r=(a+2*b)/3;
     if(elevation(l)<elevation(r))a=l;else b=r;
    }
    peak=(a+b)/2;
    return {start,end,peak,elevation:elevation(peak)/radians};
   }
  }
 }
 return start!==null ? {continuous:true} : null;
}
function explainView(){
 const field=$('view-message');
 $('payload-options').hidden=viewMode!=='coverage';
 if(viewMode==='coverage'){
  syncPayload();field.textContent=payloadExplanation();
 }
 if(viewMode==='compare')field.textContent='Samme målestokk: NorSat-4 (lilla), ASBM 1 (blå) og THOR 7 (hvit). Spol fram for å se forskjellen i omløpstid.';
 if(viewMode==='follow')field.textContent='Kameraet følger '+active.name+' mens jorda beveger seg under den.';
 if(viewMode==='arctic'){
  const names=arcticPair.map(id=>fleet.find(s=>s.id===id)).filter(s=>{
   if(!s.omm)return false;
   const phase=s.omm.MEAN_ANOMALY/360+(time-epoch(s))/(86400000/s.omm.MEAN_MOTION);
   return Math.abs(((phase%1)+1)%1-.5)*24/s.omm.MEAN_MOTION<=5;
  }).map(s=>s.name);
  field.textContent='De to satellittene avløser hverandre for å dekke Arktis. Beregnet nær den øvre delen av banen: '+(names.join(' og ')||'–')+'. Blått felt: nord for 65° N.';
 }
 if(viewMode==='pass-mode'){
  const place=places[Number($('observer').value)];
  const now=Date.now();
  const key=active.id+' '+active.omm?.EPOCH+' '+place[0]+' '+Math.floor(now/60000);
  if(key!==passKey){passKey=key;nextPass=findPass(active,place,now);}
  $('jump').disabled=!nextPass||nextPass.continuous;
  if(!nextPass){field.textContent=active.record?'Ingen passering over 10° de neste tre døgnene.':'Venter på banedata.';return;}
  if(nextPass.continuous){field.textContent=active.name+' ligger over 10° horisontshøyde gjennom hele perioden vi sjekker.';return;}
  const format=new Intl.DateTimeFormat('nb-NO',{timeZone:'Europe/Oslo',weekday:'short',hour:'2-digit',minute:'2-digit'});
  const minutes=Math.ceil(Math.max(0,nextPass.start-now)/60000);
  const when=minutes>=60?Math.floor(minutes/60)+' t '+minutes%60+' min':minutes+' min';
  field.textContent=(minutes?'Om '+when+' · '+format.format(nextPass.start)+' (norsk tid)':'Passeringen pågår nå')+' · Maks '+Math.round(nextPass.elevation)+'° over horisonten.';
 }
}
