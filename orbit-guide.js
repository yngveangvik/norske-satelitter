let guideOpen=false;
const guideLines=[];
const orbitLessons=[
 {name:'LEO · lav jordbane',color:'#a2a2ed',text:'Under ca. 2 000 km. Brukes blant annet til jordobservasjon og AIS. Eksempel: polar bane ved 600 km.',radius:1+600/6378.137,inclination:90},
 {name:'MEO · mellomhøy jordbane',color:'#1bb1b0',text:'Mellom LEO og geostasjonær høyde. Vanlig for navigasjon. Eksemplet ligger ved 20 200 km.',radius:1+20200/6378.137,inclination:55},
 {name:'GEO · geostasjonær bane',color:'#fc8c30',text:'35 786 km over ekvator. Satellitten følger jordrotasjonen og står over samme sted.',radius:1+35786/6378.137,inclination:0},
 {name:'HEO · høyelliptisk bane',color:'#eef1fe',text:'En avlang bane. Satellitten beveger seg saktest lengst fra jorda. Brukes blant annet til dekning i nord, som ASBM.',perigee:1+1000/6378.137,apogee:1+40000/6378.137,inclination:63.4}
];
function guidePoint(lesson,t){
 const a=lesson.radius||(lesson.perigee+lesson.apogee)/2,e=lesson.radius?0:(lesson.apogee-lesson.perigee)/(lesson.apogee+lesson.perigee);
 const x=a*(Math.cos(t)-e),y=a*Math.sqrt(1-e*e)*Math.sin(t),inc=lesson.inclination*Math.PI/180;
 return new THREE.Vector3(x,y*Math.sin(inc),-y*Math.cos(inc));
}
function initializeOrbitGuide(){
 const panel=document.createElement('section');panel.id='orbit-lesson';panel.hidden=true;panel.setAttribute('aria-label','Forklaring av banetyper');
 const close=document.createElement('button');close.textContent='Lukk forklaring';close.onclick=()=>{closeOrbitGuide();clearSatellite();};panel.append(close);
 const note=document.createElement('p');note.textContent='Illustrerte eksempelbaner i samme målestokk. Banene viser ikke satellittenes aktuelle posisjoner.';panel.append(note);
 for(const lesson of orbitLessons){
  const heading=document.createElement('h3');heading.textContent=lesson.name;heading.style.color=lesson.color;const text=document.createElement('p');text.textContent=lesson.text;panel.append(heading,text);
  const points=Array.from({length:257},(_,i)=>guidePoint(lesson,i/256*Math.PI*2));
  const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:lesson.color,transparent:true,opacity:.9}));line.visible=false;scene.add(line);guideLines.push(line);
 }
 const source=document.createElement('a');source.textContent='Kilde: ESA – banetyper';source.href='https://www.esa.int/articles/about-us/directorates/space-transportation/types-of-orbits';source.target='_blank';source.rel='noopener';panel.append(source);$('stage').append(panel);
 $('orbit-guide').onclick=()=>{
  if(guideOpen){closeOrbitGuide();clearSatellite();return;}
  clearSatellite(false);guideOpen=true;panel.hidden=false;$('orbit-guide').setAttribute('aria-pressed','true');
  lat=.55;lon=.65;target=Math.max(24,24/Math.max(.45,camera.aspect));orbitDirty=true;
  $('explore-toggle').setAttribute('aria-expanded','false');setMenu(false);
 };
}
function closeOrbitGuide(){
 if(!guideOpen)return;guideOpen=false;guideLines.forEach(l=>l.visible=false);$('orbit-lesson').hidden=true;$('orbit-guide').setAttribute('aria-pressed','false');orbitDirty=true;
}
function updateOrbitGuide(){guideLines.forEach(l=>l.visible=guideOpen);}
