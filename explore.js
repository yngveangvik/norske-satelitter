const places = [
 ['Andøya Spaceport',69.10839,15.58937],
 ['Oslo',59.9139,10.7522],['Bergen',60.3913,5.3221],
 ['Stavanger',58.9700,5.7331],['Kristiansand',58.1467,7.9956],
 ['Ålesund',62.4722,6.1549],['Trondheim',63.4305,10.3951],
 ['Bodø',67.2804,14.4049],['Tromsø',69.6492,18.9553]
];
const radians = Math.PI / 180;
const aisSatellites = new Set([62702,42826,42828,48272,68454]);
const comparison = [62702,60422,40613];
const arcticPair = [60422,60423];
const arcticSource = 'https://spacenorway.com/infrastructure/satellite-fleet/asbm-1-asbm-2/';
const modes = ['coverage','pass-mode','compare','follow','arctic'];
let viewMode = '', nextPass = null, passKey = '', norwayFocus = false, showPlaces = true;
function surfacePoint(lat,lon) {
 const a=lat*radians,b=lon*radians;
 return new THREE.Vector3(Math.cos(a)*Math.cos(b),Math.sin(a),-Math.cos(a)*Math.sin(b));
}
function extraSatellites() {
 const ids = viewMode==='compare' ? comparison : viewMode==='arctic' ? arcticPair : null;
 return ids ? ids.map(id=>fleet.find(s=>s.id===id)) : null;
}
function configureView(mode) {
 viewMode=mode;
 if(mode==='follow')followGap=active.type==='LEO'?.30:.85;
 norwayFocus=false;
 orbitDirty=true;
 passKey='';
 modes.forEach(id=>$(id).setAttribute('aria-pressed',id===mode));
 $('view-info').hidden=!mode;
 $('pass-tools').hidden=mode!=='pass-mode';
 $('view-source').hidden=mode!=='arctic';
 $('view-source').href=arcticSource;
 if (mode==='arctic'||mode==='compare') {
  filter='Alle';
  document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.filter==='Alle'));
  select(fleet.find(s=>s.id===(mode==='arctic'?60422:62702)),true);
  lat=mode==='arctic'?1.15:.66;lon=.26;
  target=Math.max(24,24/Math.max(.54,camera.aspect));
 } else if (mode) {
  target=active.type==='LEO'?3.6:Math.max(22,22/Math.max(.54,camera.aspect));
  if(mode==='pass-mode') centerPlace(false);
 } else {
  target=active.type==='LEO'?3.6:Math.max(22,22/Math.max(.54,camera.aspect));
 }
 explainView();
}
function centerPlace(close) {
 const [,a,b]=close?['Norge',63.8,11.5]:places[Number($('observer').value)];
 lon=b*radians;lat=a*radians;target=close?1.52:3.6;norwayFocus=close;
}
function initializeExploration() {
 const menu=$('menu-toggle'), aside=$('satellittmeny');
 menu.onclick=()=>{
  const closed=$('layout').classList.toggle('menu-closed');
  aside.inert=closed;
  menu.setAttribute('aria-expanded',!closed);
  menu.textContent=closed?'Vis satellitter':'Skjul satellitter';
 };
 for(const [id,[name,lat,lon]] of places.entries()) {
  const label=document.createElement('span');
  label.className='place'+(id===0?' spaceport':'');
  label.textContent=name;
  $('places').append(label);
  const option=new Option(name,id);
  $('observer').add(option);
  placeLabels.push({label,position:surfacePoint(lat,lon)});
 }
 $('observer').value='8';
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
 $('norway').onclick=()=>{if(viewMode==='follow')configureView('');centerPlace(true);showPlaces=true;$('place-toggle').setAttribute('aria-pressed','true');};
 $('place-toggle').onclick=()=>{showPlaces=!showPlaces;$('place-toggle').setAttribute('aria-pressed',showPlaces);};
}
const placeLabels=[];
const projected=new THREE.Vector3();
function positionPlaces() {
 const width=mount.clientWidth,height=mount.clientHeight;
 for(const [index,{label,position}] of placeLabels.entries()){
  projected.copy(position).multiplyScalar(1.004).project(camera);
  const x=(projected.x+1)*width/2, y=(1-projected.y)*height/2;
  const visible=showPlaces&&renderer&&position.dot(camera.position)>1.007&&projected.z<1&&x>3&&x<width-12&&y>0&&y<height&&(index===0||camera.position.length()<2.35);
  label.hidden=!visible;
  if(visible) {
   const left = x>width-115 || (norwayFocus && [2,3,5,7].includes(index));
   const dx=left ? -label.offsetWidth-11 : 9;
   label.classList.toggle('label-left',left);
   label.style.transform='translate('+Math.round(x+dx)+'px,'+Math.round(y-6)+'px)';
  }
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
 if(viewMode==='coverage'){
  field.textContent=aisSatellites.has(active.id)
   ? 'Det blå feltet viser hvor satellitten er minst 10° over horisonten. Det illustrerer mulig AIS-mottak. Faktisk mottak avhenger blant annet av signal og antenne.'
   : arcticPair.includes(active.id)
    ? 'Det blå feltet markerer området nord for 65° N som ASBM-systemet er laget for å dekke. Velg «ASBM i Arktis» for å se begge satellittene.'
    : 'Velg en AIS-satellitt eller ASBM for å se en illustrasjon av dekningen.';
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
