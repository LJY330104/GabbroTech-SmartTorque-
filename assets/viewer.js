import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRMLLoader } from 'three/addons/loaders/VRMLLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Mechanism } from './mechanism.js';

const root = document.getElementById('model-viewer');
if (root) {
  const $ = id => document.getElementById(id);
  const host = $('viewer-canvas'), loading = $('viewer-loading');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, .0001, 100);
  const renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = document.documentElement.dataset.theme==='light'?.94:1.05;
  host.appendChild(renderer.domElement);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  scene.environment = pmrem.fromScene(room,.03).texture;
  room.dispose(); pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xe5f7ff,0x607684,2));
  const key = new THREE.DirectionalLight(0xffffff,3); key.position.set(1,2,3);scene.add(key);
  const rim = new THREE.DirectionalLight(0x91d8f5,2);rim.position.set(-2,1,-2);scene.add(rim);
  const controls = new OrbitControls(camera,renderer.domElement);
  controls.enableDamping=true;controls.dampingFactor=.09;controls.enablePan=true;controls.autoRotateSpeed=1.25;
  const model = new THREE.Group();
  // Flip the complete horizontal tool so its grip is below the powered body.
  model.rotation.set(Math.PI,0,-Math.PI/2);scene.add(model);
  const loader=new VRMLLoader(), fileCache=new Map();
  let manifest,base=[],heads={},retention=[],parts=[],head='scissors',showRetention=true,exploded=false,selected=null,animation=null,selectionBoxes=[];
  let ready=false,scale=.3,assembledBounds,expandedBounds;
  let renderPending=false,dirty=true,listParts=null,listLanguage=-1;
  const materials=new Map();
  let motionDirty=false,lastMotionUI=0;
  const mechanism=new Mechanism(()=>{motionDirty=true;invalidate();});
  function invalidate(){dirty=true;if(!renderPending){renderPending=true;requestAnimationFrame(render);}}
  controls.addEventListener('change',invalidate);
  controls.addEventListener('start',()=>{if(animation){animation.cameraTo=null;animation.targetTo=null;}invalidate();});
  const defaultDirection=new THREE.Vector3(.08,.14,1).normalize();
  const right=new THREE.Vector3().crossVectors(new THREE.Vector3(0,1,0),defaultDirection).normalize();
  const up=new THREE.Vector3().crossVectors(defaultDirection,right).normalize();
  const english=()=>window.siteLanguage?.()!=='zh';
  const t=(en,zh)=>english()?en:zh;
  const clean=name=>name.replace(/\.step$/i,'').replace(/\s*\[只读\].*$/,'');
  const isElectromagnet=part=>/^电磁铁/.test(part.partName||'');
  const selectedParts=()=>selected?(isElectromagnet(selected)?parts.filter(isElectromagnet):[selected]):[];
  const descriptions=[
    [/^电钻/,['Powered tool body','动力工具主体'],['Drive platform','动力平台'],['The powered body provides the grip and mechanical foundation shared by all three quick-change heads.','电钻本体提供握持、动力与结构支撑，通过专用打印适配件连接三种快拆接头。'],'carbon'],
    [/^Arduino/,['Arduino control board','Arduino 控制主板'],['Embedded control','嵌入式控制'],['The Arduino board coordinates voice inputs, torque adjustment, head-lock commands and motor control in the prototype.','Arduino 主板在原型中协调语音输入、扭矩调节、接头锁开关与电机控制指令。'],'pcb'],
    [/^语音/,['Voice-recognition module','语音识别模块'],['Command interface','指令接口'],['The voice module interprets torque adjustment and attachment lock/unlock commands, assisting manual head changes.','语音模块识别调节扭矩与接头锁开关指令，辅助手动更换接头，减少戴手套时的按键操作。'],'pcb'],
    [/LCD/,['LCD display','LCD 显示屏'],['Operator feedback','状态反馈'],['The LCD presents operating settings and system feedback.','LCD 显示扭矩、转速、圈数及系统状态，便于作业前确认参数。'],'screen'],
    [/编码器.*齿轮/,['Encoder gear','编码器齿轮'],['Motion feedback','运动反馈'],['The geared interface transfers shaft rotation to the encoder.','齿轮接口将轴的转动传递至编码器，形成运动反馈链路。'],'gold'],
    [/^编码器/,['Rotary encoder','旋转编码器'],['Motion feedback','运动反馈'],['The encoder measures shaft movement for rotational-speed and turn-count feedback.','编码器采集轴的转动信息，为转速和转动圈数控制提供反馈。'],'sensor'],
    [/^编码轴/,['Encoder shaft','编码轴'],['Drive and feedback','传动与反馈'],['The shaft connects the motion path to the encoder assembly.','编码轴将传动机构与编码器连接，传递旋转运动。'],'metal'],
    [/齿轮舵机座/,['Servo and gear carrier','齿轮舵机座'],['Printed structure','打印结构件'],['This dedicated carrier locates the servo and geared mechanism around the powered platform.','专用打印座用于安装舵机与齿轮机构，并与电钻本体适配。'],'printed'],
    [/力矩盘/,['Torque-disc gear','力矩盘齿轮'],['Drive train','传动机构'],['The drive gear forms part of the controlled mechanical motion path.','力矩盘齿轮构成受控传动机构的一部分，将动力传递至执行结构。'],'gold'],
    [/舵机15齿/,['Servo output gear','舵机输出齿轮'],['Drive train','传动机构'],['The output gear couples servo motion to the working mechanism.','输出齿轮将舵机动作传递至工作机构。'],'gold'],
    [/^舵机/,['Servo motor','舵机'],['Controlled actuation','受控执行'],['The servo supplies controlled movement to the tool-head mechanism.','舵机为工作头机构提供受控动作。'],'sensor'],
    [/电磁铁/,['Electromagnet','电磁铁'],['Locking and actuation','锁止与执行'],['The electromagnet is an independent actuator in the supplied assembly.','电磁铁是原装配中的独立执行部件，与机械锁止和控制机构配合。'],'metal'],
    [/盖板/,['Control enclosure cover','控制系统盖板'],['Printed structure','打印结构件'],['The cover protects and organizes the body-mounted electronics.','盖板为安装在主体上的电子部件提供结构防护与固定。'],'printed'],
    [/快拆座/,['Quick-release adapter','快拆适配座'],['Modular interface','模块化接口'],['The dedicated printed adapter establishes the fit between the working head and the powered body.','专用打印适配座连接工作头与电钻本体，为不同接头建立对应的安装接口。'],'printed'],
    [/固定头/,['Head mounting adapter','工作头安装件'],['Printed adapter','打印适配件'],['The head-specific mounting part aligns and supports the interchangeable mechanism.','与接头匹配的安装件用于定位和支撑可更换工作机构。'],'printed'],
    [/螺丝头装配|螺丝刀/,['Nut-driver head','螺母螺丝刀头'],['Hex fastening','螺母紧固'],['The socket-style working head is designed to turn compatible nuts through the modular drive interface.','套筒式工作头通过模块化传动接口旋拧兼容螺母。'],'metal'],
    [/上钳|下钳/,['Pliers jaw','钳口'],['Gripping and handling','抓取与操作'],['This jaw is part of the supplied quick-change pliers mechanism.','该钳口来自提供的快拆钳装配体，与另一侧钳口配合进行抓取和操作。'],'metal'],
    [/上剪/,['Upper scissor blade','上剪刀片'],['Scissor-head mechanism','剪切接头机构'],['The upper blade from the original supplied assembly pairs with the lower blade through its linkage and mounting adapter.','来自装配体1的上剪刀片，通过推杆机构与下剪刀片配合，并由专用适配件连接动力本体。'],'metal'],
    [/下剪/,['Lower scissor blade','下剪刀片'],['Scissor-head mechanism','剪切接头机构'],['The lower blade completes the scissor mechanism in the original supplied assembly.','来自装配体1的下剪刀片，与上剪刀片配合构成剪切机构。'],'metal'],
    [/推杆/,['Linkage rod','推杆'],['Task-head linkage','接头连杆机构'],['The linkage guides movement within the quick-change head.','推杆在快拆接头内部传递和引导动作。'],'metal'],
    [/^M3x6\+6/,['LCD mounting screw · M3×6+6','LCD 安装螺丝 · M3×6+6'],['LCD mounting hardware','LCD 固定结构'],['An original M3×6+6 mounting fastener from the updated assembly, connecting the LCD support to the powered body. All instances retain their CAD positions.','来自更新装配体的 M3×6+6 安装螺丝，用于连接 LCD 屏幕支撑与电钻本体。所有实例均保留原 CAD 安装位置。'],'metal'],
    [/主轴螺钉|销钉|螺母|M\d/,['Retained fastener','紧固与定位件'],['Retention hardware','固定结构'],['This original CAD fastener or locating part secures the adjacent mechanical components.','原 CAD 中的紧固或定位零件，用于固定相邻机械部件。'],'metal'],
    [/环扣.*弧形/,['Curved tether ring','弧形系留环'],['Anti-loss system','防丢失系统'],['The curved ring provides a connection point for tethering the tool during handling.','弧形系留环为工具提供系留连接点，降低操作过程中漂浮或丢失的风险。'],'metal'],
    [/扣环.*打印/,['Printed retention collar','打印防丢失扣环'],['Body adaptation','本体适配'],['The printed collar adapts the retention structure to the drill body. Its placement here is a fit visualization.','打印扣环将防丢失结构与电钻本体适配；页面中的安装位置为适配展示。'],'printed']
  ];
  function info(name){const hit=descriptions.find(item=>item[0].test(name));return hit?{name:hit[1],category:hit[2],description:hit[3],material:hit[4]}:{name:[clean(name),clean(name)],category:['CAD component','CAD 部件'],description:['An independent part from the supplied CAD assembly.','来自提供的 CAD 装配体的独立零件。'],material:'metal'};}
  function materialFor(kind){
    if(materials.has(kind))return materials.get(kind);
    const settings={metal:{color:0xb7c6cf,metalness:.88,roughness:.23},gold:{color:0xb5a377,metalness:.8,roughness:.27},sensor:{color:0x375466,metalness:.5,roughness:.31},pcb:{color:0x1a6357,metalness:.2,roughness:.39},screen:{color:0x0b2934,metalness:.35,roughness:.13},printed:{color:0x435966,metalness:.15,roughness:.5},carbon:{color:0x25313a,metalness:.26,roughness:.3}};
    const mat=new THREE.MeshStandardMaterial({...settings[kind],side:THREE.DoubleSide});
    if(kind==='carbon')mat.onBeforeCompile=shader=>{
      shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vCarbonPos;').replace('#include <begin_vertex>','#include <begin_vertex>\nvCarbonPos=position;');
      shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vCarbonPos;').replace('#include <color_fragment>','#include <color_fragment>\nvec2 cell=vCarbonPos.xy*500.0; float weave=mod(floor(cell.x)+floor(cell.y),2.0);float filament=sin((weave<0.5?cell.x:cell.y)*18.8496);diffuseColor.rgb*=0.8+0.17*weave+0.06*filament;');
    };materials.set(kind,mat);return mat;
  }
  function swMatrix(a){if(!a)return new THREE.Matrix4();const s=a[12]||1;return new THREE.Matrix4().set(a[0]*s,a[3]*s,a[6]*s,a[9],a[1]*s,a[4]*s,a[7]*s,a[10],a[2]*s,a[5]*s,a[8]*s,a[11],0,0,0,1);}
  async function loadFile(url){if(!fileCache.has(url))fileCache.set(url,fetch(url).then(r=>{if(!r.ok)throw new Error(url);return r.text();}).then(text=>loader.parse(text,'')));return (await fileCache.get(url)).clone(true);}
  async function loadPart(record){
    const object=new THREE.Group(),geometry=await loadFile(record.url),nativeBounds=new THREE.Box3().setFromObject(geometry);
    geometry.updateMatrixWorld(true);
    const selectionBounds=new THREE.Box3(),inverseGeometry=geometry.matrixWorld.clone().invert();
    geometry.traverse(child=>{if(!child.isMesh)return;child.geometry.computeBoundingBox();const localTransform=inverseGeometry.clone().multiply(child.matrixWorld);selectionBounds.union(child.geometry.boundingBox.clone().applyMatrix4(localTransform));});
    object.add(geometry);object.applyMatrix4(swMatrix(record.transform));
    const details=info(record.partName||record.cadName);
    if(/^M3x6\+6/.test(record.partName||'')){const instance=record.cadName.match(/-(\d+)$/)?.[1];if(instance)details.name=details.name.map(name=>`${name} · ${instance}`);}
    geometry.traverse(child=>{if(child.isMesh)child.material=materialFor(details.material);});
    return {...record,object,geometry,nativeBounds,selectionBounds,geometryRestQuaternion:geometry.quaternion.clone(),geometryRestPosition:geometry.position.clone(),...details,start:object.position.clone(),offset:new THREE.Vector3()};
  }
  function corners(box){const a=[];for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z])a.push(new THREE.Vector3(x,y,z));return a;}
  function currentBounds(){const b=new THREE.Box3();parts.forEach(p=>b.union(new THREE.Box3().setFromObject(p.object)));return b;}
  function frame(bounds,reset=false,transition=false){
    if(!bounds||bounds.isEmpty())return;
    const center=bounds.getCenter(new THREE.Vector3());
    const dir=reset?defaultDirection:camera.position.clone().sub(controls.target).normalize();if(!dir.lengthSq())dir.copy(defaultDirection);
    const r=new THREE.Vector3().crossVectors(camera.up,dir).normalize(),u=new THREE.Vector3().crossVectors(dir,r).normalize();
    let w=0,h=0,depth=0;corners(bounds).forEach(p=>{p.sub(center);w=Math.max(w,Math.abs(p.dot(r)));h=Math.max(h,Math.abs(p.dot(u)));depth=Math.max(depth,Math.abs(p.dot(dir)));});
    const rect=host.getBoundingClientRect(),mobile=rect.width<681,panel=mobile?0:document.querySelector('.part-panel').getBoundingClientRect().width+55;
    const usableW=Math.max(rect.width-panel-70,rect.width*.5)/rect.width,usableH=Math.max(rect.height-205,rect.height*.52)/rect.height;
    const vfov=THREE.MathUtils.degToRad(camera.fov*.5),hfov=Math.atan(Math.tan(vfov)*camera.aspect);
    const distance=Math.max(w/(Math.tan(hfov)*usableW),h/(Math.tan(vfov)*usableH)) * 1.1+depth;
    camera.setViewOffset(rect.width,rect.height,panel*.5,mobile?-25:-12,rect.width,rect.height);
    const position=center.clone().addScaledVector(dir,distance);
    if(transition&&animation){animation.cameraFrom=camera.position.clone();animation.cameraTo=position;animation.targetFrom=controls.target.clone();animation.targetTo=center;}
    else{controls.target.copy(center);camera.position.copy(position);}
    camera.near=Math.max(scale*.001,.00001);camera.far=Math.max(distance*20,scale*30);camera.updateProjectionMatrix();
    controls.minDistance=scale*.45;controls.maxDistance=scale*12;if(!transition)controls.update();invalidate();
  }
  function resize(){const {width,height}=host.getBoundingClientRect();if(!width||!height)return;camera.aspect=width/height;camera.updateProjectionMatrix();renderer.setSize(width,height,false);if(ready)frame(exploded?expandedBounds:assembledBounds);invalidate();}
  new ResizeObserver(resize).observe(host);
  function projectBounds(box){let x0=Infinity,x1=-Infinity,y0=Infinity,y1=-Infinity;corners(box).forEach(p=>{const x=p.dot(right),y=p.dot(up);x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);});return{x0,x1,y0,y1};}
  function moveRect(rect,vx,vy){rect.x0+=vx;rect.x1+=vx;rect.y0+=vy;rect.y1+=vy;}
  function layout(){
    model.updateMatrixWorld(true);assembledBounds=currentBounds();scale=assembledBounds.getSize(new THREE.Vector3()).length();
    const boxes=parts.map(p=>{const box=new THREE.Box3().setFromObject(p.object);if(/上剪|下剪|上钳|下钳/.test(p.partName))box.expandByScalar(p.nativeBounds.getSize(new THREE.Vector3()).length()*.23);else if(/^推杆/.test(p.partName))box.expandByScalar(.007);return box;}),rects=boxes.map(projectBounds),shifts=parts.map(()=>new THREE.Vector2()),gap=scale*.018;
    const center=assembledBounds.getCenter(new THREE.Vector3());
    rects.forEach((r,i)=>{const c=boxes[i].getCenter(new THREE.Vector3()).sub(center);let v=new THREE.Vector2(c.dot(right),c.dot(up));if(v.length()<scale*.02)v.set(Math.cos(i*2.4),Math.sin(i*2.4));v.normalize().multiplyScalar(scale*.13);if(parts[i].material==='carbon')v.set(0,0);shifts[i].copy(v);moveRect(r,v.x,v.y);});
    let unresolved=0;
    for(let pass=0;pass<240;pass++){
      unresolved=0;
      for(let i=0;i<rects.length;i++)for(let j=i+1;j<rects.length;j++){
        const a=rects[i],b=rects[j],px=Math.min(a.x1,b.x1)-Math.max(a.x0,b.x0)+gap,py=Math.min(a.y1,b.y1)-Math.max(a.y0,b.y0)+gap;
        if(px<=gap*.01||py<=gap*.01)continue;unresolved++;
        const axis=px<py?'x':'y',amount=(axis==='x'?px:py)*1.01;
        const ac=axis==='x'?(a.x0+a.x1):(a.y0+a.y1),bc=axis==='x'?(b.x0+b.x1):(b.y0+b.y1),sign=bc===ac?(i%2?1:-1):Math.sign(bc-ac);
        const ai=parts[i].material==='carbon'?0:1,bi=parts[j].material==='carbon'?0:1,total=ai+bi||2;
        const vi=-sign*amount*(ai||(!bi?1:0))/total,vj=sign*amount*(bi||(!ai?1:0))/total;
        shifts[i][axis]+=vi;shifts[j][axis]+=vj;moveRect(a,axis==='x'?vi:0,axis==='y'?vi:0);moveRect(b,axis==='x'?vj:0,axis==='y'?vj:0);
      }
      if(!unresolved)break;
    }
    if(unresolved){
      // Guaranteed non-overlapping shelf layout if an unusually dense CAD set resists relaxation.
      const width=scale*1.8;let x=0,y=0,row=0;
      rects.forEach((r,i)=>{const w=r.x1-r.x0,h=r.y1-r.y0;if(x+w>width&&x>0){x=0;y+=row+gap;row=0;}const tx=x+w*.5,ty=y+h*.5;const original=projectBounds(boxes[i]);shifts[i].set(tx-(original.x0+original.x1)*.5,ty-(original.y0+original.y1)*.5);x+=w+gap;row=Math.max(row,h);});
    }
    expandedBounds=new THREE.Box3();
    parts.forEach((part,i)=>{const worldOffset=right.clone().multiplyScalar(shifts[i].x).addScaledVector(up,shifts[i].y);expandedBounds.union(boxes[i].clone().translate(worldOffset));const parent=part.object.parent;const origin=parent.worldToLocal(new THREE.Vector3());const endpoint=parent.worldToLocal(worldOffset.clone());part.offset.copy(endpoint.sub(origin));});
    const finalRects=boxes.map((b,i)=>{const rect=projectBounds(b);moveRect(rect,shifts[i].x,shifts[i].y);return rect;});
    let overlaps=0;for(let i=0;i<finalRects.length;i++)for(let j=i+1;j<finalRects.length;j++){const a=finalRects[i],b=finalRects[j];if(Math.min(a.x1,b.x1)-Math.max(a.x0,b.x0)>scale*.000001&&Math.min(a.y1,b.y1)-Math.max(a.y0,b.y0)>scale*.000001)overlaps++;}
    console.info('SmartTorque layout '+JSON.stringify({components:parts.length,overlapPairs:overlaps,shelfFallback:!!unresolved,assembledSize:assembledBounds.getSize(new THREE.Vector3()).toArray(),explodedSize:expandedBounds.getSize(new THREE.Vector3()).toArray()}));
  }
  function renderInfo(){
    const index=english()?0:1;
    const selection=selectedParts(),paired=selection.length>1;
    $('part-category').textContent=paired?t('Paired locking and actuation','双电磁铁 · 锁止与执行'):selected?selected.category[index]:t('Explore the assembly','探索装配结构');
    $('part-name').textContent=paired?t('Electromagnet pair','双电磁铁组件'):selected?selected.name[index]:'SmartTorque';
    $('part-description').textContent=paired?t('The two electromagnets are inspected together as part of the locking and actuation hardware. Both original CAD components are highlighted, showing their separate mounting positions and relationship to the mechanical mechanism.','两个电磁铁共同作为锁止与执行结构的一部分进行查看。点击任意一个会同时高亮两件原始 CAD 零件，展示各自安装位置及其与机械机构的连接关系。'):selected?selected.description[index]:t('Choose a head, rotate the model, or open the assembly to inspect the real CAD components.','切换接头、旋转模型或展开装配体，点击查看真实 CAD 零件及其作用。');
    $('part-counter').textContent=`${selection.length?selection.map(part=>String(parts.indexOf(part)+1).padStart(2,'0')).join(' + '):'00'} / ${String(parts.length).padStart(2,'0')}`;
    $('viewer-state').textContent=exploded?t('EXPLODED','爆炸视图'):t('ASSEMBLED','装配状态');
    $('explode-button').textContent=exploded?t('Reassemble','重新装配'):t('Explode view','展开视图');
    $('head-switcher-label').textContent=t('QUICK-CHANGE HEAD + MATCHED ADAPTER','快拆接头 + 专用打印适配件');
    const functions={scissors:['Cut suitable material · original scissor assembly and matched mounting adapter','剪切适用材料 · 装配体1原始剪切机构与配套安装件'],pliers:['Grip and manipulate components · matched printed mounting adapter','抓取与操作部件 · 配套打印安装件与电钻本体适配'],driver:['Turn compatible nuts · matched socket and quick-release adapter','旋拧兼容螺母 · 配套套筒与快拆适配件']};
    $('head-function').textContent=functions[head][index]+(showRetention?t(' · tether-ring fit visualization',' · 显示防丢失扣环适配'):'');
    const headNames={scissors:['Scissors','剪切头'],pliers:['Pliers','钳头'],driver:['Nut driver','螺母螺丝刀头']};
    document.querySelectorAll('[data-head]').forEach(button=>{button.textContent=headNames[button.dataset.head][index];button.setAttribute('aria-pressed',String(button.dataset.head===head));});
    $('retention-button').textContent=t('Tether system','防丢失结构');$('retention-button').setAttribute('aria-pressed',String(showRetention));
    if(listParts!==parts||listLanguage!==index){
      $('part-list').replaceChildren(...parts.map((part,i)=>{const b=document.createElement('button');b.type='button';b.className='part-button';const n=document.createElement('span');n.textContent=String(i+1).padStart(2,'0');const label=document.createElement('strong');label.textContent=part.name[index];b.append(n,label);b.addEventListener('click',()=>{if(!exploded)setExploded(true);select(part);});return b;}));
      listParts=parts;listLanguage=index;
    }
    [...$('part-list').children].forEach((button,i)=>button.setAttribute('aria-pressed',String(selection.includes(parts[i]))));
    renderMotionUI(true);
  }
  function select(part){
    selected=part;
    selectionBoxes.forEach(box=>{box.removeFromParent();box.geometry.dispose();box.material.dispose();});
    selectionBoxes=selectedParts().map(item=>{
      // Compute dimensions once in the part's own coordinates. Parenting the
      // outline to the geometry preserves its size while the part moves or spins.
      const bounds=item.selectionBounds,size=bounds.getSize(new THREE.Vector3());
      const solid=new THREE.BoxGeometry(size.x,size.y,size.z),edges=new THREE.EdgesGeometry(solid);solid.dispose();
      const box=new THREE.LineSegments(edges,new THREE.LineBasicMaterial({color:0x3bb9d0,toneMapped:false}));
      box.position.copy(bounds.getCenter(new THREE.Vector3()));box.raycast=()=>{};
      item.geometry.add(box);return box;
    });
    renderInfo();invalidate();
  }
  function setExploded(value,reset=false){if(!ready)return;mechanism.reset();exploded=value;animation={start:performance.now(),from:parts.map(p=>p.object.position.clone()),to:parts.map(p=>p.start.clone().addScaledVector(p.offset,value?1:0)),duration:matchMedia('(prefers-reduced-motion: reduce)').matches?0:900,samples:[],last:0};if(!value)select(null);frame(value?expandedBounds:assembledBounds,reset,true);renderInfo();invalidate();}
  function showHead(key){if(!ready||!heads[key])return;mechanism.reset();animation=null;selected=null;[...base,...Object.values(heads).flat(),...retention].forEach(p=>{p.object.removeFromParent();p.object.position.copy(p.start);});parts=[...base,...heads[key],...(showRetention?retention:[])];parts.forEach(p=>model.add(p.object));head=key;mechanism.setParts(parts,key);layout();select(null);if(exploded)parts.forEach(p=>p.object.position.copy(p.start).add(p.offset));frame(exploded?expandedBounds:assembledBounds,true);renderInfo();window.dispatchEvent(new CustomEvent('cad-head-change',{detail:{head:key}}));}
  function alignHeads(){
    const normalize=name=>clean(name).replace(/\s+/g,'');
    const fullMain=base;
    // All three supplied assemblies contain the tool body. Register against it,
    // retain the common electronics and respect the visibility of each working head.
    const commonName=['电钻','固定头','快拆座'].find(name=>fullMain.some(p=>normalize(p.partName)===name)&&Object.values(heads).every(group=>group.some(p=>normalize(p.partName)===name)));
    if(!commonName)throw new Error('The supplied heads have no shared mounting reference with the body.');
    const anchor=fullMain.find(p=>normalize(p.partName)===commonName);
    Object.values(heads).forEach(group=>{const source=group.find(p=>normalize(p.partName)===commonName);const registration=swMatrix(anchor.transform).multiply(swMatrix(source.transform).invert());group.forEach(p=>{p.object.applyMatrix4(registration);p.start.copy(p.object.position);});});
    const core=part=>/^(电钻|编码|Arduino|语音|LCD|齿轮舵机座|力矩盘|舵机|盖板|电磁铁|M3x6\+6)/.test(part.partName);
    base=fullMain.filter(core);
    Object.keys(heads).forEach(key=>{heads[key]=heads[key].filter(part=>part.visible!==false&&!core(part));});
    heads.driver.forEach(part=>{if(/^_+/.test(part.partName)){part.name=['Nut-driver socket component','螺母驱动套筒组件'];part.category=['Nut-driver attachment','螺母螺丝刀接头'];part.description=['An original component from the supplied nut-driver subassembly, installed through its dedicated mounting interface.','来自提供的螺母螺丝刀子装配体，通过专用安装接口与动力本体适配。'];}});
  }
  function fitRetention(){
    const body=base.find(p=>p.material==='carbon');if(!body||!retention.length)return;
    model.add(body.object);model.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(body.object),size=box.getSize(new THREE.Vector3());
    const nativeBox=new THREE.Box3();retention.forEach(p=>nativeBox.union(new THREE.Box3().setFromObject(p.object)));
    const nativeCenter=nativeBox.getCenter(new THREE.Vector3()),grip=box.getCenter(new THREE.Vector3());
    grip.y=box.min.y+size.y*.24;grip.x=box.min.x+size.x*.23;grip.z=box.max.z+.006;
    // The two supplied ring parts share a native coordinate system. Keep that
    // relationship and their original dimensions; show the pair on the near grip face.
    const worldPose=new THREE.Matrix4().makeTranslation(grip.x-nativeCenter.x,grip.y-nativeCenter.y,grip.z-nativeCenter.z);
    const localPose=model.matrixWorld.clone().invert().multiply(worldPose);
    retention.forEach(part=>{part.object.applyMatrix4(localPose);part.start.copy(part.object.position);});
  }
  function renderMotionUI(force=false){
    const now=performance.now();if(!force&&now-lastMotionUI<80)return;lastMotionUI=now;
    const degrees=Math.round(mechanism.phase*180/Math.PI);
    $('motion-play').textContent=mechanism.running?t('Pause operation','暂停演示'):t('Play operation','运行演示');$('motion-play').setAttribute('aria-pressed',String(mechanism.running));
    $('motion-reset').textContent=t('Reset motion','复位动作');$('drive-label').textContent=t('Drag to drive the gear','拖动以驱动齿轮');
    $('drive-slider').value=String(degrees);$('drive-slider').setAttribute('aria-label',t('Drive gear angle','齿轮驱动角度'));$('drive-output').textContent=`${degrees}°`;
    $('motion-state').textContent=mechanism.running?t('RUNNING','运行中'):degrees?t('MANUAL','手动驱动'):t('READY','待演示');
    const actions={scissors:['Scissor blades open and close','剪切刀片开合'],pliers:['Pliers jaws open and close','钳口开合抓取'],driver:['Socket rotates for nut driving','套筒旋转，演示螺母驱动']};
    $('motion-description').textContent=actions[head][english()?0:1]+t(' · drag a gear in the exploded view or use the slider.',' · 可直接拖动爆炸图中的齿轮，或使用滑杆。');
    $('motion-note').textContent=t('Working-principle illustration · not a load or performance simulation','工作原理示意 · 非受力或性能仿真');
  }
  $('motion-play').addEventListener('click',()=>{if(!ready)return;if(animation){animation=null;parts.forEach(p=>p.object.position.copy(p.start).addScaledVector(p.offset,exploded?1:0));frame(exploded?expandedBounds:assembledBounds);}mechanism.running?mechanism.stop():mechanism.play();renderMotionUI(true);});
  $('motion-reset').addEventListener('click',()=>{mechanism.reset();renderMotionUI(true);});
  $('drive-slider').addEventListener('input',e=>{if(animation){animation=null;parts.forEach(p=>p.object.position.copy(p.start).addScaledVector(p.offset,exploded?1:0));frame(exploded?expandedBounds:assembledBounds);}mechanism.setPhase(Number(e.target.value)*Math.PI/180);renderMotionUI(true);});
  let down,moved=false,gearDrag=null;const ray=new THREE.Raycaster();
  function hitPart(e){const r=host.getBoundingClientRect();ray.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),camera);const hit=ray.intersectObject(model,true)[0];return hit?parts.find(p=>p.object.getObjectById(hit.object.id)):null;}
  renderer.domElement.addEventListener('pointerdown',e=>{
    controls.autoRotate=false;$('rotate-button').setAttribute('aria-pressed','false');down=[e.clientX,e.clientY];moved=false;
    if(ready&&!animation&&e.button===0){const part=hitPart(e);if(mechanism.isGear(part)){mechanism.stop();select(part);controls.enabled=false;gearDrag={id:e.pointerId,x:e.clientX,y:e.clientY,phase:mechanism.phase,ratio:/舵机15齿/.test(part.partName)?-.5:1};renderer.domElement.setPointerCapture(e.pointerId);renderer.domElement.style.cursor='ew-resize';e.preventDefault();e.stopImmediatePropagation();}}
  },true);
  renderer.domElement.addEventListener('pointermove',e=>{if(down&&Math.hypot(e.clientX-down[0],e.clientY-down[1])>5)moved=true;if(gearDrag&&e.pointerId===gearDrag.id){const phase=gearDrag.phase+((e.clientX-gearDrag.x)-(e.clientY-gearDrag.y))*.022*gearDrag.ratio;mechanism.setPhase((phase%(Math.PI*4)+Math.PI*4)%(Math.PI*4));renderMotionUI(true);e.preventDefault();}});
  function finishDrag(){if(gearDrag){gearDrag=null;controls.enabled=true;renderer.domElement.style.cursor='';down=null;invalidate();return true;}return false;}
  renderer.domElement.addEventListener('pointercancel',finishDrag);
  renderer.domElement.addEventListener('lostpointercapture',finishDrag);
  renderer.domElement.addEventListener('pointerup',e=>{if(finishDrag())return;down=null;if(!ready||moved||e.button!==0)return;const part=hitPart(e);if(!part)return;if(!exploded){setExploded(true);return;}select(part);});
  $('explode-button').addEventListener('click',()=>setExploded(!exploded));
  $('reset-button').addEventListener('click',()=>{controls.autoRotate=false;$('rotate-button').setAttribute('aria-pressed','false');setExploded(false,true);});
  $('rotate-button').addEventListener('click',()=>{controls.autoRotate=!controls.autoRotate;$('rotate-button').setAttribute('aria-pressed',String(controls.autoRotate));invalidate();});
  document.querySelectorAll('[data-head]').forEach(b=>{b.disabled=true;b.addEventListener('click',()=>showHead(b.dataset.head));});
  $('retention-button').disabled=true;$('retention-button').addEventListener('click',()=>{showRetention=!showRetention;showHead(head);});
  window.addEventListener('site-language-change',renderInfo);
  window.addEventListener('site-theme-change',()=>{renderer.toneMappingExposure=document.documentElement.dataset.theme==='light'?.94:1.05;invalidate();});
  window.addEventListener('attachment-choice',e=>showHead(e.detail.head));
  document.querySelectorAll('[data-show-retention]').forEach(button=>button.addEventListener('click',()=>{showRetention=true;showHead(head);setExploded(true);select(retention[0]);}));
  function render(now){
    renderPending=false;
    const active=animation;
    if(active){
      if(active.last)active.samples.push(now-active.last);active.last=now;
      const progress=active.duration?Math.min(1,(now-active.start)/active.duration):1;
      const eased=progress*progress*progress*(progress*(progress*6-15)+10);
      parts.forEach((part,i)=>part.object.position.lerpVectors(active.from[i],active.to[i],eased));
      if(active.cameraTo){camera.position.lerpVectors(active.cameraFrom,active.cameraTo,eased);controls.target.lerpVectors(active.targetFrom,active.targetTo,eased);camera.lookAt(controls.target);}
      // Selected outlines inherit the animated CAD transforms.
      dirty=true;
      if(progress===1){
        const sorted=active.samples.sort((a,b)=>a-b);
        console.info('SmartTorque transition '+JSON.stringify({frames:sorted.length,p95FrameMs:sorted[Math.floor(sorted.length*.95)]||0,cameraSynchronized:!!active.cameraTo}));
        animation=null;
      }
    }
    // Camera framing owns the camera only during its transition. Orbit controls
    // resume immediately after a drag or at the final animation frame.
    const controlsChanged=(!active?.cameraTo||!animation)?controls.update():false;
    const moving=mechanism.step(now);
    if(motionDirty){motionDirty=false;renderMotionUI();dirty=true;}
    if(dirty||controlsChanged||controls.autoRotate){renderer.render(scene,camera);dirty=false;}
    if(animation||controls.autoRotate||controlsChanged||moving)invalidate();
  }
  resize();invalidate();
  (async()=>{manifest=await fetch('/assets/cad/manifest.json').then(r=>{if(!r.ok)throw new Error('CAD manifest unavailable');return r.json();});base=await Promise.all(manifest.main.map(loadPart));heads.scissors=base;heads.pliers=await Promise.all(manifest.pliers.map(loadPart));heads.driver=await Promise.all(manifest.driver.map(loadPart));retention=await Promise.all(manifest.retention.map(loadPart));alignHeads();fitRetention();ready=true;const requested=new URLSearchParams(location.search);showHead(['scissors','pliers','driver'].includes(requested.get('head'))?requested.get('head'):'scissors');const inspectionMap=new Map([['voice',/^语音/],['retention',/环扣/],['lcd',/^LCD/]]);const inspection=inspectionMap.get(requested.get('inspect'));if(inspection){const part=parts.find(p=>inspection.test(p.partName));if(part){setExploded(true);select(part);}}loading.hidden=true;document.querySelectorAll('[data-head],#retention-button,#explode-button,#reset-button,#motion-play,#motion-reset,#drive-slider').forEach(b=>b.disabled=false);window.applySiteLanguage?.();renderInfo();console.info('SmartTorque authentic CAD loaded',{core:base.length,scissors:heads.scissors.length,pliers:heads.pliers.length,driver:heads.driver.length,retention:retention.length});})().catch(error=>{console.error('SmartTorque CAD load failed',error);loading.textContent=t('The CAD model could not load. Refresh to try again.','CAD 模型载入失败，请刷新后重试。');});
}



