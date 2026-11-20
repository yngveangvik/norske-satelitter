let cardMode='compact',cardIdentity='',selectedLabel;
function setCardMode(mode){
 if(mode==='expanded'){configureView('',true);track=false;orbitDirty=true;$('track').setAttribute('aria-pressed','false');closePads();}
 cardMode=mode;const f=$('facts');f.dataset.size=mode;
 $('more-info').setAttribute('aria-expanded',mode==='expanded');$('more-info').textContent='Mer informasjon';$('more-info').setAttribute('aria-pressed',mode==='expanded');
 $('card-extra').hidden=mode!=='expanded';$('card-restore').textContent=$('name').textContent+' · ⌃';
 $('card-restore').hidden=mode!=='minimized';
}
function syncCard(){
 const identity=active?'s'+active.id:activeStation?'g'+activeStation.name:activePort?'p'+activePort:'';
 if(identity!==cardIdentity){closePads();cardIdentity=identity;setCardMode('compact');if(identity)$('explore-toggle').setAttribute('aria-expanded','false');}
 document.body.classList.toggle('has-selection',Boolean(identity));
 $('sat-actions').hidden=!active;$('view-info').hidden=!active||!['coverage','pass-mode'].includes(viewMode);
 $('pads-toggle').hidden=!activePort;$('upcoming-launch').hidden=!activePort||!spaceports[activePort]?.showUpcoming;
 $('facts').dataset.kind=active?'satellite':activePort?'port':'station';
 $('card-restore').textContent=$('name').textContent+' · ⌃';
}
function initializeWorld(){
 const f=$('facts');
 const handle=document.createElement('button');handle.id='card-handle';handle.type='button';handle.setAttribute('aria-label','Minimer infokort');handle.textContent='⌄';f.prepend(handle);handle.onclick=()=>setCardMode('minimized');
 const restore=document.createElement('button');restore.id='card-restore';restore.hidden=true;f.append(restore);restore.onclick=()=>setCardMode('compact');
 const extra=document.createElement('div');extra.id='card-extra';extra.hidden=true;
 extra.append($('organizations'),$('launch-details'),f.querySelector('.fact-footnote'));f.append(extra);
 const actions=document.createElement('div');actions.id='sat-actions';actions.append($('coverage'),$('pass-mode'),$('follow'),$('track'));f.insertBefore(actions,extra);f.insertBefore($('view-info'),extra);
 const more=document.createElement('button');more.id='more-info';more.textContent='Mer informasjon';more.setAttribute('aria-expanded','false');more.onclick=()=>setCardMode(cardMode==='expanded'?'compact':'expanded');f.insertBefore(more,extra);
 const padPanel=$('port-details').querySelector('details');padPanel.id='pads-panel';padPanel.hidden=true;padPanel.querySelector('summary').hidden=true;
 const padButton=document.createElement('button');padButton.id='pads-toggle';padButton.type='button';padButton.textContent='Oppskytingsramper';padButton.setAttribute('aria-expanded','false');padButton.setAttribute('aria-pressed','false');padButton.setAttribute('aria-controls','pads-panel');
 padButton.onclick=()=>{const open=!padPanel.open;setCardMode('compact');padPanel.open=open;padPanel.hidden=!open;padButton.setAttribute('aria-expanded',open);padButton.setAttribute('aria-pressed',open);};
 const grid=document.createElement('div');grid.id='card-actions';f.insertBefore(grid,actions);grid.append(actions,padButton,more);
 const upcoming=document.createElement('div');upcoming.id='upcoming-launch';upcoming.append($('next-launch'),$('launch-updated'));extra.prepend(upcoming);
 const oldConfigure=configureView;configureView=function(mode,keepCamera=false){if(mode){setCardMode('compact');closePads();track=false;orbitDirty=true;$('track').setAttribute('aria-pressed','false');}oldConfigure(mode,keepCamera);};
 $('track').onclick=()=>{const enabled=!track;setCardMode('compact');closePads();configureView('',true);track=enabled;orbitDirty=true;$('track').setAttribute('aria-pressed',track);};
 let startY=null;handle.onpointerdown=e=>{startY=e.clientY;handle.setPointerCapture(e.pointerId);};handle.onpointerup=e=>{if(startY!==null&&e.clientY-startY>35)setCardMode('minimized');startY=null;};
 const oldDescribe=describe;describe=function(){oldDescribe();syncCard();};
 const oldStation=describeStation;describeStation=function(){oldStation();syncCard();};
 const oldPort=describeSpaceport;describeSpaceport=function(){oldPort();syncCard();};
 switchCatalog=function(type){for(const [key,id] of [['satellites','sat-catalog'],['stations','station-catalog']])$(id).hidden=type!==key;$('satellittmeny').dataset.catalog=type;};
 const oldMenu=setMenu;setMenu=function(open){if(open)$('explore-toggle').setAttribute('aria-expanded','false');oldMenu(open);const type=$('satellittmeny').dataset.catalog||'satellites';for(const [id,key] of [['menu-toggle','satellites'],['stations-menu','stations']])$(id).setAttribute('aria-expanded',open&&type===key);};
 for(const [id,p] of Object.entries(spaceports)){
  const marker=document.createElement('button');marker.className='ground-marker port-marker';marker.innerHTML='<i aria-hidden="true"></i><span></span>';marker.lastChild.textContent=p.short;marker.setAttribute('aria-label','Åpne romhavnen '+p.short);marker.onclick=()=>selectSpaceport(id);$('places').append(marker);p.marker=marker;p.position=surfacePoint(p.lat,p.lon);
 }
 const nav=document.createElement('nav');nav.id='object-nav';nav.setAttribute('aria-label','Objekter på kloden');document.body.append(nav);
 const media=matchMedia('(max-width:720px), (orientation:portrait) and (max-width:1024px)');
 const tools=$('explore-tools');
 function group(id,title,ids){const section=document.createElement('section');section.className='menu-group';section.id=id;const heading=document.createElement('h3');heading.textContent=title;section.append(heading);for(const key of ids)section.append($(key));tools.append(section);return section;}
 group('menu-views','Utsnitt',['overview']);
 group('menu-layers','Visning',['place-toggle','all-orbits']);
 group('menu-learn','Utforsk',['orbit-guide']);
 const timeGroup=group('menu-time','Tid',[]);
 const zoomGroup=group('menu-zoom','Zoom',[]);
 function arrange(){
  const parent=media.matches?nav:$('header-actions');for(const id of ['menu-toggle','stations-menu'])parent.append($(id));
  $('header-actions').append($('explore'));
  const stage=$('stage'),timebar=document.querySelector('.timebar'),zoom=document.querySelector('.view-controls');
  (media.matches?timeGroup:stage).append(timebar);(media.matches?zoomGroup:stage).append(zoom);(media.matches?timeGroup:stage).append($('clock'));
  timeGroup.hidden=zoomGroup.hidden=!media.matches;
 }
 media.addEventListener('change',arrange);arrange();$('place-toggle').textContent='Stedsnavn';
 $('explore-toggle').onclick=()=>{const open=$('explore-toggle').getAttribute('aria-expanded')!=='true';if(open)setMenu(false);$('explore-toggle').setAttribute('aria-expanded',open);};
 document.addEventListener('pointerdown',e=>{if(!e.target.closest('#explore'))$('explore-toggle').setAttribute('aria-expanded','false');if(!e.target.closest('#satellittmeny,#menu-toggle,#stations-menu'))setMenu(false);});
 for(const id of ['overview'])$(id).addEventListener('click',()=>$('explore-toggle').setAttribute('aria-expanded','false'));
 $('card-handle').innerHTML='<span class="drag-grip"></span><span aria-hidden="true">⌄</span>';
 selectedLabel=document.createElement('div');selectedLabel.id='selected-satellite';selectedLabel.innerHTML='<i></i><span></span>';$('places').append(selectedLabel);
 syncCard();
}
function positionWorld(){
 const w=mount.clientWidth,h=mount.clientHeight,occupied=[];
 for(const [id,p] of Object.entries(spaceports).sort((a,b)=>(b[0]===activePort)-(a[0]===activePort))){
  if(!p.marker)continue;const v=p.position.clone().multiplyScalar(1.004).project(camera),x=(v.x+1)*w/2,y=(1-v.y)*h/2;
  const visible=p.visible&&renderer&&p.position.dot(camera.position)>1.007&&v.z<1&&x>10&&x<w-10&&y>10&&y<h-10;p.marker.hidden=!visible;if(!visible)continue;
  p.marker.style.transform='translate('+x+'px,'+y+'px)';p.marker.classList.toggle('selected',id===activePort);p.marker.classList.toggle('icon-only',id!==activePort&&(camera.position.length()>2.5||occupied.some(q=>Math.abs(q.x-x)<110&&Math.abs(q.y-y)<25)));p.marker.classList.toggle('align-left',x>w-130);occupied.push({x,y});
 }
 if(!selectedLabel)return;
 const visible=Boolean(active?.marker.visible);selectedLabel.hidden=!visible;if(!visible)return;
 const pos=active.marker.position,dir=pos.clone().sub(camera.position),raydir=dir.clone().normalize(),near=-camera.position.dot(raydir),closest=camera.position.clone().addScaledVector(raydir,Math.max(0,near));
 const hidden=near>0&&near<dir.length()&&closest.length()<1;
 const v=pos.clone().project(camera);selectedLabel.hidden=hidden||v.z>1||Math.abs(v.x)>1||Math.abs(v.y)>1;
 selectedLabel.style.transform='translate('+((v.x+1)*w/2)+'px,'+((1-v.y)*h/2)+'px)';selectedLabel.lastChild.textContent=active.name;
}

function selectedScreenExclusion(){
 const obj=active?.marker.visible?active.marker.position:activeStation?.position||spaceports[activePort]?.position;
 if(!obj)return null;const v=obj.clone().project(camera);if(v.z>1)return null;return {x:(v.x+1)*mount.clientWidth/2,y:(1-v.y)*mount.clientHeight/2};
}
function frameCardOffset(){
 const f=$('facts'),w=mount.clientWidth,h=mount.clientHeight;
 if(!w||!h)return;
 let dx=0,dy=0;
 if(!f.hidden&&cardMode!=='minimized'&&cardMode!=='expanded'){
  const mobile=matchMedia('(max-width:720px), (orientation:portrait) and (max-width:1024px)').matches;
  if(mobile)dy=-Math.min(f.offsetHeight,h*.55)/2;else dx=-Math.min(f.offsetWidth+20,w*.45)/2;
 }
 if(dx||dy)camera.setViewOffset(w,h,-dx,-dy,w,h);else if(camera.view?.enabled)camera.clearViewOffset();
}

function closePads(){const panel=$('pads-panel'),button=$('pads-toggle');if(panel){panel.open=false;panel.hidden=true;}if(button){button.setAttribute('aria-expanded','false');button.setAttribute('aria-pressed','false');}}
