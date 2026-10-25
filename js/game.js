import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

const $ = (id) => document.getElementById(id);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9bd8e8);
scene.fog = new THREE.Fog(0x9bd8e8, 42, 150);
const camera = new THREE.PerspectiveCamera(62, innerWidth/innerHeight, 0.1, 300);
const renderer = new THREE.WebGLRenderer({antialias:true, powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xdff7ff, 0x6b5235, 2.1));
const sun = new THREE.DirectionalLight(0xfff1d1, 2.2);
sun.position.set(-30,45,20); sun.castShadow=true; sun.shadow.mapSize.set(1024,1024); scene.add(sun);

const mat=(color,roughness=0.9)=>new THREE.MeshStandardMaterial({color,roughness});
const M={
  grass:mat(0x76ad62), road:mat(0x454b50), sidewalk:mat(0xc9b58c),
  white:mat(0xf2e9d4), red:mat(0xe75b43), blue:mat(0x397fa0), yellow:mat(0xf5c84c),
  green:mat(0x38845a), pink:mat(0xe78ca4), dark:mat(0x25313a), skin:mat(0xc98b5a),
  roof:mat(0x9b5140), glass:mat(0x91d5e6), leaf:mat(0x35744a), wood:mat(0x9b6c42),
  purple:mat(0x8862a8), orange:mat(0xef8b35)
};
const boxGeo=new THREE.BoxGeometry(1,1,1);
function cube(parent, x,y,z, sx,sy,sz, material, cast=true){
  const o=new THREE.Mesh(boxGeo,material);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=cast;o.receiveShadow=true;parent.add(o);return o;
}
function cylinder(parent,x,y,z,rt,rb,h,material,segments=8){
  const o=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,segments),material);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;
}
function label(text,x,y,z,color='#fff'){
  const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');
  ctx.fillStyle='rgba(5,18,24,.82)';ctx.beginPath();ctx.roundRect(6,6,500,116,22);ctx.fill();
  ctx.strokeStyle='#d7ff4f';ctx.lineWidth=5;ctx.stroke();
  ctx.font='bold 44px sans-serif';ctx.textAlign='center';ctx.fillStyle=color;ctx.fillText(text,256,78);
  const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;
  const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthTest:false}));
  sprite.position.set(x,y,z);sprite.scale.set(5.4,1.35,1);scene.add(sprite);return sprite;
}
const ground=cube(scene,0,-.4,0,180,.6,180,M.grass,false); ground.receiveShadow=true;
// Main roads and lane markings
cube(scene,0,-.06,0,15,.12,180,M.road,false);
cube(scene,0,-.045,0,180,.1,13,M.road,false);
for(let z=-82;z<85;z+=9) cube(scene,0,.015,z,.22,.025,4,M.yellow,false);
for(let x=-82;x<85;x+=9) cube(scene,x,.015,0,4,.025,.22,M.yellow,false);
for(let side of [-1,1]){
  cube(scene,side*8.4,.02,0,1.2,.15,180,M.sidewalk,false);
  cube(scene,0,.02,side*7.4,180,.15,1.2,M.sidewalk,false);
}
// Buildings
function building(x,z,w,d,h,color,name){
  const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
  cube(g,0,h/2,0,w,h,d,mat(color),true);
  cube(g,0,h+.12,0,w+0.35,.25,d+0.35,M.roof);
  const cols=Math.max(2,Math.floor(w/2.3)), rows=Math.max(1,Math.floor(h/2.3));
  for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){
    const wx=-w/2+(i+.5)*w/cols, wy=1.2+j*2.0;
    if(wy<h-.3) cube(g,wx,wy,d/2+.012,.62,.78,.035,Math.random()>.25?M.glass:M.dark,false);
  }
  if(name) label(name,x,h+1.9,z,'#d7ff4f');
  return g;
}
building(-15,-13,10,9,8,0xe7bd77,'CHA ER DOKAN');
building(17,-15,11,10,10,0xe58b73,'SCHOOL');
building(-17,17,12,11,8,0xe8d6ad,'BIYE BARI');
building(17,17,10,10,7,0x83b9a0,'BAZAR');
building(-28,-30,12,10,10,0xd98b64);
building(29,-30,12,10,12,0x78a8c5);
building(-32,30,10,12,7,0xe4c879);
building(31,31,12,10,9,0xc58fc3);
building(-45,-10,12,12,11,0xc9a68b); building(44,7,12,12,8,0xe5b3a0);
// Trees
function tree(x,z){
  cylinder(scene,x,1.1,z,.3,.45,2.2,M.wood,7);
  const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(1.7,1),M.leaf);crown.position.set(x,3,z);crown.castShadow=true;scene.add(crown);
}
for(let i=0;i<42;i++){let x=(Math.random()-.5)*150,z=(Math.random()-.5)*150;if(Math.abs(x)<12||Math.abs(z)<12)continue;tree(x,z);}
// Stall counter + awning
cube(scene,-12,1.0,-8,4,1.4,2.1,M.wood);
cube(scene,-12,2.1,-8,4.6,.22,2.6,M.red);
for(let i=0;i<6;i++)cylinder(scene,-13.4+i*.55,1.85,-8,.18,.18,.23,M.yellow,10);
cube(scene,-12,2.8,-8,4.5,.12,2.5,M.blue);
// School board
cube(scene,17,3,-9.8,5,2.3,.18,M.green);
cube(scene,17,1.5,-9.8,5.4,.18,.25,M.wood);
// wedding tent
for(let x=-21;x<=-13;x+=4){cylinder(scene,x,2.2,12,.12,.12,4,M.pink);cylinder(scene,x,4.3,12,.12,.12,.3,M.yellow);}
const tent=new THREE.Mesh(new THREE.ConeGeometry(6,2,4),M.pink);tent.position.set(-17,5,12);tent.rotation.y=Math.PI/4;scene.add(tent);
cube(scene,-17,.5,13,10,.5,5,M.purple);
// Simple rickshaw
const rickshaw=new THREE.Group();rickshaw.position.set(2,0,3);scene.add(rickshaw);
cube(rickshaw,0,.85,0,2.2,.65,3,M.green);cube(rickshaw,0,1.8,-.15,2.4,.18,2.1,M.red);
for(const x of [-1,1])for(const z of [-1,1]){const wh=new THREE.Mesh(new THREE.TorusGeometry(.35,.1,8,16),M.dark);wh.position.set(x,.42,z*1.1);wh.rotation.y=Math.PI/2;rickshaw.add(wh);}
cube(rickshaw,0,1.3,-.95,1.8,.8,.12,M.yellow);
// Goat
const goat=new THREE.Group();goat.position.set(22,0,24);scene.add(goat);
const fur=mat(0xf3e8cf), horn=mat(0x5b493a);
const body=new THREE.Mesh(new THREE.BoxGeometry(1.35,.8,.65),fur);body.position.y=1;body.castShadow=true;goat.add(body);
const head=new THREE.Mesh(new THREE.BoxGeometry(.58,.58,.55),fur);head.position.set(0,1.42,-.52);head.castShadow=true;goat.add(head);
for(let x of [-.32,.32]){cube(goat,x,.45,0,.16,.75,.16,horn);cylinder(goat,x,1.85,-.5,.08,.03,.45,horn,6);}
for(let x of [-.16,.16]){const eye=new THREE.Mesh(new THREE.SphereGeometry(.055,8,8),M.dark);eye.position.set(x,1.5,-.81);goat.add(eye);}
label('THE MENACE',22,3.1,24,'#ffdf66');
// NPCs: stylized people with bobble heads
function person(x,z,shirt,scale=1){
 const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
 cube(g,0,.95*scale,0,.65*scale,.85*scale,.42*scale,shirt);
 cylinder(g,0,1.62*scale,0,.31*scale,.31*scale,.42*scale,M.skin,10);
 cube(g,0,1.86*scale,0,.64*scale,.12*scale,.48*scale,M.dark);
 for(let sx of [-.2,.2]){cube(g,sx,.38*scale,0,.16*scale,.55*scale,.17*scale,M.dark);}
 return g;
}
const npcs=[
 {g:person(-8, -8,M.orange),name:'FUCHKA UNCLE',x:-8,z:-8,dialogue:'“Bhai, taka agey! Fuchka ki free Wi-Fi naki?”'},
 {g:person(12,-5,M.blue),name:'HEAD SIR',x:12,z:-5,dialogue:'“Homework koi? Confidence diye exam pass hoy na, beta!”'},
 {g:person(-10,15,M.pink),name:'WEDDING UNCLE',x:-10,z:15,dialogue:'“Biryani koi? Ami shudhu photo tulte ashi nai!”'},
 {g:person(25,20,M.red),name:'PARA BHAI',x:25,z:20,dialogue:'“Ami chill achi… kintu amar sandal koi?”'},
];
const player=new THREE.Group();scene.add(player);
const shirt=mat(0x21a4a4), pants=mat(0x28354a);
const torso=new THREE.Mesh(new THREE.BoxGeometry(.72,1,.42),shirt);torso.position.y=1.2;torso.castShadow=true;player.add(torso);
const head=new THREE.Mesh(new THREE.SphereGeometry(.34,12,10),M.skin);head.position.y=2;head.castShadow=true;player.add(head);
const hair=new THREE.Mesh(new THREE.SphereGeometry(.35,12,8,0,Math.PI*2,0,Math.PI*.55),M.dark);hair.position.y=2.12;player.add(hair);
for(let x of [-.22,.22]){cube(player,x,.48,0,.2,.75,.22,pants);}
const arms=[];
for(let x of [-.48,.48]){const a=cube(player,x,1.25,0,.18,.72,.2,shirt);arms.push(a);}
player.position.set(0,0,5);
const targets=[
 {name:'CHA ER DOKAN',x:-12,z:-8,title:'Fuchka Fiasco',text:'Find the fuchka stall and press E / INTERACT.',complete:'You ate the last fuchka! The uncle has activated ULTRA BOKA MODE.',task:'Reach the stall'},
 {name:'RICKSHAW STAND',x:2,z:3,title:'Rickshaw Rush',text:'Find the rickshaw. Get close and interact to start the ride.',complete:'Passenger: “Airport jaben.” You: “Bhai, eta rickshaw, Boeing na!”',task:'Find the rickshaw'},
 {name:'SCHOOL GATE',x:17,z:-15,title:'Last Bench Legends',text:'Visit the school and interact to unleash your legendary excuse.',complete:'“Sir, homework Google Drive-e chilo… internet amar sathe breakup korse.”',task:'Visit the school'},
 {name:'BIYE BARI',x:-17,z:17,title:'Biye Bari Gone Wrong',text:'Visit the wedding tent. Someone has stolen the biryani!',complete:'Biryani recovered! Kintu mama already 4 plate kheye felche.',task:'Find the wedding'},
 {name:'GOAT ZONE',x:22,z:24,title:'Chagol Simulator',text:'Find the goat and interact to begin Para Attack.',complete:'MEHHHH! The goat has become the unofficial chairman of the para.',task:'Find the goat'}
];
let currentMission=0,completed=new Set(),cash=120,chaos=0;
function setMission(i){currentMission=i;const t=targets[i];$('mission-title').textContent=t.title;$('mission-text').textContent=completed.has(i)?'Mission complete! Pick another mission from the list.':t.text;$('mission-progress').style.width=completed.has(i)?'100%':'0%';document.querySelectorAll('[data-mission]').forEach(b=>b.classList.toggle('active',+b.dataset.mission===i));}
document.querySelectorAll('[data-mission]').forEach(b=>b.addEventListener('click',()=>setMission(+b.dataset.mission)));
let toastTimer;
function toast(msg){const el=$('toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2800);}
function openDialog(text){$('dialog-text').textContent=text;$('dialog').classList.remove('hidden');}
$('dialog-close').onclick=()=>$('dialog').classList.add('hidden');
function nearestTarget(){let best=null,dist=999;targets.forEach((t,i)=>{const d=Math.hypot(player.position.x-t.x,player.position.z-t.z);if(d<dist){dist=d;best={...t,i,d};}});return dist<5?best:null;}
function interact(){
 const near=nearestTarget();
 if(!near){toast('Bhai, agey jao! Kichu interesting ekhono pao nai.');return;}
 if(completed.has(near.i)){openDialog('Eta already done, legend! '+near.complete);return;}
 completed.add(near.i);cash+=100;chaos+=25;$('cash').textContent=cash;$('chaos').textContent=chaos;
 $('mission-progress').style.width='100%';$('mission-text').textContent='MISSION COMPLETE! +৳100 · +25 CHAOS';
 openDialog(near.complete+'  Reward: ৳100 and +25 chaos.');
 const next=targets.findIndex((t,i)=>!completed.has(i));
 if(next>=0)setTimeout(()=>setMission(next),900);else toast('ALL MISSIONS COMPLETE! Tumi para’r final boss! 🎉');
}
$('interact-btn').onclick=interact;$('mobile-interact').onclick=interact;
const keys={};addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if(e.key.toLowerCase()==='e'&&!e.repeat)interact();if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
let running=false;$('run-btn').addEventListener('touchstart',e=>{e.preventDefault();running=true;});$('run-btn').addEventListener('touchend',()=>running=false);
document.querySelectorAll('[data-move]').forEach(b=>{
 const k={forward:'w',back:'s',left:'a',right:'d'}[b.dataset.move];
 const start=e=>{e.preventDefault();keys[k]=true;};const end=e=>{e.preventDefault();keys[k]=false;};
 b.addEventListener('touchstart',start,{passive:false});b.addEventListener('touchend',end,{passive:false});b.addEventListener('touchcancel',end,{passive:false});
 b.addEventListener('mousedown',start);b.addEventListener('mouseup',end);b.addEventListener('mouseleave',end);
});
// Drag-to-orbit camera, while movement remains keyboard / on-screen controls.
let yaw=0,dragging=false,lastX=0;
renderer.domElement.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;renderer.domElement.setPointerCapture(e.pointerId);});
renderer.domElement.addEventListener('pointermove',e=>{if(dragging){yaw-=(e.clientX-lastX)*.006;lastX=e.clientX;}});
renderer.domElement.addEventListener('pointerup',()=>dragging=false);
renderer.domElement.addEventListener('pointercancel',()=>dragging=false);
const clock=new THREE.Clock();
let goatDir=1,goatTimer=0;
function animate(){
 requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.04);
 let forward=(keys.w||keys.arrowup?1:0)-(keys.s||keys.arrowdown?1:0);
 let side=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0);
 const len=Math.hypot(forward,side)||1;forward/=len;side/=len;
 const speed=(keys.shift||running?9:5.4);
 const dx=(side*Math.cos(yaw)+forward*Math.sin(yaw))*speed*dt;
 const dz=(-forward*Math.cos(yaw)+side*Math.sin(yaw))*speed*dt;
 player.position.x=THREE.MathUtils.clamp(player.position.x+dx,-78,78);
 player.position.z=THREE.MathUtils.clamp(player.position.z+dz,-78,78);
 if(Math.abs(dx)+Math.abs(dz)>.001){player.rotation.y=Math.atan2(dx,dz);torso.rotation.z=Math.sin(clock.elapsedTime*12)*.04;arms[0].rotation.x=Math.sin(clock.elapsedTime*12)*.45;arms[1].rotation.x=-Math.sin(clock.elapsedTime*12)*.45;}
 goatTimer+=dt;if(goatTimer>2.4){goatTimer=0;goatDir*=-1;}goat.position.x+=goatDir*.5*dt;goat.position.x=THREE.MathUtils.clamp(goat.position.x,19,25);
 const near=nearestTarget();$('location-name').textContent=near?near.name:(Math.abs(player.position.x)<12&&Math.abs(player.position.z)<12?'PARA BAZAAR':'THE PARA');
 $('interact-btn').textContent=near?'INTERACT • '+near.name:'INTERACT';
 const camDistance=8.5,camHeight=5.3;
 const desired=new THREE.Vector3(player.position.x+Math.sin(yaw)*camDistance,player.position.y+camHeight,player.position.z+Math.cos(yaw)*camDistance);
 camera.position.lerp(desired,1-Math.pow(.001,dt));camera.lookAt(player.position.x,1.1,player.position.z);
 renderer.render(scene,camera);
}
setMission(0);animate();
setTimeout(()=>{$('loading').classList.add('done');setTimeout(()=>$('loading').remove(),600);toast('Welcome to the para, legend! Explore and press E near characters.');},700);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));});
