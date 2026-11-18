const fleet = [
 [62702,'NorSat-4','LEO','Skipsovervåking og teknologiutprøving'],
 [42826,'NorSat-1','LEO','Skipsovervåking og romforskning'],
 [42828,'NorSat-2','LEO','Skipsovervåking og maritim kommunikasjon'],
 [48272,'NorSat-3','LEO','Skipsovervåking og radardeteksjon'],
 [68454,'AISSat-4','LEO','Skipsovervåking for Kystverket'],
 [68490,'Mimir-1','LEO','Teknologiutprøving for Space Norway'],
 [100610,'FramSat-1','LEO','Studentsatellitt · tester solsensor'],
 [-1,'HYPSO-1','LEO','Havobservasjon · banedata utilgjengelige'],
 [-2,'SelfieSat','LEO','Studentsatellitt · brant opp i 2024'],
 [60531,'HYPSO-2','LEO','Havobservasjon for NTNU'],
 [55015,'Birkeland','LEO','Norsk-nederlandsk radardeteksjon'],
 [55093,'Huygens','LEO','Norsk-nederlandsk radardeteksjon'],
 [60422,'ASBM 1','HEO','Bredbånd i Arktis'],
 [60423,'ASBM 2','HEO','Bredbånd i Arktis'],
 [32487,'THOR 5','GEO','TV og datakommunikasjon'],
 [36033,'THOR 6','GEO','TV og datakommunikasjon'],
 [40613,'THOR 7','GEO','TV og bredbånd']
].map(([id,name,type,mission])=>({id,name,type,mission}));

const ownership = {};
const nationalSource='https://romdirektoratet.no/satellitter-infrastruktur-og-statlige-romaktoerer';
for(const id of [62702,42826,42828,48272,68454]){
 ownership[id]={owner:[62702,42826].includes(id)?'Direktoratet for romvirksomhet':'Kystverket',operator:'Statsat (Space Norway)',source:nationalSource};
}
ownership[68454].source='https://www.kystverket.no/nyheter/2024/ny-satellitt-for-havovervakning-bygges-pa-rekordtid/';
for(const id of [68490,60422,60423,32487,36033,40613]){
 ownership[id]={owner:'Space Norway',operator:'Space Norway',source:'https://spacenorway.com/infrastructure/satellite-fleet/'};
}
ownership[68490].source='https://spacenorway.com/projects/our-projects/mimir/';
for(const id of [55015,55093]){
 ownership[id]={owner:'FFI / Nederlands forsvarsdepartement (50/50)',operator:'Norsk drift · norske/nederlandske oppdrag',source:'https://www.ffi.no/forskning/prosjekter/milspace2'};
}
for(const id of [-1,60531]){
 ownership[id]={owner:'NTNU',operator:'NTNU SmallSat Lab',source:'https://www.ntnu.edu/smallsat'};
}
for(const id of [100610,-2]){
 ownership[id]={owner:'Orbit NTNU',operator:'Orbit NTNU',source:id===100610?'https://orbitntnu.com/projects/FramSat-1':'https://nyheter.ntnu.no/ntnu-satelitt-brant-opp-i-atmosfaeren/'};
}

const colors={LEO:'#a2a2ed',HEO:'#7de0ff',GEO:'#eef1fe'};
const types={LEO:'Lav jordbane',HEO:'Høyelliptisk bane',GEO:'Geostasjonær bane'};
const $=id=>document.getElementById(id);
let active=null,filter='Alle',time=Date.now(),rate=1,paused=false,track=false;
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(37,1,0.01,150);
const mount=$('scene');
let renderer;
try {
 renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,2));
 mount.append(renderer.domElement);
} catch {
 mount.style.background='radial-gradient(circle at center,#302747,transparent 65%)';
 $('mode').textContent='3D-visning krever WebGL';
}
const textures = new THREE.TextureLoader();
const dayMap = textures.load('earth.jpg');
const nightMap = textures.load('media/earth-night.png');
dayMap.colorSpace = nightMap.colorSpace = THREE.SRGBColorSpace;
let detailRequested=false;
function loadDayDetail(){
 if(detailRequested || !renderer || renderer.capabilities.maxTextureSize<4096)return;
 detailRequested=true;
 const size=renderer.capabilities.maxTextureSize>=8192?'8k':'4k';
 textures.load('media/earth-day-'+size+'.jpg',map=>{
  map.colorSpace=THREE.SRGBColorSpace;
  map.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
  earth.material.uniforms.dayMap.value=map;
 });
}
const sunlight = new THREE.Vector3(1, 0, 0);
const coverageCenter = new THREE.Vector3();
const coverageLimit = {value: 2};
const sphere = new THREE.SphereGeometry(1, 96, 64);
const earth = new THREE.Mesh(sphere, new THREE.ShaderMaterial({
 uniforms: {
  dayMap: {value: dayMap},
  nightMap: {value: nightMap},
  sunlight: {value: sunlight},
  coverageCenter: {value: coverageCenter},
  coverageLimit
 },
 vertexShader: `
  varying vec2 mapUv;
  varying vec3 globeNormal;
  void main() {
   mapUv = uv;
   globeNormal = normal;
   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`,
 fragmentShader: `
  uniform sampler2D dayMap;
  uniform sampler2D nightMap;
  uniform vec3 sunlight;
  uniform vec3 coverageCenter;
  uniform float coverageLimit;
  varying vec2 mapUv;
  varying vec3 globeNormal;
  void main() {
   float angle = dot(normalize(globeNormal), sunlight);
   float day = smoothstep(-0.09, 0.13, angle);
   vec3 surface = texture2D(dayMap, mapUv).rgb;
   vec3 lights = texture2D(nightMap, mapUv).rgb;
   vec3 lit = surface * (0.64 + 0.36 * max(angle, 0.0));
   vec3 dark = surface * vec3(0.029, 0.038, 0.060) + lights * 0.75;
   vec3 base = mix(dark, lit, day);
   float edge = dot(normalize(globeNormal), coverageCenter) - coverageLimit;
   float mask = smoothstep(-0.002, 0.004, edge);
   float rim = 1.0 - smoothstep(0.0, 0.008, abs(edge));
   gl_FragColor = vec4(mix(base, vec3(0.012, 0.44, 0.74), mask * 0.35 + rim * 0.45), 1.0);
   #include <colorspace_fragment>
  }`
}));
scene.add(earth);
const atmosphere=new THREE.Mesh(new THREE.SphereGeometry(1.018,96,64),new THREE.ShaderMaterial({
 transparent:true,depthWrite:false,
 uniforms:{},vertexShader:'varying vec3 n; varying vec3 v; void main(){vec4 p=modelViewMatrix*vec4(position,1.);n=normalize(normalMatrix*normal);v=normalize(-p.xyz);gl_Position=projectionMatrix*p;}',
 fragmentShader:'varying vec3 n; varying vec3 v; void main(){float g=pow(1.-clamp(dot(normalize(n),normalize(v)),0.,1.),4.);gl_FragColor=vec4(.30,.50,1.,g*.45);}'
}));
scene.add(atmosphere);
const starPoints=[];
for(let i=0;i<1300;i++){
 const z=1-2*(i+.5)/1300, angle=i*2.39996323, r=Math.sqrt(1-z*z);
 starPoints.push(65*r*Math.cos(angle),65*z,65*r*Math.sin(angle));
}
const stars=new THREE.BufferGeometry();
stars.setAttribute('position',new THREE.Float32BufferAttribute(starPoints,3));
scene.add(new THREE.Points(stars,new THREE.PointsMaterial({color:0xb4abde,size:.065,transparent:true,opacity:.65})));
const spriteTexture=textures.load('media/icons/satellite-solid.svg');
spriteTexture.colorSpace=THREE.SRGBColorSpace;
for(const sat of fleet){
 sat.marker=new THREE.Sprite(new THREE.SpriteMaterial({map:spriteTexture,color:colors[sat.type],depthWrite:false,alphaTest:.08}));
 sat.marker.visible=false;
 sat.marker.userData.sat=sat;
 scene.add(sat.marker);
}
const path=new THREE.Line(new THREE.BufferGeometry(),new THREE.LineBasicMaterial({color:0xfc8c30,transparent:true,opacity:.88}));
const ground=new THREE.Line(new THREE.BufferGeometry(),new THREE.LineBasicMaterial({color:0x7de0ff,transparent:true,opacity:.8}));
const comparisonPaths = ['#a2a2ed','#7de0ff','#eef1fe'].map(color =>
 new THREE.Line(new THREE.BufferGeometry(),new THREE.LineBasicMaterial({color,transparent:true,opacity:.82}))
);
scene.add(path,ground,...comparisonPaths);
let lon=.24,lat=1.12,distance=3.6,target=3.6,orbitDirty=true,lastPath=0;
function resize(){
 if(!renderer)return;
 const {clientWidth:w,clientHeight:h}=mount;
 if(!w||!h)return;
 renderer.setSize(w,h,false);
 camera.aspect=w/h;
 camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(mount);
const fmt=(n, digits=0)=>n.toLocaleString('nb-NO',{minimumFractionDigits:digits,maximumFractionDigits:digits});
const epoch=s=>new Date(/Z$/.test(s.omm.EPOCH)?s.omm.EPOCH:s.omm.EPOCH+'Z');
function renderList(){
 $('list').replaceChildren();
 const none=document.createElement('button');
 none.className='sat none';
 none.textContent='Ingen';
 none.setAttribute('aria-pressed',!active);
 none.onclick=()=>{clearSatellite();setMenu(false);};
 $('list').append(none);
 for(const sat of fleet.filter(s=>filter==='Alle'||filter===s.type)){
  const b=document.createElement('button');
  b.className='sat';b.style.setProperty('--dot',colors[sat.type]);b.setAttribute('aria-pressed',sat===active);
  b.innerHTML='<b aria-hidden="true"></b><span></span><small></small>';
  b.children[1].textContent=sat.name;b.children[2].textContent=sat.id===-2?'Avsluttet':sat.id===-1?'Uten bane':sat.type;
  b.onclick=()=>focusSatellite(sat);
  $('list').append(b);
 }
}
let portraitId;
function describe(){
 $('facts').hidden=!active;
 for(const id of ['coverage','pass-mode','follow','track'])$(id).disabled=!active||active.id<0;
 if(!active)return;
 if (portraitId !== active.id) {
  portraitId = active.id;
  const photo = portraits[active.id];
  $('portrait').hidden = !photo;
  $('sat-credit').hidden = !photo;
  if (photo) {
   $('sat-image').src = 'media/' + photo.file + '.webp';
   $('sat-image').alt = photo.alt || active.name;
   $('sat-credit').href = photo.source;
   $('sat-credit').title = photo.credit;
   $('sat-credit').setAttribute('aria-label',photo.credit);
  }
 }
 const org=ownership[active.id];
 $('owner').textContent=org.owner;
 $('operator').textContent=org.operator;
 $('ownership-source').href=org.source;
 $('owner-label').textContent=org.owner===org.operator?'Eier og operatør':'Eier';
 $('operator-row').hidden=org.owner===org.operator;
 $('name').textContent=active.name;
 $('mission').textContent=active.mission;
 $('inc').textContent=active.omm?fmt(active.omm.INCLINATION,2)+'°':'–';
 $('period').textContent=active.omm?fmt(1440/active.omm.MEAN_MOTION,1)+' min':'–';
 $('epoch').textContent=active.omm?'Bane '+epoch(active).toLocaleString('nb-NO',{timeZone:'UTC',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})+' UTC':'Banedata utilgjengelig';
}
function clearSatellite(){
 releaseFollow();
 active=null;
 configureView('',true);
 norwayFocus=false;lon=.24;lat=1.12;target=Math.max(3.6,3.4/Math.max(.45,camera.aspect));
 track=false;
 $('track').setAttribute('aria-pressed','false');
 renderList();
 describe();
}
$('close-facts').onclick=()=>{clearSatellite();$('menu-toggle').focus({preventScroll:true});};

function select(sat, preserveMode=false){
 if(!preserveMode && extraSatellites() && !extraSatellites().includes(sat))configureView('');
 if(viewMode!=='pass-mode')norwayFocus=false;
 passKey='';
 active=sat;target=sat.type==='LEO'?3.6:Math.max(22,22/(camera.aspect||1));orbitDirty=true;
 if(extraSatellites())target=Math.max(24,24/Math.max(.54,camera.aspect));
 renderList();describe();explainView();
}
document.querySelectorAll('[data-filter]').forEach(button=>button.onclick=()=>{
 if(extraSatellites())configureView('');
 filter=button.dataset.filter;
 document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',b===button));
 if(active&&filter!=='Alle'&&active.type!==filter)clearSatellite();
 else renderList();
});
$('track').onclick=()=>{track=!track;$('track').setAttribute('aria-pressed',track);orbitDirty=true;};
$('reset').onclick=()=>{if(viewMode==='follow')configureView('');norwayFocus=false;lon=.24;lat=1.12;target=!active||active.type==='LEO'?3.6:Math.max(22,22/(camera.aspect||1));};
function zoom(factor){
 if(viewMode==='follow'){
  followGap=Math.max(.09,Math.min(10,followGap*factor));
  return;
 }
 target=Math.max(1.35,Math.min(48,target*factor));}
$('plus').onclick=()=>zoom(.8);$('minus').onclick=()=>zoom(1.25);
$('rate').onchange=e=>{rate=Number(e.target.value);};
$('pause').onclick=()=>{paused=!paused;$('pause').textContent=paused?'Spill av':'Pause';};
$('now').onclick=()=>{time=Date.now();rate=1;paused=false;orbitDirty=true;$('rate').value='1';$('pause').textContent='Pause';};
const ray=new THREE.Raycaster();
const pointers=new Map();
let tap=null;
function releaseFollow(){
 if(viewMode!=='follow')return;
 const radial=camera.position.clone().normalize();
 configureView('',true);
 lon=Math.atan2(-radial.z,radial.x);
 lat=Math.asin(radial.y);
 target=distance=camera.position.length()||3.6;
}
function pinchDistance(){
 const [a,b]=pointers.values();
 return Math.hypot(a.x-b.x,a.y-b.y);
}
mount.onpointerdown=e=>{
 if(!renderer||e.button!==0)return;
 pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
 tap=pointers.size===1?{id:e.pointerId,x:e.clientX,y:e.clientY}:null;
 mount.setPointerCapture(e.pointerId);
};
mount.onpointermove=e=>{
 const previous=pointers.get(e.pointerId);
 if(!previous)return;
 const before=pointers.size>=2?pinchDistance():0;
 pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
 if(pointers.size>=2){
  const after=pinchDistance();
  if(before>0&&after>0)zoom(before/after);
  return;
 }
 if(tap&&Math.hypot(e.clientX-tap.x,e.clientY-tap.y)<5)return;
 tap=null;
 releaseFollow();
 norwayFocus=false;
 lon-=(e.clientX-previous.x)*.006;
 lat=Math.max(-1.55,Math.min(1.55,lat+(e.clientY-previous.y)*.006));
};
mount.onpointerup=e=>{
 if(tap?.id===e.pointerId){
  const rect=mount.getBoundingClientRect();
  ray.setFromCamera({x:(e.clientX-rect.left)/rect.width*2-1,y:1-(e.clientY-rect.top)/rect.height*2},camera);
  const hit=ray.intersectObjects([earth,...fleet.filter(s=>s.marker.visible).map(s=>s.marker)])[0];
  if(hit?.object.userData.sat)focusSatellite(hit.object.userData.sat);
 }
 pointers.delete(e.pointerId);
 tap=null;
};
mount.onpointercancel=mount.onlostpointercapture=e=>{
 pointers.delete(e.pointerId);
 if(tap?.id===e.pointerId)tap=null;
};
mount.addEventListener('wheel',e=>{e.preventDefault();zoom(Math.exp(e.deltaY*.001));},{passive:false});
function earthVector(xyz){return new THREE.Vector3(xyz.x/6378.137,xyz.z/6378.137,-xyz.y/6378.137);}
function replaceLine(line,points){
 line.geometry.dispose();
 line.geometry=new THREE.BufferGeometry().setFromPoints(points);
}
function buildPath(sat,date,sidereal,withGround) {
 const orbit=[],surface=[];
 if(!sat?.record)return {orbit,surface};
 const duration=86400000/sat.omm.MEAN_MOTION;
 for(let i=0;i<=200;i++){
  const at=new Date(date.getTime()+duration*i/200);
  const state=satellite.propagate(sat.record,at);
  if(!state?.position)continue;
  orbit.push(earthVector(satellite.eciToEcf(state.position,sidereal)));
  if(withGround)surface.push(earthVector(satellite.eciToEcf(state.position,satellite.gstime(at))).setLength(1.009));
 }
 return {orbit,surface};
}
function updatePaths(date,sidereal){
 orbitDirty=false;lastPath=time;
 const group=extraSatellites();
 comparisonPaths.forEach((line,i)=>{
  line.visible=Boolean(group?.[i]?.record);
  if(line.visible)replaceLine(line,buildPath(group[i],date,sidereal,false).orbit);
 });
 const {orbit,surface}=buildPath(active,date,sidereal,track);
 path.visible=!group&&orbit.length>0;
 ground.visible=track&&surface.length>0;
 if(path.visible)replaceLine(path,orbit);
 if(ground.visible)replaceLine(ground,surface);
}
const center=new THREE.Vector3();
const cameraGoal=new THREE.Vector3();
const look=new THREE.Vector3();
const cameraPosition=new THREE.Vector3();
const direction=new THREE.Vector3();
const goalDirection=new THREE.Vector3();
const rotation=new THREE.Quaternion();
const cameraStep=new THREE.Quaternion();
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
let followGap=.30;
function focusSatellite(sat){
 setMenu(false);
 select(sat);
 if(sat.id<0){configureView('');return;}
 configureView('follow');
 followGap=sat.type==='LEO' ? .30 : .85;
}

let prev=performance.now(),lastText=0;
function frame(real){
 const elapsed=real-prev;
 if(!paused)time+=Math.min(100,elapsed)*rate;
 prev=real;
 const date=new Date(time),sidereal=satellite.gstime(date);
 const [x,y,z] = satellite.sunPos(satellite.jday(date)).rsun;
 sunlight.copy(earthVector(satellite.eciToEcf({x,y,z},sidereal))).normalize();
 distance+=(target-distance)*.09;
 cameraGoal.set(distance*Math.cos(lat)*Math.cos(lon),distance*Math.sin(lat),-distance*Math.cos(lat)*Math.sin(lon));
 center.set(0,0,0);
 const group=extraSatellites();
 const showText=real-lastText>150;
 if(orbitDirty||Math.abs(time-lastPath)>Math.max(10000,rate*180))updatePaths(date,sidereal);
 for(const sat of fleet){
  const visible=sat.record&&(group?group.includes(sat):filter==='Alle'||filter===sat.type);
  const state=visible?satellite.propagate(sat.record,date):null;
  sat.marker.visible=Boolean(state?.position);
  if(state?.position){
   sat.marker.position.copy(earthVector(satellite.eciToEcf(state.position,sidereal)));
   sat.marker.material.color.set(sat===active&&!group?'#fc8c30':colors[sat.type]);
  }
  if(sat===active&&showText){
   $('height').textContent=state?.position?fmt(satellite.eciToGeodetic(state.position,sidereal).height)+' km':'–';
   $('speed').textContent=state?.velocity?fmt(Math.hypot(state.velocity.x,state.velocity.y,state.velocity.z),2)+' km/s':'–';
  }
 }
 if(viewMode==='follow'&&active?.marker.visible){
  const radius=active.marker.position.length();
  cameraGoal.copy(active.marker.position).setLength(radius+followGap);
  center.copy(active.marker.position).setLength(1);
 }else if(norwayFocus){
  center.copy(cameraGoal).normalize().multiplyScalar(.56);
 }
 const blend=reducedMotion.matches ? 1 : 1-Math.exp(-Math.min(65,Math.max(0,elapsed))/125);
 if(cameraPosition.lengthSq()===0||blend===1){
  cameraPosition.copy(cameraGoal);
  look.copy(center);
 }else{
  const oldRadius=cameraPosition.length(),newRadius=cameraGoal.length();
  direction.copy(cameraPosition).normalize();
  goalDirection.copy(cameraGoal).normalize();
  rotation.setFromUnitVectors(direction,goalDirection);
  cameraStep.identity().slerp(rotation,blend);
  cameraPosition.copy(direction.applyQuaternion(cameraStep)).multiplyScalar(oldRadius+(newRadius-oldRadius)*blend);
  look.lerp(center,blend);
 }
 camera.position.copy(cameraPosition);
 for(const sat of fleet)if(sat.marker.visible){
  sat.marker.scale.setScalar(camera.position.distanceTo(sat.marker.position)*(sat===active?.028:.019));
 }

 camera.lookAt(look);
 camera.updateMatrixWorld();
 if(camera.position.length()<2.95)loadDayDetail();
 positionPlaces();
 coverageLimit.value=2;
 if(viewMode==='arctic'||(viewMode==='coverage'&&arcticPair.includes(active?.id))){
  coverageCenter.set(0,1,0);
  coverageLimit.value=Math.sin(65*radians);
 }else if(viewMode==='coverage'&&aisSatellites.has(active.id)&&active?.marker.visible){
  const elevation=10*radians;
  const radius=active.marker.position.length();
  coverageCenter.copy(active.marker.position).normalize();
  coverageLimit.value=Math.cos(Math.acos(Math.min(1,Math.cos(elevation)/radius))-elevation);
 }
 if(showText){
  lastText=real;
  if(viewMode==='arctic'||viewMode==='pass-mode')explainView();
  $('clock').textContent=date.toISOString().slice(0,19).replace('T',' ')+' UTC';
 }
 if(renderer)renderer.render(scene,camera);
 requestAnimationFrame(frame);
}
function accept(rows){
 for(const omm of rows){
  const sat=fleet.find(s=>s.id===Number(omm.NORAD_CAT_ID));
  if(!sat||!omm.EPOCH||!(omm.MEAN_MOTION>0)||sat.omm?.EPOCH>=omm.EPOCH)continue;
  try{sat.record=satellite.json2satrec(omm);sat.omm=omm;}catch{}
 }
 describe();orbitDirty=true;
}
const refreshKey='norway-orbits-v2';
async function init(){
 try{accept(await (await fetch('orbits.json')).json());}catch{}
 let cached;
 try{cached=JSON.parse(localStorage.getItem(refreshKey));if(cached?.rows)accept(cached.rows);}catch{}
 if(Date.now()-(cached?.attempt||0)<7200000)return;
 const initial=fleet.map(s=>s.omm).filter(Boolean);
 const attempt=Date.now();
 try{localStorage.setItem(refreshKey,JSON.stringify({attempt,rows:initial}));}catch{}
 const rows=(await Promise.allSettled(fleet.filter(s=>s.id>0).map(async sat=>{
  const response=await fetch('https://celestrak.org/NORAD/elements/gp.php?CATNR='+sat.id+'&FORMAT=JSON',{signal:AbortSignal.timeout(9000)});
  if(!response.ok)throw new Error('Banedata utilgjengelig');
  return response.json();
 }))).flatMap(result=>result.status==='fulfilled'&&Array.isArray(result.value)?result.value:[]);
 accept(rows);
 try{localStorage.setItem(refreshKey,JSON.stringify({attempt,rows:fleet.map(s=>s.omm).filter(Boolean)}));}catch{}
}
initializeExploration();renderList();describe();resize();init();setInterval(init,7200000);requestAnimationFrame(frame);
